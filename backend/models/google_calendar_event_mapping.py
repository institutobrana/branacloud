from sqlalchemy import CheckConstraint, Column, DateTime, ForeignKey, Index, Integer, String, UniqueConstraint

from database import Base


class GoogleCalendarEventMapping(Base):
    __tablename__ = "google_calendar_event_mapping"
    __table_args__ = (
        CheckConstraint(
            "sync_status IN ('synced', 'deleted', 'error')",
            name="ck_google_calendar_mapping_sync_status",
        ),
        UniqueConstraint(
            "clinica_id", "google_account_sub", "calendar_id", "agenda_id",
            name="uq_google_calendar_mapping_destination",
        ),
        Index("ix_google_calendar_mapping_destination_event", "google_account_sub", "calendar_id", "google_event_id"),
    )

    id = Column(Integer, primary_key=True, index=True)
    clinica_id = Column(Integer, ForeignKey("clinicas.id", ondelete="CASCADE"), nullable=False, index=True)
    # Deliberately no FK to agenda_legado_evento: physical deletion must leave the mapping
    # available for reconciliation.
    google_account_sub = Column(String(255), nullable=False)
    calendar_id = Column(String(255), nullable=False)
    agenda_id = Column(Integer, nullable=False, index=True)
    google_event_id = Column(String(255), nullable=False, index=True)
    last_sync_at = Column(DateTime(timezone=True), nullable=True)
    sync_status = Column(String(20), nullable=False, default="synced", index=True)
    last_error = Column(String(2000), nullable=True)
