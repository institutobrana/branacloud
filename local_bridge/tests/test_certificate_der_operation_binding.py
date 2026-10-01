import asyncio
import hashlib
import unittest

from local_bridge.security.dotnet_sha256_signer import create_explicit_store_only_dotnet_factory
from local_bridge.security.windows_prepared_signer import SignerDiagnosticError
from local_bridge.security.prepared_signer import PreparedPdfSigningRequest
from local_bridge.security.state import BridgeState, StateError


class CertificateDerOperationBindingTests(unittest.TestCase):
    def test_operation_fixes_hash_and_rejects_idempotency_change(self):
        state = BridgeState(authorize=lambda *_: True)
        pair = state.create_pairing("https://localhost:5173", "A" * 22)
        session = state.approve_pairing(pair.request_id)
        expected = "a" * 64
        op = state.create_operation(session_id=session, origin=pair.origin, operation_id="operation-1", prepared_pdf_sha256="b" * 64, field_name="BranaSignature_1", policy_oid="policy", profile="pades-ad-rb-1.3", certificate_binding=expected, certificate_der_sha256=expected)
        self.assertEqual(op.certificate_der_sha256, expected)
        with self.assertRaisesRegex(StateError, "IDEMPOTENCY_CONFLICT"):
            state.create_operation(session_id=session, origin=pair.origin, operation_id="operation-1", prepared_pdf_sha256="b" * 64, field_name="BranaSignature_1", policy_oid="policy", profile="pades-ad-rb-1.3", certificate_binding="c" * 64, certificate_der_sha256="c" * 64)

    def test_missing_hash_is_rejected_in_explicit_factory_before_helper(self):
        factory = create_explicit_store_only_dotnet_factory(executable=__file__, enabled=True, require_certificate_der_sha256=True)
        signer = factory(lambda: {"store": "CurrentUser\\My", "chain_valid": True, "_stable_identity": "a" * 64, "certificate_der": b"der"})
        request = PreparedPdfSigningRequest(b"pdf", hashlib.sha256(b"pdf").hexdigest(), "BranaSignature_1", True, "pades-ad-rb-1.3", "policy", "op", "")
        with self.assertRaises(SignerDiagnosticError) as caught:
            asyncio.run(signer.async_sign_prepared(request))
        self.assertEqual(caught.exception.diagnostic.error_code, "CERTIFICATE_DER_HASH_REQUIRED")

    def test_identity_source_is_immutable_and_file_signer_is_closed(self):
        state = BridgeState()
        pair = state.create_pairing("https://localhost:5173", "B" * 22)
        session = state.approve_pairing(pair.request_id)
        kwargs = dict(session_id=session, origin=pair.origin, operation_id="source-op", prepared_pdf_sha256="b" * 64,
                      field_name="BranaSignature_1", policy_oid="policy", profile="pades-ad-rb-1.3",
                      certificate_binding="a" * 64, certificate_der_sha256="a" * 64)
        op = state.create_operation(**kwargs, certificate_source="WINDOWS_STORE")
        self.assertEqual(op.certificate_source, "WINDOWS_STORE")
        with self.assertRaisesRegex(StateError, "FILE_PKCS12_SIGNER_NOT_CONFIGURED"):
            state.create_operation(**kwargs, certificate_source="FILE_PKCS12")
        with self.assertRaisesRegex(StateError, "FILE_PKCS12_SIGNER_NOT_CONFIGURED"):
            state.create_operation(**{**kwargs, "operation_id": "file-op"}, certificate_source="FILE_PKCS12")

    def test_der_hash_mismatch_is_rejected_before_helper_creation(self):
        der = b"synthetic-public-der"
        actual = hashlib.sha256(der).hexdigest()
        factory = create_explicit_store_only_dotnet_factory(executable=__file__, enabled=True, require_certificate_der_sha256=True)
        signer = factory(lambda: {"store": "CurrentUser\\My", "chain_valid": True, "_stable_identity": actual, "certificate_der": der})
        request = PreparedPdfSigningRequest(b"pdf", hashlib.sha256(b"pdf").hexdigest(), "BranaSignature_1", True, "pades-ad-rb-1.3", "policy", "op", "f" * 64)
        with self.assertRaises(SignerDiagnosticError) as caught:
            asyncio.run(signer.async_sign_prepared(request))
        self.assertEqual(caught.exception.diagnostic.error_code, "CERTIFICATE_DER_HASH_MISMATCH")


if __name__ == "__main__":
    unittest.main()
