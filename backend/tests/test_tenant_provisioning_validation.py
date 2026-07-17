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
            result = run_tenant_command(["--validate"], env)
            user_count = row_count(pg["dsn"], "usuarios")
        self.assertEqual(result.returncode, 0, msg=(result.stdout or "") + (result.stderr or ""))
        self.assertIn("'ok': True", result.stdout)
        self.assertEqual(user_count, 1)
