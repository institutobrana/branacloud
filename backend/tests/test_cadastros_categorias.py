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
os.environ["JWT_SECRET_KEY"] = "test-secret-key-for-cadastros-categorias-tests"

from models.clinica import Clinica
from models.usuario import Usuario
from models.financeiro import GrupoFinanceiro, CategoriaFinanceira, Lancamento
from models.tiss_tipo_tabela import TissTipoTabela  # noqa: F401
from routes import cadastros_routes


class CadastrosCategoriasTests(unittest.TestCase):
    def setUp(self):
        self.engine = create_engine("sqlite+pysqlite:///:memory:")
        Clinica.__table__.create(self.engine)
        Usuario.__table__.create(self.engine)
        GrupoFinanceiro.__table__.create(self.engine)
        CategoriaFinanceira.__table__.create(self.engine)
        Lancamento.__table__.create(self.engine)
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
        self.group = GrupoFinanceiro(clinica_id=7, nome="Ativo", tipo="Pessoal")
        self.other_clinica = Clinica(
            id=9,
            nome="Outra Clinica",
            email="outra@brana.com",
            trial_ate=datetime.utcnow() + timedelta(days=30),
            ativo=True,
            nome_tabela_procedimentos="Tabela Outra",
        )
        self.other_group = GrupoFinanceiro(clinica_id=9, nome="Outra", tipo="Profissional")
        self.other_user = Usuario(
            id=2,
            codigo=102,
            nome="Usuario Outra",
            apelido="Outra",
            tipo_usuario="Admin",
            email="outra@brana.com",
            senha_hash="hash",
            ativo=True,
            online=True,
            forcar_troca_senha=False,
            setup_completed=True,
            is_system_user=False,
            is_admin=True,
            clinica_id=9,
        )
        self.db.add_all([self.clinica, self.user, self.group, self.other_clinica, self.other_user, self.other_group])
        self.db.commit()
        self.db.refresh(self.group)
        self.db.refresh(self.other_group)
        self.current_user = SimpleNamespace(id=self.user.id, clinica_id=self.user.clinica_id, is_admin=True)
        self.other_current_user = SimpleNamespace(id=self.other_user.id, clinica_id=self.other_user.clinica_id, is_admin=True)

    def tearDown(self):
        self.db.close()
        CategoriaFinanceira.__table__.drop(self.engine)
        Lancamento.__table__.drop(self.engine)
        GrupoFinanceiro.__table__.drop(self.engine)
        Usuario.__table__.drop(self.engine)
        Clinica.__table__.drop(self.engine)
        self.engine.dispose()

    def test_post_categoria_persiste_e_retorna_id(self):
        result = cadastros_routes.criar_categoria(
            payload=cadastros_routes.CategoriaPayload(
                nome=" Caixa ",
                tipo=" Analitica ",
                grupo_id=self.group.id,
                tributavel=True,
            ),
            current_user=self.current_user,
            db=self.db,
        )

        self.assertEqual(result["nome"], "Caixa")
        self.assertEqual(result["tipo"], "Analitica")
        self.assertEqual(result["grupo_id"], self.group.id)
        self.assertTrue(result["tributavel"])
        self.assertIsNotNone(result["id"])

        loaded = self.db.query(CategoriaFinanceira).filter(CategoriaFinanceira.id == result["id"]).first()
        self.assertIsNotNone(loaded)
        self.assertEqual(loaded.nome, "Caixa")
        self.assertEqual(loaded.tipo, "Analitica")
        self.assertEqual(loaded.grupo_id, self.group.id)

    def test_put_categoria_altera_mesmo_id(self):
        categoria = CategoriaFinanceira(
            clinica_id=self.current_user.clinica_id,
            grupo_id=self.group.id,
            nome="Caixa",
            tipo="Analitica",
            tributavel=False,
        )
        self.db.add(categoria)
        self.db.commit()
        self.db.refresh(categoria)

        response = cadastros_routes.editar_categoria(
            categoria_id=categoria.id,
            payload=cadastros_routes.CategoriaPayload(
                nome="Bancos",
                tipo="Analitica",
                grupo_id=self.group.id,
                tributavel=True,
            ),
            current_user=self.current_user,
            db=self.db,
        )

        self.assertEqual(response["detail"], "Categoria atualizada.")
        loaded = self.db.query(CategoriaFinanceira).filter(CategoriaFinanceira.id == categoria.id).first()
        self.assertIsNotNone(loaded)
        self.assertEqual(loaded.nome, "Bancos")
        self.assertTrue(loaded.tributavel)

    def test_post_categoria_rejeita_grupo_inexistente(self):
        with self.assertRaises(HTTPException) as ctx:
            cadastros_routes.criar_categoria(
                payload=cadastros_routes.CategoriaPayload(
                    nome="Caixa",
                    tipo="Analitica",
                    grupo_id=999,
                    tributavel=False,
                ),
                current_user=self.current_user,
                db=self.db,
            )
        self.assertEqual(ctx.exception.status_code, 404)

    def test_put_categoria_rejeita_id_inexistente(self):
        with self.assertRaises(HTTPException) as ctx:
            cadastros_routes.editar_categoria(
                categoria_id=999,
                payload=cadastros_routes.CategoriaPayload(
                    nome="Caixa",
                    tipo="Analitica",
                    grupo_id=self.group.id,
                    tributavel=False,
                ),
                current_user=self.current_user,
                db=self.db,
        )
        self.assertEqual(ctx.exception.status_code, 404)

    def test_delete_categoria_sem_uso_exclui(self):
        categoria = CategoriaFinanceira(
            clinica_id=self.current_user.clinica_id,
            grupo_id=self.group.id,
            nome="Caixa",
            tipo="Analitica",
            tributavel=False,
        )
        self.db.add(categoria)
        self.db.commit()
        self.db.refresh(categoria)

        result = cadastros_routes.excluir_categoria(
            categoria_id=categoria.id,
            current_user=self.current_user,
            db=self.db,
        )

        self.assertEqual(result["detail"], "Categoria excluída.")
        loaded = self.db.query(CategoriaFinanceira).filter(CategoriaFinanceira.id == categoria.id).first()
        self.assertIsNone(loaded)

    def test_delete_categoria_em_uso_retorna_409(self):
        categoria = CategoriaFinanceira(
            clinica_id=self.current_user.clinica_id,
            grupo_id=self.group.id,
            nome="Caixa",
            tipo="Analitica",
            tributavel=False,
        )
        self.db.add(categoria)
        self.db.commit()
        self.db.refresh(categoria)
        self.db.add(
            Lancamento(
                clinica_id=self.current_user.clinica_id,
                categoria_id=categoria.id,
                historico="Teste",
                valor=10,
            )
        )
        self.db.commit()

        with self.assertRaises(HTTPException) as ctx:
            cadastros_routes.excluir_categoria(
                categoria_id=categoria.id,
                current_user=self.current_user,
                db=self.db,
            )
        self.assertEqual(ctx.exception.status_code, 409)
        self.assertIn("Categoria em uso", ctx.exception.detail)

    def test_migrar_e_excluir_categoria_transfere_lancamentos_e_exclui_origem(self):
        origem = CategoriaFinanceira(
            clinica_id=self.current_user.clinica_id,
            grupo_id=self.group.id,
            nome="Origem",
            tipo="Analitica",
            tributavel=False,
        )
        destino = CategoriaFinanceira(
            clinica_id=self.current_user.clinica_id,
            grupo_id=self.group.id,
            nome="Destino",
            tipo="Analitica",
            tributavel=True,
        )
        self.db.add_all([origem, destino])
        self.db.commit()
        self.db.refresh(origem)
        self.db.refresh(destino)
        lancamento = Lancamento(
            clinica_id=self.current_user.clinica_id,
            categoria_id=origem.id,
            historico="Teste",
            valor=25,
        )
        self.db.add(lancamento)
        self.db.commit()

        result = cadastros_routes.migrar_e_excluir_categoria(
            categoria_id=origem.id,
            payload=cadastros_routes.MigrarCategoriaPayload(categoria_destino_id=destino.id),
            current_user=self.current_user,
            db=self.db,
        )

        self.assertEqual(result["detail"], "Categoria migrada e excluída.")
        origem_loaded = self.db.query(CategoriaFinanceira).filter(CategoriaFinanceira.id == origem.id).first()
        destino_loaded = self.db.query(CategoriaFinanceira).filter(CategoriaFinanceira.id == destino.id).first()
        lancamento_loaded = self.db.query(Lancamento).filter(Lancamento.id == lancamento.id).first()
        self.assertIsNone(origem_loaded)
        self.assertIsNotNone(destino_loaded)
        self.assertEqual(lancamento_loaded.categoria_id, destino.id)

    def test_migrar_e_excluir_categoria_aceita_destino_em_outro_grupo_da_mesma_clinica(self):
        origem = CategoriaFinanceira(
            clinica_id=self.current_user.clinica_id,
            grupo_id=self.group.id,
            nome="Origem2",
            tipo="Analitica",
            tributavel=False,
        )
        outro_grupo = GrupoFinanceiro(clinica_id=self.current_user.clinica_id, nome="Outro grupo", tipo="Pessoal")
        self.db.add(outro_grupo)
        self.db.commit()
        self.db.refresh(outro_grupo)
        destino = CategoriaFinanceira(
            clinica_id=self.current_user.clinica_id,
            grupo_id=outro_grupo.id,
            nome="Destino2",
            tipo="Sintetica",
            tributavel=False,
        )
        self.db.add_all([origem, destino])
        self.db.commit()
        self.db.refresh(origem)
        self.db.refresh(destino)
        self.db.add(
            Lancamento(
                clinica_id=self.current_user.clinica_id,
                categoria_id=origem.id,
                historico="Teste",
                valor=50,
            )
        )
        self.db.commit()

        result = cadastros_routes.migrar_e_excluir_categoria(
            categoria_id=origem.id,
            payload=cadastros_routes.MigrarCategoriaPayload(categoria_destino_id=destino.id),
            current_user=self.current_user,
            db=self.db,
        )
        self.assertEqual(result["detail"], "Categoria migrada e excluída.")

    def test_migrar_e_excluir_categoria_rejeita_origem_igual_destino(self):
        origem = CategoriaFinanceira(
            clinica_id=self.current_user.clinica_id,
            grupo_id=self.group.id,
            nome="Origem3",
            tipo="Analitica",
            tributavel=False,
        )
        self.db.add(origem)
        self.db.commit()
        self.db.refresh(origem)

        with self.assertRaises(HTTPException) as ctx:
            cadastros_routes.migrar_e_excluir_categoria(
                categoria_id=origem.id,
                payload=cadastros_routes.MigrarCategoriaPayload(categoria_destino_id=origem.id),
                current_user=self.current_user,
                db=self.db,
            )
        self.assertEqual(ctx.exception.status_code, 400)

    def test_migrar_e_excluir_categoria_rejeita_destino_inexistente(self):
        origem = CategoriaFinanceira(
            clinica_id=self.current_user.clinica_id,
            grupo_id=self.group.id,
            nome="Origem4",
            tipo="Analitica",
            tributavel=False,
        )
        self.db.add(origem)
        self.db.commit()
        self.db.refresh(origem)

        with self.assertRaises(HTTPException) as ctx:
            cadastros_routes.migrar_e_excluir_categoria(
                categoria_id=origem.id,
                payload=cadastros_routes.MigrarCategoriaPayload(categoria_destino_id=99999),
                current_user=self.current_user,
                db=self.db,
            )
        self.assertEqual(ctx.exception.status_code, 404)

    def test_migrar_e_excluir_categoria_rejeita_destino_outra_clinica(self):
        origem = CategoriaFinanceira(
            clinica_id=self.current_user.clinica_id,
            grupo_id=self.group.id,
            nome="Origem5",
            tipo="Analitica",
            tributavel=False,
        )
        destino = CategoriaFinanceira(
            clinica_id=self.other_current_user.clinica_id,
            grupo_id=self.other_group.id,
            nome="Destino Outra Clinica",
            tipo="Analitica",
            tributavel=False,
        )
        self.db.add_all([origem, destino])
        self.db.commit()
        self.db.refresh(origem)
        self.db.refresh(destino)

        with self.assertRaises(HTTPException) as ctx:
            cadastros_routes.migrar_e_excluir_categoria(
                categoria_id=origem.id,
                payload=cadastros_routes.MigrarCategoriaPayload(categoria_destino_id=destino.id),
                current_user=self.current_user,
                db=self.db,
            )
        self.assertEqual(ctx.exception.status_code, 404)

    def test_migrar_e_excluir_categoria_rollback_em_falha_no_commit(self):
        origem = CategoriaFinanceira(
            clinica_id=self.current_user.clinica_id,
            grupo_id=self.group.id,
            nome="Origem6",
            tipo="Analitica",
            tributavel=False,
        )
        destino = CategoriaFinanceira(
            clinica_id=self.current_user.clinica_id,
            grupo_id=self.group.id,
            nome="Destino6",
            tipo="Analitica",
            tributavel=False,
        )
        self.db.add_all([origem, destino])
        self.db.commit()
        self.db.refresh(origem)
        self.db.refresh(destino)
        lancamento = Lancamento(
            clinica_id=self.current_user.clinica_id,
            categoria_id=origem.id,
            historico="Teste",
            valor=75,
        )
        self.db.add(lancamento)
        self.db.commit()

        original_commit = self.db.commit

        def failing_commit():
            raise RuntimeError("commit falhou")

        self.db.commit = failing_commit
        try:
            with self.assertRaises(RuntimeError):
                cadastros_routes.migrar_e_excluir_categoria(
                    categoria_id=origem.id,
                    payload=cadastros_routes.MigrarCategoriaPayload(categoria_destino_id=destino.id),
                    current_user=self.current_user,
                    db=self.db,
                )
        finally:
            self.db.commit = original_commit
            self.db.rollback()

        origem_loaded = self.db.query(CategoriaFinanceira).filter(CategoriaFinanceira.id == origem.id).first()
        lancamento_loaded = self.db.query(Lancamento).filter(Lancamento.id == lancamento.id).first()
        self.assertIsNotNone(origem_loaded)
        self.assertEqual(lancamento_loaded.categoria_id, origem.id)


if __name__ == "__main__":
    unittest.main()
