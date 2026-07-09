from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text, UniqueConstraint, func
from sqlalchemy.orm import relationship

from database import Base


class MotivoAgendamento(Base):
    __tablename__ = "motivo_agendamento"
    __table_args__ = (UniqueConstraint("clinica_id", "codigo", name="uq_motivo_agendamento_clinica_codigo"),)

    id = Column(Integer, primary_key=True, index=True)
    clinica_id = Column(Integer, ForeignKey("clinicas.id"), nullable=False, index=True)
    codigo = Column(String(20), nullable=False)
    nome = Column(String(180), nullable=False)
    descricao = Column(Text, nullable=True)
    tipo = Column(String(20), nullable=False)
    cor = Column(String(20), nullable=True)
    compromisso_produtivo = Column(Boolean, nullable=False, default=False)
    inativo = Column(Boolean, nullable=False, default=False)
    criado_em = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    atualizado_em = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    clinica = relationship("Clinica")
