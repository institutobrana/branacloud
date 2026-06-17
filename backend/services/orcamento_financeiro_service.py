from __future__ import annotations

from calendar import monthrange
from datetime import date, datetime
from decimal import Decimal, ROUND_HALF_UP
from typing import Any

from fastapi import HTTPException
from sqlalchemy import func, or_
from sqlalchemy.orm import Session

from models.financeiro import CategoriaFinanceira, GrupoFinanceiro, Lancamento
from models.tratamento import Tratamento
from models.usuario import Usuario


MONEY_Q = Decimal("0.01")
DAY_NAMES = ("seg", "ter", "qua", "qui", "sex", "sab", "dom")


def _norm(texto: str | None) -> str:
    return " ".join(str(texto or "").split()).strip().lower()


def _clean_text(value: Any) -> str:
    return " ".join(str(value or "").split()).strip()


def _clean_int(value: Any, default: int = 0) -> int:
    try:
        txt = str(value or "").strip()
        if not txt:
            return default
        return int(float(txt))
    except Exception:
        return default


def _clean_float(value: Any, default: float = 0.0) -> float:
    try:
        txt = str(value or "").strip().replace(",", ".")
        if not txt:
            return default
        return float(txt)
    except Exception:
        return default


def _parse_date(value: Any) -> date | None:
    texto = _clean_text(value)
    if not texto:
        return None
    for fmt in ("%Y-%m-%d", "%d/%m/%Y"):
        try:
            return datetime.strptime(texto[:10], fmt).date()
        except Exception:
            continue
    return None


def _date_to_iso(value: Any) -> str:
    parsed = _parse_date(value)
    return parsed.isoformat() if parsed else ""


def _today_iso() -> str:
    return date.today().isoformat()


def _br_day_name(value: date | None) -> str:
    if not value:
        return ""
    return DAY_NAMES[value.weekday()]


def _money(value: Any) -> float:
    try:
        return float(Decimal(str(_clean_float(value, 0.0))).quantize(MONEY_Q, rounding=ROUND_HALF_UP))
    except Exception:
        return 0.0


def _split_money(total: float, quantidade: int) -> list[float]:
    qtd = max(int(quantidade or 0), 1)
    total_dec = Decimal(str(max(float(total or 0), 0.0))).quantize(MONEY_Q, rounding=ROUND_HALF_UP)
    base = (total_dec / qtd).quantize(MONEY_Q, rounding=ROUND_HALF_UP)
    valores = [base for _ in range(qtd)]
    soma = sum(valores, Decimal("0.00"))
    diferenca = total_dec - soma
    if diferenca:
        valores[0] = (valores[0] + diferenca).quantize(MONEY_Q, rounding=ROUND_HALF_UP)
    return [float(v) for v in valores]


def _add_months(base: date, months: int) -> date:
    month = base.month - 1 + months
    year = base.year + month // 12
    month = month % 12 + 1
    day = min(base.day, monthrange(year, month)[1])
    return date(year, month, day)


def _today_br() -> str:
    return date.today().strftime("%d/%m/%Y")


def _orcamento_blob(tratamento: Tratamento) -> dict[str, Any]:
    payload = tratamento.source_payload if isinstance(tratamento.source_payload, dict) else {}
    orcamento = payload.get("orcamento")
    return dict(orcamento) if isinstance(orcamento, dict) else {}


def _save_orcamento_blob(tratamento: Tratamento, blob: dict[str, Any]) -> None:
    payload = dict(tratamento.source_payload or {}) if isinstance(tratamento.source_payload, dict) else {}
    if blob:
        payload["orcamento"] = blob
    else:
        payload.pop("orcamento", None)
    tratamento.source_payload = payload or None


def _categoria_orcamento_or_404(db: Session, clinica_id: int) -> CategoriaFinanceira:
    categorias = (
        db.query(CategoriaFinanceira)
        .filter(CategoriaFinanceira.clinica_id == int(clinica_id))
        .order_by(CategoriaFinanceira.nome.asc(), CategoriaFinanceira.id.asc())
        .all()
    )
    if not categorias:
        raise HTTPException(status_code=404, detail="Nao existe categoria financeira para aprovar o orcamento.")
    for categoria in categorias:
        tipo = _norm(categoria.tipo)
        if tipo == "entrada":
            return categoria
    for categoria in categorias:
        nome = _norm(categoria.nome)
        if any(token in nome for token in ("orc", "trat", "pacient", "honor", "receb")):
            return categoria
    return categorias[0]


def _lancamentos_do_orcamento(db: Session, clinica_id: int, tratamento_id: int) -> list[Lancamento]:
    return (
        db.query(Lancamento)
        .filter(
            Lancamento.clinica_id == int(clinica_id),
            or_(
                Lancamento.documento == f"orcamento:{int(tratamento_id)}",
                Lancamento.referencia.like(f"orcamento:{int(tratamento_id)}:%"),
            ),
        )
        .order_by(Lancamento.data_lancamento.asc(), Lancamento.id.asc())
        .all()
    )


def _somar_pago(db: Session, clinica_id: int, tratamento_id: int) -> float:
    rows = _lancamentos_do_orcamento(db, clinica_id, tratamento_id)
    total = 0.0
    for row in rows:
        tipo = _norm(row.tipo)
        if tipo == "credito":
            total += float(row.valor or 0)
    return _money(total)


def _build_parcelas(
    tratamento: Tratamento,
    valor_corrigido: float,
    blob: dict[str, Any],
) -> list[dict[str, Any]]:
    parcelamento = blob.get("parcelas_planejadas")
    if isinstance(parcelamento, list) and parcelamento:
        parcelas: list[dict[str, Any]] = []
        for idx, item in enumerate(parcelamento, start=1):
            if not isinstance(item, dict):
                continue
            data = _parse_date(item.get("data"))
            valor = _money(item.get("valor"))
            credito = _money(item.get("credito", valor))
            parcelas.append(
                {
                    "numero": int(item.get("numero") or idx),
                    "dia": _clean_text(item.get("dia")) or _br_day_name(data),
                    "data": data,
                    "valor": valor,
                    "credito": credito,
                    "valor_ja_pago": _money(item.get("valor_ja_pago", 0)),
                }
            )
        if parcelas:
            return parcelas

    quantidade = max(_clean_int(blob.get("parcelas"), 1), 1)
    inicio = _parse_date(getattr(tratamento, "data_inicio", None)) or date.today()
    valores = _split_money(valor_corrigido, quantidade)
    parcelas = []
    for idx in range(quantidade):
        data = _add_months(inicio, idx)
        valor = _money(valores[idx])
        parcelas.append(
            {
                "numero": idx + 1,
                "dia": _br_day_name(data),
                "data": data,
                "valor": valor,
                "credito": valor,
                "valor_ja_pago": 0.0,
            }
        )
    return parcelas


def calcular_financeiro_orcamento(
    db: Session,
    clinica_id: int,
    tratamento: Tratamento,
    intervencoes: list[dict[str, Any]],
    blob: dict[str, Any] | None = None,
) -> dict[str, Any]:
    base = dict(blob or _orcamento_blob(tratamento))
    desconto_percentual = _money(base.get("desconto_percentual", 0))
    valor_diferenca = _money(base.get("valor_diferenca", 0))

    valor_total = 0.0
    for item in intervencoes:
        if not item.get("incluir", True):
            continue
        valor_total += _money(item.get("paciente_rs", 0)) + _money(item.get("convenio_rs", 0))
    valor_total = _money(valor_total)

    valor_corrigido = _money(max(valor_total - (valor_total * desconto_percentual / 100.0), 0.0) + valor_diferenca)
    total_ja_pago = _somar_pago(db, clinica_id, int(tratamento.id))
    total_a_pagar = _money(max(valor_corrigido - total_ja_pago, 0.0))

    parcelas = _build_parcelas(tratamento, valor_corrigido, base)
    base["parcelas_planejadas"] = parcelas
    base.setdefault("parcelas", max(len(parcelas), 1))

    return {
        "valor_total": valor_total,
        "desconto_percentual": desconto_percentual,
        "valor_corrigido": valor_corrigido,
        "total_ja_pago": total_ja_pago,
        "total_a_pagar": total_a_pagar,
        "indice": "R$",
        "parcelas": int(base.get("parcelas") or len(parcelas) or 1),
        "valor_diferenca": valor_diferenca,
        "parcelas_planejadas": parcelas,
        "orcamento_blob": base,
    }


def atualizar_parcela_orcamento(
    tratamento: Tratamento,
    numero_parcela: int,
    payload: dict[str, Any],
) -> dict[str, Any]:
    blob = _orcamento_blob(tratamento)
    parcelas = blob.get("parcelas_planejadas")
    if not isinstance(parcelas, list):
        parcelas = []
    alvo = int(numero_parcela)
    while len(parcelas) < alvo:
        parcelas.append({"numero": len(parcelas) + 1})
    item = dict(parcelas[alvo - 1] or {})
    if payload.get("data") is not None:
        item["data"] = _date_to_iso(payload.get("data"))
    if payload.get("valor_parcela") is not None:
        item["valor"] = _money(payload.get("valor_parcela"))
        item["credito"] = _money(payload.get("valor_parcela"))
    if payload.get("valor_ja_pago") is not None:
        item["valor_ja_pago"] = _money(payload.get("valor_ja_pago"))
    parcelas[alvo - 1] = item
    blob["parcelas_planejadas"] = parcelas
    blob["parcelas"] = max(_clean_int(blob.get("parcelas"), 1), len(parcelas))
    _save_orcamento_blob(tratamento, blob)
    return blob


def registrar_aprovacao_orcamento(
    db: Session,
    current_user: Usuario,
    tratamento: Tratamento,
    parcelas: list[dict[str, Any]],
    gerar_conta_corrente: bool = True,
) -> dict[str, Any]:
    blob = _orcamento_blob(tratamento)
    categoria = _categoria_orcamento_or_404(db, int(current_user.clinica_id))
    lancamentos_ids: list[int] = []
    conta_corrente_aberta = False

    if gerar_conta_corrente:
        existentes = _lancamentos_do_orcamento(db, int(current_user.clinica_id), int(tratamento.id))
        if not existentes:
            for parcela in parcelas:
                valor = _money(parcela.get("valor", 0))
                if valor <= 0:
                    continue
                data_parcela = parcela.get("data")
                data_iso = _date_to_iso(data_parcela) or tratamento.data_inicio or _today_iso()
                item = Lancamento(
                    clinica_id=int(current_user.clinica_id),
                    categoria_id=int(categoria.id),
                    historico=f"Orcamento tratamento {int(tratamento.nrotra or 0)}",
                    valor=valor,
                    tipo="debito",
                    conta="CLINICA",
                    situacao="Aberto",
                    data_lancamento=data_iso,
                    data_vencimento=data_iso,
                    data_pagamento=None,
                    documento=f"orcamento:{int(tratamento.id)}",
                    referencia=f"orcamento:{int(tratamento.id)}:parcela:{int(parcela.get('numero') or 0)}",
                    complemento=_clean_text(getattr(tratamento.paciente, "nome_completo", None) or getattr(tratamento.paciente, "nome", None)),
                    tributavel=0,
                    parcelado=1,
                    qtd_parcelas=max(len(parcelas), 1),
                    parcela_atual=int(parcela.get("numero") or 1),
                )
                db.add(item)
                db.flush()
                lancamentos_ids.append(int(item.id))
            db.commit()
            conta_corrente_aberta = bool(lancamentos_ids)
        else:
            conta_corrente_aberta = True
            lancamentos_ids = [int(item.id) for item in existentes]

    blob["aprovado"] = True
    blob["aprovado_em"] = _today_br()
    blob["aprovado_por"] = _clean_text(getattr(current_user, "apelido", None) or getattr(current_user, "nome", None))
    if lancamentos_ids:
        blob["lancamentos_ids"] = lancamentos_ids
    _save_orcamento_blob(tratamento, blob)
    db.commit()

    return {
        "detail": "Orcamento aprovado.",
        "conta_corrente_aberta": conta_corrente_aberta,
        "lancamentos_ids": lancamentos_ids,
        "orcamento_blob": blob,
    }


def preparar_impressao_orcamento(
    tratamento: Tratamento,
    blob: dict[str, Any],
    payload: dict[str, Any],
) -> dict[str, Any]:
    impressao = {
        "modelo_orcamento": _clean_text(payload.get("modelo_orcamento") or "Resumido"),
        "saida": _clean_text(payload.get("saida") or "Impressora"),
        "endereco": _clean_text(payload.get("endereco")),
        "imprimir_odontograma": bool(payload.get("imprimir_odontograma", True)),
        "imprimir_valores_intervencoes": bool(payload.get("imprimir_valores_intervencoes", True)),
        "titulo_relatorio": _clean_text(payload.get("titulo_relatorio") or "Previsao de honorarios"),
        "mensagem_para_impressao": _clean_text(payload.get("mensagem_para_impressao")),
        "imprimir_observacoes_do_tratamento": bool(payload.get("imprimir_observacoes_do_tratamento", False)),
        "tratamento_id": int(tratamento.id),
    }
    return {
        "detail": "Impressao preparada.",
        "impressao": impressao,
        "orcamento_blob": blob,
    }
