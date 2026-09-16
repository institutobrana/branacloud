import json

from security.permissions import parse_permissions_json, sanitize_permissions
from security.system_accounts import is_system_user
from security.superadmin import is_owner_email


def _load_preferencias_json(usuario) -> dict:
    raw = str(getattr(usuario, "preferencias_usuario_json", "") or "").strip()
    if not raw:
        return {}
    try:
        parsed = json.loads(raw)
    except Exception:
        return {}
    return parsed if isinstance(parsed, dict) else {}


def build_user_context(usuario, *, is_superadmin: bool = False) -> dict:
    owner = is_owner_email(getattr(usuario, "email", None))
    preferencias = _load_preferencias_json(usuario)
    gerais = preferencias.get("geral") if isinstance(preferencias.get("geral"), dict) else {}
    permissoes = sanitize_permissions(
        parse_permissions_json(getattr(usuario, "permissoes_json", None)),
        tipo_usuario=getattr(usuario, "tipo_usuario", None),
        is_admin=bool(getattr(usuario, "is_admin", False)),
    )
    return {
        "id": getattr(usuario, "id", None),
        "codigo": getattr(usuario, "codigo", None),
        "nome": getattr(usuario, "nome", None),
        "apelido": getattr(usuario, "apelido", None),
        "tipo_usuario": getattr(usuario, "tipo_usuario", None),
        "email": getattr(usuario, "email", None),
        "clinica_id": getattr(usuario, "clinica_id", None),
        "prestador_id": getattr(usuario, "prestador_id", None),
        "unidade_atendimento_id": getattr(usuario, "unidade_atendimento_id", None),
        "is_system_user": is_system_user(usuario),
        "is_master": owner,
        "is_admin": True if is_superadmin else bool(getattr(usuario, "is_admin", False)),
        "is_superadmin": bool(is_superadmin or owner),
        "ativo": bool(getattr(usuario, "ativo", False)),
        "forcar_troca_senha": bool(getattr(usuario, "forcar_troca_senha", False)),
        "setup_completed": bool(getattr(usuario, "setup_completed", False)),
        "permissoes": permissoes,
        "preferencias_usuario_json": preferencias,
        "preferencias_gerais": gerais,
    }
