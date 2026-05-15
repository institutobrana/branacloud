from __future__ import annotations

import csv
import importlib
import json
import sys
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Any

from sqlalchemy import func

BACKEND_DIR = Path(__file__).resolve().parents[1]
PROJECT_ROOT = BACKEND_DIR.parents[0]
DOCS_DIR = PROJECT_ROOT / "docs"

if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

for _model_file in (BACKEND_DIR / "models").glob("*.py"):
    if _model_file.name.startswith("_"):
        continue
    importlib.import_module(f"models.{_model_file.stem}")

from database import SessionLocal  # noqa: E402
from models.anamnese import AnamnesePergunta, AnamneseQuestionario  # noqa: E402
from models.clinica import Clinica  # noqa: E402
from models.usuario import Usuario  # noqa: E402


SOURCE_CLINICA_ID = 1
SEED_NAMES = ["Principal", "Implante", "Ficha complementar"]


def _norm(value: Any) -> str:
    return str(value or "").strip()


def _to_dict_rows_questionarios(items: list[Any]) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    for item in items:
        rows.append(
            {
                "fonte": "clinica_1_pos_importacao",
                "tabela_origem": "anamnese_questionarios",
                "id_origem": int(item.id),
                "nome": _norm(item.nome),
                "clinica_id_origem": int(item.clinica_id),
                "ordem": int(item.ordem or 0),
                "ativo": "true" if bool(item.ativo) else "false",
                "created_at": str(getattr(item, "criado_em", "") or ""),
                "updated_at": str(getattr(item, "atualizado_em", "") or ""),
                "observacoes": (
                    "Fonte operacional da clínica 1; Principal é a versão atual validada "
                    "com 17 perguntas. A alternativa EDS70 com 35 perguntas permanece em análise."
                    if _norm(item.nome) == "Principal"
                    else "Fonte operacional validada da clínica 1."
                ),
            }
        )
    return rows


def _to_dict_rows_perguntas(questionario_nome: str, questionario_id: int, items: list[Any]) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    for item in items:
        rows.append(
            {
                "fonte": "clinica_1_pos_importacao",
                "tabela_origem": "anamnese_perguntas",
                "id_origem": int(item.id),
                "questionario_id_origem": int(questionario_id),
                "questionario_nome": questionario_nome,
                "ordem": int(item.numero or 0),
                "texto": _norm(item.texto),
                "tipo_pergunta": int(getattr(item, "tipo_pergunta", 1) or 1),
                "tipo_resposta": int(getattr(item, "tipo_resposta", 1) or 1),
                "obrigatoria": "",
                "opcoes": "",
                "ativo": "true" if bool(item.ativo) else "false",
                "created_at": str(getattr(item, "criado_em", "") or ""),
                "updated_at": str(getattr(item, "atualizado_em", "") or ""),
                "observacoes": "Pergunta candidata do seed operacional da clínica 1.",
            }
        )
    return rows


def _write_csv(path: Path, rows: list[dict[str, Any]], fieldnames: list[str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames, extrasaction="ignore")
        writer.writeheader()
        for row in rows:
            writer.writerow({k: row.get(k, "") for k in fieldnames})


def _load_source_seed_data(db) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    questionarios = (
        db.query(AnamneseQuestionario)
        .filter(
            AnamneseQuestionario.clinica_id == int(SOURCE_CLINICA_ID),
            AnamneseQuestionario.nome.in_(SEED_NAMES),
        )
        .order_by(AnamneseQuestionario.ordem.asc(), AnamneseQuestionario.nome.asc(), AnamneseQuestionario.id.asc())
        .all()
    )

    found_names = [_norm(item.nome) for item in questionarios]
    missing = [name for name in SEED_NAMES if name not in found_names]
    if missing:
        raise RuntimeError(f"Seed candidata incompleta na clinica {SOURCE_CLINICA_ID}: faltam {missing}")

    duplicates = [name for name in SEED_NAMES if found_names.count(name) > 1]
    if duplicates:
        raise RuntimeError(f"Seed candidata duplicada na clinica {SOURCE_CLINICA_ID}: {duplicates}")

    q_rows = _to_dict_rows_questionarios(questionarios)
    p_rows: list[dict[str, Any]] = []
    for questionario in questionarios:
        perguntas = (
            db.query(AnamnesePergunta)
            .filter(AnamnesePergunta.questionario_id == int(questionario.id))
            .order_by(AnamnesePergunta.numero.asc(), AnamnesePergunta.id.asc())
            .all()
        )
        numeros = [int(item.numero or 0) for item in perguntas]
        if len(numeros) != len(set(numeros)):
            raise RuntimeError(f"Numero duplicado na fonte candidata: questionario={questionario.nome}")
        if any(n <= 0 for n in numeros):
            raise RuntimeError(f"Numero invalido na fonte candidata: questionario={questionario.nome}")
        p_rows.extend(_to_dict_rows_perguntas(_norm(questionario.nome), int(questionario.id), perguntas))

    return q_rows, p_rows


def _build_clinica_matrix(db) -> list[dict[str, Any]]:
    clinicas = db.query(Clinica).order_by(Clinica.id.asc()).all()
    matrix: list[dict[str, Any]] = []
    for clinica in clinicas:
        counts = {
            row[0]: int(row[1])
            for row in (
                db.query(AnamneseQuestionario.nome, func.count(AnamneseQuestionario.id))
                .filter(AnamneseQuestionario.clinica_id == int(clinica.id))
                .group_by(AnamneseQuestionario.nome)
                .all()
            )
        }
        matrix.append(
            {
                "clinica_id": int(clinica.id),
                "nome_clinica": _norm(clinica.nome),
                "tem_principal": "sim" if counts.get("Principal", 0) > 0 else "nao",
                "tem_implante": "sim" if counts.get("Implante", 0) > 0 else "nao",
                "tem_ficha_complementar": "sim" if counts.get("Ficha complementar", 0) > 0 else "nao",
                "observacoes": "",
            }
        )
    return matrix


def _plan_for_clinica(matrix_row: dict[str, Any], seed_questionarios: list[dict[str, Any]], seed_perguntas: list[dict[str, Any]]):
    existing = {
        "Principal": matrix_row["tem_principal"] == "sim",
        "Implante": matrix_row["tem_implante"] == "sim",
        "Ficha complementar": matrix_row["tem_ficha_complementar"] == "sim",
    }
    to_create_q = [row for row in seed_questionarios if not existing.get(row["nome"], False)]
    to_create_p = [row for row in seed_perguntas if row["questionario_nome"] in {item["nome"] for item in to_create_q}]
    return {
        "clinica_id": int(matrix_row["clinica_id"]),
        "nome_clinica": matrix_row["nome_clinica"],
        "questionarios_presentes": [name for name, ok in existing.items() if ok],
        "questionarios_ausentes": [name for name, ok in existing.items() if not ok],
        "questionarios_a_criar": to_create_q,
        "perguntas_a_criar": to_create_p,
    }


def main() -> int:
    DOCS_DIR.mkdir(parents=True, exist_ok=True)

    db = SessionLocal()
    try:
        seed_questionarios, seed_perguntas = _load_source_seed_data(db)
        clinica_matrix = _build_clinica_matrix(db)

        candidate_q_path = DOCS_DIR / "anamnese_seed_candidato_questionarios.csv"
        candidate_p_path = DOCS_DIR / "anamnese_seed_candidato_perguntas.csv"
        matrix_path = DOCS_DIR / "anamnese_seed_auditoria_clinicas_existentes.csv"
        plan_json_path = DOCS_DIR / "anamnese_seed_obrigatorio_plano_por_clinica.json"
        result_txt_path = DOCS_DIR / "anamnese_seed_obrigatorio_dry_run_resultado.txt"

        _write_csv(
            candidate_q_path,
            seed_questionarios,
            [
                "fonte",
                "tabela_origem",
                "id_origem",
                "nome",
                "clinica_id_origem",
                "ordem",
                "ativo",
                "created_at",
                "updated_at",
                "observacoes",
            ],
        )
        _write_csv(
            candidate_p_path,
            seed_perguntas,
            [
                "fonte",
                "tabela_origem",
                "id_origem",
                "questionario_id_origem",
                "questionario_nome",
                "ordem",
                "texto",
                "tipo_pergunta",
                "tipo_resposta",
                "obrigatoria",
                "opcoes",
                "ativo",
                "created_at",
                "updated_at",
                "observacoes",
            ],
        )
        _write_csv(
            matrix_path,
            clinica_matrix,
            [
                "clinica_id",
                "nome_clinica",
                "tem_principal",
                "tem_implante",
                "tem_ficha_complementar",
                "observacoes",
            ],
        )

        planos = [_plan_for_clinica(row, seed_questionarios, seed_perguntas) for row in clinica_matrix]
        plano_json = {
            "gerado_em": datetime.now().isoformat(timespec="seconds"),
            "seed_names": SEED_NAMES,
            "source_clinica_id": SOURCE_CLINICA_ID,
            "clinicas_total": len(clinica_matrix),
            "seed_questionarios": len(seed_questionarios),
            "seed_perguntas": len(seed_perguntas),
            "totais": {
                "questionarios_a_criar": sum(len(item["questionarios_a_criar"]) for item in planos),
                "perguntas_a_criar": sum(len(item["perguntas_a_criar"]) for item in planos),
                "clinicas_com_principal": sum(1 for row in clinica_matrix if row["tem_principal"] == "sim"),
                "clinicas_com_implante": sum(1 for row in clinica_matrix if row["tem_implante"] == "sim"),
                "clinicas_com_ficha_complementar": sum(1 for row in clinica_matrix if row["tem_ficha_complementar"] == "sim"),
            },
            "clinicas": planos,
        }
        plan_json_path.write_text(json.dumps(plano_json, ensure_ascii=False, indent=2), encoding="utf-8")

        result_lines = [
            "DRY_RUN_SEED_OBRIGATORIO_OK",
            f"seed_names={', '.join(SEED_NAMES)}",
            f"source_clinica_id={SOURCE_CLINICA_ID}",
            f"clinicas_total={len(clinica_matrix)}",
            f"clinicas_com_principal={plano_json['totais']['clinicas_com_principal']}",
            f"clinicas_com_implante={plano_json['totais']['clinicas_com_implante']}",
            f"clinicas_com_ficha_complementar={plano_json['totais']['clinicas_com_ficha_complementar']}",
            f"questionarios_a_criar={plano_json['totais']['questionarios_a_criar']}",
            f"perguntas_a_criar={plano_json['totais']['perguntas_a_criar']}",
            "seed_oficial_principal=17_perguntas_da_clinica_1_posterior_importacao",
            "principal_35_eds70=variante_pendente_analise_separada",
            "alertas=nenhum",
            f"candidate_questionarios_csv={candidate_q_path}",
            f"candidate_perguntas_csv={candidate_p_path}",
            f"matrix_csv={matrix_path}",
            f"plan_json={plan_json_path}",
        ]
        result_txt_path.write_text("\n".join(result_lines) + "\n", encoding="utf-8")
        print("\n".join(result_lines))
        return 0
    finally:
        db.close()


if __name__ == "__main__":
    raise SystemExit(main())
