import base64
import hashlib
import subprocess
import unittest
from pathlib import Path

from cryptography import x509
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding

from local_bridge.security.pkcs12_dotnet_adapter import (
    Pkcs12AdapterError, Pkcs12DotnetAdapter, PublicPkcs12Context, _read_frame,
)
from local_bridge.security.prepared_signer import PreparedPdfSigningRequest

ROOT = Path(__file__).resolve().parents[2]
HARNESS = ROOT / "local_bridge" / "native_pkcs12_harness" / "bin" / "Release" / "net8.0-windows" / "win-x64" / "BranaNativePkcs12Harness.exe"


class Pkcs12DotnetAdapterTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        out = subprocess.run([str(HARNESS), "--describe"], capture_output=True, check=True, text=True)
        cls.der = base64.b64decode(out.stdout.strip(), validate=True)
        cls.cert = x509.load_der_x509_certificate(cls.der)

    def request(self, operation="case-protected"):
        data = b"adapter-data-exactly-once"
        return PreparedPdfSigningRequest(
            pdf_bytes=b"prepared-pdf", prepared_pdf_sha256="a" * 64,
            field_name="BranaSignature_1", use_existing_field=True,
            profile="PAdES", policy_oid="1.2.3", operation_id=operation,
            certificate_binding=hashlib.sha256(self.der).hexdigest(),
            certificate_source="FILE_PKCS12",
        ), data

    def test_real_subprocess_protected_and_unsigned_payload_verifies(self):
        request, data = self.request()
        # The harness generates a fresh synthetic identity per process and
        # announces only its public DER on stderr. This test-only control
        # channel is separate from the production binary protocol.
        adapter = Pkcs12DotnetAdapter(str(HARNESS), test_only_read_public_der_announcement=True)
        signature = adapter.sign(request, PublicPkcs12Context("auth", self.der, data))
        live_cert = x509.load_der_x509_certificate(adapter.last_announced_der)
        live_cert.public_key().verify(signature, data, padding.PKCS1v15(), hashes.SHA256())
        self.assertEqual(adapter.calls, 1)

    def test_real_subprocess_sanitized_failures_and_no_signature(self):
        for operation, code in (("case-wrong-password", "PKCS12_PASSWORD_INVALID"), ("case-cancel", "PKCS12_CANCELLED"), ("case-der-divergent", "PUBLIC_DER_HASH_MISMATCH")):
            request, data = self.request(operation)
            with self.assertRaisesRegex(Pkcs12AdapterError, code):
                Pkcs12DotnetAdapter(str(HARNESS)).sign(request, PublicPkcs12Context("auth", self.der, data))
        request, data = self.request()
        with self.assertRaisesRegex(Pkcs12AdapterError, "CERTIFICATE_DER_HASH_MISMATCH"):
            Pkcs12DotnetAdapter(str(HARNESS)).sign(request, PublicPkcs12Context("auth", b"different", data))

    def test_response_limits_and_timeout(self):
        with self.assertRaisesRegex(Pkcs12AdapterError, "HELPER_RESPONSE_MALFORMED"):
            _read_frame(b"")
        request, data = self.request("case-invalid-response")
        with self.assertRaisesRegex(Pkcs12AdapterError, "HELPER_RESPONSE_MALFORMED"):
            Pkcs12DotnetAdapter(str(HARNESS)).sign(request, PublicPkcs12Context("auth", self.der, data))
        request, data = self.request("case-timeout")
        with self.assertRaisesRegex(Pkcs12AdapterError, "HELPER_TIMEOUT"):
            Pkcs12DotnetAdapter(str(HARNESS), timeout=0.1).sign(request, PublicPkcs12Context("auth", self.der, data))

    def test_adapter_is_not_production_wired(self):
        launcher = (ROOT / "local_bridge" / "launch_secure_bridge.py").read_text(encoding="utf-8")
        state = (ROOT / "local_bridge" / "security" / "state.py").read_text(encoding="utf-8")
        self.assertNotIn("Pkcs12DotnetAdapter", launcher)
        self.assertIn("FILE_PKCS12_SIGNER_NOT_CONFIGURED", state)


if __name__ == "__main__":
    unittest.main()
