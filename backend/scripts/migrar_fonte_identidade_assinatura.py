"""Migration aditiva e idempotente para a fonte da identidade de assinatura.

Executar somente após validar DATABASE_URL e o plano de migração. Este arquivo
não é importado pelo boot e não é executado automaticamente.
"""
import argparse
import os
import sys
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from sqlalchemy import create_engine, inspect, text
from services.env_loading_service import load_backend_env
from services.database_url_service import resolve_database_url


def get_engine(database_url=None):
    if database_url:
        return create_engine(database_url)
    load_backend_env(Path(__file__).resolve().parents[1] / ".env")
    return create_engine(resolve_database_url(os.environ))


def migrate(engine):
    with engine.begin() as conn:
        for table in ("signature_authorizations", "signature_reservation_requests"):
            exists = conn.execute(text("SELECT to_regclass(:name)"), {"name": table}).scalar()
            if not exists:
                raise RuntimeError(f"{table}: tabela ausente; migration parcial recusada")
            conn.execute(text(f"ALTER TABLE {table} ADD COLUMN IF NOT EXISTS certificate_source VARCHAR(32) NOT NULL DEFAULT 'WINDOWS_STORE'"))
            constraint = f"{table}_certificate_source_ck"
            present = conn.execute(text("SELECT 1 FROM pg_constraint WHERE conname = :name"), {"name": constraint}).scalar()
            if not present:
                conn.execute(text(f"ALTER TABLE {table} ADD CONSTRAINT {constraint} CHECK (certificate_source IN ('WINDOWS_STORE','FILE_PKCS12'))"))
    return True


def check(engine):
    inspector = inspect(engine)
    result = {}
    for table in ("signature_authorizations", "signature_reservation_requests"):
        if not inspector.has_table(table):
            result[table] = {"exists": False, "action": "CREATE_TABLE_OR_ABORT"}
            continue
        columns = {column["name"] for column in inspector.get_columns(table)}
        result[table] = {
            "exists": True,
            "certificate_source": "certificate_source" in columns,
            "missing": sorted({"certificate_source"} - columns),
            "action": "NO_DDL" if "certificate_source" in columns else "ADD_COLUMN_AND_CHECK_CONSTRAINT",
        }
    print("MIGRATION_DRY_RUN=PASS")
    print(result)
    return result


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true")
    parser.add_argument("--database-url")
    args = parser.parse_args()
    engine = get_engine(args.database_url)
    try:
        check(engine) if args.check else migrate(engine)
    finally:
        engine.dispose()
