import os
import sys
from pathlib import Path
from types import SimpleNamespace
import unittest

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

os.environ.setdefault("DATABASE_URL", "sqlite+pysqlite:///:memory:")
os.environ.setdefault("JWT_SECRET_KEY", "test-secret-key-for-servicos-protetico-tests")

from models.protetico import Protetico, ServicoProtetico  # noqa: E402
import models.convenio_odonto  # noqa: E402,F401
import models.prestador_odonto  # noqa: E402,F401
import models.procedimento_generico  # noqa: E402,F401
import models.material  # noqa: E402,F401
import models.unidade_atendimento  # noqa: E402,F401
import models.clinica  # noqa: E402,F401
import models.usuario  # noqa: E402,F401
from routes.proteticos_routes import criar_servico, listar_servicos, alterar_servico  # noqa: E402
from scripts.migrar_servico_protetico_codigo_descricao import upgrade  # noqa: E402


class ServicosProteticoCodigoDescricaoTests(unittest.TestCase):
    def setUp(self):
        self.engine = create_engine("sqlite+pysqlite:///:memory:")
        self.SessionLocal = sessionmaker(bind=self.engine, autoflush=False, autocommit=False)
        with self.engine.begin() as conn:
            conn.execute(text("CREATE TABLE clinicas (id INTEGER PRIMARY KEY, nome TEXT)"))
            conn.execute(
                text(
                    """
                    CREATE TABLE protetico (
                        id INTEGER PRIMARY KEY,
                        nome VARCHAR(150) NOT NULL,
                        clinica_id INTEGER NOT NULL
                    )
                    """
                )
            )
            conn.execute(
                text(
                    """
                    CREATE TABLE servico_protetico (
                        id INTEGER PRIMARY KEY,
                        protetico_id INTEGER NOT NULL,
                        clinica_id INTEGER NOT NULL,
                        nome VARCHAR(180) NOT NULL,
                        indice VARCHAR(10) NOT NULL DEFAULT 'R$',
                        preco DOUBLE PRECISION NOT NULL DEFAULT 0,
                        prazo INTEGER NOT NULL DEFAULT 0
                    )
                    """
                )
            )
            conn.execute(text("INSERT INTO clinicas (id, nome) VALUES (1, 'Clinica A'), (2, 'Clinica B')"))
            conn.execute(
                text(
                    "INSERT INTO protetico (id, nome, clinica_id) VALUES "
                    "(1, 'Prot A', 1), (2, 'Prot B', 1), (3, 'Prot C', 2)"
                )
            )
            conn.execute(
                text(
                    "INSERT INTO servico_protetico (id, protetico_id, clinica_id, nome, indice, preco, prazo) VALUES "
                    "(1, 1, 1, 'Servico 1', 'R$', 10, 5), "
                    "(2, 1, 1, 'Servico 2', 'R$', 20, 6), "
                    "(3, 2, 1, 'Servico 3', 'R$', 30, 7), "
                    "(4, 3, 2, 'Servico 4', 'R$', 40, 8)"
                )
            )

        with self.engine.begin() as conn:
            upgrade(conn)

        self.db = self.SessionLocal()
        self.current_user = SimpleNamespace(clinica_id=1)

    def tearDown(self):
        self.db.close()
        self.engine.dispose()

    def test_migration_adds_columns_and_backfills_codigo(self):
        columns = [row[1] for row in self.db.execute(text("PRAGMA table_info(servico_protetico)")).fetchall()]
        self.assertIn("codigo", columns)
        self.assertIn("descricao", columns)

        rows = self.db.execute(
            text("SELECT id, codigo, descricao FROM servico_protetico ORDER BY id")
        ).fetchall()
        self.assertEqual([row[1] for row in rows], ["1", "2", "3", "4"])
        self.assertEqual([row[2] for row in rows], [None, None, None, None])

    def test_migration_rejeita_duplicidade_inesperada_no_backfill(self):
        engine = create_engine("sqlite+pysqlite:///:memory:")
        with engine.begin() as conn:
            conn.execute(text("CREATE TABLE clinicas (id INTEGER PRIMARY KEY, nome TEXT)"))
            conn.execute(
                text(
                    """
                    CREATE TABLE protetico (
                        id INTEGER PRIMARY KEY,
                        nome VARCHAR(150) NOT NULL,
                        clinica_id INTEGER NOT NULL
                    )
                    """
                )
            )
            conn.execute(
                text(
                    """
                    CREATE TABLE servico_protetico (
                        id INTEGER PRIMARY KEY,
                        protetico_id INTEGER NOT NULL,
                        clinica_id INTEGER NOT NULL,
                        nome VARCHAR(180) NOT NULL,
                        indice VARCHAR(10) NOT NULL DEFAULT 'R$',
                        preco DOUBLE PRECISION NOT NULL DEFAULT 0,
                        prazo INTEGER NOT NULL DEFAULT 0,
                        codigo VARCHAR(30)
                    )
                    """
                )
            )
            conn.execute(text("INSERT INTO clinicas (id, nome) VALUES (1, 'Clinica A')"))
            conn.execute(text("INSERT INTO protetico (id, nome, clinica_id) VALUES (1, 'Prot A', 1)"))
            conn.execute(
                text(
                    "INSERT INTO servico_protetico (id, protetico_id, clinica_id, nome, indice, preco, prazo, codigo) VALUES "
                    "(1, 1, 1, 'Servico 1', 'R$', 10, 5, '2'), "
                    "(2, 1, 1, 'Servico 2', 'R$', 20, 6, NULL)"
                )
            )
        with engine.begin() as conn:
            with self.assertRaises(RuntimeError):
                upgrade(conn)
        engine.dispose()

    def test_get_returns_codigo_and_descricao(self):
        row = self.db.query(ServicoProtetico).filter(ServicoProtetico.id == 1).first()
        row.descricao = "Descricao teste"
        row.codigo = "COD-01"
        self.db.commit()

        result = listar_servicos(1, current_user=self.current_user, db=self.db)
        self.assertEqual(result[0]["codigo"], "COD-01")
        self.assertEqual(result[0]["descricao"], "Descricao teste")
        self.assertIn("protetico_id", result[0])

    def test_post_aceita_payload_antigo_e_novo(self):
        antigo = criar_servico(
            1,
            payload=SimpleNamespace(nome="Servico Novo Antigo", indice="R$", preco=11.5, prazo=4, codigo=None, descricao=None),
            current_user=self.current_user,
            db=self.db,
        )
        self.assertIsNone(antigo["codigo"])
        self.assertIsNone(antigo["descricao"])

        novo = criar_servico(
            1,
            payload=SimpleNamespace(nome="Servico Novo", indice="R$", preco=15, prazo=3, codigo="PRT-001", descricao="Linha 1\nLinha 2"),
            current_user=self.current_user,
            db=self.db,
        )
        self.assertEqual(novo["codigo"], "PRT-001")
        self.assertEqual(novo["descricao"], "Linha 1\nLinha 2")

    def test_post_trima_codigo_e_preserva_zeros_a_esquerda(self):
        item = criar_servico(
            1,
            payload=SimpleNamespace(nome="Servico Zeros", indice="R$", preco=1, prazo=1, codigo=" 001 ", descricao=""),
            current_user=self.current_user,
            db=self.db,
        )
        self.assertEqual(item["codigo"], "001")
        self.assertIsNone(item["descricao"])

    def test_post_rejeita_codigo_duplicado_no_mesmo_protetico(self):
        criar_servico(
            1,
            payload=SimpleNamespace(nome="Servico X", indice="R$", preco=10, prazo=2, codigo="DUP-1", descricao=None),
            current_user=self.current_user,
            db=self.db,
        )
        with self.assertRaises(Exception) as ctx:
            criar_servico(
                1,
                payload=SimpleNamespace(nome="Servico Y", indice="R$", preco=20, prazo=2, codigo="DUP-1", descricao=None),
                current_user=self.current_user,
                db=self.db,
            )
        self.assertEqual(getattr(ctx.exception, "status_code", None), 409)

    def test_post_permite_mesmo_codigo_em_outro_protetico_e_clinica(self):
        same_protetico_other_clinic = criar_servico(
            3,
            payload=SimpleNamespace(nome="Servico Clinica 2", indice="R$", preco=10, prazo=2, codigo="SHARED-1", descricao=None),
            current_user=SimpleNamespace(clinica_id=2),
            db=self.db,
        )
        self.assertEqual(same_protetico_other_clinic["codigo"], "SHARED-1")

        other_protetico = criar_servico(
            2,
            payload=SimpleNamespace(nome="Servico Outro", indice="R$", preco=12, prazo=3, codigo="SHARED-1", descricao=None),
            current_user=self.current_user,
            db=self.db,
        )
        self.assertEqual(other_protetico["codigo"], "SHARED-1")

    def test_put_atualiza_codigo_e_descricao(self):
        result = alterar_servico(
            1,
            payload=SimpleNamespace(nome="Servico 1", indice="R$", preco=13, prazo=9, codigo="UPD-01", descricao="Nova\nDescricao"),
            current_user=self.current_user,
            db=self.db,
        )
        self.assertEqual(result["codigo"], "UPD-01")
        self.assertEqual(result["descricao"], "Nova\nDescricao")

    def test_put_rejeita_colisao_de_codigo(self):
        alterar_servico(
            1,
            payload=SimpleNamespace(nome="Servico 1", indice="R$", preco=13, prazo=9, codigo="PUT-01", descricao=None),
            current_user=self.current_user,
            db=self.db,
        )
        with self.assertRaises(Exception) as ctx:
            alterar_servico(
                2,
                payload=SimpleNamespace(nome="Servico 2", indice="R$", preco=14, prazo=9, codigo="PUT-01", descricao=None),
                current_user=self.current_user,
                db=self.db,
            )
        self.assertEqual(getattr(ctx.exception, "status_code", None), 409)

    def test_codigo_vazio_vira_null(self):
        result = criar_servico(
            1,
            payload=SimpleNamespace(nome="Servico Null", indice="R$", preco=10, prazo=2, codigo="   ", descricao="   "),
            current_user=self.current_user,
            db=self.db,
        )
        self.assertIsNone(result["codigo"])
        self.assertIsNone(result["descricao"])


if __name__ == "__main__":
    unittest.main()
