from __future__ import annotations

import subprocess
import unittest

from backend.tests.schema_deployment_test_utils import disposable_postgres


class SchemaDeploymentLockTests(unittest.TestCase):
    def test_second_concurrent_apply_is_blocked(self):
        with disposable_postgres() as pg:
            env = {
                "DATABASE_URL": f"postgresql://brana_test:testpass123@127.0.0.1:{pg['port']}/{pg['dbname']}",
                "BRANA_RUNTIME_PROFILE": "homologation",
                "BRANA_SCHEMA_DEPLOYMENT_ALLOW_LOCALHOST": "1",
                "BRANA_SCHEMA_DEPLOYMENT_ACK": "BRANA_SCHEMA_DEPLOYMENT_ACKNOWLEDGED",
                "BRANA_SCHEMA_DEPLOYMENT_TEST_SLEEP": "5",
            }
            p1 = subprocess.Popen(
                [r".\.venv\Scripts\python.exe", "-m", "backend.scripts.apply_schema_baseline", "--apply"],
                cwd=r"D:\BRANA ARQUIVOS\BRANA CLOUD",
                env={**__import__("os").environ, **env},
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
            )
            p2 = subprocess.Popen(
                [r".\.venv\Scripts\python.exe", "-m", "backend.scripts.apply_schema_baseline", "--apply"],
                cwd=r"D:\BRANA ARQUIVOS\BRANA CLOUD",
                env={**__import__("os").environ, **env},
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
            )
            out1, err1 = p1.communicate(timeout=180)
            out2, err2 = p2.communicate(timeout=180)
        codes = {p1.returncode, p2.returncode}
        self.assertEqual(codes, {0, 1})
        self.assertTrue(
            ("Execucao concorrente bloqueada" in (err1 or out1)) or ("Execucao concorrente bloqueada" in (err2 or out2))
        )
