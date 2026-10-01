"""Isolated certificate-choice endpoint; not registered by backend.main yet."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models.usuario import Usuario
from models.usuario_certificado import UsuarioCertificado
from security.dependencies import get_current_user


def create_signature_certificate_router(*, db_dependency=get_db, user_dependency=get_current_user, capability_provider=None):
    router = APIRouter(prefix="/signature-certificates", tags=["isolated-signature-certificates"])

    @router.get("/available")
    def available_certificates(
        current_user: Usuario = Depends(user_dependency),
        db: Session = Depends(db_dependency),
    ):
        rows = (db.query(UsuarioCertificado)
                .filter(
                    UsuarioCertificado.titular_user_id == current_user.id,
                    UsuarioCertificado.clinica_id == current_user.clinica_id,
                    UsuarioCertificado.status == "ACTIVE",
                )
                .order_by(UsuarioCertificado.id.asc()).all())
        capability = bool(capability_provider() if callable(capability_provider) else False)
        return {
            "certificates": [
                {
                    "binding_id": row.id,
                    "display_name": f"Certificado vinculado {row.id}",
                    "issuer": None,
                    "valid_from": None,
                    "valid_to": None,
                    "der_sha256_short": row.certificado_der_sha256[:12],
                    "certificate_der_sha256": row.certificado_der_sha256,
                    "certificate_source": row.certificate_source,
                    "certificate_subject": row.certificate_subject,
                    "certificate_issuer": row.certificate_issuer,
                    "certificate_serial": row.certificate_serial,
                    "valid_from": row.certificate_valid_from,
                    "valid_to": row.certificate_valid_to,
                }
                for row in rows
            ],
            "selection_required": len(rows) > 1,
            "authorization_flow_enabled": capability,
        }

    return router
