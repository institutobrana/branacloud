import json
import os
import unittest
from datetime import datetime, timedelta
from unittest.mock import patch

from cryptography.fernet import Fernet

os.environ.setdefault("JWT_SECRET_KEY", "test-google-calendar-r9a")
os.environ.setdefault("GOOGLE_TOKEN_ENCRYPTION_KEY", Fernet.generate_key().decode("ascii"))

from database import SessionLocal
# Register the related mapper before querying Usuario; this mirrors backend startup.
from models.tiss_tipo_tabela import TissTipoTabela  # noqa: F401
from models.usuario import Usuario
from routes.auth_routes import google_calendar_callback
from security.jwt_handler import create_access_token
from services.google_calendar_service import (
    decrypt_google_token,
    encrypt_google_token,
    oauth_state_digest,
)


class GoogleCalendarCallbackHandlerTests(unittest.TestCase):
    """R9A: callback real, persistência real e consumo single-use do state."""

    def _user_snapshot(self):
        db = SessionLocal()
        try:
            user = db.query(Usuario).order_by(Usuario.id).first()
            if not user:
                self.skipTest("nenhum usuário disponível para fixture temporária")
            return int(user.id), int(user.clinica_id), user.preferencias_usuario_json
        finally:
            db.close()

    def _state(self, user_id, clinica_id):
        return create_access_token(
            {
                "type": "google_calendar_oauth",
                "user_id": user_id,
                "clinica_id": clinica_id,
                "nonce": "r9a-test-nonce",
            },
            expires_minutes=5,
        )

    def _seed_state(self, user_id, raw_state, *, expired=False, existing=None):
        db = SessionLocal()
        try:
            user = db.query(Usuario).filter(Usuario.id == user_id).first()
            prefs = json.loads(user.preferencias_usuario_json or "{}")
            prefs["r9a_sentinel"] = "preserve-me"
            prefs["google_calendar_oauth_state"] = {
                "digest": oauth_state_digest(raw_state),
                "expires_at": (datetime.utcnow() - timedelta(minutes=1) if expired else datetime.utcnow() + timedelta(minutes=10)).isoformat(),
            }
            if existing:
                prefs["google_calendar_sync"] = existing
            user.preferencias_usuario_json = json.dumps(prefs, ensure_ascii=False)
            db.commit()
        finally:
            db.close()

    def _restore(self, user_id, original):
        db = SessionLocal()
        try:
            user = db.query(Usuario).filter(Usuario.id == user_id).first()
            user.preferencias_usuario_json = original
            db.commit()
        finally:
            db.close()

    def _prefs(self, user_id):
        db = SessionLocal()
        try:
            value = db.query(Usuario.preferencias_usuario_json).filter(Usuario.id == user_id).scalar()
            return json.loads(value or "{}")
        finally:
            db.close()

    def test_invalid_inputs_are_rejected_without_google_call(self):
        for kwargs in ({"state": None, "code": "x"}, {"state": "", "code": "x"}, {"state": "x", "code": None}):
            with self.subTest(kwargs=kwargs), patch("routes.auth_routes.exchange_google_calendar_code") as exchange:
                response = google_calendar_callback(db=None, **kwargs)
                self.assertIn("error", response.body.decode("utf-8"))
                exchange.assert_not_called()

    def test_expired_and_reused_state_are_rejected(self):
        user_id, clinic_id, original = self._user_snapshot()
        state = self._state(user_id, clinic_id)
        try:
            self._seed_state(user_id, state, expired=True)
            expired_db = SessionLocal()
            try:
                response = google_calendar_callback(code="fake-code", state=state, db=expired_db)
            finally:
                expired_db.close()
            self.assertIn("error", response.body.decode("utf-8"))

            self._seed_state(user_id, state)
            with patch("routes.auth_routes.exchange_google_calendar_code", return_value={"access_token": "r9a-access", "refresh_token": "r9a-refresh", "expires_in": 3600}), patch(
                "routes.auth_routes.fetch_google_calendar_primary",
                return_value={"id": "primary", "summary": "Agenda principal", "timeZone": "America/Sao_Paulo"},
            ):
                first_db = SessionLocal()
                try:
                    first = google_calendar_callback(code="fake-code", state=state, db=first_db)
                finally:
                    first_db.close()
            self.assertIn('"status": "ok"', first.body.decode("utf-8"))
            second_db = SessionLocal()
            try:
                second = google_calendar_callback(code="fake-code", state=state, db=second_db)
            finally:
                second_db.close()
            self.assertIn("error", second.body.decode("utf-8"))
        finally:
            self._restore(user_id, original)

    def test_real_callback_consumes_state_and_persists_encrypted_tokens(self):
        user_id, clinic_id, original = self._user_snapshot()
        state = self._state(user_id, clinic_id)
        try:
            self._seed_state(user_id, state)
            with patch("routes.auth_routes.exchange_google_calendar_code", return_value={
                "access_token": "r9a-access-secret",
                "refresh_token": "r9a-refresh-secret",
                "expires_in": 3600,
                "scope": "calendar",
            }) as exchange, patch(
                "routes.auth_routes.fetch_google_calendar_primary",
                return_value={"id": "primary", "summary": "Agenda principal", "timeZone": "America/Sao_Paulo"},
            ) as calendar:
                db = SessionLocal()
                try:
                    response = google_calendar_callback(code="fake-code", state=state, db=db)
                finally:
                    db.close()
            self.assertIn('"status": "ok"', response.body.decode("utf-8"))
            self.assertNotIn("r9a-access-secret", response.body.decode("utf-8"))
            self.assertNotIn("r9a-refresh-secret", response.body.decode("utf-8"))
            exchange.assert_called_once_with("fake-code")
            calendar.assert_called_once_with("r9a-access-secret")

            prefs = self._prefs(user_id)
            self.assertEqual(prefs["r9a_sentinel"], "preserve-me")
            self.assertNotIn("google_calendar_oauth_state", prefs)
            cfg = prefs["google_calendar_sync"]
            self.assertNotEqual(cfg["access_token_enc"], "r9a-access-secret")
            self.assertNotEqual(cfg["refresh_token_enc"], "r9a-refresh-secret")
            self.assertEqual(decrypt_google_token(cfg["access_token_enc"]), "r9a-access-secret")
            self.assertEqual(decrypt_google_token(cfg["refresh_token_enc"]), "r9a-refresh-secret")
            self.assertEqual(cfg["account_sub"], "")
        finally:
            self._restore(user_id, original)

    def test_callback_persists_verified_account_sub(self):
        user_id, clinic_id, original = self._user_snapshot()
        state = self._state(user_id, clinic_id)
        try:
            self._seed_state(user_id, state)
            with patch("routes.auth_routes.verify_google_id_token", return_value={
                "sub": "google-sub-test",
                "email": "institutobrana@gmail.com",
            }), patch("routes.auth_routes.exchange_google_calendar_code", return_value={
                "access_token": "sub-access",
                "refresh_token": "sub-refresh",
                "expires_in": 3600,
                "id_token": "verified-id-token",
            }), patch(
                "routes.auth_routes.fetch_google_calendar_primary",
                return_value={"id": "primary", "summary": "Agenda principal", "timeZone": "America/Sao_Paulo"},
            ):
                db = SessionLocal()
                try:
                    response = google_calendar_callback(code="fake-code", state=state, db=db)
                finally:
                    db.close()
            self.assertIn('"status": "ok"', response.body.decode("utf-8"))
            self.assertEqual(self._prefs(user_id)["google_calendar_sync"]["account_sub"], "google-sub-test")
        finally:
            self._restore(user_id, original)

    def test_callback_error_after_state_validation_is_not_reusable(self):
        user_id, clinic_id, original = self._user_snapshot()
        state = self._state(user_id, clinic_id)
        try:
            self._seed_state(user_id, state)
            with patch("routes.auth_routes.exchange_google_calendar_code", side_effect=RuntimeError("external failure")):
                db = SessionLocal()
                try:
                    response = google_calendar_callback(code="fake-code", state=state, db=db)
                finally:
                    db.close()
            self.assertIn("error", response.body.decode("utf-8"))
            self.assertNotIn("fake-code", response.body.decode("utf-8"))
            second_db = SessionLocal()
            try:
                second = google_calendar_callback(code="fake-code", state=state, db=second_db)
            finally:
                second_db.close()
            self.assertIn("error", second.body.decode("utf-8"))
            self.assertNotIn("google_calendar_oauth_state", self._prefs(user_id))
        finally:
            self._restore(user_id, original)

    def test_wrong_clinic_state_is_rejected_by_real_user_lookup(self):
        user_id, clinic_id, original = self._user_snapshot()
        state = self._state(user_id, clinic_id + 999999)
        try:
            db = SessionLocal()
            try:
                response = google_calendar_callback(code="fake-code", state=state, db=db)
            finally:
                db.close()
            self.assertIn("error", response.body.decode("utf-8"))
        finally:
            self._restore(user_id, original)


if __name__ == "__main__":
    unittest.main()
