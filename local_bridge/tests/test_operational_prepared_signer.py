import hashlib
import asyncio
import unittest

from local_bridge.security.prepared_signer import PreparedPdfSigningRequest
from local_bridge.security.windows_prepared_signer import (
    CertificateSelectionRequired,
    create_operational_windows_prepared_signer,
    SignerDiagnosticError,
)
from local_bridge.security.direct_csp_adapter import DirectCspError


class OperationalPreparedSignerTests(unittest.TestCase):
    def request(self):
        body = b"synthetic-prepared-pdf"
        return PreparedPdfSigningRequest(
            body, hashlib.sha256(body).hexdigest(), "BranaSignature_1", True,
            "pades-ad-rb-1.3", "2.16.76.1.7.1.11.1.3", "operation", "binding"
        )

    def test_resolution_and_real_callable_are_deferred(self):
        events = []
        candidate = {"thumbprint": "A" * 40, "chain_valid": True}

        def resolve():
            events.append("resolve")
            return candidate

        def spy(**kwargs):
            events.append(kwargs)
            return b"synthetic-result"

        signer = create_operational_windows_prepared_signer(
            public_predicate_resolver=resolve, signer_callable=spy
        )
        self.assertEqual(events, [])
        self.assertEqual(signer.sign_prepared(self.request()), b"synthetic-result")
        self.assertEqual(events[0], "resolve")
        call = events[1]
        self.assertEqual(call["pdf_bytes"], b"synthetic-prepared-pdf")
        self.assertEqual(call["thumbprint"], "A" * 40)
        self.assertEqual(call["field_name"], "BranaSignature_1")
        self.assertIs(call["use_existing_field"], True)
        self.assertIsNone(call["new_field_spec"])
        self.assertEqual(call["signature_profile"], "pades-ad-rb-1.3")
        self.assertEqual(call["policy_oid"], "2.16.76.1.7.1.11.1.3")
        self.assertIsNone(call["policy_der_path"])
        self.assertIs(call["allow_fetching"], False)

    def test_direct_csp_error_preserves_phase_code_and_native_errno(self):
        def resolve():
            return {"thumbprint": "A" * 40, "chain_valid": True}

        def sign(**_kwargs):
            error = DirectCspError("CSP_SIGN_HASH_FAILED", phase="provider_sign", retryable=False)
            raise error from OSError(5, "CryptoAPI")

        signer = create_operational_windows_prepared_signer(
            public_predicate_resolver=resolve, signer_callable=sign
        )
        with self.assertRaises(SignerDiagnosticError) as caught:
            asyncio.run(signer.async_sign_prepared(self.request()))
        diagnostic = caught.exception.diagnostic
        self.assertEqual(diagnostic.phase, "provider_sign")
        self.assertEqual(diagnostic.error_code, "CSP_SIGN_HASH_FAILED")
        self.assertEqual(diagnostic.windows_error_code, 5)
    def test_unproven_candidate_fails_before_signer(self):
        calls = []
        signer = create_operational_windows_prepared_signer(
            public_predicate_resolver=lambda: {"thumbprint": "A" * 40, "chain_valid": None},
            signer_callable=lambda **kwargs: calls.append(kwargs),
        )
        with self.assertRaisesRegex(CertificateSelectionRequired, "CERTIFICATE_SELECTION_REQUIRED"):
            signer.sign_prepared(self.request())
        self.assertEqual(calls, [])

    def test_provider_failure_is_structured_and_sanitized(self):
        def failing(**kwargs):
            raise RuntimeError("PIN=1234 secret C:\\private\\x.pfx thumbprint ABCDEF")

        signer = create_operational_windows_prepared_signer(
            public_predicate_resolver=lambda: {"thumbprint": "A" * 40, "chain_valid": True},
            signer_callable=failing,
        )
        with self.assertRaises(SignerDiagnosticError) as caught:
            signer.sign_prepared(self.request())
        diagnostic = caught.exception.diagnostic.as_dict()
        self.assertEqual(diagnostic["phase"], "provider_sign")
        self.assertEqual(diagnostic["error_code"], "PIN_REQUIRED")
        self.assertTrue(diagnostic["pin_required"])
        self.assertNotIn("1234", str(diagnostic))
        self.assertNotIn("private", str(diagnostic).lower())
        self.assertNotIn("ABCDEF", str(diagnostic))
        self.assertNotIn("traceback", str(diagnostic).lower())

    def test_windows_code_is_captured_without_exception_text(self):
        class NativeFailure(Exception):
            winerror = 2148073494

        signer = create_operational_windows_prepared_signer(
            public_predicate_resolver=lambda: {"thumbprint": "A" * 40, "chain_valid": True},
            signer_callable=lambda **kwargs: (_ for _ in ()).throw(NativeFailure("secret")),
        )
        with self.assertRaises(SignerDiagnosticError) as caught:
            signer.sign_prepared(self.request())
        self.assertEqual(caught.exception.diagnostic.error_code, "WINDOWS_PROVIDER_FAILED")
        self.assertEqual(caught.exception.diagnostic.windows_error_code, 2148073494)
        self.assertNotIn("secret", str(caught.exception.diagnostic.as_dict()))

    def test_cause_chain_is_class_only(self):
        class NativeFailure(Exception):
            winerror = 2148073494
        def failing(**kwargs):
            try:
                raise NativeFailure("PIN=secret")
            except NativeFailure as inner:
                raise RuntimeError("wrapper C:\\private\\x.pfx") from inner
        signer = create_operational_windows_prepared_signer(
            public_predicate_resolver=lambda: {"thumbprint": "A" * 40, "chain_valid": True},
            signer_callable=failing,
        )
        with self.assertRaises(SignerDiagnosticError) as caught:
            signer.sign_prepared(self.request())
        diagnostic = caught.exception.diagnostic
        self.assertEqual(diagnostic.windows_error_code, 2148073494)
        self.assertTrue(all("secret" not in item and "private" not in item for item in diagnostic.cause_chain))
        self.assertTrue(all("." in item for item in diagnostic.cause_chain))


if __name__ == "__main__":
    unittest.main()
