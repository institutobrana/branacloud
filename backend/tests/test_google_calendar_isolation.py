import json
import unittest
from types import SimpleNamespace

from routes.agenda_legado_routes import google_agenda_status


class GoogleIsolationTests(unittest.TestCase):
    def test_status_reads_only_the_supplied_user_context(self):
        user_a = SimpleNamespace(id=1, clinica_id=1, preferencias_usuario_json=json.dumps({}))
        user_b = SimpleNamespace(id=2, clinica_id=2, preferencias_usuario_json=json.dumps({"google_calendar_sync": {"connected": True, "email": "b@example.test", "access_token_enc": "x"}}))
        self.assertFalse(google_agenda_status(user_a)["connected"])
        self.assertEqual(google_agenda_status(user_b)["email"], "b@example.test")
