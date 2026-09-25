import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parents[1]))
import unittest
from unittest.mock import patch

from local_bridge.pdf_signing import WindowsPdfSigningError, sign_pdf_windows_store_invisible


class WindowsStoreErrorPropagationTests(unittest.TestCase):
    def test_initialization_error_keeps_diagnostic_and_cause(self):
        diagnostic = {"phase": "provider_sign", "returncode": 1, "hresult": "0X80090016", "win32_error": None}
        class Failure(Exception):
            pass
        failure = Failure("secret")
        failure.diagnostic = diagnostic
        with patch("local_bridge.pdf_signing.WindowsStoreSigner", side_effect=failure):
            with self.assertRaises(WindowsPdfSigningError) as caught:
                sign_pdf_windows_store_invisible(pdf_bytes=b"x", thumbprint="A" * 40, signature_profile="pades-ad-rb-1.3", policy_oid="2.16.76.1.7.1.11.1.3", field_name="BranaSignature_1", use_existing_field=True)
        self.assertEqual(caught.exception.diagnostic, diagnostic)
        self.assertIs(caught.exception.__cause__, failure)

    def test_unstructured_initialization_error_has_no_secret_text(self):
        with patch("local_bridge.pdf_signing.WindowsStoreSigner", side_effect=RuntimeError("PIN=1234 C:\\secret")):
            with self.assertRaises(WindowsPdfSigningError) as caught:
                sign_pdf_windows_store_invisible(pdf_bytes=b"x", thumbprint="A" * 40, signature_profile="pades-ad-rb-1.3", policy_oid="2.16.76.1.7.1.11.1.3", field_name="BranaSignature_1", use_existing_field=True)
        self.assertEqual(str(caught.exception), "SIGNER_INITIALIZATION_FAILED")
        self.assertNotIn("1234", str(caught.exception))
        self.assertIsNotNone(caught.exception.__cause__)


if __name__ == "__main__":
    unittest.main()
