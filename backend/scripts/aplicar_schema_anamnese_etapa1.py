"""Script manual para aplicar schema da Anamnese (etapa 1).

Uso:
    python scripts/aplicar_schema_anamnese_etapa1.py

Importante:
- Nao remove colunas antigas.
- Nao altera dados de outros modulos.
- Apenas adiciona/normaliza campos novos de perguntas de anamnese.
"""

import sys
from pathlib import Path

from sqlalchemy import text

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from database import engine


def aplicar_schema_anamnese_etapa1() -> None:
    print("[anamnese-etapa1] Aplicando compatibilidade de schema...")
    with engine.begin() as conn:
        conn.execute(
            text(
                "ALTER TABLE IF EXISTS anamnese_perguntas "
                "ADD COLUMN IF NOT EXISTS tipo_pergunta INTEGER"
            )
        )
        conn.execute(
            text(
                "ALTER TABLE IF EXISTS anamnese_perguntas "
                "ADD COLUMN IF NOT EXISTS tipo_resposta INTEGER"
            )
        )
        conn.execute(
            text(
                "ALTER TABLE IF EXISTS anamnese_perguntas "
                "ADD COLUMN IF NOT EXISTS mensagem_alerta VARCHAR(255)"
            )
        )
        conn.execute(
            text(
                "UPDATE anamnese_perguntas "
                "SET tipo_pergunta = COALESCE(tipo_pergunta, 1), "
                "tipo_resposta = COALESCE(tipo_resposta, 1) "
                "WHERE tipo_pergunta IS NULL OR tipo_resposta IS NULL"
            )
        )
        conn.execute(
            text(
                "ALTER TABLE IF EXISTS anamnese_perguntas "
                "ALTER COLUMN tipo_pergunta SET DEFAULT 1"
            )
        )
        conn.execute(
            text(
                "ALTER TABLE IF EXISTS anamnese_perguntas "
                "ALTER COLUMN tipo_resposta SET DEFAULT 1"
            )
        )
        conn.execute(
            text(
                "ALTER TABLE IF EXISTS anamnese_perguntas "
                "ALTER COLUMN tipo_pergunta SET NOT NULL"
            )
        )
        conn.execute(
            text(
                "ALTER TABLE IF EXISTS anamnese_perguntas "
                "ALTER COLUMN tipo_resposta SET NOT NULL"
            )
        )
    print("[anamnese-etapa1] Schema aplicado com sucesso.")


if __name__ == "__main__":
    aplicar_schema_anamnese_etapa1()
