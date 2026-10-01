import asyncio
import hashlib
import ssl
import unittest
from datetime import datetime

import httpx
from fastapi import FastAPI
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from database import Base
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
from routes.signature_authorization_isolated_routes import create_signature_authorization_router
from services.signature_authorization_service import TrustedInstallationIdentity
from services.installation_identity_registry import InstallationIdentityRegistry


class RouterSqlIsolation(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False}, poolclass=__import__("sqlalchemy").pool.StaticPool)
        Base.metadata.create_all(engine, tables=[Clinica.__table__, PrestadorOdonto.__table__, UnidadeAtendimento.__table__, Lancamento.__table__, ConvenioOdonto.__table__, ProcedimentoGenerico.__table__, Material.__table__, Usuario.__table__, UsuarioCertificado.__table__, SignatureAuthorization.__table__])
        self.db = sessionmaker(bind=engine)()
        clinic = Clinica(nome="Route test", email="route@test", trial_ate=datetime.utcnow()); self.db.add(clinic); self.db.flush()
        self.user = Usuario(nome="Holder", email="route-holder@test", senha_hash=hash_password("secret"), clinica_id=clinic.id, ativo=True, setup_completed=True, is_admin=False)
        self.db.add(self.user); self.db.flush(); self.db.add(UsuarioCertificado(clinica_id=clinic.id, titular_user_id=self.user.id, criado_por_user_id=self.user.id, certificado_der_sha256="a" * 64, status="ACTIVE")); self.db.commit()
        self.identity = TrustedInstallationIdentity("install-test", authenticated=True)
        self.peer_der = b"synthetic-peer-der"
        self.peer_pem = ssl.DER_cert_to_PEM_cert(self.peer_der)
        self.registry = InstallationIdentityRegistry(); self.registry.register("install-test", hashlib.sha256(self.peer_der).hexdigest())
        app = FastAPI()
        app.include_router(create_signature_authorization_router(get_db=lambda: self.db, get_actor=lambda: self.user, installation_registry=self.registry))
        async def trusted_app(scope, receive, send):
            scope = dict(scope); scope["extensions"] = {"tls": {"client_cert_chain": (self.peer_pem,), "client_cert_error": None}}
            await app(scope, receive, send)
        self.transport = httpx.ASGITransport(app=trusted_app)

    async def asyncTearDown(self):
        self.db.close()

    async def test_real_router_sql_issue_consume_and_no_trusted_identity(self):
        async with httpx.AsyncClient(transport=self.transport, base_url="http://test") as client:
            common = {"password":"secret", "operation_id":"op-route", "prepared_pdf_sha256":"b"*64, "certificado_der_sha256":"a"*64, "field_name":"BranaSignature_1", "policy_oid":"policy"}
            issued = await client.post("/v1/signature-authorizations", json=common)
            self.assertEqual(issued.status_code, 200)
            aid = issued.json()["authorization_id"]
            consumed = await client.post("/v1/signature-authorizations/consume", json={**common, "authorization_id":aid})
            self.assertEqual(consumed.status_code, 200)
            again = await client.post("/v1/signature-authorizations/consume", json={**common, "authorization_id":aid})
            self.assertEqual(again.status_code, 409)

    async def test_direct_header_cannot_supply_identity(self):
        app = FastAPI()
        app.include_router(create_signature_authorization_router(get_db=lambda: self.db, get_actor=lambda: self.user, installation_registry=InstallationIdentityRegistry()))
        async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:
            response = await client.post("/v1/signature-authorizations/consume", headers={"X-Installation-Id":"install-test"}, json={"authorization_id":"missing", "operation_id":"x", "prepared_pdf_sha256":"b"*64, "certificado_der_sha256":"a"*64, "field_name":"BranaSignature_1", "policy_oid":"policy"})
            self.assertEqual(response.status_code, 403)


if __name__ == "__main__":
    unittest.main()
