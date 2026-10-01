import struct
import unittest
import subprocess
import asyncio
import hashlib
from local_bridge.security.prepared_signer import PreparedPdfSigningRequest
from local_bridge.security.windows_prepared_signer import SignerDiagnosticError

from local_bridge.security.dotnet_sha256_signer import DotnetSha256Boundary, DotnetHelperError, PyHankoDotnetSigner, _frame, create_explicit_store_only_dotnet_factory


class FakeProcess:
    def __init__(self, response=b"s" * 256, returncode=0, stderr=b""):
        self.response = struct.pack("<I", len(response)) + response; self.returncode = returncode; self.stderr = stderr; self.args = None
    def communicate(self, payload, timeout=None): self.args = payload; return self.response, self.stderr
    def kill(self): pass


class TimeoutProcess(FakeProcess):
    def __init__(self):
        super().__init__(); self.killed = False; self.communicated_after_kill = False
    def communicate(self, payload=None, timeout=None):
        if not self.killed:
            raise subprocess.TimeoutExpired(cmd=self.args or "helper", timeout=timeout)
        self.communicated_after_kill = True
        return b"", b""
    def kill(self): self.killed = True


class DotnetHelperTests(unittest.TestCase):
    def boundary(self, process):
        return DotnetSha256Boundary(executable="C:\\helper.exe", certificate_der_sha256="a" * 64,
                                    approved=True, explicit_enabled=True, process_factory=lambda *a, **k: setattr(process, "args", a[0]) or process)

    def test_gate_and_single_frame(self):
        with self.assertRaisesRegex(DotnetHelperError, "DOTNET_HELPER_EXPLICIT_GATE_REQUIRED"):
            DotnetSha256Boundary(executable="C:\\missing.exe", certificate_der_sha256="a" * 64, approved=True)
        process = FakeProcess(); b = self.boundary(process); self.assertEqual(b.sign_data(b"data"), b"s" * 256)
        self.assertEqual(struct.unpack("<I", process.args[:4])[0], len(process.args) - 4)
        with self.assertRaisesRegex(DotnetHelperError, "SECOND_SIGNING_CALL_BLOCKED"):
            b.sign_data(b"again")

    def test_failure_timeout_and_malformed_response_fail_closed(self):
        for process, code in ((FakeProcess(returncode=1), "DOTNET_HELPER_FAILED"), (FakeProcess(response=b"x"), "RSA_SIGNATURE_LENGTH_INVALID")):
            with self.subTest(code=code), self.assertRaisesRegex(DotnetHelperError, code):
                self.boundary(process).sign_data(b"data")

    def test_lifecycle_events_are_sanitized_and_ordered(self):
        events = []
        process = FakeProcess()
        b = DotnetSha256Boundary(executable="C:\\helper.exe", certificate_der_sha256="a" * 64,
            approved=True, explicit_enabled=True, event_sink=events.append,
            process_factory=lambda *a, **k: process)
        b.sign_data(b"data")
        self.assertEqual(events, ["HELPER_PROCESS_CREATE_BEGIN", "HELPER_PROCESS_STARTED", "HELPER_RESPONSE_ACCEPTED", "HELPER_PROCESS_ENDED"])

    def test_failure_event_does_not_expose_process_or_input(self):
        events = []
        process = FakeProcess(returncode=1)
        b = DotnetSha256Boundary(executable="C:\\helper.exe", certificate_der_sha256="a" * 64,
            approved=True, explicit_enabled=True, event_sink=events.append,
            process_factory=lambda *a, **k: process)
        with self.assertRaisesRegex(DotnetHelperError, "DOTNET_HELPER_FAILED"):
            b.sign_data(b"private-pdf-bytes")
        self.assertEqual(events, ["HELPER_PROCESS_CREATE_BEGIN", "HELPER_PROCESS_STARTED", "HELPER_PROCESS_FAILED", "HELPER_PROCESS_ENDED"])

    def test_helper_phase_event_preserves_normalized_error_without_text(self):
        events = []
        process = FakeProcess(returncode=1, stderr=b'BRANA_HELPER_EVENT:{"phase":"store_open","state":"failed","win32_error":2,"hresult":"0x80070002"}\n')
        b = DotnetSha256Boundary(executable="C:\\helper.exe", certificate_der_sha256="a" * 64,
            approved=True, explicit_enabled=True, event_sink=events.append,
            process_factory=lambda *a, **k: process)
        with self.assertRaisesRegex(DotnetHelperError, "DOTNET_HELPER_FAILED") as caught:
            b.sign_data(b"data")
        self.assertEqual(caught.exception.phase, "store_open")
        self.assertEqual(caught.exception.diagnostic, {"phase": "store_open", "win32_error": 2, "hresult": "0x80070002"})
        self.assertIn("HELPER_STORE_OPEN_FAILED", events)

    def test_process_creation_failure_is_observable_before_helper_stderr(self):
        events = []
        def fail_process(*_args, **_kwargs):
            error = OSError(2, "not exposed")
            error.winerror = 2
            raise error
        b = DotnetSha256Boundary(executable="C:\\helper.exe", certificate_der_sha256="a" * 64,
            approved=True, explicit_enabled=True, event_sink=events.append, process_factory=fail_process)
        with self.assertRaisesRegex(DotnetHelperError, "DOTNET_HELPER_PROCESS_CREATE_FAILED") as caught:
            b.sign_data(b"data")
        self.assertEqual(caught.exception.phase, "process_create")
        self.assertEqual(caught.exception.diagnostic["win32_error"], 2)
        self.assertEqual(events[:2], ["HELPER_PROCESS_CREATE_BEGIN", "HELPER_PROCESS_CREATE_FAILED"])

    def test_pyhanko_forwards_full_data_and_dry_run_does_not_call(self):
        process = FakeProcess(); b = self.boundary(process)
        self.assertEqual(__import__("asyncio").run(PyHankoDotnetSigner(signing_cert=object(), cert_registry=object(), boundary=b).async_sign_raw(b"data", "sha256", dry_run=True)), b"\0" * 256)
        self.assertEqual(b.calls, 0)

    def test_timeout_is_terminal_and_kills_only_created_process(self):
        process = TimeoutProcess()
        b = DotnetSha256Boundary(executable="C:\\helper.exe", certificate_der_sha256="a" * 64,
            approved=True, explicit_enabled=True, timeout=0.001,
            process_factory=lambda *a, **k: setattr(process, "args", a[0]) or process)
        with self.assertRaisesRegex(DotnetHelperError, "DOTNET_HELPER_TIMEOUT"):
            b.sign_data(b"data")
        self.assertTrue(process.killed)
        self.assertTrue(process.communicated_after_kill)
        self.assertEqual(b.calls, 1)

    def test_store_only_factory_logs_interval_failure_before_pdf_signer(self):
        events = []
        bad_der = b"not-a-certificate"
        candidate = {"store": "CurrentUser\\My", "chain_valid": True,
                     "_stable_identity": hashlib.sha256(bad_der).hexdigest(),
                     "certificate_der": bad_der}
        factory = create_explicit_store_only_dotnet_factory(
            executable=__file__, enabled=True, event_sink=events.append)
        signer = factory(lambda: candidate)
        request = PreparedPdfSigningRequest(
            b"pdf", hashlib.sha256(b"pdf").hexdigest(), "BranaSignature_1", True,
            "pades-ad-rb-1.3", "2.16.76.1.7.1.11.1.3", "op", "binding")
        with self.assertRaises(SignerDiagnosticError) as caught:
            asyncio.run(signer.async_sign_prepared(request))
        self.assertEqual(caught.exception.diagnostic.phase, "pyhanko_setup")
        self.assertEqual(caught.exception.diagnostic.error_code, "CERTIFICATE_DER_INVALID")
        self.assertEqual(events, [
            "FACTORY_ENTERED", "CANDIDATE_SELECTION_BEGIN", "CANDIDATE_SELECTED", "ADAPTER_CREATED",
            "SIGNER_CONFIG_BEGIN", "SIGNER_CONFIG_FAILED code=CERTIFICATE_DER_INVALID",
        ])


if __name__ == "__main__": unittest.main()
