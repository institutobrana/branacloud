import hashlib
import io
import os
import tempfile
import unittest

import fitz
import httpx
from fastapi.testclient import TestClient
from pypdf import PdfReader
from pyhanko.pdf_utils.reader import PdfFileReader
from pyhanko.sign.validation.pdf_embedded import EmbeddedPdfSignature
from cryptography import x509
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding

from backend.services.editor_signature_anchor_service import prepare_signature_anchor
from local_bridge.security.http_protocol import HttpProtocolService
from local_bridge.security.ui import ApprovalDecision, PendingApprovalUI
from local_bridge.security.windows_prepared_signer import WindowsPreparedPdfSigner
from local_bridge.security.dotnet_sha256_signer import EphemeralDotnetTestHost, PyHankoDotnetSigner
from local_bridge.smoke_runner import SmokeHttpRunner


class _Approve(PendingApprovalUI):
    def approve_pairing(self, request): return ApprovalDecision.APPROVED
    def approve_signature(self, operation): return ApprovalDecision.APPROVED


class _Client:
    def __init__(self, client, mode="ok"):
        self.client, self.mode, self.calls = client, mode, []
        self.timeout = type("T", (), {"read": 120.0})()
    def post(self, path, **kwargs):
        self.calls.append(("POST", path))
        response = self.client.post(path, **kwargs)
        if self.mode == "lost" and path.endswith("/sign"):
            raise httpx.ReadTimeout("response lost after server completion")
        return response
    def get(self, path, **kwargs):
        self.calls.append(("GET", path))
        if self.mode == "invalid" and path.endswith("/result"):
            return httpx.Response(200, content=b"not-a-pdf")
        if self.mode == "unavailable" and path.endswith("/result"):
            return httpx.Response(503, json={"error_code": "RESULT_UNAVAILABLE"})
        return self.client.get(path, **kwargs)
    def delete(self, path, **kwargs): return self.client.delete(path, **kwargs)
    def close(self): pass


class RecoveryRunnerE2ETests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.exe = os.path.abspath("local_bridge/native_sha256_helper_testhost/bin/Debug/net8.0-windows/win-x64/BranaNativeSha256HelperTestHost.exe")

    def _pdf(self):
        source = fitz.open(); source.new_page(width=595, height=842).insert_text((100, 300), "<<Cirurgião.AssinaturaDigital>>", fontsize=10)
        return prepare_signature_anchor(source.tobytes()).pdf_bytes

    def _runner(self, mode="ok"):
        holder = {}
        async def sign(request, _digest):
            host = EphemeralDotnetTestHost(self.exe); holder["host"] = host
            try:
                from asn1crypto import x509 as ax509
                from pyhanko_certvalidator.registry import SimpleCertificateStore
                from pyhanko.pdf_utils.incremental_writer import IncrementalPdfFileWriter
                from pyhanko.sign.fields import SigSeedSubFilter
                from pyhanko.sign.signers import PdfSigner, PdfSignatureMetadata
                from local_bridge.pdf_signing import build_offline_pades_policy
                signer = PyHankoDotnetSigner(signing_cert=ax509.Certificate.load(host.certificate_der), cert_registry=SimpleCertificateStore(), boundary=host)
                out = io.BytesIO()
                await PdfSigner(signature_meta=PdfSignatureMetadata(field_name="BranaSignature_1", md_algorithm="sha256", subfilter=SigSeedSubFilter.PADES, cades_signed_attr_spec=build_offline_pades_policy()), signer=signer).async_sign_pdf(IncrementalPdfFileWriter(io.BytesIO(request.pdf_bytes)), existing_fields_only=True, output=out)
                return out.getvalue()
            finally: host.close()
        prepared = WindowsPreparedPdfSigner(lambda r: b"", async_signer_callable=sign)
        service = HttpProtocolService(ui=_Approve(), signer=prepared, signing_enabled=True)
        asgi = TestClient(service.create_app())
        client = _Client(asgi, mode)
        return SmokeHttpRunner(http_client=client), client, holder

    def _prepare(self, runner):
        response, key, nonce = runner.pairing(); runner.accept_pairing(response, key, nonce)
        pdf = self._pdf(); op = "cmVjb3Zlcnktb3BlcmF0aW9u"
        self.assertEqual(runner.create_operation(operation_id=op, pdf_bytes=pdf).json()["state"], "APPROVED")
        return op, pdf

    def test_success_completed_result_saved_and_validated(self):
        runner, client, holder = self._runner(); op, pdf = self._prepare(runner)
        with tempfile.TemporaryDirectory() as d:
            result = runner.sign_once_and_recover(operation_id=op, pdf_bytes=pdf, output_path=os.path.join(d, "signed.pdf"))
            self.assertTrue(result["saved"]); self.assertEqual(result["size"], os.path.getsize(result["path"]))
            data = open(result["path"], "rb").read(); self.assertEqual(result["sha256"], hashlib.sha256(data).hexdigest())
            fields = PdfReader(io.BytesIO(data)).get_fields() or {}; self.assertIsNotNone(fields["BranaSignature_1"].get("/V"))
            reader = PdfFileReader(io.BytesIO(data)); field = reader.root['/AcroForm']['/Fields'][0].get_object(); embedded = EmbeddedPdfSignature(reader, field, "BranaSignature_1")
            br = [int(x) for x in embedded.byte_range]; covered = data[br[0]:br[0]+br[1]] + data[br[2]:br[2]+br[3]]
            md = next(a['values'][0].native for a in embedded.signer_info['signed_attrs'] if a['type'].native == 'message_digest'); self.assertEqual(md, hashlib.sha256(covered).digest())
            cert_der = holder["host"].certificate_der
            signing_cert = x509.load_der_x509_certificate(cert_der)
            signed_attrs = embedded.signer_info['signed_attrs'].dump()
            signing_cert.public_key().verify(embedded.signer_info['signature'].native,
                b'\x31' + signed_attrs[1:], padding.PKCS1v15(), hashes.SHA256())
            self.assertTrue(any(c.chosen.dump() == cert_der for c in embedded.signed_data['certificates'] if c.name == 'certificate'))
            self.assertTrue(any(a['type'].native == 'signature_policy_identifier' and '2.16.76.1.7.1.11.1.3' in str(a['values'][0].native) for a in embedded.signer_info['signed_attrs']))
            self.assertEqual(len([x for m,x in client.calls if m == "POST" and x.endswith('/sign')]), 1)
        runner.close()

    def test_lost_sign_response_recovered_without_second_sign(self):
        runner, client, holder = self._runner("lost"); op, pdf = self._prepare(runner)
        with tempfile.TemporaryDirectory() as d:
            result = runner.sign_once_and_recover(operation_id=op, pdf_bytes=pdf, output_path=os.path.join(d, "signed.pdf"))
            self.assertTrue(result["saved"]); self.assertEqual(sum(m == "POST" and p.endswith('/sign') for m,p in client.calls), 1)
        runner.close()

    def test_invalid_result_fails_closed_without_saved_pdf(self):
        runner, client, holder = self._runner("invalid"); op, pdf = self._prepare(runner)
        with tempfile.TemporaryDirectory() as d:
            result = runner.sign_once_and_recover(operation_id=op, pdf_bytes=pdf, output_path=os.path.join(d, "signed.pdf"))
            self.assertFalse(result["saved"]); self.assertFalse(os.path.exists(os.path.join(d, "signed.pdf")))
        runner.close()

    def test_unavailable_result_is_terminal_and_no_sign_retry(self):
        runner, client, holder = self._runner("unavailable"); op, pdf = self._prepare(runner)
        with tempfile.TemporaryDirectory() as d:
            result = runner.sign_once_and_recover(operation_id=op, pdf_bytes=pdf, output_path=os.path.join(d, "signed.pdf"))
            self.assertFalse(result["saved"]); self.assertEqual(sum(m == "POST" and p.endswith('/sign') for m,p in client.calls), 1)
        runner.close()
