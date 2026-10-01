from datetime import datetime, timedelta, timezone
from types import SimpleNamespace

import pytest
from fastapi import HTTPException
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from database import Base
from models.clinica import Clinica
from models.plataforma import PlataformaAuditoria
from models.usuario import Usuario
from models.usuario_certificado import UsuarioCertificado
from models.prestador_odonto import PrestadorOdonto
from models.unidade_atendimento import UnidadeAtendimento
from models.financeiro import Lancamento
from models.convenio_odonto import ConvenioOdonto
from models.procedimento_generico import ProcedimentoGenerico
from models.material import Material
from routes.usuario_certificado_routes import (
    BindingConfirm,
    BindingCreate,
    confirm_binding,
    create_binding,
    revoke_binding,
)
from security.hash import hash_password


@pytest.fixture
def db():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(
        engine,
        tables=[
            Clinica.__table__,
            Usuario.__table__,
            UsuarioCertificado.__table__,
            PlataformaAuditoria.__table__,
            PrestadorOdonto.__table__,
            UnidadeAtendimento.__table__,
        ],
    )
    session = sessionmaker(bind=engine)()
    clinic = Clinica(nome="Clinic test", email="clinic@test.local", trial_ate=datetime.utcnow())
    other_clinic = Clinica(nome="Other clinic", email="other-clinic@test.local", trial_ate=datetime.utcnow())
    session.add_all([clinic, other_clinic])
    session.flush()
    admin = Usuario(
        nome="Admin", email="admin@test.local", senha_hash=hash_password("admin-pass"),
        clinica_id=clinic.id, ativo=True, setup_completed=True, is_admin=True,
    )
    titular = Usuario(
        nome="Titular", email="titular@test.local", senha_hash=hash_password("titular-pass"),
        clinica_id=clinic.id, ativo=True, setup_completed=True, is_admin=False,
    )
    other = Usuario(
        nome="Other", email="other@test.local", senha_hash=hash_password("other-pass"),
        clinica_id=other_clinic.id, ativo=True, setup_completed=True, is_admin=True,
    )
    session.add_all([admin, titular, other])
    session.commit()
    yield session, admin, titular, other
    session.close()


def req():
    return SimpleNamespace(client=SimpleNamespace(host="127.0.0.1"))


def test_pending_confirm_active_and_revocation_are_one_way(db):
    session, admin, titular, _ = db
    created = create_binding(BindingCreate(titular_user_id=titular.id, certificado_der_sha256="a" * 64), req(), admin, session)
    assert created["status"] == "PENDING"
    active = confirm_binding(created["id"], BindingConfirm(senha="titular-pass"), req(), titular, session)
    assert active["status"] == "ACTIVE"
    with pytest.raises(HTTPException) as duplicate:
        create_binding(BindingCreate(titular_user_id=titular.id, certificado_der_sha256="a" * 64), req(), admin, session)
    assert duplicate.value.status_code == 409
    revoked = revoke_binding(created["id"], req(), titular, session)
    assert revoked["status"] == "REVOKED"
    with pytest.raises(HTTPException) as not_pending:
        confirm_binding(created["id"], BindingConfirm(senha="titular-pass"), req(), titular, session)
    assert not_pending.value.detail == "binding_not_pending"


def test_only_same_clinic_admin_creates_and_cross_clinic_is_rejected(db):
    session, admin, titular, other = db
    with pytest.raises(HTTPException) as forbidden:
        create_binding(BindingCreate(titular_user_id=titular.id, certificado_der_sha256="b" * 64), req(), other, session)
    assert forbidden.value.status_code == 400
    with pytest.raises(HTTPException) as wrong_tenant:
        create_binding(BindingCreate(titular_user_id=other.id, certificado_der_sha256="c" * 64), req(), admin, session)
    assert wrong_tenant.value.status_code == 400


def test_five_password_failures_lock_and_do_not_activate(db):
    session, admin, titular, _ = db
    created = create_binding(BindingCreate(titular_user_id=titular.id, certificado_der_sha256="d" * 64), req(), admin, session)
    for _ in range(5):
        with pytest.raises(HTTPException) as invalid:
            confirm_binding(created["id"], BindingConfirm(senha="wrong"), req(), titular, session)
        assert invalid.value.status_code == 401
    with pytest.raises(HTTPException) as locked:
        confirm_binding(created["id"], BindingConfirm(senha="titular-pass"), req(), titular, session)
    assert locked.value.status_code == 423
    row = session.get(UsuarioCertificado, created["id"])
    assert row.status == "PENDING"
    assert row.tentativas_falhas == 5
    assert row.bloqueado_ate_em is not None


def test_hash_is_normalized_and_invalid_der_hash_rejected(db):
    session, admin, titular, _ = db
    created = create_binding(BindingCreate(titular_user_id=titular.id, certificado_der_sha256="E" * 64), req(), admin, session)
    assert created["certificado_der_sha256"] == "e" * 64
    with pytest.raises(ValueError):
        BindingCreate(titular_user_id=titular.id, certificado_der_sha256="not-a-sha256")
