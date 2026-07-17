from __future__ import annotations

import unittest

from backend.tests.schema_deployment_test_utils import disposable_postgres, run_schema_command, db_counts


class SchemaDeploymentValidationTests(unittest.TestCase):
    def test_validate_passes_after_apply(self):
        with disposable_postgres() as pg:
            base_env = {
                "DATABASE_URL": f"postgresql://brana_test:testpass123@127.0.0.1:{pg['port']}/{pg['dbname']}",
                "BRANA_RUNTIME_PROFILE": "homologation",
                "BRANA_SCHEMA_DEPLOYMENT_ALLOW_LOCALHOST": "1",
                "BRANA_SCHEMA_DEPLOYMENT_ACK": "BRANA_SCHEMA_DEPLOYMENT_ACKNOWLEDGED",
            }
            apply_result = run_schema_command(["--apply"], base_env)
            self.assertEqual(apply_result.returncode, 0, msg=(apply_result.stdout or "") + (apply_result.stderr or ""))
            before = db_counts(pg["dsn"])
            validate_result = run_schema_command(["--validate"], base_env)
            after = db_counts(pg["dsn"])
        self.assertEqual(validate_result.returncode, 0, msg=(validate_result.stdout or "") + (validate_result.stderr or ""))
        self.assertEqual(before, after)
