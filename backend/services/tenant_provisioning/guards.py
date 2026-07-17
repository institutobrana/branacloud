from __future__ import annotations

import os
from sqlalchemy import text

from services.runtime_profile_service import resolve_runtime_policy
from services.schema_deployment.versioning import get_version_record


PROVISIONING_LOCK_KEY = 7304202602
PROVISIONING_ACK_VALUE = "BRANA_INITIAL_TENANT_PROVISIONING_ACKNOWLEDGED"
SCHEMA_BASELINE_VERSION = "brana_schema_2026_07_17"


def ensure_ack() -> None:
    if str(os.getenv("BRANA_INITIAL_TENANT_ACK", "")).strip() != PROVISIONING_ACK_VALUE:
        raise SystemExit("BRANA_INITIAL_TENANT_ACK invalido ou ausente.")


def ensure_baseline_applied(conn) -> None:
    record = get_version_record(conn, SCHEMA_BASELINE_VERSION)
    if not record or str(record.get("status") or "").lower() != "applied":
        raise SystemExit(f"Baseline de schema nao aplicada: {SCHEMA_BASELINE_VERSION}.")


def lock_tenant_provisioning(conn) -> bool:
    return bool(conn.execute(text("SELECT pg_try_advisory_lock(:key)"), {"key": PROVISIONING_LOCK_KEY}).scalar())


def ensure_allowed_profile() -> None:
    policy = resolve_runtime_policy()
    if policy.profile not in {"local", "dev", "development", "schema", "homologation"}:
        raise SystemExit(f"Perfil nao permitido: {policy.profile}")

