import unittest

from local_bridge.security.direct_csp_adapter import DirectCspAdapter, DirectCspError, PublicCspMetadata


def metadata(**overrides):
    values = dict(store="CurrentUser\\My", provider_name="Microsoft Enhanced Cryptographic Provider v1.0", provider_kind="CSP", key_algorithm="RSA", key_size=2048, has_private_key=True)
    values.update(overrides)
    return PublicCspMetadata(**values)


class DirectCspAdapterTests(unittest.TestCase):
    def test_no_acquisition_before_approval(self):
        calls = []
        adapter = DirectCspAdapter(metadata=metadata(), acquire_private_key=lambda m: calls.append("acquire"), sign_digest=lambda k, d: b"sig")
        with self.assertRaisesRegex(DirectCspError, "APPROVAL_REQUIRED"):
            adapter.sign_prepared(approved=False, pdf_bytes=b"pdf", field_name="BranaSignature_1", use_existing_field=True, new_field_spec=None, signature_profile="pades-ad-rb-1.3", policy_oid="2.16.76.1.7.1.11.1.3", allow_fetching=False, digest=b"hash")
        self.assertEqual(calls, [])

    def test_supported_csp_acquires_only_after_approval(self):
        calls = []
        adapter = DirectCspAdapter(metadata=metadata(), acquire_private_key=lambda m: calls.append("acquire") or object(), sign_digest=lambda k, d: calls.append((k, d)) or b"sig")
        result = adapter.sign_prepared(approved=True, pdf_bytes=b"pdf", field_name="BranaSignature_1", use_existing_field=True, new_field_spec=None, signature_profile="pades-ad-rb-1.3", policy_oid="2.16.76.1.7.1.11.1.3", allow_fetching=False, digest=b"hash")
        self.assertEqual(result, b"sig")
        self.assertEqual(calls[0], "acquire")

    def test_incompatible_provider_and_contract_fail_closed(self):
        for bad in (metadata(provider_name="Other"), metadata(provider_kind="KSP"), metadata(has_private_key=False), metadata(key_size=4096)):
            with self.subTest(bad=bad):
                adapter = DirectCspAdapter(metadata=bad, acquire_private_key=lambda m: object(), sign_digest=lambda k, d: b"sig")
                with self.assertRaises(DirectCspError):
                    adapter.sign_prepared(approved=True, pdf_bytes=b"pdf", field_name="BranaSignature_1", use_existing_field=True, new_field_spec=None, signature_profile="pades-ad-rb-1.3", policy_oid="2.16.76.1.7.1.11.1.3", allow_fetching=False, digest=b"hash")

    def test_pin_failure_is_structured_and_no_bin_is_created(self):
        class PinError(Exception):
            pin_required = True
        adapter = DirectCspAdapter(metadata=metadata(), acquire_private_key=lambda m: (_ for _ in ()).throw(PinError()), sign_digest=lambda k, d: b"sig")
        with self.assertRaisesRegex(DirectCspError, "PIN_REQUIRED") as ctx:
            adapter.sign_prepared(approved=True, pdf_bytes=b"pdf", field_name="BranaSignature_1", use_existing_field=True, new_field_spec=None, signature_profile="pades-ad-rb-1.3", policy_oid="2.16.76.1.7.1.11.1.3", allow_fetching=False, digest=b"hash")
        self.assertEqual(ctx.exception.phase, "provider_sign")


if __name__ == "__main__":
    unittest.main()
