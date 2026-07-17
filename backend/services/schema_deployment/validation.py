from __future__ import annotations

from sqlalchemy import inspect

from database import Base
from models.model_registry import import_all_models


def validate_schema_state(conn_or_engine) -> dict:
    import_all_models()
    inspector = inspect(conn_or_engine)
    existing = set(inspector.get_table_names())
    expected = set(Base.metadata.tables.keys())
    missing = sorted(expected - existing)
    return {
        "ok": not missing,
        "missing": missing,
        "table_count": len(existing),
    }
