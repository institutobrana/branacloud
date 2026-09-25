"""HTTP binding for the pure brana-bridge-v1 protocol primitives."""

from __future__ import annotations

import hashlib
import time
from dataclasses import dataclass
from typing import Mapping

from .protocol import (
    NonceRegistry, canonicalize_hmac_request, validate_hmac, validate_nonce,
    validate_session_id, validate_timestamp,
)

HEADER_PROTOCOL = "X-Brana-Bridge-Protocol"
HEADER_SESSION = "X-Brana-Session"
HEADER_TIMESTAMP = "X-Brana-Timestamp"
HEADER_NONCE = "X-Brana-Request-Nonce"
HEADER_MAC = "X-Brana-Request-MAC"
HEADER_CONTENT_HASH = "X-Brana-Content-SHA256"


class HttpAuthError(ValueError):
    pass


@dataclass(frozen=True)
class AuthenticatedRequest:
    session_id: str
    request_nonce: str
    content_sha256: str
    canonical_bytes: bytes


def authenticate_request(
    *, headers: Mapping[str, str], method: str, path: str, origin: str,
    body: bytes, parameters: Mapping[str, object], session_keys: Mapping[str, bytes],
    nonces: NonceRegistry, now: int | float | None = None,
) -> AuthenticatedRequest:
    if headers.get(HEADER_PROTOCOL) != "brana-bridge-v1":
        raise HttpAuthError("PROTOCOL_NOT_SUPPORTED")
    session_id = headers.get(HEADER_SESSION)
    request_nonce = headers.get(HEADER_NONCE)
    supplied_mac = headers.get(HEADER_MAC)
    declared_hash = headers.get(HEADER_CONTENT_HASH)
    timestamp_text = headers.get(HEADER_TIMESTAMP)
    if not all((session_id, request_nonce, supplied_mac, declared_hash, timestamp_text)):
        raise HttpAuthError("AUTH_HEADERS_REQUIRED")
    try:
        validate_session_id(session_id)
        validate_nonce(request_nonce)
        timestamp = int(timestamp_text)
    except (TypeError, ValueError) as exc:
        raise HttpAuthError("AUTH_HEADERS_INVALID") from exc
    if not validate_timestamp(timestamp, now):
        raise HttpAuthError("TIMESTAMP_INVALID")
    key = session_keys.get(session_id)
    if key is None:
        raise HttpAuthError("SESSION_REVOKED")
    actual_hash = hashlib.sha256(body).hexdigest()
    if declared_hash != actual_hash:
        raise HttpAuthError("CONTENT_HASH_MISMATCH")
    canonical = canonicalize_hmac_request(
        method=method, path=path, origin=origin, timestamp=timestamp,
        request_nonce=request_nonce, session_id=session_id,
        content_sha256=actual_hash, body_length=len(body),
        parameters=parameters, operation_id=str(parameters.get("operation_id", "")),
    )
    if not validate_hmac(key, canonical, supplied_mac):
        raise HttpAuthError("MAC_INVALID")
    if not nonces.consume(request_nonce):
        raise HttpAuthError("REPLAY_DETECTED")
    return AuthenticatedRequest(session_id, request_nonce, actual_hash, canonical)
