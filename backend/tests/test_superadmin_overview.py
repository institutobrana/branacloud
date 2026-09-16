import os
import sys
from dataclasses import dataclass
from datetime import datetime, timezone
from types import SimpleNamespace
from pathlib import Path
import unittest

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

os.environ.setdefault("DATABASE_URL", "sqlite+pysqlite:///:memory:")
os.environ.setdefault("JWT_SECRET_KEY", "test-secret-key-for-superadmin-overview-tests")

from routes import superadmin_routes


@dataclass
class FakeClinica:
    id: int
    nome: str
    email: str = "clinica@brana.com"
    ativo: bool = True
    tipo_conta: str = "MENSAL"
    trial_ate: object = None
    data_ativacao: object = None


@dataclass
class FakeUsuario:
    id: int
    nome: str
    email: str
    clinica_id: int
    is_admin: bool = False
    online: bool = False
    ultimo_login_em: object = None


class FakeOverviewQuery:
    def __init__(self, db, kind):
        self.db = db
        self.kind = kind
        self.filters = []

    def order_by(self, *args, **kwargs):
        return self

    def filter(self, *args, **kwargs):
        self.filters.extend(args)
        return self

    def group_by(self, *args, **kwargs):
        return self

    def all(self):
        if self.kind == "clinicas":
            return self.db.clinicas
        if self.kind == "owner_pairs":
            return [(u.clinica_id, u.email) for u in self.db.usuarios]
        if self.kind == "contagem_users":
            counts = {}
            for u in self.db.usuarios:
                counts[u.clinica_id] = counts.get(u.clinica_id, 0) + 1
            return list(counts.items())
        if self.kind == "responsavel":
            clinica_id = None
            for expr in self.filters:
                if getattr(getattr(expr, "left", None), "name", None) == "clinica_id":
                    clinica_id = getattr(getattr(expr, "right", None), "value", None)
                    break
            return [u for u in self.db.usuarios if u.clinica_id == clinica_id]
        return []

    def scalar(self):
        if self.kind == "total_usuarios":
            return len(self.db.usuarios)
        if self.kind == "usuarios_ativos":
            return len(self.db.usuarios)
        return 0

    def count(self):
        return self.scalar()


class FakeDb:
    def __init__(self, clinicas, usuarios):
        self.clinicas = clinicas
        self.usuarios = usuarios

    def query(self, *args):
        if len(args) == 1:
            model = args[0]
            if model is superadmin_routes.Clinica:
                return FakeOverviewQuery(self, "clinicas")
            if model is superadmin_routes.Usuario:
                return FakeOverviewQuery(self, "responsavel")
            if getattr(model, "name", None) == "count":
                return FakeOverviewQuery(self, "count")
            return FakeOverviewQuery(self, "count")
        if len(args) == 2:
            if getattr(args[1], "name", None) == "email":
                return FakeOverviewQuery(self, "owner_pairs")
            return FakeOverviewQuery(self, "contagem_users")
        return FakeOverviewQuery(self, "count")


class SuperadminOverviewTests(unittest.TestCase):
    def setUp(self):
        self.original_require = superadmin_routes._require_superadmin
        superadmin_routes._require_superadmin = lambda current_user: None

    def tearDown(self):
        superadmin_routes._require_superadmin = self.original_require

    def test_overview_exposes_clinic_access_list_without_inventing_last_access(self):
        db = FakeDb(
            clinicas=[
                FakeClinica(id=1, nome="Clínica A"),
                FakeClinica(id=2, nome="Clínica B"),
            ],
            usuarios=[
                FakeUsuario(
                    id=10,
                    nome="Admin A",
                    email="a@brana.com",
                    clinica_id=1,
                    is_admin=True,
                    online=True,
                    ultimo_login_em=datetime(2026, 7, 20, 12, 30, tzinfo=timezone.utc),
                ),
                FakeUsuario(id=11, nome="Usuário B", email="b@brana.com", clinica_id=2, is_admin=False, online=False),
            ],
        )
        current_user = SimpleNamespace(email="master@brana.com")

        result = superadmin_routes.superadmin_overview(current_user=current_user, db=db)

        self.assertIn("acessos_clinicas", result)
        self.assertNotIn("online_resumo", result)
        self.assertEqual(len(result["acessos_clinicas"]), 2)
        self.assertEqual(result["acessos_clinicas"][0]["ultimo_acesso"], "2026-07-20T12:30:00+00:00")
        self.assertEqual(result["acessos_clinicas"][1]["ultimo_acesso"], None)
        self.assertIn(result["acessos_clinicas"][0]["status"], {"online", "offline", "indisponivel"})


if __name__ == "__main__":
    unittest.main()
