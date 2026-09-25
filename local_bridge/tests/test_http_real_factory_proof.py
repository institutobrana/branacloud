import hashlib
import time
import unittest
from datetime import datetime, timedelta, timezone

import fitz
from pypdf import PdfReader
import io
from fastapi.testclient import TestClient
from cryptography import x509
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import ec, rsa, padding
from cryptography.hazmat.primitives.serialization import PublicFormat
from cryptography.hazmat.primitives.asymmetric import utils
from cryptography.x509.oid import ExtendedKeyUsageOID, NameOID

from backend.services.editor_signature_anchor_service import prepare_signature_anchor
from local_bridge.secure_bridge_app import create_secure_bridge_runtime
from local_bridge.security.direct_csp_adapter import PublicCspMetadata
from local_bridge.security.protocol import b64url_encode, calculate_hmac, canonicalize_hmac_request
from local_bridge.security.ui import ApprovalDecision, PendingApprovalUI
from local_bridge.security.windows_prepared_signer import create_real_operational_windows_prepared_signer
from local_bridge.security.direct_csp_adapter import DirectCspError
from pyhanko.pdf_utils.reader import PdfFileReader
from pyhanko.sign.validation.pdf_embedded import EmbeddedPdfSignature
from asn1crypto import cms


class _Context:
    def __init__(self, trace):
        self.context = 7
        self.trace = trace
        self.closed = False

    def close(self):
        self.closed = True
        self.trace.append("context_close")


class _Contexts:
    def __init__(self, context, trace):
        self.context = context
        self.trace = trace

    def open(self, identity):
        self.trace.append(("context_open", identity))
        return self.context


class _CryptoApi:
    def __init__(self, trace, signing_key):
        self.trace = trace
        self.signing_key = signing_key

    def acquire(self, context, key_spec):
        self.trace.append(("acquire", context, key_spec))
        return 1, 2, 1

    def sign_hash(self, key, digest):
        self.trace.append(("sign_hash", bytes(digest)))
        return self.signing_key.sign(bytes(digest), padding.PKCS1v15(), utils.Prehashed(hashes.SHA256()))[::-1]

    def release(self, key):
        self.trace.append("native_release")


def _tls_pair():
    key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    now = datetime.now(timezone.utc)
    cert = x509.CertificateBuilder().subject_name(x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, "localhost")])).issuer_name(x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, "localhost")])).public_key(key.public_key()).serial_number(x509.random_serial_number()).not_valid_before(now - timedelta(minutes=1)).not_valid_after(now + timedelta(days=1)).add_extension(x509.SubjectAlternativeName([x509.DNSName("localhost")]), False).add_extension(x509.ExtendedKeyUsage([ExtendedKeyUsageOID.SERVER_AUTH]), False).sign(key, hashes.SHA256())
    return cert.public_bytes(serialization.Encoding.PEM), key.private_bytes(serialization.Encoding.PEM, serialization.PrivateFormat.PKCS8, serialization.NoEncryption())


class _Approve(PendingApprovalUI):
    def approve_pairing(self, request):
        return ApprovalDecision.APPROVED

    def approve_signature(self, operation):
        return ApprovalDecision.APPROVED


class HttpRealFactoryProofTests(unittest.TestCase):
    def test_production_http_route_reaches_concrete_factory(self):
        trace = []
        context = _Context(trace)
        candidate = {"store": "CurrentUser\\My", "_stable_identity": "b" * 64, "chain_valid": True, "provider_name": "Microsoft Enhanced Cryptographic Provider v1.0", "provider_kind": "CSP", "key_algorithm": "RSA", "key_size": 2048, "has_private_key": True, "key_spec": 1}
        contexts = _Contexts(context, trace)
        signing_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
        signing_cert = x509.CertificateBuilder().subject_name(x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, "synthetic-signer")])).issuer_name(x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, "synthetic-signer")])).public_key(signing_key.public_key()).serial_number(x509.random_serial_number()).not_valid_before(datetime.now(timezone.utc) - timedelta(minutes=1)).not_valid_after(datetime.now(timezone.utc) + timedelta(days=1)).sign(signing_key, hashes.SHA256())
        native = _CryptoApi(trace, signing_key)
        selector_calls = []

        def selector():
            selector_calls.append("selector")
            return candidate

        factory = create_real_operational_windows_prepared_signer(context_factory=contexts, boundary_api=native)
        cert, key = _tls_pair()
        candidate["certificate_der"] = signing_cert.public_bytes(serialization.Encoding.DER)
        runtime = create_secure_bridge_runtime(cert_pem=cert, key_pem=key, candidate_selector=selector, operational_signer_factory=factory, ui=_Approve(), production_mode=True, enable_real_signing=True)
        client = TestClient(runtime.create_app())
        base = {"host": "localhost:8765", "origin": "https://localhost:5173"}
        client_key = ec.derive_private_key(7, ec.SECP256R1())
        public = client_key.public_key().public_bytes(serialization.Encoding.X962, serialization.PublicFormat.UncompressedPoint)
        pair = client.post("/v1/pairing-requests", headers=base, json={"client_instance_id": b64url_encode(b"c" * 16), "client_nonce": b64url_encode(b"n" * 16), "client_ecdh_public_key": b64url_encode(public)}).json()
        session = pair["session_id"]
        source = fitz.open()
        source.new_page(width=595, height=842).insert_text((100, 300), "<<Cirurgião.AssinaturaDigital>>", fontsize=10)
        body = prepare_signature_anchor(source.tobytes()).pdf_bytes
        operation_id = b64url_encode(b"r" * 16)
        params = {"operation_id": operation_id, "field_name": "BranaSignature_1", "policy_oid": "2.16.76.1.7.1.11.1.3", "profile": "pades-ad-rb-1.3"}

        def headers(path, nonce, method="POST", content=None):
            content = body if content is None else content
            ts = int(time.time())
            rn = b64url_encode(nonce * 16)
            digest = hashlib.sha256(content).hexdigest()
            auth_params = params if method == "POST" else {"operation_id": operation_id}
            canonical = canonicalize_hmac_request(method=method, path=path, origin=base["origin"], timestamp=ts, request_nonce=rn, session_id=session, content_sha256=digest, body_length=len(content), parameters=auth_params, operation_id=operation_id)
            return {**base, "X-Brana-Bridge-Protocol": "brana-bridge-v1", "X-Brana-Session": session, "X-Brana-Timestamp": str(ts), "X-Brana-Request-Nonce": rn, "X-Brana-Content-SHA256": digest, "X-Brana-Request-MAC": calculate_hmac(runtime.service.session_keys[session], canonical), "X-Brana-Operation-Id": operation_id, "X-Brana-Field-Name": params["field_name"], "X-Brana-Policy-OID": params["policy_oid"], "X-Brana-Profile": params["profile"]}

        self.assertEqual(client.post("/v1/signature-operations", headers=headers("/v1/signature-operations", b"a"), content=body).status_code, 200)
        response = client.post(f"/v1/signature-operations/{operation_id}/sign", headers=headers(f"/v1/signature-operations/{operation_id}/sign", b"b"), content=body)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["state"], "COMPLETED")
        self.assertEqual(selector_calls, ["selector"])
        self.assertEqual(trace[0], ("context_open", candidate["_stable_identity"]))
        self.assertEqual([item[0] for item in trace if isinstance(item, tuple)], ["context_open", "acquire", "sign_hash"])
        self.assertIn("native_release", trace)
        self.assertIn("context_close", trace)
        result = client.get(f"/v1/signature-operations/{operation_id}/result", headers=headers(f"/v1/signature-operations/{operation_id}/result", b"c", method="GET", content=b""))
        self.assertEqual(result.status_code, 200)
        self.assertIn(b"/ByteRange", result.content)
        fields = PdfReader(io.BytesIO(result.content)).get_fields() or {}
        self.assertEqual(list(fields), ["BranaSignature_1"])
        self.assertIsNotNone(fields["BranaSignature_1"].get("/V"))
        reader = PdfFileReader(io.BytesIO(result.content))
        field = reader.root['/AcroForm']['/Fields'][0].get_object()
        embedded = EmbeddedPdfSignature(reader, field, "BranaSignature_1")
        byte_range = [int(x) for x in embedded.byte_range]
        self.assertEqual(byte_range[0], 0)
        self.assertEqual(byte_range[2] + byte_range[3], len(result.content))
        covered = result.content[byte_range[0]:byte_range[0] + byte_range[1]] + result.content[byte_range[2]:byte_range[2] + byte_range[3]]
        message_digest = next(attr['values'][0].native for attr in embedded.signer_info['signed_attrs'] if attr['type'].native == 'message_digest')
        self.assertEqual(message_digest, hashlib.sha256(covered).digest())
        signature = embedded.signer_info['signature'].native
        signed_attrs_der = embedded.signer_info['signed_attrs'].dump()
        signing_cert.public_key().verify(signature, b'\x31' + signed_attrs_der[1:], padding.PKCS1v15(), hashes.SHA256())
        certs = embedded.signed_data['certificates']
        self.assertTrue(any(item.chosen.dump() == signing_cert.public_bytes(serialization.Encoding.DER) for item in certs if item.name == 'certificate'))
        policy_found = any(attr['type'].native == 'signature_policy_identifier' and '2.16.76.1.7.1.11.1.3' in str(attr['values'][0].native) for attr in embedded.signer_info['signed_attrs'])
        self.assertTrue(policy_found)
        tampered = bytearray(result.content)
        tampered[byte_range[2] + 1] ^= 1
        self.assertNotEqual(hashlib.sha256(bytes(tampered)[byte_range[0]:byte_range[0] + byte_range[1]] + bytes(tampered)[byte_range[2]:byte_range[2] + byte_range[3]]).digest(), message_digest)

    def test_native_failures_cross_real_pdfsigner_to_http(self):
        """Every injected native failure crosses the real ASGI/PdfSigner path."""
        source = fitz.open(); source.new_page(width=595, height=842).insert_text((100, 300), "<<Cirurgião.AssinaturaDigital>>", fontsize=10)
        body = prepare_signature_anchor(source.tobytes()).pdf_bytes
        signing_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
        signing_cert = x509.CertificateBuilder().subject_name(x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, "synthetic-failure")])).issuer_name(x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, "synthetic-failure")])).public_key(signing_key.public_key()).serial_number(x509.random_serial_number()).not_valid_before(datetime.now(timezone.utc) - timedelta(minutes=1)).not_valid_after(datetime.now(timezone.utc) + timedelta(days=1)).sign(signing_key, hashes.SHA256())
        cert, key = _tls_pair()
        for phase, native_error, expected_code in (
            ("context", None, "CSP_CONTEXT_OPEN_FAILED"),
            ("acquire", 5, "CSP_KEY_ACQUISITION_FAILED"),
            ("key_spec", 87, "CSP_KEY_SPEC_MISMATCH"),
            ("hash", 87, "CSP_HASH_CREATE_FAILED"),
            ("sign", 5, "CSP_SIGN_HASH_FAILED"),
            ("release", None, "CSP_HANDLE_RELEASE_FAILED"),
        ):
            trace = []
            candidate = {"store": "CurrentUser\\My", "_stable_identity": "c" * 64, "chain_valid": True, "provider_name": "Microsoft Enhanced Cryptographic Provider v1.0", "provider_kind": "CSP", "key_algorithm": "RSA", "key_size": 2048, "has_private_key": True, "key_spec": 1, "certificate_der": signing_cert.public_bytes(serialization.Encoding.DER)}
            class Contexts(_Contexts):
                def open(self, identity):
                    trace.append("context_open")
                    if phase == "context": raise DirectCspError(expected_code, phase="certificate_resolution", retryable=False)
                    return self.context
            class Native(_CryptoApi):
                def acquire(self, context, key_spec):
                    trace.append("acquire")
                    if phase == "acquire": raise DirectCspError(expected_code, phase="key_acquisition", retryable=False) from OSError(native_error, "CryptoAPI")
                    if phase == "key_spec": return (1, 1, 99)
                    return (1, 1, 1)
                def sign_hash(self, key, digest):
                    trace.append("sign_hash")
                    if phase == "hash": raise DirectCspError(expected_code, phase="hash_creation", retryable=False)
                    if phase == "sign": raise DirectCspError(expected_code, phase="provider_sign", retryable=False) from OSError(native_error, "CryptoAPI")
                    return b"x" * 256
                def release(self, key):
                    trace.append("release")
                    if phase == "release": raise DirectCspError(expected_code, phase="resource_release", retryable=False)
            contexts = Contexts(_Context(trace), trace); native = Native(trace, signing_key)
            factory = create_real_operational_windows_prepared_signer(context_factory=contexts, boundary_api=native)
            runtime = create_secure_bridge_runtime(cert_pem=cert, key_pem=key, candidate_selector=lambda: candidate, operational_signer_factory=factory, ui=_Approve(), production_mode=True, enable_real_signing=True)
            client = TestClient(runtime.create_app()); base={"host":"localhost:8765","origin":"https://localhost:5173"}; ck=ec.derive_private_key(9, ec.SECP256R1()); pub=b64url_encode(ck.public_key().public_bytes(serialization.Encoding.X962, PublicFormat.UncompressedPoint)); pair=client.post("/v1/pairing-requests",headers=base,json={"client_instance_id":b64url_encode(b"d"*16),"client_nonce":b64url_encode(b"e"*16),"client_ecdh_public_key":pub}).json(); session=pair["session_id"]; op=b64url_encode(bytes([ord(phase[0])])*16); path="/v1/signature-operations"; params={"operation_id":op,"field_name":"BranaSignature_1","policy_oid":"2.16.76.1.7.1.11.1.3","profile":"pades-ad-rb-1.3"}
            def h(p, n, method="POST"):
                ts=int(time.time()); rn=b64url_encode(n*16); content=body; digest=hashlib.sha256(content).hexdigest(); ap=params if method=="POST" else {"operation_id":op}; can=canonicalize_hmac_request(method=method,path=p,origin=base["origin"],timestamp=ts,request_nonce=rn,session_id=session,content_sha256=digest,body_length=len(content),parameters=ap,operation_id=op); return {**base,"X-Brana-Bridge-Protocol":"brana-bridge-v1","X-Brana-Session":session,"X-Brana-Timestamp":str(ts),"X-Brana-Request-Nonce":rn,"X-Brana-Content-SHA256":digest,"X-Brana-Request-MAC":calculate_hmac(runtime.service.session_keys[session],can),"X-Brana-Operation-Id":op,"X-Brana-Field-Name":"BranaSignature_1","X-Brana-Policy-OID":params["policy_oid"],"X-Brana-Profile":params["profile"]}
            self.assertEqual(client.post(path,headers=h(path,b"a"),content=body).status_code,200); sign_path=f"/v1/signature-operations/{op}/sign"; response=client.post(sign_path,headers=h(sign_path,b"b"),content=body); self.assertIn("context_open", trace); self.assertIn(response.status_code,(200,502)); self.assertEqual(response.status_code,502, f"injection not reached for {phase}: {trace}"); payload=response.json(); self.assertEqual(runtime.service.state.operations[op].state.value,"FAILED"); self.assertEqual(payload.get("phase"), {"context":"certificate_resolution","acquire":"key_acquisition","key_spec":"key_acquisition","hash":"hash_creation","sign":"provider_sign","release":"resource_release"}[phase]); self.assertEqual(payload.get("detail_code"), expected_code); runtime.close()


if __name__ == "__main__":
    unittest.main()
