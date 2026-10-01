"""11D.1: disposable HTTPS /api reservation-confirmation harness only."""
import asyncio, base64, hashlib, ipaddress, json, os, shutil, socket, ssl, subprocess, sys, tempfile, time, unittest
from contextlib import asynccontextmanager, contextmanager, nullcontext
from datetime import datetime, timedelta
from pathlib import Path

import httpx
from fastapi import Depends, FastAPI, HTTPException, Request
from pydantic import BaseModel
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from cryptography import x509
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives.serialization import PublicFormat
from cryptography.x509.oid import NameOID, ExtendedKeyUsageOID

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
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
from security.hash import hash_password
from services.signature_authorization_service import TrustedInstallationIdentity, reserve_authorization, issue_authorization
from local_bridge.secure_bridge_app import create_secure_bridge_runtime
from local_bridge.launch_secure_bridge import build_runtime
from local_bridge.security.prepared_signer import FakePreparedPdfSigner
from local_bridge.security.ui import ApprovalDecision, PendingApprovalUI
from routes.signature_authorization_isolated_routes import create_signature_authorization_router
from routes.signature_reservation_challenge_routes import create_signature_reservation_challenge_router
from routes.signature_authorization_isolated_routes import tls_installation_dependency
from services.installation_identity_registry import InstallationIdentityRegistry
from services.editor_signature_anchor_service import prepare_signature_anchor
from local_bridge.security.online_authorization_client import OnlineAuthorizationConfig, OnlineAuthorizationConsumer, OnlineAuthorizationError
from local_bridge.security.reservation_challenge_client import ReservationChallengeConfig, ReservationChallengeForwarder
from local_bridge.security.protocol import b64url_encode, calculate_hmac, canonicalize_hmac_request, derive_session_key
import fitz


@contextmanager
def _test_only_file_source_policy(enabled):
    """Permit FILE_PKCS12 only inside this disposable harness, without rewriting data."""
    if not enabled:
        yield
        return
    import services.signature_authorization_service as authorization_service
    import services.signature_reservation_challenge_service as challenge_service
    original_authorization = authorization_service.validate_certificate_source
    original_challenge = challenge_service.validate_certificate_source

    def allow_file(source):
        normalized = str(source or '').strip().upper()
        if normalized == 'FILE_PKCS12':
            return normalized
        return original_authorization(source)

    authorization_service.validate_certificate_source = allow_file
    challenge_service.validate_certificate_source = allow_file
    try:
        yield
    finally:
        authorization_service.validate_certificate_source = original_authorization
        challenge_service.validate_certificate_source = original_challenge


class _BridgeApproval(PendingApprovalUI):
    def approve_pairing(self, request): return ApprovalDecision.APPROVED
    def approve_signature(self, operation): return ApprovalDecision.APPROVED


class _BridgeLock:
    def acquire(self): pass
    def release(self): pass


class _OrderedFakeSigner:
    def __init__(self, db, authorization_id, result=b'%PDF-1.7 synthetic-signed'):
        self.db = db; self.authorization_id = authorization_id; self.result = result; self.calls = 0; self.consumed_before_call = False
    def sign_prepared(self, request):
        self.calls += 1
        query = self.db.query(SignatureAuthorization)
        row = query.filter_by(authorization_id=self.authorization_id).one() if self.authorization_id else query.order_by(SignatureAuthorization.id.desc()).first()
        self.consumed_before_call = row.status == 'CONSUMED'
        return self.result


def _cert(name, key, issuer, issuer_key, *, ca=False, server=False, client=False):
    now = datetime.utcnow()
    b = x509.CertificateBuilder().subject_name(x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, name)])).issuer_name(issuer).public_key(key.public_key()).serial_number(x509.random_serial_number()).not_valid_before(now - timedelta(minutes=1)).not_valid_after(now + timedelta(minutes=1)).add_extension(x509.BasicConstraints(ca=ca, path_length=None), critical=True)
    if server:
        b = b.add_extension(x509.SubjectAlternativeName([x509.DNSName("localhost"), x509.IPAddress(ipaddress.ip_address("127.0.0.1"))]), critical=False).add_extension(x509.ExtendedKeyUsage([ExtendedKeyUsageOID.SERVER_AUTH]), critical=False)
    if client:
        b = b.add_extension(x509.ExtendedKeyUsage([ExtendedKeyUsageOID.CLIENT_AUTH]), critical=False)
    return b.sign(issuer_key, hashes.SHA256())


def _write(path, cert, key):
    path.with_suffix('.crt').write_bytes(cert.public_bytes(serialization.Encoding.PEM))
    path.with_suffix('.key').write_bytes(key.private_bytes(serialization.Encoding.PEM, serialization.PrivateFormat.PKCS8, serialization.NoEncryption()))


class _Payload(BaseModel):
    authorization_id: str | None = None
    password: str | None = None
    operation_id: str
    prepared_pdf_sha256: str
    certificado_der_sha256: str
    field_name: str
    policy_oid: str
    ttl_seconds: int = 120
    certificate_source: str = 'WINDOWS_STORE'


@asynccontextmanager
async def running_signature_api(anycorn_python, *, db=None, engine=None, test_only_allow_file_pkcs12=False):
    """Keep the disposable SQL/API/TLS server alive for the whole context."""
    source_policy = _test_only_file_source_policy(test_only_allow_file_pkcs12); source_policy.__enter__()
    sys.path.insert(0, str(Path(anycorn_python).parent.parent / 'Lib' / 'site-packages'))
    from anycorn import serve
    from anycorn.config import Config
    with tempfile.TemporaryDirectory(prefix='brana-api-fixture-') as tmp:
        root = Path(tmp); ca_key = rsa.generate_private_key(public_exponent=65537, key_size=2048); ca_name = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, 'api-ca')]); ca = _cert('api-ca', ca_key, ca_name, ca_key, ca=True)
        key = rsa.generate_private_key(public_exponent=65537, key_size=2048); cert = _cert('localhost', key, ca.subject, ca_key, server=True); _write(root/'server', cert, key); (root/'ca.crt').write_bytes(ca.public_bytes(serialization.Encoding.PEM))
        owns_database = db is None
        if owns_database:
            engine = create_engine('sqlite:///:memory:', connect_args={'check_same_thread': False}, poolclass=__import__('sqlalchemy').pool.StaticPool)
            tables = [Clinica.__table__, PrestadorOdonto.__table__, UnidadeAtendimento.__table__, Lancamento.__table__, ConvenioOdonto.__table__, ProcedimentoGenerico.__table__, Material.__table__, Usuario.__table__, UsuarioCertificado.__table__, SignatureAuthorization.__table__, SignatureReservationRequest.__table__]
            Base.metadata.create_all(engine, tables=tables)
            db = sessionmaker(bind=engine)()
        elif db is None:
            raise ValueError('INJECTED_SESSION_REQUIRED')
        clinic = Clinica(nome='api-fixture', email='api-fixture@test', trial_ate=datetime.utcnow()); db.add(clinic); db.flush(); user = Usuario(nome='api-fixture-user', email='api-fixture-user@test', senha_hash=hash_password('test-password'), clinica_id=clinic.id, ativo=True, setup_completed=True, is_admin=False); db.add(user); db.flush(); der_hash = 'a' * 64; db.add(UsuarioCertificado(clinica_id=clinic.id, titular_user_id=user.id, criado_por_user_id=user.id, certificado_der_sha256=der_hash, status='ACTIVE')); db.commit()
        identity = TrustedInstallationIdentity('install-api-fixture', authenticated=True); token = 'test-bearer-only'; app = FastAPI()
        def bearer(request: Request):
            if request.headers.get('authorization') != f'Bearer {token}': raise HTTPException(status_code=401, detail='AUTH_REQUIRED')
            return user
        @app.post('/api/signature-authorizations/reserve')
        def reserve(payload: _Payload, actor=Depends(bearer)):
            row = reserve_authorization(db, actor=actor, installation=identity, operation_id=payload.operation_id, prepared_pdf_sha256=payload.prepared_pdf_sha256, certificado_der_sha256=payload.certificado_der_sha256, field_name=payload.field_name, policy_oid=payload.policy_oid, ttl_seconds=payload.ttl_seconds, certificate_source=payload.certificate_source)
            db.commit(); return {'authorization_id': row.authorization_id, 'status': row.status}
        @app.post('/api/signature-authorizations')
        def confirm(payload: _Payload, actor=Depends(bearer)):
            row = issue_authorization(db, actor=actor, senha=payload.password or '', installation=identity, authorization_id=payload.authorization_id, operation_id=payload.operation_id, prepared_pdf_sha256=payload.prepared_pdf_sha256, certificado_der_sha256=payload.certificado_der_sha256, field_name=payload.field_name, policy_oid=payload.policy_oid, ttl_seconds=payload.ttl_seconds, certificate_source=payload.certificate_source)
            db.commit(); return {'authorization_id': row.authorization_id, 'status': row.status}
        @app.post('/api/signature-reservation-requests')
        def create_reservation_challenge(payload: dict, actor=Depends(bearer)):
            from services.signature_reservation_challenge_service import create_pending_request
            row, challenge = create_pending_request(db, actor=actor, **payload)
            return {'request_id': row.request_id, 'challenge': challenge, 'status': row.status}
        @app.get('/api/signature-reservation-requests/{request_id}')
        def get_reservation_challenge(request_id: str, actor=Depends(bearer)):
            row = db.query(SignatureReservationRequest).filter_by(request_id=request_id, user_id=actor.id, clinica_id=actor.clinica_id).first()
            if not row: raise HTTPException(status_code=404, detail='RESERVATION_REQUEST_NOT_FOUND')
            return {'request_id': row.request_id, 'authorization_id': row.authorization_id, 'status': row.status, 'operation_id': row.operation_id}
        stop = asyncio.Event(); probe = socket.socket(); probe.bind(('127.0.0.1', 0)); port = probe.getsockname()[1]; probe.close()
        async def run():
            cfg = Config(); cfg.bind = [f'127.0.0.1:{port}']; cfg.certfile = str(root/'server.crt'); cfg.keyfile = str(root/'server.key'); await serve(app, cfg, shutdown_trigger=stop.wait)
        task = asyncio.create_task(run())
        try:
            for _ in range(60):
                try:
                    with socket.create_connection(('127.0.0.1', port), timeout=.1): break
                except OSError: await asyncio.sleep(.05)
            yield type('SignatureApi', (), {'base_url': f'https://localhost:{port}', 'ca_cert': str(root/'ca.crt'), 'db': db, 'token': token, 'der_hash': der_hash})
        finally:
            stop.set(); await asyncio.wait_for(task, timeout=5)
            if owns_database:
                db.close(); engine.dispose()
            source_policy.__exit__(None, None, None)


@asynccontextmanager
async def running_test_bridge(anycorn_python, *, online_authorization_consumer=None, signer=None, reservation_challenge_forwarder=None, enable_test_reservation_challenge=False, test_only_state=None, public_certificate_provider=None):
    """Disposable real bridge HTTPS server; production ports are untouched."""
    sys.path.insert(0, str(Path(anycorn_python).parent.parent / 'Lib' / 'site-packages'))
    from anycorn import serve
    from anycorn.config import Config
    with tempfile.TemporaryDirectory(prefix='brana-bridge-fixture-') as tmp:
        root = Path(tmp); ca_key = rsa.generate_private_key(public_exponent=65537, key_size=2048); ca_name = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, 'bridge-ca')]); ca = _cert('bridge-ca', ca_key, ca_name, ca_key, ca=True)
        key = rsa.generate_private_key(public_exponent=65537, key_size=2048); cert = _cert('localhost', key, ca.subject, ca_key, server=True); _write(root/'bridge', cert, key); (root/'ca.crt').write_bytes(ca.public_bytes(serialization.Encoding.PEM))
        runtime = create_secure_bridge_runtime(cert_pem=cert.public_bytes(serialization.Encoding.PEM), key_pem=key.private_bytes(serialization.Encoding.PEM, serialization.PrivateFormat.PKCS8, serialization.NoEncryption()), signer=signer or FakePreparedPdfSigner(), ui=_BridgeApproval(), lock=_BridgeLock(), online_authorization_consumer=online_authorization_consumer, require_online_authorization=online_authorization_consumer is not None, reservation_challenge_forwarder=reservation_challenge_forwarder, enable_test_reservation_challenge=enable_test_reservation_challenge, public_certificate_provider=public_certificate_provider)
        if test_only_state is not None:
            runtime.service.state = test_only_state
        stop = asyncio.Event()
        async def run():
            cfg = Config(); cfg.bind = ['127.0.0.1:8765']; cfg.certfile = str(root/'bridge.crt'); cfg.keyfile = str(root/'bridge.key'); await serve(runtime.create_app(), cfg, shutdown_trigger=stop.wait)
        task = asyncio.create_task(run())
        try:
            for _ in range(80):
                try:
                    with socket.create_connection(('127.0.0.1', 8765), timeout=.1): break
                except OSError: await asyncio.sleep(.05)
            else: raise RuntimeError('BRIDGE_FIXTURE_NOT_READY')
            yield type('TestBridge', (), {'base_url': 'https://localhost:8765', 'ca_cert': str(root/'ca.crt'), 'runtime': runtime})
        finally:
            stop.set(); await asyncio.wait_for(task, timeout=5)


@asynccontextmanager
async def running_launcher_test_bridge(anycorn_python, *, mtls_endpoint="https://localhost:8765", mtls_ca_cert=None, mtls_client_cert=None, mtls_client_key=None, online_authorization_consumer=None, signer=None, reservation_challenge_forwarder=None, enable_test_reservation_challenge=False):
    """Serve the ASGI object produced by the launcher construction path."""
    sys.path.insert(0, str(Path(anycorn_python).parent.parent / 'Lib' / 'site-packages'))
    from anycorn import serve
    from anycorn.config import Config
    with tempfile.TemporaryDirectory(prefix='brana-launcher-bridge-fixture-') as tmp:
        root = Path(tmp); ca_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
        ca_name = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, 'launcher-ca')])
        ca = _cert('launcher-ca', ca_key, ca_name, ca_key, ca=True)
        key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
        cert = _cert('localhost', key, ca.subject, ca_key, server=True)
        _write(root / 'bridge', cert, key)
        (root / 'ca.crt').write_bytes(ca.public_bytes(serialization.Encoding.PEM))
        # The test-only launcher graph validates these as local files; no
        # operational helper or user certificate is accessed.
        runtime = build_runtime(
            root / 'bridge.crt', root / 'bridge.key', root / 'bridge.crt',
            mtls_endpoint=mtls_endpoint, mtls_ca_cert=mtls_ca_cert or root / 'ca.crt',
            mtls_client_cert=mtls_client_cert or root / 'bridge.crt', mtls_client_key=mtls_client_key or root / 'bridge.key',
            test_only_ui=_BridgeApproval(), test_only_signer=signer or FakePreparedPdfSigner(),
            test_only_lock=_BridgeLock(),
            test_only_online_consumer=online_authorization_consumer,
            test_only_reservation_forwarder=reservation_challenge_forwarder,
        )
        stop = asyncio.Event()
        async def run():
            cfg = Config(); cfg.bind = ['127.0.0.1:8765']; cfg.certfile = str(root / 'bridge.crt'); cfg.keyfile = str(root / 'bridge.key')
            await serve(runtime.create_app(), cfg, shutdown_trigger=stop.wait)
        task = asyncio.create_task(run())
        try:
            for _ in range(80):
                try:
                    with socket.create_connection(('127.0.0.1', 8765), timeout=.1): break
                except OSError: await asyncio.sleep(.05)
            else: raise RuntimeError('LAUNCHER_BRIDGE_FIXTURE_NOT_READY')
            yield type('LauncherTestBridge', (), {'base_url': 'https://localhost:8765', 'ca_cert': str(root / 'ca.crt'), 'runtime': runtime})
        finally:
            stop.set(); await asyncio.wait_for(task, timeout=5); runtime.close()


@asynccontextmanager
async def running_signature_consume_mtls(anycorn_python, *, db, engine, update_signature_binding=True, revoke_installation=False, test_only_allow_file_pkcs12=False):
    """Run the real consume router over mTLS using an injected SQL session."""
    source_policy = _test_only_file_source_policy(test_only_allow_file_pkcs12); source_policy.__enter__()
    sys.path.insert(0, str(Path(anycorn_python).parent.parent / 'Lib' / 'site-packages'))
    from anycorn import serve
    from anycorn.config import Config
    with tempfile.TemporaryDirectory(prefix='brana-consume-fixture-') as tmp:
        root = Path(tmp); ca_key = rsa.generate_private_key(public_exponent=65537, key_size=2048); ca_name = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, 'consume-ca')]); ca = _cert('consume-ca', ca_key, ca_name, ca_key, ca=True)
        server_key = rsa.generate_private_key(public_exponent=65537, key_size=2048); server = _cert('localhost', server_key, ca.subject, ca_key, server=True)
        client_key = rsa.generate_private_key(public_exponent=65537, key_size=2048); client = _cert('registered-installation', client_key, ca.subject, ca_key, client=True)
        _write(root/'server', server, server_key); _write(root/'client', client, client_key); (root/'ca.crt').write_bytes(ca.public_bytes(serialization.Encoding.PEM))
        der_hash = hashlib.sha256(client.public_bytes(serialization.Encoding.DER)).hexdigest()
        if update_signature_binding:
            binding = db.query(UsuarioCertificado).one(); binding.certificado_der_sha256 = der_hash; db.commit()
        for authorization in db.query(SignatureAuthorization).all():
            authorization.installation_id = 'install-api-fixture'
        db.commit()
        actor = db.query(Usuario).one(); registry = InstallationIdentityRegistry(); registry.register('install-api-fixture', der_hash)
        if revoke_installation:
            registry.revoke('install-api-fixture')
        app = FastAPI(); app.include_router(create_signature_authorization_router(get_db=lambda: db, get_actor=lambda: actor, installation_registry=registry))
        app.include_router(create_signature_reservation_challenge_router(installation_dependency=tls_installation_dependency(registry), db_dependency=lambda: db))
        stop = asyncio.Event(); probe = socket.socket(); probe.bind(('127.0.0.1', 0)); port = probe.getsockname()[1]; probe.close()
        async def run():
            cfg = Config(); cfg.bind = [f'127.0.0.1:{port}']; cfg.certfile = str(root/'server.crt'); cfg.keyfile = str(root/'server.key'); cfg.ca_certs = str(root/'ca.crt'); cfg.cert_reqs = 2; await serve(app, cfg, shutdown_trigger=stop.wait)
        task = asyncio.create_task(run())
        try:
            for _ in range(80):
                try:
                    with socket.create_connection(('127.0.0.1', port), timeout=.1): break
                except OSError: await asyncio.sleep(.05)
            else: raise RuntimeError('CONSUME_MTLS_FIXTURE_NOT_READY')
            yield type('ConsumeFixture', (), {'endpoint': f'https://127.0.0.1:{port}/v1/signature-authorizations/consume', 'challenge_endpoint': f'https://127.0.0.1:{port}/signature-reservation-requests/bind-installation', 'ca_cert': str(root/'ca.crt'), 'client_cert': str(root/'client.crt'), 'client_key': str(root/'client.key'), 'der_hash': der_hash})
        finally:
            stop.set(); await asyncio.wait_for(task, timeout=5)
            source_policy.__exit__(None, None, None)


class ApiFixtureLifecycleTests(unittest.IsolatedAsyncioTestCase):
    async def test_launcher_real_mtls_channel_health_https(self):
        anycorn = os.environ.get('ANYCORN_PYTHON')
        if not anycorn:
            self.skipTest('ANYCORN_PYTHON not set')
        async with running_launcher_test_bridge(anycorn) as bridge:
            context = ssl.create_default_context(cafile=bridge.ca_cert)
            context.check_hostname = False
            async with httpx.AsyncClient(base_url=bridge.base_url, verify=context, trust_env=False) as client:
                health = await client.get('/v1/diagnostics/health', headers={'Origin': 'https://localhost:5173'})
                self.assertEqual(health.status_code, 200, health.text)
                preflight = await client.options('/v1/pairing-requests', headers={
                    'Origin': 'https://localhost:5173',
                    'Access-Control-Request-Method': 'POST',
                })
                self.assertIn(preflight.status_code, (200, 204), preflight.text)

    async def test_launcher_real_mtls_channel_to_result(self):
        """Run the existing real-JS flow with the launcher-built ASGI runtime."""
        anycorn = os.environ.get('ANYCORN_PYTHON')
        node = shutil.which('node')
        if not anycorn or not node:
            self.skipTest('ANYCORN_PYTHON and node are required')
        original = globals()['running_test_bridge']
        def launcher_with_real_mtls_clients(anycorn_python, *, signer=None, **ignored):
            # The existing scenario exposes the real consumer configuration;
            # only its endpoint/certificate files are passed to the launcher.
            # No consumer or forwarder object crosses this boundary.
            consume = getattr(self, '_launcher_consume_fixture', None)
            if consume is None:
                raise RuntimeError('LAUNCHER_MTLS_FIXTURE_NOT_AVAILABLE')
            base = consume.endpoint.rsplit('/v1/signature-authorizations/consume', 1)[0]
            return running_launcher_test_bridge(
                anycorn_python, mtls_endpoint=base, mtls_ca_cert=consume.ca_cert,
                mtls_client_cert=consume.client_cert, mtls_client_key=consume.client_key,
                signer=signer,
            )
        # The delegated scenario creates consume inside its body; its fixture
        # is published by the temporary wrapper below before bridge creation.
        original_consume = globals()['running_signature_consume_mtls']
        @asynccontextmanager
        async def tracked_consume(*args, **kwargs):
            async with original_consume(*args, **kwargs) as consume:
                self._launcher_consume_fixture = consume
                try:
                    yield consume
                finally:
                    self._launcher_consume_fixture = None
        globals()['running_signature_consume_mtls'] = tracked_consume
        globals()['running_test_bridge'] = launcher_with_real_mtls_clients
        try:
            await self.test_api_mtls_bridge_success_with_real_js_client()
        finally:
            globals()['running_test_bridge'] = original
            globals()['running_signature_consume_mtls'] = original_consume
    async def test_real_https_concurrent_binds_are_one_shot(self):
        anycorn = os.environ.get('ANYCORN_PYTHON')
        if not anycorn: self.skipTest('ANYCORN_PYTHON not set')
        from sqlalchemy.pool import StaticPool
        engine = create_engine('sqlite:///:memory:', connect_args={'check_same_thread': False}, poolclass=StaticPool)
        tables = [Clinica.__table__, PrestadorOdonto.__table__, UnidadeAtendimento.__table__, Lancamento.__table__, ConvenioOdonto.__table__, ProcedimentoGenerico.__table__, Material.__table__, Usuario.__table__, UsuarioCertificado.__table__, SignatureAuthorization.__table__, SignatureReservationRequest.__table__]
        Base.metadata.create_all(engine, tables=tables); db = sessionmaker(bind=engine)()
        try:
            async with running_signature_api(anycorn, db=db, engine=engine) as api:
                async with running_signature_consume_mtls(anycorn, db=db, engine=engine, update_signature_binding=False) as consume:
                    body = {'operation_id': b64url_encode(os.urandom(16)), 'prepared_pdf_sha256': 'd' * 64, 'certificado_der_sha256': 'a' * 64, 'field_name': 'BranaSignature_1', 'policy_oid': '2.16.76.1.7.1.11.1.3', 'ttl_seconds': 120}
                    ctx = ssl.create_default_context(cafile=api.ca_cert)
                    async with httpx.AsyncClient(base_url=api.base_url, verify=ctx, trust_env=False) as client:
                        pending = await client.post('/api/signature-reservation-requests', json=body, headers={'Authorization': f'Bearer {api.token}'})
                    self.assertEqual(pending.status_code, 200, pending.text); data = pending.json()
                    args = dict(request_id=data['request_id'], challenge=data['challenge'], operation_id=body['operation_id'], prepared_pdf_sha256=body['prepared_pdf_sha256'], certificado_der_sha256=body['certificado_der_sha256'])
                    forwarders = [ReservationChallengeForwarder(ReservationChallengeConfig(consume.challenge_endpoint, consume.ca_cert, consume.client_cert, consume.client_key)) for _ in range(2)]
                    results = await asyncio.gather(*(asyncio.to_thread(f.forward, **args) for f in forwarders), return_exceptions=True)
                    successes = [item for item in results if isinstance(item, dict) and item.get('status') == 'RESERVED']
                    failures = [item for item in results if isinstance(item, OnlineAuthorizationError)]
                    self.assertEqual(len(successes), 1, results)
                    self.assertEqual(len(failures), 1, results)
                    row = db.query(SignatureReservationRequest).filter_by(request_id=data['request_id']).one()
                    authorizations = db.query(SignatureAuthorization).filter_by(operation_id=body['operation_id']).all()
                    self.assertEqual(row.status, 'RESERVED')
                    self.assertEqual(len(authorizations), 1)
                    self.assertEqual(authorizations[0].authorization_id, row.authorization_id)
        finally:
            db.close(); engine.dispose()

    async def test_real_https_revoked_mtls_installation_rejects_bind(self):
        anycorn = os.environ.get('ANYCORN_PYTHON')
        if not anycorn: self.skipTest('ANYCORN_PYTHON not set')
        from sqlalchemy.pool import StaticPool
        engine = create_engine('sqlite:///:memory:', connect_args={'check_same_thread': False}, poolclass=StaticPool)
        tables = [Clinica.__table__, PrestadorOdonto.__table__, UnidadeAtendimento.__table__, Lancamento.__table__, ConvenioOdonto.__table__, ProcedimentoGenerico.__table__, Material.__table__, Usuario.__table__, UsuarioCertificado.__table__, SignatureAuthorization.__table__, SignatureReservationRequest.__table__]
        Base.metadata.create_all(engine, tables=tables); db = sessionmaker(bind=engine)()
        try:
            async with running_signature_api(anycorn, db=db, engine=engine) as api:
                async with running_signature_consume_mtls(anycorn, db=db, engine=engine, update_signature_binding=False, revoke_installation=True) as consume:
                    body = {'operation_id': b64url_encode(os.urandom(16)), 'prepared_pdf_sha256': 'c' * 64, 'certificado_der_sha256': 'a' * 64, 'field_name': 'BranaSignature_1', 'policy_oid': '2.16.76.1.7.1.11.1.3', 'ttl_seconds': 120}
                    ctx = ssl.create_default_context(cafile=api.ca_cert)
                    async with httpx.AsyncClient(base_url=api.base_url, verify=ctx, trust_env=False) as client:
                        pending = await client.post('/api/signature-reservation-requests', json=body, headers={'Authorization': f'Bearer {api.token}'})
                    self.assertEqual(pending.status_code, 200, pending.text)
                    data = pending.json()
                    forwarder = ReservationChallengeForwarder(ReservationChallengeConfig(consume.challenge_endpoint, consume.ca_cert, consume.client_cert, consume.client_key))
                    with self.assertRaises(OnlineAuthorizationError):
                        await asyncio.to_thread(forwarder.forward, request_id=data['request_id'], challenge=data['challenge'], operation_id=body['operation_id'], prepared_pdf_sha256=body['prepared_pdf_sha256'], certificado_der_sha256=body['certificado_der_sha256'])
                    row = db.query(SignatureReservationRequest).filter_by(request_id=data['request_id']).one()
                    self.assertEqual(row.status, 'PENDING')
                    self.assertEqual(db.query(SignatureAuthorization).filter_by(operation_id=body['operation_id']).count(), 0)
        finally:
            db.close(); engine.dispose()
    async def test_real_js_bridge_forwards_reservation_challenge_over_mtls(self):
        anycorn = os.environ.get('ANYCORN_PYTHON'); node = shutil.which('node')
        if not anycorn or not node: self.skipTest('ANYCORN_PYTHON and node required')
        from sqlalchemy.pool import StaticPool
        engine = create_engine('sqlite:///:memory:', connect_args={'check_same_thread': False}, poolclass=StaticPool)
        tables = [Clinica.__table__, PrestadorOdonto.__table__, UnidadeAtendimento.__table__, Lancamento.__table__, ConvenioOdonto.__table__, ProcedimentoGenerico.__table__, Material.__table__, Usuario.__table__, UsuarioCertificado.__table__, SignatureAuthorization.__table__, SignatureReservationRequest.__table__]
        Base.metadata.create_all(engine, tables=tables); db = sessionmaker(bind=engine)()
        try:
            async with running_signature_api(anycorn, db=db, engine=engine) as api:
                async with running_signature_consume_mtls(anycorn, db=db, engine=engine, update_signature_binding=False) as consume:
                    signing_hash = 'a' * 64; body = {'operation_id': b64url_encode(os.urandom(16)), 'prepared_pdf_sha256': 'b' * 64, 'certificado_der_sha256': signing_hash, 'field_name': 'BranaSignature_1', 'policy_oid': '2.16.76.1.7.1.11.1.3', 'ttl_seconds': 120}
                    ctx = ssl.create_default_context(cafile=api.ca_cert)
                    async with httpx.AsyncClient(base_url=api.base_url, verify=ctx, trust_env=False) as client:
                        pending = await client.post('/api/signature-reservation-requests', json=body, headers={'Authorization': f'Bearer {api.token}'})
                        self.assertEqual(pending.status_code, 200); pending_data = pending.json()
                    forwarder = ReservationChallengeForwarder(ReservationChallengeConfig(consume.challenge_endpoint, consume.ca_cert, consume.client_cert, consume.client_key))
                    async with running_test_bridge(anycorn, reservation_challenge_forwarder=forwarder.forward, enable_test_reservation_challenge=True) as bridge:
                        env = os.environ.copy(); env.update({'NODE_EXTRA_CA_CERTS': bridge.ca_cert, 'BRANA_REQUEST_ID': pending_data['request_id'], 'BRANA_CHALLENGE': pending_data['challenge'], 'BRANA_OPERATION_ID': body['operation_id'], 'BRANA_PDF_HASH': body['prepared_pdf_sha256'], 'BRANA_SIGNING_DER_HASH': signing_hash})
                        script = Path(__file__).with_name('node_bind_reservation_client.mjs')
                        result = await asyncio.to_thread(subprocess.run, [node, str(script)], cwd=str(Path(__file__).resolve().parents[2]), env=env, capture_output=True, text=True, timeout=30, check=False)
                        self.assertEqual(result.returncode, 0, result.stderr); bound = json.loads(result.stdout); self.assertEqual(bound['state'], 'RESERVED')
                    row = db.query(SignatureReservationRequest).filter_by(request_id=pending_data['request_id']).one(); self.assertEqual(row.status, 'RESERVED'); self.assertEqual(row.certificado_der_sha256, signing_hash); self.assertNotEqual(row.certificado_der_sha256, consume.der_hash); self.assertEqual(row.installation_id, 'install-api-fixture')
        finally:
            db.close(); engine.dispose()
    async def test_real_https_mtls_reservation_challenge_bind(self):
        anycorn = os.environ.get('ANYCORN_PYTHON')
        if not anycorn: self.skipTest('ANYCORN_PYTHON not set')
        from sqlalchemy.pool import StaticPool
        engine = create_engine('sqlite:///:memory:', connect_args={'check_same_thread': False}, poolclass=StaticPool)
        tables = [Clinica.__table__, PrestadorOdonto.__table__, UnidadeAtendimento.__table__, Lancamento.__table__, ConvenioOdonto.__table__, ProcedimentoGenerico.__table__, Material.__table__, Usuario.__table__, UsuarioCertificado.__table__, SignatureAuthorization.__table__, SignatureReservationRequest.__table__]
        Base.metadata.create_all(engine, tables=tables); db = sessionmaker(bind=engine)()
        try:
            async with running_signature_api(anycorn, db=db, engine=engine) as api:
                api_tls = ssl.create_default_context(cafile=api.ca_cert)
                async with running_signature_consume_mtls(anycorn, db=db, engine=engine, update_signature_binding=False) as consume:
                    signing_der_hash = 'a' * 64
                    self.assertNotEqual(signing_der_hash, consume.der_hash)
                    body = {'operation_id': b64url_encode(os.urandom(16)), 'prepared_pdf_sha256': 'b' * 64, 'certificado_der_sha256': signing_der_hash, 'field_name': 'BranaSignature_1', 'policy_oid': '2.16.76.1.7.1.11.1.3', 'ttl_seconds': 120}
                    async with httpx.AsyncClient(base_url=api.base_url, verify=api_tls, trust_env=False) as client:
                        pending = await client.post('/api/signature-reservation-requests', json=body, headers={'Authorization': f'Bearer {api.token}'})
                        self.assertEqual(pending.status_code, 200, pending.text); pending_data = pending.json(); self.assertEqual(pending_data['status'], 'PENDING')
                        forwarder = ReservationChallengeForwarder(ReservationChallengeConfig(consume.challenge_endpoint, consume.ca_cert, consume.client_cert, consume.client_key))
                        bound = await asyncio.to_thread(forwarder.forward, request_id=pending_data['request_id'], challenge=pending_data['challenge'], operation_id=body['operation_id'], prepared_pdf_sha256=body['prepared_pdf_sha256'], certificado_der_sha256=signing_der_hash)
                        self.assertEqual(bound['status'], 'RESERVED'); row = db.query(SignatureReservationRequest).filter_by(request_id=pending_data['request_id']).one(); self.assertEqual(row.status, 'RESERVED'); self.assertEqual(row.authorization_id, bound['authorization_id']); self.assertEqual(row.installation_id, 'install-api-fixture')
                        consulted = await client.get(f"/api/signature-reservation-requests/{row.request_id}", headers={'Authorization': f'Bearer {api.token}'})
                        self.assertEqual(consulted.status_code, 200); self.assertEqual(consulted.json()['authorization_id'], row.authorization_id)
                        with self.assertRaises(OnlineAuthorizationError):
                            await asyncio.to_thread(forwarder.forward, request_id=pending_data['request_id'], challenge=pending_data['challenge'], operation_id=body['operation_id'], prepared_pdf_sha256=body['prepared_pdf_sha256'], certificado_der_sha256=signing_der_hash)
        except OnlineAuthorizationError:
            raise
        finally:
            db.close(); engine.dispose()

    async def _run_js_negative(self, api, *, mode, token, operation_id, pdf, der_hash):
        node = shutil.which('node'); self.assertIsNotNone(node, 'node is required')
        script = Path(__file__).with_name('node_authorization_negative_client.mjs')
        env = os.environ.copy(); env.update({'NODE_EXTRA_CA_CERTS': api.ca_cert, 'BRANA_API_FIXTURE_URL': api.base_url, 'BRANA_API_FIXTURE_TOKEN': token, 'BRANA_OPERATION_ID': operation_id, 'BRANA_DER_HASH': der_hash, 'BRANA_PDF_B64': base64.b64encode(pdf).decode('ascii'), 'BRANA_NEGATIVE_MODE': mode})
        completed = await asyncio.to_thread(subprocess.run, [node, str(script)], cwd=str(Path(__file__).resolve().parents[2]), env=env, capture_output=True, text=True, timeout=20, check=False)
        self.assertTrue(completed.stdout, completed.stderr); return completed.returncode, json.loads(completed.stdout)

    async def test_js_negative_authorization_controls_use_new_operations(self):
        anycorn = os.environ.get('ANYCORN_PYTHON');
        if not anycorn: self.skipTest('ANYCORN_PYTHON not set')
        from sqlalchemy.pool import StaticPool
        engine = create_engine('sqlite:///:memory:', connect_args={'check_same_thread': False}, poolclass=StaticPool)
        tables = [Clinica.__table__, PrestadorOdonto.__table__, UnidadeAtendimento.__table__, Lancamento.__table__, ConvenioOdonto.__table__, ProcedimentoGenerico.__table__, Material.__table__, Usuario.__table__, UsuarioCertificado.__table__, SignatureAuthorization.__table__, SignatureReservationRequest.__table__]
        Base.metadata.create_all(engine, tables=tables); db = sessionmaker(bind=engine)()
        try:
            async with running_signature_api(anycorn, db=db, engine=engine) as api:
                source = fitz.open(); source.new_page(width=595, height=842).insert_text((100, 300), 'texto', fontsize=10); pdf = source.tobytes(); source.close()
                code, wrong = await self._run_js_negative(api, mode='wrong-password', token=api.token, operation_id=b64url_encode(os.urandom(16)), pdf=pdf, der_hash=api.der_hash)
                self.assertEqual(code, 2); self.assertIn(wrong['error'], {'AUTHORIZATION_CONFIRMATION_FAILED', 'HTTP_401', 'INVALID_TITULAR_PASSWORD'})
                code, mismatch = await self._run_js_negative(api, mode='wrong-pdf', token=api.token, operation_id=b64url_encode(os.urandom(16)), pdf=pdf, der_hash=api.der_hash)
                self.assertEqual(code, 2); self.assertTrue(mismatch['error'])
                code, bearer = await self._run_js_negative(api, mode='wrong-password', token='invalid-test-bearer', operation_id=b64url_encode(os.urandom(16)), pdf=pdf, der_hash=api.der_hash)
                self.assertNotEqual(code, 0); self.assertTrue(bearer['error'])
                self.assertEqual(db.query(SignatureAuthorization).count(), 2)
        finally:
            db.close(); engine.dispose()
    async def test_api_mtls_bridge_success_with_real_js_client(self):
        anycorn = os.environ.get('ANYCORN_PYTHON'); node = shutil.which('node')
        if not anycorn or not node: self.skipTest('ANYCORN_PYTHON and node are required')
        from sqlalchemy.pool import StaticPool
        shared_engine = create_engine('sqlite:///:memory:', connect_args={'check_same_thread': False}, poolclass=StaticPool)
        tables = [Clinica.__table__, PrestadorOdonto.__table__, UnidadeAtendimento.__table__, Lancamento.__table__, ConvenioOdonto.__table__, ProcedimentoGenerico.__table__, Material.__table__, Usuario.__table__, UsuarioCertificado.__table__, SignatureAuthorization.__table__, SignatureReservationRequest.__table__]
        Base.metadata.create_all(shared_engine, tables=tables); db = sessionmaker(bind=shared_engine)()
        combined_ca = None
        try:
            async with running_signature_api(anycorn, db=db, engine=shared_engine) as api:
                async with running_signature_consume_mtls(anycorn, db=db, engine=shared_engine, update_signature_binding=False) as consume:
                    source = fitz.open(); source.new_page(width=595, height=842).insert_text((100, 300), '<<Cirurgião.AssinaturaDigital>>', fontsize=10); prepared = prepare_signature_anchor(source.tobytes()).pdf_bytes; source.close()
                    operation_id = b64url_encode(os.urandom(16)); script = Path(__file__).with_name('node_coordinated_signature_client.mjs')
                    combined_ca = tempfile.NamedTemporaryFile(prefix='brana-node-ca-', suffix='.crt', delete=False)
                    combined_ca.write(Path(api.ca_cert).read_bytes()); combined_ca.write(Path(consume.ca_cert).read_bytes()); combined_ca.flush(); combined_ca.close()
                    signing_der_hash = 'a' * 64
                    env = os.environ.copy(); env.update({'NODE_EXTRA_CA_CERTS': combined_ca.name, 'BRANA_API_FIXTURE_URL': api.base_url, 'BRANA_API_FIXTURE_TOKEN': api.token, 'BRANA_SIGNING_DER_HASH': signing_der_hash, 'BRANA_OPERATION_ID': operation_id, 'BRANA_PREPARED_PDF_B64': base64.b64encode(prepared).decode('ascii')})
                    signer = _OrderedFakeSigner(db, None)
                    consumer = OnlineAuthorizationConsumer(OnlineAuthorizationConfig(consume.endpoint, consume.ca_cert, consume.client_cert, consume.client_key))
                    challenge_forwarder = ReservationChallengeForwarder(ReservationChallengeConfig(consume.challenge_endpoint, consume.ca_cert, consume.client_cert, consume.client_key))
                    challenge_forwarder = ReservationChallengeForwarder(ReservationChallengeConfig(consume.challenge_endpoint, consume.ca_cert, consume.client_cert, consume.client_key))
                    async with running_test_bridge(anycorn, online_authorization_consumer=consumer.consume, signer=signer, reservation_challenge_forwarder=challenge_forwarder.forward, enable_test_reservation_challenge=True) as bridge:
                        Path(combined_ca.name).write_bytes(Path(api.ca_cert).read_bytes() + Path(consume.ca_cert).read_bytes() + Path(bridge.ca_cert).read_bytes())
                        completed = await asyncio.to_thread(subprocess.run, [node, str(script)], cwd=str(Path(__file__).resolve().parents[2]), env=env, capture_output=True, text=True, timeout=30, check=False)
                        self.assertEqual(completed.returncode, 0, completed.stderr)
                        result = json.loads(completed.stdout)
                        self.assertEqual(result['pairing_state'], 'APPROVED'); self.assertEqual(result['reserved_state'], 'RESERVED'); self.assertEqual(result['operation_state'], 'APPROVED'); self.assertEqual(result['issued_state'], 'ISSUED'); self.assertEqual(result['sign_state'], 'COMPLETED'); self.assertEqual(result['result_status'], 200); self.assertEqual(signer.calls, 1); self.assertTrue(signer.consumed_before_call)
                        row = db.query(SignatureAuthorization).filter_by(authorization_id=result['authorization_id']).one(); self.assertEqual(row.status, 'CONSUMED'); self.assertEqual(result['result_sha256'], hashlib.sha256(signer.result).hexdigest()); self.assertEqual(result['result_size'], len(signer.result))
        finally:
            if combined_ca:
                Path(combined_ca.name).unlink(missing_ok=True)
            db.close(); shared_engine.dispose()

    async def test_api_mtls_and_bridge_https_success_shared_sql(self):
        anycorn = os.environ.get('ANYCORN_PYTHON')
        if not anycorn: self.skipTest('ANYCORN_PYTHON not set')
        from sqlalchemy.pool import StaticPool
        shared_engine = create_engine('sqlite:///:memory:', connect_args={'check_same_thread': False}, poolclass=StaticPool)
        tables = [Clinica.__table__, PrestadorOdonto.__table__, UnidadeAtendimento.__table__, Lancamento.__table__, ConvenioOdonto.__table__, ProcedimentoGenerico.__table__, Material.__table__, Usuario.__table__, UsuarioCertificado.__table__, SignatureAuthorization.__table__]
        Base.metadata.create_all(shared_engine, tables=tables); db = sessionmaker(bind=shared_engine)()
        try:
            async with running_signature_api(anycorn, db=db, engine=shared_engine) as api:
                operation_id = b64url_encode(b'coordinated-op-11d3c2d')[:22]
                policy_oid = '2.16.76.1.7.1.11.1.3'
                body_meta = {'operation_id': operation_id, 'prepared_pdf_sha256': 'e' * 64, 'certificado_der_sha256': api.der_hash, 'field_name': 'BranaSignature_1', 'policy_oid': policy_oid}
                ctx = ssl.create_default_context(cafile=api.ca_cert)
                async with httpx.AsyncClient(base_url=api.base_url, verify=ctx, trust_env=False) as api_client:
                    reserved = await api_client.post('/api/signature-authorizations/reserve', json=body_meta, headers={'Authorization': f'Bearer {api.token}'})
                    self.assertEqual(reserved.status_code, 200); authorization_id = reserved.json()['authorization_id']
                async with running_signature_consume_mtls(anycorn, db=db, engine=shared_engine) as consume:
                    authorization = db.query(SignatureAuthorization).filter_by(authorization_id=authorization_id).one(); authorization.certificado_der_sha256 = consume.der_hash; db.commit()
                    consumer = OnlineAuthorizationConsumer(OnlineAuthorizationConfig(consume.endpoint, consume.ca_cert, consume.client_cert, consume.client_key))
                    signer = _OrderedFakeSigner(db, authorization_id)
                    async with running_test_bridge(anycorn, online_authorization_consumer=consumer.consume, signer=signer) as bridge:
                        source = fitz.open(); source.new_page(width=595, height=842).insert_text((100, 300), '<<Cirurgião.AssinaturaDigital>>', fontsize=10); prepared = prepare_signature_anchor(source.tobytes()).pdf_bytes; source.close()
                        # Bind the actual prepared PDF bytes consistently at the API boundary.
                        pdf_hash = hashlib.sha256(prepared).hexdigest(); authorization.prepared_pdf_sha256 = pdf_hash; db.commit()
                        client_key = ec.derive_private_key(17, ec.SECP256R1()); origin = 'https://localhost:5173'; base = {'Origin': origin}
                        client_nonce = b64url_encode(b'n' * 16); client_instance = b64url_encode(b'i' * 16); public = b64url_encode(client_key.public_key().public_bytes(serialization.Encoding.X962, PublicFormat.UncompressedPoint))
                        async with httpx.AsyncClient(base_url=bridge.base_url, verify=ssl.create_default_context(cafile=bridge.ca_cert), trust_env=False) as bridge_client:
                            pairing_response = await bridge_client.post('/v1/pairing-requests', headers=base, json={'client_instance_id': client_instance, 'client_nonce': client_nonce, 'client_ecdh_public_key': public})
                            self.assertEqual(pairing_response.status_code, 200); pairing = pairing_response.json(); request_id = pairing['request_id']
                            provisional = derive_session_key(client_key, pairing['bridge_ephemeral_public_key'], origin, request_id, client_nonce, pairing['bridge_nonce'], request_id)
                            def signed_headers(method, path, content, session, key, parameters, operation):
                                timestamp = int(time.time()); nonce = b64url_encode(os.urandom(16)); digest = hashlib.sha256(content).hexdigest(); canonical = canonicalize_hmac_request(method=method, path=path, origin=origin, timestamp=timestamp, request_nonce=nonce, session_id=session, content_sha256=digest, body_length=len(content), parameters=parameters, operation_id=operation)
                                return {'Origin': origin, 'X-Brana-Bridge-Protocol': 'brana-bridge-v1', 'X-Brana-Session': session, 'X-Brana-Timestamp': str(timestamp), 'X-Brana-Request-Nonce': nonce, 'X-Brana-Content-SHA256': digest, 'X-Brana-Request-MAC': calculate_hmac(key, canonical), 'X-Brana-Operation-Id': operation, 'X-Brana-Field-Name': 'BranaSignature_1', 'X-Brana-Policy-OID': policy_oid, 'X-Brana-Profile': 'pades-ad-rb-1.3', 'X-Brana-Certificate-DER-SHA256': consume.der_hash, 'X-Brana-Authorization-Id': authorization_id}
                            pairing_get = f'/v1/pairing-requests/{request_id}'; ph = signed_headers('GET', pairing_get, b'', request_id, provisional, {'operation_id': request_id}, request_id); approved_pairing = await bridge_client.get(pairing_get, headers=ph); self.assertEqual(approved_pairing.status_code, 200); session = approved_pairing.json()['session_id']; session_key = derive_session_key(client_key, pairing['bridge_ephemeral_public_key'], origin, request_id, client_nonce, pairing['bridge_nonce'], session)
                            params = {'operation_id': operation_id, 'authorization_id': authorization_id, 'certificate_der_sha256': consume.der_hash, 'field_name': 'BranaSignature_1', 'policy_oid': policy_oid, 'profile': 'pades-ad-rb-1.3'}
                            created = await bridge_client.post('/v1/signature-operations', headers=signed_headers('POST', '/v1/signature-operations', prepared, session, session_key, params, operation_id), content=prepared); self.assertEqual(created.status_code, 200, created.text)
                            status_path = f'/v1/signature-operations/{operation_id}'; status = await bridge_client.get(status_path, headers=signed_headers('GET', status_path, b'', session, session_key, {'operation_id': operation_id}, operation_id)); self.assertEqual(status.status_code, 200); self.assertEqual(status.json()['state'], 'APPROVED')
                            async with httpx.AsyncClient(base_url=api.base_url, verify=ctx, trust_env=False) as api_confirm_client:
                                confirmed = await api_confirm_client.post('/api/signature-authorizations', json={**body_meta, 'authorization_id': authorization_id, 'certificado_der_sha256': consume.der_hash, 'prepared_pdf_sha256': pdf_hash, 'password': 'test-password'}, headers={'Authorization': f'Bearer {api.token}'})
                            self.assertEqual(confirmed.status_code, 200)
                            sign_path = f'/v1/signature-operations/{operation_id}/sign'; signed = await bridge_client.post(sign_path, headers=signed_headers('POST', sign_path, prepared, session, session_key, params, operation_id), content=prepared); self.assertEqual(signed.status_code, 200, signed.text); self.assertEqual(signer.calls, 1); self.assertTrue(signer.consumed_before_call)
                            result_path = f'/v1/signature-operations/{operation_id}/result'; result = await bridge_client.get(result_path, headers=signed_headers('GET', result_path, b'', session, session_key, {'operation_id': operation_id}, operation_id)); self.assertEqual(result.status_code, 200); self.assertEqual(result.content, signer.result); self.assertEqual(hashlib.sha256(result.content).hexdigest(), hashlib.sha256(signer.result).hexdigest()); db.refresh(authorization); self.assertEqual(authorization.status, 'CONSUMED')
        finally:
            db.close(); shared_engine.dispose()

    async def test_shared_api_and_mtls_consume_same_sql_authorization(self):
        anycorn = os.environ.get('ANYCORN_PYTHON')
        if not anycorn: self.skipTest('ANYCORN_PYTHON not set')
        from sqlalchemy.pool import StaticPool
        shared_engine = create_engine('sqlite:///:memory:', connect_args={'check_same_thread': False}, poolclass=StaticPool)
        tables = [Clinica.__table__, PrestadorOdonto.__table__, UnidadeAtendimento.__table__, Lancamento.__table__, ConvenioOdonto.__table__, ProcedimentoGenerico.__table__, Material.__table__, Usuario.__table__, UsuarioCertificado.__table__, SignatureAuthorization.__table__]
        Base.metadata.create_all(shared_engine, tables=tables)
        injected_db = sessionmaker(bind=shared_engine)()
        try:
            async with running_signature_api(anycorn, db=injected_db, engine=shared_engine) as api:
                ctx = ssl.create_default_context(cafile=api.ca_cert)
                async with httpx.AsyncClient(base_url=api.base_url, verify=ctx, trust_env=False) as client:
                    body = {'operation_id': 'shared-mtls-op', 'prepared_pdf_sha256': 'd' * 64, 'certificado_der_sha256': api.der_hash, 'field_name': 'BranaSignature_1', 'policy_oid': 'policy'}
                    headers = {'Authorization': f'Bearer {api.token}'}
                    reserved = await client.post('/api/signature-authorizations/reserve', json=body, headers=headers)
                    self.assertEqual(reserved.status_code, 200)
                    authorization_id = reserved.json()['authorization_id']
                    confirmed = await client.post('/api/signature-authorizations', json={**body, 'authorization_id': authorization_id, 'password': 'test-password'}, headers=headers)
                    self.assertEqual(confirmed.status_code, 200)
                async with running_signature_consume_mtls(anycorn, db=injected_db, engine=shared_engine) as consume:
                    self.assertEqual(consume.der_hash, injected_db.query(UsuarioCertificado).one().certificado_der_sha256)
                    authorization = injected_db.query(SignatureAuthorization).filter_by(authorization_id=authorization_id).one()
                    authorization.certificado_der_sha256 = consume.der_hash
                    injected_db.commit()
                    consumer = OnlineAuthorizationConsumer(OnlineAuthorizationConfig(consume.endpoint, consume.ca_cert, consume.client_cert, consume.client_key))
                    result = await asyncio.to_thread(consumer.consume, authorization_id=authorization_id, operation_id='shared-mtls-op', prepared_pdf_sha256='d' * 64, certificate_der_sha256=consume.der_hash, field_name='BranaSignature_1', policy_oid='policy')
                    self.assertEqual(result, 'CONSUMED')
                    row = injected_db.query(SignatureAuthorization).filter_by(authorization_id=authorization_id).one()
                    self.assertEqual(row.status, 'CONSUMED')
                    with self.assertRaises(OnlineAuthorizationError):
                        await asyncio.to_thread(consumer.consume, authorization_id=authorization_id, operation_id='shared-mtls-op', prepared_pdf_sha256='d' * 64, certificate_der_sha256=consume.der_hash, field_name='BranaSignature_1', policy_oid='policy')
                    injected_db.refresh(row); self.assertEqual(row.status, 'CONSUMED')
        finally:
            injected_db.close(); shared_engine.dispose()

    async def test_context_uses_injected_database_without_destroying_it(self):
        anycorn = os.environ.get('ANYCORN_PYTHON')
        if not anycorn: self.skipTest('ANYCORN_PYTHON not set')
        from sqlalchemy.pool import StaticPool
        shared_engine = create_engine('sqlite:///:memory:', connect_args={'check_same_thread': False}, poolclass=StaticPool)
        tables = [Clinica.__table__, PrestadorOdonto.__table__, UnidadeAtendimento.__table__, Lancamento.__table__, ConvenioOdonto.__table__, ProcedimentoGenerico.__table__, Material.__table__, Usuario.__table__, UsuarioCertificado.__table__, SignatureAuthorization.__table__]
        Base.metadata.create_all(shared_engine, tables=tables)
        injected_db = sessionmaker(bind=shared_engine)()
        try:
            async with running_signature_api(anycorn, db=injected_db, engine=shared_engine) as api:
                ctx = ssl.create_default_context(cafile=api.ca_cert)
                async with httpx.AsyncClient(base_url=api.base_url, verify=ctx, trust_env=False) as client:
                    body = {'operation_id': 'injected-fixture-op', 'prepared_pdf_sha256': 'c' * 64, 'certificado_der_sha256': api.der_hash, 'field_name': 'BranaSignature_1', 'policy_oid': 'policy'}
                    response = await client.post('/api/signature-authorizations/reserve', json=body, headers={'Authorization': f'Bearer {api.token}'})
                    self.assertEqual(response.status_code, 200)
                    authorization_id = response.json()['authorization_id']
                external = sessionmaker(bind=shared_engine)()
                try:
                    row = external.query(SignatureAuthorization).filter_by(authorization_id=authorization_id).one()
                    self.assertEqual(row.status, 'RESERVED')
                finally:
                    external.close()
            self.assertIsNotNone(injected_db.query(SignatureAuthorization).filter_by(authorization_id=authorization_id).one())
        finally:
            injected_db.close()
            shared_engine.dispose()

    async def test_real_https_health_and_cors_preflight(self):
        anycorn = os.environ.get('ANYCORN_PYTHON')
        if not anycorn: self.skipTest('ANYCORN_PYTHON not set')
        async with running_test_bridge(anycorn) as bridge:
            ctx = ssl.create_default_context(cafile=bridge.ca_cert)
            async with httpx.AsyncClient(base_url=bridge.base_url, verify=ctx, trust_env=False) as client:
                health = await client.get('/v1/diagnostics/health', headers={'Origin': 'https://localhost:5173'})
                self.assertEqual(health.status_code, 200)
                preflight = await client.options('/v1/pairing-requests', headers={'Origin': 'https://localhost:5173', 'Access-Control-Request-Method': 'POST'})
                self.assertEqual(preflight.status_code, 204)
                self.assertEqual(preflight.headers.get('access-control-allow-origin'), 'https://localhost:5173')

    async def test_real_node_js_pairing_over_bridge_https(self):
        anycorn = os.environ.get('ANYCORN_PYTHON'); node = shutil.which('node')
        if not anycorn or not node: self.skipTest('ANYCORN_PYTHON and node are required')
        script = Path(__file__).with_name('node_bridge_pairing_client.mjs')
        async with running_test_bridge(anycorn) as bridge:
            env = os.environ.copy(); env['NODE_EXTRA_CA_CERTS'] = bridge.ca_cert
            completed = await asyncio.to_thread(subprocess.run, [node, str(script)], cwd=str(Path(__file__).resolve().parents[2]), env=env, capture_output=True, text=True, timeout=30, check=False)
            self.assertEqual(completed.returncode, 0, completed.stderr)
            self.assertEqual(json.loads(completed.stdout)['state'], 'APPROVED')

    async def test_context_keeps_same_https_sql_server_between_requests(self):
        anycorn = os.environ.get('ANYCORN_PYTHON')
        if not anycorn: self.skipTest('ANYCORN_PYTHON not set')
        async with running_signature_api(anycorn) as api:
            ctx = ssl.create_default_context(cafile=api.ca_cert)
            async with httpx.AsyncClient(base_url=api.base_url, verify=ctx, trust_env=False) as client:
                payload = {'operation_id': 'fixture-op-1', 'prepared_pdf_sha256': 'b'*64, 'certificado_der_sha256': api.der_hash, 'field_name': 'BranaSignature_1', 'policy_oid': 'policy'}
                first = await client.post('/api/signature-authorizations/reserve', json=payload, headers={'Authorization': f'Bearer {api.token}'})
                self.assertEqual(first.status_code, 200); self.assertEqual(first.json()['status'], 'RESERVED')
                second = await client.post('/api/signature-authorizations', json={**payload, 'authorization_id': first.json()['authorization_id'], 'password': 'test-password'}, headers={'Authorization': f'Bearer {api.token}'})
                self.assertEqual(second.status_code, 200); self.assertEqual(second.json()['status'], 'ISSUED')

    async def test_real_node_module_reserves_and_confirms_over_https(self):
        anycorn = os.environ.get('ANYCORN_PYTHON')
        node = shutil.which('node')
        if not anycorn or not node:
            self.skipTest('ANYCORN_PYTHON and node are required')
        script = Path(__file__).with_name('node_signature_authorization_api_client.mjs')
        async with running_signature_api(anycorn) as api:
            env = os.environ.copy()
            env.update({'BRANA_API_FIXTURE_URL': api.base_url, 'BRANA_API_FIXTURE_TOKEN': api.token, 'BRANA_API_FIXTURE_DER_HASH': api.der_hash, 'NODE_EXTRA_CA_CERTS': api.ca_cert})
            completed = await asyncio.to_thread(subprocess.run, [node, str(script)], cwd=str(Path(__file__).resolve().parents[2]), env=env, capture_output=True, text=True, timeout=30, check=False)
            self.assertEqual(completed.returncode, 0, completed.stderr)
            result = json.loads(completed.stdout)
            self.assertEqual(result['reserve']['status'], 200)
            self.assertEqual(result['reserve']['state'], 'RESERVED')
            self.assertEqual(result['confirm']['status'], 200)
            self.assertEqual(result['confirm']['state'], 'ISSUED')
            self.assertEqual(result['reserve']['authorization_id'], result['confirm']['authorization_id'])
            row = api.db.query(SignatureAuthorization).filter_by(operation_id='node-fixture-op-11d3b').one()
            self.assertEqual(row.status, 'ISSUED')


class ApiHttpsHarness(unittest.IsolatedAsyncioTestCase):
    async def test_real_https_sql_mtls_file_pkcs12_concurrent_sign(self):
        anycorn = os.environ.get('ANYCORN_PYTHON'); node = shutil.which('node')
        if not anycorn or not node: self.skipTest('ANYCORN_PYTHON and node are required')
        from local_bridge.tests.test_isolated_file_pkcs12_bridge import _FileTestState, _PreparedFileSigner
        from local_bridge.security.prepared_signer import PreparedPdfSigningRequest
        harness = Path(__file__).resolve().parents[2] / 'local_bridge' / 'native_pkcs12_harness' / 'bin' / 'Release' / 'net8.0-windows' / 'win-x64' / 'BranaNativePkcs12Harness.exe'
        if not harness.exists(): self.skipTest('BranaNativePkcs12Harness Release build required')
        der = base64.b64decode(subprocess.run([str(harness), '--describe'], capture_output=True, check=True).stdout.strip()); signing_hash = hashlib.sha256(der).hexdigest(); events = ['CONSUMED']; combined_ca = None
        from sqlalchemy.pool import StaticPool
        engine = create_engine('sqlite:///:memory:', connect_args={'check_same_thread': False}, poolclass=StaticPool); tables = [Clinica.__table__, PrestadorOdonto.__table__, UnidadeAtendimento.__table__, Lancamento.__table__, ConvenioOdonto.__table__, ProcedimentoGenerico.__table__, Material.__table__, Usuario.__table__, UsuarioCertificado.__table__, SignatureAuthorization.__table__, SignatureReservationRequest.__table__]; Base.metadata.create_all(engine, tables=tables); db = sessionmaker(bind=engine)()
        try:
            async with running_signature_api(anycorn, db=db, engine=engine, test_only_allow_file_pkcs12=True) as api:
                binding = db.query(UsuarioCertificado).one(); binding.certificado_der_sha256 = signing_hash; db.commit(); source = fitz.open(); source.new_page(width=595, height=842).insert_text((100, 300), '<<Cirurgião.AssinaturaDigital>>', fontsize=10); prepared = prepare_signature_anchor(source.tobytes()).pdf_bytes; source.close(); operation_id = 'case-protected'; request = PreparedPdfSigningRequest(prepared, hashlib.sha256(prepared).hexdigest(), 'BranaSignature_1', True, 'pades-ad-rb-1.3', '2.16.76.1.7.1.11.1.3', operation_id, signing_hash, 'FILE_PKCS12'); signer = _PreparedFileSigner(request, lambda: db.query(SignatureAuthorization).order_by(SignatureAuthorization.id.desc()).first().authorization_id, der, events)
                async with running_signature_consume_mtls(anycorn, db=db, engine=engine, update_signature_binding=False, test_only_allow_file_pkcs12=True) as consume:
                    consumer = OnlineAuthorizationConsumer(OnlineAuthorizationConfig(consume.endpoint, consume.ca_cert, consume.client_cert, consume.client_key)); forwarder = ReservationChallengeForwarder(ReservationChallengeConfig(consume.challenge_endpoint, consume.ca_cert, consume.client_cert, consume.client_key)); combined_ca = tempfile.NamedTemporaryFile(prefix='brana-file-concurrent-', suffix='.crt', delete=False); combined_ca.write(Path(api.ca_cert).read_bytes() + Path(consume.ca_cert).read_bytes()); combined_ca.flush(); combined_ca.close(); env = os.environ.copy(); env.update({'NODE_EXTRA_CA_CERTS': combined_ca.name, 'BRANA_API_FIXTURE_URL': api.base_url, 'BRANA_API_FIXTURE_TOKEN': api.token, 'BRANA_SIGNING_DER_HASH': signing_hash, 'BRANA_CERTIFICATE_SOURCE': 'FILE_PKCS12', 'BRANA_OPERATION_ID': operation_id, 'BRANA_PREPARED_PDF_B64': base64.b64encode(prepared).decode('ascii'), 'BRANA_CONCURRENT_SIGN': '1'})
                    async with running_test_bridge(anycorn, online_authorization_consumer=consumer.consume, signer=signer, reservation_challenge_forwarder=forwarder.forward, enable_test_reservation_challenge=True, test_only_state=_FileTestState(authorize=lambda context, action: True)) as bridge:
                        Path(combined_ca.name).write_bytes(Path(api.ca_cert).read_bytes() + Path(consume.ca_cert).read_bytes() + Path(bridge.ca_cert).read_bytes()); completed = await asyncio.to_thread(subprocess.run, [node, str(Path(__file__).with_name('node_coordinated_signature_client.mjs'))], cwd=str(Path(__file__).resolve().parents[2]), env=env, capture_output=True, text=True, timeout=45, check=False); self.assertEqual(completed.returncode, 0, completed.stderr); result = json.loads(completed.stdout); self.assertEqual(sorted(r['status'] for r in result['responses']), [200, 409], f"SANITIZED_CONCURRENCY_DIAGNOSTIC stdout={completed.stdout!r} stderr_code_only={completed.stderr.splitlines()[-1:]!r} events={events!r} sql={[row.status for row in db.query(SignatureAuthorization).all()]}"); self.assertEqual(result['result_status'], 200); self.assertEqual(signer.calls, 1); self.assertEqual(db.query(SignatureAuthorization).filter_by(status='CONSUMED').count(), 1); self.assertIn('HELPER_PROCESS_STARTED', events)
        finally:
            if combined_ca: Path(combined_ca.name).unlink(missing_ok=True)
            db.close(); engine.dispose()

    async def test_real_https_sql_mtls_file_pkcs12_post_consumed_failures(self):
        anycorn = os.environ.get('ANYCORN_PYTHON'); node = shutil.which('node')
        if not anycorn or not node: self.skipTest('ANYCORN_PYTHON and node are required')
        from local_bridge.tests.test_isolated_file_pkcs12_bridge import _FileTestState, _PreparedFileSigner
        from local_bridge.security.prepared_signer import PreparedPdfSigningRequest
        harness = Path(__file__).resolve().parents[2] / 'local_bridge' / 'native_pkcs12_harness' / 'bin' / 'Release' / 'net8.0-windows' / 'win-x64' / 'BranaNativePkcs12Harness.exe'
        if not harness.exists(): self.skipTest('BranaNativePkcs12Harness Release build required')
        der = base64.b64decode(subprocess.run([str(harness), '--describe'], capture_output=True, check=True).stdout.strip()); signing_hash = hashlib.sha256(der).hexdigest()
        from sqlalchemy.pool import StaticPool
        for operation_id, expected_code in (('case-cancel', 'PKCS12_CANCELLED'), ('case-wrong-password', 'PKCS12_PASSWORD_INVALID')):
            engine = create_engine('sqlite:///:memory:', connect_args={'check_same_thread': False}, poolclass=StaticPool); tables = [Clinica.__table__, PrestadorOdonto.__table__, UnidadeAtendimento.__table__, Lancamento.__table__, ConvenioOdonto.__table__, ProcedimentoGenerico.__table__, Material.__table__, Usuario.__table__, UsuarioCertificado.__table__, SignatureAuthorization.__table__, SignatureReservationRequest.__table__]; Base.metadata.create_all(engine, tables=tables); db = sessionmaker(bind=engine)(); combined_ca = None; events = ['CONSUMED']
            try:
                async with running_signature_api(anycorn, db=db, engine=engine, test_only_allow_file_pkcs12=True) as api:
                    binding = db.query(UsuarioCertificado).one(); binding.certificado_der_sha256 = signing_hash; db.commit(); source = fitz.open(); source.new_page(width=595, height=842).insert_text((100, 300), '<<Cirurgião.AssinaturaDigital>>', fontsize=10); prepared = prepare_signature_anchor(source.tobytes()).pdf_bytes; source.close(); request = PreparedPdfSigningRequest(prepared, hashlib.sha256(prepared).hexdigest(), 'BranaSignature_1', True, 'pades-ad-rb-1.3', '2.16.76.1.7.1.11.1.3', operation_id, signing_hash, 'FILE_PKCS12'); signer = _PreparedFileSigner(request, lambda: db.query(SignatureAuthorization).order_by(SignatureAuthorization.id.desc()).first().authorization_id, der, events)
                    async with running_signature_consume_mtls(anycorn, db=db, engine=engine, update_signature_binding=False, test_only_allow_file_pkcs12=True) as consume:
                        consumer = OnlineAuthorizationConsumer(OnlineAuthorizationConfig(consume.endpoint, consume.ca_cert, consume.client_cert, consume.client_key)); forwarder = ReservationChallengeForwarder(ReservationChallengeConfig(consume.challenge_endpoint, consume.ca_cert, consume.client_cert, consume.client_key)); combined_ca = tempfile.NamedTemporaryFile(prefix='brana-file-post-consumed-', suffix='.crt', delete=False); combined_ca.write(Path(api.ca_cert).read_bytes() + Path(consume.ca_cert).read_bytes()); combined_ca.flush(); combined_ca.close(); env = os.environ.copy(); env.update({'NODE_EXTRA_CA_CERTS': combined_ca.name, 'BRANA_API_FIXTURE_URL': api.base_url, 'BRANA_API_FIXTURE_TOKEN': api.token, 'BRANA_SIGNING_DER_HASH': signing_hash, 'BRANA_CERTIFICATE_SOURCE': 'FILE_PKCS12', 'BRANA_OPERATION_ID': operation_id, 'BRANA_PREPARED_PDF_B64': base64.b64encode(prepared).decode('ascii'), 'BRANA_EXPECT_SIGNER_FAILURE': '1'})
                        async with running_test_bridge(anycorn, online_authorization_consumer=consumer.consume, signer=signer, reservation_challenge_forwarder=forwarder.forward, enable_test_reservation_challenge=True, test_only_state=_FileTestState(authorize=lambda context, action: True)) as bridge:
                            Path(combined_ca.name).write_bytes(Path(api.ca_cert).read_bytes() + Path(consume.ca_cert).read_bytes() + Path(bridge.ca_cert).read_bytes()); completed = await asyncio.to_thread(subprocess.run, [node, str(Path(__file__).with_name('node_coordinated_signature_client.mjs'))], cwd=str(Path(__file__).resolve().parents[2]), env=env, capture_output=True, text=True, timeout=45, check=False); self.assertEqual(completed.returncode, 0, completed.stderr); result = json.loads(completed.stdout); self.assertEqual(result['rejection_code'], expected_code.replace('PKCS12_', 'FILE_PKCS12_')); self.assertEqual(result['operation_state'], 'FAILED'); self.assertIn(result['retry_code'], {'OPERATION_NOT_APPROVED', 'SIGNING_IN_PROGRESS'}); self.assertEqual(signer.calls, 1); self.assertIn('CONSUMED', events); self.assertIn('HELPER_PROCESS_STARTED', events); self.assertLess(events.index('CONSUMED'), events.index('HELPER_PROCESS_STARTED')); self.assertEqual(db.query(SignatureAuthorization).filter_by(status='CONSUMED').count(), 1)
            finally:
                if combined_ca: Path(combined_ca.name).unlink(missing_ok=True)
                db.close(); engine.dispose()

    async def test_real_https_sql_mtls_file_pkcs12_source_and_reserved_negatives(self):
        anycorn = os.environ.get('ANYCORN_PYTHON'); node = shutil.which('node')
        if not anycorn or not node: self.skipTest('ANYCORN_PYTHON and node are required')
        from local_bridge.tests.test_isolated_file_pkcs12_bridge import _FileTestState, _PreparedFileSigner
        from local_bridge.security.prepared_signer import PreparedPdfSigningRequest
        harness = Path(__file__).resolve().parents[2] / 'local_bridge' / 'native_pkcs12_harness' / 'bin' / 'Release' / 'net8.0-windows' / 'win-x64' / 'BranaNativePkcs12Harness.exe'
        if not harness.exists(): self.skipTest('BranaNativePkcs12Harness Release build required')
        der = base64.b64decode(subprocess.run([str(harness), '--describe'], capture_output=True, check=True).stdout.strip()); signing_hash = hashlib.sha256(der).hexdigest()
        from sqlalchemy.pool import StaticPool
        for case in ('source-mismatch', 'reserved'):
            engine = create_engine('sqlite:///:memory:', connect_args={'check_same_thread': False}, poolclass=StaticPool); tables = [Clinica.__table__, PrestadorOdonto.__table__, UnidadeAtendimento.__table__, Lancamento.__table__, ConvenioOdonto.__table__, ProcedimentoGenerico.__table__, Material.__table__, Usuario.__table__, UsuarioCertificado.__table__, SignatureAuthorization.__table__, SignatureReservationRequest.__table__]; Base.metadata.create_all(engine, tables=tables); db = sessionmaker(bind=engine)(); combined_ca = None; events = ['CONSUMED']
            try:
                async with running_signature_api(anycorn, db=db, engine=engine, test_only_allow_file_pkcs12=True) as api:
                    binding = db.query(UsuarioCertificado).one(); binding.certificado_der_sha256 = signing_hash; db.commit(); source = fitz.open(); source.new_page(width=595, height=842).insert_text((100, 300), '<<Cirurgião.AssinaturaDigital>>', fontsize=10); prepared = prepare_signature_anchor(source.tobytes()).pdf_bytes; source.close(); operation_id = f'case-{case}'; request = PreparedPdfSigningRequest(prepared, hashlib.sha256(prepared).hexdigest(), 'BranaSignature_1', True, 'pades-ad-rb-1.3', '2.16.76.1.7.1.11.1.3', operation_id, signing_hash, 'FILE_PKCS12'); signer = _PreparedFileSigner(request, lambda: db.query(SignatureAuthorization).order_by(SignatureAuthorization.id.desc()).first().authorization_id, der, events)
                    async with running_signature_consume_mtls(anycorn, db=db, engine=engine, update_signature_binding=False, test_only_allow_file_pkcs12=True) as consume:
                        consumer = OnlineAuthorizationConsumer(OnlineAuthorizationConfig(consume.endpoint, consume.ca_cert, consume.client_cert, consume.client_key)); forwarder = ReservationChallengeForwarder(ReservationChallengeConfig(consume.challenge_endpoint, consume.ca_cert, consume.client_cert, consume.client_key)); combined_ca = tempfile.NamedTemporaryFile(prefix='brana-file-negative-ca-', suffix='.crt', delete=False); combined_ca.write(Path(api.ca_cert).read_bytes() + Path(consume.ca_cert).read_bytes()); combined_ca.flush(); combined_ca.close(); env = os.environ.copy(); env.update({'NODE_EXTRA_CA_CERTS': combined_ca.name, 'BRANA_API_FIXTURE_URL': api.base_url, 'BRANA_API_FIXTURE_TOKEN': api.token, 'BRANA_SIGNING_DER_HASH': signing_hash, 'BRANA_CERTIFICATE_SOURCE': 'FILE_PKCS12', 'BRANA_OPERATION_ID': operation_id, 'BRANA_PREPARED_PDF_B64': base64.b64encode(prepared).decode('ascii'), 'BRANA_EXPECT_OPERATION_REJECTION': '1'}); env['BRANA_OPERATION_SOURCE'] = 'WINDOWS_STORE' if case == 'source-mismatch' else 'FILE_PKCS12'; env['BRANA_SKIP_CONFIRM'] = '1' if case == 'reserved' else '0'
                        async with running_test_bridge(anycorn, online_authorization_consumer=consumer.consume, signer=signer, reservation_challenge_forwarder=forwarder.forward, enable_test_reservation_challenge=True, test_only_state=_FileTestState(authorize=lambda context, action: True)) as bridge:
                            Path(combined_ca.name).write_bytes(Path(api.ca_cert).read_bytes() + Path(consume.ca_cert).read_bytes() + Path(bridge.ca_cert).read_bytes()); completed = await asyncio.to_thread(subprocess.run, [node, str(Path(__file__).with_name('node_coordinated_signature_client.mjs'))], cwd=str(Path(__file__).resolve().parents[2]), env=env, capture_output=True, text=True, timeout=45, check=False); self.assertEqual(completed.returncode, 0, completed.stderr); result = json.loads(completed.stdout); self.assertEqual(signer.calls, 0); self.assertNotIn('HELPER_PROCESS_STARTED', events); self.assertEqual(db.query(SignatureAuthorization).filter_by(status='CONSUMED').count(), 0); expected_state = 'RESERVED' if case == 'reserved' else 'ISSUED'; self.assertEqual(db.query(SignatureAuthorization).filter_by(status=expected_state).count(), 1); self.assertIn(result['rejection_code'], {'PREPARED_PDF_CONTRACT_INVALID', 'ONLINE_AUTHORIZATION_REJECTED'})
            finally:
                if combined_ca: Path(combined_ca.name).unlink(missing_ok=True)
                db.close(); engine.dispose()

    async def test_real_https_sql_mtls_file_pkcs12_der_mismatch_before_helper(self):
        anycorn = os.environ.get('ANYCORN_PYTHON'); node = shutil.which('node')
        if not anycorn or not node: self.skipTest('ANYCORN_PYTHON and node are required')
        from local_bridge.tests.test_isolated_file_pkcs12_bridge import _FileTestState, _PreparedFileSigner
        from local_bridge.security.prepared_signer import PreparedPdfSigningRequest
        harness = Path(__file__).resolve().parents[2] / 'local_bridge' / 'native_pkcs12_harness' / 'bin' / 'Release' / 'net8.0-windows' / 'win-x64' / 'BranaNativePkcs12Harness.exe'
        if not harness.exists(): self.skipTest('BranaNativePkcs12Harness Release build required')
        der = base64.b64decode(subprocess.run([str(harness), '--describe'], capture_output=True, check=True).stdout.strip()); signing_hash = hashlib.sha256(der).hexdigest(); other_hash = 'b' * 64; events = ['CONSUMED']; combined_ca = None
        from sqlalchemy.pool import StaticPool
        shared_engine = create_engine('sqlite:///:memory:', connect_args={'check_same_thread': False}, poolclass=StaticPool)
        tables = [Clinica.__table__, PrestadorOdonto.__table__, UnidadeAtendimento.__table__, Lancamento.__table__, ConvenioOdonto.__table__, ProcedimentoGenerico.__table__, Material.__table__, Usuario.__table__, UsuarioCertificado.__table__, SignatureAuthorization.__table__, SignatureReservationRequest.__table__]
        Base.metadata.create_all(shared_engine, tables=tables); db = sessionmaker(bind=shared_engine)(); signer = None
        try:
            async with running_signature_api(anycorn, db=db, engine=shared_engine, test_only_allow_file_pkcs12=True) as api:
                binding = db.query(UsuarioCertificado).one(); binding.certificado_der_sha256 = signing_hash; db.commit()
                source = fitz.open(); source.new_page(width=595, height=842).insert_text((100, 300), '<<Cirurgião.AssinaturaDigital>>', fontsize=10); prepared = prepare_signature_anchor(source.tobytes()).pdf_bytes; source.close(); operation_id = 'case-der-mismatch'; pdf_hash = hashlib.sha256(prepared).hexdigest()
                request = PreparedPdfSigningRequest(prepared, pdf_hash, 'BranaSignature_1', True, 'pades-ad-rb-1.3', '2.16.76.1.7.1.11.1.3', operation_id, signing_hash, 'FILE_PKCS12')
                signer = _PreparedFileSigner(request, lambda: db.query(SignatureAuthorization).order_by(SignatureAuthorization.id.desc()).first().authorization_id, der, events)
                async with running_signature_consume_mtls(anycorn, db=db, engine=shared_engine, update_signature_binding=False, test_only_allow_file_pkcs12=True) as consume:
                    consumer = OnlineAuthorizationConsumer(OnlineAuthorizationConfig(consume.endpoint, consume.ca_cert, consume.client_cert, consume.client_key)); forwarder = ReservationChallengeForwarder(ReservationChallengeConfig(consume.challenge_endpoint, consume.ca_cert, consume.client_cert, consume.client_key))
                    combined_ca = tempfile.NamedTemporaryFile(prefix='brana-file-negative-ca-', suffix='.crt', delete=False); combined_ca.write(Path(api.ca_cert).read_bytes() + Path(consume.ca_cert).read_bytes()); combined_ca.flush(); combined_ca.close()
                    env = os.environ.copy(); env.update({'NODE_EXTRA_CA_CERTS': combined_ca.name, 'BRANA_API_FIXTURE_URL': api.base_url, 'BRANA_API_FIXTURE_TOKEN': api.token, 'BRANA_SIGNING_DER_HASH': signing_hash, 'BRANA_OPERATION_DER_HASH': other_hash, 'BRANA_EXPECT_OPERATION_REJECTION': '1', 'BRANA_CERTIFICATE_SOURCE': 'FILE_PKCS12', 'BRANA_OPERATION_ID': operation_id, 'BRANA_PREPARED_PDF_B64': base64.b64encode(prepared).decode('ascii')})
                    async with running_test_bridge(anycorn, online_authorization_consumer=consumer.consume, signer=signer, reservation_challenge_forwarder=forwarder.forward, enable_test_reservation_challenge=True, test_only_state=_FileTestState(authorize=lambda context, action: True)) as bridge:
                        Path(combined_ca.name).write_bytes(Path(api.ca_cert).read_bytes() + Path(consume.ca_cert).read_bytes() + Path(bridge.ca_cert).read_bytes())
                        completed = await asyncio.to_thread(subprocess.run, [node, str(Path(__file__).with_name('node_coordinated_signature_client.mjs'))], cwd=str(Path(__file__).resolve().parents[2]), env=env, capture_output=True, text=True, timeout=45, check=False)
                        self.assertEqual(completed.returncode, 0, completed.stderr); result = json.loads(completed.stdout); self.assertEqual(result['rejection_code'], 'PREPARED_PDF_CONTRACT_INVALID'); self.assertEqual(result['reserved_state'], 'RESERVED'); self.assertEqual(signer.calls, 0); self.assertNotIn('HELPER_PROCESS_STARTED', events); self.assertEqual(db.query(SignatureAuthorization).filter_by(status='CONSUMED').count(), 0); self.assertEqual(db.query(SignatureAuthorization).filter_by(status='ISSUED').count(), 1)
        finally:
            if combined_ca: Path(combined_ca.name).unlink(missing_ok=True)
            db.close(); shared_engine.dispose()

    async def test_real_https_sql_mtls_file_pkcs12_result(self):
        """Coordinated FILE_PKCS12 proof; all FILE wiring is test-only injection."""
        anycorn = os.environ.get('ANYCORN_PYTHON'); node = shutil.which('node')
        if not anycorn or not node:
            self.skipTest('ANYCORN_PYTHON and node are required')
        from local_bridge.tests.test_isolated_file_pkcs12_bridge import _FileTestState, _PreparedFileSigner
        from local_bridge.security.prepared_signer import PreparedPdfSigningRequest
        harness = Path(__file__).resolve().parents[2] / 'local_bridge' / 'native_pkcs12_harness' / 'bin' / 'Release' / 'net8.0-windows' / 'win-x64' / 'BranaNativePkcs12Harness.exe'
        if not harness.exists():
            self.skipTest('BranaNativePkcs12Harness Release build required')
        der = base64.b64decode(subprocess.run([str(harness), '--describe'], capture_output=True, check=True).stdout.strip())
        signing_hash = hashlib.sha256(der).hexdigest(); events = ['CONSUMED']; signer = None; combined_ca = None
        from sqlalchemy.pool import StaticPool
        shared_engine = create_engine('sqlite:///:memory:', connect_args={'check_same_thread': False}, poolclass=StaticPool)
        tables = [Clinica.__table__, PrestadorOdonto.__table__, UnidadeAtendimento.__table__, Lancamento.__table__, ConvenioOdonto.__table__, ProcedimentoGenerico.__table__, Material.__table__, Usuario.__table__, UsuarioCertificado.__table__, SignatureAuthorization.__table__, SignatureReservationRequest.__table__]
        Base.metadata.create_all(shared_engine, tables=tables); db = sessionmaker(bind=shared_engine)()
        try:
            async with running_signature_api(anycorn, db=db, engine=shared_engine, test_only_allow_file_pkcs12=True) as api:
                binding = db.query(UsuarioCertificado).one(); binding.certificado_der_sha256 = signing_hash; db.commit()
                source = fitz.open(); source.new_page(width=595, height=842).insert_text((100, 300), '<<Cirurgião.AssinaturaDigital>>', fontsize=10); prepared = prepare_signature_anchor(source.tobytes()).pdf_bytes; source.close()
                operation_id = 'case-protected'; pdf_hash = hashlib.sha256(prepared).hexdigest()
                signing_request = PreparedPdfSigningRequest(prepared, pdf_hash, 'BranaSignature_1', True, 'pades-ad-rb-1.3', '2.16.76.1.7.1.11.1.3', operation_id, signing_hash, 'FILE_PKCS12')
                signer = _PreparedFileSigner(signing_request, lambda: db.query(SignatureAuthorization).order_by(SignatureAuthorization.id.desc()).first().authorization_id, der, events)
                async with running_signature_consume_mtls(anycorn, db=db, engine=shared_engine, update_signature_binding=False, test_only_allow_file_pkcs12=True) as consume:
                    consumer = OnlineAuthorizationConsumer(OnlineAuthorizationConfig(consume.endpoint, consume.ca_cert, consume.client_cert, consume.client_key))
                    challenge_forwarder = ReservationChallengeForwarder(ReservationChallengeConfig(consume.challenge_endpoint, consume.ca_cert, consume.client_cert, consume.client_key))
                    combined_ca = tempfile.NamedTemporaryFile(prefix='brana-file-node-ca-', suffix='.crt', delete=False); combined_ca.write(Path(api.ca_cert).read_bytes()); combined_ca.write(Path(consume.ca_cert).read_bytes()); combined_ca.flush(); combined_ca.close()
                    env = os.environ.copy(); env.update({'NODE_EXTRA_CA_CERTS': combined_ca.name, 'BRANA_API_FIXTURE_URL': api.base_url, 'BRANA_API_FIXTURE_TOKEN': api.token, 'BRANA_SIGNING_DER_HASH': signing_hash, 'BRANA_CERTIFICATE_SOURCE': 'FILE_PKCS12', 'BRANA_OPERATION_ID': operation_id, 'BRANA_PREPARED_PDF_B64': base64.b64encode(prepared).decode('ascii')})
                    async with running_test_bridge(anycorn, online_authorization_consumer=consumer.consume, signer=signer, reservation_challenge_forwarder=challenge_forwarder.forward, enable_test_reservation_challenge=True, test_only_state=_FileTestState(authorize=lambda context, action: True)) as bridge:
                        Path(combined_ca.name).write_bytes(Path(api.ca_cert).read_bytes() + Path(consume.ca_cert).read_bytes() + Path(bridge.ca_cert).read_bytes())
                        completed = await asyncio.to_thread(subprocess.run, [node, str(Path(__file__).with_name('node_coordinated_signature_client.mjs'))], cwd=str(Path(__file__).resolve().parents[2]), env=env, capture_output=True, text=True, timeout=45, check=False)
                        self.assertEqual(completed.returncode, 0, completed.stderr)
                        result = json.loads(completed.stdout); self.assertEqual(result['sign_state'], 'COMPLETED'); self.assertEqual(result['result_status'], 200); self.assertEqual(signer.calls, 1); self.assertEqual(db.query(SignatureAuthorization).filter_by(status='CONSUMED').count(), 1); self.assertIn('CONSUMED', events); self.assertIn('HELPER_PROCESS_STARTED', events); self.assertLess(events.index('CONSUMED'), events.index('HELPER_PROCESS_STARTED'))
                        independent = sessionmaker(bind=shared_engine)()
                        try:
                            reservation = independent.query(SignatureReservationRequest).one(); authorization = independent.query(SignatureAuthorization).one()
                            self.assertEqual(reservation.certificate_source, 'FILE_PKCS12'); self.assertEqual(authorization.certificate_source, 'FILE_PKCS12'); self.assertEqual(authorization.status, 'CONSUMED'); self.assertEqual(reservation.certificado_der_sha256, signing_hash); self.assertNotEqual(signing_hash, consume.der_hash)
                        finally:
                            independent.close()
        finally:
            if combined_ca: Path(combined_ca.name).unlink(missing_ok=True)
            db.close(); shared_engine.dispose()

    async def test_real_https_bearer_reserve_and_confirm(self):
        anycorn = os.environ.get('ANYCORN_PYTHON')
        if not anycorn:
            self.skipTest('ANYCORN_PYTHON not set')
        async with running_signature_api(anycorn) as api:
            ctx = ssl.create_default_context(cafile=api.ca_cert)
            async with httpx.AsyncClient(base_url=api.base_url, verify=ctx, trust_env=False) as client:
                body = dict(operation_id='op-api-11d', prepared_pdf_sha256='b' * 64, certificado_der_sha256=api.der_hash, field_name='BranaSignature_1', policy_oid='policy')
                headers = {'Authorization': f'Bearer {api.token}'}
                reserved = await client.post('/api/signature-authorizations/reserve', json=body, headers=headers)
                self.assertEqual(reserved.status_code, 200)
                self.assertEqual(reserved.json()['status'], 'RESERVED')
                row = api.db.query(SignatureAuthorization).filter_by(operation_id='op-api-11d').one()
                self.assertEqual(row.status, 'RESERVED')
                wrong = await client.post('/api/signature-authorizations', json={**body, 'authorization_id': row.authorization_id, 'password': 'wrong'}, headers=headers)
                self.assertEqual(wrong.status_code, 401)
                api.db.refresh(row)
                self.assertEqual(row.status, 'RESERVED')
                confirmed = await client.post('/api/signature-authorizations', json={**body, 'authorization_id': row.authorization_id, 'password': 'test-password'}, headers=headers)
                self.assertEqual(confirmed.status_code, 200)
                api.db.refresh(row)
                self.assertEqual(row.status, 'ISSUED')
                self.assertEqual((await client.post('/api/signature-authorizations/reserve', json=body)).status_code, 401)


if __name__ == '__main__': unittest.main()
