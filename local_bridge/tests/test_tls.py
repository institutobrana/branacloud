import unittest
from datetime import datetime, timedelta, timezone
from cryptography import x509
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.x509.oid import NameOID, ExtendedKeyUsageOID
from local_bridge.security.tls import TLSMaterialError, validate_tls_material

def material(offset=timedelta(0), san=True, eku=True):
    key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    now = datetime.now(timezone.utc) + offset
    builder = x509.CertificateBuilder().subject_name(x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, "localhost")])).issuer_name(x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, "localhost")])).public_key(key.public_key()).serial_number(x509.random_serial_number()).not_valid_before(now - timedelta(minutes=1)).not_valid_after(now + timedelta(days=1))
    if san: builder = builder.add_extension(x509.SubjectAlternativeName([x509.DNSName("localhost")]), critical=False)
    if eku: builder = builder.add_extension(x509.ExtendedKeyUsage([ExtendedKeyUsageOID.SERVER_AUTH]), critical=False)
    cert = builder.sign(key, hashes.SHA256())
    return cert.public_bytes(serialization.Encoding.PEM), key.private_bytes(serialization.Encoding.PEM, serialization.PrivateFormat.PKCS8, serialization.NoEncryption())

class TLS(unittest.TestCase):
    def test_valid_material(self): self.assertEqual(validate_tls_material(*material()).san_hosts, ("localhost",))
    def test_invalid_cases(self):
        for args, code in [((b"", b""), "TLS_MATERIAL_INVALID"), (material(offset=timedelta(days=2)), "TLS_CERTIFICATE_NOT_YET_VALID"), (material(offset=timedelta(days=-2)), "TLS_CERTIFICATE_EXPIRED"), (material(san=False), "TLS_SAN_REQUIRED"), (material(eku=False), "TLS_SERVER_AUTH_REQUIRED")]:
            with self.subTest(code=code):
                with self.assertRaisesRegex(TLSMaterialError, code): validate_tls_material(*args)
    def test_mismatched_key(self):
        cert, _ = material(); _, key = material();
        with self.assertRaisesRegex(TLSMaterialError, "TLS_KEY_MISMATCH"): validate_tls_material(cert, key)

if __name__ == "__main__": unittest.main()
