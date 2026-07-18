from __future__ import annotations

import unittest

from backend.tests.tenant_provisioning_test_utils import (
    disposable_postgres,
    prepare_schema,
    provisioning_env,
    row_count,
    run_tenant_command,
)


class TenantProvisioningPlanTests(unittest.TestCase):
    def test_plan_is_read_only(self):
        with disposable_postgres() as pg:
            self.assertEqual(prepare_schema(pg).returncode, 0)
            before = row_count(pg["dsn"], "brana_schema_versions")
            env = provisioning_env(pg)
            env.pop("BRANA_INITIAL_ADMIN_PASSWORD", None)
            env.pop("BRANA_INITIAL_TENANT_ACK", None)
            result = run_tenant_command(["--plan"], env)
            after = row_count(pg["dsn"], "brana_schema_versions")
            self.assertEqual(result.returncode, 0, msg=(result.stdout or "") + (result.stderr or ""))
            self.assertIn("Baseline schema aplicada: sim", result.stdout)
            self.assertIn("Tabelas existentes: 65", result.stdout)
            self.assertEqual(before, after)

    def test_plan_does_not_require_password_or_ack(self):
        with disposable_postgres() as pg:
            self.assertEqual(prepare_schema(pg).returncode, 0)
            env = provisioning_env(pg)
            env.pop("BRANA_INITIAL_ADMIN_PASSWORD", None)
            env.pop("BRANA_INITIAL_TENANT_ACK", None)
            result = run_tenant_command(["--plan"], env)
        self.assertEqual(result.returncode, 0, msg=(result.stdout or "") + (result.stderr or ""))
        self.assertNotIn("BRANA_INITIAL_ADMIN_PASSWORD", result.stdout + result.stderr)
        self.assertNotIn("ACK", (result.stdout + result.stderr).upper())
