import unittest
from unittest.mock import patch

from local_bridge import cert_store


class BundleAcquisitionDiagnosticTests(unittest.TestCase):
    def test_valid_csp_bundle_is_normalized(self):
        payload = {
            "Subject": "GLEISSON TEL",
            "Issuer": "AC SyngularID Multipla",
            "Thumbprint": "A" * 40,
            "FriendlyName": "",
            "SerialNumber": "1051",
            "HasPrivateKey": True,
            "KeyAlgorithm": "RSA",
            "KeySize": 2048,
            "RawData": "ZmFrZQ==",
            "Chain": [],
        }
        with patch.object(cert_store, "_run_powershell_json", return_value=payload) as run:
            result = cert_store.get_windows_certificate_bundle("A" * 40)
        self.assertEqual(result["key_algorithm"], "RSA")
        self.assertEqual(result["key_size"], 2048)
        self.assertEqual(result["thumbprint"], "A" * 40)
        self.assertIn("GetRSAPrivateKey", run.call_args.args[0])
        self.assertNotIn(".bin", run.call_args.args[0])

    def test_provider_failure_diagnostic_is_preserved(self):
        diagnostic = {
            "phase": "certificate_bundle",
            "returncode": 17,
            "hresult": "0x80090016",
            "win32_error": 2148073494,
            "native_error": None,
            "marker": "BRANA_NATIVE_DIAGNOSTIC_JSON=redacted",
        }
        with patch.object(
            cert_store,
            "_run_powershell_json",
            side_effect=cert_store.WindowsCertificateStoreError(
                "POWERSHELL_PROVIDER_FAILED", diagnostic=diagnostic
            ),
        ):
            with self.assertRaises(cert_store.WindowsCertificateStoreError) as ctx:
                cert_store.get_windows_certificate_bundle("A" * 40)
        self.assertEqual(ctx.exception.diagnostic["returncode"], 17)
        self.assertEqual(ctx.exception.diagnostic["hresult"], "0x80090016")
        self.assertEqual(ctx.exception.diagnostic["win32_error"], 2148073494)

    def test_empty_or_invalid_bundle_is_rejected_without_raw_output(self):
        for value in (None, [], "not-json"):
            with self.subTest(value=value), patch.object(cert_store, "_run_powershell_json", return_value=value):
                with self.assertRaises(cert_store.WindowsCertificateStoreError) as ctx:
                    cert_store.get_windows_certificate_bundle("A" * 40)
                self.assertNotIn("not-json", str(ctx.exception))

    def test_cause_is_retained_by_bundle_error(self):
        cause = cert_store.WindowsCertificateStoreError(
            "POWERSHELL_PROVIDER_FAILED",
            diagnostic={"phase": "certificate_bundle", "returncode": 1},
        )
        error = cert_store.WindowsCertificateStoreError(
            "SIGNER_INITIALIZATION_FAILED", diagnostic=cause.diagnostic
        )
        error.__cause__ = cause
        self.assertIs(error.__cause__, cause)
        self.assertEqual(error.diagnostic["phase"], "certificate_bundle")


if __name__ == "__main__":
    unittest.main()
