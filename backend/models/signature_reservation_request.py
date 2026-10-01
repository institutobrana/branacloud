from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.sql import func

from database import Base


class SignatureReservationRequest(Base):
    __tablename__ = "signature_reservation_requests"

    id = Column(Integer, primary_key=True)
    request_id = Column(String(80), nullable=False, unique=True, index=True)
    challenge_hash = Column(String(64), nullable=False)
    status = Column(String(16), nullable=False, default="PENDING", index=True)
    clinica_id = Column(Integer, ForeignKey("clinicas.id"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False, index=True)
    operation_id = Column(String(128), nullable=False, unique=True)
    prepared_pdf_sha256 = Column(String(64), nullable=False)
    certificado_der_sha256 = Column(String(64), nullable=False)
    certificate_source = Column(String(32), nullable=False, default="WINDOWS_STORE")
    field_name = Column(String(80), nullable=False)
    policy_oid = Column(String(80), nullable=False)
    installation_id = Column(String(128), nullable=True, index=True)
    authorization_id = Column(String(80), nullable=True, unique=True)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    bound_at = Column(DateTime(timezone=True), nullable=True)
