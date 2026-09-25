"""Abstract local approval boundary; no real UI is implemented here."""

from __future__ import annotations

from dataclasses import dataclass
from enum import Enum
from typing import Protocol


class ApprovalDecision(str, Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    DENIED = "DENIED"
    EXPIRED = "EXPIRED"
    UNAVAILABLE = "UNAVAILABLE"


@dataclass(frozen=True)
class PairingApproval:
    request_id: str
    origin: str
    approval_code: str
    expires_at: float = 0.0


@dataclass(frozen=True)
class SignatureApproval:
    operation_id: str
    prepared_pdf_sha256: str
    field_name: str
    profile: str
    origin: str = "https://localhost:5173"
    policy_oid: str = "2.16.76.1.7.1.11.1.3"
    expires_at: float = 0.0
    page: int = 0
    rect: tuple[float, float, float, float] = (0.0, 0.0, 1.0, 1.0)


class ApprovalUI(Protocol):
    def approve_pairing(self, request: PairingApproval) -> ApprovalDecision: ...
    def approve_signature(self, operation: SignatureApproval) -> ApprovalDecision: ...


class PendingApprovalUI:
    def approve_pairing(self, request: PairingApproval) -> ApprovalDecision:
        return ApprovalDecision.PENDING

    def approve_signature(self, operation: SignatureApproval) -> ApprovalDecision:
        return ApprovalDecision.PENDING
