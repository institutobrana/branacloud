"""Isolated registry for bridge installation identities.

This module is deliberately not imported by ``backend.main`` yet.  It stores
only the public DER fingerprint and is intended to sit behind a future
authenticated mTLS/internal channel.
"""

from dataclasses import dataclass
from datetime import datetime, timezone
import re
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from models.bridge_installation import BridgeInstallation


class InstallationIdentityError(ValueError):
    pass


@dataclass(frozen=True)
class InstallationIdentity:
    installation_id: str
    certificate_der_sha256: str
    status: str
    generation: int
    registered_at: datetime


class InstallationIdentityRegistry:
    def __init__(self):
        self._records = {}

    @staticmethod
    def _validate_hash(value):
        if not isinstance(value, str) or not re.fullmatch(r"[0-9a-f]{64}", value):
            raise InstallationIdentityError("INVALID_INSTALLATION_CERTIFICATE_HASH")
        return value

    def register(self, installation_id, certificate_der_sha256):
        fingerprint = self._validate_hash(certificate_der_sha256)
        current = self._records.get(installation_id)
        if current and current.status != "REVOKED":
            raise InstallationIdentityError("INSTALLATION_ALREADY_REGISTERED")
        generation = (current.generation + 1) if current else 1
        record = InstallationIdentity(installation_id, fingerprint, "ACTIVE", generation, datetime.now(timezone.utc))
        self._records[installation_id] = record
        return record

    def revoke(self, installation_id):
        current = self._records.get(installation_id)
        if not current:
            raise InstallationIdentityError("INSTALLATION_NOT_FOUND")
        record = InstallationIdentity(current.installation_id, current.certificate_der_sha256, "REVOKED", current.generation, current.registered_at)
        self._records[installation_id] = record
        return record

    def rotate(self, installation_id, certificate_der_sha256):
        current = self._records.get(installation_id)
        if not current or current.status != "ACTIVE":
            raise InstallationIdentityError("INSTALLATION_NOT_ACTIVE")
        fingerprint = self._validate_hash(certificate_der_sha256)
        record = InstallationIdentity(installation_id, fingerprint, "ACTIVE", current.generation + 1, current.registered_at)
        self._records[installation_id] = record
        return record

    def validate(self, installation_id, peer_certificate_der_sha256):
        current = self._records.get(installation_id)
        if not current or current.status != "ACTIVE":
            return False
        return current.certificate_der_sha256 == peer_certificate_der_sha256

    def lookup_active(self, certificate_der_sha256):
        for record in self._records.values():
            if record.status == "ACTIVE" and record.certificate_der_sha256 == certificate_der_sha256:
                return record.installation_id
        return None


class PersistentInstallationIdentityRegistry:
    """Database-backed registry; every lookup opens a fresh SQL read."""

    def __init__(self, session_factory):
        self.session_factory = session_factory

    def lookup_active(self, certificate_der_sha256):
        InstallationIdentityRegistry._validate_hash(certificate_der_sha256)
        db = self.session_factory()
        try:
            row = db.query(BridgeInstallation).filter(
                BridgeInstallation.certificate_der_sha256 == certificate_der_sha256,
                BridgeInstallation.status == "ACTIVE",
            ).first()
            return row.installation_id if row else None
        finally:
            db.close()

    def register(self, installation_id, certificate_der_sha256):
        fingerprint = InstallationIdentityRegistry._validate_hash(certificate_der_sha256)
        db = self.session_factory()
        try:
            row = db.query(BridgeInstallation).filter_by(installation_id=installation_id).with_for_update().first()
            if row and row.status != "REVOKED":
                raise InstallationIdentityError("INSTALLATION_ALREADY_REGISTERED")
            generation = row.generation + 1 if row else 1
            if row:
                row.certificate_der_sha256 = fingerprint
                row.status = "ACTIVE"
                row.generation = generation
                row.revoked_at = None
            else:
                row = BridgeInstallation(installation_id=installation_id, certificate_der_sha256=fingerprint, generation=generation)
                db.add(row)
            db.flush()
            from models.bridge_installation import BridgeInstallationEvent
            db.add(BridgeInstallationEvent(installation_id=installation_id, event_type="REGISTER", generation=generation, detail_code="REGISTRY_UPDATED"))
            db.commit()
            return row
        except Exception:
            db.rollback()
            raise
        finally:
            db.close()

    def revoke(self, installation_id):
        db = self.session_factory()
        try:
            row = db.query(BridgeInstallation).filter_by(installation_id=installation_id).with_for_update().first()
            if not row:
                raise InstallationIdentityError("INSTALLATION_NOT_FOUND")
            row.status = "REVOKED"
            from models.bridge_installation import BridgeInstallationEvent
            db.add(BridgeInstallationEvent(installation_id=installation_id, event_type="REVOKE", generation=row.generation, detail_code="REGISTRY_UPDATED"))
            db.commit()
            return row
        except Exception:
            db.rollback()
            raise
        finally:
            db.close()

    def rotate(self, installation_id, certificate_der_sha256):
        fingerprint = InstallationIdentityRegistry._validate_hash(certificate_der_sha256)
        db = self.session_factory()
        try:
            row = db.query(BridgeInstallation).filter_by(installation_id=installation_id).with_for_update().first()
            if not row or row.status != "ACTIVE":
                raise InstallationIdentityError("INSTALLATION_NOT_ACTIVE")
            row.certificate_der_sha256 = fingerprint
            row.generation += 1
            from models.bridge_installation import BridgeInstallationEvent
            db.add(BridgeInstallationEvent(installation_id=installation_id, event_type="ROTATE", generation=row.generation, detail_code="REGISTRY_UPDATED"))
            db.commit()
            return row
        except Exception:
            db.rollback()
            raise
        finally:
            db.close()

    def has_active(self):
        db = self.session_factory()
        try:
            return db.query(BridgeInstallation).filter(BridgeInstallation.status == "ACTIVE").first() is not None
        finally:
            db.close()
