"""In-memory HTTPS smoke client; protocol keys never leave this process."""
from __future__ import annotations

import base64
import hashlib
import secrets
import time
from dataclasses import dataclass

from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives.serialization import Encoding, PublicFormat

from .security.protocol import b64url_encode, canonicalize_hmac_request, derive_session_key
from .security.http_auth import HEADER_CONTENT_HASH, HEADER_MAC, HEADER_NONCE, HEADER_PROTOCOL, HEADER_SESSION, HEADER_TIMESTAMP

DEFAULT_DECISION_TIMEOUT_SECONDS = 120


@dataclass
class SmokeSession:
    origin: str
    client_private_key: ec.EllipticCurvePrivateKey
    session_id: str
    session_key: bytes


class SmokeProtocolClient:
    def __init__(self, *, origin: str = "https://localhost:5173", decision_timeout: float = DEFAULT_DECISION_TIMEOUT_SECONDS):
        self.origin = origin
        if not 0 < decision_timeout <= 300:
            raise ValueError("DECISION_TIMEOUT_INVALID")
        self.decision_timeout = decision_timeout
        self.session: SmokeSession | None = None

    @staticmethod
    def _public_key(private_key: ec.EllipticCurvePrivateKey) -> str:
        return b64url_encode(private_key.public_key().public_bytes(Encoding.X962, PublicFormat.UncompressedPoint))

    def pairing_payload(self) -> tuple[dict, str, ec.EllipticCurvePrivateKey]:
        private_key = ec.generate_private_key(ec.SECP256R1())
        client_nonce = b64url_encode(secrets.token_bytes(16))
        instance_id = b64url_encode(secrets.token_bytes(16))
        return ({"client_instance_id": instance_id, "client_nonce": client_nonce, "client_ecdh_public_key": self._public_key(private_key)}, client_nonce, private_key)

    def accept_pairing(self, response: dict, private_key: ec.EllipticCurvePrivateKey, client_nonce: str) -> None:
        if response.get("state") != "APPROVED" or not response.get("session_id"):
            raise ValueError("PAIRING_NOT_APPROVED")
        key = derive_session_key(private_key, response["bridge_ecdh_public_key"], self.origin, response["request_id"], client_nonce, response["bridge_nonce"], response["session_id"])
        self.session = SmokeSession(self.origin, private_key, response["session_id"], key)

    def operation_headers(self, *, method: str, path: str, body: bytes, operation_id: str, field_name: str, policy_oid: str, profile: str) -> dict[str, str]:
        if self.session is None:
            raise RuntimeError("SESSION_KEY_NOT_AVAILABLE")
        nonce = b64url_encode(secrets.token_bytes(16)); timestamp = int(time.time()); digest = hashlib.sha256(body).hexdigest()
        params = {"operation_id": operation_id, "field_name": field_name, "policy_oid": policy_oid, "profile": profile}
        canonical = canonicalize_hmac_request(method=method, path=path, origin=self.origin, timestamp=timestamp, request_nonce=nonce, session_id=self.session.session_id, content_sha256=digest, body_length=len(body), parameters=params, operation_id=operation_id)
        import hmac
        mac = hmac.new(self.session.session_key, canonical, hashlib.sha256).hexdigest()
        return {"Host": "localhost:8765", "Origin": self.origin, HEADER_PROTOCOL: "brana-bridge-v1", HEADER_SESSION: self.session.session_id, HEADER_TIMESTAMP: str(timestamp), HEADER_NONCE: nonce, HEADER_CONTENT_HASH: digest, HEADER_MAC: mac, "X-Brana-Operation-Id": operation_id, "X-Brana-Field-Name": field_name, "X-Brana-Policy-OID": policy_oid, "X-Brana-Profile": profile}
