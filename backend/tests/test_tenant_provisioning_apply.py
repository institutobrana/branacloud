from __future__ import annotations

import unittest

from backend.tests.tenant_provisioning_test_utils import (
    disposable_postgres,
    prepare_schema,
    provisioning_env,
    row_count,
    run_tenant_command,
)


class TenantProvisioningApplyTests(unittest.TestCase):
    def test_apply_creates_initial_tenant(self):
        with disposable_postgres() as pg:
            self.assertEqual(prepare_schema(pg).returncode, 0)
            result = run_tenant_command(["--apply"], provisioning_env(pg))
            self.assertEqual(result.returncode, 0, msg=(result.stdout or "") + (result.stderr or ""))
            self.assertIn("'ok': True", result.stdout)
            self.assertEqual(row_count(pg["dsn"], "clinicas"), 1)
            self.assertEqual(row_count(pg["dsn"], "unidade_atendimento"), 1)
            self.assertEqual(row_count(pg["dsn"], "prestador_odonto"), 1)
            self.assertEqual(row_count(pg["dsn"], "usuarios"), 1)
            self.assertEqual(row_count(pg["dsn"], "access_profile"), 1)
            self.assertEqual(row_count(pg["dsn"], "usuario_perfil_acesso"), 1)

    def test_second_apply_is_refused(self):
        with disposable_postgres() as pg:
            self.assertEqual(prepare_schema(pg).returncode, 0)
            env = provisioning_env(pg)
            first = run_tenant_command(["--apply"], env)
            second = run_tenant_command(["--apply"], env)
        self.assertEqual(first.returncode, 0, msg=(first.stdout or "") + (first.stderr or ""))
        self.assertNotEqual(second.returncode, 0)
        self.assertIn("conflito", (second.stdout + second.stderr).lower())

