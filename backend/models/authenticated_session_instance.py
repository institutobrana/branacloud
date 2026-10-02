from sqlalchemy import Column, DateTime, ForeignKey, Index, String, func

from database import Base


class AuthenticatedSessionInstance(Base):
    __tablename__ = "authenticated_session_instance"
    __table_args__ = (
        Index("ix_authenticated_session_instance_clinica_id", "clinica_id"),
        Index("ix_authenticated_session_instance_usuario_id", "usuario_id"),
        Index("ix_authenticated_session_instance_status", "status"),
        Index("ix_authenticated_session_instance_last_seen_at", "last_seen_at"),
    )

    id = Column(String(36), primary_key=True)
    clinica_id = Column(ForeignKey("clinicas.id"), nullable=False)
    usuario_id = Column(ForeignKey("usuarios.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    last_seen_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    invalidated_at = Column(DateTime(timezone=True), nullable=True)
    status = Column(String(16), nullable=False, server_default="ACTIVE")
