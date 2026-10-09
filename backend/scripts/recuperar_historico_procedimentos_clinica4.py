"""Explicit ID4-only historical recovery; never a seed/HTTP startup routine.

Planner accepts ONLY ID4 data. Other tenants enter solely as exclusion guards.
Production apply requires current individual backup, isolated restore/rollback
proof, passing regressions and byte-identical implementation source hashes.
"""
from __future__ import annotations
import argparse
import copy
import os
import sys
from collections import Counter
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path
from sqlalchemy import create_engine, event, text
from sqlalchemy.engine import make_url
from dotenv import dotenv_values

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / 'backend'))
from services.procedimentos_alignment_service import (
    AlignmentBlocked, capture_state, capture_exclusion_domain, scoped_hashes,
    fingerprint, assert_exclusions_unchanged, rows, reference_integrity,
)
from services.historical_neutral_guard_service import (
    NEUTRAL_CODE, NEUTRAL_NAME, IDENTITY_FUNCTION, COMPOSITION_FUNCTION,
    TRIGGER_SPECS, installation_statements,
)
from scripts.alinhar_clinicas_procedimentos import read, write, sha

CONTRACT = 'id4_recovery_own_data_only_v1'
ACK = 'BRANA_ID4_RECOVERY_BACKUP_ISOLATED_PROOF_AND_NEUTRAL_GUARD_APPROVED'
SOURCES = ['backend/scripts/recuperar_historico_procedimentos_clinica4.py',
           'backend/scripts/sanar_procedimentos_clinica4.py',
           'backend/services/historical_neutral_guard_service.py',
           'backend/services/procedimentos_alignment_service.py',
           'backend/routes/cadastros_routes.py', 'backend/tests/test_procedimentos_id4_recovery.py',
           'backend/tests/test_procedimentos_edit_roundtrip.py',
           'backend/tests/r3b_isolated_recovery_runner.py']


def source_hashes():
    return {p: sha(ROOT / p) for p in SOURCES}


def validate_scope(clinic_id):
    if type(clinic_id) is not int or clinic_id != 4:
        raise AlignmentBlocked('Only explicit historical clinic 4 recovery is authorized')


def required_audit(data):
    # Pure existing global required-fields evaluator; no backfill/default choice.
    from scripts.sanar_procedimentos_clinica4 import required_audit as audit
    return audit(data)


def build_plan(data, original=None):
    validate_scope(data['clinica_config'][0]['id'])
    for table in ('procedimento', 'procedimento_tabela', 'procedimento_generico',
                  'procedimento_material', 'procedimento_fase'):
        if any(r['clinica_id'] != 4 for r in data[table]):
            raise AlignmentBlocked('Repair planner refuses any cross-tenant data')
    if len(data['procedimento']) != 448 or required_audit(data)['complete'] != 448:
        raise AlignmentBlocked('Current complete 448-procedure ID4 contract changed')
    tids = {t['id'] for t in data['procedimento_tabela']}
    broken = [p for p in data['procedimento'] if p['tabela_id'] not in tids]
    neutral = [g for g in data['procedimento_generico'] if g['codigo'] == NEUTRAL_CODE]
    old = [g for g in data['procedimento_generico'] if g['id'] == 623 and g['codigo'] == '00200' and g['descricao'] == 'Lipo de papada' and not g['inativo']]
    if len(old) != 1:
        raise AlignmentBlocked('Own ID4 provisional Generic identity changed')
    source_ids = sorted(p['id'] for p in data['procedimento'] if p['procedimento_generico_id'] == old[0]['id'])
    for entity in ('procedimento_generico_material', 'procedimento_generico_fase'):
        if any(r['procedimento_generico_id'] == old[0]['id'] for r in data[entity]):
            raise AlignmentBlocked('Provisional Generic acquired composition: review required')
    if original is not None:
        if (len(data['procedimento_tabela']) != 3 or broken or source_ids or len(neutral) != 1
                or neutral[0]['descricao'] != NEUTRAL_NAME or neutral[0]['inativo']):
            raise AlignmentBlocked('Second pass is not exact recovered state')
        if sum(p['procedimento_generico_id'] == neutral[0]['id'] for p in data['procedimento']) != 443:
            raise AlignmentBlocked('Neutral associations changed')
        return {**original, 'second_pass': True, 'updates': []}
    if len(data['procedimento_tabela']) != 2 or len(broken) != 56 or len(source_ids) != 443 or neutral:
        raise AlignmentBlocked('Unexpected initial recovery state or occupied neutral code')
    if len({p['codigo'] for p in broken}) != 56:
        raise AlignmentBlocked('Broken procedures collide within new recovery table')
    bids = {p['id'] for p in broken}
    links = [r for r in data['procedimento_material'] if r['procedimento_id'] in bids]
    if len(links) != 1530:
        raise AlignmentBlocked('Own 1530 material matrix changed')
    table_code = max(t['codigo'] for t in data['procedimento_tabela']) + 1
    reference_table = min(data['procedimento_tabela'], key=lambda t: (t['codigo'], t['id']))
    table_payload = {'clinica_id': 4, 'codigo': table_code, 'nome': 'Histórico recuperado',
        'nro_indice': 255, 'fonte_pagadora': 'particular', 'nro_credenciamento': None,
        'inativo': False, 'tipo_tiss_id': reference_table['tipo_tiss_id']}
    generic_payload = {'clinica_id': 4, 'codigo': NEUTRAL_CODE, 'descricao': NEUTRAL_NAME,
        'especialidade': None, 'tempo': 0, 'custo_lab': 0.0, 'peso': 0.0,
        'simbolo_grafico': None, 'mostrar_simbolo': False, 'inativo': False,
        'observacoes': None, 'data_inclusao': None, 'data_alteracao': None}
    updates = [{'id': p['id'], 'recover_table': p['id'] in bids,
                'migrate_generic': p['id'] in source_ids} for p in data['procedimento']
               if p['id'] in bids or p['id'] in source_ids]
    return {'contract': CONTRACT, 'clinic_id': 4, 'source_authority': 'Only current ID4 snapshot and global contracts',
        'cross_tenant_data_used': False, 'before_data_hash': fingerprint(data),
        'broken_ids': sorted(bids), 'generic_source_ids': source_ids, 'table_payload': table_payload,
        'generic_payload': generic_payload, 'materials_hash': fingerprint(links),
        'updates': updates, 'second_pass': False}


def sql_insert(table, payload):
    return f'INSERT INTO {table} ({",".join(payload)}) VALUES ({",".join(":"+k for k in payload)}) RETURNING id'


@contextmanager
def exact_statements(conn, operations):
    allowed = Counter((sql, fingerprint(params)) for sql, params in operations)
    def guard(connection, cursor, statement, parameters, context, many):
        if many or context.compiled is None or len(context.compiled_parameters) != 1:
            raise AlignmentBlocked('Opaque/raw/repeated historical write refused')
        key = (str(context.compiled.statement), fingerprint(context.compiled_parameters[0]))
        if not allowed[key]:
            raise AlignmentBlocked('SQL outside exact historical ID4 manifest')
        allowed[key] -= 1
    event.listen(conn, 'before_cursor_execute', guard)
    try:
        yield
        if any(allowed.values()):
            raise AlignmentBlocked('Historical manifest operation was omitted')
    finally:
        event.remove(conn, 'before_cursor_execute', guard)


def validate_exact_after(before, after, plan, table_id, generic_id):
    if before['specs'] != after['specs'] or before.get('base_schema_sha256', before['schema_sha256']) != after['base_schema_sha256']:
        raise AlignmentBlocked('Unapproved schema/constraint change')
    expected = copy.deepcopy(before['data'])
    for entity, payload, pk in (('procedimento_tabela', plan['table_payload'], table_id),
                                ('procedimento_generico', plan['generic_payload'], generic_id)):
        new = [r for r in after['data'][entity] if r['id'] == pk]
        if len(new) != 1 or new[0] != {'id': pk, **payload}:
            raise AlignmentBlocked('New generated row differs from exact payload')
        expected[entity].append(new[0]); expected[entity].sort(key=lambda r: r['id'])
    for p in expected['procedimento']:
        if p['id'] in plan['broken_ids']: p['tabela_id'] = table_id
        if p['id'] in plan['generic_source_ids']: p['procedimento_generico_id'] = generic_id
    if fingerprint(expected) != fingerprint(after['data']):
        raise AlignmentBlocked('Unplanned data, optional, material, phase or ID change')
    data = after['data']
    if required_audit(data)['complete'] != 448 or len(data['procedimento_tabela']) != 3:
        raise AlignmentBlocked('Final complete 3/448 contract failed')
    if any(p['tabela_id'] not in {t['id'] for t in data['procedimento_tabela']} for p in data['procedimento']):
        raise AlignmentBlocked('Broken table relationship remains')
    own = [r for r in data['procedimento_material'] if r['procedimento_id'] in plan['broken_ids']]
    if len(own) != 1530 or fingerprint(own) != plan['materials_hash']:
        raise AlignmentBlocked('Own material preservation failed')
    if len({(p['tabela_id'], p['codigo']) for p in data['procedimento']}) != 448:
        raise AlignmentBlocked('Final procedure code collision')
    if sum(p['tabela_id'] == table_id for p in data['procedimento']) != 56:
        raise AlignmentBlocked('Recovered count differs')
    if (sum(p['procedimento_generico_id'] == generic_id for p in data['procedimento']) != 443
            or any(p['procedimento_generico_id'] == 623 for p in data['procedimento'])
            or any(r['procedimento_generico_id'] == generic_id for entity in
                   ('procedimento_generico_material', 'procedimento_generico_fase') for r in data[entity])):
        raise AlignmentBlocked('Neutral migration/composition invariant failed')
    return {'tables': 3, 'procedures': 448, 'complete': 448, 'broken_links': 0,
            'recovered': 56, 'neutral_links': 443, 'materials': 1530,
            'materials_hash': plan['materials_hash'], 'code_collisions': 0}


def execute_recovery(conn, before, plan, *, authorized=False, before_final=None):
    if not authorized:
        raise AlignmentBlocked('Explicit historical recovery authorization required')
    validate_scope(plan['clinic_id'])
    ids = sorted(map(int, before))
    conn.execute(text('SELECT pg_advisory_xact_lock(73126,4)'))
    for table in ('clinicas', 'procedimento_tabela', 'procedimento_generico', 'procedimento',
                  'procedimento_material', 'procedimento_fase'):
        field = 'id' if table == 'clinicas' else 'clinica_id'
        conn.execute(text(f'SELECT id FROM {table} WHERE {field}=:cid ORDER BY id FOR UPDATE'), {'cid': 4}).all()
    actual = capture_exclusion_domain(conn, ids)
    assert_exclusions_unchanged(before, actual)
    data = capture_state(conn, [4])['4']
    if fingerprint(build_plan(data)) != fingerprint(plan):
        raise AlignmentBlocked('Own ID4 state/plan drifted before first DML')
    # No function can be silently replaced; the exact namespace must be free.
    if conn.execute(text('SELECT count(*) FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname=:schema AND p.proname=ANY(:names)'), {'schema':'public','names':[IDENTITY_FUNCTION,COMPOSITION_FUNCTION]}).scalar_one():
        raise AlignmentBlocked('Historical function namespace occupied')
    created = {}
    for entity, payload in (('procedimento_tabela',plan['table_payload']),('procedimento_generico',plan['generic_payload'])):
        sql = sql_insert(entity, payload)
        with exact_statements(conn, [(sql, payload)]):
            created[entity] = conn.execute(text(sql), payload).scalar_one()
    tid = created['procedimento_tabela']; gid = created['procedimento_generico']
    ddl = installation_statements(gid)
    with exact_statements(conn, [(sql,{}) for sql in ddl]):
        for sql in ddl: conn.execute(text(sql))
    operations = []
    for op in plan['updates']:
        changes = {}
        if op['recover_table']: changes['tabela_id'] = tid
        if op['migrate_generic']: changes['procedimento_generico_id'] = gid
        sql = 'UPDATE procedimento SET '+','.join(k+'=:'+k for k in changes)+' WHERE id=:id AND clinica_id=:cid'
        operations.append((sql, {**changes,'id':op['id'],'cid':4}))
    with exact_statements(conn, operations):
        for sql, params in operations:
            if conn.execute(text(sql),params).rowcount != 1:
                raise AlignmentBlocked('Unexpected historical UPDATE cardinality')
    if before_final: before_final(conn)
    after = capture_exclusion_domain(conn,ids)
    excluded = [str(cid) for cid in ids if cid != 4]
    assert_exclusions_unchanged({c:before[c] for c in excluded},{c:after[c] for c in excluded})
    final = validate_exact_after(before['4'],after['4'],plan,tid,gid)
    if reference_integrity(conn,4)['total']:
        raise AlignmentBlocked('Dangling reference after historical recovery')
    return {'status':'PASS','clinic_id':4,'table_id':tid,'generic_id':gid,'final':final,
        'rows_inserted':{'procedimento_tabela':1,'procedimento_generico':1},
        'rows_updated':{'procedimento':len(operations)},'rows_deleted':{},
        'fields_updated':{'tabela_id':56,'procedimento_generico_id':443},
        'ddl_statements':5,'after_scoped':after,'cross_tenant_writes':0}


def verify_second_pass(conn, after, plan):
    current = capture_exclusion_domain(conn,list(map(int,after)))
    assert_exclusions_unchanged(after,current)
    second = build_plan(capture_state(conn,[4])['4'],plan)
    validate_exact_after(read_only_original(after,plan),current['4'],plan,
                         next(t['id'] for t in current['4']['data']['procedimento_tabela'] if t['codigo']==plan['table_payload']['codigo']),
                         next(g['id'] for g in current['4']['data']['procedimento_generico'] if g['codigo']==NEUTRAL_CODE))
    if second['updates']:
        raise AlignmentBlocked('Second pass attempted DML')
    return {'status':'PASS','dml':0,'creates':0,'updates':0,'deletes':0,'guards':scoped_hashes(current)}


def read_only_original(after, plan):
    # Only used by second-pass validation: original before data is supplied by
    # immutable operator bundle, never reconstructed from another tenant.
    if '_original_snapshot' not in plan:
        raise AlignmentBlocked('Immutable original snapshot required for second pass')
    return plan['_original_snapshot']


def restore_recovery(conn, original, after, plan, *, authorized=False):
    if not authorized: raise AlignmentBlocked('Explicit rollback authorization required')
    current=capture_exclusion_domain(conn,list(map(int,after)))
    assert_exclusions_unchanged(after,current)
    tid=next(t['id'] for t in current['4']['data']['procedimento_tabela'] if t['codigo']==plan['table_payload']['codigo'])
    gid=next(g['id'] for g in current['4']['data']['procedimento_generico'] if g['codigo']==NEUTRAL_CODE)
    original_rows={p['id']:p for p in original['4']['data']['procedimento']}
    operations=[]
    for op in plan['updates']:
        old=original_rows[op['id']];changes={}
        if op['recover_table']: changes['tabela_id']=old['tabela_id']
        if op['migrate_generic']: changes['procedimento_generico_id']=old['procedimento_generico_id']
        sql='UPDATE procedimento SET '+','.join(k+'=:'+k for k in changes)+' WHERE id=:id AND clinica_id=:cid'
        operations.append((sql,{**changes,'id':op['id'],'cid':4}))
    for name,(table,_,_) in TRIGGER_SPECS.items(): operations.append((f'DROP TRIGGER {name} ON public.{table}',{}))
    for function in (IDENTITY_FUNCTION,COMPOSITION_FUNCTION): operations.append((f'DROP FUNCTION public.{function}()',{}))
    for table,pk in (('procedimento_generico',gid),('procedimento_tabela',tid)):
        operations.append((f'DELETE FROM {table} WHERE id=:id AND clinica_id=:cid',{'id':pk,'cid':4}))
    with exact_statements(conn,operations):
        for sql,params in operations: conn.execute(text(sql),params)
    assert_exclusions_unchanged(original,capture_exclusion_domain(conn,list(map(int,original))))
    return {'status':'PASS','original_restored':True,'material_hash':plan['materials_hash']}


def main():
    p=argparse.ArgumentParser();p.add_argument('--mode',choices=('plan','backup','apply','check'),default='plan')
    p.add_argument('--clinic-id',type=int,required=True);p.add_argument('--out',type=Path,required=True)
    p.add_argument('--env-file',type=Path);p.add_argument('--target-url-env');p.add_argument('--ack')
    args=p.parse_args();validate_scope(args.clinic_id);out=args.out.resolve()
    if out==ROOT or ROOT in out.parents: raise AlignmentBlocked('Evidence outside repo only')
    if bool(args.env_file)==bool(args.target_url_env): raise AlignmentBlocked('Explicit PostgreSQL connection source required')
    value=dotenv_values(args.env_file).get('DATABASE_URL') if args.env_file else os.environ.get(args.target_url_env)
    if not value or make_url(value).get_backend_name()!='postgresql': raise AlignmentBlocked('PostgreSQL required')
    if args.target_url_env and (make_url(value).host!='127.0.0.1' or make_url(value).port!=55432):raise AlignmentBlocked('Disposable process URL only')
    engine=create_engine(value,isolation_level='REPEATABLE READ')
    try:
        if args.mode=='check':
            result=read(out/'production_after.json');plan=read(out/'approved_plan.json')
            with engine.begin() as conn:
                conn.execute(text('SET TRANSACTION READ ONLY'))
                second=verify_second_pass(conn,result['after_scoped'],plan)
            write(out/'second_pass.json',second);print('{"status":"PASS","dml":0}');return
        with engine.begin() as conn:
            conn.execute(text('SET TRANSACTION READ ONLY'))
            ids=[r[0] for r in conn.execute(text('SELECT id FROM clinicas ORDER BY id'))]
            before=capture_exclusion_domain(conn,ids);plan=build_plan(capture_state(conn,[4])['4'])
        if args.mode in ('plan','backup'):
            if args.mode=='backup' and any((out/name).exists() for name in
                    ('backup_manifest.json','backup_scoped.json','backup_id4.json','backup_plan.json')):
                raise AlignmentBlocked('Never replace any existing individual backup file')
            write(out/('planned_snapshot.json' if args.mode=='plan' else 'backup_scoped.json'),before)
            write(out/('planned_id4.json' if args.mode=='plan' else 'backup_id4.json'),{'4':before['4']})
            write(out/('plan.json' if args.mode=='plan' else 'backup_plan.json'),plan)
            if args.mode=='backup':
                write(out/'backup_manifest.json',{'created_at':datetime.now(timezone.utc).isoformat(),'clinic_id':4,
                    'scope':'All procedure-domain rows/catalogs/configs/references; other tenants excluded guards only',
                    'file_sha256':sha(out/'backup_scoped.json'),'id4_sha256':sha(out/'backup_id4.json'),
                    'source_hashes':source_hashes(),'before_hashes':scoped_hashes(before),'verified':False})
            print('{"status":"PASS","production_dml":0}');return
        backup=read(out/'backup_manifest.json');proof=read(out/'isolated_proof.json');restore=read(out/'backup_isolated_proof.json');tests=read(out/'test_results.json')
        if args.ack!=ACK or not backup['verified'] or proof['status']!='PASS' or restore['status']!='PASS' or not restore['rollback_pass']:
            raise AlignmentBlocked('ACK/verified new backup/isolated rollback required')
        if tests['total_fail'] or tests['total_pass']<490:raise AlignmentBlocked('Full passing 490+ regression coverage required')
        for evidence in (backup,proof,restore,tests):
            if evidence['source_hashes']!=source_hashes():raise AlignmentBlocked('Implementation changed after proof')
        if (backup['file_sha256']!=sha(out/'backup_scoped.json') or backup['id4_sha256']!=sha(out/'backup_id4.json')
                or backup['backup_proof_sha256']!=sha(out/'backup_isolated_proof.json')
                or restore['snapshot_sha256']!=sha(out/'backup_id4.json')
                or proof['snapshot_sha256']!=sha(out/'id4_snapshot.json')):
            raise AlignmentBlocked('Backup/proof checksum mismatch')
        expected=read(out/'backup_scoped.json');assert_exclusions_unchanged(expected,before)
        if fingerprint(plan)!=fingerprint(read(out/'backup_plan.json')):raise AlignmentBlocked('Plan drift')
        write(out/'approved_plan.json',{**plan,'_original_snapshot':before['4']})
        started=datetime.now(timezone.utc).isoformat()
        with engine.connect() as conn:
            with conn.begin():
                result=execute_recovery(conn,before,plan,authorized=True)
                # Fresh READ ONLY connection sees before state (our DDL/DML is
                # uncommitted), catching concurrent changes invisible to RR.
                with engine.connect() as fresh:
                    with fresh.begin():
                        fresh.execute(text('SET TRANSACTION READ ONLY'))
                        assert_exclusions_unchanged(before,capture_exclusion_domain(fresh,ids))
            result.update(committed=True,started_at=started,backup_sha256=backup['file_sha256'])
        plan['_original_snapshot']=before['4']
        write(out/'approved_plan.json',plan);write(out/'production_after.json',result)
        print('{"status":"PASS","committed":true,"inserted":2,"updated":443,"deleted":0}')
    finally:engine.dispose()


if __name__=='__main__':
    try:main()
    except AlignmentBlocked as error:
        print({'status':'STOPPED','reason':str(error)});raise SystemExit(2)
