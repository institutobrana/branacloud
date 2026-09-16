from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy.orm import Session

from database import get_db
from models.usuario import Usuario
from schemas.historico_paciente_schema import (
    HistoricoPacienteCreate,
    HistoricoPacienteInlineUpdate,
    HistoricoPacientePropertiesUpdate,
    HistoricoPacienteResponse,
)
from security.dependencies import get_current_user, require_module_access
from services.historico_paciente_service import (
    atualizar,
    criar,
    listar,
    obter,
    remover,
)

router = APIRouter(
    prefix="/cadastros/pacientes/{paciente_id}/historico",
    tags=["historico-paciente"],
    dependencies=[Depends(require_module_access("procedimentos"))],
)


@router.get("", response_model=list[HistoricoPacienteResponse])
def listar_historico(
    paciente_id: int,
    order: str = Query("asc", pattern="^(asc|desc)$"),
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return listar(db, int(current_user.clinica_id), paciente_id, descending=order == "desc")


@router.get("/{item_id}", response_model=HistoricoPacienteResponse)
def obter_historico(
    paciente_id: int,
    item_id: int,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return obter(db, int(current_user.clinica_id), paciente_id, item_id)


@router.post("", response_model=HistoricoPacienteResponse, status_code=status.HTTP_201_CREATED)
def criar_historico(
    paciente_id: int,
    payload: HistoricoPacienteCreate,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return criar(db, current_user, paciente_id, payload)


@router.patch("/{item_id}", response_model=HistoricoPacienteResponse)
def atualizar_historico_inline(
    paciente_id: int,
    item_id: int,
    payload: HistoricoPacienteInlineUpdate,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    item = obter(db, int(current_user.clinica_id), paciente_id, item_id)
    return atualizar(db, current_user, item, payload)


@router.put("/{item_id}/propriedades", response_model=HistoricoPacienteResponse)
def atualizar_propriedades_historico(
    paciente_id: int,
    item_id: int,
    payload: HistoricoPacientePropertiesUpdate,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    item = obter(db, int(current_user.clinica_id), paciente_id, item_id)
    return atualizar(db, current_user, item, payload, properties=True)


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def excluir_historico(
    paciente_id: int,
    item_id: int,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    item = obter(db, int(current_user.clinica_id), paciente_id, item_id)
    remover(db, item)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
