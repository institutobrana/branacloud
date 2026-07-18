from __future__ import annotations

import getpass
import os
import re
from dataclasses import dataclass


EMAIL_PATTERN = re.compile(r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$")


@dataclass(frozen=True)
class TenantProvisioningInput:
    clinic_name: str
    clinic_email: str
    unit_name: str
    provider_name: str
    provider_code: str
    admin_name: str
    admin_email: str


def _clean(value: str | None) -> str:
    return " ".join(str(value or "").split()).strip()


def _require(value: str | None, label: str) -> str:
    cleaned = _clean(value)
    if not cleaned:
        raise SystemExit(f"{label} obrigatorio ausente.")
    return cleaned


def _require_email(value: str | None, label: str) -> str:
    email = _require(value, label).lower()
    if not EMAIL_PATTERN.match(email):
        raise SystemExit(f"{label} invalido.")
    return email


def load_common_tenant_provisioning_input() -> TenantProvisioningInput:
    clinic_name = _require(os.getenv("BRANA_INITIAL_CLINIC_NAME"), "BRANA_INITIAL_CLINIC_NAME")
    clinic_email = _require_email(
        os.getenv("BRANA_INITIAL_CLINIC_EMAIL") or os.getenv("BRANA_INITIAL_ADMIN_EMAIL"),
        "BRANA_INITIAL_CLINIC_EMAIL",
    )
    unit_name = _require(os.getenv("BRANA_INITIAL_UNIT_NAME"), "BRANA_INITIAL_UNIT_NAME")
    provider_name = _require(os.getenv("BRANA_INITIAL_PROVIDER_NAME"), "BRANA_INITIAL_PROVIDER_NAME")
    provider_code = _require(os.getenv("BRANA_INITIAL_PROVIDER_CODE"), "BRANA_INITIAL_PROVIDER_CODE")
    admin_name = _require(os.getenv("BRANA_INITIAL_ADMIN_NAME"), "BRANA_INITIAL_ADMIN_NAME")
    admin_email = _require_email(os.getenv("BRANA_INITIAL_ADMIN_EMAIL"), "BRANA_INITIAL_ADMIN_EMAIL")
    return TenantProvisioningInput(
        clinic_name=clinic_name,
        clinic_email=clinic_email,
        unit_name=unit_name,
        provider_name=provider_name,
        provider_code=provider_code,
        admin_name=admin_name,
        admin_email=admin_email,
    )


def load_apply_password() -> str:
    env_password = str(os.getenv("BRANA_INITIAL_ADMIN_PASSWORD", "")).strip()
    if env_password:
        return env_password
    if str(os.getenv("BRANA_INITIAL_TENANT_PROMPT_PASSWORD", "")).strip().lower() not in {"1", "true", "yes", "sim"}:
        raise SystemExit("BRANA_INITIAL_ADMIN_PASSWORD obrigatorio.")
    if not os.isatty(0):
        raise SystemExit("Terminal interativo indisponivel para solicitar BRANA_INITIAL_ADMIN_PASSWORD.")
    password = getpass.getpass("Senha inicial do administrador: ")
    if not password:
        raise SystemExit("Senha inicial do administrador obrigatoria.")
    confirm = getpass.getpass("Confirme a senha inicial: ")
    if password != confirm:
        raise SystemExit("Confirmacao da senha inicial nao confere.")
    return password


def load_apply_tenant_password() -> str:
    admin_password = load_apply_password()
    if len(admin_password) < 6:
        raise SystemExit("BRANA_INITIAL_ADMIN_PASSWORD deve ter ao menos 6 caracteres.")
    return admin_password


def load_tenant_provisioning_input() -> TenantProvisioningInput:
    return load_common_tenant_provisioning_input()
