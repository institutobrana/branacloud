import os
import sys
from datetime import datetime, timedelta
from pathlib import Path
from types import SimpleNamespace
import unittest

from fastapi import FastAPI, Request
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.pool import StaticPool
from sqlalchemy.orm import sessionmaker

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

os.environ.setdefault("DATABASE_URL", "sqlite+pysqlite:///:memory:")
os.environ.setdefault("JWT_SECRET_KEY", "test-secret-key-for-procedimentos-dashboard-preview-tests")

from database import Base, get_db
from models.cenario import Cenario
from models.clinica import Clinica
from models.material import ListaMaterial, Material
from models.convenio_odonto import ConvenioOdonto, PlanoOdonto
from models.prestador_odonto import PrestadorCredenciamentoOdonto, PrestadorOdonto
from models.procedimento import Procedimento, ProcedimentoMaterial
from models.procedimento_generico import ProcedimentoGenerico, ProcedimentoGenericoMaterial
from models.unidade_atendimento import UnidadeAtendimento
from routes.procedimentos_routes import router
from security.dependencies import get_current_user


TABLES = [
    Clinica.__table__,
    Cenario.__table__,
    ListaMaterial.__table__,
    Material.__table__,
    ProcedimentoGenerico.__table__,
    ProcedimentoGenericoMaterial.__table__,
    Procedimento.__table__,
    ProcedimentoMaterial.__table__,
]


class ProcedimentosDashboardPreviewRouteTests(unittest.TestCase):
    def setUp(self):
        self.engine = create_engine(
            "sqlite+pysqlite:///:memory:",
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
        )
        self.SessionLocal = sessionmaker(bind=self.engine)
        Base.metadata.create_all(bind=self.engine, tables=TABLES)
        self._seed()

        self.app = FastAPI()

        @self.app.middleware("http")
        async def api_prefix_alias(request: Request, call_next):
            path = request.scope.get("path", "")
            if path == "/api" or path.startswith("/api/"):
                request.scope["path"] = path[4:] or "/"
                request.scope["root_path"] = f"{request.scope.get('root_path', '')}/api"
            return await call_next(request)

        self.app.include_router(router)
        self.app.dependency_overrides[get_db] = self._override_db
        self.app.dependency_overrides[get_current_user] = self._override_user
        self.client = TestClient(self.app)

    def tearDown(self):
        self.app.dependency_overrides.clear()
        Base.metadata.drop_all(bind=self.engine, tables=TABLES)
        self.engine.dispose()

    def _override_db(self):
        db = self.SessionLocal()
        try:
            yield db
        finally:
            db.close()

    def _override_user(self):
        return SimpleNamespace(id=1, clinica_id=1, is_admin=True, ativo=True, setup_completed=True)

    def _seed(self):
        db = self.SessionLocal()
        try:
            db.add_all(
                [
                    Clinica(
                        id=1,
                        nome="Clinica A",
                        email="a@example.test",
                        trial_ate=datetime.utcnow() + timedelta(days=1),
                        ativo=True,
                        nome_tabela_procedimentos="Tabela A",
                    ),
                    Clinica(
                        id=2,
                        nome="Clinica B",
                        email="b@example.test",
                        trial_ate=datetime.utcnow() + timedelta(days=1),
                        ativo=True,
                        nome_tabela_procedimentos="Tabela B",
                    ),
                ]
            )
            db.add(Cenario(id=1, clinica_id=1, cfpm=2.31, ir=10, cd=20, cartao=4))
            db.add_all(
                [
                    ListaMaterial(id=1, nome="Lista A", clinica_id=1),
                    ListaMaterial(id=2, nome="Lista B", clinica_id=2),
                ]
            )
            db.add_all(
                [
                    Material(id=1, codigo="001", nome="Material A", custo=5.5, preco=9, relacao=1, lista_id=1),
                    Material(id=2, codigo="002", nome="Material B", custo=99, preco=120, relacao=1, lista_id=2),
                ]
            )
            db.add(
                ProcedimentoGenerico(
                    id=1,
                    clinica_id=1,
                    codigo="G001",
                    descricao="Generico A",
                    tempo=30,
                    custo_lab=0,
                )
            )
            db.add(
                ProcedimentoGenericoMaterial(
                    id=1,
                    procedimento_generico_id=1,
                    material_id=1,
                    quantidade=2,
                    clinica_id=1,
                )
            )
            db.add_all(
                [
                    Procedimento(
                        id=1,
                        clinica_id=1,
                        tabela_id=1,
                        codigo=10,
                        nome="Procedimento A",
                        preco=300,
                        tempo=45,
                        custo_lab=20,
                        procedimento_generico_id=1,
                    ),
                    Procedimento(
                        id=2,
                        clinica_id=2,
                        tabela_id=1,
                        codigo=20,
                        nome="Procedimento B",
                        preco=900,
                        tempo=60,
                        custo_lab=10,
                    ),
                ]
            )
            db.add(
                ProcedimentoMaterial(
                    id=1,
                    procedimento_id=1,
                    material_id=1,
                    quantidade=3,
                    clinica_id=1,
                )
            )
            db.commit()
        finally:
            db.close()

    def _payload(self, **overrides):
        payload = {
            "procedimento_id": None,
            "tabela_id": 1,
            "procedimento_generico_id": None,
            "preco": 300,
            "tempo": 45,
            "custo_lab": 20,
            "custo": 0,
            "materiais": [{"material_id": 1, "quantidade": 2, "custo_und": 5.5}],
        }
        payload.update(overrides)
        return payload

    def _count_records(self):
        db = self.SessionLocal()
        try:
            return {
                "procedimentos": db.query(Procedimento).count(),
                "vinculos": db.query(ProcedimentoMaterial).count(),
            }
        finally:
            db.close()

    def test_post_dashboard_preview_sem_token_retorna_401(self):
        app = FastAPI()
        app.include_router(router)
        app.dependency_overrides[get_db] = self._override_db
        client = TestClient(app)

        response = client.post("/procedimentos/dashboard-preview", json=self._payload())

        self.assertEqual(response.status_code, 401)

    def test_post_dashboard_preview_novo_procedimento_retorna_contrato_react(self):
        before = self._count_records()

        response = self.client.post("/procedimentos/dashboard-preview", json=self._payload())

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data["itens"]), 1)
        self.assertEqual(len(data["grafico"]), 1)
        self.assertIn("custo_proc", data["itens"][0])
        self.assertIn("lucro_liquido", data["itens"][0])
        self.assertEqual(data["materiais"]["total_materiais"], 1)
        self.assertEqual(before, self._count_records())

    def test_post_dashboard_preview_procedimento_existente_mesma_clinica(self):
        response = self.client.post(
            "/procedimentos/dashboard-preview",
            json=self._payload(procedimento_id=1, preco=350, tempo=50),
        )

        self.assertEqual(response.status_code, 200)
        item = response.json()["itens"][0]
        self.assertEqual(item["id"], 1)
        self.assertEqual(item["preco"], 350)
        self.assertEqual(item["tempo"], 50)

    def test_post_dashboard_preview_procedimento_ou_material_de_outra_clinica_nao_vaza(self):
        proc_response = self.client.post(
            "/procedimentos/dashboard-preview",
            json=self._payload(procedimento_id=2),
        )
        material_response = self.client.post(
            "/procedimentos/dashboard-preview",
            json=self._payload(materiais=[{"material_id": 2, "quantidade": 1}]),
        )

        self.assertEqual(proc_response.status_code, 404)
        self.assertEqual(material_response.status_code, 404)

    def test_post_dashboard_preview_payload_invalido_retorna_422(self):
        response = self.client.post("/procedimentos/dashboard-preview", json={"materiais": "invalido"})

        self.assertEqual(response.status_code, 422)

    def test_post_dashboard_preview_nao_colide_com_rota_dinamica(self):
        post_response = self.client.post("/procedimentos/dashboard-preview", json=self._payload())
        get_response = self.client.get("/procedimentos/dashboard-preview")

        self.assertEqual(post_response.status_code, 200)
        self.assertNotEqual(post_response.status_code, 405)
        self.assertIn(get_response.status_code, {404, 405, 422})

    def test_post_dashboard_preview_via_api_alias_preserva_metodo_body_status_e_resposta(self):
        response = self.client.post("/api/procedimentos/dashboard-preview", json=self._payload(preco=420))

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["itens"][0]["preco"], 420)
        self.assertIn("grafico", data)


if __name__ == "__main__":
    unittest.main()
