import hashlib
import sys
import unittest
import fitz
from pathlib import Path
from unittest.mock import Mock
from datetime import datetime, timedelta, timezone

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from cryptography import x509
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.x509.oid import NameOID
from cryptography.hazmat.primitives.serialization import pkcs12

from backend.services.editor_signature_anchor_service import prepare_signature_anchor
from local_bridge.security.pkcs12_prepared_signer import Pkcs12SignerError, create_file_pkcs12_prepared_signer
from local_bridge.security.prepared_signer import PreparedPdfSigningRequest


def request(source="FILE_PKCS12", binding="a" * 64):
    return PreparedPdfSigningRequest(b"prepared-pdf", hashlib.sha256(b"prepared-pdf").hexdigest(), "BranaSignature_1", True, "pades-ad-rb-1.3", "policy", "op", binding, source)


class Pkcs12PreparedSignerTests(unittest.TestCase):
    def test_synthetic_pfx_produces_pdf_cms_after_material_is_requested(self):
        key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
        name = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, "synthetic-pfx")])
        cert = (x509.CertificateBuilder().subject_name(name).issuer_name(name)
                .public_key(key.public_key()).serial_number(x509.random_serial_number())
                .not_valid_before(datetime.now(timezone.utc) - timedelta(minutes=1))
                .not_valid_after(datetime.now(timezone.utc) + timedelta(days=30))
                .sign(key, hashes.SHA256()))
        pfx = pkcs12.serialize_key_and_certificates(b"signing", key, cert, None, serialization.BestAvailableEncryption(b"test-pass"))
        der = cert.public_bytes(serialization.Encoding.DER)
        source = fitz.open()
        source.new_page(width=595, height=842).insert_text((100, 300), "<<Cirurgião.AssinaturaDigital>>", fontsize=10)
        prepared = prepare_signature_anchor(source.tobytes()).pdf_bytes
        request_value = request(binding=hashlib.sha256(der).hexdigest())
        request_value = PreparedPdfSigningRequest(prepared, hashlib.sha256(prepared).hexdigest(), request_value.field_name, True, request_value.profile, "2.16.76.1.7.1.11.1.3", request_value.operation_id, request_value.certificate_binding, "FILE_PKCS12")
        result = create_file_pkcs12_prepared_signer(lambda _: (pfx, "test-pass"))(request_value)
        self.assertTrue(result.startswith(b"%PDF-"))
        self.assertGreater(len(result), len(prepared))
        self.assertIn(b"/ByteRange", result)

    def test_wrong_password_is_sanitized(self):
        key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
        name = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, "synthetic-pfx")])
        cert = (x509.CertificateBuilder().subject_name(name).issuer_name(name).public_key(key.public_key())
                .serial_number(x509.random_serial_number()).not_valid_before(datetime.now(timezone.utc))
                .not_valid_after(datetime.now(timezone.utc) + timedelta(days=1)).sign(key, hashes.SHA256()))
        pfx = pkcs12.serialize_key_and_certificates(b"signing", key, cert, None, serialization.BestAvailableEncryption(b"right"))
        der_hash = hashlib.sha256(cert.public_bytes(serialization.Encoding.DER)).hexdigest()
        with self.assertRaisesRegex(Pkcs12SignerError, "PKCS12_PASSWORD_OR_CONTAINER_INVALID"):
            create_file_pkcs12_prepared_signer(lambda _: (pfx, "wrong"))(request(binding=der_hash))

    def test_material_is_not_requested_until_sign_call_and_source_is_fixed(self):
        provider = Mock(return_value=(b"not-a-pfx", None))
        signer = create_file_pkcs12_prepared_signer(provider)
        provider.assert_not_called()
        with self.assertRaisesRegex(Pkcs12SignerError, "PKCS12_PASSWORD_OR_CONTAINER_INVALID"):
            signer(request())
        provider.assert_called_once()

    def test_source_and_hash_mismatch_fail_before_material(self):
        provider = Mock(return_value=(b"never", None))
        signer = create_file_pkcs12_prepared_signer(provider)
        with self.assertRaisesRegex(Pkcs12SignerError, "CERTIFICATE_SOURCE_MISMATCH"):
            signer(request(source="WINDOWS_STORE"))
        with self.assertRaisesRegex(Pkcs12SignerError, "CERTIFICATE_DER_HASH_REQUIRED"):
            signer(request(binding="bad"))
        provider.assert_not_called()


if __name__ == "__main__":
    unittest.main()
