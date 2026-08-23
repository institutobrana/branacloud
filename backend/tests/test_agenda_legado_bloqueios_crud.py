from __future__ import annotations

import json
import os
import sys
import unittest
from datetime import datetime, timedelta
from pathlib import Path
from types import SimpleNamespace

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

os.environ["DATABASE_URL"] = "sqlite+pysqlite:///:memory:"
os.environ["JWT_SECRET_KEY"] = "test-secret-key-agenda-bloqueios-crud"

from models.clinica import Clinica  # noqa: E402
from models.agenda_legado import AgendaLegadoBloqueio  # noqa: E402
from models.prestador_odonto import PrestadorOdonto  # noqa: E402
from models.unidade_atendimento import UnidadeAtendimento  # noqa: E402
from models.model_registry import import_all_models  # noqa: E402
from routes.agenda_legado_routes import (  # noqa: E402
    AgendaBloqueioPayload,
    atualizar_bloqueio_prestador,
    criar_bloqueio_prestador,
    excluir_bloqueio_prestador,
    listar_bloqueios_prestador,
)


class AgendaLegadoBloqueiosCrudTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        import_all_models()

    def setUp(self):
        self.engine = create_engine(
            "sqlite+pysqlite:///:memory:",
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
        )
        self.Session = sessionmaker(bind=self.engine)
        self.db = self.Session()
        self._create_schema()
        self._seed_base()

    def tearDown(self):
        self.db.close()
        self.engine.dispose()

    def _create_schema(self):
        statements = [
            """
            CREATE TABLE clinicas (
                id INTEGER PRIMARY KEY,
                nome TEXT NOT NULL,
                email TEXT NOT NULL,
                trial_ate TEXT NOT NULL,
                ativo BOOLEAN NOT NULL DEFAULT 1,
                nome_tabela_procedimentos TEXT NOT NULL
            )
            """,
            """
            CREATE TABLE prestador_odonto (
                id INTEGER PRIMARY KEY,
                clinica_id INTEGER NOT NULL,
                source_id INTEGER NOT NULL,
                usuario_id INTEGER NULL,
                codigo TEXT NULL,
                nome TEXT NOT NULL,
                apelido TEXT NULL,
                tipo_prestador TEXT NULL,
                data_inicio TEXT NULL,
                data_termino TEXT NULL,
                inativo BOOLEAN NOT NULL DEFAULT 0,
                executa_procedimento BOOLEAN NOT NULL DEFAULT 1,
                is_system_prestador BOOLEAN NOT NULL DEFAULT 0,
                agenda_config_json TEXT NULL
            )
            """,
            """
            CREATE TABLE unidade_atendimento (
                id INTEGER PRIMARY KEY,
                clinica_id INTEGER NOT NULL,
                source_id INTEGER NOT NULL,
                codigo TEXT NULL,
                nome TEXT NOT NULL,
                inativo BOOLEAN NOT NULL DEFAULT 0,
                qtd_sala INTEGER NOT NULL DEFAULT 0
            )
            """,
            """
            CREATE TABLE agenda_legado_bloqueio (
                id INTEGER PRIMARY KEY,
                clinica_id INTEGER NOT NULL,
                id_bloqueio INTEGER NOT NULL,
                id_prestador INTEGER NOT NULL,
                id_unidade INTEGER NOT NULL,
                dia_sem INTEGER NOT NULL,
                data_ini TEXT NOT NULL,
                data_fin TEXT NULL,
                hora_ini INTEGER NOT NULL,
                hora_fin INTEGER NOT NULL,
                msg_agenda TEXT NULL
            )
            """,
        ]
        for statement in statements:
            self.db.execute(text(statement))
        self.db.commit()

    def _seed_base(self):
        now = datetime.utcnow() + timedelta(days=30)
        self.db.execute(
            text(
                "INSERT INTO clinicas (id, nome, email, trial_ate, ativo, nome_tabela_procedimentos) VALUES (1, 'Clinica Teste', 'teste@brana.test', :trial_ate, 1, 'Tabela')"
            ),
            {"trial_ate": now},
        )
        self.db.execute(
            text(
                "INSERT INTO clinicas (id, nome, email, trial_ate, ativo, nome_tabela_procedimentos) VALUES (2, 'Outra Clinica', 'outra@brana.test', :trial_ate, 1, 'Tabela')"
            ),
            {"trial_ate": now},
        )
        self.db.execute(
            text(
                "INSERT INTO prestador_odonto (id, clinica_id, source_id, codigo, nome, is_system_prestador, agenda_config_json, inativo, executa_procedimento) VALUES (255, 1, 255, '001', 'Clínica', 1, :cfg, 0, 1)"
            ),
            {"cfg": json.dumps({"manha_inicio": "07:00"}, ensure_ascii=False)},
        )
        self.db.execute(
            text(
                "INSERT INTO prestador_odonto (id, clinica_id, source_id, codigo, nome, is_system_prestador, agenda_config_json, inativo, executa_procedimento) VALUES (300, 1, 300, '002', 'Gleisson Tel', 0, :cfg, 0, 1)"
            ),
            {"cfg": json.dumps({"manha_inicio": "08:00"}, ensure_ascii=False)},
        )
        self.db.execute(
            text(
                "INSERT INTO prestador_odonto (id, clinica_id, source_id, codigo, nome, is_system_prestador, agenda_config_json, inativo, executa_procedimento) VALUES (400, 2, 400, '003', 'Outro', 0, :cfg, 0, 1)"
            ),
            {"cfg": json.dumps({"manha_inicio": "09:00"}, ensure_ascii=False)},
        )
        self.db.execute(
            text(
                "INSERT INTO unidade_atendimento (id, clinica_id, source_id, codigo, nome, inativo, qtd_sala) VALUES (10, 1, 10, 'U1', 'Unidade Principal', 0, 1)"
            )
        )
        self.db.execute(
            text(
                "INSERT INTO unidade_atendimento (id, clinica_id, source_id, codigo, nome, inativo, qtd_sala) VALUES (11, 2, 11, 'U2', 'Outra Unidade', 0, 1)"
            )
        )
        self.db.commit()

    def _user(self, clinica_id: int = 1):
        return SimpleNamespace(id=1, clinica_id=clinica_id, is_admin=True)

    def test_get_list_returns_only_clinic_bloqueios(self):
        self.db.add(
            AgendaLegadoBloqueio(
                clinica_id=1,
                id_bloqueio=1,
                id_prestador=255,
                id_unidade=10,
                dia_sem=1,
                data_ini=datetime(2026, 1, 1),
                data_fin=None,
                hora_ini=800,
                hora_fin=900,
                msg_agenda="A",
            )
        )
        self.db.add(
            AgendaLegadoBloqueio(
                clinica_id=2,
                id_bloqueio=1,
                id_prestador=400,
                id_unidade=11,
                dia_sem=1,
                data_ini=datetime(2026, 1, 1),
                data_fin=None,
                hora_ini=1000,
                hora_fin=1100,
                msg_agenda="B",
            )
        )
        self.db.commit()

        rows = listar_bloqueios_prestador(255, current_user=self._user(), db=self.db)
        self.assertEqual(len(rows), 1)
        self.assertEqual(rows[0]["id_bloqueio"], 1)
        self.assertEqual(rows[0]["unidade"], "Unidade Principal")

    def test_crud_system_prestador_without_touching_agenda_config_json(self):
        before_row = self.db.execute(text("SELECT agenda_config_json FROM prestador_odonto WHERE id = 255")).first()
        before_json = before_row[0]

        created = criar_bloqueio_prestador(
            255,
            AgendaBloqueioPayload(
                id_bloqueio=None,
                id_unidade=10,
                dia_sem=1,
                data_ini="2026-01-01",
                data_fin=None,
                hora_ini=800,
                hora_fin=900,
                msg_agenda="Teste NP11K6",
            ),
            current_user=self._user(),
            db=self.db,
        )
        self.assertEqual(created["id_prestador"], 255)
        self.assertEqual(created["unidade"], "Unidade Principal")
        current_row = self.db.execute(text("SELECT agenda_config_json FROM prestador_odonto WHERE id = 255")).first()
        self.assertEqual(json.loads(current_row[0] or '{}'), json.loads(before_json))

        item = self.db.query(AgendaLegadoBloqueio).filter(AgendaLegadoBloqueio.clinica_id == 1, AgendaLegadoBloqueio.id_prestador == 255).first()
        self.assertIsNotNone(item)

        updated = atualizar_bloqueio_prestador(
            255,
            item.id,
            AgendaBloqueioPayload(
                id_bloqueio=item.id_bloqueio,
                id_unidade=10,
                dia_sem=2,
                data_ini="2026-01-02",
                data_fin="2026-01-03",
                hora_ini=900,
                hora_fin=1000,
                msg_agenda="Teste editado",
            ),
            current_user=self._user(),
            db=self.db,
        )
        self.assertEqual(updated["dia_sem"], 2)
        self.assertEqual(updated["hora_ini"], 900)
        self.assertEqual(updated["msg_agenda"], "Teste editado")
        current_row = self.db.execute(text("SELECT agenda_config_json FROM prestador_odonto WHERE id = 255")).first()
        self.assertEqual(json.loads(current_row[0] or '{}'), json.loads(before_json))

        self.assertEqual(excluir_bloqueio_prestador(255, item.id, current_user=self._user(), db=self.db), {"ok": True})
        current_row = self.db.execute(text("SELECT agenda_config_json FROM prestador_odonto WHERE id = 255")).first()
        self.assertEqual(json.loads(current_row[0] or '{}'), json.loads(before_json))

    def test_cross_tenant_and_cross_prestador_blocked(self):
        self.db.add(
            AgendaLegadoBloqueio(
                clinica_id=2,
                id_bloqueio=1,
                id_prestador=400,
                id_unidade=11,
                dia_sem=1,
                data_ini=datetime(2026, 1, 1),
                data_fin=None,
                hora_ini=800,
                hora_fin=900,
                msg_agenda="Outro",
            )
        )
        self.db.commit()

        with self.assertRaises(Exception):
            listar_bloqueios_prestador(400, current_user=self._user(), db=self.db)

        created = criar_bloqueio_prestador(
            255,
            AgendaBloqueioPayload(
                id_bloqueio=None,
                id_unidade=10,
                dia_sem=1,
                data_ini="2026-01-01",
                data_fin=None,
                hora_ini=800,
                hora_fin=900,
                msg_agenda="Teste",
            ),
            current_user=self._user(),
            db=self.db,
        )
        item = self.db.query(AgendaLegadoBloqueio).filter(AgendaLegadoBloqueio.id == created["id"]).first()
        with self.assertRaises(Exception):
            atualizar_bloqueio_prestador(
                300,
                item.id,
                AgendaBloqueioPayload(
                    id_bloqueio=item.id_bloqueio,
                    id_unidade=10,
                    dia_sem=3,
                    data_ini="2026-01-03",
                    data_fin=None,
                    hora_ini=1000,
                    hora_fin=1100,
                    msg_agenda="Cross",
                ),
                current_user=self._user(),
                db=self.db,
            )

        with self.assertRaises(Exception):
            excluir_bloqueio_prestador(300, item.id, current_user=self._user(), db=self.db)


if __name__ == "__main__":
    unittest.main()
