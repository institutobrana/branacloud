#!/usr/bin/env python3
from __future__ import annotations

import argparse
import csv
import importlib
import json
import pkgutil
import shutil
import sys
from collections import Counter
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from sqlalchemy import func

ROOT_DIR = Path(__file__).resolve().parents[2]
BACKEND_DIR = ROOT_DIR / "backend"
DOCS_DIR = ROOT_DIR / "docs"
BACKUP_DIR = ROOT_DIR / "backups_modularizacao" / "fase_2c" / "anamnese_principal_write_assisted_runner_clinica_1"

PLAN_CSV = DOCS_DIR / "anamnese_easy_dell_servidor_principal_respostas_dry_run_pos_estrutura.csv"
PLAN_SUMMARY_JSON = DOCS_DIR / "anamnese_easy_dell_servidor_principal_respostas_dry_run_pos_estrutura_summary.json"

CLINICA_ID = 1
QUESTIONARIO_NOME = "Principal"
QUESTIONARIO_ID = 2
PACIENTE_ID = 273
PACIENTE_NOME = "Joon Yun Lee Lee"
TOTAL_ESPERADO = 35


if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

load_dotenv(BACKEND_DIR / ".env")

import models  # noqa: E402
from database import SessionLocal  # noqa: E402
from models.anamnese import AnamnesePergunta, AnamneseQuestionario  # noqa: E402
from models.anamnese_resposta import AnamneseResposta  # noqa: E402
from models.paciente import Paciente  # noqa: E402


def _import_all_models() -> None:
    for module in pkgutil.iter_modules(models.__path__):
        name = module.name
        if name.startswith("_"):
            continue
        importlib.import_module(f"models.{name}")


def _norm(value: Any) -> str:
    return str(value or "").strip()


def _read_csv_rows(path: Path) -> list[dict[str, str]]:
    if not path.exists():
        raise RuntimeError(f"Arquivo nao encontrado: {path}")
    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        return list(csv.DictReader(handle))


def _write_csv(path: Path, rows: list[dict[str, Any]], fieldnames: list[str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames, extrasaction="ignore")
        writer.writeheader()
        for row in rows:
            writer.writerow({field: row.get(field, "") for field in fieldnames})


def _read_summary_json(path: Path) -> dict[str, Any]:
    if not path.exists():
        raise RuntimeError(f"Resumo JSON nao encontrado: {path}")
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


@dataclass(slots=True)
class PlanRow:
    legacy_patient_id: int
    legacy_full_name: str
    brana_patient_id: int
    legacy_questionario_id: int
    legacy_questionario_nome: str
    legacy_pergunta_numero: int
    legacy_pergunta_texto: str
    legacy_tipo_pergunta: int
    legacy_tipo_resposta: int
    legacy_resposta: str
    legacy_complemento: str
    legacy_mensagem_alerta: str
    brana_questionario_id: int
    brana_questionario_nome: str
    brana_pergunta_id: int
    brana_pergunta_numero: int
    brana_pergunta_texto: str
    brana_tipo_pergunta: int
    brana_tipo_resposta: int
    brana_mensagem_alerta: str
    brana_resposta_existente_id: str
    classificacao: str
    situacao_proposta: str

    @property
    def resposta_legacy_semantica(self) -> str:
        codigo = _norm(self.legacy_resposta)
        if codigo == "1":
            return "sim"
        if codigo == "2":
            return "nao"
        if codigo == "3":
            # Regra de contingencia para futuras extensoes: se o legado trouxer 3,
            # o runner usa o texto complementar quando existir.
            complemento = _norm(self.legacy_complemento)
            if complemento:
                return complemento
            raise RuntimeError(
                f"legacy_resposta=3 sem texto complementar definido para a pergunta {self.legacy_pergunta_numero}."
            )
        raise RuntimeError(f"legacy_resposta inesperado: {self.legacy_resposta!r}")

    @property
    def resposta_envelope(self) -> str:
        valor = self.resposta_legacy_semantica
        if self.brana_tipo_resposta == 3:
            return valor
        return "sim" if valor.lower() == "sim" else "nao" if valor.lower() == "nao" else valor


@dataclass(slots=True)
class CurrentState:
    principal_questionario_id: int
    principal_total: int
    principal_numbers: list[int]
    principal_rows: list[dict[str, Any]]
    existing_responses: int
    patient_exists: bool
    questionarios: list[dict[str, Any]]


def _load_plan_rows() -> list[PlanRow]:
    rows = _read_csv_rows(PLAN_CSV)
    plan_rows: list[PlanRow] = []
    for row in rows:
        if _norm(row.get("legacy_questionario_nome")) != QUESTIONARIO_NOME:
            continue
        if _norm(row.get("legacy_patient_id")) != str(PACIENTE_ID):
            continue
        if _norm(row.get("brana_patient_id")) != str(PACIENTE_ID):
            continue
        if _norm(row.get("classificacao")) != "MIGRAVEL_SEM_CONFLITO":
            continue
        if _norm(row.get("situacao_proposta")) != "MIGRAR_ASSISTIDO_SEM_SOBRESCRITA":
            continue
        plan_rows.append(
            PlanRow(
                legacy_patient_id=int(row["legacy_patient_id"]),
                legacy_full_name=_norm(row["legacy_full_name"]),
                brana_patient_id=int(row["brana_patient_id"]),
                legacy_questionario_id=int(row["legacy_questionario_id"]),
                legacy_questionario_nome=_norm(row["legacy_questionario_nome"]),
                legacy_pergunta_numero=int(row["legacy_pergunta_numero"]),
                legacy_pergunta_texto=_norm(row["legacy_pergunta_texto"]),
                legacy_tipo_pergunta=int(row["legacy_tipo_pergunta"]),
                legacy_tipo_resposta=int(row["legacy_tipo_resposta"]),
                legacy_resposta=_norm(row["legacy_resposta"]),
                legacy_complemento=_norm(row["legacy_complemento"]),
                legacy_mensagem_alerta=_norm(row["legacy_mensagem_alerta"]),
                brana_questionario_id=int(row["brana_questionario_id"]),
                brana_questionario_nome=_norm(row["brana_questionario_nome"]),
                brana_pergunta_id=int(row["brana_pergunta_id"]),
                brana_pergunta_numero=int(row["brana_pergunta_numero"]),
                brana_pergunta_texto=_norm(row["brana_pergunta_texto"]),
                brana_tipo_pergunta=int(row["brana_tipo_pergunta"]),
                brana_tipo_resposta=int(row["brana_tipo_resposta"]),
                brana_mensagem_alerta=_norm(row["brana_mensagem_alerta"]),
                brana_resposta_existente_id=_norm(row["brana_resposta_existente_id"]),
                classificacao=_norm(row["classificacao"]),
                situacao_proposta=_norm(row["situacao_proposta"]),
            )
        )

    plan_rows.sort(key=lambda item: item.legacy_pergunta_numero)
    if len(plan_rows) != TOTAL_ESPERADO:
        raise RuntimeError(f"Plano inconsistente: esperadas {TOTAL_ESPERADO} linhas, obtidas {len(plan_rows)}")
    numeros = [item.legacy_pergunta_numero for item in plan_rows]
    if numeros != list(range(1, TOTAL_ESPERADO + 1)):
        raise RuntimeError(f"Plano inconsistente: numeros obtidos {numeros}")
    if any(item.brana_questionario_nome != QUESTIONARIO_NOME for item in plan_rows):
        raise RuntimeError("Plano inconsistente: questionario Brana divergente.")
    if any(item.brana_questionario_id != QUESTIONARIO_ID for item in plan_rows):
        raise RuntimeError("Plano inconsistente: questionario_id Brana divergente.")
    if any(item.brana_patient_id != PACIENTE_ID for item in plan_rows):
        raise RuntimeError("Plano inconsistente: paciente Brana divergente.")
    return plan_rows


def _fetch_current_state(db) -> CurrentState:
    patient = (
        db.query(Paciente)
        .filter(Paciente.clinica_id == CLINICA_ID, Paciente.id == PACIENTE_ID)
        .one_or_none()
    )
    if patient is None:
        raise RuntimeError(f"Paciente Brana {PACIENTE_ID} nao encontrado na clinica {CLINICA_ID}.")

    principal = (
        db.query(AnamneseQuestionario)
        .filter(
            AnamneseQuestionario.clinica_id == CLINICA_ID,
            AnamneseQuestionario.nome == QUESTIONARIO_NOME,
        )
        .one_or_none()
    )
    if principal is None:
        raise RuntimeError(f"Questionario {QUESTIONARIO_NOME!r} nao encontrado na clinica {CLINICA_ID}.")

    principal_rows = (
        db.query(AnamnesePergunta)
        .filter(
            AnamnesePergunta.clinica_id == CLINICA_ID,
            AnamnesePergunta.questionario_id == int(principal.id),
        )
        .order_by(AnamnesePergunta.numero.asc(), AnamnesePergunta.id.asc())
        .all()
    )
    questionarios = (
        db.query(AnamneseQuestionario)
        .filter(AnamneseQuestionario.clinica_id == CLINICA_ID)
        .order_by(AnamneseQuestionario.ordem.asc(), AnamneseQuestionario.id.asc())
        .all()
    )
    other_qs = [
        {
            "id": int(q.id),
            "nome": _norm(q.nome),
            "ordem": int(q.ordem or 0),
            "total_perguntas": int(
                db.query(func.count(AnamnesePergunta.id))
                .filter(
                    AnamnesePergunta.clinica_id == CLINICA_ID,
                    AnamnesePergunta.questionario_id == int(q.id),
                )
                .scalar()
                or 0
            ),
        }
        for q in questionarios
    ]
    responses_count = int(
        db.query(func.count(AnamneseResposta.id))
        .filter(
            AnamneseResposta.clinica_id == CLINICA_ID,
            AnamneseResposta.paciente_id == PACIENTE_ID,
            AnamneseResposta.questionario_id == int(principal.id),
        )
        .scalar()
        or 0
    )
    return CurrentState(
        principal_questionario_id=int(principal.id),
        principal_total=len(principal_rows),
        principal_numbers=[int(row.numero) for row in principal_rows],
        principal_rows=[
            {
                "id": int(row.id),
                "numero": int(row.numero),
                "texto": _norm(row.texto),
                "tipo_pergunta": int(getattr(row, "tipo_pergunta", 1) or 1),
                "tipo_resposta": int(getattr(row, "tipo_resposta", 1) or 1),
                "mensagem_alerta": _norm(getattr(row, "mensagem_alerta", "")),
                "ativo": bool(row.ativo),
            }
            for row in principal_rows
        ],
        existing_responses=responses_count,
        patient_exists=True,
        questionarios=other_qs,
    )


def _build_envelope(plan_row: PlanRow) -> str:
    questionario_nome = QUESTIONARIO_NOME
    resposta = plan_row.resposta_envelope
    complemento = _norm(plan_row.legacy_complemento)
    if plan_row.brana_tipo_resposta == 3 and not resposta:
        raise RuntimeError(f"Pergunta {plan_row.legacy_pergunta_numero} sem resposta textual para tipo 3.")
    if plan_row.brana_tipo_resposta != 3 and resposta not in {"sim", "nao"}:
        raise RuntimeError(
            f"Pergunta {plan_row.legacy_pergunta_numero} requer resposta sim/nao, obtido {resposta!r}."
        )
    envelope = {
        "versao": 2,
        "paciente_id": PACIENTE_ID,
        "questionario_id": QUESTIONARIO_ID,
        "questionario_nome": questionario_nome,
        "pergunta_id": int(plan_row.brana_pergunta_id),
        "pergunta_texto": plan_row.brana_pergunta_texto,
        "tipo_resposta": int(plan_row.brana_tipo_resposta),
        "resposta": resposta,
        "complemento": complemento,
    }
    return json.dumps(envelope, ensure_ascii=False, separators=(",", ":"))


def _build_backup(db, current: CurrentState, plan_rows: list[PlanRow]) -> Path:
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    shutil.copy2(Path(__file__).resolve(), BACKUP_DIR / Path(__file__).name)

    q_rows = (
        db.query(AnamneseQuestionario)
        .filter(AnamneseQuestionario.clinica_id == CLINICA_ID)
        .order_by(AnamneseQuestionario.ordem.asc(), AnamneseQuestionario.id.asc())
        .all()
    )
    p_rows = (
        db.query(AnamnesePergunta)
        .filter(AnamnesePergunta.clinica_id == CLINICA_ID)
        .order_by(AnamnesePergunta.questionario_id.asc(), AnamnesePergunta.numero.asc(), AnamnesePergunta.id.asc())
        .all()
    )
    r_rows = (
        db.query(AnamneseResposta)
        .filter(AnamneseResposta.clinica_id == CLINICA_ID)
        .order_by(AnamneseResposta.questionario_id.asc(), AnamneseResposta.pergunta_id.asc(), AnamneseResposta.id.asc())
        .all()
    )

    _write_csv(
        BACKUP_DIR / "anamnese_questionarios_before.csv",
        [
            {
                "id": int(q.id),
                "clinica_id": int(q.clinica_id),
                "nome": _norm(q.nome),
                "ativo": bool(q.ativo),
                "ordem": int(q.ordem or 0),
            }
            for q in q_rows
        ],
        ["id", "clinica_id", "nome", "ativo", "ordem"],
    )
    _write_csv(
        BACKUP_DIR / "anamnese_perguntas_before.csv",
        [
            {
                "id": int(p.id),
                "clinica_id": int(p.clinica_id),
                "questionario_id": int(p.questionario_id),
                "numero": int(p.numero),
                "texto": _norm(p.texto),
                "ativo": bool(p.ativo),
                "tipo_pergunta": int(getattr(p, "tipo_pergunta", 1) or 1),
                "tipo_resposta": int(getattr(p, "tipo_resposta", 1) or 1),
                "mensagem_alerta": _norm(getattr(p, "mensagem_alerta", "")),
            }
            for p in p_rows
        ],
        [
            "id",
            "clinica_id",
            "questionario_id",
            "numero",
            "texto",
            "ativo",
            "tipo_pergunta",
            "tipo_resposta",
            "mensagem_alerta",
        ],
    )
    _write_csv(
        BACKUP_DIR / "anamnese_respostas_before.csv",
        [
            {
                "id": int(r.id),
                "clinica_id": int(r.clinica_id),
                "paciente_id": int(r.paciente_id),
                "questionario_id": int(r.questionario_id),
                "pergunta_id": int(r.pergunta_id),
                "resposta": _norm(r.resposta),
            }
            for r in r_rows
        ],
        ["id", "clinica_id", "paciente_id", "questionario_id", "pergunta_id", "resposta"],
    )
    _write_csv(
        BACKUP_DIR / "principal_plan_before.csv",
        [
            {
                "legacy_pergunta_numero": row.legacy_pergunta_numero,
                "legacy_pergunta_texto": row.legacy_pergunta_texto,
                "legacy_resposta": row.legacy_resposta,
                "legacy_complemento": row.legacy_complemento,
                "brana_pergunta_id": row.brana_pergunta_id,
                "brana_pergunta_numero": row.brana_pergunta_numero,
                "brana_pergunta_texto": row.brana_pergunta_texto,
                "brana_tipo_resposta": row.brana_tipo_resposta,
                "classificacao": row.classificacao,
                "situacao_proposta": row.situacao_proposta,
            }
            for row in plan_rows
        ],
        [
            "legacy_pergunta_numero",
            "legacy_pergunta_texto",
            "legacy_resposta",
            "legacy_complemento",
            "brana_pergunta_id",
            "brana_pergunta_numero",
            "brana_pergunta_texto",
            "brana_tipo_resposta",
            "classificacao",
            "situacao_proposta",
        ],
    )
    manifest = {
        "created_from": Path(__file__).name,
        "clinic_id": CLINICA_ID,
        "questionario": QUESTIONARIO_NOME,
        "patient_id": PACIENTE_ID,
        "questionario_id": QUESTIONARIO_ID,
        "principal_total": current.principal_total,
        "existing_responses": current.existing_responses,
        "plan_rows": len(plan_rows),
        "current_questionarios": current.questionarios,
    }
    (BACKUP_DIR / "manifest_before.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return BACKUP_DIR


def _make_summary(plan_rows: list[PlanRow], current: CurrentState) -> dict[str, Any]:
    distribution = Counter(str(row.legacy_resposta) for row in plan_rows)
    tipo_resposta_distribution = Counter(str(row.brana_tipo_resposta) for row in plan_rows)
    return {
        "runner": Path(__file__).name,
        "mode": "dry-run",
        "clinic_id": CLINICA_ID,
        "questionario": QUESTIONARIO_NOME,
        "patient_id": PACIENTE_ID,
        "patient_name": PACIENTE_NOME,
        "plan_total": len(plan_rows),
        "principal_before": current.principal_total,
        "principal_after": current.principal_total,
        "existing_responses": current.existing_responses,
        "migravel_sem_conflito": len(plan_rows) if current.existing_responses == 0 else 0,
        "conflito_resposta_existente": current.existing_responses,
        "legacy_response_distribution": dict(distribution),
        "brana_tipo_resposta_distribution": dict(tipo_resposta_distribution),
        "backup_dir": str(BACKUP_DIR),
        "plan_csv": str(PLAN_CSV),
        "plan_summary_json": str(PLAN_SUMMARY_JSON),
    }


def _render_dry_run_text(plan_rows: list[PlanRow], current: CurrentState) -> str:
    lines = [
        "PRINCIPAL_WRITE_ASSISTED_DRY_RUN_OK",
        f"clinic_id={CLINICA_ID}",
        f"questionario={QUESTIONARIO_NOME} (id={QUESTIONARIO_ID})",
        f"patient_legacy_id={PACIENTE_ID} | patient_name={PACIENTE_NOME}",
        f"principal_questions_total={current.principal_total}",
        f"existing_responses_on_target_patient={current.existing_responses}",
        f"plan_total={len(plan_rows)}",
        f"migravel_sem_conflito={len(plan_rows) if current.existing_responses == 0 else 0}",
        f"conflicts={current.existing_responses}",
        f"legacy_codes={dict(Counter(row.legacy_resposta for row in plan_rows))}",
        f"brana_tipo_resposta_distribution={dict(Counter(str(row.brana_tipo_resposta) for row in plan_rows))}",
        f"backup_dir={BACKUP_DIR}",
        "preview_rows=",
    ]
    for row in plan_rows[:5]:
        lines.append(
            f"  - {row.legacy_pergunta_numero}: brana_pergunta_id={row.brana_pergunta_id} "
            f"legacy_resposta={row.legacy_resposta} envelope_resposta={row.resposta_envelope!r}"
        )
    if len(plan_rows) > 5:
        lines.append(f"  ... ({len(plan_rows) - 5} rows omitted)")
    lines.append("EXECUTE_DISABLED_IN_THIS_STAGE")
    return "\n".join(lines)


def _validate_before_execute(plan_rows: list[PlanRow], current: CurrentState) -> None:
    if current.principal_total != TOTAL_ESPERADO:
        raise RuntimeError(f"Principal com quantidade inesperada: {current.principal_total}")
    if current.existing_responses != 0:
        raise RuntimeError("Conflito: ja existem respostas do Principal para o paciente destino.")
    if current.principal_numbers != list(range(1, TOTAL_ESPERADO + 1)):
        raise RuntimeError(f"Principal fora de ordem ou com numeros inesperados: {current.principal_numbers}")
    if len(plan_rows) != TOTAL_ESPERADO:
        raise RuntimeError(f"Plano com total inesperado: {len(plan_rows)}")


def _execute_write(db, plan_rows: list[PlanRow]) -> list[int]:
    inserted_ids: list[int] = []
    for row in plan_rows:
        payload = _build_envelope(row)
        existente = (
            db.query(AnamneseResposta)
            .filter(
                AnamneseResposta.clinica_id == CLINICA_ID,
                AnamneseResposta.paciente_id == PACIENTE_ID,
                AnamneseResposta.questionario_id == QUESTIONARIO_ID,
                AnamneseResposta.pergunta_id == int(row.brana_pergunta_id),
            )
            .one_or_none()
        )
        if existente is not None:
            raise RuntimeError(
                f"Conflito detectado antes da escrita da pergunta {row.legacy_pergunta_numero}: "
                f"pergunta_id={row.brana_pergunta_id}"
            )
        item = AnamneseResposta(
            clinica_id=CLINICA_ID,
            paciente_id=PACIENTE_ID,
            questionario_id=QUESTIONARIO_ID,
            pergunta_id=int(row.brana_pergunta_id),
            resposta=payload,
        )
        db.add(item)
        db.flush()
        inserted_ids.append(int(item.id))
    db.commit()
    return inserted_ids


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Runner assistido da escrita do questionario Principal da clinica 1.",
    )
    parser.add_argument("--execute", action="store_true", help="Executa a escrita real; sem isso roda apenas dry-run.")
    args = parser.parse_args()

    load_dotenv(BACKEND_DIR / ".env")
    _import_all_models()

    plan_rows = _load_plan_rows()
    plan_summary = _read_summary_json(PLAN_SUMMARY_JSON)

    db = SessionLocal()
    try:
        current = _fetch_current_state(db)
        _validate_before_execute(plan_rows, current)

        if int(plan_summary.get("legacy", {}).get("responses_total", 0) or 0) != len(plan_rows):
            raise RuntimeError("Resumo dry-run inconsistente com o plano carregado.")
        if _norm(plan_summary.get("patient_match", {}).get("brana_patient_id")) not in {str(PACIENTE_ID), f"{PACIENTE_ID}.0"}:
            raise RuntimeError("Resumo dry-run inconsistente com o paciente de destino.")

        backup_path = _build_backup(db, current, plan_rows)
        summary = _make_summary(plan_rows, current)
        summary["backup_dir"] = str(backup_path)

        if not args.execute:
            print(_render_dry_run_text(plan_rows, current))
            print(json.dumps(summary, ensure_ascii=False, indent=2))
            return 0

        inserted_ids = _execute_write(db, plan_rows)
        post_count = int(
            db.query(func.count(AnamneseResposta.id))
            .filter(
                AnamneseResposta.clinica_id == CLINICA_ID,
                AnamneseResposta.paciente_id == PACIENTE_ID,
                AnamneseResposta.questionario_id == QUESTIONARIO_ID,
            )
            .scalar()
            or 0
        )
        if post_count != TOTAL_ESPERADO:
            raise RuntimeError(
                f"Validacao pos-execucao falhou: esperado {TOTAL_ESPERADO}, obtido {post_count}."
            )
        report = {
            "runner": Path(__file__).name,
            "mode": "execute",
            "inserted_ids": inserted_ids,
            "post_count": post_count,
            "backup_dir": str(backup_path),
            "summary": summary,
        }
        (backup_path / "execution_report.json").write_text(
            json.dumps(report, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        print("PRINCIPAL_WRITE_ASSISTED_EXECUTE_OK")
        print(json.dumps(report, ensure_ascii=False, indent=2))
        return 0
    finally:
        db.close()


if __name__ == "__main__":
    raise SystemExit(main())
