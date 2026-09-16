import json
import os
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch
from urllib.error import HTTPError
from io import BytesIO

from cryptography.fernet import Fernet

os.environ.setdefault("GOOGLE_TOKEN_ENCRYPTION_KEY", Fernet.generate_key().decode("ascii"))
os.environ.setdefault("JWT_SECRET_KEY", "test-google-oauth-attempt-correlation")

from security.jwt_handler import create_access_token, decode_token
from services.google_calendar_service import create_oauth_attempt_id, exchange_google_calendar_code
from services.google_oauth_observability import oauth_logger


class GoogleOAuthAttemptCorrelationTests(unittest.TestCase):
    def test_attempt_id_is_random_and_round_trips_in_signed_state(self):
        attempt_a = create_oauth_attempt_id()
        attempt_b = create_oauth_attempt_id()
        self.assertNotEqual(attempt_a, attempt_b)
        state = create_access_token({"type": "google_calendar_oauth", "oauth_attempt_id": attempt_a})
        self.assertEqual(decode_token(state)["oauth_attempt_id"], attempt_a)

    def test_token_error_contains_attempt_id_and_safe_classification(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "oauth.log"
            handler = next(h for h in oauth_logger.handlers if getattr(h, "_brana_oauth_sink", False))
            old_stream = handler.stream
            handler.stream = open(path, "a", encoding="utf-8")
            try:
                with patch.dict(os.environ, {"GOOGLE_CLIENT_ID": "id", "GOOGLE_CLIENT_SECRET": "secret", "GOOGLE_CALENDAR_REDIRECT_URI": "https://test/callback"}, clear=False):
                    with patch("services.google_calendar_service.urlopen", side_effect=HTTPError("https://google.test", 400, "bad", {"Content-Type": "application/json"}, BytesIO(b'{"error":"invalid_grant","error_description":"synthetic"}'))):
                        with self.assertRaises(Exception):
                            exchange_google_calendar_code("code", oauth_attempt_id="attempt-a")
                handler.flush()
                content = path.read_text(encoding="utf-8")
            finally:
                handler.stream.close()
                handler.stream = old_stream
        self.assertIn("oauth_attempt_id=attempt-a", content)
        self.assertIn("error=invalid_grant", content)
        self.assertIn("response_json_parsed=true", content)
        self.assertNotIn("code", content)
        self.assertNotIn("secret", content)

    def test_interleaved_markers_are_filterable_by_attempt_id(self):
        events = [
            "calendar_oauth_start_received oauth_attempt_id=A",
            "calendar_oauth_start_received oauth_attempt_id=B",
            "calendar_oauth_state_valid oauth_attempt_id=A",
            "calendar_oauth_state_valid oauth_attempt_id=B",
            "calendar_oauth_token_exchange_error oauth_attempt_id=B error=unknown",
            "calendar_oauth_token_exchange_error oauth_attempt_id=A error=invalid_grant",
        ]
        self.assertEqual([e for e in events if "oauth_attempt_id=A" in e], [events[0], events[2], events[5]])
        self.assertEqual([e for e in events if "oauth_attempt_id=B" in e], [events[1], events[3], events[4]])

    def test_real_sink_distinguishes_two_attempts(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "oauth.log"
            handler = next(h for h in oauth_logger.handlers if getattr(h, "_brana_oauth_sink", False))
            old_stream = handler.stream
            handler.stream = open(path, "a", encoding="utf-8")
            try:
                oauth_logger.info("calendar_oauth_start_received oauth_attempt_id=A")
                oauth_logger.info("calendar_oauth_start_received oauth_attempt_id=B")
                oauth_logger.warning("calendar_oauth_token_exchange_error oauth_attempt_id=A http_status=400 error=unknown")
                oauth_logger.warning("calendar_oauth_token_exchange_error oauth_attempt_id=B http_status=500 error=server_error")
                handler.flush()
                content = path.read_text(encoding="utf-8")
            finally:
                handler.stream.close()
                handler.stream = old_stream
        self.assertEqual(content.count("oauth_attempt_id=A"), 2)
        self.assertEqual(content.count("oauth_attempt_id=B"), 2)

    def test_non_json_sink_classification_is_false(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "oauth.log"
            handler = next(h for h in oauth_logger.handlers if getattr(h, "_brana_oauth_sink", False))
            old_stream = handler.stream
            handler.stream = open(path, "a", encoding="utf-8")
            try:
                with patch.dict(os.environ, {"GOOGLE_CLIENT_ID": "id", "GOOGLE_CLIENT_SECRET": "secret", "GOOGLE_CALENDAR_REDIRECT_URI": "https://test/callback"}, clear=False):
                    with patch("services.google_calendar_service.urlopen", side_effect=HTTPError("https://google.test", 400, "bad", None, BytesIO(b"html body"))):
                        with self.assertRaises(Exception):
                            exchange_google_calendar_code("code", oauth_attempt_id="non-json")
                handler.flush()
                content = path.read_text(encoding="utf-8")
            finally:
                handler.stream.close()
                handler.stream = old_stream
        self.assertIn("response_json_parsed=false", content)
        self.assertIn("error=unknown", content)


if __name__ == "__main__":
    unittest.main()
