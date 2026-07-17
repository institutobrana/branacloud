from __future__ import annotations

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from models.access_profile import AccessProfile
from models.clinica import Clinica
from models.prestador_odonto import PrestadorOdonto
from models.unidade_atendimento import UnidadeAtendimento
from models.usuario import Usuario
from models.usuario_perfil_acesso import UsuarioPerfilAcesso
from security.hash import verify_password


def _count(session: Session, model) -> int:
    return int(session.execute(select(func.count()).select_from(model)).scalar() or 0)


def validate_tenant_state(session: Session, spec) -> dict:
    clinic = session.query(Clinica).filter(Clinica.email == spec.clinic_email).first()
    user = session.query(Usuario).filter(Usuario.email == spec.admin_email).first()
    unit = session.query(UnidadeAtendimento).filter(UnidadeAtendimento.clinica_id == getattr(clinic, "id", 0)).first()
    provider = session.query(PrestadorOdonto).filter(
        PrestadorOdonto.clinica_id == getattr(clinic, "id", 0),
        PrestadorOdonto.codigo == spec.provider_code,
    ).first()
    profile = session.query(AccessProfile).filter(
        AccessProfile.clinica_id == getattr(clinic, "id", 0),
        AccessProfile.source_id == 1,
    ).first()
    link = session.query(UsuarioPerfilAcesso).filter(
        UsuarioPerfilAcesso.clinica_id == getattr(clinic, "id", 0),
        UsuarioPerfilAcesso.usuario_id == getattr(user, "id", 0),
        UsuarioPerfilAcesso.prestador_id == getattr(provider, "id", 0),
        UsuarioPerfilAcesso.perfil_id == getattr(profile, "id", 0),
    ).first()

    ok = all([clinic, user, unit, provider, profile, link])
    if ok:
        ok = bool(user.ativo) and bool(user.is_admin) and not bool(user.is_system_user)
        ok = ok and bool(user.setup_completed is False)
        ok = ok and bool(user.prestador_id == provider.id)
        ok = ok and bool(user.unidade_atendimento_id == unit.id)
        ok = ok and bool(provider.usuario_id == user.id)
        ok = ok and bool(profile.reservado)
        ok = ok and verify_password(spec.admin_password, user.senha_hash)

    return {
        "ok": ok,
        "clinic_exists": bool(clinic),
        "unit_exists": bool(unit),
        "provider_exists": bool(provider),
        "user_exists": bool(user),
        "profile_exists": bool(profile),
        "link_exists": bool(link),
        "users_count": _count(session, Usuario),
        "clinicas_count": _count(session, Clinica),
        "units_count": _count(session, UnidadeAtendimento),
        "providers_count": _count(session, PrestadorOdonto),
        "profiles_count": _count(session, AccessProfile),
        "links_count": _count(session, UsuarioPerfilAcesso),
        "email_unique": _count(session, Usuario) == len({u.email for u in session.query(Usuario).all()}),
        "patient_count": 0,
    }
