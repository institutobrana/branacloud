import unittest

from local_bridge.security.direct_csp_adapter import DirectCspError, PublicCspMetadata
from local_bridge.security.key_compatibility_diagnostic import CompatibilityDiagnostic


def md(**changes):
    values = dict(store="CurrentUser\\My", provider_name="Microsoft Enhanced Cryptographic Provider v1.0",
                  provider_kind="CSP", key_algorithm="RSA", key_size=2048, has_private_key=True)
    values.update(changes)
    return PublicCspMetadata(**values)


class Selector:
    def __init__(self, value): self.value = value; self.calls = 0
    def select_unique(self): self.calls += 1; return self.value


class Handle:
    def __init__(self, spec=1): self.key_spec = spec


class Boundary:
    def __init__(self, acquired=1): self.acquired = acquired; self.signs = []; self.released = []
    def acquire_rsa_key(self, metadata):
        if isinstance(self.acquired, Exception): raise self.acquired
        return Handle(self.acquired)
    def sign_digest(self, handle, digest): self.signs.append(bytes(digest)); return b"synthetic-rsa"
    def release(self, handle): self.released.append(handle)


class CompatibilityDiagnosticTests(unittest.TestCase):
    def test_both_real_phases_are_denied_by_default(self):
        diagnostic = CompatibilityDiagnostic(selector=Selector(md()), boundary=Boundary())
        with self.assertRaisesRegex(DirectCspError, "REAL_PHASE_1_EXPLICIT_GATE_REQUIRED"):
            diagnostic.phase_1_identification()
        with self.assertRaisesRegex(DirectCspError, "REAL_PHASE_1_REQUIRED"):
            diagnostic.phase_2_sha256_proof()

    def test_phase_one_double_selects_and_releases(self):
        boundary = Boundary(2); diagnostic = CompatibilityDiagnostic(selector=Selector(md()), boundary=boundary)
        result = diagnostic.phase_1_identification(execute_real=True)
        self.assertEqual((result.status, result.key_spec), ("ACQUIRED", 2))
        self.assertEqual(len(boundary.released), 1)

    def test_selection_and_invalid_key_spec_fail_closed(self):
        for value in (0, None, "missing"):
            boundary = Boundary(value); diagnostic = CompatibilityDiagnostic(selector=Selector(md()), boundary=boundary)
            with self.subTest(value=value), self.assertRaises(DirectCspError):
                diagnostic.phase_1_identification(execute_real=True)
            self.assertEqual(len(boundary.released), 1)

    def test_provider_and_candidate_errors_are_not_hidden(self):
        diagnostic = CompatibilityDiagnostic(selector=Selector(md(provider_kind="KSP")), boundary=Boundary())
        with self.assertRaisesRegex(DirectCspError, "PUBLIC_CSP_METADATA_INCOMPATIBLE"):
            diagnostic.phase_1_identification(execute_real=True)
        diagnostic = CompatibilityDiagnostic(selector=Selector(md()), boundary=Boundary(RuntimeError("native")))
        with self.assertRaisesRegex(DirectCspError, "CSP_KEY_ACQUISITION_FAILED"):
            diagnostic.phase_1_identification(execute_real=True)

    def test_phase_two_requires_explicit_gate_and_releases(self):
        boundary = Boundary(1); diagnostic = CompatibilityDiagnostic(selector=Selector(md()), boundary=boundary)
        evidence = diagnostic.phase_1_identification(execute_real=True).evidence
        with self.assertRaisesRegex(DirectCspError, "REAL_PHASE_2_EXPLICIT_GATE_REQUIRED"):
            diagnostic.phase_2_sha256_proof(phase_1_evidence=evidence)
        result = diagnostic.phase_2_sha256_proof(phase_1_evidence=evidence, execute_real=True, digest=b"d" * 32)
        self.assertEqual(result.status, "SIGNED")
        self.assertEqual(boundary.signs, [b"d" * 32])
        self.assertEqual(len(boundary.released), 2)

    def test_phase_two_failure_releases_without_implicit_execution(self):
        class Failing(Boundary):
            def sign_digest(self, handle, digest): raise RuntimeError("secret")
        boundary = Failing(1); diagnostic = CompatibilityDiagnostic(selector=Selector(md()), boundary=boundary)
        evidence = diagnostic.phase_1_identification(execute_real=True).evidence
        with self.assertRaisesRegex(DirectCspError, "CSP_SIGN_FAILED"):
            diagnostic.phase_2_sha256_proof(phase_1_evidence=evidence, execute_real=True)
        self.assertEqual(len(boundary.released), 2)

    def test_phase_two_rejects_manual_or_stale_evidence(self):
        diagnostic = CompatibilityDiagnostic(selector=Selector(md()), boundary=Boundary())
        with self.assertRaisesRegex(DirectCspError, "REAL_PHASE_1_REQUIRED"):
            diagnostic.phase_2_sha256_proof(phase_1_evidence=True, execute_real=True)
        other = CompatibilityDiagnostic(selector=Selector(md(provider_name="Other")), boundary=Boundary())
        evidence = diagnostic.phase_1_identification(execute_real=True).evidence
        with self.assertRaisesRegex(DirectCspError, "PHASE1_IDENTITY_BINDING_MISMATCH"):
            other.phase_2_sha256_proof(phase_1_evidence=evidence, execute_real=True)

    def test_cli_commands_are_safe_without_authorization(self):
        from local_bridge.security.key_compatibility_diagnostic import main
        self.assertEqual(main([]), 0)
        with self.assertRaises(SystemExit):
            main(["--phase1-real"])


if __name__ == "__main__": unittest.main()
