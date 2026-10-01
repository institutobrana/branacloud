"""Additive, opt-in schema migration for the persistent mTLS registry."""
import argparse
import os
from pathlib import Path

from sqlalchemy import create_engine, inspect, text

BACKEND_DIR = Path(__file__).resolve().parents[1]


def get_engine(database_url=None):
    if database_url:
        return create_engine(database_url)
    import sys
    sys.path.insert(0, str(BACKEND_DIR))
    from services.env_loading_service import load_backend_env
    from services.database_url_service import resolve_database_url
    load_backend_env(BACKEND_DIR / ".env")
    return create_engine(resolve_database_url(os.environ))


def check(engine):
    report = schema_report(engine)
    print("MIGRATION_DRY_RUN=PASS" if not report["blocking"] else "MIGRATION_DRY_RUN=BLOCKED")
    print(report)
    return 0 if not report["blocking"] else 2


EXPECTED_CHECKS = {
    "ck_bridge_installation_status": "status IN ('ACTIVE','REVOKED')",
    "ck_bridge_installation_fingerprint": "certificate_der_sha256 ~ '^[0-9a-f]{64}$'",
}


def _checks(engine):
    inspector = inspect(engine)
    if not inspector.has_table("bridge_installations"):
        return {}
    return {item["name"]: (item.get("sqltext") or "") for item in inspector.get_check_constraints("bridge_installations") if item.get("name")}


def _check_matches(name, sqltext):
    value = sqltext.lower()
    if name == "ck_bridge_installation_status":
        return all(token in value for token in ("status", "active", "revoked")) and "not in" not in value
    if name == "ck_bridge_installation_fingerprint":
        return all(token in value for token in ("certificate_der_sha256", "0-9a-f", "64"))
    return False


def schema_report(engine):
    inspector = inspect(engine)
    names = set(inspector.get_table_names())
    missing_tables = sorted({"bridge_installations", "bridge_installation_events"} - names)
    checks = _checks(engine)
    missing_checks = sorted(set(EXPECTED_CHECKS) - set(checks))
    conflicting_checks = sorted(name for name in EXPECTED_CHECKS if name in checks and not _check_matches(name, checks[name]))
    invalid_rows = {"status": 0, "fingerprint": 0}
    if not missing_tables and inspector.has_table("bridge_installations"):
        with engine.connect() as conn:
            invalid_rows["status"] = int(conn.execute(text(
                "SELECT COUNT(*) FROM bridge_installations WHERE status NOT IN ('ACTIVE','REVOKED')"
            )).scalar_one())
            invalid_rows["fingerprint"] = int(conn.execute(text(
                "SELECT COUNT(*) FROM bridge_installations WHERE certificate_der_sha256 !~ '^[0-9a-f]{64}$'"
            )).scalar_one())
    blocking = bool(missing_tables or conflicting_checks or any(invalid_rows.values()))
    return {
        "missing_tables": missing_tables,
        "checks": checks,
        "missing_checks": missing_checks,
        "conflicting_checks": conflicting_checks,
        "invalid_rows": invalid_rows,
        "planned_action": "NO_DDL",
        "blocking": blocking,
    }


def migrate(engine):
    inspector = inspect(engine)
    names = set(inspector.get_table_names())
    if names.intersection({"bridge_installations", "bridge_installation_events"}) and not {"bridge_installations", "bridge_installation_events"}.issubset(names):
        raise RuntimeError("BRIDGE_INSTALLATION_SCHEMA_PARTIAL")
    report = schema_report(engine)
    if report["conflicting_checks"]:
        raise RuntimeError("BRIDGE_INSTALLATION_CHECK_CONFLICT:" + ",".join(report["conflicting_checks"]))
    if any(report["invalid_rows"].values()):
        raise RuntimeError("BRIDGE_INSTALLATION_ROWS_INCOMPATIBLE")
    with engine.begin() as conn:
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS bridge_installations (
                id SERIAL PRIMARY KEY,
                installation_id VARCHAR(128) NOT NULL UNIQUE,
                certificate_der_sha256 VARCHAR(64) NOT NULL UNIQUE,
                status VARCHAR(16) NOT NULL DEFAULT 'ACTIVE',
                generation INTEGER NOT NULL DEFAULT 1,
                valid_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                valid_to TIMESTAMPTZ NULL,
                registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                revoked_at TIMESTAMPTZ NULL,
                rotated_at TIMESTAMPTZ NULL,
                CONSTRAINT ck_bridge_installation_status CHECK (status IN ('ACTIVE','REVOKED')),
                CONSTRAINT ck_bridge_installation_fingerprint CHECK (certificate_der_sha256 ~ '^[0-9a-f]{64}$')
            )
        """))
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS bridge_installation_events (
                id SERIAL PRIMARY KEY,
                installation_id VARCHAR(128) NOT NULL REFERENCES bridge_installations(installation_id),
                event_type VARCHAR(16) NOT NULL,
                generation INTEGER NOT NULL,
                occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                detail_code VARCHAR(80) NULL
            )
        """))
        existing_checks = _checks(engine)
        for name, definition in EXPECTED_CHECKS.items():
            if name not in existing_checks:
                conn.execute(text(f"ALTER TABLE bridge_installations ADD CONSTRAINT {name} CHECK ({definition})"))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true")
    parser.add_argument("--database-url")
    args = parser.parse_args()
    engine = get_engine(args.database_url)
    try:
        raise SystemExit(check(engine) if args.check else (migrate(engine) or 0))
    finally:
        engine.dispose()
