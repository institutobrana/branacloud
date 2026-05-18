from __future__ import annotations

from typing import Any

from sqlalchemy.orm import Session

from models.material import Material
from models.procedimento import Procedimento, ProcedimentoMaterial
from models.procedimento_generico import ProcedimentoGenericoMaterial

ORIGEM_PROPRIO = "proprio"
ORIGEM_HERDADO = "herdado"


def normalizar_material_vinculado(item: dict[str, Any], origem: str) -> dict[str, Any]:
    payload = dict(item or {})
    origem_norm = ORIGEM_HERDADO if str(origem or "").strip().lower() == ORIGEM_HERDADO else ORIGEM_PROPRIO
    payload["origem"] = origem_norm
    payload["herdado"] = origem_norm == ORIGEM_HERDADO
    return payload


def marcar_material_proprio(item: dict[str, Any]) -> dict[str, Any]:
    return normalizar_material_vinculado(item, ORIGEM_PROPRIO)


def marcar_material_herdado(item: dict[str, Any]) -> dict[str, Any]:
    return normalizar_material_vinculado(item, ORIGEM_HERDADO)


def _montar_item_vinculado(vinculo: Any, material: Any, origem: str) -> dict[str, Any]:
    quantidade = float(getattr(vinculo, "quantidade", 0) or 0)
    custo_und = float(getattr(material, "custo", 0) or 0)
    custo_total = custo_und * quantidade
    return normalizar_material_vinculado(
        {
            "vinculo_id": int(getattr(vinculo, "id", 0) or 0),
            "material_id": int(getattr(material, "id", 0) or 0),
            "codigo": str(getattr(material, "codigo", "") or "").strip(),
            "nome": str(getattr(material, "nome", "") or "").strip(),
            "relacao": float(getattr(material, "relacao", 0) or 0),
            "preco": float(getattr(material, "preco", 0) or 0),
            "custo_und": custo_und,
            "quantidade": quantidade,
            "custo_total": float(custo_total or 0),
        },
        origem,
    )


def deduplicar_materiais_por_material_id(itens: list[dict[str, Any]] | None) -> list[dict[str, Any]]:
    prioridade = {ORIGEM_PROPRIO: 2, ORIGEM_HERDADO: 1}
    vistos: dict[int, dict[str, Any]] = {}
    ordem: list[int] = []

    for item in itens or []:
        material_id = int((item or {}).get("material_id") or 0)
        if material_id <= 0:
            continue
        atual = vistos.get(material_id)
        if atual is None:
            vistos[material_id] = item
            ordem.append(material_id)
            continue
        origem_nova = str((item or {}).get("origem") or "").strip().lower()
        origem_atual = str((atual or {}).get("origem") or "").strip().lower()
        if prioridade.get(origem_nova, 0) > prioridade.get(origem_atual, 0):
            vistos[material_id] = item

    return [vistos[mid] for mid in ordem]


def _resumo_materiais(itens: list[dict[str, Any]]) -> dict[str, Any]:
    total_custo_und = 0.0
    total_custo = 0.0
    for item in itens:
        total_custo_und += float(item.get("custo_und") or 0)
        total_custo += float(item.get("custo_total") or 0)
    return {
        "itens": itens,
        "total_materiais": len(itens),
        "total_custo_und": total_custo_und,
        "total_custo": total_custo,
    }


def listar_materiais_proprios_procedimento(db: Session, procedimento_id: int) -> dict[str, Any]:
    rows = (
        db.query(ProcedimentoMaterial, Material)
        .join(Material, Material.id == ProcedimentoMaterial.material_id)
        .filter(ProcedimentoMaterial.procedimento_id == int(procedimento_id))
        .order_by(ProcedimentoMaterial.id.asc())
        .all()
    )

    itens = [
        _montar_item_vinculado(vinc, material, ORIGEM_PROPRIO)
        for vinc, material in rows
        if material is not None
    ]
    return _resumo_materiais(deduplicar_materiais_por_material_id(itens))


def listar_materiais_herdados_generico(
    db: Session,
    clinica_id: int,
    procedimento_generico_id: int,
) -> dict[str, Any]:
    if int(procedimento_generico_id or 0) <= 0:
        return _resumo_materiais([])

    rows = (
        db.query(ProcedimentoGenericoMaterial, Material)
        .join(Material, Material.id == ProcedimentoGenericoMaterial.material_id)
        .filter(
            ProcedimentoGenericoMaterial.procedimento_generico_id == int(procedimento_generico_id),
            ProcedimentoGenericoMaterial.clinica_id == int(clinica_id),
            Material.lista.has(clinica_id=int(clinica_id)),
        )
        .order_by(ProcedimentoGenericoMaterial.id.asc())
        .all()
    )

    itens = [
        _montar_item_vinculado(vinc, material, ORIGEM_HERDADO)
        for vinc, material in rows
        if material is not None
    ]
    return _resumo_materiais(deduplicar_materiais_por_material_id(itens))


def compor_materiais_vinculados_procedimento(db: Session, proc: Procedimento) -> dict[str, Any]:
    itens_proprios = listar_materiais_proprios_procedimento(db, int(proc.id))
    itens_herdados = listar_materiais_herdados_generico(
        db,
        int(proc.clinica_id or 0),
        int(proc.procedimento_generico_id or 0),
    )
    itens_compostos = deduplicar_materiais_por_material_id(
        list(itens_proprios.get("itens") or []) + list(itens_herdados.get("itens") or [])
    )
    return _resumo_materiais(itens_compostos)


__all__ = [
    "ORIGEM_HERDADO",
    "ORIGEM_PROPRIO",
    "compor_materiais_vinculados_procedimento",
    "deduplicar_materiais_por_material_id",
    "listar_materiais_herdados_generico",
    "listar_materiais_proprios_procedimento",
    "marcar_material_herdado",
    "marcar_material_proprio",
    "normalizar_material_vinculado",
]
