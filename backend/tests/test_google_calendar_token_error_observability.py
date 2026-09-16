import os
import tempfile
import unittest
from io import BytesIO
from pathlib import Path
from unittest.mock import patch
from urllib.error import HTTPError

from cryptography.fernet import Fernet

os.environ.setdefault("GOOGLE_TOKEN_ENCRYPTION_KEY", Fernet.generate_key().decode("ascii"))

from services.google_calendar_service import GoogleCalendarError, exchange_google_calendar_code
from services.google_oauth_observability import get_oauth_logger


class TokenErrorObservabilityTests(unittest.TestCase):
    def _run_error(self, body, status=400):
        with patch.dict(os.environ, {"GOOGLE_CLIENT_ID": "id", "GOOGLE_CLIENT_SECRET": "secret", "GOOGLE_CALENDAR_REDIRECT_URI": "https://test/callback"}, clear=False):
            with patch("services.google_calendar_service.urlopen", side_effect=HTTPError("https://google.test", status, "error", {}, BytesIO(body))):
                with self.assertRaises(GoogleCalendarError) as ctx:
                    exchange_google_calendar_code("synthetic-code")
        return ctx.exception

    def _capture(self, body, status=400):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "oauth.log"
            logger = get_oauth_logger()
            handler = next(h for h in logger.handlers if getattr(h, "_brana_oauth_sink", False))
            with patch("services.google_oauth_observability.SINK_PATH", path):
                # The production logger is already configured for the shared sink;
                # assert the same handler receives the synthetic event by redirecting it.
                old_stream = handler.stream
                handler.stream = open(path, "a", encoding="utf-8")
                try:
                    self._run_error(body, status)
                    handler.flush()
                    text = path.read_text(encoding="utf-8")
                finally:
                    handler.stream.close()
                    handler.stream = old_stream
        return text

    def test_json_error_code_and_description_are_logged(self):
        text = self._capture(b'{"error":"invalid_grant","error_description":"synthetic test description"}')
        self.assertIn("http_status=400", text)
        self.assertIn("error=invalid_grant", text)
        self.assertIn("error_description=synthetic test description", text)
        self.assertNotIn("synthetic-code", text)
        self.assertNotIn("secret", text)

    def test_missing_description_is_safe(self):
        text = self._capture(b'{"error":"invalid_client"}')
        self.assertIn("error=invalid_client", text)
        self.assertIn("error_description=", text)

    def test_non_json_error_is_safe(self):
        error = self._run_error(b"not-json")
        self.assertEqual(error.status_code, 400)
        self.assertNotIn("not-json", str(error))

    def test_http_500_error_is_safe_and_logged(self):
        text = self._capture(b'{"error":"server_error","error_description":"synthetic outage"}', 500)
        self.assertIn("http_status=500", text)
        self.assertIn("error=server_error", text)


if __name__ == "__main__":
    unittest.main()
