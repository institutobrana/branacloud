"""Positive cross-process JWT API + real isolated mTLS entrypoint proof."""
import hashlib, http.client, ipaddress, json, os, secrets, socket, ssl, subprocess, sys, tempfile, threading, time, unittest
from datetime import datetime, timedelta
from pathlib import Path

import uvicorn
from cryptography import x509
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.x509.oid import ExtendedKeyUsageOID, NameOID
from fastapi import FastAPI
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "backend"))
from database import Base
from models.clinica import Clinica
from models.usuario import Usuario
from models.usuario_certificado import UsuarioCertificado
from models.signature_authorization import SignatureAuthorization
from models.signature_reservation_request import SignatureReservationRequest
from models.prestador_odonto import PrestadorOdonto
from models.unidade_atendimento import UnidadeAtendimento
from models.financeiro import Lancamento
from models.convenio_odonto import ConvenioOdonto
from models.procedimento_generico import ProcedimentoGenerico
from models.material import Material
from routes.signature_certificate_routes import create_signature_certificate_router
from routes.signature_reservation_challenge_routes import create_signature_reservation_challenge_router
from routes.signature_authorization_routes import create_signature_authorization_operational_router
from security.dependencies import get_current_user
from security.hash import hash_password
from security.jwt_handler import create_access_token
from services.installation_identity_registry import InstallationIdentityRegistry
from services.signature_authorization_service import TrustedInstallationIdentity
from local_bridge.security.reservation_challenge_client import ReservationChallengeConfig, ReservationChallengeForwarder
from local_bridge.security.online_authorization_client import OnlineAuthorizationConfig, OnlineAuthorizationConsumer, OnlineAuthorizationError


def cert(name, key, issuer, issuer_key, *, ca=False, server=False, client=False):
    now = datetime.utcnow()
    b = x509.CertificateBuilder().subject_name(x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, name)])).issuer_name(issuer).public_key(key.public_key()).serial_number(x509.random_serial_number()).not_valid_before(now - timedelta(minutes=1)).not_valid_after(now + timedelta(hours=1)).add_extension(x509.BasicConstraints(ca=ca, path_length=None), critical=True)
    if server: b = b.add_extension(x509.SubjectAlternativeName([x509.DNSName("localhost"), x509.IPAddress(ipaddress.ip_address("127.0.0.1"))]), critical=False).add_extension(x509.ExtendedKeyUsage([ExtendedKeyUsageOID.SERVER_AUTH]), critical=False)
    if client: b = b.add_extension(x509.ExtendedKeyUsage([ExtendedKeyUsageOID.CLIENT_AUTH]), critical=False)
    return b.sign(issuer_key, hashes.SHA256())


def write_pair(root, name, certificate, key):
    (root / f"{name}.crt").write_bytes(certificate.public_bytes(serialization.Encoding.PEM))
    (root / f"{name}.key").write_bytes(key.private_bytes(serialization.Encoding.PEM, serialization.PrivateFormat.TraditionalOpenSSL, serialization.NoEncryption()))


class JwtMtlsSameDbPositive(unittest.TestCase):
    def test_jwt_mtls_same_db_positive(self):
        from sqlalchemy.pool import StaticPool
        with tempfile.TemporaryDirectory(prefix="brana-jwt-mtls-positive-") as tmp:
            root = Path(tmp); ca_key = rsa.generate_private_key(public_exponent=65537, key_size=2048); ca_name = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, "ca")]); ca = cert("ca", ca_key, ca_name, ca_key, ca=True)
            server_key = rsa.generate_private_key(public_exponent=65537, key_size=2048); server = cert("localhost", server_key, ca.subject, ca_key, server=True)
            client_key = rsa.generate_private_key(public_exponent=65537, key_size=2048); client = cert("install", client_key, ca.subject, ca_key, client=True)
            write_pair(root, "server", server, server_key); write_pair(root, "client", client, client_key); (root / "ca.crt").write_bytes(ca.public_bytes(serialization.Encoding.PEM))
            mtls_hash = hashlib.sha256(client.public_bytes(serialization.Encoding.DER)).hexdigest(); signing_hash = "a" * 64; db_url = f"sqlite:///{(root / 'shared.sqlite').as_posix()}"
            (root / "registry.json").write_text(json.dumps([{ "installation_id":"install-test", "certificate_der_sha256":mtls_hash, "status":"ACTIVE"}]), encoding="utf-8")
            engine = create_engine(db_url); tables = [Clinica.__table__, PrestadorOdonto.__table__, UnidadeAtendimento.__table__, Lancamento.__table__, ConvenioOdonto.__table__, ProcedimentoGenerico.__table__, Material.__table__, Usuario.__table__, UsuarioCertificado.__table__, SignatureAuthorization.__table__, SignatureReservationRequest.__table__]; Base.metadata.create_all(engine, tables=tables); Session = sessionmaker(bind=engine); db = Session(); clinic = Clinica(nome="jwt", email="jwt@test", trial_ate=datetime.utcnow()); db.add(clinic); db.flush(); user = Usuario(nome="jwt-user", email="jwt-user@test", senha_hash=hash_password("test-password"), clinica_id=clinic.id, ativo=True, setup_completed=True, is_admin=False); db.add(user); db.flush(); db.add(UsuarioCertificado(clinica_id=clinic.id, titular_user_id=user.id, criado_por_user_id=user.id, certificado_der_sha256=signing_hash, status="ACTIVE")); db.commit(); user_id = user.id; db.close()
            app = FastAPI()
            def get_db():
                s = Session();
                try: yield s
                finally: s.close()
            app.dependency_overrides[__import__('database').get_db] = get_db
            identity = TrustedInstallationIdentity("install-test", authenticated=True)
            app.include_router(create_signature_certificate_router(db_dependency=get_db, capability_provider=lambda: False))
            app.include_router(create_signature_reservation_challenge_router(installation_dependency=lambda: identity, db_dependency=get_db))
            app.include_router(create_signature_authorization_operational_router(installation_dependency=lambda: identity, db_dependency=get_db))
            port_socket = socket.socket(); port_socket.bind(("127.0.0.1", 0)); api_port = port_socket.getsockname()[1]; port_socket.close(); config = uvicorn.Config(app, host="127.0.0.1", port=api_port, log_level="error"); server = uvicorn.Server(config); thread = threading.Thread(target=server.run, daemon=True); thread.start()
            child_port_socket = socket.socket(); child_port_socket.bind(("127.0.0.1", 0)); child_port = child_port_socket.getsockname()[1]; child_port_socket.close(); child_env = os.environ.copy(); child_env.update({"BRANA_MTLS_DATABASE_URL":db_url,"BRANA_MTLS_CA_CERT":str(root/"ca.crt"),"BRANA_MTLS_SERVER_CERT":str(root/"server.crt"),"BRANA_MTLS_SERVER_KEY":str(root/"server.key"),"BRANA_MTLS_REGISTRY_JSON":str(root/"registry.json"),"BRANA_MTLS_BIND":f"127.0.0.1:{child_port}","PYTHONPATH":os.pathsep.join([str(ROOT/"backend"), os.environ.get("BRANA_TEST_ANYCORN_SITE", "")])}); child = subprocess.Popen([sys.executable, str(ROOT/"backend/isolated_mtls_service.py")], cwd=str(ROOT), env=child_env, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
            try:
                deadline = time.time() + 15
                while time.time() < deadline and not server.started: time.sleep(.05)
                while time.time() < deadline:
                    if child.poll() is not None: self.fail(child.stderr.read())
                    try:
                        with socket.create_connection(("127.0.0.1", child_port), timeout=.2): break
                    except OSError: time.sleep(.1)
                token = create_access_token({"user_id": user_id}); headers = {"Authorization": f"Bearer {token}", "Content-Type":"application/json"}; conn = http.client.HTTPConnection("127.0.0.1", api_port, timeout=5); conn.request("GET", "/signature-certificates/available", headers=headers); listed = conn.getresponse(); body = json.loads(listed.read()); self.assertEqual(listed.status, 200); self.assertEqual(body["certificates"][0]["certificate_der_sha256"], signing_hash)
                op_id = secrets.token_urlsafe(12); payload = {"operation_id":op_id,"prepared_pdf_sha256":"b"*64,"certificado_der_sha256":signing_hash,"field_name":"BranaSignature_1","policy_oid":"policy"}; conn.request("POST", "/signature-reservation-requests", body=json.dumps(payload), headers=headers); pending = conn.getresponse(); pending_body = json.loads(pending.read()); self.assertEqual(pending.status, 200); conn.close()
                forwarder = ReservationChallengeForwarder(ReservationChallengeConfig(f"https://127.0.0.1:{child_port}/signature-reservation-requests/bind-installation", str(root/"ca.crt"), str(root/"client.crt"), str(root/"client.key"))); bound = forwarder.forward(request_id=pending_body["request_id"], challenge=pending_body["challenge"], operation_id=op_id, prepared_pdf_sha256="b"*64, certificado_der_sha256=signing_hash); self.assertEqual(bound["status"], "RESERVED")
                conn = http.client.HTTPConnection("127.0.0.1", api_port, timeout=5); conn.request("GET", f"/signature-reservation-requests/{pending_body['request_id']}", headers=headers); reserved = conn.getresponse(); reserved_body = json.loads(reserved.read()); self.assertEqual(reserved.status, 200); self.assertEqual(reserved_body["status"], "RESERVED"); confirm = {**payload,"authorization_id":bound["authorization_id"],"password":"test-password"}; conn.request("POST", "/signature-authorizations", body=json.dumps(confirm), headers=headers); issued = conn.getresponse(); self.assertEqual(issued.status, 200); conn.close()
                before_engine = create_engine(db_url); before_session = sessionmaker(bind=before_engine)(); before = before_session.query(SignatureAuthorization).filter_by(authorization_id=bound["authorization_id"]).one(); self.assertEqual(before.status, "ISSUED"); self.assertEqual(before.operation_id, op_id); self.assertEqual(before.installation_id, "install-test"); before_session.close(); before_engine.dispose()
                consumer = OnlineAuthorizationConsumer(OnlineAuthorizationConfig(f"https://127.0.0.1:{child_port}/v1/signature-authorizations/consume", str(root/"ca.crt"), str(root/"client.crt"), str(root/"client.key")))
                try:
                    self.assertEqual(consumer.consume(authorization_id=bound["authorization_id"], operation_id=op_id, prepared_pdf_sha256="b"*64, certificate_der_sha256=signing_hash, field_name="BranaSignature_1", policy_oid="policy"), "CONSUMED")
                except Exception as error:
                    self.fail(f"FIRST_CONSUME_HTTP_STATUS={getattr(error, 'http_status', 'unknown')} FIRST_CONSUME_ERROR_CODE={getattr(error, 'remote_code', getattr(error, 'code', str(error)))} SQL_BEFORE_CONSUME=ISSUED INSTALLATION=install-test")
                with self.assertRaises(OnlineAuthorizationError):
                    consumer.consume(authorization_id=bound["authorization_id"], operation_id=op_id, prepared_pdf_sha256="b"*64, certificate_der_sha256=signing_hash, field_name="BranaSignature_1", policy_oid="policy")
                after_session = sessionmaker(bind=engine)()
                try:
                    after = after_session.query(SignatureAuthorization).filter_by(authorization_id=bound["authorization_id"]).one()
                    self.assertEqual(after.status, "CONSUMED")
                finally:
                    after_session.close()
                self.assertNotEqual(signing_hash, mtls_hash)
            finally:
                server.should_exit = True; thread.join(8)
                if child.poll() is None:
                    child.terminate()
                child.wait(8)
                if child.stdout is not None:
                    child.stdout.read(); child.stdout.close()
                if child.stderr is not None:
                    child.stderr.read(); child.stderr.close()
                db.close(); engine.dispose();
                from database import engine as imported_engine
                imported_engine.dispose()
                self.assertFalse(thread.is_alive()); self.assertIsNotNone(child.returncode)


if __name__ == "__main__": unittest.main()
