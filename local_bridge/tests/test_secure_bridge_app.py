import unittest
from fastapi.testclient import TestClient
from local_bridge.secure_bridge_app import create_secure_bridge_app
from local_bridge.tests.test_bridge_runtime import tls_pair
from local_bridge.security.prepared_signer import FakePreparedPdfSigner

class SecureApp(unittest.TestCase):
    def test_asgi_health_and_origin_guard_without_starting_server(self):
        cert,key=tls_pair(); client=TestClient(create_secure_bridge_app(cert_pem=cert,key_pem=key, signer=FakePreparedPdfSigner()))
        self.assertEqual(client.get('/health').status_code,200)
        self.assertEqual(client.get('/v1/signature-operations/x',headers={'host':'localhost:8765','origin':'https://evil.example'}).status_code,403)
        self.assertNotIn('/assinar-pdf',{r.path for r in client.app.routes})
    def test_preflight_has_no_operation_state(self):
        cert,key=tls_pair(); client=TestClient(create_secure_bridge_app(cert_pem=cert,key_pem=key, signer=FakePreparedPdfSigner())); response=client.options('/v1/signature-operations',headers={'host':'localhost:8765','origin':'https://localhost:5173'})
        self.assertEqual(response.status_code,204)

if __name__=='__main__': unittest.main()
