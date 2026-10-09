"""P4A writer tests with actual function ASTs and in-memory ORM doubles.

No database.py/main imports, .env, SQLite, connections, or productive writes.
"""
import ast
import copy
import unittest
from datetime import datetime
from pathlib import Path
from types import SimpleNamespace

from fastapi import HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import text

BACKEND = Path(__file__).resolve().parents[1]


class Column:
    def __init__(self, name):
        self.name = name

    def __eq__(self, other):
        return lambda row: getattr(row, self.name, None) == other

    def is_(self, other):
        return self == other

    def in_(self, values):
        return lambda row: getattr(row, self.name, None) in values

    def asc(self):
        return self


def model(name, fields):
    cls = type(name, (SimpleNamespace,), {})
    for field in fields.split():
        col = Column(field)
        col.owner = name
        setattr(cls, field, col)
    return cls


Proc = model('Proc', 'id clinica_id tabela_id codigo procedimento_generico_id')
Symbol = model('Symbol', 'id clinica_id codigo legacy_id ativo')
Table = model('Table', 'id clinica_id codigo nome')
Generic = model('Generic', 'id clinica_id')
Material = model('Material', 'id procedimento_id')
Phase = model('Phase', 'id procedimento_id')


class Query:
    def __init__(self, rows, projection=None):
        self.rows = list(rows)
        self.projection = projection

    def filter(self, *conditions):
        self.rows = [row for row in self.rows if all(check(row) for check in conditions)]
        return self

    def order_by(self, *args):
        return self

    def all(self):
        return [(getattr(row, self.projection),) for row in self.rows] if self.projection else self.rows

    def first(self):
        rows = self.all()
        return rows[0] if rows else None

    def delete(self, **kwargs):
        return 0


class DB:
    def __init__(self, **rows):
        self.rows = rows
        self.info = {}
        self.added = []
        self.commits = 0

    def query(self, cls):
        if isinstance(cls, Column):
            return Query(self.rows.get(cls.owner, []), cls.name)
        return Query(self.rows.get(cls.__name__, []))

    def add(self, item):
        if not isinstance(getattr(item, 'id', None), int):
            item.id = 9000 + len(self.added)
        self.added.append(item)

    def flush(self):
        pass

    def commit(self):
        self.commits += 1

    def refresh(self, item):
        pass


def load_functions(path, namespace, names=None):
    tree = ast.parse((BACKEND / path).read_text(encoding='utf-8-sig'))
    nodes = [node for node in tree.body if isinstance(node, (ast.FunctionDef, ast.ClassDef))
             and (names is None or node.name in names)]
    for node in nodes:
        if isinstance(node, ast.FunctionDef):
            node.decorator_list = []
    exec(compile(ast.fix_missing_locations(ast.Module(body=nodes, type_ignores=[])), str(BACKEND / path), 'exec'), namespace)
    return namespace


def helpers():
    ns = {'HTTPException': HTTPException, 'SimboloGrafico': Symbol,
          'SYMBOL_FIELDS': frozenset({'simbolo_grafico', 'simbolo_grafico_legacy_id'})}
    return load_functions('services/procedimento_symbol_service.py', ns)


def procedure(**kw):
    values = dict(id=10, codigo=10, nome='Test', clinica_id=13, tabela_id=78, tempo=0,
                  preco=0., custo=0., custo_lab=0., lucro_hora=0., especialidade='05',
                  procedimento_generico_id=20, simbolo_grafico='int_bracket.bmp',
                  simbolo_grafico_legacy_id=22, mostrar_simbolo=False, garantia_meses=0,
                  forma_cobranca='INTERVENCAO', valor_repasse=0., preferido=False, inativo=False,
                  observacoes=None, data_inclusao='01/01/2026', data_alteracao='')
    values.update(kw)
    return Proc(**values)


def symbol(legacy=22, clinic=13, code='int_bracket.bmp', active=True):
    return Symbol(id=1000 + legacy, clinica_id=clinic, codigo=code, legacy_id=legacy, ativo=active)


def route_namespace(db, proc):
    ns = helpers()
    ns.update({'BaseModel': BaseModel, 'Field': Field, 'Session': object, 'Usuario': object, 'Procedimento': Proc,
               'Depends': lambda fn: None, 'get_current_user': lambda: None, 'get_db': lambda: None,
               'ProcedimentoTabela': Table, 'ProcedimentoGenerico': Generic,
               'ProcedimentoMaterial': Material, 'ProcedimentoFase': Phase, 'datetime': datetime,
               '_garantir_tabelas_clinica': lambda *a: None,
               '_load_proc_or_404': lambda *a: proc,
               '_resolver_tabela_id': lambda *a, **k: 4,
               '_load_tabela_or_404': lambda *a: Table(id=78, codigo=4, clinica_id=13, inativo=False),
               '_validar_tabela_ativa': lambda *a: None,
               '_proc_codigo_em_uso': lambda *a, **k: False,
               '_normalizar_especialidade': lambda value: value or '',
               '_normalizar_forma_cobranca': lambda value: value,
               'FORMAS_COBRANCA_PADRAO': {'INTERVENCAO': 'Intervenção', 'ELEMENTO_FACE': 'Elemento / Face'},
               '_listar_especialidades': lambda *a: [{'codigo': '05'}],
               '_aplicar_fases_procedimento_generico': lambda *a, **k: None,
               '_procedimento_com_vinculos': lambda db, p: vars(p)})
    return load_functions('routes/procedimentos_routes.py', ns,
                          {'ProcedimentoPayload', '_campos_procedimento_explicitos', '_validar_campos_edicao',
                           'criar_procedimento', 'atualizar_procedimento', '_copiar_procedimentos_entre_tabelas'})


class SymbolPreservationTests(unittest.TestCase):
    def setUp(self):
        self.ns = helpers()
        self.proc = procedure()
        self.db = DB(Symbol=[symbol(), symbol(37, code='int_mordida.bmp')],
                     Proc=[self.proc], Table=[Table(id=78, codigo=4, clinica_id=13)], Generic=[Generic(id=20, clinica_id=13)])
        self.route = route_namespace(self.db, self.proc)

    def payload(self, **kwargs):
        return self.route['ProcedimentoPayload'](codigo=10, nome='Test changed', tabela_id='4', **kwargs)

    def test_payload_omission_preserves_both_fields(self):
        pair = self.ns['referencia_simbolo_payload'](self.db, 13, self.payload(), self.proc)
        self.assertEqual(pair, ('int_bracket.bmp', 22))

    def test_other_field_update_preserves_pair_via_actual_route(self):
        self.route['atualizar_procedimento'](10, self.payload(preco=25), SimpleNamespace(clinica_id=13), self.db)
        self.assertEqual((self.proc.simbolo_grafico, self.proc.simbolo_grafico_legacy_id), ('int_bracket.bmp', 22))
        self.assertEqual(self.proc.preco, 25)

    def test_partial_update_preserves_empty_pair(self):
        self.proc.simbolo_grafico = self.proc.simbolo_grafico_legacy_id = None
        with self.assertRaises(HTTPException) as error:
            self.route['atualizar_procedimento'](10, self.payload(), SimpleNamespace(clinica_id=13), self.db)
        self.assertEqual(error.exception.detail, 'Campo Símbolo gráfico não pode ser nulo.')
        self.assertEqual(self.db.commits, 0)
        self.assertIsNone(self.proc.simbolo_grafico)
        self.assertIsNone(self.proc.simbolo_grafico_legacy_id)

    def test_partial_update_does_not_request_symbol_inheritance(self):
        seen = []
        self.proc.procedimento_generico_id = 20
        self.db.rows['Generic'] = [Generic(id=20, clinica_id=13)]
        self.route['_aplicar_fases_procedimento_generico'] = lambda *a, **k: seen.append(k)
        self.route['atualizar_procedimento'](10, self.payload(procedimento_generico_id=20), SimpleNamespace(clinica_id=13), self.db)
        self.assertEqual(seen, [])  # Ordinary save must not reapply association at all.

    def test_explicit_valid_pair_updates_via_actual_route(self):
        self.route['atualizar_procedimento'](10, self.payload(simbolo_grafico='int_mordida.bmp', simbolo_grafico_legacy_id=37),
                                            SimpleNamespace(clinica_id=13), self.db)
        self.assertEqual((self.proc.simbolo_grafico, self.proc.simbolo_grafico_legacy_id), ('int_mordida.bmp', 37))

    def test_code_only_change_resolves_legacy(self):
        self.assertEqual(self.ns['referencia_simbolo_payload'](self.db, 13, self.payload(simbolo_grafico='int_mordida.bmp'), self.proc),
                         ('int_mordida.bmp', 37))

    def test_legacy_only_change_resolves_code_not_catalog_id(self):
        self.assertEqual(self.ns['referencia_simbolo_payload'](self.db, 13, self.payload(simbolo_grafico_legacy_id=37), self.proc),
                         ('int_mordida.bmp', 37))

    def test_old_client_unchanged_code_preserves_legacy(self):
        for kw in ({'simbolo_grafico': 'int_bracket.bmp'}, {'simbolo_grafico': 'int_bracket.bmp', 'simbolo_grafico_legacy_id': None}):
            self.assertEqual(self.ns['referencia_simbolo_payload'](self.db, 13, self.payload(**kw), self.proc), ('int_bracket.bmp', 22))

    def test_explicit_clear_blocked_by_required_symbol(self):
        with self.assertRaises(HTTPException) as error:
            self.route['atualizar_procedimento'](10, self.payload(simbolo_grafico=None, simbolo_grafico_legacy_id=None),
                                                SimpleNamespace(clinica_id=13), self.db)
        self.assertEqual(error.exception.detail, 'Campo Símbolo gráfico não pode ser nulo.')
        self.assertEqual((self.proc.simbolo_grafico, self.proc.simbolo_grafico_legacy_id), ('int_bracket.bmp', 22))
        self.assertEqual(self.db.commits, 0)

    def test_explicit_clear_legacy_only_half_pair(self):
        self.proc.simbolo_grafico = None
        self.assertEqual(self.ns['referencia_simbolo_payload'](self.db, 13, self.payload(simbolo_grafico='', simbolo_grafico_legacy_id=None), self.proc), (None, None))

    def test_legacy_only_null_cannot_corrupt_existing_pair(self):
        with self.assertRaises(HTTPException):
            self.ns['referencia_simbolo_payload'](self.db, 13, self.payload(simbolo_grafico_legacy_id=None), self.proc)

    def test_cross_clinic_symbol_rejected_before_route_mutation(self):
        self.db.rows['Symbol'].append(symbol(39, clinic=15, code='int_faceta.bmp'))
        before = copy.deepcopy(vars(self.proc))
        with self.assertRaises(HTTPException):
            self.route['atualizar_procedimento'](10, self.payload(simbolo_grafico='int_faceta.bmp', simbolo_grafico_legacy_id=39),
                                                SimpleNamespace(clinica_id=13), self.db)
        self.assertEqual(vars(self.proc), before)
        self.assertEqual(self.db.commits, 0)

    def test_mismatched_code_legacy_rejected(self):
        with self.assertRaises(HTTPException):
            self.ns['referencia_simbolo_payload'](self.db, 13, self.payload(simbolo_grafico='int_mordida.bmp', simbolo_grafico_legacy_id=22), self.proc)

    def test_missing_symbol_rejected(self):
        with self.assertRaises(HTTPException):
            self.ns['resolver_referencia_simbolo'](self.db, 13, 'missing.bmp', 58)

    def test_inactive_symbol_rejected(self):
        self.db.rows['Symbol'].append(symbol(39, code='int_faceta.bmp', active=False))
        with self.assertRaises(HTTPException):
            self.ns['resolver_referencia_simbolo'](self.db, 13, 'int_faceta.bmp', 39)

    def test_empty_creation_blocked_by_required_symbol(self):
        with self.assertRaises(HTTPException) as error:
            self.route['criar_procedimento'](self.payload(procedimento_generico_id=20, especialidade='05', forma_cobranca='INTERVENCAO'), SimpleNamespace(clinica_id=13), self.db)
        self.assertEqual(error.exception.detail, 'Campo Símbolo gráfico não pode ser nulo.')
        self.assertEqual(self.db.commits, 0)
        self.assertEqual(self.db.added, [])

    def test_explicit_creation_has_coherent_local_pair(self):
        data = self.route['criar_procedimento'](self.payload(simbolo_grafico='int_mordida.bmp', procedimento_generico_id=20,
                                                         especialidade='05', forma_cobranca='INTERVENCAO'), SimpleNamespace(clinica_id=13), self.db)
        self.assertEqual((data['simbolo_grafico'], data['simbolo_grafico_legacy_id']), ('int_mordida.bmp', 37))

    def test_custom_local_symbol_without_legacy_allowed(self):
        self.db.rows['Symbol'].append(Symbol(id=2000, clinica_id=13, codigo='own.bmp', legacy_id=None, ativo=True))
        self.assertEqual(self.ns['resolver_referencia_simbolo'](self.db, 13, 'own.bmp'), ('own.bmp', None))

    def test_shared_bitmap_does_not_merge_57_58(self):
        self.db.rows['Symbol'].extend([symbol(57, code='same.bmp'), symbol(58, code='same.bmp')])
        with self.assertRaises(HTTPException):
            self.ns['resolver_referencia_simbolo'](self.db, 13, 'same.bmp')
        self.assertEqual(self.ns['resolver_referencia_simbolo'](self.db, 13, 'same.bmp', 58), ('same.bmp', 58))

    def test_inheritance_never_fills_half_pair(self):
        self.proc.simbolo_grafico_legacy_id = None
        self.assertFalse(self.ns['herdar_simbolo_se_vazio'](self.db, 13, self.proc, 'int_mordida.bmp', 37))
        self.assertEqual((self.proc.simbolo_grafico, self.proc.simbolo_grafico_legacy_id), ('int_bracket.bmp', None))

    def test_inheritance_never_overwrites_existing_pair(self):
        self.assertFalse(self.ns['herdar_simbolo_se_vazio'](self.db, 13, self.proc, 'int_mordida.bmp', 37))
        self.assertEqual(self.proc.simbolo_grafico_legacy_id, 22)

    def test_inheritance_empty_resolves_whole_local_pair(self):
        self.proc.simbolo_grafico = self.proc.simbolo_grafico_legacy_id = None
        self.assertTrue(self.ns['herdar_simbolo_se_vazio'](self.db, 13, self.proc, 'int_mordida.bmp', 37))
        self.assertEqual(self.proc.simbolo_grafico_legacy_id, 37)

    def test_inheritance_foreign_only_leaves_empty(self):
        self.proc.simbolo_grafico = self.proc.simbolo_grafico_legacy_id = None
        self.db.rows['Symbol'] = [symbol(37, clinic=15, code='int_mordida.bmp')]
        self.assertFalse(self.ns['herdar_simbolo_se_vazio'](self.db, 13, self.proc, 'int_mordida.bmp', 37))
        self.assertIsNone(self.proc.simbolo_grafico)

    def test_copy_preserves_both_fields_same_clinic(self):
        self.route['_copiar_procedimentos_entre_tabelas'](self.db, 13, 78, 79)
        self.assertEqual(len(self.db.added), 1)
        copied = self.db.added[0]
        self.assertEqual((copied.simbolo_grafico, copied.simbolo_grafico_legacy_id, copied.clinica_id), ('int_bracket.bmp', 22, 13))
        self.assertEqual(self.proc.simbolo_grafico_legacy_id, 22)

    def test_copy_rejects_missing_local_catalog_before_add(self):
        self.db.rows['Symbol'] = [symbol(clinic=15)]
        with self.assertRaises(HTTPException):
            self.route['_copiar_procedimentos_entre_tabelas'](self.db, 13, 78, 79)
        self.assertFalse(self.db.added)

    def test_seed_actual_upsert_preserves_pair(self):
        ns = helpers()
        ns.update({'Session': object, 'Procedimento': Proc, 'clinica_id': 13,
                   'TABELAS_PROCEDIMENTOS_INICIAIS': [{'nome': 'Brana', 'codigo': 4, 'nro_indice': 255, 'fonte_pagadora': 'particular'}],
                   'PRIVATE_TABLE_NAME': 'Brana', '_nome_norm': lambda s: s.lower(),
                   '_garantir_tabela_por_nome_ou_codigo': lambda *a, **k: 78,
                   'get_procedimentos_brana_padrao': lambda: [{'codigo': 10, 'nome': 'Test'}],
                   'get_procedimentos_easy_por_tabela': lambda: {}})
        load_functions('seeds/procedimentos_padrao.py', ns,
                       {'_sanitizar_procedimento_para_nova_conta', '_garantir_tabelas_procedimentos_iniciais', 'seed_procedimentos'})
        self.assertEqual(ns['seed_procedimentos'](self.db, 13), 0)
        self.assertEqual((self.proc.simbolo_grafico, self.proc.simbolo_grafico_legacy_id), ('int_bracket.bmp', 22))
        self.assertEqual(ns['seed_procedimentos'](self.db, 13), 0)

    def test_seed_new_creation_still_has_optional_symbol(self):
        ns = helpers()
        ns.update({'Session': object})
        load_functions('seeds/procedimentos_padrao.py', ns, {'_sanitizar_procedimento_para_nova_conta'})
        row = ns['_sanitizar_procedimento_para_nova_conta']({'codigo': 10, 'nome': 'Test', 'simbolo_grafico': 'wrong'})
        self.assertIsNone(row['simbolo_grafico'])
        self.assertIsNone(row['simbolo_grafico_legacy_id'])

    def test_signup_existing_particular_is_not_overwritten(self):
        ns = helpers()
        # Column.scalar is not needed: use a minimal first table-id query wrapper.
        class SignupDB(DB):
            def query(self, cls):
                if isinstance(cls, Column):
                    return SimpleNamespace(filter=lambda *a: SimpleNamespace(scalar=lambda: 78))
                return super().query(cls)
        db = SignupDB(Proc=[self.proc], Generic=[], Symbol=[])
        ns.update({'Procedimento': Proc, 'ProcedimentoTabela': Table, 'ProcedimentoGenerico': Generic,
                   'PRIVATE_TABLE_CODE': 4, 'PRIVATE_TABLE_NAME': 'Brana'})
        load_functions('services/signup_service.py', ns, {'_upsert_procedimentos_particular_na_clinica'})
        before = copy.deepcopy(vars(self.proc))
        ns['_upsert_procedimentos_particular_na_clinica'](db, 13, {'procedimentos': [{'codigo': 10, 'nome': 'Seed null'}]})
        self.assertEqual(vars(self.proc), before)

    def test_separator_delete_sql_excludes_symbol_bearing_rows(self):
        tree = ast.parse((BACKEND / 'services/signup_service.py').read_text(encoding='utf-8-sig'))
        fn = next(x for x in tree.body if isinstance(x, ast.FunctionDef) and x.name == 'separar_tabela_exemplo_particular_todas_clinicas')
        delete_sql = [node.value for node in ast.walk(fn) if isinstance(node, ast.Constant)
                      and isinstance(node.value, str) and node.value.startswith('DELETE FROM procedimento ')]
        self.assertEqual(len(delete_sql), 2)
        for sql in delete_sql:
            self.assertIn('clinica_id = :cid', sql)
            self.assertIn("AND (simbolo_grafico IS NULL OR btrim(simbolo_grafico) = '')", sql)
            self.assertIn('AND simbolo_grafico_legacy_id IS NULL', sql)

    def test_legacy_procedure_writers_no_longer_assign_code_alone(self):
        tree = ast.parse((BACKEND / 'services/procedimentos_legado_service.py').read_text(encoding='utf-8'))
        for fn in tree.body:
            if isinstance(fn, ast.FunctionDef) and fn.name in {'_backfill_campos_procedimentos_por_generico', 'garantir_metadados_tabela_particular'}:
                writes = [target.attr for node in ast.walk(fn) if isinstance(node, ast.Assign)
                          for target in node.targets if isinstance(target, ast.Attribute)
                          and isinstance(target.value, ast.Name) and target.value.id == 'proc'
                          and target.attr.startswith('simbolo_grafico')]
                self.assertFalse(writes)
                self.assertIn('herdar_simbolo_se_vazio', ast.unparse(fn))

    def test_wrong_procedure_clinic_rejected(self):
        self.proc.clinica_id = 15
        with self.assertRaises(HTTPException):
            self.ns['referencia_simbolo_payload'](self.db, 13, self.payload(), self.proc)

    def test_legacy_generic_from_other_clinic_not_inherited(self):
        self.proc.simbolo_grafico = self.proc.simbolo_grafico_legacy_id = None
        self.assertFalse(self.ns['herdar_simbolo_se_vazio'](self.db, 15, self.proc, 'int_bracket.bmp', 22))

    def test_negative_legacy_rejected(self):
        with self.assertRaises(HTTPException):
            self.ns['resolver_referencia_simbolo'](self.db, 13, 'int_bracket.bmp', -22)

    def test_code_cleared_with_positive_legacy_is_inconsistent(self):
        with self.assertRaises(HTTPException):
            self.ns['referencia_simbolo_payload'](self.db, 13, self.payload(simbolo_grafico=None, simbolo_grafico_legacy_id=22), self.proc)

    def test_same_bitmap_explicit_identity_change_is_not_deduplicated(self):
        self.proc.simbolo_grafico, self.proc.simbolo_grafico_legacy_id = 'same.bmp', 57
        self.db.rows['Symbol'].extend([symbol(57, code='same.bmp'), symbol(58, code='same.bmp')])
        pair = self.ns['referencia_simbolo_payload'](self.db, 13, self.payload(simbolo_grafico='same.bmp', simbolo_grafico_legacy_id=58), self.proc)
        self.assertEqual(pair, ('same.bmp', 58))

    def test_actual_tenant_loader_rejects_other_clinic(self):
        ns = {'HTTPException': HTTPException, 'Session': object, 'Procedimento': Proc}
        load_functions('routes/procedimentos_routes.py', ns, {'_load_proc_or_404'})
        self.proc.clinica_id = 15
        with self.assertRaises(HTTPException) as error:
            ns['_load_proc_or_404'](self.db, 13, self.proc.id)
        self.assertEqual(error.exception.status_code, 404)

    def test_authentication_and_module_dependency_not_removed(self):
        source = (BACKEND / 'routes/procedimentos_routes.py').read_text(encoding='utf-8-sig')
        self.assertIn('dependencies=[Depends(require_module_access("procedimentos"))]', source)
        tree = ast.parse(source)
        for fn in tree.body:
            if isinstance(fn, ast.FunctionDef) and fn.name in {'criar_procedimento', 'atualizar_procedimento'}:
                self.assertIn('Depends(get_current_user)', ast.unparse(fn.args))

    def test_revoked_generic_backfill_cannot_restore_local_symbol_or_fields(self):
        tree = ast.parse((BACKEND / 'services/procedimentos_legado_service.py').read_text(encoding='utf-8'))
        names = {node.name for node in tree.body if isinstance(node, ast.FunctionDef)}
        self.assertNotIn('_backfill_campos_procedimentos_por_generico', names)
        writer = next(node for node in tree.body if isinstance(node, ast.FunctionDef)
                      and node.name == 'garantir_metadados_tabela_particular')
        self.assertNotIn('_backfill_campos_procedimentos_por_generico', ast.unparse(writer))
        generic_reads = {node.attr for node in ast.walk(writer) if isinstance(node, ast.Attribute)
                         and isinstance(node.value, ast.Name) and node.value.id == 'generico_local'}
        self.assertEqual(generic_reads, {'id'})  # Association identity only, never cadastral defaults.


if __name__ == '__main__':
    unittest.main()
