"""Signer boundary for prepared PDFs; no real certificate implementation here."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Protocol


@dataclass(frozen=True)
class PreparedPdfSigningRequest:
    pdf_bytes: bytes
    prepared_pdf_sha256: str
    field_name: str
    use_existing_field: bool
    profile: str
    policy_oid: str
    operation_id: str
    certificate_binding: str


class PreparedPdfSigner(Protocol):
    def sign_prepared(self, request: PreparedPdfSigningRequest) -> bytes: ...


class FakePreparedPdfSigner:
    def __init__(self, result: bytes = b"SYNTHETIC-SIGNED-PDF") -> None:
        self.result = bytes(result)
        self.calls: list[PreparedPdfSigningRequest] = []

    def sign_prepared(self, request: PreparedPdfSigningRequest) -> bytes:
        self.calls.append(request)
        return self.result
