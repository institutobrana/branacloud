from __future__ import annotations

import os
import sys
import unittest
from datetime import datetime, timedelta
from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

os.environ['DATABASE_URL'] = 'sqlite+pysqlite:///:memory:'
os.environ['JWT_SECRET_KEY'] = 'test-secret-key-prestador-observacoes'

from models.clinica import Clinica  # noqa: E402
from models.model_registry import import_all_models  # noqa: E402
from models.prestador_odonto import PrestadorOdonto  # noqa: E402
from routes.prestadores_routes import PrestadorPayload, _apply_prestador_payload  # noqa: E402


class PrestadorObservacoesPersistenceTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        import_all_models()

    def setUp(self):
        self.engine = create_engine(
            'sqlite+pysqlite:///:memory:',
            connect_args={'check_same_thread': False},
            poolclass=StaticPool,
        )
        self.db = sessionmaker(bind=self.engine)()
        Clinica.__table__.create(self.engine)
        PrestadorOdonto.__table__.create(self.engine)
        self.db.add(Clinica(id=1, nome='Clinica Teste', email='teste@brana.test', ativo=True,
                            trial_ate=datetime.utcnow() + timedelta(days=30),
                            nome_tabela_procedimentos='Tabela'))
        self.db.commit()

    def tearDown(self):
        self.db.close()
        self.engine.dispose()

    def test_apply_preserva_quebras_e_linha_em_branco(self):
        value = 'Linha 1\nLinha 2\n\nLinha 4'
        item = PrestadorOdonto(clinica_id=1, source_id=10, codigo='001', nome='Prestador Teste')
        _apply_prestador_payload(item, PrestadorPayload(nome='Prestador Teste', observacoes=value))

        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)

        self.assertEqual(item.observacoes, value)


if __name__ == '__main__':
    unittest.main()
