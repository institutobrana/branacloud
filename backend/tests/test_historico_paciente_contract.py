from __future__ import annotations

import os
import sys
import unittest
from datetime import date, datetime, timedelta
from pathlib import Path

from sqlalchemy import JSON, create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi import HTTPException

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

os.environ["DATABASE_URL"] = "sqlite+pysqlite:///:memory:"
os.environ["JWT_SECRET_KEY"] = "test-secret-historico"

from database import Base  # noqa: E402
from models.clinica import Clinica  # noqa: E402
from models.historico_paciente import HistoricoPaciente  # noqa: E402
from models.model_registry import import_all_models  # noqa: E402
from models.paciente import Paciente  # noqa: E402
from models.prestador_odonto import PrestadorOdonto  # noqa: E402
from models.usuario import Usuario  # noqa: E402
from schemas.historico_paciente_schema import (  # noqa: E402
    HistoricoPacienteCreate,
    HistoricoPacienteInlineUpdate,
    HistoricoPacientePropertiesUpdate,
)
from services.historico_paciente_service import atualizar, criar, listar, obter, remover  # noqa: E402


class HistoricoPacienteContractTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        import_all_models()

    def setUp(self):
        self.engine = create_engine(
            "sqlite+pysqlite:///:memory:",
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
        )
        # Existing Paciente uses PostgreSQL-only JSONB; SQLite is used here
        # only as an isolated unit-test store.
        Paciente.__table__.c.source_payload.type = JSON()
        tables = [
            Clinica.__table__,
            PrestadorOdonto.__table__,
            Usuario.__table__,
            Paciente.__table__,
            HistoricoPaciente.__table__,
        ]
        Base.metadata.create_all(self.engine, tables=tables)
        self.db = sessionmaker(bind=self.engine)()
        self.clinica = Clinica(
            id=1,
            nome="Clinica Teste",
            email="historico@brana.test",
            trial_ate=datetime.utcnow() + timedelta(days=30),
        )
        self.prestador = PrestadorOdonto(
            id=10,
            clinica_id=1,
            source_id=10,
            nome="Prestador Teste",
            apelido="Tel",
        )
        self.usuario = Usuario(
            id=20,
            clinica_id=1,
            prestador_id=10,
            nome="Usuario Teste",
            apelido="Tel",
            email="usuario@brana.test",
            senha_hash="hash",
            setup_completed=True,
        )
        self.paciente = Paciente(id=30, clinica_id=1, codigo=214, nome="Paciente Tecnico")
        self.db.add_all([self.clinica, self.prestador, self.usuario, self.paciente])
        self.db.commit()

    def tearDown(self):
        self.db.close()
        self.engine.dispose()

    def test_create_defaults_context_date_and_audit(self):
        item = criar(
            self.db,
            self.usuario,
            30,
            HistoricoPacienteCreate(descricao="TESTE HISTORICO BRANA H1", regiao="Todos"),
        )
        self.assertEqual(item["prestador_id"], 10)
        self.assertEqual(item["data"], date.today())
        self.assertEqual(item["regiao"], "Todos")
        self.assertEqual(item["cor"], 16777215)
        self.assertEqual(item["criado_por_id"], 20)
        self.assertIsNone(item["atualizado_em"])

    def test_list_orders_both_directions_and_preserves_region_text(self):
        for value in ((date(2026, 1, 1), "37"), (date(2026, 1, 3), "Quadrante superior"), (date(2026, 1, 2), "18") ):
            criar(self.db, self.usuario, 30, HistoricoPacienteCreate(data=value[0], regiao=value[1], descricao=value[1]))
        asc = listar(self.db, 1, 30)
        desc = listar(self.db, 1, 30, descending=True)
        self.assertEqual([row["data"] for row in asc], [date(2026, 1, 1), date(2026, 1, 2), date(2026, 1, 3)])
        self.assertEqual([row["regiao"] for row in asc], ["37", "18", "Quadrante superior"])
        self.assertEqual([row["data"] for row in desc], [date(2026, 1, 3), date(2026, 1, 2), date(2026, 1, 1)])

    def test_update_sets_audit_and_delete_is_physical(self):
        created = criar(self.db, self.usuario, 30, HistoricoPacienteCreate(descricao="Antes"))
        item = obter(self.db, 1, 30, created["id"])
        updated = atualizar(
            self.db,
            self.usuario,
            item,
            HistoricoPacienteInlineUpdate(data=date.today(), regiao="37", descricao="Depois"),
        )
        self.assertEqual(updated["descricao"], "Depois")
        self.assertEqual(updated["atualizado_por_id"], 20)
        self.assertIsNotNone(updated["atualizado_em"])
        remover(self.db, item)
        self.assertEqual(listar(self.db, 1, 30), [])

    def test_properties_update_can_change_prestador_and_color(self):
        created = criar(self.db, self.usuario, 30, HistoricoPacienteCreate(descricao="Antes"))
        item = obter(self.db, 1, 30, created["id"])
        updated = atualizar(
            self.db,
            self.usuario,
            item,
            HistoricoPacientePropertiesUpdate(
                data=date.today(), regiao="37", descricao="Depois", prestador_id=10, cor=255
            ),
            properties=True,
        )
        self.assertEqual(updated["prestador_id"], 10)
        self.assertEqual(updated["cor"], 255)

    def test_user_without_prestador_is_rejected(self):
        user = Usuario(
            id=21,
            clinica_id=1,
            nome="Sem Prestador",
            email="sem-prestador@brana.test",
            senha_hash="hash",
            setup_completed=True,
        )
        self.db.add(user)
        self.db.commit()
        with self.assertRaises(HTTPException) as error:
            criar(self.db, user, 30, HistoricoPacienteCreate(descricao="Bloqueado"))
        self.assertEqual(error.exception.status_code, 400)

    def test_item_and_patient_tenant_isolation(self):
        created = criar(self.db, self.usuario, 30, HistoricoPacienteCreate(descricao="Privado"))
        other_clinic = Clinica(
            id=2,
            nome="Outra Clinica",
            email="outra@brana.test",
            trial_ate=datetime.utcnow() + timedelta(days=30),
        )
        other_patient = Paciente(id=31, clinica_id=2, codigo=214, nome="Outro Paciente")
        self.db.add_all([other_clinic, other_patient])
        self.db.commit()
        with self.assertRaises(HTTPException) as mismatch:
            obter(self.db, 1, 31, created["id"])
        self.assertEqual(mismatch.exception.status_code, 404)
        with self.assertRaises(HTTPException) as tenant:
            listar(self.db, 2, 30)
        self.assertEqual(tenant.exception.status_code, 404)

    def test_description_cannot_be_blank(self):
        with self.assertRaises(ValueError):
            HistoricoPacienteCreate(descricao="   ")


if __name__ == "__main__":
    unittest.main()
