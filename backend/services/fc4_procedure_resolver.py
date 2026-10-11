"""FC4 read boundary over the official Procedures/symbol catalogs; no catalog writes."""
from sqlalchemy import text

TARGETS = {1: "FACE", 2: "DENTE", 3: "GRUPO", 4: "ARCADA", 5: "GERAL", 6: "SEGMENTO"}


def resolve_procedure_target(conn, clinic, procedure_id):
    procedure = conn.execute(text("""
        SELECT * FROM procedimento WHERE id=:p AND clinica_id=:c FOR SHARE
    """), {"p": procedure_id, "c": clinic}).mappings().first()
    # R1 creation contract: inactive cannot create; receipt replay precedes this read.
    if not procedure or procedure["inativo"]:
        raise ValueError("Invalid scoped procedure")
    symbols = conn.execute(text("""
        SELECT tipo_marca FROM simbolo_grafico_catalogo
        WHERE clinica_id=:c AND ativo
          AND (:code IS NOT NULL OR :legacy IS NOT NULL)
          AND (:code IS NULL OR codigo=:code)
          AND (:legacy IS NULL OR legacy_id=:legacy) FOR SHARE
    """), {"c": clinic, "code": procedure["simbolo_grafico"],
           "legacy": procedure["simbolo_grafico_legacy_id"]}).scalars().all()
    if len(symbols) != 1 or symbols[0] not in TARGETS:
        raise ValueError("Unknown/ambiguous symbol target metadata")
    return procedure, TARGETS[symbols[0]]
