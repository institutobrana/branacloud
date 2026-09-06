import os
import unittest
from unittest.mock import patch
from urllib.error import HTTPError
from urllib.parse import parse_qs

from cryptography.fernet import Fernet

os.environ.setdefault("GOOGLE_TOKEN_ENCRYPTION_KEY", Fernet.generate_key().decode("ascii"))

from services.google_calendar_service import (
    create_oauth_state,
    decrypt_google_token,
    encrypt_google_token,
    oauth_state_digest,
    _http_json,
    GoogleCalendarError,
    exchange_google_calendar_code,
    refresh_google_calendar_access_token,
)


class _Response:
    def __init__(self, body=b'{}'):
        self.body = body
    def __enter__(self): return self
    def __exit__(self, *args): return False
    def read(self): return self.body


class GoogleCalendarFoundationTests(unittest.TestCase):
    def test_tokens_are_encrypted_and_round_trip(self):
        encrypted = encrypt_google_token("access-secret")
        self.assertNotEqual(encrypted, "access-secret")
        self.assertEqual(decrypt_google_token(encrypted), "access-secret")

    def test_dedicated_token_transport_contract_and_single_call(self):
        calls = []
        def fake(req, timeout=None):
            calls.append((req, timeout))
            return _Response(b'{"access_token":"SENTINEL","token_type":"Bearer"}')
        with patch("services.google_calendar_service.urlopen", side_effect=fake):
            result = exchange_google_calendar_code("synthetic-code", oauth_attempt_id="r23-test")
        self.assertEqual(result["access_token"], "SENTINEL")
        self.assertEqual(len(calls), 1)
        req = calls[0][0]
        self.assertEqual(req.get_method(), "POST")
        self.assertEqual(req.full_url, "https://oauth2.googleapis.com/token")
        self.assertEqual(set(parse_qs(req.data.decode()).keys()), {"client_id", "client_secret", "code", "grant_type", "redirect_uri"})

    def test_oauth_state_is_random_and_digestable(self):
        state = create_oauth_state(10, 20)
        self.assertNotEqual(state, create_oauth_state(10, 20))
        self.assertEqual(len(oauth_state_digest(state)), 64)

    def test_oauth_state_rejects_other_user_or_clinic(self):
        self.assertNotEqual(oauth_state_digest(create_oauth_state(10, 20)), oauth_state_digest(create_oauth_state(11, 20)))

    def test_missing_key_fails_closed(self):
        with patch.dict(os.environ, {"GOOGLE_TOKEN_ENCRYPTION_KEY": ""}, clear=False):
            with self.assertRaises(GoogleCalendarError):
                encrypt_google_token("secret")

    def test_http_retries_429_once(self):
        calls = []
        def fake(*args, **kwargs):
            calls.append(1)
            if len(calls) == 1:
                raise HTTPError("https://google.test", 429, "rate", {}, None)
            return _Response()
        with patch("services.google_calendar_service.urlopen", side_effect=fake):
            self.assertEqual(_http_json("GET", "https://google.test"), {})
        self.assertEqual(len(calls), 2)

    def test_http_does_not_retry_400(self):
        calls = []
        def fake(*args, **kwargs):
            calls.append(1)
            raise HTTPError("https://google.test", 400, "bad", {}, None)
        with patch("services.google_calendar_service.urlopen", side_effect=fake):
            with self.assertRaises(GoogleCalendarError):
                _http_json("GET", "https://google.test")
        self.assertEqual(len(calls), 1)

    def test_http_retries_timeout_once(self):
        calls = []
        def fake(*args, **kwargs):
            calls.append(1)
            if len(calls) == 1:
                raise TimeoutError("timeout")
            return _Response()
        with patch("services.google_calendar_service.urlopen", side_effect=fake):
            self.assertEqual(_http_json("GET", "https://google.test"), {})
        self.assertEqual(len(calls), 2)

    def test_callback_exchange_uses_mocked_google_boundary(self):
        with patch.dict(os.environ, {"GOOGLE_CLIENT_ID": "id", "GOOGLE_CLIENT_SECRET": "secret", "GOOGLE_CALENDAR_REDIRECT_URI": "https://test/callback"}, clear=False):
            with patch("services.google_calendar_service.urlopen", return_value=_Response(b'{"access_token":"a","refresh_token":"r"}')):
                result = exchange_google_calendar_code("code")
        self.assertEqual(result["access_token"], "a")

    def test_refresh_without_rotation_returns_access_token_only(self):
        with patch.dict(os.environ, {"GOOGLE_CLIENT_ID": "id", "GOOGLE_CLIENT_SECRET": "secret"}, clear=False):
            with patch("services.google_calendar_service.urlopen", return_value=_Response(b'{"access_token":"new"}')):
                result = refresh_google_calendar_access_token("old")
        self.assertEqual(result, {"access_token": "new"})

    def test_refresh_with_rotation_returns_both_tokens(self):
        with patch.dict(os.environ, {"GOOGLE_CLIENT_ID": "id", "GOOGLE_CLIENT_SECRET": "secret"}, clear=False):
            with patch("services.google_calendar_service.urlopen", return_value=_Response(b'{"access_token":"new","refresh_token":"rotated"}')):
                result = refresh_google_calendar_access_token("old")
        self.assertEqual(result["refresh_token"], "rotated")

    def test_http_no_retry_for_auth_and_forbidden(self):
        for status in (401, 403):
            calls = []
            def fake(*args, **kwargs):
                calls.append(1)
                raise HTTPError("https://google.test", status, "error", {}, None)
            with patch("services.google_calendar_service.urlopen", side_effect=fake):
                with self.assertRaises(GoogleCalendarError):
                    _http_json("GET", "https://google.test")
            self.assertEqual(len(calls), 1)


if __name__ == "__main__":
    unittest.main()
