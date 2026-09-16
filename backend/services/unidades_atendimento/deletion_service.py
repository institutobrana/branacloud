from __future__ import annotations

from dataclasses import dataclass

from fastapi import HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from models.agenda_legado import AgendaLegadoBloqueio, AgendaLegadoEvento
from models.tratamento import Tratamento
from models.unidade_atendimento import UnidadeAtendimento
from models.usuario import Usuario


@dataclass(frozen=True)
class UnidadeExclusaoResult:
    detail: str = "Unidade excluida."


def _strip(value) -> str:
    return " ".join(str(value or "").split()).strip()


def _unit_text_candidates(unidade: UnidadeAtendimento) -> set[str]:
    candidates = {
        _strip(unidade.nome),
        _strip(unidade.codigo),
        _strip(f"{_strip(unidade.codigo)} - {_strip(unidade.nome)}"),
    }
    return {value for value in candidates if value}


def _unit_deleted_text_candidates(unidade: UnidadeAtendimento) -> set[str]:
    candidates = _unit_text_candidates(unidade)
    source_id = int(unidade.source_id or 0)
    if source_id:
        candidates.add(_strip(f"{source_id}"))
        candidates.add(_strip(f"{source_id} - {_strip(unidade.nome)}"))
    return {value for value in candidates if value}


def _has_users_linked(db: Session, clinica_id: int, unidade_id: int) -> bool:
    return bool(
        db.query(Usuario.id)
        .filter(
            Usuario.clinica_id == int(clinica_id),
            Usuario.unidade_atendimento_id == int(unidade_id),
        )
        .first()
    )


def _has_agenda_linked(db: Session, clinica_id: int, unidade_id: int) -> bool:
    return bool(
        db.query(AgendaLegadoEvento.id)
        .filter(
            AgendaLegadoEvento.clinica_id == int(clinica_id),
            AgendaLegadoEvento.id_unidade == int(unidade_id),
        )
        .first()
    )


def _has_bloqueios_linked(db: Session, clinica_id: int, unidade_id: int) -> bool:
    return bool(
        db.query(AgendaLegadoBloqueio.id)
        .filter(
            AgendaLegadoBloqueio.clinica_id == int(clinica_id),
            AgendaLegadoBloqueio.id_unidade == int(unidade_id),
        )
        .first()
    )


def _has_tratamentos_linked(db: Session, clinica_id: int, unidade: UnidadeAtendimento) -> bool:
    candidates = _unit_deleted_text_candidates(unidade)
    if not candidates:
        return False
    trimmed = func.trim(Tratamento.unidade_atendimento)
    return bool(
        db.query(Tratamento.id)
        .filter(
            Tratamento.clinica_id == int(clinica_id),
            trimmed.in_(sorted(candidates)),
        )
        .first()
    )


def _count_units(db: Session, clinica_id: int) -> int:
    return int(
        db.query(func.count(UnidadeAtendimento.id))
        .filter(UnidadeAtendimento.clinica_id == int(clinica_id))
        .scalar()
        or 0
    )


def validar_exclusao_unidade_atendimento(db: Session, clinica_id: int, unidade: UnidadeAtendimento) -> None:
    if int(unidade.clinica_id or 0) != int(clinica_id):
        raise HTTPException(status_code=404, detail="Unidade nao encontrada.")

    if int(unidade.source_id or 0) == 1:
        raise HTTPException(
            status_code=409,
            detail="A unidade principal nao pode ser excluida. Inative-a somente se isso for permitido pela operacao da clinica.",
        )

    if _count_units(db, clinica_id) <= 1:
        raise HTTPException(
            status_code=409,
            detail="A clinica deve manter pelo menos uma unidade de atendimento.",
        )

    if _has_users_linked(db, clinica_id, unidade.id):
        raise HTTPException(
            status_code=409,
            detail="A unidade possui usuarios vinculados e nao pode ser excluida.",
        )

    if _has_agenda_linked(db, clinica_id, unidade.id):
        raise HTTPException(
            status_code=409,
            detail="A unidade possui registros de agenda vinculados e nao pode ser excluida.",
        )

    if _has_bloqueios_linked(db, clinica_id, unidade.id):
        raise HTTPException(
            status_code=409,
            detail="A unidade possui bloqueios de agenda vinculados e nao pode ser excluida.",
        )

    if _has_tratamentos_linked(db, clinica_id, unidade):
        raise HTTPException(
            status_code=409,
            detail="A unidade possui tratamentos vinculados e nao pode ser excluida.",
        )


def excluir_unidade_atendimento(db: Session, clinica_id: int, unidade: UnidadeAtendimento) -> UnidadeExclusaoResult:
    validar_exclusao_unidade_atendimento(db, clinica_id, unidade)
    try:
        db.delete(unidade)
        db.commit()
        return UnidadeExclusaoResult()
    except HTTPException:
        db.rollback()
        raise
    except Exception as exc:
        db.rollback()
        raise HTTPException(status_code=500, detail="Falha inesperada ao excluir a unidade.") from exc
