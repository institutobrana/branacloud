import os
import unittest
from unittest.mock import patch
from urllib.error import HTTPError
from cryptography.fernet import Fernet

os.environ.setdefault("JWT_SECRET_KEY", "test-google-calendar-callback")
os.environ.setdefault("GOOGLE_TOKEN_ENCRYPTION_KEY", Fernet.generate_key().decode("ascii"))

from routes.auth_routes import google_calendar_callback
from services.google_calendar_service import refresh_google_calendar_access_token, GoogleCalendarError


class GoogleCallbackRefreshTests(unittest.TestCase):
    def test_callback_without_state_is_rejected_without_external_call(self):
        response = google_calendar_callback(code="code", state=None, db=None)
        self.assertIn("error", response.body.decode("utf-8"))

    def test_callback_invalid_state_is_rejected(self):
        response = google_calendar_callback(code="code", state="invalid", db=None)
        self.assertIn("error", response.body.decode("utf-8"))

    def test_refresh_http_failure_is_sanitized(self):
        with patch.dict(os.environ, {"GOOGLE_CLIENT_ID": "id", "GOOGLE_CLIENT_SECRET": "secret"}, clear=False):
            with patch("services.google_calendar_service.urlopen", side_effect=HTTPError("https://google.test", 400, "bad", {}, None)):
                with self.assertRaises(GoogleCalendarError) as ctx:
                    refresh_google_calendar_access_token("refresh")
        self.assertNotIn("refresh", ctx.exception.message)
