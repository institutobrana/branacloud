import hashlib
import unittest

from local_bridge.security.prepared_signer import PreparedPdfSigningRequest
from local_bridge.security.windows_prepared_signer import CertificateSelectionRequired, WindowsPreparedPdfSigner, WindowsPreparedSignerError, create_deferred_windows_prepared_signer, create_windows_prepared_signer, resolve_certificate_candidate


class WindowsPreparedSignerTests(unittest.TestCase):
    def request(self, body=b"synthetic-pdf"):
        return PreparedPdfSigningRequest(body, hashlib.sha256(body).hexdigest(), "BranaSignature_1", True, "pades-ad-rb-1.3", "2.16.76.1.7.1.11.1.3", "operation-synthetic", "certificate-binding-synthetic")

    def test_contract_forwards_exact_request_once(self):
        calls = []
        signer = WindowsPreparedPdfSigner(lambda request: calls.append(request) or b"synthetic-result")
        result = signer.sign_prepared(self.request())
        self.assertEqual(result, b"synthetic-result")
        self.assertEqual(calls, [self.request()])
        self.assertEqual(calls[0].field_name, "BranaSignature_1")
        self.assertIs(calls[0].use_existing_field, True)
        self.assertFalse(hasattr(calls[0], "new_field_spec"))

    def test_hash_mismatch_blocks_callable(self):
        calls = []
        request = self.request(); request = PreparedPdfSigningRequest(request.pdf_bytes, "0" * 64, request.field_name, request.use_existing_field, request.profile, request.policy_oid, request.operation_id, request.certificate_binding)
        with self.assertRaisesRegex(WindowsPreparedSignerError, "PREPARED_HASH_MISMATCH"):
            WindowsPreparedPdfSigner(lambda value: calls.append(value)).sign_prepared(request)
        self.assertEqual(calls, [])

    def test_field_policy_and_signed_pdf_contracts_block_callable(self):
        calls = []
        for request in (
            PreparedPdfSigningRequest(b"x", hashlib.sha256(b"x").hexdigest(), "Other", True, "pades-ad-rb-1.3", "2.16.76.1.7.1.11.1.3", "op", "binding"),
            PreparedPdfSigningRequest(b"x", hashlib.sha256(b"x").hexdigest(), "BranaSignature_1", False, "pades-ad-rb-1.3", "2.16.76.1.7.1.11.1.3", "op", "binding"),
            PreparedPdfSigningRequest(b"x", hashlib.sha256(b"x").hexdigest(), "BranaSignature_1", True, "wrong", "2.16.76.1.7.1.11.1.3", "op", "binding"),
            PreparedPdfSigningRequest(b"x/ByteRange", hashlib.sha256(b"x/ByteRange").hexdigest(), "BranaSignature_1", True, "pades-ad-rb-1.3", "2.16.76.1.7.1.11.1.3", "op", "binding"),
        ):
            with self.assertRaises(WindowsPreparedSignerError):
                WindowsPreparedPdfSigner(lambda value: calls.append(value)).sign_prepared(request)
        self.assertEqual(calls, [])

    def test_windows_factory_requires_explicit_identifier_and_defers_factory(self):
        calls = []
        with self.assertRaises(CertificateSelectionRequired):
            create_windows_prepared_signer(certificate_id="", signer_factory=lambda identifier, request: calls.append(identifier))
        signer = create_windows_prepared_signer(certificate_id="PUBLIC-CERTIFICATE-ID-001", signer_factory=lambda identifier, request: calls.append((identifier, request.operation_id)) or b"result")
        self.assertEqual(calls, [])
        self.assertEqual(signer.sign_prepared(self.request()), b"result")
        self.assertEqual(calls, [("PUBLIC-CERTIFICATE-ID-001", "operation-synthetic")])

    def test_candidate_resolution_rejects_missing_and_ambiguous(self):
        candidates = [{"candidate_id": "candidate-1", "store": "CurrentUser\\My", "thumbprint": "A" * 40}]
        self.assertEqual(resolve_certificate_candidate("candidate-1", candidates)["store"], "CurrentUser\\My")
        with self.assertRaises(CertificateSelectionRequired): resolve_certificate_candidate("missing", candidates)
        with self.assertRaises(CertificateSelectionRequired): resolve_certificate_candidate("candidate-1", candidates + candidates)

    def test_deferred_factory_does_not_resolve_or_create_at_startup(self):
        calls = []
        signer = create_deferred_windows_prepared_signer(candidate_id="candidate-1", candidate_resolver=lambda value: calls.append(("resolve", value)) or {"thumbprint": "A" * 40}, signer_factory=lambda candidate, request: calls.append(("signer", candidate["thumbprint"])) or b"result")
        self.assertEqual(calls, [])
        self.assertEqual(signer.sign_prepared(self.request()), b"result")
        self.assertEqual(calls, [("resolve", "candidate-1"), ("signer", "A" * 40)])


if __name__ == "__main__":
    unittest.main()
