import json
import os
import sys
from pathlib import Path
import tempfile
import unittest


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

os.environ.setdefault("DATABASE_URL", "sqlite+pysqlite:///:memory:")
os.environ.setdefault("JWT_SECRET_KEY", "test-secret-key-for-symbols-tests")

from scripts.dry_run_classificar_origem_simbolos_graficos import executar_dry_run, salvar_relatorios
from services.simbolos_graficos_origem_classifier import (
    ORIGEM_CATALOGO_OFICIAL,
    ORIGEM_INDEFINIDO,
    ORIGEM_SEED_INTERNO,
    construir_assinaturas_referencia,
    classificar_simbolo_grafico_dry_run,
    preparar_conjuntos_classificacao,
)


class SimbolosGraficosOrigemDryRunTests(unittest.TestCase):
    def test_classifier_separates_official_seed_and_indefinido(self):
        snapshot = json.loads((BACKEND_DIR / "scripts" / "easy_simbolos_catalogo_atual_snapshot.json").read_text(encoding="utf-8"))
        seed_rows = __import__("seeds.simbolos_graficos", fromlist=["SIMBOLOS_GRAFICOS_PADRAO"]).SIMBOLOS_GRAFICOS_PADRAO
        codigos_catalogo_oficial, legacy_ids_catalogo_oficial, codigos_seed_interno = preparar_conjuntos_classificacao(snapshot, seed_rows)
        assinaturas_catalogo_oficial, assinaturas_seed_interno = construir_assinaturas_referencia(snapshot, seed_rows)

        oficial = classificar_simbolo_grafico_dry_run(
            {
                "id": 1,
                "legacy_id": 1,
                "codigo": "int_coroa.bmp",
                "descricao": "Coroa",
                "especialidade": 2,
                "tipo_marca": 2,
                "tipo_simbolo": 1,
                "bitmap1": "int_coroa.bmp",
                "bitmap2": None,
                "bitmap3": None,
                "icone": "int_coroa.bmp",
                "sobreposicao": 1,
                "ativo": True,
            },
            assinaturas_catalogo_oficial=assinaturas_catalogo_oficial,
            assinaturas_seed_interno=assinaturas_seed_interno,
        )
        seed = classificar_simbolo_grafico_dry_run(
            {
                "id": 999,
                "legacy_id": None,
                "codigo": "sim_ajuste.bmp",
                "descricao": "Sim Ajuste",
                "especialidade": None,
                "tipo_marca": None,
                "tipo_simbolo": 2,
                "bitmap1": "sim_ajuste.bmp",
                "bitmap2": None,
                "bitmap3": None,
                "icone": "sim_ajuste.bmp",
                "sobreposicao": None,
                "ativo": True,
            },
            assinaturas_catalogo_oficial=assinaturas_catalogo_oficial,
            assinaturas_seed_interno=assinaturas_seed_interno,
        )
        indefinido = classificar_simbolo_grafico_dry_run(
            {"id": 1000, "legacy_id": None, "codigo": "codigo_desconhecido.bmp", "descricao": "X", "ativo": True},
            assinaturas_catalogo_oficial=assinaturas_catalogo_oficial,
            assinaturas_seed_interno=assinaturas_seed_interno,
        )

        self.assertEqual(oficial.categoria_proposta, ORIGEM_CATALOGO_OFICIAL)
        self.assertEqual(seed.categoria_proposta, ORIGEM_SEED_INTERNO)
        self.assertEqual(indefinido.categoria_proposta, ORIGEM_INDEFINIDO)
        self.assertFalse(oficial.conflito)
        self.assertFalse(seed.conflito)
        self.assertFalse(indefinido.conflito)

    def test_dry_run_reads_but_does_not_write_database(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            from scripts import dry_run_classificar_origem_simbolos_graficos as module

            original_database_url = os.environ["DATABASE_URL"]
            original_report_dir = module.REPORT_DIR
            fake_rows = [
                {
                    "id": 1,
                    "clinica_id": None,
                    "legacy_id": 1,
                    "origem": None,
                    "codigo": "int_coroa.bmp",
                    "descricao": "Coroa",
                    "especialidade": 2,
                    "tipo_marca": 2,
                    "tipo_simbolo": 1,
                    "bitmap1": "int_coroa.bmp",
                    "bitmap2": None,
                    "bitmap3": None,
                    "icone": "int_coroa.bmp",
                    "imagem_custom": None,
                    "sobreposicao": 1,
                    "ativo": True,
                }
            ]
            module._coletar_registros_banco = lambda: fake_rows
            module.REPORT_DIR = Path(tmpdir) / "reports"
            try:
                payload = executar_dry_run()
                self.assertEqual(payload["totais"]["registros"], 1)
                self.assertEqual(payload["totais"][ORIGEM_CATALOGO_OFICIAL], 1)
                self.assertEqual(payload["totais"][ORIGEM_SEED_INTERNO], 0)
                self.assertEqual(payload["totais"][ORIGEM_INDEFINIDO], 0)

                json_path, csv_path = salvar_relatorios(payload)
                self.assertTrue(json_path.exists())
                self.assertTrue(csv_path.exists())
            finally:
                module.REPORT_DIR = original_report_dir
                os.environ["DATABASE_URL"] = original_database_url


if __name__ == "__main__":
    unittest.main()
