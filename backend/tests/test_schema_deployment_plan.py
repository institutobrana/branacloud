from __future__ import annotations

import unittest

from backend.tests.schema_deployment_test_utils import disposable_postgres, run_schema_command, db_counts


class SchemaDeploymentPlanTests(unittest.TestCase):
    def test_plan_does_not_require_ack_and_emits_state(self):
        with disposable_postgres() as pg:
            before = db_counts(pg["dsn"])
            result = run_schema_command(
                ["--plan"],
                {
                    "DATABASE_URL": f"postgresql://brana_test:testpass123@127.0.0.1:{pg['port']}/{pg['dbname']}",
                    "BRANA_RUNTIME_PROFILE": "homologation",
                    "BRANA_SCHEMA_DEPLOYMENT_ALLOW_LOCALHOST": "1",
                },
            )
            after = db_counts(pg["dsn"])
        self.assertEqual(result.returncode, 0)
        output = (result.stdout or "") + (result.stderr or "")
        self.assertIn("Banco vazio", output)
        self.assertNotIn("CREATE TABLE", output.upper())
        self.assertNotIn("ALTER TABLE", output.upper())
        self.assertEqual(before, after)
