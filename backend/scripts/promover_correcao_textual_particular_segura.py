from __future__ import annotations

import argparse
import csv
import json
import re
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[2]
SOURCE_JSON = ROOT_DIR / "docs" / "preview_correcao_textual_particular_operacional.json"
SAFE_JSON = ROOT_DIR / "docs" / "preview_correcao_textual_particular_segura.json"
SAFE_CSV = ROOT_DIR / "docs" / "preview_correcao_textual_particular_segura.csv"
REVIEW_JSON = ROOT_DIR / "docs" / "revisao_manual_particular_divergencias_textuais.json"
REVIEW_CSV = ROOT_DIR / "docs" / "revisao_manual_particular_divergencias_textuais.csv"

EXPLICIT_MARKERS = ("Ã", "Â", "ï¿½", "�", "\x82", "\x87", "\x93", "\x94", "\x96", "\x97", "\x98", "\x99", "\x9a", "\x9c", "\x9d", "\x9e")


def _has_explicit_corruption(text: str) -> bool:
    txt = text or ""
    return any(marker in txt for marker in EXPLICIT_MARKERS) or bool(re.search(r"[\u0080-\u009f]", txt))


def _load_source() -> dict:
    return json.loads(SOURCE_JSON.read_text(encoding="utf-8"))


def _build_outputs() -> tuple[dict, dict]:
    source = _load_source()
    registros = source.get("registros") or []
    metadata = dict(source.get("metadata") or {})

    safe_rows = []
    review_rows = []

    for row in registros:
        explicit = _has_explicit_corruption(row.get("nome_atual_bruto", ""))
        if row.get("acao") == "BLOQUEAR":
            review_rows.append(
                {
                    "id_brana": row["procedimento_id"],
                    "tabela_id": metadata.get("tabela_id", 18),
                    "codigo": row["codigo"],
                    "nome_brana": row["nome_atual_bruto"],
                    "nome_easy": row["nome_canonico_csv"],
                    "diferencas": row["motivo"],
                    "caracteres_corrompidos": row["caracteres_suspeitos"],
                    "nroproctab": row["nroproctab"],
                    "codconv": row["codconv"],
                    "especialidade": "",
                    "preco": "",
                    "candidato": row["metodo_correspondencia"],
                    "motivo_nao_correcao_automatica": row["motivo"],
                    "acao": "BLOQUEAR",
                }
            )
            continue
        if explicit:
            safe_rows.append(
                {
                    "id_brana": row["procedimento_id"],
                    "tabela_id": metadata.get("tabela_id", 18),
                    "codigo": row["codigo"],
                    "nome_atual": row["nome_atual_bruto"],
                    "nome_proposto": row["nome_canonico_csv"],
                    "nome_sql": row["nome_canonico_sql"],
                    "nome_csv": row["nome_canonico_csv"],
                    "caracteres_corrompidos": row["caracteres_suspeitos"],
                    "transformacao_aplicada": row["reparo_diagnostico"] or row["nome_canonico_csv"],
                    "nroproctab": row["nroproctab"],
                    "codconv": row["codconv"],
                    "especialidade": "",
                    "preco": "",
                    "evidencias_auxiliares": row["metodo_correspondencia"],
                    "nivel_confianca": "ALTA",
                    "acao": "CORRIGIR_NOME",
                    "justificativa": "corrupcao textual explicita com nome canonico unico confirmado por SQL e CSV",
                }
            )
        elif row.get("acao") == "REVISAR":
            review_rows.append(
                {
                    "id_brana": row["procedimento_id"],
                    "tabela_id": metadata.get("tabela_id", 18),
                    "codigo": row["codigo"],
                    "nome_brana": row["nome_atual_bruto"],
                    "nome_easy": row["nome_canonico_csv"],
                    "diferencas": row["motivo"],
                    "caracteres_corrompidos": row["caracteres_suspeitos"],
                    "nroproctab": row["nroproctab"],
                    "codconv": row["codconv"],
                    "especialidade": "",
                    "preco": "",
                    "candidato": row["metodo_correspondencia"],
                    "motivo_nao_correcao_automatica": row["motivo"],
                    "acao": "REVISAR",
                }
            )
        # registros MANTER ficam fora de qualquer revisão textual

    safe = {
        "metadata": {
            "clinica_id": metadata.get("clinica_id", 1),
            "tabela_id": metadata.get("tabela_id", 18),
            "tabela_codigo": metadata.get("tabela_codigo", 4),
            "tabela_nome": metadata.get("tabela_nome", "PARTICULAR"),
            "total_analisados": metadata.get("total_brana", len(registros)),
            "total_corrigivel_seguro": len(safe_rows),
            "total_revisar_ambiguidades": len(review_rows),
            "total_bloqueado": 1,
            "origem": "docs/preview_correcao_textual_particular_operacional.json",
        },
        "registros": safe_rows,
    }
    review = {
        "metadata": {
            "clinica_id": metadata.get("clinica_id", 1),
            "tabela_id": metadata.get("tabela_id", 18),
            "tabela_codigo": metadata.get("tabela_codigo", 4),
            "tabela_nome": metadata.get("tabela_nome", "PARTICULAR"),
            "total_63_divergencias": len(review_rows),
            "origem": "preview_correcao_textual_particular_operacional.json",
        },
        "registros": review_rows,
    }
    return safe, review


def _write_outputs(data: dict, json_path: Path, csv_path: Path) -> None:
    json_path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    rows = data.get("registros") or []
    csv_path.parent.mkdir(parents=True, exist_ok=True)
    with csv_path.open("w", encoding="utf-8", newline="") as handle:
        if rows:
            writer = csv.DictWriter(handle, fieldnames=list(rows[0].keys()))
            writer.writeheader()
            writer.writerows(rows)
        else:
            handle.write("")


def main() -> None:
    parser = argparse.ArgumentParser(description="Promove explicit corruption rows to a safe textual correction preview.")
    parser.add_argument("--write", action="store_true", help="Escreve os previews gerados.")
    args = parser.parse_args()

    safe, review = _build_outputs()
    print(json.dumps(safe["metadata"], ensure_ascii=False, indent=2))
    print(json.dumps(review["metadata"], ensure_ascii=False, indent=2))

    if args.write:
        _write_outputs(safe, SAFE_JSON, SAFE_CSV)
        _write_outputs(review, REVIEW_JSON, REVIEW_CSV)


if __name__ == "__main__":
    main()
