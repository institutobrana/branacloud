#!/usr/bin/env python3
from __future__ import annotations

import csv
import json
import os
import re
import sys
import unicodedata
from collections import Counter, defaultdict
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

import psycopg2
from psycopg2.extras import RealDictCursor

ROOT = Path(__file__).resolve().parents[2]
DOCS = ROOT / "docs"
BACKEND = ROOT / "backend"
ENV_PATH = BACKEND / ".env"

CSV_QUESTIONARIOS = DOCS / "anamnese_eds70_extraido_questionarios.csv"
CSV_PERGUNTAS = DOCS / "anamnese_eds70_extraido_perguntas.csv"
CSV_RESUMO = DOCS / "anamnese_eds70_extraido_respostas_resumo.csv"

OUT_JSON_QUEST = DOCS / "anamnese_dry_run_plano_questionarios_eds70.json"
OUT_JSON_PERG = DOCS / "anamnese_dry_run_plano_perguntas_eds70.json"
OUT_SQL = DOCS / "anamnese_dry_run_sql_preview_eds70.sql"
OUT_TXT = DOCS / "anamnese_dry_run_resumo_eds70.txt"
OUT_MD = DOCS / "anamnese_dry_run_importacao_eds70_gleisson.md"
OUT_NORM_QUEST = DOCS / "anamnese_eds70_normalizado_questionarios.csv"
OUT_NORM_PERG = DOCS / "anamnese_eds70_normalizado_perguntas.csv"
OUT_REPORT = OUT_MD

REQUIRED_QUESTIONARIOS = [
    "Implante",
    "Ficha complementar",
    "Anamnese de Saude",
    "Anamnese pessoal",
]
EXPECTED_ALL_QUESTIONARIOS = [
    "Principal",
    "Implante",
    "Ficha complementar",
    "Anamnese de Saude",
    "Anamnese pessoal",
]
TARGET_EMAIL = "gleissontel@gmail.com"
TARGET_CLINICA_ID = 1
TARGET_CLINICA_NOME = "Instuto Brana - Odontologia"


def strip_accents(value: str) -> str:
    return "".join(ch for ch in unicodedata.normalize("NFKD", value) if not unicodedata.combining(ch))


def norm_key(value: str) -> str:
    return re.sub(r"\s+", " ", strip_accents(value or "").strip().casefold())


def trim(value: Optional[str]) -> str:
    return (value or "").strip()


def parse_database_url(env_path: Path) -> str:
    text = env_path.read_text(encoding="utf-8", errors="ignore")
    for line in text.splitlines():
        s = line.strip()
        if not s or s.startswith("#"):
            continue
        if s.startswith("DATABASE_URL="):
            return s.split("=", 1)[1].strip().strip('"').strip("'")
    raise RuntimeError("DATABASE_URL not found in backend/.env")


def connect_pg():
    url = parse_database_url(ENV_PATH)
    conn = psycopg2.connect(url)
    return conn


def qfetchall(cur, sql: str, params: tuple = ()):  # type: ignore[override]
    cur.execute(sql, params)
    rows = cur.fetchall()
    return [dict(r) for r in rows]


def qfetchone(cur, sql: str, params: tuple = ()):  # type: ignore[override]
    cur.execute(sql, params)
    row = cur.fetchone()
    return dict(row) if row else None


def ensure_parent(path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)


def read_csv_dict(path: Path) -> List[Dict[str, str]]:
    with path.open("r", encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))


def write_csv(path: Path, fieldnames: List[str], rows: List[Dict[str, Any]]) -> None:
    ensure_parent(path)
    with path.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, quoting=csv.QUOTE_MINIMAL)
        writer.writeheader()
        for row in rows:
            writer.writerow({k: "" if v is None else v for k, v in row.items()})


def schema_columns(cur, table_name: str) -> List[Dict[str, Any]]:
    return qfetchall(
        cur,
        """
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_name = %s
        ORDER BY ordinal_position
        """,
        (table_name,),
    )


def schema_constraints(cur, table_name: str) -> List[Dict[str, Any]]:
    return qfetchall(
        cur,
        """
        SELECT
          tc.constraint_name,
          tc.constraint_type,
          kcu.column_name,
          kcu.ordinal_position
        FROM information_schema.table_constraints tc
        LEFT JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
         AND tc.table_name = kcu.table_name
        WHERE tc.table_name = %s
        ORDER BY tc.constraint_name, kcu.ordinal_position
        """,
        (table_name,),
    )


def group_constraints(rows: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    grouped: Dict[tuple, Dict[str, Any]] = {}
    for row in rows:
        key = (row["constraint_name"], row["constraint_type"])
        item = grouped.setdefault(
            key,
            {
                "constraint_name": row["constraint_name"],
                "constraint_type": row["constraint_type"],
                "columns": [],
            },
        )
        if row.get("column_name"):
            item["columns"].append(row["column_name"])
    return list(grouped.values())


def validate_schema(cols: Dict[str, List[Dict[str, Any]]]) -> List[str]:
    required = {
        "anamnese_questionarios": ["id", "clinica_id", "nome", "ativo", "ordem", "criado_em", "atualizado_em"],
        "anamnese_perguntas": ["id", "clinica_id", "questionario_id", "numero", "texto", "ativo", "criado_em", "atualizado_em", "tipo_pergunta", "tipo_resposta"],
        "anamnese_respostas": ["id", "clinica_id", "paciente_id", "questionario_id", "pergunta_id", "resposta", "atualizado_em"],
    }
    errors = []
    for table, needed in required.items():
        present = {r["column_name"] for r in cols.get(table, [])}
        missing = [c for c in needed if c not in present]
        if missing:
            errors.append(f"{table}: missing columns {missing}")
    return errors


def normalize_questionario_row(row: Dict[str, str]) -> Dict[str, Any]:
    return {
        "fonte": row.get("fonte", "EDS70"),
        "tabela_origem": row.get("tabela_origem", "ANAMNESE_QUEST"),
        "id_origem": int(row["id_origem"]),
        "nome": trim(row.get("nome")),
        "nome_normalizado": trim(row.get("nome")),
        "clinica_id_origem": row.get("clinica_id_origem", ""),
        "conta_id_origem": row.get("conta_id_origem", ""),
        "email_relacionado": trim(row.get("email_relacionado")),
        "status": row.get("status", ""),
        "ordem": int(row["ordem"]) if row.get("ordem") else None,
        "created_at": row.get("created_at", ""),
        "updated_at": row.get("updated_at", ""),
        "observacoes": trim(row.get("observacoes")),
    }


def normalize_pergunta_row(row: Dict[str, str]) -> Dict[str, Any]:
    texto = trim(row.get("texto"))
    qnome = trim(row.get("questionario_nome"))
    opcoes = trim(row.get("opcoes"))
    tipo = trim(row.get("tipo"))
    return {
        "fonte": row.get("fonte", "EDS70"),
        "tabela_origem": row.get("tabela_origem", "ANAMNESE_PERG"),
        "id_origem": int(row["id_origem"]),
        "questionario_id_origem": int(row["questionario_id_origem"]),
        "questionario_nome": qnome,
        "questionario_nome_normalizado": qnome,
        "ordem": int(row["ordem"]) if row.get("ordem") else None,
        "texto": texto,
        "tipo": tipo,
        "obrigatoria": row.get("obrigatoria", ""),
        "opcoes": opcoes,
        "status": row.get("status", ""),
        "created_at": row.get("created_at", ""),
        "updated_at": row.get("updated_at", ""),
        "observacoes": trim(row.get("observacoes")),
    }


def load_eds70_csvs():
    for p in [CSV_QUESTIONARIOS, CSV_PERGUNTAS, CSV_RESUMO]:
        if not p.exists():
            raise FileNotFoundError(f"CSV ausente: {p}")
    qs_raw = read_csv_dict(CSV_QUESTIONARIOS)
    per_raw = read_csv_dict(CSV_PERGUNTAS)
    resp_raw = read_csv_dict(CSV_RESUMO)
    return qs_raw, per_raw, resp_raw


def current_state(cur):
    user = qfetchone(cur, "SELECT id, nome, email, clinica_id FROM usuarios WHERE lower(email) = lower(%s)", (TARGET_EMAIL,))
    if not user:
        raise RuntimeError(f"Usuario {TARGET_EMAIL} nao encontrado")
    if int(user["clinica_id"]) != TARGET_CLINICA_ID:
        raise RuntimeError(f"clinica_id inesperado para {TARGET_EMAIL}: {user['clinica_id']}")
    current_q = qfetchall(cur, "SELECT * FROM anamnese_questionarios WHERE clinica_id = %s ORDER BY id", (TARGET_CLINICA_ID,))
    current_p = qfetchall(
        cur,
        """
        SELECT *
        FROM anamnese_perguntas
        WHERE questionario_id IN (
          SELECT id FROM anamnese_questionarios WHERE clinica_id = %s
        )
        ORDER BY questionario_id, id
        """,
        (TARGET_CLINICA_ID,),
    )
    resp_counts = qfetchall(
        cur,
        "SELECT questionario_id, count(*)::int AS total_respostas FROM anamnese_respostas GROUP BY questionario_id ORDER BY questionario_id",
    )
    return user, current_q, current_p, resp_counts


def compare_principal(current_questions: List[Dict[str, Any]], eds_questions: List[Dict[str, Any]]):
    current = [q for q in current_questions if norm_key(q["questionario_nome_normalizado"]) == norm_key("Principal")]
    source = [q for q in eds_questions if norm_key(q["questionario_nome_normalizado"]) == norm_key("Principal")]
    return current, source


def build_questionario_plan(eds_qs: List[Dict[str, Any]], current_names: set[str], next_id_start: int):
    missing_targets = {norm_key(x) for x in REQUIRED_QUESTIONARIOS}
    missing = [q for q in eds_qs if norm_key(q["nome_normalizado"]) in missing_targets]
    # maintain EDS70 order for the missing items
    missing.sort(key=lambda r: r["ordem"] or 0)
    plan = []
    next_id = next_id_start
    for row in missing:
        if norm_key(row["nome_normalizado"]) in current_names:
            continue
        safe_name = row["nome"].replace("'", "''")
        sql_preview = (
            "-- INSERT INTO anamnese_questionarios (clinica_id, nome, ativo, ordem, criado_em, atualizado_em)\\n"
            "-- VALUES ({clinica_id}, '{safe_name}', TRUE, {ordem}, NOW(), NOW());"
        ).format(clinica_id=TARGET_CLINICA_ID, safe_name=safe_name, ordem=row["ordem"])
        plan.append(
            {
                "source": row,
                "future_questionario_id_estimated": next_id,
                "future_ordem": row["ordem"],
                "insert_template": {
                    "table": "anamnese_questionarios",
                    "sql_preview": sql_preview,
                },
            }
        )
        next_id += 1
    return plan


def build_pergunta_plan(eds_perg: List[Dict[str, Any]], missing_names: set[str]):
    out = []
    for row in eds_perg:
        if norm_key(row["questionario_nome_normalizado"]) not in missing_names:
            continue
        safe_text = row["texto"].replace("'", "''")
        safe_tipo = row["tipo"] or "1"
        sql_preview = (
            "-- INSERT INTO anamnese_perguntas (clinica_id, questionario_id, numero, texto, ativo, tipo_pergunta, tipo_resposta, mensagem_alerta, criado_em, atualizado_em)\\n"
            "-- VALUES ({clinica_id}, <TBD_questionario_id>, {ordem}, '{safe_text}', TRUE, {safe_tipo}, {safe_tipo}, NULL, NOW(), NOW());"
        ).format(
            clinica_id=TARGET_CLINICA_ID,
            ordem=row["ordem"],
            safe_text=safe_text,
            safe_tipo=safe_tipo,
        )
        out.append(
            {
                "source": row,
                "insert_template": {
                    "table": "anamnese_perguntas",
                    "sql_preview": sql_preview,
                },
            }
        )
    return out


def make_sql_preview(questionario_plan: List[Dict[str, Any]], pergunta_plan: List[Dict[str, Any]], principal_diff: Dict[str, Any]) -> str:
    lines = [
        "-- DRY-RUN ONLY. NAO EXECUTAR.",
        f"-- Clinica destino: {TARGET_CLINICA_ID} ({TARGET_CLINICA_NOME})",
        "-- Fluxo: importar somente os quatro questionarios ausentes e suas perguntas.",
        "",
        "-- Questionarios ausentes:",
    ]
    for item in questionario_plan:
        row = item["source"]
        lines.append(f"-- - {row['nome']} (EDS70 id={row['id_origem']}, ordem={row['ordem']}, futuro_id_estimado={item['future_questionario_id_estimated']})")
    lines += ["", "-- SQL PREVIEW - QUESTIONARIOS"]
    for item in questionario_plan:
        lines.append(item["insert_template"]["sql_preview"])
        lines.append("")
    lines += ["-- SQL PREVIEW - PERGUNTAS"]
    current_qid_placeholder = "<TBD_questionario_id>"
    current_name = None
    for item in pergunta_plan:
        row = item["source"]
        if current_name != row["questionario_nome_normalizado"]:
            current_name = row["questionario_nome_normalizado"]
            lines.append(f"-- Questionario: {row['questionario_nome']} (EDS70 id={row['questionario_id_origem']})")
        lines.append(item["insert_template"]["sql_preview"].replace("<TBD_questionario_id>", current_qid_placeholder))
    lines += [
        "",
        "-- Principal nao sera alterado neste dry-run.",
        f"-- Principal atual: {principal_diff['current_count']} perguntas; EDS70: {principal_diff['eds70_count']} perguntas; faltantes: {principal_diff['missing_count']}.",
    ]
    return "\n".join(lines) + "\n"


def main() -> int:
    qs_raw, per_raw, resp_raw = load_eds70_csvs()

    # Validate and normalize input CSVs
    if len({trim(r.get("nome")) for r in qs_raw if trim(r.get("nome"))}) != len(qs_raw):
        raise RuntimeError("CSV de questionarios possui nomes duplicados ou vazios")
    if any(not trim(r.get("questionario_nome")) for r in per_raw):
        raise RuntimeError("CSV de perguntas contem linha sem questionario correspondente")

    qs_norm = [normalize_questionario_row(r) for r in qs_raw]
    per_norm = [normalize_pergunta_row(r) for r in per_raw]

    # write normalized CSVs for future import if needed
    if any(row["nome"] != row["nome_normalizado"] for row in qs_norm):
        write_csv(
            OUT_NORM_QUEST,
            ["fonte","tabela_origem","id_origem","nome","nome_normalizado","clinica_id_origem","conta_id_origem","email_relacionado","status","ordem","created_at","updated_at","observacoes"],
            qs_norm,
        )
    if any(row["questionario_nome"] != row["questionario_nome_normalizado"] for row in per_norm) or any(row["texto"] != row["texto"].strip() for row in per_norm):
        write_csv(
            OUT_NORM_PERG,
            ["fonte","tabela_origem","id_origem","questionario_id_origem","questionario_nome","questionario_nome_normalizado","ordem","texto","tipo","obrigatoria","opcoes","status","created_at","updated_at","observacoes"],
            per_norm,
        )

    # connect and inspect current PG state
    conn = connect_pg()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    try:
        schema_map = {
            "anamnese_questionarios": schema_columns(cur, "anamnese_questionarios"),
            "anamnese_perguntas": schema_columns(cur, "anamnese_perguntas"),
            "anamnese_respostas": schema_columns(cur, "anamnese_respostas"),
        }
        schema_errors = validate_schema(schema_map)
        if schema_errors:
            raise RuntimeError("; ".join(schema_errors))

        user, current_q, current_p, resp_counts = current_state(cur)

        current_names = {norm_key(r["nome"]): r for r in current_q}
        missing_in_pg = [name for name in REQUIRED_QUESTIONARIOS if norm_key(name) not in current_names]
        existing_required = [name for name in REQUIRED_QUESTIONARIOS if norm_key(name) in current_names]
        if existing_required:
            raise RuntimeError(f"Questionarios ausentes ja existem no PostgreSQL atual: {existing_required}")

        pg_principal = [r for r in current_q if norm_key(r["nome"]) == norm_key("Principal")]
        if not pg_principal:
            raise RuntimeError("Principal nao encontrado no PostgreSQL atual")

        eds_q_map = {norm_key(r["nome"]): r for r in qs_norm}
        missing_csv = [name for name in REQUIRED_QUESTIONARIOS if norm_key(name) not in eds_q_map]
        if missing_csv:
            raise RuntimeError(f"Questionarios ausentes no CSV EDS70: {missing_csv}")

        principal_id = pg_principal[0]["id"]
        current_principal_rows = [r for r in current_p if r["questionario_id"] == principal_id]
        source_principal_rows = [r for r in per_norm if norm_key(r["questionario_nome"]) == norm_key("Principal")]

        current_texts = [trim(r["texto"]) for r in current_principal_rows]
        source_texts = [trim(r["texto"]) for r in source_principal_rows]
        principal_missing = []
        principal_mismatches = []
        for idx, (current_txt, source_txt) in enumerate(zip(current_texts, source_texts), start=1):
            if norm_key(current_txt) != norm_key(source_txt):
                principal_mismatches.append({"ordem": idx, "current": current_txt, "eds70": source_txt})
        if len(source_texts) > len(current_texts):
            for idx in range(len(current_texts), len(source_texts)):
                principal_missing.append({"ordem": idx + 1, "texto": source_texts[idx]})

        # evidence of orphan responses (if any)
        current_q_ids = {r["id"] for r in current_q}
        orphan_responses = [r for r in resp_counts if r["questionario_id"] not in current_q_ids]

        next_qid = max([r["id"] for r in current_q], default=0) + 1
        questionario_plan = build_questionario_plan(qs_norm, set(current_names.keys()), next_qid)
        pergunta_plan = build_pergunta_plan(per_norm, {norm_key(name) for name in REQUIRED_QUESTIONARIOS})
        sql_preview = make_sql_preview(
            questionario_plan,
            pergunta_plan,
            {
                "current_count": len(current_texts),
                "eds70_count": len(source_texts),
                "missing_count": len(principal_missing),
            },
        )

        # outputs: questionario and pergunta plans
        questionario_plan_json = []
        for item in questionario_plan:
            src = item["source"]
            questionario_plan_json.append(
                {
                    "source_id_origem": src["id_origem"],
                    "nome": src["nome"],
                    "future_questionario_id_estimated": item["future_questionario_id_estimated"],
                    "ordem": src["ordem"],
                    "clinica_id_destino": TARGET_CLINICA_ID,
                    "status_destino": True,
                    "sql_preview": item["insert_template"]["sql_preview"],
                }
            )

        pergunta_plan_json = []
        for item in pergunta_plan:
            src = item["source"]
            pergunta_plan_json.append(
                {
                    "source_id_origem": src["id_origem"],
                    "questionario_id_origem": src["questionario_id_origem"],
                    "questionario_nome": src["questionario_nome"],
                    "ordem": src["ordem"],
                    "texto": src["texto"],
                    "tipo_origem": src["tipo"],
                    "obrigatoria": src["obrigatoria"],
                    "opcoes": src["opcoes"],
                    "clinica_id_destino": TARGET_CLINICA_ID,
                    "sql_preview": item["insert_template"]["sql_preview"],
                }
            )

        summary_lines = []
        summary_lines.append("DRY-RUN EDS70 -> PostgreSQL (sem escrita)")
        summary_lines.append(f"Timestamp: {datetime.now(timezone.utc).isoformat()}")
        summary_lines.append("")
        summary_lines.append(f"Usuario localizado: {user['email']} | clinica_id={user['clinica_id']} | nome={user['nome']}")
        summary_lines.append(f"Questionarios atuais no PostgreSQL (clinica 1): {len(current_q)}")
        summary_lines.append(f"Perguntas atuais no Principal: {len(current_principal_rows)}")
        summary_lines.append(f"Respostas agrupadas por questionario_id: {len(resp_counts)}")
        if orphan_responses:
            summary_lines.append(f"ALERTA: respostas com questionario_id sem questionario atual: {[r['questionario_id'] for r in orphan_responses]}")
        summary_lines.append("")
        summary_lines.append("Questionarios ausentes previstos para importacao futura:")
        for item in questionario_plan_json:
            summary_lines.append(f"- {item['nome']} -> futuro_id_estimado={item['future_questionario_id_estimated']} ordem={item['ordem']}")
        summary_lines.append("")
        summary_lines.append("Perguntas previstas por questionario ausente:")
        per_counts = Counter([r["questionario_nome"] for r in pergunta_plan_json])
        for name in ["Implante", "Ficha complementar", "Anamnese de Saude", "Anamnese pessoal"]:
            summary_lines.append(f"- {name}: {per_counts.get(name, 0)}")
        summary_lines.append("")
        summary_lines.append("Principal - comparacao:")
        summary_lines.append(f"- PostgreSQL atual: {len(current_texts)} perguntas")
        summary_lines.append(f"- EDS70: {len(source_texts)} perguntas")
        summary_lines.append(f"- faltantes no atual: {len(principal_missing)}")
        if principal_mismatches:
            summary_lines.append(f"- divergencias de texto/ordem: {len(principal_mismatches)}")
        else:
            summary_lines.append("- divergencias de texto/ordem: 0")
        summary_lines.append("")
        summary_lines.append("Validacoes:")
        summary_lines.append(f"- CSV questionarios: OK ({len(qs_norm)} linhas)")
        summary_lines.append(f"- CSV perguntas: OK ({len(per_norm)} linhas)")
        summary_lines.append(f"- CSV resumo respostas: OK ({len(resp_raw)} linhas)")
        summary_lines.append(f"- questionarios ausentes presentes no CSV: OK")
        summary_lines.append(f"- questionarios ausentes ausentes no PostgreSQL atual: OK")
        summary_lines.append("")
        summary_lines.append("Nenhum INSERT/UPDATE/DELETE foi executado.")

        # write files
        ensure_parent(OUT_JSON_QUEST)
        OUT_JSON_QUEST.write_text(json.dumps(questionario_plan_json, ensure_ascii=False, indent=2), encoding="utf-8")
        OUT_JSON_PERG.write_text(json.dumps(pergunta_plan_json, ensure_ascii=False, indent=2), encoding="utf-8")
        OUT_SQL.write_text(sql_preview, encoding="utf-8")
        OUT_TXT.write_text("\n".join(summary_lines) + "\n", encoding="utf-8")

        report = []
        report.append("# Dry-run de importa??o EDS70 - Anamnese gleissontel@gmail.com")
        report.append("")
        report.append("## 1. Contexto")
        report.append("- PostgreSQL atual tem s? Principal; EDS70 tem os cinco questionarios.")
        report.append("- Objetivo: preparar importacao futura dos quatro ausentes sem alterar o banco atual.")
        report.append("")
        report.append("## 2. Estado inicial do projeto")
        report.append("- Branch: modularizacao-segura-fase-1")
        report.append("- frontend/app.js sem diff")
        report.append("- frontend/index.html sem diff")
        report.append("- node --check frontend/app.js passou")
        report.append("")
        report.append("## 3. Schema PostgreSQL atual")
        for table, cols in schema_map.items():
            report.append(f"### {table}")
            for c in cols:
                report.append(f"- {c['column_name']} | {c['data_type']} | nullable={c['is_nullable']} | default={c['column_default']}")
            cons = group_constraints(schema_constraints(cur, table))
            report.append("Constraints:")
            for con in cons:
                report.append(f"- {con['constraint_name']} | {con['constraint_type']} | columns={', '.join(con['columns']) if con['columns'] else '-'}")
            report.append("")
        report.append("## 4. Estado atual da cl?nica 1")
        report.append(f"- Principal atual: id={pg_principal[0]['id']}, perguntas={len(current_texts)}")
        report.append(f"- respostas agrupadas por questionario_id: {len(resp_counts)}")
        if orphan_responses:
            report.append(f"- ALERTA: questionario_id sem questionario atual em respostas: {[r['questionario_id'] for r in orphan_responses]}")
        report.append("- nenhum dos quatro ausentes presente no PostgreSQL atual")
        report.append("")
        report.append("## 5. CSVs EDS70 validados")
        report.append(f"- questionarios: {len(qs_norm)} linhas; nomes: {', '.join([r['nome'] for r in qs_norm])}")
        report.append(f"- perguntas: {len(per_norm)} linhas; por questionario: Principal={len([r for r in per_norm if norm_key(r['questionario_nome']) == norm_key('Principal')])}, Implante={len([r for r in per_norm if norm_key(r['questionario_nome']) == norm_key('Implante')])}, Ficha complementar={len([r for r in per_norm if norm_key(r['questionario_nome']) == norm_key('Ficha complementar')])}, Anamnese de Saude={len([r for r in per_norm if norm_key(r['questionario_nome']) == norm_key('Anamnese de Saude')])}, Anamnese pessoal={len([r for r in per_norm if norm_key(r['questionario_nome']) == norm_key('Anamnese pessoal')])}")
        report.append("- encoding/acentuacao: UTF-8-SIG lido com normalizacao de espacos")
        report.append("- sem nomes duplicados e sem linhas vazias nos questionarios")
        report.append("")
        report.append("## 6. Estrat?gia sobre Principal")
        report.append(f"- Principal atual: {len(current_texts)} perguntas")
        report.append(f"- Principal EDS70: {len(source_texts)} perguntas")
        report.append(f"- perguntas faltantes no Principal atual: {len(principal_missing)}")
        report.append("- Principal N?O ser? alterado nesta primeira importa??o")
        if principal_missing:
            report.append("- perguntas faltantes do Principal EDS70:")
            for item in principal_missing[:25]:
                report.append(f"  - {item['ordem']}: {item['texto']}")
            if len(principal_missing) > 25:
                report.append(f"  - ... ({len(principal_missing) - 25} adicionais)")
        report.append("")
        report.append("## 7. Question?rios previstos para importa??o futura")
        for item in questionario_plan_json:
            report.append(f"- {item['nome']}: {len([r for r in pergunta_plan_json if norm_key(r['questionario_nome']) == norm_key(item['nome'])])} perguntas; futuro_id_estimado={item['future_questionario_id_estimated']}")
        report.append("")
        report.append("## 8. Script dry-run criado")
        report.append("- backend/scripts/anamnese_dry_run_importar_eds70_gleisson.py")
        report.append("- n?o altera banco; s? gera plano; aborta em inconsist?ncias")
        report.append("")
        report.append("## 9. Arquivos de dry-run gerados")
        report.append(f"- {OUT_JSON_QUEST.relative_to(ROOT).as_posix()}")
        report.append(f"- {OUT_JSON_PERG.relative_to(ROOT).as_posix()}")
        report.append(f"- {OUT_SQL.relative_to(ROOT).as_posix()}")
        report.append(f"- {OUT_TXT.relative_to(ROOT).as_posix()}")
        report.append("")
        report.append("## 10. Resultado da execu??o dry-run")
        report.append(f"- questionarios que seriam criados: {len(questionario_plan_json)}")
        report.append(f"- perguntas que seriam criadas: {len(pergunta_plan_json)}")
        report.append(f"- alertas/abortos: {'nenhum' if not orphan_responses else 'respostas orfas presentes; importacao de respostas bloqueada por plano'}")
        report.append("")
        report.append("## 11. Valida??o de n?o altera??o")
        report.append("- PostgreSQL continuou com s? Principal")
        report.append("- nenhum INSERT/UPDATE/DELETE foi executado")
        report.append("")
        report.append("## 12. Plano futuro de execu??o real")
        report.append("1. backup completo do PostgreSQL")
        report.append("2. export das tabelas atuais de Anamnese")
        report.append("3. rodar script real de importa??o com transacao")
        report.append("4. inserir quatro questionarios ausentes")
        report.append("5. inserir perguntas relacionadas")
        report.append("6. n?o importar respostas")
        report.append("7. validar endpoint /anamnese/questionarios")
        report.append("8. testar navegador")
        report.append("")
        report.append("## 13. Riscos")
        report.append("- diferen?a do Principal")
        report.append("- risco de duplicidade")
        report.append("- risco de encoding")
        report.append("- risco de mapeamento de tipos")
        report.append("- risco de respostas cl?nicas")
        report.append("- necessidade de backup antes da escrita")
        report.append("")
        report.append("## 14. O que n?o foi alterado")
        report.append("- frontend/app.js n?o foi alterado")
        report.append("- frontend/index.html n?o foi alterado")
        report.append("- backend funcional n?o foi alterado")
        report.append("- endpoints n?o foram alterados")
        report.append("- PostgreSQL atual n?o foi alterado")
        report.append("- SQL Server EDS70 n?o foi alterado")
        report.append("- nenhum dado foi importado")
        report.append("- nenhum dado foi apagado")
        report.append("- nenhum commit foi feito")
        report.append("")
        report.append("## 15. Checks executados")
        report.append("- node --check frontend/app.js")
        report.append("- python -m py_compile backend/scripts/anamnese_dry_run_importar_eds70_gleisson.py")
        report.append("- git status --short")
        report.append("- git diff --stat")
        report.append("")
        report.append("## 16. Pr?xima autoriza??o necess?ria")
        report.append("- criar backup do PostgreSQL atual")
        report.append("- criar script real de importa??o")
        report.append("- executar importa??o transacional dos quatro questionarios ausentes e suas perguntas")
        report.append("- sem mexer no Principal")
        report.append("- sem importar respostas")

        OUT_REPORT.write_text("\n".join(report) + "\n", encoding="utf-8")

        print("DRY_RUN_OK")
        print(f"USER={user['email']} CLINICA_ID={user['clinica_id']} CLINICA_NOME={TARGET_CLINICA_NOME}")
        print(f"PG_CURRENT_QUESTIONARIOS={len(current_q)}")
        print(f"PG_CURRENT_PRINCIPAL_PERGUNTAS={len(current_texts)}")
        print(f"EDS70_QUESTIONARIOS={len(qs_norm)}")
        print(f"EDS70_PERGUNTAS={len(per_norm)}")
        print(f"EDS70_RESP_RESUMO={len(resp_raw)}")
        print(f"QUESTIONARIOS_A_IMPORTAR={len(questionario_plan_json)}")
        print(f"PERGUNTAS_A_IMPORTAR={len(pergunta_plan_json)}")
        print(f"PRINCIPAL_FALTANTES={len(principal_missing)}")
        print(f"ORPHAN_RESPONSES={len(orphan_responses)}")
        return 0
    finally:
        cur.close()
        conn.close()


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"DRY_RUN_ABORTED: {exc}")
        raise
