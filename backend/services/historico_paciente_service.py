from datetime import date

from fastapi import HTTPException
from sqlalchemy.orm import Session

from models.historico_paciente import HistoricoPaciente
from models.paciente import Paciente
from models.prestador_odonto import PrestadorOdonto
from models.usuario import Usuario


def paciente_or_404(db: Session, clinica_id: int, paciente_id: int) -> Paciente:
    item = db.query(Paciente).filter(
        Paciente.id == paciente_id,
        Paciente.clinica_id == clinica_id,
    ).first()
    if item is None:
        raise HTTPException(status_code=404, detail="Paciente não encontrado.")
    return item


def prestador_or_404(db: Session, clinica_id: int, prestador_id: int) -> PrestadorOdonto:
    item = db.query(PrestadorOdonto).filter(
        PrestadorOdonto.id == prestador_id,
        PrestadorOdonto.clinica_id == clinica_id,
    ).first()
    if item is None:
        raise HTTPException(status_code=400, detail="Prestador inválido para a clínica.")
    return item


def _serialize(item: HistoricoPaciente) -> dict:
    prestador = item.prestador
    criado_por = item.criado_por
    atualizado_por = item.atualizado_por
    return {
        "id": item.id,
        "paciente_id": item.paciente_id,
        "data": item.data,
        "prestador_id": item.prestador_id,
        "prestador_apelido": prestador.apelido if prestador else None,
        "prestador_nome": prestador.nome if prestador else None,
        "regiao": item.regiao,
        "descricao": item.descricao,
        "cor": item.cor,
        "source_id": item.source_id,
        "source_intervencao_id": item.source_intervencao_id,
        "criado_em": item.criado_em,
        "criado_por_id": item.criado_por_id,
        "criado_por_nome": (criado_por.apelido or criado_por.nome) if criado_por else None,
        "atualizado_em": item.atualizado_em,
        "atualizado_por_id": item.atualizado_por_id,
        "atualizado_por_nome": ((atualizado_por.apelido or atualizado_por.nome) if atualizado_por else None),
    }


def listar(db: Session, clinica_id: int, paciente_id: int, descending: bool = False) -> list[dict]:
    paciente_or_404(db, clinica_id, paciente_id)
    query = db.query(HistoricoPaciente).filter(
        HistoricoPaciente.clinica_id == clinica_id,
        HistoricoPaciente.paciente_id == paciente_id,
    )
    order = HistoricoPaciente.data.desc() if descending else HistoricoPaciente.data.asc()
    return [_serialize(item) for item in query.order_by(order, HistoricoPaciente.id.asc()).all()]


def obter(db: Session, clinica_id: int, paciente_id: int, item_id: int) -> HistoricoPaciente:
    paciente_or_404(db, clinica_id, paciente_id)
    item = db.query(HistoricoPaciente).filter(
        HistoricoPaciente.id == item_id,
        HistoricoPaciente.clinica_id == clinica_id,
        HistoricoPaciente.paciente_id == paciente_id,
    ).first()
    if item is None:
        raise HTTPException(status_code=404, detail="Histórico não encontrado.")
    return item


def criar(db: Session, current_user: Usuario, paciente_id: int, payload) -> dict:
    clinica_id = int(current_user.clinica_id)
    paciente_or_404(db, clinica_id, paciente_id)
    prestador_id = getattr(current_user, "prestador_id", None)
    if not prestador_id:
        raise HTTPException(status_code=400, detail="Usuário não possui prestador responsável vinculado.")
    prestador_or_404(db, clinica_id, int(prestador_id))
    item = HistoricoPaciente(
        clinica_id=clinica_id,
        paciente_id=paciente_id,
        prestador_id=int(prestador_id),
        criado_por_id=int(current_user.id),
        data=payload.data or date.today(),
        regiao=payload.regiao,
        descricao=payload.descricao,
        cor=payload.cor,
        source_intervencao_id=payload.source_intervencao_id,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return _serialize(item)


def atualizar(db: Session, current_user: Usuario, item: HistoricoPaciente, payload, properties: bool = False) -> dict:
    if properties:
        prestador_or_404(db, int(current_user.clinica_id), payload.prestador_id)
        item.prestador_id = payload.prestador_id
        item.cor = payload.cor
    item.data = payload.data
    item.regiao = payload.regiao
    item.descricao = payload.descricao
    item.atualizado_por_id = int(current_user.id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return _serialize(item)


def remover(db: Session, item: HistoricoPaciente) -> None:
    db.delete(item)
    db.commit()
