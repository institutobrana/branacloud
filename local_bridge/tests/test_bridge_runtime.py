import unittest
import hashlib
from datetime import datetime, timedelta, timezone
from cryptography import x509
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.x509.oid import ExtendedKeyUsageOID, NameOID
from local_bridge.secure_bridge_app import create_secure_bridge_runtime
from local_bridge.security.instance import InstanceAlreadyRunning
from local_bridge.security.instance_runtime import InMemoryInstanceLockFactory
from local_bridge.security.tls import TLSMaterialError
from local_bridge.security.prepared_signer import FakePreparedPdfSigner
from local_bridge.security.prepared_signer import PreparedPdfSigningRequest

def tls_pair():
    key=rsa.generate_private_key(public_exponent=65537,key_size=2048); now=datetime.now(timezone.utc)
    b=x509.CertificateBuilder().subject_name(x509.Name([x509.NameAttribute(NameOID.COMMON_NAME,'localhost')])).issuer_name(x509.Name([x509.NameAttribute(NameOID.COMMON_NAME,'localhost')])).public_key(key.public_key()).serial_number(x509.random_serial_number()).not_valid_before(now-timedelta(minutes=1)).not_valid_after(now+timedelta(days=1)).add_extension(x509.SubjectAlternativeName([x509.DNSName('localhost')]),False).add_extension(x509.ExtendedKeyUsage([ExtendedKeyUsageOID.SERVER_AUTH]),False)
    c=b.sign(key,hashes.SHA256())
    return c.public_bytes(serialization.Encoding.PEM),key.private_bytes(serialization.Encoding.PEM,serialization.PrivateFormat.PKCS8,serialization.NoEncryption())

class BridgeRuntime(unittest.TestCase):
    def test_signer_injection_is_required(self):
        cert, key = tls_pair()
        with self.assertRaisesRegex(RuntimeError, "OPERATIONAL_SIGNER_FACTORY_REQUIRED"):
            create_secure_bridge_runtime(cert_pem=cert, key_pem=key, signer=None)

    def test_operational_factory_is_injected_without_startup_signer_creation(self):
        cert, key = tls_pair(); events = []
        def factory(selector):
            events.append(selector)
            return FakePreparedPdfSigner()
        selector = lambda: {"chain_valid": True}
        runtime = create_secure_bridge_runtime(cert_pem=cert, key_pem=key, candidate_selector=selector, operational_signer_factory=factory)
        self.assertIsNotNone(runtime.service)
        self.assertEqual(events, [])
        body = b"synthetic"
        runtime.service._prepared_signer.sign_prepared(PreparedPdfSigningRequest(body, hashlib.sha256(body).hexdigest(), "BranaSignature_1", True, "pades-ad-rb-1.3", "2.16.76.1.7.1.11.1.3", "op", "binding"))
        self.assertEqual(events, [selector])

    def test_tls_is_required_and_app_has_only_v1_routes(self):
        cert,key=tls_pair(); runtime=create_secure_bridge_runtime(cert_pem=cert,key_pem=key, signer=FakePreparedPdfSigner())
        paths={route.path for route in runtime.create_app().routes}
        self.assertIn('/v1/pairing-requests',paths); self.assertNotIn('/assinar-pdf',paths); self.assertNotIn('/certificados',paths)
        with self.assertRaises(TLSMaterialError): create_secure_bridge_runtime(cert_pem=b'bad',key_pem=b'bad', signer=FakePreparedPdfSigner())
    def test_lock_is_injected_and_preview_is_in_memory(self):
        cert,key=tls_pair(); factory=InMemoryInstanceLockFactory(); first=factory.create('bridge-test'); second=factory.create('bridge-test'); runtime=create_secure_bridge_runtime(cert_pem=cert,key_pem=key, signer=FakePreparedPdfSigner(),lock=first); runtime.acquire_instance()
        with self.assertRaises(InstanceAlreadyRunning): second.acquire()
        runtime.release_instance(); second.acquire(); second.release()

if __name__=='__main__': unittest.main()
