import os
import sys
from pathlib import Path
from types import SimpleNamespace
import unittest

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

os.environ.setdefault("DATABASE_URL", "sqlite+pysqlite:///:memory:")
os.environ.setdefault("JWT_SECRET_KEY", "test-secret-key-for-procedimentos-financeiro-tests")

from routes.procedimentos_routes import _calcular_financeiro_dashboard


class ProcedimentosFinanceiroTests(unittest.TestCase):
    def make_proc(self, **overrides):
        data = {
            "id": 1,
            "codigo": 1,
            "nome": "Procedimento teste",
            "preco": 300,
            "tempo": 45,
            "custo_lab": 0,
        }
        data.update(overrides)
        return SimpleNamespace(**data)

    def make_cenario(self, **overrides):
        data = {
            "cfpm": 2.31,
            "ir": 10,
            "cd": 20,
            "cartao": 4,
        }
        data.update(overrides)
        return SimpleNamespace(**data)

    def calcular(self, preco):
        proc = self.make_proc(preco=preco)
        cenario = self.make_cenario()
        return _calcular_financeiro_dashboard(proc, cenario, 35.225)

    def test_valor_minimo_independe_do_preco(self):
        valor_300 = self.calcular(300)
        valor_0 = self.calcular(0)
        valor_custo = self.calcular(139.18)

        self.assertAlmostEqual(valor_300["valor_minimo"], 200.412, places=3)
        self.assertAlmostEqual(valor_0["valor_minimo"], 200.412, places=3)
        self.assertAlmostEqual(valor_custo["valor_minimo"], 200.412, places=3)

    def test_cards_monetarios_continuam_dependendo_do_preco(self):
        valor_300 = self.calcular(300)
        valor_0 = self.calcular(0)
        valor_custo = self.calcular(139.18)

        self.assertEqual(valor_0["ir"], 0)
        self.assertEqual(valor_0["cd"], 0)
        self.assertEqual(valor_0["cartao"], 0)
        self.assertGreater(valor_300["ir"], valor_custo["ir"])
        self.assertGreater(valor_300["cd"], valor_custo["cd"])
        self.assertGreater(valor_300["cartao"], valor_custo["cartao"])

    def test_rendimento_continua_correto(self):
        valor_300 = self.calcular(300)
        valor_0 = self.calcular(0)
        valor_custo = self.calcular(139.18)

        self.assertAlmostEqual(valor_300["rendimento_proc"], 115.55595473324948, places=6)
        self.assertAlmostEqual(valor_0["rendimento_proc"], -100.0, places=6)
        self.assertAlmostEqual(valor_custo["rendimento_proc"], 0.0035925992455508905, places=6)


if __name__ == "__main__":
    unittest.main()
