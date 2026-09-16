import os
import sys
from dataclasses import dataclass
from datetime import datetime, timedelta
from pathlib import Path
from types import SimpleNamespace
import unittest

from fastapi import HTTPException
from pydantic import ValidationError

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

os.environ.setdefault("DATABASE_URL", "sqlite+pysqlite:///:memory:")
os.environ.setdefault("JWT_SECRET_KEY", "test-secret-key-for-superadmin-trial-tests")

from routes import superadmin_routes


@dataclass
class FakeClinica:
    id: int
    nome: str = "Clinica Teste"
    email: str = "clinica@brana.test"
    ativo: bool = False
    tipo_conta: str = "MENSAL"
    trial_ate: datetime | None = None


class FakeClinicaQuery:
    def __init__(self, clinica):
        self.clinica = clinica

    def filter(self, *args, **kwargs):
        return self

    def first(self):
        return self.clinica


class FakeTrialDb:
    def __init__(self, clinica):
        self.clinica = clinica
        self.committed = False
        self.refreshed = None
        self.audit_calls = []
        self.synced = False

    def query(self, model):
        if model is superadmin_routes.Clinica:
            return FakeClinicaQuery(self.clinica)
        return FakeClinicaQuery(None)

    def commit(self):
        self.committed = True

    def refresh(self, obj):
        self.refreshed = obj


class SuperadminClinicTrialExtraTests(unittest.TestCase):
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
        superadmin_routes.assinatura_status_from_clinica = lambda clinica: "trial" if clinica.ativo else "suspensa"

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

    def _call(self, clinica, dias=10):
        db = FakeTrialDb(clinica)
        request = SimpleNamespace(client=SimpleNamespace(host="127.0.0.1"))
        current_user = SimpleNamespace(id=1, email="master@brana.test")
        result = superadmin_routes.superadmin_extend_clinica_trial(
            clinica_id=99,
            payload=superadmin_routes.SuperAdminExtendTrialPayload(dias=dias),
            request=request,
            current_user=current_user,
            db=db,
        )
        return result, db

    def test_extend_trial_uses_existing_endpoint_contract_and_audits(self):
        clinica = FakeClinica(id=99, ativo=False, trial_ate=datetime.utcnow() - timedelta(days=2))

        result, db = self._call(clinica, dias=10)

        self.assertEqual(result["detail"], "Teste prorrogado por 10 dias.")
        self.assertEqual(result["clinica_id"], 99)
        self.assertEqual(result["dias"], 10)
        self.assertEqual(result["tipo_conta"], "DEMO 7 dias")
        self.assertTrue(result["ativo"])
        self.assertTrue(clinica.ativo)
        self.assertEqual(clinica.tipo_conta, "DEMO 7 dias")
        self.assertTrue(clinica.trial_ate > datetime.utcnow() + timedelta(days=9))
        self.assertTrue(db.synced)
        self.assertTrue(db.committed)
        self.assertIs(db.refreshed, clinica)
        self.assertEqual(db.audit_calls[0]["acao"], "clinica_trial_extend")
        self.assertEqual(db.audit_calls[0]["detalhes"]["dias"], 10)

    def test_extend_trial_adds_days_to_active_trial_base(self):
        base = datetime.utcnow() + timedelta(days=20)
        clinica = FakeClinica(id=99, ativo=True, trial_ate=base)

        result, _db = self._call(clinica, dias=5)

        self.assertEqual(result["dias"], 5)
        self.assertTrue(clinica.trial_ate >= base + timedelta(days=5) - timedelta(seconds=1))

    def test_extend_trial_accepts_minimum_and_maximum_values(self):
        min_result, _ = self._call(FakeClinica(id=99), dias=1)
        max_result, _ = self._call(FakeClinica(id=99), dias=3650)

        self.assertEqual(min_result["dias"], 1)
        self.assertEqual(max_result["dias"], 3650)

    def test_extend_trial_rejects_out_of_range_values(self):
        with self.assertRaises(HTTPException) as low:
            self._call(FakeClinica(id=99), dias=0)
        with self.assertRaises(HTTPException) as high:
            self._call(FakeClinica(id=99), dias=3651)

        self.assertEqual(low.exception.status_code, 400)
        self.assertEqual(high.exception.status_code, 400)
        self.assertIn("entre 1 e 3650", low.exception.detail)

    def test_extend_trial_payload_rejects_non_integer_value(self):
        with self.assertRaises(ValidationError):
            superadmin_routes.SuperAdminExtendTrialPayload(dias="abc")

    def test_extend_trial_rejects_missing_clinic(self):
        with self.assertRaises(HTTPException) as exc:
            self._call(None, dias=10)

        self.assertEqual(exc.exception.status_code, 404)

    def test_extend_trial_requires_superadmin_before_changing_data(self):
        def deny(_current_user):
            raise HTTPException(status_code=403, detail="Acesso negado.")

        superadmin_routes._require_superadmin = deny
        clinica = FakeClinica(id=99)
        with self.assertRaises(HTTPException) as exc:
            self._call(clinica, dias=10)

        self.assertEqual(exc.exception.status_code, 403)
        self.assertFalse(clinica.ativo)


if __name__ == "__main__":
    unittest.main()
