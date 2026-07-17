from __future__ import annotations

from sqlalchemy import text

from database import Base
from models.model_registry import import_all_models

BASELINE_VERSION = "brana_schema_2026_07_17"
BASELINE_CHECKSUM = "sha256:baseline-2026-07-17"
EXECUTOR_VERSION = "1"


def baseline_steps() -> list[str]:
    return [
        "registrar baseline",
        "criar schema estrutural via metadata",
        "aplicar compatibilidades aditivas",
        "aplicar seeds fundamentais",
        "validar resultado",
    ]


def apply_baseline(conn) -> dict:
    import_all_models()
    Base.metadata.create_all(bind=conn)
    return {"created_tables": sorted(Base.metadata.tables.keys())}
