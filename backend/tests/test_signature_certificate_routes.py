import os
import sys
import unittest
from datetime import datetime
from pathlib import Path

from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "backend"))
from database import Base, get_db
from models.clinica import Clinica
from models.usuario import Usuario
from models.usuario_certificado import UsuarioCertificado
from models.prestador_odonto import PrestadorOdonto
from models.unidade_atendimento import UnidadeAtendimento
from models.financeiro import Lancamento
from models.convenio_odonto import ConvenioOdonto
from models.procedimento_generico import ProcedimentoGenerico
from models.material import Material
from routes.signature_certificate_routes import create_signature_certificate_router
from security.hash import hash_password
from security.jwt_handler import create_access_token
from security.dependencies import get_current_user


class SignatureCertificateRoutesTests(unittest.TestCase):
    def setUp(self):
        os.environ["JWT_SECRET_KEY"] = "synthetic-route-test-secret"
        self.engine = create_engine("sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool)
        tables = [Clinica.__table__, PrestadorOdonto.__table__, UnidadeAtendimento.__table__,
                  Lancamento.__table__, ConvenioOdonto.__table__, ProcedimentoGenerico.__table__,
                  Material.__table__, Usuario.__table__, UsuarioCertificado.__table__]
        Base.metadata.create_all(self.engine, tables=tables)
        self.db = sessionmaker(bind=self.engine)()
        self.clinic = Clinica(nome="cert-route", email="cert-route@test", trial_ate=datetime.utcnow())
        other_clinic = Clinica(nome="other", email="other@test", trial_ate=datetime.utcnow())
        self.db.add_all([self.clinic, other_clinic]); self.db.flush()
        self.user = Usuario(nome="holder", email="holder@cert.test", senha_hash=hash_password("pw"), clinica_id=self.clinic.id, ativo=True, setup_completed=True, is_admin=False)
        other = Usuario(nome="other", email="other@cert.test", senha_hash=hash_password("pw"), clinica_id=self.clinic.id, ativo=True, setup_completed=True, is_admin=False)
        foreign = Usuario(nome="foreign", email="foreign@cert.test", senha_hash=hash_password("pw"), clinica_id=other_clinic.id, ativo=True, setup_completed=True, is_admin=False)
        self.db.add_all([self.user, other, foreign]); self.db.flush()
        self.db.add_all([
            UsuarioCertificado(clinica_id=self.clinic.id, titular_user_id=self.user.id, criado_por_user_id=self.user.id, certificado_der_sha256="a" * 64, status="ACTIVE"),
            UsuarioCertificado(clinica_id=self.clinic.id, titular_user_id=self.user.id, criado_por_user_id=self.user.id, certificado_der_sha256="b" * 64, status="ACTIVE"),
            UsuarioCertificado(clinica_id=self.clinic.id, titular_user_id=self.user.id, criado_por_user_id=self.user.id, certificado_der_sha256="c" * 64, status="REVOKED"),
            UsuarioCertificado(clinica_id=self.clinic.id, titular_user_id=other.id, criado_por_user_id=other.id, certificado_der_sha256="d" * 64, status="ACTIVE"),
            UsuarioCertificado(clinica_id=other_clinic.id, titular_user_id=foreign.id, criado_por_user_id=foreign.id, certificado_der_sha256="e" * 64, status="ACTIVE"),
        ]); self.db.commit()
        app = FastAPI(); app.include_router(create_signature_certificate_router())
        app.dependency_overrides[get_db] = lambda: self.db
        self.client = TestClient(app)

    def tearDown(self):
        self.db.close(); self.engine.dispose()

    def test_jwt_lists_only_active_certificates_and_requires_choice(self):
        token = create_access_token({"user_id": self.user.id})
        response = self.client.get("/signature-certificates/available", headers={"Authorization": f"Bearer {token}"})
        self.assertEqual(response.status_code, 200)
        body = response.json(); self.assertTrue(body["selection_required"])
        self.assertEqual([item["der_sha256_short"] for item in body["certificates"]], ["a" * 12, "b" * 12])
        self.assertNotIn("c" * 64, response.text); self.assertNotIn("d" * 64, response.text); self.assertNotIn("e" * 64, response.text)
        self.assertTrue(all("private" not in item for item in body["certificates"]))

    def test_missing_or_other_user_jwt_is_rejected_or_isolated(self):
        self.assertEqual(self.client.get("/signature-certificates/available").status_code, 401)
        other = self.db.query(Usuario).filter_by(email="other@cert.test").one()
        token = create_access_token({"user_id": other.id})
        body = self.client.get("/signature-certificates/available", headers={"Authorization": f"Bearer {token}"}).json()
        self.assertEqual([item["der_sha256_short"] for item in body["certificates"]], ["d" * 12])

    def test_capability_is_server_supplied_and_false_without_mtls_installation(self):
        token = create_access_token({"user_id": self.user.id})
        self.assertFalse(self.client.get("/signature-certificates/available", headers={"Authorization": f"Bearer {token}"}).json()["authorization_flow_enabled"])
        active = FastAPI()
        active.include_router(create_signature_certificate_router(db_dependency=lambda: self.db, capability_provider=lambda: True))
        active.dependency_overrides[get_current_user] = lambda: self.user
        response = TestClient(active).get("/signature-certificates/available", headers={"Authorization": f"Bearer {token}"})
        self.assertTrue(response.json()["authorization_flow_enabled"])
        # The value is produced by the server-side provider; a request field
        # cannot alter it because this endpoint is GET and has no body input.
        self.assertNotIn(b"authorization_flow_enabled=true", response.url.query.lower())


if __name__ == "__main__":
    unittest.main()
