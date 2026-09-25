"""Runtime-facing TLS adapter; validation remains entirely in memory."""
from __future__ import annotations

from dataclasses import dataclass
from .tls import TLSMaterial, TLSMaterialError, validate_tls_material


@dataclass(frozen=True)
class TLSRuntimeConfig:
    host: str = "localhost"
    port: int = 8765


def validate_runtime_tls(cert_pem: bytes, key_pem: bytes, config: TLSRuntimeConfig = TLSRuntimeConfig()) -> TLSMaterial:
    if config.host != "localhost" or config.port != 8765:
        raise TLSMaterialError("TLS_ENDPOINT_NOT_ALLOWED")
    return validate_tls_material(cert_pem, key_pem, expected_host=config.host)
