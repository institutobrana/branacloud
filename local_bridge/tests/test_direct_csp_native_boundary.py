import unittest

from local_bridge.security.direct_csp_adapter import DirectCspAdapter, DirectCspError, PublicCspMetadata, Win32CspBoundary, RawRsaSignatureAdapter, PyHankoNativeCspSigner


class FakeNativeBoundary:
    def __init__(self):
        self.acquired = 0
        self.signed = []

    def acquire_rsa_key(self, metadata):
        self.acquired += 1
        return "fake-rsa-handle"

    def sign_digest(self, handle, digest):
        self.signed.append((handle, digest))
        return b"rsa-signature"


def md(**extra):
    values = dict(store="CurrentUser\\My", provider_name="Microsoft Enhanced Cryptographic Provider v1.0", provider_kind="CSP", key_algorithm="RSA", key_size=2048, has_private_key=True)
    values.update(extra)
    return PublicCspMetadata(**values)


class NativeCspBoundaryTests(unittest.TestCase):
    def _request(self, adapter, approved=True):
        return adapter.sign_prepared(approved=approved, pdf_bytes=b"synthetic-pdf", field_name="BranaSignature_1", use_existing_field=True, new_field_spec=None, signature_profile="pades-ad-rb-1.3", policy_oid="2.16.76.1.7.1.11.1.3", allow_fetching=False, digest=b"synthetic-digest")

    def test_native_boundary_is_injected_and_called_once_after_approval(self):
        native = FakeNativeBoundary()
        result = self._request(DirectCspAdapter(metadata=md(), native_boundary=native))
        self.assertEqual(result, b"rsa-signature")
        self.assertEqual(native.acquired, 1)
        self.assertEqual(native.signed, [("fake-rsa-handle", b"synthetic-digest")])

    def test_before_approval_does_not_touch_native_boundary(self):
        native = FakeNativeBoundary()
        with self.assertRaisesRegex(DirectCspError, "APPROVAL_REQUIRED"):
            self._request(DirectCspAdapter(metadata=md(), native_boundary=native), approved=False)
        self.assertEqual(native.acquired, 0)
        self.assertEqual(native.signed, [])

    def test_native_failure_is_sanitized_and_preserves_phase(self):
        class NativeError(Exception):
            winerror = 2148073494
        native = FakeNativeBoundary()
        native.acquire_rsa_key = lambda metadata: (_ for _ in ()).throw(NativeError("secret key path"))
        adapter = DirectCspAdapter(metadata=md(), native_boundary=native)
        with self.assertRaisesRegex(DirectCspError, "CSP_SIGN_FAILED") as ctx:
            self._request(adapter)
        self.assertEqual(ctx.exception.phase, "provider_sign")
        self.assertNotIn("secret key path", str(ctx.exception))

    def test_missing_boundary_fails_closed_without_store_access(self):
        with self.assertRaisesRegex(DirectCspError, "NATIVE_CSP_BOUNDARY_REQUIRED"):
            DirectCspAdapter(metadata=md())

    def test_win32_boundary_is_deferred_and_uses_injected_native_api(self):
        class Api:
            def acquire(self, context, key_spec):
                return 10, 20, 1
            def sign_hash(self, handle, digest):
                return b"native-signature"
            def release(self, handle):
                pass
        boundary = Win32CspBoundary(certificate_context=123, api=Api())
        adapter = DirectCspAdapter(metadata=md(), native_boundary=boundary)
        self.assertEqual(self._request(adapter), b"native-signature")

    def test_win32_acquisition_exception_is_sanitized(self):
        class Api:
            def acquire(self, context, key_spec):
                raise OSError(5, "private key path")
        boundary = Win32CspBoundary(certificate_context=123, api=Api())
        with self.assertRaisesRegex(DirectCspError, "CSP_KEY_ACQUISITION_FAILED"):
            self._request(DirectCspAdapter(metadata=md(), native_boundary=boundary))

    def test_context_resolution_and_raw_rsa_adapter_release(self):
        class Native:
            def acquire(self, context, key_spec):
                return 10, 20, 1
            def sign_hash(self, handle, digest):
                return b"rsa-signature"
            def release(self, handle):
                self.released = getattr(self, "released", 0) + 1
        native = Native()
        boundary = Win32CspBoundary.from_public_metadata(md(), context_resolver=lambda metadata: 123, api=native)
        adapter = RawRsaSignatureAdapter(boundary, md())
        self.assertEqual(adapter.sign_digest_after_approval(approved=True, digest=b"digest"), b"rsa-signature")
        self.assertEqual(native.released, 1)

    def test_key_spec_zero_missing_and_incomplete_fail_closed(self):
        for acquired in ((10, 20, 0), (10, 20), (10,)):
            class Api:
                def acquire(self, context, key_spec): return acquired
                def sign_hash(self, handle, digest): raise AssertionError("sign must not be reached")
                def release(self, handle): pass
            boundary = Win32CspBoundary(certificate_context=123, api=Api())
            with self.assertRaises(DirectCspError) as error:
                self._request(DirectCspAdapter(metadata=md(), native_boundary=boundary))
            self.assertIn(error.exception.code, {"CSP_KEY_SPEC_MISMATCH", "CSP_KEY_SPEC_UNAVAILABLE"})

    def test_native_certificate_context_is_owned_by_boundary_until_release(self):
        class Context:
            context = 123
            closed = 0
            def close(self): self.closed += 1
        class Api:
            def acquire(self, context, key_spec): return 10, 20, 1
            def sign_hash(self, handle, digest): return b"s" * 256
            def release(self, handle): pass
        from local_bridge.cert_store import NativeCertificateContext
        ctx = Context()
        boundary = Win32CspBoundary(certificate_context=ctx, api=Api())
        signer = PyHankoNativeCspSigner(boundary=boundary, metadata=md(), approved=True)
        import asyncio
        self.assertEqual(asyncio.run(signer.async_sign_raw(b"d" * 32, "sha256")), b"s" * 256)
        self.assertEqual(ctx.closed, 1)

    def test_context_resolution_rejects_wrong_store_or_missing_context(self):
        with self.assertRaisesRegex(DirectCspError, "CERTIFICATE_CONTEXT_INVALID"):
            Win32CspBoundary.from_public_metadata(md(store="LocalMachine\\My"), context_resolver=lambda m: 1)
        with self.assertRaisesRegex(DirectCspError, "CERTIFICATE_CONTEXT_UNAVAILABLE"):
            Win32CspBoundary.from_public_metadata(md(), context_resolver=lambda m: None)

    def test_pyhanko_adapter_forwards_exact_sha256_digest(self):
        class Api:
            def acquire(self, context, key_spec): return 10, 20, 1
            def sign_hash(self, handle, digest):
                self.digest = digest
                return b"s" * 256
            def release(self, handle): pass
        api = Api()
        signer = PyHankoNativeCspSigner(boundary=Win32CspBoundary(certificate_context=1, api=api), metadata=md(), approved=True)
        import asyncio
        digest = b"d" * 32
        self.assertEqual(asyncio.run(signer.async_sign_raw(digest, "sha256")), b"s" * 256)
        self.assertEqual(api.digest, digest)

    def test_pyhanko_adapter_rejects_wrong_algorithm_digest_and_length(self):
        signer = PyHankoNativeCspSigner(boundary=Win32CspBoundary(certificate_context=1, api=FakeNativeBoundary()), metadata=md(), approved=True)
        import asyncio
        for data, algorithm in ((b"d" * 32, "sha384"), (b"d", "sha256")):
            with self.assertRaises(DirectCspError):
                asyncio.run(signer.async_sign_raw(data, algorithm))

    def test_prepared_async_contract_converts_hex_hash_exactly(self):
        import asyncio
        from local_bridge.security.windows_prepared_signer import WindowsPreparedPdfSigner
        seen = []
        body = b"prepared"
        import hashlib
        request = type("Request", (), {"pdf_bytes": body, "prepared_pdf_sha256": hashlib.sha256(body).hexdigest(), "field_name": "BranaSignature_1", "use_existing_field": True, "profile": "pades-ad-rb-1.3", "policy_oid": "2.16.76.1.7.1.11.1.3", "operation_id": "op", "certificate_binding": "binding"})()
        signer = WindowsPreparedPdfSigner(lambda req: seen.append(bytes.fromhex(req.prepared_pdf_sha256)) or b"result")
        self.assertEqual(asyncio.run(signer.async_sign_prepared(request)), b"result")
        self.assertEqual(seen, [hashlib.sha256(body).digest()])


if __name__ == "__main__":
    unittest.main()
