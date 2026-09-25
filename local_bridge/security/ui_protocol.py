"""In-memory WPF approval protocol; no pipe, process or secret access."""
from __future__ import annotations

import json
import secrets
import struct
import time
from dataclasses import dataclass

MAX_FRAME_BYTES = 16 * 1024
PROTOCOL_VERSION = "brana-ui-v1"
ALLOWED_TYPES = {"PAIRING_REQUEST", "SIGNATURE_REQUEST", "APPROVE", "DENY", "CANCEL", "EXPIRED", "ERROR"}
DECISIONS = {"APPROVE", "DENY", "CANCEL", "EXPIRED"}


class UIProtocolError(ValueError):
    pass


def _fail(code: str):
    raise UIProtocolError(code)


def new_nonce() -> str:
    return secrets.token_urlsafe(16)


def _required(message: dict, fields: tuple[str, ...]):
    for field in fields:
        if not isinstance(message.get(field), str) or not message[field]:
            _fail("MESSAGE_FIELD_INVALID")


def validate_message(message: dict, *, expected_origin: str | None = None,
                     expected_id: str | None = None, expected_hash: str | None = None,
                     now: float | None = None) -> dict:
    if not isinstance(message, dict):
        _fail("MESSAGE_INVALID")
    if message.get("protocol") != PROTOCOL_VERSION:
        _fail("PROTOCOL_INVALID")
    kind = message.get("message_type")
    if kind not in ALLOWED_TYPES:
        _fail("MESSAGE_TYPE_INVALID")
    if kind in {"PAIRING_REQUEST", "APPROVE", "DENY", "CANCEL", "EXPIRED"}:
        _required(message, ("origin", "nonce"))
        identifier = message.get("request_id") or message.get("operation_id")
        if not isinstance(identifier, str) or not identifier:
            _fail("MESSAGE_FIELD_INVALID")
    elif kind == "SIGNATURE_REQUEST":
        _required(message, ("operation_id", "origin", "prepared_pdf_sha256", "field_name", "profile", "policy_oid", "nonce"))
        identifier = message["operation_id"]
    else:
        _required(message, ("code", "nonce"))
        identifier = message.get("request_id") or message.get("operation_id")
    if expected_origin is not None and message.get("origin") != expected_origin:
        _fail("ORIGIN_MISMATCH")
    if expected_id is not None and identifier != expected_id:
        _fail("IDENTIFIER_MISMATCH")
    if expected_hash is not None and message.get("prepared_pdf_sha256") != expected_hash:
        _fail("HASH_MISMATCH")
    if kind == "SIGNATURE_REQUEST":
        if message["field_name"] != "BranaSignature_1" or message["profile"] != "pades-ad-rb-1.3" or message["policy_oid"] != "2.16.76.1.7.1.11.1.3":
            _fail("SIGNATURE_BINDING_INVALID")
    expires_at = message.get("expires_at")
    if expires_at is not None:
        if not isinstance(expires_at, (int, float)) or float(expires_at) <= float(now if now is not None else time.time()):
            _fail("MESSAGE_EXPIRED")
    return dict(message)


def encode_frame(message: dict) -> bytes:
    validated = validate_message(message)
    body = json.dumps(validated, ensure_ascii=False, separators=(",", ":"), sort_keys=False).encode("utf-8")
    if len(body) + 4 > MAX_FRAME_BYTES:
        _fail("MESSAGE_TOO_LARGE")
    return struct.pack(">I", len(body)) + body


def decode_frame(frame: bytes) -> dict:
    if not isinstance(frame, (bytes, bytearray)) or len(frame) < 4:
        _fail("FRAME_TRUNCATED")
    length = struct.unpack(">I", bytes(frame[:4]))[0]
    if length + 4 > MAX_FRAME_BYTES:
        _fail("MESSAGE_TOO_LARGE")
    if len(frame) != length + 4:
        _fail("FRAME_TRUNCATED")
    try:
        message = json.loads(bytes(frame[4:]).decode("utf-8"))
    except Exception as exc:
        raise UIProtocolError("JSON_INVALID") from exc
    return validate_message(message)


@dataclass
class DecisionGuard:
    used_nonces: set[str]
    completed_ids: set[str]

    @classmethod
    def create(cls) -> "DecisionGuard":
        return cls(set(), set())

    def accept(self, message: dict, *, expected_origin: str, expected_id: str,
               expected_hash: str | None = None, now: float | None = None) -> dict:
        checked = validate_message(message, expected_origin=expected_origin, expected_id=expected_id, expected_hash=expected_hash, now=now)
        nonce = checked["nonce"]
        if nonce in self.used_nonces:
            _fail("NONCE_REPLAY")
        if checked["message_type"] in DECISIONS and expected_id in self.completed_ids:
            _fail("DECISION_DUPLICATE")
        self.used_nonces.add(nonce)
        if checked["message_type"] in DECISIONS:
            self.completed_ids.add(expected_id)
        return checked


def sanitized_error(exc: Exception) -> dict:
    code = str(exc).split(" ", 1)[0]
    allowed = {"FRAME_TRUNCATED", "MESSAGE_TOO_LARGE", "JSON_INVALID", "MESSAGE_INVALID", "PROTOCOL_INVALID", "MESSAGE_TYPE_INVALID", "MESSAGE_FIELD_INVALID", "ORIGIN_MISMATCH", "IDENTIFIER_MISMATCH", "HASH_MISMATCH", "SIGNATURE_BINDING_INVALID", "MESSAGE_EXPIRED", "NONCE_REPLAY", "DECISION_DUPLICATE"}
    return {"protocol": PROTOCOL_VERSION, "message_type": "ERROR", "error_code": code if code in allowed else "MESSAGE_INVALID"}
