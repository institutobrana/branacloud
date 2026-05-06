from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base


class Medicamento(Base):
    __tablename__ = "medicamento"
    __table_args__ = (
        UniqueConstraint("clinica_id", "nome", name="uq_medicamento_clinica_nome"),
    )

    id = Column(Integer, primary_key=True, index=True)
    clinica_id = Column(Integer, ForeignKey("clinicas.id", ondelete="CASCADE"), nullable=False, index=True)

    nome = Column(String(180), nullable=False, index=True)
    grupo = Column(String(120), nullable=True, index=True)
    descricao_substancia = Column(String(255), nullable=True)

    apresentacao = Column(String(120), nullable=True)
    uso = Column(String(120), nullable=True)

    posologia_adulto = Column(Text, nullable=True)
    quantidade_padrao_adulto = Column(String(60), nullable=True)

    posologia_crianca = Column(Text, nullable=True)
    quantidade_padrao_crianca = Column(String(60), nullable=True)

    preferido = Column(Boolean, nullable=False, default=False)

    laboratorio = Column(String(180), nullable=True)
    observacoes = Column(Text, nullable=True)
    advertencias = Column(Text, nullable=True)

    inativo = Column(Boolean, nullable=False, default=False)

    criado_em = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    atualizado_em = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    clinica = relationship("Clinica")


class RestricaoTerapeutica(Base):
    __tablename__ = "restricao_terapeutica"
    __table_args__ = (
        UniqueConstraint(
            "clinica_id",
            "paciente_id",
            "medicamento_id",
            name="uq_restricao_terapeutica_clinica_paciente_medicamento",
        ),
    )

    id = Column(Integer, primary_key=True, index=True)
    clinica_id = Column(Integer, ForeignKey("clinicas.id", ondelete="CASCADE"), nullable=False, index=True)
    paciente_id = Column(Integer, ForeignKey("pacientes.id", ondelete="CASCADE"), nullable=False, index=True)
    medicamento_id = Column(Integer, ForeignKey("medicamento.id", ondelete="CASCADE"), nullable=False, index=True)

    criado_em = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    clinica = relationship("Clinica")
    paciente = relationship("Paciente")
    medicamento = relationship("Medicamento")
