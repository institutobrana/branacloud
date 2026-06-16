from sqlalchemy import Boolean, Column, Integer, String, text

from database import Base


TISS_TIPO_ATENDIMENTO_PADRAO = [
    {"id": 1, "codigo": "1", "nome": "Tratamento Odontológico"},
    {"id": 2, "codigo": "2", "nome": "Exame Radiológico"},
    {"id": 3, "codigo": "3", "nome": "Ortodontia"},
    {"id": 4, "codigo": "4", "nome": "Urgênica/Emergência"},
    {"id": 5, "codigo": "5", "nome": "Auditoria"},
]


class TissTipoAtendimento(Base):
    __tablename__ = "tiss_tipo_atendimento"

    id = Column(Integer, primary_key=True, autoincrement=False)
    codigo = Column(String(15), nullable=False, unique=True, index=True)
    nome = Column(String(100), nullable=False)
    descricao = Column(String(150), nullable=True)
    reservado = Column(Boolean, nullable=False, default=True)
    ativo = Column(Boolean, nullable=False, default=True)


def seed_tiss_tipo_atendimento(conn) -> None:
    for item in TISS_TIPO_ATENDIMENTO_PADRAO:
        conn.execute(
            text(
                """
                INSERT INTO tiss_tipo_atendimento (id, codigo, nome, descricao, reservado, ativo)
                VALUES (:id, :codigo, :nome, NULL, TRUE, TRUE)
                ON CONFLICT (id) DO UPDATE SET
                    codigo = EXCLUDED.codigo,
                    nome = EXCLUDED.nome,
                    ativo = TRUE
                """
            ),
            item,
        )
