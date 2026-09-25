import unittest
from concurrent.futures import ThreadPoolExecutor

from local_bridge.security.protocol import b64url_encode
from local_bridge.security.state import AuthorizationContext, BridgeState, State, StateError


class Clock:
    def __init__(self): self.value = 1000
    def __call__(self): return self.value
    def advance(self, seconds): self.value += seconds


def ident(byte): return b64url_encode(bytes([byte]) * 16)


class StateTests(unittest.TestCase):
    def setUp(self):
        self.clock = Clock(); self.machine = BridgeState(self.clock, authorize=lambda context, action: context.proof == "test-proof"); self.origin = "https://localhost:5173"; self.client = ident(1)
        self.pair = self.machine.create_pairing(self.origin, self.client); self.session = self.machine.approve_pairing(self.pair.request_id)

    def operation(self, operation_id=None, digest="a" * 64):
        return self.machine.create_operation(session_id=self.session, origin=self.origin, operation_id=operation_id or ident(2), prepared_pdf_sha256=digest, field_name="BranaSignature_1", policy_oid="2.16.76.1.7.1.11.1.3", profile="pades-ad-rb-1.3", certificate_binding="synthetic-cert")

    def context(self, operation_id, action, proof="test-proof"):
        return AuthorizationContext(self.session, self.origin, operation_id, proof, action)

    def test_pairing_expiry(self):
        pair = self.machine.create_pairing(self.origin, ident(3)); self.clock.advance(121); self.machine.expire(); self.assertEqual(self.machine.pairings[pair.request_id].state, State.EXPIRED)

    def test_session_idle_expiry_and_revocation(self):
        self.clock.advance(601); self.machine.expire(); self.assertTrue(self.machine.sessions[self.session]["revoked"])

    def test_approval_expiry(self):
        op = self.operation(); self.clock.advance(121); self.machine.expire(); self.assertEqual(op.state, State.EXPIRED)

    def test_approval_is_single_use(self):
        op = self.operation(); self.machine.approve_operation(self.context(op.operation_id, "approve_operation"))
        with self.assertRaises(StateError): self.machine.approve_operation(self.context(op.operation_id, "approve_operation"))

    def test_explicit_denial_is_terminal_and_cannot_be_approved(self):
        op = self.operation()
        self.machine.deny_operation(self.context(op.operation_id, "deny_operation"))
        self.assertEqual(op.state, State.DENIED)
        with self.assertRaises(StateError) as error:
            self.machine.approve_operation(self.context(op.operation_id, "approve_operation"))
        self.assertEqual(error.exception.code, "OPERATION_NOT_PENDING")

    def test_atomic_signing_and_second_operation_block(self):
        op = self.operation(); other = self.operation(ident(4)); self.machine.approve_operation(self.context(op.operation_id, "approve_operation")); self.machine.approve_operation(self.context(other.operation_id, "approve_operation")); self.machine.begin_signing(op.operation_id)
        with self.assertRaises(StateError) as error: self.machine.begin_signing(other.operation_id)
        self.assertEqual(error.exception.code, "BRIDGE_BUSY")

    def test_cancel_before_signing(self):
        op = self.operation(); self.machine.cancel(self.context(op.operation_id, "cancel_operation")); self.assertEqual(op.state, State.CANCELLED)

    def test_cancel_during_signing_rejected(self):
        op = self.operation(); self.machine.approve_operation(self.context(op.operation_id, "approve_operation")); self.machine.begin_signing(op.operation_id)
        with self.assertRaises(StateError) as error: self.machine.cancel(self.context(op.operation_id, "cancel_operation"))
        self.assertEqual(error.exception.code, "SIGNING_IN_PROGRESS")

    def test_idempotency_same_binding(self):
        op = self.operation(); same = self.operation(op.operation_id); self.assertIs(op, same)

    def test_idempotency_content_and_binding_conflicts(self):
        op = self.operation()
        with self.assertRaises(StateError) as error: self.operation(op.operation_id, "b" * 64)
        self.assertEqual(error.exception.code, "CONTENT_CONFLICT")
        with self.assertRaises(StateError) as error: self.machine.create_operation(session_id=self.session, origin=self.origin, operation_id=op.operation_id, prepared_pdf_sha256="a" * 64, field_name="Other", policy_oid=op.policy_oid, profile=op.profile, certificate_binding=op.certificate_binding)
        self.assertEqual(error.exception.code, "IDEMPOTENCY_CONFLICT")

    def test_completion_and_result_expiry(self):
        op = self.operation(); self.machine.approve_operation(self.context(op.operation_id, "approve_operation")); self.machine.begin_signing(op.operation_id); self.machine.complete(op.operation_id, b"signed")
        self.assertEqual(op.state, State.COMPLETED); self.assertEqual(op.result, b"signed"); self.clock.advance(301); self.machine.expire(); self.assertIsNone(op.result)

    def test_revocation_blocks_access(self):
        self.machine.revoke_session(self.session, local_authority=True)
        with self.assertRaises(StateError) as error: self.machine.get_operation("missing", self.session, self.origin)
        self.assertEqual(error.exception.code, "SESSION_REVOKED")

    def test_auth_failures_revoke_after_three(self):
        for _ in range(3): self.machine.record_auth_failure(self.session)
        self.assertTrue(self.machine.sessions[self.session]["revoked"])

    def test_request_id_alone_never_cancels(self):
        with self.assertRaises(StateError) as error: self.machine.cancel(self.context(self.pair.request_id, "cancel_operation"))
        self.assertEqual(error.exception.code, "OPERATION_NOT_FOUND")

    def test_recreated_machine_has_no_persisted_state(self):
        self.assertEqual(BridgeState(self.clock).pairings, {})

    def test_completion_failure_and_terminal_cancel(self):
        op = self.operation(); self.machine.approve_operation(self.context(op.operation_id, "approve_operation")); self.machine.begin_signing(op.operation_id); self.machine.fail(op.operation_id); self.assertEqual(op.state, State.FAILED)
        with self.assertRaises(StateError): self.machine.cancel(self.context(op.operation_id, "cancel_operation"))

    def test_approval_and_cancel_require_authorized_context(self):
        op = self.operation()
        with self.assertRaises(StateError) as error: self.machine.approve_operation(self.context(op.operation_id, "approve_operation", proof="wrong"))
        self.assertEqual(error.exception.code, "UNAUTHORIZED")
        with self.assertRaises(StateError) as error: self.machine.cancel(self.context(op.operation_id, "cancel_operation", proof="wrong"))
        self.assertEqual(error.exception.code, "UNAUTHORIZED")

    def test_context_cannot_cross_session_or_origin(self):
        op = self.operation()
        with self.assertRaises(StateError) as error: self.machine.approve_operation(AuthorizationContext(ident(9), self.origin, op.operation_id, "test-proof", "approve_operation"))
        self.assertEqual(error.exception.code, "FORBIDDEN")

    def test_two_real_threads_have_one_atomic_signing_winner(self):
        first = self.operation(ident(6)); second = self.operation(ident(7))
        self.machine.approve_operation(self.context(first.operation_id, "approve_operation")); self.machine.approve_operation(self.context(second.operation_id, "approve_operation"))
        def attempt(operation_id):
            try:
                self.machine.begin_signing(operation_id)
                return None
            except StateError as error:
                return error
        with ThreadPoolExecutor(max_workers=2) as pool:
            results = list(pool.map(attempt, (first.operation_id, second.operation_id)))
        self.assertEqual(sum(result is None for result in results), 1)
        self.assertEqual(sum(isinstance(result, StateError) and result.code == "BRIDGE_BUSY" for result in results), 1)


if __name__ == "__main__": unittest.main()
