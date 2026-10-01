import re
import hashlib
from datetime import datetime, timezone
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, Request, UploadFile, File, Form
from pydantic import BaseModel, validator
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from database import get_db
from models.usuario import Usuario
from models.usuario_certificado import UsuarioCertificado
from security.dependencies import get_current_user
from security.hash import verify_password
from services.platform_admin_service import registrar_auditoria

router = APIRouter(prefix="/usuario-certificados", tags=["usuario-certificados"])
SHA256_RE = re.compile(r"^[0-9a-fA-F]{64}$")
MAX_FAILURES = 5
FAILURE_WINDOW = timedelta(minutes=15)
LOCK_DURATION = timedelta(minutes=15)


class BindingCreate(BaseModel):
    titular_user_id: int
    certificado_der_sha256: str
    certificate_source: str = "WINDOWS_STORE"

    @validator("certificado_der_sha256")
    def validate_hash(cls, value):
        value = value.strip().lower()
        if not SHA256_RE.fullmatch(value):
            raise ValueError("certificado_der_sha256 inválido")
        return value

    @validator("certificate_source")
    def validate_source(cls, value):
        value = value.strip().upper()
        if value not in {"WINDOWS_STORE", "FILE_PKCS12"}:
            raise ValueError("certificate_source inválido")
        return value


class BindingConfirm(BaseModel):
    senha: str


def _now():
    return datetime.now(timezone.utc)


def _aware(value):
    if value is None or value.tzinfo is not None:
        return value
    return value.replace(tzinfo=timezone.utc)


def _same_clinic_user(db, user_id: int, clinic_id: int):
    return (
        db.query(Usuario)
        .filter(Usuario.id == user_id, Usuario.clinica_id == clinic_id)
        .first()
    )


def _public_binding(row):
    return {
        "id": row.id,
        "clinica_id": row.clinica_id,
        "titular_user_id": row.titular_user_id,
        "certificado_der_sha256": row.certificado_der_sha256,
        "certificate_source": row.certificate_source,
        "certificate_subject": row.certificate_subject,
        "certificate_issuer": row.certificate_issuer,
        "certificate_serial": row.certificate_serial,
        "certificate_valid_from": row.certificate_valid_from,
        "certificate_valid_to": row.certificate_valid_to,
        "status": row.status,
        "criado_em": row.criado_em,
        "ativado_em": row.ativado_em,
        "revogado_em": row.revogado_em,
    }


def _require_active_admin(current_user):
    if not current_user.ativo or not current_user.is_admin:
        raise HTTPException(status_code=403, detail="admin_same_clinic_required")


def parse_public_certificate(raw: bytes) -> dict:
    if not raw or len(raw) > 256 * 1024:
        raise ValueError("PUBLIC_CERTIFICATE_SIZE_INVALID")
    try:
        from cryptography import x509
        from cryptography.hazmat.primitives.serialization import Encoding
        try:
            cert = x509.load_pem_x509_certificate(raw)
        except ValueError:
            cert = x509.load_der_x509_certificate(raw)
        der = cert.public_bytes(Encoding.DER)
        now = datetime.now(timezone.utc)
        not_before = getattr(cert, "not_valid_before_utc", None) or cert.not_valid_before.replace(tzinfo=timezone.utc)
        not_after = getattr(cert, "not_valid_after_utc", None) or cert.not_valid_after.replace(tzinfo=timezone.utc)
        if not_before > now or not_after <= now:
            raise ValueError("PUBLIC_CERTIFICATE_EXPIRED")
        public_key = cert.public_key()
        if not hasattr(public_key, "key_size") or public_key.key_size < 2048:
            raise ValueError("PUBLIC_CERTIFICATE_KEY_INVALID")
        try:
            key_usage = cert.extensions.get_extension_for_class(x509.KeyUsage).value
            if not (key_usage.digital_signature or key_usage.content_commitment):
                raise ValueError("PUBLIC_CERTIFICATE_KEY_USAGE_INVALID")
        except x509.ExtensionNotFound:
            pass
        return {"der": der, "sha256": hashlib.sha256(der).hexdigest(),
                "subject": cert.subject.rfc4514_string(), "issuer": cert.issuer.rfc4514_string(),
                "serial": format(cert.serial_number, "X"), "valid_from": not_before, "valid_to": not_after}
    except ValueError:
        raise
    except Exception:
        raise ValueError("PUBLIC_CERTIFICATE_INVALID") from None


@router.post("", status_code=201)
def create_binding(
    payload: BindingCreate,
    request: Request,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    _require_active_admin(current_user)
    titular = _same_clinic_user(db, payload.titular_user_id, current_user.clinica_id)
    if not titular or not titular.ativo or titular.is_system_user:
        raise HTTPException(status_code=400, detail="titular_inactive_or_not_found")

    active = (
        db.query(UsuarioCertificado)
        .filter(
            UsuarioCertificado.clinica_id == current_user.clinica_id,
            UsuarioCertificado.titular_user_id == titular.id,
            UsuarioCertificado.certificado_der_sha256 == payload.certificado_der_sha256,
            UsuarioCertificado.certificate_source == payload.certificate_source,
            UsuarioCertificado.status == "ACTIVE",
        )
        .first()
    )
    if active:
        raise HTTPException(status_code=409, detail="active_binding_exists")

    row = UsuarioCertificado(
        clinica_id=current_user.clinica_id,
        titular_user_id=titular.id,
        criado_por_user_id=current_user.id,
        certificado_der_sha256=payload.certificado_der_sha256,
        certificate_source=payload.certificate_source,
        status="PENDING",
    )
    db.add(row)
    db.flush()
    registrar_auditoria(
        db, current_user, "CERTIFICATE_BINDING_CREATED", "usuario_certificado", row.id,
        {"titular_user_id": titular.id, "status": "PENDING", "certificate_der_sha256": row.certificado_der_sha256},
        request.client.host if request.client else None,
    )
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="active_binding_exists")
    db.refresh(row)
    return _public_binding(row)


@router.post("/file", status_code=201)
async def create_file_binding(
    titular_user_id: int = Form(...),
    public_certificate: UploadFile = File(...),
    request: Request = None,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Register only public DER/PEM; PFX, passwords and private keys are rejected."""
    _require_active_admin(current_user)
    titular = _same_clinic_user(db, titular_user_id, current_user.clinica_id)
    if not titular or not titular.ativo or titular.is_system_user:
        raise HTTPException(status_code=400, detail="titular_inactive_or_not_found")
    raw = await public_certificate.read()
    try:
        parsed = parse_public_certificate(raw)
        der, cert_hash = parsed["der"], parsed["sha256"]
        subject, issuer, serial = parsed["subject"], parsed["issuer"], parsed["serial"]
    except Exception as exc:
        code = str(exc) if str(exc).startswith("PUBLIC_CERTIFICATE_") else "PUBLIC_CERTIFICATE_INVALID"
        raise HTTPException(status_code=400, detail=code) from None
    active = db.query(UsuarioCertificado).filter(
        UsuarioCertificado.clinica_id == current_user.clinica_id,
        UsuarioCertificado.titular_user_id == titular.id,
        UsuarioCertificado.certificate_source == "FILE_PKCS12",
        UsuarioCertificado.certificado_der_sha256 == cert_hash,
        UsuarioCertificado.status == "ACTIVE",
    ).first()
    if active:
        raise HTTPException(status_code=409, detail="active_binding_exists")
    row = UsuarioCertificado(clinica_id=current_user.clinica_id, titular_user_id=titular.id,
        criado_por_user_id=current_user.id, certificado_der_sha256=cert_hash,
        certificate_source="FILE_PKCS12", certificate_der=der, certificate_subject=subject,
        certificate_issuer=issuer, certificate_serial=serial,
        certificate_valid_from=parsed["valid_from"], certificate_valid_to=parsed["valid_to"], status="PENDING")
    db.add(row); db.flush()
    registrar_auditoria(db, current_user, "CERTIFICATE_FILE_BINDING_CREATED", "usuario_certificado", row.id,
        {"titular_user_id": titular.id, "status": "PENDING", "certificate_source": "FILE_PKCS12", "certificate_der_sha256": cert_hash},
        request.client.host if request and request.client else None)
    try:
        db.commit()
    except IntegrityError:
        db.rollback(); raise HTTPException(status_code=409, detail="active_binding_exists")
    db.refresh(row)
    return _public_binding(row)


@router.post("/{binding_id}/confirm")
def confirm_binding(
    binding_id: int,
    payload: BindingConfirm,
    request: Request,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    row = (
        db.query(UsuarioCertificado)
        .filter(
            UsuarioCertificado.id == binding_id,
            UsuarioCertificado.clinica_id == current_user.clinica_id,
            UsuarioCertificado.titular_user_id == current_user.id,
        )
        .with_for_update()
        .first()
    )
    if not row:
        raise HTTPException(status_code=404, detail="binding_not_found")
    if not current_user.ativo or current_user.is_system_user:
        raise HTTPException(status_code=403, detail="titular_inactive")
    if row.status != "PENDING":
        raise HTTPException(status_code=409, detail="binding_not_pending")

    now = _now()
    if row.bloqueado_ate_em and _aware(row.bloqueado_ate_em) > now:
        raise HTTPException(status_code=423, detail="binding_confirmation_locked")
    if row.janela_falhas_inicio_em and now - _aware(row.janela_falhas_inicio_em) >= FAILURE_WINDOW:
        row.tentativas_falhas = 0
        row.janela_falhas_inicio_em = now

    if not verify_password(payload.senha, current_user.senha_hash):
        if not row.janela_falhas_inicio_em:
            row.janela_falhas_inicio_em = now
        row.tentativas_falhas += 1
        if row.tentativas_falhas >= MAX_FAILURES:
            row.bloqueado_ate_em = now + LOCK_DURATION
        db.commit()
        raise HTTPException(status_code=401, detail="invalid_titular_password")

    row.status = "ACTIVE"
    row.ativado_em = now
    row.tentativas_falhas = 0
    row.janela_falhas_inicio_em = None
    row.bloqueado_ate_em = None
    registrar_auditoria(
        db, current_user, "CERTIFICATE_BINDING_ACTIVATED", "usuario_certificado", row.id,
        {"status": "ACTIVE", "certificate_der_sha256": row.certificado_der_sha256},
        request.client.host if request.client else None,
    )
    db.commit()
    db.refresh(row)
    return _public_binding(row)


@router.post("/{binding_id}/revoke")
def revoke_binding(
    binding_id: int,
    request: Request,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    row = (
        db.query(UsuarioCertificado)
        .filter(UsuarioCertificado.id == binding_id, UsuarioCertificado.clinica_id == current_user.clinica_id)
        .with_for_update()
        .first()
    )
    if not row:
        raise HTTPException(status_code=404, detail="binding_not_found")
    if current_user.id != row.titular_user_id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="titular_or_admin_required")
    if row.status == "REVOKED":
        raise HTTPException(status_code=409, detail="binding_already_revoked")
    row.status = "REVOKED"
    row.revogado_por_user_id = current_user.id
    row.revogado_em = _now()
    registrar_auditoria(
        db, current_user, "CERTIFICATE_BINDING_REVOKED", "usuario_certificado", row.id,
        {"status": "REVOKED", "certificate_der_sha256": row.certificado_der_sha256},
        request.client.host if request.client else None,
    )
    db.commit()
    db.refresh(row)
    return _public_binding(row)




@router.get("")
def list_bindings(
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(UsuarioCertificado).filter(UsuarioCertificado.clinica_id == current_user.clinica_id)
    if not current_user.is_admin:
        query = query.filter(UsuarioCertificado.titular_user_id == current_user.id)
    rows = query.all()
    return [_public_binding(row) for row in rows]
