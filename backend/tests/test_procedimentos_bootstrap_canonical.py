"""Canonical seed proofs. Pure data tests never import database or main.

PostgreSQL cases require an explicit disposable URL supplied by the R1B harness;
there is no local .env/production fallback and no server is launched.
"""
import ast
import copy
import json
import os
import unittest
from pathlib import Path
from types import SimpleNamespace
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[2]
SEEDS = ROOT / 'backend' / 'seeds'
DATA = json.loads((SEEDS / 'procedimentos_bootstrap_canonico.json').read_text(encoding='utf-8'))
EXPECTED_COUNTS = {'Particular': 112, 'Sindicato': 238, 'Bradesco': 94,
                   'Banco do Brasil': 188, 'Caixa Econ Federal': 88, 'Banespa': 32,
                   'Telebras': 101, 'Petrobras': 174, 'CNCC': 236}


def seed_literal(file, variable):
    tree = ast.parse((SEEDS / file).read_text(encoding='utf-8-sig'))
    rows = next(ast.literal_eval(n.value) for n in tree.body if isinstance(n, ast.Assign)
                and any(isinstance(t, ast.Name) and t.id == variable for t in n.targets))
    for n in tree.body:
        if isinstance(n, ast.Expr) and isinstance(n.value, ast.Call):
            call = n.value
            if (isinstance(call.func, ast.Attribute) and call.func.attr == 'extend'
                    and isinstance(call.func.value, ast.Name) and call.func.value.id == variable):
                rows.extend(ast.literal_eval(call.args[0]))
    return rows


class CanonicalDataTests(unittest.TestCase):
    def test_01_exact_nine_tables_and_1263_unique_keys(self):
        self.assertEqual(len(DATA['tables']), 9)
        actual = {t['nome']: len(t['procedimentos']) for t in DATA['tables']}
        self.assertEqual(actual, EXPECTED_COUNTS)
        keys = [(t['seed_key'], p['codigo']) for t in DATA['tables'] for p in t['procedimentos']]
        self.assertEqual(len(keys), 1263)
        self.assertEqual(len(set(keys)), 1263)

    def test_02_brana_is_not_a_procedure_table(self):
        self.assertNotIn('Brana', EXPECTED_COUNTS)
        self.assertNotIn(4, [t['codigo'] for t in DATA['tables']])

    def test_03_all_required_fields_are_explicit(self):
        for t in DATA['tables']:
            for p in t['procedimentos']:
                with self.subTest(table=t['nome'], code=p['codigo']):
                    self.assertTrue(p['nome'].strip())
                    self.assertRegex(p['procedimento_generico_codigo'], r'^\d{4,5}$')
                    self.assertRegex(p['especialidade'], r'^\d{2}$')
                    self.assertTrue(p['simbolo_grafico'])
                    self.assertGreater(p['simbolo_grafico_legacy_id'], 0)
                    self.assertIn(p['forma_cobranca'], {'INTERVENCAO', 'ELEMENTO_FACE'})

    def test_04_seven_originals_distinct_from_hof(self):
        rows = seed_literal('procedimentos_genericos.py', 'PROCEDIMENTOS_GENERICOS_PADRAO')
        catalog = {r['codigo']: r['descricao'] for r in rows}
        self.assertEqual(len(rows), len(catalog))
        self.assertEqual(len(catalog), 598)
        for code in range(200, 207):
            own, hof = f'{code:04d}', f'{code:05d}'
            self.assertIn(own, catalog); self.assertIn(hof, catalog)
            self.assertNotEqual(catalog[own], catalog[hof])

    def test_05_0379_and_0471_bind_existing_literal_identities(self):
        tables = {t['nome']: {p['codigo']: p for p in t['procedimentos']} for t in DATA['tables']}
        self.assertEqual(tables['Particular'][1012]['procedimento_generico_codigo'], '0471')
        self.assertEqual(tables['Caixa Econ Federal'][5087]['procedimento_generico_codigo'], '0379')
        catalog = {r['codigo']: r['descricao'] for r in seed_literal('procedimentos_genericos.py', 'PROCEDIMENTOS_GENERICOS_PADRAO')}
        self.assertEqual(catalog['0471'], 'Restauração de resina')
        self.assertEqual(catalog['0379'], 'Raspagem')

    def test_06_symbol_58_and_81_have_semantic_identity(self):
        rows = seed_literal('simbolos_graficos.py', 'SIMBOLOS_GRAFICOS_PADRAO')
        catalog = {r['legacy_id']: r for r in rows if r['legacy_id'] is not None}
        self.assertEqual(catalog[57]['codigo'], catalog[58]['codigo'])
        self.assertEqual(catalog[18]['codigo'], catalog[81]['codigo'])
        self.assertNotEqual(catalog[57]['tipo_marca'], catalog[58]['tipo_marca'])
        self.assertEqual(catalog[81]['descricao'], 'Raspagem para arcada')
        self.assertEqual(catalog[81]['tipo_marca'], 4)

    def test_07_optionals_are_only_neutral_system_defaults(self):
        optional = DATA['optional_fields']
        for field in ('tempo', 'preco', 'custo', 'custo_lab', 'lucro_hora', 'garantia_meses', 'valor_repasse'):
            self.assertEqual(optional[field], 0)
        for field in ('preferido', 'inativo', 'mostrar_simbolo'):
            self.assertIs(optional[field], False)
        for field in ('observacoes', 'data_inclusao', 'data_alteracao'):
            self.assertIsNone(optional[field])

    def test_08_all_catalog_references_resolve_by_identity(self):
        generics = {r['codigo'] for r in seed_literal('procedimentos_genericos.py', 'PROCEDIMENTOS_GENERICOS_PADRAO')}
        symbols = {(r['legacy_id'], r['codigo']) for r in seed_literal('simbolos_graficos.py', 'SIMBOLOS_GRAFICOS_PADRAO')}
        for t in DATA['tables']:
            for p in t['procedimentos']:
                self.assertIn(p['procedimento_generico_codigo'], generics)
                self.assertIn((p['simbolo_grafico_legacy_id'], p['simbolo_grafico']), symbols)

    def test_09_signup_creates_catalogs_before_procedures(self):
        tree = ast.parse((ROOT / 'backend/services/signup_service.py').read_text(encoding='utf-8-sig'))
        fn = next(n for n in tree.body if isinstance(n, ast.FunctionDef) and n.name == 'provisionar_conta_saas')
        calls = {n.func.id: n.lineno for n in ast.walk(fn) if isinstance(n, ast.Call) and isinstance(n.func, ast.Name)}
        for name in ('garantir_especialidades_padrao_clinica', 'seed_simbolos_graficos', 'seed_procedimentos_genericos'):
            self.assertLess(calls[name], calls['seed_procedimentos'])

    def test_10_no_numeric_tenant_exceptions_in_active_procedure_bootstrap(self):
        for file in ('procedimentos_padrao.py', 'procedimentos_genericos.py', 'simbolos_graficos.py'):
            tree = ast.parse((SEEDS / file).read_text(encoding='utf-8-sig'))
            for n in ast.walk(tree):
                if isinstance(n, ast.Compare) and any(isinstance(op, (ast.Eq, ast.In)) for op in n.ops):
                    if isinstance(n.left, ast.Name) and n.left.id == 'clinica_id':
                        self.assertFalse(any(isinstance(c, ast.Constant) and isinstance(c.value, int) for c in n.comparators))

    def test_11_legacy_helper_does_not_remove_significant_zero(self):
        tree = ast.parse((ROOT / 'backend/services/procedimentos_legado_service.py').read_text(encoding='utf-8-sig'))
        fn = next(n for n in tree.body if isinstance(n, ast.FunctionDef) and n.name == '_garantir_genericos_harmonizacao_facial')
        source = ast.unparse(fn)
        self.assertNotIn('codigo[1:]', source)
        self.assertNotIn('item_antigo', source)


@unittest.skipUnless(os.getenv('BRANA_R1B_ISOLATED_URL'), 'Requires explicit disposable PostgreSQL harness')
class IsolatedBootstrapTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        target = os.environ['BRANA_R1B_ISOLATED_URL']
        parsed = urlparse(target)
        if (parsed.hostname != '127.0.0.1' or parsed.port != 55432
                or parsed.path != '/brana_r1b_proof' or os.getenv('DATABASE_URL') != target
                or os.getenv('BRANA_RUNTIME_PROFILE') != 'homologation'):
            raise RuntimeError('Refusing non-disposable target before application imports')
        import sys
        sys.path.insert(0, str(ROOT / 'backend'))
        from sqlalchemy import event, text
        from database import engine, SessionLocal
        from models.model_registry import import_all_models
        import_all_models()
        from models.procedimento import Procedimento, ProcedimentoFase, ProcedimentoMaterial
        from models.procedimento_generico import ProcedimentoGenerico, ProcedimentoGenericoFase, ProcedimentoGenericoMaterial
        from models.procedimento_tabela import ProcedimentoTabela
        from models.simbolo_grafico import SimboloGrafico
        from models.material import Material, ListaMaterial
        from services import signup_service as signup
        from seeds.procedimentos_padrao import seed_procedimentos
        from seeds.procedimentos_genericos import seed_procedimentos_genericos
        from seeds.simbolos_graficos import seed_simbolos_graficos
        cls.Session = SessionLocal
        cls.P, cls.PF, cls.PM = Procedimento, ProcedimentoFase, ProcedimentoMaterial
        cls.G, cls.GF, cls.GM = ProcedimentoGenerico, ProcedimentoGenericoFase, ProcedimentoGenericoMaterial
        cls.T, cls.S, cls.M, cls.L = ProcedimentoTabela, SimboloGrafico, Material, ListaMaterial
        cls.seed_p, cls.seed_g, cls.seed_s = staticmethod(seed_procedimentos), staticmethod(seed_procedimentos_genericos), staticmethod(seed_simbolos_graficos)
        cls.signup = signup
        cls.writes = {'dml_statements': 0, 'affected_rows': 0}
        def count(conn, cursor, statement, parameters, context, executemany):
            if statement.lstrip().split(' ', 1)[0].upper() in {'INSERT', 'UPDATE', 'DELETE'}:
                cls.writes['dml_statements'] += 1
                cls.writes['affected_rows'] += max(0, cursor.rowcount)
        event.listen(engine, 'after_cursor_execute', count)
        with engine.begin() as conn:
            cls.engine_identity = conn.execute(text('SELECT current_database(), inet_server_port()')).one()
            if cls.engine_identity[0] != 'brana_r1b_proof':
                raise RuntimeError('Unexpected database identity')
            conn.execute(text("INSERT INTO tiss_tipo_tabela(id,codigo,nome,reservado,ativo) VALUES(1,'00','Outras Tabelas',true,true) ON CONFLICT DO NOTHING"))
            conn.execute(text("SELECT setval(pg_get_serial_sequence('clinicas','id'), 100, false)"))
        from tempfile import TemporaryDirectory
        from unittest.mock import patch
        cls.storage = TemporaryDirectory(prefix='brana-r1b-test-storage-')
        cls.addClassCleanup(cls.storage.cleanup)
        cls.storage_patch = patch.object(signup, 'MODEL_STORAGE_DIR', Path(cls.storage.name))
        cls.storage_patch.start(); cls.addClassCleanup(cls.storage_patch.stop)
        cls.ids = []
        for index in range(2):
            with SessionLocal() as db:
                tenant = signup.provisionar_conta_saas(db, f'Clínica descartável R1B {index}',
                    'Operador descartável', f'r1b-{index}@example.invalid', os.environ['BRANA_R1B_TEST_PASSWORD'])
                cls.ids.append(tenant.id)
        cls.first_run = cls.snapshot(cls.ids[0])
        cls.second_tenant = cls.snapshot(cls.ids[1])
        cls.emit('isolated_first_run.json', {'first_tenant': cls.first_run, 'second_tenant': cls.second_tenant,
            'method': 'Actual provisionar_conta_saas; core seeds unmocked; only model storage redirected',
            'production_writes': 0, 'runtime_started': False, 'tenant_ids_are_generated': True})

    @classmethod
    def emit(cls, name, value):
        output = os.environ.get('BRANA_R1B_ARTIFACT_DIR')
        if output:
            target = Path(output).resolve()
            expected = Path('C:/Temp/Brana/SEEDS_BOOTSTRAP_R1B_IMPLEMENT_AND_ISOLATED_PROOF').resolve()
            if target != expected:
                raise RuntimeError('Unexpected artifact directory')
            (target / name).write_text(json.dumps(value, ensure_ascii=False, indent=2, default=list) + '\n', encoding='utf-8')

    @classmethod
    def snapshot(cls, clinic):
        with cls.Session() as db:
            tables = db.query(cls.T).filter(cls.T.clinica_id == clinic).order_by(cls.T.codigo).all()
            return {'clinic_id': clinic, 'table_count': len(tables),
                'procedure_count': db.query(cls.P).filter(cls.P.clinica_id == clinic).count(),
                'generic_count': db.query(cls.G).filter(cls.G.clinica_id == clinic).count(),
                'symbol_count': db.query(cls.S).filter(cls.S.clinica_id == clinic).count(),
                'tables': [{'code': t.codigo, 'name': t.nome,
                    'actual': db.query(cls.P).filter(cls.P.clinica_id == clinic, cls.P.tabela_id == t.id).count(),
                    'expected': EXPECTED_COUNTS.get(t.nome)} for t in tables]}

    def setUp(self):
        self.db = self.Session()
        self.addCleanup(self.db.close)
        self.cid = self.ids[0]

    def procedures(self):
        return self.db.query(self.P).filter(self.P.clinica_id == self.cid).all()

    def test_01_first_run_exact_set_and_counts(self):
        for s in (self.first_run, self.second_tenant):
            self.assertEqual(s['table_count'], 9); self.assertEqual(s['procedure_count'], 1263)
            self.assertEqual({t['name']: t['actual'] for t in s['tables']}, EXPECTED_COUNTS)
            self.assertEqual(s['generic_count'], 598)

    def test_02_all_1263_actual_required_references(self):
        generic_ids = {g.id for g in self.db.query(self.G).filter(self.G.clinica_id == self.cid).all()}
        symbols = {(s.legacy_id, s.codigo) for s in self.db.query(self.S).filter(self.S.clinica_id == self.cid, self.S.ativo.is_(True)).all()}
        from models.financeiro import ItemAuxiliar
        specialties = {e.codigo for e in self.db.query(ItemAuxiliar).filter(ItemAuxiliar.clinica_id == self.cid, ItemAuxiliar.tipo.ilike('Especialidade')).all()}
        procs = self.procedures(); self.assertEqual(len(procs), 1263)
        for p in procs:
            self.assertTrue(p.nome.strip()); self.assertIn(p.procedimento_generico_id, generic_ids)
            self.assertIn(p.especialidade, specialties)
            self.assertIn((p.simbolo_grafico_legacy_id, p.simbolo_grafico), symbols)
            self.assertIn(p.forma_cobranca, {'INTERVENCAO', 'ELEMENTO_FACE'})
        self.emit('required_fields_validation.json', {'total':1263,'complete':1263,'incomplete':0,
            'missing':dict.fromkeys(['name','generic','specialty','symbol','billing'],0),
            'invalid':dict.fromkeys(['generic','specialty','symbol','billing'],0),'same_tenant_references':True})

    def test_03_actual_values_equal_complete_approved_matrix(self):
        for t in DATA['tables']:
            actual_t = self.db.query(self.T).filter(self.T.clinica_id == self.cid, self.T.codigo == t['codigo']).one()
            actual = {p.codigo:p for p in self.db.query(self.P).filter(self.P.clinica_id == self.cid,self.P.tabela_id == actual_t.id).all()}
            generics = {g.id:g.codigo for g in self.db.query(self.G).filter(self.G.clinica_id == self.cid).all()}
            for expected in t['procedimentos']:
                p=actual[expected['codigo']]
                self.assertEqual(p.nome,expected['nome'])
                self.assertEqual(generics[p.procedimento_generico_id],expected['procedimento_generico_codigo'])
                for field in ('especialidade','simbolo_grafico','simbolo_grafico_legacy_id','forma_cobranca'):
                    self.assertEqual(getattr(p,field),expected[field])

    def test_04_actual_seven_originals_and_hof_are_distinct(self):
        catalog = {g.codigo:g for g in self.db.query(self.G).filter(self.G.clinica_id == self.cid).all()}
        records=[]
        for code in range(200,207):
            original,hof=catalog[f'{code:04d}'],catalog[f'{code:05d}']
            self.assertNotEqual(original.id,hof.id)
            self.assertFalse(original.fases); self.assertFalse(original.materiais_vinculados)
            records.append({'code':original.codigo,'name':original.descricao,'hof_code':hof.codigo,
                'distinct':True,'materials':0,'phases':0,
                'associated_procedures':self.db.query(self.P).filter(self.P.clinica_id==self.cid,self.P.procedimento_generico_id==original.id).count()})
        self.assertEqual(sum(r['associated_procedures'] for r in records),10)
        self.emit('generic_0200_0206_validation.json',{'status':'PASS','records':records})

    def test_05_0379_and_0471_existing_bindings(self):
        for table,code,generic in [('Particular',1012,'0471'),('Caixa Econ Federal',5087,'0379')]:
            t=self.db.query(self.T).filter(self.T.clinica_id==self.cid,self.T.nome==table).one()
            p=self.db.query(self.P).filter(self.P.clinica_id==self.cid,self.P.tabela_id==t.id,self.P.codigo==code).one()
            g=self.db.query(self.G).filter(self.G.clinica_id==self.cid,self.G.codigo==generic).one()
            self.assertEqual(p.procedimento_generico_id,g.id)
            self.assertFalse(g.fases);self.assertFalse(g.materiais_vinculados)
            if generic=='0471':self.assertEqual(g.descricao,'Restauração de resina')

    def test_06_actual_symbol_identities_not_collapsed(self):
        by_id={s.legacy_id:s for s in self.db.query(self.S).filter(self.S.clinica_id==self.cid).all() if s.legacy_id is not None}
        for a,b in [(57,58),(18,81)]:
            self.assertNotEqual(by_id[a].id,by_id[b].id)
            self.assertEqual(by_id[a].codigo,by_id[b].codigo)
        self.emit('symbol_58_81_validation.json',{'status':'PASS','58_present':True,'81_present':True,
            '58_distinct_from_57':True,'81_distinct_from_18':True,'bitmap_identity_not_used':True})

    def test_07_all_optional_initial_values(self):
        matrix=[]
        for field,expected in DATA['optional_fields'].items():
            values={getattr(p,field) for p in self.procedures()}
            self.assertEqual(values,{expected},field)
            matrix.append({'field':field,'expected':expected,'actual_values':list(values),'result':'PASS'})
        self.emit('optional_fields_validation.json',{'status':'PASS','procedures_checked':1263,'fields':matrix})

    def test_08_second_run_new_session_is_idempotent(self):
        before=self.snapshot(self.cid)
        writes_before=dict(self.writes)
        self.seed_g(self.db,self.cid); self.seed_s(self.db,self.cid)
        self.assertEqual(self.seed_p(self.db,self.cid),0)
        self.db.commit()
        after=self.snapshot(self.cid);self.assertEqual(before,after)
        self.assertEqual(self.writes,writes_before,'Reapplication must not write existing rows')
        from sqlalchemy import text
        duplicates={}
        for table,columns in [('procedimento_tabela','codigo'),('procedimento','tabela_id,codigo'),
                              ('procedimento_generico','codigo'),('simbolo_grafico_catalogo','legacy_id')]:
            tail=' AND legacy_id IS NOT NULL' if table=='simbolo_grafico_catalogo' else ''
            duplicates[table]=self.db.execute(text(f'SELECT count(*) FROM (SELECT {columns} FROM {table} WHERE clinica_id=:cid{tail} GROUP BY {columns} HAVING count(*)>1) d'),{'cid':self.cid}).scalar_one()
        self.assertEqual(set(duplicates.values()),{0})
        duplicates['symbol_assets_without_legacy']=self.db.execute(text("SELECT count(*) FROM (SELECT lower(codigo) FROM simbolo_grafico_catalogo WHERE clinica_id=:cid AND legacy_id IS NULL GROUP BY lower(codigo) HAVING count(*)>1) d"),{'cid':self.cid}).scalar_one()
        self.assertEqual(duplicates['symbol_assets_without_legacy'],0)
        self.emit('isolated_second_run.json',{'before':before,'after':after,'duplicates':duplicates,'status':'PASS','new_session':True,'dml_statements':0})

    def test_09_two_tenants_resolve_independent_local_pks(self):
        self.assertNotEqual(self.ids[0],self.ids[1])
        for cid in self.ids:
            ids={g.id for g in self.db.query(self.G).filter(self.G.clinica_id==cid).all()}
            self.assertTrue(all(p.procedimento_generico_id in ids for p in self.db.query(self.P).filter(self.P.clinica_id==cid).all()))

    def test_10_all_seed_rows_pass_actual_r2_backend_validator(self):
        from routes import procedimentos_routes as api
        for p in self.procedures():
            payload=api.ProcedimentoPayload(codigo=p.codigo,nome=p.nome,
                procedimento_generico_id=p.procedimento_generico_id,especialidade=p.especialidade,
                simbolo_grafico=p.simbolo_grafico,simbolo_grafico_legacy_id=p.simbolo_grafico_legacy_id,
                forma_cobranca=p.forma_cobranca)
            api._validar_campos_edicao(self.db,self.cid,payload)

    def test_11_initial_association_copies_only_phases_and_repeat_preserves(self):
        p=self.procedures()[0]
        generic=self.db.query(self.G).filter(self.G.id==p.procedimento_generico_id).one()
        self.db.add(self.GF(clinica_id=self.cid,procedimento_generico_id=generic.id,
            codigo='R1B-F1',descricao='Fase descartável',sequencia=1,tempo=7))
        old_code,old_table=p.codigo,p.tabela_id
        self.db.delete(p);self.db.flush();self.db.expire(generic,['fases'])
        self.assertEqual(self.seed_p(self.db,self.cid),1);self.db.flush()
        new=self.db.query(self.P).filter(self.P.clinica_id==self.cid,self.P.codigo==old_code,self.P.tabela_id==old_table).one()
        phases=self.db.query(self.PF).filter(self.PF.procedimento_id==new.id).all()
        self.assertEqual([f.codigo for f in phases],['R1B-F1'])
        self.assertEqual(new.tempo,0);self.assertEqual(new.custo_lab,0)
        self.assertFalse(new.materiais_vinculados)
        self.db.info.clear();self.assertEqual(self.seed_p(self.db,self.cid),0)
        self.assertEqual(self.db.query(self.PF).filter(self.PF.procedimento_id==new.id).count(),1)
        self.db.rollback()

    def test_12_materials_are_dynamic_and_not_materialized(self):
        from services.vinculos_materiais import compor_materiais_vinculados_procedimento
        p=self.procedures()[0]
        lista=self.db.query(self.L).filter(self.L.clinica_id==self.cid).first()
        a=self.M(lista_id=lista.id,codigo='R1B-A',nome='Material descartável A',preco=2,custo=3)
        b=self.M(lista_id=lista.id,codigo='R1B-B',nome='Material descartável B',preco=4,custo=5)
        self.db.add_all([a,b]);self.db.flush()
        self.db.add(self.PM(clinica_id=self.cid,procedimento_id=p.id,material_id=a.id,quantidade=10))
        for mat in (a,b):self.db.add(self.GM(clinica_id=self.cid,procedimento_generico_id=p.procedimento_generico_id,material_id=mat.id,quantidade=2))
        self.db.flush()
        effective=compor_materiais_vinculados_procedimento(self.db,p)
        self.assertEqual(len(effective['itens']),2)
        effective_own=next(item for item in effective['itens'] if item['material_id']==a.id)
        self.assertEqual(effective_own['quantidade'],10)
        own=self.db.query(self.PM).filter(self.PM.procedimento_id==p.id).all()
        self.assertEqual(len(own),1);self.assertEqual(own[0].quantidade,10)
        self.db.info.clear();self.seed_p(self.db,self.cid)
        self.assertEqual(self.db.query(self.PM).filter(self.PM.procedimento_id==p.id).count(),1)
        self.db.rollback()

    def test_13_missing_reference_rejects_without_zero_alias(self):
        from seeds.procedimentos_padrao import _campos_obrigatorios_bootstrap, _referencias_bootstrap
        refs=_referencias_bootstrap(self.db,self.cid)
        del refs['genericos']['0200']
        row=next(p for t in DATA['tables'] for p in t['procedimentos'] if p['procedimento_generico_codigo']=='0200')
        with self.assertRaises(ValueError):_campos_obrigatorios_bootstrap(row,refs)
        self.assertIn('00200',refs['genericos'])

    def test_14_contextual_combo_keeps_63_and_no_show_symbol_flag(self):
        from routes import cadastros_routes as api
        rows=api.listar_simbolos_graficos(q='',scope='procedimentos-combo',current_user=SimpleNamespace(clinica_id=self.cid),db=self.db)
        self.assertEqual(len(rows),63)
        self.assertIn(58,{r['legacy_id'] for r in rows})

    def test_15_missing_reference_rolls_back_actual_signup(self):
        from models.clinica import Clinica
        from unittest.mock import patch
        before=self.db.query(Clinica).count()
        def missing_generic(db,clinic):
            self.seed_g(db,clinic)
            db.query(self.G).filter(self.G.clinica_id==clinic,self.G.codigo=='0200').delete()
            db.flush()
        with self.Session() as db, patch.object(self.signup,'seed_procedimentos_genericos',side_effect=missing_generic):
            with self.assertRaises(ValueError):
                self.signup.provisionar_conta_saas(db,'Tenant descartável incompleto','Operador',
                    'invalid-r1b@example.invalid',os.environ['BRANA_R1B_TEST_PASSWORD'])
        self.db.expire_all()
        self.assertEqual(self.db.query(Clinica).count(),before)
        self.assertEqual(self.db.query(self.P).count(),2526)

    def test_16_first_run_does_not_materialize_generic_materials(self):
        self.assertEqual(self.db.query(self.PM).filter(self.PM.clinica_id==self.cid).count(),0)
        self.assertEqual(self.db.query(self.PF).filter(self.PF.clinica_id==self.cid).count(),0)

    def test_17_ambiguous_symbol_reference_fails_instead_of_guessing(self):
        from seeds.procedimentos_padrao import _referencias_bootstrap
        s=self.db.query(self.S).filter(self.S.clinica_id==self.cid,self.S.legacy_id==58).one()
        self.db.add(self.S(clinica_id=self.cid,legacy_id=s.legacy_id,codigo=s.codigo,
            descricao='Duplicata descartável',ativo=True))
        self.db.flush()
        with self.assertRaises(ValueError):_referencias_bootstrap(self.db,self.cid)
        self.db.rollback()

    def test_z_no_overwrite_after_personalization_and_new_session(self):
        p=self.procedures()[0];t=self.db.query(self.T).filter(self.T.id==p.tabela_id).one()
        g=self.db.query(self.G).filter(self.G.clinica_id==self.cid,self.G.codigo=='0471').one()
        s=self.db.query(self.S).filter(self.S.clinica_id==self.cid,self.S.legacy_id==58).one()
        p.nome='Personalização descartável';p.tempo=45;p.custo_lab=55;p.preco=123
        p.observacoes='Não repor';p.preferido=True;p.forma_cobranca='ELEMENTO_FACE'
        p.simbolo_grafico=s.codigo;p.simbolo_grafico_legacy_id=s.legacy_id
        t.nome='Tabela personalizada descartável';t.nro_indice=255
        g.descricao='Descrição personalizada descartável 0471'
        self.db.add(self.GF(clinica_id=self.cid,procedimento_generico_id=g.id,codigo='CUSTOM-G',descricao='Preservar fase do Genérico',sequencia=1,tempo=1))
        self.db.add(self.PF(clinica_id=self.cid,procedimento_id=p.id,codigo='CUSTOM-P',descricao='Preservar fase materializada',sequencia=1,tempo=1))
        ids=(p.id,t.id,g.id);self.db.commit();self.db.close()
        with self.Session() as db:
            writes_before=dict(self.writes)
            self.seed_g(db,self.cid);self.seed_s(db,self.cid);self.assertEqual(self.seed_p(db,self.cid),0);db.commit()
            self.assertEqual(self.writes,writes_before)
        with self.Session() as db:
            p,t,g=db.get(self.P,ids[0]),db.get(self.T,ids[1]),db.get(self.G,ids[2])
            self.assertEqual((p.nome,p.tempo,p.custo_lab,p.preco,p.observacoes,p.preferido,p.forma_cobranca,p.simbolo_grafico_legacy_id),
                ('Personalização descartável',45,55,123,'Não repor',True,'ELEMENTO_FACE',58))
            self.assertEqual(t.nome,'Tabela personalizada descartável');self.assertEqual(t.nro_indice,255)
            self.assertEqual(g.descricao,'Descrição personalizada descartável 0471')
            self.assertEqual([f.codigo for f in g.fases],['CUSTOM-G'])
            self.assertEqual([f.codigo for f in p.fases_vinculadas],['CUSTOM-P'])
            self.emit('isolated_no_overwrite.json',{'status':'PASS','new_session':True,
                'preserved_fields':['name','time','lab','price','notes','preferred','billing','valid_symbol','table_name','table_index','0471_description','generic_phases','procedure_phases'],
                '0471_new_entity_created':False,'production_writes':0})

    @classmethod
    def tearDownClass(cls):
        cls.emit('isolated_write_accounting.json',dict(cls.writes,unit='observed ORM/SQL DML statements and affected rows; schema preparation logged separately',production=0))


if __name__ == '__main__':
    unittest.main()
