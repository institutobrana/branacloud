import os
import sys
import unittest
from pathlib import Path

from sqlalchemy import create_engine, text

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "backend"))
from scripts.migrar_bridge_installations import EXPECTED_CHECKS, check, migrate, schema_report


class BridgeInstallationMigrationTests(unittest.TestCase):
    def setUp(self):
        url = os.environ.get("BRANA_TEST_POSTGRES_URL")
        if not url or "554" not in url:
            self.skipTest("BRANA_TEST_POSTGRES_URL must point to disposable PostgreSQL")
        self.engine = create_engine(url)
        with self.engine.begin() as conn:
            conn.execute(text("DROP TABLE IF EXISTS bridge_installation_events"))
            conn.execute(text("DROP TABLE IF EXISTS bridge_installations"))
            conn.execute(text("CREATE TABLE bridge_installations (id SERIAL PRIMARY KEY, installation_id VARCHAR(128) NOT NULL UNIQUE, certificate_der_sha256 VARCHAR(64) NOT NULL UNIQUE, status VARCHAR(16) NOT NULL DEFAULT 'ACTIVE', generation INTEGER NOT NULL DEFAULT 1, valid_from TIMESTAMPTZ NOT NULL DEFAULT NOW(), valid_to TIMESTAMPTZ NULL, registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), revoked_at TIMESTAMPTZ NULL, rotated_at TIMESTAMPTZ NULL)"))
            conn.execute(text("CREATE TABLE bridge_installation_events (id SERIAL PRIMARY KEY, installation_id VARCHAR(128) NOT NULL REFERENCES bridge_installations(installation_id), event_type VARCHAR(16) NOT NULL, generation INTEGER NOT NULL, occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), detail_code VARCHAR(80) NULL)"))

    def tearDown(self):
        if getattr(self, "engine", None):
            with self.engine.begin() as conn:
                conn.execute(text("DROP TABLE IF EXISTS bridge_installation_events"))
                conn.execute(text("DROP TABLE IF EXISTS bridge_installations"))
            self.engine.dispose()

    def test_partial_schema_check_apply_and_idempotence(self):
        self.assertEqual(check(self.engine), 0)
        self.assertEqual(set(schema_report(self.engine)["missing_checks"]), set(EXPECTED_CHECKS))
        migrate(self.engine)
        self.assertEqual(check(self.engine), 0)
        migrate(self.engine)
        with self.engine.connect() as conn:
            checks = {row[0] for row in conn.execute(text("SELECT conname FROM pg_constraint WHERE conrelid='bridge_installations'::regclass AND contype='c'"))}
        self.assertEqual(checks, set(EXPECTED_CHECKS))

    def test_incompatible_existing_row_fails_closed(self):
        with self.engine.begin() as conn:
            conn.execute(text("INSERT INTO bridge_installations (installation_id, certificate_der_sha256, status) VALUES ('bad', 'x', 'INVALID')"))
        report = schema_report(self.engine)
        self.assertTrue(report["blocking"])
        with self.assertRaisesRegex(RuntimeError, "ROWS_INCOMPATIBLE"):
            migrate(self.engine)


if __name__ == "__main__":
    unittest.main()
