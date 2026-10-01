"""Migration aditiva idempotente para vínculos usuário--certificado.

Uso: backend/.venv/Scripts/python.exe backend/scripts/migrar_usuarios_certificados.py
Não contém dados de certificado; armazena somente SHA-256 do DER público.
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


EXPECTED_COLUMNS = {
    "id": ("integer", None, "NO"),
    "clinica_id": ("integer", None, "NO"),
    "titular_user_id": ("integer", None, "NO"),
    "criado_por_user_id": ("integer", None, "NO"),
    "revogado_por_user_id": ("integer", None, "YES"),
    "certificado_der_sha256": ("character varying", 64, "NO"),
    "certificate_source": ("character varying", 32, "NO"),
    "certificate_der": ("bytea", None, "YES"),
    "certificate_subject": ("character varying", 512, "YES"),
    "certificate_issuer": ("character varying", 512, "YES"),
    "certificate_serial": ("character varying", 128, "YES"),
    "certificate_valid_from": ("timestamp with time zone", None, "YES"),
    "certificate_valid_to": ("timestamp with time zone", None, "YES"),
    "status": ("character varying", 16, "NO"),
    "tentativas_falhas": ("integer", None, "NO"),
    "janela_falhas_inicio_em": ("timestamp with time zone", None, "YES"),
    "bloqueado_ate_em": ("timestamp with time zone", None, "YES"),
    "criado_em": ("timestamp with time zone", None, "NO"),
    "ativado_em": ("timestamp with time zone", None, "YES"),
    "revogado_em": ("timestamp with time zone", None, "YES"),
}
EXPECTED_FKS = {
    ("clinica_id", "clinicas", "id"),
    ("titular_user_id", "usuarios", "id"),
    ("criado_por_user_id", "usuarios", "id"),
    ("revogado_por_user_id", "usuarios", "id"),
}


def _validate_existing(conn, expected=EXPECTED_COLUMNS):
    rows = conn.execute(text("""
        SELECT column_name, data_type, character_maximum_length, is_nullable
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'usuarios_certificados'
    """)).fetchall()
    actual = {row[0]: (row[1], row[2], row[3]) for row in rows}
    if actual != expected:
        raise RuntimeError("usuarios_certificados existe, mas o DDL de colunas é incompatível")

    fk_rows = conn.execute(text("""
        SELECT kcu.column_name, ccu.table_name, ccu.column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage ccu
          ON ccu.constraint_name = tc.constraint_name AND ccu.table_schema = tc.table_schema
        WHERE tc.table_schema = 'public'
          AND tc.table_name = 'usuarios_certificados'
          AND tc.constraint_type = 'FOREIGN KEY'
    """)).fetchall()
    if set(fk_rows) != EXPECTED_FKS:
        raise RuntimeError("usuarios_certificados existe, mas as FKs são incompatíveis")

    index_def = conn.execute(text("""
        SELECT indexdef FROM pg_indexes
        WHERE schemaname = 'public' AND indexname = 'uq_usuario_certificado_ativo'
    """)).scalar()
    if not index_def or "WHERE" not in index_def or "status" not in index_def or "ACTIVE" not in index_def:
        raise RuntimeError("usuarios_certificados existe sem índice parcial de unicidade ACTIVE")


def get_engine(database_url=None):
    if database_url:
        return create_engine(database_url)
    load_backend_env(BACKEND_DIR / ".env")
    return create_engine(resolve_database_url(os.environ))


def check(engine):
    inspector = inspect(engine)
    if not inspector.has_table("usuarios_certificados"):
        print("MIGRATION_DRY_RUN=PASS")
        print("usuarios_certificados: missing; planned_action=CREATE_TABLE")
        return
    columns = {c["name"] for c in inspector.get_columns("usuarios_certificados")}
    missing = sorted(set(EXPECTED_COLUMNS) - columns)
    print("MIGRATION_DRY_RUN=PASS")
    print(f"usuarios_certificados: missing={missing}; planned_action=NO_DDL")


def migrate(engine):
    with engine.begin() as conn:
        exists = conn.execute(text("""
            SELECT 1 FROM information_schema.tables
            WHERE table_schema = 'public' AND table_name = 'usuarios_certificados'
        """)).scalar()
        if exists:
            _validate_existing(conn)
            print("usuarios_certificados: tabela existente validada; nenhuma alteração aplicada")
            return False
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS usuarios_certificados (
                id SERIAL PRIMARY KEY,
                clinica_id INTEGER NOT NULL REFERENCES clinicas(id),
                titular_user_id INTEGER NOT NULL REFERENCES usuarios(id),
                criado_por_user_id INTEGER NOT NULL REFERENCES usuarios(id),
                revogado_por_user_id INTEGER NULL REFERENCES usuarios(id),
                certificado_der_sha256 VARCHAR(64) NOT NULL,
                certificate_source VARCHAR(32) NOT NULL DEFAULT 'WINDOWS_STORE',
                certificate_der BYTEA NULL,
                certificate_subject VARCHAR(512) NULL,
                certificate_issuer VARCHAR(512) NULL,
                certificate_serial VARCHAR(128) NULL,
                certificate_valid_from TIMESTAMPTZ NULL,
                certificate_valid_to TIMESTAMPTZ NULL,
                status VARCHAR(16) NOT NULL DEFAULT 'PENDING',
                tentativas_falhas INTEGER NOT NULL DEFAULT 0,
                janela_falhas_inicio_em TIMESTAMPTZ NULL,
                bloqueado_ate_em TIMESTAMPTZ NULL,
                criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                ativado_em TIMESTAMPTZ NULL,
                revogado_em TIMESTAMPTZ NULL
            )
        """))
        conn.execute(text("CREATE INDEX IF NOT EXISTS ix_usuarios_certificados_clinica_id ON usuarios_certificados (clinica_id)"))
        conn.execute(text("CREATE INDEX IF NOT EXISTS ix_usuarios_certificados_titular_user_id ON usuarios_certificados (titular_user_id)"))
        conn.execute(text("CREATE INDEX IF NOT EXISTS ix_usuarios_certificados_status ON usuarios_certificados (status)"))
        conn.execute(text("ALTER TABLE usuarios_certificados ADD CONSTRAINT ck_usuario_certificado_source CHECK (certificate_source IN ('WINDOWS_STORE','FILE_PKCS12'))"))
        conn.execute(text("""
            CREATE UNIQUE INDEX IF NOT EXISTS uq_usuario_certificado_ativo
            ON usuarios_certificados (clinica_id, titular_user_id, certificado_der_sha256, certificate_source)
            WHERE status = 'ACTIVE'
        """))
    return True


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true")
    parser.add_argument("--database-url")
    args = parser.parse_args()
    engine = get_engine(args.database_url)
    if args.check:
        check(engine)
        engine.dispose()
        raise SystemExit(0)
    changed = migrate(engine)
    engine.dispose()
    if changed:
        print("usuarios_certificados: migration aplicada")
