from datetime import datetime, timedelta, timezone
import secrets

from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from sqlalchemy import func

from models.authenticated_session_instance import AuthenticatedSessionInstance
from models.clinical_patient_lease import ClinicalPatientLease
from models.paciente import Paciente


LEASE_DURATION_SECONDS = 90


def _error(status_code: int, code: str):
    return HTTPException(status_code=status_code, detail={"code": code})


def validate_context(db: Session, current_user, patient_id: int, instance_id: str):
    instance = db.query(AuthenticatedSessionInstance).filter(
        AuthenticatedSessionInstance.id == instance_id,
        AuthenticatedSessionInstance.status == "ACTIVE",
        AuthenticatedSessionInstance.usuario_id == int(current_user.id),
        AuthenticatedSessionInstance.clinica_id == int(current_user.clinica_id),
    ).first()
    if not instance:
        raise _error(409, "SESSION_INSTANCE_INVALID")

    patient = db.query(Paciente).filter(
        Paciente.id == int(patient_id),
        Paciente.clinica_id == int(current_user.clinica_id),
    ).first()
    if not patient:
        raise _error(404, "PATIENT_NOT_FOUND_IN_CLINIC")
    return instance, patient


def _token() -> str:
    return secrets.token_urlsafe(48)


def _expiry():
    return func.current_timestamp() + timedelta(seconds=LEASE_DURATION_SECONDS)


def _payload(state: str, patient_id: int, lease=None, include_token=False):
    result = {"state": state, "patient_id": int(patient_id)}
    if lease is not None:
        result["expires_at"] = lease.expires_at
        if include_token:
            result["lease_token"] = lease.lease_token
    return result


def _restricted_payload(patient_id: int, lease: ClinicalPatientLease, owner_name: str):
    return {
        "state": "RESTRICTED",
        "patient_id": int(patient_id),
        "owner": {"display_name": owner_name or "Usuário"},
        "expires_at": lease.expires_at,
    }


def acquire(db: Session, current_user, patient_id: int, instance_id: str):
    instance, _ = validate_context(db, current_user, patient_id, instance_id)
    clinic_id = int(current_user.clinica_id)
    user_id = int(current_user.id)
    now = datetime.now(timezone.utc)
    token = _token()

    lease = db.query(ClinicalPatientLease).filter(
        ClinicalPatientLease.clinica_id == clinic_id,
        ClinicalPatientLease.paciente_id == int(patient_id),
    ).with_for_update().first()

    created = lease is None
    if created:
        lease = ClinicalPatientLease(
            clinica_id=clinic_id,
            paciente_id=int(patient_id),
            owner_usuario_id=user_id,
            owner_session_instance_id=instance.id,
            acquired_at=func.current_timestamp(),
            last_heartbeat_at=func.current_timestamp(),
            expires_at=func.current_timestamp() + timedelta(seconds=LEASE_DURATION_SECONDS),
            lease_token=token,
            created_at=func.current_timestamp(),
            updated_at=func.current_timestamp(),
        )
        db.add(lease)
        try:
            db.flush()
        except IntegrityError:
            db.rollback()
            lease = db.query(ClinicalPatientLease).filter(
                ClinicalPatientLease.clinica_id == clinic_id,
                ClinicalPatientLease.paciente_id == int(patient_id),
            ).with_for_update().first()

    if not created:
        expired = lease.expires_at <= now
        same_owner = (
            lease.owner_usuario_id == user_id
            and lease.owner_session_instance_id == instance.id
        )
        if expired:
            lease.owner_usuario_id = user_id
            lease.owner_session_instance_id = instance.id
            lease.acquired_at = func.current_timestamp()
            lease.last_heartbeat_at = func.current_timestamp()
            lease.expires_at = func.current_timestamp() + timedelta(seconds=LEASE_DURATION_SECONDS)
            lease.lease_token = token
            lease.updated_at = func.current_timestamp()
        elif same_owner:
            db.commit()
            return _payload("OWNER", patient_id, lease, include_token=True)
        else:
            db.rollback()
            return _restricted_payload(patient_id, lease, lease_owner_name(db, lease))

    db.commit()
    db.refresh(lease)
    return _payload("OWNER", patient_id, lease, include_token=True)


def lease_owner_name(db: Session, lease: ClinicalPatientLease) -> str:
    from models.usuario import Usuario
    owner = db.query(Usuario).filter(Usuario.id == lease.owner_usuario_id).first()
    return (owner.nome if owner else "") or "Usuário"


def status(db: Session, current_user, patient_id: int, instance_id: str):
    instance, _ = validate_context(db, current_user, patient_id, instance_id)
    lease = db.query(ClinicalPatientLease).filter(
        ClinicalPatientLease.clinica_id == int(current_user.clinica_id),
        ClinicalPatientLease.paciente_id == int(patient_id),
    ).first()
    if lease is None or lease.expires_at <= datetime.now(timezone.utc):
        return _payload("AVAILABLE", patient_id)
    if lease.owner_usuario_id == int(current_user.id) and lease.owner_session_instance_id == instance.id:
        return _payload("OWNER", patient_id, lease, include_token=True)
    return _restricted_payload(patient_id, lease, lease_owner_name(db, lease))


def release(db: Session, current_user, patient_id: int, instance_id: str, lease_token: str):
    instance, _ = validate_context(db, current_user, patient_id, instance_id)
    lease = db.query(ClinicalPatientLease).filter(
        ClinicalPatientLease.clinica_id == int(current_user.clinica_id),
        ClinicalPatientLease.paciente_id == int(patient_id),
    ).with_for_update().first()
    if lease is None:
        raise _error(404, "CLINICAL_PATIENT_LEASE_NOT_FOUND")
    if not (
        lease.owner_usuario_id == int(current_user.id)
        and lease.owner_session_instance_id == instance.id
        and secrets.compare_digest(lease.lease_token, lease_token or "")
    ):
        db.rollback()
        raise _error(409, "CLINICAL_PATIENT_LEASE_NOT_OWNER")
    db.delete(lease)
    db.commit()
    return _payload("AVAILABLE", patient_id)
