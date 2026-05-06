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

# Evita arquivos de apoio/backups que nao sao runtime.
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
    "º",
    "ª",
    "°",
    "Ç",
    "É",
)

CP1252_EXTRA = {
    0x20AC: 0x80,
    0x201A: 0x82,
    0x0192: 0x83,
    0x201E: 0x84,
    0x2026: 0x85,
    0x2020: 0x86,
    0x2021: 0x87,
    0x02C6: 0x88,
    0x2030: 0x89,
    0x0160: 0x8A,
    0x2039: 0x8B,
    0x0152: 0x8C,
    0x017D: 0x8E,
    0x2018: 0x91,
    0x2019: 0x92,
    0x201C: 0x93,
    0x201D: 0x94,
    0x2022: 0x95,
    0x2013: 0x96,
    0x2014: 0x97,
    0x02DC: 0x98,
    0x2122: 0x99,
    0x0161: 0x9A,
    0x203A: 0x9B,
    0x0153: 0x9C,
    0x017E: 0x9E,
    0x0178: 0x9F,
}


@dataclass
class ChangeEntry:
    path: str
    reason: str
    score_before: int
    score_after: int
    original_encoding: str


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
    return sum(text.count(token) for token in MOJIBAKE_TOKENS) + text.count("\uFFFD")


def _decode_cp1252_utf8_once(text: str) -> str:
    payload = bytearray()
    out_parts: list[str] = []

    def flush_payload() -> None:
        nonlocal payload
        if not payload:
            return
        try:
            out_parts.append(bytes(payload).decode("utf-8", errors="replace"))
        except UnicodeDecodeError:
            out_parts.append(bytes(payload).decode("latin-1", errors="replace"))
        payload = bytearray()

    for ch in text:
        cp = ord(ch)
        if cp <= 0xFF:
            payload.append(cp)
            continue
        mapped = CP1252_EXTRA.get(cp)
        if mapped is not None:
            payload.append(mapped)
            continue
        flush_payload()
        out_parts.append(ch)
    flush_payload()
    return "".join(out_parts)


def _decode_cp1252_utf8_iter(text: str, max_iter: int = 3) -> str:
    current = text
    for _ in range(max_iter):
        nxt = _decode_cp1252_utf8_once(current)
        if nxt == current or "\x00" in nxt:
            break
        if _mojibake_score(nxt) <= _mojibake_score(current):
            current = nxt
            continue
        break
    return current


def _looks_suspicious_line(line: str) -> bool:
    return any(token in line for token in MOJIBAKE_TOKENS)


def _repair_text_mojibake(text: str) -> tuple[str, bool]:
    changed = False
    out_lines: list[str] = []
    for line in text.splitlines(keepends=True):
        if _looks_suspicious_line(line):
            fixed = _decode_cp1252_utf8_iter(line, max_iter=3)
            if _mojibake_score(fixed) < _mojibake_score(line):
                line = fixed
                changed = True
        out_lines.append(line)
    return "".join(out_lines), changed


def _read_text_best(path: Path) -> tuple[str, str]:
    raw = path.read_bytes()
    for encoding in ("utf-8", "utf-8-sig", "cp1252", "latin-1"):
        try:
            return raw.decode(encoding), encoding
        except UnicodeDecodeError:
            continue
    return raw.decode("latin-1", errors="replace"), "latin-1"


def run_fix(root: Path, dry_run: bool = False) -> dict:
    changed: list[ChangeEntry] = []
    scanned_files = 0

    for path in _iter_candidate_files(root):
        scanned_files += 1
        text, original_encoding = _read_text_best(path)
        score_before = _mojibake_score(text)
        repaired_text, repaired_changed = _repair_text_mojibake(text)
        score_after = _mojibake_score(repaired_text)

        encoding_changed = original_encoding not in {"utf-8", "utf-8-sig"}
        should_write = encoding_changed or repaired_changed

        if not should_write:
            continue

        reason_parts = []
        if encoding_changed:
            reason_parts.append(f"encoding {original_encoding} -> utf-8")
        if repaired_changed:
            reason_parts.append("mojibake reparado")
        reason = "; ".join(reason_parts)

        if not dry_run:
            path.write_text(repaired_text, encoding="utf-8", newline="")

        changed.append(
            ChangeEntry(
                path=str(path),
                reason=reason,
                score_before=score_before,
                score_after=score_after,
                original_encoding=original_encoding,
            )
        )

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    reports_dir = root / "backend" / "reports"
    reports_dir.mkdir(parents=True, exist_ok=True)
    report_path = reports_dir / f"encoding_fix_{timestamp}.json"

    payload = {
        "generated_at": datetime.now().isoformat(),
        "root": str(root),
        "dry_run": dry_run,
        "scanned_files": scanned_files,
        "changed_count": len(changed),
        "changes": [asdict(item) for item in changed],
    }
    report_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    payload["report_path"] = str(report_path)
    return payload


def main() -> None:
    parser = argparse.ArgumentParser(description="Correção automática segura de encoding/mojibake.")
    parser.add_argument(
        "--root",
        default=str(Path(__file__).resolve().parents[2]),
        help="Raiz do projeto saas.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Somente simula sem gravar alterações.",
    )
    args = parser.parse_args()

    root = Path(args.root).resolve()
    result = run_fix(root=root, dry_run=args.dry_run)
    print("[encoding-fix] arquivos analisados:", result["scanned_files"])
    print("[encoding-fix] arquivos alterados:", result["changed_count"])
    print("[encoding-fix] relatório:", result["report_path"])


if __name__ == "__main__":
    main()
