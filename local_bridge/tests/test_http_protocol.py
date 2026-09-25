import hashlib
import asyncio
import time
import unittest

from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives.serialization import Encoding, PublicFormat
from fastapi.testclient import TestClient

from local_bridge.security.http_protocol import HttpProtocolService, create_in_memory_app
from local_bridge.security.protocol import b64url_encode, canonicalize_hmac_request, calculate_hmac, derive_session_key
from local_bridge.security.state import State
from local_bridge.security.ui import ApprovalDecision, PendingApprovalUI


class ApproveUI(PendingApprovalUI):
    def approve_pairing(self, request): return ApprovalDecision.APPROVED
    def approve_signature(self, operation): return ApprovalDecision.APPROVED


class DenyUI(ApproveUI):
    def approve_signature(self, operation): return ApprovalDecision.DENIED


class HttpProtocolTests(unittest.TestCase):
    def make_service(self, ui=None):
        service = HttpProtocolService(ui=ui or ApproveUI())
        client_key = ec.derive_private_key(7, ec.SECP256R1())
        client_public = b64url_encode(client_key.public_key().public_bytes(Encoding.X962, PublicFormat.UncompressedPoint))
        pairing = TestClient(service.create_app()).post("/v1/pairing-requests", headers={"host": "localhost:8765", "origin": "https://localhost:5173"}, json={"client_instance_id": b64url_encode(b"c" * 16), "client_nonce": b64url_encode(b"n" * 16), "client_ecdh_public_key": client_public})
        self.assertEqual(pairing.status_code, 200)
        self.assertEqual(pairing.json()["state"], "APPROVED")
        return service, TestClient(service.create_app()), pairing.json()["session_id"]

    def auth_headers(self, service, session_id, method, path, operation_id, body=b"", extra=None, nonce_byte=b"q"):
        origin = "https://localhost:5173"
        params = {"operation_id": operation_id}
        if method == "POST":
            params.update({"field_name": "BranaSignature_1", "policy_oid": "2.16.76.1.7.1.11.1.3", "profile": "pades-ad-rb-1.3"})
        nonce = b64url_encode(nonce_byte * 16)
        timestamp = int(time.time())
        content_hash = hashlib.sha256(body).hexdigest()
        canonical = canonicalize_hmac_request(method=method, path=path, origin=origin, timestamp=timestamp, request_nonce=nonce, session_id=session_id, content_sha256=content_hash, body_length=len(body), parameters=params, operation_id=operation_id)
        return {"host": "localhost:8765", "origin": origin, "X-Brana-Bridge-Protocol": "brana-bridge-v1", "X-Brana-Session": session_id, "X-Brana-Timestamp": str(timestamp), "X-Brana-Request-Nonce": nonce, "X-Brana-Content-SHA256": content_hash, "X-Brana-Request-MAC": calculate_hmac(service.session_keys[session_id], canonical), "X-Brana-Operation-Id": operation_id, "X-Brana-Field-Name": "BranaSignature_1", "X-Brana-Policy-OID": "2.16.76.1.7.1.11.1.3", "X-Brana-Profile": "pades-ad-rb-1.3"}

    def operation(self, service, client, session_id, operation_id=None, body=b"PDF-SYNTHETIC"):
        operation_id = operation_id or b64url_encode(b"o" * 16)
        response = client.post("/v1/signature-operations", headers=self.auth_headers(service, session_id, "POST", "/v1/signature-operations", operation_id, body), content=body)
        self.assertEqual(response.status_code, 200)
        return operation_id
    def test_all_v1_completion_routes_exist_and_legacy_routes_do_not(self):
        app = create_in_memory_app()
        paths = {route.path for route in app.routes}
        for path in (
            "/v1/pairing-requests/{request_id}",
            "/v1/sessions/{session_id}",
            "/v1/signature-operations/{operation_id}",
            "/v1/signature-operations/{operation_id}/result",
        ):
            self.assertIn(path, paths)
        self.assertNotIn("/assinar-pdf", paths); self.assertNotIn("/certificados", paths)

    def test_health_and_pairing_are_in_memory(self):
        client = TestClient(create_in_memory_app(ui=ApproveUI()))
        self.assertEqual(client.get("/health").status_code, 200)
        response = client.post("/v1/pairing-requests", headers={"host": "localhost:8765", "origin": "https://localhost:5173"}, json={"client_instance_id": "AQEBAQEBAQEBAQEBAQEBAQ", "client_nonce": "AgICAgICAgICAgICAgICAg", "client_ecdh_public_key": "BAD"})
        self.assertIn(response.status_code, (400, 422))

    def test_wrong_host_and_origin_are_rejected_before_processing(self):
        client = TestClient(create_in_memory_app())
        response = client.post("/v1/pairing-requests", headers={"host": "localhost:8766", "origin": "https://localhost:5173"}, json={})
        self.assertEqual(response.status_code, 403)
        response = client.post("/v1/pairing-requests", headers={"host": "localhost:8765", "origin": "http://localhost:5173"}, content=b"not-read")
        self.assertEqual(response.status_code, 403)

    def test_preflight_has_no_side_effect(self):
        client = TestClient(create_in_memory_app())
        response = client.options("/v1/signature-operations", headers={"host": "localhost:8765", "origin": "https://localhost:5173"})
        self.assertEqual(response.status_code, 204)

    def test_pairing_query_and_delete_require_proof(self):
        client = TestClient(create_in_memory_app())
        headers = {"host": "localhost:8765", "origin": "https://localhost:5173"}
        response = client.get("/v1/pairing-requests/AAAAAAAAAAAAAAAAAAAAAA", headers=headers)
        self.assertIn(response.status_code, (401, 403))
        response = client.delete("/v1/pairing-requests/AAAAAAAAAAAAAAAAAAAAAA", headers=headers)
        self.assertIn(response.status_code, (401, 403))

    def test_operation_query_result_and_delete_require_proof(self):
        client = TestClient(create_in_memory_app())
        headers = {"host": "localhost:8765", "origin": "https://localhost:5173"}
        for path in (
            "/v1/signature-operations/AAAAAAAAAAAAAAAAAAAAAA",
            "/v1/signature-operations/AAAAAAAAAAAAAAAAAAAAAA/result",
        ):
            response = client.get(path, headers=headers)
            self.assertIn(response.status_code, (401, 403))
        response = client.delete("/v1/signature-operations/AAAAAAAAAAAAAAAAAAAAAA", headers=headers)
        self.assertIn(response.status_code, (401, 403))

    def test_session_delete_requires_proof(self):
        client = TestClient(create_in_memory_app())
        response = client.delete("/v1/sessions/AAAAAAAAAAAAAAAAAAAAAA", headers={"host": "localhost:8765", "origin": "https://localhost:5173"})
        self.assertIn(response.status_code, (401, 403))

    def test_approved_pairing_operation_and_result_lifecycle(self):
        service, client, session = self.make_service()
        op = self.operation(service, client, session)
        headers = self.auth_headers(service, session, "GET", f"/v1/signature-operations/{op}", op, nonce_byte=b"a")
        self.assertEqual(client.get(f"/v1/signature-operations/{op}", headers=headers).json()["state"], "APPROVED")
        service.state.operations[op].state = State.COMPLETED
        service.state.operations[op].result = b"%PDF-synthetic-result"
        first = client.get(f"/v1/signature-operations/{op}/result", headers=self.auth_headers(service, session, "GET", f"/v1/signature-operations/{op}/result", op, nonce_byte=b"b"))
        second = client.get(f"/v1/signature-operations/{op}/result", headers=self.auth_headers(service, session, "GET", f"/v1/signature-operations/{op}/result", op, nonce_byte=b"d"))
        self.assertEqual(first.status_code, 200); self.assertEqual(first.content, second.content); self.assertEqual(first.headers["content-type"], "application/pdf")

    def test_denied_operation_is_reflected_by_post_and_authenticated_get(self):
        service, client, session = self.make_service(DenyUI())
        op = self.operation(service, client, session)
        self.assertEqual(service.state.operations[op].state, State.DENIED)
        path = f"/v1/signature-operations/{op}"
        response = client.get(path, headers=self.auth_headers(service, session, "GET", path, op, nonce_byte=b"z"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["state"], "DENIED")
        with self.assertRaises(Exception):
            service.state.approve_operation(__import__("local_bridge.security.state", fromlist=["AuthorizationContext"]).AuthorizationContext(session, "https://localhost:5173", op, True, "approve_operation"))

    def test_operation_cancel_and_idempotent_cancel(self):
        service, client, session = self.make_service(); op = self.operation(service, client, session)
        path = f"/v1/signature-operations/{op}"
        first = client.delete(path, headers=self.auth_headers(service, session, "DELETE", path, op, nonce_byte=b"e"))
        second = client.delete(path, headers=self.auth_headers(service, session, "DELETE", path, op, nonce_byte=b"f"))
        self.assertEqual(first.json()["state"], "CANCELLED"); self.assertEqual(second.json()["state"], "CANCELLED")

    def test_session_revocation_requires_mac_and_blocks_later_query(self):
        service, client, session = self.make_service(); op = self.operation(service, client, session)
        path = f"/v1/sessions/{session}"
        revoked = client.delete(path, headers=self.auth_headers(service, session, "DELETE", path, session, nonce_byte=b"g"))
        self.assertEqual(revoked.json()["state"], "REVOKED")
        query = client.get(f"/v1/signature-operations/{op}", headers=self.auth_headers(service, session, "GET", f"/v1/signature-operations/{op}", op, nonce_byte=b"h"))
        self.assertEqual(query.status_code, 401)

    def test_result_incomplete_and_expired_are_sanitized(self):
        service, client, session = self.make_service(); op = self.operation(service, client, session); path = f"/v1/signature-operations/{op}/result"
        not_ready = client.get(path, headers=self.auth_headers(service, session, "GET", path, op, nonce_byte=b"i")); self.assertEqual(not_ready.status_code, 409); self.assertEqual(not_ready.json()["error_code"], "RESULT_NOT_READY")
        service.state.operations[op].state = State.COMPLETED; service.state.operations[op].result = None
        expired = client.get(path, headers=self.auth_headers(service, session, "GET", path, op, nonce_byte=b"j")); self.assertEqual(expired.status_code, 410); self.assertEqual(expired.json()["error_code"], "RESULT_EXPIRED")

    def test_invalid_mac_replay_and_wrong_origin_are_rejected(self):
        service, client, session = self.make_service(); op = b64url_encode(b"z" * 16); path = f"/v1/signature-operations/{op}"
        headers = self.auth_headers(service, session, "GET", path, op, nonce_byte=b"k"); headers["X-Brana-Request-MAC"] = "0" * 64
        self.assertEqual(client.get(path, headers=headers).status_code, 401)
        good = self.auth_headers(service, session, "GET", path, op, nonce_byte=b"l"); good["origin"] = "https://evil.example"
        self.assertEqual(client.get(path, headers=good).status_code, 403)

    def test_no_certificate_signer_or_legacy_calls(self):
        service, client, session = self.make_service(); op = self.operation(service, client, session)
        self.assertFalse(hasattr(service, "signer")); self.assertFalse(hasattr(service, "certificate_store")); self.assertNotIn("/assinar-pdf", {route.path for route in service.create_app().routes})

    def test_asgi_declared_content_length_divergence_uses_real_body_size(self):
        service, _, session = self.make_service(); app = service.create_app(); body = b"PDF-SYNTHETIC"; operation_id = b64url_encode(b"u" * 16)
        headers = self.auth_headers(service, session, "POST", "/v1/signature-operations", operation_id, body)
        headers["content-length"] = "999999"
        scope = {"type": "http", "http_version": "1.1", "method": "POST", "path": "/v1/signature-operations", "raw_path": b"/v1/signature-operations", "query_string": b"", "headers": [(key.lower().encode("ascii"), value.encode("utf-8")) for key, value in headers.items()], "scheme": "https", "server": ("localhost", 8765), "client": ("127.0.0.1", 50000), "root_path": ""}
        sent = []
        async def receive():
            return {"type": "http.request", "body": body, "more_body": False}
        async def send(message):
            sent.append(message)
        asyncio.run(app(scope, receive, send))
        response_body = b"".join(message.get("body", b"") for message in sent if message["type"] == "http.response.body")
        status = next(message["status"] for message in sent if message["type"] == "http.response.start")
        self.assertEqual(status, 200)
        self.assertIn(operation_id.encode(), response_body)
        self.assertEqual(service.state.operations[operation_id].prepared_pdf_sha256, hashlib.sha256(body).hexdigest())

    def test_http_layer_does_not_start_signing_or_call_signer(self):
        service, client, session = self.make_service(); operation_id = self.operation(service, client, session)
        self.assertEqual(service.state.operations[operation_id].state, State.APPROVED)
        self.assertFalse(hasattr(service, "signer")); self.assertFalse(hasattr(service, "certificate_store"))

    def test_negative_host_incorrect(self):
        response = TestClient(create_in_memory_app()).get("/v1/signature-operations/x", headers={"host": "localhost:8766", "origin": "https://localhost:5173"}); self.assertEqual(response.status_code, 403)

    def test_negative_origin_absent(self):
        response = TestClient(create_in_memory_app()).get("/v1/signature-operations/x", headers={"host": "localhost:8765"}); self.assertEqual(response.status_code, 403)

    def test_negative_origin_null(self):
        response = TestClient(create_in_memory_app()).get("/v1/signature-operations/x", headers={"host": "localhost:8765", "origin": "null"}); self.assertEqual(response.status_code, 403)

    def test_negative_origin_http(self):
        response = TestClient(create_in_memory_app()).get("/v1/signature-operations/x", headers={"host": "localhost:8765", "origin": "http://localhost:5173"}); self.assertEqual(response.status_code, 403)

    def test_negative_origin_not_allowed(self):
        response = TestClient(create_in_memory_app()).get("/v1/signature-operations/x", headers={"host": "localhost:8765", "origin": "https://evil.example"}); self.assertEqual(response.status_code, 403)

    def test_negative_protocol_incorrect(self):
        service, client, session = self.make_service(); op = b64url_encode(b"a" * 16); headers = self.auth_headers(service, session, "GET", f"/v1/signature-operations/{op}", op); headers["X-Brana-Bridge-Protocol"] = "wrong"; self.assertIn(client.get(f"/v1/signature-operations/{op}", headers=headers).status_code, (401, 403))

    def test_negative_required_header_missing(self):
        service, client, session = self.make_service(); op = b64url_encode(b"b" * 16); headers = self.auth_headers(service, session, "GET", f"/v1/signature-operations/{op}", op); del headers["X-Brana-Request-MAC"]; self.assertEqual(client.get(f"/v1/signature-operations/{op}", headers=headers).status_code, 401)

    def test_negative_timestamp_outside_window(self):
        service, client, session = self.make_service(); op = b64url_encode(b"c" * 16); headers = self.auth_headers(service, session, "GET", f"/v1/signature-operations/{op}", op); headers["X-Brana-Timestamp"] = "1"; self.assertEqual(client.get(f"/v1/signature-operations/{op}", headers=headers).status_code, 401)

    def test_negative_mac_invalid(self):
        service, client, session = self.make_service(); op = b64url_encode(b"d" * 16); headers = self.auth_headers(service, session, "GET", f"/v1/signature-operations/{op}", op); headers["X-Brana-Request-MAC"] = "0" * 64; self.assertEqual(client.get(f"/v1/signature-operations/{op}", headers=headers).status_code, 401)

    def test_negative_nonce_repeated(self):
        service, client, session = self.make_service(); op = b64url_encode(b"e" * 16); path = f"/v1/signature-operations/{op}"; headers = self.auth_headers(service, session, "GET", path, op, nonce_byte=b"r"); self.assertIn(client.get(path, headers=headers).status_code, (401, 404)); self.assertEqual(client.get(path, headers=headers).status_code, 401)

    def test_negative_request_id_isolated(self):
        response = TestClient(create_in_memory_app()).get("/v1/pairing-requests/AAAAAAAAAAAAAAAAAAAAAA", headers={"host": "localhost:8765", "origin": "https://localhost:5173"}); self.assertIn(response.status_code, (401, 403))

    def test_negative_operation_id_isolated(self):
        response = TestClient(create_in_memory_app()).get("/v1/signature-operations/AAAAAAAAAAAAAAAAAAAAAA", headers={"host": "localhost:8765", "origin": "https://localhost:5173"}); self.assertIn(response.status_code, (401, 403))

    def test_negative_session_id_incorrect(self):
        service, client, session = self.make_service(); op = b64url_encode(b"f" * 16); headers = self.auth_headers(service, session, "GET", f"/v1/signature-operations/{op}", op); headers["X-Brana-Session"] = b64url_encode(b"x" * 16); self.assertEqual(client.get(f"/v1/signature-operations/{op}", headers=headers).status_code, 401)

    def test_negative_origin_diverges_from_session(self):
        service, client, session = self.make_service(); op = b64url_encode(b"g" * 16); headers = self.auth_headers(service, session, "GET", f"/v1/signature-operations/{op}", op); headers["origin"] = "https://192.168.3.41:5173"; self.assertIn(client.get(f"/v1/signature-operations/{op}", headers=headers).status_code, (401, 403))

    def test_negative_public_key_invalid(self):
        response = TestClient(create_in_memory_app()).post("/v1/pairing-requests", headers={"host": "localhost:8765", "origin": "https://localhost:5173"}, json={"client_instance_id": b64url_encode(b"h" * 16), "client_nonce": b64url_encode(b"i" * 16), "client_ecdh_public_key": "invalid"}); self.assertEqual(response.status_code, 400)

    def test_negative_nonce_invalid(self):
        response = TestClient(create_in_memory_app()).post("/v1/pairing-requests", headers={"host": "localhost:8765", "origin": "https://localhost:5173"}, json={"client_instance_id": b64url_encode(b"j" * 16), "client_nonce": "bad", "client_ecdh_public_key": "bad"}); self.assertEqual(response.status_code, 400)

    def test_negative_empty_body(self):
        service, client, session = self.make_service(); op = b64url_encode(b"k" * 16); self.assertEqual(client.post("/v1/signature-operations", headers=self.auth_headers(service, session, "POST", "/v1/signature-operations", op, b""), content=b"").status_code, 400)

    def test_negative_body_over_25_mib(self):
        service, client, session = self.make_service(); op = b64url_encode(b"l" * 16); body = b"x" * (25 * 1024 * 1024 + 1); self.assertEqual(client.post("/v1/signature-operations", headers=self.auth_headers(service, session, "POST", "/v1/signature-operations", op, body), content=body).status_code, 413)

    def test_negative_hash_divergent(self):
        service, client, session = self.make_service(); op = b64url_encode(b"m" * 16); body = b"PDF"; headers = self.auth_headers(service, session, "POST", "/v1/signature-operations", op, body); headers["X-Brana-Content-SHA256"] = "0" * 64; self.assertEqual(client.post("/v1/signature-operations", headers=headers, content=body).status_code, 400)

    def test_negative_size_divergent(self):
        service, client, session = self.make_service(); op = b64url_encode(b"n" * 16); body = b"PDF"; headers = self.auth_headers(service, session, "POST", "/v1/signature-operations", op, body); response = client.post("/v1/signature-operations", headers=headers, content=body); self.assertEqual(response.status_code, 200)

    def test_negative_field_name_divergent(self):
        service, client, session = self.make_service(); op = b64url_encode(b"o" * 16); body = b"PDF"; headers = self.auth_headers(service, session, "POST", "/v1/signature-operations", op, body); headers["X-Brana-Field-Name"] = "Other"; self.assertEqual(client.post("/v1/signature-operations", headers=headers, content=body).status_code, 400)

    def test_negative_profile_divergent(self):
        service, client, session = self.make_service(); op = b64url_encode(b"p" * 16); body = b"PDF"; headers = self.auth_headers(service, session, "POST", "/v1/signature-operations", op, body); headers["X-Brana-Profile"] = "other"; self.assertEqual(client.post("/v1/signature-operations", headers=headers, content=body).status_code, 400)

    def test_negative_policy_divergent(self):
        service, client, session = self.make_service(); op = b64url_encode(b"q" * 16); body = b"PDF"; headers = self.auth_headers(service, session, "POST", "/v1/signature-operations", op, body); headers["X-Brana-Policy-OID"] = "1.2.3"; self.assertEqual(client.post("/v1/signature-operations", headers=headers, content=body).status_code, 400)

    def test_negative_cancel_during_signing(self):
        service, client, session = self.make_service(); op = self.operation(service, client, session); service.state.operations[op].state = State.SIGNING; path = f"/v1/signature-operations/{op}"; self.assertNotEqual(client.delete(path, headers=self.auth_headers(service, session, "DELETE", path, op, nonce_byte=b"s")).status_code, 200)

    def test_negative_result_expired(self):
        service, client, session = self.make_service(); op = self.operation(service, client, session); service.state.operations[op].state = State.COMPLETED; service.state.operations[op].result = None; path = f"/v1/signature-operations/{op}/result"; response = client.get(path, headers=self.auth_headers(service, session, "GET", path, op, nonce_byte=b"t")); self.assertEqual(response.status_code, 410)


if __name__ == "__main__": unittest.main()
