from __future__ import annotations

import unittest

from backend.tests.tenant_provisioning_test_utils import (
    disposable_postgres,
    prepare_schema,
    provisioning_env,
    row_count,
    run_tenant_command,
)


class TenantProvisioningValidationTests(unittest.TestCase):
    def test_validate_passes_after_apply(self):
        with disposable_postgres() as pg:
            self.assertEqual(prepare_schema(pg).returncode, 0)
            env = provisioning_env(pg)
            self.assertEqual(run_tenant_command(["--apply"], env).returncode, 0)
            env.pop("BRANA_INITIAL_ADMIN_PASSWORD", None)
            env.pop("BRANA_INITIAL_TENANT_ACK", None)
            result = run_tenant_command(["--validate"], env)
            user_count = row_count(pg["dsn"], "usuarios")
        self.assertEqual(result.returncode, 0, msg=(result.stdout or "") + (result.stderr or ""))
        self.assertIn("'ok': True", result.stdout)
        self.assertEqual(user_count, 1)

    def test_validate_does_not_require_password(self):
        with disposable_postgres() as pg:
            self.assertEqual(prepare_schema(pg).returncode, 0)
            env = provisioning_env(pg)
            self.assertEqual(run_tenant_command(["--apply"], env).returncode, 0)
            env.pop("BRANA_INITIAL_ADMIN_PASSWORD", None)
            result = run_tenant_command(["--validate"], env)
        self.assertEqual(result.returncode, 0, msg=(result.stdout or "") + (result.stderr or ""))
        self.assertNotIn("BRANA_INITIAL_ADMIN_PASSWORD", result.stdout + result.stderr)
