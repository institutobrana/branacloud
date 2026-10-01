import unittest
from types import SimpleNamespace

from local_bridge.security.reservation_challenge_client import ReservationChallengeConfig, ReservationChallengeForwarder


class _Response:
    status_code = 200
    def json(self): return {"request_id": "r1", "authorization_id": "a1", "status": "RESERVED"}


class _Client:
    calls = 0
    def __init__(self, **kwargs): self.kwargs = kwargs
    def __enter__(self): return self
    def __exit__(self, *args): pass
    def post(self, endpoint, json): self.__class__.calls += 1; return _Response()


class ReservationChallengeClientTests(unittest.TestCase):
    def test_mtls_forwarder_sends_one_request_and_returns_sanitized_binding(self):
        config = ReservationChallengeConfig("https://localhost:9443/bind", "ca", "client", "key")
        forwarder = ReservationChallengeForwarder(config, client_factory=_Client, tls_context_factory=lambda **kwargs: SimpleNamespace(load_cert_chain=lambda **args: None))
        result = forwarder.forward(request_id="r1", challenge="opaque", operation_id="op", prepared_pdf_sha256="b" * 64, certificado_der_sha256="a" * 64)
        self.assertEqual(result, {"request_id": "r1", "authorization_id": "a1", "status": "RESERVED"}); self.assertEqual(_Client.calls, 1)


if __name__ == "__main__": unittest.main()
