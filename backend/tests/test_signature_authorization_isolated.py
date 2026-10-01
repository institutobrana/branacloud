import unittest
from unittest.mock import patch
from datetime import datetime, timedelta
from types import SimpleNamespace

from fastapi import HTTPException
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from database import Base
from models.clinica import Clinica
from models.usuario import Usuario
from models.usuario_certificado import UsuarioCertificado
from models.signature_authorization import SignatureAuthorization
from models.prestador_odonto import PrestadorOdonto
from models.unidade_atendimento import UnidadeAtendimento
from models.financeiro import Lancamento
from models.convenio_odonto import ConvenioOdonto
from models.procedimento_generico import ProcedimentoGenerico
from models.material import Material
from security.hash import hash_password
from services.signature_authorization_service import (
    TrustedInstallationIdentity, issue_authorization, reserve_authorization, consume_authorization,
)


class SignatureAuthorizationIsolation(unittest.TestCase):
    def setUp(self):
        engine = create_engine("sqlite:///:memory:")
        Base.metadata.create_all(engine, tables=[Clinica.__table__, Usuario.__table__, UsuarioCertificado.__table__, SignatureAuthorization.__table__, PrestadorOdonto.__table__, UnidadeAtendimento.__table__])
        self.db = sessionmaker(bind=engine)()
        clinic = Clinica(nome="Auth clinic", email="auth-clinic@test", trial_ate=datetime.utcnow())
        self.db.add(clinic); self.db.flush()
        self.user = Usuario(nome="Holder", email="holder@test", senha_hash=hash_password("holder-pass"), clinica_id=clinic.id, ativo=True, setup_completed=True, is_admin=False)
        self.db.add(self.user); self.db.flush()
        self.db.add(UsuarioCertificado(clinica_id=clinic.id, titular_user_id=self.user.id, criado_por_user_id=self.user.id, certificado_der_sha256="a" * 64, status="ACTIVE"))
        self.db.commit()
        self.identity = TrustedInstallationIdentity("install-1", authenticated=True)

    def tearDown(self):
        self.db.close()

    def issue(self, **overrides):
        args = dict(actor=self.user, senha="holder-pass", installation=self.identity, operation_id="op-1", prepared_pdf_sha256="b" * 64, certificado_der_sha256="a" * 64, field_name="BranaSignature_1", policy_oid="policy")
        args.update(overrides)
        return issue_authorization(self.db, **args)

    def test_issue_consume_one_shot_and_mismatches_fail_closed(self):
        row = self.issue()
        consumed = consume_authorization(self.db, authorization_id=row.authorization_id, installation=self.identity, operation_id="op-1", prepared_pdf_sha256="b" * 64, certificado_der_sha256="a" * 64, field_name="BranaSignature_1", policy_oid="policy")
        self.assertEqual(consumed.status, "CONSUMED")
        with self.assertRaisesRegex(HTTPException, "ALREADY_CONSUMED"):
            consume_authorization(self.db, authorization_id=row.authorization_id, installation=self.identity, operation_id="op-1", prepared_pdf_sha256="b" * 64, certificado_der_sha256="a" * 64, field_name="BranaSignature_1", policy_oid="policy")
        with self.assertRaisesRegex(HTTPException, "TRUSTED_INSTALLATION_CHANNEL_REQUIRED"):
            self.issue(installation=TrustedInstallationIdentity("forged-header", authenticated=False))

    def test_expired_revoked_and_binding_mismatch(self):
        row = self.issue(ttl_seconds=1); row.expires_at = datetime.utcnow() - timedelta(seconds=1); self.db.commit()
        with self.assertRaisesRegex(HTTPException, "EXPIRED"):
            consume_authorization(self.db, authorization_id=row.authorization_id, installation=self.identity, operation_id="op-1", prepared_pdf_sha256="b" * 64, certificado_der_sha256="a" * 64, field_name="BranaSignature_1", policy_oid="policy")
        row2 = self.issue(operation_id="op-2"); row2.status = "REVOKED"; self.db.commit()
        with self.assertRaisesRegex(HTTPException, "REVOKED"):
            consume_authorization(self.db, authorization_id=row2.authorization_id, installation=self.identity, operation_id="op-2", prepared_pdf_sha256="b" * 64, certificado_der_sha256="a" * 64, field_name="BranaSignature_1", policy_oid="policy")
        row3 = self.issue(operation_id="op-3")
        with self.assertRaisesRegex(HTTPException, "BINDING_MISMATCH"):
            consume_authorization(self.db, authorization_id=row3.authorization_id, installation=self.identity, operation_id="other", prepared_pdf_sha256="b" * 64, certificado_der_sha256="a" * 64, field_name="BranaSignature_1", policy_oid="policy")

    def test_wrong_password_and_no_binding(self):
        for _ in range(5):
            with self.assertRaisesRegex(HTTPException, "INVALID_SIGNING_CREDENTIALS"):
                self.issue(senha="wrong")
        with self.assertRaisesRegex(HTTPException, "TITULAR_REAUTH_LOCKED"):
            self.issue()
        with self.assertRaisesRegex(HTTPException, "CERTIFICATE_BINDING_NOT_ACTIVE"):
            self.issue(certificado_der_sha256="c" * 64)

    def test_reservation_requires_confirmation_and_keeps_immutable_binding(self):
        row = reserve_authorization(self.db, actor=self.user, installation=self.identity,
            operation_id="reserved-op", prepared_pdf_sha256="b" * 64,
            certificado_der_sha256="a" * 64, field_name="BranaSignature_1", policy_oid="policy")
        self.assertEqual(row.status, "RESERVED")
        with self.assertRaisesRegex(HTTPException, "NOT_ISSUED"):
            consume_authorization(self.db, authorization_id=row.authorization_id,
                installation=self.identity, operation_id="reserved-op", prepared_pdf_sha256="b" * 64,
                certificado_der_sha256="a" * 64, field_name="BranaSignature_1", policy_oid="policy")
        with self.assertRaisesRegex(HTTPException, "INVALID_SIGNING_CREDENTIALS"):
            issue_authorization(self.db, actor=self.user, senha="wrong", installation=self.identity,
                authorization_id=row.authorization_id, operation_id="reserved-op",
                prepared_pdf_sha256="b" * 64, certificado_der_sha256="a" * 64,
                field_name="BranaSignature_1", policy_oid="policy")
        self.db.refresh(row); self.assertEqual(row.status, "RESERVED")
        issued = issue_authorization(self.db, actor=self.user, senha="holder-pass", installation=self.identity,
            authorization_id=row.authorization_id, operation_id="reserved-op",
            prepared_pdf_sha256="b" * 64, certificado_der_sha256="a" * 64,
            field_name="BranaSignature_1", policy_oid="policy")
        self.assertEqual(issued.authorization_id, row.authorization_id)
        self.assertEqual(issued.status, "ISSUED")

    def test_reservation_requires_exact_source_when_der_is_shared(self):
        # The same public DER may be registered under two distinct sources;
        # source is part of the authority lookup, never a display fallback.
        self.db.add(UsuarioCertificado(
            clinica_id=self.user.clinica_id, titular_user_id=self.user.id,
            criado_por_user_id=self.user.id, certificado_der_sha256="a" * 64,
            certificate_source="FILE_PKCS12", status="ACTIVE"))
        self.db.commit()
        windows = reserve_authorization(self.db, actor=self.user, installation=self.identity,
            operation_id="source-win", prepared_pdf_sha256="b" * 64,
            certificado_der_sha256="a" * 64, certificate_source="WINDOWS_STORE",
            field_name="BranaSignature_1", policy_oid="policy")
        self.assertEqual(windows.status, "RESERVED")
        with patch("services.signature_authorization_service.validate_certificate_source", lambda source: str(source).strip().upper()):
            file_row = reserve_authorization(self.db, actor=self.user, installation=self.identity,
                operation_id="source-file", prepared_pdf_sha256="b" * 64,
                certificado_der_sha256="a" * 64, certificate_source="FILE_PKCS12",
                field_name="BranaSignature_1", policy_oid="policy")
        self.assertEqual(file_row.status, "RESERVED")
        self.assertEqual(windows.certificate_source, "WINDOWS_STORE")
        self.assertEqual(file_row.certificate_source, "FILE_PKCS12")

    def test_reservation_rejects_source_without_matching_active_binding(self):
        with self.assertRaisesRegex(HTTPException, "FILE_PKCS12_SIGNER_NOT_CONFIGURED"):
            reserve_authorization(self.db, actor=self.user, installation=self.identity,
                operation_id="source-rejected", prepared_pdf_sha256="b" * 64,
                certificado_der_sha256="a" * 64, certificate_source="FILE_PKCS12",
                field_name="BranaSignature_1", policy_oid="policy")
        row = issue_authorization(self.db, actor=self.user, senha="holder-pass", installation=self.identity,
            operation_id="source-immutable", prepared_pdf_sha256="b" * 64,
            certificado_der_sha256="a" * 64, certificate_source="WINDOWS_STORE",
            field_name="BranaSignature_1", policy_oid="policy")
        with patch("services.signature_authorization_service.validate_certificate_source", lambda source: str(source).strip().upper()):
            with self.assertRaisesRegex(HTTPException, "BINDING_MISMATCH"):
                consume_authorization(self.db, authorization_id=row.authorization_id,
                    installation=self.identity, operation_id="source-immutable",
                    prepared_pdf_sha256="b" * 64, certificado_der_sha256="a" * 64,
                    certificate_source="FILE_PKCS12", field_name="BranaSignature_1", policy_oid="policy")
        self.assertEqual(row.status, "ISSUED")


if __name__ == "__main__":
    unittest.main()
