from __future__ import annotations

import argparse
import csv
import json
import re
import subprocess
import sys
from dataclasses import dataclass, asdict
from pathlib import Path

from sqlalchemy import text

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from database import engine

TARGET_EMAIL_DEFAULT = "gleissontel@gmail.com"
SOURCE_SERVER = r"DELL_SERVIDOR\EDS70"
SOURCE_DATABASE = "eds70"
SOURCE_UID = "easy"
SOURCE_PWD = "ysae"
OSQL_PATH = Path(r"D:\UTIL\EasyDental_7.6_BR\EDS75_Server\x86\Binn\OSQL.EXE")
DELIM = "|~|"
TARGET_TABLES = {
    4: "PARTICULAR",
    5: "CAIXA ECONOMICA FEDERAL",
    10: "EASY - PARTICULAR",
    11: "UNIMED - ODONTO",
}
FOCUSED_TABLES = {4, 5, 10, 11}
REFERENCE_TABLE = 4


MOJIBAKE_MARKERS = ("Â", "Ã", "ï¿½", "†", "‡", "‚", "¢", "Æ", "", "", "", "", "¤", "¥", "¦", "§", "¨", "©", "ª", "«", "¬", "®", "¯", "°", "±", "²", "³", "´", "µ", "¶", "·", "¸", "¹", "º")
SUSPECT_SEQUENCE_MARKERS = ("Â", "Ã", "ï¿½", "†", "‡", "‚", "¢", "Æ", "", "", "", "", "¤", "¥", "¦", "§", "¨", "©", "ª", "«", "¬", "®", "¯", "°", "±", "²", "³", "´", "µ", "¶", "·", "¸", "¹", "º", "¡")


@dataclass
class PreviewRow:
    procedimento_id: int
    clinica_id: int
    tabela_id: int
    tabela_codigo: int
    tabela_nome: str
    codigo: int
    nome_atual: str
    nome_origem: str
    categoria: str
    chave_origem: str
    caracteres_suspeitos: str
    motivo: str
    diferente: bool


def _clean_text(value: str | None) -> str:
    return " ".join(str(value or "").replace("\ufeff", "").split()).strip()


def _to_int(value: str | int | None, default: int = 0) -> int:
    txt = _clean_text(value)
    if not txt:
        return default
    try:
        return int(float(txt.replace(",", ".")))
    except (TypeError, ValueError):
        return default


def _looks_like_mojibake(value: str) -> bool:
    txt = _clean_text(value)
    return any(marker in txt for marker in MOJIBAKE_MARKERS) or bool(re.search(r"[ÃÂï¿½†‡‚¢Æ¡]", txt))


def _extract_suspect_markers(value: str) -> str:
    txt = _clean_text(value)
    found = [marker for marker in SUSPECT_SEQUENCE_MARKERS if marker and marker in txt]
    return " ".join(dict.fromkeys(found))


def _classify_row(nome_atual: str, nome_origem: str) -> str:
    atual = _clean_text(nome_atual)
    origem = _clean_text(nome_origem)
    if not origem:
        return "E"
    if atual == origem:
        return "A"
    if _looks_like_mojibake(atual):
        return "B"
    return "C"


def _explain_category(nome_atual: str, nome_origem: str, categoria: str) -> str:
    atual = _clean_text(nome_atual)
    origem = _clean_text(nome_origem)
    if categoria == "A":
        return "texto atual coincide com a fonte"
    if categoria == "B":
        return "nome atual contem marcador de mojibake e a fonte fornece o nome correto"
    if categoria == "C":
        if atual != origem and (atual.endswith(")") or atual.endswith("7") or atual.endswith("9")):
            return "diferenca editorial ou sufixo numerico"
        return "diferenca nao atribuivel com seguranca a encoding"
    if categoria == "E":
        return "sem correspondente unico na fonte"
    return "classificacao nao tratada"


def _run_osql_query(query: str) -> list[str]:
    if not OSQL_PATH.exists():
        raise RuntimeError(f"OSQL.EXE nao encontrado em: {OSQL_PATH}")
    cmd = [
        str(OSQL_PATH),
        "-S",
        SOURCE_SERVER,
        "-d",
        SOURCE_DATABASE,
        "-U",
        SOURCE_UID,
        "-P",
        SOURCE_PWD,
        "-h-1",
        "-w",
        "999",
        "-Q",
        f"SET NOCOUNT ON {query}",
    ]
    completed = subprocess.run(cmd, capture_output=True, text=True, encoding="cp850", errors="replace", check=True)
    return [line.strip() for line in completed.stdout.splitlines() if line.strip() and DELIM in line]


def _load_source_names(table_code: int) -> dict[int, str]:
    rows = _run_osql_query(
        "SELECT CAST(NROPROCTAB AS VARCHAR(20)) + '{d}' + "
        "ISNULL(REPLACE(REPLACE(DESCRICAO, CHAR(13), ' '), CHAR(10), ' '), '') "
        "FROM TAB_PRC_ITEM WHERE NROTAB = {nrotab} ORDER BY NROPROCTAB".format(d=DELIM, nrotab=table_code)
    )
    result: dict[int, str] = {}
    for row in rows:
        parts = [part.strip() for part in row.split(DELIM)]
        if len(parts) != 2:
            continue
        code = _to_int(parts[0])
        name = _clean_text(parts[1])
        if code > 0 and name:
            result[code] = name
    return result


def _load_brana_rows(clinica_id: int, table_code: int) -> list[dict]:
    sql = text(
        """
        SELECT p.id, p.clinica_id, p.tabela_id, p.codigo, p.nome
        FROM procedimento p
        JOIN procedimento_tabela t ON t.id = p.tabela_id
        WHERE p.clinica_id = :clinica_id
          AND t.codigo = :table_code
        ORDER BY p.codigo
        """
    )
    with engine.connect() as conn:
        rows = conn.execute(sql, {"clinica_id": clinica_id, "table_code": table_code}).fetchall()
    return [
        {
            "procedimento_id": int(row.id),
            "clinica_id": int(row.clinica_id),
            "tabela_id": int(row.tabela_id),
            "codigo": int(row.codigo),
            "nome_atual": _clean_text(row.nome),
        }
        for row in rows
    ]


def build_preview(email: str) -> dict:
    sql = text(
        """
        SELECT u.clinica_id
        FROM usuarios u
        WHERE lower(u.email) = lower(:email)
        """
    )
    with engine.connect() as conn:
        row = conn.execute(sql, {"email": email}).mappings().first()
    if not row:
        raise RuntimeError(f"Usuario alvo nao encontrado: {email}")
    clinica_id = int(row["clinica_id"])

    preview_rows: list[PreviewRow] = []
    source_reference = _load_source_names(REFERENCE_TABLE)
    for table_code in sorted(FOCUSED_TABLES):
        current_rows = _load_brana_rows(clinica_id, table_code)
        current = {row["codigo"]: row for row in current_rows}
        source = _load_source_names(table_code)
        for code, row in current.items():
            source_name = source.get(code, "")
            categoria = _classify_row(row["nome_atual"], source_name)
            preview_rows.append(
                PreviewRow(
                    procedimento_id=row["procedimento_id"],
                    clinica_id=row["clinica_id"],
                    tabela_id=row["tabela_id"],
                    tabela_codigo=table_code,
                    tabela_nome=TARGET_TABLES[table_code],
                    codigo=code,
                    nome_atual=row["nome_atual"],
                    nome_origem=source_name,
                    categoria=categoria,
                    chave_origem=f"{table_code}:{code}",
                    caracteres_suspeitos=_extract_suspect_markers(row["nome_atual"]),
                    motivo=_explain_category(row["nome_atual"], source_name, categoria),
                    diferente=row["nome_atual"] != source_name,
                )
            )

    return {
        "clinica_id": clinica_id,
        "email": email,
        "reference_table_code": REFERENCE_TABLE,
        "reference_table_name": TARGET_TABLES[REFERENCE_TABLE],
        "rows": [asdict(row) for row in preview_rows],
        "source_reference_sample": {str(code): name for code, name in list(source_reference.items())[:10]},
    }


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Prepara a correcao de mojibake nas tabelas de procedimentos sem gravar dados."
    )
    parser.add_argument("--email", default=TARGET_EMAIL_DEFAULT, help="Email do usuario alvo para identificar a clinica.")
    parser.add_argument("--json-out", help="Arquivo JSON opcional com o preview consolidado.")
    parser.add_argument("--csv-out", help="Arquivo CSV opcional com o preview detalhado.")
    args = parser.parse_args()

    preview = build_preview(args.email)
    print(json.dumps({k: v for k, v in preview.items() if k != "rows"}, ensure_ascii=False, indent=2))
    print(f"rows={len(preview['rows'])}")

    if args.json_out:
        Path(args.json_out).write_text(json.dumps(preview, ensure_ascii=False, indent=2), encoding="utf-8")
    if args.csv_out:
        csv_path = Path(args.csv_out)
        csv_path.parent.mkdir(parents=True, exist_ok=True)
        fieldnames = list(preview["rows"][0].keys()) if preview["rows"] else [
            "tabela_codigo",
            "tabela_nome",
            "procedimento_codigo",
            "nome_banco_atual",
            "nome_origem_legado",
            "diferente",
        ]
        with csv_path.open("w", encoding="utf-8", newline="") as handle:
            writer = csv.DictWriter(handle, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(preview["rows"])


if __name__ == "__main__":
    main()
