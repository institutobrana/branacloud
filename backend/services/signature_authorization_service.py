"""Documento-bound authorization service, deliberately not registered in main.py."""

from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
import secrets

from fastapi import HTTPException
from sqlalchemy.orm import Session

from models.signature_authorization import SignatureAuthorization
from models.usuario import Usuario
from models.usuario_certificado import UsuarioCertificado
from security.hash import verify_password

WINDOWS_STORE = "WINDOWS_STORE"
FILE_PKCS12 = "FILE_PKCS12"


def validate_certificate_source(source: str) -> str:
    normalized = str(source or "").strip().upper()
    if normalized not in {WINDOWS_STORE, FILE_PKCS12}:
        raise HTTPException(status_code=400, detail="CERTIFICATE_SOURCE_REQUIRED")
    if normalized == FILE_PKCS12:
        raise HTTPException(status_code=409, detail="FILE_PKCS12_SIGNER_NOT_CONFIGURED")
    return normalized



@dataclass(frozen=True)
class TrustedInstallationIdentity:
    """Must be created by a future authenticated transport, never from HTTP input."""

    installation_id: str
    authenticated: bool = False


def _now():
    return datetime.now(timezone.utc)


def _aware(value):
    return value if value is None or value.tzinfo else value.replace(tzinfo=timezone.utc)


def issue_authorization(
    db: Session,
    *,
    actor: Usuario,
    senha: str,
    installation: TrustedInstallationIdentity,
    operation_id: str,
    prepared_pdf_sha256: str,
    certificado_der_sha256: str,
    field_name: str,
    policy_oid: str,
    ttl_seconds: int = 120,
    authorization_id: str | None = None,
    certificate_source: str = WINDOWS_STORE,
):
    certificate_source = validate_certificate_source(certificate_source)
    if authorization_id is not None and installation is None:
        row = db.query(SignatureAuthorization).filter(
            SignatureAuthorization.authorization_id == authorization_id,
        ).with_for_update().first()
        if not row or row.status != "RESERVED":
            raise HTTPException(status_code=409, detail="AUTHORIZATION_NOT_RESERVED")
        actor_binding = db.query(UsuarioCertificado).filter(
            UsuarioCertificado.clinica_id == actor.clinica_id,
            UsuarioCertificado.titular_user_id == actor.id,
            UsuarioCertificado.certificado_der_sha256 == row.certificado_der_sha256,
            UsuarioCertificado.certificate_source == row.certificate_source,
            UsuarioCertificado.status == "ACTIVE",
        ).first()
        if not actor_binding or row.user_id != actor.id or row.clinica_id != actor.clinica_id:
            raise HTTPException(status_code=403, detail="AUTHORIZATION_OWNER_MISMATCH")
        now = _now()
        if row.expires_at and _aware(row.expires_at) <= now:
            raise HTTPException(status_code=409, detail="AUTHORIZATION_EXPIRED")
        if actor_binding.bloqueado_ate_em and _aware(actor_binding.bloqueado_ate_em) > now:
            raise HTTPException(status_code=423, detail="TITULAR_REAUTH_LOCKED")
        if not actor.ativo or actor.is_system_user or not verify_password(senha, actor.senha_hash):
            start = _aware(actor_binding.janela_falhas_inicio_em)
            if not start or now - start >= timedelta(minutes=15):
                actor_binding.janela_falhas_inicio_em = now
                actor_binding.tentativas_falhas = 0
            actor_binding.tentativas_falhas += 1
            if actor_binding.tentativas_falhas >= 5:
                actor_binding.bloqueado_ate_em = now + timedelta(minutes=15)
            db.commit()
            raise HTTPException(status_code=401, detail="INVALID_TITULAR_PASSWORD")
        if any((row.operation_id != operation_id,
                row.prepared_pdf_sha256 != prepared_pdf_sha256.lower(),
                row.certificado_der_sha256 != certificado_der_sha256.lower(),
                row.certificate_source != certificate_source,
                row.field_name != field_name,
                row.policy_oid != policy_oid)):
            raise HTTPException(status_code=409, detail="AUTHORIZATION_BINDING_MISMATCH")
        row.status = "ISSUED"
        row.expires_at = now + timedelta(seconds=max(1, ttl_seconds))
        db.flush()
        return row
    if not installation or not installation.authenticated:
        raise HTTPException(status_code=503, detail="TRUSTED_INSTALLATION_CHANNEL_REQUIRED")
    binding = db.query(UsuarioCertificado).filter(
        UsuarioCertificado.clinica_id == actor.clinica_id,
        UsuarioCertificado.titular_user_id == actor.id,
        UsuarioCertificado.certificado_der_sha256 == certificado_der_sha256.lower(),
        UsuarioCertificado.certificate_source == certificate_source,
        UsuarioCertificado.status == "ACTIVE",
    ).first()
    if not binding:
        raise HTTPException(status_code=403, detail="CERTIFICATE_BINDING_NOT_ACTIVE")
    now = _now()
    if binding.bloqueado_ate_em and _aware(binding.bloqueado_ate_em) > now:
        raise HTTPException(status_code=423, detail="TITULAR_REAUTH_LOCKED")
    if not actor.ativo or actor.is_system_user or not verify_password(senha, actor.senha_hash):
        start = _aware(binding.janela_falhas_inicio_em)
        if not start or now - start >= timedelta(minutes=15):
            binding.janela_falhas_inicio_em = now
            binding.tentativas_falhas = 0
        binding.tentativas_falhas += 1
        if binding.tentativas_falhas >= 5:
            binding.bloqueado_ate_em = now + timedelta(minutes=15)
        db.commit()
        raise HTTPException(status_code=401, detail="INVALID_SIGNING_CREDENTIALS")
    if authorization_id is not None:
        row = db.query(SignatureAuthorization).filter(
            SignatureAuthorization.authorization_id == authorization_id,
        ).with_for_update().first()
        if not row or row.status != "RESERVED":
            raise HTTPException(status_code=409, detail="AUTHORIZATION_NOT_RESERVED")
        immutable = (
            row.clinica_id == actor.clinica_id,
            row.user_id == actor.id,
            row.installation_id == installation.installation_id,
            row.operation_id == operation_id,
            row.prepared_pdf_sha256 == prepared_pdf_sha256.lower(),
            row.certificado_der_sha256 == certificado_der_sha256.lower(),
            row.certificate_source == certificate_source,
            row.field_name == field_name,
            row.policy_oid == policy_oid,
        )
        if not all(immutable):
            raise HTTPException(status_code=409, detail="AUTHORIZATION_BINDING_MISMATCH")
        row.status = "ISSUED"
        row.expires_at = now + timedelta(seconds=max(1, ttl_seconds))
        db.flush()
        return row
    row = SignatureAuthorization(
        authorization_id=secrets.token_urlsafe(32), status="ISSUED",
        clinica_id=actor.clinica_id, user_id=actor.id,
        installation_id=installation.installation_id, operation_id=operation_id,
        prepared_pdf_sha256=prepared_pdf_sha256.lower(),
        certificado_der_sha256=certificado_der_sha256.lower(),
        field_name=field_name, policy_oid=policy_oid, certificate_source=certificate_source,
        expires_at=now + timedelta(seconds=max(1, ttl_seconds)),
        created_by_user_id=actor.id,
    )
    db.add(row); db.flush()
    return row


def reserve_authorization(
    db: Session,
    *,
    actor: Usuario,
    installation: TrustedInstallationIdentity,
    operation_id: str,
    prepared_pdf_sha256: str,
    certificado_der_sha256: str,
    field_name: str,
    policy_oid: str,
    ttl_seconds: int = 120,
    certificate_source: str = WINDOWS_STORE,
):
    """Bind an authorization ID without granting permission to sign."""
    certificate_source = validate_certificate_source(certificate_source)
    if not installation.authenticated:
        raise HTTPException(status_code=503, detail="TRUSTED_INSTALLATION_CHANNEL_REQUIRED")
    binding = db.query(UsuarioCertificado).filter(
        UsuarioCertificado.clinica_id == actor.clinica_id,
        UsuarioCertificado.titular_user_id == actor.id,
        UsuarioCertificado.certificado_der_sha256 == certificado_der_sha256.lower(),
        UsuarioCertificado.status == "ACTIVE",
    ).first()
    if not binding:
        raise HTTPException(status_code=403, detail="CERTIFICATE_BINDING_NOT_ACTIVE")
    existing = db.query(SignatureAuthorization).filter(
        SignatureAuthorization.operation_id == operation_id,
        SignatureAuthorization.status.in_(["RESERVED", "ISSUED"]),
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail="AUTHORIZATION_ALREADY_RESERVED")
    row = SignatureAuthorization(
        authorization_id=secrets.token_urlsafe(32), status="RESERVED",
        clinica_id=actor.clinica_id, user_id=actor.id,
        installation_id=installation.installation_id, operation_id=operation_id,
        prepared_pdf_sha256=prepared_pdf_sha256.lower(),
        certificado_der_sha256=certificado_der_sha256.lower(),
        field_name=field_name, policy_oid=policy_oid,
        certificate_source=certificate_source,
        expires_at=_now() + timedelta(seconds=max(1, ttl_seconds)),
        created_by_user_id=actor.id,
    )
    db.add(row); db.flush()
    return row


def consume_authorization(
    db: Session,
    *,
    authorization_id: str,
    installation: TrustedInstallationIdentity | None,
    operation_id: str,
    prepared_pdf_sha256: str,
    certificado_der_sha256: str,
    field_name: str,
    policy_oid: str,
    certificate_source: str = WINDOWS_STORE,
):
    certificate_source = validate_certificate_source(certificate_source)
    if not installation or not installation.authenticated:
        raise HTTPException(status_code=503, detail="TRUSTED_INSTALLATION_CHANNEL_REQUIRED")
    row = db.query(SignatureAuthorization).filter(
        SignatureAuthorization.authorization_id == authorization_id,
    ).with_for_update().first()
    if not row:
        raise HTTPException(status_code=404, detail="AUTHORIZATION_NOT_FOUND")
    active_binding = db.query(UsuarioCertificado).filter(
        UsuarioCertificado.clinica_id == row.clinica_id,
        UsuarioCertificado.titular_user_id == row.user_id,
        UsuarioCertificado.certificado_der_sha256 == row.certificado_der_sha256,
        UsuarioCertificado.certificate_source == row.certificate_source,
        UsuarioCertificado.status == "ACTIVE",
    ).first()
    if not active_binding:
        raise HTTPException(status_code=409, detail="CERTIFICATE_BINDING_NOT_ACTIVE")
    now = _now()
    if row.status == "REVOKED":
        raise HTTPException(status_code=409, detail="AUTHORIZATION_REVOKED")
    if row.status == "CONSUMED":
        raise HTTPException(status_code=409, detail="AUTHORIZATION_ALREADY_CONSUMED")
    if row.status != "ISSUED":
        raise HTTPException(status_code=409, detail="AUTHORIZATION_NOT_ISSUED")
    if _aware(row.expires_at) <= now:
        row.status = "EXPIRED"; db.commit()
        raise HTTPException(status_code=409, detail="AUTHORIZATION_EXPIRED")
    checks = (
        row.installation_id == installation.installation_id,
        row.operation_id == operation_id,
        row.prepared_pdf_sha256 == prepared_pdf_sha256.lower(),
        row.certificado_der_sha256 == certificado_der_sha256.lower(),
        row.certificate_source == certificate_source,
        row.field_name == field_name,
        row.policy_oid == policy_oid,
    )
    if not all(checks):
        raise HTTPException(status_code=409, detail="AUTHORIZATION_BINDING_MISMATCH")
    row.status = "CONSUMED"; row.consumed_at = now
    db.commit(); db.refresh(row)
    return row
