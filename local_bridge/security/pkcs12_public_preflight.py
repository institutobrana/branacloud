"""Public-only preflight for a FILE_PKCS12 identity.

This module deliberately never opens a PKCS#12 container.  The certificate
file is the public binding presented before authorization; the future file
signer must re-check its embedded certificate after authorization.
"""

from __future__ import annotations

import hashlib
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path

from cryptography import x509
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives.serialization import Encoding


class PublicCertificatePreflightError(ValueError):
    """Stable, sanitized preflight failure."""


@dataclass(frozen=True)
class FilePkcs12PublicIdentity:
    source: str
    binding_id: str
    certificate_der_sha256: str
    serial_number: str
    subject: str
    issuer: str
    not_before: str
    not_after: str


def inspect_public_certificate_file(
    path: str | Path,
    *,
    active_certificate_hashes: set[str] | frozenset[str],
    binding_id: str,
    now: datetime | None = None,
) -> FilePkcs12PublicIdentity:
    """Read only a public DER/PEM certificate and bind its exact DER hash.

    ``active_certificate_hashes`` must come from the authenticated backend
    contract; a filename, subject, issuer, or caller-provided hash is never a
    substitute.  No PKCS#12 API is called here, so no private key is loaded.
    """
    if not binding_id or not isinstance(binding_id, str):
        raise PublicCertificatePreflightError("CERTIFICATE_BINDING_REQUIRED")
    try:
        raw = Path(path).read_bytes()
    except (OSError, TypeError):
        raise PublicCertificatePreflightError("PUBLIC_CERTIFICATE_UNREADABLE") from None
    try:
        if b"-----BEGIN CERTIFICATE-----" in raw:
            cert = x509.load_pem_x509_certificate(raw)
        else:
            cert = x509.load_der_x509_certificate(raw)
        der = cert.public_bytes(Encoding.DER)
    except (ValueError, TypeError):
        raise PublicCertificatePreflightError("PUBLIC_CERTIFICATE_INVALID") from None

    public_key = cert.public_key()
    if not isinstance(public_key, rsa.RSAPublicKey) or public_key.key_size < 2048:
        raise PublicCertificatePreflightError("PUBLIC_CERTIFICATE_KEY_UNSUPPORTED")

    moment = now or datetime.now(timezone.utc)
    if moment.tzinfo is None:
        moment = moment.replace(tzinfo=timezone.utc)
    not_before = cert.not_valid_before_utc
    not_after = cert.not_valid_after_utc
    if moment < not_before or moment > not_after:
        raise PublicCertificatePreflightError("PUBLIC_CERTIFICATE_EXPIRED_OR_NOT_YET_VALID")
    try:
        usage = cert.extensions.get_extension_for_class(x509.KeyUsage).value
        if not usage.digital_signature:
            raise PublicCertificatePreflightError("PUBLIC_CERTIFICATE_USAGE_INVALID")
    except x509.ExtensionNotFound:
        pass

    digest = hashlib.sha256(der).hexdigest()
    allowed = {str(item).lower() for item in active_certificate_hashes}
    if digest not in allowed:
        raise PublicCertificatePreflightError("CERTIFICATE_NOT_AUTHORIZED")
    return FilePkcs12PublicIdentity(
        source="FILE_PKCS12",
        binding_id=binding_id,
        certificate_der_sha256=digest,
        serial_number=str(cert.serial_number),
        subject=cert.subject.rfc4514_string(),
        issuer=cert.issuer.rfc4514_string(),
        not_before=not_before.isoformat(),
        not_after=not_after.isoformat(),
    )
