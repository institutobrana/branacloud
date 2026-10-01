"""Isolated two-identity reservation router; never included by backend.main."""

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from database import get_db
from models.usuario import Usuario
from models.signature_reservation_request import SignatureReservationRequest
from security.dependencies import get_current_user
from services.signature_reservation_challenge_service import create_pending_request, bind_installation


class PendingRequestPayload(BaseModel):
    operation_id: str
    prepared_pdf_sha256: str
    certificado_der_sha256: str
    field_name: str
    policy_oid: str
    ttl_seconds: int = 120
    certificate_source: str = "WINDOWS_STORE"


class BindPayload(PendingRequestPayload):
    request_id: str
    challenge: str


def create_signature_reservation_challenge_router(*, installation_dependency, db_dependency=get_db):
    router = APIRouter(prefix="/signature-reservation-requests", tags=["isolated-signature-reservation"])

    @router.post("")
    def create(payload: PendingRequestPayload, actor: Usuario = Depends(get_current_user), db=Depends(db_dependency)):
        row, challenge = create_pending_request(db, actor=actor, **payload.dict())
        return {"request_id": row.request_id, "challenge": challenge, "status": row.status, "expires_at": row.expires_at.isoformat()}

    @router.post("/bind-installation")
    def bind(payload: BindPayload, db=Depends(db_dependency), installation=Depends(installation_dependency)):
        row = bind_installation(db, request_id=payload.request_id, challenge=payload.challenge,
            operation_id=payload.operation_id, prepared_pdf_sha256=payload.prepared_pdf_sha256,
            certificado_der_sha256=payload.certificado_der_sha256, installation=installation,
            certificate_source=payload.certificate_source)
        return {"request_id": row.request_id, "authorization_id": row.authorization_id, "status": row.status, "installation_id": row.installation_id}

    @router.get("/{request_id}")
    def get_request(request_id: str, actor: Usuario = Depends(get_current_user), db=Depends(db_dependency)):
        row = db.query(SignatureReservationRequest).filter_by(request_id=request_id, user_id=actor.id, clinica_id=actor.clinica_id).first()
        if not row:
            from fastapi import HTTPException
            raise HTTPException(status_code=404, detail="RESERVATION_REQUEST_NOT_FOUND")
        return {"request_id": row.request_id, "authorization_id": row.authorization_id, "status": row.status, "operation_id": row.operation_id, "expires_at": row.expires_at.isoformat()}

    return router
