import unittest
import httpx

from local_bridge.security.online_authorization_client import OnlineAuthorizationConfig, OnlineAuthorizationConsumer, OnlineAuthorizationError


class OnlineAuthorizationClientTests(unittest.TestCase):
    def make(self, handler):
        calls = []
        def factory(**kwargs):
            transport = httpx.MockTransport(lambda request: (calls.append(request) or handler(request)))
            return httpx.Client(transport=transport, **{k: v for k, v in kwargs.items() if k in {"timeout", "trust_env", "verify"}})
        class DummyTLS:
            def load_cert_chain(self, **kwargs): pass
        return OnlineAuthorizationConsumer(OnlineAuthorizationConfig("https://test.invalid/consume", "ca", "cert", "key"), client_factory=factory, tls_context_factory=lambda **kwargs: DummyTLS()), calls

    def test_only_consumed_is_success_and_single_request(self):
        client, calls = self.make(lambda request: httpx.Response(200, json={"status": "CONSUMED"}, request=request))
        self.assertEqual(client.consume(authorization_id="a", operation_id="o", prepared_pdf_sha256="p", certificate_der_sha256="c", field_name="BranaSignature_1", policy_oid="policy"), "CONSUMED")
        self.assertEqual(len(calls), 1)

    def test_rejection_transport_and_invalid_body_fail_closed(self):
        for handler in (lambda request: httpx.Response(409, json={"status":"CONSUMED"}, request=request), lambda request: httpx.Response(200, json={}, request=request), lambda request: (_ for _ in ()).throw(httpx.ConnectError("offline"))):
            client, calls = self.make(handler)
            with self.assertRaises(OnlineAuthorizationError):
                client.consume(authorization_id="a", operation_id="o", prepared_pdf_sha256="p", certificate_der_sha256="c", field_name="BranaSignature_1", policy_oid="policy")
            self.assertEqual(len(calls), 1)


if __name__ == "__main__":
    unittest.main()
