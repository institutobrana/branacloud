"""Pure, in-memory primitives for the brana-bridge-v1 protocol."""

from __future__ import annotations

import base64
import hashlib
import hmac
import json
import re
import time
from collections.abc import Mapping
from typing import Any

from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives.kdf.hkdf import HKDF

PROTOCOL_VERSION = "brana-bridge-v1"
P256_PUBLIC_KEY_BYTES = 65
NONCE_BYTES = 16
IDENTIFIER_BYTES = 16
TIMESTAMP_TOLERANCE_SECONDS = 30
_B64URL_RE = re.compile(r"^[A-Za-z0-9_-]+$")
_ID_RE = re.compile(r"^[A-Za-z0-9_-]{22}$")
_HEX64_RE = re.compile(r"^[0-9a-f]{64}$")


def b64url_encode(value: bytes) -> str:
    return base64.urlsafe_b64encode(value).rstrip(b"=").decode("ascii")


def b64url_decode(value: str) -> bytes:
    if not isinstance(value, str) or not value or "=" in value or not _B64URL_RE.fullmatch(value):
        raise ValueError("invalid base64url value")
    if len(value) % 4 == 1:
        raise ValueError("invalid base64url length")
    try:
        return base64.urlsafe_b64decode(value + "=" * (-len(value) % 4))
    except Exception as exc:  # pragma: no cover - backend-specific decoder detail
        raise ValueError("invalid base64url value") from exc


def random_nonce() -> str:
    return b64url_encode(__import__("secrets").token_bytes(NONCE_BYTES))


def validate_nonce(value: str) -> bytes:
    decoded = b64url_decode(value)
    if len(decoded) != NONCE_BYTES:
        raise ValueError("invalid nonce")
    return decoded


def random_identifier() -> str:
    return b64url_encode(__import__("secrets").token_bytes(IDENTIFIER_BYTES))


def _validate_identifier(value: str, label: str) -> bytes:
    if not isinstance(value, str) or not _ID_RE.fullmatch(value):
        raise ValueError(f"invalid {label}")
    decoded = b64url_decode(value)
    if len(decoded) != IDENTIFIER_BYTES:
        raise ValueError(f"invalid {label}")
    return decoded


def validate_request_id(value: str) -> bytes:
    return _validate_identifier(value, "request_id")


def validate_session_id(value: str) -> bytes:
    return _validate_identifier(value, "session_id")


def validate_client_instance_id(value: str) -> bytes:
    return _validate_identifier(value, "client_instance_id")


def validate_public_key(public_key_b64url: str) -> bytes:
    raw = b64url_decode(public_key_b64url)
    if len(raw) != P256_PUBLIC_KEY_BYTES or raw[0] != 0x04:
        raise ValueError("invalid P-256 public key")
    try:
        ec.EllipticCurvePublicKey.from_encoded_point(ec.SECP256R1(), raw)
    except ValueError as exc:
        raise ValueError("invalid P-256 public key") from exc
    return raw


def approval_code(
    origin: str,
    request_id: str,
    client_instance_id: str,
    client_nonce_b64url: str,
    bridge_nonce_b64url: str,
) -> str:
    transcript = "|".join(
        (origin, request_id, client_instance_id, client_nonce_b64url, bridge_nonce_b64url, PROTOCOL_VERSION)
    ).encode("utf-8")
    digest = hashlib.sha256(transcript).digest()
    encoded = base64.b32encode(digest).decode("ascii").rstrip("=")
    filtered = "".join(char for char in encoded if char not in "IOU0")
    return filtered[:8]


def _hkdf_context(origin: str, request_id: str, client_nonce: str, bridge_nonce: str, session_id: str) -> tuple[bytes, bytes]:
    salt_transcript = "|".join((f"{PROTOCOL_VERSION}|salt", origin, request_id, client_nonce, bridge_nonce))
    info = "|".join((f"{PROTOCOL_VERSION}|session", origin, request_id, client_nonce, bridge_nonce, session_id))
    return hashlib.sha256(salt_transcript.encode("utf-8")).digest(), info.encode("utf-8")


def derive_session_key(
    private_key: ec.EllipticCurvePrivateKey,
    peer_public_key_b64url: str,
    origin: str,
    request_id: str,
    client_nonce_b64url: str,
    bridge_nonce_b64url: str,
    session_id: str,
) -> bytes:
    if not isinstance(private_key, ec.EllipticCurvePrivateKey) or private_key.curve.name != "secp256r1":
        raise ValueError("P-256 private key required")
    peer_raw = validate_public_key(peer_public_key_b64url)
    peer = ec.EllipticCurvePublicKey.from_encoded_point(ec.SECP256R1(), peer_raw)
    salt, info = _hkdf_context(origin, request_id, client_nonce_b64url, bridge_nonce_b64url, session_id)
    shared_secret = private_key.exchange(ec.ECDH(), peer)
    return HKDF(algorithm=hashes.SHA256(), length=32, salt=salt, info=info).derive(shared_secret)


def _normalize_origin(origin: str) -> str:
    if not isinstance(origin, str) or "/" not in origin or any(char.isspace() for char in origin):
        raise ValueError("invalid origin")
    scheme, remainder = origin.split("://", 1)
    if not scheme or not remainder or "/" in remainder or "?" in remainder or "#" in remainder:
        raise ValueError("invalid origin")
    return f"{scheme.lower()}://{remainder.lower()}"


def _normalize_path(path: str) -> str:
    if not isinstance(path, str) or not path.startswith("/") or "#" in path or "%" in path:
        raise ValueError("invalid path")
    return path


def _normalize_sha256(value: str) -> str:
    if not isinstance(value, str) or not _HEX64_RE.fullmatch(value.lower()):
        raise ValueError("invalid content hash")
    return value.lower()


def canonicalize_hmac_request(
    *,
    method: str,
    path: str,
    origin: str,
    timestamp: int,
    request_nonce: str,
    session_id: str,
    content_sha256: str,
    body_length: int,
    parameters: Mapping[str, Any] | None,
    operation_id: str,
) -> bytes:
    if not isinstance(method, str) or not method or any(ord(char) > 127 for char in method):
        raise ValueError("invalid method")
    if not isinstance(timestamp, int) or isinstance(timestamp, bool):
        raise ValueError("invalid timestamp")
    if not isinstance(body_length, int) or isinstance(body_length, bool) or body_length < 0:
        raise ValueError("invalid body length")
    # Canonicalization is deliberately a pure serializer. The authenticated
    # request layer validates nonce/session/operation identifiers before using
    # these bytes, which also permits the published symbolic test vectors.
    if not isinstance(request_nonce, str) or not request_nonce:
        raise ValueError("invalid request nonce")
    if not isinstance(session_id, str) or not session_id:
        raise ValueError("invalid session id")
    if not isinstance(operation_id, str) or not operation_id:
        raise ValueError("invalid operation id")
    normalized_parameters = ""
    if parameters:
        items = []
        for key in sorted(parameters):
            if not isinstance(key, str) or "&" in key or "=" in key:
                raise ValueError("invalid parameter key")
            value = parameters[key]
            if isinstance(value, (dict, list)):
                value = json.dumps(value, ensure_ascii=False, separators=(",", ":"), sort_keys=True)
            if isinstance(value, bool):
                value = "true" if value else "false"
            if value is None:
                value = "null"
            value = str(value)
            if any(char in value for char in "&\r\n"):
                raise ValueError("invalid parameter value")
            items.append(f"{key}={value}")
        normalized_parameters = "&".join(items)
    fields = (
        PROTOCOL_VERSION,
        method.upper(),
        _normalize_path(path),
        _normalize_origin(origin),
        str(timestamp),
        request_nonce,
        session_id,
        _normalize_sha256(content_sha256),
        str(body_length),
        normalized_parameters,
        operation_id,
    )
    return "\x1f".join(fields).encode("utf-8")


def calculate_hmac(session_key: bytes, canonical_bytes: bytes) -> str:
    if not isinstance(session_key, bytes) or len(session_key) != 32:
        raise ValueError("invalid session key")
    return hmac.new(session_key, canonical_bytes, hashlib.sha256).hexdigest()


def validate_hmac(session_key: bytes, canonical_bytes: bytes, supplied_hex: str) -> bool:
    if not isinstance(supplied_hex, str) or not re.fullmatch(r"[0-9a-f]{64}", supplied_hex):
        return False
    expected = calculate_hmac(session_key, canonical_bytes)
    return hmac.compare_digest(expected, supplied_hex)


def validate_timestamp(timestamp: int, now: int | float | None = None) -> bool:
    current = time.time() if now is None else now
    return abs(current - timestamp) <= TIMESTAMP_TOLERANCE_SECONDS


class NonceRegistry:
    def __init__(self) -> None:
        self._used: set[str] = set()

    def consume(self, nonce: str) -> bool:
        validate_nonce(nonce)
        if nonce in self._used:
            return False
        self._used.add(nonce)
        return True
