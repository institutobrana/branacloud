from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.usuario import Usuario
from security.dependencies import get_current_user, require_module_access
from schemas.orcamento_schema import (
    OrcamentoAprovacaoPayload,
    OrcamentoImpressaoPayload,
    OrcamentoIntervencaoUpdatePayload,
    OrcamentoParcelaUpdatePayload,
)
from services.orcamento_service import (
    atualizar_intervencao_orcamento,
    atualizar_parcela_orcamento_service,
    aprovar_orcamento_service,
    carregar_orcamento,
    listar_tratamentos_orcamento,
    preparar_impressao_orcamento_service,
)
from services.clinical_patient_lease_guard import require_clinical_patient_lease_owner
from models.tratamento import Tratamento


router = APIRouter(
    prefix="/orcamento",
    tags=["orcamento"],
    dependencies=[
        Depends(require_module_access("procedimentos")),
        Depends(require_module_access("financeiro")),
    ],
)


@router.get("/pacientes/{paciente_id}/tratamentos")
def listar_tratamentos_do_paciente(
    paciente_id: int,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return {
        "itens": listar_tratamentos_orcamento(db, current_user, int(paciente_id)),
    }


@router.get("/tratamentos/{tratamento_id}")
def obter_orcamento_do_tratamento(
    tratamento_id: int,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return carregar_orcamento(db, current_user, int(tratamento_id))


@router.patch("/tratamentos/{tratamento_id}/intervencoes/{intervencao_id}")
def alterar_intervencao_do_orcamento(
    tratamento_id: int,
    intervencao_id: int,
    payload: OrcamentoIntervencaoUpdatePayload,
    x_session_instance_id: str = Header(..., alias="X-Session-Instance-Id"),
    x_clinical_lease_token: str = Header(..., alias="X-Clinical-Lease-Token"),
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    tratamento = db.query(Tratamento).filter(Tratamento.id == int(tratamento_id), Tratamento.clinica_id == int(current_user.clinica_id)).first()
    if tratamento is None:
        raise HTTPException(status_code=404, detail="Tratamento nao encontrado.")
    require_clinical_patient_lease_owner(db, current_user, int(tratamento.paciente_id), x_session_instance_id, x_clinical_lease_token)
    result = atualizar_intervencao_orcamento(db, current_user, int(tratamento_id), int(intervencao_id), payload, commit=False)
    db.commit()
    return result


@router.patch("/tratamentos/{tratamento_id}/parcelas/{numero_parcela}")
def alterar_parcela_do_orcamento(
    tratamento_id: int,
    numero_parcela: int,
    payload: OrcamentoParcelaUpdatePayload,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return atualizar_parcela_orcamento_service(db, current_user, int(tratamento_id), int(numero_parcela), payload)


@router.post("/tratamentos/{tratamento_id}/aprovar")
def aprovar_orcamento(
    tratamento_id: int,
    payload: OrcamentoAprovacaoPayload,
    x_session_instance_id: str = Header(..., alias="X-Session-Instance-Id"),
    x_clinical_lease_token: str = Header(..., alias="X-Clinical-Lease-Token"),
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    tratamento = db.query(Tratamento).filter(Tratamento.id == int(tratamento_id), Tratamento.clinica_id == int(current_user.clinica_id)).first()
    if tratamento is None:
        raise HTTPException(status_code=404, detail="Tratamento nao encontrado.")
    require_clinical_patient_lease_owner(db, current_user, int(tratamento.paciente_id), x_session_instance_id, x_clinical_lease_token)
    return aprovar_orcamento_service(db, current_user, int(tratamento_id), payload)


@router.post("/tratamentos/{tratamento_id}/impressao")
def preparar_impressao(
    tratamento_id: int,
    payload: OrcamentoImpressaoPayload,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return preparar_impressao_orcamento_service(db, current_user, int(tratamento_id), payload)
