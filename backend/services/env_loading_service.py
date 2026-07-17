from pathlib import Path

from dotenv import load_dotenv

from services.runtime_profile_service import should_load_local_env


def load_backend_env(env_path: Path | None = None) -> bool:
    """Carrega o .env apenas quando o perfil atual permite.

    Retorna True quando houve tentativa de carga local e False quando o perfil
    de execucao bloqueia essa operacao, como em producao.
    """

    if not should_load_local_env():
        return False
    load_dotenv(dotenv_path=env_path, override=False)
    return True
