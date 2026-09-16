import tempfile
import unittest
from pathlib import Path

from backend.services import simbolos_graficos_origem_apply as apply_module


class FakeSession:
    def __init__(self, rowcounts=None, fail_on_post=False):
        self.rowcounts = list(rowcounts or [])
        self.fail_on_post = fail_on_post
        self.locked = False
        self.begun = False
        self.committed = False
        self.rolled_back = False
        self.updated_ids = []
        self.sql_statements = []

    def acquire_lock(self):
        self.locked = True

    def begin(self):
        self.begun = True

    def execute_update(self, record):
        self.updated_ids.append(record.id)
        self.sql_statements.append(
            (
                apply_module.build_apply_update_sql(),
                {"id": record.id, "origem": record.origem_esperada},
            )
        )
        return self.rowcounts.pop(0) if self.rowcounts else 1

    def validate_post_state(self, plan):
        if self.fail_on_post:
            raise apply_module.ApplyPostValidationError("post_state_invalido")

    def commit(self):
        self.committed = True

    def rollback(self):
        self.rolled_back = True


class ApplySimulationTests(unittest.TestCase):
    def _authorization(self):
        return apply_module.validate_apply_authorization(
            environment="isolated",
            expected_database=next(iter(apply_module.ALLOWED_DATABASES)),
            expected_schema="public",
            expected_table="simbolo_grafico_catalogo",
            expected_manifest_checksum=next(iter(apply_module.ALLOWED_MANIFEST_CHECKSUMS)),
            runtime_authorized=True,
            confirmation_present=True,
            isolated_database_confirmed=True,
            backup_validated=True,
        )

    def _plan(self, action="update"):
        record = apply_module.PlannedRecord(
            id=1,
            origem_atual=None,
            origem_esperada="catalogo_oficial",
            assinatura_atual="sig-atual",
            assinatura_esperada="sig-esp",
            rule_id="R001",
            action=action,
            reason="ok",
        )
        return apply_module.ApplyPlan(
            records=(record,),
            planned_updates=1 if action == "update" else 0,
            skips=0 if action == "update" else 1,
            conflicts=0,
            missing=0,
            signature_mismatches=0,
            partial_state=False,
            category_totals={"catalogo_oficial": 1},
        )

    def test_authorization_gate_requires_isolated_allowed_database_and_checksum(self):
        auth = self._authorization()
        self.assertTrue(auth.runtime_authorized)
        with self.assertRaises(apply_module.ApplyEnvironmentError):
            apply_module.validate_apply_authorization(
                environment="local",
                expected_database=next(iter(apply_module.ALLOWED_DATABASES)),
                expected_schema="public",
                expected_table="simbolo_grafico_catalogo",
                expected_manifest_checksum=next(iter(apply_module.ALLOWED_MANIFEST_CHECKSUMS)),
                runtime_authorized=True,
                confirmation_present=True,
                isolated_database_confirmed=True,
                backup_validated=True,
            )

    def test_plan_validation_rejects_partial_state_and_conflict(self):
        with self.assertRaises(apply_module.ApplyPartialStateError):
            apply_module.validate_apply_plan(
                apply_module.ApplyPlan(
                    records=(),
                    planned_updates=0,
                    skips=0,
                    conflicts=0,
                    missing=0,
                    signature_mismatches=0,
                    partial_state=True,
                    category_totals={},
                )
            )
        with self.assertRaises(apply_module.ApplyConflictError):
            apply_module.validate_apply_plan(
                apply_module.ApplyPlan(
                    records=(),
                    planned_updates=0,
                    skips=0,
                    conflicts=1,
                    missing=0,
                    signature_mismatches=0,
                    partial_state=False,
                    category_totals={},
                )
            )

    def test_execute_apply_transaction_commits_in_simulated_session(self):
        session = FakeSession()
        result = apply_module.execute_apply_transaction(session, self._plan(), self._authorization())
        self.assertTrue(result.committed)
        self.assertFalse(result.rolled_back)
        self.assertTrue(session.locked)
        self.assertTrue(session.begun)
        self.assertTrue(session.committed)
        self.assertFalse(session.rolled_back)
        self.assertEqual(result.updated, 1)
        self.assertTrue(result.final_state_validated)
        self.assertEqual(session.updated_ids, [1])
        self.assertEqual(session.sql_statements[0][0], apply_module.build_apply_update_sql())
        self.assertEqual(session.sql_statements[0][1], {"id": 1, "origem": "catalogo_oficial"})

    def test_execute_apply_transaction_rolls_back_on_rowcount_error(self):
        session = FakeSession(rowcounts=[0])
        result = apply_module.execute_apply_transaction(session, self._plan(), self._authorization())
        self.assertTrue(result.rolled_back)
        self.assertFalse(result.committed)
        self.assertEqual(result.rollback_reason, "ApplyRowcountError")
        self.assertTrue(session.rolled_back)

    def test_execute_apply_transaction_rolls_back_on_late_rowcount_error(self):
        record_a = apply_module.PlannedRecord(
            id=1,
            origem_atual=None,
            origem_esperada="catalogo_oficial",
            assinatura_atual="sig-atual",
            assinatura_esperada="sig-esp",
            rule_id="R001",
            action="update",
            reason="ok",
        )
        record_b = apply_module.PlannedRecord(
            id=2,
            origem_atual=None,
            origem_esperada="seed_interno",
            assinatura_atual="sig-atual-2",
            assinatura_esperada="sig-esp-2",
            rule_id="R002",
            action="update",
            reason="ok",
        )
        plan = apply_module.ApplyPlan(
            records=(record_b, record_a),
            planned_updates=2,
            skips=0,
            conflicts=0,
            missing=0,
            signature_mismatches=0,
            partial_state=False,
            category_totals={"catalogo_oficial": 1, "seed_interno": 1},
        )
        session = FakeSession(rowcounts=[1, 0])
        result = apply_module.execute_apply_transaction(session, plan, self._authorization())
        self.assertTrue(result.rolled_back)
        self.assertFalse(result.committed)
        self.assertEqual(session.updated_ids, [1, 2])
        self.assertEqual(session.sql_statements[0][1]["id"], 1)
        self.assertEqual(session.sql_statements[1][1]["id"], 2)

    def test_execute_apply_transaction_rolls_back_on_post_validation_error(self):
        session = FakeSession(fail_on_post=True)
        result = apply_module.execute_apply_transaction(session, self._plan(), self._authorization())
        self.assertTrue(result.rolled_back)
        self.assertFalse(result.committed)
        self.assertEqual(result.rollback_reason, "ApplyPostValidationError")

    def test_execute_apply_transaction_blocks_branasaas(self):
        auth = apply_module.ApplyAuthorization(
            environment="isolated",
            expected_database="brana_saas",
            expected_schema="public",
            expected_table="simbolo_grafico_catalogo",
            expected_manifest_checksum=next(iter(apply_module.ALLOWED_MANIFEST_CHECKSUMS)),
            runtime_authorized=True,
            confirmation_present=True,
            isolated_database_confirmed=True,
            backup_validated=True,
        )
        session = FakeSession()
        with self.assertRaises(apply_module.ApplyDatabaseError):
            apply_module.execute_apply_transaction(session, self._plan(), auth)

    def test_empty_state_updates_every_record_in_deterministic_order(self):
        record_b = apply_module.PlannedRecord(
            id=20,
            origem_atual=None,
            origem_esperada="seed_interno",
            assinatura_atual="sig-b",
            assinatura_esperada="sig-b-exp",
            rule_id="R002",
            action="update",
            reason="ok",
        )
        record_a = apply_module.PlannedRecord(
            id=10,
            origem_atual=None,
            origem_esperada="catalogo_oficial",
            assinatura_atual="sig-a",
            assinatura_esperada="sig-a-exp",
            rule_id="R001",
            action="update",
            reason="ok",
        )
        plan = apply_module.ApplyPlan(
            records=(record_b, record_a),
            planned_updates=2,
            skips=0,
            conflicts=0,
            missing=0,
            signature_mismatches=0,
            partial_state=False,
            category_totals={"catalogo_oficial": 1, "seed_interno": 1},
        )
        session = FakeSession(rowcounts=[1, 1])
        result = apply_module.execute_apply_transaction(session, plan, self._authorization())
        self.assertTrue(result.committed)
        self.assertEqual(session.updated_ids, [10, 20])
        self.assertEqual([item.id for item in apply_module.iter_planned_updates(plan)], [10, 20])

    def test_complete_match_yields_no_sql_and_no_updates(self):
        plan = apply_module.ApplyPlan(
            records=(
                apply_module.PlannedRecord(
                    id=1,
                    origem_atual="catalogo_oficial",
                    origem_esperada="catalogo_oficial",
                    assinatura_atual="sig",
                    assinatura_esperada="sig",
                    rule_id="R001",
                    action="skip",
                    reason="match",
                ),
                apply_module.PlannedRecord(
                    id=2,
                    origem_atual="seed_interno",
                    origem_esperada="seed_interno",
                    assinatura_atual="sig2",
                    assinatura_esperada="sig2",
                    rule_id="R002",
                    action="skip",
                    reason="match",
                ),
            ),
            planned_updates=0,
            skips=2,
            conflicts=0,
            missing=0,
            signature_mismatches=0,
            partial_state=False,
            category_totals={"catalogo_oficial": 1, "seed_interno": 1},
        )
        session = FakeSession()
        result = apply_module.execute_apply_transaction(session, plan, self._authorization())
        self.assertTrue(result.committed)
        self.assertEqual(result.updated, 0)
        self.assertEqual(session.updated_ids, [])
        self.assertEqual(session.sql_statements, [])

    def test_partial_and_divergent_states_are_rejected_before_write(self):
        for plan in (
            apply_module.ApplyPlan(
                records=(),
                planned_updates=0,
                skips=0,
                conflicts=0,
                missing=0,
                signature_mismatches=0,
                partial_state=True,
                category_totals={},
            ),
            apply_module.ApplyPlan(
                records=(),
                planned_updates=0,
                skips=0,
                conflicts=1,
                missing=0,
                signature_mismatches=0,
                partial_state=False,
                category_totals={},
            ),
            apply_module.ApplyPlan(
                records=(),
                planned_updates=0,
                skips=0,
                conflicts=0,
                missing=1,
                signature_mismatches=0,
                partial_state=False,
                category_totals={},
            ),
            apply_module.ApplyPlan(
                records=(),
                planned_updates=0,
                skips=0,
                conflicts=0,
                missing=0,
                signature_mismatches=1,
                partial_state=False,
                category_totals={},
            ),
        ):
            with self.assertRaises((apply_module.ApplyPartialStateError, apply_module.ApplyConflictError)):
                apply_module.validate_apply_plan(plan)

    def test_sql_is_parametrized_and_never_updates_other_columns(self):
        sql = apply_module.build_apply_update_sql()
        self.assertIn("SET origem = :origem", sql)
        self.assertIn("WHERE id = :id", sql)
        self.assertIn("origem IS NULL", sql)
        self.assertNotIn("updated_at", sql.lower())
        self.assertNotIn("descricao =", sql.lower())
        self.assertNotIn("codigo =", sql.lower())

    def test_write_apply_report_creates_paths(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            result = apply_module.ApplyExecutionResult(
                attempted=1,
                updated=1,
                skipped=0,
                committed=True,
                rolled_back=False,
                rollback_reason=None,
                category_totals={"catalogo_oficial": 1},
                duration=0,
                report_paths=None,
                final_state_validated=True,
            )
            paths = apply_module.write_apply_report(result, Path(tmpdir))
            self.assertTrue(Path(paths.json_path).exists())
            self.assertTrue(Path(paths.markdown_path).exists())

    def test_backup_and_runtime_flags_are_required(self):
        with self.assertRaises(apply_module.ApplyBackupError):
            apply_module.validate_apply_authorization(
                environment="isolated",
                expected_database=next(iter(apply_module.ALLOWED_DATABASES)),
                expected_schema="public",
                expected_table="simbolo_grafico_catalogo",
                expected_manifest_checksum=next(iter(apply_module.ALLOWED_MANIFEST_CHECKSUMS)),
                runtime_authorized=True,
                confirmation_present=True,
                isolated_database_confirmed=True,
                backup_validated=False,
            )
        with self.assertRaises(apply_module.ApplyAuthorizationError):
            apply_module.validate_apply_authorization(
                environment="isolated",
                expected_database=next(iter(apply_module.ALLOWED_DATABASES)),
                expected_schema="public",
                expected_table="simbolo_grafico_catalogo",
                expected_manifest_checksum=next(iter(apply_module.ALLOWED_MANIFEST_CHECKSUMS)),
                runtime_authorized=False,
                confirmation_present=True,
                isolated_database_confirmed=True,
                backup_validated=True,
            )


if __name__ == "__main__":
    unittest.main()
