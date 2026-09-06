import unittest
from datetime import date, datetime
from types import SimpleNamespace

from services.agenda_google_preview import resolve_agenda_identity, validate_google_period
from routes.agenda_legado_routes import _agenda_google_payload


class GoogleCalendarPreviewH4D2Tests(unittest.TestCase):
    def test_identity_is_deterministic_and_cross_clinic_safe(self):
        self.assertEqual(resolve_agenda_identity(clinica_id=7, agenda_id=42), "b7e42")
        self.assertEqual(resolve_agenda_identity(clinica_id=7, agenda_id=42), "b7e42")
        self.assertNotEqual(resolve_agenda_identity(clinica_id=7, agenda_id=42), resolve_agenda_identity(clinica_id=8, agenda_id=42))

    def test_identity_does_not_change_when_event_content_changes(self):
        event = SimpleNamespace(id=42, data=date(2026, 1, 2), hora_inicio=3600000, hora_fim=7200000, motivo="A", fone1="999")
        changed = SimpleNamespace(id=42, data=date(2026, 2, 3), hora_inicio=4000000, hora_fim=5000000, motivo="B", fone1="888")
        self.assertEqual(resolve_agenda_identity(clinica_id=7, agenda_id=event.id), resolve_agenda_identity(clinica_id=7, agenda_id=changed.id))

    def test_period_is_inclusive_and_bounded_to_31_days(self):
        validate_google_period(date(2026, 1, 1), date(2026, 1, 31))
        with self.assertRaises(ValueError):
            validate_google_period(date(2026, 1, 1), date(2026, 2, 1))
        with self.assertRaises(ValueError):
            validate_google_period(date(2026, 2, 2), date(2026, 2, 1))

    def test_payload_is_shared_shape_and_minimizes_contact_data(self):
        event = SimpleNamespace(
            id=42, data=datetime(2026, 1, 2), hora_inicio=3600000, hora_fim=7200000,
            motivo="Consulta", fone1="5511999999999", fone2=None, fone3=None,
        )
        event_id, payload = _agenda_google_payload(
            evento=event, paciente=None, prestador=SimpleNamespace(apelido="Dra. Teste", nome="Teste"),
            timezone_name="America/Sao_Paulo", clinica_id=7,
        )
        self.assertEqual(event_id, "b7e42")
        self.assertNotIn("Cirurgião", payload["description"])
        self.assertNotIn("999999999", payload["description"])
        self.assertEqual(payload["extendedProperties"]["private"]["brana_clinica_id"], "7")


if __name__ == "__main__":
    unittest.main()
