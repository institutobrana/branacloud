import hashlib
import unittest

from local_bridge.security.http_protocol import HttpProtocolService
from local_bridge.security.windows_prepared_signer import SignerDiagnostic, SignerDiagnosticError


class SignerHttpDiagnosticsTests(unittest.TestCase):
    def test_structured_diagnostic_reaches_sanitized_payload(self):
        body = b"synthetic"
        digest = hashlib.sha256(body).hexdigest()
        diagnostic = SignerDiagnostic(
            "provider_sign", "WINDOWS_PROVIDER_FAILED", "OSError", 5,
            None, False, "2026-01-01T00:00:00+00:00", "op-123", digest,
        )
        response = HttpProtocolService()._signer_failure(
            SignerDiagnosticError(diagnostic), "op-123", digest
        )
        self.assertEqual(response.status_code, 502)
        self.assertEqual(response.body and __import__("json").loads(response.body), {
            "error_code": "SIGNER_FAILED",
            "request_id": "op-123",
            "phase": "provider_sign",
            "detail_code": "WINDOWS_PROVIDER_FAILED",
            "pin_required": None,
            "retryable": False,
            "operation_id": "op-123",
            "prepared_pdf_sha256": digest,
            "windows_error_code": "0x00000005",
        })

    def test_unstructured_failure_does_not_expose_exception_text(self):
        response = HttpProtocolService()._signer_failure(
            RuntimeError("PIN=1234 C:\\secret\\x.pfx traceback"), "op", "a" * 64
        )
        payload = __import__("json").loads(response.body)
        self.assertEqual(payload, {"error_code": "SIGNER_FAILED", "request_id": "op"})
        self.assertNotIn("1234", response.body.decode())
        self.assertNotIn("secret", response.body.decode())


if __name__ == "__main__":
    unittest.main()
