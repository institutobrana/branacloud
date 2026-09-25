"""In-memory FastAPI factory for brana-bridge-v1; never registered by legacy app."""

from __future__ import annotations

import hashlib
import secrets
import io
from dataclasses import dataclass

from fastapi import FastAPI, Request
from starlette.datastructures import Headers
from fastapi.responses import JSONResponse, Response
from cryptography.hazmat.primitives.serialization import Encoding, PublicFormat

from .http_auth import authenticate_request, HttpAuthError
from .origin import cors_headers, validate_host, validate_origin
from .protocol import b64url_encode, derive_session_key, approval_code, validate_public_key, validate_nonce, validate_client_instance_id
from .state import AuthorizationContext, BridgeState, State, StateError
from .ui import ApprovalDecision, ApprovalUI, PairingApproval, PendingApprovalUI, SignatureApproval
from .prepared_signer import PreparedPdfSigner, PreparedPdfSigningRequest
from .windows_prepared_signer import SignerDiagnosticError
from pypdf import PdfReader
from pypdf.generic import DictionaryObject, ArrayObject


def _validate_prepared_pdf(pdf_bytes: bytes, field_name: str) -> None:
    if b"/ByteRange" in pdf_bytes:
        raise ValueError("SIGNATURE_ALREADY_PRESENT")
    try:
        reader = PdfReader(io.BytesIO(pdf_bytes), strict=True)
        root = reader.trailer["/Root"].get_object()
        perms = root.get("/Perms")
        if perms is not None and "/DocMDP" in perms.get_object():
            raise ValueError("DOCMDP_PRESENT")
        fields = reader.get_fields() or {}
        sig_fields = [(name, value) for name, value in fields.items() if value.get("/FT") == "/Sig"]
        if len(sig_fields) != 1 or sig_fields[0][0] != field_name:
            raise ValueError("SIGNATURE_FIELD_INVALID")
        field = sig_fields[0][1]
        if field.get("/V") not in (None, ""):
            raise ValueError("SIGNATURE_FIELD_NOT_EMPTY")
        widgets = []
        for page in reader.pages:
            annotations = page.get("/Annots")
            if annotations is None:
                continue
            for ref in annotations.get_object():
                annotation = ref.get_object()
                if annotation.get("/Subtype") == "/Widget":
                    parent = annotation.get("/Parent")
                    name = annotation.get("/T") or (parent.get_object().get("/T") if parent else None)
                    if str(name) == field_name:
                        rect = annotation.get("/Rect")
                        if not isinstance(rect, ArrayObject) or len(rect) != 4 or float(rect[2]) <= float(rect[0]) or float(rect[3]) <= float(rect[1]):
                            raise ValueError("SIGNATURE_WIDGET_INVALID")
                        widgets.append(annotation)
        if len(widgets) != 1:
            raise ValueError("SIGNATURE_WIDGET_INVALID")
    except ValueError:
        raise
    except Exception as exc:
        raise ValueError("PDF_STRUCTURE_INVALID") from exc


@dataclass
class PairingMaterial:
    client_public_key: str
    client_nonce: str
    bridge_private_key: object
    bridge_public_key: str
    bridge_nonce: str


class HttpProtocolService:
    MAX_PDF_BYTES = 25 * 1024 * 1024
    REQUIRED_FIELD_NAME = "BranaSignature_1"
    REQUIRED_POLICY_OID = "2.16.76.1.7.1.11.1.3"
    REQUIRED_PROFILE = "pades-ad-rb-1.3"
    def __init__(self, *, state: BridgeState | None = None, ui: ApprovalUI | None = None, signer: PreparedPdfSigner | None = None, signing_enabled: bool = True):
        self.state = state or BridgeState(authorize=lambda context, action: True)
        self.ui = ui or PendingApprovalUI()
        self.session_keys: dict[str, bytes] = {}
        self.pairing_material: dict[str, PairingMaterial] = {}
        self.revoked_sessions: set[str] = set()
        self._prepared_signer = signer
        self._signing_enabled = signing_enabled

    def _error(self, code: str, status: int, request_id: str | None = None, detail: dict | None = None):
        payload = {"error_code": code}
        if request_id:
            payload["request_id"] = request_id
        if detail:
            payload.update(detail)
        return JSONResponse(payload, status_code=status)

    def _signer_failure(self, exc: Exception, operation_id: str, pdf_sha256: str):
        detail = {}
        if isinstance(exc, SignerDiagnosticError):
            raw = exc.diagnostic.as_dict()
            detail = {
                "phase": raw["phase"],
                "detail_code": raw["error_code"],
                "pin_required": raw["pin_required"],
                "retryable": raw["retryable"],
                "operation_id": raw["operation_id"],
                "prepared_pdf_sha256": pdf_sha256,
            }
            if raw.get("windows_error_code") is not None:
                detail["windows_error_code"] = f"0x{(int(raw['windows_error_code']) & 0xFFFFFFFF):08X}"
            if raw.get("hresult") is not None:
                detail["hresult"] = raw["hresult"]
            if raw.get("native_marker") is not None:
                detail["native_diagnostic_marker"] = raw["native_marker"]
            if raw.get("powershell_exit_code") is not None:
                detail["powershell_exit_code"] = raw["powershell_exit_code"]
            if raw.get("key_spec") is not None:
                detail["key_spec"] = raw["key_spec"]
        return self._error("SIGNER_FAILED", 502, operation_id, detail)

    def _guard(self, request: Request) -> str:
        validate_host(request.headers.get("host"))
        return validate_origin(request.headers.get("origin"))

    def _pairing_key(self, request_id: str, origin: str) -> bytes:
        pairing = self.state.pairings.get(request_id)
        material = self.pairing_material.get(request_id)
        if pairing is None or material is None or pairing.origin != origin:
            raise HttpAuthError("REQUEST_NOT_FOUND")
        return derive_session_key(
            material.bridge_private_key, material.client_public_key, origin,
            request_id, material.client_nonce, material.bridge_nonce, request_id,
        )

    def _authenticate_pairing(self, request: Request, request_id: str, origin: str):
        material_key = self._pairing_key(request_id, origin)
        # Keep HTTP header lookup case-insensitive.  Do not merge a client
        # supplied session: pairing authentication is bound to this path ID.
        critical = {b"x-brana-bridge-protocol", b"x-brana-request-nonce",
                    b"x-brana-request-mac", b"x-brana-content-sha256",
                    b"x-brana-timestamp"}
        seen = [name.lower() for name, _ in request.headers.raw]
        if any(seen.count(name) > 1 for name in critical):
            raise HttpAuthError("AUTH_HEADERS_INVALID")
        raw = [(name, value) for name, value in request.headers.raw
               if name.lower() != b"x-brana-session"]
        raw.append((b"x-brana-session", request_id.encode("ascii")))
        return authenticate_request(
            headers=Headers(raw=raw),
            method=request.method, path=request.url.path, origin=origin,
            body=b"", parameters={"operation_id": request_id},
            session_keys={request_id: material_key}, nonces=self.state.nonces,
        )

    def _authenticate_operation(self, request: Request, operation_id: str, origin: str):
        body = b""
        return authenticate_request(
            headers=request.headers, method=request.method, path=request.url.path,
            origin=origin, body=body, parameters={"operation_id": operation_id},
            session_keys=self.session_keys, nonces=self.state.nonces,
        )

    def create_app(self) -> FastAPI:
        app = FastAPI(docs_url=None, redoc_url=None, openapi_url=None)

        @app.middleware("http")
        async def host_origin_guard(request: Request, call_next):
            if request.url.path == "/health" or request.method == "OPTIONS":
                if request.method == "OPTIONS":
                    try:
                        headers = cors_headers(request.headers.get("origin"))
                    except ValueError:
                        return self._error("ORIGIN_NOT_ALLOWED", 403)
                    return JSONResponse({}, status_code=204, headers=headers)
                return await call_next(request)
            try:
                origin = self._guard(request)
                response = await call_next(request)
                response.headers.update(cors_headers(origin))
                return response
            except ValueError as exc:
                return self._error(str(exc), 403)

        @app.get("/health")
        async def health():
            return {"status": "ok", "protocol": "brana-bridge-v1"}

        @app.post("/v1/pairing-requests")
        async def create_pairing(request: Request):
            origin = self._guard(request)
            data = await request.json()
            try:
                request_id = None
                client_instance_id = data["client_instance_id"]
                client_nonce = data["client_nonce"]
                validate_client_instance_id(client_instance_id)
                validate_nonce(client_nonce)
                validate_public_key(data["client_ecdh_public_key"])
                pairing = self.state.create_pairing(origin, client_instance_id)
                request_id = pairing.request_id
                from cryptography.hazmat.primitives.asymmetric import ec
                bridge_key = ec.generate_private_key(ec.SECP256R1())
                public = bridge_key.public_key().public_bytes(Encoding.X962, PublicFormat.UncompressedPoint)
                bridge_public = b64url_encode(public)
                bridge_nonce = b64url_encode(secrets.token_bytes(16))
                self.pairing_material[request_id] = PairingMaterial(data["client_ecdh_public_key"], client_nonce, bridge_key, bridge_public, bridge_nonce)
                code = approval_code(origin, request_id, client_instance_id, client_nonce, bridge_nonce)
                decision = self.ui.approve_pairing(PairingApproval(request_id, origin, code, pairing.expires_at))
                response_payload = {
                    "request_id": request_id,
                    "state": decision,
                    "bridge_nonce": bridge_nonce,
                    "bridge_ephemeral_public_key": bridge_public,
                    "client_instance_id": client_instance_id,
                    "expires_at": pairing.expires_at,
                    "approval_code": code,
                    "protocol": "brana-bridge-v1",
                }
                if decision is ApprovalDecision.APPROVED:
                    session_id = self.state.approve_pairing(request_id)
                    material = self.pairing_material[request_id]
                    self.session_keys[session_id] = derive_session_key(material.bridge_private_key, material.client_public_key, origin, request_id, client_nonce, bridge_nonce, session_id)
                    response_payload.update({"state": State.APPROVED, "session_id": session_id, "bridge_ecdh_public_key": bridge_public})
                    return response_payload
                if decision is ApprovalDecision.DENIED:
                    self.state.deny_pairing(request_id)
                return response_payload
            except (KeyError, ValueError, StateError) as exc:
                return self._error(getattr(exc, "code", "INVALID_PAIRING"), 400)

        @app.get("/v1/pairing-requests/{request_id}")
        async def get_pairing(request: Request, request_id: str):
            try:
                origin = self._guard(request)
                self._authenticate_pairing(request, request_id, origin)
                pairing = self.state.pairings.get(request_id)
                if pairing is None:
                    return self._error("REQUEST_NOT_FOUND", 404, request_id)
                self.state.expire()
                material = self.pairing_material[request_id]
                payload = {"request_id": request_id, "state": pairing.state.value, "bridge_nonce": material.bridge_nonce, "bridge_ephemeral_public_key": material.bridge_public_key, "client_instance_id": pairing.client_instance_id, "expires_at": pairing.expires_at, "protocol": "brana-bridge-v1"}
                if pairing.state is State.APPROVED:
                    payload.update({"session_id": pairing.session_id, "expires_at": self.state.sessions[pairing.session_id]["created"] + self.state.SESSION_TTL, "idle_expires_in": self.state.IDLE_TTL, "bridge_ecdh_public_key": self.pairing_material[request_id].bridge_public_key})
                return payload
            except (ValueError, HttpAuthError, StateError) as exc:
                code = getattr(exc, "code", str(exc))
                return self._error(code, 401 if code in {"MAC_INVALID", "AUTH_HEADERS_REQUIRED", "AUTH_HEADERS_INVALID", "SESSION_REVOKED", "REPLAY_DETECTED", "TIMESTAMP_INVALID"} else 403)

        @app.delete("/v1/pairing-requests/{request_id}")
        async def delete_pairing(request: Request, request_id: str):
            try:
                origin = self._guard(request)
                self._authenticate_pairing(request, request_id, origin)
                pairing = self.state.pairings.get(request_id)
                if pairing is None:
                    return self._error("REQUEST_NOT_FOUND", 404, request_id)
                if pairing.state is State.PENDING:
                    pairing.state = State.CANCELLED
                return {"request_id": request_id, "state": pairing.state.value}
            except (ValueError, HttpAuthError, StateError) as exc:
                code = getattr(exc, "code", str(exc))
                return self._error(code, 401 if code in {"MAC_INVALID", "AUTH_HEADERS_REQUIRED", "AUTH_HEADERS_INVALID", "REPLAY_DETECTED", "TIMESTAMP_INVALID"} else 403)

        @app.delete("/v1/sessions/{session_id}")
        async def delete_session(request: Request, session_id: str):
            try:
                origin = self._guard(request)
                auth = self._authenticate_operation(request, session_id, origin)
                if auth.session_id != session_id:
                    return self._error("FORBIDDEN", 403)
                if session_id in self.revoked_sessions:
                    return {"session_id": session_id, "state": State.REVOKED.value}
                self.state.revoke_session(session_id, local_authority=True)
                self.revoked_sessions.add(session_id)
                return {"session_id": session_id, "state": State.REVOKED.value}
            except (ValueError, HttpAuthError, StateError) as exc:
                code = getattr(exc, "code", str(exc))
                return self._error(code, 401 if code in {"MAC_INVALID", "AUTH_HEADERS_REQUIRED", "AUTH_HEADERS_INVALID", "SESSION_REVOKED", "REPLAY_DETECTED", "TIMESTAMP_INVALID"} else 403)

        @app.post("/v1/signature-operations")
        async def create_operation(request: Request):
            origin = self._guard(request)
            body = await request.body()
            if not body:
                return self._error("INVALID_REQUEST", 400)
            if len(body) > self.MAX_PDF_BYTES:
                return self._error("PAYLOAD_TOO_LARGE", 413)
            parameters = {"operation_id": request.headers.get("X-Brana-Operation-Id", ""), "field_name": request.headers.get("X-Brana-Field-Name", "BranaSignature_1"), "policy_oid": request.headers.get("X-Brana-Policy-OID", ""), "profile": request.headers.get("X-Brana-Profile", "")}
            try:
                auth = authenticate_request(headers=request.headers, method="POST", path=request.url.path, origin=origin, body=body, parameters=parameters, session_keys=self.session_keys, nonces=self.state.nonces)
                if parameters["field_name"] != self.REQUIRED_FIELD_NAME: raise HttpAuthError("FIELD_NOT_ALLOWED")
                if parameters["profile"] != self.REQUIRED_PROFILE: raise HttpAuthError("PROFILE_NOT_ALLOWED")
                if parameters["policy_oid"] != self.REQUIRED_POLICY_OID: raise HttpAuthError("POLICY_NOT_ALLOWED")
                operation = self.state.create_operation(session_id=auth.session_id, origin=origin, operation_id=parameters["operation_id"], prepared_pdf_sha256=auth.content_sha256, field_name=parameters["field_name"], policy_oid=parameters["policy_oid"], profile=parameters["profile"], certificate_binding="abstract")
                decision = self.ui.approve_signature(SignatureApproval(operation.operation_id, auth.content_sha256, operation.field_name, operation.profile, operation.origin, operation.policy_oid, operation.approval_expires_at))
                if decision is ApprovalDecision.APPROVED:
                    self.state.approve_operation(AuthorizationContext(auth.session_id, origin, operation.operation_id, True, "approve_operation"))
                elif decision is ApprovalDecision.DENIED:
                    self.state.deny_operation(AuthorizationContext(auth.session_id, origin, operation.operation_id, True, "deny_operation"))
                elif decision is ApprovalDecision.EXPIRED:
                    self.state.expire()
                return {"operation_id": operation.operation_id, "state": operation.state}
            except (HttpAuthError, StateError, ValueError) as exc:
                return self._error(getattr(exc, "code", str(exc)), 400)

        @app.post("/v1/signature-operations/{operation_id}/sign")
        async def sign_operation(request: Request, operation_id: str):
            body = await request.body()
            try:
                origin = self._guard(request)
                if not self._signing_enabled:
                    return self._error("REAL_SIGNING_BLOCKED", 503, operation_id)
                if self._prepared_signer is None:
                    return self._error("SIGNER_NOT_CONFIGURED", 503, operation_id)
                parameters = {"operation_id": operation_id, "field_name": request.headers.get("X-Brana-Field-Name", ""), "policy_oid": request.headers.get("X-Brana-Policy-OID", ""), "profile": request.headers.get("X-Brana-Profile", "")}
                auth = authenticate_request(headers=request.headers, method="POST", path=request.url.path, origin=origin, body=body, parameters=parameters, session_keys=self.session_keys, nonces=self.state.nonces)
                operation = self.state.get_operation(operation_id, auth.session_id, origin)
                if operation.state is not State.APPROVED:
                    return self._error("BRIDGE_BUSY" if operation.state is State.SIGNING else "OPERATION_NOT_APPROVED", 409, operation_id)
                if auth.content_sha256 != operation.prepared_pdf_sha256 or parameters["field_name"] != self.REQUIRED_FIELD_NAME or parameters["profile"] != self.REQUIRED_PROFILE or parameters["policy_oid"] != self.REQUIRED_POLICY_OID:
                    return self._error("PREPARED_PDF_CONTRACT_INVALID", 400, operation_id)
                _validate_prepared_pdf(body, self.REQUIRED_FIELD_NAME)
                self.state.begin_signing(operation_id)
                signing_request = PreparedPdfSigningRequest(body, auth.content_sha256, self.REQUIRED_FIELD_NAME, True, self.REQUIRED_PROFILE, self.REQUIRED_POLICY_OID, operation_id, operation.certificate_binding)
                try:
                    async_sign = getattr(self._prepared_signer, "async_sign_prepared", None)
                    if async_sign is not None:
                        result = await async_sign(signing_request)
                    else:
                        result = self._prepared_signer.sign_prepared(signing_request)
                    self.state.complete(operation_id, result)
                except Exception as exc:
                    self.state.fail(operation_id)
                    return self._signer_failure(exc, operation_id, auth.content_sha256)
                return {"operation_id": operation_id, "state": State.COMPLETED.value}
            except (ValueError, HttpAuthError, StateError) as exc:
                code = getattr(exc, "code", str(exc))
                status = 404 if code == "OPERATION_NOT_FOUND" else 401 if code in {"MAC_INVALID", "AUTH_HEADERS_REQUIRED", "AUTH_HEADERS_INVALID", "SESSION_REVOKED", "REPLAY_DETECTED", "TIMESTAMP_INVALID"} else 409 if code in {"BRIDGE_BUSY", "OPERATION_NOT_APPROVED"} else 400
                return self._error(code, status, operation_id)

        @app.get("/v1/signature-operations/{operation_id}")
        async def get_operation(request: Request, operation_id: str):
            try:
                origin = self._guard(request)
                auth = self._authenticate_operation(request, operation_id, origin)
                operation = self.state.get_operation(operation_id, auth.session_id, origin)
                return {"operation_id": operation_id, "state": operation.state.value, "field_name": operation.field_name, "profile": operation.profile}
            except (ValueError, HttpAuthError, StateError) as exc:
                code = getattr(exc, "code", str(exc))
                status = 404 if code == "OPERATION_NOT_FOUND" else 401 if code in {"MAC_INVALID", "AUTH_HEADERS_REQUIRED", "AUTH_HEADERS_INVALID", "SESSION_REVOKED", "REPLAY_DETECTED", "TIMESTAMP_INVALID"} else 409 if code in {"SIGNING_IN_PROGRESS", "ALREADY_COMPLETED", "OPERATION_TERMINAL"} else 403
                return self._error(code, status, operation_id if status == 404 else None)

        @app.get("/v1/signature-operations/{operation_id}/result")
        async def get_result(request: Request, operation_id: str):
            try:
                origin = self._guard(request)
                auth = self._authenticate_operation(request, operation_id, origin)
                operation = self.state.get_operation(operation_id, auth.session_id, origin)
                if operation.state is not State.COMPLETED or operation.result is None:
                    if operation.state is State.COMPLETED and operation.result is None:
                        return self._error("RESULT_EXPIRED", 410, operation_id)
                    return self._error("RESULT_NOT_READY", 409, operation_id)
                return Response(operation.result, media_type="application/pdf", headers={"Cache-Control": "no-store"})
            except (ValueError, HttpAuthError, StateError) as exc:
                code = getattr(exc, "code", str(exc))
                status = 404 if code == "OPERATION_NOT_FOUND" else 401 if code in {"MAC_INVALID", "AUTH_HEADERS_REQUIRED", "AUTH_HEADERS_INVALID", "SESSION_REVOKED", "REPLAY_DETECTED", "TIMESTAMP_INVALID"} else 409 if code in {"SIGNING_IN_PROGRESS", "ALREADY_COMPLETED", "OPERATION_TERMINAL"} else 403
                return self._error(code, status, operation_id if status == 404 else None)

        @app.delete("/v1/signature-operations/{operation_id}")
        async def delete_operation(request: Request, operation_id: str):
            try:
                origin = self._guard(request)
                auth = self._authenticate_operation(request, operation_id, origin)
                context = AuthorizationContext(auth.session_id, origin, operation_id, True, "cancel_operation")
                self.state.cancel(context)
                return {"operation_id": operation_id, "state": self.state.operations[operation_id].state.value}
            except (ValueError, HttpAuthError, StateError) as exc:
                code = getattr(exc, "code", str(exc))
                status = 404 if code == "OPERATION_NOT_FOUND" else 401 if code in {"MAC_INVALID", "AUTH_HEADERS_REQUIRED", "AUTH_HEADERS_INVALID", "SESSION_REVOKED", "REPLAY_DETECTED", "TIMESTAMP_INVALID"} else 409 if code in {"SIGNING_IN_PROGRESS", "ALREADY_COMPLETED", "OPERATION_TERMINAL"} else 403
                return self._error(code, status, operation_id if status == 404 else None)

        return app


def create_in_memory_app(*, state: BridgeState | None = None, ui: ApprovalUI | None = None, signer: PreparedPdfSigner | None = None) -> FastAPI:
    return HttpProtocolService(state=state, ui=ui, signer=signer).create_app()
