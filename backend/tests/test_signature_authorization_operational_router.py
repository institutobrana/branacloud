import os
import unittest
from datetime import datetime

import httpx
from fastapi import FastAPI
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

os.environ.setdefault("JWT_SECRET_KEY", "isolated-operational-router-test-secret")

from database import Base, get_db
from models.clinica import Clinica
from models.usuario import Usuario
from models.usuario_certificado import UsuarioCertificado
from models.signature_authorization import SignatureAuthorization
from models.prestador_odonto import PrestadorOdonto
from models.unidade_atendimento import UnidadeAtendimento
from models.financeiro import Lancamento
from models.convenio_odonto import ConvenioOdonto
from models.procedimento_generico import ProcedimentoGenerico
from models.material import Material
from security.hash import hash_password
from security.jwt_handler import create_access_token
from services.signature_authorization_service import TrustedInstallationIdentity
from routes.signature_authorization_routes import create_signature_authorization_operational_router


class OperationalRouterTests(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        self.engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
        Base.metadata.create_all(self.engine, tables=[Clinica.__table__, Usuario.__table__, UsuarioCertificado.__table__, SignatureAuthorization.__table__, PrestadorOdonto.__table__, UnidadeAtendimento.__table__])
        self.db = sessionmaker(bind=self.engine)()
        clinic = Clinica(nome="Router clinic", email="router-clinic@test", trial_ate=datetime.utcnow())
        self.db.add(clinic); self.db.flush(); self.clinic = clinic
        self.user = Usuario(nome="Titular", email="router-holder@test", senha_hash=hash_password("holder-password"), clinica_id=clinic.id, ativo=True, setup_completed=True, is_admin=False)
        self.db.add(self.user); self.db.flush()
        self.db.add(UsuarioCertificado(clinica_id=clinic.id, titular_user_id=self.user.id, criado_por_user_id=self.user.id, certificado_der_sha256="a" * 64, status="ACTIVE")); self.db.commit()
        self.identity = TrustedInstallationIdentity("test-installation", authenticated=True)
        async def db_override(): return self.db
        self.app = FastAPI()
        self.app.include_router(create_signature_authorization_operational_router(installation_dependency=lambda: self.identity))
        self.app.dependency_overrides[get_db] = db_override
        self.client = httpx.AsyncClient(transport=httpx.ASGITransport(app=self.app), base_url="http://test")
        self.headers = {"Authorization": f"Bearer {create_access_token({'user_id': self.user.id})}"}
        self.payload = {"operation_id": "router-op-1", "prepared_pdf_sha256": "b" * 64, "certificado_der_sha256": "a" * 64, "field_name": "BranaSignature_1", "policy_oid": "2.16.76.1.7.1.11.1.3"}

    async def asyncTearDown(self):
        await self.client.aclose(); self.db.close(); self.engine.dispose()

    async def test_reserve_confirm_and_rejections(self):
        missing = await self.client.post("/signature-authorizations/reserve", json=self.payload)
        self.assertEqual(missing.status_code, 401)
        reserved = await self.client.post("/signature-authorizations/reserve", json=self.payload, headers=self.headers)
        self.assertEqual(reserved.status_code, 200); self.assertEqual(reserved.json()["status"], "RESERVED")
        authorization_id = reserved.json()["authorization_id"]
        wrong = await self.client.post("/signature-authorizations", json={**self.payload, "authorization_id": authorization_id, "password": "wrong"}, headers=self.headers)
        self.assertEqual(wrong.status_code, 401); self.assertEqual(self.db.query(SignatureAuthorization).one().status, "RESERVED")
        mismatch = await self.client.post("/signature-authorizations", json={**self.payload, "authorization_id": authorization_id, "password": "holder-password", "operation_id": "other-op"}, headers=self.headers)
        self.assertEqual(mismatch.status_code, 409); self.assertEqual(self.db.query(SignatureAuthorization).one().status, "RESERVED")
        confirmed = await self.client.post("/signature-authorizations", json={**self.payload, "authorization_id": authorization_id, "password": "holder-password"}, headers=self.headers)
        self.assertEqual(confirmed.status_code, 200); self.assertEqual(confirmed.json()["status"], "ISSUED")
        repeated = await self.client.post("/signature-authorizations", json={**self.payload, "authorization_id": authorization_id, "password": "holder-password"}, headers=self.headers)
        self.assertEqual(repeated.status_code, 409)


if __name__ == "__main__":
    unittest.main()
