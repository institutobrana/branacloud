"""Abstract interactive-session and approval UI boundaries."""
from __future__ import annotations

from dataclasses import dataclass
from enum import Enum
from typing import Protocol

from .approval_adapter import ApprovalAdapter, PairingContext, SignatureContext
from .ui import ApprovalDecision


class UIUnavailable(RuntimeError):
    def __init__(self):
        super().__init__("UI_UNAVAILABLE")


class InteractiveSession(Protocol):
    def available(self) -> bool: ...


class InteractiveSessionProbe:
    def __init__(self, available: bool):
        self._available = available

    def available(self) -> bool:
        return self._available


class ApprovalState(str, Enum):
    APPROVED = "APPROVED"
    DENIED = "DENIED"
    EXPIRED = "EXPIRED"
    UNAVAILABLE = "UNAVAILABLE"


@dataclass(frozen=True)
class UIResult:
    state: ApprovalState


class ApprovalUIRuntime:
    def __init__(self, session: InteractiveSession, adapter: ApprovalAdapter):
        self.session = session
        self.adapter = adapter

    @staticmethod
    def _map(decision: ApprovalDecision) -> UIResult:
        return UIResult(ApprovalState(decision.value))

    def show_pairing(self, context: PairingContext) -> UIResult:
        if not self.session.available():
            return UIResult(ApprovalState.UNAVAILABLE)
        return self._map(self.adapter.show_pairing(context))

    def show_signature(self, context: SignatureContext, preview) -> UIResult:
        if not self.session.available():
            return UIResult(ApprovalState.UNAVAILABLE)
        return self._map(self.adapter.show_signature(context, preview))


class NamedPipeApprovalUI:
    """Explicit opt-in ApprovalUI backed by the isolated WPF pipe presenter."""
    def __init__(self, presenter):
        self.presenter = presenter

    def approve_pairing(self, request):
        return self.presenter.show_pairing(PairingContext(request.request_id, request.origin, request.approval_code, request.expires_at))

    def approve_signature(self, operation):
        context = SignatureContext(
            operation_id=operation.operation_id,
            prepared_pdf_sha256=operation.prepared_pdf_sha256,
            field_name=operation.field_name,
            origin=operation.origin,
            page_index=operation.page,
            rect=operation.rect,
            profile=operation.profile,
            policy_oid=operation.policy_oid,
            certificate_label="synthetic",
            expires_at=operation.expires_at,
        )
        class Preview:
            sha256 = operation.prepared_pdf_sha256
        decision = self.presenter.show_signature(context, Preview())
        return decision
