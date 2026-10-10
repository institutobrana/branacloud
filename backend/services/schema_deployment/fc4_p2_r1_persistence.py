"""Explicit FC4 P2.R1 additive deployment; never imported by application startup.

Caller owns the transaction and deployment authorization. No engine/env loading.
Rollback refuses any new clinical/receipt data rather than silently losing it.
JSON slots are stable ArcadaSlot PKs, validated with scoped SQL references;
five semantic bits: M=1, D=2, central=4 (I/O), V=8, interna=16 (P/L).
"""
from sqlalchemy import inspect, text
from services.schema_deployment.versioning import ensure_version_table

VERSION = "fc4_p2_r1_persistence_20261010"
COLUMNS = {
    "alvo_tipo": "VARCHAR(16)", "alvo_slots": "JSONB", "faces_mask": "SMALLINT",
    "contexto": "TEXT", "forma_cobranca_aplicada": "VARCHAR(50)",
    "valor_proprio": "NUMERIC(14,2)", "repasse_proprio": "NUMERIC(14,2)",
    "data_clinica": "TIMESTAMPTZ",
    "criado_por_id": "INTEGER REFERENCES usuarios(id)",
    "atualizado_por_id": "INTEGER REFERENCES usuarios(id)",
    "versao": "INTEGER NOT NULL DEFAULT 1", "command_id": "VARCHAR(128)",
    "command_unidade": "INTEGER",
}

VALIDATE_SQL = """
CREATE FUNCTION fc4_validate_occurrence() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE n INT; matched INT; lo INT; hi INT; arches INT; member JSONB;
BEGIN
 IF NEW.alvo_tipo IS NULL THEN
  IF NEW.command_id IS NOT NULL OR NEW.alvo_slots IS NOT NULL
     OR NEW.faces_mask IS NOT NULL THEN
   RAISE EXCEPTION 'FC4: incomplete applied target';
  END IF;
  RETURN NEW; -- V1 remains explicitly unclassified, never silently backfilled.
 END IF;
 IF NEW.prestador_id IS NULL OR NEW.criado_por_id IS NULL
    OR NEW.command_id IS NULL OR NEW.command_unidade IS NULL
    OR NEW.command_unidade < 1 OR NEW.data_clinica IS NULL
    OR NEW.forma_cobranca_aplicada IS NULL
    OR NEW.faces_mask IS NULL OR NEW.faces_mask NOT BETWEEN 0 AND 31
    OR NEW.alvo_slots IS NULL OR jsonb_typeof(NEW.alvo_slots) <> 'array' THEN
  RAISE EXCEPTION 'FC4: missing required occurrence field';
 END IF;
 IF NOT EXISTS (SELECT 1 FROM pacientes WHERE id=NEW.paciente_id AND clinica_id=NEW.clinica_id)
 OR NOT EXISTS (SELECT 1 FROM tratamento WHERE id=NEW.tratamento_id
     AND paciente_id=NEW.paciente_id AND clinica_id=NEW.clinica_id)
 OR NOT EXISTS (SELECT 1 FROM procedimento WHERE id=NEW.procedimento_id AND clinica_id=NEW.clinica_id)
 OR NOT EXISTS (SELECT 1 FROM prestador_odonto WHERE id=NEW.prestador_id AND clinica_id=NEW.clinica_id)
 OR NOT EXISTS (SELECT 1 FROM usuarios WHERE id=NEW.criado_por_id AND clinica_id=NEW.clinica_id)
 OR (NEW.atualizado_por_id IS NOT NULL AND NOT EXISTS
     (SELECT 1 FROM usuarios WHERE id=NEW.atualizado_por_id AND clinica_id=NEW.clinica_id))
 OR NOT EXISTS (SELECT 1 FROM odontograma_comandos WHERE clinica_id=NEW.clinica_id
     AND command_id=NEW.command_id AND procedimento_id=NEW.procedimento_id
     AND usuario_id=NEW.criado_por_id) THEN
  RAISE EXCEPTION 'FC4: invalid scoped reference';
 END IF;
 n := jsonb_array_length(NEW.alvo_slots);
 FOR member IN SELECT value FROM jsonb_array_elements(NEW.alvo_slots) LOOP
  IF jsonb_typeof(member)<>'number' OR member::text !~ '^[1-9][0-9]*$' THEN
   RAISE EXCEPTION 'FC4: invalid stable slot id';
  END IF;
 END LOOP;
 -- Hold referenced rows through commit, closing create/delete/update races.
 PERFORM id FROM odontograma_arcada_slots
 WHERE id IN (SELECT value::text::BIGINT FROM jsonb_array_elements(NEW.alvo_slots))
 ORDER BY id FOR SHARE;
 SELECT count(*), min(slot_ordem), max(slot_ordem),
        count(DISTINCT ((slot_ordem-1)/16))
 INTO matched, lo, hi, arches FROM odontograma_arcada_slots
 WHERE id IN (SELECT value::text::BIGINT FROM jsonb_array_elements(NEW.alvo_slots))
   AND clinica_id=NEW.clinica_id AND paciente_id=NEW.paciente_id
   AND tratamento_id=NEW.tratamento_id AND slot_ordem BETWEEN 1 AND 32;
 IF matched<>n THEN RAISE EXCEPTION 'FC4: invalid, repeated or foreign slot'; END IF;
 IF NEW.alvo_tipo='GERAL' THEN
  IF n<>0 OR NEW.faces_mask<>0 THEN RAISE EXCEPTION 'FC4: GENERAL has no slots/faces'; END IF;
 ELSIF NEW.alvo_tipo='FACE' THEN
  IF n<>1 OR NEW.faces_mask=0 THEN RAISE EXCEPTION 'FC4: FACE needs one slot and effective faces'; END IF;
 ELSE
  IF n=0 OR NEW.faces_mask<>0 OR arches<>1 THEN RAISE EXCEPTION 'FC4: invalid target geometry'; END IF;
  IF NEW.alvo_tipo='DENTE' AND n<>1 THEN RAISE EXCEPTION 'FC4: DENTE needs one slot'; END IF;
  IF NEW.alvo_tipo='GRUPO' AND hi-lo+1<>n THEN RAISE EXCEPTION 'FC4: GRUPO must be contiguous'; END IF;
  IF NEW.alvo_tipo='ARCADA' AND n<>16 THEN RAISE EXCEPTION 'FC4: ARCADA needs sixteen slots'; END IF;
 END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER fc4_occurrence_guard BEFORE INSERT OR UPDATE ON odontograma_intervencoes
 FOR EACH ROW EXECUTE FUNCTION fc4_validate_occurrence();

CREATE FUNCTION fc4_preserve_slot_identity() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF EXISTS (SELECT 1 FROM odontograma_intervencoes
     WHERE alvo_slots @> jsonb_build_array(OLD.id)) THEN
  IF TG_OP='DELETE' THEN RAISE EXCEPTION 'FC4: referenced stable slot'; END IF;
  IF (NEW.id,NEW.clinica_id,NEW.paciente_id,NEW.tratamento_id,NEW.slot_ordem)
     IS DISTINCT FROM
     (OLD.id,OLD.clinica_id,OLD.paciente_id,OLD.tratamento_id,OLD.slot_ordem) THEN
   RAISE EXCEPTION 'FC4: referenced slot identity is immutable';
  END IF;
 END IF;
 IF TG_OP='DELETE' THEN RETURN OLD; END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER fc4_slot_identity_guard BEFORE UPDATE OR DELETE ON odontograma_arcada_slots
 FOR EACH ROW EXECUTE FUNCTION fc4_preserve_slot_identity();

CREATE FUNCTION fc4_preserve_receipt() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF TG_OP='DELETE' THEN RAISE EXCEPTION 'FC4: durable receipt cannot be deleted'; END IF;
 IF (NEW.id,NEW.clinica_id,NEW.command_id,NEW.usuario_id,NEW.procedimento_id,NEW.payload_hash,NEW.criado_em)
    IS DISTINCT FROM
    (OLD.id,OLD.clinica_id,OLD.command_id,OLD.usuario_id,OLD.procedimento_id,OLD.payload_hash,OLD.criado_em)
 OR (OLD.resultado IS NOT NULL AND NEW.resultado IS DISTINCT FROM OLD.resultado) THEN
  RAISE EXCEPTION 'FC4: receipt identity/result is immutable';
 END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER fc4_receipt_guard BEFORE UPDATE OR DELETE ON odontograma_comandos
 FOR EACH ROW EXECUTE FUNCTION fc4_preserve_receipt();

CREATE FUNCTION fc4_complete_receipt() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE r JSONB; ids JSONB;
BEGIN
 SELECT resultado INTO r FROM odontograma_comandos WHERE id=NEW.id;
 IF r IS NULL OR jsonb_typeof(r)<>'array' OR jsonb_array_length(r)=0 THEN
  RAISE EXCEPTION 'FC4: incomplete receipt';
 END IF;
 SELECT jsonb_agg(id ORDER BY command_unidade) INTO ids FROM odontograma_intervencoes
 WHERE clinica_id=NEW.clinica_id AND command_id=NEW.command_id;
 IF ids IS DISTINCT FROM r THEN RAISE EXCEPTION 'FC4: receipt and occurrences disagree'; END IF;
 RETURN NULL;
END $$;
CREATE CONSTRAINT TRIGGER fc4_complete_receipt_guard AFTER INSERT ON odontograma_comandos
 DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION fc4_complete_receipt();
"""


def preflight(conn):
    inspector = inspect(conn)
    names = set(inspector.get_table_names())
    required = {"clinicas", "pacientes", "usuarios", "tratamento", "procedimento",
                "prestador_odonto", "odontograma_intervencoes", "odontograma_arcada_slots"}
    if not required <= names:
        raise ValueError("FC4 baseline tables missing")
    existing = {c["name"] for c in inspector.get_columns("odontograma_intervencoes")}
    if set(COLUMNS) & existing or "odontograma_comandos" in names:
        raise ValueError("FC4 delta already present/partial; explicit reconciliation required")
    fks = [f for f in inspector.get_foreign_keys("odontograma_intervencoes")
           if f["constrained_columns"] == ["tratamento_id"]]
    if len(fks) != 1 or fks[0]["options"].get("ondelete") != "CASCADE":
        raise ValueError("Unexpected V1 treatment FK; do not silently replace")
    return {"treatment_fk": fks[0]["name"], "legacy_rows": conn.execute(
        text("SELECT count(*) FROM odontograma_intervencoes")).scalar_one()}


def apply(conn):
    """Must run inside an explicit transaction; no automatic application."""
    if not conn.in_transaction():
        raise ValueError("Explicit deployment transaction required")
    conn.execute(text("SELECT pg_advisory_xact_lock(7304202610)"))
    plan = preflight(conn)
    ensure_version_table(conn)
    conn.execute(text("""
        CREATE TABLE odontograma_comandos (
          id BIGSERIAL PRIMARY KEY, clinica_id INTEGER NOT NULL REFERENCES clinicas(id),
          command_id VARCHAR(128) NOT NULL CHECK (length(command_id)>0),
          usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
          procedimento_id INTEGER NOT NULL REFERENCES procedimento(id),
          payload_hash VARCHAR(64) NOT NULL CHECK (payload_hash ~ '^[0-9a-f]{64}$'),
          resultado JSONB NULL, criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
          CONSTRAINT uq_fc4_comando UNIQUE (clinica_id, command_id)
        )
    """))
    for name, definition in COLUMNS.items():
        conn.execute(text(f"ALTER TABLE odontograma_intervencoes ADD COLUMN {name} {definition}"))
    conn.execute(text("""
        ALTER TABLE odontograma_intervencoes
          ADD CONSTRAINT ck_fc4_versao CHECK (versao>0),
          ADD CONSTRAINT ck_fc4_alvo_tipo CHECK (alvo_tipo IS NULL OR
            alvo_tipo IN ('FACE','DENTE','GRUPO','ARCADA','GERAL','SEGMENTO')),
          ADD CONSTRAINT fk_fc4_ocorrencia_comando FOREIGN KEY (clinica_id,command_id)
            REFERENCES odontograma_comandos(clinica_id,command_id),
          ADD CONSTRAINT uq_fc4_comando_unidade UNIQUE (clinica_id,command_id,command_unidade);
        CREATE INDEX ix_fc4_alvo_slots ON odontograma_intervencoes USING gin(alvo_slots);
    """))
    # Constrain treatment deletion; never infer permission to erase occurrences.
    fk = plan["treatment_fk"]
    if not fk.replace("_", "").isalnum():
        raise ValueError("Unexpected FK identifier")
    conn.execute(text(f'ALTER TABLE odontograma_intervencoes DROP CONSTRAINT "{fk}"'))
    conn.execute(text(f'ALTER TABLE odontograma_intervencoes ADD CONSTRAINT "{fk}" '
                      'FOREIGN KEY(tratamento_id) REFERENCES tratamento(id) ON DELETE RESTRICT'))
    conn.execute(text(VALIDATE_SQL))
    conn.execute(text("""
        INSERT INTO brana_schema_versions(version,checksum,status,description,executor_version,applied_at)
        VALUES (:v,'fc4-p2-r1-v1','applied','FC4 isolated persistence foundation','1',now())
    """), {"v": VERSION})


def rollback(conn):
    """Refuse lossy downgrade even after occurrences were physically deleted."""
    if not conn.in_transaction():
        raise ValueError("Explicit deployment transaction required")
    conn.execute(text("SELECT pg_advisory_xact_lock(7304202610)"))
    conn.execute(text("LOCK TABLE odontograma_intervencoes, odontograma_comandos IN ACCESS EXCLUSIVE MODE"))
    populated = " OR ".join(f"{c} IS NOT NULL" for c in COLUMNS if c != "versao")
    if conn.execute(text("SELECT EXISTS(SELECT 1 FROM odontograma_comandos) OR EXISTS("
                         f"SELECT 1 FROM odontograma_intervencoes WHERE {populated} OR versao<>1)")).scalar_one():
        raise ValueError("Downgrade would lose FC4 data/receipts; backup/reconciliation required")
    conn.execute(text("""
        DROP TRIGGER fc4_occurrence_guard ON odontograma_intervencoes;
        DROP TRIGGER fc4_slot_identity_guard ON odontograma_arcada_slots;
        DROP TRIGGER fc4_receipt_guard ON odontograma_comandos;
        DROP TRIGGER fc4_complete_receipt_guard ON odontograma_comandos;
        DROP FUNCTION fc4_validate_occurrence();
        DROP FUNCTION fc4_preserve_slot_identity();
        DROP FUNCTION fc4_preserve_receipt();
        DROP FUNCTION fc4_complete_receipt();
        DROP INDEX ix_fc4_alvo_slots;
        ALTER TABLE odontograma_intervencoes DROP CONSTRAINT fk_fc4_ocorrencia_comando;
        ALTER TABLE odontograma_intervencoes DROP CONSTRAINT uq_fc4_comando_unidade;
        ALTER TABLE odontograma_intervencoes DROP CONSTRAINT ck_fc4_versao;
        ALTER TABLE odontograma_intervencoes DROP CONSTRAINT ck_fc4_alvo_tipo;
    """))
    fk = next(f["name"] for f in inspect(conn).get_foreign_keys("odontograma_intervencoes")
              if f["constrained_columns"] == ["tratamento_id"])
    conn.execute(text(f'ALTER TABLE odontograma_intervencoes DROP CONSTRAINT "{fk}"'))
    conn.execute(text(f'ALTER TABLE odontograma_intervencoes ADD CONSTRAINT "{fk}" '
                      'FOREIGN KEY(tratamento_id) REFERENCES tratamento(id) ON DELETE CASCADE'))
    for name in reversed(COLUMNS):
        conn.execute(text(f"ALTER TABLE odontograma_intervencoes DROP COLUMN {name}"))
    conn.execute(text("DROP TABLE odontograma_comandos"))
    conn.execute(text("DELETE FROM brana_schema_versions WHERE version=:v"), {"v": VERSION})
