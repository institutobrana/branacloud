import unicodedata

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from database import get_db
from models.protetico import Protetico, ServicoProtetico
from models.usuario import Usuario
from security.dependencies import get_current_user, require_module_access

router = APIRouter(
    prefix="/proteticos",
    tags=["proteticos"],
    dependencies=[Depends(require_module_access("procedimentos"))],
)


class ProteticoPayload(BaseModel):
    nome: str


class ServicoPayload(BaseModel):
    nome: str
    indice: str = "R$"
    preco: float = 0
    prazo: int = 0
    codigo: str | None = Field(default=None, max_length=30)
    descricao: str | None = None


def _sort_key(texto: str) -> str:
    base = (texto or "").strip().lower()
    base = unicodedata.normalize("NFD", base)
    return "".join(c for c in base if unicodedata.category(c) != "Mn")


def _protetico_to_dict(item: Protetico) -> dict:
    return {
        "id": int(item.id),
        "nome": str(item.nome or "").strip(),
    }


def _servico_to_dict(item: ServicoProtetico) -> dict:
    return {
        "id": int(item.id),
        "codigo": str(item.codigo).strip() if item.codigo is not None else None,
        "nome": str(item.nome or "").strip(),
        "indice": str(item.indice or "R$").strip() or "R$",
        "preco": float(item.preco or 0),
        "prazo": int(item.prazo or 0),
        "descricao": str(item.descricao).strip() if item.descricao is not None else None,
        "protetico_id": int(item.protetico_id),
    }


def _normalize_codigo(value: str | None) -> str | None:
    if value is None:
        return None
    text = str(value).strip()
    if not text:
        return None
    if len(text) > 30:
        raise HTTPException(status_code=400, detail="Informe um codigo com ate 30 caracteres.")
    return text


def _normalize_descricao(value: str | None) -> str | None:
    if value is None:
        return None
    text = str(value).strip()
    return text or None


def _load_servico_codigo_duplicado(
    db: Session,
    clinica_id: int,
    protetico_id: int,
    codigo: str,
    servico_id: int | None = None,
) -> ServicoProtetico | None:
    query = (
        db.query(ServicoProtetico)
        .filter(
            ServicoProtetico.clinica_id == clinica_id,
            ServicoProtetico.protetico_id == protetico_id,
            ServicoProtetico.codigo == codigo,
        )
    )
    if servico_id is not None:
        query = query.filter(ServicoProtetico.id != servico_id)
    return query.first()


def _normalizar_servico_payload(
    payload: ServicoPayload,
    db: Session,
    current_user: Usuario,
    protetico_id: int,
    servico_id: int | None = None,
) -> dict:
    codigo = _normalize_codigo(payload.codigo)
    descricao = _normalize_descricao(payload.descricao)
    nome = str(payload.nome or "").strip()
    indice = str(payload.indice or "R$").strip() or "R$"
    prazo = max(0, int(payload.prazo or 0))

    if not nome:
        raise HTTPException(status_code=400, detail="Informe o nome do servico.")
    if codigo:
        duplicado = _load_servico_codigo_duplicado(
            db,
            current_user.clinica_id,
            protetico_id,
            codigo,
            servico_id=servico_id,
        )
        if duplicado:
            raise HTTPException(
                status_code=409,
                detail="Ja existe um servico com este codigo para o protetico selecionado.",
            )
    return {
        "codigo": codigo,
        "descricao": descricao,
        "nome": nome,
        "indice": indice,
        "preco": float(payload.preco or 0),
        "prazo": prazo,
    }


def _load_protetico_or_404(db: Session, clinica_id: int, protetico_id: int) -> Protetico:
    item = (
        db.query(Protetico)
        .filter(
            Protetico.id == protetico_id,
            Protetico.clinica_id == clinica_id,
        )
        .first()
    )
    if not item:
        raise HTTPException(status_code=404, detail="Protetico nao encontrado.")
    return item


def _load_servico_or_404(db: Session, clinica_id: int, servico_id: int) -> ServicoProtetico:
    item = (
        db.query(ServicoProtetico)
        .filter(
            ServicoProtetico.id == servico_id,
            ServicoProtetico.clinica_id == clinica_id,
        )
        .first()
    )
    if not item:
        raise HTTPException(status_code=404, detail="Servico de protetico nao encontrado.")
    return item


@router.get("")
def listar_proteticos(
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    itens = (
        db.query(Protetico)
        .filter(Protetico.clinica_id == current_user.clinica_id)
        .all()
    )
    itens = sorted(itens, key=lambda item: _sort_key(item.nome))
    return [_protetico_to_dict(item) for item in itens]


@router.post("")
def criar_protetico(
    payload: ProteticoPayload,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    nome = str(payload.nome or "").strip()
    if not nome:
        raise HTTPException(status_code=400, detail="Informe o nome do protetico.")
    existe = (
        db.query(Protetico.id)
        .filter(
            Protetico.clinica_id == current_user.clinica_id,
            Protetico.nome == nome,
        )
        .first()
    )
    if existe:
        raise HTTPException(status_code=400, detail="Ja existe um protetico com esse nome.")
    item = Protetico(nome=nome, clinica_id=current_user.clinica_id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return _protetico_to_dict(item)


@router.patch("/{protetico_id}")
def alterar_protetico(
    protetico_id: int,
    payload: ProteticoPayload,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    item = _load_protetico_or_404(db, current_user.clinica_id, protetico_id)
    nome = str(payload.nome or "").strip()
    if not nome:
        raise HTTPException(status_code=400, detail="Informe o nome do protetico.")
    existe = (
        db.query(Protetico.id)
        .filter(
            Protetico.clinica_id == current_user.clinica_id,
            Protetico.nome == nome,
            Protetico.id != protetico_id,
        )
        .first()
    )
    if existe:
        raise HTTPException(status_code=400, detail="Ja existe um protetico com esse nome.")
    item.nome = nome
    db.commit()
    db.refresh(item)
    return _protetico_to_dict(item)


@router.delete("/{protetico_id}")
def excluir_protetico(
    protetico_id: int,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    item = _load_protetico_or_404(db, current_user.clinica_id, protetico_id)
    db.delete(item)
    db.commit()
    return {"detail": "Protetico excluido com sucesso."}


@router.get("/{protetico_id}/servicos")
def listar_servicos(
    protetico_id: int,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    _load_protetico_or_404(db, current_user.clinica_id, protetico_id)
    itens = (
        db.query(ServicoProtetico)
        .filter(
            ServicoProtetico.clinica_id == current_user.clinica_id,
            ServicoProtetico.protetico_id == protetico_id,
        )
        .all()
    )
    itens = sorted(itens, key=lambda item: _sort_key(item.nome))
    return [_servico_to_dict(item) for item in itens]


@router.post("/{protetico_id}/servicos")
def criar_servico(
    protetico_id: int,
    payload: ServicoPayload,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    _load_protetico_or_404(db, current_user.clinica_id, protetico_id)
    nome = str(payload.nome or "").strip()
    if not nome:
        raise HTTPException(status_code=400, detail="Informe o nome do servico.")
    existe = (
        db.query(ServicoProtetico.id)
        .filter(
            ServicoProtetico.protetico_id == protetico_id,
            ServicoProtetico.nome == nome,
        )
        .first()
    )
    if existe:
        raise HTTPException(status_code=400, detail="Ja existe um servico com esse nome para este protetico.")
    normalized = _normalizar_servico_payload(payload, db, current_user, protetico_id)
    item = ServicoProtetico(
        protetico_id=protetico_id,
        clinica_id=current_user.clinica_id,
        **normalized,
    )
    db.add(item)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Ja existe um servico com este codigo para o protetico selecionado.",
        ) from exc
    db.refresh(item)
    return _servico_to_dict(item)


@router.put("/servicos/{servico_id}")
def alterar_servico(
    servico_id: int,
    payload: ServicoPayload,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    item = _load_servico_or_404(db, current_user.clinica_id, servico_id)
    nome = str(payload.nome or "").strip()
    if not nome:
        raise HTTPException(status_code=400, detail="Informe o nome do servico.")
    existe = (
        db.query(ServicoProtetico.id)
        .filter(
            ServicoProtetico.protetico_id == item.protetico_id,
            ServicoProtetico.nome == nome,
            ServicoProtetico.id != servico_id,
        )
        .first()
    )
    if existe:
        raise HTTPException(status_code=400, detail="Ja existe um servico com esse nome para este protetico.")
    normalized = _normalizar_servico_payload(payload, db, current_user, item.protetico_id, servico_id=int(item.id))
    for key, value in normalized.items():
        setattr(item, key, value)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Ja existe um servico com este codigo para o protetico selecionado.",
        ) from exc
    db.refresh(item)
    return _servico_to_dict(item)


@router.delete("/servicos/{servico_id}")
def excluir_servico(
    servico_id: int,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    item = _load_servico_or_404(db, current_user.clinica_id, servico_id)
    db.delete(item)
    db.commit()
    return {"detail": "Servico excluido com sucesso."}
