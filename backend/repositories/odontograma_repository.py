from sqlalchemy.orm import Session, selectinload

from models.odontograma_model import (
    OdontogramaArcadaSlot,
    OdontogramaDente,
    OdontogramaFace,
    OdontogramaIntervencao,
    OdontogramaIntervencaoStatus,
)


def listar_status(db: Session) -> list[OdontogramaIntervencaoStatus]:
    return (
        db.query(OdontogramaIntervencaoStatus)
        .order_by(OdontogramaIntervencaoStatus.ordem.asc(), OdontogramaIntervencaoStatus.codigo.asc())
        .all()
    )


def listar_arcada_slots(
    db: Session,
    clinica_id: int,
    paciente_id: int,
    tratamento_id: int,
) -> list[OdontogramaArcadaSlot]:
    return (
        db.query(OdontogramaArcadaSlot)
        .filter(
            OdontogramaArcadaSlot.clinica_id == int(clinica_id),
            OdontogramaArcadaSlot.paciente_id == int(paciente_id),
            OdontogramaArcadaSlot.tratamento_id == int(tratamento_id),
        )
        .order_by(OdontogramaArcadaSlot.slot_ordem.asc(), OdontogramaArcadaSlot.id.asc())
        .all()
    )


def listar_intervencoes_com_relacoes(
    db: Session,
    clinica_id: int,
    paciente_id: int,
    tratamento_id: int,
) -> list[OdontogramaIntervencao]:
    return (
        db.query(OdontogramaIntervencao)
        .options(
            selectinload(OdontogramaIntervencao.status),
            selectinload(OdontogramaIntervencao.dentes),
            selectinload(OdontogramaIntervencao.faces),
        )
        .filter(
            OdontogramaIntervencao.clinica_id == int(clinica_id),
            OdontogramaIntervencao.paciente_id == int(paciente_id),
            OdontogramaIntervencao.tratamento_id == int(tratamento_id),
        )
        .order_by(OdontogramaIntervencao.id.asc())
        .all()
    )


def listar_dentes_por_intervencao_ids(
    db: Session,
    intervencao_ids: list[int],
) -> list[OdontogramaDente]:
    if not intervencao_ids:
        return []
    return (
        db.query(OdontogramaDente)
        .filter(OdontogramaDente.intervencao_id.in_(intervencao_ids))
        .order_by(OdontogramaDente.intervencao_id.asc(), OdontogramaDente.numero_dente_fdi.asc(), OdontogramaDente.id.asc())
        .all()
    )


def listar_faces_por_intervencao_ids(
    db: Session,
    intervencao_ids: list[int],
) -> list[OdontogramaFace]:
    if not intervencao_ids:
        return []
    return (
        db.query(OdontogramaFace)
        .filter(OdontogramaFace.intervencao_id.in_(intervencao_ids))
        .order_by(OdontogramaFace.intervencao_id.asc(), OdontogramaFace.numero_dente_fdi.asc(), OdontogramaFace.id.asc())
        .all()
    )
