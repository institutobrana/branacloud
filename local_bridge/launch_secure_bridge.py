"""Operational, non-signing launcher for the isolated Brana Cloude bridge."""
from __future__ import annotations

import argparse
import os
import socket
import sys
from pathlib import Path

from .cert_store import resolve_windows_user_candidate
from .secure_bridge_app import create_secure_bridge_runtime
from .security.tls_runtime import TLSRuntimeConfig


def resolve_paths(*, tls_dir: Path | None = None, wpf_executable: Path | None = None) -> tuple[Path, Path, Path]:
    root = tls_dir or (Path(os.environ["LOCALAPPDATA"]) / "BranaCloude" / "bridge-tls")
    cert = root / "bridge-tls-cert.pem"
    key = root / "bridge-tls-key.pem"
    exe = wpf_executable or (Path(__file__).parent / "windows_approval" / "bin" / "Debug" / "net8.0-windows" / "win-x64" / "BranaWindowsApproval.exe")
    for path, label in ((cert, "TLS_CERTIFICATE_NOT_FOUND"), (key, "TLS_KEY_NOT_FOUND"), (exe, "WPF_EXECUTABLE_NOT_FOUND")):
        if not path.is_file():
            raise RuntimeError(label)
    return cert, key, exe


def ensure_port_free(host: str = "127.0.0.1", port: int = 8765) -> None:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as probe:
        probe.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        try:
            probe.bind((host, port))
        except OSError as exc:
            raise RuntimeError("BRIDGE_PORT_OCCUPIED") from exc


def build_runtime(cert_path: Path, key_path: Path, wpf_path: Path):
    candidate_selector = resolve_windows_user_candidate
    from .security.windows_prepared_signer import create_real_operational_windows_prepared_signer

    return create_secure_bridge_runtime(
        cert_pem=cert_path.read_bytes(),
        key_pem=key_path.read_bytes(),
        candidate_selector=candidate_selector,
        operational_signer_factory=create_real_operational_windows_prepared_signer(),
        wpf_executable=str(wpf_path),
        tls_config=TLSRuntimeConfig(host="localhost", port=8765),
        production_mode=True,
    )


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Start the temporary Brana Cloude HTTPS approval bridge.")
    parser.add_argument("--tls-dir", type=Path)
    parser.add_argument("--wpf-executable", type=Path)
    args = parser.parse_args(argv)
    runtime = None
    try:
        cert, key, wpf = resolve_paths(tls_dir=args.tls_dir, wpf_executable=args.wpf_executable)
        ensure_port_free()
        print("PAIRING_WINDOW_INSTRUCTION=Approve pairing manually in the WPF window when shown.", flush=True)
        runtime = build_runtime(cert, key, wpf)
        runtime.serve(certfile=str(cert), keyfile=str(key))
        return 0
    except KeyboardInterrupt:
        return 130
    except Exception as exc:
        print(f"BRIDGE_START_FAILED={type(exc).__name__}:{exc}", file=sys.stderr, flush=True)
        return 1
    finally:
        if runtime is not None:
            runtime.close()


if __name__ == "__main__":
    raise SystemExit(main())
