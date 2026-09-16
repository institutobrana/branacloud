from sqlalchemy import Column, Date, DateTime, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base


class HistoricoPaciente(Base):
    __tablename__ = "historico_paciente"
    __table_args__ = (
        UniqueConstraint("clinica_id", "source_id", name="uq_historico_paciente_clinica_source"),
    )

    id = Column(Integer, primary_key=True, index=True)
    clinica_id = Column(Integer, ForeignKey("clinicas.id"), nullable=False, index=True)
    paciente_id = Column(Integer, ForeignKey("pacientes.id"), nullable=False, index=True)
    prestador_id = Column(Integer, ForeignKey("prestador_odonto.id"), nullable=False, index=True)
    source_id = Column(Integer, nullable=True, index=True)
    source_intervencao_id = Column(Integer, nullable=True, index=True)

    data = Column(Date, nullable=False, index=True)
    # Brana must preserve free-text regions that exceed the legacy varchar(15).
    regiao = Column(String(80), nullable=True)
    descricao = Column(Text, nullable=False)
    cor = Column(Integer, nullable=False, default=16777215, server_default="16777215")

    criado_em = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    atualizado_em = Column(DateTime(timezone=True), nullable=True, onupdate=func.now())
    criado_por_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False, index=True)
    atualizado_por_id = Column(Integer, ForeignKey("usuarios.id"), nullable=True, index=True)

    clinica = relationship("Clinica")
    paciente = relationship("Paciente")
    prestador = relationship("PrestadorOdonto")
    criado_por = relationship("Usuario", foreign_keys=[criado_por_id])
    atualizado_por = relationship("Usuario", foreign_keys=[atualizado_por_id])
