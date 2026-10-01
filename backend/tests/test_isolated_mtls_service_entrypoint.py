import hashlib
import http.client
import json
import os
import socket
import ssl
import subprocess
import sys
import tempfile
import time
import unittest
import secrets
from datetime import datetime, timedelta
from pathlib import Path

from cryptography import x509
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.x509.oid import ExtendedKeyUsageOID, NameOID
from sqlalchemy import create_engine


def _certificate(name, key, issuer, issuer_key, *, ca=False, server=False, client=False):
    now = datetime.utcnow()
    builder = (x509.CertificateBuilder()
        .subject_name(x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, name)]))
        .issuer_name(issuer).public_key(key.public_key())
        .serial_number(x509.random_serial_number())
        .not_valid_before(now - timedelta(minutes=1))
        .not_valid_after(now + timedelta(hours=1))
        .add_extension(x509.BasicConstraints(ca=ca, path_length=None), critical=True))
    if server:
        builder = builder.add_extension(x509.SubjectAlternativeName([
            x509.DNSName("localhost"), x509.IPAddress(__import__("ipaddress").ip_address("127.0.0.1"))
        ]), critical=False).add_extension(x509.ExtendedKeyUsage([ExtendedKeyUsageOID.SERVER_AUTH]), critical=False)
    if client:
        builder = builder.add_extension(x509.ExtendedKeyUsage([ExtendedKeyUsageOID.CLIENT_AUTH]), critical=False)
    return builder.sign(issuer_key, hashes.SHA256())


def _write_pair(root, name, cert, key):
    (root / f"{name}.crt").write_bytes(cert.public_bytes(serialization.Encoding.PEM))
    (root / f"{name}.key").write_bytes(key.private_bytes(serialization.Encoding.PEM, serialization.PrivateFormat.TraditionalOpenSSL, serialization.NoEncryption()))


class IsolatedMtlsEntrypointTests(unittest.TestCase):
    def test_entrypoint_real_bind_installation(self):
        from sqlalchemy.orm import sessionmaker
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
        from models.model_registry import import_all_models
        from security.hash import hash_password
        from services.signature_authorization_service import TrustedInstallationIdentity, issue_authorization
        from services.installation_identity_registry import PersistentInstallationIdentityRegistry
        from local_bridge.security.reservation_challenge_client import ReservationChallengeConfig, ReservationChallengeForwarder
        from local_bridge.security.online_authorization_client import OnlineAuthorizationConfig, OnlineAuthorizationConsumer, OnlineAuthorizationError
        with tempfile.TemporaryDirectory(prefix="brana-entrypoint-bind-") as tmp:
            root = Path(tmp); ca_key = rsa.generate_private_key(public_exponent=65537, key_size=2048); ca_name = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, "bind-ca")]); ca = _certificate("bind-ca", ca_key, ca_name, ca_key, ca=True)
            server_key = rsa.generate_private_key(public_exponent=65537, key_size=2048); server = _certificate("localhost", server_key, ca.subject, ca_key, server=True)
            client_key = rsa.generate_private_key(public_exponent=65537, key_size=2048); client = _certificate("installation", client_key, ca.subject, ca_key, client=True)
            rotated_client_key = rsa.generate_private_key(public_exponent=65537, key_size=2048); rotated_client = _certificate("installation-rotated", rotated_client_key, ca.subject, ca_key, client=True)
            _write_pair(root, "server", server, server_key); _write_pair(root, "client", client, client_key); _write_pair(root, "client-rotated", rotated_client, rotated_client_key); (root / "ca.crt").write_bytes(ca.public_bytes(serialization.Encoding.PEM))
            mTLS_hash = hashlib.sha256(client.public_bytes(serialization.Encoding.DER)).hexdigest(); rotated_mTLS_hash = hashlib.sha256(rotated_client.public_bytes(serialization.Encoding.DER)).hexdigest(); signing_hash = "a" * 64
            from models.bridge_installation import BridgeInstallation
            db_url = os.environ.get("BRANA_TEST_POSTGRES_URL") or f"sqlite:///{(root / 'bind.sqlite').as_posix()}"; os.environ["DATABASE_URL"] = db_url
            import_all_models(); engine = create_engine(db_url); Base.metadata.create_all(engine)
            db = sessionmaker(bind=engine)(); clinic = Clinica(nome="bind", email="bind@test", trial_ate=datetime.utcnow()); db.add(clinic); db.flush(); clinic_id = clinic.id; user = Usuario(nome="bind-user", email="bind-user@test", senha_hash=hash_password("test-password"), clinica_id=clinic_id, ativo=True, setup_completed=True, is_admin=False); db.add(user); db.flush(); user_id = user.id; db.add(BridgeInstallation(installation_id="install-bind", certificate_der_sha256=mTLS_hash, status="ACTIVE", generation=1)); db.add(UsuarioCertificado(clinica_id=clinic_id, titular_user_id=user.id, criado_por_user_id=user.id, certificado_der_sha256=signing_hash, status="ACTIVE")); request_id = secrets.token_urlsafe(18); challenge = secrets.token_urlsafe(24); operation_id = secrets.token_urlsafe(16); db.add(SignatureReservationRequest(request_id=request_id, challenge_hash=hashlib.sha256(challenge.encode()).hexdigest(), status="PENDING", clinica_id=clinic_id, user_id=user.id, operation_id=operation_id, prepared_pdf_sha256="b" * 64, certificado_der_sha256=signing_hash, field_name="BranaSignature_1", policy_oid="2.16.76.1.7.1.11.1.3", expires_at=datetime.utcnow() + timedelta(minutes=5))); db.commit(); db.close(); engine.dispose()
            port_probe = socket.socket(); port_probe.bind(("127.0.0.1", 0)); port = port_probe.getsockname()[1]; port_probe.close(); anycorn_python = os.environ.get("ANYCORN_PYTHON") or sys.executable; site = os.environ.get("BRANA_TEST_ANYCORN_SITE") or str(Path(anycorn_python).parent.parent / "Lib" / "site-packages")
            config_path = root / "mtls-service.json"
            config_path.write_text(json.dumps({"database_url": db_url, "ca_cert": str(root / "ca.crt"), "server_cert": str(root / "server.crt"), "server_key": str(root / "server.key"), "bind": f"127.0.0.1:{port}"}), encoding="utf-8")
            if os.name == "nt":
                subprocess.run(["icacls.exe", str(config_path), "/inheritance:r", "/grant:r", f"{os.environ.get('USERDOMAIN', '')}\\{os.environ.get('USERNAME', '')}:F"], check=True, capture_output=True, text=True, timeout=5)
            child_env = os.environ.copy(); child_env.pop("BRANA_MTLS_DATABASE_URL", None); child_env.pop("BRANA_MTLS_CA_CERT", None); child_env.pop("BRANA_MTLS_SERVER_CERT", None); child_env.pop("BRANA_MTLS_SERVER_KEY", None); child_env.pop("BRANA_MTLS_BIND", None); child_env.update({"BRANA_MTLS_CONFIG_FILE": str(config_path), "PYTHONPATH": os.pathsep.join([str(Path(__file__).resolve().parents[2] / "backend"), site])})
            process = subprocess.Popen([anycorn_python, str(Path(__file__).resolve().parents[1] / "isolated_mtls_service.py")], cwd=str(Path(__file__).resolve().parents[2]), env=child_env, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
            failure = None
            child_stderr = ""
            child_stdout = ""
            try:
                deadline = time.time() + 15
                while time.time() < deadline:
                    if process.poll() is not None: self.fail(process.stderr.read())
                    try:
                        with socket.create_connection(("127.0.0.1", port), timeout=.2): break
                    except OSError: time.sleep(.1)
                else: self.fail("ENTRYPOINT_BIND_PORT_TIMEOUT")
                forwarder = ReservationChallengeForwarder(ReservationChallengeConfig(f"https://127.0.0.1:{port}/signature-reservation-requests/bind-installation", str(root / "ca.crt"), str(root / "client.crt"), str(root / "client.key")))
                try:
                    result = forwarder.forward(request_id=request_id, challenge=challenge, operation_id=operation_id, prepared_pdf_sha256="b" * 64, certificado_der_sha256=signing_hash)
                except Exception as exc:
                    failure = exc
                if failure is None:
                    self.assertEqual(result["status"], "RESERVED")
                    check_engine = create_engine(db_url)
                    check = sessionmaker(bind=check_engine)()
                    row = check.query(SignatureReservationRequest).filter_by(request_id=request_id).one()
                    auth = check.query(SignatureAuthorization).filter_by(authorization_id=row.authorization_id).one()
                    self.assertEqual(row.status, "RESERVED")
                    self.assertEqual(auth.status, "RESERVED")
                    self.assertEqual(row.installation_id, "install-bind")
                    self.assertNotEqual(row.certificado_der_sha256, mTLS_hash)
                    issued = issue_authorization(
                        check, actor=check.query(Usuario).filter_by(id=user_id).one(), senha="test-password",
                        installation=TrustedInstallationIdentity("install-bind", authenticated=True),
                        authorization_id=auth.authorization_id, operation_id=operation_id,
                        prepared_pdf_sha256="b" * 64, certificado_der_sha256=signing_hash,
                        field_name="BranaSignature_1", policy_oid="2.16.76.1.7.1.11.1.3",
                    )
                    check.commit()
                    self.assertEqual(issued.status, "ISSUED")
                    consumer = OnlineAuthorizationConsumer(OnlineAuthorizationConfig(
                        f"https://127.0.0.1:{port}/v1/signature-authorizations/consume",
                        str(root / "ca.crt"), str(root / "client.crt"), str(root / "client.key"),
                    ))
                    self.assertEqual(consumer.consume(
                        authorization_id=auth.authorization_id, operation_id=operation_id,
                        prepared_pdf_sha256="b" * 64, certificate_der_sha256=signing_hash,
                        field_name="BranaSignature_1", policy_oid="2.16.76.1.7.1.11.1.3",
                    ), "CONSUMED")
                    check.expire_on_commit = False
                    check.refresh(auth)
                    self.assertEqual(auth.status, "CONSUMED")
                    with self.assertRaises(OnlineAuthorizationError) as second:
                        consumer.consume(
                            authorization_id=auth.authorization_id, operation_id=operation_id,
                            prepared_pdf_sha256="b" * 64, certificate_der_sha256=signing_hash,
                            field_name="BranaSignature_1", policy_oid="2.16.76.1.7.1.11.1.3",
                        )
                    self.assertEqual(second.exception.code, "ONLINE_AUTHORIZATION_REJECTED")
                    check.refresh(auth)
                    self.assertEqual(auth.status, "CONSUMED")
                    registry = PersistentInstallationIdentityRegistry(sessionmaker(bind=check_engine))
                    registry.rotate("install-bind", rotated_mTLS_hash)
                    rotation_generation_check = sessionmaker(bind=check_engine)()
                    self.assertEqual(rotation_generation_check.query(BridgeInstallation).filter_by(installation_id="install-bind").one().generation, 2)
                    rotation_generation_check.close()

                    old_request_id = secrets.token_urlsafe(18)
                    old_challenge = secrets.token_urlsafe(24)
                    old_operation_id = secrets.token_urlsafe(16)
                    new_request_id = secrets.token_urlsafe(18)
                    new_challenge = secrets.token_urlsafe(24)
                    new_operation_id = secrets.token_urlsafe(16)
                    rotation_seed = sessionmaker(bind=check_engine)()
                    for rotation_request_id, rotation_challenge, rotation_operation_id in (
                        (old_request_id, old_challenge, old_operation_id),
                        (new_request_id, new_challenge, new_operation_id),
                    ):
                        rotation_seed.add(SignatureReservationRequest(
                            request_id=rotation_request_id,
                            challenge_hash=hashlib.sha256(rotation_challenge.encode()).hexdigest(),
                            status="PENDING",
                            clinica_id=clinic_id,
                            user_id=user_id,
                            operation_id=rotation_operation_id,
                            prepared_pdf_sha256="b" * 64,
                            certificado_der_sha256=signing_hash,
                            field_name="BranaSignature_1",
                            policy_oid="2.16.76.1.7.1.11.1.3",
                            expires_at=datetime.utcnow() + timedelta(minutes=5),
                        ))
                    rotation_seed.commit()
                    rotation_seed.close()

                    with self.assertRaises(Exception) as old_rotation_failure:
                        forwarder.forward(
                            request_id=old_request_id,
                            challenge=old_challenge,
                            operation_id=old_operation_id,
                            prepared_pdf_sha256="b" * 64,
                            certificado_der_sha256=signing_hash,
                        )
                    self.assertIn(
                        getattr(old_rotation_failure.exception, "remote_code", ""),
                        {"INSTALLATION_NOT_AUTHORIZED", "INSTALLATION_REVOKED", "RESERVATION_FORWARD_REJECTED"},
                    )

                    rotated_forwarder = ReservationChallengeForwarder(ReservationChallengeConfig(
                        f"https://127.0.0.1:{port}/signature-reservation-requests/bind-installation",
                        str(root / "ca.crt"), str(root / "client-rotated.crt"), str(root / "client-rotated.key"),
                    ))
                    rotated_result = rotated_forwarder.forward(
                        request_id=new_request_id,
                        challenge=new_challenge,
                        operation_id=new_operation_id,
                        prepared_pdf_sha256="b" * 64,
                        certificado_der_sha256=signing_hash,
                    )
                    self.assertEqual(rotated_result["status"], "RESERVED")
                    rotation_check = sessionmaker(bind=check_engine)()
                    rotated_installation = rotation_check.query(BridgeInstallation).filter_by(installation_id="install-bind").one()
                    old_row = rotation_check.query(SignatureReservationRequest).filter_by(request_id=old_request_id).one()
                    new_row = rotation_check.query(SignatureReservationRequest).filter_by(request_id=new_request_id).one()
                    new_authorizations = rotation_check.query(SignatureAuthorization).filter_by(operation_id=new_operation_id).count()
                    self.assertEqual(old_row.status, "PENDING")
                    self.assertEqual(new_row.status, "RESERVED")
                    self.assertEqual(new_authorizations, 1)
                    self.assertEqual(rotated_installation.certificate_der_sha256, rotated_mTLS_hash)
                    self.assertEqual(rotated_installation.generation, 2)
                    rotation_check.close()

                    revoke = sessionmaker(bind=check_engine)()
                    installation = revoke.query(BridgeInstallation).filter_by(installation_id="install-bind").one()
                    installation.status = "REVOKED"
                    revoke.commit()
                    revoke.close()

                    revoked_request_id = secrets.token_urlsafe(18)
                    revoked_challenge = secrets.token_urlsafe(24)
                    revoked_operation_id = secrets.token_urlsafe(16)
                    seed = sessionmaker(bind=check_engine)()
                    seed.add(SignatureReservationRequest(
                        request_id=revoked_request_id,
                        challenge_hash=hashlib.sha256(revoked_challenge.encode()).hexdigest(),
                        status="PENDING",
                        clinica_id=clinic_id,
                        user_id=user_id,
                        operation_id=revoked_operation_id,
                        prepared_pdf_sha256="b" * 64,
                        certificado_der_sha256=signing_hash,
                        field_name="BranaSignature_1",
                        policy_oid="2.16.76.1.7.1.11.1.3",
                        expires_at=datetime.utcnow() + timedelta(minutes=5),
                    ))
                    seed.commit()
                    seed.close()

                    with self.assertRaises(Exception) as revoked_failure:
                        forwarder.forward(
                            request_id=revoked_request_id,
                            challenge=revoked_challenge,
                            operation_id=revoked_operation_id,
                            prepared_pdf_sha256="b" * 64,
                            certificado_der_sha256=signing_hash,
                        )
                    self.assertIn(
                        getattr(revoked_failure.exception, "remote_code", ""),
                        {"INSTALLATION_REJECTED", "INSTALLATION_REVOKED", "INSTALLATION_NOT_AUTHORIZED", "RESERVATION_FORWARD_REJECTED"},
                    )

                    revoked_check = sessionmaker(bind=check_engine)()
                    revoked_installation = revoked_check.query(BridgeInstallation).filter_by(installation_id="install-bind").one()
                    revoked_row = revoked_check.query(SignatureReservationRequest).filter_by(request_id=revoked_request_id).one()
                    revoked_authorizations = revoked_check.query(SignatureAuthorization).filter_by(operation_id=revoked_operation_id).count()
                    self.assertEqual(revoked_installation.status, "REVOKED")
                    self.assertEqual(revoked_row.status, "PENDING")
                    self.assertEqual(revoked_authorizations, 0)
                    revoked_check.close()
                    check.close(); check_engine.dispose()
            finally:
                process.terminate()
                try: process.wait(timeout=8)
                except subprocess.TimeoutExpired: process.kill(); process.wait(timeout=5)
                if process.stdout:
                    child_stdout = process.stdout.read()
                    process.stdout.close()
                if process.stderr:
                    child_stderr = process.stderr.read()
                    process.stderr.close()
                from database import engine as imported_engine
                imported_engine.dispose()
            if failure is not None:
                self.fail(
                    f"FIRST_FAILURE_STATUS={getattr(failure, 'status_code', 'unknown')} "
                    f"FIRST_FAILURE_CODE={getattr(failure, 'remote_code', getattr(failure, 'code', str(failure)))} "
                    f"FIRST_FAILURE_BODY={getattr(failure, 'remote_body', '')} "
                    f"CHILD_STDERR={child_stderr[-6000:]} CHILD_STDOUT={child_stdout[-2000:]}"
                )

    def test_entrypoint_real_spoofed_installation_is_rejected(self):
        import httpx
        from sqlalchemy.orm import sessionmaker
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
        from models.model_registry import import_all_models
        from security.hash import hash_password
        from models.bridge_installation import BridgeInstallation

        with tempfile.TemporaryDirectory(prefix="brana-entrypoint-spoof-") as tmp:
            root = Path(tmp)
            ca_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
            ca_name = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, "spoof-ca")])
            ca = _certificate("spoof-ca", ca_key, ca_name, ca_key, ca=True)
            server_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
            server = _certificate("localhost", server_key, ca.subject, ca_key, server=True)
            registered_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
            registered = _certificate("registered", registered_key, ca.subject, ca_key, client=True)
            unknown_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
            unknown = _certificate("unknown", unknown_key, ca.subject, ca_key, client=True)
            _write_pair(root, "server", server, server_key)
            _write_pair(root, "registered", registered, registered_key)
            _write_pair(root, "unknown", unknown, unknown_key)
            (root / "ca.crt").write_bytes(ca.public_bytes(serialization.Encoding.PEM))
            registered_hash = hashlib.sha256(registered.public_bytes(serialization.Encoding.DER)).hexdigest()
            unknown_hash = hashlib.sha256(unknown.public_bytes(serialization.Encoding.DER)).hexdigest()
            signing_hash = "c" * 64
            db_url = os.environ.get("BRANA_TEST_POSTGRES_URL") or f"sqlite:///{(root / 'spoof.sqlite').as_posix()}"
            os.environ["DATABASE_URL"] = db_url
            import_all_models()
            engine = create_engine(db_url)
            Base.metadata.create_all(engine)
            db = sessionmaker(bind=engine)()
            clinic = Clinica(nome="spoof", email=f"spoof-{secrets.token_urlsafe(8)}@test", trial_ate=datetime.utcnow())
            db.add(clinic)
            db.flush()
            clinic_id = clinic.id
            user = Usuario(nome="spoof-user", email=f"spoof-user-{secrets.token_urlsafe(8)}@test", senha_hash=hash_password("test-password"), clinica_id=clinic_id, ativo=True, setup_completed=True, is_admin=False)
            db.add(user)
            db.flush()
            user_id = user.id
            db.add(BridgeInstallation(installation_id="install-spoof", certificate_der_sha256=registered_hash, status="ACTIVE", generation=1))
            db.add(UsuarioCertificado(clinica_id=clinic_id, titular_user_id=user_id, criado_por_user_id=user_id, certificado_der_sha256=signing_hash, status="ACTIVE"))
            forged_request_id = secrets.token_urlsafe(18)
            forged_challenge = secrets.token_urlsafe(24)
            forged_operation_id = secrets.token_urlsafe(16)
            no_cert_request_id = secrets.token_urlsafe(18)
            no_cert_challenge = secrets.token_urlsafe(24)
            no_cert_operation_id = secrets.token_urlsafe(16)
            for request_id, challenge, operation_id in (
                (forged_request_id, forged_challenge, forged_operation_id),
                (no_cert_request_id, no_cert_challenge, no_cert_operation_id),
            ):
                db.add(SignatureReservationRequest(
                    request_id=request_id,
                    challenge_hash=hashlib.sha256(challenge.encode()).hexdigest(),
                    status="PENDING",
                    clinica_id=clinic_id,
                    user_id=user_id,
                    operation_id=operation_id,
                    prepared_pdf_sha256="d" * 64,
                    certificado_der_sha256=signing_hash,
                    field_name="BranaSignature_1",
                    policy_oid="2.16.76.1.7.1.11.1.3",
                    expires_at=datetime.utcnow() + timedelta(minutes=5),
                ))
            db.commit()
            db.close()
            engine.dispose()

            port_probe = socket.socket()
            port_probe.bind(("127.0.0.1", 0))
            port = port_probe.getsockname()[1]
            port_probe.close()
            anycorn_python = os.environ.get("ANYCORN_PYTHON") or sys.executable
            site = os.environ.get("BRANA_TEST_ANYCORN_SITE") or str(Path(anycorn_python).parent.parent / "Lib" / "site-packages")
            child_env = os.environ.copy()
            child_env.update({
                "BRANA_MTLS_DATABASE_URL": db_url,
                "BRANA_MTLS_CA_CERT": str(root / "ca.crt"),
                "BRANA_MTLS_SERVER_CERT": str(root / "server.crt"),
                "BRANA_MTLS_SERVER_KEY": str(root / "server.key"),
                "BRANA_MTLS_BIND": f"127.0.0.1:{port}",
                "PYTHONPATH": os.pathsep.join([str(Path(__file__).resolve().parents[2] / "backend"), site]),
            })
            process = subprocess.Popen([sys.executable, str(Path(__file__).resolve().parents[1] / "isolated_mtls_service.py")], cwd=str(Path(__file__).resolve().parents[2]), env=child_env, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
            check_engine = None
            try:
                deadline = time.time() + 15
                while time.time() < deadline:
                    if process.poll() is not None:
                        self.fail("ENTRYPOINT_EXITED_EARLY")
                    try:
                        with socket.create_connection(("127.0.0.1", port), timeout=.2):
                            break
                    except OSError:
                        time.sleep(.1)
                else:
                    self.fail("ENTRYPOINT_BIND_PORT_TIMEOUT")

                tls = ssl.create_default_context(cafile=str(root / "ca.crt"))
                tls.load_cert_chain(str(root / "unknown.crt"), str(root / "unknown.key"))
                tls.check_hostname = False
                payload = {
                    "request_id": forged_request_id,
                    "challenge": forged_challenge,
                    "operation_id": forged_operation_id,
                    "prepared_pdf_sha256": "d" * 64,
                    "certificado_der_sha256": signing_hash,
                    "field_name": "BranaSignature_1",
                    "policy_oid": "2.16.76.1.7.1.11.1.3",
                    "certificate_source": "WINDOWS_STORE",
                }
                with httpx.Client(verify=tls, timeout=5, trust_env=False) as client:
                    response = client.post(
                        f"https://127.0.0.1:{port}/signature-reservation-requests/bind-installation",
                        json=payload,
                        headers={"X-Client-Cert": registered_hash, "X-Installation-Id": "install-spoof"},
                    )
                self.assertNotEqual(response.status_code, 200)
                self.assertIn(response.status_code, {401, 403, 409})

                no_cert_tls = ssl.create_default_context(cafile=str(root / "ca.crt"))
                no_cert_tls.check_hostname = False
                with self.assertRaises((ssl.SSLError, httpx.TransportError, OSError)):
                    with httpx.Client(verify=no_cert_tls, timeout=5, trust_env=False) as client:
                        client.post(
                            f"https://127.0.0.1:{port}/signature-reservation-requests/bind-installation",
                            json={**payload, "request_id": no_cert_request_id, "challenge": no_cert_challenge, "operation_id": no_cert_operation_id},
                            headers={"X-Client-Cert": registered_hash, "X-Installation-Id": "install-spoof"},
                        )

                check_engine = create_engine(db_url)
                check = sessionmaker(bind=check_engine)()
                forged_row = check.query(SignatureReservationRequest).filter_by(request_id=forged_request_id).one()
                no_cert_row = check.query(SignatureReservationRequest).filter_by(request_id=no_cert_request_id).one()
                self.assertEqual(forged_row.status, "PENDING")
                self.assertEqual(no_cert_row.status, "PENDING")
                self.assertEqual(check.query(SignatureAuthorization).filter_by(operation_id=forged_operation_id).count(), 0)
                self.assertEqual(check.query(SignatureAuthorization).filter_by(operation_id=no_cert_operation_id).count(), 0)
                self.assertNotEqual(unknown_hash, registered_hash)
                check.close()
            finally:
                process.terminate()
                try:
                    process.wait(timeout=8)
                except subprocess.TimeoutExpired:
                    process.kill()
                    process.wait(timeout=5)
                if check_engine is not None:
                    check_engine.dispose()
                if process.stdout:
                    process.stdout.close()
                if process.stderr:
                    process.stderr.close()
                from database import engine as imported_engine
                imported_engine.dispose()

    def test_entrypoint_real_concurrent_consume_is_one_shot(self):
        from concurrent.futures import ThreadPoolExecutor
        from sqlalchemy.orm import sessionmaker
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
        from models.model_registry import import_all_models
        from security.hash import hash_password
        from services.signature_authorization_service import TrustedInstallationIdentity, issue_authorization
        from local_bridge.security.reservation_challenge_client import ReservationChallengeConfig, ReservationChallengeForwarder
        from local_bridge.security.online_authorization_client import OnlineAuthorizationConfig, OnlineAuthorizationConsumer, OnlineAuthorizationError
        from models.bridge_installation import BridgeInstallation

        with tempfile.TemporaryDirectory(prefix="brana-entrypoint-concurrent-") as tmp:
            root = Path(tmp)
            ca_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
            ca_name = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, "concurrent-ca")])
            ca = _certificate("concurrent-ca", ca_key, ca_name, ca_key, ca=True)
            server_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
            server = _certificate("localhost", server_key, ca.subject, ca_key, server=True)
            client_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
            client = _certificate("concurrent-installation", client_key, ca.subject, ca_key, client=True)
            _write_pair(root, "server", server, server_key)
            _write_pair(root, "client", client, client_key)
            (root / "ca.crt").write_bytes(ca.public_bytes(serialization.Encoding.PEM))
            mtls_hash = hashlib.sha256(client.public_bytes(serialization.Encoding.DER)).hexdigest()
            signing_hash = "e" * 64
            db_url = os.environ.get("BRANA_TEST_POSTGRES_URL") or f"sqlite:///{(root / 'concurrent.sqlite').as_posix()}"
            os.environ["DATABASE_URL"] = db_url
            import_all_models()
            engine = create_engine(db_url)
            Base.metadata.create_all(engine)
            db = sessionmaker(bind=engine)()
            clinic = Clinica(nome="concurrent", email=f"concurrent-{secrets.token_urlsafe(8)}@test", trial_ate=datetime.utcnow())
            db.add(clinic)
            db.flush()
            clinic_id = clinic.id
            user = Usuario(nome="concurrent-user", email=f"concurrent-user-{secrets.token_urlsafe(8)}@test", senha_hash=hash_password("test-password"), clinica_id=clinic_id, ativo=True, setup_completed=True, is_admin=False)
            db.add(user)
            db.flush()
            user_id = user.id
            db.add(BridgeInstallation(installation_id="install-concurrent", certificate_der_sha256=mtls_hash, status="ACTIVE", generation=1))
            db.add(UsuarioCertificado(clinica_id=clinic_id, titular_user_id=user_id, criado_por_user_id=user_id, certificado_der_sha256=signing_hash, status="ACTIVE"))
            request_id = secrets.token_urlsafe(18)
            challenge = secrets.token_urlsafe(24)
            operation_id = secrets.token_urlsafe(16)
            db.add(SignatureReservationRequest(
                request_id=request_id,
                challenge_hash=hashlib.sha256(challenge.encode()).hexdigest(),
                status="PENDING",
                clinica_id=clinic_id,
                user_id=user_id,
                operation_id=operation_id,
                prepared_pdf_sha256="f" * 64,
                certificado_der_sha256=signing_hash,
                field_name="BranaSignature_1",
                policy_oid="2.16.76.1.7.1.11.1.3",
                expires_at=datetime.utcnow() + timedelta(minutes=5),
            ))
            db.commit()
            db.close()
            engine.dispose()

            port_probe = socket.socket()
            port_probe.bind(("127.0.0.1", 0))
            port = port_probe.getsockname()[1]
            port_probe.close()
            anycorn_python = os.environ.get("ANYCORN_PYTHON") or sys.executable
            site = os.environ.get("BRANA_TEST_ANYCORN_SITE") or str(Path(anycorn_python).parent.parent / "Lib" / "site-packages")
            child_env = os.environ.copy()
            child_env.update({
                "BRANA_MTLS_DATABASE_URL": db_url,
                "BRANA_MTLS_CA_CERT": str(root / "ca.crt"),
                "BRANA_MTLS_SERVER_CERT": str(root / "server.crt"),
                "BRANA_MTLS_SERVER_KEY": str(root / "server.key"),
                "BRANA_MTLS_BIND": f"127.0.0.1:{port}",
                "PYTHONPATH": os.pathsep.join([str(Path(__file__).resolve().parents[2] / "backend"), site]),
            })
            process = subprocess.Popen([sys.executable, str(Path(__file__).resolve().parents[1] / "isolated_mtls_service.py")], cwd=str(Path(__file__).resolve().parents[2]), env=child_env, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
            check_engine = None
            try:
                deadline = time.time() + 15
                while time.time() < deadline:
                    if process.poll() is not None:
                        self.fail("ENTRYPOINT_EXITED_EARLY")
                    try:
                        with socket.create_connection(("127.0.0.1", port), timeout=.2):
                            break
                    except OSError:
                        time.sleep(.1)
                else:
                    self.fail("ENTRYPOINT_BIND_PORT_TIMEOUT")

                forwarder = ReservationChallengeForwarder(ReservationChallengeConfig(
                    f"https://127.0.0.1:{port}/signature-reservation-requests/bind-installation",
                    str(root / "ca.crt"), str(root / "client.crt"), str(root / "client.key"),
                ))
                reserved = forwarder.forward(
                    request_id=request_id,
                    challenge=challenge,
                    operation_id=operation_id,
                    prepared_pdf_sha256="f" * 64,
                    certificado_der_sha256=signing_hash,
                )
                self.assertEqual(reserved["status"], "RESERVED")
                check_engine = create_engine(db_url)
                issue_db = sessionmaker(bind=check_engine)()
                auth = issue_db.query(SignatureAuthorization).filter_by(authorization_id=reserved["authorization_id"]).one()
                issued = issue_authorization(
                    issue_db,
                    actor=issue_db.query(Usuario).filter_by(id=user_id).one(),
                    senha="test-password",
                    installation=TrustedInstallationIdentity("install-concurrent", authenticated=True),
                    authorization_id=auth.authorization_id,
                    operation_id=operation_id,
                    prepared_pdf_sha256="f" * 64,
                    certificado_der_sha256=signing_hash,
                    field_name="BranaSignature_1",
                    policy_oid="2.16.76.1.7.1.11.1.3",
                )
                issue_db.commit()
                authorization_id = issued.authorization_id
                issue_db.close()

                config = OnlineAuthorizationConfig(
                    f"https://127.0.0.1:{port}/v1/signature-authorizations/consume",
                    str(root / "ca.crt"), str(root / "client.crt"), str(root / "client.key"),
                )

                def consume_once():
                    consumer = OnlineAuthorizationConsumer(config)
                    try:
                        return ("OK", consumer.consume(
                            authorization_id=authorization_id,
                            operation_id=operation_id,
                            prepared_pdf_sha256="f" * 64,
                            certificate_der_sha256=signing_hash,
                            field_name="BranaSignature_1",
                            policy_oid="2.16.76.1.7.1.11.1.3",
                        ))
                    except OnlineAuthorizationError as exc:
                        return ("ERROR", getattr(exc, "http_status", None), getattr(exc, "remote_code", exc.code))

                with ThreadPoolExecutor(max_workers=2) as pool:
                    outcomes = list(pool.map(lambda _: consume_once(), (1, 2)))
                self.assertEqual(sum(outcome[0] == "OK" for outcome in outcomes), 1, outcomes)
                self.assertEqual(sum(outcome[0] == "ERROR" for outcome in outcomes), 1, outcomes)
                rejected = next(outcome for outcome in outcomes if outcome[0] == "ERROR")
                self.assertEqual(rejected[1], 409)
                self.assertIn(rejected[2], {"AUTHORIZATION_NOT_CONSUMABLE", "ONLINE_AUTHORIZATION_REJECTED", "AUTHORIZATION_ALREADY_CONSUMED"})

                verify = sessionmaker(bind=check_engine)()
                row = verify.query(SignatureAuthorization).filter_by(authorization_id=authorization_id).one()
                reservation = verify.query(SignatureReservationRequest).filter_by(request_id=request_id).one()
                self.assertEqual(row.status, "CONSUMED")
                self.assertEqual(verify.query(SignatureAuthorization).filter_by(operation_id=operation_id).count(), 1)
                self.assertEqual(row.operation_id, operation_id)
                self.assertEqual(row.prepared_pdf_sha256, "f" * 64)
                self.assertEqual(row.certificado_der_sha256, signing_hash)
                self.assertEqual(row.certificate_source, "WINDOWS_STORE")
                self.assertEqual(reservation.installation_id, "install-concurrent")
                verify.close()
            finally:
                process.terminate()
                try:
                    process.wait(timeout=8)
                except subprocess.TimeoutExpired:
                    process.kill()
                    process.wait(timeout=5)
                if check_engine is not None:
                    check_engine.dispose()
                if process.stdout:
                    process.stdout.close()
                if process.stderr:
                    process.stderr.close()
                from database import engine as imported_engine
                imported_engine.dispose()
    def test_entrypoint_process_requires_client_tls(self):
        with tempfile.TemporaryDirectory(prefix="brana-entrypoint-test-") as tmp:
            root = Path(tmp)
            ca_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
            ca_name = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, "test-ca")])
            ca = _certificate("test-ca", ca_key, ca_name, ca_key, ca=True)
            server_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
            server = _certificate("localhost", server_key, ca.subject, ca_key, server=True)
            client_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
            client = _certificate("test-installation", client_key, ca.subject, ca_key, client=True)
            _write_pair(root, "server", server, server_key); _write_pair(root, "client", client, client_key)
            (root / "ca.crt").write_bytes(ca.public_bytes(serialization.Encoding.PEM))
            client_hash = hashlib.sha256(client.public_bytes(serialization.Encoding.DER)).hexdigest()
            (root / "registry.json").write_text(json.dumps([{
                "installation_id": "test-installation",
                "certificate_der_sha256": client_hash,
                "status": "ACTIVE",
            }]), encoding="utf-8")
            db_path = root / "entrypoint.sqlite"
            db_url = f"sqlite:///{db_path.as_posix()}"
            os.environ["DATABASE_URL"] = db_url
            os.environ["PYTHONPATH"] = str(Path(__file__).resolve().parents[2] / "backend")
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
            engine = create_engine(db_url)
            Base.metadata.create_all(engine, tables=[Clinica.__table__, PrestadorOdonto.__table__, UnidadeAtendimento.__table__, Lancamento.__table__, ConvenioOdonto.__table__, ProcedimentoGenerico.__table__, Material.__table__, Usuario.__table__, UsuarioCertificado.__table__, SignatureAuthorization.__table__, SignatureReservationRequest.__table__])
            engine.dispose()
            port_probe = socket.socket(); port_probe.bind(("127.0.0.1", 0)); port = port_probe.getsockname()[1]; port_probe.close()
            child_env = os.environ.copy()
            anycorn_python = os.environ.get("ANYCORN_PYTHON") or sys.executable
            anycorn_site = str(Path(anycorn_python).parent.parent / "Lib" / "site-packages")
            child_env.update({
                "BRANA_MTLS_DATABASE_URL": db_url,
                "BRANA_MTLS_CA_CERT": str(root / "ca.crt"),
                "BRANA_MTLS_SERVER_CERT": str(root / "server.crt"),
                "BRANA_MTLS_SERVER_KEY": str(root / "server.key"),
                "BRANA_MTLS_REGISTRY_JSON": str(root / "registry.json"),
                "BRANA_MTLS_BIND": f"127.0.0.1:{port}",
                "PYTHONPATH": os.pathsep.join([str(Path(__file__).resolve().parents[2] / "backend"), anycorn_site]),
            })
            process = subprocess.Popen([sys.executable, str(Path(__file__).resolve().parents[1] / "isolated_mtls_service.py")], cwd=str(Path(__file__).resolve().parents[2]), env=child_env, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
            no_client_rejected = False
            try:
                deadline = time.time() + 15
                while time.time() < deadline:
                    if process.poll() is not None:
                        self.fail(f"entrypoint exited early: {process.stderr.read()}")
                    try:
                        with socket.create_connection(("127.0.0.1", port), timeout=.2):
                            break
                    except OSError:
                        time.sleep(.1)
                else:
                    self.fail("ENTRYPOINT_PORT_TIMEOUT")
                trusted = ssl.create_default_context(cafile=str(root / "ca.crt"))
                trusted.load_cert_chain(str(root / "client.crt"), str(root / "client.key"))
                trusted.check_hostname = False
                valid_conn = http.client.HTTPSConnection("127.0.0.1", port, context=trusted, timeout=3)
                valid_conn.request("POST", "/v1/signature-authorizations/consume", body=b"{}", headers={"Content-Type": "application/json"})
                valid_response = valid_conn.getresponse(); valid_response.read(); valid_conn.close()
                self.assertIn(valid_response.status, {403, 404, 422})
                no_client = ssl.create_default_context(cafile=str(root / "ca.crt")); no_client.check_hostname = False
                try:
                    no_client_conn = http.client.HTTPSConnection("127.0.0.1", port, context=no_client, timeout=3)
                    no_client_conn.request("POST", "/v1/signature-authorizations/consume", body=b"{}", headers={"Content-Type": "application/json"})
                    response = no_client_conn.getresponse(); response.read(); no_client_conn.close()
                    no_client_rejected = False
                except (ssl.SSLError, OSError):
                    no_client_rejected = True
            finally:
                process.terminate()
                try:
                    process.wait(timeout=8)
                except subprocess.TimeoutExpired:
                    process.kill(); process.wait(timeout=5)
                self.assertIsNotNone(process.returncode)
                self.assertNotEqual(process.returncode, None)
                if process.stdout: process.stdout.close()
                if process.stderr: process.stderr.close()
            from database import engine as imported_engine
            imported_engine.dispose()
            self.assertTrue(no_client_rejected, "no-client TLS connection was not rejected")


if __name__ == "__main__":
    unittest.main()
