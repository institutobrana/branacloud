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
    def test_browser_diagnostic_is_read_only_and_cors_enabled(self):
        cert,key=tls_pair(); client=TestClient(create_secure_bridge_app(cert_pem=cert,key_pem=key, signer=FakePreparedPdfSigner()))
        headers={'host':'localhost:8765','origin':'https://192.168.3.41:5173'}
        preflight=client.options('/v1/diagnostics/health',headers={**headers,'access-control-request-method':'GET'})
        self.assertEqual(preflight.status_code,204)
        self.assertEqual(preflight.content,b'')
        self.assertEqual(preflight.headers['access-control-allow-origin'],headers['origin'])
        response=client.get('/v1/diagnostics/health',headers=headers)
        self.assertEqual(response.status_code,200)
        self.assertEqual(response.headers['access-control-allow-origin'],headers['origin'])
        self.assertEqual(response.json()['diagnostic'],'read-only')
        self.assertEqual(len(response.json()),3)

    def test_operation_preflight_allows_headers_sent_by_real_js_client(self):
        cert,key=tls_pair(); client=TestClient(create_secure_bridge_app(cert_pem=cert,key_pem=key, signer=FakePreparedPdfSigner()))
        origin='https://192.168.3.41:5173'
        requested='content-type,x-brana-bridge-protocol,x-brana-session,x-brana-timestamp,x-brana-request-nonce,x-brana-request-mac,x-brana-content-sha256,x-brana-operation-id,x-brana-field-name,x-brana-policy-oid,x-brana-profile'
        response=client.options('/v1/signature-operations',headers={'host':'localhost:8765','origin':origin,'access-control-request-method':'POST','access-control-request-headers':requested})
        self.assertEqual(response.status_code,204)
        allowed={item.strip().lower() for item in response.headers['access-control-allow-headers'].split(',')}
        self.assertTrue(set(requested.split(',')).issubset(allowed))
        self.assertEqual(response.content,b'')

if __name__=='__main__': unittest.main()
