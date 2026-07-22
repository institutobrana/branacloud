"""Migration manual para registrar ultima atividade autenticada dos usuarios.

Uso:
    python backend/scripts/migrar_usuarios_last_seen_at.py
    python backend/scripts/migrar_usuarios_last_seen_at.py --downgrade

Notas:
- O upgrade adiciona apenas uma coluna nullable.
- Nao ha default nem backfill, para nao inventar historico.
- O downgrade remove somente a coluna criada por esta migration.
"""

import argparse
import sys
from pathlib import Path

from sqlalchemy import inspect, text

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from database import engine  # noqa: E402

MIGRATION_ID = "usuarios_last_seen_at_20260722"


def _has_column(conn, table_name: str, column_name: str) -> bool:
    return any(col["name"] == column_name for col in inspect(conn).get_columns(table_name))


def upgrade() -> None:
    with engine.begin() as conn:
        if _has_column(conn, "usuarios", "last_seen_at"):
            return
        if conn.dialect.name == "sqlite":
            conn.execute(text("ALTER TABLE usuarios ADD COLUMN last_seen_at TIMESTAMP"))
            return
        conn.execute(
            text(
                "ALTER TABLE usuarios "
                "ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMP WITH TIME ZONE"
            )
        )


def downgrade() -> None:
    with engine.begin() as conn:
        if not _has_column(conn, "usuarios", "last_seen_at"):
            return
        if conn.dialect.name == "sqlite":
            conn.execute(text("ALTER TABLE usuarios DROP COLUMN last_seen_at"))
            return
        conn.execute(text("ALTER TABLE usuarios DROP COLUMN IF EXISTS last_seen_at"))


def main() -> None:
    parser = argparse.ArgumentParser(description="Adiciona/remove usuarios.last_seen_at.")
    parser.add_argument("--downgrade", action="store_true", help="Remove a coluna last_seen_at.")
    args = parser.parse_args()
    if args.downgrade:
        downgrade()
        print(f"[presence] Downgrade aplicado: {MIGRATION_ID}.")
        return
    upgrade()
    print(f"[presence] Upgrade aplicado: {MIGRATION_ID}.")


if __name__ == "__main__":
    main()
