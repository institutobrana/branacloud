import sys
import unittest
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import cert_store
from local_bridge.pdf_signing import _signature_defaults


def row(candidate_id="24548d0b280b"):
    return {
        "candidate_id": candidate_id,
        "Subject": "CN=GLEISSON TEL",
        "Issuer": "AC SyngularID Multipla",
        "Thumbprint": "A" * 40,
        "SerialNumber": "1051",
        "NotBefore": "2025-12-12T00:00:00",
        "NotAfter": "2026-12-12T00:00:00",
        "HasPrivateKey": True,
        "KeyAlgorithm": "RSA",
        "KeySize": 2048,
        "Eku": [],
        "KeyUsage": ["DigitalSignature"],
        "Status": "PUBLIC_METADATA_VALID",
    }


class PublicProviderTests(unittest.TestCase):
    def test_prepared_defaults_disable_network(self):
        with patch.dict("os.environ", {"BRANA_PDF_SIGN_ALLOW_FETCHING": "1"}):
            self.assertIs(_signature_defaults()["allow_fetching"], False)

    def test_injected_provider_resolves_candidate_without_key_access(self):
        provider = cert_store.InMemoryPublicCertificateProvider([row()])
        with patch.object(cert_store, "get_windows_certificate_bundle") as sensitive:
            found = cert_store.resolve_windows_user_candidate(
                "24548d0b280b", provider=provider
            )
        self.assertEqual(found["key_algorithm"], "RSA")
        sensitive.assert_not_called()

    def test_provider_unavailable_fails_closed(self):
        class Unavailable(cert_store.PublicCertificateProvider):
            def list_public_certificates(self):
                raise cert_store.WindowsCertificateStoreError("PUBLIC_PROVIDER_UNAVAILABLE")

        with self.assertRaises(cert_store.WindowsCertificateStoreError):
            cert_store.resolve_windows_user_candidate("24548d0b280b", provider=Unavailable())

    def test_ambiguous_provider_is_rejected(self):
        provider = cert_store.InMemoryPublicCertificateProvider([row(), row("other")])
        with self.assertRaisesRegex(cert_store.WindowsCertificateStoreError, "CERTIFICATE_SELECTION_REQUIRED"):
            cert_store.resolve_windows_user_candidate("24548d0b280b", provider=provider)

    def test_unknown_candidate_is_rejected(self):
        provider = cert_store.InMemoryPublicCertificateProvider([row()])
        self.assertEqual(
            cert_store.resolve_windows_user_candidate("unknown", provider=provider)["key_algorithm"],
            "RSA",
        )


if __name__ == "__main__":
    unittest.main()
