"""Two-identity reservation protocol; intentionally isolated from backend.main."""

import hashlib
import secrets
from datetime import datetime, timedelta, timezone

from fastapi import HTTPException
from sqlalchemy.orm import Session

from models.signature_reservation_request import SignatureReservationRequest
from models.signature_authorization import SignatureAuthorization
from models.usuario_certificado import UsuarioCertificado
from services.signature_authorization_service import TrustedInstallationIdentity, validate_certificate_source, WINDOWS_STORE


def _now():
    return datetime.now(timezone.utc)


def _aware(value):
    return value if value.tzinfo else value.replace(tzinfo=timezone.utc)


def create_pending_request(db: Session, *, actor, operation_id, prepared_pdf_sha256,
                           certificado_der_sha256, field_name, policy_oid, ttl_seconds=120,
                           certificate_source=WINDOWS_STORE):
    certificate_source = validate_certificate_source(certificate_source)
    if not actor.ativo or actor.is_system_user:
        raise HTTPException(status_code=403, detail="USER_NOT_ACTIVE")
    signing_binding = db.query(UsuarioCertificado).filter(
        UsuarioCertificado.clinica_id == actor.clinica_id,
        UsuarioCertificado.titular_user_id == actor.id,
        UsuarioCertificado.certificado_der_sha256 == certificado_der_sha256.lower(),
        UsuarioCertificado.status == "ACTIVE",
    ).first()
    if not signing_binding:
        raise HTTPException(status_code=403, detail="CERTIFICATE_BINDING_NOT_ACTIVE")
    if db.query(SignatureReservationRequest).filter_by(operation_id=operation_id).first():
        raise HTTPException(status_code=409, detail="OPERATION_ALREADY_RESERVED")
    challenge = secrets.token_urlsafe(32)
    now = _now()
    row = SignatureReservationRequest(
        request_id=secrets.token_urlsafe(24), challenge_hash=hashlib.sha256(challenge.encode()).hexdigest(),
        status="PENDING", clinica_id=actor.clinica_id, user_id=actor.id,
        operation_id=operation_id, prepared_pdf_sha256=prepared_pdf_sha256.lower(),
        certificado_der_sha256=certificado_der_sha256.lower(), field_name=field_name,
        policy_oid=policy_oid, certificate_source=certificate_source,
        expires_at=now + timedelta(seconds=max(1, ttl_seconds)),
    )
    db.add(row); db.commit(); db.refresh(row)
    return row, challenge


def bind_installation(db: Session, *, request_id, challenge, operation_id,
                      prepared_pdf_sha256, certificado_der_sha256,
                      installation: TrustedInstallationIdentity, certificate_source=WINDOWS_STORE):
    certificate_source = validate_certificate_source(certificate_source)
    if not installation or not installation.authenticated:
        raise HTTPException(status_code=503, detail="TRUSTED_INSTALLATION_CHANNEL_REQUIRED")
    row = db.query(SignatureReservationRequest).filter_by(request_id=request_id).with_for_update().first()
    if not row:
        raise HTTPException(status_code=404, detail="RESERVATION_REQUEST_NOT_FOUND")
    if row.status != "PENDING":
        raise HTTPException(status_code=409, detail="CHALLENGE_ALREADY_USED")
    if _aware(row.expires_at) <= _now():
        row.status = "EXPIRED"; db.commit()
        raise HTTPException(status_code=409, detail="CHALLENGE_EXPIRED")
    if hashlib.sha256(str(challenge).encode()).hexdigest() != row.challenge_hash:
        raise HTTPException(status_code=409, detail="CHALLENGE_INVALID")
    if (row.operation_id != operation_id or row.prepared_pdf_sha256 != prepared_pdf_sha256.lower() or
            row.certificado_der_sha256 != certificado_der_sha256.lower() or
            row.certificate_source != certificate_source):
        raise HTTPException(status_code=409, detail="RESERVATION_BINDING_MISMATCH")
    row.status = "RESERVED"; row.installation_id = installation.installation_id
    row.authorization_id = secrets.token_urlsafe(32); row.bound_at = _now()
    db.add(SignatureAuthorization(
        authorization_id=row.authorization_id, status="RESERVED",
        clinica_id=row.clinica_id, user_id=row.user_id,
        installation_id=installation.installation_id, operation_id=row.operation_id,
        prepared_pdf_sha256=row.prepared_pdf_sha256,
        certificado_der_sha256=row.certificado_der_sha256,
        field_name=row.field_name, policy_oid=row.policy_oid, certificate_source=row.certificate_source,
        expires_at=row.expires_at, created_by_user_id=row.user_id,
    ))
    db.commit(); db.refresh(row)
    return row
