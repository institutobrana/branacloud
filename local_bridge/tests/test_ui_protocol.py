import time
import unittest

from local_bridge.security.ui_protocol import (
    DecisionGuard, UIProtocolError, decode_frame, encode_frame, sanitized_error,
)


def pairing(kind="PAIRING_REQUEST", **extra):
    return {"protocol":"brana-ui-v1","message_type":kind,"request_id":"req-1","origin":"https://localhost:5173","nonce":"nonce-1","expires_at":time.time()+120, **extra}


def signature(kind="SIGNATURE_REQUEST", **extra):
    return {"protocol":"brana-ui-v1","message_type":kind,"operation_id":"op-1","origin":"https://localhost:5173","nonce":"nonce-1","prepared_pdf_sha256":"a"*64,"field_name":"BranaSignature_1","profile":"pades-ad-rb-1.3","policy_oid":"2.16.76.1.7.1.11.1.3","expires_at":time.time()+120, **extra}


class UIProtocolTests(unittest.TestCase):
    def test_round_trip_compact_utf8(self):
        message = pairing(technical_name="synthetic")
        self.assertEqual(decode_frame(encode_frame(message))["request_id"], "req-1")

    def test_shared_vector_one_has_fixed_bytes(self):
        message = pairing(expires_at=4102444800)
        expected = "0000009c7b2270726f746f636f6c223a226272616e612d75692d7631222c226d6573736167655f74797065223a2250414952494e475f52455155455354222c22726571756573745f6964223a227265712d31222c226f726967696e223a2268747470733a2f2f6c6f63616c686f73743a35313733222c226e6f6e6365223a226e6f6e63652d31222c22657870697265735f6174223a343130323434343830307d"
        self.assertEqual(encode_frame(message).hex(), expected)

    def test_shared_vectors_two_and_three_have_fixed_framing(self):
        vectors = [
            pairing(expires_at=4102444801, client_instance_id="client-1"),
            {"protocol":"brana-ui-v1","message_type":"APPROVE","operation_id":"op-1","origin":"https://localhost:5173","nonce":"nonce-approve","expires_at":4102444802},
        ]
        for message in vectors:
            frame = encode_frame(message)
            self.assertEqual(int.from_bytes(frame[:4], "big"), len(frame) - 4)
            self.assertEqual(decode_frame(frame), message)

    def test_truncated_oversized_and_invalid_json(self):
        for frame, code in [(b"\x00", "FRAME_TRUNCATED"), ((16*1024+1).to_bytes(4,"big") + b"x", "MESSAGE_TOO_LARGE"), (b"\x00\x00\x00\x08not-json", "JSON_INVALID")]:
            with self.subTest(code=code), self.assertRaisesRegex(UIProtocolError, code): decode_frame(frame)

    def test_unknown_type_and_bindings(self):
        with self.assertRaisesRegex(UIProtocolError, "MESSAGE_TYPE_INVALID"): encode_frame({**pairing(), "message_type":"OTHER"})
        guard=DecisionGuard.create()
        with self.assertRaisesRegex(UIProtocolError, "ORIGIN_MISMATCH"): guard.accept(pairing("APPROVE"), expected_origin="https://other", expected_id="req-1")
        with self.assertRaisesRegex(UIProtocolError, "IDENTIFIER_MISMATCH"): guard.accept(pairing("APPROVE"), expected_origin="https://localhost:5173", expected_id="other")

    def test_hash_field_policy_and_origin_contract(self):
        for key, value, code in [("prepared_pdf_sha256","b"*64,"HASH_MISMATCH"),("field_name","Other","SIGNATURE_BINDING_INVALID"),("policy_oid","wrong","SIGNATURE_BINDING_INVALID")]:
            message=signature(**{key:value})
            with self.subTest(code=code), self.assertRaisesRegex(UIProtocolError, code):
                if code == "HASH_MISMATCH": DecisionGuard.create().accept(message, expected_origin="https://localhost:5173", expected_id="op-1", expected_hash="a"*64)
                else: encode_frame(message)

    def test_replay_duplicate_expired_cancel_and_deny(self):
        guard=DecisionGuard.create(); guard.accept(pairing("APPROVE"), expected_origin="https://localhost:5173", expected_id="req-1")
        with self.assertRaisesRegex(UIProtocolError, "DECISION_DUPLICATE"): guard.accept(pairing("DENY", nonce="nonce-2"), expected_origin="https://localhost:5173", expected_id="req-1", now=time.time())
        expired=pairing("CANCEL", nonce="nonce-2", expires_at=time.time()-1)
        with self.assertRaisesRegex(UIProtocolError, "MESSAGE_EXPIRED"): encode_frame(expired)
        with self.assertRaisesRegex(UIProtocolError, "NONCE_REPLAY"): guard.accept(pairing("CANCEL", nonce="nonce-1"), expected_origin="https://localhost:5173", expected_id="req-1")

    def test_signature_decision_can_bind_operation(self):
        guard=DecisionGuard.create(); msg=signature("APPROVE", nonce="nonce-2")
        result=guard.accept(msg, expected_origin="https://localhost:5173", expected_id="op-1", expected_hash="a"*64)
        self.assertEqual(result["operation_id"], "op-1")

    def test_sanitized_errors_expose_no_payload(self):
        error=sanitized_error(UIProtocolError("HASH_MISMATCH secret"))
        self.assertEqual(error, {"protocol":"brana-ui-v1","message_type":"ERROR","error_code":"HASH_MISMATCH"})


if __name__ == "__main__": unittest.main()
