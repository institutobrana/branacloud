"""Small authenticated smoke runner; never calls /sign."""
from __future__ import annotations

import httpx
import hashlib
import time
from pathlib import Path

from .smoke_client import SmokeProtocolClient, DEFAULT_DECISION_TIMEOUT_SECONDS


class SmokeHttpRunner:
    """Keeps the ECDH/session client and HTTP client in one process."""

    def __init__(self, *, base_url: str = "https://127.0.0.1:8765",
                 origin: str = "https://localhost:5173",
                 decision_timeout: float = DEFAULT_DECISION_TIMEOUT_SECONDS,
                 transport=None, http_client=None):
        self.protocol = SmokeProtocolClient(origin=origin, decision_timeout=decision_timeout)
        self.http = http_client or httpx.Client(base_url=base_url, verify=False,
                                 timeout=httpx.Timeout(decision_timeout), transport=transport)
        self.post_count = 0
        self.transport = transport

    @property
    def timeout_seconds(self) -> float:
        return float(self.http.timeout.read)

    def pairing(self):
        payload, client_nonce, private_key = self.protocol.pairing_payload()
        self.post_count += 1
        response = self.http.post("/v1/pairing-requests",
                                  headers={"Host": "localhost:8765", "Origin": self.protocol.origin},
                                  json=payload)
        return response, private_key, client_nonce

    def accept_pairing(self, response, private_key, client_nonce):
        self.protocol.accept_pairing(response.json(), private_key, client_nonce)
        return response

    def get_pairing(self, *, response, private_key, client_nonce):
        """Authenticated pairing GET using the provisional request-bound key."""
        import hashlib, hmac, secrets, time
        from .security.protocol import b64url_encode, canonicalize_hmac_request, derive_session_key
        payload = response.json(); request_id = payload["request_id"]
        key = derive_session_key(private_key, payload.get("bridge_ecdh_public_key") or payload["bridge_ephemeral_public_key"], self.protocol.origin,
            request_id, client_nonce, payload["bridge_nonce"], request_id)
        path = f"/v1/pairing-requests/{request_id}"; nonce = b64url_encode(secrets.token_bytes(16)); timestamp = int(time.time())
        digest = hashlib.sha256(b"").hexdigest()
        canonical = canonicalize_hmac_request(method="GET", path=path, origin=self.protocol.origin,
            timestamp=timestamp, request_nonce=nonce, session_id=request_id, content_sha256=digest,
            body_length=0, parameters={"operation_id": request_id}, operation_id=request_id)
        headers = {"Host": "localhost:8765", "Origin": self.protocol.origin,
            "X-Brana-Bridge-Protocol": "brana-bridge-v1", "X-Brana-Session": request_id,
            "X-Brana-Timestamp": str(timestamp), "X-Brana-Request-Nonce": nonce,
            "X-Brana-Content-SHA256": digest, "X-Brana-Request-MAC": hmac.new(key, canonical, hashlib.sha256).hexdigest(),
            "X-Brana-Operation-Id": request_id}
        return self.http.get(path, headers=headers)

    def delete_pairing(self, *, response, private_key, client_nonce):
        """Authenticated cancellation using the same provisional pairing key."""
        import hashlib, hmac, secrets, time
        from .security.protocol import b64url_encode, canonicalize_hmac_request, derive_session_key
        payload = response.json(); request_id = payload["request_id"]
        key = derive_session_key(private_key, payload.get("bridge_ecdh_public_key") or payload["bridge_ephemeral_public_key"], self.protocol.origin,
            request_id, client_nonce, payload["bridge_nonce"], request_id)
        path = f"/v1/pairing-requests/{request_id}"; nonce = b64url_encode(secrets.token_bytes(16)); timestamp = int(time.time())
        digest = hashlib.sha256(b"").hexdigest()
        canonical = canonicalize_hmac_request(method="DELETE", path=path, origin=self.protocol.origin,
            timestamp=timestamp, request_nonce=nonce, session_id=request_id, content_sha256=digest,
            body_length=0, parameters={"operation_id": request_id}, operation_id=request_id)
        headers = {"Host": "localhost:8765", "Origin": self.protocol.origin,
            "X-Brana-Bridge-Protocol": "brana-bridge-v1", "X-Brana-Session": request_id,
            "X-Brana-Timestamp": str(timestamp), "X-Brana-Request-Nonce": nonce,
            "X-Brana-Content-SHA256": digest, "X-Brana-Request-MAC": hmac.new(key, canonical, hashlib.sha256).hexdigest(),
            "X-Brana-Operation-Id": request_id}
        return self.http.delete(path, headers=headers)

    def create_operation(self, *, operation_id: str, pdf_bytes: bytes,
                         policy_oid: str = "2.16.76.1.7.1.11.1.3",
                         profile: str = "pades-ad-rb-1.3"):
        path = "/v1/signature-operations"
        headers = self.protocol.operation_headers(method="POST", path=path, body=pdf_bytes,
            operation_id=operation_id, field_name="BranaSignature_1", policy_oid=policy_oid, profile=profile)
        self.post_count += 1
        return self.http.post(path, headers=headers, content=pdf_bytes)

    def get_operation(self, *, operation_id: str, pdf_bytes: bytes):
        path = f"/v1/signature-operations/{operation_id}"
        if self.protocol.session is None:
            raise RuntimeError("SESSION_KEY_NOT_AVAILABLE")
        import hashlib, hmac, secrets, time
        from .security.protocol import b64url_encode, canonicalize_hmac_request
        nonce = b64url_encode(secrets.token_bytes(16)); timestamp = int(time.time()); digest = hashlib.sha256(b"").hexdigest()
        canonical = canonicalize_hmac_request(method="GET", path=path, origin=self.protocol.origin,
            timestamp=timestamp, request_nonce=nonce, session_id=self.protocol.session.session_id,
            content_sha256=digest, body_length=0, parameters={"operation_id": operation_id}, operation_id=operation_id)
        headers = {"Host": "localhost:8765", "Origin": self.protocol.origin,
            "X-Brana-Bridge-Protocol": "brana-bridge-v1", "X-Brana-Session": self.protocol.session.session_id,
            "X-Brana-Timestamp": str(timestamp), "X-Brana-Request-Nonce": nonce,
            "X-Brana-Content-SHA256": digest, "X-Brana-Request-MAC": hmac.new(self.protocol.session.session_key, canonical, hashlib.sha256).hexdigest(),
            "X-Brana-Operation-Id": operation_id}
        return self.http.get(path, headers=headers)

    def sign_once_and_recover(self, *, operation_id: str, pdf_bytes: bytes, output_path: str | Path):
        """Call /sign once, then recover the result before the client can close."""
        path = f"/v1/signature-operations/{operation_id}/sign"
        headers = self.protocol.operation_headers(method="POST", path=path, body=pdf_bytes,
            operation_id=operation_id, field_name="BranaSignature_1",
            policy_oid="2.16.76.1.7.1.11.1.3", profile="pades-ad-rb-1.3")
        self.post_count += 1
        try:
            response = self.http.post(path, headers=headers, content=pdf_bytes)
        except httpx.RequestError as exc:
            response = None
            lost_error = exc
        else:
            lost_error = None
        if response is None:
            status = self.get_operation(operation_id=operation_id, pdf_bytes=pdf_bytes)
            if status.status_code != 200 or status.json().get("state") != "COMPLETED":
                return {"sign_response": None, "status_response": status, "result_response": None,
                        "saved": False, "error": "SIGN_RESPONSE_LOST_BEFORE_COMPLETED"}
            response = None
        if response is not None and (response.status_code != 200 or response.json().get("state") != "COMPLETED"):
            return {"sign_response": response, "result_response": None, "saved": False}
        result_path = Path(output_path)
        result_path.parent.mkdir(parents=True, exist_ok=True)
        result = self.http.get(f"/v1/signature-operations/{operation_id}/result",
                               headers=self._operation_get_headers(operation_id))
        if result.status_code != 200:
            return {"sign_response": response, "result_response": result, "saved": False}
        data = result.content
        if not data.startswith(b"%PDF") or b"/ByteRange" not in data:
            return {"sign_response": response, "result_response": result, "saved": False,
                    "error": "RESULT_BYTES_INVALID"}
        result_path.write_bytes(data)
        return {"sign_response": response, "result_response": result, "saved": True,
                "path": str(result_path), "sha256": hashlib.sha256(data).hexdigest(), "size": len(data)}

    def _operation_get_headers(self, operation_id: str):
        if self.protocol.session is None:
            raise RuntimeError("SESSION_KEY_NOT_AVAILABLE")
        import hmac, secrets
        from .security.protocol import b64url_encode, canonicalize_hmac_request
        path = f"/v1/signature-operations/{operation_id}/result"
        nonce = b64url_encode(secrets.token_bytes(16)); timestamp = int(time.time()); digest = hashlib.sha256(b"").hexdigest()
        canonical = canonicalize_hmac_request(method="GET", path=path, origin=self.protocol.origin,
            timestamp=timestamp, request_nonce=nonce, session_id=self.protocol.session.session_id,
            content_sha256=digest, body_length=0, parameters={"operation_id": operation_id}, operation_id=operation_id)
        return {"Host": "localhost:8765", "Origin": self.protocol.origin,
            "X-Brana-Bridge-Protocol": "brana-bridge-v1", "X-Brana-Session": self.protocol.session.session_id,
            "X-Brana-Timestamp": str(timestamp), "X-Brana-Request-Nonce": nonce,
            "X-Brana-Content-SHA256": digest, "X-Brana-Request-MAC": hmac.new(self.protocol.session.session_key, canonical, hashlib.sha256).hexdigest(),
            "X-Brana-Operation-Id": operation_id}

    def close(self):
        self.http.close()


def main() -> int:
    runner = SmokeHttpRunner()
    print(f"SMOKE_HTTP_TIMEOUT_SECONDS={runner.timeout_seconds}", flush=True)
    runner.close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
