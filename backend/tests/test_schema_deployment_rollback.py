from __future__ import annotations

import unittest

from backend.tests.schema_deployment_test_utils import disposable_postgres, run_schema_command, execute_sql, db_counts


class SchemaDeploymentRollbackTests(unittest.TestCase):
    def test_unknown_state_is_blocked(self):
        with disposable_postgres() as pg:
            execute_sql(pg["dsn"], "CREATE TABLE tabela_desconhecida_teste (id INTEGER PRIMARY KEY)")
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
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(before, after)
        self.assertIn("desconhecido", (result.stderr or result.stdout).lower())
