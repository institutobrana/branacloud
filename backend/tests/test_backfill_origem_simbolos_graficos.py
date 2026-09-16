import json
import os
import sys
import tempfile
import unittest
from pathlib import Path

from sqlalchemy import create_engine, text


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

os.environ.setdefault("DATABASE_URL", "sqlite+pysqlite:///:memory:")
os.environ.setdefault("JWT_SECRET_KEY", "test-secret-key-for-symbols-tests")

from scripts import backfill_origem_simbolos_graficos as module


FIXTURE_PATH = BACKEND_DIR / "tests" / "fixtures" / "simbolos_graficos_origem_manifest_test.json"


class BackfillOrigemSimbolosGraficosTests(unittest.TestCase):
    def test_default_mode_behaves_as_read_only_without_apply(self):
        args = module.parse_args([
            "--manifest",
            str(FIXTURE_PATH),
            "--environment",
            "local",
        ])
        self.assertFalse(args.apply)
        self.assertFalse(args.dry_run)

    def test_manifest_fixture_is_valid_and_checksum_matches(self):
        manifest = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))
        result = module.validate_manifest(manifest)
        self.assertTrue(result.ok, result.errors)

    def test_dry_run_defaults_to_read_only_and_reports_plan(self):
        manifest = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))
        rows = [
            {
                "id": 1001,
                "origem": None,
                "legacy_id": 1,
                "clinica_id": 1,
                "codigo": "sig-1001",
                "descricao": "A",
                "tipo_marca": 1,
                "tipo_simbolo": 1,
                "imagem_custom": None,
                "ativo": True,
                "signature": "sig-1001",
            },
            {
                "id": 1002,
                "origem": None,
                "legacy_id": 2,
                "clinica_id": 1,
                "codigo": "sig-1002",
                "descricao": "B",
                "tipo_marca": 1,
                "tipo_simbolo": 1,
                "imagem_custom": None,
                "ativo": True,
                "signature": "sig-1002",
            },
            {
                "id": 1003,
                "origem": None,
                "legacy_id": None,
                "clinica_id": 1,
                "codigo": "sig-1003",
                "descricao": "C",
                "tipo_marca": 1,
                "tipo_simbolo": 1,
                "imagem_custom": None,
                "ativo": True,
                "signature": "sig-1003",
            },
            {
                "id": 1004,
                "origem": None,
                "legacy_id": None,
                "clinica_id": 1,
                "codigo": "sig-1004",
                "descricao": "D",
                "tipo_marca": 1,
                "tipo_simbolo": 1,
                "imagem_custom": None,
                "ativo": True,
                "signature": "sig-1004",
            },
            {
                "id": 1005,
                "origem": None,
                "legacy_id": None,
                "clinica_id": 1,
                "codigo": "sig-1005",
                "descricao": "teste simbolo react fixture",
                "tipo_marca": 1,
                "tipo_simbolo": 1,
                "imagem_custom": None,
                "ativo": True,
                "signature": "sig-1005",
            },
            {
                "id": 1006,
                "origem": None,
                "legacy_id": None,
                "clinica_id": 1,
                "codigo": "sig-1006",
                "descricao": "asset",
                "tipo_marca": 1,
                "tipo_simbolo": 1,
                "imagem_custom": "data:image/png;base64,AAAA",
                "ativo": True,
                "signature": "sig-1006",
            },
        ]
        engine = create_engine("sqlite+pysqlite:///:memory:")
        with engine.begin() as conn:
            conn.execute(
                text(
                    """
                    CREATE TABLE simbolo_grafico_catalogo (
                        id INTEGER PRIMARY KEY,
                        clinica_id INTEGER,
                        legacy_id INTEGER,
                        origem TEXT,
                        codigo TEXT,
                        descricao TEXT,
                        tipo_marca INTEGER,
                        tipo_simbolo INTEGER,
                        imagem_custom TEXT,
                        ativo BOOLEAN,
                        signature TEXT
                    )
                    """
                )
            )
            for row in rows:
                payload = {key: row[key] for key in ("id", "clinica_id", "legacy_id", "origem", "codigo", "descricao", "tipo_marca", "tipo_simbolo", "imagem_custom", "ativo")}
                conn.execute(
                    text(
                        """
                        INSERT INTO simbolo_grafico_catalogo
                            (id, clinica_id, legacy_id, origem, codigo, descricao, tipo_marca, tipo_simbolo, imagem_custom, ativo)
                        VALUES
                            (:id, :clinica_id, :legacy_id, :origem, :codigo, :descricao, :tipo_marca, :tipo_simbolo, :imagem_custom, :ativo)
                        """
                    ),
                    payload,
                )

        original_connection = module.open_connection
        original_report_dir = module.REPORT_DIR
        module.open_connection = lambda: engine.connect()
        with tempfile.TemporaryDirectory() as tmpdir:
            module.REPORT_DIR = Path(tmpdir)
            try:
                report = module.main([
                    "--manifest",
                    str(FIXTURE_PATH),
                    "--environment",
                    "local",
                    "--expected-total",
                    "6",
                ])
                self.assertEqual(report, 0)
            finally:
                module.REPORT_DIR = original_report_dir
                module.open_connection = original_connection

    def test_apply_is_blocked_by_phase_gate(self):
        with self.assertRaises(RuntimeError):
            module.optionally_apply()

    def test_invalid_manifest_is_rejected(self):
        manifest = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))
        manifest["manifest_checksum"] = "invalid"
        result = module.validate_manifest(manifest)
        self.assertFalse(result.ok)
        self.assertIn("checksum_invalido", result.errors)

    def test_apply_blocked_by_gate_and_environment_validation(self):
        with self.assertRaises(RuntimeError):
            module.optionally_apply()
        with self.assertRaises(ValueError):
            module.validate_environment("prod")

    def test_build_update_plan_detects_update_skip_and_conflict(self):
        manifest = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))
        current_rows = [
            {
                "id": 1001,
                "origem": None,
                "legacy_id": 1,
                "clinica_id": 1,
                "codigo": "sig-1001",
                "descricao": "A",
                "tipo_marca": 1,
                "tipo_simbolo": 1,
                "imagem_custom": None,
                "ativo": True,
            },
            {
                "id": 1002,
                "origem": "catalogo_oficial",
                "legacy_id": 2,
                "clinica_id": 1,
                "codigo": "sig-1002",
                "descricao": "B",
                "tipo_marca": 1,
                "tipo_simbolo": 1,
                "imagem_custom": None,
                "ativo": True,
            },
            {
                "id": 1003,
                "origem": "outra_origem",
                "legacy_id": None,
                "clinica_id": 1,
                "codigo": "sig-1003",
                "descricao": "C",
                "tipo_marca": 1,
                "tipo_simbolo": 1,
                "imagem_custom": None,
                "ativo": True,
            },
            {
                "id": 9999,
                "origem": None,
                "legacy_id": None,
                "clinica_id": 1,
                "codigo": "extra",
                "descricao": "X",
                "tipo_marca": 1,
                "tipo_simbolo": 1,
                "imagem_custom": None,
                "ativo": True,
            },
        ]
        plan = module.build_update_plan(manifest, current_rows)
        actions = {item["id"]: item["acao"] for item in plan["records"]}
        self.assertEqual(actions[1001], "update")
        self.assertEqual(actions[1002], "skip")
        self.assertEqual(actions[1003], "conflict")
        self.assertEqual(actions[9999], "conflict")
        self.assertEqual(plan["planned_updates"], 1)
        self.assertEqual(plan["skips"], 1)
        self.assertGreaterEqual(plan["conflicts"], 2)


if __name__ == "__main__":
    unittest.main()
