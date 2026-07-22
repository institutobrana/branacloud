import os
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path
from types import SimpleNamespace
import unittest

from sqlalchemy import Boolean, Column, DateTime, Integer, MetaData, Table, create_engine, text
from sqlalchemy.orm import sessionmaker

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

os.environ.setdefault("DATABASE_URL", "sqlite+pysqlite:///:memory:")
os.environ.setdefault("JWT_SECRET_KEY", "test-secret-key-for-presence-tests")

from models.usuario import Usuario
from scripts import migrar_usuarios_last_seen_at
from services import user_presence_service


class UserPresenceServiceTests(unittest.TestCase):
    def test_model_has_last_seen_at(self):
        self.assertTrue(hasattr(Usuario, "last_seen_at"))
        self.assertTrue(Usuario.last_seen_at.property.columns[0].type.timezone)

    def test_should_update_when_missing(self):
        self.assertTrue(user_presence_service.should_update_last_seen(None))

    def test_should_not_update_before_throttle(self):
        now = datetime(2026, 7, 22, 12, 0, tzinfo=timezone.utc)
        last_seen = now - timedelta(seconds=59)
        self.assertFalse(user_presence_service.should_update_last_seen(last_seen, now=now))

    def test_should_update_at_exact_throttle(self):
        now = datetime(2026, 7, 22, 12, 0, tzinfo=timezone.utc)
        last_seen = now - timedelta(seconds=60)
        self.assertTrue(user_presence_service.should_update_last_seen(last_seen, now=now))

    def test_should_update_after_throttle(self):
        now = datetime(2026, 7, 22, 12, 0, tzinfo=timezone.utc)
        last_seen = now - timedelta(seconds=61)
        self.assertTrue(user_presence_service.should_update_last_seen(last_seen, now=now))

    def test_force_updates_common_user_without_touching_legacy_fields(self):
        user = SimpleNamespace(
            id=10,
            is_system_user=False,
            last_seen_at=None,
            online=False,
            ultimo_login_em=None,
            setup_completed=False,
            ativo=True,
            senha_hash="hash",
        )
        db = SimpleNamespace()
        now = datetime(2026, 7, 22, 12, 0, tzinfo=timezone.utc)

        updated = user_presence_service.mark_user_activity(
            user,
            db,
            force=True,
            isolated_session=False,
            now=now,
        )

        self.assertTrue(updated)
        self.assertEqual(user.last_seen_at, now)
        self.assertFalse(user.online)
        self.assertIsNone(user.ultimo_login_em)
        self.assertFalse(user.setup_completed)
        self.assertTrue(user.ativo)
        self.assertEqual(user.senha_hash, "hash")

    def test_system_user_is_ignored(self):
        user = SimpleNamespace(id=255, is_system_user=True, last_seen_at=None)
        updated = user_presence_service.mark_user_activity(user, object(), force=True, isolated_session=False)
        self.assertFalse(updated)
        self.assertIsNone(user.last_seen_at)

    def test_fail_open_returns_false_when_internal_update_fails(self):
        user = SimpleNamespace(id=1, is_system_user=False)
        original = user_presence_service.mark_user_activity

        def broken_mark(*args, **kwargs):
            raise RuntimeError("database unavailable")

        user_presence_service.mark_user_activity = broken_mark
        try:
            updated = user_presence_service.mark_user_activity_fail_open(user)
        finally:
            user_presence_service.mark_user_activity = original

        self.assertFalse(updated)

    def test_isolated_session_updates_once_inside_throttle(self):
        engine = create_engine("sqlite+pysqlite:///:memory:")
        metadata = MetaData()
        usuarios = Table(
            "usuarios",
            metadata,
            Column("id", Integer, primary_key=True),
            Column("is_system_user", Boolean, nullable=False, default=False),
            Column("last_seen_at", DateTime(timezone=True), nullable=True),
        )
        metadata.create_all(engine)
        SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
        with engine.begin() as conn:
            conn.execute(usuarios.insert().values(id=1, is_system_user=False, last_seen_at=None))

        original_factory = getattr(user_presence_service.mark_user_activity, "session_factory", None)
        user_presence_service.mark_user_activity.session_factory = SessionLocal
        user = SimpleNamespace(id=1, is_system_user=False)
        now = datetime(2026, 7, 22, 12, 0, tzinfo=timezone.utc)
        try:
            first = user_presence_service.mark_user_activity(user, now=now)
            second = user_presence_service.mark_user_activity(user, now=now + timedelta(seconds=30))
            third = user_presence_service.mark_user_activity(user, now=now + timedelta(seconds=60))
        finally:
            if original_factory is None:
                delattr(user_presence_service.mark_user_activity, "session_factory")
            else:
                user_presence_service.mark_user_activity.session_factory = original_factory

        self.assertTrue(first)
        self.assertFalse(second)
        self.assertTrue(third)
        with engine.connect() as conn:
            last_seen = conn.execute(text("SELECT last_seen_at FROM usuarios WHERE id = 1")).scalar_one()
        self.assertIsNotNone(last_seen)

    def test_migration_upgrade_nullable_without_backfill_and_downgrade(self):
        engine = create_engine("sqlite+pysqlite:///:memory:")
        with engine.begin() as conn:
            conn.execute(text("CREATE TABLE usuarios (id INTEGER PRIMARY KEY, nome TEXT)"))
            conn.execute(text("INSERT INTO usuarios (id, nome) VALUES (1, 'Usuario antigo')"))

        original_engine = migrar_usuarios_last_seen_at.engine
        migrar_usuarios_last_seen_at.engine = engine
        try:
            migrar_usuarios_last_seen_at.upgrade()
            with engine.connect() as conn:
                columns = {col["name"]: col for col in migrar_usuarios_last_seen_at.inspect(conn).get_columns("usuarios")}
                value = conn.execute(text("SELECT last_seen_at FROM usuarios WHERE id = 1")).scalar_one()
            self.assertIn("last_seen_at", columns)
            self.assertTrue(columns["last_seen_at"]["nullable"])
            self.assertIsNone(value)

            migrar_usuarios_last_seen_at.downgrade()
            with engine.connect() as conn:
                columns_after = {col["name"] for col in migrar_usuarios_last_seen_at.inspect(conn).get_columns("usuarios")}
            self.assertNotIn("last_seen_at", columns_after)
            self.assertIn("id", columns_after)
            self.assertIn("nome", columns_after)
        finally:
            migrar_usuarios_last_seen_at.engine = original_engine


if __name__ == "__main__":
    unittest.main()
