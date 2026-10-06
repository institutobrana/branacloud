"""Pure route contract tests: AST extraction, no app/.env/DB/seed imports."""
import ast
import json
import unittest
from pathlib import Path
from types import SimpleNamespace

BACKEND = Path(__file__).resolve().parents[1]
TREE = ast.parse((BACKEND / 'routes/cadastros_routes.py').read_text(encoding='utf-8-sig'))
NAMES = {'PROCEDIMENTOS_ESPECIAL_HISTORICO_10_IDS', 'PROCEDIMENTOS_COMBO_LABELS'}

class Column:
    def __init__(self, name): self.name = name
    def __eq__(self, value): return lambda row: getattr(row, self.name) == value
    def is_(self, value): return lambda row: getattr(row, self.name) is value
    def asc(self): return self.name

class Query:
    def __init__(self, rows): self.rows = list(rows)
    def filter(self, *conditions):
        self.rows = [r for r in self.rows if all(check(r) for check in conditions)]
        return self
    def order_by(self, *keys):
        self.rows.sort(key=lambda r: tuple(getattr(r, key) for key in keys))
        return self
    def all(self): return self.rows

class Db:
    def __init__(self, rows): self.rows = rows
    def query(self, model): return Query(self.rows)

def route_globals(official_ids=None):
    nodes = [ast.ImportFrom(module='__future__', names=[ast.alias(name='annotations')], level=0)]
    for node in TREE.body:
        if isinstance(node, ast.Assign) and any(isinstance(t, ast.Name) and t.id in NAMES for t in node.targets):
            nodes.append(node)
        if isinstance(node, ast.FunctionDef) and node.name == 'listar_simbolos_graficos':
            node = ast.parse(ast.unparse(node)).body[0]
            node.decorator_list = []
            nodes.append(node)
    model = SimpleNamespace(**{key: Column(key) for key in ('clinica_id', 'ativo', 'descricao', 'codigo', 'id')})
    official = set(range(1,82)) if official_ids is None else official_ids
    def forbidden(): raise AssertionError('Procedure/resource fallback must not be called')
    namespace = {'Query': lambda default: default, 'Depends': lambda dependency: None,
        'get_current_user': None, 'get_db': None, 'SimboloGrafico': model,
        '_norm': lambda v: str(v).lower().strip(),
        'carregar_legacy_ids_catalogo_oficial': lambda: official,
        'carregar_codigos_procedimentos': forbidden,
        'carregar_codigos_catalogo_oficial': lambda: {'same.bmp', 'custom.bmp'},
        'carregar_codigos_genericos': lambda: {'same.bmp'},
        '_simbolo_eh_oficial': lambda r: r.legacy_id in official,
        '_simbolo_usuario_no_catalogo': lambda r: r.origem == 'simbolo_usuario',
        'SIMBOLO_TIPO_MARCA_LABELS': {},
    }
    exec(compile(ast.fix_missing_locations(ast.Module(body=nodes,type_ignores=[])), '<isolated-scope-test>', 'exec'), namespace)
    return namespace

def fixture(clinic=15):
    raw = json.loads((BACKEND / 'scripts/easy_simbolos_catalogo_atual_snapshot.json').read_text(encoding='utf-8-sig'))
    rows = [SimpleNamespace(id=clinic*1000+r['nrosim'], clinica_id=clinic, legacy_id=r['nrosim'],
        codigo=r['codigo'], descricao=r['descricao'], especialidade=r['especial'], tipo_marca=r['tipmarca'],
        tipo_simbolo=r['tiposim'], icone=r['icone'], bitmap1=r['bitmap1'], bitmap2=r['bitmap2'],
        bitmap3=r['bitmap3'], imagem_custom=None, ativo=True, origem=None) for r in raw]
    return rows

class ProcedureComboScopeTests(unittest.TestCase):
    def call(self, rows=None, scope='procedimentos-combo', clinic=15, q='', official_ids=None):
        env=route_globals(official_ids)
        return env['listar_simbolos_graficos'](q=q,scope=scope,
            current_user=SimpleNamespace(clinica_id=clinic),db=Db(rows if rows is not None else fixture(clinic)))

    def test_exact_historical_set_63(self):
        ids={r['legacy_id'] for r in self.call()}
        self.assertEqual(ids, set(range(1,60)) | {77,78,79,81})
        self.assertEqual(len(self.call()),63)

    def test_excludes_18_even_with_normalized_local_especialidade5(self):
        rows=fixture()
        for r in rows:
            if 60<=r.legacy_id<=76 or r.legacy_id==80:r.especialidade=5
        self.assertEqual(len(self.call(rows)),63)

    def test_shared_bitmap_18_81_and_57_58_are_not_deduplicated(self):
        rows={r['legacy_id']:r for r in self.call()}
        self.assertEqual(rows[18]['codigo'],rows[81]['codigo'])
        self.assertEqual(rows[57]['codigo'],rows[58]['codigo'])
        self.assertNotEqual(rows[18]['id'],rows[81]['id'])
        self.assertNotEqual(rows[57]['id'],rows[58]['id'])

    def test_homologated_labels_57_58_81(self):
        labels={r['legacy_id']:r['descricao'] for r in self.call()}
        self.assertEqual(labels[57],'Símbolo genérico (dente)')
        self.assertEqual(labels[58],'Símbolo genérico (grupo)')
        self.assertEqual(labels[81],'Raspagem para arcada')

    def test_other_clinic_never_included(self):
        rows=self.call(fixture(1)+fixture(4)+fixture(15))
        self.assertEqual(len(rows),63)
        self.assertTrue(all(15000<r['id']<16000 for r in rows))

    def test_each_production_clinic_has_63_local_symbols(self):
        for cid in (1,4,15):
            rows=self.call(clinic=cid)
            self.assertEqual(len(rows),63)
            self.assertTrue(all(cid*1000<r['id']<(cid+1)*1000 for r in rows))

    def test_future_clinic_uses_same_rule_and_only_its_local_symbols(self):
        cid=90210
        rows=self.call(fixture(1)+fixture(4)+fixture(15)+fixture(cid),clinic=cid)
        self.assertEqual({r['legacy_id'] for r in rows},set(range(1,60)) | {77,78,79,81})
        self.assertEqual(len(rows),63)
        self.assertTrue(all(cid*1000<r['id']<(cid+1)*1000 for r in rows))

    def test_inactive_excluded(self):
        rows=fixture();rows[0].ativo=False
        self.assertNotIn(rows[0].legacy_id,{r['legacy_id'] for r in self.call(rows)})

    def test_custom_auxiliary_never_leaks(self):
        extra=SimpleNamespace(**vars(fixture()[0]));extra.id=99999;extra.legacy_id=None;extra.origem='simbolo_usuario'
        self.assertEqual(len(self.call(fixture()+[extra])),63)

    def test_missing_official_source_fails_closed(self):
        self.assertEqual(self.call(official_ids=set()),[])

    def test_no_snapshot_resource_fallback(self):
        self.assertEqual(len(self.call()),63)

    def test_catalogo_keeps_all81_and_custom_not_auxiliary(self):
        extra=SimpleNamespace(**vars(fixture()[0]));extra.id=99998;extra.legacy_id=None;extra.origem='simbolo_usuario'
        auxiliary=SimpleNamespace(**vars(extra));auxiliary.id=99999;auxiliary.origem=None
        result=self.call(fixture()+[extra,auxiliary],scope='catalogo')
        self.assertEqual(len(result),82)
        self.assertIn(80,{r['legacy_id'] for r in result})

    def test_biblioteca_todos_amplo_keep_81(self):
        for scope in ('biblioteca','todos','amplo'):
            self.assertEqual(len(self.call(scope=scope)),81)

    def test_genericos_resource_dedup_contract_unchanged(self):
        rows=fixture()[:2]
        for row in rows:row.codigo='same.bmp'
        self.assertEqual(len(self.call(rows,scope='genericos')),1)
        self.assertEqual(len(self.call(rows,scope='procedimentos-combo')),2)

    def test_q_only_narrows_context(self):
        result=self.call(q='Raspagem para arcada')
        self.assertEqual([r['legacy_id'] for r in result],[81])

    def test_route_still_has_auth_and_module_dependency(self):
        node=next(n for n in TREE.body if isinstance(n,ast.FunctionDef) and n.name=='listar_simbolos_graficos')
        self.assertIn('DEP_PROCEDIMENTOS',ast.unparse(node.decorator_list[0]))
        self.assertIn('Depends(get_current_user)',ast.unparse(node))

    def test_read_only_route_and_no_data_mutation(self):
        rows=fixture();before=[vars(r).copy() for r in rows]
        self.call(rows)
        self.assertEqual(before,[vars(r) for r in rows])
        source=ast.unparse(next(n for n in TREE.body if isinstance(n,ast.FunctionDef) and n.name=='listar_simbolos_graficos'))
        for forbidden in ('db.commit(', 'db.add(', 'db.delete(', 'db.execute(', '.update('):
            self.assertNotIn(forbidden,source)

if __name__=='__main__':unittest.main()
