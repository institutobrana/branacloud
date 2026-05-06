"""Script manual para criar compatibilidade do modulo de medicamentos (etapa 1).

Uso:
    python scripts/aplicar_schema_medicamentos.py

Importante:
- Nao executa seed de medicamentos.
- Nao copia dados entre clinicas.
- Apenas cria/ajusta estrutura tenant-aware por clinica.
"""

import sys
from pathlib import Path

from sqlalchemy import text

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from database import engine


def aplicar_schema_medicamentos() -> None:
    print("[medicamentos] Aplicando schema da etapa 1...")
    with engine.begin() as conn:
        conn.execute(
            text(
                """
                CREATE TABLE IF NOT EXISTS medicamento (
                    id SERIAL PRIMARY KEY,
                    clinica_id INTEGER NOT NULL REFERENCES clinicas(id) ON DELETE CASCADE,
                    nome VARCHAR(180) NOT NULL,
                    grupo VARCHAR(120),
                    descricao_substancia VARCHAR(255),
                    apresentacao VARCHAR(120),
                    uso VARCHAR(120),
                    posologia_adulto TEXT,
                    quantidade_padrao_adulto VARCHAR(60),
                    posologia_crianca TEXT,
                    quantidade_padrao_crianca VARCHAR(60),
                    preferido BOOLEAN NOT NULL DEFAULT FALSE,
                    laboratorio VARCHAR(180),
                    observacoes TEXT,
                    advertencias TEXT,
                    inativo BOOLEAN NOT NULL DEFAULT FALSE,
                    criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                    atualizado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
                )
                """
            )
        )
        conn.execute(text("ALTER TABLE medicamento ADD COLUMN IF NOT EXISTS clinica_id INTEGER"))
        conn.execute(text("ALTER TABLE medicamento ADD COLUMN IF NOT EXISTS nome VARCHAR(180)"))
        conn.execute(text("ALTER TABLE medicamento ADD COLUMN IF NOT EXISTS grupo VARCHAR(120)"))
        conn.execute(text("ALTER TABLE medicamento ADD COLUMN IF NOT EXISTS descricao_substancia VARCHAR(255)"))
        conn.execute(text("ALTER TABLE medicamento ADD COLUMN IF NOT EXISTS apresentacao VARCHAR(120)"))
        conn.execute(text("ALTER TABLE medicamento ADD COLUMN IF NOT EXISTS uso VARCHAR(120)"))
        conn.execute(text("ALTER TABLE medicamento ADD COLUMN IF NOT EXISTS posologia_adulto TEXT"))
        conn.execute(text("ALTER TABLE medicamento ADD COLUMN IF NOT EXISTS quantidade_padrao_adulto VARCHAR(60)"))
        conn.execute(text("ALTER TABLE medicamento ADD COLUMN IF NOT EXISTS posologia_crianca TEXT"))
        conn.execute(text("ALTER TABLE medicamento ADD COLUMN IF NOT EXISTS quantidade_padrao_crianca VARCHAR(60)"))
        conn.execute(text("ALTER TABLE medicamento ADD COLUMN IF NOT EXISTS preferido BOOLEAN NOT NULL DEFAULT FALSE"))
        conn.execute(text("ALTER TABLE medicamento ADD COLUMN IF NOT EXISTS laboratorio VARCHAR(180)"))
        conn.execute(text("ALTER TABLE medicamento ADD COLUMN IF NOT EXISTS observacoes TEXT"))
        conn.execute(text("ALTER TABLE medicamento ADD COLUMN IF NOT EXISTS advertencias TEXT"))
        conn.execute(text("ALTER TABLE medicamento ADD COLUMN IF NOT EXISTS inativo BOOLEAN NOT NULL DEFAULT FALSE"))
        conn.execute(
            text(
                "ALTER TABLE medicamento "
                "ADD COLUMN IF NOT EXISTS criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()"
            )
        )
        conn.execute(
            text(
                "ALTER TABLE medicamento "
                "ADD COLUMN IF NOT EXISTS atualizado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()"
            )
        )
        conn.execute(
            text(
                "UPDATE medicamento "
                "SET preferido = COALESCE(preferido, FALSE), "
                "inativo = COALESCE(inativo, FALSE) "
                "WHERE preferido IS NULL OR inativo IS NULL"
            )
        )
        conn.execute(text("CREATE INDEX IF NOT EXISTS ix_medicamento_clinica_id ON medicamento (clinica_id)"))
        conn.execute(text("CREATE INDEX IF NOT EXISTS ix_medicamento_nome ON medicamento (nome)"))
        conn.execute(text("CREATE INDEX IF NOT EXISTS ix_medicamento_grupo ON medicamento (grupo)"))
        conn.execute(
            text(
                """
                DO $$
                BEGIN
                    IF NOT EXISTS (
                        SELECT 1
                        FROM pg_constraint
                        WHERE conname = 'uq_medicamento_clinica_nome'
                    ) THEN
                        ALTER TABLE medicamento
                        ADD CONSTRAINT uq_medicamento_clinica_nome
                        UNIQUE (clinica_id, nome);
                    END IF;
                END$$;
                """
            )
        )

        conn.execute(
            text(
                """
                CREATE TABLE IF NOT EXISTS restricao_terapeutica (
                    id SERIAL PRIMARY KEY,
                    clinica_id INTEGER NOT NULL REFERENCES clinicas(id) ON DELETE CASCADE,
                    paciente_id INTEGER NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
                    medicamento_id INTEGER NOT NULL REFERENCES medicamento(id) ON DELETE CASCADE,
                    criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
                )
                """
            )
        )
        conn.execute(text("ALTER TABLE restricao_terapeutica ADD COLUMN IF NOT EXISTS clinica_id INTEGER"))
        conn.execute(text("ALTER TABLE restricao_terapeutica ADD COLUMN IF NOT EXISTS paciente_id INTEGER"))
        conn.execute(text("ALTER TABLE restricao_terapeutica ADD COLUMN IF NOT EXISTS medicamento_id INTEGER"))
        conn.execute(
            text(
                "ALTER TABLE restricao_terapeutica "
                "ADD COLUMN IF NOT EXISTS criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()"
            )
        )
        conn.execute(
            text(
                "CREATE INDEX IF NOT EXISTS ix_restricao_terapeutica_clinica_id "
                "ON restricao_terapeutica (clinica_id)"
            )
        )
        conn.execute(
            text(
                "CREATE INDEX IF NOT EXISTS ix_restricao_terapeutica_paciente_id "
                "ON restricao_terapeutica (paciente_id)"
            )
        )
        conn.execute(
            text(
                "CREATE INDEX IF NOT EXISTS ix_restricao_terapeutica_medicamento_id "
                "ON restricao_terapeutica (medicamento_id)"
            )
        )
        conn.execute(
            text(
                """
                DO $$
                BEGIN
                    IF NOT EXISTS (
                        SELECT 1
                        FROM pg_constraint
                        WHERE conname = 'uq_restricao_terapeutica_clinica_paciente_medicamento'
                    ) THEN
                        ALTER TABLE restricao_terapeutica
                        ADD CONSTRAINT uq_restricao_terapeutica_clinica_paciente_medicamento
                        UNIQUE (clinica_id, paciente_id, medicamento_id);
                    END IF;
                END$$;
                """
            )
        )
    print("[medicamentos] Schema aplicado com sucesso.")


if __name__ == "__main__":
    aplicar_schema_medicamentos()
