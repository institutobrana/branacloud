import importlib
import os
import sys
import unittest
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch

import psycopg2
from fastapi.testclient import TestClient

from backend.tests.tenant_provisioning_test_utils import disposable_postgres, prepare_schema, provisioning_env, run_tenant_command


ROOT = Path(__file__).resolve().parents[2]


def load_main():
    for name in list(sys.modules):
        if name == "main" or name.startswith(("database", "models", "routes", "schemas", "security", "services")):
            sys.modules.pop(name, None)
    return importlib.import_module("main")


def db_row(dsn):
    conn = psycopg2.connect(dsn)
    try:
        with conn.cursor() as cur:
            cur.execute('SELECT senha_hash, senha_interna_hash, setup_completed, forcar_troca_senha, online FROM public.usuarios WHERE email = %s', ("admin@example.com",))
            return cur.fetchone()
    finally:
        conn.close()


class PasswordRegressionIntegrationTests(unittest.TestCase):
    def test_password_contracts_against_disposable_postgres(self):
        with disposable_postgres() as pg:
            self.assertEqual(prepare_schema(pg).returncode, 0)
            env = provisioning_env(
                pg,
                BRANA_INITIAL_ADMIN_EMAIL="admin@example.com",
                BRANA_INITIAL_ADMIN_PASSWORD="LoginA123",
            )
            self.assertEqual(run_tenant_command(["--apply"], env).returncode, 0)
            os.environ.update({
                **env,
                "JWT_SECRET_KEY": "isolated-test-secret",
                "BRANA_ENABLE_SCHEMA_BOOTSTRAP": "0",
                "BRANA_ENABLE_RUNTIME_BOOTSTRAP": "0",
                "BRANA_ALLOW_HTTP_RUNTIME_BOOTSTRAP": "0",
                "BRANA_ALLOW_SCHEMA_COMPAT_APPLY": "0",
                "BRANA_SKIP_BOOTSTRAP": "1",
            })
            main = load_main()
            with TestClient(main.app) as client:
                login = client.post("/login", data={"username": "admin@example.com", "password": "LoginA123"})
                self.assertEqual(login.status_code, 200, login.text)
                token = login.json()["access_token"]
                headers = {"Authorization": f"Bearer {token}"}

                setup = client.post("/auth/setup/complete", json={"senha": "InternalA", "confirma_senha": "InternalA"}, headers=headers)
                self.assertEqual(setup.status_code, 200, setup.text)
                before = db_row(pg["dsn"])
                self.assertTrue(before[1])
                original_internal = before[1]

                changed = client.post("/admin/users/change-password", json={"usuario": "Admin Teste", "codigo": 1, "senha_atual": "LoginA123", "nova_senha": "LoginB123", "confirma_senha": "LoginB123"}, headers={**headers, "X-Protected-Password": "InternalA"})
                self.assertEqual(changed.status_code, 200, changed.text)
                after_login_change = db_row(pg["dsn"])
                self.assertNotEqual(after_login_change[0], before[0])
                self.assertEqual(after_login_change[1], original_internal)
                self.assertEqual(client.post("/login", data={"username": "admin@example.com", "password": "LoginB123"}).status_code, 200)
                self.assertNotEqual(client.post("/login", data={"username": "admin@example.com", "password": "LoginA123"}).status_code, 200)
                self.assertEqual(client.post("/auth/protected/unlock", json={"senha": "InternalA"}, headers=headers).status_code, 200)

                reset_record = SimpleNamespace(used=False)
                with patch.object(importlib.import_module("routes.auth_routes"), "load_valid_code", return_value=reset_record):
                    reset = client.post("/password/reset", json={"email": "admin@example.com", "codigo": "test-code", "nova_senha": "LoginC123"}, headers=headers)
                self.assertEqual(reset.status_code, 200, reset.text)
                after_reset = db_row(pg["dsn"])
                self.assertNotEqual(after_reset[0], after_login_change[0])
                self.assertEqual(after_reset[1], original_internal)
                self.assertEqual(client.post("/login", data={"username": "admin@example.com", "password": "LoginC123"}).status_code, 200)
                self.assertEqual(client.post("/auth/protected/unlock", json={"senha": "InternalA"}, headers=headers).status_code, 200)

                conn = psycopg2.connect(pg["dsn"])
                try:
                    with conn.cursor() as cur:
                        cur.execute('UPDATE public.usuarios SET senha_interna_hash = NULL WHERE email = %s', ("admin@example.com",))
                    conn.commit()
                finally:
                    conn.close()
                self.assertEqual(client.post("/auth/protected/unlock", json={"senha": "LoginC123"}, headers=headers).status_code, 200)

                internal_change = client.post("/auth/internal-password/change", json={"senha_interna_atual": "LoginC123", "nova_senha_interna": "InternalB", "confirma_senha_interna": "InternalB"}, headers=headers)
                self.assertEqual(internal_change.status_code, 200, internal_change.text)
                final = db_row(pg["dsn"])
                self.assertEqual(final[0], after_reset[0])
                self.assertNotEqual(final[1], original_internal)
                self.assertEqual(final[2:], after_reset[2:])


if __name__ == "__main__":
    unittest.main()
