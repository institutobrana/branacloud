import os
import sys
from datetime import datetime, timedelta
from pathlib import Path
from types import SimpleNamespace
import unittest

from fastapi import HTTPException
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

os.environ["DATABASE_URL"] = "sqlite+pysqlite:///:memory:"
os.environ["JWT_SECRET_KEY"] = "test-secret-key-for-unidades-atendimento-delete-tests"

from routes import unidades_atendimento_routes
from models.convenio_odonto import ConvenioOdonto  # noqa: F401
from models.paciente import Paciente  # noqa: F401
from models.material import Material  # noqa: F401
from models.prestador_odonto import PrestadorOdonto  # noqa: F401
from models.prestador_odonto import PrestadorCredenciamentoOdonto  # noqa: F401
from models.prestador_odonto import PrestadorComissaoOdonto  # noqa: F401
from models.unidade_atendimento import UnidadeAtendimento
from models.procedimento_generico import ProcedimentoGenerico  # noqa: F401
from models.convenio_odonto import PlanoOdonto  # noqa: F401
from models.convenio_odonto import CalendarioFaturamentoOdonto  # noqa: F401
from services.unidades_atendimento.deletion_service import excluir_unidade_atendimento


class UnidadesAtendimentoDeleteTests(unittest.TestCase):
    def setUp(self):
        self.engine = create_engine("sqlite+pysqlite:///:memory:")
        self.db = sessionmaker(bind=self.engine)()
        self._create_schema()
        self._seed_base()

    def tearDown(self):
        self.db.close()
        self.engine.dispose()

    def _create_schema(self):
        ddl = [
            """
            CREATE TABLE clinicas (
                id INTEGER PRIMARY KEY,
                nome TEXT NOT NULL,
                email TEXT NOT NULL,
                trial_ate TEXT NOT NULL,
                ativo BOOLEAN,
                nome_tabela_procedimentos TEXT NOT NULL
            )
            """,
            """
            CREATE TABLE usuarios (
                id INTEGER PRIMARY KEY,
                clinica_id INTEGER NOT NULL,
                unidade_atendimento_id INTEGER NULL
            )
            """,
            """
            CREATE TABLE unidade_atendimento (
                id INTEGER PRIMARY KEY,
                clinica_id INTEGER NOT NULL,
                source_id INTEGER NOT NULL,
                codigo TEXT,
                nome TEXT NOT NULL,
                logradouro_tipo TEXT NULL,
                endereco TEXT NULL,
                numero TEXT NULL,
                complemento TEXT NULL,
                bairro TEXT NULL,
                cidade TEXT NULL,
                cep TEXT NULL,
                uf TEXT NULL,
                fone1_tipo TEXT NULL,
                fone1 TEXT NULL,
                contato1 TEXT NULL,
                fone2_tipo TEXT NULL,
                fone2 TEXT NULL,
                contato2 TEXT NULL,
                fone3_tipo TEXT NULL,
                fone3 TEXT NULL,
                contato3 TEXT NULL,
                fone4_tipo TEXT NULL,
                fone4 TEXT NULL,
                contato4 TEXT NULL,
                inativo BOOLEAN NOT NULL DEFAULT 0,
                qtd_sala INTEGER NOT NULL DEFAULT 0,
                data_inclusao TEXT NULL,
                data_alteracao TEXT NULL,
                criado_em TEXT NULL,
                atualizado_em TEXT NULL
            )
            """,
            """
            CREATE TABLE agenda_legado_evento (
                id INTEGER PRIMARY KEY,
                clinica_id INTEGER NOT NULL,
                id_prestador INTEGER NOT NULL,
                id_unidade INTEGER NOT NULL,
                data TEXT NOT NULL,
                hora_inicio INTEGER NOT NULL,
                hora_fim INTEGER NULL
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
                hora_fin INTEGER NOT NULL
            )
            """,
            """
            CREATE TABLE paciente (
                id INTEGER PRIMARY KEY,
                clinica_id INTEGER NOT NULL,
                codigo INTEGER NOT NULL,
                nome TEXT NOT NULL
            )
            """,
            """
            CREATE TABLE tratamento (
                id INTEGER PRIMARY KEY,
                clinica_id INTEGER NOT NULL,
                paciente_id INTEGER NOT NULL,
                nrotra INTEGER NOT NULL,
                situacao TEXT NOT NULL,
                tabela_codigo INTEGER NOT NULL,
                indice INTEGER NOT NULL,
                unidade_atendimento TEXT NULL
            )
            """,
        ]
        for statement in ddl:
            self.db.execute(text(statement))
        self.db.commit()

    def _seed_base(self):
        self.db.execute(
            text(
                "INSERT INTO clinicas (id, nome, email, trial_ate, ativo, nome_tabela_procedimentos) VALUES (:id, :nome, :email, :trial_ate, :ativo, :nome_tabela_procedimentos)"
            ),
            {
                "id": 7,
                "nome": "Clinica Teste",
                "email": "clinica@brana.com",
                "trial_ate": (datetime.utcnow() + timedelta(days=30)).isoformat(),
                "ativo": True,
                "nome_tabela_procedimentos": "Tabela Teste",
            },
        )
        self.db.execute(
            text(
                "INSERT INTO clinicas (id, nome, email, trial_ate, ativo, nome_tabela_procedimentos) VALUES (:id, :nome, :email, :trial_ate, :ativo, :nome_tabela_procedimentos)"
            ),
            {
                "id": 8,
                "nome": "Outra Clinica",
                "email": "outra@brana.com",
                "trial_ate": (datetime.utcnow() + timedelta(days=30)).isoformat(),
                "ativo": True,
                "nome_tabela_procedimentos": "Tabela Outra",
            },
        )
        self.db.commit()
        self.current_user = SimpleNamespace(id=1, clinica_id=7, is_admin=True)
        self.other_current_user = SimpleNamespace(id=2, clinica_id=8, is_admin=True)

    def _create_unit(self, clinica_id=7, source_id=2, codigo='0002', nome='Unidade Teste', inativo=False, qtd_sala=0):
        result = self.db.execute(
            text(
                "INSERT INTO unidade_atendimento (clinica_id, source_id, codigo, nome, inativo, qtd_sala) VALUES (:clinica_id, :source_id, :codigo, :nome, :inativo, :qtd_sala)"
            ),
            {
                "clinica_id": clinica_id,
                "source_id": source_id,
                "codigo": codigo,
                "nome": nome,
                "inativo": int(bool(inativo)),
                "qtd_sala": qtd_sala,
            },
        )
        self.db.commit()
        unit_id = result.lastrowid
        return self.db.query(UnidadeAtendimento).filter(UnidadeAtendimento.id == unit_id).first()

    def _create_user(self, unidade_id):
        self.db.execute(
            text("INSERT INTO usuarios (id, clinica_id, unidade_atendimento_id) VALUES (3, :clinica_id, :unidade_id)"),
            {"clinica_id": self.current_user.clinica_id, "unidade_id": unidade_id},
        )
        self.db.commit()

    def _create_agenda(self, unidade_id):
        self.db.execute(
            text(
                "INSERT INTO agenda_legado_evento (id, clinica_id, id_prestador, id_unidade, data, hora_inicio, hora_fim) VALUES (1, :clinica_id, 1, :unidade_id, :data, 800, 900)"
            ),
            {"clinica_id": self.current_user.clinica_id, "unidade_id": unidade_id, "data": datetime.utcnow().isoformat()},
        )
        self.db.commit()

    def _create_bloqueio(self, unidade_id):
        self.db.execute(
            text(
                "INSERT INTO agenda_legado_bloqueio (id, clinica_id, id_bloqueio, id_prestador, id_unidade, dia_sem, data_ini, data_fin, hora_ini, hora_fin) VALUES (1, :clinica_id, 1, 1, :unidade_id, 1, :data_ini, NULL, 800, 900)"
            ),
            {"clinica_id": self.current_user.clinica_id, "unidade_id": unidade_id, "data_ini": datetime.utcnow().isoformat()},
        )
        self.db.commit()

    def _create_tratamento(self, unidade_text):
        self.db.execute(
            text("INSERT INTO paciente (id, clinica_id, codigo, nome) VALUES (1, :clinica_id, 1, 'Paciente Teste')"),
            {"clinica_id": self.current_user.clinica_id},
        )
        self.db.execute(
            text(
                "INSERT INTO tratamento (id, clinica_id, paciente_id, nrotra, situacao, tabela_codigo, indice, unidade_atendimento) VALUES (1, :clinica_id, 1, 1, 'Aberto', 1, 255, :unidade_atendimento)"
            ),
            {"clinica_id": self.current_user.clinica_id, "unidade_atendimento": unidade_text},
        )
        self.db.commit()

    def test_delete_unidade_sem_vinculos_exclui(self):
        unidade = self._create_unit()
        self._create_unit(codigo='0003', nome='Segunda Unidade')
        result = excluir_unidade_atendimento(self.db, self.current_user.clinica_id, unidade)
        self.assertEqual(result.detail, 'Unidade excluida.')
        self.assertIsNone(self.db.execute(text("SELECT id FROM unidade_atendimento WHERE id = :id"), {"id": unidade.id}).first())

    def test_delete_unidade_principal_retorna_409(self):
        unidade = self._create_unit(source_id=1, codigo='0001', nome='Principal')
        with self.assertRaises(HTTPException) as ctx:
            excluir_unidade_atendimento(self.db, self.current_user.clinica_id, unidade)
        self.assertEqual(ctx.exception.status_code, 409)
        self.assertIn('unidade principal', ctx.exception.detail.lower())

    def test_delete_ultima_unidade_retorna_409(self):
        unidade = self._create_unit()
        with self.assertRaises(HTTPException) as ctx:
            excluir_unidade_atendimento(self.db, self.current_user.clinica_id, unidade)
        self.assertEqual(ctx.exception.status_code, 409)
        self.assertIn('pelo menos uma unidade', ctx.exception.detail.lower())

    def test_delete_unidade_com_usuarios_retorna_409(self):
        unidade = self._create_unit()
        self._create_unit(codigo='0003', nome='Segunda Unidade')
        self._create_user(unidade.id)
        with self.assertRaises(HTTPException) as ctx:
            excluir_unidade_atendimento(self.db, self.current_user.clinica_id, unidade)
        self.assertEqual(ctx.exception.status_code, 409)
        self.assertIn('usuarios vinculados', ctx.exception.detail.lower())

    def test_delete_unidade_com_agenda_retorna_409(self):
        unidade = self._create_unit()
        self._create_unit(codigo='0003', nome='Segunda Unidade')
        self._create_agenda(unidade.id)
        with self.assertRaises(HTTPException) as ctx:
            excluir_unidade_atendimento(self.db, self.current_user.clinica_id, unidade)
        self.assertEqual(ctx.exception.status_code, 409)
        self.assertIn('agenda vinculados', ctx.exception.detail.lower())

    def test_delete_unidade_com_bloqueio_retorna_409(self):
        unidade = self._create_unit()
        self._create_unit(codigo='0003', nome='Segunda Unidade')
        self._create_bloqueio(unidade.id)
        with self.assertRaises(HTTPException) as ctx:
            excluir_unidade_atendimento(self.db, self.current_user.clinica_id, unidade)
        self.assertEqual(ctx.exception.status_code, 409)
        self.assertIn('bloqueios de agenda', ctx.exception.detail.lower())

    def test_delete_unidade_com_tratamento_retorna_409(self):
        unidade = self._create_unit()
        self._create_unit(codigo='0003', nome='Segunda Unidade')
        self._create_tratamento(f'{unidade.codigo} - {unidade.nome}')
        with self.assertRaises(HTTPException) as ctx:
            excluir_unidade_atendimento(self.db, self.current_user.clinica_id, unidade)
        self.assertEqual(ctx.exception.status_code, 409)
        self.assertIn('tratamentos vinculados', ctx.exception.detail.lower())

    def test_delete_route_outra_clinica_retorna_404(self):
        unidade = self._create_unit(clinica_id=8, codigo='0003', nome='Outra Unidade')
        with self.assertRaises(HTTPException) as ctx:
            unidades_atendimento_routes.excluir(
                row_id=unidade.id,
                current_user=self.current_user,
                db=self.db,
            )
        self.assertEqual(ctx.exception.status_code, 404)


if __name__ == '__main__':
    unittest.main()
