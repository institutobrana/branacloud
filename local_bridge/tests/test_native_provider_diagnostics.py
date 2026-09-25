import unittest

from local_bridge.cert_store import _native_diagnostic, Win32PublicCertificateProvider


class NativeProviderDiagnosticsTests(unittest.TestCase):
    def test_success_has_no_invented_error(self):
        item = _native_diagnostic("Api", "phase", 1)
        self.assertEqual(item["error_code"], None)
        self.assertFalse(item["error_code_available"])

    def test_win32_failure_is_captured(self):
        item = _native_diagnostic("Api", "provider_sign", 0, error_code=5)
        self.assertEqual(item["error_code"], 5)
        self.assertTrue(item["error_code_available"])

    def test_hresult_and_unknown_are_distinguished(self):
        self.assertEqual(_native_diagnostic("Api", "phase", 0, error_code=0x80090016)["error_code"], 0x80090016)
        self.assertFalse(_native_diagnostic("Api", "phase", 0)["error_code_available"])

    def test_provider_starts_with_sanitized_diagnostic_buffer(self):
        provider = Win32PublicCertificateProvider(stores=("CurrentUser\\My",))
        self.assertEqual(provider.native_diagnostics, [])


if __name__ == "__main__":
    unittest.main()
