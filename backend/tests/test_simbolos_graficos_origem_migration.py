import os
import sys
from pathlib import Path
import unittest

from sqlalchemy import create_engine, text


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

os.environ.setdefault("DATABASE_URL", "sqlite+pysqlite:///:memory:")
os.environ.setdefault("JWT_SECRET_KEY", "test-secret-key-for-symbols-tests")

from scripts import migrar_simbolos_graficos_origem


class SimbolosGraficosOrigemMigrationTests(unittest.TestCase):
    def test_upgrade_and_downgrade_are_idempotent_and_non_destructive(self):
        engine = create_engine("sqlite+pysqlite:///:memory:")
        with engine.begin() as conn:
            conn.execute(text("CREATE TABLE simbolo_grafico_catalogo (id INTEGER PRIMARY KEY, codigo TEXT NOT NULL)"))
            conn.execute(text("INSERT INTO simbolo_grafico_catalogo (id, codigo) VALUES (1, 'sim_1.bmp')"))

        original_engine = migrar_simbolos_graficos_origem.engine
        migrar_simbolos_graficos_origem.engine = engine
        try:
            migrar_simbolos_graficos_origem.upgrade()
            migrar_simbolos_graficos_origem.upgrade()
            with engine.connect() as conn:
                columns = {col["name"]: col for col in migrar_simbolos_graficos_origem.inspect(conn).get_columns("simbolo_grafico_catalogo")}
                value = conn.execute(text("SELECT origem FROM simbolo_grafico_catalogo WHERE id = 1")).scalar_one()
            self.assertIn("origem", columns)
            self.assertTrue(columns["origem"]["nullable"])
            self.assertIsNone(value)

            migrar_simbolos_graficos_origem.downgrade()
            migrar_simbolos_graficos_origem.downgrade()
            with engine.connect() as conn:
                columns_after = {col["name"] for col in migrar_simbolos_graficos_origem.inspect(conn).get_columns("simbolo_grafico_catalogo")}
                codigo = conn.execute(text("SELECT codigo FROM simbolo_grafico_catalogo WHERE id = 1")).scalar_one()
            self.assertNotIn("origem", columns_after)
            self.assertEqual(codigo, "sim_1.bmp")
        finally:
            migrar_simbolos_graficos_origem.engine = original_engine


if __name__ == "__main__":
    unittest.main()
