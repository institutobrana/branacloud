from __future__ import annotations

from sqlalchemy import text


def apply_compatibilities(conn) -> list[str]:
    applied: list[str] = []
    conn.execute(text("ALTER TABLE IF EXISTS usuarios ADD COLUMN IF NOT EXISTS senha_interna_hash TEXT"))
    applied.append("usuarios.senha_interna_hash")
    conn.execute(text("ALTER TABLE IF EXISTS usuarios ADD COLUMN IF NOT EXISTS setup_completed BOOLEAN NOT NULL DEFAULT FALSE"))
    applied.append("usuarios.setup_completed")
    conn.execute(text("ALTER TABLE IF EXISTS usuarios ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT FALSE"))
    applied.append("usuarios.is_admin")
    conn.execute(text("ALTER TABLE IF EXISTS simbolo_grafico_catalogo ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ"))
    conn.execute(text("ALTER TABLE IF EXISTS anamnese_perguntas ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ"))
    applied.append("simbolo_grafico_catalogo/anamnese_perguntas")
    return applied
