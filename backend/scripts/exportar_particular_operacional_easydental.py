from __future__ import annotations

import csv
import hashlib
import json
import os
import re
import sys
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

import pyodbc
from dotenv import dotenv_values
from sqlalchemy import text

ROOT = Path(__file__).resolve().parents[2]
BACKEND = ROOT / "backend"
SNAP_DIR = BACKEND / "snapshots" / "easydental"
DOC_DIR = ROOT / "docs"

SOURCE_SERVER = os.getenv("EASYDENTAL_SERVER", r"DELL_SERVIDOR\EDS70")
SOURCE_DATABASE = os.getenv("EASYDENTAL_DATABASE", "eds70")
SOURCE_UID = os.getenv("EASYDENTAL_UID", "easy")
SOURCE_PWD = os.getenv("EASYDENTAL_PASSWORD", "")

QUERY = """
SELECT
    NROTAB,
    NROPROCTAB,
    CODCONV,
    DESCRICAO,
    NROSIM,
    ESPECIAL,
    VALOR_REPASSE,
    VALOR_PACIENTE,
    TIPOCOBR,
    OBSERV,
    INATIVO,
    MOSTRAR_SIMBOLO,
    GARANTIA,
    PREFERIDO
FROM TAB_PRC_ITEM
WHERE NROTAB = 10
ORDER BY NROPROCTAB
"""

MOJIBAKE_RE = re.compile(r"(?:Ã.|Â.|â€.|�)")


def _clean(value: object) -> str:
    if value is None:
        return ""
    return str(value)


def _to_int(value: object, default: int = 0) -> int:
    try:
        if value in {None, ""}:
            return default
        return int(value)
    except Exception:
        try:
            return int(float(str(value).replace(",", ".")))
        except Exception:
            return default


def _to_float(value: object, default: float = 0.0) -> float:
    try:
        if value in {None, ""}:
            return default
        return float(value)
    except Exception:
        try:
            return float(str(value).replace(",", "."))
        except Exception:
            return default


def _norm_text(value: object) -> str:
    return " ".join(_clean(value).split()).strip()


def _looks_mojibake(value: object) -> bool:
    return bool(MOJIBAKE_RE.search(_clean(value)))


def _sha256_text(data: str) -> str:
    return hashlib.sha256(data.encode("utf-8")).hexdigest()


def _hash_payload(payload: dict[str, object]) -> str:
    clone = json.loads(json.dumps(payload, ensure_ascii=False))
    if isinstance(clone, dict):
        metadata = clone.get("metadata")
        if isinstance(metadata, dict) and "sha256" in metadata:
            metadata["sha256"] = ""
    return _sha256_text(json.dumps(clone, ensure_ascii=False, sort_keys=True))


def _load_env() -> None:
    env_path = BACKEND / ".env"
    if env_path.exists():
        os.environ.update(dotenv_values(env_path))


def _load_source_rows() -> list[dict[str, object]]:
    conn = pyodbc.connect(
        f"Driver={{SQL Server}};Server={SOURCE_SERVER};Database={SOURCE_DATABASE};Uid={SOURCE_UID};Pwd={SOURCE_PWD};",
        timeout=20,
    )
    cur = conn.cursor()
    cur.execute(QUERY)
    cols = [col[0] for col in cur.description]
    rows: list[dict[str, object]] = []
    for raw in cur.fetchall():
        row = dict(zip(cols, raw))
        rows.append(
            {
                "NROTAB": _to_int(row["NROTAB"]),
                "NROPROCTAB": _to_int(row["NROPROCTAB"]),
                "CODCONV": _clean(row["CODCONV"]),
                "DESCRICAO": _clean(row["DESCRICAO"]),
                "NROSIM": _to_int(row["NROSIM"]) or None,
                "ESPECIAL": _to_int(row["ESPECIAL"]) or None,
                "VALOR_REPASSE": _to_float(row["VALOR_REPASSE"]),
                "VALOR_PACIENTE": _to_float(row["VALOR_PACIENTE"]),
                "TIPOCOBR": _to_int(row["TIPOCOBR"]) or None,
                "OBSERV": _clean(row["OBSERV"]),
                "INATIVO": bool(_to_int(row["INATIVO"])),
                "MOSTRAR_SIMBOLO": None if row["MOSTRAR_SIMBOLO"] is None else bool(_to_int(row["MOSTRAR_SIMBOLO"])),
                "GARANTIA": _to_int(row["GARANTIA"]),
                "PREFERIDO": bool(_to_int(row["PREFERIDO"])),
            }
        )
    conn.close()
    return rows


def _load_brana_context() -> dict[str, object]:
    sys.path.insert(0, str(BACKEND))
    from database import engine  # noqa: WPS433

    sql_tables = text(
        """
        SELECT t.id, t.codigo, t.nome, COUNT(p.id) AS total
        FROM procedimento_tabela t
        LEFT JOIN procedimento p ON p.tabela_id = t.id AND p.clinica_id = 1
        WHERE lower(t.nome) = lower(:nome) OR t.codigo = :codigo
        GROUP BY t.id, t.codigo, t.nome
        ORDER BY t.id
        """
    )
    sql_rows = text(
        """
        SELECT
            p.id, p.codigo, p.nome, p.especialidade, p.simbolo_grafico,
            p.simbolo_grafico_legacy_id, p.mostrar_simbolo, p.preco,
            p.forma_cobranca, p.observacoes, p.inativo, p.garantia_meses,
            p.preferido, p.valor_repasse, p.custo_lab, p.tempo
        FROM procedimento p
        WHERE p.clinica_id = 1 AND p.tabela_id = :table_id
        ORDER BY p.codigo
        """
    )
    sql_especialidades = text(
        """
        SELECT codigo, descricao AS nome
        FROM item_auxiliar
        WHERE clinica_id = 1
          AND lower(tipo) = lower('Especialidade')
          AND coalesce(inativo, false) = false
        ORDER BY coalesce(ordem, 999999), descricao, id
        """
    )

    with engine.connect() as conn:
        table_candidates = [dict(row._mapping) for row in conn.execute(sql_tables, {"nome": "PARTICULAR", "codigo": 10}).fetchall()]
        table = None
        for candidate in table_candidates:
            if _clean(candidate["nome"]).strip().lower() == "particular" and _to_int(candidate["total"]) == 336:
                table = candidate
                break
        if table is None and table_candidates:
            table = table_candidates[0]
        if table is None:
            raise RuntimeError("Tabela PARTICULAR nao encontrada no Brana.")
        rows = [dict(row._mapping) for row in conn.execute(sql_rows, {"table_id": _to_int(table["id"])}).fetchall()]
        esp_rows = [dict(row._mapping) for row in conn.execute(sql_especialidades).fetchall()]

    return {
        "table_id": _to_int(table["id"]),
        "table_code": _to_int(table["codigo"]),
        "table_name": _clean(table["nome"]),
        "total": _to_int(table["total"]),
        "rows": rows,
        "especialidades": esp_rows,
    }


def _classify(src: dict[str, object], brana_row: dict[str, object] | None) -> str:
    if brana_row is None:
        return "D"
    if _norm_text(src["DESCRICAO"]) == _norm_text(brana_row["nome"]):
        return "A"
    if _looks_mojibake(brana_row["nome"]) and not _looks_mojibake(src["DESCRICAO"]):
        return "B"
    return "C"


def _build_preview(source_rows: list[dict[str, object]], brana: dict[str, object]) -> tuple[dict[str, object], list[dict[str, object]]]:
    esp_map = {str(row["codigo"]).strip().zfill(2): _clean(row["nome"]).strip() for row in brana["especialidades"] if _clean(row["codigo"]).strip()}
    br_map = {int(row["codigo"]): row for row in brana["rows"]}
    class_counts: Counter[str] = Counter()
    preview_rows: list[dict[str, object]] = []
    mojibake_rows: list[int] = []

    for src in source_rows:
        br_row = br_map.get(_to_int(src["NROPROCTAB"]))
        classificacao = _classify(src, br_row)
        class_counts[classificacao] += 1
        if br_row and _looks_mojibake(br_row["nome"]):
            mojibake_rows.append(_to_int(src["NROPROCTAB"]))
        divergencias: list[str] = []
        if br_row is None:
            divergencias = ["somente_easy"]
        else:
            if _norm_text(src["DESCRICAO"]) != _norm_text(br_row["nome"]):
                divergencias.append("nome")
            src_esp = _to_int(src["ESPECIAL"])
            br_esp = _clean(br_row.get("especialidade")).strip()
            if (src_esp > 0) != bool(br_esp):
                divergencias.append("especialidade")
            if _to_int(src["NROSIM"]) != _to_int(br_row.get("simbolo_grafico_legacy_id")):
                divergencias.append("simbolo")
            if round(_to_float(src["VALOR_PACIENTE"]), 4) != round(_to_float(br_row.get("preco")), 4):
                divergencias.append("preco")
            if _to_int(src["TIPOCOBR"]) != _to_int(br_row.get("forma_cobranca")):
                divergencias.append("forma_cobranca")
            if _norm_text(src["OBSERV"]) != _norm_text(br_row.get("observacoes")):
                divergencias.append("observacoes")
            if bool(src["INATIVO"]) != bool(br_row.get("inativo")):
                divergencias.append("status")

        if br_row is None:
            acao = "avaliar inclusao no Brana"
            motivo = "nao existe correspondencia no Brana"
            nivel = "baixo"
        elif divergencias:
            acao = "revisar divergencias"
            motivo = "nome divergente" if "nome" in divergencias else "campos divergentes"
            nivel = "medio" if "nome" in divergencias else "alto"
        else:
            acao = "nenhuma"
            motivo = "identico"
            nivel = "alto"

        preview_rows.append(
            {
                "codigo": _to_int(src["NROPROCTAB"]),
                "easy_nome": src["DESCRICAO"],
                "easy_especialidade": src["ESPECIAL"],
                "easy_simbolo": src["NROSIM"],
                "easy_preco": src["VALOR_PACIENTE"],
                "easy_forma_cobranca": src["TIPOCOBR"],
                "easy_observacoes": src["OBSERV"],
                "easy_status": src["INATIVO"],
                "brana_nome": "" if br_row is None else br_row.get("nome"),
                "brana_especialidade": "" if br_row is None else br_row.get("especialidade"),
                "brana_simbolo": "" if br_row is None else br_row.get("simbolo_grafico_legacy_id"),
                "brana_preco": "" if br_row is None else br_row.get("preco"),
                "brana_forma_cobranca": "" if br_row is None else br_row.get("forma_cobranca"),
                "brana_observacoes": "" if br_row is None else br_row.get("observacoes"),
                "brana_status": "" if br_row is None else br_row.get("inativo"),
                "classificacao": classificacao,
                "divergencias": divergencias,
                "acao_futura_sugerida": acao,
                "motivo": motivo,
                "nivel_seguranca": nivel,
            }
        )

    preview = {
        "metadata": {
            "clinica_id": 1,
            "tabela_id": brana["table_id"],
            "tabela_codigo": brana["table_code"],
            "tabela_nome": brana["table_name"],
            "total_brana": brana["total"],
            "total_easy": len(source_rows),
            "classificacao_resumo": dict(class_counts),
            "matched_codes": len(set(_to_int(r["NROPROCTAB"]) for r in source_rows) & set(int(r["codigo"]) for r in brana["rows"])),
            "only_easy": sum(1 for row in preview_rows if row["classificacao"] == "D"),
            "only_brana": len([row for row in brana["rows"] if int(row["codigo"]) not in {_to_int(x["NROPROCTAB"]) for x in source_rows}]),
            "mojibake_detectado": len(mojibake_rows),
            "sha256": "",
        },
        "registros": preview_rows,
    }
    preview["metadata"]["sha256"] = _hash_payload(preview)
    return preview, mojibake_rows


def main() -> None:
    _load_env()
    SNAP_DIR.mkdir(parents=True, exist_ok=True)
    DOC_DIR.mkdir(parents=True, exist_ok=True)

    source_rows_1 = _load_source_rows()
    source_rows_2 = _load_source_rows()
    if source_rows_1 != source_rows_2:
        raise RuntimeError("Extracao do EasyDental nao foi idempotente.")

    brana = _load_brana_context()
    preview, mojibake_rows = _build_preview(source_rows_1, brana)

    source_payload = {
        "metadata": {
            "servidor": SOURCE_SERVER,
            "database": SOURCE_DATABASE,
            "tabela": "TAB_PRC_ITEM",
            "NROTAB": 10,
            "data_utc": datetime.now(timezone.utc).date().isoformat() + "T00:00:00Z",
            "total": len(source_rows_1),
            "codigos_unicos": len({int(row["NROPROCTAB"]) for row in source_rows_1}),
            "duplicidades": [code for code, count in Counter(int(row["NROPROCTAB"]) for row in source_rows_1).items() if count > 1],
            "anomalias": [],
            "sha256": "",
        },
        "registros": source_rows_1,
    }
    source_payload["metadata"]["sha256"] = _hash_payload(source_payload)

    snapshot_json = SNAP_DIR / "particular_operacional_336_procedimentos.json"
    snapshot_csv = SNAP_DIR / "particular_operacional_336_procedimentos.csv"
    preview_json = DOC_DIR / "preview_sincronizacao_particular_operacional.json"
    preview_csv = DOC_DIR / "preview_sincronizacao_particular_operacional.csv"

    snapshot_json.write_text(json.dumps(source_payload, ensure_ascii=False, indent=2), encoding="utf-8")
    with snapshot_csv.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(source_rows_1[0].keys()))
        writer.writeheader()
        writer.writerows(source_rows_1)

    preview_json.write_text(json.dumps(preview, ensure_ascii=False, indent=2), encoding="utf-8")
    with preview_csv.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(preview["registros"][0].keys()))
        writer.writeheader()
        writer.writerows(preview["registros"])

    if _hash_payload(json.loads(snapshot_json.read_text(encoding="utf-8"))) != source_payload["metadata"]["sha256"]:
        raise RuntimeError("Hash do snapshot nao conferiu.")
    if _hash_payload(json.loads(preview_json.read_text(encoding="utf-8"))) != preview["metadata"]["sha256"]:
        raise RuntimeError("Hash do preview nao conferiu.")

    print(
        json.dumps(
            {
                "easy_total": len(source_rows_1),
                "easy_active": sum(1 for row in source_rows_1 if not row["INATIVO"]),
                "easy_inactive": sum(1 for row in source_rows_1 if row["INATIVO"]),
                "easy_unique_codes": len({int(row["NROPROCTAB"]) for row in source_rows_1}),
                "easy_duplicates": [code for code, count in Counter(int(row["NROPROCTAB"]) for row in source_rows_1).items() if count > 1],
                "easy_first_code": min(int(row["NROPROCTAB"]) for row in source_rows_1),
                "easy_last_code": max(int(row["NROPROCTAB"]) for row in source_rows_1),
                "brana_table_id": brana["table_id"],
                "brana_table_code": brana["table_code"],
                "brana_table_name": brana["table_name"],
                "brana_total": brana["total"],
                "matched": preview["metadata"]["matched_codes"],
                "only_easy": preview["metadata"]["only_easy"],
                "only_brana": preview["metadata"]["only_brana"],
                "classifications": preview["metadata"]["classificacao_resumo"],
                "mojibake_rows": mojibake_rows[:20],
                "snapshot_json": str(snapshot_json),
                "snapshot_csv": str(snapshot_csv),
                "preview_json": str(preview_json),
                "preview_csv": str(preview_csv),
                "snapshot_sha256": source_payload["metadata"]["sha256"],
                "preview_sha256": preview["metadata"]["sha256"],
                "idempotent": True,
            },
            ensure_ascii=False,
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
