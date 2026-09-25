import unittest

from local_bridge.secure_bridge_app import create_secure_bridge_runtime
from local_bridge.security.ui import PendingApprovalUI
from local_bridge.tests.test_bridge_runtime import tls_pair


class ProductionApprovalUiGuardTests(unittest.TestCase):
    def test_production_never_installs_pending_ui_implicitly(self):
        cert = b"-----BEGIN CERTIFICATE-----\nMIIB\n-----END CERTIFICATE-----"
        key = b"-----BEGIN PRIVATE KEY-----\nMIIB\n-----END PRIVATE KEY-----"
        selector = lambda: {"store": "CurrentUser\\My"}
        factory = lambda selected: object()
        factory.real_wiring = True
        with self.assertRaisesRegex(RuntimeError, "REAL_APPROVAL_UI_REQUIRED"):
            create_secure_bridge_runtime(
                cert_pem=cert,
                key_pem=key,
                candidate_selector=selector,
                operational_signer_factory=factory,
                production_mode=True,
            )

    def test_production_signing_is_closed_by_default(self):
        cert, key = tls_pair()
        factory = lambda selected: object()
        factory.real_wiring = True
        runtime = create_secure_bridge_runtime(cert_pem=cert, key_pem=key, candidate_selector=lambda: {}, operational_signer_factory=factory, ui=PendingApprovalUI(), production_mode=True)
        self.assertFalse(runtime.service._signing_enabled)


if __name__ == "__main__":
    unittest.main()
