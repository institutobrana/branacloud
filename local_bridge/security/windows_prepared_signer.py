"""Isolated Windows signer adapter; real certificate access is injectable only."""

from __future__ import annotations

import hashlib
import re
from dataclasses import dataclass
from datetime import datetime, timezone
from collections.abc import Callable
import inspect

from .prepared_signer import PreparedPdfSigningRequest


class WindowsPreparedSignerError(ValueError):
    """Sanitized contract error raised before any signer call."""


class CertificateSelectionRequired(ValueError):
    """Raised when a public certificate identifier was not selected explicitly."""


@dataclass(frozen=True)
class SignerDiagnostic:
    phase: str
    error_code: str
    exception_class: str
    windows_error_code: int | None
    pin_required: bool | None
    retryable: bool | None
    timestamp: str
    operation_id: str
    pdf_sha256: str
    root_exception_class: str | None = None
    cause_chain: tuple[str, ...] = ()
    hresult: str | None = None
    native_marker: str | None = None
    powershell_exit_code: int | None = None
    key_spec: int | None = None

    def as_dict(self) -> dict:
        return self.__dict__.copy()


class SignerDiagnosticError(ValueError):
    """Structured sanitized diagnostic; original exception text is discarded."""

    def __init__(self, diagnostic: SignerDiagnostic):
        self.diagnostic = diagnostic
        super().__init__(diagnostic.error_code)


def _diagnostic_for(exc: Exception, *, phase: str, request: PreparedPdfSigningRequest) -> SignerDiagnostic:
    chain = []
    current = exc
    while current is not None and len(chain) < 8:
        chain.append(f"{type(current).__module__}.{type(current).__name__}")
        current = current.__cause__ or current.__context__
    root = current
    # Preserve structured provider metadata before applying generic mappings.
    # The native boundary stores the stable phase/code on DirectCspError and
    # the immediately-caused OSError carries the native numeric code.
    structured_phase = None
    structured_code = None
    structured_retry = None
    structured_key_spec = None
    current = exc
    while current is not None:
        if structured_phase is None and isinstance(getattr(current, "phase", None), str):
            structured_phase = current.phase
        if structured_code is None and isinstance(getattr(current, "code", None), str):
            structured_code = current.code
        if structured_retry is None and hasattr(current, "retryable"):
            structured_retry = current.retryable
        if structured_key_spec is None and isinstance(getattr(current, "key_spec", None), int):
            structured_key_spec = current.key_spec
        current = current.__cause__ or current.__context__
    if isinstance(structured_phase, str) and structured_phase:
        phase = structured_phase
    native_code = None
    native_hresult = None
    native_marker = None
    powershell_exit_code = None
    if native_code is None:
        current = exc
        while current is not None:
            embedded = getattr(current, "diagnostic", None)
            if isinstance(embedded, dict):
                if isinstance(embedded.get("marker"), str):
                    native_marker = embedded["marker"]
                if isinstance(embedded.get("returncode"), int):
                    powershell_exit_code = embedded["returncode"]
                if isinstance(embedded.get("hresult"), str):
                    native_hresult = embedded["hresult"]
                candidate = embedded.get("win32_error")
                if isinstance(candidate, int):
                    native_code = candidate
                    break
            for attr in ("winerror", "errno"):
                candidate = getattr(current, attr, None)
                if isinstance(candidate, int) and candidate:
                    native_code = candidate
                    break
            if native_code is not None:
                break
            current = current.__cause__ or current.__context__
    if not isinstance(native_code, int):
        native_code = getattr(exc, "errno", None) if isinstance(getattr(exc, "errno", None), int) else None
    text = " ".join(str(getattr(item, "args", ())) for item in [exc]).lower()
    classes = " ".join(chain).lower()
    if isinstance(structured_code, str) and structured_code:
        code = structured_code
        pin = True if structured_code == "PIN_REQUIRED" else None
        retry = structured_retry
    elif "pin" in text:
        code, pin, retry = "PIN_REQUIRED", True, None
    elif native_code is not None:
        code, pin, retry = "WINDOWS_PROVIDER_FAILED", None, None
    elif "windowscertificatestoreerror" in classes or "provider" in classes:
        code, pin, retry = "WINDOWS_PROVIDER_FAILED", None, None
    elif "windowspdfsigningerror" in classes and "pdf" in text:
        code, pin, retry = "PDF_FINALIZATION_FAILED", None, False
    elif phase == "certificate_resolution":
        code, pin, retry = "CERTIFICATE_RESOLUTION_FAILED", None, False
    elif phase == "pyhanko_setup":
        code, pin, retry = "PYHANKO_CONFIGURATION_FAILED", None, False
    elif phase == "pdf_finalize":
        code, pin, retry = "PDF_FINALIZATION_FAILED", None, False
    else:
        code, pin, retry = "SIGNER_FAILED_UNKNOWN", None, None
    operation_id = re.sub(r"[^A-Za-z0-9_-]", "", str(request.operation_id or ""))[:16] or "unknown"
    return SignerDiagnostic(phase, code, type(exc).__name__, native_code, pin, retry,
                            datetime.now(timezone.utc).isoformat(), operation_id,
                            hashlib.sha256(request.pdf_bytes).hexdigest(),
                            chain[-1] if chain else type(exc).__name__, tuple(chain), native_hresult, native_marker, powershell_exit_code, structured_key_spec)


def resolve_certificate_candidate(candidate_id: str, candidates: list[dict]) -> dict:
    matches = [item for item in candidates if item.get("candidate_id") == candidate_id]
    if len(matches) != 1:
        raise CertificateSelectionRequired("CERTIFICATE_SELECTION_REQUIRED")
    candidate = dict(matches[0])
    if not candidate.get("store") or not candidate.get("thumbprint"):
        raise CertificateSelectionRequired("CERTIFICATE_SELECTION_REQUIRED")
    return candidate


class WindowsPreparedPdfSigner:
    """Adapt a future Windows signer without activating it in this phase."""

    def __init__(self, signer_callable: Callable[[PreparedPdfSigningRequest], bytes], *, async_signer_callable=None) -> None:
        self._signer_callable = signer_callable
        self._async_signer_callable = async_signer_callable

    def sign_prepared(self, request: PreparedPdfSigningRequest) -> bytes:
        if hashlib.sha256(request.pdf_bytes).hexdigest() != request.prepared_pdf_sha256:
            raise WindowsPreparedSignerError("PREPARED_HASH_MISMATCH")
        if request.field_name != "BranaSignature_1" or request.use_existing_field is not True:
            raise WindowsPreparedSignerError("PREPARED_FIELD_CONTRACT_INVALID")
        if request.profile != "pades-ad-rb-1.3" or request.policy_oid != "2.16.76.1.7.1.11.1.3":
            raise WindowsPreparedSignerError("PREPARED_POLICY_CONTRACT_INVALID")
        if not request.pdf_bytes or b"/ByteRange" in request.pdf_bytes:
            raise WindowsPreparedSignerError("PREPARED_PDF_CONTRACT_INVALID")
        try:
            return bytes(self._signer_callable(request))
        except (WindowsPreparedSignerError, CertificateSelectionRequired):
            raise
        except SignerDiagnosticError:
            raise
        except Exception as exc:
            raise SignerDiagnosticError(_diagnostic_for(exc, phase="provider_sign", request=request)) from None

    async def async_sign_prepared(self, request: PreparedPdfSigningRequest) -> bytes:
        if not re.fullmatch(r"[0-9a-fA-F]{64}", request.prepared_pdf_sha256 or ""):
            raise WindowsPreparedSignerError("PREPARED_HASH_INVALID")
        digest = bytes.fromhex(request.prepared_pdf_sha256)
        if len(digest) != 32:
            raise WindowsPreparedSignerError("PREPARED_HASH_INVALID")
        try:
            if self._async_signer_callable is not None:
                result = self._async_signer_callable(request, digest)
            else:
                result = self.sign_prepared(request)
            if inspect.isawaitable(result):
                result = await result
            return bytes(result)
        except SignerDiagnosticError:
            raise
        except (WindowsPreparedSignerError, CertificateSelectionRequired):
            raise
        except Exception as exc:
            raise SignerDiagnosticError(_diagnostic_for(exc, phase="provider_sign", request=request)) from exc


def create_operational_windows_prepared_signer(
    *,
    public_predicate_resolver: Callable[[], dict],
    signer_callable: Callable[..., bytes] | None = None,
) -> WindowsPreparedPdfSigner:
    """Defer public selection and real signer wiring until an approved sign."""
    def deferred(request: PreparedPdfSigningRequest) -> bytes:
        try:
            candidate = public_predicate_resolver()
        except Exception as exc:
            raise SignerDiagnosticError(_diagnostic_for(exc, phase="certificate_resolution", request=request)) from None
        thumbprint = str(candidate.get("thumbprint") or "").strip()
        if not thumbprint or candidate.get("chain_valid") is not True:
            raise CertificateSelectionRequired("CERTIFICATE_SELECTION_REQUIRED")
        callable_ = signer_callable
        if callable_ is None:
            from ..pdf_signing import sign_pdf_windows_store_invisible
            callable_ = sign_pdf_windows_store_invisible
        try:
            return callable_(
            pdf_bytes=bytes(request.pdf_bytes),
            thumbprint=thumbprint,
            field_name="BranaSignature_1",
            use_existing_field=True,
            new_field_spec=None,
            signature_profile="pades-ad-rb-1.3",
            policy_oid="2.16.76.1.7.1.11.1.3",
            policy_der_path=None,
            allow_fetching=False,
            )
        except SignerDiagnosticError:
            raise
        except Exception as exc:
            raise SignerDiagnosticError(_diagnostic_for(exc, phase="provider_sign", request=request)) from None

    return WindowsPreparedPdfSigner(deferred)


def create_real_operational_windows_prepared_signer(*, public_provider=None, context_factory=None, boundary_api=None):
    """Concrete CSP graph. Native calls remain replaceable only at the CryptoAPI seam."""
    from ..cert_store import PublicCertificateContextFactory, Win32PublicCertificateProvider, resolve_windows_user_candidate, _public_context_identity
    from .direct_csp_adapter import PublicCspMetadata, Win32CspBoundary, PyHankoCspSigner
    from pyhanko.pdf_utils.incremental_writer import IncrementalPdfFileWriter
    from pyhanko.sign.signers import PdfSigner, PdfSignatureMetadata
    from pyhanko.sign.ades.api import CAdESSignedAttrSpec
    from asn1crypto import x509 as asn1_x509
    import io

    provider = public_provider or Win32PublicCertificateProvider(stores=("CurrentUser\\My",))
    contexts = context_factory or PublicCertificateContextFactory(store_name="My", identity_resolver=_public_context_identity)

    def factory(candidate_selector):
        def public_candidate():
            return candidate_selector()

        async def native_sign(request, digest):
            candidate = public_candidate()
            if candidate.get("store") != "CurrentUser\\My" or candidate.get("chain_valid") is not True:
                raise CertificateSelectionRequired("CERTIFICATE_SELECTION_REQUIRED")
            identity = candidate.get("_stable_identity") or candidate.get("stable_identity")
            if not identity:
                raise CertificateSelectionRequired("CERTIFICATE_SELECTION_REQUIRED")
            context = contexts.open(identity)
            metadata = PublicCspMetadata(
                store=candidate["store"], provider_name=candidate.get("provider_name") or candidate.get("provider_name_sanitized") or "",
                provider_kind=candidate.get("provider_kind") or "", key_algorithm=candidate.get("key_algorithm") or "",
                key_size=int(candidate.get("key_size") or 0), has_private_key=bool(candidate.get("has_private_key")),
                certificate_context=context,
            )
            candidate_key_spec = candidate.get("key_spec")
            key_spec = int(candidate_key_spec) if candidate_key_spec not in (None, 0) else None
            boundary = Win32CspBoundary.from_public_metadata(metadata, context_resolver=lambda _: context, api=boundary_api, key_spec=key_spec)
            certificate_der = candidate.get("certificate_der") or candidate.get("der")
            if not certificate_der:
                context.close()
                raise WindowsPreparedSignerError("PUBLIC_CERTIFICATE_DER_UNAVAILABLE")
            signing_cert = asn1_x509.Certificate.load(bytes(certificate_der))
            from pyhanko_certvalidator.registry import SimpleCertificateStore
            signer = PyHankoCspSigner(signing_cert=signing_cert, cert_registry=SimpleCertificateStore(), boundary=boundary, metadata=metadata, context_owner=context, signature_length=int(candidate.get("key_size", 2048)) // 8)
            try:
                policy_spec = __import__("local_bridge.pdf_signing", fromlist=["build_offline_pades_policy"]).build_offline_pades_policy()
                signature_meta = PdfSignatureMetadata(field_name="BranaSignature_1", md_algorithm="sha256", subfilter=__import__("pyhanko.sign.fields", fromlist=["SigSeedSubFilter"]).SigSeedSubFilter.PADES, cades_signed_attr_spec=policy_spec)
                writer = IncrementalPdfFileWriter(io.BytesIO(request.pdf_bytes))
                output = io.BytesIO()
                pdf_signer = PdfSigner(signature_meta=signature_meta, signer=signer)
                await pdf_signer.async_sign_pdf(writer, existing_fields_only=True, output=output)
                return output.getvalue()
            finally:
                context.close()

        def sync_unused(request):
            raise RuntimeError("ASYNC_CSP_SIGNER_REQUIRED")

        return WindowsPreparedPdfSigner(sync_unused, async_signer_callable=native_sign)

    factory.real_wiring = True
    factory.production_wiring = True
    return factory


def create_windows_prepared_signer(*, certificate_id: str, signer_factory: Callable[[str, PreparedPdfSigningRequest], bytes]) -> WindowsPreparedPdfSigner:
    """Create a signer with an explicit full public identifier; key access is deferred."""
    selected = str(certificate_id or '').strip()
    if len(selected) < 16 or selected != certificate_id:
        raise CertificateSelectionRequired("CERTIFICATE_SELECTION_REQUIRED")
    return WindowsPreparedPdfSigner(lambda request: signer_factory(selected, request))


def create_deferred_windows_prepared_signer(*, candidate_id: str, candidate_resolver: Callable[[str], dict], signer_factory: Callable[[dict, PreparedPdfSigningRequest], bytes]) -> WindowsPreparedPdfSigner:
    if not str(candidate_id or '').strip():
        raise CertificateSelectionRequired("CERTIFICATE_SELECTION_REQUIRED")

    def deferred(request: PreparedPdfSigningRequest) -> bytes:
        candidate = candidate_resolver(candidate_id)
        return signer_factory(candidate, request)

    return WindowsPreparedPdfSigner(deferred)
