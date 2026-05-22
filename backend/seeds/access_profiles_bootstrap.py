"""Bootstrap controlado e idempotente para perfis funcionais de access_profile."""

from __future__ import annotations

from collections.abc import Iterable

from sqlalchemy.orm import Session

from models.access_profile import AccessProfile
from seeds.access_profiles_default import (
    DEFAULT_ACCESS_PROFILES_VERSION,
    get_default_access_profiles,
)


def ensure_default_access_profiles_for_clinic(db: Session, clinica_id: int) -> dict[str, object]:
    """Return a dry-run style summary for the default functional profiles bootstrap."""
    clinica_id = int(clinica_id)
    perfis_seed = get_default_access_profiles()
    existentes = {
        (str(item.source_id).strip() if item.source_id is not None else ""): item
        for item in db.query(AccessProfile)
        .filter(AccessProfile.clinica_id == clinica_id)
        .all()
    }

    created: list[dict[str, object]] = []
    existing: list[dict[str, object]] = []
    skipped: list[dict[str, object]] = []

    for item in perfis_seed:
        source_code = str(item.get("codigo") or "").strip()
        nome = str(item.get("nome") or "").strip()
        ordem = item.get("ordem")
        ativo = bool(item.get("ativo", True))
        if not source_code or not nome:
            skipped.append({"codigo": source_code, "nome": nome, "motivo": "dados_invalidos"})
            continue

        found = existentes.get(source_code)
        if found:
            existing.append(
                {
                    "id": int(found.id),
                    "source_id": str(found.source_id or ""),
                    "nome": str(found.nome or ""),
                }
            )
            continue

        created.append(
            {
                "clinica_id": clinica_id,
                "source_id": source_code,
                "nome": nome,
                "reservado": True,
                "ordem": ordem,
                "ativo": ativo,
            }
        )

    return {
        "version": DEFAULT_ACCESS_PROFILES_VERSION,
        "clinica_id": clinica_id,
        "created": created,
        "existing": existing,
        "skipped": skipped,
    }

