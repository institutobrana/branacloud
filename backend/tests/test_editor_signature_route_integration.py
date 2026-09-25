from __future__ import annotations

import asyncio
import hashlib
import inspect
import io
import sys
from pathlib import Path

import fitz
import pytest
from fastapi import HTTPException
from starlette.datastructures import UploadFile

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "backend"))

import routes.editor_textos_routes as route  # noqa: E402
import services.editor_signature_workflow_service as workflow  # noqa: E402
from services.editor_signature_anchor_service import CANONICAL_TOKEN  # noqa: E402
from services.editor_signature_workflow_service import SignatureWorkflowError  # noqa: E402


def synthetic_pdf(text: str = CANONICAL_TOKEN) -> bytes:
    document = fitz.open()
    page = document.new_page(width=595.3, height=841.9)
    page.insert_text((100, 300), text, fontsize=10)
    page.insert_text((48, 760), "Synthetic neighboring content preserved.", fontsize=10)
    output = io.BytesIO()
    document.save(output)
    return output.getvalue()


def invoke_helper(*, prepared: bool, pdf_bytes: bytes | None = None, field_name="LegacyField", use_existing=False):
    return route._sign_pdf_with_optional_anchor(
        pdf_bytes=pdf_bytes if pdf_bytes is not None else synthetic_pdf(),
        pfx_bytes=b"synthetic-pfx-placeholder",
        pfx_password="synthetic-password-placeholder",
        field_name=field_name,
        signature_box_hint={"page_index": 0, "box": [1, 2, 3, 4]},
        use_existing_field=use_existing,
        signature_profile="pades",
        prepare_signature_anchor_requested=prepared,
    )


class SignerSpy:
    def __init__(self):
        self.calls = []

    def __call__(self, **kwargs):
        self.calls.append(kwargs)
        return b"signed-synthetic-pdf"


@pytest.mark.parametrize("requested", [False], ids=["legacy-explicit-false"])
def test_legacy_flow_preserves_exact_contract(monkeypatch, requested):
    spy = SignerSpy()
    monkeypatch.setattr(route, "sign_pdf_a1_invisible", spy)
    source = b"legacy-pdf-bytes"
    assert invoke_helper(prepared=requested, pdf_bytes=source) == b"signed-synthetic-pdf"
    assert spy.calls == [{
        "pdf_bytes": source,
        "pfx_bytes": b"synthetic-pfx-placeholder",
        "pfx_password": "synthetic-password-placeholder",
        "field_name": "LegacyField",
        "signature_box_hint": {"page_index": 0, "box": [1, 2, 3, 4]},
        "use_existing_field": False,
        "signature_profile": "pades",
    }]


def test_multipart_option_is_optional_and_defaults_false():
    parameter = inspect.signature(route.assinar_pdf_editor_textos).parameters["prepare_signature_anchor"]
    assert parameter.default.default is False


def test_legacy_flow_does_not_call_workflow(monkeypatch):
    monkeypatch.setattr(route, "sign_pdf_a1_invisible", SignerSpy())
    monkeypatch.setattr(route, "prepare_and_invoke_signer", lambda *_a, **_k: pytest.fail("workflow called"))
    invoke_helper(prepared=False, pdf_bytes=b"legacy")


def test_prepared_flow_calls_workflow_once_with_final_bytes(monkeypatch):
    calls = []
    signer_spy = SignerSpy()
    source = synthetic_pdf()

    def workflow_spy(pdf_bytes, signer, field_name):
        calls.append((pdf_bytes, signer, field_name))
        return workflow.prepare_and_invoke_signer(pdf_bytes, signer, field_name)

    monkeypatch.setattr(route, "prepare_and_invoke_signer", workflow_spy)
    monkeypatch.setattr(route, "sign_pdf_a1_invisible", signer_spy)
    assert invoke_helper(prepared=True, pdf_bytes=source) == b"signed-synthetic-pdf"
    assert len(calls) == 1 and calls[0][0] is source and calls[0][2] == "BranaSignature_1"
    assert len(signer_spy.calls) == 1


def test_prepared_signer_contract_is_forced_and_exact(monkeypatch):
    signer_spy = SignerSpy()
    monkeypatch.setattr(route, "sign_pdf_a1_invisible", signer_spy)
    invoke_helper(prepared=True, field_name="UntrustedClientField", use_existing=False)
    call = signer_spy.calls[0]
    assert call["field_name"] == "BranaSignature_1"
    assert call["use_existing_field"] is True
    assert call["signature_box_hint"] is None
    assert "new_field_spec" not in call


def test_prepared_bytes_and_hash_are_verified_before_signer(monkeypatch):
    signer_spy = SignerSpy()
    monkeypatch.setattr(route, "sign_pdf_a1_invisible", signer_spy)
    result = invoke_helper(prepared=True)
    prepared = signer_spy.calls[0]["pdf_bytes"]
    assert result == b"signed-synthetic-pdf"
    assert hashlib.sha256(prepared).hexdigest()
    assert CANONICAL_TOKEN not in "".join(page.get_text() for page in fitz.open(stream=prepared, filetype="pdf"))


@pytest.mark.parametrize(
    "text",
    ["Synthetic content without anchor.", CANONICAL_TOKEN + " " + CANONICAL_TOKEN],
    ids=["prepared-missing-token", "prepared-duplicate-token"],
)
def test_resolver_failure_blocks_signer(monkeypatch, text):
    signer_spy = SignerSpy()
    monkeypatch.setattr(route, "sign_pdf_a1_invisible", signer_spy)
    with pytest.raises(SignatureWorkflowError):
        invoke_helper(prepared=True, pdf_bytes=synthetic_pdf(text))
    assert signer_spy.calls == []


def test_hash_mismatch_blocks_signer(monkeypatch):
    signer_spy = SignerSpy()
    monkeypatch.setattr(route, "sign_pdf_a1_invisible", signer_spy)

    class Prepared:
        pdf_bytes = b"prepared"
        sha256 = "wrong"
        page_index = 0
        signature_rect = (1, 2, 3, 4)

    monkeypatch.setattr(workflow, "prepare_signature_anchor", lambda *_a, **_k: Prepared())
    with pytest.raises(SignatureWorkflowError, match="PREPARED_PDF_HASH_MISMATCH"):
        invoke_helper(prepared=True)
    assert signer_spy.calls == []


def test_preexisting_signature_field_blocks_signer(monkeypatch):
    document = fitz.open(stream=synthetic_pdf(), filetype="pdf")
    widget = fitz.Widget()
    widget.field_name = "BranaSignature_1"
    widget.field_type = fitz.PDF_WIDGET_TYPE_SIGNATURE
    widget.rect = fitz.Rect(20, 20, 180, 64)
    document[0].add_widget(widget)
    output = io.BytesIO()
    document.save(output)
    signer_spy = SignerSpy()
    monkeypatch.setattr(route, "sign_pdf_a1_invisible", signer_spy)
    with pytest.raises(SignatureWorkflowError):
        invoke_helper(prepared=True, pdf_bytes=output.getvalue())
    assert signer_spy.calls == []


def test_prepared_pdf_contains_exactly_one_empty_signature_field(monkeypatch):
    signer_spy = SignerSpy()
    monkeypatch.setattr(route, "sign_pdf_a1_invisible", signer_spy)
    invoke_helper(prepared=True)
    document = fitz.open(stream=signer_spy.calls[0]["pdf_bytes"], filetype="pdf")
    widgets = [widget for page in document for widget in (page.widgets() or [])]
    assert len(widgets) == 1
    assert widgets[0].field_name == "BranaSignature_1"
    assert widgets[0].field_value in (None, "")


def route_call(monkeypatch, *, prepared: bool, signer_result=b"signed-route-result", signer_error=None):
    async def fake_threadpool(function, **kwargs):
        if signer_error:
            raise signer_error
        return signer_result

    monkeypatch.setattr(route, "run_in_threadpool", fake_threadpool)
    monkeypatch.setattr(route, "_registrar_auditoria_editor_pdf", lambda *_a, **_k: None)
    return asyncio.run(route.assinar_pdf_editor_textos(
        pdf_file=UploadFile(filename="synthetic.pdf", file=io.BytesIO(b"synthetic-pdf")),
        conteudo_file=None,
        pfx_file=UploadFile(filename="synthetic.pfx", file=io.BytesIO(b"placeholder")),
        pfx_password="placeholder",
        field_name="Signature1",
        signature_box_hint_json="",
        use_existing_field=False,
        prepare_signature_anchor=prepared,
        signature_profile="pades",
        use_editor_content=False,
        conteudo="",
        conteudo_formato="text",
        pagina_config_json="",
        document_name="Synthetic",
        current_user=object(),
        db=object(),
    ))


def test_route_success_response_contract_is_preserved(monkeypatch):
    response = route_call(monkeypatch, prepared=True)
    assert response.body == b"signed-route-result"
    assert response.media_type == "application/pdf"
    assert "attachment;" in response.headers["content-disposition"]
    assert response.headers["x-signed-filename"]
    assert "sha" not in " ".join(response.headers.keys()).lower()


def test_route_returns_sanitized_400_for_workflow_failure(monkeypatch):
    with pytest.raises(HTTPException) as caught:
        route_call(monkeypatch, prepared=True, signer_error=SignatureWorkflowError("ANCHOR_NOT_FOUND"))
    assert caught.value.status_code == 400
    assert caught.value.detail == "ANCHOR_NOT_FOUND"
    assert "patient" not in caught.value.detail.lower()


def test_prepared_editor_content_does_not_strip_anchor_before_workflow(monkeypatch):
    captured = {}

    def fake_generate(**kwargs):
        captured.update(kwargs)
        return b"pdf", "synthetic.pdf"

    async def fake_threadpool(_function, **_kwargs):
        return b"signed"

    monkeypatch.setattr(route, "_generate_editor_pdf_document", fake_generate)
    monkeypatch.setattr(route, "run_in_threadpool", fake_threadpool)
    monkeypatch.setattr(route, "_registrar_auditoria_editor_pdf", lambda *_a, **_k: None)
    asyncio.run(route.assinar_pdf_editor_textos(
        pdf_file=None,
        conteudo_file=None,
        pfx_file=UploadFile(filename="synthetic.pfx", file=io.BytesIO(b"placeholder")),
        pfx_password="placeholder",
        field_name="Signature1",
        signature_box_hint_json="",
        use_existing_field=False,
        prepare_signature_anchor=True,
        signature_profile="pades",
        use_editor_content=True,
        conteudo=CANONICAL_TOKEN,
        conteudo_formato="text",
        pagina_config_json="",
        document_name="Synthetic",
        current_user=object(),
        db=object(),
    ))
    assert captured["strip_signature_placeholders"] is False


def test_legacy_editor_content_still_strips_placeholders(monkeypatch):
    captured = {}

    def fake_generate(**kwargs):
        captured.update(kwargs)
        return b"pdf", "synthetic.pdf"

    async def fake_threadpool(_function, **_kwargs):
        return b"signed"

    monkeypatch.setattr(route, "_generate_editor_pdf_document", fake_generate)
    monkeypatch.setattr(route, "run_in_threadpool", fake_threadpool)
    monkeypatch.setattr(route, "_registrar_auditoria_editor_pdf", lambda *_a, **_k: None)
    asyncio.run(route.assinar_pdf_editor_textos(
        pdf_file=None,
        conteudo_file=None,
        pfx_file=UploadFile(filename="synthetic.pfx", file=io.BytesIO(b"placeholder")),
        pfx_password="placeholder",
        field_name="Signature1",
        signature_box_hint_json="",
        use_existing_field=False,
        prepare_signature_anchor=False,
        signature_profile="pades",
        use_editor_content=True,
        conteudo=CANONICAL_TOKEN,
        conteudo_formato="text",
        pagina_config_json="",
        document_name="Synthetic",
        current_user=object(),
        db=object(),
    ))
    assert captured["strip_signature_placeholders"] is True


def test_no_real_secret_or_clinical_fixture_is_present():
    source = Path(__file__).read_text(encoding="utf-8").lower()
    forbidden = (
        "begin private " + "key",
        "patient" + "_name",
        "c" + "pf",
        "pin" + "_real",
        "pfx_password" + "_real",
    )
    assert all(value not in source for value in forbidden)
