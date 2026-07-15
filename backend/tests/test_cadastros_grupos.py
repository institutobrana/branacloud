import os
import sys
from datetime import datetime, timedelta
from pathlib import Path
from types import SimpleNamespace
import unittest

from fastapi import HTTPException
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

os.environ["DATABASE_URL"] = "sqlite+pysqlite:///:memory:"
os.environ["JWT_SECRET_KEY"] = "test-secret-key-for-cadastros-grupos-tests"

from database import Base
from models.clinica import Clinica
from models.usuario import Usuario
from models.financeiro import GrupoFinanceiro
from routes import cadastros_routes


class CadastrosGruposTests(unittest.TestCase):
    def setUp(self):
        self.engine = create_engine("sqlite+pysqlite:///:memory:")
        Clinica.__table__.create(self.engine)
        Usuario.__table__.create(self.engine)
        GrupoFinanceiro.__table__.create(self.engine)
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
        self.db.add(self.clinica)
        self.db.add(self.user)
        self.db.commit()
        self.current_user = SimpleNamespace(id=self.user.id, clinica_id=self.user.clinica_id, is_admin=True)

    def tearDown(self):
        self.db.close()
        GrupoFinanceiro.__table__.drop(self.engine)
        Usuario.__table__.drop(self.engine)
        Clinica.__table__.drop(self.engine)
        self.engine.dispose()

    def test_post_persiste_e_retorna_id(self):
        result = cadastros_routes.criar_grupo(
            payload=cadastros_routes.GrupoPayload(nome="  Ativo  ", tipo="  Pessoal  "),
            current_user=self.current_user,
            db=self.db,
        )

        self.assertEqual(result["nome"], "Ativo")
        self.assertEqual(result["tipo"], "Pessoal")
        self.assertIsNotNone(result["id"])

        loaded = (
            self.db.query(GrupoFinanceiro)
            .filter(GrupoFinanceiro.clinica_id == self.current_user.clinica_id)
            .first()
        )
        self.assertIsNotNone(loaded)
        self.assertEqual(loaded.nome, "Ativo")
        self.assertEqual(loaded.tipo, "Pessoal")

    def test_put_altera_mesmo_id_e_preserva_isolamento_por_clinica(self):
        grupo = GrupoFinanceiro(clinica_id=self.current_user.clinica_id, nome="Ativo", tipo="Pessoal")
        self.db.add(grupo)
        self.db.commit()
        self.db.refresh(grupo)

        response = cadastros_routes.editar_grupo(
            grupo_id=grupo.id,
            payload=cadastros_routes.GrupoPayload(nome="Circulante", tipo="Profissional"),
            current_user=self.current_user,
            db=self.db,
        )

        self.assertEqual(response["detail"], "Grupo atualizado.")
        loaded = (
            self.db.query(GrupoFinanceiro)
            .filter(GrupoFinanceiro.id == grupo.id, GrupoFinanceiro.clinica_id == self.current_user.clinica_id)
            .first()
        )
        self.assertIsNotNone(loaded)
        self.assertEqual(loaded.nome, "Circulante")
        self.assertEqual(loaded.tipo, "Profissional")

    def test_put_rejeita_id_inexistente(self):
        with self.assertRaises(HTTPException) as ctx:
            cadastros_routes.editar_grupo(
                grupo_id=999,
                payload=cadastros_routes.GrupoPayload(nome="Novo", tipo="Pessoal"),
                current_user=self.current_user,
                db=self.db,
            )
        self.assertEqual(ctx.exception.status_code, 404)

    def test_post_rejeita_nome_vazio_e_mantem_db_sem_extra(self):
        with self.assertRaises(HTTPException) as ctx:
            cadastros_routes.criar_grupo(
                payload=cadastros_routes.GrupoPayload(nome="   ", tipo="Pessoal"),
                current_user=self.current_user,
                db=self.db,
            )
        self.assertEqual(ctx.exception.status_code, 400)
        self.assertEqual(self.db.query(GrupoFinanceiro).count(), 0)


if __name__ == "__main__":
    unittest.main()
