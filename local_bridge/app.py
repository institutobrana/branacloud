import json
from datetime import datetime, timezone

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from starlette.concurrency import run_in_threadpool

from cert_store import WindowsCertificateStoreError, list_windows_user_certificates
from pdf_signing import (
    WindowsPdfSigningError,
    build_signed_filename,
    sign_pdf_windows_store_invisible,
)


BRIDGE_NAME = "brana-local-bridge"
BRIDGE_VERSION = "0.3.0"

app = FastAPI(
    title="Brana Local Bridge",
    version=BRIDGE_VERSION,
    docs_url="/docs",
    redoc_url=None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:8000",
        "http://localhost:8000",
        "http://127.0.0.1:5173",
        "http://localhost:5173",
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {
        "ok": True,
        "service": BRIDGE_NAME,
        "version": BRIDGE_VERSION,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "features": {
            "list_certificates": True,
            "sign_pdf_windows_store": True,
            "pades_profile": True,
        },
    }


@app.get("/certificados")
def listar_certificados():
    try:
        certificados = list_windows_user_certificates()
    except WindowsCertificateStoreError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    return {
        "ok": True,
        "service": BRIDGE_NAME,
        "count": len(certificados),
        "items": certificados,
    }


@app.post("/assinar-pdf")
async def assinar_pdf_windows_store(
    pdf_file: UploadFile = File(...),
    thumbprint: str = Form(...),
    field_name: str = Form(default="Signature1"),
    document_name: str = Form(default=""),
    signature_box_hint_json: str = Form(default=""),
    use_existing_field: bool = Form(default=False),
    signature_profile: str = Form(default="pades"),
):
    pdf_name = str(getattr(pdf_file, "filename", "") or "").strip()
    if not pdf_name.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Selecione um arquivo PDF válido.")

    try:
        pdf_bytes = await pdf_file.read()
    except Exception as exc:
        raise HTTPException(status_code=400, detail="Falha ao ler o PDF para assinatura.") from exc

    signature_box_hint = None
    raw_hint = str(signature_box_hint_json or "").strip()
    if raw_hint:
        try:
            signature_box_hint = json.loads(raw_hint)
        except Exception as exc:
            raise HTTPException(status_code=400, detail="Posicionamento da assinatura invalido.") from exc

    try:
        signed_pdf = await run_in_threadpool(
            sign_pdf_windows_store_invisible,
            pdf_bytes=pdf_bytes,
            thumbprint=str(thumbprint or ""),
            field_name=str(field_name or "Signature1"),
            signature_box_hint=signature_box_hint,
            use_existing_field=bool(use_existing_field),
            signature_profile=str(signature_profile or "pades"),
        )
    except (WindowsCertificateStoreError, WindowsPdfSigningError) as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    filename = build_signed_filename(document_name or pdf_name)
    return Response(
        content=signed_pdf,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "X-Signed-Filename": filename,
            "X-Signed-By-Thumbprint": str(thumbprint or "").strip().upper(),
        },
    )
