from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from database import get_db
from models.usuario import Usuario
from schemas.odontograma_schema import (
    OdontogramaArcadaSlotsResponse,
    OdontogramaIntervencoesResponse,
    OdontogramaListaStatusResponse,
    OdontogramaResumoResponse,
)
from security.dependencies import get_current_user
from services.odontograma_service import (
    listar_arcada_slots_leitura,
    listar_intervencoes_leitura,
    listar_status_leitura,
    montar_resumo_leitura,
)

router = APIRouter(
    prefix="/odontograma",
    tags=["odontograma"],
)


def _resolver_clinica_id(current_user: Usuario, clinica_id: int | None) -> int:
    if clinica_id is None:
        return int(current_user.clinica_id)
    alvo = int(clinica_id)
    if not getattr(current_user, "is_admin", False) and alvo != int(current_user.clinica_id):
        raise HTTPException(status_code=403, detail="Clinica fora do contexto do usuario.")
    return alvo


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
