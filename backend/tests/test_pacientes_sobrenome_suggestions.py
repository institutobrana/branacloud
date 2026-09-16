from __future__ import annotations

import os
import sys
import unittest
from pathlib import Path
from types import SimpleNamespace

from sqlalchemy import JSON, create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

os.environ["DATABASE_URL"] = "sqlite+pysqlite:///:memory:"
os.environ["JWT_SECRET_KEY"] = "test-secret-sobrenome"

from database import Base  # noqa: E402
from models.paciente import Paciente  # noqa: E402
from routes.cadastros_routes import listar_sugestoes_por_sobrenome  # noqa: E402


class PacientesSobrenomeSuggestionsTests(unittest.TestCase):
    def setUp(self):
        engine = create_engine("sqlite+pysqlite:///:memory:", connect_args={"check_same_thread": False}, poolclass=StaticPool)
        Paciente.__table__.c.source_payload.type = JSON()
        Base.metadata.create_all(engine, tables=[Paciente.__table__])
        self.db = sessionmaker(bind=engine)()
        self.user = SimpleNamespace(clinica_id=1)
        self.db.add_all([
            Paciente(id=1, clinica_id=1, codigo=1, nome="Ana", sobrenome="Silva", nome_completo="Ana Silva"),
            Paciente(id=2, clinica_id=1, codigo=2, nome="Bruna", sobrenome="Silva Santos", nome_completo="Bruna Silva Santos"),
            Paciente(id=3, clinica_id=1, codigo=3, nome="Clara", sobrenome="Dos Santos", nome_completo="Clara Dos Santos"),
            Paciente(id=4, clinica_id=2, codigo=1, nome="Outra", sobrenome="Silva", nome_completo="Outra Silva"),
        ])
        self.db.commit()

    def tearDown(self):
        self.db.close()

    def call(self, sobrenome, limit=15):
        return listar_sugestoes_por_sobrenome(sobrenome=sobrenome, limit=limit, current_user=self.user, db=self.db)

    def test_matches_exact_case_insensitive_and_not_partial(self):
        result = self.call(" silva ")
        self.assertEqual([item["id"] for item in result], [1])

    def test_preserves_compound_surname_and_preposition(self):
        self.assertEqual([item["id"] for item in self.call("silva santos")], [2])
        self.assertEqual([item["id"] for item in self.call("DOS SANTOS")], [3])

    def test_short_or_empty_reference_returns_no_suggestions(self):
        self.assertEqual(self.call(""), [])
        self.assertEqual(self.call("A"), [])

    def test_isolates_clinic_and_returns_only_authorized_fields(self):
        result = self.call("silva", limit=20)
        self.assertTrue(all(item["id"] != 4 for item in result))
        self.assertEqual(set(result[0]), {"id", "nome_completo", "sobrenome"})

    def test_limit_is_respected(self):
        self.assertLessEqual(len(self.call("silva", limit=1)), 1)


if __name__ == "__main__":
    unittest.main()
