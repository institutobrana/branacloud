from datetime import datetime, timezone
from uuid import UUID, uuid4

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import get_db
from models.authenticated_session_instance import AuthenticatedSessionInstance
from models.usuario import Usuario
from security.dependencies import get_current_user

router = APIRouter(prefix="/session-instances", tags=["session-instances"])


class ValidateSessionInstanceRequest(BaseModel):
    instance_id: str


def _valid_uuid(value: str) -> str:
    try:
        return str(UUID(str(value)))
    except (ValueError, TypeError, AttributeError):
        raise HTTPException(status_code=409, detail={"code": "SESSION_INSTANCE_INVALID"})


def _invalid_instance():
    return HTTPException(status_code=409, detail={"code": "SESSION_INSTANCE_INVALID"})


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register_session_instance(
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    instance_id = str(uuid4())
    row = AuthenticatedSessionInstance(
        id=instance_id,
        clinica_id=int(current_user.clinica_id),
        usuario_id=int(current_user.id),
        status="ACTIVE",
    )
    db.add(row)
    db.commit()
    return {"instance_id": instance_id, "status": "ACTIVE"}


@router.post("/validate")
def validate_session_instance(
    payload: ValidateSessionInstanceRequest,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    instance_id = _valid_uuid(payload.instance_id)
    row = db.query(AuthenticatedSessionInstance).filter(
        AuthenticatedSessionInstance.id == instance_id,
        AuthenticatedSessionInstance.status == "ACTIVE",
        AuthenticatedSessionInstance.usuario_id == int(current_user.id),
        AuthenticatedSessionInstance.clinica_id == int(current_user.clinica_id),
    ).first()
    if not row:
        raise _invalid_instance()
    row.last_seen_at = datetime.now(timezone.utc)
    db.commit()
    return {"instance_id": instance_id, "status": "ACTIVE"}
