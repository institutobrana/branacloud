import re
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import func, or_
from sqlalchemy.orm import Session

from database import get_db
from models.motivo_agendamento import MotivoAgendamento
from models.usuario import Usuario
from security.dependencies import get_current_user, require_module_access

router = APIRouter(prefix="/cadastros", tags=["motivos-agendamento"])
DEP_CONFIGURACAO = Depends(require_module_access("configuracao"))

COLOR_RE = re.compile(r"^#?[0-9a-fA-F]{6}$")
TIPOS_VALIDOS = {"agendamento", "compromisso"}


class MotivoAgendamentoPayload(BaseModel):
    codigo: str | None = None
    nome: str
    descricao: str | None = None
    tipo: str
    cor: str | None = None
    compromisso_produtivo: bool = False
    inativo: bool = False


class MotivoAgendamentoStatusPayload(BaseModel):
    isActive: bool | None = None
    inativo: bool | None = None


def _norm_text(value: str | None) -> str:
    return str(value or "").strip()


def _norm_tipo(value: str | None) -> str:
    tipo = str(value or "").strip().lower()
    if tipo in TIPOS_VALIDOS:
        return tipo
    raise HTTPException(status_code=400, detail="Tipo do motivo inválido.")


def _norm_color(value: str | None) -> str | None:
    color = _norm_text(value).upper()
    if not color:
        return None
    if not COLOR_RE.match(color):
        raise HTTPException(status_code=400, detail="Cor inválida.")
    return color if color.startswith("#") else f"#{color}"


def _next_codigo(db: Session, clinica_id: int) -> str:
    rows = db.query(MotivoAgendamento.codigo).filter(MotivoAgendamento.clinica_id == int(clinica_id)).all()
    max_num = 0
    for (codigo,) in rows:
        codigo_txt = _norm_text(codigo).upper()
        match = re.match(r"^MA-(\d+)$", codigo_txt)
        if not match:
            continue
        max_num = max(max_num, int(match.group(1)))
    return f"MA-{max_num + 1:03d}"


def _load_or_404(db: Session, clinica_id: int, item_id: int) -> MotivoAgendamento:
    item = (
        db.query(MotivoAgendamento)
        .filter(
            MotivoAgendamento.id == int(item_id),
            MotivoAgendamento.clinica_id == int(clinica_id),
        )
        .first()
    )
    if not item:
        raise HTTPException(status_code=404, detail="Motivo de agendamento não encontrado.")
    return item


def _to_dict(item: MotivoAgendamento) -> dict:
    return {
        "id": int(item.id),
        "codigo": _norm_text(item.codigo),
        "nome": _norm_text(item.nome),
        "descricao": _norm_text(item.descricao) or None,
        "tipo": _norm_text(item.tipo),
        "cor": _norm_text(item.cor) or None,
        "compromisso_produtivo": bool(item.compromisso_produtivo),
        "inativo": bool(item.inativo),
        "is_active": not bool(item.inativo),
        "status": "Inativo" if bool(item.inativo) else "Ativo",
        "criado_em": item.criado_em.isoformat() if item.criado_em else "",
        "atualizado_em": item.atualizado_em.isoformat() if item.atualizado_em else "",
    }


def _normalize_payload(payload: MotivoAgendamentoPayload) -> dict:
    nome = _norm_text(payload.nome)
    if not nome:
        raise HTTPException(status_code=400, detail="Informe o nome.")

    descricao = _norm_text(payload.descricao) or None
    tipo = _norm_tipo(payload.tipo)
    cor = _norm_color(payload.cor)
    compromisso_produtivo = bool(payload.compromisso_produtivo)

    if tipo == "compromisso" and not cor:
        raise HTTPException(status_code=400, detail="Selecione uma cor para motivo do tipo compromisso.")

    if tipo == "agendamento":
        cor = None
        compromisso_produtivo = False

    return {
        "nome": nome,
        "descricao": descricao,
        "tipo": tipo,
        "cor": cor,
        "compromisso_produtivo": compromisso_produtivo,
        "inativo": bool(payload.inativo),
    }


@router.get("/motivos-agendamento", dependencies=[DEP_CONFIGURACAO])
def listar_motivos_agendamento(
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    itens = (
        db.query(MotivoAgendamento)
        .filter(MotivoAgendamento.clinica_id == current_user.clinica_id)
        .order_by(
            func.coalesce(MotivoAgendamento.codigo, "").asc(),
            MotivoAgendamento.nome.asc(),
            MotivoAgendamento.id.asc(),
        )
        .all()
    )
    return [_to_dict(item) for item in itens]


@router.post("/motivos-agendamento", dependencies=[DEP_CONFIGURACAO])
def criar_motivo_agendamento(
    payload: MotivoAgendamentoPayload,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    codigo = _norm_text(payload.codigo) or _next_codigo(db, current_user.clinica_id)
    if not codigo:
        raise HTTPException(status_code=400, detail="Informe um código válido.")

    existe = (
        db.query(MotivoAgendamento.id)
        .filter(
            MotivoAgendamento.clinica_id == current_user.clinica_id,
            MotivoAgendamento.codigo == codigo,
        )
        .first()
    )
    if existe:
        raise HTTPException(status_code=400, detail="Já existe motivo de agendamento com este código.")

    data = _normalize_payload(payload)
    item = MotivoAgendamento(
        clinica_id=current_user.clinica_id,
        codigo=codigo,
        nome=data["nome"],
        descricao=data["descricao"],
        tipo=data["tipo"],
        cor=data["cor"],
        compromisso_produtivo=data["compromisso_produtivo"],
        inativo=data["inativo"],
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return _to_dict(item)


@router.put("/motivos-agendamento/{item_id}", dependencies=[DEP_CONFIGURACAO])
def editar_motivo_agendamento(
    item_id: int,
    payload: MotivoAgendamentoPayload,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    item = _load_or_404(db, current_user.clinica_id, item_id)
    codigo = _norm_text(payload.codigo) or _next_codigo(db, current_user.clinica_id)
    if not codigo:
        raise HTTPException(status_code=400, detail="Informe um código válido.")

    existe = (
        db.query(MotivoAgendamento.id)
        .filter(
            MotivoAgendamento.clinica_id == current_user.clinica_id,
            MotivoAgendamento.codigo == codigo,
            MotivoAgendamento.id != item.id,
        )
        .first()
    )
    if existe:
        raise HTTPException(status_code=400, detail="Já existe outro motivo de agendamento com este código.")

    data = _normalize_payload(payload)
    item.codigo = codigo
    item.nome = data["nome"]
    item.descricao = data["descricao"]
    item.tipo = data["tipo"]
    item.cor = data["cor"]
    item.compromisso_produtivo = data["compromisso_produtivo"]
    item.inativo = data["inativo"]
    item.atualizado_em = datetime.now(timezone.utc)
    db.commit()
    db.refresh(item)
    return _to_dict(item)


@router.patch("/motivos-agendamento/{item_id}/status", dependencies=[DEP_CONFIGURACAO])
def alterar_status_motivo_agendamento(
    item_id: int,
    payload: MotivoAgendamentoStatusPayload,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    item = _load_or_404(db, current_user.clinica_id, item_id)
    ativo = payload.isActive
    if ativo is None:
        ativo = payload.inativo
    if ativo is None:
        raise HTTPException(status_code=400, detail="Informe o status.")
    item.inativo = not bool(ativo) if payload.isActive is not None else bool(ativo)
    item.atualizado_em = datetime.now(timezone.utc)
    db.commit()
    db.refresh(item)
    return _to_dict(item)


@router.get("/motivos-agendamento/{item_id}/delete-check", dependencies=[DEP_CONFIGURACAO])
def checar_exclusao_motivo_agendamento(
    item_id: int,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    _load_or_404(db, current_user.clinica_id, item_id)
    return {"can_delete": True, "used_in": []}


@router.delete("/motivos-agendamento/{item_id}", dependencies=[DEP_CONFIGURACAO])
def excluir_motivo_agendamento(
    item_id: int,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    item = _load_or_404(db, current_user.clinica_id, item_id)
    db.delete(item)
    db.commit()
    return {"success": True}


@router.post("/motivos-agendamento/{item_id}/replace-and-delete", dependencies=[DEP_CONFIGURACAO])
def substituir_e_excluir_motivo_agendamento(
    item_id: int,
    payload: dict,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    _ = payload.get("replacementId")
    item = _load_or_404(db, current_user.clinica_id, item_id)
    db.delete(item)
    db.commit()
    return {"success": True}
