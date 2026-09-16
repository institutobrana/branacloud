import json
import threading
import unittest
from datetime import datetime

from sqlalchemy import text
from database import SessionLocal


class GoogleStateConcurrencyTests(unittest.TestCase):
    def test_postgres_row_lock_allows_one_consumer(self):
        seed = SessionLocal()
        original = None
        user_id = None
        try:
            row = seed.execute(text("select id, preferencias_usuario_json from usuarios order by id limit 1")).first()
            if not row:
                self.skipTest("nenhum usuário disponível")
            user_id, original = int(row[0]), row[1]
            prefs = json.loads(original or "{}")
            prefs["google_calendar_oauth_state"] = {"digest": "concurrency-test", "expires_at": datetime.utcnow().isoformat()}
            seed.execute(text("update usuarios set preferencias_usuario_json=:prefs where id=:id"), {"prefs": json.dumps(prefs), "id": user_id})
            seed.commit()
        finally:
            seed.close()

        barrier = threading.Barrier(2)
        results = []
        def consume():
            db = SessionLocal()
            try:
                barrier.wait(timeout=5)
                item = db.execute(text("select preferencias_usuario_json from usuarios where id=:id for update"), {"id": user_id}).scalar()
                current = json.loads(item or "{}")
                state = current.get("google_calendar_oauth_state")
                if state and state.get("digest") == "concurrency-test":
                    current.pop("google_calendar_oauth_state", None)
                    db.execute(text("update usuarios set preferencias_usuario_json=:prefs where id=:id"), {"prefs": json.dumps(current), "id": user_id})
                    db.commit(); results.append("success")
                else:
                    db.rollback(); results.append("reject")
            finally:
                db.close()
        try:
            a, b = threading.Thread(target=consume), threading.Thread(target=consume)
            a.start(); b.start(); a.join(10); b.join(10)
            self.assertEqual(results.count("success"), 1)
            self.assertEqual(results.count("reject"), 1)
        finally:
            cleanup = SessionLocal()
            try:
                cleanup.execute(text("update usuarios set preferencias_usuario_json=:prefs where id=:id"), {"prefs": original, "id": user_id})
                cleanup.commit()
            finally:
                cleanup.close()
