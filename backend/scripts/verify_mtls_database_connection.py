"""Read-only verification of the protected mTLS database URL file."""
from __future__ import annotations

import argparse
import sys
from pathlib import Path
from urllib.parse import urlsplit

import psycopg2


def fail(code: str) -> int:
    print(code)
    return 1


def main() -> int:
    parser = argparse.ArgumentParser(add_help=True)
    parser.add_argument("database_url_file")
    args = parser.parse_args()
    try:
        value = Path(args.database_url_file).read_text(encoding="utf-8")
    except PermissionError:
        return fail("SERVICE_DB_CONNECTION_FILE_INACCESSIBLE")
    except (OSError, UnicodeError):
        return fail("SERVICE_DB_CONNECTION_FILE_INVALID")
    if value.startswith("\ufeff"):
        return fail("SERVICE_DB_CONNECTION_BOM")
    value = value.strip()
    try:
        parsed = urlsplit(value)
        if (
            parsed.scheme not in {"postgres", "postgresql"}
            or parsed.hostname != "127.0.0.1"
            or parsed.port != 5432
            or parsed.path.strip("/") != "brana_saas"
            or parsed.username != "brana_mtls_service"
            or not parsed.password
        ):
            return fail("SERVICE_DB_CONNECTION_URL_MALFORMED")
        connection = psycopg2.connect(value)
        try:
            with connection.cursor() as cursor:
                cursor.execute("select current_user, current_database(), inet_server_addr(), inet_server_port()")
                user, database, address, port = cursor.fetchone()
        finally:
            connection.close()
    except psycopg2.OperationalError as error:
        code = error.pgcode or ""
        diagnostic = str(error).lower()
        if code == "28P01" or "password authentication failed" in diagnostic:
            return fail("SERVICE_DB_CONNECTION_AUTH_REJECTED")
        if code == "28000" or "role" in diagnostic and "does not exist" in diagnostic:
            return fail("SERVICE_DB_CONNECTION_ROLE_MISSING")
        if code == "3D000" or "database" in diagnostic and "does not exist" in diagnostic:
            return fail("SERVICE_DB_CONNECTION_DATABASE_MISSING")
        if any(marker in diagnostic for marker in ("connection refused", "could not connect", "timeout", "timed out")):
            return fail("SERVICE_DB_CONNECTION_SERVER_UNAVAILABLE")
        return fail("UNKNOWN_CONNECTION_FAILURE")
    except psycopg2.Error:
        return fail("SERVICE_DB_CONNECTION_FAILED")
    except ValueError:
        return fail("SERVICE_DB_CONNECTION_URL_MALFORMED")
    if user != "brana_mtls_service":
        return fail("SERVICE_DB_CONNECTION_USER_MISMATCH")
    if database != "brana_saas":
        return fail("SERVICE_DB_CONNECTION_DATABASE_MISMATCH")
    if str(address) != "127.0.0.1":
        return fail("SERVICE_DB_CONNECTION_ADDRESS_MISMATCH")
    if port != 5432:
        return fail("SERVICE_DB_CONNECTION_PORT_MISMATCH")
    print(f"current_user={user}")
    print(f"current_database={database}")
    print(f"inet_server_addr={address}")
    print(f"inet_server_port={port}")
    print("SERVICE_DB_CONNECTION=PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
