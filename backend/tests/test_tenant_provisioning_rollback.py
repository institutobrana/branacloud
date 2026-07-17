from __future__ import annotations

import os
import subprocess
import time
import unittest
from pathlib import Path

from backend.tests.tenant_provisioning_test_utils import (
    disposable_postgres,
    prepare_schema,
    provisioning_env,
    row_count,
    run_tenant_command,
)


ROOT = Path(__file__).resolve().parents[2]
PYTHON = ROOT / ".venv" / "Scripts" / "python.exe"


class TenantProvisioningRollbackTests(unittest.TestCase):
    def test_failure_rolls_back_all_changes(self):
        with disposable_postgres() as pg:
            self.assertEqual(prepare_schema(pg).returncode, 0)
            env = provisioning_env(pg, BRANA_INITIAL_TENANT_TEST_FAIL_STAGE="user")
            result = run_tenant_command(["--apply"], env)
            self.assertNotEqual(result.returncode, 0)
            self.assertEqual(row_count(pg["dsn"], "clinicas"), 0)
            self.assertEqual(row_count(pg["dsn"], "usuarios"), 0)
            self.assertEqual(row_count(pg["dsn"], "unidade_atendimento"), 0)
            self.assertEqual(row_count(pg["dsn"], "prestador_odonto"), 0)
            self.assertEqual(row_count(pg["dsn"], "access_profile"), 0)
            self.assertEqual(row_count(pg["dsn"], "usuario_perfil_acesso"), 0)

    def test_concurrency_is_blocked(self):
        with disposable_postgres() as pg:
            self.assertEqual(prepare_schema(pg).returncode, 0)
            env = provisioning_env(pg, BRANA_INITIAL_TENANT_TEST_SLEEP_SECONDS="5")
            merged = os.environ.copy()
            merged.update(env)
            first_proc = subprocess.Popen(
                [str(PYTHON), "-m", "backend.scripts.provision_initial_tenant", "--apply"],
                cwd=str(ROOT),
                env=merged,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
            )
            time.sleep(1.5)
            second = run_tenant_command(["--apply"], env)
            first_stdout, first_stderr = first_proc.communicate(timeout=120)
        self.assertEqual(first_proc.returncode, 0, msg=(first_stdout or "") + (first_stderr or ""))
        self.assertNotEqual(second.returncode, 0)
        self.assertIn("bloqueada", (second.stdout + second.stderr).lower())
