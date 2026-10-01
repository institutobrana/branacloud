"""One-shot HTTPS mTLS consumer for the future signing gate.

This client is not wired into the signing handler yet. It never sends a
password, PIN, private key, PDF, or arbitrary identity header.
"""

from dataclasses import dataclass
import ssl
import httpx


class OnlineAuthorizationError(RuntimeError):
    def __init__(self, code):
        super().__init__(code)
        self.code = code


@dataclass(frozen=True)
class OnlineAuthorizationConfig:
    endpoint: str
    ca_cert: str
    client_cert: str
    client_key: str
    timeout_seconds: float = 5.0


class OnlineAuthorizationConsumer:
    def __init__(self, config: OnlineAuthorizationConfig, *, client_factory=httpx.Client, tls_context_factory=ssl.create_default_context):
        self.config = config
        self._client_factory = client_factory
        self._tls_context_factory = tls_context_factory

    def consume(self, *, authorization_id, operation_id, prepared_pdf_sha256,
                certificate_der_sha256, field_name, policy_oid, certificate_source="WINDOWS_STORE"):
        payload = {
            "authorization_id": authorization_id,
            "operation_id": operation_id,
            "prepared_pdf_sha256": prepared_pdf_sha256,
            "certificado_der_sha256": certificate_der_sha256,
            "field_name": field_name,
            "policy_oid": policy_oid,
            "certificate_source": certificate_source,
        }
        try:
            tls_context = self._tls_context_factory(cafile=self.config.ca_cert)
            tls_context.load_cert_chain(certfile=self.config.client_cert, keyfile=self.config.client_key)
            with self._client_factory(
                verify=tls_context,
                timeout=self.config.timeout_seconds,
                trust_env=False,
            ) as client:
                response = client.post(self.config.endpoint, json=payload)
        except httpx.TimeoutException as exc:
            raise OnlineAuthorizationError("ONLINE_AUTHORIZATION_TIMEOUT") from exc
        except httpx.TransportError as exc:
            raise OnlineAuthorizationError("ONLINE_AUTHORIZATION_TRANSPORT") from exc
        if response.status_code != 200:
            remote_code = "HTTP_REJECTED"
            try:
                payload = response.json()
                candidate = payload.get("detail_code") or payload.get("error_code") or payload.get("detail")
                if isinstance(candidate, str) and candidate.isascii() and all(char.isalnum() or char in "_.-" for char in candidate):
                    remote_code = candidate
            except ValueError:
                pass
            error = OnlineAuthorizationError("ONLINE_AUTHORIZATION_REJECTED")
            error.http_status = response.status_code
            error.remote_code = remote_code
            raise error
        try:
            data = response.json()
        except ValueError as exc:
            raise OnlineAuthorizationError("ONLINE_AUTHORIZATION_RESPONSE_INVALID") from exc
        if data.get("status") != "CONSUMED":
            raise OnlineAuthorizationError("ONLINE_AUTHORIZATION_RESPONSE_INVALID")
        return "CONSUMED"
