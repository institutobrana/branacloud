from __future__ import annotations

from .inspector import inspect_schema_state
from .baseline import baseline_steps


def build_plan(engine) -> dict:
    state = inspect_schema_state(engine)
    return {
        "state": state,
        "blocked": bool(state["unexpected_tables"]) and not state["is_empty"],
        "steps": baseline_steps(),
    }


def format_plan(plan: dict) -> str:
    state = plan["state"]
    lines = [
        f"Banco vazio: {'sim' if state['is_empty'] else 'nao'}",
        f"Tabelas esperadas: {len(state['expected_tables'])}",
        f"Tabelas existentes: {len(state['existing_tables'])}",
    ]
    if state["missing_tables"]:
        lines.append("Ausentes: " + ", ".join(state["missing_tables"]))
    if state["unexpected_tables"]:
        lines.append("Inesperadas: " + ", ".join(state["unexpected_tables"]))
    lines.append("Etapas previstas:")
    lines.extend(f"- {item}" for item in plan["steps"])
    if plan["blocked"]:
        lines.append("Bloqueio: estado parcialmente conhecido com tabelas inesperadas.")
    return "\n".join(lines)
