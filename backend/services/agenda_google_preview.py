"""Shared, read-only rules for Google Calendar agenda preview/export."""

from __future__ import annotations

from datetime import date


MAX_GOOGLE_PREVIEW_DAYS = 31


def resolve_agenda_identity(*, clinica_id: int, agenda_id: int) -> str:
    """Return the stable external identity for one canonical agenda row."""
    return f"b{int(clinica_id)}e{int(agenda_id)}"


def validate_google_period(data_ini: date, data_fim: date) -> None:
    """Validate an inclusive, bounded local-date export window."""
    if data_fim < data_ini:
        raise ValueError("Período de exportação inválido.")
    if (data_fim - data_ini).days + 1 > MAX_GOOGLE_PREVIEW_DAYS:
        raise ValueError("O período máximo para preview é de 31 dias.")
