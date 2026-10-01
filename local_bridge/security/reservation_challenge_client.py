"""mTLS-only forwarder for the isolated reservation challenge endpoint."""

from dataclasses import dataclass
import httpx
import ssl

from .online_authorization_client import OnlineAuthorizationError


@dataclass(frozen=True)
class ReservationChallengeConfig:
    endpoint: str
    ca_cert: str
    client_cert: str
    client_key: str
    timeout_seconds: float = 5.0


class ReservationChallengeForwarder:
    def __init__(self, config: ReservationChallengeConfig, *, client_factory=httpx.Client, tls_context_factory=ssl.create_default_context):
        self.config = config
        self._client_factory = client_factory
        self._tls_context_factory = tls_context_factory

    def forward(self, *, request_id, challenge, operation_id, prepared_pdf_sha256, certificado_der_sha256, certificate_source="WINDOWS_STORE"):
        payload = {"request_id": request_id, "challenge": challenge, "operation_id": operation_id,
                   "prepared_pdf_sha256": prepared_pdf_sha256, "certificado_der_sha256": certificado_der_sha256,
                   "field_name": "BranaSignature_1", "policy_oid": "2.16.76.1.7.1.11.1.3"}
        payload["certificate_source"] = certificate_source
        try:
            context = self._tls_context_factory(cafile=self.config.ca_cert)
            context.load_cert_chain(certfile=self.config.client_cert, keyfile=self.config.client_key)
            with self._client_factory(verify=context, timeout=self.config.timeout_seconds, trust_env=False) as client:
                response = client.post(self.config.endpoint, json=payload)
        except httpx.TimeoutException as exc:
            raise OnlineAuthorizationError("RESERVATION_FORWARD_TIMEOUT") from exc
        except httpx.TransportError as exc:
            raise OnlineAuthorizationError("RESERVATION_FORWARD_TRANSPORT") from exc
        if response.status_code != 200:
            error = OnlineAuthorizationError("RESERVATION_FORWARD_REJECTED")
            error.status_code = response.status_code
            try:
                payload = response.json()
                code = payload.get("detail") or payload.get("error_code")
                if isinstance(code, str) and len(code) <= 80 and code.replace("_", "").isalnum():
                    error.remote_code = code
            except ValueError:
                pass
            raise error
        try:
            data = response.json()
        except ValueError as exc:
            raise OnlineAuthorizationError("RESERVATION_FORWARD_RESPONSE_INVALID") from exc
        if data.get("status") != "RESERVED" or not data.get("authorization_id") or data.get("request_id") != request_id:
            raise OnlineAuthorizationError("RESERVATION_FORWARD_RESPONSE_INVALID")
        return {"request_id": request_id, "authorization_id": data["authorization_id"], "status": "RESERVED"}
