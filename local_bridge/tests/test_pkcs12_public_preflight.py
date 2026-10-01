import hashlib
import sys
import tempfile
import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from cryptography import x509
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.x509.oid import NameOID

from security.pkcs12_public_preflight import (
    PublicCertificatePreflightError,
    inspect_public_certificate_file,
)


def certificate(common_name: str):
    key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    name = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, common_name)])
    cert = (
        x509.CertificateBuilder()
        .subject_name(name).issuer_name(name).public_key(key.public_key())
        .serial_number(x509.random_serial_number())
        .not_valid_before(datetime.now(timezone.utc) - timedelta(minutes=1))
        .not_valid_after(datetime.now(timezone.utc) + timedelta(days=30))
        .add_extension(x509.BasicConstraints(ca=False, path_length=None), critical=True)
        .add_extension(x509.KeyUsage(True, False, False, False, False, False, False, False, False), critical=True)
        .sign(key, hashes.SHA256())
    )
    return cert


class PublicPkcs12PreflightTests(unittest.TestCase):
    def test_matching_cer_binds_exact_der_without_opening_pfx(self):
        cert = certificate("synthetic-file")
        der = cert.public_bytes(serialization.Encoding.DER)
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "public.cer"
            path.write_bytes(der)
            identity = inspect_public_certificate_file(
                path, active_certificate_hashes={hashlib.sha256(der).hexdigest()}, binding_id="binding-1"
            )
        self.assertEqual(identity.source, "FILE_PKCS12")
        self.assertEqual(identity.certificate_der_sha256, hashlib.sha256(der).hexdigest())

    def test_mismatch_invalid_and_binding_changes_fail_closed(self):
        first, second = certificate("first"), certificate("second")
        first_der = first.public_bytes(serialization.Encoding.DER)
        second_der = second.public_bytes(serialization.Encoding.DER)
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "public.cer"
            path.write_bytes(first_der)
            with self.assertRaisesRegex(PublicCertificatePreflightError, "CERTIFICATE_NOT_AUTHORIZED"):
                inspect_public_certificate_file(path, active_certificate_hashes={hashlib.sha256(second_der).hexdigest()}, binding_id="b")
            path.write_bytes(b"not-a-certificate")
            with self.assertRaisesRegex(PublicCertificatePreflightError, "PUBLIC_CERTIFICATE_INVALID"):
                inspect_public_certificate_file(path, active_certificate_hashes=set(), binding_id="b")

if __name__ == "__main__":
    unittest.main()
