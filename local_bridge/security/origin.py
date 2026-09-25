"""Pure origin, Host and CORS policy for the future bridge HTTP layer."""

from dataclasses import dataclass
from urllib.parse import urlsplit

ALLOWED_HOST = "localhost:8765"
ALLOWED_ORIGINS = frozenset({"https://localhost:5173", "https://192.168.3.41:5173"})
ALLOWED_METHODS = ("GET", "POST", "DELETE", "OPTIONS")
ALLOWED_HEADERS = (
    "Content-Type", "X-Brana-Bridge-Protocol", "X-Brana-Session",
    "X-Brana-Timestamp", "X-Brana-Request-Nonce", "X-Brana-Request-MAC",
    "X-Brana-Content-SHA256",
)
EXPOSED_HEADERS = ("Content-Disposition", "X-Brana-Bridge-Protocol", "X-Brana-Session-Expires")


class OriginPolicyError(ValueError):
    pass


def validate_host(host: str | None) -> str:
    if host != ALLOWED_HOST:
        raise OriginPolicyError("HOST_NOT_ALLOWED")
    return host


def validate_origin(origin: str | None) -> str:
    if origin is None or origin == "null" or origin not in ALLOWED_ORIGINS:
        raise OriginPolicyError("ORIGIN_NOT_ALLOWED")
    parsed = urlsplit(origin)
    if parsed.scheme != "https" or parsed.username or parsed.password or parsed.path or parsed.query or parsed.fragment:
        raise OriginPolicyError("ORIGIN_NOT_ALLOWED")
    return origin


@dataclass(frozen=True)
class CorsPolicy:
    origins: tuple[str, ...] = tuple(sorted(ALLOWED_ORIGINS))
    methods: tuple[str, ...] = ALLOWED_METHODS
    headers: tuple[str, ...] = ALLOWED_HEADERS
    exposed_headers: tuple[str, ...] = EXPOSED_HEADERS
    allow_credentials: bool = False


def cors_headers(origin: str | None) -> dict[str, str]:
    validate_origin(origin)
    return {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": ", ".join(ALLOWED_METHODS),
        "Access-Control-Allow-Headers": ", ".join(ALLOWED_HEADERS),
        "Access-Control-Expose-Headers": ", ".join(EXPOSED_HEADERS),
        "Access-Control-Allow-Credentials": "false",
        "Vary": "Origin",
    }
