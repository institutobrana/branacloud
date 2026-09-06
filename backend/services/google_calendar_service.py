import base64
import json
import os
import secrets
from datetime import datetime, timedelta, timezone
from urllib.error import HTTPError, URLError
from urllib.parse import quote, urlencode, urlsplit
from urllib.request import Request, urlopen
from services.google_oauth_observability import oauth_logger
from jose import JWTError, jwt

try:
    from cryptography.fernet import Fernet, InvalidToken
except ImportError:  # pragma: no cover - dependency is declared in requirements
    Fernet = None
    InvalidToken = Exception


GOOGLE_CALENDAR_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_CALENDAR_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_CALENDAR_API_BASE = "https://www.googleapis.com/calendar/v3"
GOOGLE_CALENDAR_SCOPES = (
    "openid",
    "email",
    "profile",
    "https://www.googleapis.com/auth/calendar.events",
    "https://www.googleapis.com/auth/calendar.readonly",
)
GOOGLE_HTTP_TIMEOUT_SECONDS = 15
GOOGLE_ID_TOKEN_CERTS_URL = "https://www.googleapis.com/oauth2/v3/certs"
GOOGLE_ID_TOKEN_ISSUERS = {"https://accounts.google.com", "accounts.google.com"}


class GoogleCalendarError(Exception):
    def __init__(self, message: str, status_code: int = 400, *, google_error_code=None,
                 google_error_description_sanitized=None, response_content_type=None,
                 response_json_parsed=None, google_error_fields_present=None,
                 response_present=False, response_headers_present=False):
        super().__init__(message)
        self.message = message
        self.status_code = int(status_code)
        self.google_error_code = google_error_code
        self.google_error_description_sanitized = google_error_description_sanitized
        self.response_content_type = response_content_type
        self.response_json_parsed = response_json_parsed
        self.google_error_fields_present = google_error_fields_present
        self.response_present = response_present
        self.response_headers_present = response_headers_present
        self.detailed_marker_emitted = False


def _token_cipher() -> Fernet:
    key = str(os.getenv("GOOGLE_TOKEN_ENCRYPTION_KEY", "")).strip()
    if not key or Fernet is None:
        raise GoogleCalendarError("Criptografia dos tokens Google não configurada.", 503)
    try:
        return Fernet(key.encode("ascii"))
    except Exception as exc:
        raise GoogleCalendarError("Chave de criptografia Google inválida.", 503) from exc


def encrypt_google_token(token: str) -> str:
    value = str(token or "")
    if not value:
        return ""
    return _token_cipher().encrypt(value.encode("utf-8")).decode("ascii")


def decrypt_google_token(value: str) -> str:
    raw = str(value or "")
    if not raw:
        return ""
    try:
        return _token_cipher().decrypt(raw.encode("ascii")).decode("utf-8")
    except (InvalidToken, UnicodeError, ValueError) as exc:
        raise GoogleCalendarError("Credencial Google protegida inválida.", 503) from exc


def oauth_state_digest(state: str) -> str:
    return __import__("hashlib").sha256(str(state or "").encode("utf-8")).hexdigest()


def _safe_url_target(url: str) -> dict:
    parts = urlsplit(str(url or ""))
    return {"scheme": parts.scheme, "host": parts.hostname or "", "path": parts.path or "/"}


def _token_breadcrumb(marker: str, oauth_attempt_id=None, **fields) -> None:
    safe = [f"oauth_attempt_id={str(oauth_attempt_id or 'unknown')}" ]
    for key, value in fields.items():
        if value is not None:
            safe.append(f"{key}={str(value).lower() if isinstance(value, bool) else value}")
    oauth_logger.info("%s %s", marker, " ".join(safe))


def _emit_token_exchange_error(exc: GoogleCalendarError, oauth_attempt_id=None) -> None:
    if getattr(exc, "detailed_marker_emitted", False):
        return
    _token_breadcrumb(
        "calendar_oauth_token_exchange_error", oauth_attempt_id,
        http_status=exc.status_code,
        error=exc.google_error_code or "unknown",
        error_description=exc.google_error_description_sanitized or "",
        response_content_type=exc.response_content_type or "unknown",
        response_json_parsed=exc.response_json_parsed if exc.response_json_parsed is not None else False,
        google_error_fields_present=exc.google_error_fields_present if exc.google_error_fields_present is not None else False,
        exception_class=type(exc).__name__,
    )
    exc.detailed_marker_emitted = True


def verify_google_id_token(id_token: str | None) -> dict:
    token = str(id_token or "").strip()
    if not token:
        error = GoogleCalendarError("ID token Google ausente.", 400)
        error.safe_category = "missing_id_token"
        raise error
    client_id, _, _ = get_google_calendar_settings()
    if not client_id:
        raise GoogleCalendarError("Google OAuth não configurado (GOOGLE_CLIENT_ID).", 503)

    def fail(category: str, exc=None):
        error = GoogleCalendarError("ID token Google inválido.", 400)
        error.safe_category = category
        if exc is not None:
            error.__cause__ = exc
        raise error from exc

    try:
        try:
            header = jwt.get_unverified_header(token)
        except Exception as exc:
            fail("invalid_header", exc)
        kid = str(header.get("kid") or "").strip()
        if not kid:
            fail("missing_kid")
        if header.get("alg") != "RS256":
            fail("signature_validation")
        try:
            with urlopen(GOOGLE_ID_TOKEN_CERTS_URL, timeout=GOOGLE_HTTP_TIMEOUT_SECONDS) as response:
                certs = json.loads(response.read().decode("utf-8"))
        except Exception as exc:
            fail("jwks_fetch", exc)
        key = next((item for item in (certs.get("keys") or []) if str(item.get("kid") or "") == kid), None)
        if not key:
            fail("kid_not_found")
        try:
            claims = jwt.decode(token, key, algorithms=["RS256"], audience=client_id,
                                options={"require_sub": True, "require_exp": True, "require_aud": True, "require_iss": True})
        except Exception as exc:
            name = type(exc).__name__.lower()
            if "audience" in name:
                fail("audience_validation", exc)
            if "issuer" in name:
                fail("issuer_validation", exc)
            if "expired" in name or "expiration" in name:
                fail("expiration_validation", exc)
            fail("signature_validation", exc)
        if str(claims.get("iss") or "").strip() not in GOOGLE_ID_TOKEN_ISSUERS:
            fail("issuer_validation")
        if not str(claims.get("sub") or "").strip():
            fail("missing_sub")
        return claims
    except GoogleCalendarError:
        raise
    except Exception as exc:
        fail("unknown_validation_error", exc)


def get_google_calendar_settings() -> tuple[str, str, str]:
    client_id = str(os.getenv("GOOGLE_CLIENT_ID", "")).strip()
    client_secret = str(os.getenv("GOOGLE_CLIENT_SECRET", "")).strip()
    redirect_uri = str(
        os.getenv("GOOGLE_CALENDAR_REDIRECT_URI", "http://127.0.0.1:8000/auth/google/calendar/callback")
    ).strip()
    return client_id, client_secret, redirect_uri


def build_google_calendar_auth_url(state: str) -> str:
    client_id, _, redirect_uri = get_google_calendar_settings()
    if not client_id:
        raise GoogleCalendarError("Google OAuth não configurado (GOOGLE_CLIENT_ID).", 503)
    params = {
        "client_id": client_id,
        "redirect_uri": redirect_uri,
        "response_type": "code",
        "scope": " ".join(GOOGLE_CALENDAR_SCOPES),
        "access_type": "offline",
        "prompt": "consent select_account",
        "include_granted_scopes": "true",
        "state": str(state or "").strip(),
    }
    return f"{GOOGLE_CALENDAR_AUTH_URL}?{urlencode(params)}"


def _http_json(
    method: str,
    url: str,
    *,
    headers: dict[str, str] | None = None,
    payload: dict | None = None,
    timeout: int = 25,
) -> dict:
    body = None
    req_headers = dict(headers or {})
    if payload is not None:
        body = json.dumps(payload).encode("utf-8")
        req_headers.setdefault("Content-Type", "application/json")
    req = Request(url, data=body, headers=req_headers, method=method.upper())
    try:
        with urlopen(req, timeout=timeout) as resp:
            raw = resp.read().decode("utf-8", errors="replace")
    except HTTPError as exc:
        detail = ""
        try:
            detail = exc.read().decode("utf-8", errors="replace")
        except Exception:
            detail = str(exc)
        raise GoogleCalendarError(f"Google API error ({exc.code}): {detail}", int(exc.code)) from exc
    except URLError as exc:
        raise GoogleCalendarError(f"Falha de rede com Google API: {exc}", 503) from exc
    except Exception as exc:
        raise GoogleCalendarError(f"Falha inesperada na Google API: {exc}", 500) from exc

    if not raw.strip():
        return {}
    try:
        data = json.loads(raw)
    except Exception:
        data = {}
    if isinstance(data, dict):
        return data
    return {}


def exchange_google_calendar_code(code: str, *, oauth_attempt_id: str | None = None) -> dict:
    code = str(code or "").strip()
    if not code:
        raise GoogleCalendarError("Código OAuth ausente.", 400)
    client_id, client_secret, redirect_uri = get_google_calendar_settings()
    if not client_id or not client_secret:
        raise GoogleCalendarError("Google OAuth não configurado (client id/secret).", 503)
    body = urlencode(
        {
            "client_id": client_id,
            "client_secret": client_secret,
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": redirect_uri,
        }
    ).encode("utf-8")
    req = Request(
        GOOGLE_CALENDAR_TOKEN_URL,
        data=body,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        method="POST",
    )
    try:
        with urlopen(req, timeout=25) as resp:
            raw = resp.read().decode("utf-8", errors="replace")
    except HTTPError as exc:
        detail = ""
        try:
            detail = exc.read().decode("utf-8", errors="replace")
        except Exception:
            detail = str(exc)
        raise GoogleCalendarError(f"Falha ao trocar código OAuth ({exc.code}): {detail}", int(exc.code)) from exc
    except URLError as exc:
        raise GoogleCalendarError(f"Falha de rede na troca de código OAuth: {exc}", 503) from exc
    except Exception as exc:
        raise GoogleCalendarError(f"Falha inesperada na troca de código OAuth: {exc}", 500) from exc

    data = json.loads(raw or "{}")
    if not isinstance(data, dict) or not data.get("access_token"):
        raise GoogleCalendarError("Google OAuth retornou resposta inválida sem access_token.", 400)
    return data


def refresh_google_calendar_access_token(refresh_token: str) -> dict:
    refresh_token = str(refresh_token or "").strip()
    if not refresh_token:
        raise GoogleCalendarError("Refresh token ausente.", 400)
    client_id, client_secret, _ = get_google_calendar_settings()
    if not client_id or not client_secret:
        raise GoogleCalendarError("Google OAuth não configurado (client id/secret).", 503)
    body = urlencode(
        {
            "client_id": client_id,
            "client_secret": client_secret,
            "refresh_token": refresh_token,
            "grant_type": "refresh_token",
        }
    ).encode("utf-8")
    req = Request(
        GOOGLE_CALENDAR_TOKEN_URL,
        data=body,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        method="POST",
    )
    try:
        with urlopen(req, timeout=25) as resp:
            raw = resp.read().decode("utf-8", errors="replace")
    except HTTPError as exc:
        detail = ""
        try:
            detail = exc.read().decode("utf-8", errors="replace")
        except Exception:
            detail = str(exc)
        raise GoogleCalendarError(f"Falha ao renovar token Google ({exc.code}): {detail}", int(exc.code)) from exc
    except URLError as exc:
        raise GoogleCalendarError(f"Falha de rede na renovação do token Google: {exc}", 503) from exc
    except Exception as exc:
        raise GoogleCalendarError(f"Falha inesperada na renovação do token Google: {exc}", 500) from exc

    data = json.loads(raw or "{}")
    if not isinstance(data, dict) or not data.get("access_token"):
        raise GoogleCalendarError("Resposta inválida na renovação do token Google.", 400)
    return data


def decode_id_token_email(id_token: str | None) -> str:
    token = str(id_token or "").strip()
    if not token or "." not in token:
        return ""
    parts = token.split(".")
    if len(parts) < 2:
        return ""
    payload_b64 = parts[1]
    padding = "=" * (-len(payload_b64) % 4)
    try:
        payload_raw = base64.urlsafe_b64decode(payload_b64 + padding)
        payload = json.loads(payload_raw.decode("utf-8", errors="replace"))
    except Exception:
        return ""
    email = str(payload.get("email") or "").strip()
    return email.lower()


def fetch_google_calendar_primary(access_token: str) -> dict:
    token = str(access_token or "").strip()
    if not token:
        raise GoogleCalendarError("Access token Google ausente.", 400)
    return _http_json(
        "GET",
        f"{GOOGLE_CALENDAR_API_BASE}/users/me/calendarList/primary",
        headers={"Authorization": f"Bearer {token}"},
    )


def upsert_google_calendar_event(
    *,
    access_token: str,
    calendar_id: str,
    event_id: str,
    payload: dict,
) -> dict:
    token = str(access_token or "").strip()
    cal = str(calendar_id or "primary").strip() or "primary"
    eid = str(event_id or "").strip()
    if not token:
        raise GoogleCalendarError("Access token Google ausente.", 400)
    if not eid:
        raise GoogleCalendarError("event_id inválido para sincronização.", 400)
    encoded_cal = quote(cal, safe="")
    encoded_eid = quote(eid, safe="")
    url_insert = f"{GOOGLE_CALENDAR_API_BASE}/calendars/{encoded_cal}/events"
    body = dict(payload or {})
    body["id"] = eid
    try:
        return _http_json(
            "POST",
            url_insert,
            headers={"Authorization": f"Bearer {token}"},
            payload=body,
        )
    except GoogleCalendarError as exc:
        if int(exc.status_code) != 409:
            raise
    return _http_json(
        "PUT",
        f"{GOOGLE_CALENDAR_API_BASE}/calendars/{encoded_cal}/events/{encoded_eid}",
        headers={"Authorization": f"Bearer {token}"},
        payload=body,
    )


def token_expires_at_utc(expires_in_seconds: int | None) -> str:
    ttl = int(expires_in_seconds or 3600)
    if ttl < 60:
        ttl = 60
    dt = datetime.now(timezone.utc) + timedelta(seconds=ttl)
    return dt.isoformat()

