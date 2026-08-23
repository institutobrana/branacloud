from __future__ import annotations

import json
import os
import sys
import unittest
from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from datetime import datetime, timedelta

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

os.environ['DATABASE_URL'] = 'sqlite+pysqlite:///:memory:'
os.environ['JWT_SECRET_KEY'] = 'test-secret-key-agenda-config'

from models.clinica import Clinica  # noqa: E402
from models.model_registry import import_all_models  # noqa: E402
from models.prestador_odonto import PrestadorOdonto  # noqa: E402
from models.usuario import Usuario  # noqa: E402
from models.unidade_atendimento import UnidadeAtendimento  # noqa: E402
from routes.prestadores_routes import PrestadorPayload, _apply_prestador_payload  # noqa: E402


class PrestadoresAgendaConfigPersistenceTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        import_all_models()

    def setUp(self):
        self.engine = create_engine(
            'sqlite+pysqlite:///:memory:',
            connect_args={'check_same_thread': False},
            poolclass=StaticPool,
        )
        self.Session = sessionmaker(bind=self.engine)
        self.db = self.Session()
        Clinica.__table__.create(self.engine)
        UnidadeAtendimento.__table__.create(self.engine)
        Usuario.__table__.create(self.engine)
        PrestadorOdonto.__table__.create(self.engine)
        self.db.add(
                Clinica(
                    id=1,
                    nome='Clinica Teste',
                    email='teste@brana.test',
                    ativo=True,
                    trial_ate=datetime.utcnow() + timedelta(days=30),
                    nome_tabela_procedimentos='Tabela',
                )
        )
        self.db.commit()

    def tearDown(self):
        self.db.close()
        self.engine.dispose()

    def test_apply_prestador_payload_preserva_agenda_config_json(self):
        item = PrestadorOdonto(
            clinica_id=1,
            source_id=10,
            codigo='001',
            nome='Prestador Teste',
        )
        payload = PrestadorPayload(
            nome='Prestador Teste',
            agenda_config={
                'manha_inicio': '08:00',
                'apresentacao_fonte': {'family': 'Arial', 'size': 10},
                'campo_legado_desconhecido': 'preservar',
            },
        )

        _apply_prestador_payload(item, payload)

        cfg = json.loads(item.agenda_config_json or '{}')
        self.assertEqual(cfg['manha_inicio'], '08:00')
        self.assertEqual(cfg['apresentacao_fonte']['family'], 'Arial')
        self.assertEqual(cfg['campo_legado_desconhecido'], 'preservar')


if __name__ == '__main__':
    unittest.main()
