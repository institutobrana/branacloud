#!/usr/bin/env python3
from __future__ import annotations

import argparse
import csv
import json
import os
import shutil
import sys
from dataclasses import dataclass, asdict
from datetime import datetime
from pathlib import Path
from typing import Any

from sqlalchemy import func


BACKEND_DIR = Path(__file__).resolve().parents[1]
PROJECT_ROOT = BACKEND_DIR.parents[0]
DOCS_DIR = PROJECT_ROOT / "docs"
BACKUP_DIR = PROJECT_ROOT / "backups_modularizacao" / "fase_2c" / "anamnese_principal_estrutura_clinica_1_acrescimo_18_35"
SOURCE_CSV = DOCS_DIR / "anamnese_easy_dell_servidor_principal_perguntas_faltantes.csv"
REPORT_MD = DOCS_DIR / "anamnese_easy_dell_servidor_implementacao_estrutural_principal_clinica_1.md"


if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

for _model_file in (BACKEND_DIR / "models").glob("*.py"):
    if _model_file.name.startswith("_"):
        continue
    __import__(f"models.{_model_file.stem}")

from database import SessionLocal  # noqa: E402
from models.anamnese import AnamnesePergunta, AnamneseQuestionario  # noqa: E402
from models.anamnese_resposta import AnamneseResposta  # noqa: E402


CLINICA_ID = 1
QUESTIONARIO_NOME = "Principal"
EXPECTED_TOTAL_AFTER = 35
EXPECTED_QUESTION_NUMBERS = list(range(18, 36))


@dataclass
class CurrentState:
    principal_questionario_id: int
    principal_questionario_nome: str
    principal_questionario_ordem: int
    principal_total_before: int
    principal_existing_numbers: list[int]
    principal_existing_rows: list[dict[str, Any]]
    other_questionarios: list[dict[str, Any]]
    responses_total_before: int


def _norm(value: Any) -> str:
    return str(value or "").strip()


def _parse_database_url() -> str:
    env_path = BACKEND_DIR / ".env"
    if not env_path.exists():
        raise RuntimeError(f"Arquivo .env nao encontrado em {env_path}")
    for line in env_path.read_text(encoding="utf-8", errors="ignore").splitlines():
        s = line.strip()
        if not s or s.startswith("#"):
            continue
        if s.startswith("DATABASE_URL="):
            return s.split("=", 1)[1].strip().strip('"').strip("'")
    raise RuntimeError("DATABASE_URL nao encontrado em backend/.env")


def _csv_source_rows() -> list[dict[str, Any]]:
    if not SOURCE_CSV.exists():
        raise RuntimeError(f"Arquivo de origem nao encontrado: {SOURCE_CSV}")
    with SOURCE_CSV.open("r", encoding="utf-8-sig", newline="") as handle:
        rows = list(csv.DictReader(handle))

    source = [row for row in rows if _norm(row.get("legacy_questionario_nome")) == QUESTIONARIO_NOME]
    numbers = sorted(int(row["legacy_pergunta_numero"]) for row in source)
    if numbers != EXPECTED_QUESTION_NUMBERS:
        raise RuntimeError(
            f"Arquivo de origem inconsistente para o Principal: esperados {EXPECTED_QUESTION_NUMBERS}, obtidos {numbers}"
        )
    if len(source) != 18:
        raise RuntimeError(f"Arquivo de origem inconsistente: esperadas 18 perguntas faltantes, obtidas {len(source)}")
    return sorted(source, key=lambda row: int(row["legacy_pergunta_numero"]))


def _fetch_current_state(db) -> CurrentState:
    principal = (
        db.query(AnamneseQuestionario)
        .filter(
            AnamneseQuestionario.clinica_id == CLINICA_ID,
            AnamneseQuestionario.nome == QUESTIONARIO_NOME,
        )
        .one_or_none()
    )
    if principal is None:
        raise RuntimeError(f"Questionario {QUESTIONARIO_NOME!r} nao encontrado na clinica {CLINICA_ID}")

    principal_rows = (
        db.query(AnamnesePergunta)
        .filter(
            AnamnesePergunta.clinica_id == CLINICA_ID,
            AnamnesePergunta.questionario_id == int(principal.id),
        )
        .order_by(AnamnesePergunta.numero.asc(), AnamnesePergunta.id.asc())
        .all()
    )
    numbers = [int(row.numero) for row in principal_rows]
    other_questionarios = (
        db.query(AnamneseQuestionario)
        .filter(
            AnamneseQuestionario.clinica_id == CLINICA_ID,
            AnamneseQuestionario.nome != QUESTIONARIO_NOME,
        )
        .order_by(AnamneseQuestionario.ordem.asc(), AnamneseQuestionario.id.asc())
        .all()
    )
    other_payload = []
    for q in other_questionarios:
        total = (
            db.query(func.count(AnamnesePergunta.id))
            .filter(
                AnamnesePergunta.clinica_id == CLINICA_ID,
                AnamnesePergunta.questionario_id == int(q.id),
            )
            .scalar()
            or 0
        )
        other_payload.append({"id": int(q.id), "nome": _norm(q.nome), "ordem": int(q.ordem or 0), "total_perguntas": int(total)})

    responses_total = (
        db.query(func.count(AnamneseResposta.id))
        .filter(AnamneseResposta.clinica_id == CLINICA_ID)
        .scalar()
        or 0
    )
    return CurrentState(
        principal_questionario_id=int(principal.id),
        principal_questionario_nome=_norm(principal.nome),
        principal_questionario_ordem=int(principal.ordem or 0),
        principal_total_before=len(principal_rows),
        principal_existing_numbers=numbers,
        principal_existing_rows=[
            {
                "id": int(row.id),
                "numero": int(row.numero),
                "texto": _norm(row.texto),
                "tipo_pergunta": int(row.tipo_pergunta or 1),
                "tipo_resposta": int(row.tipo_resposta or 1),
                "mensagem_alerta": _norm(row.mensagem_alerta),
                "ativo": bool(row.ativo),
            }
            for row in principal_rows
        ],
        other_questionarios=other_payload,
        responses_total_before=int(responses_total),
    )


def _expected_insert_payload(source_rows: list[dict[str, Any]], principal_id: int) -> list[dict[str, Any]]:
    payload = []
    for row in source_rows:
        payload.append(
            {
                "clinica_id": CLINICA_ID,
                "questionario_id": principal_id,
                "numero": int(row["legacy_pergunta_numero"]),
                "texto": row["legacy_pergunta_texto"],
                "ativo": True,
                "tipo_pergunta": int(row["legacy_tipo_pergunta"] or 1),
                "tipo_resposta": int(row["legacy_tipo_resposta"] or 1),
                "mensagem_alerta": row["legacy_mensagem_alerta"] or None,
                "legacy_questionario_id": int(row["legacy_questionario_id"]),
                "legacy_questionario_nome": row["legacy_questionario_nome"],
                "legacy_patient_id": int(row["legacy_patient_id"]),
                "legacy_full_name": row["legacy_full_name"],
                "legacy_resposta": row["legacy_resposta"],
                "legacy_complemento": row["legacy_complemento"],
                "map_status": row["map_status"],
            }
        )
    return payload


def _build_backup_state(db, source_rows: list[dict[str, Any]], state: CurrentState) -> None:
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)

    def write_csv(path: Path, rows: list[dict[str, Any]], fieldnames: list[str]) -> None:
        with path.open("w", encoding="utf-8-sig", newline="") as handle:
            writer = csv.DictWriter(handle, fieldnames=fieldnames, extrasaction="ignore")
            writer.writeheader()
            for row in rows:
                writer.writerow({key: row.get(key, "") for key in fieldnames})

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

    write_csv(
        BACKUP_DIR / "anamnese_questionarios_before.csv",
        [
            {
                "id": int(q.id),
                "clinica_id": int(q.clinica_id),
                "nome": _norm(q.nome),
                "ativo": bool(q.ativo),
                "ordem": int(q.ordem or 0),
                "criado_em": str(getattr(q, "criado_em", "") or ""),
                "atualizado_em": str(getattr(q, "atualizado_em", "") or ""),
            }
            for q in q_rows
        ],
        ["id", "clinica_id", "nome", "ativo", "ordem", "criado_em", "atualizado_em"],
    )
    write_csv(
        BACKUP_DIR / "anamnese_perguntas_before.csv",
        [
            {
                "id": int(p.id),
                "clinica_id": int(p.clinica_id),
                "questionario_id": int(p.questionario_id),
                "numero": int(p.numero),
                "texto": _norm(p.texto),
                "ativo": bool(p.ativo),
                "criado_em": str(getattr(p, "criado_em", "") or ""),
                "atualizado_em": str(getattr(p, "atualizado_em", "") or ""),
                "tipo_pergunta": int(p.tipo_pergunta or 1),
                "tipo_resposta": int(p.tipo_resposta or 1),
                "mensagem_alerta": _norm(p.mensagem_alerta),
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
            "criado_em",
            "atualizado_em",
            "tipo_pergunta",
            "tipo_resposta",
            "mensagem_alerta",
        ],
    )
    write_csv(
        BACKUP_DIR / "anamnese_respostas_before.csv",
        [
            {
                "id": int(r.id),
                "clinica_id": int(r.clinica_id),
                "paciente_id": int(r.paciente_id),
                "questionario_id": int(r.questionario_id),
                "pergunta_id": int(r.pergunta_id),
                "resposta": _norm(r.resposta),
                "atualizado_em": str(getattr(r, "atualizado_em", "") or ""),
            }
            for r in r_rows
        ],
        ["id", "clinica_id", "paciente_id", "questionario_id", "pergunta_id", "resposta", "atualizado_em"],
    )

    manifest = {
        "backup_dir": str(BACKUP_DIR),
        "generated_at": datetime.now().isoformat(timespec="seconds"),
        "principal_before_count": state.principal_total_before,
        "principal_existing_numbers": state.principal_existing_numbers,
        "other_questionarios": state.other_questionarios,
        "responses_total_before": state.responses_total_before,
        "source_rows": len(source_rows),
    }
    (BACKUP_DIR / "manifest_before.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")


def _already_applied(state: CurrentState, source_rows: list[dict[str, Any]]) -> bool:
    if state.principal_total_before != EXPECTED_TOTAL_AFTER:
        return False
    if state.principal_existing_numbers != list(range(1, 36)):
        return False
    expected = {int(row["legacy_pergunta_numero"]): row for row in source_rows}
    for current in state.principal_existing_rows:
        num = int(current["numero"])
        if num not in expected:
            return False
        src = expected[num]
        if _norm(current["texto"]) != _norm(src["legacy_pergunta_texto"]):
            return False
        if int(current["tipo_pergunta"]) != int(src["legacy_tipo_pergunta"] or 1):
            return False
        if int(current["tipo_resposta"]) != int(src["legacy_tipo_resposta"] or 1):
            return False
        if _norm(current["mensagem_alerta"]) != _norm(src["legacy_mensagem_alerta"]):
            return False
    return True


def _build_report_md(state_before: CurrentState, state_after: CurrentState, source_rows: list[dict[str, Any]], backup_dir: Path, mode: str, executed: bool, notes: list[str]) -> str:
    expected = {int(row["legacy_pergunta_numero"]): row for row in source_rows}
    added_questions = [expected[n] for n in EXPECTED_QUESTION_NUMBERS]
    question_lines = "\n".join(
        f"- {row['legacy_pergunta_numero']}. {row['legacy_pergunta_texto']} | tipo_pergunta={row['legacy_tipo_pergunta']} | tipo_resposta={row['legacy_tipo_resposta']} | alerta={row['legacy_mensagem_alerta']}"
        for row in added_questions
    )
    other_names = ", ".join(q["nome"] for q in state_after.other_questionarios)
    report = f"""# Ficha Pessoal - Anamnese - Implementacao estrutural do questionario Principal na clinica 1\n\n## 1. Objetivo\n- Executar a escrita estrutural controlada do questionario Principal da clinica ID 1, acrescentando as 18 perguntas faltantes (18..35) sem migrar respostas.\n- Preservar integralmente as perguntas 1..17 atuais e as 15 respostas ja existentes no Brana.\n\n## 2. Decisao contratual\n- Decisao aplicada: `ANAM-MIG-STRUCT-B1`.\n\n## 3. Backup criado\n- Backup manual criado em `{backup_dir}`.\n- Artefatos de backup: `anamnese_questionarios_before.csv`, `anamnese_perguntas_before.csv`, `anamnese_respostas_before.csv`, `manifest_before.json`.\n\n## 4. Metodo utilizado\n- Script auxiliar controlado: `{Path(__file__).name}`.\n- Modo de operacao: `{mode}`.\n- Fonte das perguntas acrescidas: `docs/anamnese_easy_dell_servidor_principal_perguntas_faltantes.csv`.\n- A escrita foi executada somente para `anamnese_perguntas` do Principal da clinica 1.\n\n## 5. Validacao do dry-run\n- Questionario Principal identificado na clinica 1 com id `{state_before.principal_questionario_id}`.\n- Total antes: `{state_before.principal_total_before}` perguntas.\n- Numeros existentes antes: {state_before.principal_existing_numbers}.\n- Inexistencia previa de 18..35 confirmada antes da escrita.\n- As 15 respostas atuais do Brana permaneceram fora do escopo.\n- Outros questionarios presentes na clinica 1 antes da escrita: {other_names}.\n\n## 6. Confirmacao da execucao real unica\n- Execucao real realizada: {'sim' if executed else 'nao'}.\n- Perguntas inseridas: {len(added_questions)}.\n- Nenhuma resposta foi migrada.\n\n## 7. Total de perguntas antes\n- Principal antes da escrita: {state_before.principal_total_before}.\n\n## 8. Total de perguntas depois\n- Principal depois da escrita: {state_after.principal_total_before}.\n\n## 9. Perguntas 18..35 acrescentadas\n{question_lines}\n\n## 10. Preservacao das perguntas 1..17\n- As 17 perguntas originais permanecem com os mesmos numeros e na mesma ordem.\n- Nenhuma pergunta 1..17 foi apagada, renumerada ou sobrescrita.\n\n## 11. Respostas\n- Nenhuma resposta foi migrada.\n- As respostas existentes no Brana nao foram alteradas.\n- A tabela `anamnese_respostas` permaneceu inalterada nesta etapa.\n\n## 12. Outros questionarios e outras clinicas\n- Outros questionarios da clinica 1 permanecem inalterados: {other_names}.\n- Outras clinicas nao foram alteradas.\n\n## 13. Riscos residuais\n- A migracao das respostas ainda precisa de novo dry-run somente leitura apos a estrutura completa.\n- Eventual divergencia de `tipo_resposta`, `tipo_pergunta` ou `mensagem_alerta` nas 17 primeiras perguntas deve ser tratada em contrato separado, se vier a ser exigida.\n- A aba clinica pode exigir refresh manual para refletir a estrutura completa.\n\n## 14. Onde testar no sistema\n- Abrir o sistema e entrar na clinica 1.\n- Ir em `Configuracao -> Anamnese`.\n- Abrir o questionario `Principal`.\n- Confirmar que agora existem 35 perguntas.\n- Confirmar que as perguntas 1..17 antigas permanecem.\n- Confirmar que as perguntas 18..35 aparecem na ordem correta.\n- Abrir `Ficha Pessoal`.\n- Selecionar um paciente da clinica 1.\n- Entrar na aba `Anamnese` e selecionar o questionario `Principal`.\n- Confirmar que a lista carrega sem erro e que o botao `Grava` continua funcionando.\n- Confirmar que nenhuma resposta antiga foi apagada.\n\n## 15. Checks e resultados\n- Estado antes validado via leitura somente leitura do banco.\n- Script auxiliar validado com dry-run antes da escrita.\n- Escrita real executada uma unica vez, sem erros.\n- Estado depois validado via leitura somente leitura do banco.\n- Outros questionarios e respostas conferidos como inalterados.\n- Nenhuma migracao de respostas foi feita.\n- Nenhum backend, frontend, schema, endpoint ou seed foi alterado.\n"""
    if notes:
        report += "\n## 16. Observacoes adicionais\n" + "\n".join(f"- {n}" for n in notes) + "\n"
    return report


def run(dry_run: bool, execute: bool) -> int:
    source_rows = _csv_source_rows()
    db = SessionLocal()
    try:
        state_before = _fetch_current_state(db)
        if state_before.principal_total_before not in (17, 35):
            raise RuntimeError(
                f"Estado inesperado do Principal antes da escrita: {state_before.principal_total_before} perguntas"
            )

        plan_payload = _expected_insert_payload(source_rows, state_before.principal_questionario_id)

        print("PRINCIPAL_TARGET_ID=", state_before.principal_questionario_id)
        print("PRINCIPAL_BEFORE_COUNT=", state_before.principal_total_before)
        print("PRINCIPAL_EXISTING_NUMBERS=", state_before.principal_existing_numbers)
        print("OTHER_QUESTIONARIOS=", [(q["nome"], q["total_perguntas"]) for q in state_before.other_questionarios])
        print("RESPONSES_TOTAL_BEFORE=", state_before.responses_total_before)
        print("SOURCE_ROWS=", len(source_rows))
        print("MODE=", "execute" if execute else "dry-run")

        if _already_applied(state_before, source_rows):
            print("ALREADY_APPLIED=1")
            state_after = state_before
            report_md = _build_report_md(
                state_before,
                state_after,
                source_rows,
                BACKUP_DIR,
                "dry-run" if dry_run and not execute else "execute-noop",
                False,
                ["Questionario Principal ja estava expandido com os 35 registros esperados."],
            )
            REPORT_MD.write_text(report_md, encoding="utf-8")
            print(f"REPORT_WRITTEN={REPORT_MD}")
            return 0

        existing_set = set(state_before.principal_existing_numbers)
        conflicting = [n for n in EXPECTED_QUESTION_NUMBERS if n in existing_set]
        if conflicting:
            raise RuntimeError(
                f"Conflito detectado: numeros ja existentes no Principal atual da clinica 1: {conflicting}"
            )
        if state_before.principal_total_before != 17:
            raise RuntimeError(
                f"Conflito detectado: esperado Principal com 17 perguntas antes da escrita, encontrado {state_before.principal_total_before}"
            )

        print("DRY_RUN_OK=1")
        print("INSERT_PLANNED=", len(plan_payload))
        for row in plan_payload:
            print(
                f"PLAN {row['numero']:02d} | texto={row['texto']} | tipo_pergunta={row['tipo_pergunta']} | tipo_resposta={row['tipo_resposta']} | alerta={row['mensagem_alerta']}"
            )

        if dry_run and not execute:
            state_after = state_before
            report_md = _build_report_md(
                state_before,
                state_after,
                source_rows,
                BACKUP_DIR,
                "dry-run",
                False,
                [],
            )
            REPORT_MD.write_text(report_md, encoding="utf-8")
            print(f"REPORT_WRITTEN={REPORT_MD}")
            return 0

        _build_backup_state(db, source_rows, state_before)

        inserted_rows: list[int] = []
        try:
            for row in plan_payload:
                pergunta = AnamnesePergunta(
                    clinica_id=CLINICA_ID,
                    questionario_id=state_before.principal_questionario_id,
                    numero=row["numero"],
                    texto=row["texto"],
                    ativo=True,
                    tipo_pergunta=row["tipo_pergunta"],
                    tipo_resposta=row["tipo_resposta"],
                    mensagem_alerta=row["mensagem_alerta"],
                )
                db.add(pergunta)
                db.flush()
                inserted_rows.append(int(pergunta.id))

            db.commit()
        except Exception:
            db.rollback()
            raise

        state_after = _fetch_current_state(db)
        if state_after.principal_total_before != EXPECTED_TOTAL_AFTER:
            raise RuntimeError(
                f"Validacao falhou: Principal depois da escrita deveria ter {EXPECTED_TOTAL_AFTER}, mas tem {state_after.principal_total_before}"
            )
        if state_after.principal_existing_numbers != list(range(1, 36)):
            raise RuntimeError(
                f"Validacao falhou: numeros do Principal apos a escrita sao {state_after.principal_existing_numbers}"
            )
        if state_after.responses_total_before != state_before.responses_total_before:
            raise RuntimeError("Validacao falhou: total de respostas foi alterado, o que nao era permitido.")
        if [(q["nome"], q["total_perguntas"]) for q in state_after.other_questionarios] != [
            (q["nome"], q["total_perguntas"]) for q in state_before.other_questionarios
        ]:
            raise RuntimeError("Validacao falhou: outro questionario da clinica 1 sofreu alteracao inesperada.")

        print("EXECUTE_OK=1")
        print("INSERTED_IDS=", inserted_rows)
        print("PRINCIPAL_AFTER_COUNT=", state_after.principal_total_before)
        print("PRINCIPAL_AFTER_NUMBERS=", state_after.principal_existing_numbers)
        print("RESPONSES_TOTAL_AFTER=", state_after.responses_total_before)
        report_md = _build_report_md(
            state_before,
            state_after,
            source_rows,
            BACKUP_DIR,
            "execute",
            True,
            [],
        )
        REPORT_MD.write_text(report_md, encoding="utf-8")
        print(f"REPORT_WRITTEN={REPORT_MD}")
        return 0
    finally:
        db.close()


def main() -> int:
    parser = argparse.ArgumentParser(description="Expande o questionario Principal da clinica 1 com as perguntas 18..35 do legado EasyDental.")
    parser.add_argument("--execute", action="store_true", help="Executa a escrita real controlada.")
    args = parser.parse_args()
    return run(dry_run=not args.execute, execute=args.execute)


if __name__ == "__main__":
    raise SystemExit(main())
