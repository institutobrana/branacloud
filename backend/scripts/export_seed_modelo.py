"""
Exporta seeds estaticos a partir de uma conta modelo.

Uso:
    python saas/backend/scripts/export_seed_modelo.py --email gleissontel@gmail.com
"""

from __future__ import annotations

import argparse
import importlib
import json
import pprint
from pathlib import Path
from typing import Any


BACKEND_DIR = Path(__file__).resolve().parents[1]
PROJECT_ROOT = BACKEND_DIR.parents[1]
SEEDS_DIR = BACKEND_DIR / "seeds"
MODELS_DIR = BACKEND_DIR / "models"


def _bootstrap_models() -> None:
    for file in MODELS_DIR.glob("*.py"):
        if file.name.startswith("_"):
            continue
        importlib.import_module(f"models.{file.stem}")


def _norm_value(value: Any) -> Any:
    if value is None:
        return None
    if isinstance(value, bool):
        return value
    if isinstance(value, (int, float)):
        return value
    return str(value)


def _py_dump(data: Any) -> str:
    return pprint.pformat(data, width=120, sort_dicts=False)


def _write_seed_file(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def _extract_model_data(email: str) -> dict[str, Any]:
    from database import SessionLocal
    from models.clinica import Clinica
    from models.procedimento import Procedimento
    from models.procedimento_generico import ProcedimentoGenerico
    from models.procedimento_tabela import ProcedimentoTabela
    from models.simbolo_grafico import SimboloGrafico

    db = SessionLocal()
    try:
        clinica = db.query(Clinica).filter(Clinica.email == email).first()
        if not clinica:
            raise RuntimeError(f"Clinica nao encontrada para o email: {email}")

        tabela_exemplo = (
            db.query(ProcedimentoTabela)
            .filter(
                ProcedimentoTabela.clinica_id == int(clinica.id),
                ProcedimentoTabela.nome.ilike("Tabela exemplo"),
            )
            .first()
        )
        if not tabela_exemplo:
            raise RuntimeError("Tabela 'Tabela exemplo' nao encontrada na clinica modelo.")

        procedimentos = (
            db.query(Procedimento)
            .filter(
                Procedimento.clinica_id == int(clinica.id),
                Procedimento.tabela_id == int(tabela_exemplo.id),
            )
            .order_by(Procedimento.codigo.asc(), Procedimento.id.asc())
            .all()
        )
        procedimentos_rows: list[dict[str, Any]] = []
        for item in procedimentos:
            procedimentos_rows.append(
                {
                    "codigo": int(item.codigo or 0),
                    "nome": _norm_value(item.nome),
                    "tempo": int(item.tempo or 0),
                    "preco": float(item.preco or 0),
                    "custo": float(item.custo or 0),
                    "custo_lab": float(item.custo_lab or 0),
                    "lucro_hora": float(item.lucro_hora or 0),
                    "especialidade": _norm_value(item.especialidade),
                    "procedimento_generico_codigo": (
                        _norm_value(item.procedimento_generico.codigo)
                        if getattr(item, "procedimento_generico", None) is not None
                        else None
                    ),
                    "simbolo_grafico": _norm_value(item.simbolo_grafico),
                    "simbolo_grafico_legacy_id": (
                        int(item.simbolo_grafico_legacy_id)
                        if item.simbolo_grafico_legacy_id is not None
                        else None
                    ),
                    "mostrar_simbolo": bool(item.mostrar_simbolo or False),
                    "garantia_meses": int(item.garantia_meses or 0),
                    "forma_cobranca": _norm_value(item.forma_cobranca),
                    "valor_repasse": float(item.valor_repasse or 0),
                    "preferido": bool(item.preferido or False),
                    "inativo": bool(item.inativo or False),
                    "observacoes": _norm_value(item.observacoes),
                    "data_inclusao": _norm_value(item.data_inclusao),
                    "data_alteracao": _norm_value(item.data_alteracao),
                }
            )

        genericos = (
            db.query(ProcedimentoGenerico)
            .filter(ProcedimentoGenerico.clinica_id == int(clinica.id))
            .order_by(ProcedimentoGenerico.codigo.asc(), ProcedimentoGenerico.id.asc())
            .all()
        )
        genericos_rows: list[dict[str, Any]] = []
        for item in genericos:
            genericos_rows.append(
                {
                    "codigo": _norm_value(item.codigo),
                    "descricao": _norm_value(item.descricao),
                    "especialidade": _norm_value(item.especialidade),
                    "tempo": int(item.tempo or 0),
                    "custo_lab": float(item.custo_lab or 0),
                    "peso": float(item.peso or 0),
                    "simbolo_grafico": _norm_value(item.simbolo_grafico),
                    "mostrar_simbolo": bool(item.mostrar_simbolo or False),
                    "inativo": bool(item.inativo or False),
                    "observacoes": _norm_value(item.observacoes),
                    "data_inclusao": _norm_value(item.data_inclusao),
                    "data_alteracao": _norm_value(item.data_alteracao),
                }
            )

        simbolos = db.query(SimboloGrafico).order_by(SimboloGrafico.legacy_id.asc().nullslast(), SimboloGrafico.id.asc()).all()
        simbolos_rows: list[dict[str, Any]] = []
        for item in simbolos:
            simbolos_rows.append(
                {
                    "legacy_id": int(item.legacy_id) if item.legacy_id is not None else None,
                    "codigo": _norm_value(item.codigo),
                    "descricao": _norm_value(item.descricao),
                    "especialidade": int(item.especialidade) if item.especialidade is not None else None,
                    "tipo_marca": int(item.tipo_marca) if item.tipo_marca is not None else None,
                    "tipo_simbolo": int(item.tipo_simbolo) if item.tipo_simbolo is not None else None,
                    "bitmap1": _norm_value(item.bitmap1),
                    "bitmap2": _norm_value(item.bitmap2),
                    "bitmap3": _norm_value(item.bitmap3),
                    "icone": _norm_value(item.icone),
                    "imagem_custom": _norm_value(item.imagem_custom),
                    "sobreposicao": int(item.sobreposicao) if item.sobreposicao is not None else None,
                    "ativo": bool(item.ativo if item.ativo is not None else True),
                }
            )

        return {
            "clinica_id": int(clinica.id),
            "clinica_nome": str(clinica.nome or ""),
            "procedimentos": procedimentos_rows,
            "procedimentos_genericos": genericos_rows,
            "simbolos": simbolos_rows,
        }
    finally:
        db.close()


def _build_procedimentos_seed(rows: list[dict[str, Any]]) -> str:
    return f"""from __future__ import annotations

from sqlalchemy.orm import Session

from models.procedimento import Procedimento
from models.procedimento_tabela import ProcedimentoTabela
from models.procedimento_generico import ProcedimentoGenerico


PROCEDIMENTOS_PADRAO = {_py_dump(rows)}


def _garantir_tabela_exemplo(db: Session, clinica_id: int) -> int:
    tabela = (
        db.query(ProcedimentoTabela)
        .filter(
            ProcedimentoTabela.clinica_id == int(clinica_id),
            ProcedimentoTabela.codigo == 1,
        )
        .first()
    )
    if tabela is None:
        tabela = ProcedimentoTabela(
            clinica_id=int(clinica_id),
            codigo=1,
            nome="Tabela Exemplo",
            nro_indice=255,
            fonte_pagadora="particular",
            inativo=False,
            tipo_tiss_id=1,
        )
        db.add(tabela)
        db.flush()
    return int(tabela.id)


def seed_procedimentos(db: Session, clinica_id: int) -> int:
    tabela_id = _garantir_tabela_exemplo(db, int(clinica_id))

    genericos = {{
        str(item.codigo or "").strip(): int(item.id)
        for item in db.query(ProcedimentoGenerico)
        .filter(ProcedimentoGenerico.clinica_id == int(clinica_id))
        .all()
        if str(item.codigo or "").strip()
    }}
    existentes = {{
        int(item.codigo): item
        for item in db.query(Procedimento)
        .filter(
            Procedimento.clinica_id == int(clinica_id),
            Procedimento.tabela_id == int(tabela_id),
        )
        .all()
    }}

    total = 0
    for row in PROCEDIMENTOS_PADRAO:
        codigo = int(row.get("codigo") or 0)
        if codigo <= 0:
            continue
        generico_codigo = str(row.get("procedimento_generico_codigo") or "").strip()
        generico_id = genericos.get(generico_codigo) if generico_codigo else None

        item = existentes.get(codigo)
        payload = {{
            "nome": row.get("nome") or "",
            "tempo": int(row.get("tempo") or 0),
            "preco": float(row.get("preco") or 0),
            "custo": float(row.get("custo") or 0),
            "custo_lab": float(row.get("custo_lab") or 0),
            "lucro_hora": float(row.get("lucro_hora") or 0),
            "especialidade": row.get("especialidade"),
            "procedimento_generico_id": int(generico_id) if generico_id else None,
            "simbolo_grafico": row.get("simbolo_grafico"),
            "simbolo_grafico_legacy_id": row.get("simbolo_grafico_legacy_id"),
            "mostrar_simbolo": bool(row.get("mostrar_simbolo") or False),
            "garantia_meses": int(row.get("garantia_meses") or 0),
            "forma_cobranca": row.get("forma_cobranca"),
            "valor_repasse": float(row.get("valor_repasse") or 0),
            "preferido": bool(row.get("preferido") or False),
            "inativo": bool(row.get("inativo") or False),
            "observacoes": row.get("observacoes"),
            "data_inclusao": row.get("data_inclusao"),
            "data_alteracao": row.get("data_alteracao"),
        }}
        if item is None:
            item = Procedimento(
                clinica_id=int(clinica_id),
                tabela_id=int(tabela_id),
                codigo=int(codigo),
                **payload,
            )
            db.add(item)
        else:
            for key, value in payload.items():
                setattr(item, key, value)
        total += 1

    db.flush()
    return total
"""


def _build_genericos_seed(rows: list[dict[str, Any]]) -> str:
    return f"""from __future__ import annotations

from sqlalchemy.orm import Session

from models.procedimento_generico import ProcedimentoGenerico


PROCEDIMENTOS_GENERICOS_PADRAO = {_py_dump(rows)}


def seed_procedimentos_genericos(db: Session, clinica_id: int) -> int:
    existentes = {{
        str(item.codigo or "").strip(): item
        for item in db.query(ProcedimentoGenerico)
        .filter(ProcedimentoGenerico.clinica_id == int(clinica_id))
        .all()
        if str(item.codigo or "").strip()
    }}
    total = 0
    for row in PROCEDIMENTOS_GENERICOS_PADRAO:
        codigo = str(row.get("codigo") or "").strip()
        if not codigo:
            continue
        payload = {{
            "descricao": row.get("descricao") or "",
            "especialidade": row.get("especialidade"),
            "tempo": int(row.get("tempo") or 0),
            "custo_lab": float(row.get("custo_lab") or 0),
            "peso": float(row.get("peso") or 0),
            "simbolo_grafico": row.get("simbolo_grafico"),
            "mostrar_simbolo": bool(row.get("mostrar_simbolo") or False),
            "inativo": bool(row.get("inativo") or False),
            "observacoes": row.get("observacoes"),
            "data_inclusao": row.get("data_inclusao"),
            "data_alteracao": row.get("data_alteracao"),
        }}
        item = existentes.get(codigo)
        if item is None:
            item = ProcedimentoGenerico(
                clinica_id=int(clinica_id),
                codigo=codigo,
                **payload,
            )
            db.add(item)
            existentes[codigo] = item
        else:
            for key, value in payload.items():
                setattr(item, key, value)
        total += 1
    db.flush()
    return total
"""


def _build_simbolos_seed(rows: list[dict[str, Any]]) -> str:
    return f"""from __future__ import annotations

from sqlalchemy.orm import Session

from models.simbolo_grafico import SimboloGrafico


SIMBOLOS_GRAFICOS_PADRAO = {_py_dump(rows)}


def seed_simbolos_graficos(db: Session) -> int:
    por_legacy = {{
        int(item.legacy_id): item
        for item in db.query(SimboloGrafico).all()
        if item.legacy_id is not None
    }}
    por_codigo = {{
        str(item.codigo or "").strip().lower(): item
        for item in db.query(SimboloGrafico).all()
        if str(item.codigo or "").strip()
    }}
    total = 0
    for row in SIMBOLOS_GRAFICOS_PADRAO:
        legacy_id = row.get("legacy_id")
        codigo_key = str(row.get("codigo") or "").strip().lower()
        item = None
        if legacy_id is not None:
            item = por_legacy.get(int(legacy_id))
        if item is None and codigo_key:
            item = por_codigo.get(codigo_key)

        payload = {{
            "legacy_id": legacy_id,
            "codigo": row.get("codigo") or "",
            "descricao": row.get("descricao") or "",
            "especialidade": row.get("especialidade"),
            "tipo_marca": row.get("tipo_marca"),
            "tipo_simbolo": row.get("tipo_simbolo"),
            "bitmap1": row.get("bitmap1"),
            "bitmap2": row.get("bitmap2"),
            "bitmap3": row.get("bitmap3"),
            "icone": row.get("icone"),
            "imagem_custom": row.get("imagem_custom"),
            "sobreposicao": row.get("sobreposicao"),
            "ativo": bool(row.get("ativo") if row.get("ativo") is not None else True),
        }}
        if item is None:
            item = SimboloGrafico(**payload)
            db.add(item)
            if legacy_id is not None:
                por_legacy[int(legacy_id)] = item
            if codigo_key:
                por_codigo[codigo_key] = item
        else:
            for key, value in payload.items():
                setattr(item, key, value)
        total += 1
    db.flush()
    return total
"""


def main() -> None:
    parser = argparse.ArgumentParser(description="Exporta seed estatico da conta modelo.")
    parser.add_argument("--email", required=True, help="Email da clinica modelo")
    args = parser.parse_args()

    _bootstrap_models()
    data = _extract_model_data(args.email.strip().lower())

    procedimentos_path = SEEDS_DIR / "procedimentos_padrao.py"
    genericos_path = SEEDS_DIR / "procedimentos_genericos.py"
    simbolos_path = SEEDS_DIR / "simbolos_graficos.py"

    _write_seed_file(procedimentos_path, _build_procedimentos_seed(data["procedimentos"]))
    _write_seed_file(genericos_path, _build_genericos_seed(data["procedimentos_genericos"]))
    _write_seed_file(simbolos_path, _build_simbolos_seed(data["simbolos"]))
    _write_seed_file(
        SEEDS_DIR / "__init__.py",
        "# Seeds estaticos do tenant modelo (gerados automaticamente).\n",
    )

    print("Seeds gerados com sucesso:")
    print(f"- {procedimentos_path}")
    print(f"- {genericos_path}")
    print(f"- {simbolos_path}")
    print(f"Contagens: procedimentos={len(data['procedimentos'])}, genericos={len(data['procedimentos_genericos'])}, simbolos={len(data['simbolos'])}")
    print(f"Clinica modelo: id={data['clinica_id']} nome={data['clinica_nome']}")


if __name__ == "__main__":
    main()
