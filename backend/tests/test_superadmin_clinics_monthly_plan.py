import os
import sys
from dataclasses import dataclass
from datetime import datetime, timedelta
from pathlib import Path
from types import SimpleNamespace
import unittest

from fastapi import HTTPException

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

os.environ.setdefault("DATABASE_URL", "sqlite+pysqlite:///:memory:")
os.environ.setdefault("JWT_SECRET_KEY", "test-secret-key-for-superadmin-monthly-tests")

from routes import superadmin_routes


@dataclass
class FakeClinica:
    id: int
    nome: str = "Clinica Mensal"
    email: str = "clinica-mensal@brana.test"
    ativo: bool = True
    tipo_conta: str = "DEMO 7 dias"
    trial_ate: datetime | None = None
    data_ativacao: datetime | None = None


class FakeClinicaQuery:
    def __init__(self, clinica):
        self.clinica = clinica

    def filter(self, *args, **kwargs):
        return self

    def first(self):
        return self.clinica


class FakeMonthlyDb:
    def __init__(self, clinica):
        self.clinica = clinica
        self.committed = False
        self.refreshed = None
        self.synced = False
        self.audit_calls = []

    def query(self, model):
        if model is superadmin_routes.Clinica:
            return FakeClinicaQuery(self.clinica)
        return FakeClinicaQuery(None)

    def commit(self):
        self.committed = True

    def refresh(self, obj):
        self.refreshed = obj


class SuperadminClinicMonthlyPlanTests(unittest.TestCase):
    def setUp(self):
        self.original_require = superadmin_routes._require_superadmin
        self.original_is_owner = superadmin_routes._is_owner_clinica
        self.original_sync = superadmin_routes.sync_assinatura_from_clinica
        self.original_audit = superadmin_routes.registrar_auditoria
        self.original_status = superadmin_routes.assinatura_status_from_clinica
        superadmin_routes._require_superadmin = lambda current_user: None
        superadmin_routes._is_owner_clinica = lambda db, clinica_id: False
        superadmin_routes.sync_assinatura_from_clinica = self._sync
        superadmin_routes.registrar_auditoria = self._audit
        superadmin_routes.assinatura_status_from_clinica = lambda clinica: "ativa" if clinica.ativo else "suspensa"

    def tearDown(self):
        superadmin_routes._require_superadmin = self.original_require
        superadmin_routes._is_owner_clinica = self.original_is_owner
        superadmin_routes.sync_assinatura_from_clinica = self.original_sync
        superadmin_routes.registrar_auditoria = self.original_audit
        superadmin_routes.assinatura_status_from_clinica = self.original_status

    def _sync(self, db, clinica):
        db.synced = True

    def _audit(self, db, actor, acao, alvo_tipo, alvo_id, detalhes, ip=None):
        db.audit_calls.append(
            {
                "actor": actor,
                "acao": acao,
                "alvo_tipo": alvo_tipo,
                "alvo_id": alvo_id,
                "detalhes": detalhes,
                "ip": ip,
            }
        )

    def _call(self, clinica, plano="MENSAL", dias=None, manter_ativo=True):
        db = FakeMonthlyDb(clinica)
        request = SimpleNamespace(client=SimpleNamespace(host="127.0.0.1"))
        current_user = SimpleNamespace(id=1, email="master@brana.test")
        result = superadmin_routes.superadmin_set_clinica_plano(
            clinica_id=99,
            payload=superadmin_routes.SuperAdminSetPlanoPayload(
                plano=plano,
                dias=dias,
                manter_ativo=manter_ativo,
            ),
            request=request,
            current_user=current_user,
            db=db,
        )
        return result, db

    def test_master_applies_monthly_plan_with_default_validity_and_audit(self):
        clinica = FakeClinica(id=99, ativo=True, tipo_conta="DEMO 7 dias", trial_ate=datetime.utcnow() + timedelta(days=3))

        result, db = self._call(clinica)

        self.assertEqual(result["detail"], "Plano da clinica atualizado.")
        self.assertEqual(result["clinica_id"], 99)
        self.assertEqual(result["plano"], "MENSAL")
        self.assertEqual(result["tipo_conta"], "Mensal")
        self.assertTrue(result["ativo"])
        self.assertTrue(clinica.ativo)
        self.assertEqual(clinica.tipo_conta, "Mensal")
        self.assertTrue(clinica.trial_ate > datetime.utcnow() + timedelta(days=29))
        self.assertIsNotNone(clinica.data_ativacao)
        self.assertTrue(db.synced)
        self.assertTrue(db.committed)
        self.assertIs(db.refreshed, clinica)
        self.assertEqual(db.audit_calls[0]["acao"], "clinica_plano_update")
        self.assertEqual(db.audit_calls[0]["detalhes"]["plano"], "MENSAL")
        self.assertEqual(db.audit_calls[0]["detalhes"]["dias"], 30)
        self.assertEqual(db.audit_calls[0]["detalhes"]["manter_ativo"], True)

    def test_monthly_reapplies_existing_monthly_plan(self):
        clinica = FakeClinica(id=99, ativo=True, tipo_conta="Mensal", trial_ate=datetime.utcnow() + timedelta(days=12))

        result, db = self._call(clinica)

        self.assertEqual(result["plano"], "MENSAL")
        self.assertEqual(db.audit_calls[0]["detalhes"]["dias"], 30)
        self.assertTrue(clinica.trial_ate > datetime.utcnow() + timedelta(days=29))

    def test_monthly_reactivates_suspended_clinic(self):
        clinica = FakeClinica(id=99, ativo=False, tipo_conta="DEMO 7 dias")

        result, _db = self._call(clinica)

        self.assertTrue(result["ativo"])
        self.assertTrue(clinica.ativo)
        self.assertEqual(result["assinatura_status"], "ativa")

    def test_monthly_changes_annual_clinic_to_monthly(self):
        clinica = FakeClinica(id=99, ativo=True, tipo_conta="Anual", trial_ate=datetime.utcnow() + timedelta(days=200))

        result, _db = self._call(clinica)

        self.assertEqual(result["plano"], "MENSAL")
        self.assertEqual(clinica.tipo_conta, "Mensal")

    def test_monthly_accepts_explicit_legacy_days_when_sent_by_legacy(self):
        clinica = FakeClinica(id=99, ativo=True, tipo_conta="DEMO 7 dias")

        result, db = self._call(clinica, dias=45)

        self.assertEqual(result["plano"], "MENSAL")
        self.assertEqual(db.audit_calls[0]["detalhes"]["dias"], 45)
        self.assertTrue(clinica.trial_ate > datetime.utcnow() + timedelta(days=44))

    def test_monthly_rejects_invalid_plan_payload(self):
        with self.assertRaises(HTTPException) as exc:
            self._call(FakeClinica(id=99), plano="INVALIDO")

        self.assertEqual(exc.exception.status_code, 400)
        self.assertIn("Plano invalido", exc.exception.detail)

    def test_monthly_rejects_missing_clinic(self):
        with self.assertRaises(HTTPException) as exc:
            self._call(None)

        self.assertEqual(exc.exception.status_code, 404)

    def test_monthly_requires_superadmin_before_changing_data(self):
        def deny(_current_user):
            raise HTTPException(status_code=403, detail="Acesso negado.")

        superadmin_routes._require_superadmin = deny
        clinica = FakeClinica(id=99, tipo_conta="DEMO 7 dias")
        with self.assertRaises(HTTPException) as exc:
            self._call(clinica)

        self.assertEqual(exc.exception.status_code, 403)
        self.assertEqual(clinica.tipo_conta, "DEMO 7 dias")

    def test_monthly_blocks_owner_clinic_for_non_owner_actor(self):
        superadmin_routes._is_owner_clinica = lambda db, clinica_id: True
        clinica = FakeClinica(id=99, tipo_conta="Super Admin")
        with self.assertRaises(HTTPException) as exc:
            self._call(clinica)

        self.assertEqual(exc.exception.status_code, 403)
        self.assertEqual(clinica.tipo_conta, "Super Admin")


if __name__ == "__main__":
    unittest.main()
