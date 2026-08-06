import os
import sys
from datetime import datetime, timedelta
from pathlib import Path
from types import SimpleNamespace
import unittest

from fastapi import HTTPException
from sqlalchemy import Column, Integer, Table, create_engine
from sqlalchemy.orm import sessionmaker

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

os.environ["DATABASE_URL"] = "sqlite+pysqlite:///:memory:"
os.environ["JWT_SECRET_KEY"] = "test-secret-key-for-indices-financeiros-tests"

from database import Base
from models.model_registry import import_all_models
from models.clinica import Clinica
from models.convenio_odonto import ConvenioOdonto  # noqa: F401
from models.indice_financeiro import IndiceCotacao, IndiceFinanceiro
from models.usuario import Usuario
from models.prestador_odonto import PrestadorOdonto  # noqa: F401
from models.unidade_atendimento import UnidadeAtendimento  # noqa: F401
from routes import indices_financeiros_routes


def _ensure_stub_tables(metadata):
    if "prestador_odonto" not in metadata.tables:
        Table("prestador_odonto", metadata, Column("id", Integer, primary_key=True))
    if "unidade_atendimento" not in metadata.tables:
        Table("unidade_atendimento", metadata, Column("id", Integer, primary_key=True))


class IndicesFinanceirosPatchReservedTests(unittest.TestCase):
    def setUp(self):
        self.engine = create_engine("sqlite+pysqlite:///:memory:")
        import_all_models()
        _ensure_stub_tables(Base.metadata)
        Base.metadata.create_all(
            bind=self.engine,
            tables=[
                Clinica.__table__,
                Usuario.__table__,
                IndiceFinanceiro.__table__,
                IndiceCotacao.__table__,
            ],
        )
        self.SessionLocal = sessionmaker(bind=self.engine)
        self.db = self.SessionLocal()
        self.clinica = Clinica(
            id=7,
            nome="Clinica Teste",
            email="clinica@brana.com",
            trial_ate=datetime.utcnow() + timedelta(days=30),
            ativo=True,
            nome_tabela_procedimentos="Tabela Teste",
        )
        self.other_clinica = Clinica(
            id=8,
            nome="Outra Clinica",
            email="outra@brana.com",
            trial_ate=datetime.utcnow() + timedelta(days=30),
            ativo=True,
            nome_tabela_procedimentos="Tabela Outra",
        )
        self.user = Usuario(
            id=1,
            codigo=101,
            nome="Usuario Teste",
            apelido="Teste",
            tipo_usuario="Admin",
            email="teste@brana.com",
            senha_hash="hash",
            ativo=True,
            online=True,
            forcar_troca_senha=False,
            setup_completed=True,
            is_system_user=False,
            is_admin=True,
            clinica_id=7,
        )
        self.db.add_all([self.clinica, self.other_clinica, self.user])
        self.db.commit()
        self.current_user = SimpleNamespace(id=self.user.id, clinica_id=self.user.clinica_id, is_admin=True)

    def tearDown(self):
        self.db.close()
        Base.metadata.drop_all(
            bind=self.engine,
            tables=[
                IndiceFinanceiro.__table__,
                IndiceCotacao.__table__,
                Usuario.__table__,
                Clinica.__table__,
                Base.metadata.tables["unidade_atendimento"],
                Base.metadata.tables["prestador_odonto"],
            ],
        )
        self.engine.dispose()

    def _create_index(self, numero, nome, sigla, reservado=True, clinica_id=7):
        indice = IndiceFinanceiro(
            clinica_id=clinica_id,
            numero=numero,
            nome=nome,
            sigla=sigla,
            reservado=reservado,
            ativo=True,
        )
        self.db.add(indice)
        self.db.commit()
        self.db.refresh(indice)
        return indice

    def test_patch_permite_editar_nome_e_sigla_de_nativo_sem_alterar_numero(self):
        indice = self._create_index(3, 'Unid. Procedimento Odontologico', 'UPO', reservado=True)

        result = indices_financeiros_routes.atualizar(
            numero=3,
            payload=indices_financeiros_routes.IndiceUpdatePayload(nome='UPO ajustado', sigla='upo'),
            current_user=self.current_user,
            db=self.db,
        )

        self.assertEqual(result['numero'], 3)
        self.assertEqual(result['nome'], 'UPO ajustado')
        self.assertEqual(result['sigla'], 'UPO')
        loaded = self.db.query(IndiceFinanceiro).filter(IndiceFinanceiro.id == indice.id).first()
        self.assertIsNotNone(loaded)
        self.assertEqual(loaded.numero, 3)
        self.assertEqual(loaded.nome, 'UPO ajustado')
        self.assertEqual(loaded.sigla, 'UPO')
        self.assertTrue(loaded.reservado)
        self.assertEqual(loaded.clinica_id, self.current_user.clinica_id)

    def test_patch_permite_editar_indice_comum(self):
        indice = self._create_index(10, 'Indice comum', 'IC', reservado=False)

        result = indices_financeiros_routes.atualizar(
            numero=10,
            payload=indices_financeiros_routes.IndiceUpdatePayload(nome='Indice comum novo', sigla='ic2'),
            current_user=self.current_user,
            db=self.db,
        )

        self.assertEqual(result['numero'], 10)
        self.assertEqual(result['nome'], 'Indice comum novo')
        self.assertEqual(result['sigla'], 'IC2')
        loaded = self.db.query(IndiceFinanceiro).filter(IndiceFinanceiro.id == indice.id).first()
        self.assertEqual(loaded.numero, 10)
        self.assertEqual(loaded.nome, 'Indice comum novo')
        self.assertEqual(loaded.sigla, 'IC2')
        self.assertFalse(loaded.reservado)

    def test_patch_rejeita_indice_de_outra_clinica(self):
        other = self._create_index(3, 'Outra clinica', 'UPO', reservado=True, clinica_id=8)

        with self.assertRaises(HTTPException) as ctx:
            indices_financeiros_routes.atualizar(
                numero=3,
                payload=indices_financeiros_routes.IndiceUpdatePayload(nome='Falha', sigla='FA'),
                current_user=self.current_user,
                db=self.db,
            )

        self.assertEqual(ctx.exception.status_code, 404)
        loaded = self.db.query(IndiceFinanceiro).filter(IndiceFinanceiro.id == other.id).first()
        self.assertEqual(loaded.nome, 'Outra clinica')
        self.assertEqual(loaded.sigla, 'UPO')

    def test_delete_reservado_continua_bloqueado(self):
        self._create_index(255, 'Reais', 'R$', reservado=True)

        with self.assertRaises(HTTPException) as ctx:
            indices_financeiros_routes.excluir(
                numero=255,
                current_user=self.current_user,
                db=self.db,
            )

        self.assertEqual(ctx.exception.status_code, 400)

    def test_migrar_e_excluir_reservado_continua_bloqueado(self):
        self._create_index(1, 'Unid. Servico', 'USO', reservado=True)
        self._create_index(10, 'Indice comum', 'IC', reservado=False)

        with self.assertRaises(HTTPException) as ctx:
            indices_financeiros_routes.migrar_e_excluir(
                numero=1,
                payload={'numero_destino': 10},
                current_user=self.current_user,
                db=self.db,
            )

        self.assertEqual(ctx.exception.status_code, 400)
        loaded = self.db.query(IndiceFinanceiro).filter(IndiceFinanceiro.numero == 1).first()
        self.assertIsNotNone(loaded)
        self.assertTrue(loaded.reservado)
