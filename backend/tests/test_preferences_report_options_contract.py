import json
import os
import sys
import unittest
from datetime import datetime, timedelta
from pathlib import Path
from types import SimpleNamespace

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

os.environ["DATABASE_URL"] = "sqlite+pysqlite:///:memory:"
os.environ["JWT_SECRET_KEY"] = "test-secret-key-report-options"

from database import Base
from models.model_registry import import_all_models
from models.clinica import Clinica
from models.prestador_odonto import PrestadorOdonto
from models.unidade_atendimento import UnidadeAtendimento
from models.usuario import Usuario
from routes import preferences_routes


class PreferencesReportOptionsContractTests(unittest.TestCase):
    def setUp(self):
        import_all_models()
        self.engine = create_engine("sqlite+pysqlite:///:memory:")
        Base.metadata.create_all(
            bind=self.engine,
            tables=[
                Clinica.__table__,
                PrestadorOdonto.__table__,
                UnidadeAtendimento.__table__,
                Usuario.__table__,
            ],
        )
        self.SessionLocal = sessionmaker(bind=self.engine)
        self.db = self.SessionLocal()
        self.db.add_all(
            [
                Clinica(
                    id=1,
                    nome="Clinica A",
                    email="a@brana.com",
                    trial_ate=datetime.utcnow() + timedelta(days=30),
                    ativo=True,
                    nome_tabela_procedimentos="Tabela A",
                ),
                Clinica(
                    id=2,
                    nome="Clinica B",
                    email="b@brana.com",
                    trial_ate=datetime.utcnow() + timedelta(days=30),
                    ativo=True,
                    nome_tabela_procedimentos="Tabela B",
                ),
                PrestadorOdonto(
                    id=1,
                    clinica_id=1,
                    source_id=11,
                    nome="Dr A",
                    inativo=False,
                    executa_procedimento=True,
                    is_system_prestador=False,
                ),
                UnidadeAtendimento(
                    id=1,
                    clinica_id=1,
                    source_id=21,
                    nome="Unidade A",
                    inativo=False,
                ),
                Usuario(
                    id=1,
                    codigo=100,
                    nome="Usuario A",
                    apelido="A",
                    tipo_usuario="Admin",
                    email="user.a@brana.com",
                    senha_hash="hash",
                    ativo=True,
                    online=True,
                    forcar_troca_senha=False,
                    setup_completed=True,
                    is_system_user=False,
                    is_admin=True,
                    clinica_id=1,
                ),
                Usuario(
                    id=2,
                    codigo=200,
                    nome="Usuario B",
                    apelido="B",
                    tipo_usuario="Admin",
                    email="user.b@brana.com",
                    senha_hash="hash",
                    ativo=True,
                    online=True,
                    forcar_troca_senha=False,
                    setup_completed=True,
                    is_system_user=False,
                    is_admin=False,
                    clinica_id=1,
                ),
                Usuario(
                    id=3,
                    codigo=300,
                    nome="Usuario C",
                    apelido="C",
                    tipo_usuario="Admin",
                    email="user.c@brana.com",
                    senha_hash="hash",
                    ativo=True,
                    online=True,
                    forcar_troca_senha=False,
                    setup_completed=True,
                    is_system_user=False,
                    is_admin=True,
                    clinica_id=2,
                ),
            ]
        )
        self.db.commit()
        self.user_a = self.db.get(Usuario, 1)
        self.user_b = self.db.get(Usuario, 2)
        self.user_c = self.db.get(Usuario, 3)

    def tearDown(self):
        self.db.close()
        Base.metadata.drop_all(
            bind=self.engine,
            tables=[
                Usuario.__table__,
                UnidadeAtendimento.__table__,
                PrestadorOdonto.__table__,
                Clinica.__table__,
            ],
        )
        self.engine.dispose()

    def _reload_json(self, usuario_id: int) -> dict:
        self.db.refresh(self.db.get(Usuario, usuario_id))
        usuario = self.db.get(Usuario, usuario_id)
        return json.loads(usuario.preferencias_usuario_json or "{}")

    def test_get_defaults_when_namespace_missing(self):
        result = preferences_routes.get_report_options_conta_corrente_cirurgiao(current_user=self.user_a)
        self.assertEqual(result["version"], 1)
        self.assertEqual(result["selectedFields"], ["data", "historico", "debito"])
        self.assertEqual(result["reportName"], "Relatório de contas do cirurgião")
        self.assertEqual(result["output"], "tela")
        self.assertEqual(result["orientation"], "paisagem")

    def test_get_restores_existing_configuration_and_normalizes(self):
        prefs = {
            "geral": {"foo": "bar"},
            "relatorio_conta_corrente_cirurgiao": {
                "version": 1,
                "selectedFields": ["historico", "data", "campo_antigo", "historico", "debito"],
                "reportName": "  Relatório Personalizado  ",
                "output": "arquivo",
                "orientation": "retrato",
            },
        }
        self.user_a.preferencias_usuario_json = json.dumps(prefs, ensure_ascii=False)
        self.db.commit()

        result = preferences_routes.get_report_options_conta_corrente_cirurgiao(current_user=self.user_a)
        self.assertEqual(result["selectedFields"], ["historico", "data", "debito"])
        self.assertEqual(result["reportName"], "Relatório Personalizado")
        self.assertEqual(result["output"], "arquivo")
        self.assertEqual(result["orientation"], "retrato")

    def test_get_preserves_empty_selected_fields(self):
        self.user_a.preferencias_usuario_json = json.dumps(
            {
                "relatorio_conta_corrente_cirurgiao": {
                    "version": 1,
                    "selectedFields": [],
                    "reportName": "Relatório de contas do cirurgião",
                    "output": "tela",
                    "orientation": "paisagem",
                }
            },
            ensure_ascii=False,
        )
        self.db.commit()

        result = preferences_routes.get_report_options_conta_corrente_cirurgiao(current_user=self.user_a)
        self.assertEqual(result["selectedFields"], [])

    def test_patch_merges_without_dropping_other_namespaces(self):
        self.user_a.preferencias_usuario_json = json.dumps(
            {
                "geral": {"exibir_quadro_avisos": True},
                "modelos": {"modelo_impresso_recibos_id": 7},
            },
            ensure_ascii=False,
        )
        self.db.commit()

        payload = preferences_routes.ContaCorrenteCirurgiaoReportOptionsUpdateRequest(
            version=1,
            selectedFields=["data", "historico", "debito"],
            reportName="Relatório de contas do cirurgião",
            output="tela",
            orientation="paisagem",
        )
        result = preferences_routes.update_report_options_conta_corrente_cirurgiao(
            payload=payload,
            current_user=self.user_a,
            db=self.db,
        )

        persisted = self._reload_json(1)
        self.assertIn("geral", persisted)
        self.assertIn("modelos", persisted)
        self.assertIn("relatorio_conta_corrente_cirurgiao", persisted)
        self.assertEqual(result["config"]["selectedFields"], ["data", "historico", "debito"])
        self.assertEqual(persisted["relatorio_conta_corrente_cirurgiao"]["selectedFields"], ["data", "historico", "debito"])

    def test_patch_creates_namespace_for_current_user(self):
        payload = preferences_routes.ContaCorrenteCirurgiaoReportOptionsUpdateRequest(
            version=1,
            selectedFields=["data", "lancamento"],
            reportName="  ",
            output="tela",
            orientation="paisagem",
        )
        preferences_routes.update_report_options_conta_corrente_cirurgiao(
            payload=payload,
            current_user=self.user_a,
            db=self.db,
        )

        persisted = self._reload_json(1)
        self.assertEqual(persisted["relatorio_conta_corrente_cirurgiao"]["selectedFields"], ["data", "lancamento"])
        self.assertEqual(persisted["relatorio_conta_corrente_cirurgiao"]["reportName"], "Relatório de contas do cirurgião")

    def test_patch_is_isolated_by_user_and_tenant(self):
        payload_a = preferences_routes.ContaCorrenteCirurgiaoReportOptionsUpdateRequest(
            version=1,
            selectedFields=["data", "lancamento"],
            reportName="A",
            output="tela",
            orientation="paisagem",
        )
        payload_b = preferences_routes.ContaCorrenteCirurgiaoReportOptionsUpdateRequest(
            version=1,
            selectedFields=["data", "historico"],
            reportName="B",
            output="arquivo",
            orientation="retrato",
        )
        preferences_routes.update_report_options_conta_corrente_cirurgiao(payload=payload_a, current_user=self.user_a, db=self.db)
        preferences_routes.update_report_options_conta_corrente_cirurgiao(payload=payload_b, current_user=self.user_b, db=self.db)

        persisted_a = self._reload_json(1)
        persisted_b = self._reload_json(2)

        self.assertEqual(persisted_a["relatorio_conta_corrente_cirurgiao"]["selectedFields"], ["data", "lancamento"])
        self.assertEqual(persisted_b["relatorio_conta_corrente_cirurgiao"]["selectedFields"], ["data", "historico"])
        self.assertNotEqual(
            persisted_a["relatorio_conta_corrente_cirurgiao"]["selectedFields"],
            persisted_b["relatorio_conta_corrente_cirurgiao"]["selectedFields"],
        )

    def test_normalization_helpers_filter_invalids_and_duplicates(self):
        normalized = preferences_routes._normalize_report_options_payload(
            {
                "version": "1",
                "selectedFields": ["historico", "data", "campo_antigo", "historico", "debito"],
                "reportName": "  ",
                "output": "invalido",
                "orientation": "x",
            },
            default_on_missing=False,
        )
        self.assertEqual(normalized["selectedFields"], ["historico", "data", "debito"])
        self.assertEqual(normalized["reportName"], "Relatório de contas do cirurgião")
        self.assertEqual(normalized["output"], "tela")
        self.assertEqual(normalized["orientation"], "paisagem")
        self.assertEqual(normalized["version"], 1)

    def test_missing_namespace_uses_defaults_but_existing_empty_list_stays_empty(self):
        defaults = preferences_routes._build_report_options_payload(self.user_c)
        self.assertEqual(defaults["selectedFields"], ["data", "historico", "debito"])

        self.user_c.preferencias_usuario_json = json.dumps(
            {
                "relatorio_conta_corrente_cirurgiao": {
                    "version": 1,
                    "selectedFields": [],
                    "reportName": "Relatório de contas do cirurgião",
                    "output": "tela",
                    "orientation": "paisagem",
                }
            },
            ensure_ascii=False,
        )
        self.db.commit()
        empty = preferences_routes._build_report_options_payload(self.user_c)
        self.assertEqual(empty["selectedFields"], [])


if __name__ == "__main__":
    unittest.main()
