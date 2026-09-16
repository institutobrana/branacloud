"""Adiciona AgendaLegadoEvento.patient_id sem backfill.

Upgrade estrutural idempotente; nenhum evento existente é atualizado.
"""
import argparse
import sys
from pathlib import Path
from sqlalchemy import inspect, text

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))
from database import engine

MIGRATION_ID = "agenda_legado_patient_id_20260902"

def upgrade():
    with engine.begin() as conn:
        inspector = inspect(conn)
        if any(c["name"] == "patient_id" for c in inspector.get_columns("agenda_legado_evento")):
            raise RuntimeError("agenda_legado_evento.patient_id já existe; migration interrompida")
        conn.execute(text("ALTER TABLE agenda_legado_evento ADD COLUMN patient_id INTEGER NULL"))
        conn.execute(text("CREATE INDEX ix_agenda_legado_evento_patient_id ON agenda_legado_evento (patient_id)"))
        conn.execute(text("ALTER TABLE agenda_legado_evento ADD CONSTRAINT fk_agenda_legado_evento_patient_id FOREIGN KEY (patient_id) REFERENCES pacientes (id) ON DELETE SET NULL"))

def downgrade():
    with engine.begin() as conn:
        conn.execute(text("ALTER TABLE agenda_legado_evento DROP CONSTRAINT IF EXISTS fk_agenda_legado_evento_patient_id"))
        conn.execute(text("DROP INDEX IF EXISTS ix_agenda_legado_evento_patient_id"))
        conn.execute(text("ALTER TABLE agenda_legado_evento DROP COLUMN IF EXISTS patient_id"))

if __name__ == "__main__":
    parser = argparse.ArgumentParser(); parser.add_argument("--downgrade", action="store_true"); args = parser.parse_args()
    downgrade() if args.downgrade else upgrade()
    print(f"Migration aplicada: {MIGRATION_ID}")
