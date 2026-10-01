from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Index, Integer, LargeBinary, String
from sqlalchemy.sql import func

from database import Base


class UsuarioCertificado(Base):
    """Vínculo auditável entre titular Brana e identidade pública de certificado."""

    __tablename__ = "usuarios_certificados"

    id = Column(Integer, primary_key=True, index=True)
    clinica_id = Column(Integer, ForeignKey("clinicas.id"), nullable=False, index=True)
    titular_user_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False, index=True)
    criado_por_user_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False, index=True)
    revogado_por_user_id = Column(Integer, ForeignKey("usuarios.id"), nullable=True, index=True)

    certificado_der_sha256 = Column(String(64), nullable=False)
    certificate_source = Column(String(32), nullable=False, default="WINDOWS_STORE")
    certificate_der = Column(LargeBinary, nullable=True)
    certificate_subject = Column(String(512), nullable=True)
    certificate_issuer = Column(String(512), nullable=True)
    certificate_serial = Column(String(128), nullable=True)
    certificate_valid_from = Column(DateTime(timezone=True), nullable=True)
    certificate_valid_to = Column(DateTime(timezone=True), nullable=True)
    status = Column(String(16), nullable=False, default="PENDING", index=True)
    tentativas_falhas = Column(Integer, nullable=False, default=0)
    janela_falhas_inicio_em = Column(DateTime(timezone=True), nullable=True)
    bloqueado_ate_em = Column(DateTime(timezone=True), nullable=True)
    criado_em = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    ativado_em = Column(DateTime(timezone=True), nullable=True)
    revogado_em = Column(DateTime(timezone=True), nullable=True)

    __table_args__ = (
        Index(
            "uq_usuario_certificado_ativo",
            "clinica_id",
            "titular_user_id",
            "certificado_der_sha256",
            "certificate_source",
            unique=True,
            postgresql_where=(status == "ACTIVE"),
        ),
    )
