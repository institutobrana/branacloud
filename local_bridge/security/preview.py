"""PDF preview rendered entirely from bytes in memory."""
from __future__ import annotations

import hashlib
import io
from dataclasses import dataclass

import fitz


class PreviewError(ValueError):
    def __init__(self, code: str):
        self.code = code
        super().__init__(code)


@dataclass(frozen=True)
class RenderedPreview:
    sha256: str
    pages: tuple[bytes, ...]
    page_count: int
    field_name: str
    page_index: int
    rect: tuple[float, float, float, float]


def render_pdf_preview(pdf_bytes: bytes, *, field_name: str, page_index: int, rect: tuple[float, float, float, float], dpi: int = 96) -> RenderedPreview:
    if not pdf_bytes or not isinstance(pdf_bytes, bytes):
        raise PreviewError("PDF_INVALID")
    if page_index < 0 or len(rect) != 4:
        raise PreviewError("PREVIEW_GEOMETRY_INVALID")
    try:
        document = fitz.open(stream=pdf_bytes, filetype="pdf")
        if document.page_count == 0 or page_index >= document.page_count:
            raise PreviewError("PREVIEW_PAGE_INVALID")
        pages = []
        matrix = fitz.Matrix(dpi / 72, dpi / 72)
        for page in document:
            pages.append(page.get_pixmap(matrix=matrix, alpha=False).tobytes("png"))
        return RenderedPreview(hashlib.sha256(pdf_bytes).hexdigest(), tuple(pages), document.page_count, field_name, page_index, tuple(float(x) for x in rect))
    except PreviewError:
        raise
    except Exception as exc:
        raise PreviewError("PDF_INVALID") from exc
    finally:
        try:
            document.close()
        except UnboundLocalError:
            pass
