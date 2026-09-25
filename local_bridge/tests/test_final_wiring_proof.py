import hashlib
import time
import unittest
from datetime import datetime, timedelta, timezone
from unittest.mock import patch

import fitz
from fastapi.testclient import TestClient
from cryptography import x509
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import ec, rsa
from cryptography.x509.oid import ExtendedKeyUsageOID, NameOID

from local_bridge.secure_bridge_app import create_secure_bridge_runtime
from local_bridge.security.prepared_signer import FakePreparedPdfSigner
from backend.services.editor_signature_anchor_service import prepare_signature_anchor
from local_bridge.security.protocol import canonicalize_hmac_request, calculate_hmac
from local_bridge.security.protocol import b64url_encode
from local_bridge.security.ui import ApprovalDecision, PendingApprovalUI


def tls_pair():
    key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    now = datetime.now(timezone.utc)
    cert = x509.CertificateBuilder().subject_name(x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, "localhost")])).issuer_name(x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, "localhost")])).public_key(key.public_key()).serial_number(x509.random_serial_number()).not_valid_before(now - timedelta(minutes=1)).not_valid_after(now + timedelta(days=1)).add_extension(x509.SubjectAlternativeName([x509.DNSName("localhost")]), False).add_extension(x509.ExtendedKeyUsage([ExtendedKeyUsageOID.SERVER_AUTH]), False).sign(key, hashes.SHA256())
    return cert.public_bytes(serialization.Encoding.PEM), key.private_bytes(serialization.Encoding.PEM, serialization.PrivateFormat.PKCS8, serialization.NoEncryption())


class FinalWiringProofTests(unittest.TestCase):
    def test_http_runtime_to_operational_factory_and_result(self):
        cert, key = tls_pair()
        trace = []
        fake = FakePreparedPdfSigner(b"synthetic-result")

        def factory(selector):
            trace.append("factory")
            class RuntimeSigner:
                def sign_prepared(self, request):
                    trace.extend(["context_resolver", "boundary", "pyhanko_adapter"])
                    return fake.sign_prepared(request)
            return RuntimeSigner()

        selector = lambda: {"chain_valid": True}
        class ApproveUI(PendingApprovalUI):
            def approve_pairing(self, request): return ApprovalDecision.APPROVED
            def approve_signature(self, operation): return ApprovalDecision.APPROVED
        runtime = create_secure_bridge_runtime(cert_pem=cert, key_pem=key, candidate_selector=selector, operational_signer_factory=factory, ui=ApproveUI())
        client = TestClient(runtime.create_app())
        base = {"host": "localhost:8765", "origin": "https://localhost:5173"}
        client_key = ec.derive_private_key(7, ec.SECP256R1())
        public = client_key.public_key().public_bytes(serialization.Encoding.X962, serialization.PublicFormat.UncompressedPoint)
        pair = client.post("/v1/pairing-requests", headers=base, json={"client_instance_id": b64url_encode(b"c" * 16), "client_nonce": b64url_encode(b"n" * 16), "client_ecdh_public_key": b64url_encode(public)}).json()
        session = pair["session_id"]
        source = fitz.open(); source.new_page(width=595, height=842).insert_text((100, 300), "<<Cirurgião.AssinaturaDigital>>", fontsize=10)
        body = prepare_signature_anchor(source.tobytes()).pdf_bytes
        operation_id = b64url_encode(b"o" * 16)
        params = {"operation_id": operation_id, "field_name": "BranaSignature_1", "policy_oid": "2.16.76.1.7.1.11.1.3", "profile": "pades-ad-rb-1.3"}

        def headers(path, nonce, method="POST", content=None):
            content = body if content is None else content
            ts = int(time.time()); rn = b64url_encode(nonce * 16); digest = hashlib.sha256(content).hexdigest()
            auth_params = {"operation_id": operation_id} if method == "GET" else params
            canonical = canonicalize_hmac_request(method=method, path=path, origin=base["origin"], timestamp=ts, request_nonce=rn, session_id=session, content_sha256=digest, body_length=len(content), parameters=auth_params, operation_id=operation_id)
            return {**base, "X-Brana-Bridge-Protocol": "brana-bridge-v1", "X-Brana-Session": session, "X-Brana-Timestamp": str(ts), "X-Brana-Request-Nonce": rn, "X-Brana-Content-SHA256": digest, "X-Brana-Request-MAC": calculate_hmac(runtime.service.session_keys[session], canonical), "X-Brana-Operation-Id": operation_id, "X-Brana-Field-Name": "BranaSignature_1", "X-Brana-Policy-OID": params["policy_oid"], "X-Brana-Profile": params["profile"]}

        self.assertEqual(client.post("/v1/signature-operations", headers=headers("/v1/signature-operations", b"a"), content=body).status_code, 200)
        self.assertEqual(trace, [])
        signed = client.post(f"/v1/signature-operations/{operation_id}/sign", headers=headers(f"/v1/signature-operations/{operation_id}/sign", b"b"), content=body)
        self.assertEqual(signed.status_code, 200)
        self.assertEqual(trace, ["factory", "context_resolver", "boundary", "pyhanko_adapter"])
        self.assertEqual(len(fake.calls), 1)
        self.assertEqual(runtime.service.state.operations[operation_id].state.value, "COMPLETED")
        self.assertEqual(client.get(f"/v1/signature-operations/{operation_id}/result", headers=headers(f"/v1/signature-operations/{operation_id}/result", b"c", method="GET", content=b"")).status_code, 200)


if __name__ == "__main__":
    unittest.main()
