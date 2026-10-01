from sqlalchemy import Column, DateTime, ForeignKey, Index, Integer, String
from sqlalchemy.sql import func

from database import Base


class SignatureAuthorization(Base):
    __tablename__ = "signature_authorizations"

    id = Column(Integer, primary_key=True, index=True)
    authorization_id = Column(String(80), nullable=False, unique=True, index=True)
    status = Column(String(16), nullable=False, default="RESERVED", index=True)
    clinica_id = Column(Integer, ForeignKey("clinicas.id"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False, index=True)
    installation_id = Column(String(128), nullable=False, index=True)
    operation_id = Column(String(128), nullable=False, index=True)
    prepared_pdf_sha256 = Column(String(64), nullable=False)
    certificado_der_sha256 = Column(String(64), nullable=False)
    certificate_source = Column(String(32), nullable=False, default="WINDOWS_STORE")
    field_name = Column(String(80), nullable=False)
    policy_oid = Column(String(80), nullable=False)
    issued_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    consumed_at = Column(DateTime(timezone=True), nullable=True)
    revoked_at = Column(DateTime(timezone=True), nullable=True)
    created_by_user_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)

    __table_args__ = (
        Index("uq_signature_authorization_operation", "operation_id", unique=True),
    )
