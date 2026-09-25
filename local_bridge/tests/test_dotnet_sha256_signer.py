import struct
import unittest
import subprocess

from local_bridge.security.dotnet_sha256_signer import DotnetSha256Boundary, DotnetHelperError, PyHankoDotnetSigner, _frame


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


if __name__ == "__main__": unittest.main()
