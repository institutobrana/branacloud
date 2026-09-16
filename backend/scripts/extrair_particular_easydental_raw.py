from __future__ import annotations

import argparse
import csv
import hashlib
import json
import math
import sys
from collections import Counter
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Iterable

from sqlalchemy import text

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from database import engine

SOURCE_TAB_PRC = Path(r"Y:\EDS70\Dados\Dist\TAB_PRC.raw")
SOURCE_TAB_PRC_ITEM = Path(r"Y:\EDS70\Dados\Dist\TAB_PRC_ITEM.raw")
SOURCE_TAB_PRC_HASH = "38acba621352c3e88fd742a0b6afb53836462f0b0942cf69a750326832c9b7c1"
SOURCE_TAB_PRC_ITEM_HASH = "3de80c6312ee17afdc7007b2eff2502115a3dda9546e98e06fe02491172c9383"
DEFAULT_CLINIC_EMAIL = "gleissontel@gmail.com"
PARSER_VERSION = "1.0"


@dataclass
class SourceFileInfo:
    path: str
    size: int
    mtime_utc: str
    sha256: str


@dataclass
class RecordCandidate:
    start: int
    end: int
    record_length: int
    nrotab: int
    nroproctab: int
    header_tag: str
    descricao_len_bytes: int
    descricao: str
    suffix_length: int
    suffix_hex: str
    suffix_words: list[int]
    is_extended: bool


def _sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def _collect_source_info(path: Path) -> SourceFileInfo:
    stat = path.stat()
    return SourceFileInfo(
        path=str(path),
        size=int(stat.st_size),
        mtime_utc=str(stat.st_mtime),
        sha256=_sha256(path),
    )


def validate_hash(path: Path, expected_sha256: str) -> None:
    actual = _sha256(path)
    if actual.lower() != expected_sha256.lower():
        raise ValueError(f"Hash inesperado em {path}: esperado={expected_sha256} atual={actual}")


def _entropy(data: bytes) -> float:
    if not data:
        return 0.0
    counts = Counter(data)
    total = len(data)
    return -sum((count / total) * math.log2(count / total) for count in counts.values())


def _hex_window(data: bytes, size: int = 512, tail: bool = False) -> str:
    if not data:
        return ""
    if tail:
        data = data[-size:]
    else:
        data = data[:size]
    return data.hex(" ")


def _byte_distribution(data: bytes, limit: int = 16) -> list[dict[str, int]]:
    return [
        {"byte": byte, "count": count}
        for byte, count in Counter(data).most_common(limit)
    ]


def _scan_utf16le_strings(data: bytes, min_len: int = 6) -> list[dict[str, object]]:
    strings: list[dict[str, object]] = []
    i = 0
    while i <= len(data) - 4:
        if data[i + 1] != 0 or not (32 <= data[i] <= 126 or data[i] in {0xc3, 0xc7, 0xe7, 0xe1, 0xe3, 0xe9, 0xed, 0xf3, 0xfa, 0xea, 0xf4}):
            i += 2
            continue
        start = i
        chars = []
        while i <= len(data) - 2 and data[i + 1] == 0:
            try:
                chars.append(data[i : i + 2].decode("utf-16le"))
            except UnicodeDecodeError:
                break
            i += 2
        text = "".join(chars).rstrip()
        if len(text) >= min_len:
            strings.append({"offset": start, "text": text, "length": len(text)})
        if i == start:
            i += 2
    return strings


def _decode_name(raw: bytes, start: int, name_len: int) -> str:
    return raw[start : start + name_len].decode("utf-16le", errors="strict").rstrip()


def _candidate_starts(raw: bytes) -> list[int]:
    starts: set[int] = set()
    # Standard header used by the vast majority of records.
    pos = 0
    needle_standard = bytes.fromhex("ff ff 64 00")
    while True:
        idx = raw.find(needle_standard, pos)
        if idx == -1:
            break
        starts.add(idx - 8)
        pos = idx + 1

    # One compact variant uses a zero tag and explicit byte length.
    compact = bytes.fromhex("00 00 2e 00")
    idx = raw.find(compact)
    if idx != -1:
        starts.add(idx - 8)

    # Some valid Particular records use a zero tag instead of ff ff.
    # Use UTF-16LE string anchors as a fallback so we do not stop at the
    # first tag variant and miss the tail records.
    for item in _scan_utf16le_strings(raw):
        start = int(item["offset"]) - 10
        if 0 <= start < len(raw):
            starts.add(start)

    return sorted(start for start in starts if 0 <= start < len(raw))


def parse_candidate_record(raw: bytes, start: int, end: int) -> RecordCandidate:
    nrotab = int.from_bytes(raw[start : start + 4], "little", signed=False)
    nroproctab = int.from_bytes(raw[start + 4 : start + 8], "little", signed=False)
    header_tag = raw[start + 8 : start + 10].hex(" ")
    descricao_len = int.from_bytes(raw[start + 10 : start + 12], "little", signed=False)
    descricao_start = start + 12
    descricao = _decode_name(raw, descricao_start, descricao_len)
    suffix_start = descricao_start + descricao_len
    suffix = raw[suffix_start:end]
    suffix_words = [int.from_bytes(suffix[i : i + 2], "little", signed=False) for i in range(0, len(suffix) - len(suffix) % 2, 2)]
    return RecordCandidate(
        start=start,
        end=end,
        record_length=end - start,
        nrotab=nrotab,
        nroproctab=nroproctab,
        header_tag=header_tag,
        descricao_len_bytes=descricao_len,
        descricao=descricao,
        suffix_length=len(suffix),
        suffix_hex=suffix.hex(" "),
        suffix_words=suffix_words,
        is_extended=len(suffix) != 56,
    )


def detect_record_boundaries(raw: bytes) -> list[RecordCandidate]:
    starts = _candidate_starts(raw)
    candidates: list[RecordCandidate] = []
    for index, start in enumerate(starts):
        end = starts[index + 1] if index + 1 < len(starts) else len(raw)
        if start + 12 > len(raw):
            continue
        try:
            record = parse_candidate_record(raw, start, end)
        except UnicodeDecodeError:
            continue
        if record.nrotab != 1:
            continue
        if record.nroproctab < 1000:
            continue
        if not record.descricao:
            continue
        candidates.append(record)
    return candidates


def validate_candidate_record(record: RecordCandidate, seen_codes: set[int]) -> tuple[bool, str]:
    if record.nrotab != 1:
        return False, "nrotab diferente de 1"
    if record.nroproctab in seen_codes:
        return False, "codigo duplicado"
    if record.nroproctab <= 0:
        return False, "codigo invalido"
    if not record.descricao:
        return False, "nome vazio"
    return True, "ok"


def _load_brana_rows(clinica_id: int, table_code: int) -> list[dict[str, object]]:
    sql = text(
        """
        SELECT p.id, p.clinica_id, p.tabela_id, p.codigo, p.nome
        FROM procedimento p
        JOIN procedimento_tabela t ON t.id = p.tabela_id
        WHERE p.clinica_id = :clinica_id
          AND t.codigo = :table_code
        ORDER BY p.codigo
        """
    )
    with engine.connect() as conn:
        rows = conn.execute(sql, {"clinica_id": clinica_id, "table_code": table_code}).fetchall()
    return [
        {
            "procedimento_id": int(row.id),
            "clinica_id": int(row.clinica_id),
            "tabela_id": int(row.tabela_id),
            "codigo": int(row.codigo),
            "nome_atual": str(row.nome or "").strip(),
        }
        for row in rows
    ]


def _load_clinic_id(email: str) -> int:
    sql = text(
        """
        SELECT u.clinica_id
        FROM usuarios u
        WHERE lower(u.email) = lower(:email)
        """
    )
    with engine.connect() as conn:
        row = conn.execute(sql, {"email": email}).mappings().first()
    if not row:
        raise RuntimeError(f"Usuario alvo nao encontrado: {email}")
    return int(row["clinica_id"])


def _compare_with_brana(records: list[RecordCandidate], clinica_id: int, table_code: int = 4) -> dict:
    current_rows = _load_brana_rows(clinica_id, table_code)
    current_map = {row["codigo"]: row for row in current_rows}
    source_map = {record.nroproctab: record for record in records}

    matches = []
    identical = []
    divergent = []
    only_source = []
    only_brana = []

    for code, record in source_map.items():
        current = current_map.get(code)
        if not current:
            only_source.append({"codigo": code, "nome_origem": record.descricao})
            continue
        same = str(current["nome_atual"]).strip() == record.descricao.strip()
        row = {
            "codigo": code,
            "nome_origem": record.descricao,
            "nome_brana": str(current["nome_atual"]),
            "igual": same,
            "procedimento_id": current["procedimento_id"],
            "tabela_id": current["tabela_id"],
        }
        matches.append(row)
        if same:
            identical.append(row)
        else:
            divergent.append(row)

    for code, row in current_map.items():
        if code not in source_map:
            only_brana.append({"codigo": code, "nome_brana": str(row["nome_atual"])})

    return {
        "clinica_id": clinica_id,
        "table_code": table_code,
        "total_brana": len(current_map),
        "total_origem": len(source_map),
        "identicos": len(identical),
        "divergentes": len(divergent),
        "somente_origem": len(only_source),
        "somente_brana": len(only_brana),
        "matches": matches,
        "identical_rows": identical,
        "divergent_rows": divergent,
        "only_source_rows": only_source,
        "only_brana_rows": only_brana,
    }


def export_snapshot(records: list[RecordCandidate], source_info: dict[str, dict], output_json: Path, output_csv: Path) -> dict:
    payload = {
        "metadata": {
            "parser_version": PARSER_VERSION,
            "source_info": source_info,
            "total_raw_bytes": source_info["tab_prc_item"]["size"],
            "total_records": len(records),
            "total_particular": len(records),
            "filters": {"nrotab": 1},
            "note": "Leitura somente leitura do EasyDental Desktop; registros sem evidencia suficiente ficam em unparsed_records.",
        },
        "records": [
            {
                "record_index": index + 1,
                "start": record.start,
                "end": record.end,
                "length": record.record_length,
                "nrotab": record.nrotab,
                "nroproctab": record.nroproctab,
                "header_tag": record.header_tag,
                "descricao_len_bytes": record.descricao_len_bytes,
                "descricao": record.descricao,
                "suffix_length": record.suffix_length,
                "suffix_hex": record.suffix_hex,
                "suffix_words": record.suffix_words,
                "is_extended": record.is_extended,
            }
            for index, record in enumerate(records)
        ],
        "unparsed_records": [],
        "hash_final": "",
    }
    digest = hashlib.sha256(json.dumps(payload, ensure_ascii=False, sort_keys=True).encode("utf-8")).hexdigest()
    payload["hash_final"] = digest

    output_json.parent.mkdir(parents=True, exist_ok=True)
    output_json.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")

    with output_csv.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(
            handle,
            fieldnames=[
                "record_index",
                "start",
                "end",
                "length",
                "nrotab",
                "nroproctab",
                "descricao",
                "descricao_len_bytes",
                "suffix_length",
                "is_extended",
            ],
        )
        writer.writeheader()
        for index, record in enumerate(records, start=1):
            writer.writerow(
                {
                    "record_index": index,
                    "start": record.start,
                    "end": record.end,
                    "length": record.record_length,
                    "nrotab": record.nrotab,
                    "nroproctab": record.nroproctab,
                    "descricao": record.descricao,
                    "descricao_len_bytes": record.descricao_len_bytes,
                    "suffix_length": record.suffix_length,
                    "is_extended": record.is_extended,
                }
            )

    return payload


def export_diagnostics(raw: bytes, records: list[RecordCandidate], source_info: dict[str, dict]) -> dict:
    utf16_strings = _scan_utf16le_strings(raw)
    code_counter = Counter(record.nroproctab for record in records)
    suffix_lengths = Counter(record.suffix_length for record in records)
    invalid = [
        {
            "start": record.start,
            "nroproctab": record.nroproctab,
            "reason": reason,
        }
        for record in records
        for ok, reason in [validate_candidate_record(record, set())]
        if not ok
    ]
    return {
        "source_info": source_info,
        "raw_size": len(raw),
        "raw_entropy": _entropy(raw),
        "head_512_hex": _hex_window(raw, 512, tail=False),
        "tail_512_hex": _hex_window(raw, 512, tail=True),
        "byte_distribution": _byte_distribution(raw),
        "utf16le_strings": utf16_strings[:100],
        "utf16le_string_count": len(utf16_strings),
        "record_count": len(records),
        "nrotab_counts": dict(Counter(record.nrotab for record in records)),
        "code_range": {
            "min": min(code_counter) if code_counter else None,
            "max": max(code_counter) if code_counter else None,
        },
        "duplicate_codes": [code for code, count in code_counter.items() if count > 1],
        "missing_codes": [code for code in range(1001, 1113) if code not in code_counter],
        "suffix_lengths": dict(suffix_lengths),
        "invalid_records": invalid,
        "parser_version": PARSER_VERSION,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Auditoria somente leitura do TAB_PRC_ITEM.raw do EasyDental.")
    parser.add_argument("--tab-prc", default=str(SOURCE_TAB_PRC))
    parser.add_argument("--tab-prc-item", default=str(SOURCE_TAB_PRC_ITEM))
    parser.add_argument("--json-out", default="")
    parser.add_argument("--csv-out", default="")
    parser.add_argument("--preview-json", default="")
    parser.add_argument("--preview-csv", default="")
    parser.add_argument("--email", default=DEFAULT_CLINIC_EMAIL)
    args = parser.parse_args()

    tab_prc = Path(args.tab_prc)
    tab_prc_item = Path(args.tab_prc_item)
    raw = tab_prc_item.read_bytes()

    validate_hash(tab_prc, SOURCE_TAB_PRC_HASH)
    validate_hash(tab_prc_item, SOURCE_TAB_PRC_ITEM_HASH)

    source_info = {
        "tab_prc": asdict(_collect_source_info(tab_prc)),
        "tab_prc_item": asdict(_collect_source_info(tab_prc_item)),
    }

    records = detect_record_boundaries(raw)
    diagnostics = export_diagnostics(raw, records, source_info)

    output = {
        "metadata": {
            "parser_version": PARSER_VERSION,
            "source_info": source_info,
        },
        "diagnostics": diagnostics,
        "records": [
            {
                "start": record.start,
                "end": record.end,
                "record_length": record.record_length,
                "nrotab": record.nrotab,
                "nroproctab": record.nroproctab,
                "header_tag": record.header_tag,
                "descricao_len_bytes": record.descricao_len_bytes,
                "descricao": record.descricao,
                "suffix_length": record.suffix_length,
                "suffix_hex": record.suffix_hex,
                "suffix_words": record.suffix_words,
                "is_extended": record.is_extended,
            }
            for record in records
        ],
        "summary": {
            "total_records": len(records),
            "total_particular": sum(1 for record in records if record.nrotab == 1),
            "unique_codes": len({record.nroproctab for record in records}),
        },
    }
    output["hash_final"] = hashlib.sha256(json.dumps(output, ensure_ascii=False, sort_keys=True).encode("utf-8")).hexdigest()

    console_summary = {
        "parser_version": PARSER_VERSION,
        "total_records": len(records),
        "total_particular": sum(1 for record in records if record.nrotab == 1),
        "unique_codes": len({record.nroproctab for record in records}),
        "hash_final": output["hash_final"],
    }
    print(json.dumps(console_summary, ensure_ascii=True))

    if args.json_out:
        Path(args.json_out).parent.mkdir(parents=True, exist_ok=True)
        Path(args.json_out).write_text(json.dumps(output, ensure_ascii=False, indent=2), encoding="utf-8")

    if args.csv_out:
        with Path(args.csv_out).open("w", encoding="utf-8", newline="") as handle:
            writer = csv.DictWriter(
                handle,
                fieldnames=[
                    "start",
                    "end",
                    "record_length",
                    "nrotab",
                    "nroproctab",
                    "descricao",
                    "descricao_len_bytes",
                    "suffix_length",
                    "is_extended",
                ],
            )
            writer.writeheader()
            for record in records:
                writer.writerow(
                    {
                        "start": record.start,
                        "end": record.end,
                        "record_length": record.record_length,
                        "nrotab": record.nrotab,
                        "nroproctab": record.nroproctab,
                        "descricao": record.descricao,
                        "descricao_len_bytes": record.descricao_len_bytes,
                        "suffix_length": record.suffix_length,
                        "is_extended": record.is_extended,
                    }
                )

    if args.json_out:
        snapshot_json = Path(args.json_out).with_name("particular_336_procedimentos.json")
        snapshot_csv = Path(args.csv_out).with_name("particular_336_procedimentos.csv") if args.csv_out else snapshot_json.with_suffix(".csv")
        snapshot = export_snapshot(records, source_info, snapshot_json, snapshot_csv)
        preview = _compare_with_brana(records, _load_clinic_id(args.email), table_code=4)
        if args.preview_json:
            Path(args.preview_json).parent.mkdir(parents=True, exist_ok=True)
            Path(args.preview_json).write_text(json.dumps(preview, ensure_ascii=False, indent=2), encoding="utf-8")
        if args.preview_csv:
            with Path(args.preview_csv).open("w", encoding="utf-8", newline="") as handle:
                writer = csv.DictWriter(handle, fieldnames=["codigo", "nome_origem", "nome_brana", "igual", "procedimento_id", "tabela_id"])
                writer.writeheader()
                for row in preview["matches"]:
                    writer.writerow(row)
        summary_line = {
            "snapshot_hash": snapshot["hash_final"],
            "preview_total_origem": preview["total_origem"],
            "preview_total_brana": preview["total_brana"],
            "preview_identicos": preview["identicos"],
            "preview_divergentes": preview["divergentes"],
            "preview_somente_origem": preview["somente_origem"],
            "preview_somente_brana": preview["somente_brana"],
        }
        print(json.dumps(summary_line, ensure_ascii=True))


if __name__ == "__main__":
    main()
