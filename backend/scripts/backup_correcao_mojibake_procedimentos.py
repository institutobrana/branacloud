from __future__ import annotations

import argparse
import csv
import hashlib
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))


ALLOWED_TABLE_CODES = {5, 11}
EXPECTED_COUNTS = {5: 54, 11: 114}
SCHEMA_VERSION = "1.1"


def _load_preview(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def _rows_from_preview(preview: dict, table_code: int) -> list[dict]:
    rows = []
    for row in preview.get("rows", []):
        if int(row.get("tabela_codigo", 0)) != table_code:
            continue
        if row.get("categoria") != "B":
            continue
        rows.append(row)
    return rows


def _canonical_payload(records: list[dict]) -> str:
    ordered = sorted(
        records,
        key=lambda row: (int(row["tabela_codigo"]), int(row["codigo"]), int(row["procedimento_id"])),
    )
    return json.dumps(ordered, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def build_backup(preview_path: Path, table_code: int) -> dict:
    preview = _load_preview(preview_path)
    if table_code not in ALLOWED_TABLE_CODES:
        raise RuntimeError(f"Tabela nao autorizada para backup: {table_code}")

    records = _rows_from_preview(preview, table_code)
    if not records:
        raise RuntimeError(f"Nenhum candidato B encontrado para tabela {table_code}.")

    expected = EXPECTED_COUNTS[table_code]
    if len(records) != expected:
        raise RuntimeError(
            f"Quantidade inesperada para tabela {table_code}: esperado {expected}, obtido {len(records)}."
        )

    ids = [int(row["procedimento_id"]) for row in records]
    if len(ids) != len(set(ids)):
        raise RuntimeError("Backup invalido: procedimento_id duplicado.")

    payload = {
        "schema_version": SCHEMA_VERSION,
        "created_at_utc": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "source_preview_hash": "",
        "clinica_id": int(preview["clinica_id"]),
        "tabela_id": int(table_code),
        "expected_total": expected,
        "records": [
            {
                "procedimento_id": int(row["procedimento_id"]),
                "clinica_id": int(row["clinica_id"]),
                "tabela_id": int(row["tabela_id"]),
                "tabela_codigo": int(row["tabela_codigo"]),
                "codigo": int(row["codigo"]),
                "nome_original": row["nome_atual"],
                "nome_corrigido_proposto": row["nome_origem"],
                "categoria": row["categoria"],
                "chave_origem": row["chave_origem"],
                "hash_individual": hashlib.sha256(
                    f"{row['procedimento_id']}|{row['clinica_id']}|{row['tabela_id']}|{row['codigo']}|{row['nome_atual']}|{row['nome_origem']}|{row['categoria']}|{row['chave_origem']}".encode(
                        "utf-8"
                    )
                ).hexdigest(),
            }
            for row in records
        ],
    }
    payload["source_preview_hash"] = hashlib.sha256(
        json.dumps(preview, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    ).hexdigest()
    payload["hash"] = hashlib.sha256(_canonical_payload(payload["records"]).encode("utf-8")).hexdigest()
    return payload


def main() -> None:
    parser = argparse.ArgumentParser(description="Gera backup JSON para a correcao de mojibake em Procedimentos.")
    parser.add_argument("--preview-json", required=True, help="Arquivo JSON do preview ja gerado.")
    parser.add_argument("--table-id", required=True, type=int, choices=sorted(ALLOWED_TABLE_CODES), help="Tabela autorizada.")
    parser.add_argument(
        "--output",
        default=str(Path("backend") / "backups" / "mojibake_procedimentos" / "backup_tabela_{table_id}.json"),
        help="Arquivo JSON de backup a gravar.",
    )
    parser.add_argument("--csv-out", help="CSV complementar opcional.")
    parser.add_argument("--dry-run", action="store_true", help="Nao grava arquivos, apenas valida a geracao.")
    args = parser.parse_args()

    backup = build_backup(Path(args.preview_json), args.table_id)
    print(json.dumps({k: v for k, v in backup.items() if k != "records"}, ensure_ascii=False, indent=2))
    print(f"records={len(backup['records'])}")

    output_path = Path(str(args.output).format(table_id=args.table_id))
    if not args.dry_run:
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(json.dumps(backup, ensure_ascii=False, indent=2), encoding="utf-8")
        if args.csv_out:
            csv_path = Path(str(args.csv_out).format(table_id=args.table_id))
            csv_path.parent.mkdir(parents=True, exist_ok=True)
            with csv_path.open("w", encoding="utf-8", newline="") as handle:
                writer = csv.DictWriter(handle, fieldnames=list(backup["records"][0].keys()))
                writer.writeheader()
                writer.writerows(backup["records"])


if __name__ == "__main__":
    main()
