from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.sql import func

from database import Base


class BridgeInstallation(Base):
    __tablename__ = "bridge_installations"

    id = Column(Integer, primary_key=True)
    installation_id = Column(String(128), nullable=False, unique=True, index=True)
    certificate_der_sha256 = Column(String(64), nullable=False, unique=True, index=True)
    status = Column(String(16), nullable=False, default="ACTIVE", index=True)
    generation = Column(Integer, nullable=False, default=1)
    valid_from = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    valid_to = Column(DateTime(timezone=True), nullable=True)
    registered_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    revoked_at = Column(DateTime(timezone=True), nullable=True)
    rotated_at = Column(DateTime(timezone=True), nullable=True)


class BridgeInstallationEvent(Base):
    __tablename__ = "bridge_installation_events"

    id = Column(Integer, primary_key=True)
    installation_id = Column(String(128), ForeignKey("bridge_installations.installation_id"), nullable=False, index=True)
    event_type = Column(String(16), nullable=False)
    generation = Column(Integer, nullable=False)
    occurred_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    detail_code = Column(String(80), nullable=True)
