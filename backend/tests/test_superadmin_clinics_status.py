import os
import sys
from dataclasses import dataclass
from pathlib import Path
from types import SimpleNamespace
import unittest

from fastapi import HTTPException
from pydantic import ValidationError

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

os.environ.setdefault("DATABASE_URL", "sqlite+pysqlite:///:memory:")
os.environ.setdefault("JWT_SECRET_KEY", "test-secret-key-for-superadmin-status-tests")

from routes import superadmin_routes


@dataclass
class FakeClinica:
    id: int
    nome: str = "Clinica Status"
    email: str = "clinica-status@brana.test"
    ativo: bool = True
    tipo_conta: str = "MENSAL"
    trial_ate = None


class FakeClinicaQuery:
    def __init__(self, clinica):
        self.clinica = clinica

    def filter(self, *args, **kwargs):
        return self

    def first(self):
        return self.clinica


class FakeStatusDb:
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


class SuperadminClinicStatusTests(unittest.TestCase):
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

    def _call(self, clinica, ativo=False, motivo="motivo teste"):
        db = FakeStatusDb(clinica)
        request = SimpleNamespace(client=SimpleNamespace(host="127.0.0.1"))
        current_user = SimpleNamespace(id=1, email="master@brana.test")
        result = superadmin_routes.superadmin_set_clinica_status(
            clinica_id=99,
            payload=superadmin_routes.SuperAdminSetStatusPayload(ativo=ativo, motivo=motivo),
            request=request,
            current_user=current_user,
            db=db,
        )
        return result, db

    def test_master_suspends_active_clinic_and_audits(self):
        clinica = FakeClinica(id=99, ativo=True)

        result, db = self._call(clinica, ativo=False, motivo="inadimplencia")

        self.assertEqual(result["detail"], "Status da clinica atualizado.")
        self.assertEqual(result["clinica_id"], 99)
        self.assertFalse(result["ativo"])
        self.assertEqual(result["assinatura_status"], "suspensa")
        self.assertFalse(clinica.ativo)
        self.assertTrue(db.synced)
        self.assertTrue(db.committed)
        self.assertIs(db.refreshed, clinica)
        self.assertEqual(db.audit_calls[0]["acao"], "clinica_status_update")
        self.assertEqual(db.audit_calls[0]["detalhes"], {"ativo": False, "motivo": "inadimplencia"})

    def test_master_reactivates_suspended_clinic(self):
        clinica = FakeClinica(id=99, ativo=False)

        result, db = self._call(clinica, ativo=True, motivo="")

        self.assertTrue(result["ativo"])
        self.assertEqual(result["assinatura_status"], "ativa")
        self.assertTrue(clinica.ativo)
        self.assertTrue(db.synced)
        self.assertEqual(db.audit_calls[0]["detalhes"], {"ativo": True, "motivo": ""})

    def test_status_reason_is_optional_and_trimmed_in_audit(self):
        clinica = FakeClinica(id=99, ativo=True)

        _result, db = self._call(clinica, ativo=False, motivo="  ")

        self.assertEqual(db.audit_calls[0]["detalhes"]["motivo"], "")

    def test_status_payload_requires_ativo(self):
        with self.assertRaises(ValidationError):
            superadmin_routes.SuperAdminSetStatusPayload(motivo="sem ativo")

    def test_status_payload_rejects_invalid_ativo(self):
        with self.assertRaises(ValidationError):
            superadmin_routes.SuperAdminSetStatusPayload(ativo="abc")

    def test_status_rejects_missing_clinic(self):
        with self.assertRaises(HTTPException) as exc:
            self._call(None, ativo=False)

        self.assertEqual(exc.exception.status_code, 404)

    def test_status_requires_superadmin_before_changing_data(self):
        def deny(_current_user):
            raise HTTPException(status_code=403, detail="Acesso negado.")

        superadmin_routes._require_superadmin = deny
        clinica = FakeClinica(id=99, ativo=True)
        with self.assertRaises(HTTPException) as exc:
            self._call(clinica, ativo=False)

        self.assertEqual(exc.exception.status_code, 403)
        self.assertTrue(clinica.ativo)

    def test_status_blocks_owner_clinic_for_non_owner_actor(self):
        superadmin_routes._is_owner_clinica = lambda db, clinica_id: True
        clinica = FakeClinica(id=99, ativo=True)
        with self.assertRaises(HTTPException) as exc:
            self._call(clinica, ativo=False)

        self.assertEqual(exc.exception.status_code, 403)
        self.assertTrue(clinica.ativo)


if __name__ == "__main__":
    unittest.main()
