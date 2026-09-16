from __future__ import annotations

import argparse
import csv
import hashlib
import json
import os
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from sqlalchemy import create_engine, text

BACKEND_DIR = Path(__file__).resolve().parents[1]
load_dotenv(BACKEND_DIR / ".env")
os.environ.setdefault("DATABASE_URL", "sqlite+pysqlite:///:memory:")

APPLY_ENABLED = False
EXPECTED_DATABASE = "brana_saas"
EXPECTED_SCHEMA = "public"
EXPECTED_TABLE = "simbolo_grafico_catalogo"
EXPECTED_TOTAL = 1113
ALLOWED_CATEGORIES = {"catalogo_oficial", "seed_interno", "fixture_teste", "asset_auxiliar"}
REPORT_DIR = Path("docs") / "audits"


@dataclass(frozen=True)
class ManifestValidationResult:
    ok: bool
    errors: tuple[str, ...]


def _canonical_json(data: Any) -> bytes:
    return json.dumps(data, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")


def compute_manifest_checksum(manifest: dict[str, Any]) -> str:
    payload = dict(manifest)
    payload.pop("manifest_checksum", None)
    return hashlib.sha256(_canonical_json(payload)).hexdigest()


def build_record_signature(row: dict[str, Any]) -> str:
    image_marker = "1" if str(row.get("imagem_custom") or "").strip() else "0"
    return "|".join(
        [
            str(row.get("id")),
            str(row.get("legacy_id")),
            str(row.get("clinica_id")),
            str(row.get("codigo")),
            str(row.get("descricao")),
            str(row.get("tipo_marca")),
            str(row.get("tipo_simbolo")),
            str(bool(row.get("ativo"))),
            image_marker,
        ]
    )


def load_manifest(path: str | Path) -> dict[str, Any]:
    return json.loads(Path(path).read_text(encoding="utf-8"))


def _validate_records(records: list[dict[str, Any]]) -> list[str]:
    errors: list[str] = []
    seen_ids: set[int] = set()
    totals: dict[str, int] = {}
    for record in records:
        try:
            record_id = int(record["id"])
        except Exception:
            errors.append("record_id_invalido")
            continue
        if record_id in seen_ids:
            errors.append(f"id_duplicado:{record_id}")
        seen_ids.add(record_id)
        categoria = str(record.get("origem", "")).strip()
        if categoria not in ALLOWED_CATEGORIES:
            errors.append(f"categoria_invalida:{record_id}")
        totals[categoria] = totals.get(categoria, 0) + 1
        if not record.get("signature"):
            errors.append(f"assinatura_ausente:{record_id}")
    if len(records) != len(seen_ids):
        errors.append("ids_nao_unicos")
    return errors


def validate_manifest(manifest: dict[str, Any]) -> ManifestValidationResult:
    errors: list[str] = []
    required = {"version", "source_report", "generated_at", "database", "schema", "table", "expected_total", "expected_origin_null", "category_totals", "records", "manifest_checksum"}
    missing = sorted(required - set(manifest))
    if missing:
        errors.append(f"campos_ausentes:{','.join(missing)}")
    if manifest.get("database") != EXPECTED_DATABASE:
        errors.append("database_divergente")
    if manifest.get("schema") != EXPECTED_SCHEMA:
        errors.append("schema_divergente")
    if manifest.get("table") != EXPECTED_TABLE:
        errors.append("table_divergente")
    expected_total = int(manifest.get("expected_total", -1))
    expected_origin_null = int(manifest.get("expected_origin_null", -1))
    if expected_total <= 0:
        errors.append("total_invalido")
    if expected_origin_null < 0:
        errors.append("origin_null_invalida")
    records = manifest.get("records") or []
    if not isinstance(records, list):
        errors.append("records_invalido")
    else:
        errors.extend(_validate_records(records))
    category_totals = manifest.get("category_totals") or {}
    if not isinstance(category_totals, dict):
        errors.append("category_totals_invalido")
    else:
        if any(category not in ALLOWED_CATEGORIES for category in category_totals):
            errors.append("category_invalida")
        if sum(int(value) for value in category_totals.values()) != expected_total:
            errors.append("category_totals_divergente")
    checksum = manifest.get("manifest_checksum")
    if checksum and checksum != compute_manifest_checksum(manifest):
        errors.append("checksum_invalido")
    return ManifestValidationResult(ok=not errors, errors=tuple(errors))


def open_connection():
    engine = create_engine(os.environ["DATABASE_URL"])
    return engine.connect()


def validate_environment(environment: str) -> None:
    if environment not in {"local", "hml"}:
        raise ValueError("Ambiente nao autorizado nesta fase.")


def validate_database_state(conn, expected_total: int = EXPECTED_TOTAL) -> dict[str, int]:
    row = conn.execute(
        text(
            f"SELECT COUNT(*) AS total, SUM(CASE WHEN origem IS NULL THEN 1 ELSE 0 END) AS origem_nula, "
            f"SUM(CASE WHEN origem IS NOT NULL THEN 1 ELSE 0 END) AS origem_preenchida "
            f"FROM {EXPECTED_TABLE}"
        )
    ).mappings().one()
    if int(row["total"]) != expected_total:
        raise ValueError("Total divergente.")
    if int(row["origem_preenchida"]) != 0:
        raise ValueError("Origem preenchida nao esperada.")
    return {"total": int(row["total"]), "origem_nula": int(row["origem_nula"]), "origem_preenchida": int(row["origem_preenchida"])}


def build_update_plan(manifest: dict[str, Any], current_rows: list[dict[str, Any]]) -> dict[str, Any]:
    manifest_by_id = {int(record["id"]): record for record in manifest["records"]}
    plan = []
    for row in current_rows:
        record_id = int(row["id"])
        expected = manifest_by_id.get(record_id)
        if expected is None:
            plan.append({"id": record_id, "origem_atual": row.get("origem"), "origem_planejada": None, "signature_ok": False, "acao": "conflict"})
            continue
        signature_ok = build_record_signature(row) == expected.get("signature")
        origem_atual = row.get("origem")
        if origem_atual == expected.get("origem"):
            action = "skip"
        elif origem_atual is None and signature_ok:
            action = "update"
        else:
            action = "conflict"
        plan.append({"id": record_id, "origem_atual": origem_atual, "origem_planejada": expected.get("origem"), "signature_ok": signature_ok, "acao": action})
    return {
        "planned_updates": sum(1 for item in plan if item["acao"] == "update"),
        "skips": sum(1 for item in plan if item["acao"] == "skip"),
        "conflicts": sum(1 for item in plan if item["acao"] == "conflict"),
        "records": plan,
    }


def dry_run_report(manifest: dict[str, Any], database_state: dict[str, int], plan: dict[str, Any]) -> dict[str, Any]:
    category_totals = dict(manifest["category_totals"])
    return {
        "modo": "dry-run",
        "manifesto": manifest["source_report"],
        "checksum": manifest["manifest_checksum"],
        "banco": EXPECTED_DATABASE,
        "total_esperado": manifest["expected_total"],
        "total_atual": database_state["total"],
        "origem_nula": database_state["origem_nula"],
        "origem_preenchida": database_state["origem_preenchida"],
        "planned_updates": plan["planned_updates"],
        "skips": plan["skips"],
        "conflicts": plan["conflicts"],
        "missing": 0,
        "signature_mismatches": sum(1 for item in plan["records"] if not item["signature_ok"]),
        "category_totals": category_totals,
        "duration": 0,
        "exit_status": 0 if plan["conflicts"] == 0 else 2,
    }


def optionally_apply(*_args, **_kwargs) -> None:
    if not APPLY_ENABLED:
        raise RuntimeError("Modo --apply nao autorizado na Fase G.2B.1C.1.")


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Backfill de origem de simbolos graficos")
    parser.add_argument("--manifest", required=True)
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--apply", action="store_true")
    parser.add_argument("--environment", required=True)
    parser.add_argument("--expected-database", default=EXPECTED_DATABASE)
    parser.add_argument("--expected-schema", default=EXPECTED_SCHEMA)
    parser.add_argument("--expected-table", default=EXPECTED_TABLE)
    parser.add_argument("--expected-total", type=int, default=EXPECTED_TOTAL)
    parser.add_argument("--confirm-backfill-origem", action="store_true")
    return parser.parse_args(argv)


def _load_current_rows(conn) -> list[dict[str, Any]]:
    rows = conn.execute(
        text(
            f"SELECT id, origem, legacy_id, clinica_id, codigo, descricao, tipo_marca, tipo_simbolo, imagem_custom, ativo "
            f"FROM {EXPECTED_TABLE} ORDER BY id"
        )
    ).mappings().all()
    return [dict(row) for row in rows]


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    validate_environment(args.environment)
    if args.apply:
        optionally_apply()
    manifest = load_manifest(args.manifest)
    if manifest.get("database") != args.expected_database:
        print(json.dumps({"ok": False, "errors": ["database_divergente"]}, ensure_ascii=False))
        return 2
    if manifest.get("schema") != args.expected_schema:
        print(json.dumps({"ok": False, "errors": ["schema_divergente"]}, ensure_ascii=False))
        return 2
    if manifest.get("table") != args.expected_table:
        print(json.dumps({"ok": False, "errors": ["table_divergente"]}, ensure_ascii=False))
        return 2
    if int(manifest.get("expected_total", -1)) != args.expected_total:
        print(json.dumps({"ok": False, "errors": ["total_divergente"]}, ensure_ascii=False))
        return 2
    validation = validate_manifest(manifest)
    if not validation.ok:
        print(json.dumps({"ok": False, "errors": list(validation.errors)}, ensure_ascii=False))
        return 2
    with open_connection() as conn:
        state = validate_database_state(conn, args.expected_total)
        current_rows = _load_current_rows(conn)
        plan = build_update_plan(manifest, current_rows)
    report = dry_run_report(manifest, state, plan)
    REPORT_DIR.mkdir(parents=True, exist_ok=True)
    stamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    (REPORT_DIR / f"g2b1c1_backfill_dry_run_{stamp}.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
