from urllib.parse import quote
from typing import Mapping


def resolve_database_url(env: Mapping[str, str] | None = None) -> str:
    env_map = env or {}

    database_url = str(env_map.get("DATABASE_URL") or "").strip()
    if database_url:
        return database_url

    required_keys = ("DB_HOST", "DB_NAME", "DB_USER", "DB_PASSWORD")
    missing = [key for key in required_keys if not str(env_map.get(key) or "").strip()]
    if missing:
        missing_text = ", ".join(missing)
        raise RuntimeError(f"Variaveis obrigatorias ausentes: {missing_text}")

    host = str(env_map.get("DB_HOST") or "").strip()
    port = str(env_map.get("DB_PORT") or "").strip() or "5432"
    database_name = str(env_map.get("DB_NAME") or "").strip()
    username = str(env_map.get("DB_USER") or "").strip()
    password = str(env_map.get("DB_PASSWORD") or "").strip()

    return (
        "postgresql+psycopg2://"
        f"{quote(username, safe='')}:{quote(password, safe='')}@"
        f"{host}:{port}/{database_name}"
    )
