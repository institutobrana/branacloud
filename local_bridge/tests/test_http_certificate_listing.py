import hashlib
import time
import unittest

from fastapi.testclient import TestClient
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives.serialization import Encoding, PublicFormat

from local_bridge.security.http_protocol import HttpProtocolService
from local_bridge.security.protocol import b64url_encode, calculate_hmac, canonicalize_hmac_request, derive_session_key, random_nonce
from local_bridge.security.ui import ApprovalDecision


class ApprovedUI:
    def approve_pairing(self, request):
        return ApprovalDecision.APPROVED


class SyntheticProvider:
    def __init__(self, rows):
        self.rows = rows
        self.calls = 0

    def list_public_certificates(self):
        self.calls += 1
        return self.rows


def pair(service):
    client = TestClient(service.create_app())
    origin = "https://localhost:5173"
    private = ec.generate_private_key(ec.SECP256R1())
    public = b64url_encode(private.public_key().public_bytes(Encoding.X962, PublicFormat.UncompressedPoint))
    payload = {"client_instance_id": b64url_encode(b"c" * 16), "client_nonce": b64url_encode(b"n" * 16), "client_ecdh_public_key": public}
    response = client.post("/v1/pairing-requests", headers={"host": "localhost:8765", "origin": origin}, json=payload)
    data = response.json()
    session = data["session_id"]
    key = derive_session_key(private, data["bridge_ecdh_public_key"], origin, data["request_id"], payload["client_nonce"], data["bridge_nonce"], session)
    return client, origin, session, key


def signed_headers(service, origin, session, key, nonce=None):
    path = "/v1/certificates/windows/available"
    nonce = nonce or random_nonce()
    digest = hashlib.sha256(b"").hexdigest()
    parameters = {"operation_id": "CERTIFICATE_LIST"}
    canonical = canonicalize_hmac_request(method="GET", path=path, origin=origin, timestamp=int(time.time()), request_nonce=nonce, session_id=session, content_sha256=digest, body_length=0, parameters=parameters, operation_id="CERTIFICATE_LIST")
    return {"host": "localhost:8765", "origin": origin, "X-Brana-Bridge-Protocol": "brana-bridge-v1", "X-Brana-Session": session, "X-Brana-Timestamp": canonical.decode().split("\x1f")[4], "X-Brana-Request-Nonce": nonce, "X-Brana-Content-SHA256": digest, "X-Brana-Request-MAC": calculate_hmac(key, canonical), "X-Brana-Operation-Id": "CERTIFICATE_LIST"}


class HttpCertificateListingTests(unittest.TestCase):
    def test_authenticated_synthetic_list_is_public_and_distinct(self):
        der_a, der_b = b"DER-A", b"DER-B"
        provider = SyntheticProvider([
            {"certificate_der": der_a, "subject": "CN=A", "issuer": "CN=CA", "serial_number": "01", "key_algorithm": "RSA", "key_size": 2048, "chain_valid": True, "status": "PUBLIC_METADATA_VALID"},
            {"certificate_der": der_b, "subject": "CN=B", "issuer": "CN=CA", "serial_number": "02", "key_algorithm": "RSA", "key_size": 2048, "chain_valid": True, "status": "PUBLIC_METADATA_VALID"},
        ])
        service = HttpProtocolService(ui=ApprovedUI(), public_certificate_provider=provider)
        client, origin, session, key = pair(service)
        response = client.get("/v1/certificates/windows/available", headers=signed_headers(service, origin, session, key))
        self.assertEqual(response.status_code, 200)
        body = response.json(); self.assertTrue(body["selection_required"])
        self.assertEqual({item["certificate_der_sha256"] for item in body["certificates"]}, {hashlib.sha256(der_a).hexdigest(), hashlib.sha256(der_b).hexdigest()})
        self.assertTrue(all(item["certificate_source"] == "WINDOWS_STORE" for item in body["certificates"]))
        self.assertNotIn('"certificate_der":', response.text); self.assertNotIn("private", response.text.lower())
        self.assertEqual(provider.calls, 1)

    def test_pairing_mac_replay_and_unconfigured_provider_fail_closed(self):
        service = HttpProtocolService(ui=ApprovedUI(), public_certificate_provider=SyntheticProvider([]))
        client, origin, session, key = pair(service)
        bad = signed_headers(service, origin, session, key); bad["X-Brana-Request-MAC"] = "0" * 64
        self.assertEqual(client.get("/v1/certificates/windows/available", headers=bad).status_code, 401)
        valid = signed_headers(service, origin, session, key)
        self.assertEqual(client.get("/v1/certificates/windows/available", headers=valid).status_code, 200)
        self.assertEqual(client.get("/v1/certificates/windows/available", headers=valid).status_code, 401)
        closed = TestClient(HttpProtocolService(ui=ApprovedUI()).create_app()).get("/v1/certificates/windows/available", headers={"host": "localhost:8765", "origin": origin})
        self.assertEqual(closed.status_code, 503)


if __name__ == "__main__":
    unittest.main()
