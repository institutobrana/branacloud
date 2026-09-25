"""Typed boundary between B5 state and a future native approval UI."""
from __future__ import annotations

from dataclasses import dataclass
from typing import Protocol

from .ui import ApprovalDecision
import json
import struct


class NamedPipeApprovalPresenter:
    """Test/runtime presenter for the isolated Windows approval pipe."""
    def __init__(self, pipe_name: str, timeout: float = 5.0):
        self.pipe_name = pipe_name
        self.timeout = timeout
        self.last_response = None

    def _send(self, message: dict) -> ApprovalDecision:
        import time
        path = "\\\\.\\pipe\\" + self.pipe_name
        deadline = time.monotonic() + self.timeout
        handle = None
        while time.monotonic() < deadline:
            try:
                handle = open(path, "r+b", buffering=0)
                break
            except OSError:
                time.sleep(0.01)
        if handle is None:
            return ApprovalDecision.UNAVAILABLE
        body = json.dumps(message, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
        try:
            handle.write(struct.pack(">I", len(body)) + body)
            header = handle.read(4)
            if len(header) != 4:
                return ApprovalDecision.UNAVAILABLE
            length = struct.unpack(">I", header)[0]
            if length + 4 > 16 * 1024:
                return ApprovalDecision.UNAVAILABLE
            payload = handle.read(length)
            if len(payload) != length:
                return ApprovalDecision.UNAVAILABLE
            response = json.loads(payload.decode("utf-8"))
            self.last_response = response
            print(f"WPF_PIPE_RESPONSE={message.get('request_id') or message.get('operation_id')!s:.8}:{message.get('nonce')!s:.8}:decision={response.get('decision')}:source={response.get('approval_source', 'none')}", flush=True)
        except (OSError, ValueError, UnicodeError, json.JSONDecodeError):
            return ApprovalDecision.UNAVAILABLE
        finally:
            handle.close()
        if response.get("request_id") not in (None, message.get("request_id")):
            return ApprovalDecision.UNAVAILABLE
        if response.get("operation_id") not in (None, message.get("operation_id")):
            return ApprovalDecision.UNAVAILABLE
        if response.get("nonce") != message.get("nonce"):
            print("WPF_PIPE_VALIDATION=NONCE_MISMATCH", flush=True)
            return ApprovalDecision.UNAVAILABLE
        try:
            if float(message.get("expires_at", 0)) <= time.time():
                print("WPF_PIPE_VALIDATION=REQUEST_EXPIRED", flush=True)
                return ApprovalDecision.EXPIRED
            if response.get("expires_at") is not None and float(response["expires_at"]) <= time.time():
                print("WPF_PIPE_VALIDATION=RESPONSE_EXPIRED", flush=True)
                return ApprovalDecision.EXPIRED
        except (TypeError, ValueError):
            return ApprovalDecision.UNAVAILABLE
        decision = response.get("decision")
        if decision == ApprovalDecision.APPROVED.value and response.get("approval_source") != "ApproveClick":
            print("WPF_PIPE_VALIDATION=APPROVED_SOURCE_INVALID", flush=True)
            return ApprovalDecision.UNAVAILABLE
        try:
            return ApprovalDecision(decision)
        except ValueError:
            return ApprovalDecision.UNAVAILABLE

    def show_pairing(self, context: PairingContext) -> ApprovalDecision:
        return self._send({"protocol": "brana-ui-v1", "message_type": "PAIRING_REQUEST", "request_id": context.request_id, "origin": context.origin, "nonce": context.approval_code, "expires_at": context.expires_at})

    def show_signature(self, context: SignatureContext, preview) -> ApprovalDecision:
        if preview.sha256 != context.prepared_pdf_sha256:
            return ApprovalDecision.DENIED
        return self._send({"protocol": "brana-ui-v1", "message_type": "SIGNATURE_REQUEST", "operation_id": context.operation_id, "origin": context.origin, "prepared_pdf_sha256": context.prepared_pdf_sha256, "field_name": context.field_name, "page": context.page_index, "rect": ",".join(map(str, context.rect)), "profile": context.profile, "policy_oid": context.policy_oid, "nonce": context.operation_id, "expires_at": context.expires_at})


class WpfApprovalProcess:
    """Owns only a WPF process created by this launcher."""
    def __init__(self, executable: str, pipe_name: str, timeout: float = 10.0):
        import os, subprocess, uuid
        self.pipe_name = pipe_name or f"BranaCloudeApproval-{uuid.uuid4()}"
        self.process = subprocess.Popen([executable, self.pipe_name], close_fds=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, bufsize=1)
        self.identity_report = None
        import threading
        def capture_identity():
            if self.process.stdout is None:
                return
            for line in self.process.stdout:
                line = line.strip()
                allowed = ("BRANA_WPF_IDENTITY=", "WPF_PIPE_FRAME_RECEIVED=", "WPF_WINDOW_CREATED=",
                           "WPF_WINDOW_SHOWN=", "WPF_WINDOW_ACTIVATED=", "WPF_WINDOW_EXPIRED=", "WPF_APPROVE_HANDLER_ENTERED=",
                           "WPF_DECISION=", "WPF_FRAME_SENT=")
                if not line.startswith(allowed):
                    continue
                if line.startswith("BRANA_WPF_IDENTITY="):
                    self.identity_report = line
                print(line, flush=True)
        self._identity_thread = threading.Thread(target=capture_identity, daemon=True)
        self._identity_thread.start()
        self.presenter = NamedPipeApprovalPresenter(self.pipe_name, timeout=timeout)

    def close(self):
        if self.process.poll() is None:
            self.process.terminate()
            self.process.wait(timeout=5)


def launch_wpf_approval_ui(executable: str, pipe_name: str | None = None, timeout: float = 10.0):
    from .ui_runtime import NamedPipeApprovalUI
    from .approval_adapter import ApprovalAdapter
    process = WpfApprovalProcess(executable, pipe_name or "", timeout)
    return NamedPipeApprovalUI(ApprovalAdapter(process.presenter)), process


@dataclass(frozen=True)
class PairingContext:
    request_id: str
    origin: str
    approval_code: str
    expires_at: float


@dataclass(frozen=True)
class SignatureContext:
    operation_id: str
    prepared_pdf_sha256: str
    field_name: str
    page_index: int
    rect: tuple[float, float, float, float]
    profile: str
    policy_oid: str
    certificate_label: str
    expires_at: float
    origin: str = "https://localhost:5173"


class ApprovalPresenter(Protocol):
    def show_pairing(self, context: PairingContext) -> ApprovalDecision: ...
    def show_signature(self, context: SignatureContext, preview) -> ApprovalDecision: ...


class ApprovalAdapter:
    def __init__(self, presenter: ApprovalPresenter):
        self.presenter = presenter

    def show_pairing(self, context: PairingContext) -> ApprovalDecision:
        return self.presenter.show_pairing(context)

    def show_signature(self, context: SignatureContext, preview) -> ApprovalDecision:
        if preview.sha256 != context.prepared_pdf_sha256:
            raise ValueError("PREVIEW_HASH_MISMATCH")
        return self.presenter.show_signature(context, preview)
