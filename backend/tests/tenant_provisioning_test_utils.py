from __future__ import annotations

import os
import subprocess
import time
from contextlib import contextmanager
from pathlib import Path

import psycopg2

from backend.tests.schema_deployment_test_utils import run_schema_command


ROOT = Path(__file__).resolve().parents[2]
PYTHON = ROOT / ".venv" / "Scripts" / "python.exe"


def _free_port() -> int:
    import socket

    sock = socket.socket()
    sock.bind(("127.0.0.1", 0))
    port = sock.getsockname()[1]
    sock.close()
    return port


@contextmanager
def disposable_postgres():
    port = _free_port()
    container = f"brana-tenant-test-{port}"
    password = "testpass123"
    dbname = "brana_tenant_test"
    user = "brana_test"
    image = "postgres:16-alpine"
    subprocess.run(
        [
            "docker",
            "run",
            "-d",
            "--rm",
            "--name",
            container,
            "-e",
            f"POSTGRES_PASSWORD={password}",
            "-e",
            f"POSTGRES_USER={user}",
            "-e",
            f"POSTGRES_DB={dbname}",
            "-p",
            f"{port}:5432",
            image,
        ],
        check=True,
        capture_output=True,
        text=True,
    )
    try:
        deadline = time.time() + 60
        dsn = f"host=127.0.0.1 port={port} dbname={dbname} user={user} password={password}"
        while time.time() < deadline:
            try:
                conn = psycopg2.connect(dsn)
                conn.close()
                break
            except Exception:
                time.sleep(0.5)
        yield {
            "port": port,
            "container": container,
            "password": password,
            "dbname": dbname,
            "user": user,
            "dsn": dsn,
            "image": image,
        }
    finally:
        subprocess.run(["docker", "rm", "-f", container], check=False, capture_output=True, text=True)


def run_tenant_command(args: list[str], env: dict[str, str]) -> subprocess.CompletedProcess[str]:
    merged = os.environ.copy()
    merged.update(env)
    return subprocess.run(
        [str(PYTHON), "-m", "backend.scripts.provision_initial_tenant", *args],
        cwd=str(ROOT),
        env=merged,
        capture_output=True,
        text=True,
        stdin=subprocess.DEVNULL,
    )


def provisioning_env(pg: dict[str, str], **overrides: str) -> dict[str, str]:
    env = {
        "DATABASE_URL": f"postgresql://{pg['user']}:{pg['password']}@127.0.0.1:{pg['port']}/{pg['dbname']}",
        "BRANA_RUNTIME_PROFILE": "homologation",
        "BRANA_INITIAL_TENANT_ALLOW_LOCALHOST": "1",
        "BRANA_INITIAL_CLINIC_NAME": "Clínica Teste",
        "BRANA_INITIAL_CLINIC_EMAIL": "clinic@example.com",
        "BRANA_INITIAL_UNIT_NAME": "Unidade Principal",
        "BRANA_INITIAL_PROVIDER_NAME": "Dra. Teste",
        "BRANA_INITIAL_PROVIDER_CODE": "1001",
        "BRANA_INITIAL_ADMIN_NAME": "Admin Teste",
        "BRANA_INITIAL_ADMIN_EMAIL": "admin@example.com",
        "BRANA_INITIAL_ADMIN_PASSWORD": "senha123",
        "BRANA_INITIAL_TENANT_ACK": "BRANA_INITIAL_TENANT_PROVISIONING_ACKNOWLEDGED",
    }
    env.update(overrides)
    return env


def prepare_schema(pg: dict[str, str]) -> subprocess.CompletedProcess[str]:
    env = {
        "DATABASE_URL": f"postgresql://{pg['user']}:{pg['password']}@127.0.0.1:{pg['port']}/{pg['dbname']}",
        "BRANA_RUNTIME_PROFILE": "homologation",
        "BRANA_SCHEMA_DEPLOYMENT_ALLOW_LOCALHOST": "1",
        "BRANA_SCHEMA_DEPLOYMENT_ACK": "BRANA_SCHEMA_DEPLOYMENT_ACKNOWLEDGED",
    }
    return run_schema_command(["--apply"], env)


def row_count(dsn: str, table: str) -> int:
    conn = psycopg2.connect(dsn)
    try:
        with conn.cursor() as cur:
            cur.execute(f'SELECT COUNT(*) FROM public."{table}"')
            return int(cur.fetchone()[0])
    finally:
        conn.close()
