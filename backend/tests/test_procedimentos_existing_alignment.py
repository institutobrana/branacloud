"""R2B safety proofs. Database tests require the owned disposable harness."""
import ast
import copy
import json
import os
import sys
import unittest
from pathlib import Path
from types import SimpleNamespace
from urllib.parse import urlparse
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / 'backend'))
from services.procedimentos_alignment_service import (
    AlignmentBlocked, ENTITY_TABLES, build_clinic_plan, capture_state, fingerprint,
    execute_clinic_plan, required_changes, restore_clinic_backup, tenant_hashes,
    reference_integrity, insert_row, specialty_key, symbol_valid,
    capture_exclusion_domain, scoped_fingerprint, scoped_hashes,
    assert_exclusions_unchanged, assert_expected_target_diff,
    alignment_write_barrier, execute_guarded_alignment, VOLATILE_FIELDS_EXCLUDED,
)
from scripts.alinhar_clinicas_procedimentos import load_bundle, plan_all, plan_one, validate_clinic_id, sha, write, ACK

CANONICAL = json.loads((ROOT / 'backend/seeds/procedimentos_bootstrap_canonico.json').read_text(encoding='utf-8'))
AUDIT = Path('C:/Temp/Brana/EXISTING_CLINICS_ALIGNMENT_R2A1_BRANA_EXTRA_RESOLUTION')
SCOPES = [13, 15, 16, 17, 18, 19]


class AlignmentUnitTests(unittest.TestCase):
    def setUp(self):
        self.seed = CANONICAL['tables'][0]['procedimentos'][0]
        self.symbol = {'ativo': True, 'codigo': self.seed['simbolo_grafico'], 'legacy_id': self.seed['simbolo_grafico_legacy_id']}
        self.proc = {'nome': 'Custom name', 'procedimento_generico_id': 987,
            'especialidade': self.seed['especialidade'], 'forma_cobranca': 'INTERVENCAO',
            'simbolo_grafico': self.symbol['codigo'], 'simbolo_grafico_legacy_id': self.symbol['legacy_id'],
            'tempo': 45, 'custo_lab': 100, 'mostrar_simbolo': False}

    def changes(self):
        return required_changes(self.proc, self.seed, [{'id':987}], {self.seed['especialidade']}, [self.symbol])

    def test_valid_existing_values_are_never_overwritten(self):
        self.assertEqual(self.changes(), {})

    def test_missing_fields_use_only_canonical_values(self):
        for key in ('nome', 'procedimento_generico_id', 'especialidade', 'forma_cobranca', 'simbolo_grafico', 'simbolo_grafico_legacy_id'):
            self.proc[key] = None
        self.assertEqual(set(self.changes()), {'nome','procedimento_generico_codigo','especialidade','forma_cobranca','simbolo_grafico','simbolo_grafico_legacy_id'})

    def test_zero_false_and_optionals_are_not_backfilled(self):
        self.proc.update(tempo=0, custo_lab=0, mostrar_simbolo=False, preferido=False, observacoes='')
        self.assertEqual(self.changes(), {})

    def test_specialty_zero_is_missing_and_valid_numeric_alias_is_preserved(self):
        self.assertEqual(specialty_key('000'), '')
        self.assertEqual(specialty_key('1'), '01')
        self.proc['especialidade'] = str(int(self.seed['especialidade']))
        self.assertEqual(self.changes(), {})

    def test_billing_historical_aliases_are_preserved(self):
        for alias in ('Intervenção', 'elemento / face', 'ELEMENTOFACE'):
            self.proc['forma_cobranca'] = alias
            self.assertNotIn('forma_cobranca', self.changes())

    def test_invalid_reference_is_backfilled(self):
        self.proc.update(procedimento_generico_id=-9, especialidade='00', forma_cobranca='INVALID')
        self.assertEqual(set(self.changes()), {'procedimento_generico_codigo','especialidade','forma_cobranca'})

    def test_historical_false_never_hides_valid_symbol(self):
        self.assertTrue(symbol_valid(self.proc, [self.symbol]))

    def test_ambiguous_symbol_not_chosen_by_bitmap(self):
        self.assertFalse(symbol_valid(self.proc, [self.symbol, self.symbol]))

    def test_route_has_no_implicit_table_creator_or_config_reader(self):
        source = (ROOT / 'backend/routes/procedimentos_routes.py').read_text(encoding='utf-8-sig')
        self.assertNotIn('_garantir_tabelas_clinica', source)
        self.assertNotIn('_nome_tabela_extra_clinica', source)
        tree = ast.parse(source)
        for node in ast.walk(tree):
            if isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and node.func.id in ('listar_indices','resolver_numero_indice','dados_indice_por_numero'):
                self.assertTrue(any(k.arg == 'ensure_defaults' and isinstance(k.value, ast.Constant) and k.value.value is False for k in node.keywords))

    def test_global_job_registry_no_longer_repairs_procedure_tables(self):
        tree = ast.parse((ROOT / 'backend/services/runtime_bootstrap_service.py').read_text(encoding='utf-8-sig'))
        assignment = next(n for n in tree.body if isinstance(n, ast.AnnAssign) and n.target.id == 'RUNTIME_BOOTSTRAP_JOBS')
        names = [n.elts[0].value for n in assignment.value.elts]
        for name in ('garantir_procedimentos_padrao_todas_clinicas','separar_tabela_exemplo_particular_todas_clinicas','garantir_metadados_tabela_particular'):
            self.assertNotIn(name, names)
        self.assertIn('garantir_indices_padrao_todas_clinicas', names)

    def test_scope_manifest_excludes_id1_and_id4_before_queries(self):
        bundle = {'approved_clinics': SCOPES, 'protected_clinics': [1,4]}
        for scope in (SCOPES+[1], SCOPES+[4], [15]):
            with self.assertRaises(AlignmentBlocked):
                plan_all(None, bundle, scope)

    def test_apply_and_rollback_need_explicit_authority(self):
        with self.assertRaises(AlignmentBlocked):
            execute_clinic_plan(None, {}, CANONICAL)
        with self.assertRaises(AlignmentBlocked):
            restore_clinic_backup(None, {}, '')

    def test_only_proven_presence_field_is_declared_volatile(self):
        self.assertEqual(VOLATILE_FIELDS_EXCLUDED, ('usuarios.last_seen_at',))

    def test_scoped_hash_is_order_independent_but_keeps_audit_values(self):
        snapshot = {'contract':'brana_procedimentos_scoped_guard_v1', 'schema_sha256':'fixture',
                    'specs':{'procedimento':{'fields':['id','nome','data_alteracao']}},
                    'data':{'procedimento':[{'id':2,'nome':'B','data_alteracao':None}, {'id':1,'nome':'A','data_alteracao':'old'}]}}
        before = scoped_fingerprint(snapshot)
        snapshot['data']['procedimento'].reverse()
        self.assertEqual(scoped_fingerprint(snapshot), before)
        snapshot['data']['procedimento'][0]['data_alteracao'] = 'new'
        self.assertNotEqual(scoped_fingerprint(snapshot), before)

    def test_missing_scoped_field_or_entity_fails_closed(self):
        s = {'contract':'brana_procedimentos_scoped_guard_v1','schema_sha256':'fixture',
             'specs':{'procedimento':{'fields':['id','nome']}},'data':{'procedimento':[{'id':1}]}}
        with self.assertRaises(AlignmentBlocked):
            scoped_fingerprint(s)
        s['data'] = {}
        with self.assertRaises(AlignmentBlocked):
            scoped_fingerprint(s)

    def test_single_clinic_parameter_rejects_lists_null_bool_and_unapproved_ids(self):
        bundle={'approved_clinics':SCOPES,'protected_clinics':[1,4]}
        for cid in (None,True,[13],0,1,4,999999,'13','all','*'):
            with self.subTest(cid=cid),self.assertRaises(AlignmentBlocked):
                validate_clinic_id(bundle,cid)
        for cid in SCOPES:
            validate_clinic_id(bundle,cid)

    def test_single_planner_refuses_batch_before_database(self):
        bundle={'approved_clinics':SCOPES,'protected_clinics':[1,4]}
        for scopes in ([],SCOPES,[13,13],None,'all'):
            with self.assertRaises(AlignmentBlocked):
                plan_one(None,bundle,scopes)


@unittest.skipUnless(os.getenv('BRANA_R2B_ISOLATED_URL'), 'Requires explicitly owned disposable PostgreSQL')
class AlignmentPostgreSQLTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        url = os.environ['BRANA_R2B_ISOLATED_URL']
        p = urlparse(url)
        if (p.hostname != '127.0.0.1' or p.port != 55432 or p.path != '/brana_r2b_proof'
                or os.getenv('DATABASE_URL') != url or os.getenv('BRANA_RUNTIME_PROFILE') != 'homologation'):
            raise RuntimeError('Disposable guard failed before application imports')
        from sqlalchemy import create_engine, event, text
        cls.text = staticmethod(text)
        cls.engine = create_engine(url, isolation_level='REPEATABLE READ')
        cls.dml = {'statements':0, 'rows':0}
        def count(conn, cursor, statement, parameters, context, many):
            if statement.lstrip().split()[0].upper() in {'INSERT','UPDATE','DELETE'}:
                cls.dml['statements'] += 1
                cls.dml['rows'] += max(0, cursor.rowcount)
        event.listen(cls.engine, 'after_cursor_execute', count)
        cls.bundle = load_bundle(AUDIT)
        cls.out = Path(os.environ['BRANA_R2B_ARTIFACT_DIR'])
        backup_file = os.getenv('BRANA_R2B_BACKUP_FILE')
        snapshot = json.loads((AUDIT / 'read_only_snapshot.json').read_text(encoding='utf-8'))
        source = {'procedimento_tabela':'tables','procedimento':'procedures','procedimento_generico':'generics',
                  'simbolo_grafico_catalogo':'symbols','item_auxiliar':'specialties'}
        cls.fixture = {}
        for cid in SCOPES:
            data = {table:[r for r in snapshot[source[table]] if r['clinica_id']==cid] if table in source else [] for table in ENTITY_TABLES}
            data['clinica_config'] = [{'id':cid,'nome_tabela_procedimentos':'Brana'}]
            cls.fixture[str(cid)] = data
        if backup_file:
            cls.backup_fixture = json.loads(Path(backup_file).read_text(encoding='utf-8'))
            cid = int(os.environ['BRANA_R2B_BACKUP_CLINIC_ID'])
            validate_clinic_id(cls.bundle,cid)
            if set(cls.backup_fixture) != {str(cid)}:
                raise RuntimeError('Only an individual backup is accepted')
            cls.fixture.update(cls.backup_fixture)
        with cls.engine.begin() as conn:
            if backup_file:
                # Full schema deployment adds this nullable technical column,
                # absent from the reviewed production backup. Mirror production
                # ONLY in this explicitly guarded disposable clone; never mask
                # the column in fingerprints or change the productive schema.
                expected_fields = set(cls.backup_fixture[str(cid)]['simbolo_grafico_catalogo'][0])
                actual_fields = {r[0] for r in conn.execute(text("SELECT column_name FROM information_schema.columns WHERE table_schema='public' AND table_name='simbolo_grafico_catalogo'"))}
                clone_only = actual_fields - expected_fields
                if clone_only not in (set(), {'updated_at'}) or expected_fields - actual_fields:
                    raise RuntimeError('Unexpected schema drift; no heuristic clone migration')
                if clone_only:
                    conn.execute(text('ALTER TABLE simbolo_grafico_catalogo DROP COLUMN updated_at'))
                write(cls.out / 'isolated_schema_parity.json', {'target':'brana_r2b_proof@127.0.0.1:55432',
                    'clone_only_column_removed':'simbolo_grafico_catalogo.updated_at' if clone_only else None,
                    'production_schema_changed':False,'reason':'Mirror full column set of verified production backup, preserving exact hash checks.'})
            # The reviewed tables reference the official legacy TISS fallback.
            # Schema deployment creates its table, not this runtime-only row.
            tree = ast.parse((ROOT / 'backend/routes/procedimentos_routes.py').read_text(encoding='utf-8-sig'))
            fallback = next(ast.literal_eval(n.value) for n in tree.body if isinstance(n, ast.Assign)
                            and any(isinstance(t, ast.Name) and t.id == 'TISS_TIPOS_FALLBACK' for t in n.targets))
            for row in fallback:
                insert_row(conn, 'tiss_tipo_tabela', {**row, 'reservado':True, 'ativo':True})
            for cid in [1,4,*SCOPES]:
                insert_row(conn, 'clinicas', {'id':cid,'nome':f'Disposable {cid}', 'email':f'r2b-{cid}@example.invalid',
                    'tipo_conta':'DEMO 7 dias','nome_tabela_procedimentos':'Brana','trial_ate':'2030-01-01','ativo':True})
            for table in ENTITY_TABLES:
                for cid in SCOPES:
                    for row in cls.fixture[str(cid)][table]:
                        if table == 'item_auxiliar':
                            row = {**{'exibir_anotacao_historico':False, 'desativar_paciente_sistema':False}, **row}
                        insert_row(conn, table, row)
                conn.execute(text(f"SELECT setval(pg_get_serial_sequence('{table}','id'), GREATEST(COALESCE((SELECT max(id) FROM {table}),0),1), true)"))
            # Excluded tenants have sentinel records too, not just empty hashes.
            for cid in [1,4]:
                tid = insert_row(conn,'procedimento_tabela',{'clinica_id':cid,'codigo':4,'nome':'Protected sentinel','nro_indice':255,'inativo':False,'fonte_pagadora':'particular','tipo_tiss_id':1})
                gid = insert_row(conn,'procedimento_generico',{'clinica_id':cid,'codigo':'GUARD','descricao':'Protected generic','tempo':0,'custo_lab':0,'peso':0,'mostrar_simbolo':False,'inativo':False})
                insert_row(conn,'simbolo_grafico_catalogo',{'clinica_id':cid,'codigo':f'guard-{cid}.bmp','legacy_id':90000+cid,'descricao':'Protected symbol','ativo':True})
                pid = insert_row(conn,'procedimento',{'clinica_id':cid,'tabela_id':tid,'codigo':-1,'nome':'Do not touch','tempo':77,'preco':31.5,'mostrar_simbolo':False,'preferido':False,'inativo':False,'procedimento_generico_id':gid,'simbolo_grafico':f'guard-{cid}.bmp','simbolo_grafico_legacy_id':90000+cid,'especialidade':'01','forma_cobranca':'INTERVENCAO'})
                lid = insert_row(conn,'lista_material',{'clinica_id':cid,'nome':'Protected material list','nro_indice':255})
                mid = insert_row(conn,'material',{'lista_id':lid,'codigo':'GUARD','nome':'Protected material','validade_dias':0,'preferido':False})
                insert_row(conn,'procedimento_material',{'clinica_id':cid,'procedimento_id':pid,'material_id':mid,'quantidade':1})
                insert_row(conn,'procedimento_fase',{'clinica_id':cid,'procedimento_id':pid,'descricao':'Protected phase','sequencia':1,'tempo':0})
                insert_row(conn,'usuarios',{'clinica_id':cid,'nome':'Disposable presence','email':f'guard-{cid}@example.invalid','senha_hash':os.environ['BRANA_R1B_TEST_PASSWORD'],'ativo':True,'online':False,'is_admin':False,'forcar_troca_senha':False,'setup_completed':True,'is_system_user':False})
            cls.before = capture_state(conn, SCOPES)
            cls.excluded = tenant_hashes(conn, [1,4])
            if backup_file and fingerprint({k:cls.before[k] for k in cls.backup_fixture}) != fingerprint(cls.backup_fixture):
                differences = []
                for cid in map(int,cls.backup_fixture):
                    for table in cls.fixture[str(cid)]:
                        actual = {r['id']:r for r in cls.before[str(cid)][table]}
                        for expected in cls.fixture[str(cid)][table]:
                            found = actual.get(expected['id'], {})
                            for field in set(expected) | set(found):
                                if fingerprint(expected.get(field)) != fingerprint(found.get(field)) or (field in expected) != (field in found):
                                    differences.append({'clinic':cid,'table':table,'id':expected['id'],'field':field,
                                        'expected':expected.get(field),'actual':found.get(field),
                                        'expected_type':type(expected.get(field)).__name__,'actual_type':type(found.get(field)).__name__})
                write(cls.out / 'backup_clone_diff_diagnostic.json', differences[:30])
                raise RuntimeError('Backup clone must match all original hashes before mutation; see diagnostic')
            if backup_file:
                # Other tenants are synthetic sentinels; the supplied backup
                # alone is checked byte/logically against its original fields.
                cls.fixture = copy.deepcopy(cls.before)
        cls.results = {}

    def test_01_reviewed_fixture_hashes_and_dependencies(self):
        with self.engine.begin() as conn:
            before, plans = plan_all(conn, self.bundle, SCOPES)
            self.assertEqual(len(plans),6)
            self.assertEqual(sum(len(p['extra_ids']) for p in plans),2016)
            self.assertEqual(sum(p['protected_extras_removed'] for p in plans),562)
            self.assertEqual(sum(len(p['catalog_creates']) for p in plans),47)
            self.assertEqual(sum(len(p['procedure_updates']) for p in plans),7578)

    def test_02_align_all_six_commit_and_second_transaction_zero_dml(self):
        start = dict(self.dml)
        with self.engine.begin() as conn:
            _, plans = plan_all(conn,self.bundle,SCOPES)
            result = [execute_clinic_plan(conn,p,CANONICAL,authorized=True) for p in plans]
        first = {k:self.dml[k]-start[k] for k in start}
        with self.engine.begin() as conn:
            _, plans = plan_all(conn,self.bundle,SCOPES)
            before_second = dict(self.dml)
            for p in plans:
                execute_clinic_plan(conn,p,CANONICAL,authorized=True)
            self.assertEqual(self.dml,before_second)
            self.assertEqual(tenant_hashes(conn,[1,4]),self.excluded)
        for r in result:
            self.assertEqual((r['table_count'],r['complete'],r['incomplete'],r['dangling_references']),(9,1263,0,0))
        self.results.update(clinics=result,first_dml=first,second_dml=0,excluded_unchanged=True)

    def test_03_real_get_is_read_only_even_with_no_financial_indices(self):
        from sqlalchemy.orm import Session
        from models.model_registry import import_all_models
        import_all_models()
        from routes import procedimentos_routes as route
        with Session(self.engine) as db:
            before = dict(self.dml)
            for cid in SCOPES:
                user=SimpleNamespace(clinica_id=cid)
                tables=route.listar_tabelas_procedimentos(user,db)
                self.assertEqual(len(tables),9)
                self.assertNotIn('4',[t['id'] for t in tables])
                route.listar_filtros(user,db)
            db.flush()
            self.assertEqual(self.dml,before)
        self.results.update(get_dml=0,auto_recreated_brana=False,config_dependency_active=False)

    def test_04_literal_catalogs_bind_0379_0471_and_preserve_58_81(self):
        with self.engine.begin() as conn:
            data=capture_state(conn,SCOPES)
        for state in data.values():
            generics={g['codigo']:g for g in state['procedimento_generico']}
            for number in range(200,207):
                self.assertNotEqual(generics[f'{number:04d}']['id'],generics[f'{number:05d}']['id'])
            self.assertEqual(generics['0471']['descricao'],'Restauração de resina')
            legacy={s['legacy_id'] for s in state['simbolo_grafico_catalogo']}
            self.assertTrue({58,81}.issubset(legacy))
            particular=next(t for t in state['procedimento_tabela'] if t['codigo']==7)
            proc=next(p for p in state['procedimento'] if p['tabela_id']==particular['id'] and p['codigo']==1012)
            self.assertEqual(proc['procedimento_generico_id'],generics['0471']['id'])

    def test_05_valid_optional_personalization_survives_noop(self):
        with self.engine.begin() as conn:
            cid=SCOPES[0]
            row=capture_state(conn,[cid])[str(cid)]['procedimento'][0]
            conn.execute(self.text('UPDATE procedimento SET tempo=45,custo_lab=123.45,observacoes=:v WHERE id=:id'),{'v':'Disposable customization','id':row['id']})
            _,plans=plan_all(conn,self.bundle,SCOPES)
            before=dict(self.dml)
            for p in plans:
                execute_clinic_plan(conn,p,CANONICAL,authorized=True)
            self.assertEqual(self.dml,before)
            actual=capture_state(conn,[cid])[str(cid)]['procedimento'][0]
            self.assertEqual((actual['tempo'],actual['custo_lab'],actual['observacoes']),(45,123.45,'Disposable customization'))
        # Return exactly to the verified post-state before rollback proof.
        with self.engine.begin() as conn:
            conn.execute(self.text('UPDATE procedimento SET tempo=:tempo,custo_lab=:custo_lab,observacoes=:observacoes WHERE id=:id'),row)

    def test_06_rollback_recreates_exact_backup_without_rewinding_sequences(self):
        with self.engine.begin() as conn:
            post=capture_state(conn,SCOPES)
            backups = self.fixture if os.getenv('BRANA_R2B_BACKUP_FILE') else self.before
            restored=[restore_clinic_backup(conn,backups[str(cid)],fingerprint(post[str(cid)]),authorized=True) for cid in SCOPES]
            self.assertEqual(fingerprint(capture_state(conn,SCOPES)),fingerprint(self.before))
            self.assertEqual(tenant_hashes(conn,[1,4]),self.excluded)
        self.results['rollback']=restored
        write(self.out / 'isolated_proof_details.json',self.results)

    def test_07_changed_extra_or_own_relation_blocks_before_apply(self):
        state=copy.deepcopy(self.before['13'])
        args=(CANONICAL,next(c for c in self.bundle['catalogs'] if c['clinic_id']==13),
              [e for e in self.bundle['extras'] if e['clinic_id']==13],
              [e for e in self.bundle['expected_rows'] if e['clinica_id']==13])
        extra=next(p for p in state['procedimento'] if p['id'] in {e['procedure_id'] for e in args[2]})
        extra['preco']=999
        with self.assertRaisesRegex(AlignmentBlocked,'Changed extra fingerprint'):
            build_clinic_plan(state,*args)
        extra['preco']=next(e['preco'] for e in args[3] if e['id']==extra['id'])
        state['procedimento_material']=[{'procedimento_id':extra['id']}]
        with self.assertRaisesRegex(AlignmentBlocked,'Own extra relationship'):
            build_clinic_plan(state,*args)

    def test_08_rollback_refuses_concurrent_post_state(self):
        with self.engine.begin() as conn:
            with self.assertRaisesRegex(AlignmentBlocked,'Post-state changed'):
                restore_clinic_backup(conn,self.before['13'],'incorrect',authorized=True)

    def test_09_presence_only_is_ignored_in_real_postgresql(self):
        with self.engine.connect() as conn:
            tx = conn.begin()
            try:
                before = capture_exclusion_domain(conn, [1,4])
                conn.execute(self.text('UPDATE usuarios SET last_seen_at=now() WHERE clinica_id IN (1,4)'))
                after = capture_exclusion_domain(conn, [1,4])
                assert_exclusions_unchanged(before, after)
                self.assertEqual(scoped_hashes(before), scoped_hashes(after))
            finally:
                tx.rollback()
        self.results['last_seen_isolated_test'] = 'PASS'

    def test_10_each_business_mutation_and_audit_timestamp_blocks(self):
        statements = [
            "UPDATE procedimento SET nome='Changed' WHERE clinica_id=:cid",
            'UPDATE procedimento SET procedimento_generico_id=NULL WHERE clinica_id=:cid',
            "UPDATE procedimento SET especialidade='Changed' WHERE clinica_id=:cid",
            "UPDATE procedimento SET simbolo_grafico='Changed' WHERE clinica_id=:cid",
            "UPDATE procedimento SET forma_cobranca='Changed' WHERE clinica_id=:cid",
            "UPDATE procedimento SET data_alteracao='Changed' WHERE clinica_id=:cid",
            'UPDATE procedimento_material SET quantidade=2 WHERE clinica_id=:cid',
            "UPDATE procedimento_fase SET descricao='Changed' WHERE clinica_id=:cid",
            "UPDATE procedimento_tabela SET nome='Changed' WHERE clinica_id=:cid",
            'DELETE FROM procedimento WHERE clinica_id=:cid',
            "UPDATE clinicas SET nome_tabela_procedimentos='Changed' WHERE id=:cid",
            "UPDATE simbolo_grafico_catalogo SET descricao='Changed' WHERE clinica_id=:cid",
        ]
        for cid in [1,4]:
            for sql in statements:
                with self.subTest(clinic=cid,mutation=sql), self.engine.connect() as conn:
                    tx=conn.begin()
                    try:
                        before=capture_exclusion_domain(conn,[1,4])
                        conn.execute(self.text(sql),{'cid':cid})
                        with self.assertRaisesRegex(AlignmentBlocked,'scoped domain changed'):
                            assert_exclusions_unchanged(before,capture_exclusion_domain(conn,[1,4]))
                    finally:
                        tx.rollback()
        self.results['business_mutation_block_test']='PASS'

    def test_11_positive_sql_barrier_rejects_excluded_noop_raw_and_opaque_writes(self):
        with self.engine.connect() as conn:
            tx=conn.begin()
            try:
                _,plans=plan_all(conn,self.bundle,SCOPES)
                with alignment_write_barrier(conn,plans,[1,4]):
                    for sql in ['UPDATE procedimento SET nome=nome WHERE clinica_id=1',
                                'UPDATE usuarios SET last_seen_at=now() WHERE clinica_id=1',
                                'DELETE FROM procedimento WHERE clinica_id=4',
                                'SELECT 1; UPDATE procedimento SET nome=nome WHERE clinica_id=1',
                                'SELECT 1 /* hidden command */',
                                'SELECT 1 AS id INTO unapproved_guard_write',
                                'SELECT "unreviewed_write_function"()', 'SELECT public.now()',
                                'SELECT unreviewed_write_function()', 'CREATE TABLE unapproved_guard_write(id int)']:
                        with self.subTest(sql=sql), self.assertRaises(AlignmentBlocked):
                            conn.execute(self.text(sql))
                    with self.assertRaises(AlignmentBlocked):
                        conn.exec_driver_sql('UPDATE procedimento SET nome=nome WHERE clinica_id=1')
                    with self.assertRaisesRegex(AlignmentBlocked,'SQL binds outside'):
                        conn.execute(self.text('DELETE FROM procedimento WHERE clinica_id=:cid AND id=ANY(:ids)'),
                                     {'cid':1,'ids':plans[0]['extra_ids']})
            finally:
                tx.rollback()
        self.results['positive_write_barrier']='PASS'

    def test_12_real_operator_transaction_accepts_presence_and_only_expected_delta(self):
        from services import procedimentos_alignment_service as service
        actual_execute=service.execute_clinic_plan
        seen=[]
        def presence_during(conn,plan,canonical,**kw):
            if not seen:
                # Independent legitimate presence writer; no operator auth/HTTP.
                with self.engine.begin() as other:
                    other.execute(self.text('UPDATE usuarios SET last_seen_at=now() WHERE clinica_id IN (1,4)'))
                seen.append(True)
            return actual_execute(conn,plan,canonical,**kw)
        with self.engine.connect() as conn:
            tx=conn.begin()
            try:
                _,plans=plan_all(conn,self.bundle,SCOPES)
                scoped=capture_exclusion_domain(conn,[1,4,*SCOPES])
                with patch.object(service,'execute_clinic_plan',side_effect=presence_during):
                    results,_,second,after=execute_guarded_alignment(conn,self.bundle,plans,scoped,plan_all,internal_batch=True)
                self.assertEqual(len(results),6)
                self.assertTrue(all(r['table_count']==9 and r['complete']==1263 for r in results))
                self.assertTrue(all(not r['operations'] for r in second))
                assert_exclusions_unchanged({k:scoped[k] for k in ('1','4')},{k:after[k] for k in ('1','4')})
                wrong=copy.deepcopy(after)
                wrong['13']['data']['procedimento'][0]['tempo']+=1
                with self.assertRaisesRegex(AlignmentBlocked,'Unexpected target diff'):
                    assert_expected_target_diff({str(c):scoped[str(c)] for c in SCOPES},{str(c):wrong[str(c)] for c in SCOPES},plans)
            finally:
                tx.rollback()
        self.results.update(r2b_operator_isolated_integration='PASS',last_seen_during_operation='PASS',target_expected_diff_guard='PASS')

    def test_13_concurrent_id1_mutation_fails_final_guard_and_rolls_targets_back(self):
        from services import procedimentos_alignment_service as service
        actual_execute=service.execute_clinic_plan
        seen=[]
        def mutate_excluded(conn,plan,canonical,**kw):
            result=actual_execute(conn,plan,canonical,**kw)
            if not seen:
                with self.engine.begin() as other:
                    other.execute(self.text("UPDATE procedimento SET simbolo_grafico='Unexpected concurrent symbol' WHERE clinica_id=1"))
                seen.append(True)
            return result
        try:
            with self.assertRaisesRegex(AlignmentBlocked,'Excluded clinic scoped domain changed'):
                with self.engine.begin() as conn:
                    _,plans=plan_all(conn,self.bundle,SCOPES)
                    scoped=capture_exclusion_domain(conn,[1,4,*SCOPES])
                    with patch.object(service,'execute_clinic_plan',side_effect=mutate_excluded):
                        execute_guarded_alignment(conn,self.bundle,plans,scoped,plan_all,internal_batch=True)
            with self.engine.begin() as conn:
                self.assertEqual(fingerprint(capture_state(conn,SCOPES)),fingerprint(self.before))
        finally:
            with self.engine.begin() as conn:
                conn.execute(self.text("UPDATE procedimento SET simbolo_grafico='guard-1.bmp' WHERE clinica_id=1"))
        self.results['unexpected_id1_mutation_failsafe']='PASS'

    def test_14_operator_cli_preflight_uses_scoped_guard_without_dml(self):
        import subprocess
        before=dict(self.dml)
        out=self.out/'operator_cli_readonly'
        result=subprocess.run([sys.executable,'-B','-m','backend.scripts.alinhar_clinicas_procedimentos',
            '--mode','plan','--audit-dir',str(AUDIT),'--out',str(out),'--clinic-id','13',
            '--target-url-env','BRANA_R2B_ISOLATED_URL'],cwd=str(ROOT),capture_output=True,text=True,encoding='utf-8')
        self.assertEqual(result.returncode,0,result.stderr)
        evidence=json.loads((out/'clinic_13'/'production_preflight.json').read_text(encoding='utf-8'))
        self.assertIn('protected_scoped_hashes',evidence)
        self.assertNotIn('protected_hashes',evidence)
        self.assertEqual(evidence['dml']['statements'],0)
        self.assertEqual(self.dml,before)
        self.results['operator_cli_scoped_preflight']='PASS'

    def test_15_excluded_entity_additions_and_removals_change_scoped_hash(self):
        for cid in [1,4]:
            with self.subTest(clinic=cid), self.engine.connect() as conn:
                tx=conn.begin()
                try:
                    before=capture_exclusion_domain(conn,[1,4])
                    tid=insert_row(conn,'procedimento_tabela',{'clinica_id':cid,'codigo':9999,
                        'nome':'Unexpected table','nro_indice':255,'inativo':False,
                        'fonte_pagadora':'particular','tipo_tiss_id':1})
                    with self.assertRaises(AlignmentBlocked):
                        assert_exclusions_unchanged(before,capture_exclusion_domain(conn,[1,4]))
                    before=capture_exclusion_domain(conn,[1,4])
                    pid=insert_row(conn,'procedimento',{'clinica_id':cid,'tabela_id':tid,
                        'codigo':9999,'nome':'Unexpected procedure','tempo':0,
                        'mostrar_simbolo':False,'preferido':False,'inativo':False})
                    with self.assertRaises(AlignmentBlocked):
                        assert_exclusions_unchanged(before,capture_exclusion_domain(conn,[1,4]))
                    before=capture_exclusion_domain(conn,[1,4])
                    conn.execute(self.text('DELETE FROM procedimento WHERE id=:id'),{'id':pid})
                    with self.assertRaises(AlignmentBlocked):
                        assert_exclusions_unchanged(before,capture_exclusion_domain(conn,[1,4]))
                    before=capture_exclusion_domain(conn,[1,4])
                    conn.execute(self.text('DELETE FROM procedimento_tabela WHERE id=:id'),{'id':tid})
                    with self.assertRaises(AlignmentBlocked):
                        assert_exclusions_unchanged(before,capture_exclusion_domain(conn,[1,4]))
                finally:
                    tx.rollback()
        self.results['excluded_entity_addition_removal']='PASS'

    def test_16_single_clinic_commit_isolation_and_individual_rollback(self):
        for cid in [13,15]:
            with self.engine.connect() as conn:
                tx=conn.begin()
                try:
                    before=capture_exclusion_domain(conn,[1,4,*SCOPES])
                    _,plans=plan_one(conn,self.bundle,[cid])
                    results,_,_,after=execute_guarded_alignment(conn,self.bundle,plans,before,plan_one)
                    self.assertEqual((results[0]['table_count'],results[0]['complete']),(9,1263))
                    assert_exclusions_unchanged({k:v for k,v in before.items() if k!=str(cid)},
                                               {k:v for k,v in after.items() if k!=str(cid)})
                    restore_clinic_backup(conn,self.before[str(cid)],results[0]['after_hash'],authorized=True)
                    assert_exclusions_unchanged(before,capture_exclusion_domain(conn,[1,4,*SCOPES]))
                finally:
                    tx.rollback()
        self.results['per_clinic_rollback']='PASS'
        self.results['cross_clinic_isolation']='PASS'

    def test_17_controlled_precommit_failure_rolls_one_clinic_back(self):
        from services import procedimentos_alignment_service as service
        with self.engine.connect() as conn:
            before=capture_exclusion_domain(conn,[1,4,*SCOPES])
            conn.rollback()
        with self.assertRaisesRegex(AlignmentBlocked,'Controlled validation failure'):
            with self.engine.begin() as conn:
                _,plans=plan_one(conn,self.bundle,[13])
                with patch.object(service,'assert_expected_target_diff',side_effect=AlignmentBlocked('Controlled validation failure')):
                    execute_guarded_alignment(conn,self.bundle,plans,before,plan_one)
        with self.engine.begin() as conn:
            assert_exclusions_unchanged(before,capture_exclusion_domain(conn,[1,4,*SCOPES]))
        self.results['per_clinic_transaction_failure_rollback']='PASS'

    def test_18_cli_forbidden_ids_and_batch_fail_before_connection(self):
        import subprocess
        for args in (['--clinic-id','1'],['--clinic-id','4'],['--clinic-id','999999'],
                     ['--clinic-id','0'],['--clinic-id','all'],['--clinic-id','13','15'],
                     ['--clinics','13','15']):
            result=subprocess.run([sys.executable,'-B','-m','backend.scripts.alinhar_clinicas_procedimentos',
                '--audit-dir',str(AUDIT),'--out',str(self.out/'refused'),
                '--target-url-env','NO_CONNECTION_SOURCE_EXISTS',*args],cwd=str(ROOT),capture_output=True,text=True,encoding='utf-8')
            self.assertEqual(result.returncode,2,result.stderr)
            self.assertNotIn('Explicit DATABASE_URL is required',result.stdout)
        self.results['forbidden_cli_ids']='PASS'

    def test_19_verify_individual_backup_in_owned_clone(self):
        if not os.getenv('BRANA_R2B_BACKUP_FILE'):
            self.skipTest('Individual backup verifier only')
        cid=int(os.environ['BRANA_R2B_BACKUP_CLINIC_ID'])
        verify_owned_individual_backup(self.engine,self.bundle,cid,self.out)

    @classmethod
    def tearDownClass(cls):
        cls.results['isolated_dml_totals']=dict(cls.dml)
        write(cls.out/'scoped_guard_isolated_results.json',cls.results)
        cls.engine.dispose()


def verify_owned_individual_backup(engine,bundle,cid,directory):
    """Real align/restore proof, allowed only on the explicitly owned database."""
    url=urlparse(os.environ.get('BRANA_R2B_ISOLATED_URL',''))
    if (url.hostname,url.port,url.path) != ('127.0.0.1',55432,'/brana_r2b_proof') or os.getenv('DATABASE_URL') != os.environ['BRANA_R2B_ISOLATED_URL']:
        raise RuntimeError('Owned disposable backup verification required')
    from sqlalchemy import text
    from backend.tests.r2b_isolated_alignment_runner import hashes
    directory=Path(directory)
    manifest=json.loads((directory/'backup_manifest.json').read_text(encoding='utf-8'))
    backup=json.loads((directory/'backup_data.json').read_text(encoding='utf-8'))
    if manifest['clinics'] != [cid] or set(backup)!={str(cid)} or sha(directory/'backup_data.json')!=manifest['file_sha256']:
        raise RuntimeError('Individual backup scope/checksum mismatch')
    with engine.begin() as conn:
        scoped_before=capture_exclusion_domain(conn,[1,4,*SCOPES])
        state,plans=plan_one(conn,bundle,[cid])
        if fingerprint(state)!=fingerprint(backup):
            raise RuntimeError('Individual clone does not match backup exactly')
        results,_,_,_=execute_guarded_alignment(conn,bundle,plans,scoped_before,plan_one)
        restored=restore_clinic_backup(conn,backup[str(cid)],results[0]['after_hash'],authorized=True)
        assert_exclusions_unchanged(scoped_before,capture_exclusion_domain(conn,[1,4,*SCOPES]))
        if restored['restored_hash']!=manifest['state_hashes'][str(cid)]:
            raise RuntimeError('Individual rollback hash mismatch')
    proof={'verified':True,'backup_file_sha256':manifest['file_sha256'],'clinics':[cid],
        'proof':[restored],'source_hashes':hashes(),'production_rollback_executed':False,
        'method':'Owned disposable individual clone: execute real guarded single-clinic operator, restore original PKs/values without sequence rewind, assert all eight scoped snapshots unchanged.'}
    write(directory/'rollback_plan.json',proof)
    manifest.update(verified=True,verification=proof['method'],rollback_plan_sha256=sha(directory/'rollback_plan.json'))
    write(directory/'backup_manifest.json',manifest)
    return restored


@unittest.skipUnless(os.getenv('BRANA_R4_CLI_PROOF')=='1','Requires staged owned CLI proof certificate')
class PerClinicOperatorCLIProofTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        from sqlalchemy import create_engine,text,event
        url=os.environ['BRANA_R2B_ISOLATED_URL']
        parsed=urlparse(url)
        if (parsed.hostname,parsed.port,parsed.path)!=('127.0.0.1',55432,'/brana_r2b_proof') or os.getenv('DATABASE_URL')!=url:
            raise RuntimeError('CLI proof requires owned disposable PostgreSQL')
        cls.engine=create_engine(url,isolation_level='REPEATABLE READ')
        cls.text=staticmethod(text)
        cls.bundle=load_bundle(AUDIT)
        cls.out=Path(os.environ['BRANA_R2B_ARTIFACT_DIR'])
        cls.sequence=cls.out/'per_clinic_cli_sequence'
        if cls.sequence.exists():
            raise RuntimeError('Refuse reuse of a CLI proof sequence')
        cls.dml={'statements':0,'rows':0}
        def count(conn,cursor,statement,params,context,many):
            if statement.lstrip().split()[0].upper() in {'INSERT','UPDATE','DELETE'}:
                cls.dml['statements']+=1
                cls.dml['rows']+=max(0,cursor.rowcount)
        event.listen(cls.engine,'after_cursor_execute',count)
        cls.results=[]

    def cli(self,mode,cid,*extra,expected=0):
        import subprocess
        result=subprocess.run([sys.executable,'-B','-m','backend.scripts.alinhar_clinicas_procedimentos',
            '--mode',mode,'--clinic-id',str(cid),'--audit-dir',str(AUDIT),'--out',str(self.sequence),
            '--target-url-env','BRANA_R2B_ISOLATED_URL',*extra],cwd=str(ROOT),capture_output=True,text=True,encoding='utf-8')
        self.assertEqual(result.returncode,expected,result.stdout+'\n'+result.stderr)
        return result

    def snapshot(self):
        with self.engine.begin() as conn:
            conn.execute(self.text('SET TRANSACTION READ ONLY'))
            return capture_exclusion_domain(conn,[1,4,*SCOPES])

    def test_01_six_real_cli_commits_individual_backup_restore_and_zero_dml_replay(self):
        initial=self.snapshot()
        for index,cid in enumerate(SCOPES):
            before=self.snapshot()
            self.cli('backup',cid,*(['--start-sequence'] if index==0 else []))
            directory=self.sequence/f'clinic_{cid}'
            restored=verify_owned_individual_backup(self.engine,self.bundle,cid,directory)
            for name in ('isolated_proof.json','test_results.json'):
                write(directory/name,json.loads((self.out/name).read_text(encoding='utf-8')))
            self.cli('apply',cid,'--ack',ACK)
            execution=json.loads((directory/'production_execution.json').read_text(encoding='utf-8'))
            self.assertTrue(execution['committed'])
            self.assertEqual(len(execution['clinics']),1)
            row=execution['clinics'][0]
            self.assertEqual((row['clinic_id'],row['table_count'],row['complete'],row['incomplete'],row['dangling_references']),(cid,9,1263,0,0))
            after=self.snapshot()
            assert_exclusions_unchanged({k:v for k,v in before.items() if k!=str(cid)},
                                       {k:v for k,v in after.items() if k!=str(cid)})
            self.cli('check',cid)
            replay=json.loads((directory/'second_pass_log.json').read_text(encoding='utf-8'))
            self.assertEqual(replay['dml_statements'],0)
            assert_exclusions_unchanged(after,self.snapshot())
            self.results.append({'clinic_id':cid,'result':row,'backup_verified':True,'rollback':restored,
                'first_pass_dml':execution['first_pass_dml'],'second_pass_dml':replay['dml_statements'],
                'other_seven_clinics_unchanged':True})
            if index==0:
                # A real independent presence writer between stages is benign.
                with self.engine.begin() as conn:
                    conn.execute(self.text('UPDATE usuarios SET last_seen_at=now() WHERE clinica_id=1'))
                assert_exclusions_unchanged(after,self.snapshot())
                # A real business change blocks the NEXT clinic before DML.
                with self.engine.begin() as conn:
                    conn.execute(self.text("UPDATE procedimento SET simbolo_grafico='Unexpected' WHERE clinica_id=1"))
                blocked=self.cli('backup',15,expected=2)
                self.assertIn('scoped domain changed',blocked.stdout)
                self.assertFalse((self.sequence/'clinic_15'/'backup_manifest.json').exists())
                with self.engine.begin() as conn:
                    conn.execute(self.text("UPDATE procedimento SET simbolo_grafico='guard-1.bmp' WHERE clinica_id=1"))
                assert_exclusions_unchanged(after,self.snapshot())
        final=self.snapshot()
        assert_exclusions_unchanged({k:initial[k] for k in ('1','4')},{k:final[k] for k in ('1','4')})
        with self.engine.begin() as conn:
            self.assertEqual(conn.execute(self.text('SELECT count(*) FROM procedimento_tabela WHERE clinica_id=ANY(:ids)'),{'ids':SCOPES}).scalar_one(),54)
            self.assertEqual(conn.execute(self.text('SELECT count(*) FROM procedimento WHERE clinica_id=ANY(:ids)'),{'ids':SCOPES}).scalar_one(),7578)
            self.assertEqual(conn.execute(self.text('SELECT count(*) FROM procedimento_tabela WHERE clinica_id=ANY(:ids) AND codigo=4'),{'ids':SCOPES}).scalar_one(),0)
        write(self.out/'per_clinic_cli_results.json',{'status':'PASS','clinics':self.results,
            'six_sequential_commits':True,'cross_clinic_writes':0,'second_pass_dml':0,
            'presence_between_stages':'PASS','business_change_blocks_next_stage':'PASS','id1_id4_unchanged':True})

    def test_02_cli_cannot_overwrite_backup_or_reset_sequence(self):
        before=self.snapshot()
        for mode,extra in [('backup',[]),('backup',['--start-sequence'])]:
            refused=self.cli(mode,13,*extra,expected=2)
            self.assertTrue('overwrite' in refused.stdout or 'replace/start' in refused.stdout)
        assert_exclusions_unchanged(before,self.snapshot())

    @classmethod
    def tearDownClass(cls):
        write(cls.out/'cli_parent_verification_dml.json',cls.dml)
        cls.engine.dispose()
