from __future__ import annotations

import os
import socket
import subprocess
import time
from contextlib import contextmanager
from pathlib import Path

import psycopg2


ROOT = Path(__file__).resolve().parents[2]
BACKEND = ROOT / "backend"
PYTHON = ROOT / ".venv" / "Scripts" / "python.exe"


def _free_port() -> int:
    sock = socket.socket()
    sock.bind(("127.0.0.1", 0))
    port = sock.getsockname()[1]
    sock.close()
    return port


@contextmanager
def disposable_postgres():
    port = _free_port()
    container = f"brana-schema-test-{port}"
    password = "testpass123"
    dbname = "brana_schema_test"
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


def run_schema_command(args: list[str], env: dict[str, str]) -> subprocess.CompletedProcess[str]:
    merged = os.environ.copy()
    merged.update(env)
    return subprocess.run(
        [str(PYTHON), "-m", "backend.scripts.apply_schema_baseline", *args],
        cwd=str(ROOT),
        env=merged,
        capture_output=True,
        text=True,
    )


def db_counts(dsn: str) -> dict[str, int]:
    conn = psycopg2.connect(dsn)
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT COUNT(*) FROM information_schema.schemata")
            schemas = cur.fetchone()[0]
            cur.execute("SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public'")
            tables = cur.fetchone()[0]
            versions = 0
            if _table_exists(conn, "brana_schema_versions"):
                cur.execute("SELECT COUNT(*) FROM public.brana_schema_versions")
                versions = cur.fetchone()[0]
            return {"schemas": schemas, "tables": tables, "versions": versions}
    finally:
        conn.close()


def execute_sql(dsn: str, sql: str) -> None:
    conn = psycopg2.connect(dsn)
    try:
        with conn.cursor() as cur:
            cur.execute(sql)
        conn.commit()
    finally:
        conn.close()


def _table_exists(conn, table: str) -> bool:
    with conn.cursor() as cur:
        cur.execute(
            "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name=%s)",
            (table,),
        )
        return bool(cur.fetchone()[0])
