from sqlalchemy import create_engine
from sqlalchemy import text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
import threading
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

_USER_AUTH_SCHEMA_READY = False
_USER_AUTH_SCHEMA_LOCK = threading.Lock()


def ensure_user_auth_schema():
    global _USER_AUTH_SCHEMA_READY
    if _USER_AUTH_SCHEMA_READY:
        return
    with _USER_AUTH_SCHEMA_LOCK:
        if _USER_AUTH_SCHEMA_READY:
            return
        try:
            with engine.begin() as conn:
                conn.execute(
                    text(
                        "ALTER TABLE IF EXISTS usuarios "
                        "ADD COLUMN IF NOT EXISTS senha_interna_hash TEXT"
                    )
                )
        except Exception:
            return
        _USER_AUTH_SCHEMA_READY = True


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
