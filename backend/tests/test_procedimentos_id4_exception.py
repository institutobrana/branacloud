"""Historical ID4 exception, pure and owned-PostgreSQL safety regressions."""
import copy
import json
import os
import sys
import unittest
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / 'backend'))
from scripts.sanar_procedimentos_clinica4 import (
    build_plan, required_audit, execute_backfill, restore_updates, validate_scope,
    projected_scope, source_hashes, ACK, FIELDS,
)
from scripts.alinhar_clinicas_procedimentos import read, write
from services.procedimentos_alignment_service import (
    AlignmentBlocked, capture_state, capture_exclusion_domain, assert_exclusions_unchanged,
    scoped_fingerprint, fingerprint, insert_row, ENTITY_TABLES,
)


class HistoricalID4UnitTests(unittest.TestCase):
    def setUp(self):
        self.data = {'clinica_config':[{'id':4}], 'procedimento_tabela':[{'id':50}],
            'procedimento_generico':[{'id':901,'codigo':'A','descricao':'First neutral','inativo':False},
                                      {'id':902,'codigo':'B','descricao':'Second neutral','inativo':False}],
            'procedimento_generico_material':[], 'procedimento_generico_fase':[],
            'item_auxiliar':[{'id':4,'tipo':'Especialidade','codigo':'05','descricao':'Gerais','inativo':False}],
            'simbolo_grafico_catalogo':[{'id':20,'legacy_id':10,'codigo':'int_consulta.bmp','descricao':'Consulta','ativo':True}],
            'procedimento':[{'id':40,'clinica_id':4,'nome':'Untouched','codigo':1,'tabela_id':50,
                'procedimento_generico_id':None,'especialidade':None,'simbolo_grafico':None,
                'simbolo_grafico_legacy_id':None,'forma_cobranca':None,'preco':13,'custo':0,
                'custo_lab':77,'tempo':25,'valor_repasse':9,'observacoes':'custom','mostrar_simbolo':False}]}

    def test_only_id4_can_enter_operator(self):
        for cid in (None,True,0,1,13,15,999999,'4',[4]):
            with self.subTest(cid=cid),self.assertRaises(AlignmentBlocked): validate_scope(cid)
        validate_scope(4)

    def test_first_literal_code_not_combo_order(self):
        self.data['procedimento_generico'].reverse()
        self.assertEqual(build_plan(self.data)['selected']['id'],901)

    def test_material_generic_is_not_selected(self):
        self.data['procedimento_generico_material']=[{'procedimento_generico_id':901}]
        self.assertEqual(build_plan(self.data)['selected']['id'],902)

    def test_phase_generic_is_not_selected(self):
        self.data['procedimento_generico_fase']=[{'procedimento_generico_id':901}]
        self.assertEqual(build_plan(self.data)['selected']['id'],902)

    def test_inactive_generic_is_not_selected(self):
        self.data['procedimento_generico'][0]['inativo']=True
        self.assertEqual(build_plan(self.data)['selected']['id'],902)

    def test_no_neutral_candidate_blocks(self):
        self.data['procedimento_generico_material']=[{'procedimento_generico_id':901},{'procedimento_generico_id':902}]
        with self.assertRaises(AlignmentBlocked): build_plan(self.data)

    def test_duplicate_code_blocks_deterministic_selection(self):
        self.data['procedimento_generico'][1]['codigo']='A'
        with self.assertRaises(AlignmentBlocked): build_plan(self.data)

    def test_missing_name_blocks_without_invention(self):
        for name in (None,'','   '):
            self.data['procedimento'][0]['nome']=name
            with self.assertRaises(AlignmentBlocked): build_plan(self.data)

    def test_missing_defaults_block(self):
        for entity in ('item_auxiliar','simbolo_grafico_catalogo'):
            copydata=copy.deepcopy(self.data);copydata[entity]=[]
            with self.assertRaises(AlignmentBlocked): build_plan(copydata)

    def test_valid_values_are_preserved(self):
        self.data['procedimento'][0].update(procedimento_generico_id=902,especialidade='5',
            simbolo_grafico='int_consulta.bmp',simbolo_grafico_legacy_id=10,forma_cobranca='Intervenção')
        self.assertEqual(build_plan(self.data)['updates'],[])

    def test_invalid_references_backfill_only_required(self):
        self.data['procedimento'][0].update(procedimento_generico_id=-9,especialidade='00',
            simbolo_grafico='BAD',simbolo_grafico_legacy_id=9999,forma_cobranca='BAD')
        changes=build_plan(self.data)['updates'][0]['changes']
        self.assertEqual(set(changes),FIELDS)
        self.assertEqual(changes['procedimento_generico_id'],901)

    def test_optionals_zero_false_dates_names_not_in_plan(self):
        changes=build_plan(self.data)['updates'][0]['changes']
        self.assertFalse({'nome','mostrar_simbolo','tempo','custo','custo_lab','preco','valor_repasse','observacoes','data_alteracao'} & set(changes))

    def test_partial_missing_keeps_existing_generic(self):
        self.data['procedimento'][0]['procedimento_generico_id']=902
        self.assertNotIn('procedimento_generico_id',build_plan(self.data)['updates'][0]['changes'])

    def test_no_source_mutation_by_planner(self):
        original=copy.deepcopy(self.data);build_plan(self.data);self.assertEqual(original,self.data)

    def test_generic_local_fields_do_not_propagate(self):
        self.data['procedimento_generico'][0].update(tempo=999,custo_lab=999,especialidade='14',simbolo_grafico='BAD')
        changes=build_plan(self.data)['updates'][0]['changes']
        self.assertEqual(changes['especialidade'],'05');self.assertNotIn('tempo',changes)

    def test_authority_required_before_database(self):
        with self.assertRaises(AlignmentBlocked): execute_backfill(None,{}, {})
        with self.assertRaises(AlignmentBlocked): restore_updates(None,{},'')

    def test_no_normal_domain_imports_exception(self):
        for folder in ('routes','services','seeds'):
            for file in (ROOT/'backend'/folder).glob('*.py'):
                self.assertNotIn('sanar_procedimentos_clinica4',file.read_text(encoding='utf-8-sig'))


def populate_equivalent(conn, scoped):
    """Real procedure-domain rows; private unrelated payloads use sentinels."""
    from sqlalchemy import text
    data=scoped['4']['data']
    actual={r[0] for r in conn.execute(text("SELECT column_name FROM information_schema.columns WHERE table_schema='public' AND table_name='simbolo_grafico_catalogo'"))}
    expected=set(data['simbolo_grafico_catalogo'][0]);extra=actual-expected
    if expected-actual or extra not in (set(),{'updated_at'}): raise RuntimeError('Unreviewed clone schema parity difference')
    if extra: conn.execute(text('ALTER TABLE simbolo_grafico_catalogo DROP COLUMN updated_at'))
    ids=list(map(int,scoped))
    for cid in ids:
        insert_row(conn,'clinicas',{'id':cid,'nome':f'Disposable {cid}','email':f'id4-{cid}@example.invalid','ativo':True,'tipo_conta':'DEMO 7 dias','trial_ate':'2030-01-01','nome_tabela_procedimentos':'Disposable inert',
            **(data['clinica_config'][0] if cid==4 else {})})
    order=('tiss_tipo_tabela','indice_financeiro','indice_cotacao','procedimento_tabela','procedimento_generico','simbolo_grafico_catalogo','item_auxiliar','lista_material','material','procedimento','procedimento_generico_material','procedimento_generico_fase','procedimento_material','procedimento_fase')
    for table in order:
        for row in data[table]: insert_row(conn,table,row)
        conn.execute(text(f"SELECT setval(pg_get_serial_sequence('{table}','id'), GREATEST(COALESCE((SELECT max(id) FROM {table}),0),1), true)"))
    for cid in ids:
        if cid!=4:
            insert_row(conn,'procedimento_tabela',{'clinica_id':cid,'codigo':1,'nome':'Excluded sentinel','nro_indice':1,'inativo':False,'fonte_pagadora':'particular','tipo_tiss_id':data['tiss_tipo_tabela'][0]['id']})
        insert_row(conn,'usuarios',{'clinica_id':cid,'nome':'Disposable user','email':f'guard-{cid}@example.invalid','senha_hash':os.environ['BRANA_R2C_TEST_PASSWORD'],'ativo':True,'is_admin':False,'online':False,'forcar_troca_senha':False,'setup_completed':True,'is_system_user':False})
    for row in data['pacientes__procedure_links']:
        insert_row(conn,'pacientes',{**row,'codigo':row['id'],'nome':'Disposable projected reference','inativo':False})
    return capture_exclusion_domain(conn,ids)


@unittest.skipUnless(os.getenv('BRANA_R2C_ISOLATED_URL'),'Requires owned disposable PostgreSQL')
class HistoricalID4PostgreSQLTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        from sqlalchemy import create_engine,text
        url=os.environ['BRANA_R2C_ISOLATED_URL'];p=urlparse(url)
        if (p.hostname,p.port,p.path)!=('127.0.0.1',55432,'/brana_r2c_proof') or os.environ.get('DATABASE_URL')!=url:
            raise RuntimeError('Disposable-only guard before model/application import')
        cls.engine=create_engine(url,isolation_level='REPEATABLE READ');cls.text=staticmethod(text)
        cls.out=Path(os.environ['BRANA_R2C_ARTIFACT_DIR'])
        cls.production=read(os.environ['BRANA_R2C_SNAPSHOT'])
        with cls.engine.begin() as conn:
            cls.before=populate_equivalent(conn,cls.production)
            cls.data=capture_state(conn,[4])['4'];cls.plan=build_plan(cls.data)
            for entity in ENTITY_TABLES+('lista_material','material','indice_financeiro','indice_cotacao','tiss_tipo_tabela'):
                if fingerprint(cls.before['4']['data'][entity])!=fingerprint(cls.production['4']['data'][entity]):
                    raise RuntimeError('Snapshot domain row parity failed: '+entity)
        write(cls.out/'clone_parity.json',{'status':'PASS','procedure_domain_rows_exact':True,'private_unrelated_payloads':'synthetic sentinels; complete fixture guards protect them before/after','production_schema_changed':False})

    def test_01_equivalent_full_backfill_no_optional_or_cross_clinic_changes(self):
        with self.engine.connect() as conn:
            tx=conn.begin()
            result=execute_backfill(conn,self.before,self.plan,authorized=True)
            self.assertEqual(result['after_audit']['complete'],448);self.assertEqual(result['rows_updated'],442)
            self.assertEqual(result['field_counts'],{'procedimento_generico_id':442,'especialidade':442,'simbolo_grafico':112,'simbolo_grafico_legacy_id':112,'forma_cobranca':112})
            self.assertEqual(result['references_before']['counts']['table'],56)
            self.assertEqual(result['references']['counts']['table'],56)
            self.assertEqual(result['references']['counts']['generic'],0)
            self.assertEqual(scoped_fingerprint(result['after_scoped']['4']),scoped_fingerprint(projected_scope(self.before['4'],self.plan)))
            write(self.out/'first_run.json',result);tx.rollback()
        with self.engine.begin() as conn:assert_exclusions_unchanged(self.before,capture_exclusion_domain(conn,list(map(int,self.before))))

    def test_02_second_pass_zero_and_restore_exact_backup(self):
        with self.engine.connect() as conn:
            tx=conn.begin();first=execute_backfill(conn,self.before,self.plan,authorized=True)
            second=execute_backfill(conn,first['after_scoped'],build_plan(capture_state(conn,[4])['4']),authorized=True)
            self.assertEqual(second['rows_updated'],0)
            restore_updates(conn,self.before['4'],scoped_fingerprint(first['after_scoped']['4']),authorized=True)
            assert_exclusions_unchanged(self.before,capture_exclusion_domain(conn,list(map(int,self.before))))
            write(self.out/'rollback_proof.json',{'status':'PASS','second_pass_dml':0,'restored_exactly':True,'before_hash':scoped_fingerprint(self.before['4'])});tx.rollback()

    def test_03_unexpected_optional_change_forces_atomic_rollback(self):
        with self.assertRaises(AlignmentBlocked),self.engine.begin() as conn:
            execute_backfill(conn,self.before,self.plan,authorized=True,before_final=lambda c:c.execute(self.text('UPDATE procedimento SET tempo=tempo+1 WHERE id=:id'),{'id':self.plan['updates'][0]['id']}))
        with self.engine.begin() as conn:assert_exclusions_unchanged(self.before,capture_exclusion_domain(conn,list(map(int,self.before))))

    def test_04_excluded_mutation_blocks_and_rolls_back(self):
        with self.assertRaises(AlignmentBlocked),self.engine.begin() as conn:
            execute_backfill(conn,self.before,self.plan,authorized=True,before_final=lambda c:c.execute(self.text("UPDATE procedimento_tabela SET nome='UNEXPECTED' WHERE clinica_id=1")))
        with self.engine.begin() as conn:assert_exclusions_unchanged(self.before,capture_exclusion_domain(conn,list(map(int,self.before))))

    def test_05_positive_barrier_and_rollback_no_intervening_overwrite(self):
        from scripts.sanar_procedimentos_clinica4 import write_barrier
        for sql in ('UPDATE procedimento SET tempo=0 WHERE clinica_id=4','DELETE FROM procedimento WHERE clinica_id=4','UPDATE procedimento SET especialidade=\'05\' WHERE clinica_id=1'):
            with self.assertRaises(AlignmentBlocked),self.engine.begin() as conn:
                with write_barrier(conn,self.plan):conn.execute(self.text(sql))
        with self.engine.connect() as conn:
            tx=conn.begin();result=execute_backfill(conn,self.before,self.plan,authorized=True)
            conn.execute(self.text('UPDATE procedimento SET preco=preco+1 WHERE id=:id'),{'id':self.plan['updates'][0]['id']})
            with self.assertRaises(AlignmentBlocked):restore_updates(conn,self.before['4'],scoped_fingerprint(result['after_scoped']['4']),authorized=True)
            tx.rollback()

    @classmethod
    def tearDownClass(cls):cls.engine.dispose()


if __name__=='__main__':unittest.main()
