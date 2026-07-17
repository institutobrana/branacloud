import sys
import unittest
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from services.database_url_service import resolve_database_url


class DatabaseUrlResolutionTests(unittest.TestCase):
    def test_database_url_has_priority(self):
        self.assertEqual(
            resolve_database_url(
                {
                    "DATABASE_URL": "postgresql+psycopg2://legacy_user:legacy_pass@legacy-host:5432/legacy_db",
                    "DB_HOST": "should-not-be-used",
                    "DB_NAME": "should-not-be-used",
                    "DB_USER": "should-not-be-used",
                    "DB_PASSWORD": "should-not-be-used",
                }
            ),
            "postgresql+psycopg2://legacy_user:legacy_pass@legacy-host:5432/legacy_db",
        )

    def test_fallback_builds_url_from_db_vars(self):
        resolved = resolve_database_url(
            {
                "DB_HOST": "db.internal",
                "DB_PORT": "5432",
                "DB_NAME": "brana_saas",
                "DB_USER": "brana_admin",
                "DB_PASSWORD": "Senha Segura",
            }
        )
        self.assertEqual(resolved, "postgresql+psycopg2://brana_admin:Senha%20Segura@db.internal:5432/brana_saas")

    def test_default_port_5432_is_used_when_absent(self):
        resolved = resolve_database_url(
            {
                "DB_HOST": "db.internal",
                "DB_NAME": "brana_saas",
                "DB_USER": "brana_admin",
                "DB_PASSWORD": "senha",
            }
        )
        self.assertIn(":5432/", resolved)

    def test_custom_port_is_preserved(self):
        resolved = resolve_database_url(
            {
                "DB_HOST": "db.internal",
                "DB_PORT": "6543",
                "DB_NAME": "brana_saas",
                "DB_USER": "brana_admin",
                "DB_PASSWORD": "senha",
            }
        )
        self.assertIn(":6543/", resolved)

    def test_special_characters_are_encoded_safely(self):
        resolved = resolve_database_url(
            {
                "DB_HOST": "db.internal",
                "DB_PORT": "5432",
                "DB_NAME": "brana_saas",
                "DB_USER": "user@corp:ops/qa#100",
                "DB_PASSWORD": "p@ss:/#% word",
            }
        )
        self.assertEqual(
            resolved,
            "postgresql+psycopg2://"
            "user%40corp%3Aops%2Fqa%23100:"
            "p%40ss%3A%2F%23%25%20word"
            "@db.internal:5432/brana_saas",
        )

    def test_missing_required_variable_reports_only_names(self):
        with self.assertRaises(RuntimeError) as ctx:
            resolve_database_url(
                {
                    "DB_HOST": "db.internal",
                    "DB_PORT": "5432",
                    "DB_USER": "brana_admin",
                    "DB_PASSWORD": "senha-secreta",
                }
            )
        self.assertEqual(str(ctx.exception), "Variaveis obrigatorias ausentes: DB_NAME")
        self.assertNotIn("senha-secreta", str(ctx.exception))

    def test_local_legacy_environment_keeps_working(self):
        self.assertEqual(
            resolve_database_url({"DATABASE_URL": "sqlite+pysqlite:///:memory:"}),
            "sqlite+pysqlite:///:memory:",
        )

    def test_resolution_does_not_print_url_or_secret(self):
        import builtins
        from unittest import mock

        with mock.patch.object(builtins, "print") as printer:
            resolved = resolve_database_url(
                {
                    "DB_HOST": "db.internal",
                    "DB_PORT": "5432",
                    "DB_NAME": "brana_saas",
                    "DB_USER": "brana_admin",
                    "DB_PASSWORD": "senha-secreta",
                }
            )
        self.assertEqual(printer.call_count, 0)
        self.assertIn("brana_admin", resolved)


if __name__ == "__main__":
    unittest.main()
