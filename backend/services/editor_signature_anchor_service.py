from __future__ import annotations

import hashlib
import io
import re
from dataclasses import dataclass

import fitz
import pdfplumber
from pypdf import PdfReader
from pypdf.generic import ArrayObject, DictionaryObject, IndirectObject, StreamObject


CANONICAL_TOKEN = "<<Cirurgião.AssinaturaDigital>>"
ALIAS_TOKEN = "<<Cirurgiao.AssinaturaDigital>>"
DEFAULT_FIELD_NAME = "BranaSignature_1"
LOCATOR_TOLERANCE_PT = 3.0
DEFAULT_WIDTH_PT = 220.0
DEFAULT_HEIGHT_PT = 72.0
MIN_WIDTH_PT = 160.0
MIN_HEIGHT_PT = 44.0
MAX_PDF_BYTES = 25 * 1024 * 1024
FIELD_NAME_RE = re.compile(r"^[A-Za-z][A-Za-z0-9_.-]{0,119}$")


class SignatureAnchorError(ValueError):
    """Falha sanitizada ao preparar uma âncora de assinatura."""


@dataclass(frozen=True)
class PreparedSignaturePdf:
    pdf_bytes: bytes
    sha256: str
    page_index: int
    signature_rect: tuple[float, float, float, float]
    field_name: str
    diagnostic: dict[str, object]


def _fail(code: str) -> SignatureAnchorError:
    return SignatureAnchorError(code)


def _resolve_pdf_object(value):
    return value.get_object() if isinstance(value, IndirectObject) else value


def _walk_signature_fields(field_ref, *, inherited_type=None, seen=None) -> None:
    seen = seen if seen is not None else set()
    if isinstance(field_ref, IndirectObject):
        identity = (field_ref.idnum, field_ref.generation)
        if identity in seen:
            raise _fail("PDF_SIGNATURE_STRUCTURE_INVALID")
        seen.add(identity)
    field = _resolve_pdf_object(field_ref)
    if not isinstance(field, DictionaryObject):
        raise _fail("PDF_SIGNATURE_STRUCTURE_INVALID")
    field_type = field.get("/FT", inherited_type)
    if str(field_type or "") == "/Sig":
        raise _fail("SIGNATURE_FIELD_ALREADY_EXISTS")
    kids = field.get("/Kids")
    if kids is None:
        return
    kids = _resolve_pdf_object(kids)
    if not isinstance(kids, ArrayObject):
        raise _fail("PDF_SIGNATURE_STRUCTURE_INVALID")
    for kid in kids:
        _walk_signature_fields(kid, inherited_type=field_type, seen=seen)


def _walk_pdf_structure_for_signatures(root_ref) -> None:
    pending = [root_ref]
    seen_indirect: set[tuple[int, int]] = set()
    seen_direct: set[int] = set()
    while pending:
        item = pending.pop()
        if isinstance(item, IndirectObject):
            identity = (item.idnum, item.generation)
            if identity in seen_indirect:
                continue
            seen_indirect.add(identity)
            item = item.get_object()
        elif isinstance(item, (DictionaryObject, ArrayObject)):
            identity = id(item)
            if identity in seen_direct:
                continue
            seen_direct.add(identity)
        if isinstance(item, DictionaryObject):
            if "/ByteRange" in item or str(item.get("/Type") or "") == "/Sig":
                raise _fail("PDF_ALREADY_SIGNED")
            if str(item.get("/FT") or "") == "/Sig":
                raise _fail("SIGNATURE_FIELD_ALREADY_EXISTS")
            pending.extend(item.values())
        elif isinstance(item, ArrayObject):
            pending.extend(item)
        elif isinstance(item, StreamObject):
            pending.extend(item.values())


def _validate_unsigned_source(pdf_bytes: bytes) -> None:
    try:
        reader = PdfReader(io.BytesIO(pdf_bytes), strict=True)
        if reader.is_encrypted:
            raise _fail("PDF_ENCRYPTED_UNSUPPORTED")
        if len(reader.pages) == 0:
            raise _fail("PDF_HAS_NO_PAGES")
        root = _resolve_pdf_object(reader.trailer.get("/Root"))
        if not isinstance(root, DictionaryObject):
            raise _fail("PDF_SIGNATURE_STRUCTURE_INVALID")
        perms = root.get("/Perms")
        if perms is not None:
            perms = _resolve_pdf_object(perms)
            if not isinstance(perms, DictionaryObject):
                raise _fail("PDF_SIGNATURE_STRUCTURE_INVALID")
            if "/DocMDP" in perms:
                raise _fail("PDF_CERTIFIED")
        acroform = root.get("/AcroForm")
        if acroform is not None:
            acroform = _resolve_pdf_object(acroform)
            if not isinstance(acroform, DictionaryObject):
                raise _fail("PDF_SIGNATURE_STRUCTURE_INVALID")
            fields = acroform.get("/Fields", ArrayObject())
            fields = _resolve_pdf_object(fields)
            if not isinstance(fields, ArrayObject):
                raise _fail("PDF_SIGNATURE_STRUCTURE_INVALID")
            seen_fields: set[tuple[int, int]] = set()
            for field in fields:
                _walk_signature_fields(field, seen=seen_fields)
        _walk_pdf_structure_for_signatures(root)
    except SignatureAnchorError:
        raise
    except Exception as exc:
        raise _fail("PDF_INVALID_OR_UNSUPPORTED") from exc


def _find_fitz(pdf: fitz.Document, token: str) -> list[tuple[int, fitz.Rect]]:
    hits: list[tuple[int, fitz.Rect]] = []
    for page_index, page in enumerate(pdf):
        for rect in page.search_for(token):
            hits.append((page_index, rect))
        if any(item[0] == page_index for item in hits):
            continue
        raw = page.get_text("rawdict")
        for block in raw.get("blocks", []):
            for line in block.get("lines", []):
                chars = [char for span in line.get("spans", []) for char in span.get("chars", [])]
                stream = "".join(char.get("c", "") for char in chars)
                offset = stream.find(token)
                if offset < 0:
                    continue
                selected = chars[offset : offset + len(token)]
                if len(selected) != len(token):
                    raise _fail("ANCHOR_SEQUENCE_INCOMPLETE")
                boxes = [char["bbox"] for char in selected]
                hits.append((page_index, fitz.Rect(min(box[0] for box in boxes), min(box[1] for box in boxes), max(box[2] for box in boxes), max(box[3] for box in boxes))))
    return hits


def _find_plumber(pdf_bytes: bytes, token: str) -> list[tuple[int, tuple[float, float, float, float]]]:
    hits: list[tuple[int, tuple[float, float, float, float]]] = []
    with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
        for page_index, page in enumerate(pdf.pages):
            chars = page.chars
            stream = "".join(char.get("text", "") for char in chars)
            offset = stream.find(token)
            if offset < 0:
                continue
            selected = chars[offset : offset + len(token)]
            if len(selected) != len(token):
                raise _fail("ANCHOR_SEQUENCE_INCOMPLETE")
            hits.append((page_index, (min(c["x0"] for c in selected), page.height - max(c["bottom"] for c in selected), max(c["x1"] for c in selected), page.height - min(c["top"] for c in selected))))
    return hits


def _locate(pdf_bytes: bytes) -> tuple[int, fitz.Rect, float, str]:
    pdf = fitz.open(stream=pdf_bytes, filetype="pdf")
    if pdf.page_count == 0:
        raise _fail("PDF_HAS_NO_PAGES")
    candidates: list[tuple[str, str, list[tuple[int, fitz.Rect]], list[tuple[int, tuple[float, float, float, float]]]]] = []
    for token, label in ((CANONICAL_TOKEN, "canonical"), (ALIAS_TOKEN, "alias")):
        fitz_hits = _find_fitz(pdf, token)
        plumber_hits = _find_plumber(pdf_bytes, token)
        if fitz_hits or plumber_hits:
            candidates.append((token, label, fitz_hits, plumber_hits))
    if len(candidates) != 1:
        raise _fail("ANCHOR_COUNT_AMBIGUOUS")
    token, label, fitz_hits, plumber_hits = candidates[0]
    if len(fitz_hits) != 1 or len(plumber_hits) != 1:
        raise _fail("ANCHOR_COUNT_INVALID")
    page_index, fitz_rect = fitz_hits[0]
    plumber_page, plumber_rect = plumber_hits[0]
    if page_index != plumber_page:
        raise _fail("LOCATOR_PAGE_DISAGREEMENT")
    page = pdf[page_index]
    if page.rotation not in (0,):
        raise _fail("PAGE_ROTATION_UNSUPPORTED")
    fitz_pdf_rect = (fitz_rect.x0, page.rect.height - fitz_rect.y1, fitz_rect.x1, page.rect.height - fitz_rect.y0)
    difference = max(abs(fitz_pdf_rect[i] - plumber_rect[i]) for i in range(4))
    if difference > LOCATOR_TOLERANCE_PT:
        raise _fail("LOCATOR_GEOMETRY_DISAGREEMENT")
    return page_index, fitz_rect, difference, label


def _validate_rect(page: fitz.Page, anchor: fitz.Rect) -> tuple[fitz.Rect, bool]:
    width = DEFAULT_WIDTH_PT
    height = DEFAULT_HEIGHT_PT
    reduced = False
    available_width = page.rect.width - anchor.x0
    available_height = page.rect.height - anchor.y0
    if anchor.x0 + width > page.rect.width:
        width = available_width
        reduced = True
    if anchor.y0 + height > page.rect.height:
        height = available_height
        reduced = True
    if width < MIN_WIDTH_PT or height < MIN_HEIGHT_PT:
        raise _fail("SIGNATURE_RECT_TOO_SMALL")
    rect = fitz.Rect(anchor.x0, anchor.y0, anchor.x0 + width, anchor.y0 + height)
    if not page.rect.contains(rect):
        raise _fail("SIGNATURE_RECT_OUT_OF_BOUNDS")
    for word in page.get_text("words"):
        word_rect = fitz.Rect(word[:4])
        if word_rect.intersects(rect) and not word_rect.intersects(anchor):
            raise _fail("SIGNATURE_RECT_OVERLAPS_NEIGHBOR")
    return rect, reduced


def prepare_signature_anchor(pdf_bytes: bytes, field_name: str = DEFAULT_FIELD_NAME) -> PreparedSignaturePdf:
    if not isinstance(pdf_bytes, (bytes, bytearray)) or not pdf_bytes:
        raise _fail("PDF_EMPTY")
    if len(pdf_bytes) > MAX_PDF_BYTES:
        raise _fail("PDF_TOO_LARGE")
    name = str(field_name or "").strip()
    if not FIELD_NAME_RE.fullmatch(name):
        raise _fail("SIGNATURE_FIELD_NAME_INVALID")
    try:
        source = bytes(pdf_bytes)
        _validate_unsigned_source(source)
        page_index, anchor, difference, locator = _locate(source)
        document = fitz.open(stream=source, filetype="pdf")
        signature_rect, reduced = _validate_rect(document[page_index], anchor)
        document[page_index].add_redact_annot(anchor, fill=(1, 1, 1))
        document[page_index].apply_redactions()
        redacted = io.BytesIO()
        document.save(redacted, garbage=4, deflate=True)
        document.close()
        prepared = fitz.open(stream=redacted.getvalue(), filetype="pdf")
        if any(token in "".join(page.get_text() for page in prepared) for token in (CANONICAL_TOKEN, ALIAS_TOKEN)):
            raise _fail("ANCHOR_REDACTION_INCOMPLETE")
        widget = fitz.Widget()
        widget.field_name = name
        widget.field_type = fitz.PDF_WIDGET_TYPE_SIGNATURE
        widget.rect = signature_rect
        prepared[page_index].add_widget(widget)
        output = io.BytesIO()
        prepared.save(output, garbage=4, deflate=True)
        prepared.close()
        result = output.getvalue()
        check = fitz.open(stream=result, filetype="pdf")
        widgets = [w for page in check for w in (page.widgets() or []) if w.field_name == name]
        final_text = "".join(page.get_text() for page in check)
        if len(widgets) != 1 or CANONICAL_TOKEN in final_text or ALIAS_TOKEN in final_text or widgets[0].field_value:
            raise _fail("SIGNATURE_FIELD_VALIDATION_FAILED")
        check.close()
        return PreparedSignaturePdf(result, hashlib.sha256(result).hexdigest(), page_index, tuple(float(x) for x in signature_rect), name, {"locator": locator, "rect_reduced": reduced, "locator_difference_pt": round(difference, 6), "token_count": 1})
    except SignatureAnchorError:
        raise
    except Exception as exc:
        raise _fail("PDF_PREPARATION_FAILED") from exc
