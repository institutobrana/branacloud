from __future__ import annotations

import json
from pathlib import Path


CATALOG_EXTENSIONS = frozenset({".bmp", ".doc", ".dot", ".dotm", ".mod", ".rec", ".rtf", ".tmp", ".txt"})
TEXT_CATALOG_EXTENSIONS = frozenset({".mod", ".rtf", ".txt"})
SNIFFABLE_CATALOG_EXTENSIONS = frozenset({".rec", ".tmp"})
OFFICE_BINARY_EXTENSIONS = frozenset({".bmp", ".doc", ".dot", ".dotm"})
MAX_SNIFF_BYTES = 5 * 1024 * 1024
MAX_PREVIEW_CHARS = 12_000

_BINARY_SIGNATURES = (
    b"BM",  # BMP
    b"\xd0\xcf\x11\xe0\xa1\xb1\x1a\xe1",  # OLE compound document
    b"PK\x03\x04",  # ZIP / OOXML container
    b"\x7fELF",
    b"MZ",
)
_HTML_SIGNATURE = "<!doctype html", "<html", "<body", "<p", "<div", "<table", "<span", "<br"
_ALLOWED_CONTROLS = {"\t", "\n", "\r", "\f"}


def path_is_inside(path: Path, root: Path) -> bool:
    try:
        path.resolve(strict=False).relative_to(root.resolve(strict=False))
        return True
    except (OSError, ValueError):
        return False


def registered_catalog_path(path: Path | None, *, root: Path, filename: str, extension: str) -> Path | None:
    """Accept only the file registered for this model and physically contained in its tenant root."""
    if path is None or not path_is_inside(path, root):
        return None
    resolved = path.resolve(strict=False)
    if resolved.name.casefold() != str(filename or "").casefold():
        return None
    if resolved.suffix.casefold() != str(extension or "").casefold():
        return None
    return resolved


def classify_catalog_bytes(data: bytes, extension: str, declared_format: str = "") -> dict:
    ext = str(extension or "").strip().lower()
    declared = str(declared_format or "").strip().lower()
    if ext in OFFICE_BINARY_EXTENSIONS:
        return {"kind": "diagnostic", "detected_format": ext.lstrip("."), "reason": "Formato Office/imagem sem conversor seguro nesta fase.", "preview": ""}
    if not data:
        return {"kind": "diagnostic", "detected_format": "empty", "reason": "O arquivo está vazio ou não contém conteúdo legível.", "preview": ""}
    if any(data.startswith(signature) for signature in _BINARY_SIGNATURES) or b"\x00" in data[:8192]:
        return {"kind": "diagnostic", "detected_format": "binary", "reason": "Assinatura ou bytes de controle indicam conteúdo binário; nenhuma decodificação foi tentada.", "preview": ""}

    text = _decode_safe_text(data)
    if text is None:
        return {"kind": "diagnostic", "detected_format": "unknown", "reason": "O conteúdo não pôde ser classificado como texto com segurança.", "preview": ""}

    if declared == "oasis_json":
        try:
            value = json.loads(text)
        except (TypeError, ValueError):
            return {"kind": "diagnostic", "detected_format": "unknown", "reason": "Metadados Oasis declarados, mas o conteúdo não é JSON válido.", "preview": text[:MAX_PREVIEW_CHARS]}
        if isinstance(value, dict) and value.get("format") == "oasis":
            return {"kind": "oasis_json", "detected_format": "oasis_json", "reason": "Envelope Oasis reconhecido.", "preview": "", "content": text}
        return {"kind": "diagnostic", "detected_format": "unknown", "reason": "Metadados Oasis declarados, mas o envelope não possui assinatura Oasis reconhecida.", "preview": text[:MAX_PREVIEW_CHARS]}

    if text.lstrip().lower().startswith("{\\rtf"):
        return {"kind": "rtf", "detected_format": "rtf", "reason": "Assinatura RTF reconhecida no conteúdo.", "preview": text[:MAX_PREVIEW_CHARS], "content": text}
    normalized = text.lstrip().lower()
    if any(normalized.startswith(signature) for signature in _HTML_SIGNATURE):
        return {"kind": "html", "detected_format": "html", "reason": "Assinatura textual HTML reconhecida; a conversão existente usa parser inerte.", "preview": text[:MAX_PREVIEW_CHARS], "content": text}
    if ext in SNIFFABLE_CATALOG_EXTENSIONS or ext in TEXT_CATALOG_EXTENSIONS:
        return {"kind": "text", "detected_format": "text", "reason": "Conteúdo textual legível reconhecido.", "preview": text[:MAX_PREVIEW_CHARS], "content": text}
    return {"kind": "diagnostic", "detected_format": ext.lstrip(".") or "unknown", "reason": "Não existe conversor seguro para este formato.", "preview": text[:MAX_PREVIEW_CHARS], "content": text}


def _decode_safe_text(data: bytes) -> str | None:
    text = None
    for encoding in ("utf-8-sig", "utf-8", "cp1252"):
        try:
            text = data.decode(encoding, errors="strict")
            break
        except UnicodeDecodeError:
            continue
    if text is None or "\x00" in text:
        return None
    controls = sum(1 for char in text if ord(char) < 32 and char not in _ALLOWED_CONTROLS)
    if controls / max(1, len(text)) > 0.01:
        return None
    return text
