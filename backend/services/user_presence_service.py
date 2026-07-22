"""Registro centralizado de atividade autenticada de usuarios."""

from __future__ import annotations

import logging
from datetime import datetime, timedelta, timezone

from sqlalchemy import text
from sqlalchemy.orm import Session

from database import SessionLocal

logger = logging.getLogger(__name__)

PRESENCE_WRITE_THROTTLE_SECONDS = 60
ONLINE_WINDOW_SECONDS = 180


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def _as_aware_utc(value: datetime | None) -> datetime | None:
    if value is None:
        return None
    if value.tzinfo is None or value.tzinfo.utcoffset(value) is None:
        return value.replace(tzinfo=timezone.utc)
    return value.astimezone(timezone.utc)


def should_update_last_seen(
    last_seen_at: datetime | None,
    *,
    now: datetime | None = None,
    throttle_seconds: int = PRESENCE_WRITE_THROTTLE_SECONDS,
) -> bool:
    current = _as_aware_utc(last_seen_at)
    if current is None:
        return True
    reference = _as_aware_utc(now) or utc_now()
    return current <= reference - timedelta(seconds=throttle_seconds)


def mark_user_activity(
    usuario,
    db: Session | None = None,
    *,
    force: bool = False,
    isolated_session: bool = True,
    now: datetime | None = None,
) -> bool:
    """Atualiza usuarios.last_seen_at quando a regra de throttle permitir."""

    if usuario is None or bool(getattr(usuario, "is_system_user", False)):
        return False

    user_id = int(getattr(usuario, "id", 0) or 0)
    if user_id <= 0:
        return False

    current_now = _as_aware_utc(now) or utc_now()

    if not isolated_session:
        if db is None:
            raise ValueError("db e obrigatorio quando isolated_session=False")
        if not force and not should_update_last_seen(getattr(usuario, "last_seen_at", None), now=current_now):
            return False
        usuario.last_seen_at = current_now
        return True

    session_factory = getattr(mark_user_activity, "session_factory", SessionLocal)
    presence_db = session_factory()
    try:
        if force:
            result = presence_db.execute(
                text(
                    """
                    UPDATE usuarios
                    SET last_seen_at = :now
                    WHERE id = :user_id
                      AND COALESCE(is_system_user, FALSE) = FALSE
                    """
                ),
                {"now": current_now, "user_id": user_id},
            )
        else:
            threshold = current_now - timedelta(seconds=PRESENCE_WRITE_THROTTLE_SECONDS)
            result = presence_db.execute(
                text(
                    """
                    UPDATE usuarios
                    SET last_seen_at = :now
                    WHERE id = :user_id
                      AND COALESCE(is_system_user, FALSE) = FALSE
                      AND (last_seen_at IS NULL OR last_seen_at <= :threshold)
                    """
                ),
                {"now": current_now, "user_id": user_id, "threshold": threshold},
            )
        updated = int(getattr(result, "rowcount", 0) or 0) > 0
        if updated:
            presence_db.commit()
        else:
            presence_db.rollback()
        return updated
    finally:
        presence_db.close()


def mark_user_activity_fail_open(
    usuario,
    db: Session | None = None,
    *,
    force: bool = False,
    isolated_session: bool = True,
    now: datetime | None = None,
) -> bool:
    try:
        return mark_user_activity(
            usuario,
            db,
            force=force,
            isolated_session=isolated_session,
            now=now,
        )
    except Exception as exc:
        logger.warning(
            "Falha auxiliar ao registrar presenca autenticada: user_id=%s error=%s",
            getattr(usuario, "id", None),
            exc.__class__.__name__,
        )
        return False
