from __future__ import annotations

import hashlib
import io
import sys
from pathlib import Path

import fitz
import pytest
from pypdf import PdfReader, PdfWriter
from pypdf.generic import (
    ArrayObject, DictionaryObject, FloatObject, NameObject, NumberObject,
    TextStringObject,
)

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "backend"))
import services.editor_signature_anchor_service as service
from services.editor_signature_anchor_service import (
    ALIAS_TOKEN, CANONICAL_TOKEN, DEFAULT_FIELD_NAME, MAX_PDF_BYTES,
    PreparedSignaturePdf, SignatureAnchorError, prepare_signature_anchor,
)


def pdf_with(text: str, *, pages=1, x=100, y=300, rotate=0, neighbor=False) -> bytes:
    doc = fitz.open()
    for page_no in range(pages):
        page = doc.new_page(width=595.3, height=841.9)
        page.insert_text((48, 80), "SYNTHETIC SIGNATURE ANCHOR TEST", fontsize=14)
        if page_no == pages - 1:
            page.insert_text((x, y), text, fontsize=10)
            if neighbor:
                page.insert_text((x + 5, y + 20), "NEIGHBOR", fontsize=10)
        page.insert_text((48, 760), "Synthetic neighboring content preserved.", fontsize=10)
        page.set_rotation(rotate)
    out = io.BytesIO(); doc.save(out); return out.getvalue()


def fragmented_pdf() -> bytes:
    doc = fitz.open(); page = doc.new_page(width=595.3, height=841.9)
    page.insert_text((100, 300), "<<Cirurgiao.", fontsize=10)
    page.insert_text((152, 300), "AssinaturaDigital>>", fontsize=10)
    page.insert_text((48, 760), "Synthetic neighboring content preserved.", fontsize=10)
    out = io.BytesIO(); doc.save(out); return out.getvalue()


def rewrite_pdf(source: bytes, mutate) -> bytes:
    reader = PdfReader(io.BytesIO(source))
    writer = PdfWriter()
    writer.clone_document_from_reader(reader)
    mutate(writer)
    output = io.BytesIO()
    writer.write(output)
    return output.getvalue()


def pdf_with_structural_signature(*, field_name="ExistingSignature", nested=False) -> bytes:
    def mutate(writer):
        parent = DictionaryObject({
            NameObject("/FT"): NameObject("/Sig"),
            NameObject("/T"): TextStringObject(field_name),
        })
        parent_ref = writer._add_object(parent)
        widget = DictionaryObject({
            NameObject("/Type"): NameObject("/Annot"),
            NameObject("/Subtype"): NameObject("/Widget"),
            NameObject("/Rect"): ArrayObject([FloatObject(20), FloatObject(20), FloatObject(180), FloatObject(64)]),
            NameObject("/P"): writer.pages[0].indirect_reference,
            NameObject("/Parent"): parent_ref,
        })
        widget_ref = writer._add_object(widget)
        parent[NameObject("/Kids")] = ArrayObject([widget_ref])
        fields = ArrayObject([parent_ref if nested else widget_ref])
        if not nested:
            widget[NameObject("/FT")] = NameObject("/Sig")
            widget[NameObject("/T")] = TextStringObject(field_name)
        acroform = DictionaryObject({NameObject("/Fields"): fields})
        writer.root_object[NameObject("/AcroForm")] = writer._add_object(acroform)
        writer.pages[0][NameObject("/Annots")] = ArrayObject([widget_ref])
    return rewrite_pdf(pdf_with(CANONICAL_TOKEN), mutate)


POSITIVE_CASES = [
    pytest.param(lambda: pdf_with(CANONICAL_TOKEN, x=100, y=120), id="positive-first-page"),
    pytest.param(lambda: pdf_with(CANONICAL_TOKEN, x=100, y=420), id="positive-middle-page"),
    pytest.param(lambda: pdf_with(CANONICAL_TOKEN, x=100, y=600), id="positive-last-page"),
    pytest.param(lambda: pdf_with(CANONICAL_TOKEN, pages=3, x=100, y=420), id="positive-multipage"),
    pytest.param(lambda: pdf_with(CANONICAL_TOKEN, x=425, y=420), id="positive-right-margin-reduction"),
    pytest.param(fragmented_pdf, id="positive-fragmented-token"),
    pytest.param(lambda: pdf_with(ALIAS_TOKEN, x=100, y=420), id="positive-accentless-alias"),
]


@pytest.mark.parametrize("factory", POSITIVE_CASES)
def test_positive_matrix(factory):
    result = prepare_signature_anchor(factory())
    assert isinstance(result, PreparedSignaturePdf)
    assert hashlib.sha256(result.pdf_bytes).hexdigest() == result.sha256
    doc = fitz.open(stream=result.pdf_bytes, filetype="pdf")
    widgets = [w for page in doc for w in (page.widgets() or [])]
    text = "".join(page.get_text() for page in doc)
    assert len(widgets) == 1 and widgets[0].field_value in (None, "")
    assert CANONICAL_TOKEN not in text and ALIAS_TOKEN not in text
    assert result.diagnostic["locator_difference_pt"] <= 3.0


@pytest.mark.parametrize("factory", [
    pytest.param(lambda: pdf_with("Synthetic text only."), id="negative-missing-token"),
    pytest.param(lambda: pdf_with(CANONICAL_TOKEN + " " + CANONICAL_TOKEN), id="negative-duplicate-token"),
    pytest.param(lambda: pdf_with("<<Cirurgião.Assinatura>>"), id="negative-similar-text"),
    pytest.param(lambda: pdf_with("<<Cirurgião.AssinaturaDigital>"), id="negative-incomplete-token"),
    pytest.param(lambda: pdf_with("<<Cirurgião.\nAssinaturaDigital>>"), id="negative-ambiguous-line-break"),
    pytest.param(lambda: pdf_with(CANONICAL_TOKEN, x=450, y=820), id="negative-insufficient-space"),
    pytest.param(lambda: pdf_with(CANONICAL_TOKEN, x=450, y=700), id="negative-out-of-bounds"),
    pytest.param(lambda: pdf_with(CANONICAL_TOKEN), id="negative-locator-tolerance"),
    pytest.param(lambda: pdf_with(CANONICAL_TOKEN, rotate=90), id="negative-rotation"),
    pytest.param(lambda: pdf_with(CANONICAL_TOKEN, x=100, y=420, neighbor=True), id="negative-neighbor-overlap"),
])
def test_negative_matrix(factory, monkeypatch, request):
    if "negative-locator-tolerance" in request.node.name:
        monkeypatch.setattr(service, "_locate", lambda _: (_ for _ in ()).throw(SignatureAnchorError("LOCATOR_GEOMETRY_DISAGREEMENT")))
    with pytest.raises(SignatureAnchorError):
        prepare_signature_anchor(factory())


def test_negative_preexisting_field():
    doc = fitz.open(stream=pdf_with(CANONICAL_TOKEN), filetype="pdf")
    widget = fitz.Widget(); widget.field_name = DEFAULT_FIELD_NAME; widget.field_type = fitz.PDF_WIDGET_TYPE_SIGNATURE; widget.rect = fitz.Rect(20,20,180,64); doc[0].add_widget(widget)
    out = io.BytesIO(); doc.save(out)
    with pytest.raises(SignatureAnchorError):
        prepare_signature_anchor(out.getvalue())


@pytest.mark.parametrize(
    ("payload_factory", "error_code"),
    [
        pytest.param(lambda: pdf_with_structural_signature(field_name=DEFAULT_FIELD_NAME), "SIGNATURE_FIELD_ALREADY_EXISTS", id="preflight-canonical-empty-sig"),
        pytest.param(lambda: pdf_with_structural_signature(field_name="OtherSignature"), "SIGNATURE_FIELD_ALREADY_EXISTS", id="preflight-other-empty-sig"),
        pytest.param(lambda: pdf_with_structural_signature(field_name="InheritedSignature", nested=True), "SIGNATURE_FIELD_ALREADY_EXISTS", id="preflight-nested-inherited-sig"),
    ],
)
def test_structural_signature_field_is_rejected_before_location(monkeypatch, payload_factory, error_code):
    monkeypatch.setattr(service, "_locate", lambda *_a, **_k: pytest.fail("anchor location reached"))
    with pytest.raises(SignatureAnchorError, match=error_code):
        prepare_signature_anchor(payload_factory())


def test_structural_byte_range_is_rejected_before_location(monkeypatch):
    def mutate(writer):
        signature = DictionaryObject({
            NameObject("/ByteRange"): ArrayObject([NumberObject(0), NumberObject(10), NumberObject(20), NumberObject(30)]),
            NameObject("/Contents"): TextStringObject("synthetic"),
        })
        writer.root_object[NameObject("/SyntheticSignature")]=writer._add_object(signature)
    payload = rewrite_pdf(pdf_with(CANONICAL_TOKEN), mutate)
    monkeypatch.setattr(service, "_locate", lambda *_a, **_k: pytest.fail("anchor location reached"))
    with pytest.raises(SignatureAnchorError, match="PDF_ALREADY_SIGNED"):
        prepare_signature_anchor(payload)


def test_orphan_signature_widget_is_rejected_before_location(monkeypatch):
    def mutate(writer):
        widget = DictionaryObject({
            NameObject("/Type"): NameObject("/Annot"),
            NameObject("/Subtype"): NameObject("/Widget"),
            NameObject("/FT"): NameObject("/Sig"),
            NameObject("/T"): TextStringObject("OrphanSignature"),
            NameObject("/Rect"): ArrayObject([FloatObject(20), FloatObject(20), FloatObject(180), FloatObject(64)]),
        })
        writer.pages[0][NameObject("/Annots")] = ArrayObject([writer._add_object(widget)])
    payload = rewrite_pdf(pdf_with(CANONICAL_TOKEN), mutate)
    monkeypatch.setattr(service, "_locate", lambda *_a, **_k: pytest.fail("anchor location reached"))
    with pytest.raises(SignatureAnchorError, match="SIGNATURE_FIELD_ALREADY_EXISTS"):
        prepare_signature_anchor(payload)


def test_docmdp_is_rejected_before_location(monkeypatch):
    def mutate(writer):
        signature = DictionaryObject({NameObject("/Type"): NameObject("/Sig")})
        perms = DictionaryObject({NameObject("/DocMDP"): writer._add_object(signature)})
        writer.root_object[NameObject("/Perms")] = writer._add_object(perms)
    payload = rewrite_pdf(pdf_with(CANONICAL_TOKEN), mutate)
    monkeypatch.setattr(service, "_locate", lambda *_a, **_k: pytest.fail("anchor location reached"))
    with pytest.raises(SignatureAnchorError, match="PDF_CERTIFIED"):
        prepare_signature_anchor(payload)


def test_visible_signature_syntax_text_is_not_a_structural_false_positive():
    document = fitz.open()
    page = document.new_page(width=595.3, height=841.9)
    page.insert_text((48, 80), "Visible technical text: /Sig /ByteRange", fontsize=10)
    page.insert_text((100, 420), CANONICAL_TOKEN, fontsize=10)
    output = io.BytesIO()
    document.save(output)
    result = prepare_signature_anchor(output.getvalue())
    assert result.field_name == DEFAULT_FIELD_NAME


def test_encrypted_pdf_is_rejected():
    writer = PdfWriter()
    writer.add_blank_page(width=595.3, height=841.9)
    writer.encrypt("synthetic-password")
    output = io.BytesIO()
    writer.write(output)
    with pytest.raises(SignatureAnchorError, match="PDF_ENCRYPTED_UNSUPPORTED"):
        prepare_signature_anchor(output.getvalue())


def test_pdf_without_pages_is_rejected():
    writer = PdfWriter()
    output = io.BytesIO()
    writer.write(output)
    with pytest.raises(SignatureAnchorError, match="PDF_HAS_NO_PAGES"):
        prepare_signature_anchor(output.getvalue())


@pytest.mark.parametrize("payload", [b"", b"not a pdf"], ids=["additional-empty-input", "additional-invalid-pdf"])
def test_additional_input_rejection(payload):
    with pytest.raises(SignatureAnchorError):
        prepare_signature_anchor(payload)


def test_additional_input_size_limit():
    with pytest.raises(SignatureAnchorError, match="PDF_TOO_LARGE"):
        prepare_signature_anchor(b"x" * (MAX_PDF_BYTES + 1))


@pytest.mark.parametrize("field_name", ["CustomSignature", "", "bad name"], ids=["additional-custom-field", "additional-empty-field", "additional-invalid-field"])
def test_additional_field_name_contract(field_name):
    if field_name == "CustomSignature":
        result = prepare_signature_anchor(pdf_with(CANONICAL_TOKEN), field_name)
        assert result.field_name == field_name
    else:
        with pytest.raises(SignatureAnchorError):
            prepare_signature_anchor(pdf_with(CANONICAL_TOKEN), field_name)


def test_additional_hash_widget_and_sanitized_diagnostic():
    result = prepare_signature_anchor(pdf_with(CANONICAL_TOKEN))
    assert hashlib.sha256(result.pdf_bytes).hexdigest() == result.sha256
    assert result.diagnostic["token_count"] == 1
    assert "Synthetic" not in str(result.diagnostic)
    doc = fitz.open(stream=result.pdf_bytes, filetype="pdf")
    widgets = [w for page in doc for w in (page.widgets() or [])]
    assert len(widgets) == 1 and widgets[0].field_value in (None, "")


def test_additional_semantic_stability():
    source = pdf_with(CANONICAL_TOKEN)
    first = prepare_signature_anchor(source); second = prepare_signature_anchor(source)
    assert first.page_index == second.page_index
    assert first.signature_rect == second.signature_rect
    assert first.diagnostic == second.diagnostic


def test_tamper_after_hash_is_detected():
    result = prepare_signature_anchor(pdf_with(CANONICAL_TOKEN))
    tampered = bytearray(result.pdf_bytes); tampered[-1] ^= 1
    assert hashlib.sha256(tampered).hexdigest() != result.sha256
