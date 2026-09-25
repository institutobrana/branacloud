"""In-memory validation of the bridge TLS certificate and private key."""
from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone

from cryptography import x509
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import ec, rsa, dsa, ed25519, ed448
from cryptography.x509.oid import ExtendedKeyUsageOID


class TLSMaterialError(ValueError):
    def __init__(self, code: str):
        self.code = code
        super().__init__(code)


@dataclass(frozen=True)
class TLSMaterial:
    subject: str
    not_before: datetime
    not_after: datetime
    san_hosts: tuple[str, ...]
    server_auth: bool


def _public_key_bytes(key):
    return key.public_bytes(serialization.Encoding.DER, serialization.PublicFormat.SubjectPublicKeyInfo)


def validate_tls_material(cert_pem: bytes, key_pem: bytes, expected_host: str = "localhost") -> TLSMaterial:
    if not isinstance(cert_pem, bytes) or not isinstance(key_pem, bytes) or not cert_pem or not key_pem:
        raise TLSMaterialError("TLS_MATERIAL_INVALID")
    if expected_host != "localhost":
        raise TLSMaterialError("TLS_HOST_NOT_ALLOWED")
    try:
        cert = x509.load_pem_x509_certificate(cert_pem)
        key = serialization.load_pem_private_key(key_pem, password=None)
    except Exception as exc:
        raise TLSMaterialError("TLS_MATERIAL_INVALID") from exc
    now = datetime.now(timezone.utc)
    not_before = cert.not_valid_before_utc if hasattr(cert, "not_valid_before_utc") else cert.not_valid_before.replace(tzinfo=timezone.utc)
    not_after = cert.not_valid_after_utc if hasattr(cert, "not_valid_after_utc") else cert.not_valid_after.replace(tzinfo=timezone.utc)
    if now < not_before:
        raise TLSMaterialError("TLS_CERTIFICATE_NOT_YET_VALID")
    if now > not_after:
        raise TLSMaterialError("TLS_CERTIFICATE_EXPIRED")
    try:
        san = cert.extensions.get_extension_for_class(x509.SubjectAlternativeName).value
        hosts = tuple(sorted(san.get_values_for_type(x509.DNSName)))
    except x509.ExtensionNotFound as exc:
        raise TLSMaterialError("TLS_SAN_REQUIRED") from exc
    if expected_host not in hosts:
        raise TLSMaterialError("TLS_SAN_REQUIRED")
    try:
        eku = cert.extensions.get_extension_for_class(x509.ExtendedKeyUsage).value
    except x509.ExtensionNotFound as exc:
        raise TLSMaterialError("TLS_SERVER_AUTH_REQUIRED") from exc
    if ExtendedKeyUsageOID.SERVER_AUTH not in eku:
        raise TLSMaterialError("TLS_SERVER_AUTH_REQUIRED")
    if _public_key_bytes(cert.public_key()) != _public_key_bytes(key.public_key()):
        raise TLSMaterialError("TLS_KEY_MISMATCH")
    return TLSMaterial(cert.subject.rfc4514_string(), not_before, not_after, hosts, True)
