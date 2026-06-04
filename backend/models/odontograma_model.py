from sqlalchemy import BigInteger, Boolean, Column, Date, DateTime, ForeignKey, Integer, SmallInteger, String, Text, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base


class OdontogramaIntervencaoStatus(Base):
    __tablename__ = "odontograma_intervencao_status"
    __table_args__ = (
        UniqueConstraint("codigo", name="uq_odontograma_intervencao_status_codigo"),
    )

    id = Column(BigInteger, primary_key=True, index=True)
    codigo = Column(String(40), nullable=False, index=True)
    descricao = Column(String(120), nullable=False)
    ordem = Column(SmallInteger, nullable=False)
    ativo = Column(Boolean, nullable=False, default=True)

    criado_em = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    atualizado_em = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    intervencoes = relationship("OdontogramaIntervencao", back_populates="status")


class OdontogramaArcadaSlot(Base):
    __tablename__ = "odontograma_arcada_slots"
    __table_args__ = (
        UniqueConstraint("tratamento_id", "slot_ordem", name="uq_odontograma_arcada_slots_tratamento_ordem"),
    )

    id = Column(BigInteger, primary_key=True, index=True)
    clinica_id = Column(Integer, ForeignKey("clinicas.id"), nullable=False, index=True)
    paciente_id = Column(Integer, ForeignKey("pacientes.id"), nullable=False, index=True)
    tratamento_id = Column(Integer, ForeignKey("tratamento.id", ondelete="CASCADE"), nullable=False, index=True)
    slot_ordem = Column(SmallInteger, nullable=False)
    numero_dente_fdi = Column(Integer, nullable=True)
    tipo_slot = Column(String(30), nullable=False, default="dente")
    observacao = Column(Text, nullable=True)

    criado_em = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    atualizado_em = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    clinica = relationship("Clinica")
    paciente = relationship("Paciente")
    tratamento = relationship("Tratamento")


class OdontogramaIntervencao(Base):
    __tablename__ = "odontograma_intervencoes"

    id = Column(BigInteger, primary_key=True, index=True)
    clinica_id = Column(Integer, ForeignKey("clinicas.id"), nullable=False, index=True)
    paciente_id = Column(Integer, ForeignKey("pacientes.id"), nullable=False, index=True)
    tratamento_id = Column(Integer, ForeignKey("tratamento.id", ondelete="CASCADE"), nullable=False, index=True)
    prestador_id = Column(Integer, ForeignKey("prestador_odonto.id"), nullable=True, index=True)
    procedimento_id = Column(Integer, ForeignKey("procedimento.id"), nullable=False, index=True)
    status_id = Column(BigInteger, ForeignKey("odontograma_intervencao_status.id"), nullable=False, index=True)
    data_planejada = Column(Date, nullable=True)
    data_execucao = Column(Date, nullable=True)
    observacao_resumida = Column(Text, nullable=True)

    criado_em = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    atualizado_em = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    clinica = relationship("Clinica")
    paciente = relationship("Paciente")
    tratamento = relationship("Tratamento")
    prestador = relationship("PrestadorOdonto")
    procedimento = relationship("Procedimento")
    status = relationship("OdontogramaIntervencaoStatus", back_populates="intervencoes")
    dentes = relationship(
        "OdontogramaDente",
        back_populates="intervencao",
        cascade="all, delete-orphan",
    )
    faces = relationship(
        "OdontogramaFace",
        back_populates="intervencao",
        cascade="all, delete-orphan",
    )


class OdontogramaDente(Base):
    __tablename__ = "odontograma_dentes"
    __table_args__ = (
        UniqueConstraint("intervencao_id", "numero_dente_fdi", name="uq_odontograma_dentes_intervencao_dente"),
    )

    id = Column(BigInteger, primary_key=True, index=True)
    clinica_id = Column(Integer, ForeignKey("clinicas.id"), nullable=False, index=True)
    intervencao_id = Column(BigInteger, ForeignKey("odontograma_intervencoes.id", ondelete="CASCADE"), nullable=False, index=True)
    numero_dente_fdi = Column(Integer, nullable=False)
    observacao = Column(Text, nullable=True)

    criado_em = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    atualizado_em = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    clinica = relationship("Clinica")
    intervencao = relationship("OdontogramaIntervencao", back_populates="dentes")


class OdontogramaFace(Base):
    __tablename__ = "odontograma_faces"
    __table_args__ = (
        UniqueConstraint("intervencao_id", "numero_dente_fdi", name="uq_odontograma_faces_intervencao_dente"),
    )

    id = Column(BigInteger, primary_key=True, index=True)
    clinica_id = Column(Integer, ForeignKey("clinicas.id"), nullable=False, index=True)
    intervencao_id = Column(BigInteger, ForeignKey("odontograma_intervencoes.id", ondelete="CASCADE"), nullable=False, index=True)
    numero_dente_fdi = Column(Integer, nullable=False)
    face_mesial = Column(Boolean, nullable=False, default=False)
    face_distal = Column(Boolean, nullable=False, default=False)
    face_oclusal = Column(Boolean, nullable=False, default=False)
    face_vestibular = Column(Boolean, nullable=False, default=False)
    face_lingual = Column(Boolean, nullable=False, default=False)
    observacao = Column(Text, nullable=True)

    criado_em = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    atualizado_em = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    clinica = relationship("Clinica")
    intervencao = relationship("OdontogramaIntervencao", back_populates="faces")
