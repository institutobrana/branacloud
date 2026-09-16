"""Migration manual para adicionar simbolo_grafico_catalogo.origem.

Uso:
    python backend/scripts/migrar_simbolos_graficos_origem.py
    python backend/scripts/migrar_simbolos_graficos_origem.py --downgrade

Notas:
- O upgrade adiciona apenas uma coluna nullable.
- Nao ha default nem backfill nesta fase.
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

MIGRATION_ID = "simbolos_graficos_origem_20260803"


def _has_column(conn, table_name: str, column_name: str) -> bool:
    return any(col["name"] == column_name for col in inspect(conn).get_columns(table_name))


def upgrade() -> None:
    with engine.begin() as conn:
        if _has_column(conn, "simbolo_grafico_catalogo", "origem"):
            return
        if conn.dialect.name == "sqlite":
            conn.execute(text("ALTER TABLE simbolo_grafico_catalogo ADD COLUMN origem VARCHAR(40)"))
            return
        conn.execute(
            text(
                "ALTER TABLE simbolo_grafico_catalogo "
                "ADD COLUMN IF NOT EXISTS origem VARCHAR(40)"
            )
        )


def downgrade() -> None:
    with engine.begin() as conn:
        if not _has_column(conn, "simbolo_grafico_catalogo", "origem"):
            return
        if conn.dialect.name == "sqlite":
            conn.execute(text("ALTER TABLE simbolo_grafico_catalogo DROP COLUMN origem"))
            return
        conn.execute(text("ALTER TABLE simbolo_grafico_catalogo DROP COLUMN IF EXISTS origem"))


def main() -> None:
    parser = argparse.ArgumentParser(description="Adiciona/remove simbolo_grafico_catalogo.origem.")
    parser.add_argument("--downgrade", action="store_true", help="Remove a coluna origem.")
    args = parser.parse_args()
    if args.downgrade:
        downgrade()
        print(f"[simbolos-graficos] Downgrade aplicado: {MIGRATION_ID}.")
        return
    upgrade()
    print(f"[simbolos-graficos] Upgrade aplicado: {MIGRATION_ID}.")


if __name__ == "__main__":
    main()
