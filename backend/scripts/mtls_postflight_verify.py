"""Read-only postflight verification for the installed Brana Cloude mTLS material."""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import subprocess
import sys
from pathlib import Path

import psycopg2
from cryptography import x509
from cryptography.hazmat.primitives import serialization


def fail(code: str) -> int:
    print(code)
    return 1


def required_file(label: str, path: Path) -> None:
    if not path.is_file():
        raise RuntimeError(f"MISSING:{label}")


def restricted_acl(label: str, path: Path) -> None:
    if not acl_is_restricted(path):
        raise RuntimeError(f"ACL:{label}")


def cert(path: Path) -> x509.Certificate:
    return x509.load_pem_x509_certificate(path.read_bytes())


def labeled_cert(label: str, path: Path) -> x509.Certificate:
    try:
        return cert(path)
    except Exception as exc:
        raise RuntimeError(f"FORMAT:{label}") from exc


def public_key(path: Path):
    return serialization.load_pem_private_key(path.read_bytes(), password=None).public_key()


def same_key(certificate: x509.Certificate, key_path: Path) -> bool:
    return certificate.public_key().public_numbers() == public_key(key_path).public_numbers()


def acl_is_restricted(path: Path) -> bool:
    result = subprocess.run(
        ["icacls.exe", str(path)], capture_output=True, text=True, timeout=10
    )
    if result.returncode != 0:
        raise RuntimeError("ACL_READ_FAILED")
    text = result.stdout.lower()
    broad = ("builtin\\users", "authenticated users", "everyone", "usuários")
    return not any(name in text for name in broad)


def service_is_stopped_disabled() -> bool:
    query = subprocess.run(["sc.exe", "query", "BranaCloudeMtls"], capture_output=True, text=True, timeout=10)
    qc = subprocess.run(["sc.exe", "qc", "BranaCloudeMtls"], capture_output=True, text=True, timeout=10)
    if query.returncode != 0 or qc.returncode != 0:
        return False
    return "STOPPED" in query.stdout.upper() and "DISABLED" in qc.stdout.upper()


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--material-root", default=r"C:\ProgramData\BranaCloude\mtls\provisioned")
    ap.add_argument("--config-file", default=r"C:\ProgramData\BranaCloude\mtls\config\mtls-service.json")
    ap.add_argument("--database-url-file", default=r"C:\ProgramData\BranaCloude\mtls\config\database-url.secret")
    ap.add_argument("--installation-id", default="brana-bridge-local-1")
    ap.add_argument("--signature-cert", default=None)
    args = ap.parse_args()
    root = Path(args.material_root)
    try:
        recovery_path = root / "provision-recovery.json"
        required_file("RECOVERY_MARKER", recovery_path)
        recovery = json.loads(recovery_path.read_text(encoding="utf-8"))
        if recovery.get("phase") != "SQL_COMMITTED":
            return fail("MTLS_POSTFLIGHT_RECOVERY_STATE_INVALID")

        paths = {
            "ca": root / "ca" / "ca.crt",
            "server_cert": root / "server" / "server.crt",
            "server_key": root / "server" / "server.key",
            "client_cert": root / "client" / "client.crt",
            "client_key": root / "client" / "client.key",
            "config": Path(args.config_file),
        }
        for label, path in (("CA_CERT", paths["ca"]), ("SERVER_CERT", paths["server_cert"]),
                            ("SERVER_KEY", paths["server_key"]), ("CLIENT_CERT", paths["client_cert"]),
                            ("CLIENT_KEY", paths["client_key"]), ("CONFIG_JSON", paths["config"])):
            required_file(label, path)
        for label, path in (("CA_CERT", root / "ca"), ("SERVER_CERT", root / "server"),
                            ("CLIENT_CERT", root / "client"), ("CONFIG_JSON", Path(args.config_file).parent)):
            restricted_acl(label, path)
        restricted_acl("RECOVERY_MARKER", recovery_path)
        try:
            json.loads(paths["config"].read_text(encoding="utf-8"))
        except (OSError, UnicodeError, json.JSONDecodeError):
            return fail("MTLS_POSTFLIGHT_FILE_INVALID:CONFIG_JSON")

        ca = labeled_cert("CA_CERT", paths["ca"])
        server = labeled_cert("SERVER_CERT", paths["server_cert"])
        client = labeled_cert("CLIENT_CERT", paths["client_cert"])
        if not same_key(server, paths["server_key"]):
            return fail("MTLS_POSTFLIGHT_SERVER_KEY_MISMATCH")
        if not same_key(client, paths["client_key"]):
            return fail("MTLS_POSTFLIGHT_CLIENT_KEY_MISMATCH")
        if server.issuer != ca.subject or client.issuer != ca.subject:
            return fail("MTLS_POSTFLIGHT_CA_CHAIN_INVALID")
        san = server.extensions.get_extension_for_class(x509.SubjectAlternativeName).value
        if "127.0.0.1" not in [str(x) for x in san.get_values_for_type(x509.IPAddress)]:
            return fail("MTLS_POSTFLIGHT_SERVER_SAN_INVALID")
        if args.signature_cert and client.public_bytes(serialization.Encoding.DER) == cert(Path(args.signature_cert)).public_bytes(serialization.Encoding.DER):
            return fail("MTLS_POSTFLIGHT_SIGNATURE_CERT_REUSED")

        url = (Path(args.database_url_file).read_text(encoding="utf-8")).strip()
        if url.startswith("\ufeff"):
            return fail("MTLS_POSTFLIGHT_DATABASE_URL_INVALID")
        with psycopg2.connect(url) as connection:
            with connection.cursor() as cursor:
                cursor.execute("select installation_id, certificate_der_sha256, status, generation from bridge_installations where installation_id = %s", (args.installation_id,))
                rows = cursor.fetchall()
                if len(rows) != 1:
                    return fail("MTLS_POSTFLIGHT_INSTALLATION_COUNT_INVALID")
                installation_id, fingerprint, status, generation = rows[0]
                expected = hashlib.sha256(client.public_bytes(serialization.Encoding.DER)).hexdigest()
                if installation_id != args.installation_id or fingerprint != expected or status != "ACTIVE" or generation != 1:
                    return fail("MTLS_POSTFLIGHT_INSTALLATION_INVALID")
                cursor.execute("select count(*) from bridge_installation_events where installation_id = %s and event_type = %s and detail_code = %s", (args.installation_id, "REGISTERED", "ADMIN_PROVISION"))
                if cursor.fetchone()[0] != 1:
                    return fail("MTLS_POSTFLIGHT_EVENT_INVALID")
        if not service_is_stopped_disabled():
            return fail("MTLS_POSTFLIGHT_SERVICE_STATE_INVALID")
    except RuntimeError as error:
        category, _, label = str(error).partition(":")
        if category == "MISSING" and label in {"RECOVERY_MARKER", "CA_CERT", "SERVER_CERT", "SERVER_KEY", "CLIENT_CERT", "CLIENT_KEY", "CONFIG_JSON"}:
            return fail(f"MTLS_POSTFLIGHT_FILE_MISSING:{label}")
        if category == "ACL" and label in {"RECOVERY_MARKER", "CA_CERT", "SERVER_CERT", "SERVER_KEY", "CLIENT_CERT", "CLIENT_KEY", "CONFIG_JSON"}:
            return fail(f"MTLS_POSTFLIGHT_ACL_INVALID:{label}")
        if category == "FORMAT" and label in {"RECOVERY_MARKER", "CA_CERT", "SERVER_CERT", "SERVER_KEY", "CLIENT_CERT", "CLIENT_KEY", "CONFIG_JSON"}:
            return fail(f"MTLS_POSTFLIGHT_FILE_INVALID:{label}")
        return fail("MTLS_POSTFLIGHT_FILE_INVALID:CONFIG_JSON")
    except (OSError, ValueError, KeyError, json.JSONDecodeError):
        return fail("MTLS_POSTFLIGHT_FILE_INVALID:RECOVERY_MARKER")
    except psycopg2.Error:
        return fail("MTLS_POSTFLIGHT_DATABASE_UNAVAILABLE")
    except Exception:
        return fail("MTLS_POSTFLIGHT_FAILED")
    print("MTLS_POSTFLIGHT=PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
