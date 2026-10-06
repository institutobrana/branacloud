"""Preserve omitted procedure symbols; resolve explicit references locally.

No bootstrap, catalog creation, commits or mandatory-symbol validation here.
Catalog.id is a lookup identity, never the procedure's stored legacy_id.
"""
from fastapi import HTTPException

from models.simbolo_grafico import SimboloGrafico

SYMBOL_FIELDS = frozenset({"simbolo_grafico", "simbolo_grafico_legacy_id"})


def tem_referencia_simbolo(proc) -> bool:
    return bool(str(getattr(proc, "simbolo_grafico", None) or "").strip()
                or getattr(proc, "simbolo_grafico_legacy_id", None) is not None)


def resolver_referencia_simbolo(db, clinica_id, codigo=None, legacy_id=None):
    codigo = str(codigo or "").strip() or None
    legacy_id = int(legacy_id or 0) or None
    if legacy_id is not None and legacy_id < 0:
        raise HTTPException(status_code=400, detail="Referência de símbolo inválida.")
    if codigo is None and legacy_id is None:
        return None, None  # Still legal during regularization.
    query = db.query(SimboloGrafico).filter(
        SimboloGrafico.clinica_id == int(clinica_id), SimboloGrafico.ativo.is_(True),
    )
    if legacy_id is not None:
        query = query.filter(SimboloGrafico.legacy_id == legacy_id)
    if codigo is not None:
        query = query.filter(SimboloGrafico.codigo == codigo)
    candidatos = query.all()
    if len(candidatos) != 1:
        raise HTTPException(status_code=400, detail="Símbolo inválido ou ambíguo no catálogo desta clínica.")
    simbolo = candidatos[0]
    if int(simbolo.clinica_id or 0) != int(clinica_id) or not simbolo.ativo:
        raise HTTPException(status_code=400, detail="Símbolo inválido no catálogo desta clínica.")
    return simbolo.codigo, simbolo.legacy_id


def referencia_simbolo_payload(db, clinica_id, payload, atual=None):
    if atual is not None and int(atual.clinica_id) != int(clinica_id):
        raise HTTPException(status_code=400, detail="Procedimento de outra clínica.")
    explicit = campos_simbolo_explicitos(payload)
    current = (getattr(atual, "simbolo_grafico", None), getattr(atual, "simbolo_grafico_legacy_id", None))
    if not explicit:
        return current
    codigo = str(getattr(payload, "simbolo_grafico", None) or "").strip() or None
    legacy_id = int(getattr(payload, "simbolo_grafico_legacy_id", None) or 0) or None
    # An unchanged code from older clients must not erase a known legacy identity.
    # To clear, explicitly clear the code too; legacy-only NULL is not a full clear.
    if atual is not None and codigo is not None and "simbolo_grafico" in explicit and codigo == (str(current[0] or "").strip() or None):
        if legacy_id is None or legacy_id == current[1]:
            return current
    if "simbolo_grafico" not in explicit and legacy_id is None:
        if tem_referencia_simbolo(atual):
            raise HTTPException(status_code=400, detail="Informe a referência completa para limpar o símbolo.")
        return current
    if "simbolo_grafico" in explicit and codigo is None and legacy_id is not None:
        raise HTTPException(status_code=400, detail="Código e identidade do símbolo são incompatíveis.")
    return resolver_referencia_simbolo(db, clinica_id, codigo, legacy_id)


def campos_simbolo_explicitos(payload):
    fields = getattr(payload, "model_fields_set", None)
    if fields is None:
        fields = getattr(payload, "__fields_set__", set())
    return SYMBOL_FIELDS.intersection(fields)


def herdar_simbolo_se_vazio(db, clinica_id, proc, codigo=None, legacy_id=None) -> bool:
    """Never mix an existing half-pair with a different inherited identity."""
    if int(proc.clinica_id) != int(clinica_id) or tem_referencia_simbolo(proc):
        return False
    try:
        pair = resolver_referencia_simbolo(db, clinica_id, codigo, legacy_id)
    except HTTPException:
        return False  # No proven local identity: leave empty, never invent/substitute.
    if pair == (None, None):
        return False
    proc.simbolo_grafico, proc.simbolo_grafico_legacy_id = pair
    return True
