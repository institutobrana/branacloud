"""Pure in-memory state machine for brana-bridge-v1."""

from __future__ import annotations

import hashlib
import threading
import time
from dataclasses import dataclass
from enum import Enum
from typing import Any

from .protocol import NonceRegistry, random_identifier, validate_client_instance_id


class State(str, Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    DENIED = "DENIED"
    EXPIRED = "EXPIRED"
    SIGNING = "SIGNING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"
    REVOKED = "REVOKED"


class StateError(RuntimeError):
    def __init__(self, code: str) -> None:
        super().__init__(code)
        self.code = code


@dataclass(frozen=True)
class AuthorizationContext:
    session_id: str
    origin: str
    operation_id: str
    proof: object
    action: str


@dataclass
class Pairing:
    request_id: str
    origin: str
    client_instance_id: str
    created_at: float
    expires_at: float
    state: State = State.PENDING
    session_id: str | None = None


@dataclass
class Operation:
    operation_id: str
    session_id: str
    origin: str
    prepared_pdf_sha256: str
    field_name: str
    policy_oid: str
    profile: str
    certificate_binding: str
    created_at: float
    approval_expires_at: float
    state: State = State.PENDING
    approved_at: float | None = None
    started_at: float | None = None
    result: bytes | None = None
    result_expires_at: float | None = None

    @property
    def binding_digest(self) -> str:
        value = "|".join((self.session_id, self.operation_id, self.prepared_pdf_sha256, self.field_name, self.policy_oid, self.profile, self.origin, self.certificate_binding))
        return hashlib.sha256(value.encode("utf-8")).hexdigest()


class BridgeState:
    PAIRING_TTL = 120
    SESSION_TTL = 30 * 60
    IDLE_TTL = 10 * 60
    APPROVAL_TTL = 120
    SIGNING_START_TTL = 30
    RESULT_TTL = 5 * 60
    MAX_PENDING_PAIRINGS = 3
    MAX_COMPLETED_PER_SESSION = 10

    def __init__(self, clock: Any = time.time, authorize: Any | None = None) -> None:
        self.clock = clock
        self.authorize = authorize
        self._transition_lock = threading.RLock()
        self.pairings: dict[str, Pairing] = {}
        self.sessions: dict[str, dict[str, Any]] = {}
        self.operations: dict[str, Operation] = {}
        self.nonces = NonceRegistry()
        self.active_operation_id: str | None = None
        self.auth_failures: dict[str, int] = {}

    def create_pairing(self, origin: str, client_instance_id: str) -> Pairing:
        validate_client_instance_id(client_instance_id)
        self.expire()
        pending = [p for p in self.pairings.values() if p.state is State.PENDING]
        if len(pending) >= self.MAX_PENDING_PAIRINGS:
            raise StateError("PAIRING_LIMIT")
        if any(p.origin == origin and p.client_instance_id == client_instance_id for p in pending):
            raise StateError("PAIRING_ALREADY_PENDING")
        now = self.clock()
        item = Pairing(random_identifier(), origin, client_instance_id, now, now + self.PAIRING_TTL)
        self.pairings[item.request_id] = item
        return item

    def approve_pairing(self, request_id: str, local_authority: bool = True) -> str:
        self.expire()
        item = self._pairing(request_id)
        if not local_authority:
            raise StateError("LOCAL_APPROVAL_REQUIRED")
        if item.state is not State.PENDING:
            raise StateError("PAIRING_NOT_PENDING")
        item.state = State.APPROVED
        item.session_id = random_identifier()
        now = self.clock()
        self.sessions[item.session_id] = {"origin": item.origin, "client": item.client_instance_id, "created": now, "last": now, "revoked": False, "completed": 0}
        return item.session_id

    def deny_pairing(self, request_id: str, local_authority: bool = True) -> None:
        item = self._pairing(request_id)
        if not local_authority:
            raise StateError("LOCAL_APPROVAL_REQUIRED")
        if item.state is not State.PENDING:
            raise StateError("PAIRING_NOT_PENDING")
        item.state = State.DENIED

    def revoke_session(self, session_id: str, local_authority: bool = False) -> None:
        session = self._session(session_id)
        if not local_authority:
            raise StateError("SESSION_PROOF_REQUIRED")
        session["revoked"] = True
        for operation in self.operations.values():
            if operation.session_id == session_id and operation.state not in {State.COMPLETED, State.FAILED, State.CANCELLED}:
                operation.state = State.REVOKED

    def create_operation(self, *, session_id: str, origin: str, operation_id: str, prepared_pdf_sha256: str, field_name: str, policy_oid: str, profile: str, certificate_binding: str) -> Operation:
        self._require_session(session_id, origin)
        existing = self.operations.get(operation_id)
        if existing:
            candidate = (session_id, operation_id, prepared_pdf_sha256, field_name, policy_oid, profile, origin, certificate_binding)
            current = (existing.session_id, existing.operation_id, existing.prepared_pdf_sha256, existing.field_name, existing.policy_oid, existing.profile, existing.origin, existing.certificate_binding)
            if candidate != current:
                raise StateError("IDEMPOTENCY_CONFLICT" if prepared_pdf_sha256 == existing.prepared_pdf_sha256 else "CONTENT_CONFLICT")
            return existing
        with self._transition_lock:
            if self.active_operation_id is not None:
                active = self.operations[self.active_operation_id]
                if active.state is State.SIGNING:
                    raise StateError("BRIDGE_BUSY")
            now = self.clock()
            item = Operation(operation_id, session_id, origin, prepared_pdf_sha256, field_name, policy_oid, profile, certificate_binding, now, now + self.APPROVAL_TTL)
            self.operations[operation_id] = item
            return item

    def approve_operation(self, context: AuthorizationContext) -> None:
        self._authorize_context(context, "approve_operation")
        self.expire()
        item = self._authorized_operation(context)
        if item.state is not State.PENDING:
            raise StateError("OPERATION_NOT_PENDING")
        item.state = State.APPROVED
        item.approved_at = self.clock()

    def deny_operation(self, context: AuthorizationContext) -> None:
        """Record an explicit local denial as a terminal decision."""
        self._authorize_context(context, "deny_operation")
        self.expire()
        item = self._authorized_operation(context)
        if item.state is not State.PENDING:
            raise StateError("OPERATION_NOT_PENDING")
        item.state = State.DENIED

    def begin_signing(self, operation_id: str) -> None:
        self.expire()
        item = self._operation(operation_id)
        if item.state is not State.APPROVED:
            raise StateError("OPERATION_NOT_APPROVED")
        if item.approved_at is None or self.clock() - item.approved_at > self.SIGNING_START_TTL:
            item.state = State.EXPIRED
            raise StateError("APPROVAL_EXPIRED")
        with self._transition_lock:
            if self.active_operation_id is not None:
                raise StateError("BRIDGE_BUSY")
            if item.state is not State.APPROVED:
                raise StateError("OPERATION_NOT_APPROVED")
            self.active_operation_id = operation_id
            item.state = State.SIGNING
            item.started_at = self.clock()

    def complete(self, operation_id: str, result: bytes) -> None:
        item = self._operation(operation_id)
        if item.state is not State.SIGNING:
            raise StateError("OPERATION_NOT_SIGNING")
        item.state = State.COMPLETED
        item.result = bytes(result)
        item.result_expires_at = self.clock() + self.RESULT_TTL
        self.active_operation_id = None
        self.sessions[item.session_id]["completed"] += 1

    def fail(self, operation_id: str) -> None:
        item = self._operation(operation_id)
        if item.state is not State.SIGNING:
            raise StateError("OPERATION_NOT_SIGNING")
        item.state = State.FAILED
        self.active_operation_id = None

    def cancel(self, context: AuthorizationContext) -> None:
        self._authorize_context(context, "cancel_operation")
        item = self._authorized_operation(context)
        if item.state is State.SIGNING:
            raise StateError("SIGNING_IN_PROGRESS")
        if item.state is State.COMPLETED:
            raise StateError("ALREADY_COMPLETED")
        if item.state in {State.CANCELLED, State.EXPIRED, State.REVOKED}:
            return
        if item.state is State.FAILED:
            raise StateError("OPERATION_TERMINAL")
        item.state = State.CANCELLED

    def get_operation(self, operation_id: str, session_id: str, origin: str) -> Operation:
        self._require_session(session_id, origin)
        item = self._operation(operation_id)
        if item.session_id != session_id:
            raise StateError("FORBIDDEN")
        self.expire()
        return item

    def expire(self) -> None:
        now = self.clock()
        for item in self.pairings.values():
            if item.state is State.PENDING and now >= item.expires_at:
                item.state = State.EXPIRED
        for session_id, session in self.sessions.items():
            if not session["revoked"] and now - session["last"] > self.IDLE_TTL or (not session["revoked"] and now - session["created"] > self.SESSION_TTL):
                session["revoked"] = True
                for operation in self.operations.values():
                    if operation.session_id == session_id and operation.state not in {State.COMPLETED, State.FAILED, State.CANCELLED}:
                        operation.state = State.REVOKED
        for item in self.operations.values():
            if item.state is State.PENDING and now >= item.approval_expires_at:
                item.state = State.EXPIRED
            if item.state is State.COMPLETED and item.result_expires_at and now >= item.result_expires_at:
                item.result = None

    def record_auth_failure(self, session_id: str) -> None:
        count = self.auth_failures.get(session_id, 0) + 1
        self.auth_failures[session_id] = count
        if count >= 3:
            self.revoke_session(session_id, local_authority=True)

    def _pairing(self, request_id: str) -> Pairing:
        if request_id not in self.pairings:
            raise StateError("REQUEST_NOT_FOUND")
        return self.pairings[request_id]

    def _operation(self, operation_id: str) -> Operation:
        if operation_id not in self.operations:
            raise StateError("OPERATION_NOT_FOUND")
        return self.operations[operation_id]

    def _authorized_operation(self, context: AuthorizationContext) -> Operation:
        item = self._operation(context.operation_id)
        if item.session_id != context.session_id or item.origin != context.origin:
            raise StateError("FORBIDDEN")
        return item

    def _authorize_context(self, context: AuthorizationContext, action: str) -> None:
        if not isinstance(context, AuthorizationContext) or context.action != action:
            raise StateError("AUTHORIZATION_CONTEXT_INVALID")
        if self.authorize is None or not self.authorize(context, action):
            raise StateError("UNAUTHORIZED")

    def _session(self, session_id: str) -> dict[str, Any]:
        session = self.sessions.get(session_id)
        if not session or session["revoked"]:
            raise StateError("SESSION_REVOKED")
        return session

    def _require_session(self, session_id: str, origin: str) -> None:
        session = self._session(session_id)
        if session["origin"] != origin:
            raise StateError("ORIGIN_MISMATCH")
        session["last"] = self.clock()
