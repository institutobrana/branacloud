"""Creation adapter only. No lifecycle, stock, finance or catalog writes."""
from fastapi import HTTPException
from sqlalchemy import text

from schemas.odontograma_schema import OcorrenciaCommandPayload
from security.admin_password import verify_admin_password
from security.jwt_handler import decode_token
from security.permissions import get_module_access_level, parse_permissions_json
from services.clinical_patient_lease_guard import require_clinical_patient_lease_owner
from services.fc4_occurrence_foundation import FACE_BITS, _id, persist_normalized_command


def require_create_permission(db, user, request):
    """Reuse official function metadata/levels and protected module credentials.

    Omitted function inherits its module, as PermissionMatrix already displays.
    Explicit function denial applies also to admins (admin is never a tenant grant).
    No new grant/token/RBAC namespace is introduced.
    """
    module = get_module_access_level(user, "procedimentos")
    functions = parse_permissions_json(getattr(user, "permissoes_json", None)).get("functions", {})
    scoped = functions.get("procedimentos", {}) if isinstance(functions, dict) else {}
    level = scoped.get("inserir_intervencoes", module) if isinstance(scoped, dict) else "desabilitado"
    if module == "desabilitado" or level not in ("habilitado", "protegido"):
        raise HTTPException(403, "Execução de inserir_intervencoes não autorizada.")
    if level == "habilitado" and module == "habilitado":
        return
    password = (request.headers.get("X-Protected-Password") or "").strip()
    if password and verify_admin_password(db, user.clinica_id, password):
        return
    token = request.headers.get("X-Protected-Grant") or ""
    grant = decode_token(token) if token else None
    if isinstance(grant, dict) and grant.get("type") == "protected_grant":
        if (grant.get("user_id") == user.id and grant.get("clinica_id") == user.clinica_id
                and str(grant.get("module_code", "")).lower() in ("*", "procedimentos")):
            return
    raise HTTPException(403, {"error": "protected_password_required",
                             "module_code": "procedimentos",
                             "function_code": "inserir_intervencoes"})


def create_occurrence_command(db, user, payload, request, instance_id, lease_token):
    """Caller commits once, after this returns. Failure must rollback caller Session."""
    payload = OcorrenciaCommandPayload.model_validate(payload)
    try:
        clinic = _id(getattr(user, "clinica_id", None))
        _id(getattr(user, "id", None))
        for identifier in (payload.paciente_id, payload.tratamento_id, payload.procedimento_id):
            _id(identifier)
    except ValueError:
        raise HTTPException(403, "Clinica/recurso fora do contexto do usuario.")
    if payload.mode == "GRAVA_ESTA" and len(payload.targets) != 1:
        raise HTTPException(422, "Grava esta confirma somente uma unidade.")
    require_create_permission(db, user, request)
    require_clinical_patient_lease_owner(db, user, payload.paciente_id, instance_id, lease_token)
    conn = db.connection()
    treatment = conn.execute(text("""
        SELECT source_payload FROM tratamento
        WHERE id=:t AND clinica_id=:c AND paciente_id=:p FOR UPDATE
    """), {"t": payload.tratamento_id, "c": clinic, "p": payload.paciente_id}).mappings().first()
    if treatment is None:
        raise HTTPException(404, "Tratamento nao encontrado no contexto do paciente.")
    receipt = conn.execute(text("""
        SELECT 1 FROM odontograma_comandos WHERE clinica_id=:c AND command_id=:cmd
    """), {"c": clinic, "cmd": payload.command_id}).first()
    # Fail closed, not a new approval policy: revision adapter is a separate P2 gate.
    source = treatment["source_payload"] or {}
    budget = source.get("orcamento", {}) if isinstance(source, dict) else {}
    if not receipt and isinstance(budget, dict) and budget.get("aprovado"):
        raise HTTPException(409, {"code": "FC4_BUDGET_REVISION_ADAPTER_REQUIRED"})
    units = [{"type": target.type, "slots": target.slots or [],
              "faces_mask": sum(FACE_BITS[face] for face in target.faces)}
             for target in payload.targets]
    ids = persist_normalized_command(
        conn, user, payload.command_id, paciente_id=payload.paciente_id,
        tratamento_id=payload.tratamento_id, procedimento_id=payload.procedimento_id,
        targets=units, prestador_id=payload.prestador_id, status=payload.status,
        data_clinica=payload.data_clinica, valor_proprio=payload.valor_proprio,
        repasse_proprio=payload.repasse_proprio, contexto=payload.contexto,
        operation=payload.mode,
    )
    # Immutable creation acknowledgement, NOT a mutable read/version for later edit.
    return {"command_id": payload.command_id,
            "ocorrencias": [{"id": identifier, "versao_inicial": 1} for identifier in ids]}
