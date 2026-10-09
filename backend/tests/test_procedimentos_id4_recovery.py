"""Own-ID4 recovery proof. Other tenants contain synthetic exclusion sentinels."""
import copy
import os
import sys
import unittest
from pathlib import Path
from types import SimpleNamespace
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / 'backend'))
from scripts.recuperar_historico_procedimentos_clinica4 import (
    validate_scope, build_plan, execute_recovery, verify_second_pass,
    restore_recovery, exact_statements, NEUTRAL_CODE, NEUTRAL_NAME,
)
from scripts.alinhar_clinicas_procedimentos import read, write
from services.procedimentos_alignment_service import (
    AlignmentBlocked, capture_state, capture_exclusion_domain,
    assert_exclusions_unchanged, scoped_hashes, fingerprint, ENTITY_TABLES,
)
from services.historical_neutral_guard_service import installation_statements


class RecoveryUnitTests(unittest.TestCase):
    def test_scope_refuses_all_other_tenants_and_non_integer_inputs(self):
        for cid in (None,True,0,1,13,15,16,17,18,19,999999,'4',[4]):
            with self.subTest(cid=cid), self.assertRaises(AlignmentBlocked): validate_scope(cid)
        validate_scope(4)

    def test_explicit_authority_before_any_database_access(self):
        with self.assertRaises(AlignmentBlocked): execute_recovery(None,{}, {})
        with self.assertRaises(AlignmentBlocked): restore_recovery(None,{}, {},{})

    def test_generated_binding_is_not_code_or_tenant_wide(self):
        ddl=installation_statements(87654)
        self.assertEqual(len(ddl),5)
        self.assertTrue(all("('87654')" in s for s in ddl[2:]))
        self.assertFalse(any('00200' in s or 'clinica_id' in s for s in ddl))

    def test_invalid_generated_binding_refused(self):
        for value in (None,True,0,-1,'1; DELETE',[]):
            with self.subTest(value=value),self.assertRaises(ValueError):installation_statements(value)

    def test_source_does_not_import_id1_content_or_normal_bootstrap(self):
        source=(ROOT/'backend/scripts/recuperar_historico_procedimentos_clinica4.py').read_text(encoding='utf-8')
        for forbidden in ('ID1_TABLE','Tabela Exemplo','bootstrap_clinica','from database import','from main import'):
            self.assertNotIn(forbidden,source)

    def test_no_replace_function_or_trigger_suppression(self):
        source=(ROOT/'backend/services/historical_neutral_guard_service.py').read_text(encoding='utf-8')
        self.assertNotIn('CREATE OR REPLACE',source)
        self.assertNotIn('DISABLE TRIGGER',source)


@unittest.skipUnless(os.getenv('BRANA_R3B_ISOLATED_URL'),'Owned disposable PostgreSQL required')
class RecoveryPostgreSQLTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        from sqlalchemy import create_engine,text
        url=os.environ['BRANA_R3B_ISOLATED_URL'];p=urlparse(url)
        if (p.hostname,p.port,p.path)!=('127.0.0.1',55432,'/brana_r3b_proof') or os.environ.get('DATABASE_URL')!=url:
            raise RuntimeError('Explicit owned disposable target required before app imports')
        cls.engine=create_engine(url,isolation_level='REPEATABLE READ');cls.text=staticmethod(text)
        cls.out=Path(os.environ['BRANA_R3B_ARTIFACT_DIR'])
        own=read(os.environ['BRANA_R3B_SNAPSHOT'])
        if set(own)!={'4'}:raise RuntimeError('Repair fixture accepts exclusively own ID4 snapshot')
        from backend.tests.test_procedimentos_id4_exception import populate_equivalent
        synthetic={str(cid):{} for cid in (1,4,13,15,16,17,18,19)};synthetic['4']=own['4']
        with cls.engine.begin() as conn:
            cls.before=populate_equivalent(conn,synthetic)
            cls.data=capture_state(conn,[4])['4'];cls.plan=build_plan(cls.data)
            cls.material_id=cls.before['4']['data']['material'][0]['id']
            for entity in ENTITY_TABLES+('lista_material','material','indice_financeiro','indice_cotacao','tiss_tipo_tabela'):
                if fingerprint(cls.before['4']['data'][entity])!=fingerprint(own['4']['data'][entity]):
                    raise RuntimeError('Own snapshot row parity failed: '+entity)
        write(cls.out/'clone_parity.json',{'status':'PASS','procedure_domain_rows_exact':True,
            'exact_entities':list(ENTITY_TABLES)+['lista_material','material','indice_financeiro','indice_cotacao','tiss_tipo_tabela'],
            'private_unrelated_payloads':'Synthetic patients/users; original opaque fingerprints protected without rewriting them in production',
            'other_tenant_content':'Synthetic guard sentinels only','cross_tenant_data_used_for_repair':False})

    def setUp(self):
        self.conn=self.engine.connect();self.tx=self.conn.begin()
        self.addCleanup(self.conn.close);self.addCleanup(lambda:self.tx.rollback() if self.tx.is_active else None)

    def recover(self):
        return execute_recovery(self.conn,self.before,self.plan,authorized=True)

    def test_01_full_exact_recovery_and_all_materials_preserved(self):
        first=self.recover()
        self.assertEqual(first['final']['complete'],448)
        self.assertEqual(first['final']['materials'],1530)
        self.assertEqual(first['final']['materials_hash'],self.plan['materials_hash'])
        self.assertEqual(first['fields_updated'],{'tabela_id':56,'procedimento_generico_id':443})
        self.assertEqual(first['rows_updated'],{'procedimento':443})
        write(self.out/'first_run.json',first)

    def test_02_second_pass_is_read_only_zero_dml(self):
        first=self.recover();plan={**self.plan,'_original_snapshot':self.before['4']}
        from sqlalchemy import event
        def read_only(c,cursor,statement,params,context,many):
            if statement.lstrip().split()[0].upper() not in ('SELECT','SHOW'):
                raise AssertionError('Second pass attempted write/DDL')
        event.listen(self.conn,'before_cursor_execute',read_only)
        try:second=verify_second_pass(self.conn,first['after_scoped'],plan)
        finally:event.remove(self.conn,'before_cursor_execute',read_only)
        self.assertEqual(second['dml'],0);write(self.out/'second_pass.json',second)

    def test_03_reverse_restore_exact_original_backup(self):
        first=self.recover()
        proof=restore_recovery(self.conn,self.before,first['after_scoped'],self.plan,authorized=True)
        self.assertTrue(proof['original_restored']);write(self.out/'restore_proof.json',proof)

    def test_04_controlled_failure_atomic_rollback(self):
        self.tx.rollback()
        with self.assertRaises(AlignmentBlocked),self.engine.begin() as conn:
            execute_recovery(conn,self.before,self.plan,authorized=True,before_final=lambda c:
                c.execute(self.text('UPDATE procedimento SET tempo=tempo+1 WHERE id=:id'),{'id':self.plan['broken_ids'][0]}))
        with self.engine.begin() as conn:assert_exclusions_unchanged(self.before,capture_exclusion_domain(conn,list(map(int,self.before))))
        write(self.out/'rollback_proof.json',{'status':'PASS','restored_exactly':True,'table_generic_links_and_443_associations_atomic':True})

    def test_05_generated_table_code_own_namespace(self):
        self.assertEqual(self.plan['table_payload']['codigo'],max(t['codigo'] for t in self.data['procedimento_tabela'])+1)
        self.assertEqual(self.plan['table_payload']['nome'],'Histórico recuperado')
        self.assertFalse(self.plan['cross_tenant_data_used'])

    def test_06_literal_codes_ids_and_existing_tables_no_merge(self):
        first=self.recover();after=first['after_scoped']['4']['data']
        old={p['id']:p for p in self.data['procedimento']};new={p['id']:p for p in after['procedimento']}
        self.assertEqual(set(old),set(new))
        self.assertEqual([(p['id'],p['codigo']) for p in self.data['procedimento']],[(p['id'],p['codigo']) for p in after['procedimento']])
        for entity in ('procedimento_material','procedimento_fase','procedimento_generico_material','procedimento_generico_fase'):
            self.assertEqual(self.data[entity],after[entity])
        for t in self.data['procedimento_tabela']:self.assertIn(t,after['procedimento_tabela'])

    def test_07_read_api_normal_list_and_editor_detail_all_56(self):
        first=self.recover()
        with self.client() as client:
            result=client.get('/procedimentos?tabela_id='+str(self.plan['table_payload']['codigo']),headers=self.headers())
            self.assertEqual(result.status_code,200,result.text)
            self.assertEqual({p['id'] for p in result.json()},set(self.plan['broken_ids']))
            for pid in self.plan['broken_ids']:
                detail=client.get(f'/procedimentos/{pid}',headers=self.headers())
                self.assertEqual(detail.status_code,200,detail.text)
                self.assertEqual(detail.json()['id'],pid)
                self.assertEqual(detail.json()['tabela_id'],self.plan['table_payload']['codigo'])
            tables=client.get('/procedimentos/tabelas',headers=self.headers())
            self.assertEqual(tables.status_code,200,tables.text)
        assert_exclusions_unchanged(first['after_scoped'],capture_exclusion_domain(self.conn,list(map(int,self.before))))
        write(self.out/'visibility.json',{'status':'PASS','normal_list':56,'api_and_editor_detail':56,
            'clinical_contexts':'Respect existing table choice, active/specialty filters; no automatic selection injected'})

    def refuse_sql(self,sql,params):
        from sqlalchemy.exc import IntegrityError
        savepoint=self.conn.begin_nested()
        try:
            with self.assertRaises(IntegrityError):self.conn.execute(self.text(sql),params)
        finally:savepoint.rollback()

    def test_08_material_insert_refused(self):
        first=self.recover()
        self.refuse_sql('INSERT INTO procedimento_generico_material (clinica_id,procedimento_generico_id,material_id,quantidade) VALUES (4,:gid,:mid,1)',{'gid':first['generic_id'],'mid':self.material_id})

    def test_09_phase_insert_refused(self):
        first=self.recover()
        self.refuse_sql("INSERT INTO procedimento_generico_fase (clinica_id,procedimento_generico_id,descricao,sequencia,tempo) VALUES (4,:gid,'Forbidden',1,0)",{'gid':first['generic_id']})

    def test_10_material_repoint_update_refused(self):
        first=self.recover();row=self.data['procedimento_generico_material'][0]
        self.refuse_sql('UPDATE procedimento_generico_material SET procedimento_generico_id=:gid WHERE id=:id',{'gid':first['generic_id'],'id':row['id']})

    def test_11_phase_repoint_update_refused(self):
        first=self.recover()
        pid=self.conn.execute(self.text("INSERT INTO procedimento_generico_fase (clinica_id,procedimento_generico_id,descricao,sequencia,tempo) VALUES (4,623,'Ordinary phase',1,0) RETURNING id")).scalar_one()
        self.refuse_sql('UPDATE procedimento_generico_fase SET procedimento_generico_id=:gid WHERE id=:id',{'gid':first['generic_id'],'id':pid})

    def test_12_neutral_identity_update_refused(self):
        first=self.recover()
        self.refuse_sql("UPDATE procedimento_generico SET codigo='OTHER' WHERE id=:id",{'id':first['generic_id']})

    def test_13_neutral_delete_refused(self):
        first=self.recover()
        self.refuse_sql('DELETE FROM procedimento_generico WHERE id=:id',{'id':first['generic_id']})

    def test_14_ordinary_generic_composition_and_identity_not_blocked(self):
        self.recover()
        self.conn.execute(self.text('INSERT INTO procedimento_generico_material (clinica_id,procedimento_generico_id,material_id,quantidade) VALUES (4,623,:mid,1)'),{'mid':self.material_id})
        self.conn.execute(self.text("UPDATE procedimento_generico SET descricao='Ordinary editable' WHERE id=623"))

    def test_15_protected_material_http_refused(self):self.http_refusal('materiais')
    def test_16_protected_phase_http_refused(self):self.http_refusal('fases')
    def test_17_protected_identity_http_refused(self):self.http_refusal('descricao')
    def test_18_protected_delete_http_refused(self):
        first=self.recover()
        with self.client() as client:
            r=client.delete(f"/cadastros/procedimentos-genericos/{first['generic_id']}",headers=self.headers())
            self.assertEqual(r.status_code,400,r.text)

    def http_refusal(self,field):
        first=self.recover();payload={'codigo':NEUTRAL_CODE,'descricao':NEUTRAL_NAME}
        payload[field]=({'materiais':[{'material_id':self.material_id,'quantidade':1}],
                         'fases':[{'descricao':'Forbidden'}],'descricao':'Forbidden'})[field]
        with self.client() as client:
            r=client.put(f"/cadastros/procedimentos-genericos/{first['generic_id']}",headers=self.headers(),json=payload)
            self.assertEqual(r.status_code,400,r.text);self.assertIn('protegido',r.json()['detail'])

    def test_19_other_tenant_cannot_read_or_edit_neutral(self):
        first=self.recover()
        with self.client() as client:
            self.assertEqual(client.get(f"/cadastros/procedimentos-genericos/detalhe/{first['generic_id']}",headers=self.headers(13)).status_code,404)
            self.assertEqual(client.put(f"/cadastros/procedimentos-genericos/{first['generic_id']}",headers=self.headers(13),json={'codigo':NEUTRAL_CODE,'descricao':NEUTRAL_NAME}).status_code,404)

    def test_20_auth_and_permission_preserved(self):
        self.recover()
        with self.client() as client:
            self.assertEqual(client.get('/procedimentos',headers={'X-Fixture-Module':'procedimentos'}).status_code,401)
            self.assertEqual(client.get('/procedimentos',headers={'X-Fixture-Clinic':'4'}).status_code,403)

    def test_21_excluded_business_mutation_forces_rollback(self):
        self.tx.rollback()
        for cid in (1,13,15,16,17,18,19):
            with self.subTest(cid=cid),self.assertRaises(AlignmentBlocked),self.engine.begin() as conn:
                execute_recovery(conn,self.before,self.plan,authorized=True,before_final=lambda c:
                    c.execute(self.text("UPDATE procedimento_tabela SET nome='Unexpected' WHERE clinica_id=:cid"),{'cid':cid}))
        with self.engine.begin() as conn:assert_exclusions_unchanged(self.before,capture_exclusion_domain(conn,list(map(int,self.before))))

    def test_22_last_seen_only_does_not_false_block(self):
        self.conn.execute(self.text('UPDATE usuarios SET last_seen_at=now() WHERE clinica_id=1'))
        self.recover()

    def test_23_disabled_trigger_refused_by_semantic_guard(self):
        self.recover();self.conn.execute(self.text('ALTER TABLE procedimento_generico DISABLE TRIGGER brana_historical_neutral_identity'))
        with self.assertRaises(AlignmentBlocked):capture_exclusion_domain(self.conn,list(map(int,self.before)))

    def test_24_changed_trigger_function_refused(self):
        self.recover()
        self.conn.execute(self.text("CREATE OR REPLACE FUNCTION public.brana_historical_neutral_identity_guard() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RETURN NEW; END; $$"))
        with self.assertRaises(AlignmentBlocked):capture_exclusion_domain(self.conn,list(map(int,self.before)))

    def test_25_unreviewed_trigger_is_not_silently_accepted(self):
        self.recover()
        self.conn.execute(self.text("CREATE TRIGGER unreviewed BEFORE UPDATE ON procedimento_tabela FOR EACH ROW EXECUTE FUNCTION public.brana_historical_neutral_identity_guard('1')"))
        with self.assertRaises(AlignmentBlocked):capture_exclusion_domain(self.conn,list(map(int,self.before)))

    def test_26_positive_barrier_refuses_other_sql_or_tenant(self):
        for sql in ('UPDATE procedimento SET tempo=0 WHERE clinica_id=4','DELETE FROM procedimento WHERE clinica_id=4','UPDATE procedimento SET tabela_id=1 WHERE clinica_id=1'):
            with self.subTest(sql=sql),self.assertRaises(AlignmentBlocked):
                with exact_statements(self.conn,[]):self.conn.execute(self.text(sql))

    def test_27_occupied_neutral_code_blocks_before_dml(self):
        from services.procedimentos_alignment_service import insert_row
        insert_row(self.conn,'procedimento_generico',self.plan['generic_payload'])
        with self.assertRaises(AlignmentBlocked):build_plan(capture_state(self.conn,[4])['4'])

    def test_28_provisional_composition_change_blocks_before_dml(self):
        self.conn.execute(self.text('INSERT INTO procedimento_generico_material (clinica_id,procedimento_generico_id,material_id,quantidade) VALUES (4,623,:mid,1)'),{'mid':self.material_id})
        with self.assertRaises(AlignmentBlocked):build_plan(capture_state(self.conn,[4])['4'])

    def test_29_planner_rejects_cross_tenant_rows(self):
        data=copy.deepcopy(self.data);data['procedimento'][0]['clinica_id']=1
        with self.assertRaises(AlignmentBlocked):build_plan(data)

    def test_30_planner_never_mutates_own_input(self):
        old=copy.deepcopy(self.data);build_plan(self.data);self.assertEqual(old,self.data)

    def test_31_unknown_optional_change_blocks_reverse_restore(self):
        first=self.recover()
        self.conn.execute(self.text('UPDATE procedimento SET preco=preco+1 WHERE id=:id'),{'id':self.plan['broken_ids'][0]})
        with self.assertRaises(AlignmentBlocked):restore_recovery(self.conn,self.before,first['after_scoped'],self.plan,authorized=True)

    def test_32_other_tenant_same_code_name_is_not_sentinel(self):
        first=self.recover()
        from services.procedimentos_alignment_service import insert_row
        from services.historical_neutral_guard_service import is_protected_historical_generic
        from sqlalchemy.orm import Session
        from models.procedimento_generico import ProcedimentoGenerico
        payload={**self.plan['generic_payload'],'clinica_id':13};insert_row(self.conn,'procedimento_generico',payload)
        with Session(bind=self.conn) as db:
            other=db.query(ProcedimentoGenerico).filter_by(clinica_id=13,codigo=NEUTRAL_CODE).one()
            self.assertFalse(is_protected_historical_generic(db,other))
        self.conn.execute(self.text('INSERT INTO procedimento_generico_fase (clinica_id,procedimento_generico_id,descricao,sequencia,tempo) VALUES (13,:gid,\'Allowed\',1,0)'),{'gid':other.id})

    def test_33_unrelated_private_payload_change_still_blocks(self):
        self.tx.rollback()
        field=next(f for f in self.before['4']['specs']['pacientes__historical_payloads']['fields'] if f not in ('id','clinica_id'))
        with self.assertRaises(AlignmentBlocked),self.engine.begin() as conn:
            execute_recovery(conn,self.before,self.plan,authorized=True,before_final=lambda c:
                c.execute(self.text(f'UPDATE pacientes SET "{field}"=:payload WHERE clinica_id=4'),{'payload':'{"unexpected":true}'}))
        with self.engine.begin() as conn:assert_exclusions_unchanged(self.before,capture_exclusion_domain(conn,list(map(int,self.before))))

    def headers(self,cid=4):return {'X-Fixture-Clinic':str(cid),'X-Fixture-Module':'procedimentos'}

    def client(self):
        from fastapi import FastAPI,Header,HTTPException
        from fastapi.testclient import TestClient
        from sqlalchemy.orm import Session
        from models.model_registry import import_all_models
        import_all_models()
        from routes import cadastros_routes as cr, procedimentos_routes as pr
        app=FastAPI();app.include_router(cr.router);app.include_router(pr.router)
        def user(x_fixture_clinic:int|None=Header(default=None)):
            if x_fixture_clinic is None:raise HTTPException(401,'Missing fixture authentication')
            return SimpleNamespace(id=1,clinica_id=x_fixture_clinic)
        def permission(x_fixture_module:str|None=Header(default=None)):
            if x_fixture_module!='procedimentos':raise HTTPException(403,'Missing fixture permission')
        def database():
            with Session(bind=self.conn) as db:yield db
        app.dependency_overrides[cr.get_current_user]=user
        app.dependency_overrides[cr.get_db]=database
        app.dependency_overrides[cr.DEP_PROCEDIMENTOS.dependency]=permission
        app.dependency_overrides[pr.router.dependencies[0].dependency]=permission
        return TestClient(app)

    @classmethod
    def tearDownClass(cls):cls.engine.dispose()


if __name__=='__main__':unittest.main()
