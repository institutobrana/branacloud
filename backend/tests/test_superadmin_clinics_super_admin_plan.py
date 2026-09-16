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
os.environ.setdefault("JWT_SECRET_KEY", "test-secret-key-for-superadmin-plan-tests")

from routes import superadmin_routes


@dataclass
class FakeClinica:
    id: int
    nome: str = "Clinica Super Admin"
    email: str = "clinica-superadmin@brana.test"
    ativo: bool = True
    tipo_conta: str = "Anual"
    trial_ate: datetime | None = None
    data_ativacao: datetime | None = None


@dataclass
class FakeUsuario:
    id: int = 22
    email: str = "admin-clinica@brana.test"
    is_admin: bool = True


class FakeClinicaQuery:
    def __init__(self, clinica):
        self.clinica = clinica

    def filter(self, *args, **kwargs):
        return self

    def first(self):
        return self.clinica


class FakeSuperAdminPlanDb:
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


class SuperadminClinicSuperAdminPlanTests(unittest.TestCase):
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

    def _call(self, clinica, plano="SUPERADMIN", dias=None, manter_ativo=True, current_user=None):
        db = FakeSuperAdminPlanDb(clinica)
        request = SimpleNamespace(client=SimpleNamespace(host="127.0.0.1"))
        actor = current_user or SimpleNamespace(id=1, email="master@brana.test")
        result = superadmin_routes.superadmin_set_clinica_plano(
            clinica_id=99,
            payload=superadmin_routes.SuperAdminSetPlanoPayload(
                plano=plano,
                dias=dias,
                manter_ativo=manter_ativo,
            ),
            request=request,
            current_user=actor,
            db=db,
        )
        return result, db

    def test_master_applies_super_admin_plan_with_default_validity_and_audit(self):
        clinica = FakeClinica(id=99, ativo=True, tipo_conta="Anual", trial_ate=datetime.utcnow() + timedelta(days=365))

        result, db = self._call(clinica)

        self.assertEqual(result["detail"], "Plano da clinica atualizado.")
        self.assertEqual(result["clinica_id"], 99)
        self.assertEqual(result["plano"], "SUPERADMIN")
        self.assertEqual(result["tipo_conta"], "Super Admin")
        self.assertTrue(result["ativo"])
        self.assertTrue(clinica.ativo)
        self.assertEqual(clinica.tipo_conta, "Super Admin")
        self.assertTrue(clinica.trial_ate > datetime.utcnow() + timedelta(days=364))
        self.assertIsNotNone(clinica.data_ativacao)
        self.assertTrue(db.synced)
        self.assertTrue(db.committed)
        self.assertIs(db.refreshed, clinica)
        self.assertEqual(db.audit_calls[0]["acao"], "clinica_plano_update")
        self.assertEqual(db.audit_calls[0]["detalhes"]["plano"], "SUPERADMIN")
        self.assertEqual(db.audit_calls[0]["detalhes"]["dias"], 365)
        self.assertEqual(db.audit_calls[0]["detalhes"]["manter_ativo"], True)

    def test_super_admin_reapplies_existing_super_admin_plan(self):
        clinica = FakeClinica(id=99, ativo=True, tipo_conta="Super Admin", trial_ate=datetime.utcnow() + timedelta(days=200))

        result, db = self._call(clinica)

        self.assertEqual(result["plano"], "SUPERADMIN")
        self.assertEqual(db.audit_calls[0]["detalhes"]["dias"], 365)
        self.assertTrue(clinica.trial_ate > datetime.utcnow() + timedelta(days=364))

    def test_super_admin_reactivates_suspended_clinic(self):
        clinica = FakeClinica(id=99, ativo=False, tipo_conta="Mensal")

        result, _db = self._call(clinica)

        self.assertTrue(result["ativo"])
        self.assertTrue(clinica.ativo)
        self.assertEqual(result["assinatura_status"], "ativa")

    def test_super_admin_changes_monthly_demo_and_annual_clinics(self):
        for tipo_conta in ("Mensal", "DEMO 7 dias", "Anual"):
            with self.subTest(tipo_conta=tipo_conta):
                clinica = FakeClinica(id=99, ativo=True, tipo_conta=tipo_conta)
                result, _db = self._call(clinica)
                self.assertEqual(result["plano"], "SUPERADMIN")
                self.assertEqual(clinica.tipo_conta, "Super Admin")

    def test_super_admin_does_not_change_user_fields(self):
        usuario = FakeUsuario()
        clinica = FakeClinica(id=99, ativo=True, tipo_conta="Mensal")

        self._call(clinica, current_user=usuario)

        self.assertTrue(usuario.is_admin)
        self.assertFalse(hasattr(usuario, "is_master"))
        self.assertFalse(hasattr(usuario, "is_superadmin"))

    def test_super_admin_accepts_explicit_legacy_days_when_sent_by_legacy(self):
        clinica = FakeClinica(id=99, ativo=True, tipo_conta="Mensal")

        result, db = self._call(clinica, dias=1000)

        self.assertEqual(result["plano"], "SUPERADMIN")
        self.assertEqual(db.audit_calls[0]["detalhes"]["dias"], 1000)
        self.assertTrue(clinica.trial_ate > datetime.utcnow() + timedelta(days=999))

    def test_super_admin_rejects_invalid_plan_payload(self):
        with self.assertRaises(HTTPException) as exc:
            self._call(FakeClinica(id=99), plano="INVALIDO")

        self.assertEqual(exc.exception.status_code, 400)
        self.assertIn("Plano invalido", exc.exception.detail)

    def test_super_admin_rejects_missing_clinic(self):
        with self.assertRaises(HTTPException) as exc:
            self._call(None)

        self.assertEqual(exc.exception.status_code, 404)

    def test_super_admin_requires_superadmin_before_changing_data(self):
        def deny(_current_user):
            raise HTTPException(status_code=403, detail="Acesso negado.")

        superadmin_routes._require_superadmin = deny
        clinica = FakeClinica(id=99, tipo_conta="Mensal")
        with self.assertRaises(HTTPException) as exc:
            self._call(clinica)

        self.assertEqual(exc.exception.status_code, 403)
        self.assertEqual(clinica.tipo_conta, "Mensal")

    def test_super_admin_blocks_owner_clinic_for_non_owner_actor(self):
        superadmin_routes._is_owner_clinica = lambda db, clinica_id: True
        clinica = FakeClinica(id=99, tipo_conta="Super Admin")
        with self.assertRaises(HTTPException) as exc:
            self._call(clinica)

        self.assertEqual(exc.exception.status_code, 403)
        self.assertEqual(clinica.tipo_conta, "Super Admin")


if __name__ == "__main__":
    unittest.main()
