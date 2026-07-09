from __future__ import annotations

"""Carga inicial controlada para Motivos de agendamento."""

from pathlib import Path
import sys

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from sqlalchemy import text  # noqa: E402

from database import engine  # noqa: E402


TARGET_ITEMS = [
    {"codigo": "CUR", "nome": "Curso", "descricao": None, "cor": "#0000FF"},
    {"codigo": "INI", "nome": "Consulta inicial", "descricao": None, "cor": "#FFFFFF"},
    {"codigo": "OUT", "nome": "Outros", "descricao": None, "cor": "#FFFF00"},
    {"codigo": "RET", "nome": "Consulta de retorno", "descricao": None, "cor": "#FFFFFF"},
    {"codigo": "REU", "nome": "Reunião", "descricao": None, "cor": "#FFFF00"},
    {"codigo": "TRA", "nome": "Tratamento", "descricao": None, "cor": "#FFFFFF"},
    {"codigo": "URG", "nome": "Urgência", "descricao": None, "cor": "#FFFFFF"},
]


def _sync_clinica(conn, clinica_id: int) -> dict[str, int]:
    rows = conn.execute(
        text(
            """
            SELECT id, codigo
            FROM motivo_agendamento
            WHERE clinica_id = :clinica_id
            ORDER BY id ASC
            """
        ),
        {"clinica_id": int(clinica_id)},
    ).fetchall()
    existing = {str(row.codigo or "").strip().upper(): int(row.id) for row in rows if str(row.codigo or "").strip()}
    extras = [int(row.id) for row in rows if str(row.codigo or "").strip().upper() not in {item["codigo"] for item in TARGET_ITEMS}]

    criados = 0
    atualizados = 0
    removidos = 0

    for target in TARGET_ITEMS:
        codigo = target["codigo"]
        item_id = existing.get(codigo)
        if item_id is None and extras:
            item_id = extras.pop(0)
        if item_id is None:
            conn.execute(
                text(
                    """
                    INSERT INTO motivo_agendamento (
                        clinica_id, codigo, nome, descricao, tipo, cor, compromisso_produtivo, inativo
                    ) VALUES (
                        :clinica_id, :codigo, :nome, :descricao, 'compromisso', :cor, TRUE, FALSE
                    )
                    """
                ),
                {
                    "clinica_id": int(clinica_id),
                    "codigo": codigo,
                    "nome": target["nome"],
                    "descricao": target["descricao"],
                    "cor": target["cor"],
                },
            )
            criados += 1
        else:
            conn.execute(
                text(
                    """
                    UPDATE motivo_agendamento
                    SET codigo = :codigo,
                        nome = :nome,
                        descricao = :descricao,
                        tipo = 'compromisso',
                        cor = :cor,
                        compromisso_produtivo = TRUE,
                        inativo = FALSE,
                        atualizado_em = now()
                    WHERE id = :id
                    """
                ),
                {
                    "id": item_id,
                    "codigo": codigo,
                    "nome": target["nome"],
                    "descricao": target["descricao"],
                    "cor": target["cor"],
                },
            )
            atualizados += 1

    for extra_id in extras:
        conn.execute(
            text("DELETE FROM motivo_agendamento WHERE id = :id"),
            {"id": extra_id},
        )
        removidos += 1

    return {"criados": criados, "atualizados": atualizados, "removidos": removidos}


def main() -> None:
    resumo = {}
    with engine.begin() as conn:
        clinicas = conn.execute(text("SELECT id FROM clinicas ORDER BY id ASC")).fetchall()
        for row in clinicas:
            clinica_id = int(row.id)
            resumo[clinica_id] = _sync_clinica(conn, clinica_id)

    print("[seed] Motivos de agendamento sincronizados com sucesso.")
    print(resumo)


if __name__ == "__main__":
    main()
