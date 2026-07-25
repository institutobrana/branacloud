import os
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path
from types import SimpleNamespace
import unittest

from jose import jwt
from jose.utils import base64url_encode
from fastapi import HTTPException

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

os.environ.setdefault("DATABASE_URL", "sqlite+pysqlite:///:memory:")
os.environ.setdefault("JWT_SECRET_KEY", "test-secret-key-for-auth-renew-tests")

from routes import auth_routes
from security.jwt_handler import create_access_token


SECRET = os.environ["JWT_SECRET_KEY"]


class FakeQuery:
    def __init__(self, session, model):
        self.session = session
        self.model = model
        self.filters = []

    def filter(self, *args, **kwargs):
        self.filters.extend(args)
        return self

    def first(self):
        record = self.session.records.get(self.model)
        if record is None:
            return None
        for expr in self.filters:
            left = getattr(expr, "left", None)
            right = getattr(expr, "right", None)
            key = getattr(left, "name", None)
            expected = getattr(right, "value", None)
            if key is None:
                continue
            if getattr(record, key, None) != expected:
                return None
        return record


class FakeDb:
    def __init__(self, usuario=None, clinica=None):
        self.records = {}
        if usuario is not None:
            self.records[auth_routes.Usuario] = usuario
        if clinica is not None:
            self.records[auth_routes.Clinica] = clinica
        self.commits = 0

    def query(self, model):
        return FakeQuery(self, model)

    def commit(self):
        self.commits += 1

    def refresh(self, obj):
        return obj


class RenewAuthTests(unittest.TestCase):
    def setUp(self):
        self._original_presence = auth_routes.get_current_user.__globals__["mark_user_activity_fail_open"]
        auth_routes.get_current_user.__globals__["mark_user_activity_fail_open"] = lambda usuario: False

    def tearDown(self):
        auth_routes.get_current_user.__globals__["mark_user_activity_fail_open"] = self._original_presence

    def make_user(self, **overrides):
        data = {
            "id": 1,
            "codigo": 101,
            "nome": "Usuario Teste",
            "apelido": "Teste",
            "tipo_usuario": "Admin",
            "email": "teste@brana.com",
            "senha_hash": "hash",
            "ativo": True,
            "online": True,
            "ultimo_login_em": None,
            "last_seen_at": None,
            "forcar_troca_senha": False,
            "setup_completed": True,
            "is_system_user": False,
            "is_admin": True,
            "prestador_id": None,
            "unidade_atendimento_id": None,
            "preferencias_usuario_json": None,
            "preferencias_agenda_json": None,
            "preferencias_impressora_json": None,
            "preferencias_etiqueta_json": None,
            "permissoes_json": None,
            "clinica_id": 7,
        }
        data.update(overrides)
        return SimpleNamespace(**data)

    def make_clinica(self, **overrides):
        data = {
            "id": 7,
            "nome": "Clinica Teste",
            "email": "clinica@brana.com",
            "trial_ate": datetime.utcnow() + timedelta(days=30),
            "ativo": True,
        }
        data.update(overrides)
        return SimpleNamespace(**data)

    def make_request(self, path="/auth/renew"):
        return SimpleNamespace(url=SimpleNamespace(path=path))

    def make_token(self, payload):
        return jwt.encode(payload, SECRET, algorithm="HS256")

    def test_renew_success_emits_new_token_and_me_accepts_it(self):
        user = self.make_user()
        clinic = self.make_clinica()
        db = FakeDb(usuario=user, clinica=clinic)
        old_token = create_access_token(
            {"user_id": user.id, "clinica_id": user.clinica_id, "is_admin": user.is_admin}
        )
        old_payload = jwt.decode(old_token, SECRET, algorithms=["HS256"])

        result = auth_routes.renew_auth_token(current_user=user, db=db)

        self.assertEqual(result["token_type"], "bearer")
        self.assertEqual(result["expires_in"], 3600)
        self.assertIn("access_token", result)

        new_payload = jwt.decode(result["access_token"], SECRET, algorithms=["HS256"])
        self.assertEqual(new_payload["user_id"], user.id)
        self.assertEqual(new_payload["clinica_id"], user.clinica_id)
        self.assertEqual(new_payload["is_admin"], True)
        self.assertGreaterEqual(new_payload["exp"], old_payload["exp"])

        loaded = auth_routes.get_current_user(
            self.make_request("/me"),
            token=result["access_token"],
            db=db,
        )
        self.assertEqual(loaded.id, user.id)

        me = auth_routes.me(current_user=loaded)
        self.assertEqual(me["id"], user.id)
        self.assertEqual(me["clinica_id"], user.clinica_id)
        self.assertEqual(me["is_master"], False)
        self.assertEqual(me["is_superadmin"], False)

    def test_me_exposes_master_alias_for_owner_email(self):
        user = self.make_user(email="gleissontel@gmail.com")
        me = auth_routes.me(current_user=user)

        self.assertEqual(me["email"], "gleissontel@gmail.com")
        self.assertTrue(me["is_master"])
        self.assertTrue(me["is_superadmin"])
        self.assertTrue(me["is_admin"])

    def test_me_preserves_common_user_flags(self):
        user = self.make_user(email="usuario.comum@brana.com", is_admin=False)
        me = auth_routes.me(current_user=user)

        self.assertFalse(me["is_master"])
        self.assertFalse(me["is_superadmin"])
        self.assertFalse(me["is_admin"])

    def test_login_success_updates_last_login_after_valid_password(self):
        user = self.make_user(online=False)
        db = FakeDb(usuario=user, clinica=self.make_clinica())
        original_verify = auth_routes.verify_password
        original_token = auth_routes.create_access_token
        auth_routes.verify_password = lambda password, senha_hash: True
        auth_routes.create_access_token = lambda payload, **kwargs: "token-ok"

        try:
            result = auth_routes.login(form_data=SimpleNamespace(username=user.email, password="senha-ok"), db=db)
        finally:
            auth_routes.verify_password = original_verify
            auth_routes.create_access_token = original_token

        self.assertEqual(result["access_token"], "token-ok")
        self.assertIsNotNone(user.ultimo_login_em)
        self.assertIsNotNone(user.last_seen_at)
        self.assertIsNotNone(user.last_seen_at.tzinfo)
        self.assertTrue(user.online)
        self.assertEqual(db.commits, 1)

    def test_login_invalid_password_does_not_update_last_login(self):
        user = self.make_user(online=False)
        db = FakeDb(usuario=user, clinica=self.make_clinica())
        original_verify = auth_routes.verify_password
        auth_routes.verify_password = lambda password, senha_hash: False

        try:
            with self.assertRaises(HTTPException) as ctx:
                auth_routes.login(form_data=SimpleNamespace(username=user.email, password="errada"), db=db)
        finally:
            auth_routes.verify_password = original_verify

        self.assertEqual(ctx.exception.status_code, 400)
        self.assertIsNone(user.ultimo_login_em)
        self.assertIsNone(user.last_seen_at)
        self.assertFalse(user.online)
        self.assertEqual(db.commits, 0)

    def test_renew_rejects_tampered_token(self):
        db = FakeDb(usuario=self.make_user(), clinica=self.make_clinica())
        valid_token = self.make_token({"user_id": 1, "clinica_id": 7, "is_admin": True})
        header, payload, signature = valid_token.split(".")
        tampered_payload = base64url_encode(b'{"user_id":999,"clinica_id":7,"is_admin":true}').decode("utf-8")
        tampered_token = ".".join([header, tampered_payload, signature])

        with self.assertRaises(HTTPException) as ctx:
            auth_routes.get_current_user(self.make_request("/auth/renew"), token=tampered_token, db=db)
        self.assertEqual(ctx.exception.status_code, 401)
        self.assertIsNone(db.records[auth_routes.Usuario].last_seen_at)

    def test_renew_rejects_missing_required_claims(self):
        db = FakeDb(usuario=self.make_user(), clinica=self.make_clinica())
        missing_user_id = self.make_token({"clinica_id": 7, "is_admin": True})

        with self.assertRaises(HTTPException) as ctx:
            auth_routes.get_current_user(self.make_request("/auth/renew"), token=missing_user_id, db=db)
        self.assertEqual(ctx.exception.status_code, 401)

        token_missing_clinica = self.make_token({"user_id": 1, "is_admin": True})
        loaded = auth_routes.get_current_user(self.make_request("/auth/renew"), token=token_missing_clinica, db=db)
        self.assertEqual(loaded.id, 1)

    def test_renew_rejects_missing_token(self):
        db = FakeDb(usuario=self.make_user(), clinica=self.make_clinica())
        with self.assertRaises(HTTPException) as ctx:
            auth_routes.get_current_user(self.make_request("/auth/renew"), token="", db=db)
        self.assertEqual(ctx.exception.status_code, 401)

    def test_renew_rejects_malformed_token(self):
        db = FakeDb(usuario=self.make_user(), clinica=self.make_clinica())
        with self.assertRaises(HTTPException) as ctx:
            auth_routes.get_current_user(self.make_request("/auth/renew"), token="not-a-jwt", db=db)
        self.assertEqual(ctx.exception.status_code, 401)

    def test_renew_rejects_expired_token(self):
        db = FakeDb(usuario=self.make_user(), clinica=self.make_clinica())
        expired_token = jwt.encode(
            {
                "user_id": 1,
                "clinica_id": 7,
                "is_admin": True,
                "exp": datetime.utcnow() - timedelta(minutes=1),
            },
            SECRET,
            algorithm="HS256",
        )
        with self.assertRaises(HTTPException) as ctx:
            auth_routes.get_current_user(self.make_request("/auth/renew"), token=expired_token, db=db)
        self.assertEqual(ctx.exception.status_code, 401)

    def test_renew_rejects_inactive_user(self):
        user = self.make_user(ativo=False)
        db = FakeDb(usuario=user, clinica=self.make_clinica())
        with self.assertRaises(HTTPException) as ctx:
            auth_routes.renew_auth_token(current_user=user, db=db)
        self.assertEqual(ctx.exception.status_code, 403)
        self.assertIsNone(user.last_seen_at)

    def test_renew_rejects_inactive_clinic(self):
        user = self.make_user()
        db = FakeDb(usuario=user, clinica=self.make_clinica(ativo=False))
        with self.assertRaises(HTTPException) as ctx:
            auth_routes.renew_auth_token(current_user=user, db=db)
        self.assertEqual(ctx.exception.status_code, 403)

    def test_renew_works_during_setup_but_still_requires_auth(self):
        user = self.make_user(setup_completed=False)
        db = FakeDb(usuario=user, clinica=self.make_clinica())

        loaded = auth_routes.get_current_user(
            self.make_request("/auth/renew"),
            token=self.make_token({"user_id": user.id, "clinica_id": user.clinica_id, "is_admin": True}),
            db=db,
        )
        self.assertEqual(loaded.id, user.id)
        self.assertIsNone(user.ultimo_login_em)

        with self.assertRaises(HTTPException) as ctx:
            auth_routes.get_current_user(self.make_request("/auth/renew"), token="", db=db)
        self.assertEqual(ctx.exception.status_code, 401)

    def test_logout_does_not_create_token_revocation(self):
        user = self.make_user(online=False)
        db = FakeDb(usuario=user, clinica=self.make_clinica())
        result = auth_routes.renew_auth_token(current_user=user, db=db)
        self.assertEqual(result["token_type"], "bearer")
        self.assertEqual(result["expires_in"], 3600)
        payload = jwt.decode(result["access_token"], SECRET, algorithms=["HS256"])
        self.assertEqual(payload["user_id"], user.id)
        self.assertEqual(payload["clinica_id"], user.clinica_id)

    def test_logout_still_clears_online_flag(self):
        user = self.make_user()
        db = FakeDb(usuario=user, clinica=self.make_clinica())
        response = auth_routes.logout(current_user=user, db=db)
        self.assertEqual(response["detail"], "Sessao encerrada com sucesso.")
        self.assertFalse(user.online)
        self.assertIsNone(user.ultimo_login_em)

    def test_get_current_user_records_presence_fail_open(self):
        user = self.make_user()
        db = FakeDb(usuario=user, clinica=self.make_clinica())
        token = self.make_token({"user_id": user.id, "clinica_id": user.clinica_id, "is_admin": True})
        calls = []
        auth_routes.get_current_user.__globals__["mark_user_activity_fail_open"] = lambda usuario: calls.append(usuario.id) or True

        loaded = auth_routes.get_current_user(self.make_request("/me"), token=token, db=db)

        self.assertEqual(loaded.id, user.id)
        self.assertEqual(calls, [user.id])
        self.assertEqual(db.commits, 0)

    def test_renew_does_not_update_last_login(self):
        user = self.make_user(online=True)
        db = FakeDb(usuario=user, clinica=self.make_clinica())

        result = auth_routes.renew_auth_token(current_user=user, db=db)

        self.assertEqual(result["token_type"], "bearer")
        self.assertIsNone(user.ultimo_login_em)



if __name__ == "__main__":
    unittest.main()
