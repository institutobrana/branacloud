from __future__ import annotations

import importlib
import os
import sys
import unittest
from pathlib import Path

from fastapi.testclient import TestClient

from backend.tests.tenant_provisioning_test_utils import disposable_postgres, prepare_schema, provisioning_env, run_tenant_command


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))


def _load_main():
    for name in list(sys.modules):
        if name == "main" or name.startswith(("database", "models", "routes", "schemas", "security", "services")):
            sys.modules.pop(name, None)
    return importlib.import_module("main")


class TenantProvisioningAuthSmokeTests(unittest.TestCase):
    def test_login_me_and_admin_authorization(self):
        with disposable_postgres() as pg:
            self.assertEqual(prepare_schema(pg).returncode, 0)
            env = provisioning_env(
                pg,
                BRANA_INITIAL_CLINIC_NAME="Clinica Homologacao",
                BRANA_INITIAL_CLINIC_EMAIL="clinica.hml@example.com",
                BRANA_INITIAL_UNIT_NAME="Principal",
                BRANA_INITIAL_PROVIDER_NAME="Dra. Homologacao",
                BRANA_INITIAL_PROVIDER_CODE="777",
                BRANA_INITIAL_ADMIN_NAME="Admin Homologacao",
                BRANA_INITIAL_ADMIN_EMAIL="admin.hml@example.com",
                BRANA_INITIAL_ADMIN_PASSWORD="Senha123",
            )
            self.assertEqual(run_tenant_command(["--apply"], env).returncode, 0)

            os.environ.update(
                {
                    "DATABASE_URL": env["DATABASE_URL"],
                    "JWT_SECRET_KEY": "test-secret-key-for-tenant-provision-tests",
                    "BRANA_ENABLE_SCHEMA_BOOTSTRAP": "0",
                    "BRANA_ENABLE_RUNTIME_BOOTSTRAP": "0",
                    "BRANA_ALLOW_HTTP_RUNTIME_BOOTSTRAP": "0",
                    "BRANA_ALLOW_SCHEMA_COMPAT_APPLY": "0",
                    "BRANA_SKIP_BOOTSTRAP": "1",
                    "BRANA_RUNTIME_PROFILE": "homologation",
                }
            )

            main = _load_main()
            with TestClient(main.app) as client:
                response = client.post(
                    "/login",
                    data={"username": "admin.hml@example.com", "password": "Senha123"},
                )
                self.assertEqual(response.status_code, 200, msg=response.text)
                token = response.json()["access_token"]
                self.assertTrue(token)

                me = client.get("/me", headers={"Authorization": f"Bearer {token}"})
                self.assertEqual(me.status_code, 200, msg=me.text)
                payload = me.json()
                self.assertTrue(payload["is_admin"])
                self.assertFalse(payload["setup_completed"])
                self.assertEqual(payload["clinica_id"], 1)
                self.assertEqual(payload["permissoes"]["usuarios"], "habilitado")
