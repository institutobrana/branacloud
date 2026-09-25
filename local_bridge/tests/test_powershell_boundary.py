import subprocess
import unittest
from unittest.mock import patch

from local_bridge.cert_store import WindowsCertificateStoreError, _run_powershell, _parse_powershell_diagnostic, _diagnostic_marker


class PowerShellBoundaryTests(unittest.TestCase):
    def fake(self, returncode=0, stdout="ok", stderr=""):
        return subprocess.CompletedProcess(["powershell.exe"], returncode, stdout, stderr)

    def test_success(self):
        with patch("local_bridge.cert_store.subprocess.run", return_value=self.fake()):
            self.assertEqual(_run_powershell("Write-Output ok"), "ok")

    def test_hresult_is_captured_without_stderr(self):
        with patch("local_bridge.cert_store.subprocess.run", return_value=self.fake(1, "", "HRESULT 0x80090016")):
            with self.assertRaises(WindowsCertificateStoreError) as caught:
                _run_powershell("SignData")
        self.assertEqual(caught.exception.diagnostic["hresult"], "0X80090016")
        self.assertEqual(caught.exception.diagnostic["phase"], "provider_sign")

    def test_win32_code_is_captured(self):
        with patch("local_bridge.cert_store.subprocess.run", return_value=self.fake(1, "", "Win32 error code: 5")):
            with self.assertRaises(WindowsCertificateStoreError) as caught:
                _run_powershell("SignData")
        self.assertEqual(caught.exception.diagnostic["win32_error"], 5)

    def test_unknown_native_error_is_explicit(self):
        with patch("local_bridge.cert_store.subprocess.run", return_value=self.fake(1, "", "provider failed")):
            with self.assertRaises(WindowsCertificateStoreError) as caught:
                _run_powershell("SignData")
        self.assertEqual(caught.exception.diagnostic["native_error"], "NATIVE_ERROR_UNAVAILABLE")

    def test_secrets_are_not_in_diagnostic(self):
        with patch("local_bridge.cert_store.subprocess.run", return_value=self.fake(1, "", "PIN=1234 thumbprint ABCD pfx C:\\secret")):
            with self.assertRaises(WindowsCertificateStoreError) as caught:
                _run_powershell("SignData")
        self.assertNotIn("1234", str(caught.exception.diagnostic))
        self.assertNotIn("ABCD", str(caught.exception.diagnostic))
        self.assertNotIn("secret", str(caught.exception.diagnostic))

    def test_diagnostic_envelope_captures_hresult_and_chain(self):
        raw = 'BRANA_DIAGNOSTIC_JSON:{"hresult":"0x80090016","exception_class":"System.SecurityException","cause_chain":["System.Exception"]}'
        item = _parse_powershell_diagnostic(raw, phase="provider_sign")
        self.assertEqual(item["hresult"], "0X80090016")
        self.assertEqual(item["exception_class"], "System.SecurityException")
        self.assertEqual(item["cause_chain"], ["System.Exception"])

    def test_diagnostic_envelope_captures_win32(self):
        item = _parse_powershell_diagnostic('BRANA_DIAGNOSTIC_JSON:{"win32_error":5}', phase="provider_sign")
        self.assertEqual(item["win32_error"], 5)
        self.assertIsNone(item["native_error"])

    def test_missing_or_invalid_envelope_is_unavailable(self):
        for raw in ("", "BRANA_DIAGNOSTIC_JSON:not-json", "BRANA_DIAGNOSTIC_JSON:[]"):
            self.assertEqual(_parse_powershell_diagnostic(raw, phase="provider_sign")["native_error"], "NATIVE_ERROR_UNAVAILABLE")

    def test_dedicated_marker_round_trips(self):
        marker = _diagnostic_marker({"phase": "provider_sign", "returncode": 1, "native_error": "NATIVE_ERROR_UNAVAILABLE"})
        parsed = _parse_powershell_diagnostic(marker, phase="provider_sign")
        self.assertTrue(marker.startswith("BRANA_NATIVE_DIAGNOSTIC_JSON="))
        self.assertEqual(parsed["native_error"], "NATIVE_ERROR_UNAVAILABLE")

    def test_failure_process_always_has_marker_in_diagnostic(self):
        with patch("local_bridge.cert_store.subprocess.run", return_value=self.fake(1, "", "")):
            with self.assertRaises(WindowsCertificateStoreError) as caught:
                _run_powershell("SignData")
        self.assertTrue(caught.exception.diagnostic["marker"].startswith("BRANA_NATIVE_DIAGNOSTIC_JSON="))


if __name__ == "__main__":
    unittest.main()
