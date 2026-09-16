from __future__ import annotations

import argparse
import hashlib
import json
import sys
from pathlib import Path

from sqlalchemy import text

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from database import engine

ALLOWED_TABLE_CODES = {5, 11}
EXPECTED_COUNTS = {5: 54, 11: 114}
SCHEMA_VERSION = "1.1"


def _canonical_payload(records: list[dict]) -> str:
    ordered = sorted(
        records,
        key=lambda row: (int(row["tabela_codigo"]), int(row["codigo"]), int(row["procedimento_id"])),
    )
    return json.dumps(ordered, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def _load_backup(path: Path) -> dict:
    backup = json.loads(path.read_text(encoding="utf-8"))
    if backup.get("schema_version") != SCHEMA_VERSION:
        raise RuntimeError(f"Versao de backup inesperada: {backup.get('schema_version')}")
    records = backup.get("records") or []
    if not records:
        raise RuntimeError("Backup sem registros.")
    required = {"procedimento_id", "clinica_id", "tabela_id", "tabela_codigo", "codigo", "nome_original", "nome_corrigido_proposto", "categoria", "chave_origem", "hash_individual"}
    for row in records:
        missing = required - set(row)
        if missing:
            raise RuntimeError(f"Backup incompleto: faltam campos {sorted(missing)}.")
    expected_hash = backup.get("hash")
    if not expected_hash:
        raise RuntimeError("Backup sem hash.")
    actual_hash = hashlib.sha256(_canonical_payload(records).encode("utf-8")).hexdigest()
    if actual_hash != expected_hash:
        raise RuntimeError("Hash do backup invalido.")
    ids = [int(row["procedimento_id"]) for row in records]
    if len(ids) != len(set(ids)):
        raise RuntimeError("Backup invalido: ids duplicados.")
    tables = {int(row["tabela_codigo"]) for row in records}
    if tables - ALLOWED_TABLE_CODES:
        raise RuntimeError(f"Backup contem tabela nao autorizada: {sorted(tables - ALLOWED_TABLE_CODES)}")
    if 5 in tables and len([r for r in records if int(r["tabela_codigo"]) == 5]) != EXPECTED_COUNTS[5]:
        raise RuntimeError("Contagem invalida para tabela 5.")
    if 11 in tables and len([r for r in records if int(r["tabela_codigo"]) == 11]) != EXPECTED_COUNTS[11]:
        raise RuntimeError("Contagem invalida para tabela 11.")
    if any(row.get("categoria") != "B" for row in records):
        raise RuntimeError("Backup contem linha fora da categoria B.")
    return backup


def _validate_expected_context(backup: dict, expected_count: int | None, expected_clinica: int | None, expected_hash: str | None) -> None:
    if expected_count is not None:
        total = len(backup.get("records") or [])
        if total != expected_count:
            raise RuntimeError(f"Contagem esperada invalida: esperado {expected_count}, obtido {total}.")
    if expected_clinica is not None and int(backup.get("clinica_id", -1)) != expected_clinica:
        raise RuntimeError(f"Clinica esperada invalida: esperado {expected_clinica}, obtido {backup.get('clinica_id')}.")
    if expected_hash is not None and str(backup.get("hash") or "") != expected_hash:
        raise RuntimeError("Hash esperado invalido.")


def _load_current_rows(table_id: int) -> dict[int, dict]:
    sql = text(
        """
        SELECT p.id, p.clinica_id, p.tabela_id, p.codigo, p.nome, t.codigo AS tabela_codigo
        FROM procedimento p
        JOIN procedimento_tabela t ON t.id = p.tabela_id
        WHERE t.codigo = :table_code
        """
    )
    with engine.connect() as conn:
        rows = conn.execute(sql, {"table_code": table_id}).mappings().all()
    return {int(row["id"]): dict(row) for row in rows}


def apply_backup(table_id: int, backup: dict) -> dict:
    records = [row for row in backup["records"] if int(row["tabela_codigo"]) == table_id]
    expected = EXPECTED_COUNTS[table_id]
    if len(records) != expected:
        raise RuntimeError(f"Quantidade inesperada para tabela {table_id}: esperado {expected}, obtido {len(records)}")

    current_rows = _load_current_rows(table_id)
    updated = 0
    already_correct = 0
    blocked = []

    sql = text(
        """
        UPDATE procedimento
        SET nome = :novo_nome
        WHERE id = :id
          AND clinica_id = :clinica_id
          AND tabela_id = :tabela_id
          AND codigo = :codigo
          AND nome = :nome_atual
        """
    )

    with engine.begin() as conn:
        for row in records:
            proc_id = int(row["procedimento_id"])
            current = current_rows.get(proc_id)
            if not current:
                blocked.append({"procedimento_id": proc_id, "reason": "missing_current_row"})
                raise RuntimeError(f"Registro inexistente no banco para id={proc_id}.")
            if int(current["clinica_id"]) != int(row["clinica_id"]) or int(current["tabela_id"]) != int(row["tabela_id"]) or int(current["codigo"]) != int(row["codigo"]):
                blocked.append({"procedimento_id": proc_id, "reason": "key_mismatch"})
                raise RuntimeError(f"Chave divergente para id={proc_id}.")
            current_name = str(current["nome"] or "")
            if current_name == row["nome_corrigido_proposto"]:
                already_correct += 1
                continue
            if current_name != row["nome_original"]:
                blocked.append({"procedimento_id": proc_id, "reason": "current_name_changed"})
                raise RuntimeError(f"Nome atual divergente do backup para id={proc_id}.")
            result = conn.execute(
                sql,
                {
                    "novo_nome": row["nome_corrigido_proposto"],
                    "id": proc_id,
                    "clinica_id": int(row["clinica_id"]),
                    "tabela_id": int(row["tabela_id"]),
                    "codigo": int(row["codigo"]),
                    "nome_atual": row["nome_original"],
                },
            )
            if result.rowcount != 1:
                raise RuntimeError(f"UPDATE inesperado para id={proc_id}.")
            updated += 1

    return {
        "table_id": table_id,
        "expected": expected,
        "updated": updated,
        "already_correct": already_correct,
        "blocked": blocked,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Aplica correcao de mojibake em Procedimentos apenas com backup validado.")
    parser.add_argument("--apply", action="store_true", help="Obrigatorio para permitir execucao.")
    parser.add_argument("--table-id", required=True, type=int, choices=sorted(ALLOWED_TABLE_CODES))
    parser.add_argument("--backup-json", required=True)
    parser.add_argument("--expected-count", type=int)
    parser.add_argument("--expected-clinica", type=int)
    parser.add_argument("--expected-hash")
    parser.add_argument("--validate-only", action="store_true", help="Valida backup e regras sem executar UPDATE.")
    args = parser.parse_args()

    if not args.apply and not args.validate_only:
        raise SystemExit("Recusa: use --apply explicitamente para permitir execucao.")

    backup = _load_backup(Path(args.backup_json))
    _validate_expected_context(backup, args.expected_count, args.expected_clinica, args.expected_hash)
    if args.validate_only:
        print(
            json.dumps(
                {
                    "table_id": args.table_id,
                    "validate_only": True,
                    "records": len([r for r in backup["records"] if int(r["tabela_codigo"]) == args.table_id]),
                    "status": "validated",
                },
                ensure_ascii=False,
                indent=2,
            )
        )
        return
    result = apply_backup(args.table_id, backup)
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
