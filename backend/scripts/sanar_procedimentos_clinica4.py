"""Historical ID4 backfill only; never imported by normal domain/bootstrap.

Explicit connection, immutable scoped backup, isolated proof, positive SQL
allowlist and exact before/expected-after guards are mandatory for apply.
No catalog creation, normal save hooks, phase copying or optional-field writes.
"""
from __future__ import annotations

import argparse
import copy
import json
import os
import sys
from collections import Counter
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path

from dotenv import dotenv_values
from sqlalchemy import create_engine, event, text
from sqlalchemy.engine import make_url

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / 'backend'))
from services.procedimentos_alignment_service import (
    AlignmentBlocked, capture_state, capture_exclusion_domain, scoped_hashes,
    scoped_fingerprint, fingerprint, assert_exclusions_unchanged, specialty_key,
    symbol_valid, VALID_BILLING, required_changes, reference_integrity,
)
from scripts.alinhar_clinicas_procedimentos import read, write, sha

CLINIC_ID = 4  # Migration authorization only, not a normal domain exception.
ACK = 'BRANA_ID4_HISTORICAL_BACKFILL_REVIEWED_BACKUP_AND_ISOLATED_PROOF'
CONTRACT = 'id4_historical_neutral_backfill_v1'
FIELDS = {'procedimento_generico_id', 'especialidade', 'simbolo_grafico',
          'simbolo_grafico_legacy_id', 'forma_cobranca'}
SOURCES = ['backend/scripts/sanar_procedimentos_clinica4.py',
           'backend/services/procedimentos_alignment_service.py',
           'backend/tests/test_procedimentos_id4_exception.py',
           'backend/tests/r2c_isolated_id4_runner.py']


def source_hashes():
    return {p: sha(ROOT / p) for p in SOURCES}


def validate_scope(cid):
    if type(cid) is not int or cid != CLINIC_ID:
        raise AlignmentBlocked('Only the historical ID4 authorization is allowed')


def required_audit(data):
    generics = {g['id'] for g in data['procedimento_generico']}
    specialties = {specialty_key(s['codigo']) for s in data['item_auxiliar']
                   if str(s['tipo']).lower() == 'especialidade' and not s['inativo']}
    counts = Counter(); incomplete = []
    for p in data['procedimento']:
        v = p.get('procedimento_generico_id'); s = specialty_key(p.get('especialidade'))
        b = str(p.get('forma_cobranca') or '').strip()
        status = {'name': 'OK' if str(p.get('nome') or '').strip() else 'MISSING',
                  'generic': 'MISSING' if v is None else 'OK' if v in generics else 'INVALID',
                  'specialty': 'MISSING' if not s else 'OK' if s in specialties else 'INVALID',
                  'symbol': 'MISSING' if not p.get('simbolo_grafico') and not p.get('simbolo_grafico_legacy_id') else 'OK' if symbol_valid(p, data['simbolo_grafico_catalogo']) else 'INVALID',
                  'billing': 'MISSING' if not b else 'OK' if b.upper() in VALID_BILLING else 'INVALID'}
        for f, result in status.items(): counts[result.lower() + '_' + f] += 1
        if any(v != 'OK' for v in status.values()):
            incomplete.append({'id': p['id'], 'codigo': p['codigo'], 'nome': p['nome'], 'status': status})
    return {'total': len(data['procedimento']), 'complete': len(data['procedimento']) - len(incomplete),
            'incomplete': len(incomplete), 'missing': {f: counts['missing_' + f] for f in ('name','generic','specialty','symbol','billing')},
            'invalid': {f: counts['invalid_' + f] for f in ('name','generic','specialty','symbol','billing')}, 'records': incomplete}


def build_plan(data):
    validate_scope(data['clinica_config'][0]['id'])
    if any(p['clinica_id'] != CLINIC_ID for p in data['procedimento']):
        raise AlignmentBlocked('Cross-tenant procedure in snapshot')
    audit = required_audit(data)
    if audit['missing']['name']:
        raise AlignmentBlocked('Missing Name: no invented names authorized')
    catalog = []
    for g in data['procedimento_generico']:
        materials = sum(r['procedimento_generico_id'] == g['id'] for r in data['procedimento_generico_material'])
        phases = sum(r['procedimento_generico_id'] == g['id'] for r in data['procedimento_generico_fase'])
        catalog.append({'id': g['id'], 'codigo': g['codigo'], 'descricao': g['descricao'],
                        'active': not g['inativo'], 'materials': materials, 'phases': phases,
                        'associations': sum(p['procedimento_generico_id'] == g['id'] for p in data['procedimento']),
                        'neutral': not g['inativo'] and not materials and not phases and bool(str(g['codigo']).strip())})
    candidates = sorted((g for g in catalog if g['neutral']), key=lambda g: g['codigo'])
    if not candidates or len({g['codigo'] for g in candidates}) != len(candidates):
        raise AlignmentBlocked('No unambiguous active neutral generic: review required')
    selected = candidates[0]
    symbols = [s for s in data['simbolo_grafico_catalogo'] if s['ativo'] and s['legacy_id'] == 10 and s['codigo'] == 'int_consulta.bmp' and str(s['descricao']).strip().casefold() == 'consulta']
    specialties = [s for s in data['item_auxiliar'] if str(s['tipo']).lower() == 'especialidade' and not s['inativo'] and specialty_key(s['codigo']) == '05' and str(s['descricao']).strip().casefold() == 'gerais']
    if len(symbols) != 1 or len(specialties) != 1 or 'INTERVENCAO' not in VALID_BILLING:
        raise AlignmentBlocked('Consulta/Gerais/Intervencao defaults missing or ambiguous')
    seed = {'procedimento_generico_codigo': selected['codigo'], 'especialidade': specialties[0]['codigo'],
            'simbolo_grafico': symbols[0]['codigo'], 'simbolo_grafico_legacy_id': symbols[0]['legacy_id'], 'forma_cobranca': 'INTERVENCAO'}
    specialty_set = {specialty_key(s['codigo']) for s in data['item_auxiliar'] if str(s['tipo']).lower() == 'especialidade' and not s['inativo']}
    updates = []; totals = Counter()
    for p in data['procedimento']:
        changes = required_changes(p, seed, data['procedimento_generico'], specialty_set, data['simbolo_grafico_catalogo'])
        if 'procedimento_generico_codigo' in changes:
            changes['procedimento_generico_id'] = selected['id']; del changes['procedimento_generico_codigo']
        if not set(changes) <= FIELDS: raise AlignmentBlocked('Non-required field in plan')
        if changes:
            updates.append({'id': p['id'], 'changes': changes})
            for f in changes: totals[f] += 1
    return {'contract': CONTRACT, 'clinic_id': CLINIC_ID, 'selected': selected,
            'selection_reason': 'Active tenant-owned zero-material/zero-phase generic; smallest literal code, not visual order. Name/other generic attributes do not propagate.',
            'catalog': catalog, 'before_audit': audit, 'updates': updates, 'field_counts': dict(totals),
            'table_count': len(data['procedimento_tabela']), 'procedure_count': len(data['procedimento'])}


def projected_scope(before, plan):
    expected = copy.deepcopy(before)
    by_id = {p['id']: p for p in expected['data']['procedimento']}
    for op in plan['updates']: by_id[op['id']].update(op['changes'])
    expected['hash'] = scoped_fingerprint(expected)
    return expected


@contextmanager
def write_barrier(conn, plan):
    allowed = Counter()
    for op in plan['updates']:
        keys = sorted(op['changes']); sql = 'UPDATE procedimento SET ' + ','.join(f'{k}=:{k}' for k in keys) + ' WHERE id=:pid AND clinica_id=:cid'
        binds = {**op['changes'], 'pid': op['id'], 'cid': CLINIC_ID}
        allowed[(sql, fingerprint(binds))] += 1
    def guard(connection, cursor, statement, parameters, context, many):
        # This narrow section emits UPDATEs only. No SELECT, function, comment,
        # multi-statement or raw-driver escape is part of the write contract.
        if (statement.lstrip().split()[0].upper() != 'UPDATE'
                or any(token in statement for token in (';', '--', '/*', '*/'))
                or many or context.compiled is None
                or len(context.compiled_parameters) != 1):
            raise AlignmentBlocked('Opaque/non-approved SQL refused')
        # compiled.string is dialect-rendered pyformat; compare the original
        # bound TextClause to the exact named-bind SQL in the reviewed plan.
        key = (str(context.compiled.statement), fingerprint(context.compiled_parameters[0]))
        if not allowed[key]: raise AlignmentBlocked('DML outside approved tenant/PK/values')
        allowed[key] -= 1
    event.listen(conn, 'before_cursor_execute', guard)
    try: yield
    finally: event.remove(conn, 'before_cursor_execute', guard)


def execute_backfill(conn, before, plan, *, authorized=False, before_final=None):
    if not authorized: raise AlignmentBlocked('Explicit historical backfill authorization required')
    validate_scope(plan['clinic_id'])
    ids = list(map(int, before)); other_ids = [c for c in ids if c != CLINIC_ID]
    conn.execute(text('SELECT pg_advisory_xact_lock(73126,0)'))
    for c in sorted(ids):
        conn.execute(text('SELECT id FROM clinicas WHERE id=:cid FOR UPDATE'), {'cid': c})
    conn.execute(text('SELECT id FROM procedimento WHERE clinica_id=:cid ORDER BY id FOR UPDATE'), {'cid': CLINIC_ID})
    actual = capture_exclusion_domain(conn, ids); assert_exclusions_unchanged(before, actual)
    fresh = build_plan(capture_state(conn, [CLINIC_ID])['4'])
    if fingerprint(fresh) != fingerprint(plan): raise AlignmentBlocked('Plan changed before DML')
    refs_before = reference_integrity(conn, CLINIC_ID)
    changed = 0
    with write_barrier(conn, plan):
        for op in plan['updates']:
            keys = sorted(op['changes']); sql = 'UPDATE procedimento SET ' + ','.join(f'{k}=:{k}' for k in keys) + ' WHERE id=:pid AND clinica_id=:cid'
            result = conn.execute(text(sql), {**op['changes'], 'pid': op['id'], 'cid': CLINIC_ID})
            if result.rowcount != 1: raise AlignmentBlocked('Unexpected update count')
            changed += 1
    if before_final: before_final(conn)
    after = capture_exclusion_domain(conn, ids)
    assert_exclusions_unchanged({str(c): before[str(c)] for c in other_ids}, {str(c): after[str(c)] for c in other_ids})
    if scoped_fingerprint(after['4']) != scoped_fingerprint(projected_scope(before['4'], plan)):
        raise AlignmentBlocked('Unexpected ID4 change outside exact required-field plan')
    data = capture_state(conn, [CLINIC_ID])['4']; final = required_audit(data)
    if final['incomplete'] or build_plan(data)['updates']: raise AlignmentBlocked('Completeness/idempotence failed')
    refs = reference_integrity(conn, CLINIC_ID)
    # Historical table links are outside this required-field-only authorization.
    # Preserve existing defects exactly; introduce none. Generic is an authorized
    # required reference and must resolve after backfill.
    if (refs['counts']['generic'] != 0 or any(refs['counts'][key] != value
            for key,value in refs_before['counts'].items() if key != 'generic')):
        raise AlignmentBlocked('New/unexpected dangling reference after backfill')
    return {'status': 'PASS', 'rows_updated': changed, 'field_counts': plan['field_counts'], 'after_audit': final,
            'after_scoped': after, 'references_before':refs_before, 'references': refs, 'second_pass_dml': 0}


def restore_updates(conn, before, post_hash, *, authorized=False):
    if not authorized: raise AlignmentBlocked('Explicit rollback authorization required')
    current = capture_exclusion_domain(conn, [CLINIC_ID])['4']
    if scoped_fingerprint(current) != post_hash: raise AlignmentBlocked('Rollback refuses intervening edit')
    expected = {p['id']: p for p in before['data']['procedimento']}
    for p in current['data']['procedimento']:
        changes = {f: expected[p['id']][f] for f in FIELDS if p[f] != expected[p['id']][f]}
        if changes:
            sql = 'UPDATE procedimento SET ' + ','.join(f'{f}=:{f}' for f in sorted(changes)) + ' WHERE id=:pid AND clinica_id=:cid'
            conn.execute(text(sql), {**changes, 'pid': p['id'], 'cid': CLINIC_ID})
    if scoped_fingerprint(capture_exclusion_domain(conn, [CLINIC_ID])['4']) != scoped_fingerprint(before):
        raise AlignmentBlocked('Rollback failed exact scoped restoration')


def main():
    parser = argparse.ArgumentParser(); parser.add_argument('--mode', choices=('plan','backup','apply','check'), default='plan')
    parser.add_argument('--clinic-id', type=int, required=True); parser.add_argument('--out', type=Path, required=True)
    parser.add_argument('--env-file', type=Path); parser.add_argument('--target-url-env'); parser.add_argument('--ack')
    args = parser.parse_args(); validate_scope(args.clinic_id); out = args.out.resolve()
    if out == ROOT or ROOT in out.parents: raise AlignmentBlocked('Artifacts must remain outside repo')
    if bool(args.env_file) == bool(args.target_url_env): raise AlignmentBlocked('Explicit single connection source required')
    value = dotenv_values(args.env_file).get('DATABASE_URL') if args.env_file else os.environ.get(args.target_url_env)
    if not value or make_url(value).get_backend_name() != 'postgresql': raise AlignmentBlocked('Explicit PostgreSQL required')
    if args.target_url_env and (make_url(value).host != '127.0.0.1' or make_url(value).port != 55432):
        raise AlignmentBlocked('Process URL is disposable-only')
    expected = read(out / 'before_scoped.json')
    engine = create_engine(value, isolation_level='REPEATABLE READ')
    started = datetime.now(timezone.utc).isoformat()
    try:
        with engine.begin() as conn:
            conn.execute(text('SET TRANSACTION READ ONLY'))
            ids = [r[0] for r in conn.execute(text('SELECT id FROM clinicas ORDER BY id'))]
            if set(map(str, ids)) != set(expected): raise AlignmentBlocked('Clinic inventory changed')
            before = capture_exclusion_domain(conn, ids)
            anchor = read(out / 'production_after.json')['after_scoped'] if args.mode == 'check' else expected
            assert_exclusions_unchanged(anchor, before)
            data = capture_state(conn, [CLINIC_ID])['4']; plan = build_plan(data)
            parsed = make_url(value)
            db = conn.execute(text('SELECT current_database()')).scalar_one()
            target = fingerprint({'host': parsed.host, 'port': parsed.port or 5432, 'database': db})
        if args.mode == 'plan': write(out / 'plan.json', plan); print(json.dumps({'mode':'plan','selected':plan['selected'],'updates':len(plan['updates'])})); return
        if args.mode == 'backup':
            proof = read(out / 'isolated_proof.json')
            if (proof['status'] != 'PASS' or proof['source_hashes'] != source_hashes()
                    or proof['snapshot_sha256'] != sha(out/'before_scoped.json')):
                raise AlignmentBlocked('Fresh source/snapshot-matched isolated proof required before backup')
            if (out / 'backup_manifest.json').exists(): raise AlignmentBlocked('Never overwrite a backup')
            write(out / 'backup_scoped.json', before)
            write(out / 'backup_manifest.json', {'contract':CONTRACT,'clinic_id':CLINIC_ID,'created_at':started,'file_sha256':sha(out/'backup_scoped.json'),'target_fingerprint':target,'source_hashes':source_hashes(),'before_hashes':scoped_hashes(before),'verified':False})
            print(json.dumps({'backup_created':True,'verified':False,'production_dml':0})); return
        if args.mode == 'apply':
            backup = read(out / 'backup_manifest.json'); rollback = read(out / 'rollback_plan.json'); proof = read(out / 'isolated_proof.json'); tests = read(out / 'test_results.json')
            if args.ack != ACK or not backup['verified'] or not rollback['verified'] or proof['status'] != 'PASS': raise AlignmentBlocked('ACK/backup/rollback/isolated gates required')
            if (tests['total_fail'] or tests['total_pass'] < 442 + proof['tests_run']
                    or tests['r2c_source_hashes'] != source_hashes()):
                raise AlignmentBlocked('Full baseline plus current historical-exception regression required')
            if backup['file_sha256'] != sha(out/'backup_scoped.json') or rollback['backup_sha256'] != backup['file_sha256'] or backup['target_fingerprint'] != target: raise AlignmentBlocked('Backup checksum/target mismatch')
            if backup['rollback_sha256'] != sha(out/'rollback_plan.json'): raise AlignmentBlocked('Rollback proof checksum mismatch')
            if (backup['backup_proof_sha256'] != sha(out/'backup_isolated_proof.json')
                    or proof['snapshot_sha256'] != sha(out/'before_scoped.json')):
                raise AlignmentBlocked('Verified backup/snapshot evidence checksum mismatch')
            if any(e['source_hashes'] != source_hashes() for e in (backup,rollback,proof)): raise AlignmentBlocked('Source changed since proofs')
            assert_exclusions_unchanged(read(out / 'backup_scoped.json'), before)
        elif plan['updates']: raise AlignmentBlocked('Check cannot write or align')
        with engine.connect() as conn:
            with conn.begin():
                result = execute_backfill(conn, before, plan, authorized=True)
                # Independent READ ONLY snapshot detects excluded concurrent changes
                # not visible through this transaction's REPEATABLE READ image.
                with engine.connect() as fresh:
                    with fresh.begin():
                        fresh.execute(text('SET TRANSACTION READ ONLY'))
                        # Our ID4 writes are still uncommitted and invisible here.
                        # Comparing ALL tenants also detects concurrent ID4
                        # catalog/material/phase insertions outside locked rows.
                        assert_exclusions_unchanged(before, capture_exclusion_domain(fresh,ids))
            result.update(committed=args.mode=='apply',clinic_id=CLINIC_ID,started_at=started,backup_sha256=sha(out/'backup_scoped.json'))
        write(out / ('production_after.json' if args.mode=='apply' else 'second_pass.json'), result)
        print(json.dumps({'status':'PASS','mode':args.mode,'rows_updated':result['rows_updated'],'field_counts':result['field_counts'],'complete':result['after_audit']['complete'],'second_pass_dml':0,'committed':result['committed']}))
    finally: engine.dispose()


if __name__ == '__main__':
    try: main()
    except AlignmentBlocked as error:
        print(json.dumps({'status':'STOPPED','reason':str(error)})); raise SystemExit(2)
