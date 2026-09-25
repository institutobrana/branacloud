"""Runtime boundary for the future secure bridge; it never starts a server."""
from __future__ import annotations

from dataclasses import dataclass
from typing import Protocol

from .http_protocol import HttpProtocolService
from .preview import RenderedPreview, render_pdf_preview
from .tls_runtime import TLSRuntimeConfig, validate_runtime_tls


class RuntimeLock(Protocol):
    def acquire(self) -> None: ...
    def release(self) -> None: ...


class SecureBridgeRuntime:
    def __init__(self, *, cert_pem: bytes, key_pem: bytes, service: HttpProtocolService, lock: RuntimeLock, tls_config: TLSRuntimeConfig = TLSRuntimeConfig()):
        self.tls_material = validate_runtime_tls(cert_pem, key_pem, tls_config)
        self.service = service
        self.lock = lock
        self._locked = False

    def create_app(self):
        return self.service.create_app()

    def serve(self, *, certfile: str, keyfile: str, app=None) -> None:
        """Explicit opt-in TLS launcher; importing or creating the runtime never serves."""
        import uvicorn
        target = app or self.create_app()
        self.acquire_instance()
        try:
            uvicorn.run(target, host="127.0.0.1", port=8765, ssl_certfile=certfile, ssl_keyfile=keyfile)
        finally:
            self.release_instance()

    def render_preview(self, pdf_bytes: bytes, *, field_name: str, page_index: int, rect: tuple[float, float, float, float]) -> RenderedPreview:
        return render_pdf_preview(pdf_bytes, field_name=field_name, page_index=page_index, rect=rect)

    def acquire_instance(self) -> None:
        self.lock.acquire()
        self._locked = True

    def release_instance(self) -> None:
        if self._locked:
            self.lock.release()
            self._locked = False

    def close(self) -> None:
        process = getattr(self, "_wpf_process", None)
        if process is not None:
            process.close()
            self._wpf_process = None
        self.release_instance()

    def __enter__(self):
        self.acquire_instance()
        return self

    def __exit__(self, exc_type, exc, tb):
        self.release_instance()
        return False
