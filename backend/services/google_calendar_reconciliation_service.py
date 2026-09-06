"""Mockable create/update/delete orchestration for Google Calendar mappings."""
from dataclasses import dataclass
from datetime import datetime, timezone

from sqlalchemy.exc import IntegrityError
from sqlalchemy import inspect

from models.agenda_legado import AgendaLegadoEvento
from models.google_calendar_event_mapping import GoogleCalendarEventMapping
from services.google_calendar_service import (
    GoogleCalendarError,
    create_google_calendar_event,
    delete_google_calendar_event,
    update_google_calendar_event,
)

CANCELLATION_STATUSES = {2, 5}
EXPORTABLE_STATUSES = {None, 0, 1, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15}


@dataclass(frozen=True)
class GoogleCalendarDestination:
    clinica_id: int
    google_account_sub: str
    calendar_id: str
    access_token: str

    def validate(self) -> None:
        if self.clinica_id <= 0 or not self.google_account_sub or not self.calendar_id or not self.access_token:
            raise GoogleCalendarError("Destino Google incompleto para sincronização.", 400)


@dataclass(frozen=True)
class ReconciliationResult:
    action: str
    agenda_id: int
    google_event_id: str | None = None


def deterministic_event_id(clinica_id: int, agenda_id: int) -> str:
    return f"b{int(clinica_id)}e{int(agenda_id)}"


def mapping_table_available(db) -> bool:
    return bool(db.bind is not None and inspect(db.bind).has_table(GoogleCalendarEventMapping.__tablename__))


def get_mapping(db, destination: GoogleCalendarDestination, agenda_id: int):
    destination.validate()
    return db.query(GoogleCalendarEventMapping).filter(
        GoogleCalendarEventMapping.clinica_id == destination.clinica_id,
        GoogleCalendarEventMapping.google_account_sub == destination.google_account_sub,
        GoogleCalendarEventMapping.calendar_id == destination.calendar_id,
        GoogleCalendarEventMapping.agenda_id == int(agenda_id),
    ).one_or_none()


def _mark_mapping(db, mapping, *, status: str, error: str | None = None) -> None:
    mapping.sync_status = status
    mapping.last_error = error[:2000] if error else None
    mapping.last_sync_at = datetime.now(timezone.utc)
    db.add(mapping)
    db.flush()


def reconcile_item(*, db, destination: GoogleCalendarDestination, evento: AgendaLegadoEvento, payload: dict) -> ReconciliationResult:
    destination.validate()
    expected_id = deterministic_event_id(destination.clinica_id, evento.id)
    mapping = get_mapping(db, destination, evento.id)
    status = evento.status

    if status in CANCELLATION_STATUSES:
        if not mapping or mapping.sync_status == "deleted":
            return ReconciliationResult("ignored", int(evento.id), expected_id)
        if mapping.google_event_id != expected_id:
            raise GoogleCalendarError("Mapping Google inconsistente.", 409)
        try:
            delete_google_calendar_event(access_token=destination.access_token, calendar_id=destination.calendar_id, event_id=expected_id)
        except GoogleCalendarError as exc:
            if exc.status_code != 404:
                _mark_mapping(db, mapping, status="error", error="delete_failed")
                db.commit()
                raise
        _mark_mapping(db, mapping, status="deleted")
        db.commit()
        return ReconciliationResult("deleted", int(evento.id), expected_id)

    if status not in EXPORTABLE_STATUSES:
        return ReconciliationResult("ignored", int(evento.id), expected_id)

    if mapping and mapping.google_event_id != expected_id:
        _mark_mapping(db, mapping, status="error", error="event_id_mismatch")
        db.commit()
        raise GoogleCalendarError("Mapping Google inconsistente.", 409)

    try:
        if mapping and mapping.sync_status in {"synced", "error"}:
            try:
                update_google_calendar_event(access_token=destination.access_token, calendar_id=destination.calendar_id, event_id=expected_id, payload=payload)
            except GoogleCalendarError as exc:
                if exc.status_code != 404:
                    raise
                create_google_calendar_event(access_token=destination.access_token, calendar_id=destination.calendar_id, event_id=expected_id, payload=payload)
            action = "updated"
        else:
            try:
                create_google_calendar_event(access_token=destination.access_token, calendar_id=destination.calendar_id, event_id=expected_id, payload=payload)
            except GoogleCalendarError as exc:
                if exc.status_code != 409:
                    raise
                update_google_calendar_event(access_token=destination.access_token, calendar_id=destination.calendar_id, event_id=expected_id, payload=payload)
            action = "created"
        if not mapping:
            mapping = GoogleCalendarEventMapping(
                clinica_id=destination.clinica_id,
                google_account_sub=destination.google_account_sub,
                calendar_id=destination.calendar_id,
                agenda_id=int(evento.id),
                google_event_id=expected_id,
            )
            db.add(mapping)
        _mark_mapping(db, mapping, status="synced")
        db.commit()
        return ReconciliationResult(action, int(evento.id), expected_id)
    except IntegrityError:
        db.rollback()
        existing = get_mapping(db, destination, evento.id)
        if existing and existing.google_event_id == expected_id:
            return reconcile_item(db=db, destination=destination, evento=evento, payload=payload)
        raise GoogleCalendarError("Conflito ao registrar mapping Google.", 409)
    except GoogleCalendarError:
        db.rollback()
        if mapping:
            mapping.sync_status = "error"
            mapping.last_error = "google_operation_failed"
            db.add(mapping)
            db.commit()
        raise


def reconcile_physical_deletes(*, db, destination: GoogleCalendarDestination) -> list[ReconciliationResult]:
    destination.validate()
    mappings = db.query(GoogleCalendarEventMapping).filter(
        GoogleCalendarEventMapping.clinica_id == destination.clinica_id,
        GoogleCalendarEventMapping.google_account_sub == destination.google_account_sub,
        GoogleCalendarEventMapping.calendar_id == destination.calendar_id,
        GoogleCalendarEventMapping.sync_status.in_(["synced", "error"]),
    ).all()
    results = []
    for mapping in mappings:
        exists = db.query(AgendaLegadoEvento.id).filter(
            AgendaLegadoEvento.clinica_id == destination.clinica_id,
            AgendaLegadoEvento.id == mapping.agenda_id,
        ).first()
        if exists:
            continue
        try:
            delete_google_calendar_event(access_token=destination.access_token, calendar_id=destination.calendar_id, event_id=mapping.google_event_id)
        except GoogleCalendarError as exc:
            if exc.status_code != 404:
                _mark_mapping(db, mapping, status="error", error="physical_delete_failed")
                db.commit()
                raise
        _mark_mapping(db, mapping, status="deleted")
        results.append(ReconciliationResult("deleted", mapping.agenda_id, mapping.google_event_id))
    db.commit()
    return results


def reconcile_cancellations(*, db, destination: GoogleCalendarDestination) -> list[ReconciliationResult]:
    """Reconcile statuses 2/5 independently of the preview date/filter scope."""
    destination.validate()
    mappings = db.query(GoogleCalendarEventMapping).filter(
        GoogleCalendarEventMapping.clinica_id == destination.clinica_id,
        GoogleCalendarEventMapping.google_account_sub == destination.google_account_sub,
        GoogleCalendarEventMapping.calendar_id == destination.calendar_id,
        GoogleCalendarEventMapping.sync_status.in_(["synced", "error"]),
    ).all()
    results = []
    for mapping in mappings:
        event = db.query(AgendaLegadoEvento).filter(
            AgendaLegadoEvento.clinica_id == destination.clinica_id,
            AgendaLegadoEvento.id == mapping.agenda_id,
        ).first()
        if event is not None and event.status in CANCELLATION_STATUSES:
            results.append(reconcile_item(db=db, destination=destination, evento=event, payload={}))
    return results
