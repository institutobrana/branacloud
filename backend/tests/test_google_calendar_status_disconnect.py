import json
import os
import unittest
from types import SimpleNamespace
from cryptography.fernet import Fernet

os.environ.setdefault("GOOGLE_TOKEN_ENCRYPTION_KEY", Fernet.generate_key().decode("ascii"))

from routes.agenda_legado_routes import google_agenda_status, google_agenda_disconnect
from services.google_calendar_service import encrypt_google_token


class _DB:
    def __init__(self): self.commits = 0
    def add(self, obj): pass
    def commit(self): self.commits += 1


def user(prefs):
    return SimpleNamespace(id=1, clinica_id=1, preferencias_usuario_json=json.dumps(prefs))


class GoogleStatusDisconnectTests(unittest.TestCase):
    def test_status_disconnected_has_safe_shape(self):
        response = google_agenda_status(user({}))
        self.assertFalse(response["connected"])
        self.assertNotIn("access_token", json.dumps(response))
        self.assertNotIn("refresh_token", json.dumps(response))

    def test_status_connected_never_returns_credentials(self):
        response = google_agenda_status(user({"google_calendar_sync": {
            "connected": True, "email": "user@example.test", "access_token_enc": encrypt_google_token("artificial-access"),
            "refresh_token_enc": encrypt_google_token("artificial-refresh"), "calendar_id": "primary"
        }}))
        self.assertTrue(response["connected"])
        serialized = json.dumps(response)
        for forbidden in ("access_token", "refresh_token", "artificial-access", "artificial-refresh"):
            self.assertNotIn(forbidden, serialized)

    def test_disconnect_is_local_and_preserves_other_preferences(self):
        current = user({"unrelated": {"keep": True}, "google_calendar_sync": {
            "connected": True, "email": "user@example.test", "access_token_enc": "cipher",
            "refresh_token_enc": "cipher2", "calendar_id": "primary"
        }})
        db = _DB()
        response = google_agenda_disconnect(current, db)
        prefs = json.loads(current.preferencias_usuario_json)
        self.assertFalse(response["connected"])
        self.assertEqual(prefs["unrelated"], {"keep": True})
        self.assertEqual(prefs["google_calendar_sync"]["access_token_enc"], "")
        self.assertEqual(prefs["google_calendar_sync"]["refresh_token_enc"], "")

    def test_disconnect_is_idempotent_and_does_not_delete_events(self):
        current = user({})
        db = _DB()
        self.assertFalse(google_agenda_disconnect(current, db)["connected"])
        self.assertFalse(google_agenda_disconnect(current, db)["connected"])
        self.assertEqual(db.commits, 2)
