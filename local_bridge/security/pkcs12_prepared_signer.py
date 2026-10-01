"""Local, post-authorization PKCS#12 signer.

The provider is deliberately a local callback returning transient bytes and a
password.  No path, password, or container bytes enter authorization SQL,
HTTP, operation state, process arguments, or logging.
"""

from __future__ import annotations

import hashlib
import io
from collections.abc import Callable

from cryptography import x509
from cryptography.hazmat.primitives.serialization import Encoding, NoEncryption, PrivateFormat
from cryptography.hazmat.primitives.serialization.pkcs12 import load_key_and_certificates
from asn1crypto import keys as asn1_keys
from asn1crypto import x509 as asn1_x509
from pyhanko.sign.signers import PdfSigner, PdfSignatureMetadata, SimpleSigner
from pyhanko.sign.fields import SigSeedSubFilter
from pyhanko.pdf_utils.incremental_writer import IncrementalPdfFileWriter
from pyhanko_certvalidator.registry import SimpleCertificateStore

from .prepared_signer import PreparedPdfSigningRequest


class Pkcs12SignerError(ValueError):
    """Stable error without exposing loader or password details."""


def create_file_pkcs12_prepared_signer(
    material_provider: Callable[[PreparedPdfSigningRequest], tuple[bytes, str | None]],
    *,
    expected_source: str = "FILE_PKCS12",
) -> Callable[[PreparedPdfSigningRequest], bytes]:
    """Create a signer whose material is requested only when called."""

    def sign(request: PreparedPdfSigningRequest) -> bytes:
        if request.certificate_source != expected_source:
            raise Pkcs12SignerError("CERTIFICATE_SOURCE_MISMATCH")
        expected_hash = str(request.certificate_binding or "").lower()
        if len(expected_hash) != 64 or any(c not in "0123456789abcdef" for c in expected_hash):
            raise Pkcs12SignerError("CERTIFICATE_DER_HASH_REQUIRED")
        try:
            pfx_bytes, password = material_provider(request)
        except Exception:
            raise Pkcs12SignerError("PKCS12_MATERIAL_UNAVAILABLE") from None
        if not isinstance(pfx_bytes, bytes) or not pfx_bytes:
            raise Pkcs12SignerError("PKCS12_CONTAINER_INVALID")
        # SimpleSigner's supported loader is used only after online consume.
        try:
            private_key, certificate, chain = load_key_and_certificates(
                pfx_bytes, None if password is None else password.encode("utf-8")
            )
            if private_key is None or certificate is None:
                raise ValueError("PKCS12_MATERIAL_MISSING")
            certificate_der = certificate.public_bytes(Encoding.DER)
            key_der = private_key.private_bytes(Encoding.DER, PrivateFormat.PKCS8, NoEncryption())
            signer = SimpleSigner(
                signing_cert=asn1_x509.Certificate.load(certificate_der),
                signing_key=asn1_keys.PrivateKeyInfo.load(key_der),
                cert_registry=SimpleCertificateStore(),
            )
        except (OSError, ValueError, TypeError, AttributeError):
            raise Pkcs12SignerError("PKCS12_PASSWORD_OR_CONTAINER_INVALID") from None
        if hashlib.sha256(certificate_der).hexdigest() != expected_hash:
            raise Pkcs12SignerError("PKCS12_CERTIFICATE_DER_MISMATCH")
        try:
            writer = IncrementalPdfFileWriter(io.BytesIO(request.pdf_bytes))
            output = io.BytesIO()
            metadata = PdfSignatureMetadata(
                field_name=request.field_name,
                md_algorithm="sha256",
                subfilter=SigSeedSubFilter.PADES,
            )
            pdf_signer = PdfSigner(signature_meta=metadata, signer=signer)
            # This sync boundary is intentionally local; the bridge invokes
            # signers after CONSUMED and may run it in its managed worker.
            return _run_pdf(pdf_signer, writer, output)
        except Pkcs12SignerError:
            raise
        except Exception:
            raise Pkcs12SignerError("PKCS12_SIGNING_FAILED") from None

    return sign


def _run_pdf(pdf_signer, writer, output):
    import asyncio
    result = asyncio.run(pdf_signer.async_sign_pdf(writer, existing_fields_only=True, output=output))
    return result.getvalue() if hasattr(result, "getvalue") else output.getvalue()
