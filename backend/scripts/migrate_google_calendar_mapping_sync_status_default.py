"""Add the database default for Google Calendar mapping sync status.

This script is intentionally explicit and conservative: it changes only the
column default, never existing rows, constraints, indexes, or table shape.
"""

from __future__ import annotations

import os

from sqlalchemy import create_engine, inspect, text


SCHEMA = "public"
TABLE = "google_calendar_event_mapping"
COLUMN = "sync_status"
EXPECTED_DEFAULT = "'synced'::character varying"


def _normalise_default(value: str | None) -> str | None:
    if value is None:
        return None
    return value.replace("::character varying", "").replace("::text", "").strip()


def apply_sync_status_default(*, dry_run: bool = False) -> str:
    database_url = os.environ.get("DATABASE_URL")
    if not database_url:
        raise RuntimeError("DATABASE_URL is required")

    engine = create_engine(database_url)
    with engine.begin() as connection:
        inspector = inspect(connection)
        if not inspector.has_table(TABLE, schema=SCHEMA):
            raise RuntimeError(f"missing table: {SCHEMA}.{TABLE}")

        columns = {
            column["name"]: column
            for column in inspector.get_columns(TABLE, schema=SCHEMA)
        }
        if COLUMN not in columns:
            raise RuntimeError(f"missing column: {SCHEMA}.{TABLE}.{COLUMN}")

        column = columns[COLUMN]
        if column["nullable"] is not False:
            raise RuntimeError(f"{COLUMN} must remain NOT NULL")

        current_default = _normalise_default(column.get("default"))
        expected_default = _normalise_default(EXPECTED_DEFAULT)
        if current_default == expected_default:
            return "NOOP: sync_status already defaults to 'synced'"
        if current_default is not None:
            raise RuntimeError(
                f"unexpected existing default for {COLUMN}: {current_default}"
            )
        if dry_run:
            return "DRY-RUN: would set sync_status default to 'synced'"

        connection.execute(
            text(
                f"ALTER TABLE {SCHEMA}.{TABLE} "
                f"ALTER COLUMN {COLUMN} SET DEFAULT 'synced'"
            )
        )
        return "APPLIED: sync_status default set to 'synced'"


def rollback_sync_status_default(*, dry_run: bool = False) -> str:
    """Plan/remove only the server default; existing rows are untouched."""
    if dry_run:
        return "DRY-RUN: would drop sync_status default"
    raise RuntimeError("rollback requires explicit operational invocation")


if __name__ == "__main__":
    print(apply_sync_status_default(dry_run=True))
