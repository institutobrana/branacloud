"""Migration minima V1 do odontograma Brana.

Uso:
    python scripts/aplicar_migracao_odontograma_v1.py

Escopo:
- cria apenas a estrutura persistente minima da V1;
- nao cria rotas, services, telas ou integracoes de frontend;
- nao altera o que ja existe fora do odontograma;
- pode ser executada novamente com seguranca, pois usa DDL idempotente.
"""

from __future__ import annotations

import sys
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import text


BACKEND_DIR = Path(__file__).resolve().parents[1]

if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

load_dotenv(BACKEND_DIR / ".env")

from database import engine  # noqa: E402


def _executar_statements(conn, statements: list[str]) -> None:
    for statement in statements:
        conn.execute(text(statement))


def aplicar_migracao_odontograma_v1() -> None:
    print("[odontograma-v1] Iniciando migration minima...")

    ddl_statements = [
        """
        CREATE TABLE IF NOT EXISTS odontograma_intervencao_status (
            id BIGSERIAL PRIMARY KEY,
            codigo VARCHAR(40) NOT NULL,
            descricao VARCHAR(120) NOT NULL,
            ordem SMALLINT NOT NULL,
            ativo BOOLEAN NOT NULL DEFAULT TRUE,
            criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            CONSTRAINT uq_odontograma_intervencao_status_codigo UNIQUE (codigo)
        )
        """,
        """
        CREATE TABLE IF NOT EXISTS odontograma_arcada_slots (
            id BIGSERIAL PRIMARY KEY,
            clinica_id INTEGER NOT NULL REFERENCES clinicas(id),
            paciente_id INTEGER NOT NULL REFERENCES pacientes(id),
            tratamento_id INTEGER NOT NULL REFERENCES tratamento(id) ON DELETE CASCADE,
            slot_ordem SMALLINT NOT NULL,
            numero_dente_fdi INTEGER NULL,
            tipo_slot VARCHAR(30) NOT NULL DEFAULT 'dente',
            observacao TEXT NULL,
            criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            CONSTRAINT uq_odontograma_arcada_slots_tratamento_ordem UNIQUE (tratamento_id, slot_ordem)
        )
        """,
        """
        CREATE TABLE IF NOT EXISTS odontograma_intervencoes (
            id BIGSERIAL PRIMARY KEY,
            clinica_id INTEGER NOT NULL REFERENCES clinicas(id),
            paciente_id INTEGER NOT NULL REFERENCES pacientes(id),
            tratamento_id INTEGER NOT NULL REFERENCES tratamento(id) ON DELETE CASCADE,
            prestador_id INTEGER NULL REFERENCES prestador_odonto(id),
            procedimento_id INTEGER NOT NULL REFERENCES procedimento(id),
            status_id BIGINT NOT NULL REFERENCES odontograma_intervencao_status(id),
            data_planejada DATE NULL,
            data_execucao DATE NULL,
            observacao_resumida TEXT NULL,
            criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
        """,
        """
        CREATE TABLE IF NOT EXISTS odontograma_dentes (
            id BIGSERIAL PRIMARY KEY,
            clinica_id INTEGER NOT NULL REFERENCES clinicas(id),
            intervencao_id BIGINT NOT NULL REFERENCES odontograma_intervencoes(id) ON DELETE CASCADE,
            numero_dente_fdi INTEGER NOT NULL,
            observacao TEXT NULL,
            criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            CONSTRAINT uq_odontograma_dentes_intervencao_dente UNIQUE (intervencao_id, numero_dente_fdi)
        )
        """,
        """
        CREATE TABLE IF NOT EXISTS odontograma_faces (
            id BIGSERIAL PRIMARY KEY,
            clinica_id INTEGER NOT NULL REFERENCES clinicas(id),
            intervencao_id BIGINT NOT NULL REFERENCES odontograma_intervencoes(id) ON DELETE CASCADE,
            numero_dente_fdi INTEGER NOT NULL,
            face_mesial BOOLEAN NOT NULL DEFAULT FALSE,
            face_distal BOOLEAN NOT NULL DEFAULT FALSE,
            face_oclusal BOOLEAN NOT NULL DEFAULT FALSE,
            face_vestibular BOOLEAN NOT NULL DEFAULT FALSE,
            face_lingual BOOLEAN NOT NULL DEFAULT FALSE,
            observacao TEXT NULL,
            criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            CONSTRAINT uq_odontograma_faces_intervencao_dente UNIQUE (intervencao_id, numero_dente_fdi)
        )
        """,
        """
        CREATE INDEX IF NOT EXISTS idx_odontograma_arcada_slots_clinica_paciente_tratamento
            ON odontograma_arcada_slots (clinica_id, paciente_id, tratamento_id)
        """,
        """
        CREATE INDEX IF NOT EXISTS idx_odontograma_intervencoes_clinica_paciente_tratamento
            ON odontograma_intervencoes (clinica_id, paciente_id, tratamento_id)
        """,
        """
        CREATE INDEX IF NOT EXISTS idx_odontograma_intervencoes_status
            ON odontograma_intervencoes (status_id)
        """,
        """
        CREATE INDEX IF NOT EXISTS idx_odontograma_dentes_intervencao
            ON odontograma_dentes (intervencao_id)
        """,
        """
        CREATE INDEX IF NOT EXISTS idx_odontograma_faces_intervencao
            ON odontograma_faces (intervencao_id)
        """,
        """
        INSERT INTO odontograma_intervencao_status (codigo, descricao, ordem, ativo)
        VALUES
            ('observada', 'Observada', 1, TRUE),
            ('realizar', 'Realizar', 2, TRUE),
            ('realizada', 'Realizada', 3, TRUE)
        ON CONFLICT (codigo) DO UPDATE
        SET descricao = EXCLUDED.descricao,
            ordem = EXCLUDED.ordem,
            ativo = EXCLUDED.ativo,
            atualizado_em = NOW()
        """,
    ]

    with engine.begin() as conn:
        _executar_statements(conn, ddl_statements)

    print("[odontograma-v1] Migration minima aplicada com sucesso.")


if __name__ == "__main__":
    aplicar_migracao_odontograma_v1()
