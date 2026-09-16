from __future__ import annotations

import argparse
import csv
import difflib
import hashlib
import json
import re
import sys
import unicodedata
from dataclasses import asdict, dataclass
from pathlib import Path

from sqlalchemy import text

BACKEND_DIR = Path(__file__).resolve().parents[1]
ROOT_DIR = BACKEND_DIR.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from database import engine

CLINICA_ID_DEFAULT = 1
TABELA_ID_DEFAULT = 18
TABELA_CODIGO_DEFAULT = 4
CANONICAL_PREVIEW = ROOT_DIR / "docs" / "preview_reconciliacao_particular_com_csv.json"

MOJIBAKE_MARKERS = (
    "Ã",
    "Â",
    "ï¿½",
    "�",
    "\x82",
    "\x87",
    "\x93",
    "\x94",
    "\x96",
    "\x97",
    "\x98",
    "\x99",
    "\x9a",
    "\x9c",
    "\x9d",
    "\x9e",
)


@dataclass
class PreviewRow:
    procedimento_id: int
    codigo: int
    nome_atual_bruto: str
    caracteres_suspeitos: str
    reparo_diagnostico: str
    nome_canonico_sql: str
    nome_canonico_csv: str
    nroproctab: str
    codconv: str
    metodo_correspondencia: str
    nivel_confianca: str
    motivo: str
    acao: str


def _clean(value: object) -> str:
    return " ".join(str(value or "").replace("\ufeff", "").split()).strip()


def _norm(value: object) -> str:
    return unicodedata.normalize("NFC", _clean(value)).casefold()


def _looks_mojibake(value: object) -> bool:
    txt = _clean(value)
    return any(marker in txt for marker in MOJIBAKE_MARKERS) or bool(re.search(r"[\u0080-\u009f]", txt))


def _extract_suspects(value: object) -> str:
    txt = _clean(value)
    found = [marker for marker in MOJIBAKE_MARKERS if marker and marker in txt]
    return " ".join(dict.fromkeys(found))


def _load_canonical_names() -> dict[str, dict[str, str]]:
    data = json.loads(CANONICAL_PREVIEW.read_text(encoding="utf-8"))
    rows = data.get("registros") or []
    canon: dict[str, dict[str, str]] = {}
    for row in rows:
        name = _clean(row.get("nome_csv"))
        if name:
            canon.setdefault(
                _norm(name),
                {
                    "nome_csv": name,
                    "nroproctab_sql": _clean(row.get("nroproctab_sql")),
                    "codconv_sql": _clean(row.get("codconv_sql")),
                    "descricao_sql": _clean(row.get("descricao_sql")),
                },
            )
    return canon


def _load_brana_rows(clinica_id: int, tabela_id: int) -> list[dict]:
    sql = text(
        """
        SELECT p.id, p.codigo, p.nome
        FROM procedimento p
        WHERE p.clinica_id = :clinica_id
          AND p.tabela_id = :tabela_id
        ORDER BY p.id
        """
    )
    with engine.connect() as conn:
        rows = conn.execute(sql, {"clinica_id": clinica_id, "tabela_id": tabela_id}).mappings().all()
    return [dict(row) for row in rows]


def _diagnostic_variants(value: str) -> list[str]:
    txt = _clean(value)
    variants: list[str] = []
    seen: set[str] = set()

    def add(candidate: str) -> None:
        candidate = _clean(candidate)
        if candidate and candidate not in seen:
            seen.add(candidate)
            variants.append(candidate)

    add(txt)
    encodings = ("latin1", "cp1252")
    for source_encoding in encodings:
        try:
            raw = txt.encode(source_encoding)
        except Exception:
            continue
        for target_encoding in ("utf-8", "latin1", "cp1252"):
            try:
                add(raw.decode(target_encoding))
            except Exception:
                pass
        try:
            add(raw.decode("utf-8", errors="strict").encode("cp1252", errors="strict").decode("utf-8", errors="strict"))
        except Exception:
            pass
        try:
            add(raw.decode("utf-8", errors="strict").encode("latin1", errors="strict").decode("utf-8", errors="strict"))
        except Exception:
            pass
    return variants


def _best_canonical_guess(value: str, canonical: dict[str, dict[str, str]]) -> tuple[str, dict[str, str] | None, str]:
    candidates = _diagnostic_variants(value)
    for candidate in candidates:
        key = _norm(candidate)
        if key in canonical:
            return candidate, canonical[key], "reparo_diagnostico"

    fallback = difflib.get_close_matches(_norm(value), list(canonical.keys()), n=1, cutoff=0.72)
    if fallback:
        canonical_name = canonical[fallback[0]]
        return value, canonical_name, "aproximacao_textual"

    return value, None, "sem_correspondencia"


def build_preview(clinica_id: int, tabela_id: int) -> dict:
    canonical = _load_canonical_names()
    brana_rows = _load_brana_rows(clinica_id, tabela_id)
    preview_rows: list[PreviewRow] = []

    total_corrompidos = 0
    total_sem_erro = 0
    total_outros = 0
    total_corrigivel = 0
    total_revisao = 0
    total_bloqueado = 0

    for row in brana_rows:
        nome_atual = _clean(row["nome"])
        repaired_guess, canonical_guess, method = _best_canonical_guess(nome_atual, canonical)
        exact = _norm(nome_atual) in canonical
        if exact:
            total_sem_erro += 1
            acao = "MANTER"
            nivel = "baixo"
            motivo = "nome atual ja coincide com a fonte canonica"
            source = canonical[_norm(nome_atual)]
            nome_canonico_csv = source["nome_csv"]
            nome_canonico_sql = source["descricao_sql"] or source["nome_csv"]
            nroproctab = source["nroproctab_sql"]
            codconv = source["codconv_sql"]
        else:
            suspect = _looks_mojibake(nome_atual)
            if suspect:
                total_corrompidos += 1
            else:
                total_outros += 1
            if canonical_guess:
                nome_canonico_csv = canonical_guess["nome_csv"]
                nome_canonico_sql = canonical_guess["descricao_sql"] or canonical_guess["nome_csv"]
                nroproctab = canonical_guess["nroproctab_sql"]
                codconv = canonical_guess["codconv_sql"]
            else:
                nome_canonico_csv = ""
                nome_canonico_sql = ""
                nroproctab = ""
                codconv = ""
            if canonical_guess and repaired_guess != nome_atual:
                total_corrigivel += 1
                acao = "CORRIGIR_NOME"
                nivel = "alto"
                motivo = "mojibake ou corrupcao textual com reparo diagnostico associado a nome canonico unico"
            elif canonical_guess:
                total_revisao += 1
                acao = "REVISAR"
                nivel = "medio"
                motivo = "divergencia textual com correspondencia aproximada na fonte canonica"
            else:
                total_bloqueado += 1
                acao = "BLOQUEAR"
                nivel = "baixo"
                motivo = "nao foi possivel associar nome canonico com seguranca"

        preview_rows.append(
            PreviewRow(
                procedimento_id=int(row["id"]),
                codigo=int(row["codigo"]),
                nome_atual_bruto=nome_atual,
                caracteres_suspeitos=_extract_suspects(nome_atual),
                reparo_diagnostico=repaired_guess if repaired_guess != nome_atual else (nome_canonico_csv if nome_canonico_csv and nome_canonico_csv != nome_atual else ""),
                nome_canonico_sql=nome_canonico_sql,
                nome_canonico_csv=nome_canonico_csv,
                nroproctab=nroproctab,
                codconv=codconv,
                metodo_correspondencia=method if not exact else "identico",
                nivel_confianca=nivel,
                motivo=motivo,
                acao=acao,
            )
        )

    return {
        "metadata": {
            "clinica_id": clinica_id,
            "tabela_id": tabela_id,
            "tabela_codigo": TABELA_CODIGO_DEFAULT,
            "tabela_nome": "PARTICULAR",
            "total_brana": len(brana_rows),
            "total_sem_erro": total_sem_erro,
            "total_com_mojibake": total_corrompidos,
            "total_outros_erros_textuais": total_outros,
            "total_corrigivel_automaticamente": total_corrigivel,
            "total_para_revisao": total_revisao,
            "total_bloqueado": total_bloqueado,
        },
        "registros": [asdict(row) for row in preview_rows],
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Gera preview somente leitura da correcao textual da tabela PARTICULAR.")
    parser.add_argument("--clinica-id", type=int, default=CLINICA_ID_DEFAULT)
    parser.add_argument("--tabela-id", type=int, default=TABELA_ID_DEFAULT)
    parser.add_argument("--json-out")
    parser.add_argument("--csv-out")
    args = parser.parse_args()

    preview = build_preview(args.clinica_id, args.tabela_id)
    print(json.dumps(preview["metadata"], ensure_ascii=False, indent=2))
    print(f"rows={len(preview['registros'])}")

    if args.json_out:
        Path(args.json_out).write_text(json.dumps(preview, ensure_ascii=False, indent=2), encoding="utf-8")
    if args.csv_out:
        csv_path = Path(args.csv_out)
        csv_path.parent.mkdir(parents=True, exist_ok=True)
        with csv_path.open("w", encoding="utf-8", newline="") as handle:
            writer = csv.DictWriter(handle, fieldnames=list(preview["registros"][0].keys()) if preview["registros"] else [])
            if preview["registros"]:
                writer.writeheader()
                writer.writerows(preview["registros"])


if __name__ == "__main__":
    main()
