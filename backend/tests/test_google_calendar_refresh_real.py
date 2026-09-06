import json
import os
import unittest
from datetime import datetime, timedelta
from io import BytesIO
from types import SimpleNamespace
from urllib.error import HTTPError, URLError
from unittest.mock import patch

from cryptography.fernet import Fernet

os.environ.setdefault("GOOGLE_CLIENT_ID", "r9b-client")
os.environ.setdefault("GOOGLE_CLIENT_SECRET", "r9b-secret")
os.environ.setdefault("GOOGLE_TOKEN_ENCRYPTION_KEY", Fernet.generate_key().decode("ascii"))

from routes.agenda_legado_routes import _google_calendar_ensure_access_token
from services.google_calendar_service import decrypt_google_token, encrypt_google_token, GoogleCalendarError


class _DB:
    def __init__(self):
        self.commits = 0

    def add(self, _obj):
        pass

    def commit(self):
        self.commits += 1

    def refresh(self, _obj):
        pass


class _HTTPResponse:
    def __init__(self, payload):
        self.payload = json.dumps(payload).encode("utf-8")

    def read(self):
        return self.payload

    def __enter__(self):
        return self

    def __exit__(self, *_args):
        return False


class GoogleCalendarRefreshRealTests(unittest.TestCase):
    def _user(self, *, expires, refresh="old-refresh", access="old-access"):
        prefs = {
            "sentinel": "keep",
            "google_calendar_sync": {
                "connected": True,
                "access_token_enc": encrypt_google_token(access),
                "refresh_token_enc": encrypt_google_token(refresh),
                "expires_at": expires,
            },
        }
        return SimpleNamespace(preferencias_usuario_json=json.dumps(prefs)), prefs

    def _raw(self, user):
        return json.loads(user.preferencias_usuario_json)

    def test_valid_access_token_does_not_refresh(self):
        user, _ = self._user(expires=(datetime.utcnow() + timedelta(hours=1)).isoformat())
        db = _DB()
        with patch("services.google_calendar_service.urlopen", side_effect=AssertionError("refresh não esperado")):
            token, _cfg = _google_calendar_ensure_access_token(user, db)
        self.assertEqual(token, "old-access")
        self.assertEqual(db.commits, 0)

    def test_expired_token_refreshes_through_real_service_and_encrypts_access(self):
        user, _ = self._user(expires=(datetime.utcnow() - timedelta(minutes=1)).isoformat())
        db = _DB()
        calls = []
        def fake_urlopen(req, timeout):
            calls.append((req, timeout))
            return _HTTPResponse({"access_token": "new-access", "expires_in": 120})
        with patch("services.google_calendar_service.urlopen", side_effect=fake_urlopen):
            token, _cfg = _google_calendar_ensure_access_token(user, db)
        self.assertEqual(token, "new-access")
        self.assertEqual(len(calls), 1)
        self.assertEqual(calls[0][1], 15)
        cfg = self._raw(user)["google_calendar_sync"]
        self.assertEqual(decrypt_google_token(cfg["access_token_enc"]), "new-access")
        self.assertEqual(decrypt_google_token(cfg["refresh_token_enc"]), "old-refresh")
        self.assertNotIn("new-access", user.preferencias_usuario_json)
        self.assertEqual(self._raw(user)["sentinel"], "keep")

    def test_refresh_rotation_replaces_both_tokens(self):
        user, _ = self._user(expires=(datetime.utcnow() - timedelta(minutes=1)).isoformat())
        with patch("services.google_calendar_service.urlopen", return_value=_HTTPResponse({"access_token": "rot-access", "refresh_token": "rot-refresh", "expires_in": 3600})):
            _google_calendar_ensure_access_token(user, _DB())
        cfg = self._raw(user)["google_calendar_sync"]
        self.assertEqual(decrypt_google_token(cfg["access_token_enc"]), "rot-access")
        self.assertEqual(decrypt_google_token(cfg["refresh_token_enc"]), "rot-refresh")
        self.assertNotIn("rot-access", user.preferencias_usuario_json)
        self.assertNotIn("rot-refresh", user.preferencias_usuario_json)

    def test_refresh_without_rotation_preserves_previous_refresh(self):
        user, _ = self._user(expires=(datetime.utcnow() - timedelta(minutes=1)).isoformat())
        with patch("services.google_calendar_service.urlopen", return_value=_HTTPResponse({"access_token": "new-access", "expires_in": 3600})):
            _google_calendar_ensure_access_token(user, _DB())
        cfg = self._raw(user)["google_calendar_sync"]
        self.assertEqual(decrypt_google_token(cfg["refresh_token_enc"]), "old-refresh")
        self.assertEqual(self._raw(user)["sentinel"], "keep")

    def test_refresh_retries_timeout_once_through_real_chain(self):
        user, _ = self._user(expires=(datetime.utcnow() - timedelta(minutes=1)).isoformat())
        calls = []
        def fake_urlopen(req, timeout):
            calls.append(timeout)
            if len(calls) == 1:
                raise URLError("temporary timeout")
            return _HTTPResponse({"access_token": "after-retry", "expires_in": 3600})
        with patch("services.google_calendar_service.urlopen", side_effect=fake_urlopen):
            token, _cfg = _google_calendar_ensure_access_token(user, _DB())
        self.assertEqual(token, "after-retry")
        self.assertEqual(calls, [15, 15])

    def test_non_retryable_400_preserves_previous_credential_data(self):
        user, original = self._user(expires=(datetime.utcnow() - timedelta(minutes=1)).isoformat())
        before = self._raw(user)["google_calendar_sync"]
        err = HTTPError("https://google.test", 400, "invalid_grant", {}, BytesIO(b'{"error":"invalid_grant"}'))
        with patch("services.google_calendar_service.urlopen", side_effect=err):
            with self.assertRaises(Exception):
                _google_calendar_ensure_access_token(user, _DB())
        after = self._raw(user)["google_calendar_sync"]
        self.assertEqual(decrypt_google_token(after["refresh_token_enc"]), "old-refresh")
        self.assertEqual(self._raw(user)["sentinel"], original["sentinel"])


if __name__ == "__main__":
    unittest.main()
