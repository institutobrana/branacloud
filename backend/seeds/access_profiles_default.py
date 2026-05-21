"""Fonte versionada passiva dos perfis funcionais base para access_profile."""

from __future__ import annotations

DEFAULT_ACCESS_PROFILES_VERSION = "2026-05-usuarios-access-profile-v1"

DEFAULT_ACCESS_PROFILES = (
    {"codigo": "agenda_horarios", "nome": "Agenda de horarios", "ordem": 10, "ativo": True},
    {"codigo": "controle_estoque", "nome": "Controle de estoque", "ordem": 20, "ativo": True},
    {"codigo": "controle_protetico", "nome": "Controle de protetico", "ordem": 30, "ativo": True},
    {"codigo": "controle_recibos", "nome": "Controle de recibos", "ordem": 40, "ativo": True},
    {"codigo": "creditos_conta_corrente", "nome": "Creditos na conta corrente", "ordem": 50, "ativo": True},
    {"codigo": "debitos_conta_corrente", "nome": "Debitos na conta corrente", "ordem": 60, "ativo": True},
    {"codigo": "intervencoes", "nome": "Intervencoes", "ordem": 70, "ativo": True},
    {"codigo": "pacientes", "nome": "Pacientes", "ordem": 80, "ativo": True},
    {"codigo": "relatorios_estatisticos", "nome": "Relatorios estatisticos", "ordem": 90, "ativo": True},
    {"codigo": "relatorios_financeiros", "nome": "Relatorios financeiros", "ordem": 100, "ativo": True},
)


def get_default_access_profiles() -> list[dict]:
    """Return a shallow copy of the versioned functional profile list."""
    return [dict(item) for item in DEFAULT_ACCESS_PROFILES]


def get_default_access_profiles_version() -> str:
    """Return the version tag of the passive functional profile source."""
    return DEFAULT_ACCESS_PROFILES_VERSION

