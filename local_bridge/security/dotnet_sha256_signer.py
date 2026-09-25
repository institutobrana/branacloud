"""Explicit, disabled-by-default bridge to the standalone .NET signer helper."""

from __future__ import annotations

import base64
import hashlib
import json
import os
import struct
import subprocess
import threading
from typing import Callable

from asn1crypto import algos
from pyhanko.sign.signers.pdf_cms import Signer

from .direct_csp_adapter import DirectCspError

MAX_FRAME = 1_048_576


class DotnetHelperError(DirectCspError):
    pass


def _frame(payload: bytes) -> bytes:
    if not payload or len(payload) > MAX_FRAME:
        raise DotnetHelperError("HELPER_FRAME_TOO_LARGE", phase="provider_sign", retryable=False)
    return struct.pack("<I", len(payload)) + payload


def _read_frame(stream) -> bytes:
    header = stream.read(4)
    if len(header) != 4:
        raise DotnetHelperError("HELPER_RESPONSE_MALFORMED", phase="provider_sign", retryable=False)
    length = struct.unpack("<I", header)[0]
    if length <= 0 or length > MAX_FRAME:
        raise DotnetHelperError("HELPER_RESPONSE_TOO_LARGE", phase="provider_sign", retryable=False)
    data = stream.read(length)
    if len(data) != length:
        raise DotnetHelperError("HELPER_RESPONSE_TRUNCATED", phase="provider_sign", retryable=False)
    return data


class DotnetSha256Boundary:
    """One-process/one-frame boundary. It is never selected implicitly."""

    def __init__(self, *, executable: str, certificate_der_sha256: str,
                 approved: bool, process_factory: Callable = subprocess.Popen,
                 explicit_enabled: bool = False, timeout: float = 120.0):
        """Create the one-shot helper boundary.

        120 seconds is finite but allows a native provider prompt to be
        acknowledged.  Expiry is terminal: the process created here is killed,
        no retry is attempted, and the operation can be inspected through its
        authenticated HTTP state/result endpoint.
        """
        if not explicit_enabled:
            raise DotnetHelperError("DOTNET_HELPER_EXPLICIT_GATE_REQUIRED", phase="initialization", retryable=False)
        if (process_factory is subprocess.Popen) and (not os.path.isabs(executable) or not os.path.isfile(executable)):
            raise DotnetHelperError("DOTNET_HELPER_NOT_FOUND", phase="initialization", retryable=False)
        if approved is not True:
            raise DotnetHelperError("APPROVAL_REQUIRED", phase="authorization", retryable=False)
        if len(certificate_der_sha256) != 64 or any(c not in "0123456789abcdefABCDEF" for c in certificate_der_sha256):
            raise DotnetHelperError("CERTIFICATE_ID_INVALID", phase="certificate_resolution", retryable=False)
        self.executable = executable
        self.certificate_der_sha256 = certificate_der_sha256.lower()
        self.process_factory = process_factory
        self.timeout = timeout
        self.calls = 0
        self.process = None

    def sign_data(self, data: bytes) -> bytes:
        if self.calls:
            raise DotnetHelperError("SECOND_SIGNING_CALL_BLOCKED", phase="provider_sign", retryable=False)
        if not isinstance(data, bytes) or not data or len(data) > MAX_FRAME:
            raise DotnetHelperError("SIGN_INPUT_INVALID", phase="provider_sign", retryable=False)
        self.calls += 1
        request = json.dumps({"certificate_der_sha256": self.certificate_der_sha256,
                              "data_b64": base64.b64encode(data).decode("ascii")}, separators=(",", ":")).encode()
        process = None
        try:
            process = self.process_factory([self.executable, "--explicit-authorized-run"], stdin=subprocess.PIPE,
                                           stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            self.process = process
            stdout, stderr = process.communicate(_frame(request), timeout=self.timeout)
            if process.returncode != 0 or stderr:
                raise DotnetHelperError("DOTNET_HELPER_FAILED", phase="provider_sign", retryable=False)
            response = _read_frame(_BytesReader(stdout))
            if len(response) != 256:
                raise DotnetHelperError("RSA_SIGNATURE_LENGTH_INVALID", phase="provider_sign", retryable=False)
            return response
        except subprocess.TimeoutExpired as exc:
            if process is not None:
                process.kill()
                process.communicate()
            raise DotnetHelperError("DOTNET_HELPER_TIMEOUT", phase="provider_sign", retryable=False) from None
        except DotnetHelperError:
            raise
        except Exception as exc:
            raise DotnetHelperError("DOTNET_HELPER_PROTOCOL_FAILED", phase="provider_sign", retryable=False) from None
        finally:
            self.process = None

    def close(self):
        process = self.process
        if process is not None:
            try:
                process.kill()
                process.communicate()
            finally:
                self.process = None


class _BytesReader:
    def __init__(self, data: bytes): self.data, self.offset = data, 0
    def read(self, size=-1):
        if size < 0: size = len(self.data) - self.offset
        out = self.data[self.offset:self.offset + size]; self.offset += len(out); return out


class PyHankoDotnetSigner(Signer):
    """pyHanko signer that forwards full ``data`` to the .NET helper."""

    def __init__(self, *, signing_cert, cert_registry, boundary: DotnetSha256Boundary, signature_length=256):
        super().__init__(signing_cert=signing_cert, cert_registry=cert_registry,
                         signature_mechanism=algos.SignedDigestAlgorithm({"algorithm": "sha256_rsa"}),
                         prefer_pss=False, embed_roots=True)
        self.boundary, self.signature_length = boundary, signature_length

    async def async_sign_raw(self, data: bytes, digest_algorithm: str, dry_run=False) -> bytes:
        if str(digest_algorithm).lower().replace("-", "") != "sha256" or not isinstance(data, bytes) or not data:
            raise DotnetHelperError("RSA_SHA256_INPUT_INVALID", phase="pyhanko_setup", retryable=False)
        if dry_run:
            return b"\x00" * self.signature_length
        signature = self.boundary.sign_data(data)
        if len(signature) != self.signature_length:
            raise DotnetHelperError("RSA_SIGNATURE_LENGTH_INVALID", phase="provider_sign", retryable=False)
        return signature


class EphemeralDotnetTestHost:
    """Test-only protocol; production factories must never construct this."""

    test_only = True

    def __init__(self, executable: str, *, process_factory=subprocess.Popen):
        if not os.path.isabs(executable) or not os.path.isfile(executable):
            raise DotnetHelperError("TEST_HOST_NOT_FOUND", phase="initialization", retryable=False)
        self.process = process_factory([executable, "--ephemeral-test-only"], stdin=subprocess.PIPE,
                                       stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        hello = json.loads(_read_frame(self.process.stdout))
        self.identity = str(hello.get("identity") or "")
        self.certificate_der = base64.b64decode(hello.get("certificate_der_b64") or "", validate=True)
        if len(self.certificate_der) == 0 or hashlib.sha256(self.certificate_der).hexdigest().upper() != self.identity:
            self.close(); raise DotnetHelperError("TEST_IDENTITY_INVALID", phase="initialization", retryable=False)
        self.calls = 0
        self.lock = threading.Lock()

    def sign_data(self, data: bytes) -> bytes:
        with self.lock:
            if self.calls: raise DotnetHelperError("SECOND_SIGNING_CALL_BLOCKED", phase="provider_sign", retryable=False)
            self.calls += 1
            payload = json.dumps({"identity": self.identity, "data_b64": base64.b64encode(data).decode("ascii")}, separators=(",", ":")).encode()
            self.process.stdin.write(_frame(payload)); self.process.stdin.flush()
            response = json.loads(_read_frame(self.process.stdout))
            if response.get("identity") != self.identity or int(response.get("input_length", -1)) != len(data):
                raise DotnetHelperError("TEST_IDENTITY_OR_INPUT_MISMATCH", phase="provider_sign", retryable=False)
            signature = base64.b64decode(response.get("signature_b64") or "", validate=True)
            if len(signature) != 256: raise DotnetHelperError("RSA_SIGNATURE_LENGTH_INVALID", phase="provider_sign", retryable=False)
            return signature

    def close(self):
        if getattr(self, "process", None) is not None:
            self.process.kill(); self.process.communicate(); self.process = None


def create_ephemeral_test_signer(*, executable: str, production_mode: bool = False):
    if production_mode:
        raise DotnetHelperError("TEST_HOST_FORBIDDEN_IN_PRODUCTION", phase="initialization", retryable=False)
    host = EphemeralDotnetTestHost(executable)
    from asn1crypto import x509
    from pyhanko_certvalidator.registry import SimpleCertificateStore
    signer = PyHankoDotnetSigner(signing_cert=x509.Certificate.load(host.certificate_der),
                                 cert_registry=SimpleCertificateStore(),
                                 boundary=host)
    signer.test_only_host = host
    return signer


def create_explicit_store_only_dotnet_factory(*, executable: str, enabled: bool = False):
    """Build the opt-in production graph for the Store-only .NET helper.

    The helper is never selected by the default runtime.  It receives only the
    validated public DER identity; it resolves the private key in CurrentUser\My
    itself after the HTTP service has entered SIGNING.
    """
    if not enabled:
        raise DotnetHelperError("DOTNET_STORE_HELPER_EXPLICIT_GATE_REQUIRED", phase="initialization", retryable=False)
    if not os.path.isabs(executable) or not os.path.isfile(executable):
        raise DotnetHelperError("DOTNET_HELPER_NOT_FOUND", phase="initialization", retryable=False)

    from asn1crypto import x509
    from pyhanko.pdf_utils.incremental_writer import IncrementalPdfFileWriter
    from pyhanko.sign.fields import SigSeedSubFilter
    from pyhanko.sign.signers import PdfSignatureMetadata, PdfSigner
    from pyhanko_certvalidator.registry import SimpleCertificateStore
    from ..pdf_signing import build_offline_pades_policy
    from .windows_prepared_signer import WindowsPreparedPdfSigner
    import io

    def factory(candidate_selector):
        async def sign(request, _http_hash):
            candidate = candidate_selector()
            if candidate.get("store") != "CurrentUser\\My" or candidate.get("chain_valid") is not True:
                raise DotnetHelperError("CERTIFICATE_SELECTION_REQUIRED", phase="certificate_resolution", retryable=False)
            der = candidate.get("certificate_der") or candidate.get("der")
            identity = str(candidate.get("_stable_identity") or candidate.get("stable_identity") or "")
            if not isinstance(der, (bytes, bytearray)) or len(der) == 0 or len(identity) != 64:
                raise DotnetHelperError("PUBLIC_CERTIFICATE_IDENTITY_UNAVAILABLE", phase="certificate_resolution", retryable=False)
            actual = hashlib.sha256(bytes(der)).hexdigest()
            if actual != identity.lower():
                raise DotnetHelperError("PUBLIC_CERTIFICATE_IDENTITY_MISMATCH", phase="certificate_resolution", retryable=False)
            boundary = DotnetSha256Boundary(executable=executable, certificate_der_sha256=identity,
                                            approved=True, explicit_enabled=True)
            cert = x509.Certificate.load(bytes(der))
            signer = PyHankoDotnetSigner(signing_cert=cert, cert_registry=SimpleCertificateStore(), boundary=boundary)
            try:
                meta = PdfSignatureMetadata(field_name="BranaSignature_1", md_algorithm="sha256",
                    subfilter=SigSeedSubFilter.PADES, cades_signed_attr_spec=build_offline_pades_policy())
                writer = IncrementalPdfFileWriter(io.BytesIO(request.pdf_bytes))
                output = io.BytesIO()
                await PdfSigner(signature_meta=meta, signer=signer).async_sign_pdf(
                    writer, existing_fields_only=True, output=output)
                return output.getvalue()
            finally:
                # The helper process is created by the first non-dry-run call.
                # Its boundary owns exactly that process and no retry is possible.
                boundary.close()

        def sync_unused(_request):
            raise DotnetHelperError("ASYNC_DOTNET_SIGNER_REQUIRED", phase="provider_sign", retryable=False)

        result = WindowsPreparedPdfSigner(sync_unused, async_signer_callable=sign)
        result.production_wiring = True
        result.store_only = True
        return result

    factory.real_wiring = True
    factory.production_wiring = True
    factory.store_only = True
    return factory
