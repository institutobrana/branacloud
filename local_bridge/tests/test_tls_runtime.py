import unittest
from datetime import datetime, timedelta, timezone
from cryptography import x509
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.x509.oid import NameOID, ExtendedKeyUsageOID
from local_bridge.security.tls import TLSMaterialError
from local_bridge.security.tls_runtime import TLSRuntimeConfig, validate_runtime_tls

def pair(san="localhost", eku=True, offset=timedelta(0)):
    key=rsa.generate_private_key(public_exponent=65537,key_size=2048); now=datetime.now(timezone.utc)+offset
    b=x509.CertificateBuilder().subject_name(x509.Name([x509.NameAttribute(NameOID.COMMON_NAME,san)])).issuer_name(x509.Name([x509.NameAttribute(NameOID.COMMON_NAME,san)])).public_key(key.public_key()).serial_number(x509.random_serial_number()).not_valid_before(now-timedelta(minutes=1)).not_valid_after(now+timedelta(days=1)).add_extension(x509.SubjectAlternativeName([x509.DNSName(san)]),False)
    if eku: b=b.add_extension(x509.ExtendedKeyUsage([ExtendedKeyUsageOID.SERVER_AUTH]),False)
    c=b.sign(key,hashes.SHA256())
    return c.public_bytes(serialization.Encoding.PEM),key.private_bytes(serialization.Encoding.PEM,serialization.PrivateFormat.PKCS8,serialization.NoEncryption())

class TLSRuntime(unittest.TestCase):
    def test_valid_and_rejections(self):
        self.assertEqual(validate_runtime_tls(*pair()).san_hosts, ("localhost",))
        with self.assertRaisesRegex(TLSMaterialError,"TLS_SAN_REQUIRED"): validate_runtime_tls(*pair("wrong"))
        with self.assertRaisesRegex(TLSMaterialError,"TLS_SERVER_AUTH_REQUIRED"): validate_runtime_tls(*pair(eku=False))
        with self.assertRaisesRegex(TLSMaterialError,"TLS_CERTIFICATE_EXPIRED"): validate_runtime_tls(*pair(offset=timedelta(days=-2)))
        with self.assertRaisesRegex(TLSMaterialError,"TLS_ENDPOINT_NOT_ALLOWED"): validate_runtime_tls(*pair(), TLSRuntimeConfig("127.0.0.1",8765))

if __name__ == "__main__": unittest.main()
