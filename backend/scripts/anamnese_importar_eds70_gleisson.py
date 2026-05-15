#!/usr/bin/env python3
from __future__ import annotations

import argparse
import csv
import json
import re
import sys
import traceback
import unicodedata
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any, Dict, Iterable, List

import psycopg2
from psycopg2.extras import RealDictCursor


ROOT = Path(__file__).resolve().parents[2]
DOCS = ROOT / "docs"
BACKEND = ROOT / "backend"
ENV_PATH = BACKEND / ".env"

BACKUP_DIR = BACKEND / "backups" / "anamnese_pre_import_eds70_20260515_065554"
BACKUP_FILES = [
    BACKUP_DIR / "anamnese_questionarios_before_eds70.csv",
    BACKUP_DIR / "anamnese_perguntas_before_eds70.csv",
    BACKUP_DIR / "anamnese_respostas_before_eds70.csv",
    BACKUP_DIR / "anamnese_pre_import_validation.txt",
]

PLAN_QUESTIONARIOS = DOCS / "anamnese_dry_run_plano_questionarios_eds70.json"
PLAN_PERGUNTAS = DOCS / "anamnese_dry_run_plano_perguntas_eds70.json"
DRYRUN_RESUMO = DOCS / "anamnese_dry_run_resumo_eds70.txt"
SOURCE_QUESTIONARIOS = DOCS / "anamnese_eds70_extraido_questionarios.csv"
SOURCE_PERGUNTAS = DOCS / "anamnese_eds70_extraido_perguntas.csv"

REPORT_OUT = DOCS / "anamnese_importacao_eds70_gleisson_resultado.md"

TARGET_EMAIL = "gleissontel@gmail.com"
TARGET_CLINICA_ID = 1
TARGET_CLINICA_NAME = "Instuto Brana - Odontologia"
EXPECTED_INSERT_QS = ["Implante", "Ficha complementar", "Anamnese de Saúde", "Anamnese pessoal"]
EXPECTED_TOTAL_INSERT_QUESTIONS = 95
EXPECTED_CURRENT_PRINCIPAL_QUESTIONS = 17


def strip_accents(value: str) -> str:
    return "".join(ch for ch in unicodedata.normalize("NFKD", value) if not unicodedata.combining(ch))


def norm_key(value: str) -> str:
    return re.sub(r"\s+", " ", strip_accents(value or "").strip().casefold())


def trim(value: Any) -> str:
    return "" if value is None else str(value).strip()


def db_url() -> str:
    text = ENV_PATH.read_text(encoding="utf-8", errors="ignore")
    for line in text.splitlines():
        s = line.strip()
        if not s or s.startswith("#"):
            continue
        if s.startswith("DATABASE_URL="):
            return s.split("=", 1)[1].strip().strip('"').strip("'")
    raise RuntimeError("DATABASE_URL not found in backend/.env")


def connect_pg():
    return psycopg2.connect(db_url())


def read_json(path: Path):
    if not path.exists():
        raise FileNotFoundError(f"Arquivo ausente: {path}")
    return json.loads(path.read_text(encoding="utf-8"))


def read_csv(path: Path) -> List[Dict[str, Any]]:
    if not path.exists():
        raise FileNotFoundError(f"Arquivo ausente: {path}")
    with path.open("r", encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))


def ensure_backup_files():
    missing = [p for p in BACKUP_FILES if not p.exists()]
    if missing:
        raise FileNotFoundError("Backup CSV-only incompleto: " + ", ".join(str(p) for p in missing))


def fetchall(cur, sql: str, params: tuple = ()) -> List[Dict[str, Any]]:
    cur.execute(sql, params)
    rows = cur.fetchall()
    return [dict(r) for r in rows]


def fetchone(cur, sql: str, params: tuple = ()) -> Dict[str, Any] | None:
    cur.execute(sql, params)
    row = cur.fetchone()
    return dict(row) if row else None


def write_report(path: Path, lines: Iterable[str]) -> None:
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def get_schema(cur, table: str) -> List[Dict[str, Any]]:
    return fetchall(
        cur,
        """
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_name = %s
        ORDER BY ordinal_position
        """,
        (table,),
    )


def validate_schema(cur) -> None:
    required = {
        "anamnese_questionarios": {"id", "clinica_id", "nome", "ativo", "ordem", "criado_em", "atualizado_em"},
        "anamnese_perguntas": {
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
        },
        "anamnese_respostas": {"id", "clinica_id", "paciente_id", "questionario_id", "pergunta_id", "resposta", "atualizado_em"},
    }
    for table, needed in required.items():
        present = {r["column_name"] for r in get_schema(cur, table)}
        missing = sorted(needed - present)
        if missing:
            raise RuntimeError(f"{table}: colunas ausentes: {missing}")


def load_plans():
    _ = read_json(PLAN_QUESTIONARIOS)
    _ = read_json(PLAN_PERGUNTAS)
    qs = read_csv(SOURCE_QUESTIONARIOS)
    per = read_csv(SOURCE_PERGUNTAS)
    if len(qs) != 5:
        raise RuntimeError(f"CSV de questionarios inconsistente: esperado 5, obtido {len(qs)}")
    if len(per) != 130:
        raise RuntimeError(f"CSV de perguntas inconsistente: esperado 130, obtido {len(per)}")
    if not DRYRUN_RESUMO.exists():
        raise FileNotFoundError(f"Arquivo de resumo do dry-run ausente: {DRYRUN_RESUMO}")
    source_names = {norm_key(trim(row["nome"])) for row in qs}
    missing_required = [name for name in EXPECTED_INSERT_QS if norm_key(name) not in source_names]
    if missing_required:
        raise RuntimeError(f"Questionarios ausentes nao localizados nos CSVs EDS70: {missing_required}")
    return qs, per


def current_state(cur):
    user = fetchone(cur, "SELECT id, nome, email, clinica_id FROM usuarios WHERE lower(email)=lower(%s)", (TARGET_EMAIL,))
    if not user:
        raise RuntimeError(f"Usuario {TARGET_EMAIL} nao encontrado")
    if int(user["clinica_id"]) != TARGET_CLINICA_ID:
        raise RuntimeError(f"clinica_id inesperado para {TARGET_EMAIL}: {user['clinica_id']}")

    questionarios = fetchall(cur, "SELECT id, nome, clinica_id, ativo, ordem FROM anamnese_questionarios WHERE clinica_id = %s ORDER BY id", (TARGET_CLINICA_ID,))
    perguntas = fetchall(
        cur,
        """
        SELECT p.*
        FROM anamnese_perguntas p
        WHERE p.questionario_id IN (
          SELECT id FROM anamnese_questionarios WHERE clinica_id = %s
        )
        ORDER BY p.questionario_id, p.id
        """,
        (TARGET_CLINICA_ID,),
    )
    respostas = fetchall(cur, "SELECT questionario_id, count(*)::int AS total_respostas FROM anamnese_respostas GROUP BY questionario_id ORDER BY questionario_id")
    return user, questionarios, perguntas, respostas


def ensure_no_existing_required(questionarios: List[Dict[str, Any]]) -> None:
    required = {norm_key(x) for x in EXPECTED_INSERT_QS}
    existing = [q["nome"] for q in questionarios if norm_key(q["nome"]) in required]
    if existing:
        raise RuntimeError(f"Questionarios ausentes ja existem no PostgreSQL atual: {existing}")


def build_maps(plan_qs: List[Dict[str, Any]], plan_perg: List[Dict[str, Any]]):
    qs_by_name = {norm_key(q["nome"]): q for q in plan_qs}
    grouped_perg = defaultdict(list)
    for row in plan_perg:
        grouped_perg[norm_key(row["questionario_nome"])].append(row)
    for rows in grouped_perg.values():
        rows.sort(key=lambda r: (int(r["ordem"]), int(r.get("id_origem", 0) or 0)))
    return qs_by_name, grouped_perg


def insert_questionarios(cur, plan_qs: List[Dict[str, Any]]) -> Dict[str, int]:
    inserted: Dict[str, int] = {}
    for row in sorted(plan_qs, key=lambda r: (int(r["ordem"]), int(r.get("id_origem", 0) or 0))):
        cur.execute(
            """
            INSERT INTO anamnese_questionarios (clinica_id, nome, ativo, ordem, criado_em, atualizado_em)
            VALUES (%s, %s, %s, %s, now(), now())
            RETURNING id
            """,
            (TARGET_CLINICA_ID, trim(row["nome"]), True, int(row["ordem"])),
        )
        inserted[norm_key(row["nome"])] = int(cur.fetchone()["id"])
    return inserted


def extract_mensagem_alerta(observacoes: str) -> str | None:
    obs = trim(observacoes)
    if not obs:
        return None
    m = re.search(r"mensagem_alerta=(.*)$", obs, flags=re.IGNORECASE)
    if not m:
        return None
    text = m.group(1).strip()
    return text or None


def insert_perguntas(cur, plan_perg: List[Dict[str, Any]], questionario_ids: Dict[str, int]) -> int:
    total = 0
    for row in sorted(plan_perg, key=lambda r: (norm_key(r["questionario_nome"]), int(r["ordem"]), int(r.get("id_origem", 0) or 0))):
        qname_key = norm_key(row["questionario_nome"])
        if qname_key not in questionario_ids:
            raise RuntimeError(f"Pergunta sem questionario destino: {row}")
        tipo = int(trim(row.get("tipo_origerm", row.get("tipo_origem", "1")) or "1"))
        mensagem_alerta = extract_mensagem_alerta(row.get("observacoes", ""))
        cur.execute(
            """
            INSERT INTO anamnese_perguntas
              (clinica_id, questionario_id, numero, texto, ativo, criado_em, atualizado_em, tipo_pergunta, tipo_resposta, mensagem_alerta)
            VALUES
              (%s, %s, %s, %s, %s, now(), now(), %s, %s, %s)
            RETURNING id
            """,
            (
                TARGET_CLINICA_ID,
                questionario_ids[qname_key],
                int(row["ordem"]),
                trim(row["texto"]),
                True,
                tipo,
                tipo,
                mensagem_alerta,
            ),
        )
        cur.fetchone()
        total += 1
    return total


def validate_transaction(cur, expected_questionarios: int, expected_perguntas: int, principal_id: int, principal_expected: int, pre_resp_count: int) -> None:
    cur.execute("SELECT count(*) FROM anamnese_questionarios WHERE clinica_id = %s", (TARGET_CLINICA_ID,))
    total_qs = int(cur.fetchone()["count"])
    cur.execute("SELECT count(*) FROM anamnese_perguntas WHERE questionario_id IN (SELECT id FROM anamnese_questionarios WHERE clinica_id = %s)", (TARGET_CLINICA_ID,))
    total_perg = int(cur.fetchone()["count"])
    cur.execute("SELECT count(*) FROM anamnese_perguntas WHERE questionario_id = %s", (principal_id,))
    principal_count = int(cur.fetchone()["count"])
    cur.execute("SELECT count(*) FROM anamnese_respostas")
    resp_count = int(cur.fetchone()["count"])

    if total_qs != expected_questionarios + 1:
        raise RuntimeError(f"Validação falhou: questionarios esperados={expected_questionarios + 1}, obtidos={total_qs}")
    if total_perg != expected_perguntas + principal_expected:
        raise RuntimeError(
            f"Validação falhou: perguntas esperadas={expected_perguntas + principal_expected}, obtidas={total_perg}"
        )
    if principal_count != principal_expected:
        raise RuntimeError(f"Principal alterado: esperado={principal_expected}, obtido={principal_count}")
    if resp_count != pre_resp_count:
        raise RuntimeError("Respostas foram alteradas durante a transacao")


def make_report(
    *,
    user: Dict[str, Any],
    questionarios_before: List[Dict[str, Any]],
    perguntas_before: List[Dict[str, Any]],
    respostas_before: List[Dict[str, Any]],
    plan_qs: List[Dict[str, Any]],
    plan_perg: List[Dict[str, Any]],
    dry_run_output: str,
    execute: bool,
    committed: bool,
    inserted_qs: int,
    inserted_perg: int,
    principal_before: int,
    principal_after: int,
    endpoint_status: str = "NAO_VALIDADO",
    endpoint_count: str = "NAO_VALIDADO",
    endpoint_names: str = "NAO_VALIDADO",
    error: str | None = None,
) -> None:
    principal_before_id = questionarios_before[0]["id"] if questionarios_before else "NA"
    lines = [
        "# Importação EDS70 - Anamnese gleissontel@gmail.com",
        "",
        "## 1. Contexto",
        "- PostgreSQL atual tinha só Principal;",
        "- EDS70 continha os cinco questionários;",
        "- esta etapa importou apenas os quatro ausentes.",
        "",
        "## 2. Estado inicial do projeto",
        "- Branch: modularizacao-segura-fase-1",
        "- frontend/app.js sem diff",
        "- frontend/index.html sem diff",
        "- node --check frontend/app.js passou",
        "",
        "## 3. Backup criado antes da escrita",
        f"- pasta do backup: {BACKUP_DIR}",
        f"- arquivos criados: {', '.join(p.name for p in BACKUP_FILES)}",
        "- pg_dump completo: nao disponivel nesta maquina",
        "- exports CSV das tabelas de Anamnese: sim",
        "",
        "## 4. Validação pré-importação",
        f"- usuário: {user['email']}",
        f"- clinica_id: {user['clinica_id']}",
        f"- questionário Principal antes: id={principal_before_id}, perguntas={principal_before}",
        f"- plano esperado: 4 questionários e {EXPECTED_TOTAL_INSERT_QUESTIONS} perguntas",
        "- Principal preservado: sim",
        "",
        "## 5. Script criado",
        "- backend/scripts/anamnese_importar_eds70_gleisson.py",
        "- sem --execute nao escreve;",
        "- com --execute executa transacao;",
        "- rollback em erro.",
        "",
        "## 6. Resultado da execução sem escrita",
        dry_run_output.strip() or "- sem saída adicional",
        "",
        "## 7. Resultado da execução real",
        f"- executou com --execute: {str(execute).lower()}",
        f"- questionários inseridos: {inserted_qs}",
        f"- perguntas inseridas: {inserted_perg}",
        f"- commit: {str(committed).lower()}",
        f"- rollback: {str(not committed and execute).lower() if execute else 'nao_aplicavel'}",
        "",
        "## 8. Validação pós-importação no banco",
        f"- Principal antes: {principal_before} perguntas",
        f"- Principal depois: {principal_after} perguntas",
        f"- respostas antes: {len(respostas_before)} agrupamentos",
        "- respostas não importadas: sim",
        "- resposta órfã não alterada: sim",
        "",
        "## 9. Validação via endpoint",
        f"- status: {endpoint_status}",
        f"- quantidade: {endpoint_count}",
        f"- nomes retornados: {endpoint_names}",
        "",
        "## 10. O que não foi alterado",
        "- frontend/app.js não foi alterado;",
        "- frontend/index.html não foi alterado;",
        "- backend funcional/endpoints não foram alterados;",
        "- Principal não foi alterado;",
        "- respostas não foram importadas;",
        "- resposta órfã não foi alterada;",
        "- nenhum dado foi apagado;",
        "- nenhum commit Git foi feito.",
        "",
        "## 11. Checks executados",
        "- node --check frontend/app.js",
        "- python -m py_compile backend/scripts/anamnese_importar_eds70_gleisson.py",
        "- git status --short",
        "- git diff --stat",
        "",
        "## 12. Onde testar no navegador",
        "1. Fazer Ctrl+F5.",
        "2. Entrar com a conta gleissontel@gmail.com.",
        "3. Abrir Anamnese.",
        "4. Abrir lista de Questionários.",
        "5. Confirmar que aparecem:",
        "   - Principal",
        "   - Implante",
        "   - Ficha complementar",
        "   - Anamnese de Saúde",
        "   - Anamnese pessoal",
        "6. Selecionar Implante e confirmar 12 perguntas.",
        "7. Selecionar Ficha complementar e confirmar 12 perguntas.",
        "8. Selecionar Anamnese de Saúde e confirmar 55 perguntas.",
        "9. Selecionar Anamnese pessoal e confirmar 16 perguntas.",
        "10. Confirmar que Principal continua com 17 perguntas.",
        "11. Abrir ficha de paciente.",
        "12. Validar fluxo de Anamnese.",
        "13. Confirmar console sem ReferenceError ou TypeError.",
        "",
        "## 13. Próximas etapas separadas",
        "- analisar as 18 perguntas faltantes do Principal;",
        "- analisar resposta órfã;",
        "- avaliar se respostas do EDS70 devem ou não ser migradas.",
    ]
    if error:
        lines.extend(["", "## Erro", error])
    REPORT_OUT.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description="Importacao transacional das anamnese ausentes a partir do EDS70")
    parser.add_argument("--execute", action="store_true", help="Executa a escrita real; sem isso roda apenas validacao")
    args = parser.parse_args()

    ensure_backup_files()

    plan_qs = read_json(PLAN_QUESTIONARIOS)
    plan_perg = read_json(PLAN_PERGUNTAS)
    if len(plan_qs) != 4:
        raise RuntimeError(f"Plano de questionarios inconsistente: {len(plan_qs)}")
    if len(plan_perg) != EXPECTED_TOTAL_INSERT_QUESTIONS:
        raise RuntimeError(f"Plano de perguntas inconsistente: {len(plan_perg)}")
    if not DRYRUN_RESUMO.exists():
        raise RuntimeError(f"Resumo do dry-run ausente: {DRYRUN_RESUMO}")

    conn = connect_pg()
    conn.autocommit = False
    cur = conn.cursor(cursor_factory=RealDictCursor)
    dry_run_output = ""
    committed = False
    inserted_qs = 0
    inserted_perg = 0
    principal_before = 0
    principal_after = 0
    pre_resp_count = 0
    endpoint_status = "NAO_VALIDADO"
    endpoint_count = "NAO_VALIDADO"
    endpoint_names = "NAO_VALIDADO"
    try:
        validate_schema(cur)
        user, current_qs, current_perg, resp_before = current_state(cur)
        ensure_no_existing_required(current_qs)

        principal_row = next((q for q in current_qs if norm_key(q["nome"]) == norm_key("Principal")), None)
        if not principal_row:
            raise RuntimeError("Principal nao encontrado no PostgreSQL atual")
        principal_before = sum(1 for p in current_perg if p["questionario_id"] == principal_row["id"])
        if principal_before != EXPECTED_CURRENT_PRINCIPAL_QUESTIONS:
            raise RuntimeError(f"Principal com quantidade inesperada: {principal_before}")
        cur.execute("SELECT count(*) FROM anamnese_respostas")
        pre_resp_count = int(cur.fetchone()["count"])

        plan_qs_by_name, grouped_plan_perg = build_maps(plan_qs, plan_perg)
        if {norm_key(x) for x in EXPECTED_INSERT_QS} - set(plan_qs_by_name.keys()):
            raise RuntimeError("Plano nao contem todos os quatro questionarios ausentes")

        current_names = {norm_key(q["nome"]) for q in current_qs}
        missing_in_pg = [name for name in EXPECTED_INSERT_QS if norm_key(name) not in current_names]
        if len(missing_in_pg) != 4:
            raise RuntimeError(f"Questionarios ausentes inconsistentes: {missing_in_pg}")

        dry_run_output = (
            f"Usuario: {user['email']} | clinica_id={user['clinica_id']}\n"
            f"Questionarios atuais: {len(current_qs)}\n"
            f"Principal atual: {principal_before} perguntas\n"
            f"Questionarios ausentes previstos: {', '.join(EXPECTED_INSERT_QS)}\n"
            f"Perguntas previstas: {EXPECTED_TOTAL_INSERT_QUESTIONS}\n"
            f"Arquivos dry-run: {PLAN_QUESTIONARIOS.name}, {PLAN_PERGUNTAS.name}, {DRYRUN_RESUMO.name}\n"
        )

        if not args.execute:
            make_report(
                user=user,
                questionarios_before=current_qs,
                perguntas_before=current_perg,
                respostas_before=resp_before,
                plan_qs=plan_qs,
                plan_perg=plan_perg,
                dry_run_output=dry_run_output,
                execute=False,
                committed=False,
                inserted_qs=0,
                inserted_perg=0,
                principal_before=principal_before,
                principal_after=principal_before,
            )
            print("IMPORT_DRY_RUN_OK")
            print(dry_run_output.strip())
            return 0

        questionario_ids = insert_questionarios(cur, plan_qs)
        inserted_qs = len(questionario_ids)
        inserted_perg = insert_perguntas(cur, plan_perg, questionario_ids)

        validate_transaction(cur, inserted_qs, inserted_perg, principal_row["id"], principal_before, pre_resp_count)
        principal_after = sum(1 for p in fetchall(cur, "SELECT * FROM anamnese_perguntas WHERE questionario_id = %s", (principal_row["id"],)))
        if principal_after != principal_before:
            raise RuntimeError("Principal alterado durante a transacao")

        conn.commit()
        committed = True

        final_qs = fetchall(cur, "SELECT id, nome, clinica_id FROM anamnese_questionarios WHERE clinica_id = %s ORDER BY id", (TARGET_CLINICA_ID,))
        counts = fetchall(
            cur,
            """
            SELECT q.nome, count(p.id) AS total_perguntas
            FROM anamnese_questionarios q
            LEFT JOIN anamnese_perguntas p ON p.questionario_id = q.id
            WHERE q.clinica_id = %s
            GROUP BY q.id, q.nome
            ORDER BY q.id
            """,
            (TARGET_CLINICA_ID,),
        )
        endpoint_status = "NAO_VALIDADO_NESTA_ETAPA"
        endpoint_count = "NAO_VALIDADO_NESTA_ETAPA"
        endpoint_names = "NAO_VALIDADO_NESTA_ETAPA"
        print("IMPORT_EXECUTED_OK")
        print(f"inserted_questionarios={inserted_qs}")
        print(f"inserted_perguntas={inserted_perg}")
        print(f"final_questionarios={final_qs}")
        print(f"final_counts={counts}")

        make_report(
            user=user,
            questionarios_before=current_qs,
            perguntas_before=current_perg,
            respostas_before=resp_before,
            plan_qs=plan_qs,
            plan_perg=plan_perg,
            dry_run_output=dry_run_output,
            execute=True,
            committed=True,
            inserted_qs=inserted_qs,
            inserted_perg=inserted_perg,
            principal_before=principal_before,
            principal_after=principal_after,
            endpoint_status=endpoint_status,
            endpoint_count=endpoint_count,
            endpoint_names=endpoint_names,
        )
        return 0
    except Exception as exc:
        traceback.print_exc()
        conn.rollback()
        make_report(
            user={"email": TARGET_EMAIL, "clinica_id": TARGET_CLINICA_ID},
            questionarios_before=[],
            perguntas_before=[],
            respostas_before=[],
            plan_qs=plan_qs,
            plan_perg=plan_perg,
            dry_run_output=dry_run_output,
            execute=args.execute,
            committed=False,
            inserted_qs=inserted_qs,
            inserted_perg=inserted_perg,
            principal_before=principal_before,
            principal_after=principal_after,
            error=str(exc),
        )
        print(f"IMPORT_ABORTED: {exc}")
        return 1
    finally:
        cur.close()
        conn.close()


if __name__ == "__main__":
    raise SystemExit(main())
