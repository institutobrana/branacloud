from collections import defaultdict

from sqlalchemy.orm import Session

from contracts.odontograma_contract import (
    OdontogramaArcadaSlotContract,
    OdontogramaDenteContract,
    OdontogramaFaceContract,
    OdontogramaIntervencaoContract,
    OdontogramaIntervencaoStatusContract,
    OdontogramaResumoLeituraContract,
)
from repositories.odontograma_repository import (
    listar_arcada_slots,
    listar_faces_por_intervencao_ids,
    listar_intervencoes_com_relacoes,
    listar_status,
)
from schemas.odontograma_schema import (
    OdontogramaArcadaSlotSchema,
    OdontogramaArcadaSlotsResponse,
    OdontogramaDenteSchema,
    OdontogramaFaceSchema,
    OdontogramaIntervencaoSchema,
    OdontogramaIntervencoesResponse,
    OdontogramaIntervencaoStatusSchema,
    OdontogramaListaStatusResponse,
    OdontogramaResumoResponse,
    OdontogramaResumoSchema,
)


def _to_status_schema(status) -> OdontogramaIntervencaoStatusSchema:
    return OdontogramaIntervencaoStatusSchema.model_validate(status)


def _to_slot_schema(slot) -> OdontogramaArcadaSlotSchema:
    return OdontogramaArcadaSlotSchema.model_validate(slot)


def _to_dente_schema(dente) -> OdontogramaDenteSchema:
    return OdontogramaDenteSchema.model_validate(dente)


def _to_face_schema(face) -> OdontogramaFaceSchema:
    return OdontogramaFaceSchema.model_validate(face)


def _to_intervencao_schema(intervencao) -> OdontogramaIntervencaoSchema:
    dentes = [_to_dente_schema(item) for item in getattr(intervencao, "dentes", []) or []]
    faces = [_to_face_schema(item) for item in getattr(intervencao, "faces", []) or []]
    status = _to_status_schema(getattr(intervencao, "status", None))
    return OdontogramaIntervencaoSchema(
        id=int(intervencao.id),
        clinica_id=int(intervencao.clinica_id),
        paciente_id=int(intervencao.paciente_id),
        tratamento_id=int(intervencao.tratamento_id),
        prestador_id=int(intervencao.prestador_id) if getattr(intervencao, "prestador_id", None) is not None else None,
        procedimento_id=int(intervencao.procedimento_id),
        status=status,
        data_planejada=getattr(intervencao, "data_planejada", None),
        data_execucao=getattr(intervencao, "data_execucao", None),
        observacao_resumida=getattr(intervencao, "observacao_resumida", None),
        dentes=dentes,
        faces=faces,
    )


def listar_status_leitura(db: Session) -> OdontogramaListaStatusResponse:
    itens = [_to_status_schema(item) for item in listar_status(db)]
    return OdontogramaListaStatusResponse(itens=itens)


def listar_arcada_slots_leitura(
    db: Session,
    clinica_id: int,
    paciente_id: int,
    tratamento_id: int,
) -> OdontogramaArcadaSlotsResponse:
    itens = [_to_slot_schema(item) for item in listar_arcada_slots(db, clinica_id, paciente_id, tratamento_id)]
    return OdontogramaArcadaSlotsResponse(itens=itens)


def listar_intervencoes_leitura(
    db: Session,
    clinica_id: int,
    paciente_id: int,
    tratamento_id: int,
) -> OdontogramaIntervencoesResponse:
    itens = [
        _to_intervencao_schema(item)
        for item in listar_intervencoes_com_relacoes(db, clinica_id, paciente_id, tratamento_id)
    ]
    return OdontogramaIntervencoesResponse(itens=itens)


def montar_resumo_leitura(
    db: Session,
    clinica_id: int,
    paciente_id: int,
    tratamento_id: int,
) -> OdontogramaResumoResponse:
    status_lookup = [_to_status_schema(item) for item in listar_status(db)]
    arcada_slots = [_to_slot_schema(item) for item in listar_arcada_slots(db, clinica_id, paciente_id, tratamento_id)]
    intervencoes_model = listar_intervencoes_com_relacoes(db, clinica_id, paciente_id, tratamento_id)
    intervencoes = [_to_intervencao_schema(item) for item in intervencoes_model]
    resumo = OdontogramaResumoSchema(
        paciente_id=int(paciente_id),
        tratamento_id=int(tratamento_id),
        contagem_intervencoes=len(intervencoes),
        arcada_slots=arcada_slots,
        status_lookup=status_lookup,
        intervencoes=intervencoes,
    )
    return OdontogramaResumoResponse(resumo=resumo)
