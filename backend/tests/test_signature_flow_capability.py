import sys
import unittest
from pathlib import Path

from sqlalchemy import create_engine

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "backend"))

from database import Base
from models.signature_authorization import SignatureAuthorization
from models.signature_reservation_request import SignatureReservationRequest
from models.usuario_certificado import UsuarioCertificado
from models.bridge_installation import BridgeInstallation, BridgeInstallationEvent
from models.usuario import Usuario  # registers FK target for isolated metadata tests
from services.installation_identity_registry import InstallationIdentityRegistry
from services.signature_flow_capability import REQUIRED_ROUTES, signature_flow_capability


class SignatureFlowCapabilityTests(unittest.TestCase):
    def setUp(self):
        self.engine = create_engine("sqlite://")
        Base.metadata.create_all(self.engine, tables=[
            UsuarioCertificado.__table__, SignatureReservationRequest.__table__, SignatureAuthorization.__table__,
            BridgeInstallation.__table__, BridgeInstallationEvent.__table__,
        ])
        self.registry = InstallationIdentityRegistry()
        self.registry.register("install-test", "a" * 64)

    def tearDown(self):
        self.engine.dispose()

    def test_true_requires_all_server_side_prerequisites(self):
        self.assertTrue(signature_flow_capability(
            engine=self.engine, mtls_configured=True, installation_registry=self.registry,
            mounted_routes=REQUIRED_ROUTES,
        ))

    def test_false_for_missing_mtls_revoked_installation_or_schema(self):
        kwargs = dict(engine=self.engine, mtls_configured=True, installation_registry=self.registry, mounted_routes=REQUIRED_ROUTES)
        self.assertFalse(signature_flow_capability(**{**kwargs, "mtls_configured": False}))
        self.registry.revoke("install-test")
        self.assertFalse(signature_flow_capability(**kwargs))
        self.registry.register("install-test", "b" * 64)
        broken = create_engine("sqlite://")
        self.assertFalse(signature_flow_capability(**{**kwargs, "engine": broken}))
        broken.dispose()


if __name__ == "__main__":
    unittest.main()
