from __future__ import annotations

from sqlalchemy import func, inspect, select
from sqlalchemy.orm import Session

from models.access_profile import AccessProfile
from models.clinica import Clinica
from models.prestador_odonto import PrestadorOdonto
from models.unidade_atendimento import UnidadeAtendimento
from models.usuario import Usuario
from models.usuario_perfil_acesso import UsuarioPerfilAcesso
from models.schema_version import SchemaVersion


def _count(session: Session, model) -> int:
    return int(session.execute(select(func.count()).select_from(model)).scalar() or 0)


def inspect_tenant_state(session: Session, spec) -> dict:
    inspector = inspect(session.bind)
    existing_tables = set(inspector.get_table_names(schema="public"))
    schema_ready = "brana_schema_versions" in existing_tables
    baseline_record = None
    if schema_ready:
        baseline_record = session.query(SchemaVersion).order_by(SchemaVersion.id.desc()).first()

    clinic = session.query(Clinica).order_by(Clinica.id.asc()).first()
    user = session.query(Usuario).order_by(Usuario.id.asc()).first()
    unit = session.query(UnidadeAtendimento).order_by(UnidadeAtendimento.id.asc()).first()
    provider = session.query(PrestadorOdonto).order_by(PrestadorOdonto.id.asc()).first()
    admin_profile = session.query(AccessProfile).filter(AccessProfile.source_id == 1).order_by(AccessProfile.id.asc()).first()
    user_profile_link = session.query(UsuarioPerfilAcesso).order_by(UsuarioPerfilAcesso.id.asc()).first()

    return {
        "schema_ready": schema_ready,
        "baseline_applied": bool(baseline_record and str(getattr(baseline_record, "status", "")).lower() == "applied"),
        "clinicas_count": _count(session, Clinica),
        "usuarios_count": _count(session, Usuario),
        "unidades_count": _count(session, UnidadeAtendimento),
        "prestadores_count": _count(session, PrestadorOdonto),
        "profiles_count": _count(session, AccessProfile),
        "links_count": _count(session, UsuarioPerfilAcesso),
        "clinic": clinic,
        "user": user,
        "unit": unit,
        "provider": provider,
        "admin_profile": admin_profile,
        "user_profile_link": user_profile_link,
        "email_exists": bool(
            session.query(Usuario.id).filter(Usuario.email == spec.admin_email).first()
            or session.query(Clinica.id).filter(Clinica.email == spec.clinic_email).first()
        ),
        "provider_code_exists": bool(
            session.query(PrestadorOdonto.id)
            .filter(PrestadorOdonto.clinica_id == getattr(clinic, "id", 0), PrestadorOdonto.codigo == spec.provider_code)
            .first()
        ),
        "desired": {
            "clinic_name": spec.clinic_name,
            "clinic_email": spec.clinic_email,
            "unit_name": spec.unit_name,
            "provider_name": spec.provider_name,
            "provider_code": spec.provider_code,
            "admin_name": spec.admin_name,
            "admin_email": spec.admin_email,
        },
        "expected_tables": len(existing_tables),
        "existing_tables": sorted(existing_tables),
    }

