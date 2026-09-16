import os
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch
from urllib.error import HTTPError, URLError
from io import BytesIO

from cryptography.fernet import Fernet

os.environ.setdefault("GOOGLE_TOKEN_ENCRYPTION_KEY", Fernet.generate_key().decode("ascii"))

from services.google_calendar_service import (
    GoogleCalendarError,
    _emit_token_exchange_error,
    exchange_google_calendar_code,
)
from services.google_oauth_observability import get_oauth_logger


class R18AErrorPathTests(unittest.TestCase):
    class _Response:
        def __init__(self, payload, status=200, content_type="application/json"):
            self.payload = payload; self.status = status
            self.headers = {"Content-Type": content_type, "Content-Length": str(len(payload))}
        def __enter__(self): return self
        def __exit__(self, *args): return False
        def read(self): return self.payload

    def _sink_capture(self):
        directory = tempfile.TemporaryDirectory()
        path = Path(directory.name) / "oauth.log"
        logger = get_oauth_logger()
        handler = next(h for h in logger.handlers if getattr(h, "_brana_oauth_sink", False))
        old_stream = handler.stream
        handler.stream = open(path, "a", encoding="utf-8")
        return directory, path, handler, old_stream

    def _exchange_error(self, body, status=400, headers=None, attempt="r18a-test"):
        response_headers = headers or {"Content-Type": "application/json"}
        with patch.dict(os.environ, {"GOOGLE_CLIENT_ID": "id", "GOOGLE_CLIENT_SECRET": "test-secret", "GOOGLE_CALENDAR_REDIRECT_URI": "http://test/callback"}, clear=False), \
             patch("services.google_calendar_service.urlopen", side_effect=HTTPError("https://synthetic.invalid", status, "synthetic", response_headers, BytesIO(body))):
            with self.assertRaises(GoogleCalendarError) as caught:
                exchange_google_calendar_code("synthetic-code", oauth_attempt_id=attempt)
        return caught.exception

    def test_http_error_json_path_has_structured_metadata(self):
        error = self._exchange_error(b'{"error":"synthetic_error","error_description":"synthetic description"}')
        self.assertEqual(error.google_error_code, "synthetic_error")
        self.assertTrue(error.response_json_parsed)
        self.assertTrue(error.google_error_fields_present)
        self.assertEqual(error.response_content_type, "application/json")

    def test_http_error_non_json_path_is_sanitized(self):
        error = self._exchange_error(b"raw secret body", headers={"Content-Type": "text/html"})
        self.assertEqual(error.google_error_code, None)
        self.assertFalse(error.response_json_parsed)
        self.assertNotIn("raw secret body", str(error))

    def test_prebuilt_errors_get_one_final_marker(self):
        directory, path, handler, old_stream = self._sink_capture()
        try:
            error = GoogleCalendarError("safe", 400, google_error_code="synthetic_error", google_error_description_sanitized="synthetic description", response_content_type="application/json", response_json_parsed=True, google_error_fields_present=True)
            _emit_token_exchange_error(error, "prebuilt-a")
            _emit_token_exchange_error(error, "prebuilt-a")
            handler.flush()
            text = path.read_text(encoding="utf-8")
            self.assertEqual(text.count("calendar_oauth_token_exchange_error"), 1)
            self.assertIn("oauth_attempt_id=prebuilt-a", text)
        finally:
            handler.stream.close(); handler.stream = old_stream; directory.cleanup()

    def test_prebuilt_error_without_metadata_is_safe(self):
        directory, path, handler, old_stream = self._sink_capture()
        try:
            _emit_token_exchange_error(GoogleCalendarError("safe", 503), "prebuilt-b")
            handler.flush()
            text = path.read_text(encoding="utf-8")
            self.assertIn("error=unknown", text)
            self.assertIn("response_json_parsed=false", text)
        finally:
            handler.stream.close(); handler.stream = old_stream; directory.cleanup()

    def test_unexpected_transport_is_sanitized(self):
        with patch.dict(os.environ, {"GOOGLE_CLIENT_ID": "id", "GOOGLE_CLIENT_SECRET": "test-secret", "GOOGLE_CALENDAR_REDIRECT_URI": "http://test/callback"}, clear=False), \
             patch("services.google_calendar_service.urlopen", side_effect=URLError("secret transport detail")):
            with self.assertRaises(GoogleCalendarError) as caught:
                exchange_google_calendar_code("synthetic-code", oauth_attempt_id="transport")
        self.assertEqual(caught.exception.status_code, 503)
        self.assertNotIn("secret transport detail", str(caught.exception))

    def test_r18_shaped_path_preserves_metadata_before_callback(self):
        error = self._exchange_error(b'{"error":"synthetic_error","error_description":"synthetic description"}', attempt="r18-shaped")
        self.assertEqual(error.status_code, 400)
        self.assertEqual(error.google_error_code, "synthetic_error")
        self.assertEqual(error.google_error_description_sanitized, "synthetic description")
        self.assertTrue(error.detailed_marker_emitted)

    def _normal_response_error(self, payload):
        with patch.dict(os.environ, {"GOOGLE_CLIENT_ID": "id", "GOOGLE_CLIENT_SECRET": "test-secret", "GOOGLE_CALENDAR_REDIRECT_URI": "http://test/callback"}, clear=False), \
             patch("services.google_calendar_service.urlopen", return_value=self._Response(payload)):
            with self.assertRaises(GoogleCalendarError) as caught:
                exchange_google_calendar_code("synthetic-code", oauth_attempt_id="r19a")
        return caught.exception

    def test_no_access_token_json_invalid_grant_preserves_metadata(self):
        error = self._normal_response_error(b'{"error":"invalid_grant","error_description":"synthetic invalid grant"}')
        self.assertEqual(error.google_error_code, "invalid_grant")
        self.assertTrue(error.response_json_parsed); self.assertTrue(error.google_error_fields_present)

    def test_no_access_token_json_invalid_client_without_description(self):
        error = self._normal_response_error(b'{"error":"invalid_client"}')
        self.assertEqual(error.google_error_code, "invalid_client")
        self.assertEqual(error.google_error_description_sanitized, "")

    def test_no_access_token_json_without_error_is_unknown(self):
        error = self._normal_response_error(b'{"foo":"bar"}')
        self.assertIsNone(error.google_error_code); self.assertTrue(error.response_json_parsed)
        self.assertFalse(error.google_error_fields_present)

    def test_no_access_token_non_json_is_unknown(self):
        error = self._normal_response_error(b"not-json")
        self.assertIsNone(error.google_error_code); self.assertFalse(error.response_json_parsed)

    def test_access_token_success_regression(self):
        with patch.dict(os.environ, {"GOOGLE_CLIENT_ID": "id", "GOOGLE_CLIENT_SECRET": "test-secret", "GOOGLE_CALENDAR_REDIRECT_URI": "http://test/callback"}, clear=False), \
             patch("services.google_calendar_service.urlopen", return_value=self._Response(b'{"access_token":"synthetic-access"}')):
            self.assertEqual(exchange_google_calendar_code("synthetic-code", oauth_attempt_id="success")["access_token"], "synthetic-access")

    def test_transport_200_and_application_400_are_distinct(self):
        error = self._normal_response_error(b'{"error":"synthetic_error"}')
        self.assertEqual(error.status_code, 400)
        self.assertEqual(error.response_content_type, "application/json")

    def test_transport_200_empty_and_html_are_classified(self):
        empty = self._normal_response_error(b"")
        html = self._normal_response_error(b"<html>error</html>")
        self.assertFalse(empty.response_json_parsed)
        self.assertFalse(html.response_json_parsed)


if __name__ == "__main__":
    unittest.main()
