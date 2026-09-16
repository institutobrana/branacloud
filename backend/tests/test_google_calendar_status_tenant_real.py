import json
import os
import unittest
from types import SimpleNamespace
from unittest.mock import patch

from cryptography.fernet import Fernet

os.environ.setdefault("GOOGLE_TOKEN_ENCRYPTION_KEY", Fernet.generate_key().decode("ascii"))

from fastapi.testclient import TestClient
from main import app
from database import get_db
from routes.agenda_legado_routes import google_agenda_status
from routes.agenda_legado_routes import router as agenda_router
from security.dependencies import get_current_user
from services.google_calendar_service import encrypt_google_token


class _DB:
    def add(self, _obj):
        pass

    def commit(self):
        pass


def _user(user_id, clinic_id, prefs=None):
    return SimpleNamespace(id=user_id, clinica_id=clinic_id, preferencias_usuario_json=json.dumps(prefs or {}))


class GoogleStatusTenantRouteTests(unittest.TestCase):
    def setUp(self):
        self.current = _user(101, 1)
        app.dependency_overrides[get_current_user] = lambda: self.current
        app.dependency_overrides[get_db] = lambda: _DB()
        # Override the router-level permission dependency only in this test process.
        app.dependency_overrides[agenda_router.dependencies[0].dependency] = lambda: self.current
        self.client = TestClient(app)

    def tearDown(self):
        app.dependency_overrides.clear()

    def test_status_route_without_auth_is_401(self):
        app.dependency_overrides.pop(get_current_user, None)
        app.dependency_overrides.pop(agenda_router.dependencies[0].dependency, None)
        response = self.client.get("/agenda-legado/google-agenda/status")
        self.assertEqual(response.status_code, 401)

    def test_status_route_disconnected_is_safe(self):
        response = google_agenda_status(self.current)
        self.assertFalse(response["connected"])
        self.assertNotIn("token", json.dumps(response).lower())

    def test_status_route_connected_returns_metadata_only(self):
        self.current.preferencias_usuario_json = json.dumps({"google_calendar_sync": {
            "connected": True, "email": "a@example.test", "calendar_id": "primary",
            "access_token_enc": encrypt_google_token("artificial-access"),
            "refresh_token_enc": encrypt_google_token("artificial-refresh"),
        }})
        response = google_agenda_status(self.current)
        body = json.dumps(response).lower()
        self.assertTrue(response["connected"])
        for secret in ("artificial-access", "artificial-refresh", "access_token_enc", "refresh_token_enc"):
            self.assertNotIn(secret, body)

    def test_status_incomplete_and_corrupt_credentials_fail_closed(self):
        for cfg in ({"connected": True, "access_token_enc": ""}, {"connected": True, "access_token_enc": "not-fernet"}):
            with self.subTest(cfg=cfg):
                self.current.preferencias_usuario_json = json.dumps({"google_calendar_sync": cfg})
                response = google_agenda_status(self.current)
                self.assertFalse(response["connected"])

    def test_status_isolated_by_supplied_user_and_clinic_context(self):
        user_a = _user(101, 1, {"google_calendar_sync": {"connected": True, "email": "a@example.test", "access_token_enc": "a"}})
        user_b = _user(202, 1, {"google_calendar_sync": {"connected": True, "email": "b@example.test", "access_token_enc": "b"}})
        user_c = _user(303, 2, {"google_calendar_sync": {"connected": True, "email": "c@example.test", "access_token_enc": "c"}})
        for candidate, expected in ((user_a, "a@example.test"), (user_b, "b@example.test"), (user_c, "c@example.test")):
            with self.subTest(user=candidate.id):
                self.assertEqual(google_agenda_status(candidate)["email"], expected)
                self.assertEqual(google_agenda_status(candidate)["calendar_id"], "primary")

    def test_disconnect_route_does_not_affect_another_context(self):
        other = _user(202, 1, {"google_calendar_sync": {"connected": True, "access_token_enc": "other"}})
        self.current.preferencias_usuario_json = json.dumps({"keep": True, "google_calendar_sync": {"connected": True, "access_token_enc": "current"}})
        from routes.agenda_legado_routes import google_agenda_disconnect
        response = google_agenda_disconnect(self.current, _DB())
        self.assertEqual(response["connected"], False)
        self.assertFalse(json.loads(self.current.preferencias_usuario_json)["google_calendar_sync"]["connected"])
        self.assertTrue(json.loads(other.preferencias_usuario_json)["google_calendar_sync"]["connected"])


if __name__ == "__main__":
    unittest.main()
