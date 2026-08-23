from __future__ import annotations

import os
import sys
from datetime import datetime, timedelta
from pathlib import Path
from types import SimpleNamespace
import unittest

from fastapi import HTTPException
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

os.environ["DATABASE_URL"] = "sqlite+pysqlite:///:memory:"
os.environ["JWT_SECRET_KEY"] = "test-secret-key-prestadores-delete"

from models.clinica import Clinica  # noqa: E402
from models.material import Material  # noqa: E402
from models.paciente import Paciente  # noqa: E402
from models.prestador_odonto import PrestadorOdonto  # noqa: E402
from models.procedimento import Procedimento  # noqa: E402
from models.tratamento import Tratamento  # noqa: E402
from models.unidade_atendimento import UnidadeAtendimento  # noqa: E402
from models.usuario import Usuario  # noqa: E402
from models.odontograma_model import OdontogramaIntervencaoStatus  # noqa: E402
from routes import prestadores_routes  # noqa: E402


class PrestadoresDeleteContractTests(unittest.TestCase):
    def setUp(self):
        self.engine = create_engine(
            "sqlite+pysqlite:///:memory:",
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
        )
        self.Session = sessionmaker(bind=self.engine)
        self.db = self.Session()
        Clinica.__table__.create(self.engine)
        UnidadeAtendimento.__table__.create(self.engine)
        PrestadorOdonto.__table__.create(self.engine)
        Usuario.__table__.create(self.engine)
        self._create_link_tables()
        self._seed_clinicas()

    def tearDown(self):
        self.db.close()
        self.engine.dispose()

    def _seed_clinicas(self):
        for clinica_id, nome, email in (
            (1, "Clinica A", "a@brana.test"),
            (2, "Clinica B", "b@brana.test"),
        ):
            self.db.add(
                Clinica(
                    id=clinica_id,
                    nome=nome,
                    email=email,
                    trial_ate=datetime.utcnow() + timedelta(days=30),
                    ativo=True,
                    nome_tabela_procedimentos="Tabela Teste",
                )
            )
        self.db.commit()

    def _create_link_tables(self):
        statements = [
            """
            CREATE TABLE lancamento (
                id INTEGER PRIMARY KEY,
                prestador_id INTEGER NULL
            )
            """,
            """
            CREATE TABLE prestador_credenciamento_odonto (
                id INTEGER PRIMARY KEY,
                clinica_id INTEGER NOT NULL,
                prestador_id INTEGER NULL,
                prestador_source_id INTEGER NULL
            )
            """,
            """
            CREATE TABLE prestador_comissao_odonto (
                id INTEGER PRIMARY KEY,
                clinica_id INTEGER NOT NULL,
                prestador_id INTEGER NULL,
                prestador_source_id INTEGER NULL
            )
            """,
            """
            CREATE TABLE odontograma_intervencoes (
                id INTEGER PRIMARY KEY,
                clinica_id INTEGER NOT NULL,
                prestador_id INTEGER NULL
            )
            """,
            """
            CREATE TABLE agenda_legado_evento (
                id INTEGER PRIMARY KEY,
                clinica_id INTEGER NOT NULL,
                id_prestador INTEGER NOT NULL
            )
            """,
            """
            CREATE TABLE agenda_legado_bloqueio (
                id INTEGER PRIMARY KEY,
                clinica_id INTEGER NOT NULL,
                id_prestador INTEGER NOT NULL
            )
            """,
        ]
        for sql in statements:
            self.db.execute(text(sql))
        self.db.commit()

    def _create_prestador(self, clinica_id: int, **extra):
        item = PrestadorOdonto(
            clinica_id=clinica_id,
            source_id=extra.pop("source_id", 1000 + clinica_id),
            codigo=extra.pop("codigo", "010"),
            nome=extra.pop("nome", "Prestador Teste"),
            is_system_prestador=extra.pop("is_system_prestador", False),
            **extra,
        )
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item

    def _create_usuario_vinculado(self, clinica_id: int, prestador_id: int):
        usuario = Usuario(
            clinica_id=clinica_id,
            codigo=2000 + prestador_id,
            nome=f"Usuario {prestador_id}",
            email=f"usuario-{prestador_id}@brana.test",
            senha_hash="hash",
            ativo=True,
            online=False,
            forcar_troca_senha=False,
            setup_completed=True,
            is_system_user=False,
            is_admin=False,
            prestador_id=prestador_id,
        )
        self.db.add(usuario)
        self.db.commit()
        self.db.refresh(usuario)
        return usuario

    def test_delete_sem_vinculos_exclui(self):
        item = self._create_prestador(1, nome="TESTE NP10 ELIMINA")
        item_id = item.id

        result = prestadores_routes.excluir_prestador(
            row_id=item_id,
            current_user=SimpleNamespace(clinica_id=1),
            db=self.db,
        )

        self.assertEqual(result, {"ok": True})
        self.assertIsNone(self.db.query(PrestadorOdonto).filter(PrestadorOdonto.id == item_id).first())

    def test_delete_com_vinculo_bloqueia(self):
        item = self._create_prestador(1, nome="TESTE NP10 ELIMINA VINCULADO")
        self._create_usuario_vinculado(1, item.id)

        with self.assertRaises(HTTPException) as ctx:
            prestadores_routes.excluir_prestador(
                row_id=item.id,
                current_user=SimpleNamespace(clinica_id=1),
                db=self.db,
            )

        self.assertEqual(ctx.exception.status_code, 400)
        self.assertIn("nao pode ser eliminado", str(ctx.exception.detail).lower())
        self.assertIsNotNone(self.db.query(PrestadorOdonto).filter(PrestadorOdonto.id == item.id).first())

    def test_delete_sistemico_bloqueia(self):
        item = self._create_prestador(
            1,
            nome="Clínica",
            codigo="001",
            source_id=255,
            is_system_prestador=True,
        )

        with self.assertRaises(HTTPException) as ctx:
            prestadores_routes.excluir_prestador(
                row_id=item.id,
                current_user=SimpleNamespace(clinica_id=1),
                db=self.db,
            )

        self.assertEqual(ctx.exception.status_code, 400)
        self.assertIn("sistemico", str(ctx.exception.detail).lower())

    def test_delete_outra_clinica_retorna_404(self):
        item = self._create_prestador(2, nome="Prestador Outra Clinica")

        with self.assertRaises(HTTPException) as ctx:
            prestadores_routes.excluir_prestador(
                row_id=item.id,
                current_user=SimpleNamespace(clinica_id=1),
                db=self.db,
            )

        self.assertEqual(ctx.exception.status_code, 404)


if __name__ == "__main__":
    unittest.main()
