"""Opt-in diagnostic for CSP/SHA-256 compatibility.

This module is deliberately detached from the bridge and HTTP signer.  Both
phases are denied by default; callers must opt in explicitly in a future,
separately authorised run.
"""

from __future__ import annotations

from dataclasses import dataclass
import argparse
import hashlib
from typing import Protocol

from .direct_csp_adapter import DirectCspError, PublicCspMetadata


class PublicSelector(Protocol):
    def select_unique(self) -> PublicCspMetadata: ...


class DiagnosticBoundary(Protocol):
    def acquire_rsa_key(self, metadata: PublicCspMetadata): ...
    def sign_digest(self, key_handle, digest: bytes) -> bytes: ...
    def release(self, key_handle) -> None: ...


@dataclass(frozen=True)
class CompatibilityResult:
    phase: str
    status: str
    provider_kind: str | None = None
    key_spec: int | None = None
    native_code: int | None = None
    detail_code: str | None = None
    evidence: "Phase1Evidence | None" = None


@dataclass(frozen=True)
class Phase1Evidence:
    """Non-secret binding returned by phase 1; not a handle or approval flag."""
    public_identity: str
    provider_name: str
    provider_kind: str
    key_spec: int


def _identity(metadata: PublicCspMetadata) -> str:
    # DER identity is supplied by the public selector when available.  The
    # fallback binds all public provider fields and is never a certificate ID.
    value = getattr(metadata, "der_identity", None) or "|".join(
        (metadata.store, metadata.provider_name, metadata.provider_kind,
         metadata.key_algorithm, str(metadata.key_size))
    )
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


class CompatibilityDiagnostic:
    """Two gated phases; never runs either phase implicitly."""

    def __init__(self, *, selector: PublicSelector, boundary: DiagnosticBoundary):
        self.selector = selector
        self.boundary = boundary

    def phase_1_identification(self, *, execute_real: bool = False) -> CompatibilityResult:
        if not execute_real:
            raise DirectCspError("REAL_PHASE_1_EXPLICIT_GATE_REQUIRED", phase="diagnostic_gate", retryable=False)
        metadata = self.selector.select_unique()
        if (metadata.store != "CurrentUser\\My" or metadata.provider_kind != "CSP"
                or metadata.key_algorithm != "RSA" or metadata.key_size != 2048):
            raise DirectCspError("PUBLIC_CSP_METADATA_INCOMPATIBLE", phase="certificate_resolution", retryable=False)
        handle = None
        try:
            handle = self.boundary.acquire_rsa_key(metadata)
            spec = getattr(handle, "key_spec", None)
            if spec not in (1, 2):
                raise DirectCspError("CSP_KEY_SPEC_UNAVAILABLE", phase="key_acquisition", retryable=False)
            return CompatibilityResult("identification", "ACQUIRED", metadata.provider_kind, spec,
                                       evidence=Phase1Evidence(_identity(metadata), metadata.provider_name,
                                                               metadata.provider_kind, spec))
        except DirectCspError:
            raise
        except Exception as exc:
            raise DirectCspError("CSP_KEY_ACQUISITION_FAILED", phase="key_acquisition", retryable=False) from exc
        finally:
            if handle is not None:
                self.boundary.release(handle)

    def phase_2_sha256_proof(self, *, phase_1_evidence: Phase1Evidence | None = None,
                             execute_real: bool = False,
                             digest: bytes = b"BRANA-CSP-SHA256-DIAGNOSTIC") -> CompatibilityResult:
        if not isinstance(phase_1_evidence, Phase1Evidence):
            raise DirectCspError("REAL_PHASE_1_REQUIRED", phase="diagnostic_gate", retryable=False)
        if not execute_real:
            raise DirectCspError("REAL_PHASE_2_EXPLICIT_GATE_REQUIRED", phase="diagnostic_gate", retryable=False)
        if not digest:
            raise DirectCspError("DIAGNOSTIC_DIGEST_INVALID", phase="provider_sign", retryable=False)
        metadata = self.selector.select_unique()
        if (metadata.store != "CurrentUser\\My" or metadata.provider_kind != "CSP"
                or metadata.key_algorithm != "RSA" or metadata.key_size != 2048):
            raise DirectCspError("PUBLIC_CSP_METADATA_INCOMPATIBLE", phase="certificate_resolution", retryable=False)
        if (phase_1_evidence.public_identity != _identity(metadata)
                or phase_1_evidence.provider_name != metadata.provider_name
                or phase_1_evidence.provider_kind != metadata.provider_kind):
            raise DirectCspError("PHASE1_IDENTITY_BINDING_MISMATCH", phase="certificate_resolution", retryable=False)
        handle = None
        try:
            handle = self.boundary.acquire_rsa_key(metadata)
            signature = self.boundary.sign_digest(handle, bytes(digest))
            if not signature:
                raise DirectCspError("CSP_SIGN_EMPTY_RESULT", phase="provider_sign", retryable=False)
            return CompatibilityResult("sha256_proof", "SIGNED", metadata.provider_kind,
                                       getattr(handle, "key_spec", None))
        except DirectCspError:
            raise
        except Exception as exc:
            raise DirectCspError("CSP_SIGN_FAILED", phase="provider_sign", retryable=False) from exc
        finally:
            if handle is not None:
                self.boundary.release(handle)


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(description="Opt-in CSP/SHA-256 diagnostic; real phases are disabled by default.")
    parser.add_argument("--phase1-real", action="store_true", help="reserved: requires a future explicit authorization")
    parser.add_argument("--phase2-sha256-real", action="store_true", help="reserved: requires phase-1 evidence and separate authorization")
    args = parser.parse_args(argv)
    # No production selector/boundary is wired into this CLI by design.
    if args.phase1_real or args.phase2_sha256_real:
        parser.error("REAL_DIAGNOSTIC_NOT_ENABLED_IN_THIS_BUILD")
    print("diagnostic disabled; no Store, key, PIN, bridge, or signature accessed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
