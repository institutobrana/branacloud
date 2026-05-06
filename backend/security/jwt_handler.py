import os
from datetime import datetime, timedelta
from jose import JWTError, jwt

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60


def _get_secret_key() -> str:
    secret = (os.getenv("JWT_SECRET_KEY") or "").strip()
    if not secret:
        raise RuntimeError("JWT_SECRET_KEY nao configurado no ambiente.")
    return secret


def create_access_token(data: dict, expires_minutes: int = ACCESS_TOKEN_EXPIRE_MINUTES):
    to_encode = data.copy()
    ttl = max(1, int(expires_minutes or ACCESS_TOKEN_EXPIRE_MINUTES))
    expire = datetime.utcnow() + timedelta(minutes=ttl)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, _get_secret_key(), algorithm=ALGORITHM)


def decode_token(token: str):
    try:
        payload = jwt.decode(token, _get_secret_key(), algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
