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
GOOGLE_MAX_RETRIES = 1
GOOGLE_ID_TOKEN_CERTS_URL = "https://www.googleapis.com/oauth2/v3/certs"
GOOGLE_ID_TOKEN_ISSUERS = {"https://accounts.google.com", "accounts.google.com"}
TOKEN_OBSERVABILITY_VERSION = "r17a"  # active-worker reload verification


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


oauth_logger.info("calendar_oauth_observability_loaded version=%s", TOKEN_OBSERVABILITY_VERSION)


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


def create_oauth_state(user_id: int, clinica_id: int, ttl_seconds: int = 600) -> str:
    return secrets.token_urlsafe(32)


def oauth_state_digest(state: str) -> str:
    return __import__("hashlib").sha256(str(state or "").encode("utf-8")).hexdigest()


def _content_type(headers) -> str:
    try:
        if not headers:
            return "unknown"
        getter = getattr(headers, "get_content_type", None)
        if getter:
            return str(getter() or "unknown")
        value = headers.get("Content-Type", "unknown")
        return str(value).split(";", 1)[0].strip().lower() or "unknown"
    except Exception:
        return "unknown"


def _token_breadcrumb(marker: str, oauth_attempt_id=None, **fields) -> None:
    safe = [f"oauth_attempt_id={str(oauth_attempt_id or 'unknown')}"]
    for key, value in fields.items():
        if value is not None:
            safe.append(f"{key}={str(value).lower() if isinstance(value, bool) else value}")
    oauth_logger.info("%s %s", marker, " ".join(safe))


_JSON_SHAPE_FIELDS = (
    "access_token", "refresh_token", "id_token", "token_type", "expires_in", "scope",
    "error", "error_description", "keys", "issuer", "authorization_endpoint",
    "token_endpoint", "jwks_uri", "sub", "email", "email_verified", "name", "picture",
    "kind", "items", "next_page_token",
)


def _safe_url_target(url: str) -> dict:
    parts = urlsplit(str(url or ""))
    return {"scheme": parts.scheme, "host": parts.hostname or "", "path": parts.path or "/"}


def _classify_json_shape(data) -> str:
    if not isinstance(data, dict):
        return "unknown_json"
    keys = set(data)
    if "access_token" in keys:
        return "token_success"
    if "error" in keys or "error_description" in keys:
        return "token_error"
    if "keys" in keys:
        return "jwks"
    if {"issuer", "token_endpoint", "jwks_uri"} & keys and "authorization_endpoint" in keys:
        return "oidc_discovery"
    if "sub" in keys and ("email" in keys or "email_verified" in keys):
        return "userinfo"
    if "kind" in keys and ("items" in keys or "next_page_token" in keys):
        return "calendar_api"
    return "unknown_json"


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


def _read_google_response(req: Request, timeout: int = GOOGLE_HTTP_TIMEOUT_SECONDS, *, oauth_attempt_id=None, transport_metadata=None) -> str:
    for attempt in range(GOOGLE_MAX_RETRIES + 1):
        try:
            with urlopen(req, timeout=timeout) as resp:
                request_target = _safe_url_target(req.full_url)
                final_target = _safe_url_target(resp.geturl() if hasattr(resp, "geturl") else req.full_url)
                _token_breadcrumb("calendar_oauth_token_request_target", oauth_attempt_id,
                                  request_scheme=request_target["scheme"], request_host=request_target["host"],
                                  request_path=request_target["path"], request_method=req.get_method())
                raw_bytes = resp.read()
                try:
                    raw_bytes.decode("utf-8")
                    strict_utf8 = True
                    replacement_count = 0
                except UnicodeDecodeError:
                    strict_utf8 = False
                    replacement_count = raw_bytes.decode("utf-8", errors="replace").count("\ufffd")
                if transport_metadata is not None:
                    transport_metadata.update({
                        "transport_http_status": getattr(resp, "status", getattr(resp, "code", 200)),
                        "response_present": True,
                        "headers_present": bool(getattr(resp, "headers", None)),
                        "content_type": _content_type(getattr(resp, "headers", None)),
                        "content_encoding": str(getattr(resp, "headers", {}).get("Content-Encoding", "unknown")) if getattr(resp, "headers", None) else "unknown",
                        "declared_content_length": str(getattr(resp, "headers", {}).get("Content-Length", "unknown")) if getattr(resp, "headers", None) else "unknown",
                        "body_byte_length": len(raw_bytes), "body_empty": not bool(raw_bytes),
                        "decode_succeeded": True, "strict_utf8_decode_succeeded": strict_utf8,
                        "replacement_decode_required": not strict_utf8,
                        "replacement_character_count": replacement_count,
                        "charset_known": True,
                        "response_final_scheme": final_target["scheme"],
                        "response_final_host": final_target["host"],
                        "response_final_path": final_target["path"],
                        "redirect_occurred": final_target != request_target,
                    })
                return raw_bytes.decode("utf-8", errors="replace")
        except HTTPError as exc:
            if (int(exc.code) == 429 or int(exc.code) >= 500) and attempt < GOOGLE_MAX_RETRIES:
                continue
            _token_breadcrumb("calendar_oauth_token_http_error_caught", oauth_attempt_id,
                              exception_class=type(exc).__name__, http_status=int(exc.code),
                              response_present=True, response_headers_present=bool(exc.headers),
                              response_content_type=_content_type(exc.headers),
                              response_body_read_attempted=True)
            raise
        except (URLError, TimeoutError):
            if attempt < GOOGLE_MAX_RETRIES:
                continue
            raise


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
    timeout: int = GOOGLE_HTTP_TIMEOUT_SECONDS,
) -> dict:
    body = None
    req_headers = dict(headers or {})
    if payload is not None:
        body = json.dumps(payload).encode("utf-8")
        req_headers.setdefault("Content-Type", "application/json")
    req = Request(url, data=body, headers=req_headers, method=method.upper())
    try:
        raw = _read_google_response(req, timeout)
    except HTTPError as exc:
        detail = ""
        try:
            detail = exc.read().decode("utf-8", errors="replace")
        except Exception:
            detail = str(exc)
        raise GoogleCalendarError(f"Google API error ({exc.code}): {detail}", int(exc.code)) from exc
    except (URLError, TimeoutError) as exc:
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


def create_oauth_attempt_id() -> str:
    return secrets.token_urlsafe(18)


def _parse_token_error_body(raw: str) -> tuple[str | None, str, bool, bool]:
    if not str(raw or "").strip():
        return None, "", False, False
    try:
        data = json.loads(raw or "{}")
    except Exception:
        return None, "", False, False
    if not isinstance(data, dict):
        return None, "", True, False
    code = str(data.get("error") or "").strip()[:80] or None
    description = str(data.get("error_description") or "").strip()
    for sensitive in ("authorization", "access_token", "refresh_token", "id_token", "client_secret", "bearer"):
        description = description.replace(sensitive, "[redacted]")
    return code, description[:240], True, bool(code or description)


def _safe_json_parse(raw_bytes: bytes, text_value: str) -> tuple[dict, dict]:
    structural = {
        "strict_utf8_decode_succeeded": True,
        "replacement_decode_required": False,
        "replacement_character_count": 0,
        "utf8_bom_present": raw_bytes.startswith(b"\xef\xbb\xbf"),
        "utf16_bom_present": raw_bytes.startswith((b"\xff\xfe", b"\xfe\xff")),
        "utf32_bom_present": raw_bytes.startswith((b"\xff\xfe\x00\x00", b"\x00\x00\xfe\xff")),
        "nul_byte_present": b"\x00" in raw_bytes,
        "nul_byte_count": raw_bytes.count(b"\x00"),
        "leading_whitespace_present": bool(text_value[:1].isspace()),
        "trailing_whitespace_present": bool(text_value[-1:].isspace()),
        "json_starts_with_object": text_value.lstrip().startswith("{"),
        "json_starts_with_array": text_value.lstrip().startswith("["),
        "json_error_message": "", "json_error_position": "", "json_error_line": "", "json_error_column": "",
        "json_error_is_unexpected_bom": False, "json_error_is_extra_data": False,
        "json_error_is_expecting_value": False, "json_error_is_invalid_control_character": False,
    }
    try:
        raw_bytes.decode("utf-8")
    except UnicodeDecodeError:
        structural["strict_utf8_decode_succeeded"] = False
        structural["replacement_decode_required"] = True
        structural["replacement_character_count"] = text_value.count("\ufffd")
        structural["json_parsed"] = False
        return {}, structural
    try:
        value = json.loads(text_value)
        structural["json_parsed"] = True
        return value if isinstance(value, dict) else {}, structural
    except json.JSONDecodeError as exc:
        structural.update({"json_parsed": False, "json_error_message": exc.msg[:120], "json_error_position": exc.pos, "json_error_line": exc.lineno, "json_error_column": exc.colno})
        structural["json_error_is_unexpected_bom"] = "BOM" in exc.msg
        structural["json_error_is_extra_data"] = exc.msg == "Extra data"
        structural["json_error_is_expecting_value"] = "Expecting value" in exc.msg
        structural["json_error_is_invalid_control_character"] = "Invalid control character" in exc.msg
    except Exception:
        structural["json_parsed"] = False
    return {}, structural


def _request_google_calendar_token(*, code: str, client_id: str, client_secret: str,
                                   redirect_uri: str, oauth_attempt_id=None) -> tuple[dict, dict]:
    body = urlencode({
        "client_id": client_id, "client_secret": client_secret, "code": code,
        "grant_type": "authorization_code", "redirect_uri": redirect_uri,
    }).encode("utf-8")
    req = Request(GOOGLE_CALENDAR_TOKEN_URL, data=body,
                  headers={"Content-Type": "application/x-www-form-urlencoded"}, method="POST")
    target = _safe_url_target(req.full_url)
    _token_breadcrumb("calendar_oauth_token_request_target", oauth_attempt_id,
                      request_scheme=target["scheme"], request_host=target["host"],
                      request_path=target["path"], request_method=req.get_method())
    try:
        with urlopen(req, timeout=GOOGLE_HTTP_TIMEOUT_SECONDS) as resp:
            raw_bytes = resp.read()
            headers = getattr(resp, "headers", None)
            final = _safe_url_target(resp.geturl() if hasattr(resp, "geturl") else req.full_url)
            try:
                raw = raw_bytes.decode("utf-8")
                strict = True
            except UnicodeDecodeError:
                raw = raw_bytes.decode("utf-8", errors="replace")
                strict = False
            metadata = {
                "transport_http_status": getattr(resp, "status", getattr(resp, "code", 200)),
                "response_present": True, "headers_present": bool(headers),
                "content_type": _content_type(headers),
                "content_encoding": str(headers.get("Content-Encoding", "unknown")) if headers else "unknown",
                "declared_content_length": str(headers.get("Content-Length", "unknown")) if headers else "unknown",
                "body_byte_length": len(raw_bytes), "body_empty": not bool(raw_bytes),
                "strict_utf8_decode_succeeded": strict,
                "replacement_decode_required": not strict,
                "replacement_character_count": raw.count("\ufffd") if not strict else 0,
                "charset_known": True, "response_final_scheme": final["scheme"],
                "response_final_host": final["host"], "response_final_path": final["path"],
                "redirect_occurred": final != target,
            }
            data, parse_meta = _safe_json_parse(raw_bytes, raw)
            metadata.update(parse_meta)
            metadata["json_shape"] = _classify_json_shape(data)
            metadata["json_top_level_key_count"] = len(data) if isinstance(data, dict) else 0
            metadata.update({f"has_{key}": key in data for key in _JSON_SHAPE_FIELDS} if isinstance(data, dict) else {})
            return data if isinstance(data, dict) else {}, metadata
    except HTTPError:
        raise


def exchange_google_calendar_code(code: str, *, oauth_attempt_id: str | None = None) -> dict:
    code = str(code or "").strip()
    if not code:
        raise GoogleCalendarError("Código OAuth ausente.", 400)
    client_id, client_secret, redirect_uri = get_google_calendar_settings()
    if not client_id or not client_secret:
        raise GoogleCalendarError("Google OAuth não configurado (client id/secret).", 503)
    try:
        _token_breadcrumb("calendar_oauth_token_http_call_enter", oauth_attempt_id)
        data, transport_metadata = _request_google_calendar_token(
            code=code, client_id=client_id, client_secret=client_secret,
            redirect_uri=redirect_uri, oauth_attempt_id=oauth_attempt_id)
        _token_breadcrumb("calendar_oauth_token_http_response_received", oauth_attempt_id, **transport_metadata)
    except HTTPError as exc:
        detail = ""
        try:
            detail = exc.read().decode("utf-8", errors="replace")
        except Exception:
            detail = ""
        try:
            error_data = json.loads(detail or "{}")
            response_json_parsed = True
        except Exception:
            error_data = {}
            response_json_parsed = False
        if isinstance(error_data, dict):
            error_code = str(error_data.get("error") or "").strip()[:80]
            error_description = str(error_data.get("error_description") or "").strip()
        else:
            error_code = ""
            error_description = ""
        for sensitive in ("authorization", "access_token", "refresh_token", "id_token", "client_secret", "bearer"):
            error_description = error_description.replace(sensitive, "[redacted]")
        error = GoogleCalendarError(
            f"Falha ao trocar código OAuth (HTTP {int(exc.code)}).", int(exc.code),
            google_error_code=error_code or None,
            google_error_description_sanitized=error_description[:240],
            response_content_type=_content_type(exc.headers),
            response_json_parsed=response_json_parsed,
            google_error_fields_present=bool(error_code or error_description),
            response_present=True, response_headers_present=bool(exc.headers),
        )
        _emit_token_exchange_error(error, oauth_attempt_id)
        raise error from exc
    except URLError as exc:
        _token_breadcrumb("calendar_oauth_token_other_exception_caught", oauth_attempt_id,
                          exception_class=type(exc).__name__)
        error = GoogleCalendarError("Falha de rede na troca de código OAuth.", 503)
        _emit_token_exchange_error(error, oauth_attempt_id)
        raise error from exc
    except Exception as exc:
        _token_breadcrumb("calendar_oauth_token_other_exception_caught", oauth_attempt_id,
                          exception_class=type(exc).__name__)
        error = GoogleCalendarError("Falha inesperada na troca de código OAuth.", 500)
        _emit_token_exchange_error(error, oauth_attempt_id)
        raise error from exc

    response_json_parsed = bool(transport_metadata.get("json_parsed"))
    _token_breadcrumb("calendar_oauth_token_parse_diagnostics", oauth_attempt_id, **transport_metadata)
    if not isinstance(data, dict):
        data = {}
    if not data.get("access_token"):
        error_code = str(data.get("error") or "").strip()[:80] or None if isinstance(data, dict) else None
        error_description = str(data.get("error_description") or "").strip()[:240] if isinstance(data, dict) else ""
        fields_present = bool(error_code or error_description)
        error = GoogleCalendarError(
            "Google OAuth retornou resposta inválida sem access_token.", 400,
            google_error_code=error_code,
            google_error_description_sanitized=error_description,
            response_content_type=transport_metadata.get("content_type") or "unknown",
            response_json_parsed=response_json_parsed,
            google_error_fields_present=fields_present,
            response_present=True,
            response_headers_present=bool(transport_metadata.get("headers_present")),
        )
        _emit_token_exchange_error(error, oauth_attempt_id)
        raise error
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
        raw = _read_google_response(req)
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


def create_google_calendar_event(*, access_token: str, calendar_id: str, event_id: str, payload: dict) -> dict:
    """Create one event; callers may handle 409 as deterministic-ID recovery."""
    return _http_json(
        "POST",
        f"{GOOGLE_CALENDAR_API_BASE}/calendars/{quote(str(calendar_id or 'primary'), safe='')}/events",
        headers={"Authorization": f"Bearer {access_token}"},
        payload={**dict(payload or {}), "id": event_id},
    )


def update_google_calendar_event(*, access_token: str, calendar_id: str, event_id: str, payload: dict) -> dict:
    return _http_json(
        "PUT",
        f"{GOOGLE_CALENDAR_API_BASE}/calendars/{quote(str(calendar_id or 'primary'), safe='')}/events/{quote(event_id, safe='')}",
        headers={"Authorization": f"Bearer {access_token}"},
        payload={**dict(payload or {}), "id": event_id},
    )


def delete_google_calendar_event(*, access_token: str, calendar_id: str, event_id: str) -> dict:
    return _http_json(
        "DELETE",
        f"{GOOGLE_CALENDAR_API_BASE}/calendars/{quote(str(calendar_id or 'primary'), safe='')}/events/{quote(event_id, safe='')}",
        headers={"Authorization": f"Bearer {access_token}"},
    )


def token_expires_at_utc(expires_in_seconds: int | None) -> str:
    ttl = int(expires_in_seconds or 3600)
    if ttl < 60:
        ttl = 60
    dt = datetime.now(timezone.utc) + timedelta(seconds=ttl)
    return dt.isoformat()
