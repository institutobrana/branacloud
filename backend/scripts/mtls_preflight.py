"""Read-only preflight for the isolated operational mTLS channel.

No DDL, DML, migrations, registry files, or automatic schema creation are
performed. The database URL is accepted only through a protected process
environment or an explicit process argument and is never printed.
"""
from __future__ import annotations

import argparse
import os
import sys
from pathlib import Path

from sqlalchemy import create_engine, inspect, text

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

TABLES = {
    "bridge_installations": {
        "installation_id", "certificate_der_sha256", "status", "generation",
        "valid_from", "valid_to", "registered_at", "revoked_at", "rotated_at",
    },
    "bridge_installation_events": {
        "installation_id", "event_type", "generation", "occurred_at", "detail_code",
    },
}


def _database_url(explicit: str | None) -> str:
    if explicit:
        return explicit
    from services.env_loading_service import load_backend_env
    from services.database_url_service import resolve_database_url
    load_backend_env(BACKEND_DIR / ".env")
    return resolve_database_url(os.environ)


def run(database_url: str) -> int:
    engine = create_engine(database_url, pool_pre_ping=True)
    try:
        inspector = inspect(engine)
        report = {"tables": {}, "active_installations": None, "duplicates": {}}
        missing = sorted(set(TABLES) - set(inspector.get_table_names()))
        if missing:
            print("MTLS_PREFLIGHT=BLOCKED")
            print({"missing_tables": missing})
            return 2
        with engine.connect() as connection:
            for table, required_columns in TABLES.items():
                columns = {column["name"] for column in inspector.get_columns(table)}
                missing_columns = sorted(required_columns - columns)
                report["tables"][table] = {
                    "missing_columns": missing_columns,
                    "row_count": int(connection.execute(text(f"SELECT COUNT(*) FROM {table}")).scalar_one()),
                }
            report["active_installations"] = int(connection.execute(text(
                "SELECT COUNT(*) FROM bridge_installations WHERE status='ACTIVE'"
            )).scalar_one())
            report["duplicates"]["installation_id"] = int(connection.execute(text(
                "SELECT COUNT(*) FROM (SELECT installation_id FROM bridge_installations GROUP BY installation_id HAVING COUNT(*) > 1) d"
            )).scalar_one())
            report["duplicates"]["certificate_der_sha256"] = int(connection.execute(text(
                "SELECT COUNT(*) FROM (SELECT certificate_der_sha256 FROM bridge_installations GROUP BY certificate_der_sha256 HAVING COUNT(*) > 1) d"
            )).scalar_one())
        incompatible = [table for table, data in report["tables"].items() if data["missing_columns"]]
        if incompatible or report["duplicates"]["installation_id"] or report["duplicates"]["certificate_der_sha256"]:
            print("MTLS_PREFLIGHT=BLOCKED")
            print(report)
            return 2
        print("MTLS_PREFLIGHT=PASS")
        print(report)
        return 0
    finally:
        engine.dispose()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Read-only isolated mTLS schema preflight")
    parser.add_argument("--database-url")
    args = parser.parse_args()
    raise SystemExit(run(_database_url(args.database_url)))
