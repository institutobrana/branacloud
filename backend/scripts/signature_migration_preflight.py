"""Read-only preflight for signature schema migrations.

The script only uses information_schema/pg_catalog and aggregate counts.  It
never executes DDL or DML; credentials are resolved from backend/.env in
memory and are never printed.
"""
import argparse
import os
import sys
from pathlib import Path

from sqlalchemy import create_engine, inspect, text

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))
from services.env_loading_service import load_backend_env
from services.database_url_service import resolve_database_url

TABLES = (
    "usuarios_certificados",
    "signature_reservation_requests",
    "signature_authorizations",
)


def get_engine(database_url=None):
    if database_url:
        return create_engine(database_url)
    load_backend_env(BACKEND_DIR / ".env")
    return create_engine(resolve_database_url(os.environ))


def _column_view(inspector, table):
    return [
        {
            "name": c["name"],
            "type": str(c["type"]),
            "nullable": c["nullable"],
        }
        for c in inspector.get_columns(table)
    ]


def run(engine):
    inspector = inspect(engine)
    missing_tables = [t for t in TABLES if not inspector.has_table(t)]
    if missing_tables:
        print("ACTIVE_SCHEMA_READ=PASS")
        print({"missing_tables": missing_tables, "tables": {}})
        return

    report = {"tables": {}, "duplicates": {}}
    with engine.connect() as conn:
        for table in TABLES:
            indexes = inspector.get_indexes(table)
            checks = inspector.get_check_constraints(table)
            fks = inspector.get_foreign_keys(table)
            count = conn.execute(text(f"SELECT COUNT(*) FROM {table}")).scalar_one()
            report["tables"][table] = {
                "columns": _column_view(inspector, table),
                "foreign_key_count": len(fks),
                "check_names": sorted(c.get("name") for c in checks if c.get("name")),
                "index_names": sorted(i.get("name") for i in indexes if i.get("name")),
                "row_count": int(count),
            }

        # Aggregate-only duplicate checks; no row contents leave the process.
        report["duplicates"]["usuarios_certificados_active_der"] = conn.execute(text(
            "SELECT COUNT(*) FROM ("
            " SELECT clinica_id, titular_user_id, certificado_der_sha256, COUNT(*) "
            " FROM usuarios_certificados WHERE status='ACTIVE' "
            " GROUP BY clinica_id, titular_user_id, certificado_der_sha256 HAVING COUNT(*) > 1"
            ") d"
        )).scalar_one()
        report["duplicates"]["reservation_operation_id"] = conn.execute(text(
            "SELECT COUNT(*) FROM ("
            " SELECT operation_id, COUNT(*) FROM signature_reservation_requests "
            " GROUP BY operation_id HAVING COUNT(*) > 1"
            ") d"
        )).scalar_one()
        report["duplicates"]["authorization_operation_id"] = conn.execute(text(
            "SELECT COUNT(*) FROM ("
            " SELECT operation_id, COUNT(*) FROM signature_authorizations "
            " GROUP BY operation_id HAVING COUNT(*) > 1"
            ") d"
        )).scalar_one()
    print("ACTIVE_SCHEMA_READ=PASS")
    print(report)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--database-url")
    args = parser.parse_args()
    engine = get_engine(args.database_url)
    try:
        run(engine)
    finally:
        engine.dispose()
