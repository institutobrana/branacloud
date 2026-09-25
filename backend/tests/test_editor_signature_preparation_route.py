from __future__ import annotations

import asyncio
import hashlib
import inspect
import io
import json
import sys
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import quote_plus

import fitz
import pytest
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from starlette.datastructures import UploadFile as StarletteUploadFile

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "backend"))

import routes.editor_textos_routes as route  # noqa: E402
from security.dependencies import get_current_user  # noqa: E402
from services.editor_signature_anchor_service import (  # noqa: E402
    CANONICAL_TOKEN, DEFAULT_FIELD_NAME, MAX_PDF_BYTES,
)


def synthetic_pdf(text: str = CANONICAL_TOKEN) -> bytes:
    document = fitz.open()
    page = document.new_page(width=595.3, height=841.9)
    page.insert_text((100, 300), text, fontsize=10)
    page.insert_text((48, 760), "Synthetic neighboring content preserved.", fontsize=10)
    output = io.BytesIO()
    document.save(output)
    return output.getvalue()


def build_app(*, module_dependency=None, user_dependency=None, cors=False) -> FastAPI:
    app = FastAPI()
    if cors:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=["http://localhost:5173"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
    app.include_router(route.router)
    app.dependency_overrides[get_current_user] = user_dependency or (lambda: object())
    app.dependency_overrides[route.router.dependencies[0].dependency] = module_dependency or (lambda: True)
    return app


@dataclass(frozen=True)
class AsgiResponse:
    status_code: int
    headers: dict[str, str]
    content: bytes

    def json(self):
        return json.loads(self.content)

    @property
    def text(self):
        return self.content.decode("utf-8", errors="replace")


def asgi_post(app: FastAPI, *, body: bytes, content_type: str, headers=None) -> AsgiResponse:
    sent = []
    request_sent = False

    async def receive():
        nonlocal request_sent
        if request_sent:
            return {"type": "http.disconnect"}
        request_sent = True
        return {"type": "http.request", "body": body, "more_body": False}

    async def send(message):
        sent.append(message)

    raw_headers = [(b"host", b"testserver"), (b"content-type", content_type.encode("latin-1")), (b"content-length", str(len(body)).encode("ascii"))]
    raw_headers.extend((key.lower().encode("latin-1"), value.encode("latin-1")) for key, value in (headers or {}).items())
    scope = {
        "type": "http", "asgi": {"version": "3.0"}, "http_version": "1.1",
        "method": "POST", "scheme": "http",
        "path": "/editor-textos/preparar-pdf-assinatura-local",
        "raw_path": b"/editor-textos/preparar-pdf-assinatura-local",
        "query_string": b"", "headers": raw_headers,
        "client": ("127.0.0.1", 12345), "server": ("testserver", 80),
    }
    asyncio.run(app(scope, receive, send))
    start = next(item for item in sent if item["type"] == "http.response.start")
    content = b"".join(item.get("body", b"") for item in sent if item["type"] == "http.response.body")
    response_headers = {key.decode("latin-1").lower(): value.decode("latin-1") for key, value in start["headers"]}
    return AsgiResponse(start["status"], response_headers, content)


def prepare(app: FastAPI, payload: bytes, *, name="synthetic.pdf", document_name="Synthetic", headers=None):
    boundary = "brana-signature-test-boundary"
    body = (
        f"--{boundary}\r\nContent-Disposition: form-data; name=\"document_name\"\r\n\r\n{document_name}\r\n"
        f"--{boundary}\r\nContent-Disposition: form-data; name=\"pdf_file\"; filename=\"{quote_plus(name)}\"\r\n"
        "Content-Type: application/pdf\r\n\r\n"
    ).encode("utf-8") + payload + f"\r\n--{boundary}--\r\n".encode("ascii")
    return asgi_post(app, body=body, content_type=f"multipart/form-data; boundary={boundary}", headers=headers)


def test_valid_preparation_without_credentials_and_exact_hash(monkeypatch):
    monkeypatch.setattr(route, "sign_pdf_a1_invisible", lambda *_a, **_k: pytest.fail("signer invoked"))
    monkeypatch.setattr(route, "prepare_and_invoke_signer", lambda *_a, **_k: pytest.fail("workflow invoked"))
    response = prepare(build_app(), synthetic_pdf())
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/pdf"
    assert hashlib.sha256(response.content).hexdigest() == response.headers["x-prepared-pdf-sha256"]
    document = fitz.open(stream=response.content, filetype="pdf")
    widgets = [widget for page in document for widget in (page.widgets() or [])]
    assert len(widgets) == 1
    assert widgets[0].field_name == DEFAULT_FIELD_NAME
    assert widgets[0].field_value in (None, "")
    assert json.loads(response.headers["x-pdf-field-rect"]) == pytest.approx(list(widgets[0].rect))


def test_response_headers_are_complete_compact_and_sanitized():
    response = prepare(
        build_app(),
        synthetic_pdf(),
        name="fallback.pdf",
        document_name='..\\unsafe/\r\nX-Evil: injected "name"',
    )
    assert response.status_code == 200
    assert response.headers["x-pdf-field-name"] == DEFAULT_FIELD_NAME
    assert response.headers["x-pdf-field-page"] == "0"
    assert " " not in response.headers["x-pdf-field-rect"]
    assert response.headers["x-preparation-contract"] == "brana-signature-prepared-v1"
    assert response.headers["cache-control"] == "no-store"
    assert "\r" not in response.headers["content-disposition"]
    assert "\n" not in response.headers["content-disposition"]
    assert "X-Evil" not in response.headers["content-disposition"]
    assert response.headers["content-disposition"].endswith('-signature-prepared.pdf"')


def test_cors_middleware_preserves_explicit_header_exposure():
    response = prepare(
        build_app(cors=True),
        synthetic_pdf(),
        document_name="Synthetic",
        headers={"Origin": "http://localhost:5173"},
    )
    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == "http://localhost:5173"
    exposed = response.headers["access-control-expose-headers"].lower()
    for name in (
        "content-disposition", "x-prepared-pdf-sha256", "x-pdf-field-name",
        "x-pdf-field-page", "x-pdf-field-rect", "x-preparation-contract",
    ):
        assert name in exposed


def test_missing_upload_preserves_framework_validation():
    response = asgi_post(
        build_app(),
        body=b"",
        content_type="application/x-www-form-urlencoded",
    )
    assert response.status_code == 422


@pytest.mark.parametrize(
    ("payload", "error_code"),
    [
        pytest.param(b"", "PDF_EMPTY", id="route-empty"),
        pytest.param(b"not-a-pdf", "PDF_INVALID_OR_UNSUPPORTED", id="route-invalid-pdf"),
        pytest.param(synthetic_pdf("Synthetic without anchor."), "ANCHOR_COUNT_AMBIGUOUS", id="route-missing-anchor"),
        pytest.param(synthetic_pdf(CANONICAL_TOKEN + " " + CANONICAL_TOKEN), "ANCHOR_COUNT_INVALID", id="route-duplicate-anchor"),
    ],
)
def test_sanitized_processing_errors(payload, error_code):
    response = prepare(build_app(), payload)
    assert response.status_code == 400
    assert response.json() == {"detail": error_code}
    assert "Synthetic neighboring" not in response.text


def test_upload_read_is_bounded_and_excess_is_rejected(monkeypatch):
    limits = []
    original_read = StarletteUploadFile.read

    async def read_spy(self, size=-1):
        limits.append(size)
        return await original_read(self, size)

    monkeypatch.setattr(StarletteUploadFile, "read", read_spy)
    response = prepare(build_app(), b"x" * (MAX_PDF_BYTES + 1))
    assert response.status_code == 400
    assert response.json() == {"detail": "PDF_TOO_LARGE"}
    assert limits == [MAX_PDF_BYTES + 1]


def test_authentication_and_router_authorization_dependencies_are_preserved():
    signature = inspect.signature(route.preparar_pdf_assinatura_local_editor_textos)
    assert signature.parameters["current_user"].default.dependency is get_current_user
    assert len(route.router.dependencies) == 1

    def deny():
        raise HTTPException(status_code=403, detail="forbidden")

    response = prepare(build_app(module_dependency=deny), synthetic_pdf())
    assert response.status_code == 403


def test_endpoint_contract_does_not_accept_credentials_or_geometry():
    parameters = set(inspect.signature(route.preparar_pdf_assinatura_local_editor_textos).parameters)
    assert parameters == {"pdf_file", "document_name", "current_user"}
    assert not parameters.intersection({"pfx_file", "pfx_password", "pin", "thumbprint", "field_name", "page", "rect", "use_existing_field"})


def test_no_real_or_clinical_material_in_fixture_or_errors(caplog):
    response = prepare(build_app(), b"invalid synthetic bytes", document_name="Synthetic")
    assert response.status_code == 400
    combined = response.text + " ".join(record.getMessage() for record in caplog.records)
    forbidden = ("begin private " + "key", "patient" + "_name", "p" + "in", "pfx_password")
    assert all(item not in combined.lower() for item in forbidden)
