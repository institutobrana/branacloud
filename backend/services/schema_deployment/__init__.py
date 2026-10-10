"""Keep explicit migrations importable without initializing a database engine.

The existing one-shot executor still resolves the same public exports on demand.
This does not change main.py startup policy or its automatic bootstrap.
"""
from importlib import import_module

_EXPORT_GROUPS = {
    "baseline": ("BASELINE_VERSION", "BASELINE_CHECKSUM", "EXECUTOR_VERSION", "baseline_steps", "apply_baseline"),
    "compatibility": ("apply_compatibilities",),
    "inspector": ("inspect_schema_state",),
    "plan": ("build_plan", "format_plan"),
    "seeds": ("apply_required_seeds",),
    "validation": ("validate_schema_state",),
    "versioning": ("ensure_version_table", "get_version_record", "lock_schema_deployment",
                   "mark_failed", "mark_running", "mark_applied"),
}
__all__ = [name for names in _EXPORT_GROUPS.values() for name in names]


def __getattr__(name):
    for module, names in _EXPORT_GROUPS.items():
        if name in names:
            value = getattr(import_module(f"{__name__}.{module}"), name)
            globals()[name] = value
            return value
    raise AttributeError(f"module {__name__!r} has no attribute {name!r}")
