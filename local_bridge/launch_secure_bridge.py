"""Operational, non-signing launcher for the isolated Brana Cloude bridge."""
from __future__ import annotations

import argparse
import os
import socket
import sys
import json
import threading
import time
import uuid
from pathlib import Path

from .cert_store import resolve_windows_user_candidate, Win32PublicCertificateProvider
from .secure_bridge_app import create_secure_bridge_runtime
from .security.tls_runtime import TLSRuntimeConfig
from .security.reservation_challenge_client import ReservationChallengeConfig, ReservationChallengeForwarder
from .security.online_authorization_client import OnlineAuthorizationConfig, OnlineAuthorizationConsumer


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


DOTNET_STORE_HELPER_ENV = "BRANA_ENABLE_DOTNET_STORE_HELPER"
DOTNET_HELPER_PATH_ENV = "BRANA_DOTNET_HELPER_EXECUTABLE"
MTLS_ENDPOINT_ENV = "BRANA_MTLS_ENDPOINT"
MTLS_CA_ENV = "BRANA_MTLS_CA_CERT"
MTLS_CERT_ENV = "BRANA_MTLS_CLIENT_CERT"
MTLS_KEY_ENV = "BRANA_MTLS_CLIENT_KEY"


def resolve_dotnet_helper(*, enabled: bool, helper_path: Path | None = None) -> Path | None:
    if not enabled:
        if helper_path is not None:
            raise RuntimeError("DOTNET_HELPER_REQUIRES_EXPLICIT_GATE")
        return None
    path = helper_path or Path(os.environ.get(DOTNET_HELPER_PATH_ENV, ""))
    if not path.is_absolute() or path.name.lower() != "brananativesha256helper.exe" or not path.is_file():
        raise RuntimeError("DOTNET_STORE_HELPER_PATH_INVALID")
    if "testhost" in path.name.lower() or "testhost" in str(path.parent).lower():
        raise RuntimeError("DOTNET_TESTHOST_NOT_ALLOWED")
    return path


def _helper_event_log_sink(log_path: Path, correlation_id: str):
    lock = threading.Lock()
    sequence = {"value": 0}
    log_path.parent.mkdir(parents=True, exist_ok=True)
    def sink(event: str):
        if not isinstance(event, str) or not event.startswith(("HELPER_", "FACTORY_", "CANDIDATE_", "ADAPTER_", "SIGNER_", "POLICY_", "PDF_SIGNER_")):
            return
        with lock:
            sequence["value"] += 1
            record = {"correlation_id": correlation_id, "sequence": sequence["value"], "monotonic": time.monotonic(), "event": event}
            with log_path.open("a", encoding="utf-8") as stream:
                stream.write(json.dumps(record, separators=(",", ":")) + "\n")
                stream.flush()
    return sink


def resolve_mtls_channel(*, endpoint: str | None = None, ca_cert: Path | None = None,
                         client_cert: Path | None = None, client_key: Path | None = None):
    values = {
        "endpoint": endpoint or os.environ.get(MTLS_ENDPOINT_ENV, ""),
        "ca_cert": Path(ca_cert or os.environ.get(MTLS_CA_ENV, "")),
        "client_cert": Path(client_cert or os.environ.get(MTLS_CERT_ENV, "")),
        "client_key": Path(client_key or os.environ.get(MTLS_KEY_ENV, "")),
    }
    if not values["endpoint"] or not str(values["endpoint"]).startswith("https://"):
        raise RuntimeError("MTLS_ENDPOINT_REQUIRED")
    for name in ("ca_cert", "client_cert", "client_key"):
        path = values[name]
        if not path.is_absolute() or not path.is_file():
            raise RuntimeError(f"MTLS_{name.upper()}_INVALID")
    return values


def build_runtime(cert_path: Path, key_path: Path, wpf_path: Path, *, enable_dotnet_store_helper: bool = False, dotnet_helper_path: Path | None = None, policy_der_path: Path | None = None, helper_event_log: Path | None = None, correlation_id: str | None = None, mtls_endpoint: str | None = None, mtls_ca_cert: Path | None = None, mtls_client_cert: Path | None = None, mtls_client_key: Path | None = None, test_only_ui=None, test_only_signer=None, test_only_lock=None, test_only_online_consumer=None, test_only_reservation_forwarder=None):
    candidate_selector = resolve_windows_user_candidate
    helper = resolve_dotnet_helper(enabled=enable_dotnet_store_helper, helper_path=dotnet_helper_path)
    test_only = test_only_ui is not None or test_only_signer is not None or test_only_lock is not None
    if test_only and (test_only_ui is None or test_only_signer is None or test_only_lock is None):
        raise RuntimeError("TEST_RUNTIME_INJECTION_INCOMPLETE")
    mtls = resolve_mtls_channel(endpoint=mtls_endpoint, ca_cert=mtls_ca_cert, client_cert=mtls_client_cert, client_key=mtls_client_key) if (enable_dotnet_store_helper or test_only) else None
    kwargs = {
        "cert_pem": cert_path.read_bytes(), "key_pem": key_path.read_bytes(),
        "candidate_selector": candidate_selector, "wpf_executable": str(wpf_path),
        "public_certificate_provider": Win32PublicCertificateProvider(stores=("CurrentUser\\My",)),
        "tls_config": TLSRuntimeConfig(host="localhost", port=8765), "production_mode": not test_only,
        "enable_real_signing": bool(enable_dotnet_store_helper or test_only),
        "require_online_authorization": bool(enable_dotnet_store_helper or test_only),
    }
    if test_only:
        kwargs.update({"ui": test_only_ui, "signer": test_only_signer, "lock": test_only_lock})
        if test_only_online_consumer is not None:
            kwargs["online_authorization_consumer"] = test_only_online_consumer
        if test_only_reservation_forwarder is not None:
            kwargs["reservation_challenge_forwarder"] = test_only_reservation_forwarder
    if mtls is not None:
        forwarder = ReservationChallengeForwarder(ReservationChallengeConfig(
                mtls["endpoint"] + "/signature-reservation-requests/bind-installation",
                str(mtls["ca_cert"]), str(mtls["client_cert"]), str(mtls["client_key"]),
            ))
        consumer = OnlineAuthorizationConsumer(OnlineAuthorizationConfig(
                mtls["endpoint"] + "/v1/signature-authorizations/consume",
                str(mtls["ca_cert"]), str(mtls["client_cert"]), str(mtls["client_key"]),
            ))
        kwargs.update({
            "reservation_challenge_forwarder": forwarder.forward,
            "online_authorization_consumer": consumer.consume,
            "enable_test_reservation_challenge": True,
        })
    # Explicit test doubles must win over auto-created transport clients; this
    # branch is reachable only through the non-CLI test-only injection gate.
    if test_only:
        if test_only_online_consumer is not None:
            kwargs["online_authorization_consumer"] = test_only_online_consumer
        if test_only_reservation_forwarder is not None:
            kwargs["reservation_challenge_forwarder"] = test_only_reservation_forwarder
    if helper is not None:
        kwargs.update({"dotnet_helper_executable": str(helper), "enable_dotnet_store_helper": True,
                       "policy_der_path": str(policy_der_path.resolve()) if policy_der_path else None,
                       "helper_event_sink": _helper_event_log_sink(helper_event_log or (Path(os.environ["LOCALAPPDATA"]) / "BranaCloude" / "logs" / "bridge-helper-events.jsonl"), correlation_id or uuid.uuid4().hex)})
    return create_secure_bridge_runtime(**kwargs)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Start the temporary Brana Cloude HTTPS approval bridge.")
    parser.add_argument("--tls-dir", type=Path)
    parser.add_argument("--wpf-executable", type=Path)
    parser.add_argument("--enable-dotnet-store-helper", action="store_true")
    parser.add_argument("--dotnet-helper-executable", type=Path)
    parser.add_argument("--policy-der", type=Path)
    parser.add_argument("--mtls-endpoint")
    parser.add_argument("--mtls-ca-cert", type=Path)
    parser.add_argument("--mtls-client-cert", type=Path)
    parser.add_argument("--mtls-client-key", type=Path)
    args = parser.parse_args(argv)
    enabled = args.enable_dotnet_store_helper or os.environ.get(DOTNET_STORE_HELPER_ENV) == "1"
    runtime = None
    try:
        cert, key, wpf = resolve_paths(tls_dir=args.tls_dir, wpf_executable=args.wpf_executable)
        ensure_port_free()
        print("PAIRING_WINDOW_INSTRUCTION=Approve pairing manually in the WPF window when shown.", flush=True)
        event_log = Path(os.environ.get("BRANA_HELPER_EVENT_LOG", str(Path(os.environ["LOCALAPPDATA"]) / "BranaCloude" / "logs" / "bridge-helper-events.jsonl")))
        correlation_id = uuid.uuid4().hex
        print(f"BRANA_HELPER_EVENT_LOG={event_log};correlation={correlation_id}", flush=True)
        runtime = build_runtime(cert, key, wpf, enable_dotnet_store_helper=enabled, dotnet_helper_path=args.dotnet_helper_executable, policy_der_path=args.policy_der, helper_event_log=event_log, correlation_id=correlation_id, mtls_endpoint=args.mtls_endpoint, mtls_ca_cert=args.mtls_ca_cert, mtls_client_cert=args.mtls_client_cert, mtls_client_key=args.mtls_client_key)
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
