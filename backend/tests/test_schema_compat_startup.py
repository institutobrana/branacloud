import importlib
import os
import sys
from pathlib import Path
from types import SimpleNamespace
import unittest
from unittest import mock


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

os.environ.setdefault("DATABASE_URL", "sqlite+pysqlite:///:memory:")
os.environ.setdefault("JWT_SECRET_KEY", "test-secret-key-for-schema-compat-tests")
os.environ.setdefault("BRANA_ENABLE_SCHEMA_BOOTSTRAP", "0")
os.environ.setdefault("BRANA_ENABLE_RUNTIME_BOOTSTRAP", "0")
os.environ.setdefault("BRANA_ALLOW_HTTP_RUNTIME_BOOTSTRAP", "0")
os.environ.setdefault("BRANA_ALLOW_SCHEMA_COMPAT_APPLY", "0")
os.environ.setdefault("BRANA_SKIP_BOOTSTRAP", "1")

from fastapi.testclient import TestClient

from services.runtime_profile_service import resolve_runtime_policy, schema_compat_apply_allowed


def _load_main():
    module = sys.modules.get("main")
    if module is None:
        return importlib.import_module("main")
    return importlib.reload(module)


class SchemaCompatStartupTests(unittest.TestCase):
    def test_policy_defaults_to_block_when_flag_missing_or_invalid(self):
        with mock.patch.dict(os.environ, {"BRANA_ALLOW_SCHEMA_COMPAT_APPLY": ""}, clear=False):
            self.assertFalse(schema_compat_apply_allowed(resolve_runtime_policy()))

        with mock.patch.dict(os.environ, {"BRANA_ALLOW_SCHEMA_COMPAT_APPLY": "maybe"}, clear=False):
            self.assertFalse(schema_compat_apply_allowed(resolve_runtime_policy()))

    def test_policy_allows_only_when_flag_is_explicitly_true(self):
        with mock.patch.dict(os.environ, {"BRANA_ALLOW_SCHEMA_COMPAT_APPLY": "1"}, clear=False):
            self.assertTrue(schema_compat_apply_allowed(resolve_runtime_policy()))

    def test_production_blocked_prevents_all_automatic_compatibility(self):
        with mock.patch.dict(
            os.environ,
            {
                "BRANA_RUNTIME_PROFILE": "production",
                "BRANA_ALLOW_SCHEMA_COMPAT_APPLY": "false",
                "BRANA_ENABLE_SCHEMA_BOOTSTRAP": "false",
                "BRANA_ENABLE_RUNTIME_BOOTSTRAP": "false",
                "BRANA_SKIP_BOOTSTRAP": "true",
            },
            clear=False,
        ):
            main = _load_main()
            with mock.patch.object(main, "_garantir_colunas_criticas_usuarios") as usuarios, mock.patch.object(
                main, "_garantir_colunas_criticas_simbolos"
            ) as simbolos, mock.patch.object(main, "_garantir_colunas_criticas_anamnese") as anamnese, mock.patch.object(
                main, "_garantir_tabela_quadro_avisos"
            ) as quadro, mock.patch.object(
                main.engine, "begin", side_effect=AssertionError("nao deve abrir conexao para DDL")
            ):
                main._garantir_schema_compatibilidade_startup()

            usuarios.assert_not_called()
            simbolos.assert_not_called()
            anamnese.assert_not_called()
            quadro.assert_not_called()

    def test_contradictory_flags_still_block_compatibility(self):
        policy = SimpleNamespace(
            profile="production",
            enable_schema_bootstrap=True,
            enable_runtime_bootstrap=True,
            allow_http_runtime_bootstrap=False,
            allow_schema_compat_apply=False,
        )
        self.assertFalse(schema_compat_apply_allowed(policy))

    def test_explicitly_allowed_path_can_call_compatibility_hooks(self):
        policy = SimpleNamespace(
            profile="production",
            enable_schema_bootstrap=True,
            enable_runtime_bootstrap=True,
            allow_http_runtime_bootstrap=False,
            allow_schema_compat_apply=True,
        )
        self.assertTrue(schema_compat_apply_allowed(policy))

    def test_health_without_auth_returns_200_and_does_not_touch_db_or_compat(self):
        with mock.patch.dict(
            os.environ,
            {
                "BRANA_RUNTIME_PROFILE": "production",
                "BRANA_ALLOW_SCHEMA_COMPAT_APPLY": "false",
                "BRANA_ENABLE_SCHEMA_BOOTSTRAP": "false",
                "BRANA_ENABLE_RUNTIME_BOOTSTRAP": "false",
                "BRANA_SKIP_BOOTSTRAP": "true",
            },
            clear=False,
        ):
            main = _load_main()
            with mock.patch.object(main, "_garantir_colunas_criticas_usuarios") as usuarios, mock.patch.object(
                main, "_garantir_colunas_criticas_simbolos"
            ) as simbolos, mock.patch.object(main, "_garantir_colunas_criticas_anamnese") as anamnese, mock.patch.object(
                main, "_garantir_tabela_quadro_avisos"
            ) as quadro, mock.patch.object(
                main.engine, "begin", side_effect=AssertionError("health nao deve abrir conexao")
            ), mock.patch.object(
                main, "_run_runtime_bootstrap_in_thread", side_effect=AssertionError("health nao deve disparar bootstrap")
            ):
                with TestClient(main.app) as client:
                    response = client.get("/health")

            self.assertEqual(response.status_code, 200)
            usuarios.assert_not_called()
            simbolos.assert_not_called()
            anamnese.assert_not_called()
            quadro.assert_not_called()

    def test_protected_route_without_auth_returns_401(self):
        main = _load_main()
        with TestClient(main.app) as client:
            response = client.post("/auth/renew")
        self.assertEqual(response.status_code, 401)


if __name__ == "__main__":
    unittest.main()
