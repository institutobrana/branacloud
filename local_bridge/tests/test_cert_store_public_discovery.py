import unittest
from unittest.mock import patch

from local_bridge import cert_store


class PublicCertificateDiscoveryTests(unittest.TestCase):
    def test_listing_does_not_request_private_keys_or_sign(self):
        row = {
            "Subject": "CN=synthetic",
            "Issuer": "CN=synthetic-ca",
            "Thumbprint": "A" * 40,
            "HasPrivateKey": True,
            "KeyAlgorithm": "RSA",
            "KeySize": 2048,
            "Eku": ["1.3.6.1.5.5.7.3.2"],
            "KeyUsage": ["Digital Signature"],
            "Status": "PUBLIC_METADATA_VALID",
        }
        with patch.object(cert_store, "_run_powershell_json", return_value=row) as query:
            result = cert_store.list_windows_user_certificates()
        command = query.call_args.args[0]
        self.assertNotIn("GetRSAPrivateKey", command)
        self.assertNotIn("GetECDsaPrivateKey", command)
        self.assertEqual(result[0]["private_key_usable"], False)
        self.assertEqual(result[0]["thumbprint_suffix"], "AAAA")
        self.assertEqual(result[0]["status"], "PUBLIC_METADATA_VALID")

    def test_rsa_and_ec_metadata_are_described_without_key_access(self):
        rows = [
            {"Subject": "CN=rsa", "Thumbprint": "B" * 40, "KeyAlgorithm": "RSA", "KeySize": 2048, "HasPrivateKey": True, "Eku": ["1.2.3.4"], "KeyUsage": [], "Status": "EKU_INCOMPATIBLE"},
            {"Subject": "CN=ec", "Thumbprint": "C" * 40, "KeyAlgorithm": "ECC", "KeySize": 256, "HasPrivateKey": False, "Eku": [], "KeyUsage": [], "Status": "EXPIRED"},
        ]
        with patch.object(cert_store, "_run_powershell_json", return_value=rows):
            result = cert_store.list_windows_user_certificates()
        self.assertEqual({item["key_algorithm"] for item in result}, {"RSA", "ECC"})
        self.assertEqual({item["status"] for item in result}, {"EKU_INCOMPATIBLE", "EXPIRED"})
        self.assertTrue(all(not item["private_key_usable"] for item in result))

    def test_sensitive_bundle_is_not_called_by_listing(self):
        with patch.object(cert_store, "_run_powershell_json", return_value=None), patch.object(cert_store, "get_windows_certificate_bundle") as bundle:
            cert_store.list_windows_user_certificates()
        bundle.assert_not_called()

    def test_explicit_candidate_resolves_without_private_key_getter(self):
        row = {"subject": "GLEISSON TEL", "issuer": "AC SyngularID Multipla", "key_algorithm": "RSA", "key_size": 2048, "has_private_key": True, "status": "PUBLIC_METADATA_VALID", "thumbprint": "A" * 40}
        provider = cert_store.InMemoryPublicCertificateProvider([row])
        with patch.object(cert_store, "get_windows_certificate_bundle") as bundle:
            result = cert_store.resolve_windows_user_candidate(provider=provider)
        self.assertEqual(result["issuer"], "AC SyngularID Multipla")
        bundle.assert_not_called()

    def test_unknown_or_ambiguous_candidate_is_rejected(self):
        rows = [{"subject": "GLEISSON TEL", "issuer": "AC SyngularID Multipla", "key_algorithm": "RSA", "key_size": 2048, "has_private_key": True, "status": "PUBLIC_METADATA_VALID", "thumbprint": "A" * 40}] * 2
        provider = cert_store.InMemoryPublicCertificateProvider(rows)
        with self.assertRaisesRegex(cert_store.WindowsCertificateStoreError, "CERTIFICATE_SELECTION_REQUIRED"):
            cert_store.resolve_windows_user_candidate(provider=provider)


if __name__ == "__main__":
    unittest.main()
