from sqlalchemy import Column, DateTime, ForeignKey, Index, Integer, String, UniqueConstraint, func

from database import Base


class ClinicalPatientLease(Base):
    __tablename__ = "clinical_patient_lease"
    __table_args__ = (
        UniqueConstraint("clinica_id", "paciente_id", name="uq_clinical_patient_lease_clinica_paciente"),
        UniqueConstraint("lease_token", name="uq_clinical_patient_lease_token"),
        Index("ix_clinical_patient_lease_clinica_expires", "clinica_id", "expires_at"),
        Index("ix_clinical_patient_lease_instance_expires", "owner_session_instance_id", "expires_at"),
    )

    id = Column(Integer, primary_key=True, autoincrement=True)
    clinica_id = Column(ForeignKey("clinicas.id"), nullable=False)
    paciente_id = Column(ForeignKey("pacientes.id"), nullable=False)
    owner_usuario_id = Column(ForeignKey("usuarios.id"), nullable=False)
    owner_session_instance_id = Column(
        ForeignKey("authenticated_session_instance.id"), nullable=False
    )
    acquired_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    last_heartbeat_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    lease_token = Column(String(128), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
