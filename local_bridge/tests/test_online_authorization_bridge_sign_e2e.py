"""8F: real bridge HTTP handler -> real SQL/mTLS consumer -> fake signer."""
import asyncio
import hashlib
import os
import socket
import ssl
import sys
import tempfile
import time
import unittest
from datetime import datetime, timedelta
from pathlib import Path

import fitz
from cryptography import x509
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import ec, rsa
from cryptography.x509.oid import ExtendedKeyUsageOID, NameOID
from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "backend"))
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
from services.signature_authorization_service import TrustedInstallationIdentity, issue_authorization, reserve_authorization
from services.installation_identity_registry import InstallationIdentityRegistry
from services.editor_signature_anchor_service import prepare_signature_anchor
from local_bridge.secure_bridge_app import create_secure_bridge_runtime
from local_bridge.security.online_authorization_client import OnlineAuthorizationConfig, OnlineAuthorizationConsumer
from local_bridge.security.prepared_signer import FakePreparedPdfSigner
from local_bridge.security.protocol import b64url_encode, calculate_hmac, canonicalize_hmac_request
from local_bridge.security.ui import ApprovalDecision, PendingApprovalUI


def _cert(name, key, issuer, issuer_key, *, ca=False, san=None, server_auth=False):
    b = x509.CertificateBuilder().subject_name(x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, name)])).issuer_name(issuer).public_key(key.public_key()).serial_number(x509.random_serial_number()).not_valid_before(datetime.utcnow() - timedelta(minutes=1)).not_valid_after(datetime.utcnow() + timedelta(days=1)).add_extension(x509.BasicConstraints(ca=ca, path_length=None), critical=True)
    if san:
        b = b.add_extension(x509.SubjectAlternativeName([x509.DNSName(san)]), critical=False)
    if server_auth:
        b = b.add_extension(x509.ExtendedKeyUsage([ExtendedKeyUsageOID.SERVER_AUTH]), critical=False)
    return b.sign(issuer_key, hashes.SHA256())


def _write(root, name, cert, key):
    (root / (name + ".crt")).write_bytes(cert.public_bytes(serialization.Encoding.PEM))
    (root / (name + ".key")).write_bytes(key.private_bytes(serialization.Encoding.PEM, serialization.PrivateFormat.TraditionalOpenSSL, serialization.NoEncryption()))


class _Lock:
    def acquire(self): pass
    def release(self): pass


class _Approve(PendingApprovalUI):
    def approve_pairing(self, request): return ApprovalDecision.APPROVED
    def approve_signature(self, operation): return ApprovalDecision.APPROVED


class OnlineAuthorizationBridgeE2E(unittest.IsolatedAsyncioTestCase):
    async def test_real_sign_consumes_before_fake_signer(self):
        anycorn = os.environ.get("ANYCORN_PYTHON")
        if not anycorn:
            self.skipTest("ANYCORN_PYTHON not set")
        sys.path.insert(0, str(Path(anycorn).parent.parent / "Lib" / "site-packages"))
        from anycorn import serve
        from anycorn.config import Config

        with tempfile.TemporaryDirectory(prefix="brana-8f-") as tmp:
            root = Path(tmp)
            ca_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
            ca_name = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, "test-ca")])
            ca = _cert("test-ca", ca_key, ca_name, ca_key, ca=True)
            server_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
            server = _cert("localhost", server_key, ca.subject, ca_key, san="localhost", server_auth=True)
            client_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
            client = _cert("bridge-install", client_key, ca.subject, ca_key)
            _write(root, "ca", ca, ca_key); _write(root, "server", server, server_key); _write(root, "client", client, client_key)
            client_der_hash = hashlib.sha256(client.public_bytes(serialization.Encoding.DER)).hexdigest()

            engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False}, poolclass=__import__("sqlalchemy").pool.StaticPool)
            tables = [Clinica.__table__, PrestadorOdonto.__table__, UnidadeAtendimento.__table__, Lancamento.__table__, ConvenioOdonto.__table__, ProcedimentoGenerico.__table__, Material.__table__, Usuario.__table__, UsuarioCertificado.__table__, SignatureAuthorization.__table__]
            Base.metadata.create_all(engine, tables=tables)
            db = sessionmaker(bind=engine)()
            clinic = Clinica(nome="isolated", email="isolated@test", trial_ate=datetime.utcnow()); db.add(clinic); db.flush()
            user = Usuario(nome="holder", email="holder@isolated", senha_hash=hash_password("secret"), clinica_id=clinic.id, ativo=True, setup_completed=True, is_admin=False); db.add(user); db.flush()
            db.add(UsuarioCertificado(clinica_id=clinic.id, titular_user_id=user.id, criado_por_user_id=user.id, certificado_der_sha256=client_der_hash, status="ACTIVE")); db.commit()

            source = fitz.open(); source.new_page(width=595, height=842).insert_text((100, 300), "<<Cirurgião.AssinaturaDigital>>", fontsize=10)
            prepared = prepare_signature_anchor(source.tobytes()).pdf_bytes
            pdf_hash = hashlib.sha256(prepared).hexdigest()
            operation_id = b64url_encode(b"8" * 16)
            field = "BranaSignature_1"; policy = "2.16.76.1.7.1.11.1.3"
            registry = InstallationIdentityRegistry(); registry.register("install-8f", client_der_hash)
            row = reserve_authorization(db, actor=user, installation=TrustedInstallationIdentity("install-8f", True), operation_id=operation_id, prepared_pdf_sha256=pdf_hash, certificado_der_sha256=client_der_hash, field_name=field, policy_oid=policy); db.commit()

            app = FastAPI(); app.include_router(create_signature_authorization_router(get_db=lambda: db, get_actor=lambda: user, installation_registry=registry))
            stop = asyncio.Event(); probe = socket.socket(); probe.bind(("127.0.0.1", 0)); sql_port = probe.getsockname()[1]; probe.close()
            async def sql_server():
                cfg = Config(); cfg.bind = [f"127.0.0.1:{sql_port}"]; cfg.certfile = str(root / "server.crt"); cfg.keyfile = str(root / "server.key"); cfg.ca_certs = str(root / "ca.crt"); cfg.cert_reqs = 2
                await serve(app, cfg, shutdown_trigger=stop.wait)
            server_task = asyncio.create_task(sql_server())
            try:
                for _ in range(60):
                    try:
                        with socket.create_connection(("127.0.0.1", sql_port), timeout=.1): break
                    except OSError: await asyncio.sleep(.1)
                consumer = OnlineAuthorizationConsumer(OnlineAuthorizationConfig(f"https://localhost:{sql_port}/v1/signature-authorizations/consume", str(root / "ca.crt"), str(root / "client.crt"), str(root / "client.key")))
                fake = FakePreparedPdfSigner(b"8F-SIGNED-PDF")
                bridge_cert = server.public_bytes(serialization.Encoding.PEM); bridge_key = server_key.private_bytes(serialization.Encoding.PEM, serialization.PrivateFormat.PKCS8, serialization.NoEncryption())
                runtime = create_secure_bridge_runtime(cert_pem=bridge_cert, key_pem=bridge_key, signer=fake, ui=_Approve(), lock=_Lock(), online_authorization_consumer=consumer.consume, require_online_authorization=True)
                client_key_ec = ec.derive_private_key(9, ec.SECP256R1()); public = client_key_ec.public_key().public_bytes(serialization.Encoding.X962, serialization.PublicFormat.UncompressedPoint)
                base = {"host": "localhost:8765", "origin": "https://localhost:5173"}
                with TestClient(runtime.create_app()) as bridge:
                    pair = (await asyncio.to_thread(bridge.post, "/v1/pairing-requests", headers=base, json={"client_instance_id": b64url_encode(b"i" * 16), "client_nonce": b64url_encode(b"n" * 16), "client_ecdh_public_key": b64url_encode(public)})).json()
                    session = pair["session_id"]
                    params = {"operation_id": operation_id, "field_name": field, "policy_oid": policy, "profile": "pades-ad-rb-1.3", "certificate_der_sha256": client_der_hash, "authorization_id": row.authorization_id}
                    def auth_headers(path, nonce, method="POST", content=prepared):
                        ts = int(time.time()); rn = b64url_encode(nonce * 16); digest = hashlib.sha256(content).hexdigest(); auth_params = {"operation_id": operation_id} if method == "GET" else params
                        canonical = canonicalize_hmac_request(method=method, path=path, origin=base["origin"], timestamp=ts, request_nonce=rn, session_id=session, content_sha256=digest, body_length=len(content), parameters=auth_params, operation_id=operation_id)
                        return {**base, "X-Brana-Bridge-Protocol": "brana-bridge-v1", "X-Brana-Session": session, "X-Brana-Timestamp": str(ts), "X-Brana-Request-Nonce": rn, "X-Brana-Content-SHA256": digest, "X-Brana-Request-MAC": calculate_hmac(runtime.service.session_keys[session], canonical), "X-Brana-Operation-Id": operation_id, "X-Brana-Field-Name": field, "X-Brana-Policy-OID": policy, "X-Brana-Profile": params["profile"], "X-Brana-Certificate-DER-SHA256": client_der_hash, "X-Brana-Authorization-Id": row.authorization_id}
                    create = await asyncio.to_thread(bridge.post, "/v1/signature-operations", headers=auth_headers("/v1/signature-operations", b"a"), content=prepared)
                    self.assertEqual(create.status_code, 200)
                    db.refresh(row)
                    self.assertEqual(row.status, "RESERVED")
                    before_confirmation = await asyncio.to_thread(bridge.post, f"/v1/signature-operations/{operation_id}/sign", headers=auth_headers(f"/v1/signature-operations/{operation_id}/sign", b"e"), content=prepared)
                    self.assertEqual(before_confirmation.status_code, 409)
                    self.assertEqual(len(fake.calls), 0)
                    issued = issue_authorization(db, actor=user, senha="secret", installation=TrustedInstallationIdentity("install-8f", True), authorization_id=row.authorization_id, operation_id=operation_id, prepared_pdf_sha256=pdf_hash, certificado_der_sha256=client_der_hash, field_name=field, policy_oid=policy)
                    db.commit()
                    self.assertEqual(issued.authorization_id, row.authorization_id)
                    self.assertEqual(issued.status, "ISSUED")
                    signed = await asyncio.to_thread(bridge.post, f"/v1/signature-operations/{operation_id}/sign", headers=auth_headers(f"/v1/signature-operations/{operation_id}/sign", b"b"), content=prepared)
                    self.assertEqual(signed.status_code, 200, signed.text)
                    self.assertEqual(len(fake.calls), 1)
                    db.refresh(row); self.assertEqual(row.status, "CONSUMED")
                    result = await asyncio.to_thread(bridge.get, f"/v1/signature-operations/{operation_id}/result", headers=auth_headers(f"/v1/signature-operations/{operation_id}/result", b"c", method="GET", content=b""))
                    self.assertEqual(result.status_code, 200); self.assertEqual(result.content, b"8F-SIGNED-PDF")
                    second = await asyncio.to_thread(bridge.post, f"/v1/signature-operations/{operation_id}/sign", headers=auth_headers(f"/v1/signature-operations/{operation_id}/sign", b"d"), content=prepared)
                    self.assertNotEqual(second.status_code, 200); self.assertEqual(len(fake.calls), 1)
            finally:
                stop.set(); await asyncio.wait_for(server_task, timeout=5); db.close(); engine.dispose()


if __name__ == "__main__": unittest.main()
