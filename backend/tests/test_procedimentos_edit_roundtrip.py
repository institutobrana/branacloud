"""Actual route/schema/association/composition ASTs, no DB/runtime imports.

All mutable tests use an in-memory ORM. No SQLite, PostgreSQL, .env or bootstrap.
"""
import ast
import copy
import unittest
import unicodedata
from datetime import datetime
from pathlib import Path
from types import SimpleNamespace
from typing import Any

from fastapi import HTTPException, Query as ApiQuery
from pydantic import BaseModel, Field, ValidationError

ROOT = Path(__file__).resolve().parents[1]


class Column:
    def __init__(self, owner, name):
        self.owner, self.name = owner, name

    def value(self, row):
        return getattr(row[self.owner], self.name, None)

    def __eq__(self, value):
        return lambda row: self.value(row) == (value.value(row) if isinstance(value, Column) else value)

    def __ne__(self, value):
        return lambda row: not (self == value)(row)

    def in_(self, values):
        return lambda row: self.value(row) in values

    def is_(self, value):
        return self == value

    def has(self, **values):
        return lambda row: all(getattr(self.value(row), key, None) == value for key, value in values.items())

    def asc(self):
        return self


def model(name, fields):
    result = type(name, (SimpleNamespace,), {})
    for field in fields.split():
        setattr(result, field, Column(name, field))
    return result


Proc = model('Proc', 'id clinica_id tabela_id codigo nome especialidade procedimento_generico_id')
Table = model('Table', 'id codigo clinica_id')
Generic = model('Generic', 'id codigo clinica_id')
Symbol = model('Symbol', 'id codigo legacy_id clinica_id ativo')
Phase = model('Phase', 'id procedimento_id clinica_id sequencia')
GenericPhase = model('GenericPhase', 'id procedimento_generico_id clinica_id sequencia')
Material = model('Material', 'id codigo lista')
Link = model('Link', 'id procedimento_id material_id clinica_id')
GenericLink = model('GenericLink', 'id procedimento_generico_id material_id clinica_id')
Scenario = model('Scenario', 'id clinica_id')


class Query:
    def __init__(self, db, entities):
        self.db, self.entities = db, entities
        first = entities[0]
        self.owner = first.owner if isinstance(first, Column) else first.__name__
        self.rows = [{self.owner: row} for row in db.rows.get(self.owner, [])]
        if len(entities) > 1:
            self.join(entities[1])

    def filter(self, *conditions):
        self.rows = [row for row in self.rows if all(check(row) for check in conditions)]
        return self

    def join(self, entity, *args):
        if entity is Material and self.owner in ('Link', 'GenericLink'):
            self.rows = [{**row, 'Material': mat} for row in self.rows
                         for mat in self.db.rows['Material'] if row[self.owner].material_id == mat.id]
        return self

    def order_by(self, *columns):
        if columns:
            self.rows.sort(key=lambda row: tuple(col.value(row) for col in columns))
        return self

    def all(self):
        first = self.entities[0]
        if isinstance(first, Column):
            return [(first.value(row),) for row in self.rows]
        if len(self.entities) > 1:
            return [tuple(row[entity.__name__] for entity in self.entities) for row in self.rows]
        return [row[self.owner] for row in self.rows]

    def first(self):
        rows = self.all()
        return rows[0] if rows else None

    def delete(self, **kwargs):
        targets = [row[self.owner] for row in self.rows]
        self.db.rows[self.owner] = [row for row in self.db.rows.get(self.owner, [])
                                   if all(row is not target for target in targets)]
        self.db.events.append(('delete', self.owner, len(targets)))
        return len(targets)

    def update(self, values, **kwargs):
        for row in self.rows:
            for key, value in values.items():
                setattr(row[self.owner], key, value)
        self.db.events.append(('update', self.owner, len(self.rows)))
        return len(self.rows)


class DB:
    def __init__(self, rows):
        self.rows, self.events = rows, []

    def query(self, *entities):
        return Query(self, entities)

    def add(self, row):
        if not isinstance(getattr(row, 'id', None), int):
            row.id = 9000 + len(self.events)
        self.rows.setdefault(type(row).__name__, []).append(row)
        self.events.append(('add', type(row).__name__))

    def commit(self):
        self.events.append(('commit',))

    def delete(self, row):
        owner = type(row).__name__
        self.rows[owner] = [item for item in self.rows[owner] if item is not row]
        self.events.append(('delete', owner, 1))

    def flush(self):
        for proc in self.rows.get('Proc', []):
            if not hasattr(proc, 'lucro_hora'):
                proc.lucro_hora = 0.  # ORM/database default on newly inserted rows.
            if not hasattr(proc, 'mostrar_simbolo'):
                proc.mostrar_simbolo = False  # Retained legacy column default, not rendering control.

    def refresh(self, row):
        pass


def load(path, ns, names=None):
    tree = ast.parse((ROOT / path).read_text(encoding='utf-8-sig'))
    nodes = []
    for node in tree.body:
        if isinstance(node, (ast.FunctionDef, ast.ClassDef)) and (names is None or node.name in names):
            node.decorator_list = []
            nodes.append(node)
    exec(compile(ast.fix_missing_locations(ast.Module(body=nodes, type_ignores=[])), str(path), 'exec'), ns)


def environment(linked=True, clinic_id=1):
    proc = Proc(id=701, clinica_id=clinic_id, tabela_id=88, codigo=1, nome='Teste', tempo=30,
                preco=100., custo=17., custo_lab=45., lucro_hora=4., especialidade='05',
                procedimento_generico_id=20 if linked else None, simbolo_grafico='sim_outras.bmp',
                simbolo_grafico_legacy_id=58, mostrar_simbolo=False, garantia_meses=12,
                forma_cobranca='INTERVENCAO', valor_repasse=25., preferido=True, inativo=True,
                observacoes='Nota', data_inclusao='01/01/2026', data_alteracao='02/01/2026')
    sibling = copy.deepcopy(proc)
    sibling.id = 702
    foreign = copy.deepcopy(proc)
    foreign.id, foreign.clinica_id = 703, 4
    gen = Generic(id=20, clinica_id=clinic_id, tempo=30, custo_lab=45., especialidade='05',
                  simbolo_grafico='sim_outras.bmp', simbolo_grafico_legacy_id=58,
                  mostrar_simbolo=True, observacoes='Genérico A')
    rows = {'Proc': [proc, sibling, foreign], 'Generic': [gen, Generic(**{**vars(gen), 'id': 21})],
            'Table': [Table(id=88, codigo=4, clinica_id=clinic_id, inativo=False)],
            'Symbol': [Symbol(id=1000+i, clinica_id=clinic_id, legacy_id=i, ativo=True,
                              codigo='int_raspagem.bmp' if i == 81 else 'sim_outras.bmp') for i in (57, 58, 81)],
            'Phase': [Phase(id=300, clinica_id=clinic_id, procedimento_id=701, codigo='OLD', descricao='Anterior', sequencia=1, tempo=7)],
            'GenericPhase': [GenericPhase(id=400+i, clinica_id=clinic_id, procedimento_generico_id=g,
                                         codigo=code, descricao=code, sequencia=i, tempo=15)
                             for i, (g, code) in enumerate([(20, 'A1'), (20, 'A2'), (20, 'A3'), (21, 'B1'), (21, 'B2')], 1)],
            'Material': [Material(id=i, codigo=f'M{i}', nome=f'Material {i}', lista=SimpleNamespace(clinica_id=clinic_id),
                                  custo=2., preco=3., relacao=1.) for i in range(1, 14)],
            'Link': [Link(id=i, clinica_id=clinic_id, procedimento_id=701, material_id=i, quantidade=5.) for i in range(1, 11)],
            'GenericLink': [GenericLink(id=100+i, clinica_id=clinic_id, procedimento_generico_id=20, material_id=i, quantidade=1.) for i in range(1, 12)]}
    db = DB(rows)
    ns = dict(HTTPException=HTTPException, BaseModel=BaseModel, Field=Field, Session=object, Usuario=object,
              Depends=lambda f: None, get_current_user=lambda: None, get_db=lambda: None, datetime=datetime,
              unicodedata=unicodedata, Any=Any, Procedimento=Proc, ProcedimentoTabela=Table,
              ProcedimentoGenerico=Generic, SimboloGrafico=Symbol, ProcedimentoFase=Phase,
              ProcedimentoGenericoFase=GenericPhase, ProcedimentoMaterial=Link,
              ProcedimentoGenericoMaterial=GenericLink, Material=Material,
              SYMBOL_FIELDS=frozenset({'simbolo_grafico', 'simbolo_grafico_legacy_id'}),
              FORMAS_COBRANCA_PADRAO={'INTERVENCAO': 'Intervenção', 'ELEMENTO_FACE': 'Elemento / Face'},
              ORIGEM_PROPRIO='proprio', ORIGEM_HERDADO='herdado',
              _garantir_tabelas_clinica=lambda *a: None, _proc_codigo_em_uso=lambda *a, **k: False,
              _listar_especialidades=lambda d, clinic: [{'codigo': '05'}, {'codigo': '06'}] if clinic == clinic_id else [])
    load('services/procedimento_symbol_service.py', ns)
    load('services/vinculos_materiais.py', ns)
    ns['compor_materiais_vinculados_procedimento_service'] = ns['compor_materiais_vinculados_procedimento']
    load('routes/procedimentos_routes.py', ns, {
        'ProcedimentoPayload', 'VinculoPayload', 'VinculoUpdatePayload', '_chave_ordenacao',
        '_normalizar_especialidade', '_normalizar_forma_cobranca', '_resolver_tabela_id',
        '_load_tabela_or_404', '_validar_tabela_ativa', '_load_proc_or_404', '_codigo_tabela_do_procedimento',
        '_procedimento_to_dict', '_listar_fases_vinculadas', '_procedimento_com_vinculos',
        '_aplicar_fases_procedimento_generico',
        '_campos_procedimento_explicitos', '_validar_campos_edicao', 'criar_procedimento',
        'atualizar_procedimento', 'atualizar_vinculo_por_codigo', 'desvincular_por_codigo'})
    return ns, db, proc


def load_generic_editor(ns, db):
    # Only AST definitions: no app import, bootstrap, credentials or DB engine.
    guard_tree = ast.parse((ROOT / 'services/historical_neutral_guard_service.py').read_text(encoding='utf-8'))
    constants = [node for node in guard_tree.body if isinstance(node, ast.Assign)
                 and any(isinstance(t, ast.Name) and t.id in {'NEUTRAL_CODE', 'NEUTRAL_NAME'} for t in node.targets)]
    exec(compile(ast.Module(body=constants, type_ignores=[]), 'historical-neutral constants', 'exec'), ns)
    load('services/historical_neutral_guard_service.py', ns, {'is_protected_historical_generic'})
    for generic in db.rows['Generic']:
        generic.codigo, generic.descricao = f'{generic.id:04d}', f'Genérico {generic.id}'
        generic.peso, generic.inativo = 0., False
        generic.data_inclusao, generic.data_alteracao = '01/01/2026', ''
        generic.fases = [row for row in db.rows['GenericPhase'] if row.procedimento_generico_id == generic.id]
        generic.materiais_vinculados = [row for row in db.rows['GenericLink'] if row.procedimento_generico_id == generic.id]
    ns['_procedimento_generico_to_dict'] = lambda item, **kwargs: dict(vars(item))
    load('routes/cadastros_routes.py', ns, {
        'ProcedimentoGenericoPayload', 'ProcedimentoGenericoFasePayload', 'ProcedimentoGenericoMaterialPayload',
        '_norm_codigo_procedimento_generico', '_material_clinica_or_404',
        '_snapshot_fases_procedimento_generico', '_snapshot_fases_payload',
        '_snapshot_materiais_procedimento_generico', '_snapshot_materiais_payload',
        '_sync_procedimento_generico_fases', '_sync_procedimento_generico_materiais', 'editar_procedimento_generico'})
    ns['ProcedimentoGenericoPayload'].model_rebuild(_types_namespace=ns)


class RoundtripTests(unittest.TestCase):
    def setUp(self):
        self.ns, self.db, self.proc = environment()
        self.user = SimpleNamespace(clinica_id=1)

    def save(self, **fields):
        generics, siblings = copy.deepcopy(self.db.rows['Generic']), copy.deepcopy(self.db.rows['Proc'][1:])
        payload = self.ns['ProcedimentoPayload'](codigo=1, nome='Teste', tabela_id='4', **fields)
        saved = self.ns['atualizar_procedimento'](701, payload, self.user, self.db)
        reloaded = self.ns['_procedimento_com_vinculos'](self.db, self.proc)
        self.assertEqual(saved, reloaded)
        self.assertEqual(self.db.rows['Generic'], generics, 'Local save must not mutate a Generic')
        self.assertEqual(self.db.rows['Proc'][1:], siblings, 'Local save must not mutate siblings/other tenants')
        return reloaded

    def test_name_only_preserves_all_omitted_fields_and_relations(self):
        before = copy.deepcopy(vars(self.proc))
        phases, own = copy.deepcopy(self.db.rows['Phase']), copy.deepcopy(self.db.rows['Link'])
        self.ns['atualizar_procedimento'](701, self.ns['ProcedimentoPayload'](codigo=1, nome='Novo nome'), self.user, self.db)
        for key, value in before.items():
            if key not in {'nome', 'data_alteracao'}:
                self.assertEqual(getattr(self.proc, key), value, key)
        self.assertEqual(self.db.rows['Phase'], phases)
        self.assertEqual(self.db.rows['Link'], own)
        self.assertFalse(any(event[0] in ('delete', 'update', 'add') for event in self.db.events))

    def test_time_lab_edit_and_zero_are_local_with_distinct_associated_values(self):
        self.proc.custo_lab = 100.
        self.db.rows['Proc'][1].tempo = 60
        self.db.rows['Proc'][1].custo_lab = 200.
        others = copy.deepcopy([vars(row) for row in self.db.rows['Proc'][1:]])
        generics = copy.deepcopy(self.db.rows['Generic'])
        for field, values in [('tempo', [45, 0]), ('custo_lab', [50., 0.])]:
            for value in values:
                with self.subTest(field=field, value=value):
                    result = self.save(**{field: value})
                    self.assertEqual(result[field], value)
                    self.assertEqual(self.db.rows['Generic'], generics)
                    self.assertEqual([vars(row) for row in self.db.rows['Proc'][1:]], others)
        self.assertFalse(any(event[0] in ('delete', 'update', 'add') for event in self.db.events))

    def test_no_generic_edit_zero_remains_local(self):
        self.ns, self.db, self.proc = environment(False)
        with self.assertRaisesRegex(HTTPException, '400'):
            self.save(tempo=0, custo_lab=0)
        self.assertEqual(self.db.events, [])
        self.assertEqual(self.save(procedimento_generico_id=20, tempo=0, custo_lab=0)['custo_lab'], 0)
        self.assertEqual(self.db.rows['Generic'][0].custo_lab, 45)

    def test_code_name_persist_and_empty_name_rejects_before_mutation(self):
        payload = self.ns['ProcedimentoPayload'](codigo=7, nome=' Novo nome ')
        result = self.ns['atualizar_procedimento'](701, payload, self.user, self.db)
        self.assertEqual((result['codigo'], result['nome']), (7, 'Novo nome'))
        self.assertEqual(self.ns['_procedimento_com_vinculos'](self.db, self.proc), result)
        before, events = copy.deepcopy(vars(self.proc)), list(self.db.events)
        with self.assertRaises(HTTPException):
            self.ns['atualizar_procedimento'](701, self.ns['ProcedimentoPayload'](codigo=7, nome='   '), self.user, self.db)
        self.assertEqual(vars(self.proc), before)
        self.assertEqual(self.db.events, events)

    def test_generic_change_explicit_values_prevail_over_new_defaults(self):
        generics = copy.deepcopy(self.db.rows['Generic'])
        others = copy.deepcopy(self.db.rows['Proc'][1:])
        result = self.save(procedimento_generico_id=21, tempo=0, custo_lab=0,
                           especialidade='06', observacoes=None, mostrar_simbolo=False,
                           simbolo_grafico='int_raspagem.bmp', simbolo_grafico_legacy_id=81)
        self.assertEqual((result['tempo'], result['custo_lab']), (0, 0))
        self.assertEqual((result['especialidade'], result['observacoes']), ('06', ''))
        self.assertEqual((result['simbolo_grafico'], result['simbolo_grafico_legacy_id'], result['mostrar_simbolo']), ('int_raspagem.bmp', 81, False))
        self.assertEqual(self.db.rows['Generic'], generics)
        self.assertEqual(self.db.rows['Proc'][1:], others)
        self.assertEqual([phase['codigo'] for phase in result['fases_vinculadas']], ['B1', 'B2'])

    def test_specialty_observations_billing_edit_and_clear(self):
        result = self.save(especialidade='06', observacoes=' Novo texto ', forma_cobranca='ELEMENTO_FACE')
        self.assertEqual((result['especialidade'], result['observacoes'], result['forma_cobranca']), ('06', 'Novo texto', 'ELEMENTO_FACE'))
        for clear in (None, '', '   '):
            before, events = copy.deepcopy(vars(self.proc)), list(self.db.events)
            with self.assertRaises(HTTPException):
                self.save(especialidade=clear, observacoes=clear, forma_cobranca=clear)
            self.assertEqual(vars(self.proc), before)
            self.assertEqual(self.db.events, events)
            self.assertEqual(self.save(observacoes=clear)['observacoes'], '')

    def test_all_booleans_persist_false_and_true(self):
        for value in (True, False, True):
            result = self.save(inativo=value, preferido=value)
            self.assertEqual([result[key] for key in ('inativo', 'preferido')], [value]*2)

    def test_deprecated_flag_ignored_by_procedure_schema_and_writer(self):
        self.assertNotIn('mostrar_simbolo', self.ns['ProcedimentoPayload'].model_fields)
        for historical in (True, False):
            self.proc.mostrar_simbolo = historical
            payload = self.ns['ProcedimentoPayload'](codigo=1, nome='Teste', tabela_id='4', mostrar_simbolo=not historical)
            self.assertNotIn('mostrar_simbolo', payload.model_fields_set)
            result = self.save(mostrar_simbolo=not historical, simbolo_grafico='int_raspagem.bmp', simbolo_grafico_legacy_id=81)
            self.assertEqual(result['mostrar_simbolo'], historical)  # Raw DTO compatibility only.
            self.assertEqual((result['simbolo_grafico'], result['simbolo_grafico_legacy_id']), ('int_raspagem.bmp', 81))

    def test_deprecated_flag_ignored_by_generic_schema_and_writer(self):
        load_generic_editor(self.ns, self.db)
        self.assertNotIn('mostrar_simbolo', self.ns['ProcedimentoGenericoPayload'].model_fields)
        for historical in (True, False):
            generic = self.db.rows['Generic'][0]
            generic.mostrar_simbolo = historical
            before = copy.deepcopy(self.db.rows['Proc'])
            payload = self.ns['ProcedimentoGenericoPayload'](codigo=generic.codigo, descricao='Genérico', mostrar_simbolo=not historical)
            self.assertNotIn('mostrar_simbolo', payload.model_fields_set)
            self.ns['editar_procedimento_generico'](generic.id, payload, self.user, self.db)
            self.assertEqual(generic.mostrar_simbolo, historical)
            self.assertEqual(self.db.rows['Proc'], before)

    def test_historical_metadata_backfill_no_longer_reactivates_flag(self):
        tree = ast.parse((ROOT / 'services/procedimentos_legado_service.py').read_text(encoding='utf-8-sig'))
        assignments = [node for node in ast.walk(tree) if isinstance(node, ast.Attribute)
                       and node.attr == 'mostrar_simbolo' and isinstance(node.ctx, ast.Store)]
        self.assertEqual(assignments, [])
        # Parsing raw historical metadata is intentionally kept for compatibility.
        self.assertTrue([node for node in ast.walk(tree) if isinstance(node, ast.Constant)
                         and node.value == 'mostrar_simbolo'])

    def test_money_and_guarantee_edit_zero_and_precision(self):
        for value in (1750.90, 0.):
            result = self.save(preco=value, valor_repasse=value, garantia_meses=0 if value == 0 else 24)
            self.assertEqual(result['preco'], value)
            self.assertEqual(result['valor_repasse'], value)
            self.assertEqual(result['garantia_meses'], 0 if value == 0 else 24)

    def test_invalid_money_is_rejected_before_any_mutation(self):
        for field in ('preco', 'valor_repasse', 'custo_lab', 'custo'):
            for value in ('abc', None, float('nan'), float('inf')):
                with self.subTest(field=field, value=value), self.assertRaises(ValidationError):
                    self.ns['ProcedimentoPayload'](codigo=1, nome='Teste', **{field: value})
        self.assertEqual(self.db.events, [])

    def test_invalid_new_specialty_and_billing_are_rejected(self):
        before = copy.deepcopy(vars(self.proc))
        for fields in ({'especialidade': '99'}, {'forma_cobranca': 'other'}):
            with self.assertRaises(HTTPException):
                self.save(**fields)
        self.assertEqual(vars(self.proc), before)
        self.assertEqual(self.db.events, [])

    def test_symbol_57_58_81_change_clear_no_inheritance_and_show_false(self):
        for legacy in (57, 58, 81):
            code = 'int_raspagem.bmp' if legacy == 81 else 'sim_outras.bmp'
            result = self.save(simbolo_grafico=code, simbolo_grafico_legacy_id=legacy, mostrar_simbolo=False)
            self.assertEqual((result['simbolo_grafico'], result['simbolo_grafico_legacy_id'], result['mostrar_simbolo']), (code, legacy, False))
        before = copy.deepcopy(vars(self.proc))
        with self.assertRaises(HTTPException):
            self.save(simbolo_grafico=None, simbolo_grafico_legacy_id=None)
        self.assertEqual(vars(self.proc), before)
        self.assertEqual(self.save(procedimento_generico_id=21)['simbolo_grafico'], 'int_raspagem.bmp')

    def test_associate_A_then_change_B_replaces_all_phases_not_materials(self):
        self.proc.procedimento_generico_id = None
        own = copy.deepcopy(self.db.rows['Link'])
        result = self.save(procedimento_generico_id=20)
        self.assertEqual([phase['codigo'] for phase in result['fases_vinculadas']], ['A1', 'A2', 'A3'])
        result = self.save(procedimento_generico_id=21)
        self.assertEqual([phase['codigo'] for phase in result['fases_vinculadas']], ['B1', 'B2'])
        self.assertEqual(self.db.rows['Link'], own)
        ids = [phase.id for phase in self.db.rows['Phase']]
        self.save(observacoes='Só texto')
        self.assertEqual([phase.id for phase in self.db.rows['Phase']], ids)

    def test_new_generic_with_no_phases_replaces_with_empty(self):
        self.db.rows['GenericPhase'] = []
        self.assertEqual(self.save(procedimento_generico_id=21)['fases_vinculadas'], [])

    def test_unlink_blocked_preserves_values_phases_own_and_no_sync(self):
        before = copy.deepcopy(vars(self.proc))
        phases, own = copy.deepcopy(self.db.rows['Phase']), copy.deepcopy(self.db.rows['Link'])
        with self.assertRaises(HTTPException):
            self.save(procedimento_generico_id=None)
        self.assertEqual(vars(self.proc), before)
        self.assertEqual(self.db.rows['Phase'], phases)
        self.assertEqual(self.db.rows['Link'], own)
        for key in ('tempo', 'custo_lab', 'especialidade', 'observacoes', 'simbolo_grafico', 'mostrar_simbolo'):
            self.assertEqual(getattr(self.proc, key), before[key])
        self.save(tempo=0, custo_lab=0)
        self.assertEqual(self.db.rows['Generic'][0].tempo, 30)
        self.assertEqual(len(self.ns['_procedimento_com_vinculos'](self.db, self.proc)['materiais_vinculados']['itens']), 11)

    def test_material_union_scenarios_A_B_C_D_E_own_quantity_wins(self):
        own = copy.deepcopy(self.db.rows['Link'])
        result = self.ns['_procedimento_com_vinculos'](self.db, self.proc)['materiais_vinculados']
        self.assertEqual([item['material_id'] for item in result['itens']], list(range(1, 12)))
        self.assertEqual(result['itens'][0]['quantidade'], 5.)
        self.assertEqual(result['total_custo'], 102.)  # 10 own * 5 * 2 + inherited 11 * 1 * 2
        for ids in (range(1, 9), [*range(1, 11), 12, 13]):
            self.db.rows['GenericLink'] = [GenericLink(id=i+200, clinica_id=1, procedimento_generico_id=21,
                                                      material_id=i, quantidade=2.) for i in ids]
            result = self.save(procedimento_generico_id=21)['materiais_vinculados']['itens']
            expected = sorted(set(range(1, 11)) | set(ids))
            self.assertEqual(sorted(item['material_id'] for item in result), expected)
            self.assertEqual(len(result), len(expected))
            self.assertNotIn(11, [item['material_id'] for item in result])
            self.assertEqual(self.db.rows['Link'], own)

    def test_own_quantity_and_removal_persist_without_changing_generic(self):
        generic = copy.deepcopy(self.db.rows['GenericLink'])
        self.ns['atualizar_vinculo_por_codigo'](701, 'M1', self.ns['VinculoUpdatePayload'](quantidade=7), self.user, self.db)
        self.assertEqual(self.db.rows['Link'][0].quantidade, 7)
        self.ns['desvincular_por_codigo'](701, 'M1', self.user, self.db)
        self.assertFalse(any(row.material_id == 1 for row in self.db.rows['Link']))
        item = next(row for row in self.ns['_procedimento_com_vinculos'](self.db, self.proc)['materiais_vinculados']['itens'] if row['material_id'] == 1)
        self.assertEqual((item['origem'], item['quantidade']), ('herdado', 1.))
        self.assertEqual(self.db.rows['GenericLink'], generic)

    def test_create_defaults_and_explicit_clear_zero_false_precedence(self):
        for explicit in (False, True):
            ns, db, proc = environment()
            values = {'tempo': 0, 'custo_lab': 0, 'observacoes': '', 'mostrar_simbolo': False} if explicit else {}
            payload = ns['ProcedimentoPayload'](codigo=90, nome='Novo', tabela_id='4', procedimento_generico_id=20,
                                               especialidade='06', simbolo_grafico='int_raspagem.bmp',
                                               simbolo_grafico_legacy_id=81, forma_cobranca='INTERVENCAO', **values)
            result = ns['criar_procedimento'](payload, self.user, db)
            self.assertEqual((result['tempo'], result['custo_lab']), (0, 0.))
            self.assertEqual((result['especialidade'], result['observacoes']), ('06', ''))
            self.assertEqual((result['simbolo_grafico'], result['simbolo_grafico_legacy_id']), ('int_raspagem.bmp', 81))
            self.assertFalse(result['mostrar_simbolo'])
            self.assertEqual((db.rows['Generic'][0].tempo, db.rows['Generic'][0].custo_lab), (30, 45.))
            self.assertEqual([phase['codigo'] for phase in result['fases_vinculadas']], ['A1', 'A2', 'A3'])
            self.assertEqual(len(db.rows['Link']), 10)

    def test_tenant_and_relations_reject_before_mutation(self):
        for field, value in [('procedimento_generico_id', 99), ('simbolo_grafico_legacy_id', 99)]:
            self.db.rows['Generic'].append(Generic(id=99, clinica_id=4))
            self.db.rows['Symbol'].append(Symbol(id=1999, codigo='foreign.bmp', legacy_id=99, clinica_id=4, ativo=True))
            with self.assertRaises(HTTPException):
                self.save(**{field: value})
        with self.assertRaises(HTTPException):
            self.ns['atualizar_procedimento'](701, self.ns['ProcedimentoPayload'](codigo=1, nome='Teste'), SimpleNamespace(clinica_id=4), self.db)
        self.assertEqual(self.db.events, [])

    def test_audit_dates_not_user_editable(self):
        payload = self.ns['ProcedimentoPayload'](codigo=1, nome='Teste', data_inclusao='forged', data_alteracao='forged')
        result = self.ns['atualizar_procedimento'](701, payload, self.user, self.db)
        self.assertEqual(result['data_inclusao'], '01/01/2026')
        self.assertNotEqual(result['data_alteracao'], 'forged')

    def test_association_preserves_all_local_fields_even_empty_zero_false(self):
        self.proc.procedimento_generico_id = None
        for key in ('tempo', 'custo_lab', 'preco', 'custo', 'valor_repasse', 'garantia_meses'):
            setattr(self.proc, key, 0)
        for key in ('especialidade', 'observacoes', 'simbolo_grafico', 'simbolo_grafico_legacy_id', 'forma_cobranca'):
            setattr(self.proc, key, None)
        for key in ('mostrar_simbolo', 'preferido', 'inativo'):
            setattr(self.proc, key, False)
        before = copy.deepcopy(vars(self.proc))
        for generic_id in (20, 21):
            # The association helper must not inherit cadastral fields; the API
            # separately rejects incomplete resulting cadastros in R2.
            self.proc.procedimento_generico_id = generic_id
            self.ns['_aplicar_fases_procedimento_generico'](self.db, 1, self.proc)
            for key, value in before.items():
                if key not in {'procedimento_generico_id', 'data_alteracao'}:
                    self.assertEqual(getattr(self.proc, key), value, key)

    def test_own_material_edits_preserve_other_associated_own_list(self):
        sibling_link = Link(id=99, clinica_id=1, procedimento_id=702, material_id=1, quantidade=9.)
        self.db.rows['Link'].append(sibling_link)
        before = copy.deepcopy(vars(sibling_link))
        generic_links = copy.deepcopy(self.db.rows['GenericLink'])
        self.ns['atualizar_vinculo_por_codigo'](701, 'M1', self.ns['VinculoUpdatePayload'](quantidade=7), self.user, self.db)
        self.ns['desvincular_por_codigo'](701, 'M1', self.user, self.db)
        self.assertEqual(vars(sibling_link), before)
        self.assertEqual(self.db.rows['GenericLink'], generic_links)
        inherited = next(row for row in self.save()['materiais_vinculados']['itens'] if row['material_id'] == 1)
        self.assertEqual((inherited['origem'], inherited['quantidade']), ('herdado', 1.))

    def test_material_A_B_C_D_E_union_switch_and_collision(self):
        self.db.rows['Link'] = self.db.rows['Link'][:3]  # Own A,B,C, quantity 5.
        self.db.rows['GenericLink'] = [GenericLink(id=100+i, clinica_id=1, procedimento_generico_id=20,
                                                  material_id=i, quantidade=2.) for i in (1, 2, 4)]
        own = copy.deepcopy(self.db.rows['Link'])
        compose = lambda: self.ns['_procedimento_com_vinculos'](self.db, self.proc)['materiais_vinculados']['itens']
        self.assertEqual([row['material_id'] for row in compose()], [1, 2, 3, 4])
        self.assertEqual([row['quantidade'] for row in compose()], [5., 5., 5., 2.])
        self.db.rows['GenericLink'].extend(GenericLink(id=200+i, clinica_id=1, procedimento_generico_id=21,
                                                      material_id=i, quantidade=3.) for i in (1, 5))
        self.save(procedimento_generico_id=21)
        self.assertEqual([row['material_id'] for row in compose()], [1, 2, 3, 5])
        self.assertEqual(self.db.rows['Link'], own)
        self.db.rows['GenericLink'] = [row for row in self.db.rows['GenericLink'] if row.material_id != 5]
        self.assertEqual([row['material_id'] for row in compose()], [1, 2, 3])
        self.assertEqual(len(compose()), len({row['material_id'] for row in compose()}))

    def test_generic_editor_cadastral_changes_never_propagate(self):
        load_generic_editor(self.ns, self.db)
        procedures = copy.deepcopy(self.db.rows['Proc'])
        own, phases = copy.deepcopy(self.db.rows['Link']), copy.deepcopy(self.db.rows['Phase'])
        generic = self.db.rows['Generic'][0]
        payload = self.ns['ProcedimentoGenericoPayload'](
            codigo=generic.codigo, descricao='Novo genérico', tempo=90, custo_lab=999., especialidade='06',
            observacoes='Texto do genérico', simbolo_grafico='int_raspagem.bmp', mostrar_simbolo=True,
            fases=[vars(row) for row in generic.fases], materiais=[vars(row) for row in generic.materiais_vinculados])
        self.ns['editar_procedimento_generico'](20, payload, self.user, self.db)
        self.assertEqual((generic.tempo, generic.custo_lab), (90, 999.))
        self.assertEqual(self.db.rows['Proc'], procedures)
        self.assertEqual(self.db.rows['Link'], own)
        self.assertEqual(self.db.rows['Phase'], phases)
        self.assertEqual(self.db.events, [('commit',)])

    def test_generic_material_editor_changes_only_dynamic_complements(self):
        load_generic_editor(self.ns, self.db)
        generic = self.db.rows['Generic'][0]
        procedures, own = copy.deepcopy(self.db.rows['Proc']), copy.deepcopy(self.db.rows['Link'])
        payload = self.ns['ProcedimentoGenericoPayload'](
            codigo=generic.codigo, descricao=generic.descricao, tempo=generic.tempo, custo_lab=generic.custo_lab,
            fases=[vars(row) for row in generic.fases],
            materiais=[{'material_id': 1, 'quantidade': 99}, {'material_id': 12, 'quantidade': 2}])
        self.ns['editar_procedimento_generico'](20, payload, self.user, self.db)
        self.assertEqual(self.db.rows['Proc'], procedures)
        self.assertEqual(self.db.rows['Link'], own)
        items = self.ns['_procedimento_com_vinculos'](self.db, self.proc)['materiais_vinculados']['itens']
        self.assertEqual([row['material_id'] for row in items], [*range(1, 11), 12])
        self.assertEqual(items[0]['quantidade'], 5.)  # Own remains authoritative, not 99.
        self.assertEqual((items[-1]['origem'], items[-1]['quantidade']), ('herdado', 2.))
        sibling = self.ns['_procedimento_com_vinculos'](self.db, self.db.rows['Proc'][1])['materiais_vinculados']['itens']
        self.assertEqual([row['material_id'] for row in sibling], [1, 12])
        self.assertFalse(any(row.material_id == 12 for row in self.db.rows['Link']))

    def test_generic_editor_rejects_other_tenant_before_mutation(self):
        load_generic_editor(self.ns, self.db)
        before = copy.deepcopy(self.db.rows)
        payload = self.ns['ProcedimentoGenericoPayload'](codigo='0020', descricao='Sem acesso')
        with self.assertRaises(HTTPException) as error:
            self.ns['editar_procedimento_generico'](20, payload, SimpleNamespace(clinica_id=4), self.db)
        self.assertEqual(error.exception.status_code, 404)
        self.assertEqual(self.db.rows, before)
        self.assertEqual(self.db.events, [])

    def test_dashboard_and_report_use_current_union_not_own_only_or_canonical_cost(self):
        self.ns.update(Cenario=Scenario, Query=ApiQuery, SimpleNamespace=SimpleNamespace,
                       PRIVATE_TABLE_CODE=4, PROC_RELATORIO_CAMPOS=[],
                       dados_indice_por_numero=lambda *args, **kwargs: {},
                       _mapa_especialidades=lambda *args: {})
        self.db.rows['Table'][0].nome, self.db.rows['Table'][0].nro_indice = 'PARTICULAR', 1
        self.db.rows['Proc'][1].codigo = 2
        load('routes/procedimentos_routes.py', self.ns, {
            '_compor_materiais_vinculados_procedimento', '_calcular_financeiro_dashboard',
            '_mapa_preco_particular_por_chave', '_resolver_preco_particular', '_pct', '_ordenar_relatorio_proc',
            'dashboard_lucratividade', 'relatorio_tabela_procedimentos'})
        before = copy.deepcopy(self.db.rows)
        for expected in (102., 108.):
            dashboard = self.ns['dashboard_lucratividade'](self.user, self.db)
            item = next(row for row in dashboard['itens'] if row['id'] == 701)
            report = self.ns['relatorio_tabela_procedimentos']('4', '', 'Código', self.user, self.db)
            row = next(row for row in report['itens'] if row['Código'] == 1)
            self.assertEqual(item['custo_material'], expected)
            self.assertEqual(row['Cst mat (R$)'], expected)
            self.assertEqual((item['tempo'], item['lab']), (30, 45.))
            self.assertEqual(row['Cst prot (R$)'], 45.)
            self.assertEqual(self.db.events, [])  # Both readers are side-effect free in this fixture.
            if expected == 102.:
                self.assertEqual(self.db.rows, before)
                self.db.rows['GenericLink'][-1].quantidade = 4.  # Generic complement changes dynamically.

    def test_association_preserves_partial_symbol_pair_without_completing_it(self):
        self.proc.simbolo_grafico = 'int_raspagem.bmp'
        self.proc.simbolo_grafico_legacy_id = None
        result = self.save(procedimento_generico_id=21)
        self.assertEqual((result['simbolo_grafico'], result['simbolo_grafico_legacy_id']), ('int_raspagem.bmp', None))
        self.assertFalse(result['mostrar_simbolo'])

    def test_legacy_metadata_does_not_inherit_current_or_historical_generic_fields(self):
        self.db.rows['Proc'] = [self.proc]
        generic = self.db.rows['Generic'][0]
        generic.codigo, generic.descricao = '0020', 'Teste'
        self.db.rows['Generic'] = [generic]
        self.proc.tempo, self.proc.custo_lab = 0, 0.
        self.proc.especialidade = self.proc.observacoes = None
        self.proc.simbolo_grafico = self.proc.simbolo_grafico_legacy_id = None
        origin = {'nroproctab': 1, 'codconv': '1', 'descricao': 'Teste'}
        self.ns.update(
            PRIVATE_TABLE_CODE=88, garantir_metadados_procedimentos_genericos=lambda db: None,
            _carregar_particular_csv=lambda: {'por_nro': {1: origin}},
            _carregar_particular_sql_snapshot=lambda: {},
            _parse_tab_gen_item_legado=lambda: [SimpleNamespace(codigo='0020')],
            _parse_mapa_simbolos_legado=lambda: {81: 'int_raspagem.bmp'},
            _backfill_genericos_por_snapshot_particular=lambda *args: 0,
            _norm=lambda value: value.lower().strip(), _norm_strip_qualificadores=lambda value: value.lower().strip(),
            _resolver_origem_particular=lambda *args: origin,
            _resolver_generico=lambda *args: (generic, 81),  # Legacy Generic reference is NOT procedure evidence.
            _MatchGenerico=lambda item, legacy, score: SimpleNamespace(item=item, legacy_id=legacy, score=score),
            _resolver_simbolo_por_descricao=lambda *args: None,
            _mapear_forma_cobranca_easy=lambda value: None,
            _inferir_forma_cobranca=lambda value: 'INTERVENCAO')
        load('services/procedimentos_legado_service.py', self.ns, {'garantir_metadados_tabela_particular'})
        before = copy.deepcopy(self.db.rows)
        self.assertEqual(self.ns['garantir_metadados_tabela_particular'](self.db), 0)
        self.assertEqual(self.db.rows, before)
        self.assertEqual(self.db.events, [])

    def test_no_revoked_cadastral_sync_helper_or_generic_defaults_remain(self):
        revoked = {'_sincronizar_generico_com_procedimento', '_propagar_campos_generico_para_procedimentos',
                   '_backfill_campos_procedimentos_por_generico', '_aplicar_heranca_procedimento_generico'}
        for path in ('routes/procedimentos_routes.py', 'routes/cadastros_routes.py', 'services/procedimentos_legado_service.py'):
            source = (ROOT / path).read_text(encoding='utf-8-sig')
            for name in revoked:
                self.assertNotIn(name, source)
        tree = ast.parse((ROOT / 'routes/procedimentos_routes.py').read_text(encoding='utf-8-sig'))
        association = next(node for node in tree.body if isinstance(node, ast.FunctionDef)
                           and node.name == '_aplicar_fases_procedimento_generico')
        self.assertFalse([node for node in ast.walk(association) if isinstance(node, ast.Attribute)
                          and isinstance(node.value, ast.Name) and node.value.id == 'generico'])

    def test_new_tenants_apply_same_domain_without_productive_clinic_ids(self):
        for clinic_id in (42, 2026):
            with self.subTest(clinic_id=clinic_id):
                self.ns, self.db, self.proc = environment(False, clinic_id=clinic_id)
                self.user = SimpleNamespace(clinica_id=clinic_id)
                own = copy.deepcopy(self.db.rows['Link'])
                result = self.save(procedimento_generico_id=20)
                self.assertEqual([p['codigo'] for p in result['fases_vinculadas']], ['A1', 'A2', 'A3'])
                items = result['materiais_vinculados']['itens']
                self.assertEqual([item['material_id'] for item in items], list(range(1, 12)))
                self.assertEqual((items[0]['origem'], items[0]['quantidade']), ('proprio', 5.))
                self.assertEqual((items[-1]['origem'], items[-1]['quantidade']), ('herdado', 1.))
                self.assertEqual(len(items), len({item['material_id'] for item in items}))
                result = self.save(procedimento_generico_id=21, tempo=45, custo_lab=0,
                                   especialidade='06', observacoes='', forma_cobranca='ELEMENTO_FACE',
                                   simbolo_grafico='int_raspagem.bmp', simbolo_grafico_legacy_id=81,
                                   preferido=False, inativo=False)
                self.assertEqual([p['codigo'] for p in result['fases_vinculadas']], ['B1', 'B2'])
                self.assertEqual([item['material_id'] for item in result['materiais_vinculados']['itens']], list(range(1, 11)))
                self.assertEqual(self.db.rows['Link'], own, 'No Generic material may become an own link')
                self.assertEqual((result['tempo'], result['custo_lab']), (45, 0.))
                self.assertEqual((result['especialidade'], result['observacoes']), ('06', ''))
                self.assertEqual(result['forma_cobranca'], 'ELEMENTO_FACE')
                self.assertEqual((result['simbolo_grafico_legacy_id'], result['mostrar_simbolo']), (81, False))
                self.assertFalse(result['preferido'])
                self.assertFalse(result['inativo'])
                phases = copy.deepcopy(self.db.rows['Phase'])
                self.save(tempo=0)
                self.assertEqual(self.db.rows['Phase'], phases, 'An ordinary save cannot rebuild phases')
                before = copy.deepcopy(self.db.rows)
                with self.assertRaises(HTTPException):
                    self.ns['atualizar_procedimento'](701, self.ns['ProcedimentoPayload'](codigo=1, nome='Teste'),
                                                       SimpleNamespace(clinica_id=4), self.db)
                self.assertEqual(self.db.rows, before)

    def test_domain_functions_have_no_clinic_literal_branch(self):
        functions = {
            'routes/procedimentos_routes.py': {'criar_procedimento', 'atualizar_procedimento',
                                               '_aplicar_fases_procedimento_generico',
                                               'atualizar_vinculo_por_codigo', 'desvincular_por_codigo'},
            'routes/cadastros_routes.py': {'editar_procedimento_generico'},
            'services/vinculos_materiais.py': {'compor_materiais_vinculados_procedimento'},
        }
        def is_clinic(node):
            return ((isinstance(node, ast.Attribute) and node.attr in {'clinica_id', 'clinic_id'})
                    or (isinstance(node, ast.Name) and node.id in {'clinica_id', 'clinic_id'}))
        def is_literal(node):
            return (isinstance(node, ast.Constant) and isinstance(node.value, int)
                    or isinstance(node, (ast.List, ast.Tuple, ast.Set))
                    and any(is_literal(item) for item in node.elts))
        for path, names in functions.items():
            tree = ast.parse((ROOT / path).read_text(encoding='utf-8-sig'))
            found = {node.name: node for node in tree.body if isinstance(node, ast.FunctionDef) and node.name in names}
            self.assertEqual(set(found), names, path)
            for name, function in found.items():
                for node in ast.walk(function):
                    if isinstance(node, ast.Compare):
                        operands = [node.left, *node.comparators]
                        for left, operator, right in zip(operands, node.ops, operands[1:]):
                            if isinstance(operator, (ast.Eq, ast.NotEq, ast.In, ast.NotIn)):
                                self.assertFalse(is_clinic(left) and is_literal(right)
                                                 or is_clinic(right) and is_literal(left), (path, name, node.lineno))


if __name__ == '__main__':
    unittest.main()
