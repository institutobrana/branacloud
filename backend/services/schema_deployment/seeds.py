from __future__ import annotations

from models.tiss_tipo_atendimento import seed_tiss_tipo_atendimento


def apply_required_seeds(conn) -> list[str]:
    applied: list[str] = []
    seed_tiss_tipo_atendimento(conn)
    applied.append("tiss_tipo_atendimento")
    return applied
