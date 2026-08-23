from __future__ import annotations

import os
import sys
from pathlib import Path
import unittest

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

os.environ.setdefault("JWT_SECRET_KEY", "test-secret-key-credenciamentos-contract")

from routes.prestadores_routes import (  # noqa: E402
    _normalizar_valor_us,
    _proximo_codigo_credenciamento,
)


class _Query:
    def filter(self, *_args, **_kwargs):
        return self

    def all(self):
        return [("0001",), ("0002",), (None,)]


class _Db:
    def __init__(self):
        self.lock_params = None

    def execute(self, _statement, params):
        self.lock_params = params

    def query(self, _column):
        return _Query()


class CredenciamentosContractTests(unittest.TestCase):
    def test_normalizar_valor_us_aceita_formatos_validos(self):
        cases = {
            None: None,
            "": None,
            "1": "1,0000",
            "1,0": "1,0000",
            "1,0000": "1,0000",
            "0,5": "0,5000",
            "1.25": "1,2500",
            "0": "0,0000",
        }
        for value, expected in cases.items():
            with self.subTest(value=value):
                self.assertEqual(_normalizar_valor_us(value), expected)

    def test_normalizar_valor_us_rejeita_formato_invalido(self):
        for value in ("1,00001", "abc", "-1", "nan", "inf"):
            with self.subTest(value=value):
                with self.assertRaises(Exception):
                    _normalizar_valor_us(value)

    def test_codigo_credenciamento_e_sequencial_por_clinica(self):
        db = _Db()
        self.assertEqual(_proximo_codigo_credenciamento(db, 7), "0003")
        self.assertEqual(db.lock_params, {"lock_key": 2000007})


if __name__ == "__main__":
    unittest.main()
