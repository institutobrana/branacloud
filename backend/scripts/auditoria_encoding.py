from __future__ import annotations

import argparse
import json
from dataclasses import asdict, dataclass
from datetime import datetime
from pathlib import Path
from typing import Iterable


TEXT_EXTENSIONS = {
    ".py",
    ".js",
    ".html",
    ".css",
    ".json",
    ".yml",
    ".yaml",
    ".md",
    ".txt",
    ".ini",
    ".env",
}

IGNORED_DIR_NAMES = {
    ".git",
    "__pycache__",
    ".pytest_cache",
    "venv_saas",
    "node_modules",
}

# Evita arquivos de apoio/backups que nao entram no runtime.
IGNORED_FILE_PATTERNS = (
    "app_backup",
    "backup_check",
    "from_fullbackup",
)

MOJIBAKE_TOKENS = (
    "Ã",
    "Â",
    "’",
    "“",
    "â€",
    "ï¿½",
    "ç",
    "ã",
    "á",
    "é",
    "ó",
    "ú",
    "ê",
    "ô",
    "í",
    "ú",
    "º",
    "ª",
    "°",
    "Ç",
    "É",
)


@dataclass
class FileIssue:
    path: str
    detail: str


def _is_candidate_file(path: Path) -> bool:
    if not path.is_file():
        return False
    if any(part in IGNORED_DIR_NAMES for part in path.parts):
        return False
    lower_name = path.name.lower()
    if any(token in lower_name for token in IGNORED_FILE_PATTERNS):
        return False
    return path.suffix.lower() in TEXT_EXTENSIONS or path.name in {".env", ".gitignore"}


def _iter_candidate_files(root: Path) -> Iterable[Path]:
    for path in root.rglob("*"):
        if _is_candidate_file(path):
            yield path


def _mojibake_score(text: str) -> int:
    return sum(text.count(token) for token in MOJIBAKE_TOKENS)


def run_audit(root: Path) -> dict:
    non_utf8: list[FileIssue] = []
    mojibake_candidates: list[FileIssue] = []
    missing_html_meta_utf8: list[FileIssue] = []
    scanned_files = 0

    for path in _iter_candidate_files(root):
        scanned_files += 1
        try:
            text = path.read_text(encoding="utf-8")
        except UnicodeDecodeError as exc:
            non_utf8.append(
                FileIssue(
                    path=str(path),
                    detail=f"UnicodeDecodeError at pos={exc.start}: {exc.reason}",
                )
            )
            continue

        score = _mojibake_score(text)
        if score > 0:
            mojibake_candidates.append(
                FileIssue(path=str(path), detail=f"mojibake_score={score}")
            )

        if path.suffix.lower() == ".html":
            snippet = text[:4000].lower()
            if '<meta charset="utf-8"' not in snippet and "<meta charset='utf-8'" not in snippet:
                missing_html_meta_utf8.append(
                    FileIssue(path=str(path), detail="meta charset UTF-8 ausente")
                )

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    reports_dir = root / "backend" / "reports"
    reports_dir.mkdir(parents=True, exist_ok=True)
    report_path = reports_dir / f"encoding_audit_{timestamp}.json"

    payload = {
        "generated_at": datetime.now().isoformat(),
        "root": str(root),
        "scanned_files": scanned_files,
        "non_utf8_count": len(non_utf8),
        "mojibake_candidate_count": len(mojibake_candidates),
        "missing_html_meta_utf8_count": len(missing_html_meta_utf8),
        "non_utf8_files": [asdict(item) for item in non_utf8],
        "mojibake_candidates": [asdict(item) for item in mojibake_candidates],
        "missing_html_meta_utf8": [asdict(item) for item in missing_html_meta_utf8],
    }
    report_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    payload["report_path"] = str(report_path)
    return payload


def main() -> None:
    parser = argparse.ArgumentParser(description="Auditoria de encoding UTF-8 / mojibake.")
    parser.add_argument(
        "--root",
        default=str(Path(__file__).resolve().parents[2]),
        help="Raiz do projeto saas.",
    )
    args = parser.parse_args()

    root = Path(args.root).resolve()
    result = run_audit(root)
    print("[encoding-audit] arquivos analisados:", result["scanned_files"])
    print("[encoding-audit] não UTF-8:", result["non_utf8_count"])
    print("[encoding-audit] candidatos mojibake:", result["mojibake_candidate_count"])
    print("[encoding-audit] html sem meta UTF-8:", result["missing_html_meta_utf8_count"])
    print("[encoding-audit] relatório:", result["report_path"])


if __name__ == "__main__":
    main()

