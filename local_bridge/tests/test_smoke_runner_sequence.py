import unittest

from fastapi.testclient import TestClient

from local_bridge.security.http_protocol import HttpProtocolService
from local_bridge.security.ui import ApprovalDecision, PendingApprovalUI
from local_bridge.smoke_runner import SmokeHttpRunner


class _Approve(PendingApprovalUI):
    def approve_pairing(self, request): return ApprovalDecision.APPROVED
    def approve_signature(self, operation): return ApprovalDecision.APPROVED


class _PendingPairing(PendingApprovalUI):
    def approve_pairing(self, request): return ApprovalDecision.PENDING


class _ClientAdapter:
    def __init__(self, client): self.client = client; self.timeout = type("T", (), {"read": 120.0})()
    def post(self, path, **kwargs): return self.client.post(path, **kwargs)
    def get(self, path, **kwargs): return self.client.get(path, **kwargs)
    def delete(self, path, **kwargs): return self.client.delete(path, **kwargs)
    def close(self): pass


class SmokeRunnerSequenceTests(unittest.TestCase):
    def test_one_session_pairing_get_operation_get_no_sign(self):
        service = HttpProtocolService(ui=_Approve(), signer=None, signing_enabled=False)
        client = TestClient(service.create_app())
        runner = SmokeHttpRunner(http_client=_ClientAdapter(client))
        body = b"synthetic-pdf-bytes"
        response, private_key, nonce = runner.pairing()
        self.assertEqual(response.status_code, 200)
        runner.accept_pairing(response, private_key, nonce)
        session_id = runner.protocol.session.session_id
        pairing_get = runner.get_pairing(response=response, private_key=private_key, client_nonce=nonce)
        self.assertEqual(pairing_get.status_code, 200, pairing_get.text)
        self.assertEqual(pairing_get.json()["state"], "APPROVED")
        operation_id = "b3BlcmF0aW9uLWlk"
        created = runner.create_operation(operation_id=operation_id, pdf_bytes=body)
        self.assertEqual(created.status_code, 200)
        observed = runner.get_operation(operation_id=operation_id, pdf_bytes=body)
        self.assertEqual(observed.status_code, 200)
        self.assertEqual(observed.json()["state"], "APPROVED")
        self.assertEqual(runner.post_count, 2)
        self.assertIsNotNone(runner.protocol.session.session_key)
        runner.close()

    def test_pairing_get_and_delete_use_real_runner_authentication(self):
        service = HttpProtocolService(ui=_Approve(), signer=None, signing_enabled=False)
        client = TestClient(service.create_app())
        runner = SmokeHttpRunner(http_client=_ClientAdapter(client))
        response, private_key, nonce = runner.pairing()
        valid = runner.get_pairing(response=response, private_key=private_key, client_nonce=nonce)
        self.assertEqual(valid.status_code, 200)
        lower = {k.lower(): v for k, v in valid.request.headers.items()}
        self.assertIn("x-brana-bridge-protocol", lower)
        runner.close()

        pending_service = HttpProtocolService(ui=_PendingPairing(), signer=None, signing_enabled=False)
        pending_client = TestClient(pending_service.create_app())
        pending_runner = SmokeHttpRunner(http_client=_ClientAdapter(pending_client))
        pending, pkey, pnonce = pending_runner.pairing()
        deleted = pending_runner.delete_pairing(response=pending, private_key=pkey, client_nonce=pnonce)
        self.assertEqual(deleted.status_code, 200)
        self.assertEqual(deleted.json()["state"], "CANCELLED")
        pending_runner.close()

    def test_pairing_get_without_provisional_proof_is_rejected(self):
        service = HttpProtocolService(ui=_Approve(), signer=None, signing_enabled=False)
        client = TestClient(service.create_app())
        runner = SmokeHttpRunner(http_client=_ClientAdapter(client))
        response, private_key, nonce = runner.pairing()
        request_id = response.json()["request_id"]
        rejected = client.get(f"/v1/pairing-requests/{request_id}", headers={
            "Host": "localhost:8765", "Origin": runner.protocol.origin})
        self.assertEqual(rejected.status_code, 403)
        runner.close()
