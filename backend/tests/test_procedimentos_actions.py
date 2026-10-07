"""Real route bodies with in-memory ORM doubles; never import app, DB or .env.

No SQLite or PostgreSQL connection, seed, production request or data write.
Business validators/tenant queries are executed, not replaced by success mocks.
"""
import ast
import copy
import unittest
import unicodedata
from decimal import Decimal, InvalidOperation, ROUND_HALF_UP
from pathlib import Path
from types import SimpleNamespace

from fastapi import HTTPException
from pydantic import BaseModel
from sqlalchemy.exc import SQLAlchemyError

BACKEND = Path(__file__).resolve().parents[1]
SOURCE = (BACKEND / 'routes/procedimentos_routes.py').read_text(encoding='utf-8-sig')


class Column:
    def __init__(self, owner, name): self.owner, self.name = owner, name
    def __eq__(self, value): return lambda row: getattr(row, self.name, None) == value
    def __ne__(self, value): return lambda row: getattr(row, self.name, None) != value
    def __lt__(self, value): return lambda row: getattr(row, self.name, None) is not None and getattr(row, self.name) < value
    def in_(self, values): return lambda row: getattr(row, self.name, None) in values
    def asc(self): return self


def model(name, fields):
    cls = type(name, (SimpleNamespace,), {})
    for field in fields.split(): setattr(cls, field, Column(name, field))
    return cls


Table = model('Table', 'id clinica_id codigo nome')
Proc = model('Proc', 'id clinica_id tabela_id codigo nome preco valor_repasse')
Material = model('Material', 'id procedimento_id clinica_id')
Clinic = model('Clinic', 'id')


class Aggregate:
    def __init__(self, operation, column): self.operation, self.column = operation, column


class Query:
    def __init__(self, db, name, rows=None, projection=None):
        self.db, self.name = db, name
        self.rows = list(db.rows[name] if rows is None else rows)
        self.projection = projection

    def filter(self, *conditions):
        self.rows = [row for row in self.rows if all(check(row) for check in conditions)]
        return self

    def with_entities(self, projection): return Query(self.db, self.name, self.rows, projection)
    def order_by(self, *args): return self
    def limit(self, take): return Query(self.db, self.name, self.rows[:take], self.projection)
    def count(self): return len(self.rows)

    def all(self):
        if isinstance(self.projection, Column): return [(getattr(row, self.projection.name),) for row in self.rows]
        return self.rows

    def first(self): return self.all()[0] if self.rows else None

    def scalar(self):
        if self.projection.operation == 'count': return len(self.rows)
        return max((getattr(row, self.projection.column.name) for row in self.rows), default=None)

    def delete(self, **kwargs):
        for row in self.rows: self.db.delete(row)
        return len(self.rows)


class DB:
    def __init__(self, **rows):
        self.rows = {'Table': [], 'Proc': [], 'Material': [], 'Clinic': [], **rows}
        self.commits, self.rollbacks = 0, 0
        self.deleted, self.added = [], []

    def query(self, entity):
        column = entity.column if isinstance(entity, Aggregate) else entity
        name = column.owner if isinstance(column, Column) else column.__name__
        return Query(self, name, projection=entity if isinstance(entity, (Column, Aggregate)) else None)

    def add(self, row):
        row.id = 9000 + len(self.added)
        self.added.append(row)
        self.rows[type(row).__name__].append(row)

    def delete(self, row):
        self.deleted.append(row)
        self.rows[type(row).__name__] = [item for item in self.rows[type(row).__name__] if item is not row]

    def flush(self): pass
    def commit(self): self.commits += 1
    def rollback(self): self.rollbacks += 1


def load_nodes(source, names, namespace):
    tree = ast.parse(source)
    nodes = [ast.ImportFrom(module='__future__', names=[ast.alias(name='annotations')], level=0)]
    for node in tree.body:
        if isinstance(node, (ast.FunctionDef, ast.ClassDef)) and node.name in names:
            node.decorator_list = []
            nodes.append(node)
    exec(compile(ast.fix_missing_locations(ast.Module(body=nodes, type_ignores=[])), '<isolated-actions>', 'exec'), namespace)
    return namespace


def routes():
    copies = []
    ns = {
        'HTTPException': HTTPException, 'BaseModel': BaseModel, 'Depends': lambda fn: None,
        'Query': lambda default=None, **kw: default, 'get_current_user': None, 'get_db': None,
        'Procedimento': Proc, 'ProcedimentoTabela': Table, 'ProcedimentoMaterial': Material, 'Clinica': Clinic,
        'Decimal': Decimal, 'InvalidOperation': InvalidOperation, 'ROUND_HALF_UP': ROUND_HALF_UP,
        'unicodedata': unicodedata, 'SQLAlchemyError': SQLAlchemyError, 'PRIVATE_TABLE_CODE': 4, 'DEFAULT_INDICE_NUMERO': 255,
        'func': SimpleNamespace(max=lambda col: Aggregate('max', col), count=lambda col: Aggregate('count', col)),
        'or_': lambda *checks: lambda row: any(check(row) for check in checks),
        '_garantir_tabelas_clinica': lambda *a: None,  # Never bootstrap production/test DB.
        '_resolver_tipo_tiss_id': lambda db, value, default=1: int(value or default),
        '_resolver_nro_indice': lambda db, clinic, value, source, default=None: int(value or default or 255),
        '_dados_indice_por_id': lambda db, clinic, number: {'id': number, 'sigla': 'R$', 'nome': 'Real'},
        '_copiar_procedimentos_entre_tabelas': lambda *args: copies.append(args[1:]) or 0,
    }
    names = {'TabelaProcedimentoPayload', 'ReajusteTabelaAplicarPayload', '_chave_ordenacao',
             '_normalizar_fonte_pagadora', '_indice_default_id_por_fonte', '_resolver_tabela_id',
             '_load_tabela_or_404', '_validar_tabela_ativa', '_load_proc_or_404', 'excluir_procedimento',
             'criar_tabela_procedimentos', 'renomear_tabela_procedimentos', 'excluir_tabela_procedimentos',
             '_parse_percentual_br', '_parse_percentual_br_decimal', '_quantize_money',
             'preview_reajuste_tabela', 'aplicar_reajuste_tabela', '_calcular_financeiro_dashboard'}
    return load_nodes(SOURCE, names, ns), copies


def table(id=88, codigo=4, clinic=1, **kwargs):
    values = dict(id=id, codigo=codigo, clinica_id=clinic, nome='PARTICULAR', nro_indice=255,
                  fonte_pagadora='particular', nro_credenciamento=None, tipo_tiss_id=1, inativo=False)
    values.update(kwargs)
    return Table(**values)


def procedure(id=701, clinic=1, **kwargs):
    values = dict(id=id, clinica_id=clinic, tabela_id=88, codigo=1, nome='Consulta', preco=100.,
                  valor_repasse=50., simbolo_grafico='sim_outras.bmp', simbolo_grafico_legacy_id=58,
                  mostrar_simbolo=True, custo=2, custo_lab=3, tempo=15, observacoes='Preservar',
                  data_alteracao='01/01/2026')
    values.update(kwargs)
    return Proc(**values)


class ActionsTests(unittest.TestCase):
    def setUp(self):
        self.route, self.copies = routes()
        self.user = SimpleNamespace(id=11, clinica_id=1)
        self.table = table()
        self.proc = procedure()
        self.foreign_proc = procedure(id=702, clinic=4, tabela_id=188)
        self.db = DB(Table=[self.table, table(id=99, codigo=8, nome='Outra'), table(id=188, clinic=4)],
                     Proc=[self.proc, self.foreign_proc], Clinic=[Clinic(id=1, nome_tabela_procedimentos='PARTICULAR')])

    def assert_http(self, code, fn, *args):
        with self.assertRaises(HTTPException) as context: fn(*args)
        self.assertEqual(context.exception.status_code, code)
        self.assertEqual(self.db.commits, 0)
        self.assertEqual(self.db.deleted, [])
        return context.exception.detail

    def test_delete_pk_not_public_code(self):
        # A table with public code 88 must not be mistaken for local PK 88.
        self.db.rows['Table'].append(table(id=120, codigo=88, inativo=True))
        result = self.route['excluir_procedimento'](701, self.user, self.db)
        self.assertEqual(result['detail'], 'Procedimento excluido.')
        self.assertEqual(self.db.deleted, [self.proc])
        self.assertEqual(self.db.rows['Proc'], [self.foreign_proc])
        self.assertEqual(self.db.commits, 1)

    def test_delete_checks_local_pk_inactivity_not_wrong_public_alias(self):
        self.table.inativo = True
        self.db.rows['Table'].append(table(id=120, codigo=88))
        self.assert_http(400, self.route['excluir_procedimento'], 701, self.user, self.db)

    def test_delete_foreign_procedure_rejected(self):
        self.assert_http(404, self.route['excluir_procedimento'], 702, self.user, self.db)

    def test_delete_foreign_local_table_rejected(self):
        self.proc.tabela_id = 188
        self.assert_http(404, self.route['excluir_procedimento'], 701, self.user, self.db)

    def test_delete_orphan_has_no_arbitrary_table_fallback(self):
        self.proc.tabela_id = None
        self.assert_http(404, self.route['excluir_procedimento'], 701, self.user, self.db)

    def test_create_requires_name_and_uniqueness_per_clinic(self):
        for name in ['', ' particular ']:
            with self.subTest(name=name):
                payload = self.route['TabelaProcedimentoPayload'](nome=name)
                self.assert_http(400, self.route['criar_tabela_procedimentos'], payload, self.user, self.db)
        self.assertEqual(self.db.added, [])

    def test_create_copy_uses_same_clinic_public_code_and_local_pks(self):
        payload = self.route['TabelaProcedimentoPayload'](nome='Nova', copiar_de_tabela_id='4',
                  nro_indice=255, fonte_pagadora='convenio', nro_credenciamento=' ABC ', tipo_tiss_id=9)
        result = self.route['criar_tabela_procedimentos'](payload, self.user, self.db)
        self.assertEqual(self.copies, [(1, 88, 9000)])
        self.assertEqual(result['id'], '9')
        self.assertEqual(self.db.added[0].clinica_id, 1)
        self.assertEqual(self.db.added[0].nro_credenciamento, 'ABC')

    def test_create_foreign_copy_origin_rejected_before_insert(self):
        self.db.rows['Table'].append(table(id=200, codigo=10, clinic=4))
        payload = self.route['TabelaProcedimentoPayload'](nome='Nova', copiar_de_tabela_id='10')
        self.assert_http(404, self.route['criar_tabela_procedimentos'], payload, self.user, self.db)
        self.assertEqual(self.db.added, [])
        self.assertEqual(self.copies, [])

    def test_edit_public_code_preserves_all_metadata_and_foreign_table(self):
        before = copy.deepcopy(vars(self.db.rows['Table'][2]))
        payload = self.route['TabelaProcedimentoPayload'](nome='Editada', nro_indice=3,
                  fonte_pagadora='convenio', nro_credenciamento='XYZ', tipo_tiss_id=9, inativo=True)
        result = self.route['renomear_tabela_procedimentos'](4, payload, self.user, self.db)
        self.assertEqual(result['id'], '4')
        self.assertEqual(self.table.id, 88)
        self.assertEqual(self.table.tipo_tiss_id, 9)
        self.assertEqual(self.table.nro_indice, 3)
        self.assertEqual(self.table.nro_credenciamento, 'XYZ')
        self.assertTrue(self.table.inativo)
        self.assertEqual(vars(self.db.rows['Table'][2]), before)
        self.assertEqual(self.db.rows['Clinic'][0].nome_tabela_procedimentos, 'Editada')

    def test_edit_duplicate_rejected_before_mutation(self):
        payload = self.route['TabelaProcedimentoPayload'](nome='Outra')
        self.assert_http(400, self.route['renomear_tabela_procedimentos'], 4, payload, self.user, self.db)
        self.assertEqual(self.table.nome, 'PARTICULAR')

    def test_particular_cannot_keep_convenio_credential(self):
        payload = self.route['TabelaProcedimentoPayload'](nome='Editada', fonte_pagadora='particular', nro_credenciamento='ABC')
        self.route['renomear_tabela_procedimentos'](4, payload, self.user, self.db)
        self.assertIsNone(self.table.nro_credenciamento)

    def test_delete_table_guard_counts_only_current_clinic(self):
        self.db.rows['Table'] = [self.table, table(id=188, clinic=4)]
        detail = self.assert_http(400, self.route['excluir_tabela_procedimentos'], 4, self.user, self.db)
        self.assertIn('unica tabela', detail)

    def test_delete_table_public_code_targets_only_its_local_procedures(self):
        self.db.rows['Material'] = [Material(id=1, procedimento_id=701), Material(id=2, procedimento_id=702)]
        result = self.route['excluir_tabela_procedimentos'](4, self.user, self.db)
        self.assertIn('sucesso', result['detail'])
        self.assertEqual(self.db.rows['Proc'], [self.foreign_proc])
        self.assertEqual([row.id for row in self.db.rows['Material']], [2])
        self.assertNotIn(self.table, self.db.rows['Table'])

    def test_table_writers_cannot_resolve_foreign_public_code(self):
        self.db.rows['Table'].append(table(id=200, codigo=10, clinic=4))
        for action in ['renomear_tabela_procedimentos', 'excluir_tabela_procedimentos']:
            args = [10]
            if action.startswith('renomear'): args.append(self.route['TabelaProcedimentoPayload'](nome='Nova'))
            self.assert_http(404, self.route[action], *args, self.user, self.db)

    def test_preview_has_zero_mutations_and_returns_local_pk_plus_public_code(self):
        before = copy.deepcopy(vars(self.proc))
        result = self.route['preview_reajuste_tabela']('4', 'aumentar', '1,00', 20, self.user, self.db)
        self.assertEqual(result['tabela']['id'], 88)
        self.assertEqual(result['tabela']['codigo'], 4)
        self.assertEqual(result['total'], 1)
        self.assertEqual(result['amostra'][0]['preco_after'], 101)
        self.assertEqual(vars(self.proc), before)
        self.assertEqual(self.db.commits, 0)

    def test_apply_requires_explicit_confirmation(self):
        payload = self.route['ReajusteTabelaAplicarPayload'](tabela_id='4', modo='aumentar', percentual='1,00')
        self.assert_http(400, self.route['aplicar_reajuste_tabela'], payload, self.user, self.db)
        self.assertEqual(self.proc.preco, 100)

    def test_apply_changes_only_price_and_repasse_same_clinic_table(self):
        before = copy.deepcopy(vars(self.proc))
        foreign_before = copy.deepcopy(vars(self.foreign_proc))
        payload = self.route['ReajusteTabelaAplicarPayload'](tabela_id='4', modo='aumentar', percentual='1,00', confirmar=True)
        result = self.route['aplicar_reajuste_tabela'](payload, self.user, self.db)
        changed = {key for key in before if before[key] != vars(self.proc)[key]}
        self.assertEqual(changed, {'preco', 'valor_repasse'})
        self.assertEqual(result['total_atualizado'], 1)
        self.assertEqual(self.proc.preco, 101)
        self.assertEqual(self.proc.valor_repasse, 50.5)
        self.assertEqual(vars(self.foreign_proc), foreign_before)

    def test_apply_preserves_null_and_rounds_money(self):
        self.proc.preco, self.proc.valor_repasse = 1.005, None
        payload = self.route['ReajusteTabelaAplicarPayload'](tabela_id='4', modo='aumentar', percentual='1', confirmar=True)
        self.route['aplicar_reajuste_tabela'](payload, self.user, self.db)
        self.assertEqual(self.proc.preco, 1.02)
        self.assertIsNone(self.proc.valor_repasse)

    def test_reprice_inactive_and_foreign_table_rejected(self):
        for code in ['4', '10']:
            self.table.inativo = True
            self.db.rows['Table'].append(table(id=200, codigo=10, clinic=4))
            payload = self.route['ReajusteTabelaAplicarPayload'](tabela_id=code, modo='aumentar', percentual='1', confirmar=True)
            self.assert_http(400 if code == '4' else 404, self.route['aplicar_reajuste_tabela'], payload, self.user, self.db)

    def test_apply_invalid_percentage_negative_price_and_empty_table_rejected(self):
        for pct in ['0', '-1', 'abc', '1001']:
            payload = self.route['ReajusteTabelaAplicarPayload'](tabela_id='4', modo='aumentar', percentual=pct, confirmar=True)
            self.assert_http(400, self.route['aplicar_reajuste_tabela'], payload, self.user, self.db)
        self.proc.preco = -1
        payload = self.route['ReajusteTabelaAplicarPayload'](tabela_id='4', modo='aumentar', percentual='1', confirmar=True)
        self.assert_http(400, self.route['aplicar_reajuste_tabela'], payload, self.user, self.db)
        self.db.rows['Proc'] = []
        self.assert_http(400, self.route['aplicar_reajuste_tabela'], payload, self.user, self.db)

    def test_apply_commit_failure_requests_rollback(self):
        def fail(): raise SQLAlchemyError('isolated simulated error')
        self.db.commit = fail
        payload = self.route['ReajusteTabelaAplicarPayload'](tabela_id='4', modo='aumentar', percentual='1', confirmar=True)
        with self.assertRaises(SQLAlchemyError): self.route['aplicar_reajuste_tabela'](payload, self.user, self.db)
        self.assertEqual(self.db.rollbacks, 1)

    def test_existing_finance_regressions_without_legacy_sqlite_import(self):
        # Execute all existing finance test cases, extracting only their class.
        test_source = (BACKEND / 'tests/test_procedimentos_financeiro.py').read_text(encoding='utf-8-sig')
        ns = {'unittest': unittest, 'SimpleNamespace': SimpleNamespace,
              '_calcular_financeiro_dashboard': self.route['_calcular_financeiro_dashboard']}
        load_nodes(test_source, {'ProcedimentosFinanceiroTests'}, ns)
        result = unittest.TestResult()
        unittest.defaultTestLoader.loadTestsFromTestCase(ns['ProcedimentosFinanceiroTests']).run(result)
        self.assertEqual(result.testsRun, 3)
        self.assertTrue(result.wasSuccessful(), result.errors + result.failures)

    def test_auth_and_module_guards_remain_on_all_actions(self):
        tree = ast.parse(SOURCE)
        router = next(node for node in tree.body if isinstance(node, ast.Assign) and any(isinstance(target, ast.Name) and target.id == 'router' for target in node.targets))
        self.assertIn('Depends(require_module_access(\'procedimentos\'))', ast.unparse(router))
        names = {'excluir_procedimento', 'criar_tabela_procedimentos', 'renomear_tabela_procedimentos',
                 'excluir_tabela_procedimentos', 'preview_reajuste_tabela', 'aplicar_reajuste_tabela'}
        for node in tree.body:
            if isinstance(node, ast.FunctionDef) and node.name in names:
                self.assertIn('Depends(get_current_user)', ast.unparse(node.args))
                self.assertIn('current_user.clinica_id', ast.unparse(node))

    def test_actual_module_guard_rejects_disabled_and_foreign_protected_grants(self):
        source = (BACKEND / 'security/dependencies.py').read_text(encoding='utf-8-sig')
        ns = {'HTTPException': HTTPException, 'Depends': lambda fn: None, 'get_current_user': None, 'get_db': None,
              'get_module_access_level': lambda user, module: 'desabilitado',
              'verify_admin_password': lambda *args: False,
              'decode_token': lambda token: {'type': 'protected_grant', 'user_id': 11, 'clinica_id': 4, 'module_code': 'procedimentos'}}
        load_nodes(source, {'require_module_access'}, ns)
        guard = ns['require_module_access']('procedimentos')
        self.assert_http(403, guard, SimpleNamespace(headers={}), self.user, self.db)
        ns['get_module_access_level'] = lambda user, module: 'protegido'
        self.assert_http(403, guard, SimpleNamespace(headers={'X-Protected-Grant': 'synthetic'}), self.user, self.db)
        ns['get_module_access_level'] = lambda user, module: 'habilitado'
        self.assertIs(guard(SimpleNamespace(headers={}), self.user, self.db), self.user)


if __name__ == '__main__': unittest.main()
