import unittest
from local_bridge.secure_bridge_app import create_secure_bridge_runtime
from local_bridge.tests.test_bridge_runtime import tls_pair


class RealWiringGuardTests(unittest.TestCase):
    def test_production_mode_rejects_unproven_fake_graph(self):
        cert, key = tls_pair()
        with self.assertRaisesRegex(RuntimeError, "REAL_WIRING_REQUIRED"):
            create_secure_bridge_runtime(cert_pem=cert, key_pem=key, candidate_selector=lambda: {}, operational_signer_factory=lambda _: object(), production_mode=True)

    def test_test_mode_preserves_injected_fake_runtime(self):
        cert, key = tls_pair()
        runtime = create_secure_bridge_runtime(cert_pem=cert, key_pem=key, candidate_selector=lambda: {}, operational_signer_factory=lambda _: object())
        self.assertIsNotNone(runtime.service)


if __name__ == "__main__":
    unittest.main()
