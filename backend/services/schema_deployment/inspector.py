from __future__ import annotations

from sqlalchemy import inspect, text
from sqlalchemy.engine import Engine

from models.model_registry import import_all_models
from database import Base


def _table_names_from_metadata() -> list[str]:
    import_all_models()
    return sorted(Base.metadata.tables.keys())


def inspect_schema_state(engine: Engine) -> dict:
    inspector = inspect(engine)
    existing = sorted(inspector.get_table_names())
    expected = _table_names_from_metadata()
    missing = [name for name in expected if name not in existing]
    unexpected = [name for name in existing if name not in expected and not name.startswith("spatial_ref_sys")]
    empty = len(existing) == 0
    return {
        "expected_tables": expected,
        "existing_tables": existing,
        "missing_tables": missing,
        "unexpected_tables": unexpected,
        "is_empty": empty,
    }
