from __future__ import annotations

from datetime import date, datetime
from typing import Any

from fastapi import HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session, selectinload

from models.odontograma_model import OdontogramaIntervencao
from models.paciente import Paciente
from models.prestador_odonto import PrestadorOdonto
from models.procedimento import Procedimento
from models.tratamento import Tratamento
from models.usuario import Usuario
from repositories.odontograma_repository import listar_status
from schemas.orcamento_schema import (
    OrcamentoAprovacaoPayload,
    OrcamentoImpressaoPayload,
    OrcamentoIntervencaoUpdatePayload,
    OrcamentoParcelaUpdatePayload,
)
from services.orcamento_financeiro_service import (
    atualizar_parcela_orcamento,
    calcular_financeiro_orcamento,
    preparar_impressao_orcamento,
    registrar_aprovacao_orcamento,
)


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


def _fmt_date(value: Any) -> str:
    parsed = _parse_date(value)
    return parsed.strftime("%d/%m/%Y") if parsed else ""


def _paciente_or_404(db: Session, clinica_id: int, paciente_id: int) -> Paciente:
    item = (
        db.query(Paciente)
        .filter(
            Paciente.id == int(paciente_id),
            Paciente.clinica_id == int(clinica_id),
        )
        .first()
    )
    if not item:
        raise HTTPException(status_code=404, detail="Paciente nao encontrado.")
    return item


def _tratamento_or_404(db: Session, clinica_id: int, tratamento_id: int) -> Tratamento:
    item = (
        db.query(Tratamento)
        .options(
            selectinload(Tratamento.paciente),
            selectinload(Tratamento.cirurgiao_responsavel),
            selectinload(Tratamento.cirurgiao_contratado),
            selectinload(Tratamento.cirurgiao_solicitante),
            selectinload(Tratamento.cirurgiao_executante),
        )
        .filter(
            Tratamento.id == int(tratamento_id),
            Tratamento.clinica_id == int(clinica_id),
        )
        .first()
    )
    if not item:
        raise HTTPException(status_code=404, detail="Tratamento nao encontrado.")
    return item


def _intervencao_or_404(
    db: Session,
    clinica_id: int,
    tratamento_id: int,
    intervencao_id: int,
) -> OdontogramaIntervencao:
    item = (
        db.query(OdontogramaIntervencao)
        .options(
            selectinload(OdontogramaIntervencao.status),
            selectinload(OdontogramaIntervencao.prestador),
            selectinload(OdontogramaIntervencao.procedimento),
            selectinload(OdontogramaIntervencao.dentes),
            selectinload(OdontogramaIntervencao.faces),
        )
        .filter(
            OdontogramaIntervencao.id == int(intervencao_id),
            OdontogramaIntervencao.clinica_id == int(clinica_id),
            OdontogramaIntervencao.tratamento_id == int(tratamento_id),
        )
        .first()
    )
    if not item:
        raise HTTPException(status_code=404, detail="Intervencao nao encontrada.")
    return item


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


def _norm(texto: str | None) -> str:
    return " ".join(str(texto or "").split()).strip().lower()


def _status_map(db: Session) -> dict[str, Any]:
    mapping: dict[str, Any] = {}
    for item in listar_status(db):
        codigo = _norm(getattr(item, "codigo", None))
        descricao = _norm(getattr(item, "descricao", None))
        if codigo:
            mapping[codigo] = item
        if descricao:
            mapping[descricao] = item
    return mapping


def _resolver_status_id(db: Session, situacao: str | None, default: int) -> int:
    if not situacao:
        return int(default)
    mapa = _status_map(db)
    chave = _norm(situacao)
    if chave in mapa:
        return int(mapa[chave].id)
    for item in mapa.values():
        if _norm(getattr(item, "descricao", None)).startswith(chave):
            return int(item.id)
    return int(default)


def _regiao_intervencao(intervencao: OdontogramaIntervencao) -> str:
    numeros = sorted(
        {
            int(d.numero_dente_fdi)
            for d in (getattr(intervencao, "dentes", []) or [])
            if getattr(d, "numero_dente_fdi", None) is not None
        }
    )
    if not numeros:
        return "Todos"
    if len(numeros) == 1:
        return str(numeros[0])
    if numeros[-1] - numeros[0] + 1 == len(numeros):
        return f"{numeros[0]}-{numeros[-1]}"
    return "-".join(str(n) for n in numeros)


def _nome_prestador(intervencao: OdontogramaIntervencao, tratamento: Tratamento) -> str:
    prestador = getattr(intervencao, "prestador", None)
    if isinstance(prestador, PrestadorOdonto):
        nome = (prestador.apelido or prestador.nome or "").strip()
        if nome:
            return nome
    if getattr(tratamento, "cirurgiao_responsavel_nome", None):
        return _clean_text(tratamento.cirurgiao_responsavel_nome)
    return ""


def _intervencao_override(blob: dict[str, Any], intervencao_id: int) -> dict[str, Any]:
    intervencoes = blob.get("intervencoes")
    if not isinstance(intervencoes, dict):
        return {}
    item = intervencoes.get(str(int(intervencao_id)))
    return dict(item) if isinstance(item, dict) else {}


def _procedimento_valores(
    intervencao: OdontogramaIntervencao,
    override: dict[str, Any],
) -> tuple[float, float]:
    procedimento = getattr(intervencao, "procedimento", None)
    preco_base = float(getattr(procedimento, "preco", 0) or 0)
    repasse_base = float(getattr(procedimento, "valor_repasse", 0) or 0)

    if override.get("receber_paciente") is not None:
        preco_base = _clean_float(override.get("receber_paciente"), preco_base)
    if override.get("receber_convenio") is not None:
        repasse_base = _clean_float(override.get("receber_convenio"), repasse_base)

    if override.get("nao_incluir_no_orcamento"):
        return 0.0, 0.0

    return round(float(preco_base or 0), 2), round(float(repasse_base or 0), 2)


def _intervencao_view(
    db: Session,
    tratamento: Tratamento,
    intervencao: OdontogramaIntervencao,
    blob: dict[str, Any],
) -> dict[str, Any]:
    override = _intervencao_override(blob, int(intervencao.id))
    procedimento = getattr(intervencao, "procedimento", None)
    status = getattr(intervencao, "status", None)
    paciente_rs, convenio_rs = _procedimento_valores(intervencao, override)
    return {
        "id": int(intervencao.id),
        "procedimento_id": int(getattr(intervencao, "procedimento_id", 0) or 0),
        "codigo": int(getattr(procedimento, "codigo", 0) or 0),
        "regiao": _clean_text(override.get("regiao")) or _regiao_intervencao(intervencao),
        "cirurgiao": _clean_text(override.get("cirurgiao")) or _nome_prestador(intervencao, tratamento),
        "intervencao": _clean_text(getattr(procedimento, "nome", None)),
        "paciente_rs": paciente_rs,
        "convenio_rs": convenio_rs,
        "incluir": not bool(override.get("nao_incluir_no_orcamento")),
        "status": _clean_text(override.get("situacao")) or _clean_text(getattr(status, "descricao", None)),
        "marcacao": _parse_date(override.get("marcacao")) or getattr(intervencao, "data_planejada", None),
        "finalizacao": _parse_date(override.get("finalizacao")) or getattr(intervencao, "data_execucao", None),
        "observacoes": _clean_text(override.get("observacoes")) or _clean_text(getattr(intervencao, "observacao_resumida", None)),
        "codigo_glosa": _clean_text(override.get("codigo_glosa")),
        "mensagem_autorizacao": _clean_text(override.get("mensagem_autorizacao")),
        "tabela_codigo": _clean_int(override.get("tabela_codigo"), int(tratamento.tabela_codigo or 1)),
        "cirurgiao_id": _clean_int(override.get("cirurgiao_id"), int(getattr(intervencao, "prestador_id", 0) or 0)) or None,
    }


def _detalhes_view(tratamento: Tratamento, blob: dict[str, Any]) -> dict[str, Any]:
    return {
        "nro_tratamento": f"{int(tratamento.nrotra or 0):06d}",
        "validade": _clean_text(tratamento.validade_senha or blob.get("validade")),
        "criacao_tratamento": _clean_text(
            blob.get("data_inclusao")
            or (tratamento.criado_em.strftime("%d/%m/%Y %H:%M") if tratamento.criado_em else "")
        ),
        "ultima_alteracao": _clean_text(
            blob.get("data_alteracao")
            or (tratamento.atualizado_em.strftime("%d/%m/%Y %H:%M") if tratamento.atualizado_em else "")
        ),
        "ultima_aprovacao": _clean_text(blob.get("aprovado_em")),
    }


def _convenio_view(tratamento: Tratamento, blob: dict[str, Any], intervencoes: list[dict[str, Any]]) -> dict[str, Any]:
    total_repasse_previsto = 0.0
    for item in intervencoes:
        if item.get("incluir", True):
            total_repasse_previsto += float(item.get("convenio_rs") or 0)
    return {
        "numero_guia_tratamento": _clean_text(tratamento.numero_guia or blob.get("numero_guia")),
        "senha_autorizacao": _clean_text(tratamento.senha_autorizacao or blob.get("senha_autorizacao")),
        "total_repasse_previsto": round(float(total_repasse_previsto or 0), 2),
        "data_prevista_pagamento": _clean_text(blob.get("data_prevista_pagamento")),
    }


def _ortodontia_view(tratamento: Tratamento, blob: dict[str, Any]) -> dict[str, Any]:
    return {
        "valor_manutencao_moeda": "R$",
        "valor_manutencao": _clean_float(blob.get("valor_manutencao"), 0.0),
        "vencimento_dia": _clean_int(blob.get("vencimento_dia"), 0),
        "termino_previsto": _clean_text(blob.get("termino_previsto") or tratamento.data_finalizacao),
        "ativar_manutencao": bool(blob.get("ativar_manutencao", False)),
    }


def _comissoes_view(blob: dict[str, Any]) -> list[dict[str, Any]]:
    comissoes = blob.get("comissoes")
    if not isinstance(comissoes, list):
        return []
    itens: list[dict[str, Any]] = []
    for idx, item in enumerate(comissoes, start=1):
        if not isinstance(item, dict):
            continue
        itens.append(
            {
                "numero": int(item.get("numero") or idx),
                "valor": _clean_float(item.get("valor"), 0.0),
                "cirurgiao": _clean_text(item.get("cirurgiao")),
                "percentual": _clean_float(item.get("percentual"), 0.0),
                "comissao": _clean_float(item.get("comissao"), 0.0),
            }
        )
    return itens


def _tratamento_view(
    db: Session,
    tratamento: Tratamento,
    blob: dict[str, Any],
    principal: dict[str, Any],
) -> dict[str, Any]:
    paciente = tratamento.paciente
    return {
        "id": int(tratamento.id),
        "paciente_id": int(tratamento.paciente_id),
        "paciente_nome": _clean_text(getattr(paciente, "nome_completo", None) or getattr(paciente, "nome", None)),
        "paciente_codigo": int(getattr(paciente, "codigo", 0) or 0),
        "nrotra": int(tratamento.nrotra or 0),
        "situacao": _clean_text(tratamento.situacao),
        "data_inicio": _clean_text(tratamento.data_inicio),
        "data_finalizacao": _clean_text(tratamento.data_finalizacao),
        "tabela_codigo": int(tratamento.tabela_codigo or 1),
        "indice": int(tratamento.indice or 255),
        "cirurgiao_responsavel_id": int(tratamento.cirurgiao_responsavel_id) if tratamento.cirurgiao_responsavel_id else None,
        "cirurgiao_responsavel_nome": _clean_text(tratamento.cirurgiao_responsavel_nome),
        "unidade_atendimento": _clean_text(tratamento.unidade_atendimento),
        "observacoes": _clean_text(tratamento.observacoes),
        "convenio_nome": _clean_text(tratamento.convenio_nome),
        "id_convenio": int(tratamento.id_convenio) if tratamento.id_convenio is not None else None,
        "tipo_atendimento_tiss_id": int(tratamento.tipo_atendimento_tiss_id) if tratamento.tipo_atendimento_tiss_id is not None else None,
        "tipo_atendimento_tiss_nome": _clean_text(tratamento.tipo_atendimento_tiss_nome),
        "sinais_doenca_periodontal": int(tratamento.sinais_doenca_periodontal or 3),
        "alteracao_tecidos": int(tratamento.alteracao_tecidos or 3),
        "numero_guia": _clean_text(tratamento.numero_guia),
        "data_autorizacao": _clean_text(tratamento.data_autorizacao),
        "senha_autorizacao": _clean_text(tratamento.senha_autorizacao),
        "validade_senha": _clean_text(tratamento.validade_senha),
        "aprovado": bool(blob.get("aprovado", False)),
        "aprovado_em": _clean_text(blob.get("aprovado_em")),
        "criado_em": tratamento.criado_em.strftime("%d/%m/%Y %H:%M") if tratamento.criado_em else "",
        "atualizado_em": tratamento.atualizado_em.strftime("%d/%m/%Y %H:%M") if tratamento.atualizado_em else "",
    }


def _listar_intervencoes(
    db: Session,
    clinica_id: int,
    tratamento_id: int,
) -> list[OdontogramaIntervencao]:
    return (
        db.query(OdontogramaIntervencao)
        .options(
            selectinload(OdontogramaIntervencao.status),
            selectinload(OdontogramaIntervencao.prestador),
            selectinload(OdontogramaIntervencao.procedimento),
            selectinload(OdontogramaIntervencao.dentes),
            selectinload(OdontogramaIntervencao.faces),
        )
        .filter(
            OdontogramaIntervencao.clinica_id == int(clinica_id),
            OdontogramaIntervencao.tratamento_id == int(tratamento_id),
        )
        .order_by(OdontogramaIntervencao.id.asc())
        .all()
    )


def listar_tratamentos_orcamento(
    db: Session,
    current_user: Usuario,
    paciente_id: int,
) -> list[dict[str, Any]]:
    _paciente_or_404(db, int(current_user.clinica_id), int(paciente_id))
    tratamentos = (
        db.query(Tratamento)
        .options(
            selectinload(Tratamento.paciente),
            selectinload(Tratamento.cirurgiao_responsavel),
        )
        .filter(
            Tratamento.clinica_id == int(current_user.clinica_id),
            Tratamento.paciente_id == int(paciente_id),
        )
        .order_by(Tratamento.criado_em.desc(), Tratamento.id.desc())
        .all()
    )
    lista: list[dict[str, Any]] = []
    for tratamento in tratamentos:
        blob = _orcamento_blob(tratamento)
        intervencoes_model = _listar_intervencoes(db, int(current_user.clinica_id), int(tratamento.id))
        intervencoes = [_intervencao_view(db, tratamento, item, blob) for item in intervencoes_model]
        financeiro = calcular_financeiro_orcamento(db, int(current_user.clinica_id), tratamento, intervencoes, blob)
        paciente = tratamento.paciente
        lista.append(
            {
                "id": int(tratamento.id),
                "nrotra": int(tratamento.nrotra or 0),
                "data_inicio": _clean_text(tratamento.data_inicio),
                "data_finalizacao": _clean_text(tratamento.data_finalizacao),
                "situacao": _clean_text(tratamento.situacao),
                "tabela_codigo": int(tratamento.tabela_codigo or 1),
                "cirurgiao_responsavel_nome": _clean_text(tratamento.cirurgiao_responsavel_nome),
                "valor_total": financeiro["valor_total"],
                "valor_corrigido": financeiro["valor_corrigido"],
                "total_ja_pago": financeiro["total_ja_pago"],
                "total_a_pagar": financeiro["total_a_pagar"],
                "aprovado": bool(blob.get("aprovado", False)),
                "paciente_id": int(getattr(paciente, "id", paciente_id) or paciente_id),
                "paciente_nome": _clean_text(getattr(paciente, "nome_completo", None) or getattr(paciente, "nome", None)),
            }
        )
    return lista


def carregar_orcamento(
    db: Session,
    current_user: Usuario,
    tratamento_id: int,
) -> dict[str, Any]:
    tratamento = _tratamento_or_404(db, int(current_user.clinica_id), int(tratamento_id))
    blob = _orcamento_blob(tratamento)
    intervencoes_model = _listar_intervencoes(db, int(current_user.clinica_id), int(tratamento.id))
    intervencoes = [_intervencao_view(db, tratamento, item, blob) for item in intervencoes_model]
    financeiro = calcular_financeiro_orcamento(db, int(current_user.clinica_id), tratamento, intervencoes, blob)
    parcelas = financeiro["parcelas_planejadas"]
    tratamento_view = _tratamento_view(db, tratamento, financeiro["orcamento_blob"], financeiro)
    return {
        "tratamento": tratamento_view,
        "principal": {
            "valor_total": financeiro["valor_total"],
            "desconto_percentual": financeiro["desconto_percentual"],
            "valor_corrigido": financeiro["valor_corrigido"],
            "total_ja_pago": financeiro["total_ja_pago"],
            "total_a_pagar": financeiro["total_a_pagar"],
            "indice": financeiro["indice"],
            "parcelas": financeiro["parcelas"],
            "valor_diferenca": financeiro["valor_diferenca"],
        },
        "detalhes": _detalhes_view(tratamento, financeiro["orcamento_blob"]),
        "convenio": _convenio_view(tratamento, financeiro["orcamento_blob"], intervencoes),
        "ortodontia": _ortodontia_view(tratamento, financeiro["orcamento_blob"]),
        "intervencoes": intervencoes,
        "parcelas": parcelas,
        "comissoes": _comissoes_view(financeiro["orcamento_blob"]),
        "status_lookup": [
            {
                "id": int(item.id),
                "codigo": _clean_text(item.codigo),
                "descricao": _clean_text(item.descricao),
                "ordem": int(item.ordem or 0),
                "ativo": bool(item.ativo),
            }
            for item in listar_status(db)
        ],
    }


def atualizar_intervencao_orcamento(
    db: Session,
    current_user: Usuario,
    tratamento_id: int,
    intervencao_id: int,
    payload: OrcamentoIntervencaoUpdatePayload,
) -> dict[str, Any]:
    tratamento = _tratamento_or_404(db, int(current_user.clinica_id), int(tratamento_id))
    intervencao = _intervencao_or_404(db, int(current_user.clinica_id), int(tratamento_id), int(intervencao_id))
    blob = _orcamento_blob(tratamento)
    intervencoes = dict(blob.get("intervencoes") or {})
    override = dict(intervencoes.get(str(int(intervencao_id))) or {})

    if payload.tabela_codigo is not None:
        override["tabela_codigo"] = int(payload.tabela_codigo)
    if payload.cirurgiao_id is not None:
        override["cirurgiao_id"] = int(payload.cirurgiao_id)
        intervencao.prestador_id = int(payload.cirurgiao_id)
    if payload.situacao is not None:
        override["situacao"] = _clean_text(payload.situacao)
        intervencao.status_id = _resolver_status_id(db, payload.situacao, int(getattr(intervencao, "status_id", 0) or 0))
    if payload.marcacao is not None:
        override["marcacao"] = _clean_text(payload.marcacao)
        intervencao.data_planejada = _parse_date(payload.marcacao)
    if payload.finalizacao is not None:
        override["finalizacao"] = _clean_text(payload.finalizacao)
        intervencao.data_execucao = _parse_date(payload.finalizacao)
    if payload.observacoes is not None:
        override["observacoes"] = _clean_text(payload.observacoes)
        intervencao.observacao_resumida = _clean_text(payload.observacoes) or None
    if payload.receber_paciente is not None:
        override["receber_paciente"] = _clean_float(payload.receber_paciente)
    if payload.receber_convenio is not None:
        override["receber_convenio"] = _clean_float(payload.receber_convenio)
    if payload.nao_incluir_no_orcamento is not None:
        override["nao_incluir_no_orcamento"] = bool(payload.nao_incluir_no_orcamento)
    if payload.codigo_glosa is not None:
        override["codigo_glosa"] = _clean_text(payload.codigo_glosa)
    if payload.mensagem_autorizacao is not None:
        override["mensagem_autorizacao"] = _clean_text(payload.mensagem_autorizacao)

    intervencoes[str(int(intervencao_id))] = override
    blob["intervencoes"] = intervencoes
    _save_orcamento_blob(tratamento, blob)
    db.commit()
    db.refresh(intervencao)
    return carregar_orcamento(db, current_user, int(tratamento_id))


def atualizar_parcela_orcamento_service(
    db: Session,
    current_user: Usuario,
    tratamento_id: int,
    numero_parcela: int,
    payload: OrcamentoParcelaUpdatePayload,
) -> dict[str, Any]:
    tratamento = _tratamento_or_404(db, int(current_user.clinica_id), int(tratamento_id))
    blob = atualizar_parcela_orcamento(
        tratamento,
        int(numero_parcela),
        {
            "data": payload.data,
            "valor_parcela": payload.valor_parcela,
            "valor_ja_pago": payload.valor_ja_pago,
        },
    )
    db.commit()
    return carregar_orcamento(db, current_user, int(tratamento_id))


def aprovar_orcamento_service(
    db: Session,
    current_user: Usuario,
    tratamento_id: int,
    payload: OrcamentoAprovacaoPayload,
) -> dict[str, Any]:
    tratamento = _tratamento_or_404(db, int(current_user.clinica_id), int(tratamento_id))
    orcamento = carregar_orcamento(db, current_user, int(tratamento_id))
    aprovacao = registrar_aprovacao_orcamento(
        db,
        current_user,
        tratamento,
        list(orcamento.get("parcelas") or []),
        gerar_conta_corrente=bool(payload.gerar_conta_corrente),
    )
    orcamento_atualizado = carregar_orcamento(db, current_user, int(tratamento_id))
    return {
        "detail": aprovacao["detail"],
        "conta_corrente_aberta": bool(aprovacao["conta_corrente_aberta"]),
        "lancamentos_ids": list(aprovacao["lancamentos_ids"]),
        "orcamento": orcamento_atualizado,
    }


def preparar_impressao_orcamento_service(
    db: Session,
    current_user: Usuario,
    tratamento_id: int,
    payload: OrcamentoImpressaoPayload,
) -> dict[str, Any]:
    tratamento = _tratamento_or_404(db, int(current_user.clinica_id), int(tratamento_id))
    orcamento = carregar_orcamento(db, current_user, int(tratamento_id))
    blob = _orcamento_blob(tratamento)
    return {
        "detail": "Impressao preparada.",
        "orcamento": orcamento,
        "impressao": preparar_impressao_orcamento(
            tratamento,
            blob,
            {
                "modelo_orcamento": payload.modelo_orcamento,
                "saida": payload.saida,
                "endereco": payload.endereco,
                "imprimir_odontograma": payload.imprimir_odontograma,
                "imprimir_valores_intervencoes": payload.imprimir_valores_intervencoes,
                "titulo_relatorio": payload.titulo_relatorio,
                "mensagem_para_impressao": payload.mensagem_para_impressao,
                "imprimir_observacoes_do_tratamento": payload.imprimir_observacoes_do_tratamento,
            },
        )["impressao"],
    }
