from __future__ import annotations


def agenda_event_snapshot_name(evento) -> str:
    return str(getattr(evento, "nome", "") or "").strip()


def agenda_patient_display_name(paciente) -> str:
    if not paciente:
        return ""
    return str((getattr(paciente, "nome_completo", None) or None) or (getattr(paciente, "nome", None) or "") or "").strip()


def resolve_agenda_display_name(evento, paciente) -> str:
    snapshot_nome = agenda_event_snapshot_name(evento)
    if snapshot_nome:
        return snapshot_nome
    return agenda_patient_display_name(paciente)
