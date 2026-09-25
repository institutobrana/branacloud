import hashlib
import time
import unittest
import fitz
import threading
import io
from concurrent.futures import ThreadPoolExecutor

from fastapi.testclient import TestClient
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives.serialization import Encoding, PublicFormat

from local_bridge.security.http_protocol import HttpProtocolService
from local_bridge.security.prepared_signer import FakePreparedPdfSigner
from local_bridge.security.protocol import b64url_encode, calculate_hmac, canonicalize_hmac_request
from local_bridge.security.ui import ApprovalDecision, PendingApprovalUI
from local_bridge.security.state import BridgeState, AuthorizationContext, State, StateError
from backend.services.editor_signature_anchor_service import prepare_signature_anchor
from pypdf import PdfReader, PdfWriter
from pypdf.generic import ArrayObject, BooleanObject, DictionaryObject, NameObject, NumberObject


class ApproveUI(PendingApprovalUI):
    def approve_pairing(self, request): return ApprovalDecision.APPROVED
    def approve_signature(self, operation): return ApprovalDecision.APPROVED


class SigningTransitionTests(unittest.TestCase):
    def _signature_fixture_pdf(self, names, rect=None, value=None):
        document = fitz.open()
        page = document.new_page(width=595, height=842)
        for index, name in enumerate(names):
            widget = fitz.Widget()
            widget.field_name = name
            widget.field_type = fitz.PDF_WIDGET_TYPE_SIGNATURE
            widget.rect = fitz.Rect(*(rect or (100 + index * 230, 300, 320 + index * 230, 370)))
            if value is not None:
                widget.field_value = value
            page.add_widget(widget)
        return document.tobytes()

    def _assert_group_a_rejected(self, body):
        fixture = self.authenticated_fixture()
        path = f"/v1/signature-operations/{fixture['operation_id']}/sign"
        response = fixture["client"].post(path, headers=fixture["headers"](body, b"c", path=path), content=body)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()["error_code"], "PREPARED_PDF_CONTRACT_INVALID")
        self.assertEqual(len(fixture["signer"].calls), 0)
        self.assertEqual(fixture["service"].state.operations[fixture["operation_id"]].state.value, "APPROVED")

    def _assert_group_c_rejected(self, body, expected_error="PREPARED_PDF_CONTRACT_INVALID", **header_options):
        fixture = self.authenticated_fixture(); path = f"/v1/signature-operations/{fixture['operation_id']}/sign"
        response = fixture["client"].post(path, headers=fixture["headers"](body, header_options.pop("nonce", b"c"), path=path, **header_options), content=body)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()["error_code"], expected_error)
        self.assertEqual(len(fixture["signer"].calls), 0)
        self.assertEqual(fixture["service"].state.operations[fixture["operation_id"]].state.value, "APPROVED")

    def _invalid_rect_pdf(self):
        reader = PdfReader(io.BytesIO(self._signature_fixture_pdf(["BranaSignature_1"])))
        page = reader.pages[0]
        annotation = page["/Annots"][0].get_object()
        annotation[NameObject("/Rect")] = ArrayObject([NumberObject(100), NumberObject(300), NumberObject(100), NumberObject(300)])
        writer = PdfWriter(); writer.clone_document_from_reader(reader); output = io.BytesIO(); writer.write(output)
        return output.getvalue()

    def _docmdp_pdf(self):
        reader = PdfReader(io.BytesIO(self.authenticated_fixture()["prepared"]))
        root = reader.trailer["/Root"].get_object()
        root[NameObject("/Perms")] = DictionaryObject({NameObject("/DocMDP"): BooleanObject(True)})
        writer = PdfWriter(); writer.clone_document_from_reader(reader); output = io.BytesIO(); writer.write(output)
        return output.getvalue()

    def authenticated_fixture(self):
        signer = FakePreparedPdfSigner(b"synthetic-result"); service = HttpProtocolService(ui=ApproveUI(), signer=signer); client_key = ec.derive_private_key(7, ec.SECP256R1()); public = b64url_encode(client_key.public_key().public_bytes(Encoding.X962, PublicFormat.UncompressedPoint)); base = {"host":"localhost:8765","origin":"https://localhost:5173"}; client = TestClient(service.create_app())
        pairing = client.post("/v1/pairing-requests", headers=base, json={"client_instance_id":b64url_encode(b"c"*16),"client_nonce":b64url_encode(b"n"*16),"client_ecdh_public_key":public}).json(); session = pairing["session_id"]
        source=fitz.open(); source.new_page(width=595,height=842).insert_text((100,300),"<<Cirurgião.AssinaturaDigital>>",fontsize=10); prepared=prepare_signature_anchor(source.tobytes()).pdf_bytes; operation_id=b64url_encode(b"p"*16); params={"operation_id":operation_id,"field_name":"BranaSignature_1","policy_oid":service.REQUIRED_POLICY_OID,"profile":service.REQUIRED_PROFILE}
        def headers(body, nonce=b"a", path="/v1/signature-operations", method="POST", declared_hash=None, profile=None, policy_oid=None, field_name="BranaSignature_1"):
            ts=int(time.time()); rn=b64url_encode(nonce*16); digest=declared_hash or hashlib.sha256(body).hexdigest(); selected_profile=profile or service.REQUIRED_PROFILE; selected_policy=policy_oid or service.REQUIRED_POLICY_OID; selected_params={**params, "field_name": field_name, "profile": selected_profile, "policy_oid": selected_policy}; canonical=canonicalize_hmac_request(method=method,path=path,origin=base["origin"],timestamp=ts,request_nonce=rn,session_id=session,content_sha256=digest,body_length=len(body),parameters=selected_params,operation_id=operation_id); return {**base,"X-Brana-Bridge-Protocol":"brana-bridge-v1","X-Brana-Session":session,"X-Brana-Timestamp":str(ts),"X-Brana-Request-Nonce":rn,"X-Brana-Content-SHA256":digest,"X-Brana-Request-MAC":calculate_hmac(service.session_keys[session],canonical),"X-Brana-Operation-Id":operation_id,"X-Brana-Field-Name":field_name,"X-Brana-Policy-OID":selected_policy,"X-Brana-Profile":selected_profile}
        self.assertEqual(client.post("/v1/signature-operations",headers=headers(prepared),content=prepared).status_code,200)
        return {"client":client,"service":service,"signer":signer,"operation_id":operation_id,"prepared":prepared,"headers":headers,"session":session}

    def test_authenticated_fixture_rejects_invalid_pdf_before_signing(self):
        fixture=self.authenticated_fixture(); path=f"/v1/signature-operations/{fixture['operation_id']}/sign"; invalid=b"not-a-pdf"; headers=fixture["headers"](invalid,b"b",path=path); response=fixture["client"].post(path,headers=headers,content=invalid)
        self.assertEqual(response.status_code,400); self.assertEqual(response.json()["error_code"],"PREPARED_PDF_CONTRACT_INVALID"); self.assertEqual(len(fixture["signer"].calls),0); self.assertEqual(fixture["service"].state.operations[fixture["operation_id"]].state.value,"APPROVED")

    def test_group_a_empty_pdf_rejected(self):
        self._assert_group_a_rejected(b"")

    def test_group_a_signature_field_absent_rejected(self):
        document = fitz.open(); document.new_page(width=595, height=842)
        self._assert_group_a_rejected(document.tobytes())

    def test_group_a_duplicate_signature_fields_rejected(self):
        self._assert_group_a_rejected(self._signature_fixture_pdf(["BranaSignature_1", "BranaSignature_1"]))

    def test_group_a_wrong_signature_field_name_rejected(self):
        self._assert_group_a_rejected(self._signature_fixture_pdf(["OtherSignature"]))

    def test_group_b_widget_absent_rejected(self):
        document = fitz.open(); document.new_page(width=595, height=842)
        self._assert_group_a_rejected(document.tobytes())

    def test_group_b_widget_duplicated_rejected(self):
        self._assert_group_a_rejected(self._signature_fixture_pdf(["BranaSignature_1", "BranaSignature_1"]))

    def test_group_b_invalid_widget_rect_rejected(self):
        self._assert_group_a_rejected(self._invalid_rect_pdf())

    def test_group_b_populated_signature_value_rejected(self):
        self._assert_group_a_rejected(self._signature_fixture_pdf(["BranaSignature_1"], value="synthetic-value"))

    def test_group_b_byte_range_present_rejected(self):
        self._assert_group_a_rejected(self.authenticated_fixture()["prepared"] + b"/ByteRange")

    def test_group_c_docmdp_present_rejected(self):
        self._assert_group_c_rejected(self._docmdp_pdf())

    def test_group_c_previous_signature_present_rejected(self):
        self._assert_group_c_rejected(self.authenticated_fixture()["prepared"] + b"/ByteRange [0 100 200 300]")

    def test_group_c_declared_hash_divergence_rejected(self):
        fixture = self.authenticated_fixture(); self._assert_group_c_rejected(fixture["prepared"], expected_error="CONTENT_HASH_MISMATCH", declared_hash="0" * 64)

    def test_group_c_bytes_changed_after_hash_rejected(self):
        fixture = self.authenticated_fixture(); path = f"/v1/signature-operations/{fixture['operation_id']}/sign"; body = fixture["prepared"]; altered = body + b"changed"
        response = fixture["client"].post(path, headers=fixture["headers"](body, b"e", path=path), content=altered)
        self.assertEqual(response.status_code, 400); self.assertEqual(response.json()["error_code"], "CONTENT_HASH_MISMATCH"); self.assertEqual(len(fixture["signer"].calls), 0); self.assertEqual(fixture["service"].state.operations[fixture["operation_id"]].state.value, "APPROVED")

    def test_group_c_incorrect_profile_rejected(self):
        self._assert_group_c_rejected(self.authenticated_fixture()["prepared"], profile="wrong-profile")

    def test_group_d_incorrect_policy_rejected(self):
        self._assert_group_c_rejected(self.authenticated_fixture()["prepared"], policy_oid="wrong-policy")

    def test_group_d_operation_not_approved_rejected(self):
        fixture = self.authenticated_fixture(); operation = fixture["service"].state.operations[fixture["operation_id"]]; operation.state = State.PENDING
        path = f"/v1/signature-operations/{fixture['operation_id']}/sign"; response = fixture["client"].post(path, headers=fixture["headers"](fixture["prepared"], b"g", path=path), content=fixture["prepared"])
        self.assertEqual(response.status_code, 409); self.assertEqual(response.json()["error_code"], "OPERATION_NOT_APPROVED"); self.assertEqual(len(fixture["signer"].calls), 0)

    def test_group_d_expired_operation_rejected(self):
        fixture = self.authenticated_fixture(); operation = fixture["service"].state.operations[fixture["operation_id"]]; operation.approved_at = time.time() - 31
        path = f"/v1/signature-operations/{fixture['operation_id']}/sign"; response = fixture["client"].post(path, headers=fixture["headers"](fixture["prepared"], b"h", path=path), content=fixture["prepared"])
        self.assertEqual(response.status_code, 400); self.assertEqual(response.json()["error_code"], "APPROVAL_EXPIRED"); self.assertEqual(operation.state.value, "EXPIRED"); self.assertEqual(len(fixture["signer"].calls), 0)

    def test_group_d_revoked_session_rejected(self):
        fixture = self.authenticated_fixture(); fixture["service"].state.revoke_session(fixture["session"], local_authority=True)
        path = f"/v1/signature-operations/{fixture['operation_id']}/sign"; response = fixture["client"].post(path, headers=fixture["headers"](fixture["prepared"], b"i", path=path), content=fixture["prepared"])
        self.assertEqual(response.status_code, 401); self.assertEqual(response.json()["error_code"], "SESSION_REVOKED"); self.assertEqual(len(fixture["signer"].calls), 0)

    def test_group_d_invalid_mac_rejected(self):
        fixture = self.authenticated_fixture(); path = f"/v1/signature-operations/{fixture['operation_id']}/sign"; headers = fixture["headers"](fixture["prepared"], b"j", path=path); headers["X-Brana-Request-MAC"] = "0" * 64
        response = fixture["client"].post(path, headers=headers, content=fixture["prepared"])
        self.assertEqual(response.status_code, 401); self.assertEqual(response.json()["error_code"], "MAC_INVALID"); self.assertEqual(len(fixture["signer"].calls), 0)

    def test_group_e_repeated_nonce_rejected(self):
        fixture = self.authenticated_fixture(); path = f"/v1/signature-operations/{fixture['operation_id']}/sign"; body = b"not-a-pdf"; headers = fixture["headers"](body, b"k", path=path)
        first = fixture["client"].post(path, headers=headers, content=body); second = fixture["client"].post(path, headers=headers, content=body)
        self.assertEqual(first.status_code, 400); self.assertEqual(second.status_code, 401); self.assertEqual(second.json()["error_code"], "REPLAY_DETECTED"); self.assertEqual(len(fixture["signer"].calls), 0)

    def test_group_e_divergent_origin_rejected(self):
        fixture = self.authenticated_fixture(); path = f"/v1/signature-operations/{fixture['operation_id']}/sign"; headers = fixture["headers"](b"not-a-pdf", b"l", path=path); headers["origin"] = "https://evil.invalid"
        response = fixture["client"].post(path, headers=headers, content=b"not-a-pdf")
        self.assertEqual(response.status_code, 403); self.assertEqual(response.json()["error_code"], "ORIGIN_NOT_ALLOWED"); self.assertEqual(len(fixture["signer"].calls), 0)

    def test_group_e_alternate_field_rejected(self):
        fixture = self.authenticated_fixture(); path = f"/v1/signature-operations/{fixture['operation_id']}/sign"; body = b"not-a-pdf"
        response = fixture["client"].post(path, headers=fixture["headers"](body, b"m", path=path, field_name="OtherSignature"), content=body)
        self.assertEqual(response.status_code, 400); self.assertEqual(response.json()["error_code"], "PREPARED_PDF_CONTRACT_INVALID"); self.assertEqual(len(fixture["signer"].calls), 0)

    def test_group_e_new_field_spec_rejected(self):
        fixture = self.authenticated_fixture(); path = f"/v1/signature-operations/{fixture['operation_id']}/sign"; body = b"not-a-pdf"; headers = fixture["headers"](body, b"n", path=path); headers["X-Brana-New-Field-Spec"] = "forbidden"
        response = fixture["client"].post(path, headers=headers, content=body)
        self.assertEqual(response.status_code, 400); self.assertEqual(response.json()["error_code"], "PREPARED_PDF_CONTRACT_INVALID"); self.assertEqual(len(fixture["signer"].calls), 0)

    def test_group_e_legacy_fallback_not_available(self):
        fixture = self.authenticated_fixture()
        certificados = fixture["client"].get("/certificados", headers={"host": "localhost:8765", "origin": "https://localhost:5173"})
        assinar = fixture["client"].post("/assinar-pdf", headers={"host": "localhost:8765", "origin": "https://localhost:5173"}, content=b"not-a-pdf")
        self.assertEqual(certificados.status_code, 404); self.assertEqual(assinar.status_code, 404); self.assertEqual(len(fixture["signer"].calls), 0)

    def _state_operation(self):
        state = BridgeState(authorize=lambda context, action: True)
        session = "A" * 22; origin = "https://localhost:5173"; operation_id = "B" * 22
        now = time.time(); state.sessions[session] = {"origin": origin, "client": "C" * 22, "created": now, "last": now, "revoked": False, "completed": 0}
        operation = state.create_operation(session_id=session, origin=origin, operation_id=operation_id, prepared_pdf_sha256="a" * 64, field_name="BranaSignature_1", policy_oid="2.16.76.1.7.1.11.1.3", profile="pades-ad-rb-1.3", certificate_binding="synthetic")
        state.approve_operation(AuthorizationContext(session, origin, operation_id, True, "approve_operation"))
        return state, session, origin, operation_id

    def test_cancel_during_signing_is_rejected(self):
        state, session, origin, operation_id = self._state_operation(); state.begin_signing(operation_id)
        with self.assertRaisesRegex(StateError, "SIGNING_IN_PROGRESS"):
            state.cancel(AuthorizationContext(session, origin, operation_id, True, "cancel_operation"))
        self.assertEqual(state.operations[operation_id].state.value, "SIGNING")

    def test_cancel_after_completed_is_rejected_and_result_remains(self):
        state, session, origin, operation_id = self._state_operation(); state.begin_signing(operation_id); state.complete(operation_id, b"synthetic-result")
        with self.assertRaisesRegex(StateError, "ALREADY_COMPLETED"):
            state.cancel(AuthorizationContext(session, origin, operation_id, True, "cancel_operation"))
        self.assertEqual(state.operations[operation_id].result, b"synthetic-result")

    def test_cancelled_operation_cannot_start_signing(self):
        state, session, origin, operation_id = self._state_operation(); state.cancel(AuthorizationContext(session, origin, operation_id, True, "cancel_operation"))
        with self.assertRaisesRegex(StateError, "OPERATION_NOT_APPROVED"):
            state.begin_signing(operation_id)
        self.assertEqual(state.operations[operation_id].state.value, "CANCELLED")

    def test_failed_operation_is_terminal_for_cancel(self):
        state, session, origin, operation_id = self._state_operation(); state.begin_signing(operation_id); state.fail(operation_id)
        with self.assertRaisesRegex(StateError, "OPERATION_TERMINAL"):
            state.cancel(AuthorizationContext(session, origin, operation_id, True, "cancel_operation"))
        self.assertEqual(state.operations[operation_id].state.value, "FAILED")
    def test_approved_operation_calls_fake_once_with_exact_contract(self):
        signer = FakePreparedPdfSigner(b"synthetic-result")
        service = HttpProtocolService(ui=ApproveUI(), signer=signer)
        client_key = ec.derive_private_key(7, ec.SECP256R1())
        public = b64url_encode(client_key.public_key().public_bytes(Encoding.X962, PublicFormat.UncompressedPoint))
        headers = {"host": "localhost:8765", "origin": "https://localhost:5173"}
        pairing = TestClient(service.create_app()).post("/v1/pairing-requests", headers=headers, json={"client_instance_id": b64url_encode(b"c" * 16), "client_nonce": b64url_encode(b"n" * 16), "client_ecdh_public_key": public}).json()
        session = pairing["session_id"]
        source = fitz.open(); source.new_page(width=595, height=842).insert_text((100, 300), "<<Cirurgião.AssinaturaDigital>>", fontsize=10)
        body = prepare_signature_anchor(source.tobytes()).pdf_bytes
        operation_id = b64url_encode(b"o" * 16)
        params = {"field_name": "BranaSignature_1", "policy_oid": service.REQUIRED_POLICY_OID, "profile": service.REQUIRED_PROFILE, "operation_id": operation_id}
        def auth(path, nonce):
            timestamp = int(time.time()); request_nonce = b64url_encode(nonce * 16); digest = hashlib.sha256(body).hexdigest()
            canonical = canonicalize_hmac_request(method="POST", path=path, origin=headers["origin"], timestamp=timestamp, request_nonce=request_nonce, session_id=session, content_sha256=digest, body_length=len(body), parameters=params, operation_id=operation_id)
            return {**headers, "X-Brana-Bridge-Protocol": "brana-bridge-v1", "X-Brana-Session": session, "X-Brana-Timestamp": str(timestamp), "X-Brana-Request-Nonce": request_nonce, "X-Brana-Content-SHA256": digest, "X-Brana-Request-MAC": calculate_hmac(service.session_keys[session], canonical), "X-Brana-Operation-Id": operation_id, "X-Brana-Field-Name": params["field_name"], "X-Brana-Policy-OID": params["policy_oid"], "X-Brana-Profile": params["profile"]}
        app_client = TestClient(service.create_app())
        self.assertEqual(app_client.post("/v1/signature-operations", headers=auth("/v1/signature-operations", b"a"), content=body).status_code, 200)
        response = app_client.post(f"/v1/signature-operations/{operation_id}/sign", headers=auth(f"/v1/signature-operations/{operation_id}/sign", b"b"), content=body)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(signer.calls), 1)
        call = signer.calls[0]
        self.assertEqual(call.pdf_bytes, body)
        self.assertEqual(call.prepared_pdf_sha256, hashlib.sha256(body).hexdigest())
        self.assertEqual(call.field_name, "BranaSignature_1")
        self.assertTrue(call.use_existing_field)
        self.assertEqual(call.profile, service.REQUIRED_PROFILE)
        self.assertEqual(call.policy_oid, service.REQUIRED_POLICY_OID)
        second = app_client.post(f"/v1/signature-operations/{operation_id}/sign", headers=auth(f"/v1/signature-operations/{operation_id}/sign", b"d"), content=body)
        self.assertEqual(second.status_code, 409)
        self.assertEqual(len(signer.calls), 1)

    def test_asgi_concurrent_same_operation_has_one_signer_call(self):
        class BlockingSigner(FakePreparedPdfSigner):
            def __init__(self):
                super().__init__(b"synthetic-result")
                self.entered = threading.Event()
                self.release = threading.Event()
            def sign_prepared(self, request):
                self.calls.append(request)
                self.entered.set()
                self.release.wait(2)
                return self.result

        signer = BlockingSigner(); service = HttpProtocolService(ui=ApproveUI(), signer=signer)
        key = ec.derive_private_key(7, ec.SECP256R1()); public = b64url_encode(key.public_key().public_bytes(Encoding.X962, PublicFormat.UncompressedPoint))
        base = {"host": "localhost:8765", "origin": "https://localhost:5173"}
        client = TestClient(service.create_app())
        pairing = client.post("/v1/pairing-requests", headers=base, json={"client_instance_id": b64url_encode(b"c" * 16), "client_nonce": b64url_encode(b"n" * 16), "client_ecdh_public_key": public}).json()
        session = pairing["session_id"]; source = fitz.open(); source.new_page(width=595, height=842).insert_text((100, 300), "<<Cirurgião.AssinaturaDigital>>", fontsize=10); body = prepare_signature_anchor(source.tobytes()).pdf_bytes; operation_id = b64url_encode(b"z" * 16)
        params = {"field_name": "BranaSignature_1", "policy_oid": service.REQUIRED_POLICY_OID, "profile": service.REQUIRED_PROFILE, "operation_id": operation_id}
        def headers(path, nonce):
            ts = int(time.time()); rn = b64url_encode(nonce * 16); digest = hashlib.sha256(body).hexdigest(); canonical = canonicalize_hmac_request(method="POST", path=path, origin=base["origin"], timestamp=ts, request_nonce=rn, session_id=session, content_sha256=digest, body_length=len(body), parameters=params, operation_id=operation_id)
            return {**base, "X-Brana-Bridge-Protocol":"brana-bridge-v1", "X-Brana-Session":session, "X-Brana-Timestamp":str(ts), "X-Brana-Request-Nonce":rn, "X-Brana-Content-SHA256":digest, "X-Brana-Request-MAC":calculate_hmac(service.session_keys[session], canonical), "X-Brana-Operation-Id":operation_id, "X-Brana-Field-Name":params["field_name"], "X-Brana-Policy-OID":params["policy_oid"], "X-Brana-Profile":params["profile"]}
        self.assertEqual(client.post("/v1/signature-operations", headers=headers("/v1/signature-operations", b"e"), content=body).status_code, 200)
        path = f"/v1/signature-operations/{operation_id}/sign"
        def call(nonce): return TestClient(service.create_app()).post(path, headers=headers(path, nonce), content=body)
        with ThreadPoolExecutor(max_workers=2) as pool:
            first = pool.submit(call, b"f")
            self.assertTrue(signer.entered.wait(1))
            second = pool.submit(call, b"g")
            second_response = second.result(timeout=2)
            signer.release.set()
            first_response = first.result(timeout=2)
        self.assertEqual(first_response.status_code, 200)
        self.assertEqual(second_response.status_code, 409)
        self.assertEqual(second_response.json()["error_code"], "BRIDGE_BUSY")
        self.assertEqual(len(signer.calls), 1)

    def test_asgi_different_operations_compete_for_global_signer(self):
        class BlockingSigner(FakePreparedPdfSigner):
            def __init__(self):
                super().__init__(b"synthetic-result")
                self.entered = threading.Event(); self.release = threading.Event()
            def sign_prepared(self, request):
                self.calls.append(request); self.entered.set(); self.release.wait(2); return self.result

        signer = BlockingSigner(); service = HttpProtocolService(ui=ApproveUI(), signer=signer)
        key = ec.derive_private_key(7, ec.SECP256R1()); public = b64url_encode(key.public_key().public_bytes(Encoding.X962, PublicFormat.UncompressedPoint))
        base = {"host": "localhost:8765", "origin": "https://localhost:5173"}; client = TestClient(service.create_app())
        pairing = client.post("/v1/pairing-requests", headers=base, json={"client_instance_id": b64url_encode(b"c" * 16), "client_nonce": b64url_encode(b"n" * 16), "client_ecdh_public_key": public}).json(); session = pairing["session_id"]
        source = fitz.open(); source.new_page(width=595, height=842).insert_text((100, 300), "<<Cirurgião.AssinaturaDigital>>", fontsize=10); body = prepare_signature_anchor(source.tobytes()).pdf_bytes
        def headers(path, operation_id, nonce):
            params = {"field_name":"BranaSignature_1", "policy_oid":service.REQUIRED_POLICY_OID, "profile":service.REQUIRED_PROFILE, "operation_id":operation_id}; ts=int(time.time()); rn=b64url_encode(nonce*16); digest=hashlib.sha256(body).hexdigest(); canonical=canonicalize_hmac_request(method="POST", path=path, origin=base["origin"], timestamp=ts, request_nonce=rn, session_id=session, content_sha256=digest, body_length=len(body), parameters=params, operation_id=operation_id)
            return {**base,"X-Brana-Bridge-Protocol":"brana-bridge-v1","X-Brana-Session":session,"X-Brana-Timestamp":str(ts),"X-Brana-Request-Nonce":rn,"X-Brana-Content-SHA256":digest,"X-Brana-Request-MAC":calculate_hmac(service.session_keys[session],canonical),"X-Brana-Operation-Id":operation_id,"X-Brana-Field-Name":"BranaSignature_1","X-Brana-Policy-OID":service.REQUIRED_POLICY_OID,"X-Brana-Profile":service.REQUIRED_PROFILE}
        op_a=b64url_encode(b"a"*16); op_b=b64url_encode(b"b"*16)
        for op, nonce in ((op_a,b"h"),(op_b,b"i")):
            self.assertEqual(client.post("/v1/signature-operations",headers=headers("/v1/signature-operations",op,nonce),content=body).status_code,200)
        def call(op, nonce):
            path=f"/v1/signature-operations/{op}/sign"; return TestClient(service.create_app()).post(path,headers=headers(path,op,nonce),content=body)
        with ThreadPoolExecutor(max_workers=2) as pool:
            first=pool.submit(call,op_a,b"j"); self.assertTrue(signer.entered.wait(1)); second=pool.submit(call,op_b,b"k"); response_b=second.result(timeout=2); signer.release.set(); response_a=first.result(timeout=2)
        self.assertEqual(response_b.status_code,409); self.assertEqual(response_b.json()["error_code"],"BRIDGE_BUSY"); self.assertEqual(response_a.status_code,200); self.assertEqual(len(signer.calls),1); self.assertEqual(service.state.operations[op_b].state.value,"APPROVED")


    def test_asgi_cancel_after_signing_and_cancel_before_signing(self):
        class BlockingSigner(FakePreparedPdfSigner):
            def __init__(self):
                super().__init__(b"synthetic-result"); self.entered = threading.Event(); self.release = threading.Event()
            def sign_prepared(self, request):
                self.calls.append(request); self.entered.set(); self.release.wait(2); return self.result

        signer = BlockingSigner(); service = HttpProtocolService(ui=ApproveUI(), signer=signer)
        key = ec.derive_private_key(7, ec.SECP256R1()); public = b64url_encode(key.public_key().public_bytes(Encoding.X962, PublicFormat.UncompressedPoint)); base = {"host":"localhost:8765","origin":"https://localhost:5173"}; client = TestClient(service.create_app())
        pairing = client.post("/v1/pairing-requests", headers=base, json={"client_instance_id":b64url_encode(b"c"*16),"client_nonce":b64url_encode(b"n"*16),"client_ecdh_public_key":public}).json(); session=pairing["session_id"]
        source=fitz.open(); source.new_page(width=595,height=842).insert_text((100,300),"<<Cirurgião.AssinaturaDigital>>",fontsize=10); body=prepare_signature_anchor(source.tobytes()).pdf_bytes; op=b64url_encode(b"q"*16)
        def auth(path, method, nonce, content, operation=op, sess=session, svc=service):
            params={"operation_id":operation}; extra={}
            if method=="POST": params.update({"field_name":"BranaSignature_1","policy_oid":svc.REQUIRED_POLICY_OID,"profile":svc.REQUIRED_PROFILE}); extra={"X-Brana-Field-Name":"BranaSignature_1","X-Brana-Policy-OID":svc.REQUIRED_POLICY_OID,"X-Brana-Profile":svc.REQUIRED_PROFILE}
            ts=int(time.time()); rn=b64url_encode(nonce*16); digest=hashlib.sha256(content).hexdigest(); canonical=canonicalize_hmac_request(method=method,path=path,origin=base["origin"],timestamp=ts,request_nonce=rn,session_id=sess,content_sha256=digest,body_length=len(content),parameters=params,operation_id=operation)
            return {**base,"X-Brana-Bridge-Protocol":"brana-bridge-v1","X-Brana-Session":sess,"X-Brana-Timestamp":str(ts),"X-Brana-Request-Nonce":rn,"X-Brana-Content-SHA256":digest,"X-Brana-Request-MAC":calculate_hmac(svc.session_keys[sess],canonical),"X-Brana-Operation-Id":operation,**extra}
        self.assertEqual(client.post("/v1/signature-operations",headers=auth("/v1/signature-operations","POST",b"a",body),content=body).status_code,200); sign_path=f"/v1/signature-operations/{op}/sign"; delete_path=f"/v1/signature-operations/{op}"
        with ThreadPoolExecutor(max_workers=2) as pool:
            first=pool.submit(lambda: TestClient(service.create_app()).post(sign_path,headers=auth(sign_path,"POST",b"b",body),content=body)); self.assertTrue(signer.entered.wait(1)); cancel=pool.submit(lambda: TestClient(service.create_app()).delete(delete_path,headers=auth(delete_path,"DELETE",b"c",b""))); cancel_response=cancel.result(timeout=2); signer.release.set(); sign_response=first.result(timeout=2)
        self.assertEqual(cancel_response.status_code,409); self.assertEqual(cancel_response.json()["error_code"],"SIGNING_IN_PROGRESS"); self.assertEqual(sign_response.status_code,200); self.assertEqual(len(signer.calls),1); self.assertEqual(service.state.operations[op].state.value,"COMPLETED")

        signer2=FakePreparedPdfSigner(b"synthetic-result"); service2=HttpProtocolService(ui=ApproveUI(), signer=signer2); client2=TestClient(service2.create_app()); pair2=client2.post("/v1/pairing-requests",headers=base,json={"client_instance_id":b64url_encode(b"d"*16),"client_nonce":b64url_encode(b"e"*16),"client_ecdh_public_key":public}).json(); sess2=pair2["session_id"]; op2=b64url_encode(b"r"*16)
        create2=auth("/v1/signature-operations","POST",b"d",body,op2,sess2,service2); self.assertEqual(client2.post("/v1/signature-operations",headers=create2,content=body).status_code,200); del2=f"/v1/signature-operations/{op2}"; self.assertEqual(client2.delete(del2,headers=auth(del2,"DELETE",b"e",b"",op2,sess2,service2)).status_code,200); sign2=f"/v1/signature-operations/{op2}/sign"; rejected=client2.post(sign2,headers=auth(sign2,"POST",b"f",body,op2,sess2,service2),content=body); self.assertEqual(rejected.status_code,409); self.assertEqual(len(signer2.calls),0); self.assertEqual(service2.state.operations[op2].state.value,"CANCELLED")

if __name__ == "__main__":
    unittest.main()
