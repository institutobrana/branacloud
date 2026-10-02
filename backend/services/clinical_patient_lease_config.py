import os


def _positive_seconds(name: str, default: int) -> int:
    raw = os.getenv(name, str(default)).strip()
    try:
        value = int(raw)
    except ValueError as exc:
        raise RuntimeError(f"{name} must be an integer") from exc
    if value <= 0:
        raise RuntimeError(f"{name} must be positive")
    return value


CLINICAL_LEASE_DURATION_SECONDS = _positive_seconds(
    "CLINICAL_LEASE_DURATION_SECONDS", 90
)
