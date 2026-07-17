from __future__ import annotations

import unittest

from backend.tests.schema_deployment_test_utils import disposable_postgres, run_schema_command, db_counts


class SchemaDeploymentApplyTests(unittest.TestCase):
    def test_apply_creates_baseline_and_versions_table(self):
        with disposable_postgres() as pg:
            before = db_counts(pg["dsn"])
            result = run_schema_command(
                ["--apply"],
                {
                    "DATABASE_URL": f"postgresql://brana_test:testpass123@127.0.0.1:{pg['port']}/{pg['dbname']}",
                    "BRANA_RUNTIME_PROFILE": "homologation",
                    "BRANA_SCHEMA_DEPLOYMENT_ALLOW_LOCALHOST": "1",
                    "BRANA_SCHEMA_DEPLOYMENT_ACK": "BRANA_SCHEMA_DEPLOYMENT_ACKNOWLEDGED",
                },
            )
            after = db_counts(pg["dsn"])
        self.assertEqual(result.returncode, 0, msg=(result.stdout or "") + (result.stderr or ""))
        self.assertGreater(after["tables"], before["tables"])

    def test_apply_again_is_refused_explicitly(self):
        with disposable_postgres() as pg:
            base_env = {
                "DATABASE_URL": f"postgresql://brana_test:testpass123@127.0.0.1:{pg['port']}/{pg['dbname']}",
                "BRANA_RUNTIME_PROFILE": "homologation",
                "BRANA_SCHEMA_DEPLOYMENT_ALLOW_LOCALHOST": "1",
                "BRANA_SCHEMA_DEPLOYMENT_ACK": "BRANA_SCHEMA_DEPLOYMENT_ACKNOWLEDGED",
            }
            first = run_schema_command(["--apply"], base_env)
            self.assertEqual(first.returncode, 0, msg=(first.stdout or "") + (first.stderr or ""))
            second = run_schema_command(["--apply"], base_env)
        self.assertNotEqual(second.returncode, 0)
        self.assertIn("baseline", (second.stderr or second.stdout).lower())
