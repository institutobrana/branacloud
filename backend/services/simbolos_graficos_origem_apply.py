from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Protocol


class ApplyAuthorizationError(RuntimeError):
    pass


class ApplyEnvironmentError(RuntimeError):
    pass


class ApplyDatabaseError(RuntimeError):
    pass


class ApplyManifestError(RuntimeError):
    pass


class ApplyBackupError(RuntimeError):
    pass


class ApplyPartialStateError(RuntimeError):
    pass


class ApplyConflictError(RuntimeError):
    pass


class ApplyLockError(RuntimeError):
    pass


class ApplyRowcountError(RuntimeError):
    pass


class ApplyPostValidationError(RuntimeError):
    pass


class ApplyReportError(RuntimeError):
    pass


class ApplyTransactionError(RuntimeError):
    pass


@dataclass(frozen=True)
class ApplyAuthorization:
    environment: str
    expected_database: str
    expected_schema: str
    expected_table: str
    expected_manifest_checksum: str
    runtime_authorized: bool
    confirmation_present: bool
    isolated_database_confirmed: bool
    backup_validated: bool


@dataclass(frozen=True)
class PlannedRecord:
    id: int
    origem_atual: Any
    origem_esperada: Any
    assinatura_atual: str
    assinatura_esperada: str
    rule_id: str
    action: str
    reason: str


@dataclass(frozen=True)
class ApplyPlan:
    records: tuple[PlannedRecord, ...]
    planned_updates: int
    skips: int
    conflicts: int
    missing: int
    signature_mismatches: int
    partial_state: bool
    category_totals: dict[str, int]


@dataclass(frozen=True)
class ReportPaths:
    json_path: str
    markdown_path: str


@dataclass(frozen=True)
class ApplyExecutionResult:
    attempted: int
    updated: int
    skipped: int
    committed: bool
    rolled_back: bool
    rollback_reason: str | None
    category_totals: dict[str, int]
    duration: int
    report_paths: ReportPaths | None
    final_state_validated: bool


@dataclass(frozen=True)
class ApplyRuntimeContext:
    environment: str
    database: str
    schema: str
    table: str
    manifest_checksum: str
    runtime_authorized: bool
    confirmation_present: bool
    isolated_database_confirmed: bool
    backup_validated: bool


class ApplySession(Protocol):
    def acquire_lock(self) -> None: ...

    def begin(self) -> None: ...

    def execute_update(self, record: PlannedRecord) -> int: ...

    def validate_post_state(self, plan: ApplyPlan) -> None: ...

    def commit(self) -> None: ...

    def rollback(self) -> None: ...


APPLY_UPDATE_SQL = (
    "UPDATE public.simbolo_grafico_catalogo "
    "SET origem = :origem "
    "WHERE id = :id "
    "AND origem IS NULL"
)


ALLOWED_ENVIRONMENTS = {"isolated"}
ALLOWED_DATABASES = {"brana_saas_symbol_origin_apply_test"}
ALLOWED_MANIFEST_CHECKSUMS = {
    "dd01ca096842b69385f5e16e4d84057b33c43daf08a3cbccb7d8783012077f7a"
}


def validate_apply_authorization(
    *,
    environment: str,
    expected_database: str,
    expected_schema: str,
    expected_table: str,
    expected_manifest_checksum: str,
    runtime_authorized: bool,
    confirmation_present: bool,
    isolated_database_confirmed: bool,
    backup_validated: bool,
) -> ApplyAuthorization:
    if environment not in ALLOWED_ENVIRONMENTS:
        raise ApplyEnvironmentError("environment_nao_autorizado")
    if expected_database not in ALLOWED_DATABASES:
        raise ApplyDatabaseError("database_nao_autorizado")
    if expected_manifest_checksum not in ALLOWED_MANIFEST_CHECKSUMS:
        raise ApplyManifestError("checksum_nao_autorizado")
    if not runtime_authorized:
        raise ApplyAuthorizationError("runtime_nao_autorizado")
    if not confirmation_present:
        raise ApplyAuthorizationError("confirmacao_ausente")
    if not isolated_database_confirmed:
        raise ApplyDatabaseError("banco_isolado_nao_confirmado")
    if not backup_validated:
        raise ApplyBackupError("backup_nao_validado")
    return ApplyAuthorization(
        environment=environment,
        expected_database=expected_database,
        expected_schema=expected_schema,
        expected_table=expected_table,
        expected_manifest_checksum=expected_manifest_checksum,
        runtime_authorized=runtime_authorized,
        confirmation_present=confirmation_present,
        isolated_database_confirmed=isolated_database_confirmed,
        backup_validated=backup_validated,
    )


def validate_apply_plan(plan: ApplyPlan) -> None:
    if plan.partial_state:
        raise ApplyPartialStateError("estado_parcial")
    if plan.conflicts:
        raise ApplyConflictError("conflito_no_plano")
    if plan.missing:
        raise ApplyConflictError("missing_no_plano")
    if plan.signature_mismatches:
        raise ApplyConflictError("assinatura_divergente")


def build_apply_update_sql() -> str:
    return APPLY_UPDATE_SQL


def iter_planned_updates(plan: ApplyPlan) -> tuple[PlannedRecord, ...]:
    return tuple(sorted((record for record in plan.records if record.action == "update"), key=lambda record: record.id))


def execute_apply_transaction(session: ApplySession, plan: ApplyPlan, authorization: ApplyAuthorization) -> ApplyExecutionResult:
    validate_apply_authorization(
        environment=authorization.environment,
        expected_database=authorization.expected_database,
        expected_schema=authorization.expected_schema,
        expected_table=authorization.expected_table,
        expected_manifest_checksum=authorization.expected_manifest_checksum,
        runtime_authorized=authorization.runtime_authorized,
        confirmation_present=authorization.confirmation_present,
        isolated_database_confirmed=authorization.isolated_database_confirmed,
        backup_validated=authorization.backup_validated,
    )
    validate_apply_plan(plan)
    if authorization.expected_database == "brana_saas":
        raise ApplyDatabaseError("brana_saas_bloqueado")

    session.acquire_lock()
    session.begin()
    attempted = 0
    updated = 0
    ordered_updates = iter_planned_updates(plan)
    try:
        for record in ordered_updates:
            attempted += 1
            rowcount = session.execute_update(record)
            if rowcount != 1:
                raise ApplyRowcountError(f"rowcount_invalido:{record.id}")
            updated += 1
        session.validate_post_state(plan)
        session.commit()
        return ApplyExecutionResult(
            attempted=attempted,
            updated=updated,
            skipped=plan.skips,
            committed=True,
            rolled_back=False,
            rollback_reason=None,
            category_totals=dict(plan.category_totals),
            duration=0,
            report_paths=None,
            final_state_validated=True,
        )
    except Exception as exc:
        session.rollback()
        return ApplyExecutionResult(
            attempted=attempted,
            updated=updated,
            skipped=plan.skips,
            committed=False,
            rolled_back=True,
            rollback_reason=exc.__class__.__name__,
            category_totals=dict(plan.category_totals),
            duration=0,
            report_paths=None,
            final_state_validated=False,
        )


def validate_post_apply_state(session: ApplySession, plan: ApplyPlan) -> None:
    session.validate_post_state(plan)


def write_apply_report(result: ApplyExecutionResult, report_dir: str | Path) -> ReportPaths:
    report_dir = Path(report_dir)
    report_dir.mkdir(parents=True, exist_ok=True)
    json_path = report_dir / "apply_report.json"
    markdown_path = report_dir / "apply_report.md"
    json_path.write_text("{}", encoding="utf-8")
    markdown_path.write_text("# Apply report\n", encoding="utf-8")
    return ReportPaths(json_path=str(json_path), markdown_path=str(markdown_path))
