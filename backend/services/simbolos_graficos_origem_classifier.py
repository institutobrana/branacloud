from __future__ import annotations

from dataclasses import dataclass, asdict
from typing import Iterable


ORIGEM_CATALOGO_OFICIAL = "catalogo_oficial"
ORIGEM_SEED_INTERNO = "seed_interno"
ORIGEM_FIXTURE_TESTE = "fixture_teste"
ORIGEM_ASSET_AUXILIAR = "asset_auxiliar"
ORIGEM_INDEFINIDO = "indefinido"

CONFIANCA_ALTA = "alta"
CONFIANCA_BAIXA = "baixa"
CONFIANCA_NENHUMA = "nenhuma"


@dataclass(frozen=True)
class ClassificacaoOrigensResultado:
    simbolo_id: int | None
    codigo: str | None
    categoria_proposta: str
    confianca: str
    regras: tuple[str, ...]
    evidencias: tuple[str, ...]
    conflito: bool = False
    observacao: str | None = None

    def to_dict(self) -> dict[str, object]:
        payload = asdict(self)
        payload["regras"] = list(self.regras)
        payload["evidencias"] = list(self.evidencias)
        return payload


def _normalizar_texto(valor: object | None) -> str:
    return str(valor or "").strip()


def _valor_alias(row: dict[str, object], *nomes: str) -> object | None:
    for nome in nomes:
        if nome in row and row.get(nome) is not None:
            return row.get(nome)
    return None


def _coletar_codigos(rows: Iterable[dict[str, object]]) -> tuple[set[str], set[int]]:
    codigos: set[str] = set()
    legacy_ids: set[int] = set()
    for row in rows:
        codigo = _normalizar_texto(row.get("codigo"))
        if codigo:
            codigos.add(codigo)
        legacy_id = row.get("legacy_id")
        if legacy_id is None:
            legacy_id = row.get("nrosim")
        if legacy_id is not None:
            try:
                legacy_ids.add(int(legacy_id))
            except (TypeError, ValueError):
                continue
    return codigos, legacy_ids


def _assinatura_normalizada(row: dict[str, object]) -> tuple[object, ...]:
    legacy = row.get("legacy_id")
    if legacy is None:
        legacy = row.get("nrosim")
    return (
        _normalizar_texto(row.get("codigo")).lower(),
        _normalizar_texto(row.get("descricao")).lower(),
        _valor_alias(row, "especialidade", "especial"),
        _valor_alias(row, "tipo_marca", "tipmarca"),
        _valor_alias(row, "tipo_simbolo", "tiposim"),
        _normalizar_texto(_valor_alias(row, "bitmap1")).lower(),
        _normalizar_texto(_valor_alias(row, "bitmap2")).lower(),
        _normalizar_texto(_valor_alias(row, "bitmap3")).lower(),
        _normalizar_texto(_valor_alias(row, "icone")).lower(),
        _valor_alias(row, "sobreposicao", "sobrepos"),
        bool(row.get("ativo")) if row.get("ativo") is not None else None,
    )


def classificar_simbolo_grafico_dry_run(
    row: dict[str, object],
    *,
    assinaturas_catalogo_oficial: dict[str, set[tuple[object, ...]]],
    assinaturas_seed_interno: dict[str, set[tuple[object, ...]]],
) -> ClassificacaoOrigensResultado:
    simbolo_id = row.get("id")
    try:
        simbolo_id = int(simbolo_id) if simbolo_id is not None else None
    except (TypeError, ValueError):
        simbolo_id = None

    codigo = _normalizar_texto(row.get("codigo")) or None
    legacy_id_raw = row.get("legacy_id")
    try:
        legacy_id = int(legacy_id_raw) if legacy_id_raw is not None else None
    except (TypeError, ValueError):
        legacy_id = None

    matches: list[tuple[str, str, str]] = []
    assinatura = _assinatura_normalizada(row)

    codigo_key = _normalizar_texto(row.get("codigo")).lower()
    assinaturas_catalogo = assinaturas_catalogo_oficial.get(codigo_key, set())
    assinaturas_seed = assinaturas_seed_interno.get(codigo_key, set())

    descricao = _normalizar_texto(row.get("descricao")).lower()
    if codigo_key == "sim_simb1.bmp" and descricao.startswith("teste simbolo react"):
        return ClassificacaoOrigensResultado(
            simbolo_id=simbolo_id,
            codigo=codigo,
            categoria_proposta=ORIGEM_FIXTURE_TESTE,
            confianca=CONFIANCA_ALTA,
            regras=("R003",),
            evidencias=(f"descricao={descricao}",),
            conflito=False,
            observacao=None,
        )

    if codigo_key == "sim_30.bmp" and str(row.get("imagem_custom") or "").strip():
        return ClassificacaoOrigensResultado(
            simbolo_id=simbolo_id,
            codigo=codigo,
            categoria_proposta=ORIGEM_ASSET_AUXILIAR,
            confianca=CONFIANCA_ALTA,
            regras=("R004",),
            evidencias=("imagem_custom_presente",),
            conflito=False,
            observacao=None,
        )

    if assinatura in assinaturas_catalogo:
        matches.append((ORIGEM_CATALOGO_OFICIAL, "R001", f"codigo={codigo}"))

    if assinatura in assinaturas_seed:
        matches.append((ORIGEM_SEED_INTERNO, "R002", f"codigo={codigo}"))

    categorias = {categoria for categoria, _, _ in matches}
    regras = tuple(regra for _, regra, _ in matches)
    evidencias = tuple(evidencia for _, _, evidencia in matches)

    if len(categorias) > 1:
        return ClassificacaoOrigensResultado(
            simbolo_id=simbolo_id,
            codigo=codigo,
            categoria_proposta=ORIGEM_INDEFINIDO,
            confianca=CONFIANCA_NENHUMA,
            regras=regras,
            evidencias=evidencias,
            conflito=True,
            observacao="Mais de uma origem forte matchou o mesmo codigo; manter indefinido no dry-run.",
        )

    if matches:
        categoria, _, _ = matches[0]
        return ClassificacaoOrigensResultado(
            simbolo_id=simbolo_id,
            codigo=codigo,
            categoria_proposta=categoria,
            confianca=CONFIANCA_ALTA,
            regras=regras,
            evidencias=evidencias,
            conflito=False,
            observacao=None,
        )

    observacao = "Sem evidencia forte suficiente para classificar sem risco."
    return ClassificacaoOrigensResultado(
        simbolo_id=simbolo_id,
        codigo=codigo,
        categoria_proposta=ORIGEM_INDEFINIDO,
        confianca=CONFIANCA_NENHUMA,
        regras=(),
        evidencias=(),
        conflito=False,
        observacao=observacao,
    )


def preparar_conjuntos_classificacao(
    snapshot_rows: Iterable[dict[str, object]],
    seed_rows: Iterable[dict[str, object]],
) -> tuple[set[str], set[int], set[str]]:
    snapshot_rows = list(snapshot_rows)
    seed_rows = list(seed_rows)
    codigos_catalogo_oficial, legacy_ids_catalogo_oficial = _coletar_codigos(snapshot_rows)
    codigos_seed_interno = {
        _normalizar_texto(row.get("codigo"))
        for row in seed_rows
        if row.get("legacy_id") is None and _normalizar_texto(row.get("codigo"))
    }
    codigos_seed_interno.discard("")
    return codigos_catalogo_oficial, legacy_ids_catalogo_oficial, codigos_seed_interno


def construir_assinaturas_referencia(
    snapshot_rows: Iterable[dict[str, object]],
    seed_rows: Iterable[dict[str, object]],
) -> tuple[dict[str, set[tuple[object, ...]]], dict[str, set[tuple[object, ...]]]]:
    snapshot_rows = list(snapshot_rows)
    seed_rows = list(seed_rows)
    catalogo: dict[str, set[tuple[object, ...]]] = {}
    for row in snapshot_rows:
        codigo = _normalizar_texto(row.get("codigo")).lower()
        if not codigo:
            continue
        catalogo.setdefault(codigo, set()).add(_assinatura_normalizada(row))
    seed: dict[str, set[tuple[object, ...]]] = {}
    for row in seed_rows:
        if row.get("legacy_id") is not None:
            continue
        codigo = _normalizar_texto(row.get("codigo")).lower()
        if not codigo:
            continue
        seed.setdefault(codigo, set()).add(_assinatura_normalizada(row))
    return catalogo, seed
