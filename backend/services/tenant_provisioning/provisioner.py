from __future__ import annotations

import os
from datetime import datetime, timedelta

from models.access_profile import AccessProfile
from models.clinica import Clinica
from models.prestador_odonto import PrestadorOdonto
from models.unidade_atendimento import UnidadeAtendimento
from models.usuario import Usuario
from models.usuario_perfil_acesso import UsuarioPerfilAcesso
from security.hash import hash_password
from security.permissions import dump_permissions_json, sanitize_permissions, TIPO_USUARIO_DENTISTA


ADMIN_PROFILE_SOURCE_ID = 1
ADMIN_PROFILE_NAME = "Administrador"
DEFAULT_PROVIDER_CODIGO = "001"
DEFAULT_PROVIDER_TIPO = "Cirurgiao dentista"


def _test_fail(stage: str) -> None:
    requested = str(os.getenv("BRANA_INITIAL_TENANT_TEST_FAIL_STAGE", "")).strip().lower()
    if requested and requested == stage:
        raise RuntimeError(f"Falha controlada de teste no estagio {stage}.")


def _apelido(nome: str) -> str | None:
    txt = " ".join(str(nome or "").split()).strip()
    if not txt:
        return None
    return txt.split(" ", 1)[0][:60]


def _ensure_admin_profile(session, clinic_id: int) -> AccessProfile:
    profile = (
        session.query(AccessProfile)
        .filter(AccessProfile.clinica_id == clinic_id, AccessProfile.source_id == ADMIN_PROFILE_SOURCE_ID)
        .first()
    )
    if not profile:
        profile = AccessProfile(
            clinica_id=clinic_id,
            source_id=ADMIN_PROFILE_SOURCE_ID,
            nome=ADMIN_PROFILE_NAME,
            reservado=True,
        )
        session.add(profile)
        session.flush()
        return profile
    changed = False
    if (profile.nome or "").strip() != ADMIN_PROFILE_NAME:
        profile.nome = ADMIN_PROFILE_NAME
        changed = True
    if not bool(profile.reservado):
        profile.reservado = True
        changed = True
    if changed:
        session.add(profile)
        session.flush()
    return profile


def _ensure_unit(session, clinic_id: int, unit_name: str) -> UnidadeAtendimento:
    unit = (
        session.query(UnidadeAtendimento)
        .filter(UnidadeAtendimento.clinica_id == clinic_id, UnidadeAtendimento.source_id == 1)
        .first()
    )
    if not unit:
        unit = UnidadeAtendimento(
            clinica_id=clinic_id,
            source_id=1,
            codigo="0001",
            nome=unit_name,
            qtd_sala=0,
            inativo=False,
            data_inclusao=datetime.utcnow().strftime("%d/%m/%Y"),
        )
        session.add(unit)
        session.flush()
        return unit
    if (unit.nome or "").strip() != unit_name:
        unit.nome = unit_name
        session.add(unit)
        session.flush()
    return unit


def _ensure_clinic(session, clinic_name: str, clinic_email: str) -> Clinica:
    clinic = session.query(Clinica).filter(Clinica.email == clinic_email).first()
    if not clinic:
        clinic = Clinica(
            nome=clinic_name,
            email=clinic_email,
            tipo_conta="DEMO 7 dias",
            trial_ate=datetime.utcnow() + timedelta(days=7),
            ativo=True,
        )
        session.add(clinic)
        session.flush()
        return clinic
    if (clinic.nome or "").strip() != clinic_name:
        clinic.nome = clinic_name
    if not bool(clinic.ativo):
        clinic.ativo = True
    session.add(clinic)
    session.flush()
    return clinic


def apply_tenant_provisioning(session, spec) -> dict:
    clinic = _ensure_clinic(session, spec.clinic_name, spec.clinic_email)
    _test_fail("clinic")
    unit = _ensure_unit(session, clinic.id, spec.unit_name)
    _test_fail("unit")
    profile = _ensure_admin_profile(session, clinic.id)
    _test_fail("profile")

    provider = (
        session.query(PrestadorOdonto)
        .filter(PrestadorOdonto.clinica_id == clinic.id, PrestadorOdonto.source_id == 1)
        .first()
    )
    if not provider:
        provider = PrestadorOdonto(
            clinica_id=clinic.id,
            source_id=1,
            codigo=spec.provider_code or DEFAULT_PROVIDER_CODIGO,
            nome=spec.provider_name,
            apelido=spec.provider_name,
            tipo_prestador=DEFAULT_PROVIDER_TIPO,
            inativo=False,
            executa_procedimento=True,
            is_system_prestador=False,
            usuario_id=None,
        )
        session.add(provider)
        session.flush()
    else:
        provider.codigo = spec.provider_code or DEFAULT_PROVIDER_CODIGO
        provider.nome = spec.provider_name
        provider.apelido = spec.provider_name
        provider.tipo_prestador = DEFAULT_PROVIDER_TIPO
        provider.inativo = False
        provider.executa_procedimento = True
        provider.usuario_id = None
        session.add(provider)
        session.flush()
    _test_fail("provider")

    usuario = (
        session.query(Usuario)
        .filter(Usuario.clinica_id == clinic.id, Usuario.email == spec.admin_email)
        .first()
    )
    raw_permissions = sanitize_permissions({}, tipo_usuario=TIPO_USUARIO_DENTISTA, is_admin=True)
    if not usuario:
        usuario = Usuario(
            codigo=1,
            nome=spec.admin_name,
            apelido=_apelido(spec.admin_name),
            tipo_usuario=TIPO_USUARIO_DENTISTA,
            email=spec.admin_email,
            senha_hash=hash_password(spec.admin_password),
            senha_interna_hash=None,
            clinica_id=clinic.id,
            prestador_id=provider.id,
            unidade_atendimento_id=unit.id,
            is_admin=True,
            ativo=True,
            online=False,
            forcar_troca_senha=False,
            setup_completed=False,
            is_system_user=False,
            permissoes_json=dump_permissions_json(raw_permissions),
        )
        session.add(usuario)
        session.flush()
    else:
        usuario.nome = spec.admin_name
        usuario.apelido = _apelido(spec.admin_name)
        usuario.tipo_usuario = TIPO_USUARIO_DENTISTA
        usuario.senha_hash = hash_password(spec.admin_password)
        usuario.senha_interna_hash = None
        usuario.clinica_id = clinic.id
        usuario.prestador_id = provider.id
        usuario.unidade_atendimento_id = unit.id
        usuario.is_admin = True
        usuario.ativo = True
        usuario.online = False
        usuario.forcar_troca_senha = False
        usuario.setup_completed = False
        usuario.is_system_user = False
        usuario.permissoes_json = dump_permissions_json(raw_permissions)
        session.add(usuario)
        session.flush()
    _test_fail("user")

    provider.usuario_id = usuario.id
    session.add(provider)
    session.flush()
    _test_fail("provider_link")

    link = (
        session.query(UsuarioPerfilAcesso)
        .filter(
            UsuarioPerfilAcesso.clinica_id == clinic.id,
            UsuarioPerfilAcesso.usuario_id == usuario.id,
            UsuarioPerfilAcesso.prestador_id == provider.id,
            UsuarioPerfilAcesso.perfil_id == profile.id,
        )
        .first()
    )
    if not link:
        link = UsuarioPerfilAcesso(
            clinica_id=clinic.id,
            usuario_id=usuario.id,
            prestador_id=provider.id,
            perfil_id=profile.id,
        )
        session.add(link)
        session.flush()
    _test_fail("link")

    return {
        "clinic_id": clinic.id,
        "unit_id": unit.id,
        "provider_id": provider.id,
        "user_id": usuario.id,
        "profile_id": profile.id,
        "link_id": link.id,
    }
