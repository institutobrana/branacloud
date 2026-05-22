"""Bootstrap controlado e idempotente para perfis funcionais de access_profile."""

from __future__ import annotations

from sqlalchemy.orm import Session

from models.access_profile import AccessProfile
from seeds.access_profiles_default import (
    DEFAULT_ACCESS_PROFILES_VERSION,
    get_default_access_profiles,
)


def ensure_default_access_profiles_for_clinic(db: Session, clinica_id: int) -> dict[str, object]:
    """Materialize the default functional profiles bootstrap in the current session."""
    clinica_id = int(clinica_id)
    perfis_seed = get_default_access_profiles()
    existentes = db.query(AccessProfile).filter(AccessProfile.clinica_id == clinica_id).all()
    existentes_por_source_id = {
        int(item.source_id or 0): item
        for item in existentes
        if int(item.source_id or 0) > 0
    }
    existentes_por_nome = {
        " ".join(str(item.nome or "").split()).strip().casefold(): item
        for item in existentes
        if " ".join(str(item.nome or "").split()).strip()
    }

    created: list[dict[str, object]] = []
    existing: list[dict[str, object]] = []
    skipped: list[dict[str, object]] = []
    total_expected = len(perfis_seed)

    for item in perfis_seed:
        codigo = str(item.get("codigo") or "").strip()
        nome = str(item.get("nome") or "").strip()
        ordem = item.get("ordem")
        ativo = bool(item.get("ativo", True))
        source_id = int(ordem) if ordem is not None else 0

        if source_id <= 0 or not nome:
            skipped.append({"codigo": codigo, "nome": nome, "motivo": "dados_invalidos"})
            continue

        nome_key = " ".join(nome.split()).strip().casefold()
        found = existentes_por_source_id.get(source_id) or existentes_por_nome.get(nome_key)
        if found:
            existing.append(
                {
                    "id": int(found.id),
                    "source_id": int(found.source_id or 0) if int(found.source_id or 0) > 0 else None,
                    "nome": str(found.nome or ""),
                }
            )
            continue

        profile = AccessProfile(
            clinica_id=clinica_id,
            source_id=source_id,
            nome=nome,
            reservado=True,
        )
        db.add(profile)
        created.append(
            {
                "clinica_id": clinica_id,
                "source_id": source_id,
                "nome": nome,
                "reservado": True,
                "ordem": ordem,
                "ativo": ativo,
            }
        )

    return {
        "version": DEFAULT_ACCESS_PROFILES_VERSION,
        "clinica_id": clinica_id,
        "total_expected": total_expected,
        "created": created,
        "existing": existing,
        "skipped": skipped,
        "created_count": len(created),
        "skipped_count": len(skipped),
    }
