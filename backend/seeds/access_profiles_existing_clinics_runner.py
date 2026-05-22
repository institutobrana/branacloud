"""Runner controlado para aplicar access_profile em clinicas existentes.

Este modulo nao executa nada no import. A execucao real exige `clinica_id`
explicitamente e a flag `--execute`.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from sqlalchemy import text


if __package__ is None or __package__ == "":
    sys.path.append(str(Path(__file__).resolve().parents[1]))

from database import SessionLocal, engine  # noqa: E402
from seeds.access_profiles_bootstrap import ensure_default_access_profiles_for_clinic  # noqa: E402
from seeds.access_profiles_dry_run import build_access_profiles_dry_run_for_clinic  # noqa: E402


EXPECTED_DATABASE = "brana_saas"


def _current_database() -> str:
    with engine.connect() as conn:
        return str(conn.execute(text("select current_database()")).scalar() or "").strip()


def run_existing_clinic_access_profile_bootstrap(
    clinica_id: int,
    execute: bool = False,
) -> dict[str, object]:
    """Run a read-only preview by default, or apply the bootstrap when explicitly requested."""
    clinica_id = int(clinica_id)
    if clinica_id <= 0:
        raise ValueError("clinica_id deve ser um inteiro positivo")

    current_db = _current_database()

    dry_run_session = SessionLocal()
    try:
        dry_run = build_access_profiles_dry_run_for_clinic(dry_run_session, clinica_id)
    finally:
        dry_run_session.close()

    result: dict[str, object] = {
        "clinica_id": clinica_id,
        "current_database": current_db,
        "execute": bool(execute),
        "dry_run": dry_run,
        "status": "dry_run_only",
    }

    if not execute:
        result["message"] = "Modo apenas leitura. Use --execute para aplicar o bootstrap oficial em brana_saas."
        return result

    if current_db != EXPECTED_DATABASE:
        raise RuntimeError(
            f"current_database inesperado: {current_db!r}. Esperado: {EXPECTED_DATABASE!r}."
        )

    db = SessionLocal()
    try:
        summary = ensure_default_access_profiles_for_clinic(db, clinica_id)
        db.commit()
        result["status"] = "committed"
        result["summary"] = summary
        return result
    except Exception:
        db.rollback()
        result["status"] = "rolled_back"
        raise
    finally:
        db.close()


def _build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Runner controlado para aplicar bootstrap de access_profile em uma clinica existente.",
    )
    parser.add_argument(
        "clinica_id",
        type=int,
        help="ID da clinica existente que recebera o bootstrap de access_profile.",
    )
    parser.add_argument(
        "--execute",
        action="store_true",
        help="Aplica a correcao real. Sem esta flag, o runner faz apenas dry-run.",
    )
    return parser


def main(argv: list[str] | None = None) -> int:
    parser = _build_parser()
    args = parser.parse_args(argv)
    result = run_existing_clinic_access_profile_bootstrap(
        clinica_id=args.clinica_id,
        execute=bool(args.execute),
    )
    print(json.dumps(result, ensure_ascii=False, indent=2, sort_keys=True, default=str))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

