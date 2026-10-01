"""Aditive schema migration for public certificate identity metadata.

Existing rows are classified as WINDOWS_STORE only when the operator supplies
--compatibility-windows-existing. Without that explicit switch the migration
refuses to classify legacy rows, preventing silent PFX conversion.
This script is never run automatically and was not executed against the active DB.
"""
import argparse
import os
from sqlalchemy import create_engine, inspect, text
from pathlib import Path
import sys
BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))
from services.env_loading_service import load_backend_env
from services.database_url_service import resolve_database_url

COLS = {
    "certificate_source": "VARCHAR(32)",
    "certificate_der": "BYTEA",
    "certificate_subject": "VARCHAR(512)",
    "certificate_issuer": "VARCHAR(512)",
    "certificate_serial": "VARCHAR(128)",
    "certificate_valid_from": "TIMESTAMP WITH TIME ZONE",
    "certificate_valid_to": "TIMESTAMP WITH TIME ZONE",
}

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true")
    parser.add_argument("--compatibility-windows-existing", action="store_true")
    parser.add_argument("--database-url", default=None)
    args = parser.parse_args()
    if args.database_url:
        engine = create_engine(args.database_url)
    else:
        load_backend_env(Path(__file__).resolve().parents[1] / ".env")
        engine = create_engine(resolve_database_url(os.environ))
    inspector = inspect(engine)
    if "usuarios_certificados" not in inspector.get_table_names():
        raise SystemExit("MIGRATION_REFUSED_TABLE_MISSING")
    existing = {c["name"] for c in inspector.get_columns("usuarios_certificados")}
    if args.check:
        print("MIGRATION_DRY_RUN=PASS")
        for name in ("usuarios_certificados",):
            if not inspector.has_table(name):
                print(f"{name}: missing; planned action=CREATE_OR_ABORT")
                continue
            columns = {c["name"] for c in inspector.get_columns(name)}
            missing = sorted(set(COLS) - columns)
            print(f"{name}: missing={missing}; planned_action=NO_DDL")
        engine.dispose()
        return
    with engine.begin() as conn:
        for name, ddl in COLS.items():
            if name not in existing:
                conn.execute(text(f'ALTER TABLE usuarios_certificados ADD COLUMN {name} {ddl}'))
        null_sources = conn.execute(text("SELECT COUNT(*) FROM usuarios_certificados WHERE certificate_source IS NULL")).scalar_one() if "certificate_source" in existing else 0
        if "certificate_source" not in existing or null_sources:
            if not args.compatibility_windows_existing:
                raise SystemExit("MIGRATION_REQUIRES_EXPLICIT_WINDOWS_COMPATIBILITY")
            conn.execute(text("UPDATE usuarios_certificados SET certificate_source='WINDOWS_STORE' WHERE certificate_source IS NULL"))
        invalid = conn.execute(text("SELECT COUNT(*) FROM usuarios_certificados WHERE certificate_source IS NULL OR certificate_source NOT IN ('WINDOWS_STORE','FILE_PKCS12')")).scalar_one()
        if invalid:
            raise SystemExit("MIGRATION_REFUSED_UNKNOWN_CERTIFICATE_SOURCE")
        conn.execute(text("ALTER TABLE usuarios_certificados ALTER COLUMN certificate_source SET NOT NULL"))
        checks = inspector.get_check_constraints("usuarios_certificados")
        if not any(c.get("name") == "ck_usuario_certificado_source" for c in checks):
            conn.execute(text("ALTER TABLE usuarios_certificados ADD CONSTRAINT ck_usuario_certificado_source CHECK (certificate_source IN ('WINDOWS_STORE','FILE_PKCS12'))"))
        # Reuse the transaction connection.  The outer inspector uses another
        # connection and would wait on the ALTER TABLE lock held by this
        # transaction until statement_timeout/lock_timeout expires.
        indexes = {item["name"] for item in inspect(conn).get_indexes("usuarios_certificados")}
        if "uq_usuario_certificado_ativo" in indexes:
            conn.execute(text("DROP INDEX uq_usuario_certificado_ativo"))
        conn.execute(text("CREATE UNIQUE INDEX IF NOT EXISTS uq_usuario_certificado_ativo ON usuarios_certificados (clinica_id, titular_user_id, certificado_der_sha256, certificate_source) WHERE status = 'ACTIVE'"))
    engine.dispose()
    print("MIGRATION_APPLIED_WITH_EXPLICIT_WINDOWS_COMPATIBILITY")

if __name__ == "__main__":
    main()
