from datetime import date, datetime

from sqlalchemy import Boolean, Column, Date, DateTime, ForeignKey, Integer, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base


class QuadroAviso(Base):
    __tablename__ = "quadro_avisos"

    id = Column(Integer, primary_key=True, index=True)
    clinica_id = Column(Integer, ForeignKey("clinicas.id"), nullable=False, index=True)
    remetente_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False, index=True)
    destinatario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False, index=True)
    afixado_em = Column(Date, nullable=False, default=date.today, index=True)
    remover_em = Column(Date, nullable=False, index=True)
    texto = Column(Text, nullable=False)
    ativo = Column(Boolean, nullable=False, default=True, index=True)

    criado_em = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    atualizado_em = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    clinica = relationship("Clinica")
    remetente = relationship("Usuario", foreign_keys=[remetente_id])
    destinatario = relationship("Usuario", foreign_keys=[destinatario_id])
