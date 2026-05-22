"""Dry-run controlado e somente leitura para diagnosticar access_profile por clinica."""

from __future__ import annotations

from collections.abc import Iterable

from sqlalchemy.orm import Session

from models.access_profile import AccessProfile
from models.clinica import Clinica
from seeds.access_profiles_default import (
    DEFAULT_ACCESS_PROFILES_VERSION,
    get_default_access_profiles,
)


def _normalize_name(value: object) -> str:
    return " ".join(str(value or "").split()).strip().casefold()


def _iter_clinic_ids(db: Session, clinica_ids: Iterable[int] | None = None) -> list[int]:
    if clinica_ids is not None:
        return [int(item) for item in clinica_ids if str(item or "").strip()]
    rows = db.query(Clinica.id).order_by(Clinica.id.asc()).all()
    return [int(getattr(row, "id", row[0])) for row in rows if int(getattr(row, "id", row[0])) > 0]


def _build_dry_run_for_clinic(db: Session, clinica_id: int) -> dict[str, object]:
    clinica_id = int(clinica_id)
    perfis_seed = get_default_access_profiles()
    existentes = (
        db.query(AccessProfile)
        .filter(AccessProfile.clinica_id == clinica_id)
        .order_by(AccessProfile.source_id.asc(), AccessProfile.id.asc())
        .all()
    )
    existentes_por_nome = {
        _normalize_name(item.nome): item
        for item in existentes
        if _normalize_name(item.nome)
    }

    existing: list[dict[str, object]] = []
    missing: list[dict[str, object]] = []
    skipped: list[dict[str, object]] = []

    for item in perfis_seed:
        codigo = str(item.get("codigo") or "").strip()
        nome = str(item.get("nome") or "").strip()
        ordem = item.get("ordem")
        ativo = bool(item.get("ativo", True))

        if not nome:
            skipped.append({"codigo": codigo, "motivo": "nome_vazio"})
            continue

        current = existentes_por_nome.get(_normalize_name(nome))
        if current:
            existing.append(
                {
                    "id": int(current.id),
                    "clinica_id": int(current.clinica_id),
                    "source_id": int(current.source_id or 0) if str(current.source_id or "").strip() else None,
                    "nome": str(current.nome or ""),
                    "reservado": bool(current.reservado),
                    "codigo": codigo,
                    "ordem": ordem,
                    "ativo": ativo,
                }
            )
            continue

        missing.append(
            {
                "clinica_id": clinica_id,
                "source_id": int(ordem) if ordem is not None else None,
                "nome": nome,
                "reservado": True,
                "codigo": codigo,
                "ordem": ordem,
                "ativo": ativo,
            }
        )

    return {
        "version": DEFAULT_ACCESS_PROFILES_VERSION,
        "clinica_id": clinica_id,
        "total_expected": len(perfis_seed),
        "existing": existing,
        "missing": missing,
        "skipped": skipped,
        "would_create_count": len(missing),
    }


def build_access_profiles_dry_run_for_clinic(db: Session, clinica_id: int) -> dict[str, object]:
    """Build a read-only summary for a specific clinic."""
    return _build_dry_run_for_clinic(db, clinica_id)


def build_access_profiles_dry_run_for_all_clinics(
    db: Session,
    clinica_ids: Iterable[int] | None = None,
) -> dict[str, object]:
    """Build a read-only summary for all clinics or for an explicit clinic list."""
    ids = _iter_clinic_ids(db, clinica_ids)
    clinicas = [_build_dry_run_for_clinic(db, clinica_id) for clinica_id in ids]
    return {
        "version": DEFAULT_ACCESS_PROFILES_VERSION,
        "clinica_ids": ids,
        "total_clinicas": len(ids),
        "clinicas": clinicas,
    }

