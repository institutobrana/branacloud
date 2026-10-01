import unittest
from datetime import datetime, timedelta, timezone

from fastapi import HTTPException
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from database import Base
from models.clinica import Clinica
from models.usuario import Usuario
from models.usuario_certificado import UsuarioCertificado
from models.signature_reservation_request import SignatureReservationRequest
from models.signature_authorization import SignatureAuthorization
from models.prestador_odonto import PrestadorOdonto
from models.unidade_atendimento import UnidadeAtendimento
from models.financeiro import Lancamento
from models.convenio_odonto import ConvenioOdonto
from models.procedimento_generico import ProcedimentoGenerico
from models.material import Material
from services.signature_authorization_service import TrustedInstallationIdentity
from services.signature_reservation_challenge_service import create_pending_request, bind_installation
from security.hash import hash_password


class ReservationChallengeTests(unittest.TestCase):
    def setUp(self):
        engine = create_engine("sqlite:///:memory:")
        Base.metadata.create_all(engine, tables=[Clinica.__table__, PrestadorOdonto.__table__, UnidadeAtendimento.__table__, Lancamento.__table__, ConvenioOdonto.__table__, ProcedimentoGenerico.__table__, Material.__table__, Usuario.__table__, UsuarioCertificado.__table__, SignatureReservationRequest.__table__, SignatureAuthorization.__table__])
        self.db = sessionmaker(bind=engine)()
        clinic = Clinica(nome="Challenge clinic", email="challenge@test", trial_ate=datetime.utcnow()); self.db.add(clinic); self.db.flush()
        self.user = Usuario(nome="Holder", email="challenge-holder@test", senha_hash=hash_password("secret"), clinica_id=clinic.id, ativo=True, setup_completed=True, is_admin=False); self.db.add(self.user); self.db.flush()
        self.db.add(UsuarioCertificado(clinica_id=clinic.id, titular_user_id=self.user.id, criado_por_user_id=self.user.id, certificado_der_sha256="a" * 64, status="ACTIVE")); self.db.commit(); self.identity = TrustedInstallationIdentity("install-1", authenticated=True)

    def tearDown(self): self.db.close()

    def test_bind_is_one_shot_and_immutable(self):
        row, challenge = create_pending_request(self.db, actor=self.user, operation_id="op-1", prepared_pdf_sha256="b" * 64, certificado_der_sha256="a" * 64, field_name="BranaSignature_1", policy_oid="policy")
        bound = bind_installation(self.db, request_id=row.request_id, challenge=challenge, operation_id="op-1", prepared_pdf_sha256="b" * 64, certificado_der_sha256="a" * 64, installation=self.identity)
        self.assertEqual(bound.status, "RESERVED"); self.assertEqual(bound.installation_id, "install-1"); self.assertTrue(bound.authorization_id)
        authorization = self.db.query(SignatureAuthorization).filter_by(authorization_id=bound.authorization_id).one()
        self.assertEqual(authorization.status, "RESERVED")
        with self.assertRaisesRegex(HTTPException, "CHALLENGE_ALREADY_USED"):
            bind_installation(self.db, request_id=row.request_id, challenge=challenge, operation_id="op-1", prepared_pdf_sha256="b" * 64, certificado_der_sha256="a" * 64, installation=self.identity)

    def test_wrong_binding_and_expired_challenge_fail_closed(self):
        row, challenge = create_pending_request(self.db, actor=self.user, operation_id="op-2", prepared_pdf_sha256="b" * 64, certificado_der_sha256="a" * 64, field_name="BranaSignature_1", policy_oid="policy")
        with self.assertRaisesRegex(HTTPException, "RESERVATION_BINDING_MISMATCH"):
            bind_installation(self.db, request_id=row.request_id, challenge=challenge, operation_id="other", prepared_pdf_sha256="b" * 64, certificado_der_sha256="a" * 64, installation=self.identity)
        row.expires_at = datetime.now(timezone.utc) - timedelta(seconds=1); self.db.commit()
        with self.assertRaisesRegex(HTTPException, "CHALLENGE_EXPIRED"):
            bind_installation(self.db, request_id=row.request_id, challenge=challenge, operation_id="op-2", prepared_pdf_sha256="b" * 64, certificado_der_sha256="a" * 64, installation=self.identity)

    def test_failed_bind_leaves_no_usable_authorization(self):
        row, challenge = create_pending_request(self.db, actor=self.user, operation_id="op-3", prepared_pdf_sha256="b" * 64, certificado_der_sha256="a" * 64, field_name="BranaSignature_1", policy_oid="policy")
        with self.assertRaisesRegex(HTTPException, "TRUSTED_INSTALLATION_CHANNEL_REQUIRED"):
            bind_installation(self.db, request_id=row.request_id, challenge=challenge, operation_id="op-3", prepared_pdf_sha256="b" * 64, certificado_der_sha256="a" * 64, installation=TrustedInstallationIdentity("unknown", authenticated=False))
        self.db.expire_all()
        self.assertEqual(self.db.query(SignatureReservationRequest).filter_by(request_id=row.request_id, status="PENDING").count(), 1)
        self.assertEqual(self.db.query(SignatureAuthorization).count(), 0)


if __name__ == "__main__": unittest.main()
