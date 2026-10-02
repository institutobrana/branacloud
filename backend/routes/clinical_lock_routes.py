from fastapi import APIRouter, Depends, Header
from sqlalchemy.orm import Session

from database import get_db
from models.usuario import Usuario
from security.dependencies import get_current_user, require_module_access
from services import clinical_patient_lease_service as lease_service

router = APIRouter(
    prefix="/clinical-locks",
    tags=["clinical-locks"],
    dependencies=[Depends(require_module_access("procedimentos"))],
)


@router.post("/{patient_id}/acquire")
def acquire_lease(
    patient_id: int,
    x_session_instance_id: str = Header(..., alias="X-Session-Instance-Id"),
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return lease_service.acquire(db, current_user, patient_id, x_session_instance_id)


@router.get("/{patient_id}")
def get_lease_status(
    patient_id: int,
    x_session_instance_id: str = Header(..., alias="X-Session-Instance-Id"),
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return lease_service.status(db, current_user, patient_id, x_session_instance_id)


@router.post("/{patient_id}/release")
def release_lease(
    patient_id: int,
    x_session_instance_id: str = Header(..., alias="X-Session-Instance-Id"),
    x_clinical_lease_token: str = Header(..., alias="X-Clinical-Lease-Token"),
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return lease_service.release(db, current_user, patient_id, x_session_instance_id, x_clinical_lease_token)


@router.post("/{patient_id}/heartbeat")
def heartbeat_lease(
    patient_id: int,
    x_session_instance_id: str = Header(..., alias="X-Session-Instance-Id"),
    x_clinical_lease_token: str = Header(..., alias="X-Clinical-Lease-Token"),
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return lease_service.heartbeat(db, current_user, patient_id, x_session_instance_id, x_clinical_lease_token)
