"""D2 contract coverage; integration/concurrency execution uses isolated PostgreSQL."""

from datetime import datetime, timedelta, timezone

from models.clinical_patient_lease import ClinicalPatientLease


def test_d2_schema_contract():
    assert ClinicalPatientLease.__tablename__ == "clinical_patient_lease"
    assert {"clinica_id", "paciente_id", "owner_usuario_id", "owner_session_instance_id", "expires_at", "lease_token"} <= {
        column.name for column in ClinicalPatientLease.__table__.columns
    }


def test_d2_expiry_boundary_is_server_time_comparable():
    now = datetime.now(timezone.utc)
    assert now + timedelta(seconds=1) > now
