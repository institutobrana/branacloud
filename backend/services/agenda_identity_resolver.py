"""Read-only identity resolution for agenda events.

This module deliberately does not interpret ``nro_pac`` as a patient
identity.  Historical source reconciliation is not available in the
current data model, so those events remain explicitly unresolved.
"""

from __future__ import annotations

from dataclasses import dataclass
from enum import Enum
from typing import Any
import re

from models.paciente import Paciente


class AgendaPatientIdentityState(str, Enum):
    CANONICAL = "CANONICAL"
    HISTORICAL_PROVEN = "HISTORICAL_PROVEN"
    HISTORICAL_UNRESOLVED_WITH_NRO_PAC = "HISTORICAL_UNRESOLVED_WITH_NRO_PAC"
    HISTORICAL_NULL_IDENTITY_UNKNOWN = "HISTORICAL_NULL_IDENTITY_UNKNOWN"
    NO_PATIENT_PROVEN = "NO_PATIENT_PROVEN"
    INVALID = "INVALID"


@dataclass(frozen=True, slots=True)
class AgendaPatientIdentity:
    state: AgendaPatientIdentityState
    canonical_patient_id: int | None = None
    patient: Paciente | None = None
    proof_source: str | None = None
    external_effect_allowed: bool = False


def resolve_agenda_patient_identities_batch(events: list[Any], db: Any, tenant_id: int) -> dict[int, AgendaPatientIdentity]:
    """Resolve a collection with one canonical-patient query."""
    patient_ids = {int(event.patient_id) for event in events if getattr(event, "patient_id", None) is not None}
    patients = {}
    if patient_ids:
        patients = {
            int(patient.id): patient
            for patient in db.query(Paciente)
            .filter(Paciente.id.in_(patient_ids), Paciente.clinica_id == int(tenant_id))
            .all()
        }

    result: dict[int, AgendaPatientIdentity] = {}
    for event in events:
        patient_id = getattr(event, "patient_id", None)
        if patient_id is not None:
            patient = patients.get(int(patient_id))
            result[int(event.id)] = (
                AgendaPatientIdentity(
                    state=AgendaPatientIdentityState.CANONICAL,
                    canonical_patient_id=int(patient.id),
                    patient=patient,
                    proof_source="patient_id",
                    external_effect_allowed=True,
                )
                if patient is not None
                else _invalid()
            )
        elif getattr(event, "nro_pac", None) is not None:
            result[int(event.id)] = AgendaPatientIdentity(
                state=AgendaPatientIdentityState.HISTORICAL_UNRESOLVED_WITH_NRO_PAC,
                proof_source="historical_source_mapping_unavailable",
            )
        else:
            result[int(event.id)] = AgendaPatientIdentity(
                state=AgendaPatientIdentityState.HISTORICAL_NULL_IDENTITY_UNKNOWN,
                proof_source="no_patient_identity_source_available",
            )
    return result


def resolve_agenda_notice_patient_identities_batch(events: list[Any], db: Any, tenant_id: int) -> dict[int, AgendaPatientIdentity]:
    """Resolve notice contacts without changing the canonical H1 contract.

    Historical rows may be used for read-only notice display only when the
    legacy candidate set yields exactly one patient, or when exactly one
    candidate is supported by the event's exact name/phone snapshot.
    """
    result = resolve_agenda_patient_identities_batch(events, db, tenant_id)
    historical = [event for event in events if getattr(event, "patient_id", None) is None and getattr(event, "nro_pac", None) is not None]
    values = {int(event.nro_pac) for event in historical}
    if not values:
        return result
    patients = db.query(Paciente).filter(Paciente.clinica_id == int(tenant_id)).filter(
        (Paciente.id.in_(values)) | (Paciente.codigo.in_(values))
    ).all()
    by_value: dict[int, dict[int, Paciente]] = {}
    for patient in patients:
        for value in (int(patient.id), int(patient.codigo)):
            if value in values:
                by_value.setdefault(value, {})[int(patient.id)] = patient

    def name(value: Any) -> str:
        return str(value or "").strip().casefold()

    def digits(value: Any) -> str:
        return re.sub(r"\D+", "", str(value or ""))

    for event in historical:
        candidates = list(by_value.get(int(event.nro_pac), {}).values())
        selected = None
        proof = None
        if len(candidates) == 1:
            selected, proof = candidates[0], "historical_unique_legacy_candidate"
        elif len(candidates) > 1:
            name_matches = [p for p in candidates if name(getattr(event, "nome", None)) and name(getattr(event, "nome", None)) == name(getattr(p, "nome_completo", None) or getattr(p, "nome", None))]
            if len(name_matches) == 1:
                selected, proof = name_matches[0], "historical_exact_event_name"
            else:
                event_phones = {digits(getattr(event, f"fone{idx}", None)) for idx in range(1, 4)} - {""}
                phone_matches = [p for p in candidates if event_phones & {digits(getattr(p, f"fone{idx}", None)) for idx in range(1, 5)} - {""}]
                if len(phone_matches) == 1:
                    selected, proof = phone_matches[0], "historical_exact_event_phone"
        if selected is not None:
            result[int(event.id)] = AgendaPatientIdentity(
                state=AgendaPatientIdentityState.HISTORICAL_PROVEN,
                canonical_patient_id=int(selected.id),
                patient=selected,
                proof_source=proof,
                external_effect_allowed=True,
            )
    return result


def _invalid() -> AgendaPatientIdentity:
    return AgendaPatientIdentity(
        state=AgendaPatientIdentityState.INVALID,
        proof_source="patient_id_not_found_in_tenant",
    )


def resolve_agenda_patient_identity(event: Any, db: Any, tenant_id: int) -> AgendaPatientIdentity:
    """Resolve an agenda event without mutating the event or database.

    ``patient_id`` is the only automatic identity proof.  A NULL canonical
    FK never falls back to the legacy ``nro_pac`` field, even when that value
    happens to match a current patient id or code.
    """

    patient_id = getattr(event, "patient_id", None)
    if patient_id is not None:
        patient = (
            db.query(Paciente)
            .filter(Paciente.id == int(patient_id), Paciente.clinica_id == int(tenant_id))
            .one_or_none()
        )
        if patient is None:
            return _invalid()
        return AgendaPatientIdentity(
            state=AgendaPatientIdentityState.CANONICAL,
            canonical_patient_id=int(patient.id),
            patient=patient,
            proof_source="patient_id",
            external_effect_allowed=True,
        )

    if getattr(event, "nro_pac", None) is not None:
        return AgendaPatientIdentity(
            state=AgendaPatientIdentityState.HISTORICAL_UNRESOLVED_WITH_NRO_PAC,
            proof_source="historical_source_mapping_unavailable",
        )

    return AgendaPatientIdentity(
        state=AgendaPatientIdentityState.HISTORICAL_NULL_IDENTITY_UNKNOWN,
        proof_source="no_patient_identity_source_available",
    )
