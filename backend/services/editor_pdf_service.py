import base64
import io
import os
import re
import subprocess
import tempfile
from copy import deepcopy
from html import unescape as html_unescape
from html.parser import HTMLParser
from pathlib import Path

from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import landscape
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas
from reportlab.platypus import Image as RLImage
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer


IMG_TOKEN_PATTERN = re.compile(r"\[\[IMGDATA:([^\]]+)\]\]", re.IGNORECASE)
BLOCK_PATTERN = re.compile(r"(?is)<(p|div)([^>]*)>(.*?)</\1\s*>")
STYLE_ATTR_PATTERN = re.compile(r'([a-zA-Z\-]+)\s*=\s*(".*?"|\'.*?\'|[^\s>]+)', re.S)
CSS_DECL_PATTERN = re.compile(r"\s*([a-zA-Z\-]+)\s*:\s*([^;]+)")
SIGNATURE_TOKEN_PATTERN = re.compile(
    r"<<\s*Cirurgi(?:Ã£|ã|a)o(?:\s*|\.)?AssinaturaDigital\s*>>",
    re.IGNORECASE,
)


class EditorPdfRenderError(Exception):
    """Erro controlado de renderizacao de PDF do editor."""

_HEADLESS_BROWSER_CANDIDATES = (
    Path(r"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"),
    Path(r"C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"),
    Path(r"C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe"),
    Path(r"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"),
)


def _normalizar_pagina_cfg(cfg: dict | None) -> dict:
    raw = cfg if isinstance(cfg, dict) else {}
    orientacao = "Paisagem" if str(raw.get("orientacao") or "").strip().lower() == "paisagem" else "Retrato"
    altura_mm = float(raw.get("altura_mm") or 279.4)
    largura_mm = float(raw.get("largura_mm") or 215.9)
    margem_superior_mm = float(raw.get("margem_superior_mm") or 25.4)
    margem_esquerda_mm = float(raw.get("margem_esquerda_mm") or 33.16)
    margem_direita_mm = float(raw.get("margem_direita_mm") or 33.16)
    return {
        "orientacao": orientacao,
        "altura_mm": max(50.0, altura_mm),
        "largura_mm": max(50.0, largura_mm),
        "margem_superior_mm": max(0.0, margem_superior_mm),
        "margem_esquerda_mm": max(0.0, margem_esquerda_mm),
        "margem_direita_mm": max(0.0, margem_direita_mm),
    }


def _page_size_from_cfg(cfg: dict) -> tuple[float, float]:
    width = float(cfg["largura_mm"]) * mm
    height = float(cfg["altura_mm"]) * mm
    if cfg["orientacao"] == "Paisagem":
        return landscape((width, height))
    return (width, height)


def _extract_data_url_image_bytes(token_value: str) -> tuple[bytes, str, int | None, int | None] | None:
    raw = str(token_value or "").strip()
    if not raw:
        return None
    parts = raw.split("|")
    data_url = parts[0] if parts else raw
    if not data_url.startswith("data:image/") or ";base64," not in data_url:
        return None
    mime, b64 = data_url.split(";base64,", 1)
    ext = mime.split("/", 1)[-1].strip().lower() or "png"
    width_px = None
    height_px = None
    for part in parts[1:]:
        item = str(part or "").strip()
        if re.fullmatch(r"w=\d+", item, re.IGNORECASE):
            width_px = max(1, int(item.split("=", 1)[1]))
        if re.fullmatch(r"h=\d+", item, re.IGNORECASE):
            height_px = max(1, int(item.split("=", 1)[1]))
    try:
        return base64.b64decode(b64), ext, width_px, height_px
    except Exception:
        return None


def _style_attr_map(attrs_raw: str) -> dict[str, str]:
    attrs: dict[str, str] = {}
    for name, value in STYLE_ATTR_PATTERN.findall(str(attrs_raw or "")):
        clean = str(value or "").strip().strip('"').strip("'")
        attrs[name.strip().lower()] = clean
    return attrs


def _css_map(style_value: str) -> dict[str, str]:
    css: dict[str, str] = {}
    for key, value in CSS_DECL_PATTERN.findall(str(style_value or "")):
        css[key.strip().lower()] = str(value or "").strip()
    return css


def _alignment_from_attrs(attrs_raw: str) -> int:
    css = _css_map(_style_attr_map(attrs_raw).get("style", ""))
    align = str(css.get("text-align") or "").strip().lower()
    if align == "center":
        return TA_CENTER
    if align == "right":
        return TA_RIGHT
    if align == "justify":
        return TA_JUSTIFY
    return TA_LEFT


def _font_name_from_hint(value: str) -> str | None:
    raw = str(value or "").strip().strip('"').strip("'")
    if not raw:
        return None
    head = raw.split(",", 1)[0].strip().lower()
    if "courier" in head:
        return "Courier"
    if "times" in head:
        return "Times-Roman"
    return "Helvetica"


def _font_size_from_css(value: str) -> float | None:
    raw = str(value or "").strip().lower()
    if not raw:
        return None
    match = re.search(r"(\d+(?:\.\d+)?)\s*(px|pt)?", raw)
    if not match:
        return None
    amount = float(match.group(1))
    unit = (match.group(2) or "px").lower()
    if unit == "px":
        amount *= 0.75
    return max(6.0, min(36.0, amount))


def _escape_reportlab_text(value: str) -> str:
    text = str(value or "")
    if not text:
        return ""
    text = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    text = text.replace("\xa0", "&nbsp;")
    text = text.replace("\t", "&nbsp;&nbsp;&nbsp;&nbsp;")
    return re.sub(r" {2,}", lambda m: " " + "&nbsp;" * (len(m.group(0)) - 1), text)


class _InlineMarkupParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=False)
        self.parts: list[str] = []
        self.stack: list[list[str]] = []

    def handle_starttag(self, tag, attrs):
        self._start(tag, dict(attrs or []), self_closing=False)

    def handle_startendtag(self, tag, attrs):
        self._start(tag, dict(attrs or []), self_closing=True)

    def _start(self, tag: str, attrs: dict, *, self_closing: bool):
        tag_name = str(tag or "").strip().lower()
        if tag_name == "br":
            self.parts.append("<br/>")
            return

        closers: list[str] = []
        if tag_name in {"strong", "b"}:
            self.parts.append("<b>")
            closers.insert(0, "</b>")
        elif tag_name in {"em", "i"}:
            self.parts.append("<i>")
            closers.insert(0, "</i>")
        elif tag_name == "u":
            self.parts.append("<u>")
            closers.insert(0, "</u>")
        elif tag_name in {"span", "font"}:
            css = _css_map(str(attrs.get("style") or ""))
            font_name = _font_name_from_hint(css.get("font-family") or attrs.get("face") or "")
            font_size = _font_size_from_css(css.get("font-size") or attrs.get("size") or "")
            color = str(css.get("color") or attrs.get("color") or "").strip()
            font_attrs = []
            if font_name:
                font_attrs.append(f'name="{font_name}"')
            if font_size:
                font_attrs.append(f'size="{font_size:.1f}"')
            if color and re.fullmatch(r"#?[0-9a-fA-F]{3,8}", color):
                if not color.startswith("#"):
                    color = f"#{color}"
                font_attrs.append(f'color="{color}"')
            if font_attrs:
                self.parts.append(f"<font {' '.join(font_attrs)}>")
                closers.insert(0, "</font>")
            font_weight = str(css.get("font-weight") or "").strip().lower()
            if font_weight in {"bold", "600", "700", "800", "900"}:
                self.parts.append("<b>")
                closers.insert(0, "</b>")
            font_style = str(css.get("font-style") or "").strip().lower()
            if font_style == "italic":
                self.parts.append("<i>")
                closers.insert(0, "</i>")
            text_decoration = str(css.get("text-decoration") or "").strip().lower()
            if "underline" in text_decoration:
                self.parts.append("<u>")
                closers.insert(0, "</u>")

        if not self_closing:
            self.stack.append(closers)
        else:
            for closing in closers:
                self.parts.append(closing)

    def handle_endtag(self, tag):
        if not self.stack:
            return
        closers = self.stack.pop()
        for closing in closers:
            self.parts.append(closing)

    def handle_data(self, data):
        self.parts.append(_escape_reportlab_text(data))

    def handle_entityref(self, name):
        self.parts.append(html_unescape(f"&{name};").replace("\xa0", "&nbsp;"))

    def handle_charref(self, name):
        prefix = "&#x" if str(name).lower().startswith("x") else "&#"
        suffix = ";"
        self.parts.append(html_unescape(f"{prefix}{name}{suffix}").replace("\xa0", "&nbsp;"))

    def get_markup(self) -> str:
        while self.stack:
            closers = self.stack.pop()
            for closing in closers:
                self.parts.append(closing)
        return "".join(self.parts).strip()


def _html_inline_to_reportlab_markup(value: str) -> str:
    parser = _InlineMarkupParser()
    parser.feed(str(value or ""))
    parser.close()
    return parser.get_markup()


def _style_for_alignment(base_style: ParagraphStyle, alignment: int, font_size: float | None = None) -> ParagraphStyle:
    clone = deepcopy(base_style)
    clone.name = f"{base_style.name}_{alignment}_{font_size or base_style.fontSize}"
    clone.alignment = alignment
    if font_size:
        clone.fontSize = font_size
        clone.leading = max(font_size + 2.0, font_size * 1.18)
    return clone


def _append_image_story(story: list, token_value: str, available_width: float, alignment: int) -> bool:
    img_data = _extract_data_url_image_bytes(token_value)
    if not img_data:
        return False
    img_bytes, _ext, width_px, height_px = img_data
    try:
        img = RLImage(io.BytesIO(img_bytes))
        if width_px and height_px:
            img.drawWidth = float(width_px) * 0.75
            img.drawHeight = float(height_px) * 0.75
        if float(img.drawWidth or 0) > available_width:
            ratio = available_width / float(img.drawWidth)
            img.drawWidth = float(img.drawWidth) * ratio
            img.drawHeight = float(img.drawHeight) * ratio
        img.hAlign = {
            TA_RIGHT: "RIGHT",
            TA_CENTER: "CENTER",
        }.get(alignment, "LEFT")
        story.append(img)
        story.append(Spacer(1, 3))
        return True
    except Exception:
        return False


def _push_reportlab_paragraph(story: list, html_markup: str, style: ParagraphStyle) -> None:
    text = str(html_markup or "").strip()
    if not text:
        return
    story.append(Paragraph(text, style))
    story.append(Spacer(1, 2))


def _push_html_story(story: list, raw_html: str, base_style: ParagraphStyle, available_width: float) -> None:
    html = str(raw_html or "")
    if not html:
        return

    blocks = list(BLOCK_PATTERN.finditer(html))
    if not blocks:
        markup = _html_inline_to_reportlab_markup(html)
        if markup:
            _push_reportlab_paragraph(story, markup, base_style)
        return

    for match in blocks:
        tag_name = str(match.group(1) or "p").strip().lower()
        attrs_raw = str(match.group(2) or "")
        inner_html = str(match.group(3) or "")
        alignment = _alignment_from_attrs(attrs_raw)
        attrs = _style_attr_map(attrs_raw)
        css = _css_map(attrs.get("style", ""))
        font_size = _font_size_from_css(css.get("font-size") or "")
        paragraph_style = _style_for_alignment(base_style, alignment, font_size)

        if not inner_html.strip():
            story.append(Spacer(1, max(4.0, paragraph_style.leading * 0.65)))
            continue

        pos = 0
        emitted = False
        for img_match in IMG_TOKEN_PATTERN.finditer(inner_html):
            before = inner_html[pos:img_match.start()]
            markup_before = _html_inline_to_reportlab_markup(before)
            if markup_before:
                _push_reportlab_paragraph(story, markup_before, paragraph_style)
                emitted = True
            if _append_image_story(story, img_match.group(1), available_width, alignment):
                emitted = True
            pos = img_match.end()
        after = inner_html[pos:]
        markup_after = _html_inline_to_reportlab_markup(after)
        if markup_after:
            _push_reportlab_paragraph(story, markup_after, paragraph_style)
            emitted = True

        if not emitted and tag_name == "p":
            story.append(Spacer(1, max(4.0, paragraph_style.leading * 0.65)))


def _push_text_story(story: list, text: str, style: ParagraphStyle) -> None:
    txt = str(text or "").strip()
    if not txt:
        return
    blocks = [block.strip() for block in re.split(r"\n\s*\n", txt) if block.strip()]
    for block in blocks:
        html_block = "<br/>".join(_escape_reportlab_text(line) for line in block.splitlines())
        story.append(Paragraph(html_block, style))
        story.append(Spacer(1, 3))


def strip_signature_tokens(value: str) -> tuple[str, bool]:
    raw = str(value or "")
    found = bool(SIGNATURE_TOKEN_PATTERN.search(raw))
    cleaned = SIGNATURE_TOKEN_PATTERN.sub("", raw)
    return cleaned, found


def _extract_snapshot_image_bytes(data_url: str) -> bytes:
    raw = str(data_url or "").strip()
    if not raw or not raw.startswith("data:image/") or ";base64," not in raw:
        raise EditorPdfRenderError("Snapshot da pagina do editor invalido.")
    try:
        _, b64 = raw.split(";base64,", 1)
        image_bytes = base64.b64decode(b64)
    except Exception as exc:
        raise EditorPdfRenderError("Falha ao decodificar o snapshot da pagina do editor.") from exc
    if not image_bytes:
        raise EditorPdfRenderError("Snapshot da pagina do editor vazio.")
    return image_bytes


def _resolve_headless_browser_path() -> Path | None:
    for candidate in _HEADLESS_BROWSER_CANDIDATES:
        if candidate.exists():
            return candidate
    return None


def generate_editor_pdf_from_snapshot_html(
    *,
    page_snapshot_html: str,
    pagina_config: dict | None = None,
    titulo: str | None = None,
) -> bytes:
    html = str(page_snapshot_html or "").strip()
    if not html:
        raise EditorPdfRenderError("HTML da pagina do editor invalido.")
    browser_path = _resolve_headless_browser_path()
    if not browser_path:
        raise EditorPdfRenderError("Navegador headless nao encontrado para gerar o PDF do editor.")
    work_root = Path(__file__).resolve().parents[1] / "tmp" / "pdf_render"
    work_root.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(dir=work_root) as temp_dir:
        temp_path = Path(temp_dir)
        html_path = temp_path / "editor_snapshot.html"
        pdf_path = temp_path / "editor_snapshot.pdf"
        html_path.write_text(html, encoding="utf-8")
        cmd = [
            str(browser_path),
            "--headless=new",
            "--disable-gpu",
            "--run-all-compositor-stages-before-draw",
            "--disable-features=PaintHolding",
            "--allow-file-access-from-files",
            "--print-to-pdf-no-header",
            f"--print-to-pdf={pdf_path}",
            html_path.resolve().as_uri(),
        ]
        try:
            result = subprocess.run(
                cmd,
                check=False,
                capture_output=True,
                text=True,
                timeout=45,
                env=os.environ.copy(),
            )
        except subprocess.TimeoutExpired as exc:
            raise EditorPdfRenderError("Tempo excedido ao gerar PDF fiel da pagina do editor.") from exc
        if result.returncode != 0:
            stderr = (result.stderr or result.stdout or "").strip()
            raise EditorPdfRenderError(
                f"Falha ao gerar PDF fiel da pagina do editor: {stderr or 'browser headless retornou erro.'}"
            )
        if not pdf_path.exists():
            raise EditorPdfRenderError("Nao foi possivel criar o PDF fiel da pagina do editor.")
        pdf_bytes = pdf_path.read_bytes()
        if not pdf_bytes:
            raise EditorPdfRenderError("PDF fiel da pagina do editor foi gerado vazio.")
        return pdf_bytes


def generate_editor_pdf_from_snapshot_bytes(
    *,
    page_snapshot_data_url: str,
    pagina_config: dict | None = None,
    titulo: str | None = None,
) -> bytes:
    cfg = _normalizar_pagina_cfg(pagina_config)
    page_width, page_height = _page_size_from_cfg(cfg)
    image_bytes = _extract_snapshot_image_bytes(page_snapshot_data_url)
    buffer = io.BytesIO()
    try:
        pdf = canvas.Canvas(buffer, pagesize=(page_width, page_height))
        pdf.setTitle(str(titulo or "Documento"))
        pdf.drawImage(
            ImageReader(io.BytesIO(image_bytes)),
            0,
            0,
            width=page_width,
            height=page_height,
            preserveAspectRatio=False,
            mask="auto",
        )
        pdf.showPage()
        pdf.save()
    except Exception as exc:
        raise EditorPdfRenderError(f"Falha ao gerar PDF do snapshot do editor: {exc}") from exc
    pdf_bytes = buffer.getvalue()
    if not pdf_bytes:
        raise EditorPdfRenderError("Falha ao gerar PDF do snapshot do editor.")
    return pdf_bytes


def generate_editor_pdf_bytes(
    *,
    conteudo: str,
    conteudo_formato: str,
    pagina_config: dict | None = None,
    titulo: str | None = None,
    page_snapshot_data_url: str | None = None,
    page_snapshot_html: str | None = None,
) -> bytes:
    if str(page_snapshot_html or "").strip():
        return generate_editor_pdf_from_snapshot_html(
            page_snapshot_html=str(page_snapshot_html or ""),
            pagina_config=pagina_config,
            titulo=titulo,
        )
    if str(page_snapshot_data_url or "").strip():
        return generate_editor_pdf_from_snapshot_bytes(
            page_snapshot_data_url=str(page_snapshot_data_url or ""),
            pagina_config=pagina_config,
            titulo=titulo,
        )
    cfg = _normalizar_pagina_cfg(pagina_config)
    page_size = _page_size_from_cfg(cfg)

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=page_size,
        leftMargin=float(cfg["margem_esquerda_mm"]) * mm,
        rightMargin=float(cfg["margem_direita_mm"]) * mm,
        topMargin=float(cfg["margem_superior_mm"]) * mm,
        bottomMargin=float(cfg["margem_superior_mm"]) * mm,
        title=str(titulo or "Documento"),
    )
    styles = getSampleStyleSheet()
    body_style = ParagraphStyle(
        "BranaEditorBody",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=11,
        leading=13,
        spaceAfter=0,
        spaceBefore=0,
        alignment=TA_LEFT,
    )

    story: list = []
    raw = str(conteudo or "")
    formato = str(conteudo_formato or "text").strip().lower()
    available_width = max(120.0, float(doc.width))

    if formato != "html":
        _push_text_story(story, raw, body_style)
    else:
        _push_html_story(story, raw, body_style, available_width)

    if not story:
        story.append(Spacer(1, 4))

    try:
        doc.build(story)
    except Exception as exc:
        raise EditorPdfRenderError(f"Falha ao gerar PDF do editor: {exc}") from exc

    pdf_bytes = buffer.getvalue()
    if not pdf_bytes:
        raise EditorPdfRenderError("Falha ao gerar PDF do editor.")
    return pdf_bytes



