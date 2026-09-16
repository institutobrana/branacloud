import unittest
from types import SimpleNamespace

from fastapi import HTTPException

from routes import auth_routes


class FakeQuery:
    def __init__(self, user): self.user = user
    def filter(self, *args): return self
    def first(self): return self.user


class FakeDb:
    def __init__(self, user): self.user, self.commits = user, 0
    def query(self, model): return FakeQuery(self.user)
    def commit(self): self.commits += 1


class InternalPasswordChangeTests(unittest.TestCase):
    def make_user(self, internal_hash="internal-hash", login_hash="login-hash"):
        return SimpleNamespace(id=7, clinica_id=11, senha_interna_hash=internal_hash, senha_hash=login_hash)

    def payload(self, **overrides):
        values = {"senha_interna_atual": "old-internal", "nova_senha_interna": "new-internal", "confirma_senha_interna": "new-internal"}
        values.update(overrides)
        return auth_routes.InternalPasswordChangeRequest(**values)

    def call_endpoint(self, user, payload, verifier=None):
        original_verify, original_hash = auth_routes.verify_internal_password, auth_routes.hash_password
        try:
            auth_routes.verify_internal_password = verifier or (lambda current, value: True)
            auth_routes.hash_password = lambda value: f"hash:{value}"
            db = FakeDb(user)
            return auth_routes.change_internal_password(payload, user, db), db
        finally:
            auth_routes.verify_internal_password, auth_routes.hash_password = original_verify, original_hash

    def test_changes_only_internal_hash(self):
        user = self.make_user()
        result, db = self.call_endpoint(user, self.payload())
        self.assertEqual(result, {"detail": "Senha interna alterada com sucesso."})
        self.assertEqual(user.senha_interna_hash, "hash:new-internal")
        self.assertEqual(user.senha_hash, "login-hash")
        self.assertEqual(db.commits, 1)

    def test_rejects_wrong_current_internal_password(self):
        with self.assertRaises(HTTPException) as error:
            self.call_endpoint(self.make_user(), self.payload(), verifier=lambda current, value: False)
        self.assertEqual(error.exception.status_code, 400)

    def test_rejects_empty_or_short_new_password(self):
        for value in ("", "short"):
            with self.subTest(value=value), self.assertRaises(HTTPException) as error:
                self.call_endpoint(self.make_user(), self.payload(nova_senha_interna=value, confirma_senha_interna=value))
            self.assertEqual(error.exception.status_code, 400)

    def test_rejects_confirmation_mismatch_or_empty(self):
        for confirmation in ("different", ""):
            with self.subTest(confirmation=confirmation), self.assertRaises(HTTPException) as error:
                self.call_endpoint(self.make_user(), self.payload(confirma_senha_interna=confirmation))
            self.assertEqual(error.exception.status_code, 400)

    def test_supports_null_internal_hash_via_fallback(self):
        user, seen = self.make_user(internal_hash=None), {}
        def verify(current, value):
            seen["user"], seen["password"] = current, value
            return current.senha_interna_hash is None and value == "login-as-fallback"
        _, db = self.call_endpoint(user, self.payload(senha_interna_atual="login-as-fallback"), verifier=verify)
        self.assertIs(seen["user"], user)
        self.assertEqual(seen["password"], "login-as-fallback")
        self.assertEqual(user.senha_interna_hash, "hash:new-internal")
        self.assertEqual(user.senha_hash, "login-hash")
        self.assertEqual(db.commits, 1)


if __name__ == "__main__": unittest.main()
