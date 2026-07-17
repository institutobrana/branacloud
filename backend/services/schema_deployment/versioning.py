from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import text


LOCK_KEY = 7304202601


def lock_schema_deployment(conn):
    return bool(conn.execute(text("SELECT pg_try_advisory_lock(:key)"), {"key": LOCK_KEY}).scalar())


def ensure_version_table(conn):
    conn.execute(
        text(
            """
            CREATE TABLE IF NOT EXISTS brana_schema_versions (
                id SERIAL PRIMARY KEY,
                version VARCHAR(80) NOT NULL,
                checksum VARCHAR(128) NOT NULL,
                status VARCHAR(20) NOT NULL DEFAULT 'running',
                description TEXT,
                executor_version VARCHAR(80),
                started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                finished_at TIMESTAMPTZ,
                applied_at TIMESTAMPTZ
            )
            """
        )
    )
    conn.execute(text("CREATE UNIQUE INDEX IF NOT EXISTS uq_brana_schema_versions_version ON brana_schema_versions(version)"))


def mark_running(conn, version: str, checksum: str, description: str, executor_version: str):
    conn.execute(
        text(
            """
            INSERT INTO brana_schema_versions (version, checksum, status, description, executor_version, started_at)
            VALUES (:version, :checksum, 'running', :description, :executor_version, :started_at)
            """
        ),
        {
            "version": version,
            "checksum": checksum,
            "description": description,
            "executor_version": executor_version,
            "started_at": datetime.now(timezone.utc),
        },
    )


def get_version_record(conn, version: str):
    return conn.execute(
        text(
            """
            SELECT version, status, checksum, started_at, finished_at, applied_at
              FROM brana_schema_versions
             WHERE version = :version
             ORDER BY id DESC
             LIMIT 1
            """
        ),
        {"version": version},
    ).mappings().first()


def mark_applied(conn, version: str):
    conn.execute(
        text(
            """
            UPDATE brana_schema_versions
               SET status='applied',
                   applied_at=NOW(),
                   finished_at=NOW()
             WHERE version=:version
            """
        ),
        {"version": version},
    )


def mark_failed(conn, version: str):
    conn.execute(
        text(
            """
            UPDATE brana_schema_versions
               SET status='failed',
                   finished_at=NOW()
             WHERE version=:version
            """
        ),
        {"version": version},
    )
