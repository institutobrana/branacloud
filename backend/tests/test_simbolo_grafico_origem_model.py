import os
import sys
from pathlib import Path
import unittest


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

os.environ.setdefault("DATABASE_URL", "sqlite+pysqlite:///:memory:")
os.environ.setdefault("JWT_SECRET_KEY", "test-secret-key-for-symbols-tests")

from models.simbolo_grafico import SimboloGrafico


class SimboloGraficoOrigemModelTests(unittest.TestCase):
    def test_model_has_origem_column(self):
        self.assertTrue(hasattr(SimboloGrafico, "origem"))

    def test_origem_is_nullable_string_without_default(self):
        column = SimboloGrafico.origem.property.columns[0]
        self.assertTrue(column.nullable)
        self.assertEqual(column.type.length, 40)
        self.assertIsNone(column.default)
        self.assertIsNone(column.server_default)

    def test_model_keeps_existing_core_fields(self):
        self.assertTrue(hasattr(SimboloGrafico, "clinica_id"))
        self.assertTrue(hasattr(SimboloGrafico, "legacy_id"))
        self.assertTrue(hasattr(SimboloGrafico, "imagem_custom"))
        self.assertTrue(hasattr(SimboloGrafico, "ativo"))


if __name__ == "__main__":
    unittest.main()
