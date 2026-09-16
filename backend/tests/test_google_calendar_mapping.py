import os
import unittest
from unittest.mock import patch

from models.google_calendar_event_mapping import GoogleCalendarEventMapping
from services import google_calendar_service as service


class GoogleCalendarMappingTests(unittest.TestCase):
    def test_mapping_contract_has_destination_unique_constraint(self):
        constraints = {c.name for c in GoogleCalendarEventMapping.__table__.constraints}
        self.assertIn("uq_google_calendar_mapping_destination", constraints)
        self.assertIn("ck_google_calendar_mapping_sync_status", constraints)
        self.assertFalse(any(
            fk.column.table.name == "agenda_legado_evento"
            for fk in GoogleCalendarEventMapping.__table__.foreign_keys
        ))

    def test_mapping_status_and_error_are_compatible(self):
        self.assertEqual(GoogleCalendarEventMapping.sync_status.default.arg, "synced")
        self.assertTrue(GoogleCalendarEventMapping.last_error.nullable)

    def test_verified_id_token_returns_sub(self):
        class Response:
            def read(self):
                return b'{"keys":[{"kid":"k1"}]}'

            def __enter__(self): return self
            def __exit__(self, *args): return False

        with patch.dict(os.environ, {"GOOGLE_CLIENT_ID": "client"}, clear=False), \
             patch.object(service.jwt, "get_unverified_header", return_value={"kid": "k1", "alg": "RS256"}), \
             patch.object(service.jwt, "decode", return_value={"sub": "google-sub", "iss": "https://accounts.google.com", "email": "x@y.test"}), \
             patch.object(service, "urlopen", return_value=Response()):
            self.assertEqual(service.verify_google_id_token("token")["sub"], "google-sub")

    def test_verified_id_token_rejects_bad_issuer(self):
        class Response:
            def read(self): return b'{"keys":[{"kid":"k1"}]}'
            def __enter__(self): return self
            def __exit__(self, *args): return False

        with patch.dict(os.environ, {"GOOGLE_CLIENT_ID": "client"}, clear=False), \
             patch.object(service.jwt, "get_unverified_header", return_value={"kid": "k1", "alg": "RS256"}), \
             patch.object(service.jwt, "decode", return_value={"sub": "google-sub", "iss": "https://evil.test"}), \
             patch.object(service, "urlopen", return_value=Response()), \
            self.assertRaises(service.GoogleCalendarError):
                service.verify_google_id_token("token")

    def test_verified_id_token_rejects_jwt_validation_failures(self):
        class Response:
            def read(self): return b'{"keys":[{"kid":"k1"}]}'
            def __enter__(self): return self
            def __exit__(self, *args): return False

        for failure in ("signature", "audience", "expiration"):
            with self.subTest(failure=failure), \
                 patch.dict(os.environ, {"GOOGLE_CLIENT_ID": "client"}, clear=False), \
                 patch.object(service.jwt, "get_unverified_header", return_value={"kid": "k1", "alg": "RS256"}), \
                 patch.object(service.jwt, "decode", side_effect=service.JWTError(failure)), \
                 patch.object(service, "urlopen", return_value=Response()), \
                 self.assertRaises(service.GoogleCalendarError):
                service.verify_google_id_token("token")

    def test_verified_id_token_rejects_missing_sub(self):
        class Response:
            def read(self): return b'{"keys":[{"kid":"k1"}]}'
            def __enter__(self): return self
            def __exit__(self, *args): return False

        with patch.dict(os.environ, {"GOOGLE_CLIENT_ID": "client"}, clear=False), \
             patch.object(service.jwt, "get_unverified_header", return_value={"kid": "k1", "alg": "RS256"}), \
             patch.object(service.jwt, "decode", return_value={"iss": "https://accounts.google.com"}), \
             patch.object(service, "urlopen", return_value=Response()), \
             self.assertRaises(service.GoogleCalendarError):
            service.verify_google_id_token("token")


if __name__ == "__main__":
    unittest.main()
