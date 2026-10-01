import base64
import hashlib
import os
import subprocess
import sys
import unittest
from pathlib import Path

from cryptography import x509
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding


ROOT = Path(__file__).resolve().parents[2]
HARNESS = ROOT / "local_bridge" / "native_pkcs12_harness" / "bin" / "Release" / "net8.0-windows" / "win-x64" / "BranaNativePkcs12Harness.exe"


def frame(body: bytes) -> bytes:
    return len(body).to_bytes(4, "little") + body


class Pkcs12HarnessProcessTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        completed = subprocess.run([str(HARNESS), "--describe"], capture_output=True, check=True, text=True)
        cls.der = base64.b64decode(completed.stdout.strip(), validate=True)

    def request(self, operation: str, *, der=None):
        data = b"harness-data-exactly-once"
        payload = {
            "operation_id": operation,
            "authorization_id": "auth-harness",
            "certificate_source": "FILE_PKCS12",
            "certificate_der_sha256": hashlib.sha256(der or self.der).hexdigest(),
            "expected_certificate_der_b64": base64.b64encode(der or self.der).decode(),
            "prepared_pdf_sha256": "a" * 64,
            "data_sha256": hashlib.sha256(data).hexdigest(),
            "data_b64": base64.b64encode(data).decode(),
        }
        import json
        return frame(json.dumps(payload, separators=(",", ":")).encode()), data

    def run_case(self, operation, *, der=None):
        process = subprocess.Popen([str(HARNESS), "--serve"], stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        announcement = process.stderr.readline()
        self.assertTrue(announcement.startswith(b"HARNESS_PUBLIC_DER="), announcement)
        live_der = base64.b64decode(announcement.split(b"=", 1)[1].strip(), validate=True)
        body, _ = self.request(operation, der=der or live_der)
        stdout, stderr = process.communicate(body, timeout=20)
        result = subprocess.CompletedProcess(process.args, process.returncode, stdout, announcement + stderr)
        result.live_der = live_der
        return result

    def test_real_subprocess_protected_signature_and_binary_stdout(self):
        result = self.run_case("case-protected")
        self.assertEqual(result.returncode, 0, result.stderr)
        length = int.from_bytes(result.stdout[:4], "little")
        signature = result.stdout[4:]
        self.assertEqual(length, len(signature)); self.assertEqual(length, 256)
        cert = x509.load_der_x509_certificate(result.live_der)
        self.assertTrue(cert.public_key().verify(signature, b"harness-data-exactly-once", padding.PKCS1v15(), hashes.SHA256()) is None)
        self.assertIn(b"HARNESS_PUBLIC_DER=", result.stderr)
        self.assertNotIn(b"test-pass", result.stderr)

    def test_sanitized_failures_and_no_signature(self):
        for operation, code in [("case-wrong-password", b"PKCS12_PASSWORD_INVALID"), ("case-cancel", b"PKCS12_CANCELLED"), ("case-der-divergent", b"PUBLIC_DER_HASH_MISMATCH")]:
            result = self.run_case(operation)
            self.assertNotEqual(result.returncode, 0)
            self.assertEqual(result.stdout, b"")
            self.assertIn(b"HARNESS_ERROR=" + code, result.stderr)
            self.assertNotIn(b"test-pass", result.stderr)
        invalid = b"not-a-real-certificate"
        result = self.run_case("case-protected", der=invalid)
        self.assertNotEqual(result.returncode, 0); self.assertEqual(result.stdout, b"")

    def test_production_project_does_not_reference_harness(self):
        production = (ROOT / "local_bridge" / "native_pkcs12_helper" / "BranaNativePkcs12Helper.csproj").read_text(encoding="utf-8")
        self.assertNotIn("native_pkcs12_harness", production)

    def test_harness_never_writes_synthetic_pfx_to_disk(self):
        source = (ROOT / "local_bridge" / "native_pkcs12_harness" / "Program.cs").read_text(encoding="utf-8")
        self.assertNotIn("File.WriteAllBytes", source)
        self.assertNotIn("fixture.path", source)


if __name__ == "__main__":
    unittest.main()
