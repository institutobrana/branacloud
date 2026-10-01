"""Closed-by-default mTLS service entrypoint for the future bridge channel.

This module is intentionally not imported by ``backend.main``.  Every secret,
certificate path, registry path and database URL is mandatory at startup.
"""
from __future__ import annotations

import hashlib
import json
import os
import subprocess
import ssl
from dataclasses import dataclass
from pathlib import Path

from fastapi import APIRouter, Depends, FastAPI
from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker


def _read_config_acl(config_path: Path) -> None:
    """Reject broad Windows ACLs by SID, independent of localization."""
    broad_sids = ("*S-1-5-32-545", "*S-1-1-0", "*S-1-5-11")
    try:
        verified = subprocess.run(
            ["icacls.exe", str(config_path), "/verify"],
            capture_output=True, text=True, timeout=5, check=True,
        )
        if verified.returncode != 0:
            raise RuntimeError("MTLS_CONFIG_ACL_UNAVAILABLE")
        for sid in broad_sids:
            result = subprocess.run(
                ["icacls.exe", str(config_path), "/findsid", sid],
                capture_output=True, text=True, timeout=5, check=False,
            )
            if result.returncode not in (0, 1):
                raise RuntimeError("MTLS_CONFIG_ACL_UNAVAILABLE")
            if any(":(" in line for line in (result.stdout + result.stderr).splitlines()):
                raise RuntimeError("MTLS_CONFIG_ACL_TOO_BROAD")
    except RuntimeError:
        raise
    except (OSError, subprocess.SubprocessError, UnicodeError) as exc:
        raise RuntimeError("MTLS_CONFIG_ACL_UNAVAILABLE") from exc

@dataclass(frozen=True)
class MtlsServiceConfig:
    database_url: str
    ca_cert: Path
    server_cert: Path
    server_key: Path
    registry_json: Path | None
    bind: str
    config_file: Path

    @classmethod
    def from_env(cls, env=None) -> "MtlsServiceConfig":
        env = os.environ if env is None else env
        config_name = str(env.get("BRANA_MTLS_CONFIG_FILE") or r"C:\ProgramData\BranaCloude\config\mtls-service.json").strip()
        config_path = Path(config_name).expanduser().resolve()
        if not config_path.is_file():
            raise RuntimeError("MTLS_CONFIG_FILE_UNAVAILABLE")
        try:
            raw = json.loads(config_path.read_text(encoding="utf-8"))
        except (OSError, ValueError) as exc:
            raise RuntimeError("MTLS_CONFIG_FILE_INVALID") from exc
        if not isinstance(raw, dict):
            raise RuntimeError("MTLS_CONFIG_FILE_INVALID")
        required = {name: raw.get(name) for name in (
            "database_url", "ca_cert", "server_cert", "server_key", "bind"
        )}
        missing = [name for name, value in required.items() if not str(value or "").strip()]
        if missing:
            raise RuntimeError("MTLS_CONFIG_FIELDS_MISSING:" + ",".join(missing))
        paths = {name: Path(value).expanduser().resolve() for name, value in required.items() if name != "database_url" and name != "bind"}
        for name, path in paths.items():
            if not path.is_file():
                raise RuntimeError(f"MTLS_FILE_UNAVAILABLE:{name}")
        if os.name == "nt":
            _read_config_acl(config_path)
        return cls(required["database_url"].strip(), paths["ca_cert"], paths["server_cert"], paths["server_key"], None, required["bind"].strip(), config_path)


def load_registry(path: Path) -> InstallationIdentityRegistry:
    try:
        records = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, ValueError) as exc:
        raise RuntimeError("MTLS_REGISTRY_INVALID") from exc
    if not isinstance(records, list) or not records:
        raise RuntimeError("MTLS_REGISTRY_EMPTY")
    registry = InstallationIdentityRegistry()
    for item in records:
        if not isinstance(item, dict) or not item.get("installation_id") or not item.get("certificate_der_sha256"):
            raise RuntimeError("MTLS_REGISTRY_RECORD_INVALID")
        record = registry.register(item["installation_id"], item["certificate_der_sha256"].lower())
        if item.get("status") == "REVOKED":
            registry.revoke(record.installation_id)
        elif item.get("status") != "ACTIVE":
            raise RuntimeError("MTLS_REGISTRY_STATUS_INVALID")
    if not any(value.status == "ACTIVE" for value in registry._records.values()):
        raise RuntimeError("MTLS_REGISTRY_NO_ACTIVE_INSTALLATION")
    return registry


def create_mtls_app(config: MtlsServiceConfig):
    from services.installation_identity_registry import PersistentInstallationIdentityRegistry
    # Import relationship targets before FastAPI dependency construction.  The
    # child process does not inherit the parent test's model-import order.
    from models.prestador_odonto import PrestadorOdonto  # noqa: F401
    from models.unidade_atendimento import UnidadeAtendimento  # noqa: F401
    from models.financeiro import Lancamento  # noqa: F401
    from models.convenio_odonto import ConvenioOdonto  # noqa: F401
    from models.procedimento_generico import ProcedimentoGenerico  # noqa: F401
    from models.material import Material  # noqa: F401
    from routes.signature_reservation_challenge_routes import create_signature_reservation_challenge_router
    from routes.signature_authorization_isolated_routes import tls_installation_dependency
    from services.signature_authorization_service import consume_authorization
    for path in (config.ca_cert, config.server_cert, config.server_key):
        if not path.is_file():
            raise RuntimeError("MTLS_TLS_MATERIAL_UNAVAILABLE")
    try:
        engine = create_engine(config.database_url, pool_pre_ping=True)
        with engine.connect():
            pass
    except Exception as exc:
        raise RuntimeError("MTLS_DATABASE_UNAVAILABLE") from exc
    required_schema = {
        "bridge_installations": {
            "installation_id", "certificate_der_sha256", "status", "generation",
            "valid_from", "valid_to", "registered_at", "revoked_at", "rotated_at",
        },
        "bridge_installation_events": {
            "installation_id", "event_type", "generation", "occurred_at", "detail_code",
        },
        "signature_reservation_requests": {
            "request_id", "challenge_hash", "status", "operation_id", "prepared_pdf_sha256",
            "certificado_der_sha256", "certificate_source", "field_name", "policy_oid",
            "expires_at",
        },
        "signature_authorizations": {
            "authorization_id", "status", "installation_id", "operation_id",
            "prepared_pdf_sha256", "certificado_der_sha256", "certificate_source",
            "field_name", "policy_oid", "expires_at",
        },
    }
    inspector = inspect(engine)
    for table, required_columns in required_schema.items():
        if not inspector.has_table(table):
            engine.dispose()
            raise RuntimeError("MTLS_SCHEMA_UNAVAILABLE:" + table)
        actual_columns = {column["name"] for column in inspector.get_columns(table)}
        if not required_columns.issubset(actual_columns):
            engine.dispose()
            raise RuntimeError("MTLS_SCHEMA_INCOMPATIBLE:" + table)
    SessionLocal = sessionmaker(bind=engine, expire_on_commit=False)
    registry = PersistentInstallationIdentityRegistry(SessionLocal)
    if not registry.has_active():
        engine.dispose()
        raise RuntimeError("MTLS_ACTIVE_INSTALLATION_REQUIRED")
    app = FastAPI(title="Brana Cloude isolated mTLS service")

    def get_db():
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.include_router(create_signature_reservation_challenge_router(
        installation_dependency=tls_installation_dependency(registry),
        db_dependency=get_db,
    ))

    # Only the mTLS-authenticated consume route is exposed here.  The user/JWT
    # reserve and issue routes remain in the separate authenticated backend API.
    router = APIRouter(prefix="/v1/signature-authorizations")
    trusted_installation = tls_installation_dependency(registry)

    @router.post("/consume")
    def consume(payload: dict, db=Depends(get_db), installation=Depends(trusted_installation)):
        required = {"authorization_id", "operation_id", "prepared_pdf_sha256", "certificado_der_sha256", "field_name", "policy_oid", "certificate_source"}
        if set(payload) != required:
            from fastapi import HTTPException
            raise HTTPException(status_code=422, detail="CONSUME_PAYLOAD_INVALID")
        row = consume_authorization(db, installation=installation, **payload)
        return {"status": row.status, "authorization_id": row.authorization_id}

    app.include_router(router)
    return app


def build_tls_config(config: MtlsServiceConfig):
    from anycorn.config import Config
    tls = Config()
    tls.bind = [config.bind]
    tls.ca_certs = str(config.ca_cert)
    tls.certfile = str(config.server_cert)
    tls.keyfile = str(config.server_key)
    tls.cert_reqs = ssl.CERT_REQUIRED
    tls.verify_mode = ssl.CERT_REQUIRED
    return tls


async def serve_from_env():
    from anycorn import serve
    config = MtlsServiceConfig.from_env()
    app = create_mtls_app(config)
    await serve(app, build_tls_config(config))


if __name__ == "__main__":
    import asyncio
    asyncio.run(serve_from_env())
