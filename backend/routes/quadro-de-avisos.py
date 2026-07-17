from __future__ import annotations

from datetime import date, datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy import or_
from sqlalchemy.orm import Session

from database import get_db
from models.financeiro import Lancamento
from models.paciente import Paciente
from models.quadro_avisos import QuadroAviso
from models.usuario import Usuario
from security.dependencies import get_current_user, require_module_access

router = APIRouter(
    prefix="/agenda-legado/quadro-avisos",
    tags=["agenda-legado"],
    dependencies=[Depends(require_module_access("agenda"))],
)


def _clean_text(value) -> str:
    return " ".join(str(value or "").split()).strip()


def _parse_date_text(value) -> date | None:
    if isinstance(value, datetime):
        return value.date()
    if isinstance(value, date):
        return value
    txt = _clean_text(value)
    if not txt:
        return None
    for fmt in ("%Y-%m-%d", "%d/%m/%Y", "%d-%m-%Y"):
        try:
            return datetime.strptime(txt, fmt).date()
        except Exception:
            continue
    try:
        return date.fromisoformat(txt[:10])
    except Exception:
        return None


def _today() -> date:
    return date.today()


def _week_bounds(today: date | None = None) -> tuple[date, date]:
    ref = today or _today()
    return ref, ref + timedelta(days=6)


def _month_bounds(today: date | None = None) -> tuple[date, date]:
    ref = today or _today()
    start = ref.replace(day=1)
    next_month = (start.replace(day=28) + timedelta(days=4)).replace(day=1)
    return start, next_month - timedelta(days=1)


def _format_amount(value) -> float:
    try:
        return round(abs(float(value or 0)), 2)
    except Exception:
        return 0.0


def _format_br_day(value: date | None) -> str:
    if not value:
        return ""
    return value.strftime("%d/%m")


def _format_br_full_date(value: date | None) -> str:
    if not value:
        return ""
    return value.strftime("%d/%m/%Y")


def _birthday_in_week(birth_date: date, start: date, end: date) -> date | None:
    if not birth_date:
        return None
    for year in (start.year, end.year):
        try:
            candidate = birth_date.replace(year=year)
        except ValueError:
            if birth_date.month == 2 and birth_date.day == 29:
                candidate = date(year, 2, 28)
            else:
                continue
        if start <= candidate <= end:
            return candidate
    return None


def _load_finance_rows(db: Session, clinica_id: int, week_start: date, week_end: date, tipos: set[str]) -> list[dict]:
    rows = (
        db.query(Lancamento)
        .filter(Lancamento.clinica_id == clinica_id)
        .order_by(Lancamento.id.asc())
        .all()
    )
    itens: list[dict] = []
    for item in rows:
        tipo = _clean_text(getattr(item, "tipo", "")).lower()
        if tipo not in tipos:
            continue
        vencimento = _parse_date_text(getattr(item, "data_vencimento", None))
        if not vencimento:
            vencimento = _parse_date_text(getattr(item, "data_lancamento", None))
        if not vencimento or not (week_start <= vencimento <= week_end):
            continue
        historico = _clean_text(
            getattr(item, "historico", None)
            or getattr(item, "documento", None)
            or getattr(item, "referencia", None)
            or getattr(item, "complemento", None)
            or ""
        ) or "Lancamento"
        itens.append(
            {
                "id": int(item.id),
                "data": _format_br_day(vencimento),
                "data_iso": vencimento.isoformat(),
                "historico": historico,
                "valor": _format_amount(getattr(item, "valor", 0)),
                "tipo": tipo,
                "situacao": _clean_text(getattr(item, "situacao", "")),
            }
        )
    itens.sort(key=lambda row: (row["data_iso"], row["historico"].lower(), row["id"]))
    return itens


def _load_birthdays(db: Session, clinica_id: int, week_start: date, week_end: date) -> list[dict]:
    rows = (
        db.query(Paciente)
        .filter(Paciente.clinica_id == clinica_id, Paciente.inativo.is_(False))
        .order_by(Paciente.nome_completo.asc(), Paciente.id.asc())
        .all()
    )
    itens: list[dict] = []
    for item in rows:
        nasc = _parse_date_text(getattr(item, "data_nascimento", None))
        if not nasc:
            continue
        candidate = _birthday_in_week(nasc, week_start, week_end)
        if not candidate:
            continue
        nome = _clean_text(getattr(item, "nome_completo", None) or getattr(item, "nome", None))
        if not nome:
            continue
        itens.append(
            {
                "id": int(item.id),
                "data": _format_br_day(candidate),
                "data_iso": candidate.isoformat(),
                "nome": nome,
                "data_nascimento": _format_br_full_date(nasc),
            }
        )
    itens.sort(key=lambda row: (row["data_iso"], row["nome"].lower(), row["id"]))
    return itens


def _section_payload(titulo: str, colunas: list[str], itens: list[dict], total: float | None = None, nota: str | None = None) -> dict:
    payload = {
        "titulo": titulo,
        "colunas": colunas,
        "itens": itens,
        "quantidade": len(itens),
    }
    if total is not None:
        payload["total"] = round(float(total or 0), 2)
    if nota:
        payload["nota"] = nota
    return payload


def _full_name(usuario: Usuario | None) -> str:
    if not usuario:
        return ""
    return _clean_text(getattr(usuario, "apelido", None) or getattr(usuario, "nome", None) or "")


def _load_usuarios(db: Session, clinica_id: int) -> list[Usuario]:
    return (
        db.query(Usuario)
        .filter(Usuario.clinica_id == clinica_id)
        .order_by(Usuario.apelido.asc().nullslast(), Usuario.nome.asc(), Usuario.id.asc())
        .all()
    )


def _usuarios_ativos_payload(db: Session, clinica_id: int) -> list[dict]:
    usuarios = (
        db.query(Usuario)
        .filter(Usuario.clinica_id == clinica_id, Usuario.ativo.is_(True))
        .order_by(Usuario.apelido.asc().nullslast(), Usuario.nome.asc(), Usuario.id.asc())
        .all()
    )
    return [
        {
            "id": int(usuario.id),
            "apelido": _clean_text(getattr(usuario, "apelido", None) or getattr(usuario, "nome", None)),
            "nome": _clean_text(getattr(usuario, "nome", None)),
            "label": _full_name(usuario),
        }
        for usuario in usuarios
    ]


def _aviso_to_payload(aviso: QuadroAviso, usuarios: dict[int, Usuario]) -> dict:
    remetente = usuarios.get(int(aviso.remetente_id))
    destinatario = usuarios.get(int(aviso.destinatario_id))
    return {
        "id": int(aviso.id),
        "clinica_id": int(aviso.clinica_id),
        "remetente_id": int(aviso.remetente_id),
        "destinatario_id": int(aviso.destinatario_id),
        "remetente": _full_name(remetente),
        "destinatario": _full_name(destinatario),
        "afixado_em": aviso.afixado_em.isoformat() if aviso.afixado_em else "",
        "remover_em": aviso.remover_em.isoformat() if aviso.remover_em else "",
        "texto": _clean_text(aviso.texto),
        "ativo": bool(aviso.ativo),
    }


def _avisos_query(db: Session, current_user: Usuario, visiveis: bool = False):
    today = _today()
    query = db.query(QuadroAviso).filter(QuadroAviso.clinica_id == int(current_user.clinica_id))
    query = query.filter(
        or_(
            QuadroAviso.remetente_id == int(current_user.id),
            QuadroAviso.destinatario_id == int(current_user.id),
        )
    )
    if visiveis:
        query = query.filter(
            QuadroAviso.ativo.is_(True),
            QuadroAviso.afixado_em.isnot(None),
            QuadroAviso.remover_em.isnot(None),
            QuadroAviso.afixado_em <= today,
            QuadroAviso.remover_em > today,
        )
    return query.order_by(QuadroAviso.afixado_em.asc(), QuadroAviso.id.asc())


def _avisos_payload(db: Session, current_user: Usuario, visiveis: bool = False) -> list[dict]:
    usuarios = {int(usuario.id): usuario for usuario in _load_usuarios(db, int(current_user.clinica_id))}
    avisos = _avisos_query(db, current_user, visiveis=visiveis).all()
    return [_aviso_to_payload(aviso, usuarios) for aviso in avisos]


def _avisos_visible_section(db: Session, current_user: Usuario) -> dict:
    avisos = _avisos_payload(db, current_user, visiveis=True)
    itens = [{"texto": aviso["texto"]} for aviso in avisos]
    nota = "Nenhum aviso ativo no periodo." if not itens else None
    return _section_payload("Avisos e recados", ["Aviso"], itens, nota=nota)


def _get_aviso_editavel(db: Session, current_user: Usuario, aviso_id: int) -> QuadroAviso:
    aviso = (
        db.query(QuadroAviso)
        .filter(
            QuadroAviso.id == int(aviso_id),
            QuadroAviso.clinica_id == int(current_user.clinica_id),
        )
        .first()
    )
    if not aviso:
        raise HTTPException(status_code=404, detail="Aviso nao encontrado.")
    if not (
        int(aviso.remetente_id) == int(current_user.id)
        or int(aviso.destinatario_id) == int(current_user.id)
        or bool(getattr(current_user, "is_admin", False))
    ):
        raise HTTPException(status_code=403, detail="Sem permissao para alterar este aviso.")
    return aviso


class AvisoUpsertPayload(BaseModel):
    destinatario_id: int
    afixado_em: str | None = None
    remover_em: str | None = None
    texto: str = Field(default="")


@router.get("")
def get_quadro_avisos(
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    week_start, week_end = _week_bounds()
    month_start, month_end = _month_bounds()

    contas_pagar = _load_finance_rows(
        db,
        int(current_user.clinica_id),
        week_start,
        week_end,
        {"debito", "despesa", "saida"},
    )
    contas_receber = _load_finance_rows(
        db,
        int(current_user.clinica_id),
        week_start,
        week_end,
        {"credito", "receita", "entrada"},
    )
    aniversariantes = _load_birthdays(db, int(current_user.clinica_id), week_start, week_end)
    usuarios_ativos = _usuarios_ativos_payload(db, int(current_user.clinica_id))

    pendencia_retornos = (
        "Pendencia de mapeamento: o Brana Cloude ainda nao tem uma origem persistida confiavel "
        "para o bloco 'retornos no mes'."
    )

    return {
        "screen": {
            "title": "Quadro de avisos",
            "open_on_login_key": "exibir_quadro_avisos",
        },
        "range": {
            "week_start": week_start.isoformat(),
            "week_end": week_end.isoformat(),
            "month_start": month_start.isoformat(),
            "month_end": month_end.isoformat(),
        },
        "usuarios_ativos": usuarios_ativos,
        "avisos_visiveis": _avisos_payload(db, current_user, visiveis=True),
        "sections": {
            "avisos_recados": _avisos_visible_section(db, current_user),
            "contas_pagar_semana": _section_payload(
                "Contas a pagar na semana",
                ["Data", "Historico", "Valor (R$)"],
                contas_pagar,
                total=sum(row["valor"] for row in contas_pagar),
            ),
            "contas_receber_semana": _section_payload(
                "Contas a receber na semana",
                ["Data", "Nome do paciente", "Valor (R$)"],
                contas_receber,
                total=sum(row["valor"] for row in contas_receber),
            ),
            "aniversariantes_semana": _section_payload(
                "Aniversariantes da semana",
                ["Data", "Nome do paciente"],
                aniversariantes,
            ),
            "retornos_mes": _section_payload(
                "Retornos no mes",
                ["Data", "Paciente"],
                [],
                nota=pendencia_retornos,
            ),
        },
        "pendencias": [
            pendencia_retornos,
        ],
        "meta": {
            "clinic_id": int(current_user.clinica_id),
            "generated_at": datetime.now().isoformat(timespec="seconds"),
        },
    }


@router.get("/usuarios")
def listar_usuarios_ativos(
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return _usuarios_ativos_payload(db, int(current_user.clinica_id))


@router.get("/avisos")
def listar_avisos(
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
    visiveis: bool = Query(default=False),
):
    return _avisos_payload(db, current_user, visiveis=visiveis)


@router.post("/avisos")
def criar_aviso(
    payload: AvisoUpsertPayload,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    destinatario = (
        db.query(Usuario)
        .filter(
            Usuario.id == int(payload.destinatario_id),
            Usuario.clinica_id == int(current_user.clinica_id),
        )
        .first()
    )
    if not destinatario:
        raise HTTPException(status_code=404, detail="Destinatario nao encontrado.")

    afixado_em = _parse_date_text(payload.afixado_em) or _today()
    remover_em = _parse_date_text(payload.remover_em) or (afixado_em + timedelta(days=7))
    texto = payload.texto.strip()
    if not texto:
        raise HTTPException(status_code=400, detail="Informe o texto do aviso.")
    if remover_em <= afixado_em:
        raise HTTPException(status_code=400, detail="Remover dia deve ser posterior ao afixar dia.")

    aviso = QuadroAviso(
        clinica_id=int(current_user.clinica_id),
        remetente_id=int(current_user.id),
        destinatario_id=int(destinatario.id),
        afixado_em=afixado_em,
        remover_em=remover_em,
        texto=texto,
        ativo=True,
    )
    db.add(aviso)
    db.commit()
    db.refresh(aviso)
    return {"ok": True, "aviso": _aviso_to_payload(aviso, {int(destinatario.id): destinatario, int(current_user.id): current_user})}


@router.patch("/avisos/{aviso_id}")
def atualizar_aviso(
    aviso_id: int,
    payload: AvisoUpsertPayload,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    aviso = _get_aviso_editavel(db, current_user, aviso_id)
    destinatario = (
        db.query(Usuario)
        .filter(
            Usuario.id == int(payload.destinatario_id),
            Usuario.clinica_id == int(current_user.clinica_id),
        )
        .first()
    )
    if not destinatario:
        raise HTTPException(status_code=404, detail="Destinatario nao encontrado.")

    afixado_em = _parse_date_text(payload.afixado_em) or aviso.afixado_em or _today()
    remover_em = _parse_date_text(payload.remover_em) or aviso.remover_em or (afixado_em + timedelta(days=7))
    texto = payload.texto.strip()
    if not texto:
        raise HTTPException(status_code=400, detail="Informe o texto do aviso.")
    if remover_em <= afixado_em:
        raise HTTPException(status_code=400, detail="Remover dia deve ser posterior ao afixar dia.")

    aviso.destinatario_id = int(destinatario.id)
    aviso.afixado_em = afixado_em
    aviso.remover_em = remover_em
    aviso.texto = texto
    db.add(aviso)
    db.commit()
    db.refresh(aviso)
    return {"ok": True, "aviso": _aviso_to_payload(aviso, {int(destinatario.id): destinatario, int(current_user.id): current_user})}


@router.delete("/avisos/{aviso_id}")
def excluir_aviso(
    aviso_id: int,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    aviso = _get_aviso_editavel(db, current_user, aviso_id)
    db.delete(aviso)
    db.commit()
    return {"ok": True}
