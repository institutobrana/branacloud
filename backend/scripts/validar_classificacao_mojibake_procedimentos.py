from __future__ import annotations

import argparse
import sys
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[1]
SCRIPTS_DIR = BACKEND_DIR / "scripts"
for path in (BACKEND_DIR, SCRIPTS_DIR):
    if str(path) not in sys.path:
        sys.path.insert(0, str(path))

from preview_correcao_mojibake_procedimentos import _classify_row  # noqa: E402


def main() -> None:
    parser = argparse.ArgumentParser(description="Valida a classificacao B/C/A do preview de mojibake em Procedimentos.")
    parser.add_argument("--run", action="store_true", help="Executa as assercoes de classificacao.")
    args = parser.parse_args()
    if not args.run:
        raise SystemExit("Recusa: use --run para executar assercoes.")

    casos_b = [
        ("Aparelho de conten\u0087\u00c6o", "Aparelho de contenção"),
        ("Adequa\u00c3\u00a7\u00c3\u00a3o", "Adequação"),
        ("Corre\u00c3\u00a7\u00c3\u00a3o", "Correção"),
        ("n\u00c3\u0096o", "não"),
        ("pr\u00c2\u00a2tese", "prótese"),
        ("Conserto de pr\u00c2\u00a2tese", "Conserto de prótese"),
        ("Obtura\u00c3\u00a7\u00c3\u00a3o", "Obturação"),
        ("Bi\u00c2\u00a2psia", "Biópsia"),
        ("L\u00c2\u00a1ngua", "Língua"),
    ]
    casos_c = [
        ("Aparelho em uma arcada conjugado c/ ap. auxiliar 2", "Aparelho em uma arcada conjugado c/ ap. auxiliar"),
        ("Controle de placa bacteriana 7", "Controle de placa bacteriana"),
        ("Modelos de estudo )", "Modelos de estudo"),
        ("Drenagem extra-oral de abscesso 9", "Drenagem extra-oral de abscesso"),
        ("Tratamento especial", "Tratamento diferente"),
    ]
    for atual, origem in casos_b:
        if _classify_row(atual, origem) != "B":
            raise AssertionError(f"Esperado B: {atual} -> {origem}")
    for atual, origem in casos_c:
        if _classify_row(atual, origem) != "C":
            raise AssertionError(f"Esperado C: {atual} -> {origem}")
    if _classify_row("Consulta", "Consulta") != "A":
        raise AssertionError("Esperado A para nome igual.")
    print("ok: classificacao B/C/A validada")


if __name__ == "__main__":
    main()
