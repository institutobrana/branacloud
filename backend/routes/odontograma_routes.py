from fastapi import APIRouter, Depends, Header, HTTPException, Query, Request
from sqlalchemy.exc import DBAPIError
from sqlalchemy.orm import Session

from database import get_db
from models.usuario import Usuario
from schemas.odontograma_schema import OcorrenciaCommandPayload
from services.fc4_occurrence_commands import create_occurrence_command
from services.fc4_occurrence_foundation import CommandConflict
from schemas.odontograma_schema import (
    OdontogramaArcadaSlotsResponse,
    OdontogramaIntervencoesResponse,
    OdontogramaListaStatusResponse,
    OdontogramaResumoResponse,
)
from security.dependencies import get_current_user, require_module_access
from services.odontograma_service import (
    listar_arcada_slots_leitura,
    listar_intervencoes_leitura,
    listar_status_leitura,
    montar_resumo_leitura,
)

router = APIRouter(
    prefix="/odontograma",
    tags=["odontograma"],
    dependencies=[Depends(require_module_access("procedimentos"))],
)


def _resolver_clinica_id(current_user: Usuario, clinica_id: int | None) -> int:
    tenant_id = getattr(current_user, "clinica_id", None)
    if isinstance(tenant_id, bool) or not isinstance(tenant_id, int) or tenant_id <= 0:
        raise HTTPException(status_code=403, detail="Clinica fora do contexto do usuario.")
    if clinica_id is not None and (type(clinica_id) is not int or clinica_id != tenant_id):
        raise HTTPException(status_code=403, detail="Clinica fora do contexto do usuario.")
    return tenant_id


@router.get("/status", response_model=OdontogramaListaStatusResponse)
def status_odontograma(
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    _ = current_user
    return listar_status_leitura(db)


@router.get("/resumo", response_model=OdontogramaResumoResponse)
def resumo_odontograma(
    clinica_id: int = Query(..., ge=1),
    paciente_id: int = Query(..., ge=1),
    tratamento_id: int = Query(..., ge=1),
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    clinica_id = _resolver_clinica_id(current_user, clinica_id)
    return montar_resumo_leitura(db, clinica_id, paciente_id, tratamento_id)


@router.get("/arcada-slots", response_model=OdontogramaArcadaSlotsResponse)
def arcada_slots_odontograma(
    clinica_id: int = Query(..., ge=1),
    paciente_id: int = Query(..., ge=1),
    tratamento_id: int = Query(..., ge=1),
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    clinica_id = _resolver_clinica_id(current_user, clinica_id)
    return listar_arcada_slots_leitura(db, clinica_id, paciente_id, tratamento_id)


@router.get("/intervencoes", response_model=OdontogramaIntervencoesResponse)
def intervencoes_odontograma(
    clinica_id: int = Query(..., ge=1),
    paciente_id: int = Query(..., ge=1),
    tratamento_id: int = Query(..., ge=1),
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    clinica_id = _resolver_clinica_id(current_user, clinica_id)
    return listar_intervencoes_leitura(db, clinica_id, paciente_id, tratamento_id)


@router.post("/comandos")
def confirmar_ocorrencias(
    payload: OcorrenciaCommandPayload,
    request: Request,
    x_session_instance_id: str = Header(..., alias="X-Session-Instance-Id"),
    x_clinical_lease_token: str = Header(..., alias="X-Clinical-Lease-Token"),
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Existing router enforces authenticated official module access for this mutation too.
    try:
        result = create_occurrence_command(db, current_user, payload, request,
                                          x_session_instance_id, x_clinical_lease_token)
        db.commit()  # One collective command, including receipt; never per unit.
        return result
    except CommandConflict:
        db.rollback()
        raise HTTPException(409, {"code": "FC4_COMMAND_PAYLOAD_CONFLICT"})
    except ValueError:
        db.rollback()
        raise HTTPException(422, {"code": "FC4_INVALID_COMMAND"})
    except DBAPIError as error:
        db.rollback()
        state = getattr(error.orig, "pgcode", None)
        if state in ("P0001", "23503", "23514", "22003"):
            raise HTTPException(422, {"code": "FC4_INVALID_SCOPED_TARGET"})
        raise  # Unexpected database failures are not disguised as validation errors.
    except Exception:
        db.rollback()
        raise
