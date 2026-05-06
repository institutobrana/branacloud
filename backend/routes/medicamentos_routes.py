from __future__ import annotations

import unicodedata

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy import func, or_
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from database import get_db
from models.financeiro import ItemAuxiliar
from models.medicamento import Medicamento
from models.usuario import Usuario
from security.dependencies import get_current_user, require_module_access
from security.permissions import get_easy_permission_schema, parse_permissions_json


router = APIRouter(
    prefix="/medicamentos",
    tags=["medicamentos"],
    dependencies=[Depends(require_module_access("anamnese"))],
)

MEDICAMENTO_TIPO_AUX_GRUPO = "Grupo de medicamento"
MEDICAMENTO_TIPO_AUX_APRESENTACAO = "Tipos de apresentação"
MEDICAMENTO_TIPO_AUX_USO = "Tipos de uso"

FUNC_INSERIR_MEDICAMENTO = "Inserir medicamento"
FUNC_ALTERAR_MEDICAMENTO = "Alterar medicamento"
FUNC_ELIMINAR_MEDICAMENTO = "Eliminar medicamento"


class MedicamentoPayload(BaseModel):
    nome: str = Field(default="", max_length=180)
    grupo: str | None = Field(default=None, max_length=120)
    descricao_substancia: str | None = Field(default=None, max_length=255)
    apresentacao: str | None = Field(default=None, max_length=120)
    uso: str | None = Field(default=None, max_length=120)
    posologia_adulto: str | None = None
    quantidade_padrao_adulto: str | None = Field(default=None, max_length=60)
    posologia_crianca: str | None = None
    quantidade_padrao_crianca: str | None = Field(default=None, max_length=60)
    preferido: bool = False
    laboratorio: str | None = Field(default=None, max_length=180)
    observacoes: str | None = None
    advertencias: str | None = None
    inativo: bool = False


def _norm_key(value: str) -> str:
    txt = str(value or "")
    txt = unicodedata.normalize("NFD", txt)
    txt = "".join(ch for ch in txt if unicodedata.category(ch) != "Mn")
    return txt.casefold().strip()


def _normalize_level(value: str | None) -> str:
    txt = str(value or "").strip().lower()
    return txt if txt in {"desabilitado", "protegido", "habilitado"} else "desabilitado"


def _easy_funcoes_payload(usuario: Usuario) -> dict[str, str]:
    raw = parse_permissions_json(getattr(usuario, "permissoes_json", None))
    payload = raw.get("easy_funcoes") if isinstance(raw.get("easy_funcoes"), dict) else {}
    out: dict[str, str] = {}
    for key, value in payload.items():
        out[str(key)] = _normalize_level(str(value))
    return out


def _resolve_function_ids_by_names(names: list[str]) -> set[str]:
    schema = get_easy_permission_schema()
    if not schema:
        return set()
    names_norm = {_norm_key(item) for item in names if str(item or "").strip()}
    if not names_norm:
        return set()
    functions_flat = schema.get("functions_flat") if isinstance(schema.get("functions_flat"), dict) else {}
    ids: set[str] = set()
    for key, item in functions_flat.items():
        nome = _norm_key(str((item or {}).get("nome") or ""))
        if nome and nome in names_norm:
            ids.add(str(key))
    return ids


def _assert_function_access(usuario: Usuario, function_names: list[str]) -> None:
    if bool(getattr(usuario, "is_admin", False)):
        return
    mapped_ids = _resolve_function_ids_by_names(function_names)
    if not mapped_ids:
        return
    niveis_por_funcao = _easy_funcoes_payload(usuario)
    configured_ids = [fid for fid in mapped_ids if fid in niveis_por_funcao]
    if not configured_ids:
        return
    if any(niveis_por_funcao.get(fid) in {"habilitado", "protegido"} for fid in configured_ids):
        return
    raise HTTPException(status_code=403, detail="Ação sem permissão para o usuário.")


def _to_text(value: str | None) -> str | None:
    if value is None:
        return None
    txt = str(value).strip()
    return txt if txt else None


def _aux_tipo_match(value: str, expected: str) -> bool:
    current = _norm_key(value)
    target = _norm_key(expected)
    if not current or not target:
        return False
    if current == target:
        return True
    if target == _norm_key(MEDICAMENTO_TIPO_AUX_USO):
        return ("tipo" in current and "uso" in current)
    if target == _norm_key(MEDICAMENTO_TIPO_AUX_APRESENTACAO):
        return ("tipo" in current and "apresent" in current)
    if target == _norm_key(MEDICAMENTO_TIPO_AUX_GRUPO):
        return ("grupo" in current and "medic" in current)
    return False


def _listar_aux_por_tipo(db: Session, clinica_id: int, tipo_alvo: str) -> list[dict]:
    rows = (
        db.query(ItemAuxiliar)
        .filter(
            ItemAuxiliar.clinica_id == int(clinica_id),
            or_(ItemAuxiliar.inativo.is_(False), ItemAuxiliar.inativo.is_(None)),
        )
        .order_by(
            func.coalesce(ItemAuxiliar.ordem, 999999).asc(),
            func.lower(ItemAuxiliar.descricao).asc(),
            ItemAuxiliar.id.asc(),
        )
        .all()
    )
    seen: set[str] = set()
    itens: list[dict] = []
    for row in rows:
        if not _aux_tipo_match(str(row.tipo or ""), tipo_alvo):
            continue
        descricao = str(row.descricao or "").strip()
        if not descricao:
            continue
        key = _norm_key(descricao)
        if key in seen:
            continue
        seen.add(key)
        itens.append(
            {
                "id": int(row.id),
                "codigo": str(row.codigo or "").strip(),
                "descricao": descricao,
            }
        )
    return itens


def _medicamento_to_dict(item: Medicamento) -> dict:
    return {
        "id": int(item.id),
        "nome": str(item.nome or "").strip(),
        "grupo": str(item.grupo or "").strip(),
        "descricao_substancia": str(item.descricao_substancia or "").strip(),
        "apresentacao": str(item.apresentacao or "").strip(),
        "uso": str(item.uso or "").strip(),
        "posologia_adulto": item.posologia_adulto or "",
        "quantidade_padrao_adulto": str(item.quantidade_padrao_adulto or "").strip(),
        "posologia_crianca": item.posologia_crianca or "",
        "quantidade_padrao_crianca": str(item.quantidade_padrao_crianca or "").strip(),
        "preferido": bool(item.preferido),
        "laboratorio": str(item.laboratorio or "").strip(),
        "observacoes": item.observacoes or "",
        "advertencias": item.advertencias or "",
        "inativo": bool(item.inativo),
        "clinica_id": int(item.clinica_id),
    }


@router.get("")
def listar_medicamentos(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
    grupo: str = Query(default="", max_length=120),
    nome: str = Query(default="", max_length=180),
    incluir_inativos: bool = Query(default=False),
    limit: int = Query(default=300, ge=1, le=2000),
    skip: int = Query(default=0, ge=0),
):
    query = db.query(Medicamento).filter(Medicamento.clinica_id == int(current_user.clinica_id))
    grupo_filtro = str(grupo or "").strip()
    nome_filtro = str(nome or "").strip()

    if grupo_filtro and _norm_key(grupo_filtro) not in {"<todos>", "<<todos>>", "todos"}:
        query = query.filter(func.lower(func.coalesce(Medicamento.grupo, "")) == grupo_filtro.lower())
    if nome_filtro:
        termo = f"%{nome_filtro.lower()}%"
        query = query.filter(func.lower(func.coalesce(Medicamento.nome, "")).like(termo))
    if not bool(incluir_inativos):
        query = query.filter(or_(Medicamento.inativo.is_(False), Medicamento.inativo.is_(None)))

    total = query.count()
    rows = (
        query.order_by(
            func.lower(func.coalesce(Medicamento.nome, "")).asc(),
            func.lower(func.coalesce(Medicamento.grupo, "")).asc(),
            Medicamento.id.asc(),
        )
        .offset(int(skip))
        .limit(int(limit))
        .all()
    )
    return {"itens": [_medicamento_to_dict(item) for item in rows], "total": int(total)}


@router.get("/opcoes/grupos")
def listar_grupos_medicamento(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    return {
        "itens": _listar_aux_por_tipo(
            db=db,
            clinica_id=int(current_user.clinica_id),
            tipo_alvo=MEDICAMENTO_TIPO_AUX_GRUPO,
        )
    }


@router.get("/opcoes/apresentacoes")
def listar_apresentacoes_medicamento(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    return {
        "itens": _listar_aux_por_tipo(
            db=db,
            clinica_id=int(current_user.clinica_id),
            tipo_alvo=MEDICAMENTO_TIPO_AUX_APRESENTACAO,
        )
    }


@router.get("/opcoes/usos")
def listar_usos_medicamento(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    return {
        "itens": _listar_aux_por_tipo(
            db=db,
            clinica_id=int(current_user.clinica_id),
            tipo_alvo=MEDICAMENTO_TIPO_AUX_USO,
        )
    }


@router.get("/{medicamento_id}")
def obter_medicamento(
    medicamento_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    item = (
        db.query(Medicamento)
        .filter(
            Medicamento.id == int(medicamento_id),
            Medicamento.clinica_id == int(current_user.clinica_id),
        )
        .first()
    )
    if not item:
        raise HTTPException(status_code=404, detail="Medicamento não encontrado.")
    return _medicamento_to_dict(item)


@router.post("")
def criar_medicamento(
    payload: MedicamentoPayload,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    _assert_function_access(current_user, [FUNC_INSERIR_MEDICAMENTO])
    nome = str(payload.nome or "").strip()
    if not nome:
        raise HTTPException(status_code=422, detail="Nome do medicamento é obrigatório.")

    item = Medicamento(
        clinica_id=int(current_user.clinica_id),
        nome=nome,
        grupo=_to_text(payload.grupo),
        descricao_substancia=_to_text(payload.descricao_substancia),
        apresentacao=_to_text(payload.apresentacao),
        uso=_to_text(payload.uso),
        posologia_adulto=_to_text(payload.posologia_adulto),
        quantidade_padrao_adulto=_to_text(payload.quantidade_padrao_adulto),
        posologia_crianca=_to_text(payload.posologia_crianca),
        quantidade_padrao_crianca=_to_text(payload.quantidade_padrao_crianca),
        preferido=bool(payload.preferido),
        laboratorio=_to_text(payload.laboratorio),
        observacoes=_to_text(payload.observacoes),
        advertencias=_to_text(payload.advertencias),
        inativo=bool(payload.inativo),
    )
    db.add(item)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Já existe medicamento com este nome para a clínica.",
        )
    db.refresh(item)
    return _medicamento_to_dict(item)


@router.put("/{medicamento_id}")
def atualizar_medicamento(
    medicamento_id: int,
    payload: MedicamentoPayload,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    _assert_function_access(current_user, [FUNC_ALTERAR_MEDICAMENTO])
    item = (
        db.query(Medicamento)
        .filter(
            Medicamento.id == int(medicamento_id),
            Medicamento.clinica_id == int(current_user.clinica_id),
        )
        .first()
    )
    if not item:
        raise HTTPException(status_code=404, detail="Medicamento não encontrado.")

    nome = str(payload.nome or "").strip()
    if not nome:
        raise HTTPException(status_code=422, detail="Nome do medicamento é obrigatório.")

    item.nome = nome
    item.grupo = _to_text(payload.grupo)
    item.descricao_substancia = _to_text(payload.descricao_substancia)
    item.apresentacao = _to_text(payload.apresentacao)
    item.uso = _to_text(payload.uso)
    item.posologia_adulto = _to_text(payload.posologia_adulto)
    item.quantidade_padrao_adulto = _to_text(payload.quantidade_padrao_adulto)
    item.posologia_crianca = _to_text(payload.posologia_crianca)
    item.quantidade_padrao_crianca = _to_text(payload.quantidade_padrao_crianca)
    item.preferido = bool(payload.preferido)
    item.laboratorio = _to_text(payload.laboratorio)
    item.observacoes = _to_text(payload.observacoes)
    item.advertencias = _to_text(payload.advertencias)
    item.inativo = bool(payload.inativo)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Já existe medicamento com este nome para a clínica.",
        )
    db.refresh(item)
    return _medicamento_to_dict(item)


@router.delete("/{medicamento_id}")
def remover_medicamento(
    medicamento_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    _assert_function_access(current_user, [FUNC_ELIMINAR_MEDICAMENTO])
    item = (
        db.query(Medicamento)
        .filter(
            Medicamento.id == int(medicamento_id),
            Medicamento.clinica_id == int(current_user.clinica_id),
        )
        .first()
    )
    if not item:
        raise HTTPException(status_code=404, detail="Medicamento não encontrado.")
    db.delete(item)
    db.commit()
    return {"ok": True}
