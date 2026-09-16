import unittest
from unittest.mock import patch
from urllib.error import HTTPError

from services.google_calendar_service import _http_json, GoogleCalendarError


class _Response:
    def __enter__(self): return self
    def __exit__(self, *args): return False
    def read(self): return b"{}"


class GoogleHttpMatrixTests(unittest.TestCase):
    def test_retryable_statuses_retry_once(self):
        for status in (429, 500, 502, 503):
            calls = []
            def fake(*args, **kwargs):
                calls.append(1)
                if len(calls) == 1: raise HTTPError("https://google.test", status, "x", {}, None)
                return _Response()
            with patch("services.google_calendar_service.urlopen", side_effect=fake):
                _http_json("GET", "https://google.test")
            self.assertEqual(len(calls), 2)

    def test_non_retryable_statuses_attempt_once(self):
        for status in (400, 401, 403):
            calls = []
            def fake(*args, **kwargs):
                calls.append(1); raise HTTPError("https://google.test", status, "x", {}, None)
            with patch("services.google_calendar_service.urlopen", side_effect=fake):
                with self.assertRaises(GoogleCalendarError): _http_json("GET", "https://google.test")
        self.assertEqual(len(calls), 1)
