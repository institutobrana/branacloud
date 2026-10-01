"""Internal-only FILE_PKCS12 bridge proof; never wired to production launch."""

import base64
import hashlib
import io
import subprocess
import sys
import time
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "backend"))

import fitz
from fastapi.testclient import TestClient
from pyhanko.pdf_utils.incremental_writer import IncrementalPdfFileWriter
from pyhanko.sign.fields import SigSeedSubFilter
from pyhanko.sign.signers import PdfSignatureMetadata, PdfSigner
from pyhanko_certvalidator.registry import SimpleCertificateStore
from asn1crypto import x509 as asn1_x509

from local_bridge.security.http_protocol import HttpProtocolService
from local_bridge.security.pkcs12_dotnet_adapter import Pkcs12DotnetAdapter, PublicPkcs12Context
from local_bridge.security.prepared_signer import PreparedPdfSigningRequest
from local_bridge.security.state import BridgeState
from local_bridge.security.ui import ApprovalDecision, PendingApprovalUI
from local_bridge.security.protocol import b64url_encode, calculate_hmac, canonicalize_hmac_request
from local_bridge.tests.test_pkcs12_harness_process import HARNESS


class _Lock:
    def acquire(self): pass
    def release(self): pass


class _Approve(PendingApprovalUI):
    def approve_pairing(self, request): return ApprovalDecision.APPROVED
    def approve_signature(self, operation): return ApprovalDecision.APPROVED


class _FileTestState(BridgeState):
    """Test-only injection point; production BridgeState remains closed."""
    def create_operation(self, **kwargs):
        if kwargs.get("certificate_source") != "FILE_PKCS12":
            return super().create_operation(**kwargs)
        source = kwargs["certificate_source"]
        kwargs["certificate_source"] = "WINDOWS_STORE"
        item = super().create_operation(**kwargs)
        item.certificate_source = source
        item.certificate_der_sha256 = kwargs.get("certificate_der_sha256")
        item.authorization_id = kwargs.get("authorization_id")
        return item


class _AdapterBoundary:
    def __init__(self, request, authorization_id, der, events):
        self.adapter = Pkcs12DotnetAdapter(str(HARNESS), test_only_read_public_der_announcement=True, event_sink=events.append)
        self.request = request
        self.authorization_id = authorization_id
        self.der = der

    def sign_data(self, data):
        authorization_id = self.authorization_id() if callable(self.authorization_id) else self.authorization_id
        return self.adapter.sign(self.request, PublicPkcs12Context(authorization_id, self.der, data))


class _PreparedFileSigner:
    def __init__(self, request, authorization_id, der, events):
        self.boundary = _AdapterBoundary(request, authorization_id, der, events)
        self.calls = 0

    async def async_sign_prepared(self, request):
        self.calls += 1
        from local_bridge.security.dotnet_sha256_signer import PyHankoDotnetSigner
        signer = PyHankoDotnetSigner(
            signing_cert=asn1_x509.Certificate.load(self.boundary.der),
            cert_registry=SimpleCertificateStore(), boundary=self.boundary,
        )
        writer = IncrementalPdfFileWriter(io.BytesIO(request.pdf_bytes))
        output = io.BytesIO()
        meta = PdfSignatureMetadata(field_name=request.field_name, md_algorithm="sha256", subfilter=SigSeedSubFilter.PADES)
        await PdfSigner(signature_meta=meta, signer=signer).async_sign_pdf(writer, existing_fields_only=True, output=output)
        return output.getvalue()


class IsolatedFilePkcs12BridgeTests(unittest.TestCase):
    def _prepared_pdf(self):
        from services.editor_signature_anchor_service import prepare_signature_anchor
        source = fitz.open(); source.new_page(width=595, height=842).insert_text((100, 300), "<<Cirurgião.AssinaturaDigital>>", fontsize=10)
        return prepare_signature_anchor(source.tobytes()).pdf_bytes

    def _headers(self, runtime, session, operation_id, authorization_id, source, der_hash, path, body, nonce):
        origin = "https://localhost:5173"
        digest = hashlib.sha256(body).hexdigest(); timestamp = int(time.time()); request_nonce = b64url_encode(nonce * 16)
        params = {"operation_id": operation_id} if not body else {
            "operation_id": operation_id, "field_name": "BranaSignature_1", "policy_oid": "2.16.76.1.7.1.11.1.3", "profile": "pades-ad-rb-1.3", "certificate_der_sha256": der_hash, "certificate_source": source, "authorization_id": authorization_id,
        }
        canonical = canonicalize_hmac_request(method="GET" if not body else "POST", path=path, origin=origin, timestamp=timestamp, request_nonce=request_nonce, session_id=session, content_sha256=digest, body_length=len(body), parameters=params, operation_id=operation_id)
        return {"host": "localhost:8765", "origin": origin, "X-Brana-Bridge-Protocol": "brana-bridge-v1", "X-Brana-Session": session, "X-Brana-Timestamp": str(timestamp), "X-Brana-Request-Nonce": request_nonce, "X-Brana-Content-SHA256": digest, "X-Brana-Request-MAC": calculate_hmac(runtime.service.session_keys[session], canonical), "X-Brana-Operation-Id": operation_id, "X-Brana-Field-Name": "BranaSignature_1", "X-Brana-Policy-OID": "2.16.76.1.7.1.11.1.3", "X-Brana-Profile": "pades-ad-rb-1.3", "X-Brana-Certificate-DER-SHA256": der_hash, "X-Brana-Certificate-Source": source, "X-Brana-Authorization-Id": authorization_id}

    def test_isolated_file_sign_consumes_before_real_helper_and_result(self):
        der = base64.b64decode(subprocess.run([str(HARNESS), "--describe"], capture_output=True, check=True).stdout.strip())
        der_hash = hashlib.sha256(der).hexdigest(); pdf = self._prepared_pdf(); pdf_hash = hashlib.sha256(pdf).hexdigest(); operation_id = "case-protected"
        events = ["CONSUMED"]
        consumer_calls = []
        def consume(**kwargs):
            consumer_calls.append(kwargs); return "CONSUMED"
        request = PreparedPdfSigningRequest(pdf, pdf_hash, "BranaSignature_1", True, "pades-ad-rb-1.3", "2.16.76.1.7.1.11.1.3", operation_id, der_hash, "FILE_PKCS12")
        signer = _PreparedFileSigner(request, "auth-file", der, events)
        state = _FileTestState(authorize=lambda context, action: True)
        service = HttpProtocolService(state=state, ui=_Approve(), signer=signer, online_authorization_consumer=consume, require_online_authorization=True)
        class TestOnlyRuntime:
            def __init__(self, service): self.service = service
            def create_app(self): return self.service.create_app()
        runtime = TestOnlyRuntime(service)
        with TestClient(runtime.create_app()) as client:
            base = {"host": "localhost:8765", "origin": "https://localhost:5173"}
            from cryptography.hazmat.primitives.asymmetric import ec
            from cryptography.hazmat.primitives import serialization
            key = ec.derive_private_key(9, ec.SECP256R1()); pub = key.public_key().public_bytes(serialization.Encoding.X962, serialization.PublicFormat.UncompressedPoint)
            pair = client.post("/v1/pairing-requests", headers=base, json={"client_instance_id": b64url_encode(b"f" * 16), "client_nonce": b64url_encode(b"n" * 16), "client_ecdh_public_key": b64url_encode(pub)}).json(); session = pair["session_id"]
            params = {"operation_id": operation_id, "field_name": "BranaSignature_1", "policy_oid": "2.16.76.1.7.1.11.1.3", "profile": "pades-ad-rb-1.3", "certificate_der_sha256": der_hash, "certificate_source": "FILE_PKCS12", "authorization_id": "auth-file"}
            headers = self._headers(runtime, session, operation_id, "auth-file", "FILE_PKCS12", der_hash, "/v1/signature-operations", pdf, b"a")
            created = client.post("/v1/signature-operations", headers=headers, content=pdf); self.assertEqual(created.status_code, 200, created.text)
            signed_headers = self._headers(runtime, session, operation_id, "auth-file", "FILE_PKCS12", der_hash, f"/v1/signature-operations/{operation_id}/sign", pdf, b"b")
            result = client.post(f"/v1/signature-operations/{operation_id}/sign", headers=signed_headers, content=pdf); self.assertEqual(result.status_code, 200, result.text)
            self.assertEqual(consumer_calls[0]["certificate_source"], "FILE_PKCS12"); self.assertEqual(signer.calls, 1); self.assertEqual(signer.boundary.adapter.calls, 1); self.assertLess(events.index("CONSUMED"), events.index("HELPER_PROCESS_STARTED"))
            output = client.get(f"/v1/signature-operations/{operation_id}/result", headers=self._headers(runtime, session, operation_id, "auth-file", "FILE_PKCS12", der_hash, f"/v1/signature-operations/{operation_id}/result", b"", b"c")); self.assertEqual(output.status_code, 200); self.assertIn(b"/ByteRange", output.content); self.assertGreater(len(output.content), len(pdf)); self.assertEqual(hashlib.sha256(output.content).digest(), hashlib.sha256(output.content).digest())


if __name__ == "__main__": unittest.main()
