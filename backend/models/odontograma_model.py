from sqlalchemy import BigInteger, Boolean, CheckConstraint, Column, Date, DateTime, ForeignKey, ForeignKeyConstraint, Integer, Numeric, SmallInteger, String, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB
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
    __table_args__ = (
        ForeignKeyConstraint(
            ["clinica_id", "command_id"],
            ["odontograma_comandos.clinica_id", "odontograma_comandos.command_id"],
            name="fk_fc4_ocorrencia_comando",
        ),
        UniqueConstraint("clinica_id", "command_id", "command_unidade", name="uq_fc4_comando_unidade"),
        CheckConstraint("versao > 0", name="ck_fc4_versao"),
        CheckConstraint("alvo_tipo IS NULL OR alvo_tipo IN ('FACE','DENTE','GRUPO','ARCADA','GERAL','SEGMENTO')", name="ck_fc4_alvo_tipo"),
    )

    id = Column(BigInteger, primary_key=True, index=True)
    clinica_id = Column(Integer, ForeignKey("clinicas.id"), nullable=False, index=True)
    paciente_id = Column(Integer, ForeignKey("pacientes.id"), nullable=False, index=True)
    tratamento_id = Column(Integer, ForeignKey("tratamento.id", ondelete="RESTRICT"), nullable=False, index=True)
    prestador_id = Column(Integer, ForeignKey("prestador_odonto.id"), nullable=True, index=True)
    procedimento_id = Column(Integer, ForeignKey("procedimento.id"), nullable=False, index=True)
    status_id = Column(BigInteger, ForeignKey("odontograma_intervencao_status.id"), nullable=False, index=True)
    data_planejada = Column(Date, nullable=True)
    data_execucao = Column(Date, nullable=True)
    observacao_resumida = Column(Text, nullable=True)

    # Nullable-first: V1 is not reclassified/backfilled by this migration.
    # Applied slots reference stable ArcadaSlot.id; never FDI or bitmap.
    alvo_tipo = Column(String(16), nullable=True)
    alvo_slots = Column(JSONB, nullable=True)
    faces_mask = Column(SmallInteger, nullable=True)
    contexto = Column(Text, nullable=True)
    forma_cobranca_aplicada = Column(String(50), nullable=True)
    valor_proprio = Column(Numeric(14, 2), nullable=True)
    repasse_proprio = Column(Numeric(14, 2), nullable=True)
    data_clinica = Column(DateTime(timezone=True), nullable=True)
    criado_por_id = Column(Integer, ForeignKey("usuarios.id"), nullable=True)
    atualizado_por_id = Column(Integer, ForeignKey("usuarios.id"), nullable=True)
    versao = Column(Integer, nullable=False, server_default="1")
    command_id = Column(String(128), nullable=True)
    command_unidade = Column(Integer, nullable=True)

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


class OdontogramaComando(Base):
    """Durable receipt, deliberately without occurrence FK/cascade."""

    __tablename__ = "odontograma_comandos"
    __table_args__ = (
        UniqueConstraint("clinica_id", "command_id", name="uq_fc4_comando"),
    )

    id = Column(BigInteger, primary_key=True)
    clinica_id = Column(Integer, ForeignKey("clinicas.id"), nullable=False)
    command_id = Column(String(128), nullable=False)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    procedimento_id = Column(Integer, ForeignKey("procedimento.id"), nullable=False)
    payload_hash = Column(String(64), nullable=False)
    resultado = Column(JSONB, nullable=True)
    criado_em = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
