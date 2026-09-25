import hashlib
import io
import os
import time
import unittest

import fitz
from fastapi.testclient import TestClient
from asn1crypto import cms
from cryptography import x509
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import ec, padding, rsa, utils
from cryptography.x509.oid import ExtendedKeyUsageOID, NameOID
from pypdf import PdfReader
from pyhanko.pdf_utils.reader import PdfFileReader
from pyhanko.sign.validation.pdf_embedded import EmbeddedPdfSignature

from backend.services.editor_signature_anchor_service import prepare_signature_anchor
from local_bridge.secure_bridge_app import create_secure_bridge_runtime
from local_bridge.security.dotnet_sha256_signer import (
    EphemeralDotnetTestHost, PyHankoDotnetSigner,
)
from local_bridge.security.protocol import b64url_encode, calculate_hmac, canonicalize_hmac_request
from local_bridge.security.ui import ApprovalDecision, PendingApprovalUI
from local_bridge.security.windows_prepared_signer import WindowsPreparedPdfSigner
from local_bridge.tests.test_http_real_factory_proof import _tls_pair


class _Approve(PendingApprovalUI):
    def approve_pairing(self, request): return ApprovalDecision.APPROVED
    def approve_signature(self, operation): return ApprovalDecision.APPROVED


class DotnetHttpRealProcessTests(unittest.TestCase):
    def test_real_dotnet_host_crosses_http_and_real_pdfsigner(self):
        exe = os.path.abspath("local_bridge/native_sha256_helper_testhost/bin/Debug/net8.0-windows/win-x64/BranaNativeSha256HelperTestHost.exe")
        if not os.path.isfile(exe):
            self.skipTest("build testhost first")
        holder = {}

        def selector():
            host = holder["host"]
            der = host.certificate_der
            return {"store": "CurrentUser\\My", "chain_valid": True,
                    "_stable_identity": hashlib.sha256(der).hexdigest(),
                    "certificate_der": der}

        async def sign(request, _http_hash):
            host = EphemeralDotnetTestHost(exe)
            holder["host"] = host
            try:
                from asn1crypto import x509 as ax509
                from pyhanko_certvalidator.registry import SimpleCertificateStore
                signer = PyHankoDotnetSigner(signing_cert=ax509.Certificate.load(host.certificate_der),
                    cert_registry=SimpleCertificateStore(), boundary=host)
                from pyhanko.pdf_utils.incremental_writer import IncrementalPdfFileWriter
                from pyhanko.sign.fields import SigSeedSubFilter
                from pyhanko.sign.signers import PdfSigner, PdfSignatureMetadata
                from local_bridge.pdf_signing import build_offline_pades_policy
                writer = IncrementalPdfFileWriter(io.BytesIO(request.pdf_bytes))
                output = io.BytesIO()
                meta = PdfSignatureMetadata(field_name="BranaSignature_1", md_algorithm="sha256",
                    subfilter=SigSeedSubFilter.PADES, cades_signed_attr_spec=build_offline_pades_policy())
                await PdfSigner(signature_meta=meta, signer=signer).async_sign_pdf(
                    writer, existing_fields_only=True, output=output)
                return output.getvalue()
            finally:
                host.close()

        def factory(_selector):
            result = WindowsPreparedPdfSigner(lambda _request: b"", async_signer_callable=sign)
            result.production_wiring = True
            return result
        factory.real_wiring = True
        cert, key = _tls_pair()
        runtime = create_secure_bridge_runtime(cert_pem=cert, key_pem=key,
            candidate_selector=selector, operational_signer_factory=factory,
            ui=_Approve(), production_mode=True, enable_real_signing=True)
        client = TestClient(runtime.create_app())
        base = {"host": "localhost:8765", "origin": "https://localhost:5173"}
        ck = ec.derive_private_key(13, ec.SECP256R1())
        pub = ck.public_key().public_bytes(serialization.Encoding.X962, serialization.PublicFormat.UncompressedPoint)
        pair = client.post("/v1/pairing-requests", headers=base, json={
            "client_instance_id": b64url_encode(b"i" * 16), "client_nonce": b64url_encode(b"j" * 16),
            "client_ecdh_public_key": b64url_encode(pub)}).json()
        session = pair["session_id"]
        source = fitz.open(); source.new_page(width=595, height=842).insert_text(
            (100, 300), "<<Cirurgião.AssinaturaDigital>>", fontsize=10)
        body = prepare_signature_anchor(source.tobytes()).pdf_bytes
        op = b64url_encode(b"d" * 16)
        params = {"operation_id": op, "field_name": "BranaSignature_1",
                  "policy_oid": "2.16.76.1.7.1.11.1.3", "profile": "pades-ad-rb-1.3"}
        def h(path, nonce, method="POST", content=body):
            ts = int(time.time()); rn = b64url_encode(nonce * 16); digest = hashlib.sha256(content).hexdigest()
            canonical = canonicalize_hmac_request(method=method, path=path, origin=base["origin"], timestamp=ts,
                request_nonce=rn, session_id=session, content_sha256=digest, body_length=len(content),
                parameters=params if method == "POST" else {"operation_id": op}, operation_id=op)
            return {**base, "X-Brana-Bridge-Protocol": "brana-bridge-v1", "X-Brana-Session": session,
                "X-Brana-Timestamp": str(ts), "X-Brana-Request-Nonce": rn, "X-Brana-Content-SHA256": digest,
                "X-Brana-Request-MAC": calculate_hmac(runtime.service.session_keys[session], canonical),
                "X-Brana-Operation-Id": op, "X-Brana-Field-Name": params["field_name"],
                "X-Brana-Policy-OID": params["policy_oid"], "X-Brana-Profile": params["profile"]}
        self.assertEqual(client.post("/v1/signature-operations", headers=h("/v1/signature-operations", b"a"), content=body).status_code, 200)
        signed = client.post(f"/v1/signature-operations/{op}/sign", headers=h(f"/v1/signature-operations/{op}/sign", b"b"), content=body)
        self.assertEqual(signed.status_code, 200)
        result = client.get(f"/v1/signature-operations/{op}/result", headers=h(f"/v1/signature-operations/{op}/result", b"c", "GET", b""))
        self.assertEqual(result.status_code, 200)
        self.assertIn(b"/ByteRange", result.content)
        fields = PdfReader(io.BytesIO(result.content)).get_fields() or {}
        self.assertEqual(list(fields), ["BranaSignature_1"])
        self.assertIsNotNone(fields["BranaSignature_1"].get("/V"))
        reader = PdfFileReader(io.BytesIO(result.content)); field = reader.root['/AcroForm']['/Fields'][0].get_object()
        embedded = EmbeddedPdfSignature(reader, field, "BranaSignature_1")
        br = [int(x) for x in embedded.byte_range]
        covered = result.content[br[0]:br[0]+br[1]] + result.content[br[2]:br[2]+br[3]]
        md = next(a['values'][0].native for a in embedded.signer_info['signed_attrs'] if a['type'].native == 'message_digest')
        self.assertEqual(md, hashlib.sha256(covered).digest())
        certs = embedded.signed_data['certificates']
        self.assertTrue(any(c.chosen.dump() == holder['host'].certificate_der for c in certs if c.name == 'certificate'))
        embedded_cert = x509.load_der_x509_certificate(holder['host'].certificate_der)
        signed_attrs = embedded.signer_info['signed_attrs'].dump()
        embedded_cert.public_key().verify(
            embedded.signer_info['signature'].native,
            b'\x31' + signed_attrs[1:], padding.PKCS1v15(), hashes.SHA256())
        policy_found = any(attr['type'].native == 'signature_policy_identifier'
                           and "2.16.76.1.7.1.11.1.3" in str(attr['values'][0].native)
                           for attr in embedded.signer_info['signed_attrs'])
        self.assertTrue(policy_found)
        runtime.close()

    def test_test_host_is_forbidden_in_production(self):
        from local_bridge.security.dotnet_sha256_signer import create_ephemeral_test_signer, DotnetHelperError
        with self.assertRaisesRegex(DotnetHelperError, "TEST_HOST_FORBIDDEN_IN_PRODUCTION"):
            create_ephemeral_test_signer(executable="C:\\testhost.exe", production_mode=True)
