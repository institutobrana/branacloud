import argparse
import base64
import json
import mimetypes
import re
from pathlib import Path
from typing import Dict, List
from urllib.parse import unquote, urlparse


INVALID_CHARS_RE = re.compile(r'[<>:"\\|?*\x00-\x1F]')
SAFE_FALLBACK_NAME = "arquivo"


def sanitize_segment(value: str) -> str:
    cleaned = INVALID_CHARS_RE.sub("_", value.strip())
    cleaned = cleaned.rstrip(" .")
    return cleaned or "_"


def guess_extension(content_type: str) -> str:
    if not content_type:
        return ""
    normalized = content_type.split(";", 1)[0].strip().lower()
    if normalized == "application/javascript":
        return ".js"
    if normalized == "text/javascript":
        return ".js"
    if normalized == "text/css":
        return ".css"
    if normalized == "text/html":
        return ".html"
    if normalized == "application/json":
        return ".json"
    return mimetypes.guess_extension(normalized) or ""


def build_candidate_path(destination_root: Path, url: str, content_type: str) -> Path:
    parsed = urlparse(url)
    domain = sanitize_segment(parsed.netloc or "sem_dominio")
    raw_segments = [unquote(segment) for segment in parsed.path.split("/") if segment]
    segments = [sanitize_segment(segment) for segment in raw_segments]

    if parsed.path.endswith("/"):
        relative_parts = [domain, *segments, "index.html"]
    elif not segments:
        filename = SAFE_FALLBACK_NAME + (guess_extension(content_type) or ".bin")
        relative_parts = [domain, filename]
    else:
        filename = segments[-1]
        if "." not in filename:
            filename = filename + (guess_extension(content_type) or ".bin")
        relative_parts = [domain, *segments[:-1], filename]

    return destination_root.joinpath(*relative_parts)


def ensure_unique_path(target_path: Path, content: bytes) -> Path:
    if not target_path.exists():
        return target_path

    if target_path.read_bytes() == content:
        return target_path

    stem = target_path.stem
    suffix = target_path.suffix
    parent = target_path.parent
    counter = 1
    while True:
        candidate = parent / f"{stem}__dup{counter}{suffix}"
        if not candidate.exists():
            return candidate
        if candidate.read_bytes() == content:
            return candidate
        counter += 1


def decode_content(content_block: Dict) -> bytes:
    text = content_block.get("text")
    if text is None:
        raise ValueError("conteudo_ausente")

    encoding = (content_block.get("encoding") or "").lower()
    if encoding == "base64":
        return base64.b64decode(text)
    return text.encode("utf-8", errors="replace")


def extract_har(har_path: Path, destination_root: Path) -> Dict:
    with har_path.open("r", encoding="utf-8", errors="replace") as handle:
        har_data = json.load(handle)

    entries = har_data.get("log", {}).get("entries", [])
    extracted_files: List[Dict] = []
    ignored_files: List[Dict] = []
    domains = set()

    for index, entry in enumerate(entries):
        request = entry.get("request", {}) or {}
        response = entry.get("response", {}) or {}
        content = response.get("content", {}) or {}
        url = request.get("url", "")
        parsed = urlparse(url)
        domain = sanitize_segment(parsed.netloc or "sem_dominio")
        domains.add(domain)

        try:
            payload = decode_content(content)
        except Exception as exc:
            ignored_files.append(
                {
                    "index": index,
                    "url_original": url,
                    "caminho_local": None,
                    "content_type": content.get("mimeType"),
                    "status": response.get("status"),
                    "tamanho": content.get("size", 0),
                    "origem": "har",
                    "motivo": str(exc),
                }
            )
            continue

        target_path = build_candidate_path(destination_root, url, content.get("mimeType", ""))
        target_path.parent.mkdir(parents=True, exist_ok=True)
        final_path = ensure_unique_path(target_path, payload)

        if not final_path.exists():
            final_path.write_bytes(payload)

        extracted_files.append(
            {
                "index": index,
                "url_original": url,
                "caminho_local": str(final_path),
                "content_type": content.get("mimeType"),
                "status": response.get("status"),
                "tamanho": len(payload),
                "origem": "har",
            }
        )

    return {
        "har_path": str(har_path),
        "destino_top": str(destination_root),
        "total_entradas_har": len(entries),
        "total_arquivos_extraidos_har": len(extracted_files),
        "total_arquivos_ignorados_har": len(ignored_files),
        "dominios_encontrados": sorted(domains),
        "arquivos_extraidos_har": extracted_files,
        "arquivos_ignorados_har": ignored_files,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Extrai entradas de um HAR para uma estrutura estilo Sources/top.")
    parser.add_argument("har_path", help="Caminho para o arquivo .har")
    parser.add_argument("destination_root", help="Pasta destino top")
    parser.add_argument(
        "--manifest",
        help="Caminho opcional do manifesto JSON da extracao",
    )
    args = parser.parse_args()

    har_path = Path(args.har_path).resolve()
    destination_root = Path(args.destination_root).resolve()
    destination_root.mkdir(parents=True, exist_ok=True)

    manifest_path = (
        Path(args.manifest).resolve()
        if args.manifest
        else destination_root.parent / "manifesto_extracao.json"
    )
    manifest_path.parent.mkdir(parents=True, exist_ok=True)

    extraction_summary = extract_har(har_path, destination_root)
    manifest_path.write_text(
        json.dumps(extraction_summary, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    print(json.dumps(
        {
            "manifesto": str(manifest_path),
            "total_entradas_har": extraction_summary["total_entradas_har"],
            "total_arquivos_extraidos_har": extraction_summary["total_arquivos_extraidos_har"],
            "total_arquivos_ignorados_har": extraction_summary["total_arquivos_ignorados_har"],
        },
        ensure_ascii=False,
        indent=2,
    ))


if __name__ == "__main__":
    main()
