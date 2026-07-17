from __future__ import annotations

import argparse
import os
import sys
import time
from pathlib import Path

from sqlalchemy.orm import Session

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from models.model_registry import import_all_models

import_all_models()

from database import engine
from services.runtime_profile_service import resolve_runtime_policy
from services.tenant_provisioning import (
    build_plan,
    ensure_ack,
    ensure_baseline_applied,
    format_plan,
    load_tenant_provisioning_input,
    lock_tenant_provisioning,
    apply_tenant_provisioning,
    validate_tenant_state,
)


def _require_allowed_profile():
    policy = resolve_runtime_policy()
    if policy.profile not in {"local", "dev", "development", "schema", "homologation"}:
        raise SystemExit(f"Perfil nao permitido: {policy.profile}")


def _require_localhost_ack():
    db_url = str(os.getenv("DATABASE_URL", "")).strip().lower()
    if any(marker in db_url for marker in ("localhost", "127.0.0.1", "::1")):
        if str(os.getenv("BRANA_INITIAL_TENANT_ALLOW_LOCALHOST", "")).strip().lower() not in {"1", "true", "yes", "sim"}:
            raise SystemExit("Execucao em localhost exige BRANA_INITIAL_TENANT_ALLOW_LOCALHOST.")


def cmd_plan():
    spec = load_tenant_provisioning_input()
    with engine.begin() as conn:
        session = Session(bind=conn)
        try:
            result = build_plan(session, spec)
            print(format_plan(result))
        finally:
            session.close()


def cmd_validate():
    spec = load_tenant_provisioning_input()
    with engine.begin() as conn:
        ensure_baseline_applied(conn)
        session = Session(bind=conn)
        try:
            result = validate_tenant_state(session, spec)
            print(result)
            if not result["ok"]:
                raise SystemExit(2)
        finally:
            session.close()


def cmd_apply():
    _require_allowed_profile()
    ensure_ack()
    _require_localhost_ack()
    spec = load_tenant_provisioning_input()
    with engine.begin() as conn:
        if not lock_tenant_provisioning(conn):
            raise SystemExit("Execucao concorrente bloqueada.")
        sleep_seconds = float(os.getenv("BRANA_INITIAL_TENANT_TEST_SLEEP_SECONDS", "0") or 0)
        if sleep_seconds > 0:
            time.sleep(sleep_seconds)
        ensure_baseline_applied(conn)
        session = Session(bind=conn)
        try:
            plan = build_plan(session, spec)
            if plan["blockers"]:
                raise SystemExit("Estado atual indica tenant ja provisionado ou conflito de dados.")
            result = apply_tenant_provisioning(session, spec)
            validation = validate_tenant_state(session, spec)
            if not validation["ok"]:
                raise RuntimeError(f"Validacao falhou: {validation}")
            print({"ok": True, "result": result, "validation": validation})
        finally:
            session.close()


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
