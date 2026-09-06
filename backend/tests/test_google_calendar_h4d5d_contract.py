import unittest
from types import SimpleNamespace
from unittest.mock import patch

from routes.agenda_legado_routes import _agenda_google_payload, resolve_google_calendar_timezone
from services.google_calendar_reconciliation_service import (
    GoogleCalendarDestination, reconcile_item, reconcile_physical_deletes,
)
from services.google_calendar_service import GoogleCalendarError
from test_google_calendar_reconciliation import _DB


class GoogleCalendarH4D5DContractTests(unittest.TestCase):
    destination = GoogleCalendarDestination(1, "sub-a", "primary", "mock-token")

    def _event(self, status=15, event_id=123):
        return SimpleNamespace(id=event_id, status=status)

    def test_public_status_policy_excludes_cancelled_statuses(self):
        self.assertEqual({2, 5}.intersection({None, 0, 1, 3, 4, 6, 8, 14, 15}), set())

    def test_status_2_without_mapping_is_ignored_without_google(self):
        with patch("services.google_calendar_reconciliation_service.delete_google_calendar_event") as delete:
            result = reconcile_item(db=_DB(), destination=self.destination, evento=self._event(2), payload={})
        self.assertEqual(result.action, "ignored"); delete.assert_not_called()

    def test_status_5_without_mapping_is_ignored_without_google(self):
        with patch("services.google_calendar_reconciliation_service.delete_google_calendar_event") as delete:
            result = reconcile_item(db=_DB(), destination=self.destination, evento=self._event(5), payload={})
        self.assertEqual(result.action, "ignored"); delete.assert_not_called()

    def test_status_2_mapping_is_deleted(self):
        mapping = SimpleNamespace(google_event_id="b1e123", sync_status="synced", last_error=None)
        with patch("services.google_calendar_reconciliation_service.delete_google_calendar_event") as delete:
            result = reconcile_item(db=_DB(mapping=mapping), destination=self.destination, evento=self._event(2), payload={})
        delete.assert_called_once(); self.assertEqual(result.action, "deleted"); self.assertEqual(mapping.sync_status, "deleted")

    def test_status_5_mapping_is_deleted(self):
        mapping = SimpleNamespace(google_event_id="b1e123", sync_status="synced", last_error=None)
        with patch("services.google_calendar_reconciliation_service.delete_google_calendar_event") as delete:
            result = reconcile_item(db=_DB(mapping=mapping), destination=self.destination, evento=self._event(5), payload={})
        delete.assert_called_once(); self.assertEqual(result.action, "deleted")

    def test_deleted_mapping_does_not_repeat_delete(self):
        mapping = SimpleNamespace(google_event_id="b1e123", sync_status="deleted", last_error=None)
        with patch("services.google_calendar_reconciliation_service.delete_google_calendar_event") as delete:
            result = reconcile_item(db=_DB(mapping=mapping), destination=self.destination, evento=self._event(2), payload={})
        delete.assert_not_called(); self.assertEqual(result.action, "ignored")

    def test_delete_404_is_success(self):
        mapping = SimpleNamespace(google_event_id="b1e123", sync_status="synced", last_error=None)
        with patch("services.google_calendar_reconciliation_service.delete_google_calendar_event", side_effect=GoogleCalendarError("gone", 404)):
            result = reconcile_item(db=_DB(mapping=mapping), destination=self.destination, evento=self._event(2), payload={})
        self.assertEqual(result.action, "deleted"); self.assertEqual(mapping.sync_status, "deleted")

    def test_filter_exit_date_provider_and_unit_never_delete(self):
        for changed in ("date", "provider", "unit"):
            mapping = SimpleNamespace(agenda_id=123, google_event_id="b1e123", sync_status="synced", last_error=None)
            with self.subTest(changed=changed), patch("services.google_calendar_reconciliation_service.delete_google_calendar_event") as delete:
                results = reconcile_physical_deletes(db=_DB(mappings=[mapping], agenda_exists=True), destination=self.destination)
            delete.assert_not_called(); self.assertEqual(results, [])

    def test_physical_delete_is_scoped_to_clinic_and_agenda(self):
        mapping = SimpleNamespace(agenda_id=123, google_event_id="b1e123", sync_status="synced", last_error=None)
        with patch("services.google_calendar_reconciliation_service.delete_google_calendar_event") as delete:
            results = reconcile_physical_deletes(db=_DB(mappings=[mapping], agenda_exists=False), destination=self.destination)
        delete.assert_called_once(); self.assertEqual(results[0].action, "deleted")

    def test_destinations_are_isolated(self):
        self.assertNotEqual(self.destination, GoogleCalendarDestination(1, "sub-b", "primary", "mock-token"))
        self.assertNotEqual(self.destination, GoogleCalendarDestination(1, "sub-a", "calendar-x", "mock-token"))
        self.assertNotEqual(self.destination, GoogleCalendarDestination(2, "sub-a", "primary", "mock-token"))

    def test_payload_privacy_and_unicode(self):
        event = SimpleNamespace(id=123, data=None, hora_inicio=3600000, hora_fim=3900000, motivo="motivo clínico", observ="histórico", nome="João José Çãéó", nro_pac=1)
        patient = SimpleNamespace(nome="João José Çãéó")
        provider = SimpleNamespace(nome="Prestador secreto", apelido="Prestador secreto")
        _, payload = _agenda_google_payload(evento=event, paciente=patient, prestador=provider, timezone_name="America/Sao_Paulo", clinica_id=1)
        self.assertEqual(payload["summary"], "João José Çãéó")
        self.assertEqual(payload["description"], "")
        self.assertEqual(payload["extendedProperties"]["private"], {"brana_clinica_id": "1", "brana_agenda_id": "123"})
        self.assertNotIn("JoÃ", payload["summary"])

    def test_timezone_has_one_canonical_fallback(self):
        self.assertEqual(resolve_google_calendar_timezone({"time_zone": "Europe/Lisbon"}), "Europe/Lisbon")
        self.assertEqual(resolve_google_calendar_timezone({}), "America/Sao_Paulo")

    def test_missing_account_sub_fails_closed(self):
        with self.assertRaises(GoogleCalendarError):
            reconcile_item(db=_DB(), destination=GoogleCalendarDestination(1, "", "primary", "token"), evento=self._event(), payload={})

    def test_recovery_update_404_preserves_id(self):
        mapping = SimpleNamespace(google_event_id="b1e123", sync_status="synced", last_error=None)
        with patch("services.google_calendar_reconciliation_service.update_google_calendar_event", side_effect=GoogleCalendarError("gone", 404)), patch("services.google_calendar_reconciliation_service.create_google_calendar_event") as create:
            reconcile_item(db=_DB(mapping=mapping), destination=self.destination, evento=self._event(), payload={})
        self.assertEqual(create.call_args.kwargs["event_id"], "b1e123")

    def test_id_mismatch_fails_before_google_write(self):
        mapping = SimpleNamespace(google_event_id="foreign", sync_status="synced", last_error=None)
        with patch("services.google_calendar_reconciliation_service.update_google_calendar_event") as update, patch("services.google_calendar_reconciliation_service.delete_google_calendar_event") as delete, self.assertRaises(GoogleCalendarError):
            reconcile_item(db=_DB(mapping=mapping), destination=self.destination, evento=self._event(), payload={})
        update.assert_not_called(); delete.assert_not_called(); self.assertEqual(mapping.sync_status, "error")


if __name__ == "__main__":
    unittest.main()
