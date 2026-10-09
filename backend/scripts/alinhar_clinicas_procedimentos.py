"""R2B operator command. Dry-run/read-only unless --mode apply and all gates pass.

Never imports main/database/bootstrap. No credential fallback or HTTP caller.
Backups and evidence must stay outside the repository.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

from dotenv import dotenv_values
from sqlalchemy import create_engine, event, text
from sqlalchemy.engine import make_url

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / 'backend'))
from services.procedimentos_alignment_service import (
    AlignmentBlocked, build_clinic_plan, capture_state, dependency_audit,
    fingerprint, serialized,
    capture_exclusion_domain, scoped_hashes, execute_guarded_alignment,
    assert_exclusions_unchanged,
)

ACK = 'BRANA_R2B_REVIEWED_BACKUP_ISOLATED_PROOF_AND_DELETION_ACKNOWLEDGED'
CANONICAL = ROOT / 'backend/seeds/procedimentos_bootstrap_canonico.json'
OPERATOR_CONTRACT = 'PER_CLINIC_V1'


def read(path):
    return json.loads(Path(path).read_text(encoding='utf-8'))


def write(path, value):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(json.loads(serialized(value)), ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def load_bundle(directory):
    directory = Path(directory)
    manifest = read(directory / 'manifest.json')
    by_name = {f['file']: f['sha256'] for f in manifest['outputs']}
    for name in ('catalog_provision_plan.json', 'brana_extra_2016_inventory.json', 'read_only_snapshot.json'):
        if sha(directory / name) != by_name[name]:
            raise AlignmentBlocked('Reviewed audit file checksum mismatch')
    canonical = read(CANONICAL)
    if len(canonical['tables']) != 9 or sum(len(t['procedimentos']) for t in canonical['tables']) != 1263:
        raise AlignmentBlocked('Unexpected canonical inventory')
    extras = read(directory / 'brana_extra_2016_inventory.json')
    snapshot = read(directory / 'read_only_snapshot.json')
    expected_ids = {e['procedure_id'] for e in extras}
    return {'canonical': canonical, 'catalogs': read(directory / 'catalog_provision_plan.json'),
            'extras': extras, 'expected_rows': [p for p in snapshot['procedures'] if p['id'] in expected_ids],
            'approved_clinics': sorted({p['clinic_id'] for p in extras}),
            'protected_clinics': [1, 4], 'canonical_file_sha256': sha(CANONICAL),
            'audit_manifest_sha256': sha(directory / 'manifest.json')}


def plan_all(conn, bundle, scopes):
    """Legacy all-six planner for internal regressions only; not exposed by CLI."""
    if sorted(scopes) != bundle['approved_clinics'] or set(scopes).intersection(bundle['protected_clinics']):
        raise AlignmentBlocked('Scope differs from user-reviewed standard clinic manifest')
    return _plan_scope(conn, bundle, scopes)


def validate_clinic_id(bundle, clinic_id):
    if (type(clinic_id) is not int or clinic_id not in bundle['approved_clinics']
            or clinic_id in bundle['protected_clinics']):
        raise AlignmentBlocked('Single authorized clinic-id required')


def plan_one(conn, bundle, scopes):
    if not isinstance(scopes, list) or len(scopes) != 1:
        raise AlignmentBlocked('Exactly one clinic required')
    validate_clinic_id(bundle, scopes[0])
    return _plan_scope(conn, bundle, scopes)


def _plan_scope(conn, bundle, scopes):
    state = capture_state(conn, scopes)
    plans = []
    for cid in scopes:
        plan = build_clinic_plan(state[str(cid)], bundle['canonical'],
            next(c for c in bundle['catalogs'] if c['clinic_id'] == cid),
            [p for p in bundle['extras'] if p['clinic_id'] == cid],
            [p for p in bundle['expected_rows'] if p['clinica_id'] == cid])
        deps = dependency_audit(conn, cid, plan['extra_ids'], plan['extra_table_ids'])
        if deps['count']:
            raise AlignmentBlocked(f'Extra data dependency discovered in clinic {cid}')
        plans.append(plan)
    return state, plans


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--mode', choices=('plan', 'backup', 'apply', 'check'), default='plan')
    parser.add_argument('--audit-dir', type=Path, required=True)
    parser.add_argument('--out', type=Path, required=True)
    parser.add_argument('--clinic-id', type=int, required=True)
    parser.add_argument('--start-sequence', action='store_true', help='Create a new immutable initial sequence guard during first backup only')
    parser.add_argument('--env-file', type=Path)
    parser.add_argument('--target-url-env', help='Explicit process variable for disposable harness only')
    parser.add_argument('--ack')
    args = parser.parse_args()
    sequence_root = args.out.resolve()
    destination = sequence_root / f'clinic_{args.clinic_id}'
    if sequence_root == ROOT or ROOT in sequence_root.parents:
        raise AlignmentBlocked('Backup/artifacts must be outside the repository')
    if bool(args.env_file) == bool(args.target_url_env):
        raise AlignmentBlocked('Select exactly one explicit connection source')
    bundle = load_bundle(args.audit_dir)
    validate_clinic_id(bundle, args.clinic_id)
    scopes = [args.clinic_id]
    all_ids = sorted(set([*bundle['protected_clinics'], *bundle['approved_clinics']]))
    protected_ids = [cid for cid in all_ids if cid != args.clinic_id]
    started_at = datetime.now(timezone.utc).isoformat()
    sequence_file = sequence_root / 'sequence_scoped_guard.json'
    if args.start_sequence and (args.mode != 'backup' or sequence_file.exists()):
        raise AlignmentBlocked('Cannot replace/start an existing sequence baseline')
    if args.mode != 'plan' and not sequence_file.exists() and not args.start_sequence:
        raise AlignmentBlocked('An explicit initial sequence backup is required')
    if args.mode == 'backup' and (destination / 'backup_manifest.json').exists():
        raise AlignmentBlocked('Do not overwrite an individual backup')
    value = dotenv_values(args.env_file).get('DATABASE_URL') if args.env_file else os.environ.get(args.target_url_env)
    if not value:
        raise AlignmentBlocked('Explicit DATABASE_URL is required; no fallback')
    parsed = make_url(value)
    if parsed.get_backend_name() != 'postgresql':
        raise AlignmentBlocked('PostgreSQL required')
    if args.mode == 'apply':
        if args.ack != ACK:
            raise AlignmentBlocked('Reviewed destructive execution ACK required')
        proof = read(destination / 'isolated_proof.json')
        backup_manifest = read(destination / 'backup_manifest.json')
        rollback = read(destination / 'rollback_plan.json')
        tests = read(destination / 'test_results.json')
        if proof.get('status') != 'PASS' or not backup_manifest.get('verified') or not rollback.get('verified'):
            raise AlignmentBlocked('Disposable/backup/rollback gates not all verified')
        if tests.get('total_fail') != 0 or tests.get('total_pass', 0) < 434:
            raise AlignmentBlocked('Complete regression suite not proven')
        if sha(destination / 'backup_data.json') != backup_manifest['file_sha256']:
            raise AlignmentBlocked('Backup file corrupted')
        if rollback['backup_file_sha256'] != backup_manifest['file_sha256']:
            raise AlignmentBlocked('Rollback proof does not cover this backup')
        if backup_manifest['canonical_sha256'] != bundle['canonical_file_sha256']:
            raise AlignmentBlocked('Canonical source changed since backup')
        if (backup_manifest.get('operator_contract') != OPERATOR_CONTRACT
                or backup_manifest.get('clinics') != scopes
                or rollback.get('clinics') != scopes
                or backup_manifest.get('audit_manifest_sha256') != bundle['audit_manifest_sha256']):
            raise AlignmentBlocked('Individual backup/rollback scope mismatch')
        for evidence in (proof, rollback):
            if not evidence.get('source_hashes') or any(sha(ROOT / file) != digest for file, digest in evidence['source_hashes'].items()):
                raise AlignmentBlocked('Source changed since disposable/rollback proof')
        if sha(destination / 'rollback_plan.json') != backup_manifest['rollback_plan_sha256']:
            raise AlignmentBlocked('Rollback plan checksum mismatch')
    engine = create_engine(value, isolation_level='REPEATABLE READ')
    dml = {'statements': 0, 'affected_rows': 0, 'by_entity': {}}
    def count(conn, cursor, statement, parameters, context, executemany):
        if statement.lstrip().split()[0].upper() in {'INSERT', 'UPDATE', 'DELETE'}:
            dml['statements'] += 1
            dml['affected_rows'] += max(0, cursor.rowcount)
            import re
            matched = re.match(r'\s*(INSERT\s+INTO|UPDATE|DELETE\s+FROM)\s+"?([a-zA-Z_]\w*)"?', statement, re.IGNORECASE)
            if matched:
                action = matched[1].split()[0].upper()
                entity = dml['by_entity'].setdefault(matched[2], {'inserted': 0, 'updated': 0, 'deleted': 0})
                entity[{'INSERT':'inserted','UPDATE':'updated','DELETE':'deleted'}[action]] += max(0, cursor.rowcount)
    event.listen(engine, 'after_cursor_execute', count)
    try:
        with engine.connect() as conn:
            with conn.begin():
                conn.execute(text('SET TRANSACTION READ ONLY'))
                identity = conn.execute(text('SELECT current_database(),inet_server_port()')).one()
                target = fingerprint({'host': parsed.host, 'port': parsed.port or 5432, 'database': identity[0]})
                state, plans = plan_one(conn, bundle, scopes)
                scoped_before = capture_exclusion_domain(conn, all_ids)
                excluded = scoped_hashes({str(cid): scoped_before[str(cid)] for cid in protected_ids})
        if sequence_file.exists():
            sequence = read(sequence_file)
            if (sequence.get('operator_contract') != OPERATOR_CONTRACT or sequence['target_fingerprint'] != target
                    or sequence['canonical_sha256'] != bundle['canonical_file_sha256']
                    or sequence['audit_manifest_sha256'] != bundle['audit_manifest_sha256']):
                raise AlignmentBlocked('Sequence identity/source changed')
            assert_exclusions_unchanged(sequence['snapshots'], scoped_before)
        elif args.start_sequence:
            sequence = {'operator_contract': OPERATOR_CONTRACT, 'created_at': started_at, 'target_fingerprint': target,
                'canonical_sha256': bundle['canonical_file_sha256'], 'audit_manifest_sha256': bundle['audit_manifest_sha256'],
                'snapshots': scoped_before, 'completed_clinics': []}
            write(sequence_file, sequence)
        if args.mode in ('plan', 'backup'):
            write(destination / 'production_preflight.json', {'plans': plans, 'dml': dml, 'protected_scoped_hashes': excluded, 'target_fingerprint': target})
            write(destination / 'protected_scoped_snapshot.json', {str(cid): scoped_before[str(cid)] for cid in protected_ids})
            write(destination / 'target_scoped_before.json', {str(cid): scoped_before[str(cid)] for cid in scopes})
        if args.mode == 'backup':
            write(destination / 'backup_data.json', state)
            write(destination / 'backup_manifest.json', {'created': True, 'verified': False,
                'operator_contract': OPERATOR_CONTRACT, 'created_at': started_at, 'clinic_id': args.clinic_id,
                'file': str(destination / 'backup_data.json'), 'file_sha256': sha(destination / 'backup_data.json'),
                'state_hashes': {cid: fingerprint(data) for cid, data in state.items()},
                'clinics': scopes, 'canonical_sha256': bundle['canonical_file_sha256'],
                'audit_manifest_sha256': bundle['audit_manifest_sha256'], 'target_fingerprint': target,
                'entities': list(next(iter(state.values()))), 'protected_scoped_hashes': excluded,
                'protected_scoped_snapshot_sha256': sha(destination / 'protected_scoped_snapshot.json'),
                'target_scoped_before_sha256': sha(destination / 'target_scoped_before.json'),
                'production_dml': 0, 'verification_required': 'Restore fresh production backup into owned disposable PostgreSQL; align and guarded rollback must recover exact hashes.'})
        if args.mode in ('apply', 'check'):
            if args.mode == 'check' and any(p['catalog_creates'] or p['procedure_updates'] or p['extra_ids'] or p['extra_table_ids'] for p in plans):
                raise AlignmentBlocked('Check requires a zero-change plan; it cannot align data')
        if args.mode == 'apply':
            if target != backup_manifest['target_fingerprint'] or excluded != backup_manifest.get('protected_scoped_hashes'):
                raise AlignmentBlocked('Target/excluded clinic baseline changed')
            if (sha(destination / 'protected_scoped_snapshot.json') != backup_manifest['protected_scoped_snapshot_sha256']
                    or sha(destination / 'target_scoped_before.json') != backup_manifest['target_scoped_before_sha256']):
                raise AlignmentBlocked('Scoped backup evidence corrupted')
            reviewed_scoped = {**read(destination / 'protected_scoped_snapshot.json'), **read(destination / 'target_scoped_before.json')}
            assert_exclusions_unchanged(reviewed_scoped, scoped_before)
            if {cid: fingerprint(data) for cid, data in state.items()} != backup_manifest['state_hashes']:
                raise AlignmentBlocked('Production state changed since verified backup')
        if args.mode in ('apply', 'check'):
            committed = False
            # Exactly one clinic per atomic transaction. Failure rolls it back.
            try:
                with engine.begin() as conn:
                    execution, first_after, second, scoped_after = execute_guarded_alignment(conn, bundle, plans, scoped_before, plan_one)
                    first_dml = json.loads(serialized(dml))
                committed = True
            except Exception:
                write(destination / 'operator_log.json', {'clinic_id': args.clinic_id, 'started_at': started_at,
                    'baseline': scoped_hashes(scoped_before), 'dml_attempted': dml, 'committed': False,
                    'rolled_back': True, 'validation_result': 'FAIL', 'status': 'STOPPED'})
                raise
            try:
                with engine.begin() as conn:
                    conn.execute(text('SET TRANSACTION READ ONLY'))
                    persisted, persisted_plans = plan_one(conn, bundle, scopes)
                    if fingerprint(persisted) != fingerprint(first_after) or any(p['catalog_creates'] or p['procedure_updates'] or p['extra_ids'] or p['extra_table_ids'] for p in persisted_plans):
                        raise AlignmentBlocked('Concurrent post-commit change; stop and preserve user data')
                    persisted_scoped = capture_exclusion_domain(conn, all_ids)
                    assert_exclusions_unchanged(scoped_after, persisted_scoped)
            except Exception:
                # A commit cannot be represented as a rollback. Preserve
                # intervening changes and require reviewed individual recovery.
                write(destination / 'operator_log.json', {'clinic_id': args.clinic_id, 'started_at': started_at,
                    'baseline': scoped_hashes(scoped_before), 'dml_attempted': dml, 'committed': True,
                    'rolled_back': False, 'validation_result': 'FAIL', 'status': 'POST_COMMIT_STOPPED'})
                raise
            if args.mode == 'check' and dml['statements']:
                raise AlignmentBlocked('Second standalone passage emitted DML')
            log = {'clinic_id': args.clinic_id, 'started_at': started_at, 'baseline': scoped_hashes(scoped_before),
                'backup_ref': str(destination / 'backup_data.json'), 'backup_sha256': sha(destination / 'backup_data.json') if (destination / 'backup_data.json').exists() else None,
                'rows_by_entity': dml['by_entity'], 'dml_statements': dml['statements'], 'validation_result': 'PASS',
                'second_pass_result': 'PASS', 'committed': committed, 'rolled_back': False}
            write(destination / ('operator_log.json' if args.mode == 'apply' else 'second_pass_log.json'), log)
            if args.mode == 'apply':
                sequence['snapshots'] = scoped_after
                sequence['completed_clinics'] = sorted(set([*sequence['completed_clinics'], args.clinic_id]))
                # Atomic file replacement; never rebaseline unexpected values.
                temporary = sequence_file.with_suffix('.next.json')
                write(temporary, sequence)
                temporary.replace(sequence_file)
            write(destination / ('production_execution.json' if args.mode == 'apply' else 'standalone_second_pass.json'), {'status': 'PASS', 'target_fingerprint': target,
                'clinics': execution, 'first_pass_dml': first_dml, 'second_pass_dml': 0,
                'transactions': 'One clinic; first and second passage validated atomically before commit; all other clinics protected and persisted scoped state rechecked.',
                'protected_scoped_hashes_before': excluded, 'protected_scoped_hashes_after': excluded,
                'committed': True})
            write(destination / 'clinic_results.json', execution)
            write(destination / 'production_post_state.json', first_after)
            write(destination / 'idempotency_second_pass.json', {'dml_statements': 0, 'affected_rows': 0,
                'clinics': second, 'no_catalog_creates_or_procedure_updates': True})
            write(destination / 'reference_integrity.json', {str(r['clinic_id']): r['reference_integrity'] for r in execution})
        print(json.dumps({'mode': args.mode, 'clinics': scopes, 'dml': dml,
                          'backup_created': args.mode == 'backup', 'production_committed': args.mode == 'apply'}))
    finally:
        engine.dispose()


if __name__ == '__main__':
    try:
        main()
    except AlignmentBlocked as error:
        print(json.dumps({'status': 'STOPPED', 'reason': str(error)}))
        raise SystemExit(2)
