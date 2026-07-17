from __future__ import annotations

import unittest

from backend.tests.schema_deployment_test_utils import disposable_postgres, run_schema_command


class SchemaDeploymentGuardsTests(unittest.TestCase):
    def test_apply_is_rejected_without_ack(self):
        with disposable_postgres() as pg:
            result = run_schema_command(
                ["--apply"],
                {
                    "DATABASE_URL": f"postgresql://brana_test:testpass123@127.0.0.1:{pg['port']}/{pg['dbname']}",
                    "BRANA_RUNTIME_PROFILE": "homologation",
                    "BRANA_SCHEMA_DEPLOYMENT_ALLOW_LOCALHOST": "1",
                },
            )
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("ACK", (result.stderr or result.stdout).upper())

    def test_apply_is_rejected_with_wrong_profile(self):
        with disposable_postgres() as pg:
            result = run_schema_command(
                ["--apply"],
                {
                    "DATABASE_URL": f"postgresql://brana_test:testpass123@127.0.0.1:{pg['port']}/{pg['dbname']}",
                    "BRANA_RUNTIME_PROFILE": "production",
                    "BRANA_SCHEMA_DEPLOYMENT_ALLOW_LOCALHOST": "1",
                    "BRANA_SCHEMA_DEPLOYMENT_ACK": "BRANA_SCHEMA_DEPLOYMENT_ACKNOWLEDGED",
                },
            )
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("PERFIL", (result.stderr or result.stdout).upper())
