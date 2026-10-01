"""Factory for the future authorization router.

It is intentionally not included by ``backend.main``.  The installation
identity dependency must be supplied by an authenticated mTLS adapter; HTTP
headers are never consulted here.
"""

import hashlib
import ssl
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel

from services.signature_authorization_service import (
    TrustedInstallationIdentity, consume_authorization, issue_authorization, reserve_authorization,
)


class AuthorizationIssueRequest(BaseModel):
    password: str
    authorization_id: str | None = None
    operation_id: str
    prepared_pdf_sha256: str
    certificado_der_sha256: str
    field_name: str
    policy_oid: str
    ttl_seconds: int = 120
    certificate_source: str = "WINDOWS_STORE"


class AuthorizationReserveRequest(BaseModel):
    operation_id: str
    prepared_pdf_sha256: str
    certificado_der_sha256: str
    field_name: str
    policy_oid: str
    ttl_seconds: int = 120
    certificate_source: str = "WINDOWS_STORE"


class AuthorizationConsumeRequest(BaseModel):
    authorization_id: str
    operation_id: str
    prepared_pdf_sha256: str
    certificado_der_sha256: str
    field_name: str
    policy_oid: str
    certificate_source: str = "WINDOWS_STORE"


def tls_installation_dependency(registry):
    def dependency(request: Request):
        tls = request.scope.get("extensions", {}).get("tls") or {}
        chain = tls.get("client_cert_chain") or ()
        if not chain or tls.get("client_cert_error"):
            raise HTTPException(status_code=403, detail="TRUSTED_TLS_IDENTITY_REQUIRED")
        try:
            der = ssl.PEM_cert_to_DER_cert(chain[0])
            fingerprint = hashlib.sha256(der).hexdigest()
        except (TypeError, ValueError, ssl.SSLError):
            raise HTTPException(status_code=403, detail="TRUSTED_TLS_CERTIFICATE_INVALID")
        installation_id = registry.lookup_active(fingerprint)
        if installation_id is None:
            raise HTTPException(status_code=403, detail="INSTALLATION_NOT_AUTHORIZED")
        return TrustedInstallationIdentity(installation_id, authenticated=True)
    return dependency


def create_signature_authorization_router(*, get_db, get_actor, installation_registry):
    router = APIRouter(prefix="/v1/signature-authorizations", tags=["isolated-signature-authorization"])
    get_trusted_installation = tls_installation_dependency(installation_registry)

    @router.post("/reserve")
    def reserve(payload: AuthorizationReserveRequest, db=Depends(get_db), actor=Depends(get_actor), installation=Depends(get_trusted_installation)):
        row = reserve_authorization(db, actor=actor, installation=installation,
            operation_id=payload.operation_id, prepared_pdf_sha256=payload.prepared_pdf_sha256,
            certificado_der_sha256=payload.certificado_der_sha256, field_name=payload.field_name,
            policy_oid=payload.policy_oid, ttl_seconds=payload.ttl_seconds,
            certificate_source=payload.certificate_source)
        return {"authorization_id": row.authorization_id, "status": row.status, "expires_at": row.expires_at.isoformat()}

    @router.post("")
    def issue(payload: AuthorizationIssueRequest, db=Depends(get_db), actor=Depends(get_actor), installation=Depends(get_trusted_installation)):
        row = issue_authorization(db, actor=actor, senha=payload.password, installation=installation,
            operation_id=payload.operation_id, prepared_pdf_sha256=payload.prepared_pdf_sha256,
            certificado_der_sha256=payload.certificado_der_sha256, field_name=payload.field_name,
            policy_oid=payload.policy_oid, ttl_seconds=payload.ttl_seconds,
            authorization_id=payload.authorization_id, certificate_source=payload.certificate_source)
        return {"authorization_id": row.authorization_id, "status": row.status, "expires_at": row.expires_at.isoformat()}

    @router.post("/consume")
    def consume(payload: AuthorizationConsumeRequest, db=Depends(get_db), installation=Depends(get_trusted_installation)):
        row = consume_authorization(db, installation=installation, authorization_id=payload.authorization_id,
            operation_id=payload.operation_id,
            prepared_pdf_sha256=payload.prepared_pdf_sha256, certificado_der_sha256=payload.certificado_der_sha256,
            field_name=payload.field_name, policy_oid=payload.policy_oid,
            certificate_source=payload.certificate_source)
        return {"status": row.status, "authorization_id": row.authorization_id}

    return router
