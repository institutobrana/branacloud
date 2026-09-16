import unittest
from types import SimpleNamespace
from unittest.mock import patch

from services.google_calendar_reconciliation_service import (
    GoogleCalendarDestination,
    reconcile_item,
    reconcile_physical_deletes,
)


class _Query:
    def __init__(self, values):
        self.values = values

    def filter(self, *args):
        return self

    def one_or_none(self):
        return self.values[0] if self.values else None

    def all(self):
        return list(self.values)

    def first(self):
        return self.values[0] if self.values else None


class _DB:
    def __init__(self, mapping=None, agenda_exists=True, mappings=None):
        self.mapping = mapping
        self.agenda_exists = agenda_exists
        self.mappings = mappings if mappings is not None else ([mapping] if mapping else [])
        self.added = []
        self.commits = 0

    def query(self, model):
        name = getattr(model, "__tablename__", "")
        if name == "google_calendar_event_mapping":
            return _Query(self.mappings)
        return _Query([object()] if self.agenda_exists else [])

    def add(self, value):
        self.added.append(value)

    def flush(self):
        return None

    def commit(self):
        self.commits += 1

    def rollback(self):
        return None


class GoogleCalendarReconciliationTests(unittest.TestCase):
    destination = GoogleCalendarDestination(7, "sub-a", "primary", "mock-token")
    event = SimpleNamespace(id=123, status=15)
    payload = {"summary": "Paciente", "extendedProperties": {"private": {"brana_agenda_id": "123"}}}

    def test_create_persists_mapping_and_uses_deterministic_id(self):
        db = _DB()
        with patch("services.google_calendar_reconciliation_service.create_google_calendar_event") as create:
            result = reconcile_item(db=db, destination=self.destination, evento=self.event, payload=self.payload)
        create.assert_called_once()
        self.assertEqual(create.call_args.kwargs["event_id"], "b7e123")
        self.assertEqual(result.action, "created")
        self.assertEqual(db.added[0].google_event_id, "b7e123")
        self.assertEqual(db.added[0].sync_status, "synced")

    def test_existing_mapping_always_updates_same_id(self):
        mapping = SimpleNamespace(google_event_id="b7e123", sync_status="synced", last_error=None)
        db = _DB(mapping=mapping)
        with patch("services.google_calendar_reconciliation_service.update_google_calendar_event") as update:
            result = reconcile_item(db=db, destination=self.destination, evento=self.event, payload=self.payload)
        update.assert_called_once()
        self.assertEqual(update.call_args.kwargs["event_id"], "b7e123")
        self.assertEqual(result.action, "updated")

    def test_update_404_recreates_same_id(self):
        mapping = SimpleNamespace(google_event_id="b7e123", sync_status="synced", last_error=None)
        db = _DB(mapping=mapping)
        from services.google_calendar_service import GoogleCalendarError
        with patch("services.google_calendar_reconciliation_service.update_google_calendar_event", side_effect=GoogleCalendarError("missing", 404)), \
             patch("services.google_calendar_reconciliation_service.create_google_calendar_event") as create:
            reconcile_item(db=db, destination=self.destination, evento=self.event, payload=self.payload)
        self.assertEqual(create.call_args.kwargs["event_id"], "b7e123")

    def test_cancellation_without_mapping_is_ignored(self):
        db = _DB()
        event = SimpleNamespace(id=123, status=2)
        with patch("services.google_calendar_reconciliation_service.delete_google_calendar_event") as delete:
            result = reconcile_item(db=db, destination=self.destination, evento=event, payload=self.payload)
        delete.assert_not_called()
        self.assertEqual(result.action, "ignored")

    def test_cancellation_marks_mapping_deleted_and_accepts_404(self):
        mapping = SimpleNamespace(google_event_id="b7e123", sync_status="synced", last_error=None)
        db = _DB(mapping=mapping)
        event = SimpleNamespace(id=123, status=5)
        from services.google_calendar_service import GoogleCalendarError
        with patch("services.google_calendar_reconciliation_service.delete_google_calendar_event", side_effect=GoogleCalendarError("missing", 404)):
            result = reconcile_item(db=db, destination=self.destination, evento=event, payload=self.payload)
        self.assertEqual(result.action, "deleted")
        self.assertEqual(mapping.sync_status, "deleted")

    def test_physical_delete_ignores_filter_and_deletes_only_missing_source(self):
        mapping = SimpleNamespace(agenda_id=123, google_event_id="b7e123", sync_status="synced", last_error=None)
        db = _DB(mappings=[mapping], agenda_exists=False)
        with patch("services.google_calendar_reconciliation_service.delete_google_calendar_event") as delete:
            results = reconcile_physical_deletes(db=db, destination=self.destination)
        delete.assert_called_once_with(access_token="mock-token", calendar_id="primary", event_id="b7e123")
        self.assertEqual(results[0].action, "deleted")

    def test_missing_account_sub_is_fail_closed(self):
        destination = GoogleCalendarDestination(7, "", "primary", "mock-token")
        with self.assertRaises(Exception):
            reconcile_item(db=_DB(), destination=destination, evento=self.event, payload=self.payload)


if __name__ == "__main__":
    unittest.main()
