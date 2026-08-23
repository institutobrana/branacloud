from __future__ import annotations

import json
import os
import sys
import unittest
from datetime import datetime, timedelta
from types import SimpleNamespace
from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy import text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

os.environ['DATABASE_URL'] = 'sqlite+pysqlite:///:memory:'
os.environ['JWT_SECRET_KEY'] = 'test-secret-key-agenda-legado-config'

from models.clinica import Clinica  # noqa: E402
from models.model_registry import import_all_models  # noqa: E402
from models.prestador_odonto import PrestadorOdonto  # noqa: E402
from routes.agenda_legado_routes import (  # noqa: E402
    _load_prestador_agenda_record,
    salvar_prestador_agenda_config,
)


class AgendaLegadoPrestadorSystemConfigTests(unittest.TestCase):
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
        PrestadorOdonto.__table__.create(self.engine)
        now = datetime.utcnow() + timedelta(days=30)
        self.db.execute(
            text(
                "INSERT INTO clinicas (id, nome, email, trial_ate, ativo, tipo_conta, nome_tabela_procedimentos) VALUES (1, 'Clinica Teste', 'teste@brana.test', :trial_ate, 1, 'DEMO 7 dias', 'Tabela')"
            ),
            {"trial_ate": now},
        )
        self.db.execute(
            text(
                "INSERT INTO prestador_odonto (id, clinica_id, source_id, codigo, nome, is_system_prestador, agenda_config_json, inativo, executa_procedimento) VALUES (255, 1, 255, '001', 'Clínica', 1, :cfg, 0, 1)"
            ),
            {
                "cfg": json.dumps(
                    {
                        'manha_inicio': '08:00',
                        'apresentacao_fonte': {'family': 'MS Sans Serif', 'size': 8},
                    },
                    ensure_ascii=False,
                )
            },
        )
        self.db.commit()

    def tearDown(self):
        self.db.close()
        self.engine.dispose()

    def test_agenda_config_specific_route_reads_system_prestador(self):
        current_user = SimpleNamespace(clinica_id=1)
        result = _load_prestador_agenda_record(self.db, 1, 255)
        self.assertEqual(result['id'], 255)
        self.assertTrue(result['is_system_prestador'])
        self.assertEqual(result['agenda_config']['manha_inicio'], '08:00')
        self.assertEqual(result['agenda_config']['apresentacao_fonte']['family'], 'MS Sans Serif')

    def test_agenda_config_specific_route_saves_system_prestador(self):
        current_user = SimpleNamespace(clinica_id=1)
        response = salvar_prestador_agenda_config(
            255,
            {'agenda_config': {'manha_inicio': '09:00', 'apresentacao_fonte': {'family': 'Arial', 'size': 10}}},
            current_user=current_user,
            db=self.db,
        )
        self.assertEqual(response['id'], 255)
        self.assertEqual(response['agenda_config']['manha_inicio'], '09:00')
        self.assertEqual(response['agenda_config']['apresentacao_fonte']['family'], 'Arial')
        row = self.db.execute(text("SELECT agenda_config_json FROM prestador_odonto WHERE id = 255")).first()
        self.assertIsNotNone(row)
        cfg = json.loads(row[0] or '{}')
        self.assertEqual(cfg['manha_inicio'], '09:00')


if __name__ == '__main__':
    unittest.main()
