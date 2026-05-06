import io
import os
from datetime import datetime


class DigitalSignatureError(Exception):
    """Erro de assinatura digital para retorno controlado nas rotas."""


def _load_pyhanko():
    try:
        from pyhanko.pdf_utils.incremental_writer import IncrementalPdfFileWriter
        from pyhanko.sign import signers
        from pyhanko.sign.fields import SigFieldSpec, SigSeedSubFilter, append_signature_field
        from pyhanko.sign.signers import PdfSignatureMetadata, PdfSigner
        from pyhanko.sign.timestamps import HTTPTimeStamper
        from pyhanko.stamp import TextStampStyle
        from pyhanko.pdf_utils.text import TextBoxStyle
        from pyhanko_certvalidator import ValidationContext
    except Exception as exc:  # pragma: no cover - dependente de ambiente
        raise DigitalSignatureError(
            "Assinatura digital indisponivel: dependencias pyHanko nao instaladas."
        ) from exc
    return {
        "IncrementalPdfFileWriter": IncrementalPdfFileWriter,
        "signers": signers,
        "SigFieldSpec": SigFieldSpec,
        "SigSeedSubFilter": SigSeedSubFilter,
        "append_signature_field": append_signature_field,
        "PdfSignatureMetadata": PdfSignatureMetadata,
        "PdfSigner": PdfSigner,
        "HTTPTimeStamper": HTTPTimeStamper,
        "TextStampStyle": TextStampStyle,
        "TextBoxStyle": TextBoxStyle,
        "ValidationContext": ValidationContext,
    }


def _env_flag(name: str, default: bool) -> bool:
    raw = str(os.getenv(name, "")).strip().lower()
    if not raw:
        return default
    return raw not in {"0", "false", "no", "off"}


def _signature_defaults() -> dict:
    tsa_url = str(os.getenv("BRANA_PDF_SIGN_TSA_URL", "")).strip()
    allow_fetching = _env_flag("BRANA_PDF_SIGN_ALLOW_FETCHING", True)
    return {
        "md_algorithm": str(os.getenv("BRANA_PDF_SIGN_MD_ALG", "sha256")).strip().lower() or "sha256",
        "reason": str(os.getenv("BRANA_PDF_SIGN_REASON", "Assinado digitalmente")).strip() or "Assinado digitalmente",
        "location": str(os.getenv("BRANA_PDF_SIGN_LOCATION", "Brana SaaS")).strip() or "Brana SaaS",
        "contact_info": str(os.getenv("BRANA_PDF_SIGN_CONTACT", "")).strip() or None,
        "tsa_url": tsa_url or None,
        "allow_fetching": allow_fetching,
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
        width_ratio = min(0.42, max(0.08, float(hint["width_ratio"])))
        height_ratio = min(0.10, max(0.018, float(hint["height_ratio"])))

        box_width = max(76.0, min(page_width * 0.28, page_width * width_ratio))
        box_height = max(24.0, min(page_height * 0.09, page_height * height_ratio))
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


def _build_stamp_style(api: dict, defaults: dict):
    TextStampStyle = api["TextStampStyle"]
    TextBoxStyle = api["TextBoxStyle"]
    return TextStampStyle(
        border_width=1,
        stamp_text="Assinado digitalmente\n%(signer)s\nData: %(ts)s",
        timestamp_format=defaults["timestamp_format"],
        text_box_style=TextBoxStyle(font_size=8, border_width=0),
    )


def _build_validation_context(api: dict, signer, defaults: dict):
    ValidationContext = api["ValidationContext"]
    chain_certs = []
    try:
        chain_certs.extend(list(iter(getattr(signer, "cert_registry", None) or [])))
    except Exception:
        chain_certs = []
    signing_cert = getattr(signer, "signing_cert", None)
    if signing_cert is not None:
        chain_certs.insert(0, signing_cert)

    deduped = []
    seen = set()
    for cert in chain_certs:
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


def _build_timestamper(api: dict, defaults: dict):
    tsa_url = defaults.get("tsa_url")
    if not tsa_url:
        return None
    HTTPTimeStamper = api["HTTPTimeStamper"]
    return HTTPTimeStamper(tsa_url, https=str(tsa_url).lower().startswith("https://"))


def _resolve_subfilter(api: dict, profile: str):
    SigSeedSubFilter = api["SigSeedSubFilter"]
    normalized = str(profile or "pades").strip().lower()
    if normalized in {"acrobat", "acrobat_compat", "adobe", "pkcs7"}:
        return SigSeedSubFilter.ADOBE_PKCS7_DETACHED
    return SigSeedSubFilter.PADES


def _build_signature_meta(api: dict, *, field_name: str, validation_context, defaults: dict, use_lta: bool, profile: str):
    PdfSignatureMetadata = api["PdfSignatureMetadata"]
    return PdfSignatureMetadata(
        field_name=field_name,
        md_algorithm=defaults["md_algorithm"],
        reason=defaults["reason"],
        location=defaults["location"],
        contact_info=defaults["contact_info"],
        subfilter=_resolve_subfilter(api, profile),
        embed_validation_info=True,
        use_pades_lta=bool(use_lta),
        validation_context=validation_context,
        ac_validation_context=validation_context,
    )


def build_signed_filename(filename: str | None) -> str:
    nome = str(filename or "").strip() or "documento.pdf"
    if not nome.lower().endswith(".pdf"):
        nome = f"{nome}.pdf"
    base = nome[:-4].rstrip() or "documento"
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    return f"{base}_assinado_{timestamp}.pdf"


def append_empty_signature_field_to_pdf(
    pdf_bytes: bytes,
    *,
    field_name: str = "Assinatura",
    signature_box_hint: dict | None = None,
) -> bytes:
    if not pdf_bytes:
        raise DigitalSignatureError("Arquivo PDF vazio.")
    api = _load_pyhanko()
    IncrementalPdfFileWriter = api["IncrementalPdfFileWriter"]
    SigFieldSpec = api["SigFieldSpec"]
    append_signature_field = api["append_signature_field"]
    try:
        writer = IncrementalPdfFileWriter(io.BytesIO(pdf_bytes))
        page_index = int((_coerce_box_hint(signature_box_hint) or {}).get("page_index", 0))
        append_signature_field(
            writer,
            SigFieldSpec(
                sig_field_name=str(field_name or "").strip() or "Assinatura",
                on_page=page_index,
                box=_signature_box_for_writer(writer, signature_box_hint),
            ),
        )
        output_buf = io.BytesIO()
        writer.write(output_buf)
        prepared = output_buf.getvalue()
        if not prepared:
            raise DigitalSignatureError("Falha ao preparar o campo de assinatura no PDF.")
        return prepared
    except DigitalSignatureError:
        raise
    except Exception as exc:
        raise DigitalSignatureError(f"Falha ao preparar o campo de assinatura no PDF: {exc}") from exc


def sign_pdf_a1_invisible(
    *,
    pdf_bytes: bytes,
    pfx_bytes: bytes,
    pfx_password: str,
    field_name: str = "Signature1",
    signature_box_hint: dict | None = None,
    use_existing_field: bool = False,
    signature_profile: str | None = None,
) -> bytes:
    if not pdf_bytes:
        raise DigitalSignatureError("Arquivo PDF vazio.")
    if not pfx_bytes:
        raise DigitalSignatureError("Certificado PFX vazio.")

    api = _load_pyhanko()
    signers = api["signers"]
    IncrementalPdfFileWriter = api["IncrementalPdfFileWriter"]
    SigFieldSpec = api["SigFieldSpec"]
    PdfSigner = api["PdfSigner"]

    passphrase = str(pfx_password or "").encode("utf-8")
    try:
        signer = signers.SimpleSigner.load_pkcs12(io.BytesIO(pfx_bytes), passphrase=passphrase)
    except Exception as exc:
        raise DigitalSignatureError(
            "Nao foi possivel abrir o certificado digital (PFX). Verifique a senha."
        ) from exc

    defaults = _signature_defaults()
    timestamper = _build_timestamper(api, defaults)
    validation_context = _build_validation_context(api, signer, defaults)
    signature_meta = _build_signature_meta(
        api,
        field_name=str(field_name or "").strip() or "Signature1",
        validation_context=validation_context,
        defaults=defaults,
        use_lta=bool(timestamper),
        profile=str(signature_profile or defaults["profile"] or "pades"),
    )
    stamp_style = _build_stamp_style(api, defaults)

    input_buf = io.BytesIO(pdf_bytes)
    output_buf = io.BytesIO()

    try:
        writer = IncrementalPdfFileWriter(input_buf)
        pdf_signer_kwargs = {
            "signature_meta": signature_meta,
            "signer": signer,
            "timestamper": timestamper,
            "stamp_style": stamp_style,
        }
        if not use_existing_field:
            page_index = int((_coerce_box_hint(signature_box_hint) or {}).get("page_index", 0))
            pdf_signer_kwargs["new_field_spec"] = SigFieldSpec(
                sig_field_name=str(field_name or "").strip() or "Signature1",
                on_page=page_index,
                box=_signature_box_for_writer(writer, signature_box_hint),
            )
        pdf_signer = PdfSigner(**pdf_signer_kwargs)
        pdf_signer.sign_pdf(writer, output=output_buf)
    except DigitalSignatureError:
        raise
    except Exception as exc:
        raise DigitalSignatureError(f"Falha ao assinar PDF: {exc}") from exc

    signed = output_buf.getvalue()
    if not signed:
        raise DigitalSignatureError("Falha ao gerar o PDF assinado.")
    return signed
