from __future__ import annotations

from typing import Any

from .inspector import inspect_tenant_state


def build_plan(session, spec) -> dict[str, Any]:
    state = inspect_tenant_state(session, spec)
    blockers = []
    if not state["schema_ready"]:
        blockers.append("schema_nao_aplicado")
    if not state["baseline_applied"]:
        blockers.append("baseline_schema_nao_aplicada")
    if state["clinicas_count"] and state["usuarios_count"]:
        blockers.append("tenant_ja_existe")
    if state["email_exists"]:
        blockers.append("email_ja_existente")
    if state["provider_code_exists"]:
        blockers.append("codigo_prestador_ja_existente")
    return {
        "state": state,
        "blockers": blockers,
        "objects_to_create": [
            "clinica",
            "unidade_atendimento",
            "prestador_odonto",
            "access_profile(admin)",
            "usuario administrador",
            "usuario_perfil_acesso",
        ],
    }


def format_plan(plan: dict[str, Any]) -> str:
    state = plan["state"]
    lines = [
        f"Baseline schema aplicada: {'sim' if state['baseline_applied'] else 'nao'}",
        f"Tabelas existentes: {state['expected_tables']}",
        f"Clinicas: {state['clinicas_count']}",
        f"Usuarios: {state['usuarios_count']}",
        f"Unidades: {state['unidades_count']}",
        f"Prestadores: {state['prestadores_count']}",
        f"Perfil admin nativo existe: {'sim' if state['admin_profile'] else 'nao'}",
        f"E-mail desejado existe: {'sim' if state['email_exists'] else 'nao'}",
        f"Codigo de prestador desejado existe: {'sim' if state['provider_code_exists'] else 'nao'}",
        "Objetos previstos:",
    ]
    lines.extend(f"- {item}" for item in plan["objects_to_create"])
    if plan["blockers"]:
        lines.append("Bloqueios: " + ", ".join(plan["blockers"]))
    return "\n".join(lines)
