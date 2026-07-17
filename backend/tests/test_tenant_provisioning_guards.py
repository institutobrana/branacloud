from __future__ import annotations

import unittest

from backend.tests.tenant_provisioning_test_utils import (
    disposable_postgres,
    prepare_schema,
    provisioning_env,
    run_tenant_command,
)


class TenantProvisioningGuardTests(unittest.TestCase):
    def test_apply_requires_ack(self):
        with disposable_postgres() as pg:
            self.assertEqual(prepare_schema(pg).returncode, 0)
            env = provisioning_env(pg)
            env.pop("BRANA_INITIAL_TENANT_ACK", None)
            result = run_tenant_command(["--apply"], env)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("ACK", (result.stdout + result.stderr).upper())

    def test_apply_requires_password(self):
        with disposable_postgres() as pg:
            self.assertEqual(prepare_schema(pg).returncode, 0)
            env = provisioning_env(pg)
            env.pop("BRANA_INITIAL_ADMIN_PASSWORD", None)
            result = run_tenant_command(["--apply"], env)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("BRANA_INITIAL_ADMIN_PASSWORD", result.stdout + result.stderr)

    def test_apply_requires_valid_email(self):
        with disposable_postgres() as pg:
            self.assertEqual(prepare_schema(pg).returncode, 0)
            env = provisioning_env(pg, BRANA_INITIAL_ADMIN_EMAIL="invalid-email")
            result = run_tenant_command(["--apply"], env)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("invalido", (result.stdout + result.stderr).lower())

    def test_apply_requires_schema_baseline(self):
        with disposable_postgres() as pg:
            result = run_tenant_command(["--apply"], provisioning_env(pg))
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("baseline", (result.stdout + result.stderr).lower())

