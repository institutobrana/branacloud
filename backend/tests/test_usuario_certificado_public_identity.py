import hashlib
import sys
import unittest
from datetime import datetime, timedelta, timezone

from cryptography import x509
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.x509.oid import NameOID

from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from routes.usuario_certificado_routes import parse_public_certificate


def certificate_der_and_pfx():
    key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    subject = issuer = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, "synthetic-file")])
    cert = (x509.CertificateBuilder().subject_name(subject).issuer_name(issuer).public_key(key.public_key())
            .serial_number(x509.random_serial_number()).not_valid_before(datetime.now(timezone.utc) - timedelta(minutes=1))
            .not_valid_after(datetime.now(timezone.utc) + timedelta(days=30)).add_extension(
                x509.KeyUsage(digital_signature=True, content_commitment=False, key_encipherment=False,
                              data_encipherment=False, key_agreement=False, key_cert_sign=False,
                              crl_sign=False, encipher_only=False, decipher_only=False), critical=True)
            .sign(key, hashes.SHA256()))
    der = cert.public_bytes(serialization.Encoding.DER)
    # The PFX is test-only and never enters the route; it proves PFX bytes are not accepted as .cer.
    from cryptography.hazmat.primitives.serialization import pkcs12
    pfx = pkcs12.serialize_key_and_certificates(b"synthetic", key, cert, None, serialization.BestAvailableEncryption(b"test"))
    return der, pfx


class PublicCertificateIdentityTests(unittest.TestCase):
    def test_der_and_pem_produce_server_hash_and_public_metadata(self):
        der, _ = certificate_der_and_pfx()
        parsed = parse_public_certificate(der)
        self.assertEqual(parsed["sha256"], hashlib.sha256(der).hexdigest())
        self.assertEqual(parsed["der"], der)
        self.assertEqual(parsed["subject"], "CN=synthetic-file")

    def test_malformed_and_pfx_are_rejected(self):
        der, pfx = certificate_der_and_pfx()
        for value in (b"not-a-certificate", pfx):
            with self.assertRaises(ValueError):
                parse_public_certificate(value)
        self.assertNotEqual(hashlib.sha256(pfx).hexdigest(), hashlib.sha256(der).hexdigest())


if __name__ == "__main__":
    unittest.main()
