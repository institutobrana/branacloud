from __future__ import annotations

import argparse
import os
import sys
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from database import engine
from services.runtime_profile_service import resolve_runtime_policy
from services.schema_deployment import (
    BASELINE_CHECKSUM,
    BASELINE_VERSION,
    EXECUTOR_VERSION,
    apply_baseline,
    apply_compatibilities,
    build_plan,
    ensure_version_table,
    get_version_record,
    format_plan,
    lock_schema_deployment,
    mark_applied,
    mark_failed,
    mark_running,
    validate_schema_state,
)
from services.schema_deployment.seeds import apply_required_seeds

ACK_VALUE = "BRANA_SCHEMA_DEPLOYMENT_ACKNOWLEDGED"


def _require_ack():
    if str(os.getenv("BRANA_SCHEMA_DEPLOYMENT_ACK", "")).strip() != ACK_VALUE:
        raise SystemExit("BRANA_SCHEMA_DEPLOYMENT_ACK invalido ou ausente.")


def _require_localhost_ack():
    db_url = str(os.getenv("DATABASE_URL", "")).strip().lower()
    if any(marker in db_url for marker in ("localhost", "127.0.0.1", "::1")):
        if str(os.getenv("BRANA_SCHEMA_DEPLOYMENT_ALLOW_LOCALHOST", "")).strip().lower() not in {"1", "true", "yes", "sim"}:
            raise SystemExit("Execucao em localhost exige BRANA_SCHEMA_DEPLOYMENT_ALLOW_LOCALHOST.")


def cmd_plan():
    plan = build_plan(engine)
    print(format_plan(plan))


def cmd_validate():
    result = validate_schema_state(engine)
    print(result)
    if not result["ok"]:
        raise SystemExit(2)


def cmd_apply():
    policy = resolve_runtime_policy()
    if policy.profile not in {"local", "dev", "development", "schema", "homologation"}:
        raise SystemExit(f"Perfil nao permitido: {policy.profile}")
    _require_ack()
    _require_localhost_ack()
    with engine.begin() as conn:
        if not lock_schema_deployment(conn):
            raise SystemExit("Execucao concorrente bloqueada.")
        ensure_version_table(conn)
        if str(os.getenv("BRANA_SCHEMA_DEPLOYMENT_TEST_SLEEP", "")).strip().isdigit():
            time_to_sleep = int(str(os.getenv("BRANA_SCHEMA_DEPLOYMENT_TEST_SLEEP", "0")).strip())
            if time_to_sleep > 0:
                import time
                time.sleep(time_to_sleep)
        state = build_plan(engine)["state"]
        if not state["is_empty"] and state["unexpected_tables"]:
            raise SystemExit("Banco nao vazio e estado desconhecido.")
        version_record = get_version_record(conn, BASELINE_VERSION)
        if version_record and str(version_record.get("status") or "").lower() == "applied":
            raise SystemExit(f"Baseline ja aplicada: {BASELINE_VERSION}")
        mark_running(conn, BASELINE_VERSION, BASELINE_CHECKSUM, "baseline inicial one-shot", EXECUTOR_VERSION)
        try:
            apply_baseline(conn)
            apply_compatibilities(conn)
            apply_required_seeds(conn)
            validation = validate_schema_state(conn)
            if not validation["ok"]:
                raise RuntimeError(f"Validacao falhou: {validation['missing']}")
            mark_applied(conn, BASELINE_VERSION)
        except Exception:
            mark_failed(conn, BASELINE_VERSION)
            raise


def main():
    parser = argparse.ArgumentParser()
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--plan", action="store_true")
    group.add_argument("--apply", action="store_true")
    group.add_argument("--validate", action="store_true")
    args = parser.parse_args()
    if args.plan:
        cmd_plan()
    elif args.apply:
        cmd_apply()
    else:
        cmd_validate()


if __name__ == "__main__":
    main()
