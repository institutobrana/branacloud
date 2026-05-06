import base64
import io
import os
from datetime import datetime

from asn1crypto import algos, x509
from pyhanko.pdf_utils.incremental_writer import IncrementalPdfFileWriter
from pyhanko.pdf_utils.text import TextBoxStyle
from pyhanko.sign.fields import SigFieldSpec, SigSeedSubFilter
from pyhanko.sign.signers import PdfSignatureMetadata, PdfSigner
from pyhanko.sign.signers.pdf_cms import Signer
from pyhanko.sign.timestamps import HTTPTimeStamper
from pyhanko.stamp import TextStampStyle
from pyhanko_certvalidator import ValidationContext
from pyhanko_certvalidator.registry import SimpleCertificateStore

from cert_store import (
    WindowsCertificateStoreError,
    get_windows_certificate_bundle,
    sign_data_with_windows_certificate,
)


class WindowsPdfSigningError(Exception):
    """Erro controlado durante a assinatura PDF com certificado do Windows."""


def _env_flag(name: str, default: bool) -> bool:
    raw = str(os.getenv(name, "")).strip().lower()
    if not raw:
        return default
    return raw not in {"0", "false", "no", "off"}


def _signature_defaults() -> dict:
    tsa_url = str(os.getenv("BRANA_PDF_SIGN_TSA_URL", "")).strip()
    return {
        "md_algorithm": str(os.getenv("BRANA_PDF_SIGN_MD_ALG", "sha256")).strip().lower() or "sha256",
        "reason": str(os.getenv("BRANA_PDF_SIGN_REASON", "Assinado digitalmente")).strip() or "Assinado digitalmente",
        "location": str(os.getenv("BRANA_PDF_SIGN_LOCATION", "Brana SaaS")).strip() or "Brana SaaS",
        "contact_info": str(os.getenv("BRANA_PDF_SIGN_CONTACT", "")).strip() or None,
        "tsa_url": tsa_url or None,
        "allow_fetching": _env_flag("BRANA_PDF_SIGN_ALLOW_FETCHING", True),
        "timestamp_format": str(os.getenv("BRANA_PDF_SIGN_TIMESTAMP_FORMAT", "%d/%m/%Y %H:%M:%S")).strip()
        or "%d/%m/%Y %H:%M:%S",
        "profile": str(os.getenv("BRANA_PDF_SIGN_PROFILE", "pades")).strip().lower() or "pades",
    }


def _coerce_box_hint(signature_box_hint) -> dict | None:
    if not isinstance(signature_box_hint, dict):
        return None
    try:
        return {
            "page_index": max(0, int(signature_box_hint.get("page_index") or 0)),
            "left_ratio": float(signature_box_hint.get("left_ratio")),
            "top_ratio": float(signature_box_hint.get("top_ratio")),
            "width_ratio": float(signature_box_hint.get("width_ratio")),
            "height_ratio": float(signature_box_hint.get("height_ratio")),
        }
    except Exception:
        return None


class WindowsStoreSigner(Signer):
    def __init__(self, *, thumbprint: str, digest_algorithm: str = "sha256"):
        bundle = get_windows_certificate_bundle(thumbprint)
        if not bundle.get("has_private_key"):
            raise WindowsPdfSigningError(
                "O certificado selecionado nao possui chave privada disponivel no Windows."
            )
        if str(bundle.get("key_algorithm") or "").strip().lower() != "rsa":
            raise WindowsPdfSigningError(
                "Nesta fase a assinatura local suporta apenas certificados RSA instalados no Windows."
            )

        raw_signing_cert = str(bundle.get("raw_data_b64") or "").strip()
        if not raw_signing_cert:
            raise WindowsPdfSigningError("Falha ao carregar o certificado publico do Windows.")

        signing_cert = x509.Certificate.load(base64.b64decode(raw_signing_cert))
        chain_entries = list(bundle.get("chain") or [])
        cert_registry = SimpleCertificateStore()
        chain_certs = []
        for entry in chain_entries:
            raw_data = str((entry or {}).get("RawData") or "").strip()
            if not raw_data:
                continue
            try:
                cert_obj = x509.Certificate.load(base64.b64decode(raw_data))
            except Exception:
                continue
            chain_certs.append(cert_obj)
        if chain_certs:
            cert_registry.register_multiple(chain_certs[1:] or chain_certs)

        super().__init__(
            signing_cert=signing_cert,
            cert_registry=cert_registry,
            signature_mechanism=algos.SignedDigestAlgorithm(
                {"algorithm": f"{digest_algorithm.lower()}_rsa"}
            ),
            prefer_pss=False,
            embed_roots=True,
        )
        self.thumbprint = str(bundle.get("thumbprint") or thumbprint).strip().upper()
        self.key_size = int(bundle.get("key_size") or 2048)
        self.chain_certs = chain_certs

    async def async_sign_raw(
        self, data: bytes, digest_algorithm: str, dry_run: bool = False
    ) -> bytes:
        if dry_run:
            return bytes(max(256, self.key_size // 8))
        try:
            return sign_data_with_windows_certificate(
                thumbprint=self.thumbprint,
                data=data,
                digest_algorithm=digest_algorithm,
            )
        except WindowsCertificateStoreError as exc:
            raise WindowsPdfSigningError(str(exc)) from exc


def _page_box_from_writer(writer, page_index: int = 0) -> tuple[object, float, float]:
    pages = writer.prev.root["/Pages"]["/Kids"]
    page_obj = pages[min(max(0, int(page_index)), len(pages) - 1)].get_object()
    media_box = [float(x) for x in page_obj["/MediaBox"]]
    page_width = max(100.0, media_box[2] - media_box[0])
    page_height = max(100.0, media_box[3] - media_box[1])
    return page_obj, page_width, page_height


def _signature_box_for_writer(writer, signature_box_hint: dict | None = None) -> tuple[int, int, int, int]:
    hint = _coerce_box_hint(signature_box_hint)
    try:
        _, page_width, page_height = _page_box_from_writer(writer, (hint or {}).get("page_index", 0))
    except Exception:
        page_width = 595.0
        page_height = 842.0

    if hint:
        left_ratio = min(0.95, max(0.0, float(hint["left_ratio"])))
        top_ratio = min(0.95, max(0.0, float(hint["top_ratio"])))
        width_ratio = min(0.60, max(0.12, float(hint["width_ratio"])))
        height_ratio = min(0.20, max(0.045, float(hint["height_ratio"])))

        box_width = max(150.0, min(page_width * 0.42, page_width * width_ratio))
        box_height = max(44.0, min(page_height * 0.12, page_height * height_ratio))
        x1 = max(24.0, min(page_width - box_width - 24.0, page_width * left_ratio))
        y2 = page_height - max(18.0, min(page_height - box_height - 18.0, page_height * top_ratio))
        y1 = max(18.0, y2 - box_height)
        x2 = min(page_width - 18.0, x1 + box_width)
        return (int(x1), int(y1), int(x2), int(y2))

    box_width = min(220.0, max(160.0, page_width * 0.32))
    box_height = min(72.0, max(44.0, page_height * 0.08))
    right_margin = max(24.0, page_width * 0.05)
    bottom_margin = max(32.0, page_height * 0.05)
    x2 = int(page_width - right_margin)
    y1 = int(bottom_margin)
    x1 = int(max(24.0, x2 - box_width))
    y2 = int(y1 + box_height)
    return (x1, y1, x2, y2)


def _build_validation_context(signer: WindowsStoreSigner, defaults: dict):
    deduped = []
    seen = set()
    for cert in list(getattr(signer, "chain_certs", []) or []):
        try:
            key = cert.dump()
        except Exception:
            continue
        if key in seen:
            continue
        seen.add(key)
        deduped.append(cert)
    if not deduped:
        return ValidationContext(
            allow_fetching=defaults["allow_fetching"],
            revocation_mode="soft-fail",
        )
    trust_roots = deduped[-1:]
    other_certs = deduped[:-1]
    return ValidationContext(
        trust_roots=trust_roots,
        other_certs=other_certs,
        allow_fetching=defaults["allow_fetching"],
        revocation_mode="soft-fail",
    )


def _build_timestamper(defaults: dict):
    tsa_url = defaults.get("tsa_url")
    if not tsa_url:
        return None
    return HTTPTimeStamper(tsa_url, https=str(tsa_url).lower().startswith("https://"))


def _build_stamp_style(defaults: dict):
    return TextStampStyle(
        border_width=1,
        stamp_text="Assinado digitalmente\n%(signer)s\nData: %(ts)s",
        timestamp_format=defaults["timestamp_format"],
        text_box_style=TextBoxStyle(font_size=8, border_width=0),
    )


def _resolve_subfilter(profile: str):
    normalized = str(profile or "pades").strip().lower()
    if normalized in {"acrobat", "acrobat_compat", "adobe", "pkcs7"}:
        return SigSeedSubFilter.ADOBE_PKCS7_DETACHED
    return SigSeedSubFilter.PADES


def build_signed_filename(filename: str | None) -> str:
    nome = str(filename or "").strip() or "documento.pdf"
    if not nome.lower().endswith(".pdf"):
        nome = f"{nome}.pdf"
    base = nome[:-4].rstrip() or "documento"
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    return f"{base}_assinado_{timestamp}.pdf"


def sign_pdf_windows_store_invisible(
    *,
    pdf_bytes: bytes,
    thumbprint: str,
    field_name: str = "Signature1",
    digest_algorithm: str = "sha256",
    signature_box_hint: dict | None = None,
    use_existing_field: bool = False,
    signature_profile: str | None = None,
) -> bytes:
    if not pdf_bytes:
        raise WindowsPdfSigningError("Arquivo PDF vazio.")

    defaults = _signature_defaults()
    field_name = str(field_name or "").strip() or "Signature1"
    signer = WindowsStoreSigner(
        thumbprint=thumbprint,
        digest_algorithm=digest_algorithm or defaults["md_algorithm"],
    )

    input_buf = io.BytesIO(pdf_bytes)
    output_buf = io.BytesIO()

    try:
        writer = IncrementalPdfFileWriter(input_buf)
        validation_context = _build_validation_context(signer, defaults)
        timestamper = _build_timestamper(defaults)
        signature_meta = PdfSignatureMetadata(
            field_name=field_name,
            md_algorithm=defaults["md_algorithm"],
            reason=defaults["reason"],
            location=defaults["location"],
            contact_info=defaults["contact_info"],
            subfilter=_resolve_subfilter(str(signature_profile or defaults["profile"] or "pades")),
            embed_validation_info=True,
            use_pades_lta=bool(timestamper),
            validation_context=validation_context,
            ac_validation_context=validation_context,
        )
        pdf_signer_kwargs = {
            "signature_meta": signature_meta,
            "signer": signer,
            "timestamper": timestamper,
            "stamp_style": _build_stamp_style(defaults),
        }
        if not use_existing_field:
            page_index = int((_coerce_box_hint(signature_box_hint) or {}).get("page_index", 0))
            pdf_signer_kwargs["new_field_spec"] = SigFieldSpec(
                sig_field_name=field_name,
                on_page=page_index,
                box=_signature_box_for_writer(writer, signature_box_hint),
            )
        pdf_signer = PdfSigner(**pdf_signer_kwargs)
        pdf_signer.sign_pdf(writer, output=output_buf)
    except WindowsPdfSigningError:
        raise
    except Exception as exc:
        raise WindowsPdfSigningError(
            f"Falha ao assinar PDF com o certificado do Windows: {exc}"
        ) from exc

    signed_pdf = output_buf.getvalue()
    if not signed_pdf:
        raise WindowsPdfSigningError("Falha ao gerar o PDF assinado pelo Windows.")
    return signed_pdf
