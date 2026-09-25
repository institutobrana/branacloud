import base64
import hashlib
import unittest

from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives.serialization import Encoding, PublicFormat

from local_bridge.security.protocol import (
    NonceRegistry,
    approval_code,
    b64url_decode,
    b64url_encode,
    calculate_hmac,
    canonicalize_hmac_request,
    derive_session_key,
    validate_hmac,
    validate_public_key,
    validate_timestamp,
)


def pub(key):
    return b64url_encode(key.public_key().public_bytes(Encoding.X962, PublicFormat.UncompressedPoint))


class ProtocolTests(unittest.TestCase):
    def test_base64url_roundtrip(self):
        self.assertEqual(b64url_decode(b64url_encode(b"abc\x00")), b"abc\x00")

    def test_valid_p256_public_key(self):
        key = ec.derive_private_key(1, ec.SECP256R1())
        self.assertEqual(len(validate_public_key(pub(key))), 65)

    def test_invalid_public_key_length(self):
        with self.assertRaises(ValueError): validate_public_key(b64url_encode(b"\x04"))

    def test_invalid_public_key_prefix(self):
        raw = b"\x03" + b"\x00" * 64
        with self.assertRaises(ValueError): validate_public_key(b64url_encode(raw))

    def test_invalid_public_key_point(self):
        with self.assertRaises(ValueError): validate_public_key(b64url_encode(b"\x04" + b"\x00" * 64))

    def test_published_approval_vectors(self):
        cases = [("https://localhost:5173", "req-01", "cli-01", "nC-01", "nB-01", "YW4NNSVJ"), ("https://192.168.3.41:5173", "req-02", "cli-02", "nC-02", "nB-02", "D7LZEKKJ"), ("https://localhost:5173", "req-03", "cli-03", "nC-03", "nB-03", "X5FPX4ES")]
        for origin, request_id, client, cn, bn, expected in cases:
            self.assertEqual(approval_code(origin, request_id, client, cn, bn), expected)

    def test_approval_order_and_origin_binding(self):
        first = approval_code("https://localhost:5173", "req-01", "cli-01", "nC-01", "nB-01")
        second = approval_code("https://192.168.3.41:5173", "req-01", "cli-01", "nC-01", "nB-01")
        self.assertNotEqual(first, second)

    def test_hkdf_symmetry_and_size(self):
        browser = ec.derive_private_key(1, ec.SECP256R1())
        bridge = ec.derive_private_key(101, ec.SECP256R1())
        args = ("https://localhost:5173", "r00000000000000000000000000000001", "c00000000000000000000000000000001", "b00000000000000000000000000000001", "s00000000000000000000000000000001")
        left = derive_session_key(browser, pub(bridge), *args)
        right = derive_session_key(bridge, pub(browser), *args)
        self.assertEqual(left, right); self.assertEqual(len(left), 32)

    def test_hkdf_published_vectors(self):
        cases = [(1, 101, "https://localhost:5173", "PXT0UZsoI4R2Wr_3xGw4XivJFCpCsP9B86ZswoJLgYo"), (2, 102, "https://192.168.3.41:5173", "PSfQmYknstQE22UmE_eXxfvFIUJthLzZCcZxebo5NlU"), (3, 103, "https://localhost:5173", "HxI5VYhzkyc-uKhtjSd7Qk5UbkE1yPuAhbBCh10BdcY")]
        for browser_n, bridge_n, origin, expected in cases:
            browser = ec.derive_private_key(browser_n, ec.SECP256R1()); bridge = ec.derive_private_key(bridge_n, ec.SECP256R1())
            args = (origin, f"r{'0'*31}{browser_n}", f"c{'0'*31}{browser_n}", f"b{'0'*31}{browser_n}", f"s{'0'*31}{browser_n}")
            self.assertEqual(b64url_encode(derive_session_key(browser, pub(bridge), *args)), expected)

    def _canonical(self, **changes):
        values = dict(method="POST", path="/v1/signature-operations", origin="https://localhost:5173", timestamp=1760000000, request_nonce="n00000000000000000000000000000001", session_id="s00000000000000000000000000000001", content_sha256=hashlib.sha256(b"PDF-A").hexdigest(), body_length=5, parameters={"field": "BranaSignature_1", "policy": "2.16.76.1.7.1.11.1.3"}, operation_id="o00000000000000000000000000000001")
        values.update(changes); return canonicalize_hmac_request(**values)

    def test_hmac_valid_vector(self):
        key = bytes(range(32)); self.assertEqual(calculate_hmac(key, self._canonical()), "3296dcfd766244da9b3cc6f9c0f74b9f19b2f02e480f0e36b32c4db3fd72fcd7"); self.assertTrue(validate_hmac(key, self._canonical(), calculate_hmac(key, self._canonical())))

    def test_hmac_body_nonce_timestamp_path_method_parameter_and_length_changes(self):
        key = bytes(range(32)); base = self._canonical()
        vectors = [
            ({}, "3296dcfd766244da9b3cc6f9c0f74b9f19b2f02e480f0e36b32c4db3fd72fcd7", True),
            ({"content_sha256": hashlib.sha256(b"PDF-B").hexdigest()}, "32306e13811a8c5a0e46f448303aa93b2fd60a0e7f059c3a82d6424cf036093e", False),
            # Same nonce has a valid MAC but is rejected by NonceRegistry.
            ({"request_nonce": "n00000000000000000000000000000001"}, "3296dcfd766244da9b3cc6f9c0f74b9f19b2f02e480f0e36b32c4db3fd72fcd7", True),
            ({"timestamp": 1759999000}, "c12a07202bd64ea934a0758bdd8bc1922688a60e564c50f38a268c8b05673fb3", False),
            ({"path": "/v1/other"}, "1bfdd4470abe8a81e7eb6c86b634d3afa7b91e1a3c019c39e7bd0a5969f18cb4", False),
        ]
        for changes, expected, valid in vectors:
            canonical = self._canonical(**changes)
            self.assertEqual(calculate_hmac(key, canonical), expected)
            supplied = expected if valid else calculate_hmac(key, base)
            self.assertEqual(validate_hmac(key, canonical, supplied), valid)
        for changes in ({"method": "GET"}, {"parameters": {"field": "Other", "policy": "2.16.76.1.7.1.11.1.3"}}, {"body_length": 6}):
            self.assertFalse(validate_hmac(key, self._canonical(**changes), calculate_hmac(key, base)))

    def test_timestamp_and_nonce_replay(self):
        self.assertTrue(validate_timestamp(1000, 1029)); self.assertFalse(validate_timestamp(1000, 1031))
        registry = NonceRegistry(); nonce = b64url_encode(b"x" * 16); self.assertTrue(registry.consume(nonce)); self.assertFalse(registry.consume(nonce))

    def test_protocol_does_not_log_secrets(self):
        with self.assertRaises(ValueError) as error: validate_public_key("bad")
        self.assertNotIn("bad", str(error.exception))


if __name__ == "__main__": unittest.main()
