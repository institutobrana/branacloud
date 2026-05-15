from __future__ import annotations

import argparse
import csv
import importlib
import json
import os
import shutil
import subprocess
import sys
from datetime import datetime
from pathlib import Path
from typing import Any

from sqlalchemy import func, text


BACKEND_DIR = Path(__file__).resolve().parents[1]
PROJECT_ROOT = BACKEND_DIR.parents[0]
DOCS_DIR = PROJECT_ROOT / "docs"
BACKUP_ROOT = BACKEND_DIR / "backups"

if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

for _model_file in (BACKEND_DIR / "models").glob("*.py"):
    if _model_file.name.startswith("_"):
        continue
    importlib.import_module(f"models.{_model_file.stem}")

from database import SessionLocal  # noqa: E402
from models.anamnese import AnamnesePergunta, AnamneseQuestionario  # noqa: E402
from models.clinica import Clinica  # noqa: E402
from services.signup_service import ANAMNESE_SEEDS_OBRIGATORIOS, garantir_anamnese_padrao_clinica  # noqa: E402


SEED_NAMES = [str(seed["nome"]) for seed in ANAMNESE_SEEDS_OBRIGATORIOS]


def _norm(value: Any) -> str:
    return str(value or "").strip()


def _count_questionarios_por_nome(db, clinica_id: int) -> dict[str, int]:
    rows = (
        db.query(AnamneseQuestionario.nome, func.count(AnamneseQuestionario.id))
        .filter(AnamneseQuestionario.clinica_id == int(clinica_id))
        .group_by(AnamneseQuestionario.nome)
        .all()
    )
    return {str(nome or "").strip(): int(total or 0) for nome, total in rows}


def _count_perguntas_por_questionario_nome(db, clinica_id: int, nome: str) -> int:
    return int(
        db.query(func.count(AnamnesePergunta.id))
        .join(AnamneseQuestionario, AnamneseQuestionario.id == AnamnesePergunta.questionario_id)
        .filter(
            AnamneseQuestionario.clinica_id == int(clinica_id),
            AnamneseQuestionario.nome == str(nome or "").strip(),
        )
        .scalar()
        or 0
    )


def _build_plan(db) -> dict[str, Any]:
    clinicas = db.query(Clinica).order_by(Clinica.id.asc()).all()
    plan_clinicas: list[dict[str, Any]] = []
    totals = {
        "clinicas_total": len(clinicas),
        "questionarios_a_criar": 0,
        "perguntas_a_criar": 0,
        "principais_preservados": 0,
    }

    for clinica in clinicas:
        counts = _count_questionarios_por_nome(db, int(clinica.id))
        duplicates = [
            name
            for name in SEED_NAMES
            if counts.get(name, 0) > 1
        ]
        if duplicates:
            raise RuntimeError(f"Duplicidade de seed na clinica {int(clinica.id)}: {duplicates}")

        presentes = [name for name in SEED_NAMES if counts.get(name, 0) > 0]
        ausentes = [name for name in SEED_NAMES if counts.get(name, 0) <= 0]
        seeds_a_criar = [seed for seed in ANAMNESE_SEEDS_OBRIGATORIOS if seed["nome"] in ausentes]
        perguntas_a_criar = sum(len(seed.get("perguntas") or []) for seed in seeds_a_criar)

        if counts.get("Principal", 0) > 0:
            totals["principais_preservados"] += 1

        totals["questionarios_a_criar"] += len(seeds_a_criar)
        totals["perguntas_a_criar"] += perguntas_a_criar

        plan_clinicas.append(
            {
                "clinica_id": int(clinica.id),
                "nome_clinica": _norm(clinica.nome),
                "questionarios_presentes": presentes,
                "questionarios_ausentes": ausentes,
                "questionarios_a_criar": [
                    {
                        "nome": str(seed["nome"]),
                        "ordem": int(seed.get("ordem") or 0),
                        "perguntas": len(seed.get("perguntas") or []),
                    }
                    for seed in seeds_a_criar
                ],
                "perguntas_a_criar": perguntas_a_criar,
                "observacoes": "",
            }
        )

    return {
        "gerado_em": datetime.now().isoformat(timespec="seconds"),
        "seed_names": SEED_NAMES,
        "seed_questionarios_oficiais": len(ANAMNESE_SEEDS_OBRIGATORIOS),
        "seed_perguntas_oficiais": sum(len(seed.get("perguntas") or []) for seed in ANAMNESE_SEEDS_OBRIGATORIOS),
        "totais": totals,
        "clinicas": plan_clinicas,
    }


def _write_csv(path: Path, rows: list[dict[str, Any]], fieldnames: list[str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames, extrasaction="ignore")
        writer.writeheader()
        for row in rows:
            writer.writerow({k: row.get(k, "") for k in fieldnames})


def _backup_table_to_csv(db, table_name: str, path: Path) -> int:
    result = db.execute(text(f"SELECT * FROM {table_name} ORDER BY id"))
    rows = [dict(row) for row in result.mappings().all()]
    fieldnames = list(rows[0].keys()) if rows else [str(col) for col in result.keys()]
    _write_csv(path, rows, fieldnames)
    return len(rows)


def _create_backup_before_execute(db) -> Path:
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_dir = BACKUP_ROOT / f"anamnese_seed_backfill_{timestamp}"
    backup_dir.mkdir(parents=True, exist_ok=True)

    counts = {}
    counts["anamnese_questionarios"] = _backup_table_to_csv(
        db,
        "anamnese_questionarios",
        backup_dir / "anamnese_questionarios_before_seed_backfill.csv",
    )
    counts["anamnese_perguntas"] = _backup_table_to_csv(
        db,
        "anamnese_perguntas",
        backup_dir / "anamnese_perguntas_before_seed_backfill.csv",
    )
    counts["anamnese_respostas"] = _backup_table_to_csv(
        db,
        "anamnese_respostas",
        backup_dir / "anamnese_respostas_before_seed_backfill.csv",
    )

    db_url = os.getenv("DATABASE_URL", "")
    pg_dump_path = shutil.which("pg_dump")
    dump_status = "pg_dump_nao_disponivel"
    if pg_dump_path and db_url:
        dump_path = backup_dir / "full_backup_before_seed_backfill.sql"
        try:
            # Usamos a URL apenas para executar o dump local; o segredo nao vai para o relatorio.
            env = os.environ.copy()
            if "@" in db_url and "://" in db_url:
                try:
                    from sqlalchemy.engine import make_url

                    url = make_url(db_url)
                    env["PGPASSWORD"] = url.password or ""
                    cmd = [
                        pg_dump_path,
                        "-h",
                        url.host or "localhost",
                        "-p",
                        str(url.port or 5432),
                        "-U",
                        url.username or "postgres",
                        "-d",
                        url.database or "",
                        "-f",
                        str(dump_path),
                    ]
                    subprocess.run(cmd, check=True, env=env, capture_output=True, text=True)
                    dump_status = "pg_dump_ok"
                except Exception as exc:  # pragma: no cover - melhor registrar do que travar
                    dump_status = f"pg_dump_falhou:{type(exc).__name__}"
        except Exception:
            dump_status = "pg_dump_falhou"

    validation = [
        f"backup_dir={backup_dir}",
        f"questionarios_rows={counts['anamnese_questionarios']}",
        f"perguntas_rows={counts['anamnese_perguntas']}",
        f"respostas_rows={counts['anamnese_respostas']}",
        f"dump_status={dump_status}",
        "escopo=CSV_only_permitido",
    ]
    (backup_dir / "anamnese_seed_backfill_validation_before.txt").write_text("\n".join(validation) + "\n", encoding="utf-8")
    return backup_dir


def _ensure_no_duplicate_seeds(db, clinica_id: int) -> None:
    counts = _count_questionarios_por_nome(db, clinica_id)
    duplicates = [name for name in SEED_NAMES if counts.get(name, 0) > 1]
    if duplicates:
        raise RuntimeError(f"Duplicidade de seed na clinica {clinica_id}: {duplicates}")


def _validate_no_extra_written(db, plan: dict[str, Any]) -> None:
    for clinica in plan["clinicas"]:
        counts = _count_questionarios_por_nome(db, int(clinica["clinica_id"]))
        for nome in SEED_NAMES:
            if nome in clinica["questionarios_ausentes"] and counts.get(nome, 0) <= 0:
                raise RuntimeError(f"Seed ausente nao foi criado: clinica={clinica['clinica_id']} nome={nome}")


def _write_audit_matrix(db, output_path: Path) -> None:
    rows = []
    for clinica in db.query(Clinica).order_by(Clinica.id.asc()).all():
        counts = _count_questionarios_por_nome(db, int(clinica.id))
        rows.append(
            {
                "clinica_id": int(clinica.id),
                "nome_clinica": _norm(clinica.nome),
                "tem_principal": "sim" if counts.get("Principal", 0) > 0 else "nao",
                "tem_implante": "sim" if counts.get("Implante", 0) > 0 else "nao",
                "tem_ficha_complementar": "sim" if counts.get("Ficha complementar", 0) > 0 else "nao",
                "observacoes": "",
            }
        )
    _write_csv(
        output_path,
        rows,
        ["clinica_id", "nome_clinica", "tem_principal", "tem_implante", "tem_ficha_complementar", "observacoes"],
    )


def _write_plan_files(plan: dict[str, Any]) -> None:
    DOCS_DIR.mkdir(parents=True, exist_ok=True)
    plan_json_path = DOCS_DIR / "anamnese_seed_obrigatorio_plano_por_clinica.json"
    result_txt_path = DOCS_DIR / "anamnese_seed_obrigatorio_dry_run_resultado.txt"
    plan_json_path.write_text(json.dumps(plan, ensure_ascii=False, indent=2), encoding="utf-8")
    result_lines = [
        "DRY_RUN_SEED_OBRIGATORIO_BACKFILL_OK",
        f"clinicas_total={plan['totais']['clinicas_total']}",
        f"questionarios_a_criar={plan['totais']['questionarios_a_criar']}",
        f"perguntas_a_criar={plan['totais']['perguntas_a_criar']}",
        f"principais_preservados={plan['totais']['principais_preservados']}",
        f"seed_names={', '.join(plan['seed_names'])}",
    ]
    result_txt_path.write_text("\n".join(result_lines) + "\n", encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description="Backfill transacional do seed obrigatorio de Anamnese.")
    parser.add_argument("--execute", action="store_true", help="Executa escrita real em transacao.")
    args = parser.parse_args()

    db = SessionLocal()
    try:
        plan = _build_plan(db)
        _write_plan_files(plan)

        if not args.execute:
            print("BACKFILL_DRY_RUN_OK")
            print(json.dumps(plan["totais"], ensure_ascii=False))
            return 0

        backup_dir = _create_backup_before_execute(db)
        print(f"BACKUP_CREATED={backup_dir}")

        for clinica in plan["clinicas"]:
            _ensure_no_duplicate_seeds(db, int(clinica["clinica_id"]))

        before_counts = {
            int(clinica["clinica_id"]): _count_questionarios_por_nome(db, int(clinica["clinica_id"]))
            for clinica in plan["clinicas"]
        }
        before_pergunta_counts = {
            int(clinica["clinica_id"]): {
                nome: _count_perguntas_por_questionario_nome(db, int(clinica["clinica_id"]), nome)
                for nome in SEED_NAMES
                if before_counts[int(clinica["clinica_id"])].get(nome, 0) > 0
            }
            for clinica in plan["clinicas"]
        }

        try:
            for clinica in plan["clinicas"]:
                clinica_id = int(clinica["clinica_id"])
                garantir_anamnese_padrao_clinica(db, clinica_id)

            db.flush()
            _validate_no_extra_written(db, plan)

            after_counts = {
                int(clinica["clinica_id"]): _count_questionarios_por_nome(db, int(clinica["clinica_id"]))
                for clinica in plan["clinicas"]
            }
            after_pergunta_counts = {
                int(clinica["clinica_id"]): {
                    nome: _count_perguntas_por_questionario_nome(db, int(clinica["clinica_id"]), nome)
                    for nome in SEED_NAMES
                    if before_counts[int(clinica["clinica_id"])].get(nome, 0) > 0
                }
                for clinica in plan["clinicas"]
            }

            inserted_questionarios = 0
            inserted_perguntas = 0
            for clinica in plan["clinicas"]:
                cid = int(clinica["clinica_id"])
                before = before_counts[cid]
                after = after_counts[cid]
                for nome in SEED_NAMES:
                    if before.get(nome, 0) <= 0 and after.get(nome, 0) > 0:
                        inserted_questionarios += 1
                        inserted_perguntas += next(
                            (
                                len(seed.get("perguntas") or [])
                                for seed in ANAMNESE_SEEDS_OBRIGATORIOS
                                if seed["nome"] == nome
                            ),
                            0,
                        )

            for cid, before_map in before_pergunta_counts.items():
                after_map = after_pergunta_counts.get(cid, {})
                for nome, before_total in before_map.items():
                    after_total = after_map.get(nome, before_total)
                    if after_total != before_total:
                        raise RuntimeError(
                            f"Quantidade de perguntas alterada indevidamente: clinica={cid} nome={nome} before={before_total} after={after_total}"
                        )

            db.commit()
            _write_audit_matrix(db, DOCS_DIR / "anamnese_seed_auditoria_clinicas_pos_backfill.csv")
            print("BACKFILL_EXECUTED_OK")
            print(f"questionarios_inseridos={inserted_questionarios}")
            print(f"perguntas_inseridas={inserted_perguntas}")
            print(f"backup_dir={backup_dir}")
            return 0
        except Exception:
            db.rollback()
            raise
    finally:
        db.close()


if __name__ == "__main__":
    raise SystemExit(main())
