import unittest
from types import SimpleNamespace
from unittest.mock import patch

from fastapi import HTTPException

from routes import auth_routes, user_admin_routes


class Query:
    def __init__(self, value): self.value = value
    def filter(self, *args): return self
    def order_by(self, *args): return self
    def all(self): return [self.value] if self.value is not None else []
    def first(self): return self.value


class Db:
    def __init__(self, user): self.user, self.commits = user, 0
    def query(self, model): return Query(self.user)
    def commit(self): self.commits += 1


class PasswordRegressionTests(unittest.TestCase):
    def user(self, internal="internal-hash", login="login-hash"):
        return SimpleNamespace(id=1, clinica_id=2, senha_interna_hash=internal, senha_hash=login,
                               is_admin=True, setup_completed=True, forcar_troca_senha=False, online=True)

    def test_login_password_change_preserves_internal_hash(self):
        user = self.user()
        payload = user_admin_routes.AdminChangePasswordRequest(
            usuario="Admin", codigo=1, senha_atual="old-login", nova_senha="new-login", confirma_senha="new-login"
        )
        db = Db(user)
        with patch.object(user_admin_routes, "verify_password", return_value=True), patch.object(user_admin_routes, "hash_password", return_value="new-login-hash"):
            user_admin_routes.admin_change_password_by_user(payload, user, db)
        self.assertEqual(user.senha_hash, "new-login-hash")
        self.assertEqual(user.senha_interna_hash, "internal-hash")

    def test_password_reset_preserves_internal_hash(self):
        user = self.user()
        record = SimpleNamespace(used=False)
        db = Db(user)
        payload = auth_routes.ResetPasswordRequest(email="admin@example.com", codigo="123456", nova_senha="new-login")
        with patch.object(auth_routes, "load_valid_code", return_value=record), patch.object(auth_routes, "hash_password", return_value="new-login-hash"):
            auth_routes.password_reset(payload, db)
        self.assertEqual(user.senha_hash, "new-login-hash")
        self.assertEqual(user.senha_interna_hash, "internal-hash")
        self.assertTrue(record.used)

    def test_protected_unlock_prefers_internal_hash(self):
        user = self.user()
        db = Db(user)
        payload = auth_routes.ProtectedUnlockRequest(senha="internal", module_code="*")
        with patch.object(auth_routes, "verify_admin_password", return_value=True), patch.object(auth_routes, "create_access_token", return_value="grant"):
            result = auth_routes.unlock_protected_module(payload, user, db)
        self.assertEqual(result["grant_token"], "grant")

    def test_protected_unlock_rejects_wrong_password(self):
        user = self.user()
        with patch.object(auth_routes, "verify_admin_password", return_value=False):
            with self.assertRaises(HTTPException) as error:
                auth_routes.unlock_protected_module(auth_routes.ProtectedUnlockRequest(senha="login", module_code="*"), user, Db(user))
        self.assertEqual(error.exception.status_code, 400)


if __name__ == "__main__": unittest.main()
