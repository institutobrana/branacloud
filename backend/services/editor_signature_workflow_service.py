from __future__ import annotations

import hashlib
from dataclasses import dataclass
from typing import Protocol

from services.editor_signature_anchor_service import (
    DEFAULT_FIELD_NAME,
    PreparedSignaturePdf,
    SignatureAnchorError,
    prepare_signature_anchor,
)


class ExistingFieldSigner(Protocol):
    def __call__(self, pdf_bytes: bytes, *, field_name: str, use_existing_field: bool) -> bytes: ...


class SignatureWorkflowError(ValueError):
    """Falha sanitizada na orquestração pré-assinatura."""


@dataclass(frozen=True)
class SignatureWorkflowResult:
    prepared_pdf_bytes: bytes
    prepared_pdf_sha256: str
    signer_result: bytes
    field_name: str
    diagnostic: dict[str, object]


def prepare_and_invoke_signer(
    pdf_bytes: bytes,
    signer: ExistingFieldSigner,
    field_name: str = DEFAULT_FIELD_NAME,
) -> SignatureWorkflowResult:
    name = str(field_name or "").strip()
    if name != DEFAULT_FIELD_NAME:
        raise SignatureWorkflowError("SIGNATURE_FIELD_NAME_MISMATCH")
    try:
        prepared: PreparedSignaturePdf = prepare_signature_anchor(pdf_bytes, field_name=name)
    except SignatureAnchorError as exc:
        raise SignatureWorkflowError(str(exc)) from exc
    prepared_hash = hashlib.sha256(prepared.pdf_bytes).hexdigest()
    if prepared_hash != prepared.sha256:
        raise SignatureWorkflowError("PREPARED_PDF_HASH_MISMATCH")
    exact_bytes = prepared.pdf_bytes
    try:
        signed = signer(exact_bytes, field_name=DEFAULT_FIELD_NAME, use_existing_field=True)
    except Exception as exc:
        raise SignatureWorkflowError(f"SIGNER_FAILED:{type(exc).__name__}") from exc
    if not isinstance(signed, (bytes, bytearray)) or not signed:
        raise SignatureWorkflowError("SIGNER_RETURNED_INVALID_BYTES")
    return SignatureWorkflowResult(
        prepared_pdf_bytes=exact_bytes,
        prepared_pdf_sha256=prepared_hash,
        signer_result=bytes(signed),
        field_name=DEFAULT_FIELD_NAME,
        diagnostic={"prepared_page": prepared.page_index, "prepared_rect": prepared.signature_rect, "field_name": DEFAULT_FIELD_NAME, "use_existing_field": True},
    )
