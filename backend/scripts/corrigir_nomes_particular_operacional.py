from __future__ import annotations

import argparse
import csv
import hashlib
import json
import unicodedata
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path

from sqlalchemy import text

BACKEND_DIR = Path(__file__).resolve().parents[1]
ROOT_DIR = BACKEND_DIR.parent
if str(BACKEND_DIR) not in __import__("sys").path:
    __import__("sys").path.insert(0, str(BACKEND_DIR))

from database import engine

PREVIEW_JSON = ROOT_DIR / "docs" / "preview_correcao_textual_particular_segura.json"
PREVIEW_CSV = ROOT_DIR / "docs" / "preview_correcao_textual_particular_segura.csv"
SAFE_JSON = ROOT_DIR / "docs" / "preview_correcao_textual_particular_segura.json"
SAFE_CSV = ROOT_DIR / "docs" / "preview_correcao_textual_particular_segura.csv"
REVIEW_JSON = ROOT_DIR / "docs" / "revisao_manual_particular_divergencias_textuais.json"
REVIEW_CSV = ROOT_DIR / "docs" / "revisao_manual_particular_divergencias_textuais.csv"
DRY_RUN_JSON = ROOT_DIR / "docs" / "dry_run_correcao_nomes_particular_106.json"
DRY_RUN_CSV = ROOT_DIR / "docs" / "dry_run_correcao_nomes_particular_106.csv"
BACKUP_DIR = BACKEND_DIR / "backups"
BACKUP_JSON = BACKUP_DIR / "particular_nomes_antes_correcao_106.json"
BACKUP_CSV = BACKUP_DIR / "particular_nomes_antes_correcao_106.csv"
AUTH_DOC = ROOT_DIR / "docs" / "autorizacao_apply_correcao_nomes_particular_106.md"
PREVIEW_HASH_EXPECTED = "f826a7a949cc7028e9740a84c09921904f89ccda94cab3116551e48a586510df"
BACKUP_HASH_EXPECTED = ""
CLINICA_ID = 1
TABELA_ID = 18


@dataclass
class Record:
    id: int
    clinica_id: int
    tabela_id: int
    codigo: int
    nome_antes: str
    nome_proposto: str
    procedimento_generico_id: int | None
    data_utc: str


def _sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def _sha256_text(data: str) -> str:
    return _sha256_bytes(data.encode("utf-8"))


def _norm_text(value: object) -> str:
    return unicodedata.normalize("NFC", " ".join(str(value or "").split()).strip())


def _load_preview() -> dict:
    data = json.loads(PREVIEW_JSON.read_text(encoding="utf-8"))
    if _sha256_bytes(PREVIEW_JSON.read_bytes()) != PREVIEW_HASH_EXPECTED:
        raise RuntimeError("Hash do preview nao confere com o esperado.")
    return data


def _load_backup() -> dict:
    return json.loads(BACKUP_JSON.read_text(encoding="utf-8"))


def _validate_backup(backup: dict) -> list[dict]:
    rows = backup.get("registros") or []
    if len(rows) != 106:
        raise RuntimeError("Backup fora do total esperado de 106.")
    ids = [int(r["id"]) for r in rows]
    if len(ids) != len(set(ids)):
        raise RuntimeError("Backup contem id duplicado.")
    if any(int(r["clinica_id"]) != CLINICA_ID for r in rows):
        raise RuntimeError("Backup contem clinica divergente.")
    if any(int(r["tabela_id"]) != TABELA_ID for r in rows):
        raise RuntimeError("Backup contem tabela divergente.")
    return rows


def _load_current_rows(ids: list[int]) -> list[dict]:
    sql = text(
        """
        SELECT p.id, p.clinica_id, p.tabela_id, p.codigo, p.nome, p.procedimento_generico_id
        FROM procedimento p
        WHERE p.clinica_id = :clinica_id
          AND p.tabela_id = :tabela_id
          AND p.id = ANY(:ids)
        ORDER BY p.id
        """
    )
    with engine.connect() as conn:
        return [dict(row) for row in conn.execute(sql, {"clinica_id": CLINICA_ID, "tabela_id": TABELA_ID, "ids": ids}).mappings().all()]


def _validate_preview(preview: dict) -> list[dict]:
    rows = preview.get("registros") or []
    if len(rows) != 106:
        raise RuntimeError("Preview fora do total esperado de 106.")
    ids = [int(r["id_brana"]) for r in rows]
    if len(ids) != len(set(ids)):
        raise RuntimeError("Preview contem id duplicado.")
    if any(int(r["tabela_id"]) != TABELA_ID for r in rows):
        raise RuntimeError("Preview contem tabela_id divergente.")
    if any(int(r["codigo"]) <= 0 for r in rows):
        raise RuntimeError("Preview contem codigo invalido.")
    if any(not str(r["nome_atual"]).strip() for r in rows):
        raise RuntimeError("Preview contem nome atual vazio.")
    if any(not str(r["nome_proposto"]).strip() for r in rows):
        raise RuntimeError("Preview contem nome proposto vazio.")
    return rows


def _validate_bank_state(rows: list[dict], preview_rows: list[dict]) -> list[dict]:
    ids = [int(r["id_brana"]) for r in preview_rows]
    current = {int(r["id"]): r for r in _load_current_rows(ids)}
    report = []
    for row in preview_rows:
        current_row = current.get(int(row["id_brana"]))
        if not current_row:
            report.append({**row, "estado": "REGISTRO_AUSENTE"})
            continue
        estado = "OK"
        if int(current_row["clinica_id"]) != CLINICA_ID:
            estado = "CLINICA_DIVERGIU"
        elif int(current_row["tabela_id"]) != TABELA_ID:
            estado = "TABELA_DIVERGIU"
        elif _norm_text(current_row["nome"]) == _norm_text(row["nome_proposto"]):
            estado = "JA_CORRIGIDO"
        elif _norm_text(current_row["nome"]) != _norm_text(row["nome_atual"]):
            estado = "NOME_ATUAL_DIVERGIU"
        report.append({**row, "estado": estado})
    return report


def _fetch_by_ids(ids: list[int], conn=None) -> dict[int, dict]:
    sql = text(
        """
        SELECT p.id, p.clinica_id, p.tabela_id, p.codigo, p.nome, p.procedimento_generico_id,
               p.preco, p.custo, p.custo_lab, p.especialidade, p.simbolo_grafico,
               p.forma_cobranca, p.observacoes, p.inativo
        FROM procedimento p
        WHERE p.clinica_id = :clinica_id
          AND p.tabela_id = :tabela_id
          AND p.id = ANY(:ids)
        ORDER BY p.id
        """
    )
    if conn is None:
        with engine.connect() as connection:
            rows = connection.execute(sql, {"clinica_id": CLINICA_ID, "tabela_id": TABELA_ID, "ids": ids}).mappings().all()
    else:
        rows = conn.execute(sql, {"clinica_id": CLINICA_ID, "tabela_id": TABELA_ID, "ids": ids}).mappings().all()
    return {int(r["id"]): dict(r) for r in rows}


def _apply_rows(preview_rows: list[dict], confirm_preview_hash: str | None) -> dict:
    if confirm_preview_hash and confirm_preview_hash != PREVIEW_HASH_EXPECTED:
        raise RuntimeError("confirm-preview-hash divergente.")
    ids = [int(r["id_brana"]) for r in preview_rows]
    current = _fetch_by_ids(ids)
    if len(current) != len(preview_rows):
        raise RuntimeError("Falha na consulta dos 106 registros antes do apply.")
    planned = len(preview_rows)
    updated = 0
    ignored = 0
    errors = 0
    started_at = datetime.now(timezone.utc).isoformat()
    sql = text(
        """
        UPDATE procedimento
        SET nome = :novo_nome
        WHERE id = :id
          AND clinica_id = :clinica_id
          AND tabela_id = :tabela_id
          AND nome = :nome_atual
        """
    )
    with engine.begin() as conn:
        for row in preview_rows:
            cur = current.get(int(row["id_brana"]))
            if not cur:
                errors += 1
                raise RuntimeError(f"Registro ausente no apply: {row['id_brana']}")
            if int(cur["clinica_id"]) != CLINICA_ID or int(cur["tabela_id"]) != TABELA_ID:
                errors += 1
                raise RuntimeError(f"Escopo divergente no apply para id={row['id_brana']}")
            if _norm_text(cur["nome"]) != _norm_text(row["nome_atual"]):
                errors += 1
                raise RuntimeError(f"Nome atual divergente no apply para id={row['id_brana']}")
            if _norm_text(cur["nome"]) == _norm_text(row["nome_proposto"]):
                ignored += 1
                continue
            result = conn.execute(
                sql,
                {
                    "novo_nome": row["nome_proposto"],
                    "id": int(row["id_brana"]),
                    "clinica_id": CLINICA_ID,
                    "tabela_id": TABELA_ID,
                    "nome_atual": row["nome_atual"],
                },
            )
            if result.rowcount != 1:
                errors += 1
                raise RuntimeError(f"Rowcount inesperado para id={row['id_brana']}: {result.rowcount}")
            updated += 1

        after = _fetch_by_ids(ids, conn=conn)
        if any(_norm_text(after[int(r["id_brana"])]["nome"]) != _norm_text(r["nome_proposto"]) for r in preview_rows):
            errors += 1
            raise RuntimeError("Validacao pos-apply falhou.")

    ended_at = datetime.now(timezone.utc).isoformat()
    return {
        "started_at_utc": started_at,
        "ended_at_utc": ended_at,
        "planned": planned,
        "updated": updated,
        "validated": planned,
        "ignored": ignored,
        "errors": errors,
        "result": "commit concluido",
    }


def _rollback_rows(backup_rows: list[dict]) -> dict:
    ids = [int(r["id"]) for r in backup_rows]
    current = _fetch_by_ids(ids)
    started_at = datetime.now(timezone.utc).isoformat()
    sql = text(
        """
        UPDATE procedimento
        SET nome = :nome_antes
        WHERE id = :id
          AND clinica_id = :clinica_id
          AND tabela_id = :tabela_id
          AND nome = :nome_aplicado
        """
    )
    with engine.begin() as conn:
        for row in backup_rows:
            cur = current.get(int(row["id"]))
            if not cur:
                raise RuntimeError(f"Registro ausente no rollback: {row['id']}")
            if _norm_text(cur["nome"]) not in {_norm_text(row["nome_proposto"]), _norm_text(row["nome_antes"])}:
                raise RuntimeError(f"Nome atual divergente para rollback no id={row['id']}")
            if _norm_text(cur["nome"]) == _norm_text(row["nome_antes"]):
                continue
            result = conn.execute(
                sql,
                {
                    "nome_antes": row["nome_antes"],
                    "nome_aplicado": row["nome_proposto"],
                    "id": int(row["id"]),
                    "clinica_id": int(row["clinica_id"]),
                    "tabela_id": int(row["tabela_id"]),
                },
            )
            if result.rowcount != 1:
                raise RuntimeError(f"Rowcount inesperado no rollback para id={row['id']}: {result.rowcount}")
        after = _fetch_by_ids(ids, conn=conn)
        if any(_norm_text(after[int(r["id"])]["nome"]) != _norm_text(r["nome_antes"]) for r in backup_rows):
            raise RuntimeError("Validacao pos-rollback falhou.")
    return {"started_at_utc": started_at, "ended_at_utc": datetime.now(timezone.utc).isoformat(), "restored": len(backup_rows)}


def _build_backup_rows(validated: list[dict], generated_at_utc: str | None = None) -> list[dict]:
    now = generated_at_utc or datetime.now(timezone.utc).isoformat()
    current = {int(r["id"]): r for r in _load_current_rows([int(r["id_brana"]) for r in validated])}
    backup_rows = []
    for row in validated:
        current_row = current[int(row["id_brana"])]
        backup_rows.append(
            {
                "id": int(current_row["id"]),
                "clinica_id": int(current_row["clinica_id"]),
                "tabela_id": int(current_row["tabela_id"]),
                "codigo": int(current_row["codigo"]),
                "nome_antes": str(current_row["nome"]),
                "nome_proposto": str(row["nome_proposto"]),
                "procedimento_generico_id": current_row.get("procedimento_generico_id"),
                "data_utc": now,
                "hash_preview": PREVIEW_HASH_EXPECTED,
            }
        )
    payload = json.dumps(backup_rows, ensure_ascii=False, sort_keys=True)
    backup_hash = _sha256_text(payload)
    for row in backup_rows:
        row["hash_backup"] = backup_hash
        row["total"] = 106
    return backup_rows


def _write_backup(rows: list[dict]) -> None:
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    generated_at_utc = datetime.now(timezone.utc).isoformat()
    if BACKUP_JSON.exists():
        try:
            existing = json.loads(BACKUP_JSON.read_text(encoding="utf-8"))
            existing_rows = existing.get("registros") or []
            if existing_rows and len(existing_rows) == len(rows):
                generated_at_utc = str(existing.get("metadata", {}).get("generated_at_utc") or generated_at_utc)
        except Exception:
            pass
    backup = {
        "metadata": {
            "clinica_id": CLINICA_ID,
            "tabela_id": TABELA_ID,
            "total": len(rows),
            "hash_preview": PREVIEW_HASH_EXPECTED,
            "hash_backup": _sha256_text(json.dumps(rows, ensure_ascii=False, sort_keys=True)),
            "generated_at_utc": generated_at_utc,
        },
        "registros": rows,
    }
    BACKUP_JSON.write_text(json.dumps(backup, ensure_ascii=False, indent=2), encoding="utf-8")
    with BACKUP_CSV.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)


def _write_dry_run(report: list[dict]) -> None:
    DRY_RUN_JSON.write_text(json.dumps({"metadata": {"total": len(report)}, "registros": report}, ensure_ascii=False, indent=2), encoding="utf-8")
    with DRY_RUN_CSV.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(report[0].keys()))
        writer.writeheader()
        writer.writerows(report)


def _status(report: list[dict]) -> dict:
    estados = [row["estado"] for row in report]
    if all(e == "OK" for e in estados):
        lote = "PRONTO_PARA_APPLY"
    elif all(e == "JA_CORRIGIDO" for e in estados):
        lote = "JA_APLICADO"
    elif any(e in {"REGISTRO_AUSENTE", "CLINICA_DIVERGIU", "TABELA_DIVERGIU", "NOME_ATUAL_DIVERGIU"} for e in estados):
        lote = "DIVERGENTE"
    else:
        lote = "NAO_PRONTO"
    return {
        "total": len(report),
        "ok": estados.count("OK"),
        "nome_antigo": estados.count("OK"),
        "nome_novo": estados.count("JA_CORRIGIDO"),
        "divergente": len([e for e in estados if e != "OK"]),
        "ausentes": estados.count("REGISTRO_AUSENTE"),
        "lote": lote,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Corrige nomes da tabela PARTICULAR em modo seguro.")
    parser.add_argument("--preview", action="store_true")
    parser.add_argument("--apply", action="store_true")
    parser.add_argument("--rollback", action="store_true")
    parser.add_argument("--status", action="store_true")
    parser.add_argument("--confirm-preview-hash")
    args = parser.parse_args()

    preview = _load_preview()
    preview_rows = _validate_preview(preview)
    validated = _validate_bank_state(preview_rows, preview_rows)
    backup = _load_backup()
    backup_rows = _validate_backup(backup)

    if args.apply or args.rollback:
        if _sha256_bytes(PREVIEW_JSON.read_bytes()) != PREVIEW_HASH_EXPECTED:
            raise RuntimeError("Hash do preview nao confere.")
        if _sha256_bytes(BACKUP_JSON.read_bytes()) != "e77e57d6cb8879f4bdfabc42d91b7ee40e98532348ae7264be3f81a58cab1f3f":
            raise RuntimeError("Hash do backup nao confere.")

    if args.apply:
        result = _apply_rows(preview_rows, args.confirm_preview_hash)
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return

    if args.rollback:
        result = _rollback_rows(backup_rows)
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return

    if args.status:
        print(json.dumps(_status(validated), ensure_ascii=False, indent=2))
        return

    if args.preview or not any([args.apply, args.rollback, args.status]):
        if not BACKUP_JSON.exists():
            _write_backup(_build_backup_rows(validated))
        _write_dry_run(validated)
        print(json.dumps({"preview_total": len(preview_rows), "backup_total": len(backup_rows), "status": _status(validated)}, ensure_ascii=False, indent=2))
        return

    if args.apply:
        raise SystemExit("apply nao executado nesta etapa")
    if args.rollback:
        raise SystemExit("rollback nao executado nesta etapa")


if __name__ == "__main__":
    main()
