"""Operational authorization router, intentionally not registered by backend.main."""

import re
from fastapi import APIRouter, Depends
from pydantic import BaseModel, validator

from database import get_db
from models.usuario import Usuario
from security.dependencies import get_current_user
from services.signature_authorization_service import (
    TrustedInstallationIdentity, issue_authorization, reserve_authorization,
)

SHA256_RE = re.compile(r"^[0-9a-f]{64}$")


class SignatureAuthorizationPayload(BaseModel):
    operation_id: str
    prepared_pdf_sha256: str
    certificado_der_sha256: str
    field_name: str
    policy_oid: str
    ttl_seconds: int = 120
    certificate_source: str = "WINDOWS_STORE"

    @validator("prepared_pdf_sha256", "certificado_der_sha256")
    def valid_sha256(cls, value):
        value = value.strip().lower()
        if not SHA256_RE.fullmatch(value):
            raise ValueError("hash_sha256_invalido")
        return value

    @validator("operation_id", "field_name", "policy_oid")
    def non_empty(cls, value):
        value = value.strip()
        if not value:
            raise ValueError("campo_obrigatorio")
        return value


class SignatureAuthorizationConfirmation(SignatureAuthorizationPayload):
    authorization_id: str
    password: str


def create_signature_authorization_operational_router(*, installation_dependency, db_dependency=get_db):
    """Build the future operational router without registering it in ``main``.

    ``installation_dependency`` must be supplied by an authenticated transport
    (for example the future mTLS adapter). It must never read browser headers.
    """
    router = APIRouter(prefix="/signature-authorizations", tags=["signature-authorizations"])

    @router.post("/reserve")
    def reserve(
        payload: SignatureAuthorizationPayload,
        actor: Usuario = Depends(get_current_user),
        db=Depends(db_dependency),
        installation: TrustedInstallationIdentity = Depends(installation_dependency),
    ):
        row = reserve_authorization(
            db, actor=actor, installation=installation,
            operation_id=payload.operation_id,
            prepared_pdf_sha256=payload.prepared_pdf_sha256,
            certificado_der_sha256=payload.certificado_der_sha256,
            field_name=payload.field_name, policy_oid=payload.policy_oid,
            ttl_seconds=payload.ttl_seconds, certificate_source=payload.certificate_source,
        )
        return {"authorization_id": row.authorization_id, "status": row.status, "expires_at": row.expires_at.isoformat()}

    @router.post("")
    def confirm(
        payload: SignatureAuthorizationConfirmation,
        actor: Usuario = Depends(get_current_user),
        db=Depends(db_dependency),
    ):
        try:
            row = issue_authorization(
                db, actor=actor, senha=payload.password, installation=None,
                authorization_id=payload.authorization_id,
                operation_id=payload.operation_id,
                prepared_pdf_sha256=payload.prepared_pdf_sha256,
                certificado_der_sha256=payload.certificado_der_sha256,
                field_name=payload.field_name, policy_oid=payload.policy_oid,
                ttl_seconds=payload.ttl_seconds, certificate_source=payload.certificate_source,
            )
            db.commit()
        except HTTPException:
            db.rollback()
            raise
        except Exception as exc:
            db.rollback()
            raise HTTPException(status_code=503, detail="AUTHORIZATION_COMMIT_FAILED") from exc
        return {"authorization_id": row.authorization_id, "status": row.status, "expires_at": row.expires_at.isoformat()}

    return router
