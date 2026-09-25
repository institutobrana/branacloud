import subprocess
import unittest
from unittest.mock import patch

from local_bridge import cert_store


class CspResolutionAuditTests(unittest.TestCase):
    def test_full_thumbprint_is_required_and_normalized(self):
        self.assertEqual(cert_store._sanitize_thumbprint("aa" * 20), "AA" * 20)
        for value in ("aa" * 6, "candidate-1", "zz" * 20):
            with self.subTest(value=value), self.assertRaises(cert_store.WindowsCertificateStoreError):
                cert_store._sanitize_thumbprint(value)

    def test_bundle_command_uses_current_user_store_and_full_thumbprint(self):
        with patch.object(cert_store, "_run_powershell_json", return_value={
            "Subject": "GLEISSON TEL", "Issuer": "AC SyngularID Multipla",
            "Thumbprint": "AA" * 20, "HasPrivateKey": True,
            "KeyAlgorithm": "RSA", "KeySize": 2048, "RawData": "x", "Chain": [],
        }) as run:
            cert_store.get_windows_certificate_bundle("aa" * 20)
        command = run.call_args.args[0]
        self.assertIn("Cert:\\CurrentUser\\My\\", command)
        self.assertIn("GetRSAPrivateKey($cert)", command)
        self.assertIn("X509Chain", command)
        self.assertIn(("AA" * 20), command)
        self.assertNotIn("24548d0b280b", command)

    def test_store_and_candidate_ambiguity_fail_closed(self):
        rows = [{"store": "LocalMachine\\My", "subject": "GLEISSON TEL", "issuer": "AC SyngularID Multipla", "key_algorithm": "RSA", "key_size": 2048, "has_private_key": True, "chain_valid": True, "status": "PUBLIC_METADATA_VALID"}]
        with self.assertRaises(cert_store.WindowsCertificateStoreError):
            cert_store.resolve_windows_user_candidate(provider=cert_store.InMemoryPublicCertificateProvider(rows))

    def test_exit_one_without_output_preserves_sanitized_diagnostic(self):
        completed = subprocess.CompletedProcess(["powershell.exe"], 1, stdout="", stderr="")
        with patch.object(cert_store.subprocess, "run", return_value=completed):
            with self.assertRaises(cert_store.WindowsCertificateStoreError) as ctx:
                cert_store._run_powershell("Get-Item Cert:\\CurrentUser\\My", timeout=1)
        self.assertEqual(ctx.exception.diagnostic["returncode"], 1)
        self.assertEqual(ctx.exception.diagnostic["native_error"], "NATIVE_ERROR_UNAVAILABLE")
        self.assertTrue(ctx.exception.diagnostic["marker"].startswith("BRANA_NATIVE_DIAGNOSTIC_JSON="))

    def test_exception_from_subprocess_preserves_cause(self):
        cause = OSError("sensitive path and thumbprint")
        with patch.object(cert_store.subprocess, "run", side_effect=cause):
            with self.assertRaises(cert_store.WindowsCertificateStoreError) as ctx:
                cert_store._run_powershell("Get-Item Cert:\\CurrentUser\\My", timeout=1)
        self.assertIs(ctx.exception.__cause__, cause)
        self.assertNotIn(str(cause), str(ctx.exception))


if __name__ == "__main__":
    unittest.main()
