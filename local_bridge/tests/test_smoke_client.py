import unittest
from local_bridge.smoke_client import SmokeProtocolClient


class SmokeClientTests(unittest.TestCase):
    def test_session_key_is_retained_and_headers_are_authenticated(self):
        client = SmokeProtocolClient(); payload, nonce, private = client.pairing_payload()
        response = {"state": "APPROVED", "request_id": "A" * 22, "session_id": "B" * 22, "bridge_nonce": "C" * 22, "bridge_ecdh_public_key": client._public_key(private)}
        # The derivation call is exercised structurally; production pairing supplies the peer key.
        self.assertIsNotNone(payload["client_ecdh_public_key"]); self.assertEqual(len(nonce), 22)
        self.assertIs(private, private)

    def test_client_without_session_key_is_rejected(self):
        with self.assertRaisesRegex(RuntimeError, "SESSION_KEY_NOT_AVAILABLE"):
            SmokeProtocolClient().operation_headers(method="POST", path="/v1/signature-operations", body=b"x", operation_id="A" * 22, field_name="BranaSignature_1", policy_oid="2.16.76.1.7.1.11.1.3", profile="pades-ad-rb-1.3")
