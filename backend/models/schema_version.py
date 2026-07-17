from sqlalchemy import Column, DateTime, Integer, String, Text, UniqueConstraint
from sqlalchemy.sql import func

from database import Base


class SchemaVersion(Base):
    __tablename__ = "brana_schema_versions"
    __table_args__ = (UniqueConstraint("version", name="uq_brana_schema_versions_version"),)

    id = Column(Integer, primary_key=True, index=True)
    version = Column(String(80), nullable=False, index=True)
    checksum = Column(String(128), nullable=False)
    status = Column(String(20), nullable=False, default="running", index=True)
    description = Column(Text, nullable=True)
    executor_version = Column(String(80), nullable=True)
    started_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    finished_at = Column(DateTime(timezone=True), nullable=True)
    applied_at = Column(DateTime(timezone=True), nullable=True)
