"""Migration manual para registrar ultimo login bem-sucedido dos usuarios.

Uso:
    python backend/scripts/migrar_usuarios_ultimo_login_em.py
    python backend/scripts/migrar_usuarios_ultimo_login_em.py --downgrade

Notas:
- O upgrade adiciona apenas uma coluna nullable.
- Nao ha default nem backfill, para nao inventar historico.
- O downgrade remove somente a coluna criada por esta migration.
"""

import argparse
import sys
from pathlib import Path

from sqlalchemy import text

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from database import engine  # noqa: E402


def upgrade() -> None:
    with engine.begin() as conn:
        conn.execute(
            text(
                "ALTER TABLE usuarios "
                "ADD COLUMN IF NOT EXISTS ultimo_login_em TIMESTAMP WITH TIME ZONE"
            )
        )


def downgrade() -> None:
    with engine.begin() as conn:
        conn.execute(text("ALTER TABLE usuarios DROP COLUMN IF EXISTS ultimo_login_em"))


def main() -> None:
    parser = argparse.ArgumentParser(description="Adiciona/remove usuarios.ultimo_login_em.")
    parser.add_argument("--downgrade", action="store_true", help="Remove a coluna ultimo_login_em.")
    args = parser.parse_args()
    if args.downgrade:
        downgrade()
        print("[ultimo-login] Downgrade aplicado.")
        return
    upgrade()
    print("[ultimo-login] Upgrade aplicado.")


if __name__ == "__main__":
    main()
