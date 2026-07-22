import os
import sys
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from pathlib import Path
import unittest

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

os.environ.setdefault("DATABASE_URL", "sqlite+pysqlite:///:memory:")
os.environ.setdefault("JWT_SECRET_KEY", "test-secret-key-for-superadmin-users-presence")

from routes import superadmin_routes


@dataclass
class FakeClinica:
    id: int
    nome: str
    email: str = "clinica@brana.test"
    ativo: bool = True
    tipo_conta: str = "MENSAL"
    trial_ate: object = None
    data_ativacao: object = None
    cnpj: str | None = None


@dataclass
class FakeUsuario:
    id: int
    nome: str
    email: str
    clinica_id: int
    ativo: bool = True
    is_admin: bool = False
    is_system_user: bool = False
    codigo: int | None = None
    tipo_usuario: str | None = None
    last_seen_at: object = None


class FakeUsersQuery:
    def __init__(self, rows):
        self.rows = rows

    def filter(self, *args, **kwargs):
        return self

    def order_by(self, *args, **kwargs):
        return self

    def limit(self, *args, **kwargs):
        return self

    def all(self):
        return self.rows


class FakeDb:
    def __init__(self, users, clinics):
        self.users = users
        self.clinics = clinics

    def query(self, *args):
        if len(args) == 1 and args[0] is superadmin_routes.Usuario:
            return FakeUsersQuery(self.users)
        if len(args) == 1 and args[0] is superadmin_routes.Clinica:
            return FakeUsersQuery(self.clinics)
        if len(args) == 2:
            return FakeUsersQuery([(u.clinica_id, u.email) for u in self.users])
        return FakeUsersQuery([])


class SuperadminUsersPresenceTests(unittest.TestCase):
    def test_users_payload_exposes_last_seen_and_is_online_without_reusing_system_user_activity(self):
        now = datetime.now(timezone.utc)
        users = [
            FakeUsuario(id=1, nome="Online", email="online@test", clinica_id=10, last_seen_at=now - timedelta(minutes=2)),
            FakeUsuario(id=2, nome="Offline", email="offline@test", clinica_id=10, last_seen_at=now - timedelta(minutes=4)),
            FakeUsuario(id=3, nome="Never", email="never@test", clinica_id=10, last_seen_at=None),
            FakeUsuario(
                id=4,
                nome="Clínica",
                email="clinica.255.c10@system.brana.local",
                clinica_id=10,
                is_system_user=True,
                last_seen_at=now,
            ),
        ]
        db = FakeDb(users=users, clinics=[FakeClinica(id=10, nome="Clínica Local")])

        rows = superadmin_routes._listar_usuarios_superadmin(db)
        by_id = {row["id"]: row for row in rows}

        self.assertEqual(by_id[1]["last_seen_at"], users[0].last_seen_at.isoformat())
        self.assertTrue(by_id[1]["is_online"])
        self.assertFalse(by_id[2]["is_online"])
        self.assertIsNone(by_id[3]["last_seen_at"])
        self.assertFalse(by_id[3]["is_online"])
        self.assertIsNone(by_id[4]["last_seen_at"])
        self.assertFalse(by_id[4]["is_online"])


if __name__ == "__main__":
    unittest.main()
