"""Isolated Python boundary for the public PKCS#12 helper protocol.

This module is intentionally not imported by the launcher or ``/sign`` path.
It sends public operation context and signing bytes only; the PFX and password
remain inside the native process (or its test harness).
"""

from __future__ import annotations

import base64
import hashlib
import json
import os
import struct
import subprocess
from dataclasses import dataclass
from typing import Callable

from .direct_csp_adapter import DirectCspError
from .prepared_signer import PreparedPdfSigningRequest

MAX_FRAME = 1_048_576


class Pkcs12AdapterError(DirectCspError):
    def __init__(self, code: str, *, phase: str = "provider_sign"):
        super().__init__(code, phase=phase, retryable=False)


@dataclass(frozen=True)
class PublicPkcs12Context:
    authorization_id: str
    expected_certificate_der: bytes
    data: bytes


def _frame(body: bytes) -> bytes:
    if not body or len(body) > MAX_FRAME:
        raise Pkcs12AdapterError("HELPER_REQUEST_TOO_LARGE")
    return struct.pack("<I", len(body)) + body


def _read_frame(stdout: bytes) -> bytes:
    if len(stdout) < 4:
        raise Pkcs12AdapterError("HELPER_RESPONSE_MALFORMED")
    length = struct.unpack_from("<I", stdout)[0]
    if length <= 0 or length > MAX_FRAME:
        raise Pkcs12AdapterError("HELPER_RESPONSE_TOO_LARGE")
    if len(stdout) != length + 4:
        raise Pkcs12AdapterError("HELPER_RESPONSE_TRUNCATED")
    return stdout[4:]


def _sanitized_stderr(stderr: bytes) -> str | None:
    """Accept only the helper's stable code marker, never raw diagnostics."""
    for line in stderr.splitlines():
        if line.startswith(b"HARNESS_ERROR="):
            code = line.split(b"=", 1)[1].decode("ascii", "ignore").strip()
            if code and all(ch.isupper() or ch.isdigit() or ch in "_-." for ch in code):
                return code
    return None


class Pkcs12DotnetAdapter:
    """One subprocess and one frame per call; no retry or Store fallback."""

    def __init__(self, executable: str, *, timeout: float = 30.0,
                 process_factory: Callable = subprocess.Popen,
                 test_only_read_public_der_announcement: bool = False,
                 event_sink: Callable[[str], None] | None = None):
        if not isinstance(executable, str) or not os.path.isabs(executable):
            raise Pkcs12AdapterError("HELPER_PATH_INVALID", phase="initialization")
        if process_factory is subprocess.Popen and not os.path.isfile(executable):
            raise Pkcs12AdapterError("HELPER_NOT_FOUND", phase="initialization")
        if timeout <= 0:
            raise Pkcs12AdapterError("HELPER_TIMEOUT_INVALID", phase="initialization")
        self.executable = executable
        self.timeout = timeout
        self.process_factory = process_factory
        self.test_only_read_public_der_announcement = test_only_read_public_der_announcement
        self.event_sink = event_sink or (lambda _event: None)
        self.last_announced_der: bytes | None = None
        self.calls = 0

    def sign(self, request: PreparedPdfSigningRequest, context: PublicPkcs12Context) -> bytes:
        if self.calls:
            raise Pkcs12AdapterError("SECOND_SIGNING_CALL_BLOCKED")
        if request.certificate_source != "FILE_PKCS12":
            raise Pkcs12AdapterError("CERTIFICATE_SOURCE_INVALID", phase="certificate_resolution")
        if not self.test_only_read_public_der_announcement and request.certificate_binding != hashlib.sha256(context.expected_certificate_der).hexdigest():
            raise Pkcs12AdapterError("CERTIFICATE_DER_HASH_MISMATCH", phase="certificate_resolution")
        if not context.data or len(context.data) > MAX_FRAME:
            raise Pkcs12AdapterError("SIGN_INPUT_INVALID")
        if not context.authorization_id:
            raise Pkcs12AdapterError("AUTHORIZATION_ID_REQUIRED", phase="authorization")
        data_hash = hashlib.sha256(context.data).hexdigest()
        payload = {
            "operation_id": request.operation_id,
            "authorization_id": context.authorization_id,
            "certificate_source": request.certificate_source,
            "certificate_der_sha256": request.certificate_binding,
            "expected_certificate_der_b64": base64.b64encode(context.expected_certificate_der).decode("ascii"),
            "prepared_pdf_sha256": request.prepared_pdf_sha256,
            "data_sha256": data_hash,
            "data_b64": base64.b64encode(context.data).decode("ascii"),
        }
        self.calls += 1
        process = None
        try:
            self.event_sink("HELPER_PROCESS_CREATE_BEGIN")
            process = self.process_factory(
                [self.executable, "--serve"], stdin=subprocess.PIPE,
                stdout=subprocess.PIPE, stderr=subprocess.PIPE,
            )
            self.event_sink("HELPER_PROCESS_STARTED")
            if self.test_only_read_public_der_announcement:
                announcement = process.stderr.readline()
                prefix = b"HARNESS_PUBLIC_DER="
                if not announcement.startswith(prefix):
                    raise Pkcs12AdapterError("HELPER_PUBLIC_IDENTITY_UNAVAILABLE", phase="certificate_resolution")
                try:
                    announced_der = base64.b64decode(announcement[len(prefix):].strip(), validate=True)
                except (ValueError, UnicodeError):
                    raise Pkcs12AdapterError("HELPER_PUBLIC_IDENTITY_INVALID", phase="certificate_resolution") from None
                self.last_announced_der = announced_der
                request = request.__class__(**{**request.__dict__, "certificate_binding": hashlib.sha256(announced_der).hexdigest()})
                payload["certificate_der_sha256"] = request.certificate_binding
                payload["expected_certificate_der_b64"] = base64.b64encode(announced_der).decode("ascii")
            stdout, stderr = process.communicate(_frame(json.dumps(payload, separators=(",", ":")).encode("utf-8")), timeout=self.timeout)
            code = _sanitized_stderr(stderr)
            if process.returncode != 0:
                raise Pkcs12AdapterError(code or "HELPER_FAILED")
            signature = _read_frame(stdout)
            if not signature:
                raise Pkcs12AdapterError("HELPER_SIGNATURE_EMPTY")
            return signature
        except subprocess.TimeoutExpired:
            if process is not None:
                process.kill()
                process.communicate()
            raise Pkcs12AdapterError("HELPER_TIMEOUT") from None
        except Pkcs12AdapterError:
            raise
        except (OSError, ValueError, UnicodeError):
            if process is not None and process.poll() is None:
                process.kill(); process.communicate()
            raise Pkcs12AdapterError("HELPER_PROCESS_FAILED", phase="process_create") from None
        finally:
            self.event_sink("HELPER_PROCESS_ENDED")
