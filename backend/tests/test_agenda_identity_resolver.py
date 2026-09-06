import copy
import sys
import unittest
from pathlib import Path
from types import SimpleNamespace

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from models.model_registry import import_all_models

import_all_models()

from services.agenda_identity_resolver import (
    AgendaPatientIdentityState,
    resolve_agenda_patient_identity,
)


class _Query:
    def __init__(self, patient):
        self.patient = patient

    def filter(self, *criteria):
        return self

    def one_or_none(self):
        return self.patient


class _ReadOnlyDb:
    def __init__(self, patient=None):
        self.patient = patient

    def query(self, model):
        return _Query(self.patient)

    def add(self, *args, **kwargs):
        raise AssertionError("resolver must not write")

    def delete(self, *args, **kwargs):
        raise AssertionError("resolver must not write")

    def commit(self):
        raise AssertionError("resolver must not write")


class AgendaIdentityResolverTests(unittest.TestCase):
    tenant_id = 7
    patient = SimpleNamespace(id=101, clinica_id=7, codigo=9001)

    def resolve(self, event, patient=None):
        return resolve_agenda_patient_identity(event, _ReadOnlyDb(patient), self.tenant_id)

    def assert_state(self, event, state, **expected):
        result = self.resolve(event, expected.pop("patient", None))
        self.assertEqual(result.state, state)
        for key, value in expected.items():
            self.assertEqual(getattr(result, key), value)
        return result

    def test_canonical_valid_same_tenant(self):
        result = self.assert_state(
            SimpleNamespace(patient_id=101, nro_pac=9001),
            AgendaPatientIdentityState.CANONICAL,
            patient=self.patient,
            canonical_patient_id=101,
            external_effect_allowed=True,
        )
        self.assertEqual(result.proof_source, "patient_id")

    def test_missing_patient_is_invalid(self):
        self.assert_state(SimpleNamespace(patient_id=999, nro_pac=101), AgendaPatientIdentityState.INVALID)

    def test_cross_tenant_patient_is_invalid(self):
        other_tenant = SimpleNamespace(id=101, clinica_id=8, codigo=9001)
        # The tenant-filtered query must not return a cross-tenant row.
        self.assert_state(SimpleNamespace(patient_id=101, nro_pac=9001), AgendaPatientIdentityState.INVALID)

    def test_historical_nro_pac_is_unresolved(self):
        self.assert_state(SimpleNamespace(patient_id=None, nro_pac=101), AgendaPatientIdentityState.HISTORICAL_UNRESOLVED_WITH_NRO_PAC)

    def test_historical_null_is_unknown(self):
        self.assert_state(SimpleNamespace(patient_id=None, nro_pac=None), AgendaPatientIdentityState.HISTORICAL_NULL_IDENTITY_UNKNOWN)

    def test_id_only_does_not_resolve(self):
        self.assert_state(SimpleNamespace(patient_id=None, nro_pac=101), AgendaPatientIdentityState.HISTORICAL_UNRESOLVED_WITH_NRO_PAC, patient=self.patient)

    def test_code_only_does_not_resolve(self):
        self.assert_state(SimpleNamespace(patient_id=None, nro_pac=9001), AgendaPatientIdentityState.HISTORICAL_UNRESOLVED_WITH_NRO_PAC, patient=self.patient)

    def test_both_different_does_not_resolve(self):
        self.assert_state(SimpleNamespace(patient_id=None, nro_pac=9001), AgendaPatientIdentityState.HISTORICAL_UNRESOLVED_WITH_NRO_PAC, patient=self.patient)

    def test_canonical_patient_id_wins_over_conflicting_legacy_value(self):
        result = self.assert_state(
            SimpleNamespace(patient_id=101, nro_pac=7777),
            AgendaPatientIdentityState.CANONICAL,
            patient=self.patient,
            canonical_patient_id=101,
            external_effect_allowed=True,
        )
        self.assertIs(result.patient, self.patient)

    def test_invalid_patient_id_does_not_fallback_to_resolvable_nro_pac(self):
        self.assert_state(SimpleNamespace(patient_id=999, nro_pac=9001), AgendaPatientIdentityState.INVALID)

    def test_or_join_is_not_identity_proof_and_event_is_not_mutated(self):
        event = SimpleNamespace(patient_id=None, nro_pac=9001, nome="legacy")
        before = copy.deepcopy(event.__dict__)
        result = self.resolve(event, self.patient)
        self.assertEqual(result.state, AgendaPatientIdentityState.HISTORICAL_UNRESOLVED_WITH_NRO_PAC)
        self.assertEqual(event.__dict__, before)


if __name__ == "__main__":
    unittest.main()
