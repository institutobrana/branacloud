import secrets

from fastapi import HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from models.authenticated_session_instance import AuthenticatedSessionInstance
from models.clinical_patient_lease import ClinicalPatientLease
from models.paciente import Paciente
from models.usuario import Usuario


def _error(status_code: int, code: str) -> HTTPException:
    return HTTPException(status_code=status_code, detail={"code": code})


def require_clinical_patient_lease_owner(db: Session, current_user: Usuario, patient_id: int, session_instance_id: str, lease_token: str) -> ClinicalPatientLease:
    patient = db.query(Paciente).filter(Paciente.id == int(patient_id), Paciente.clinica_id == int(current_user.clinica_id)).first()
    if patient is None:
        raise _error(404, "PATIENT_NOT_FOUND_IN_CLINIC")
    instance = db.query(AuthenticatedSessionInstance).filter(
        AuthenticatedSessionInstance.id == session_instance_id,
        AuthenticatedSessionInstance.status == "ACTIVE",
        AuthenticatedSessionInstance.usuario_id == int(current_user.id),
        AuthenticatedSessionInstance.clinica_id == int(current_user.clinica_id),
    ).first()
    if instance is None:
        raise _error(409, "SESSION_INSTANCE_INVALID")
    lease = db.query(ClinicalPatientLease).filter(
        ClinicalPatientLease.clinica_id == int(current_user.clinica_id),
        ClinicalPatientLease.paciente_id == int(patient_id),
    ).with_for_update().first()
    if lease is None:
        raise _error(409, "CLINICAL_PATIENT_LEASE_LOST")
    active = db.query(ClinicalPatientLease.expires_at > func.current_timestamp()).filter(ClinicalPatientLease.id == lease.id).scalar()
    if not active:
        raise _error(409, "CLINICAL_PATIENT_LEASE_LOST")
    if not (lease.owner_usuario_id == int(current_user.id) and lease.owner_session_instance_id == instance.id and secrets.compare_digest(lease.lease_token, lease_token or "")):
        raise _error(409, "CLINICAL_PATIENT_LEASE_NOT_OWNER")
    return lease
