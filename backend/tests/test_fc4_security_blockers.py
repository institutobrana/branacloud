"""Execute actual FC4 routes/services/dependency ASTs with an in-memory ORM.

No application/database imports, environment loading, sockets or real tenants.
HTTP is in-process TestClient; only authentication, lease and token I/O are doubles.
"""
import ast
import copy
import unittest
from collections.abc import Callable
from datetime import date, datetime
from pathlib import Path
from types import SimpleNamespace
from typing import Any

from fastapi import APIRouter, Depends, FastAPI, Header, HTTPException, Query, Request
from fastapi.testclient import TestClient

from backend.schemas import odontograma_schema, orcamento_schema
from backend.security.permissions import get_module_access_level
from backend.tests.test_procedimentos_edit_roundtrip import DB, Query as ORMQuery, load, model


ROOT = Path(__file__).resolve().parents[1]
Treatment = model('Treatment', 'id clinica_id paciente cirurgiao_responsavel cirurgiao_contratado cirurgiao_solicitante cirurgiao_executante')
Intervention = model('Intervention', 'id clinica_id paciente_id tratamento_id status prestador procedimento dentes faces')
Provider = model('Provider', 'id clinica_id')
Slot = model('Slot', 'id clinica_id paciente_id tratamento_id slot_ordem')
Status = model('Status', 'id ordem codigo')


class MemoryQuery(ORMQuery):
    def options(self, *options):
        return self


class MemoryDB(DB):
    def __init__(self, rows):
        super().__init__(rows)
        self.reads = []

    def query(self, *entities):
        self.reads.append(entities[0].__name__)
        return MemoryQuery(self, entities)

    def flush(self):
        self.events.append(('flush',))

    def refresh(self, row):
        self.events.append(('refresh',))


def load_router(path, ns, functions):
    """Keep actual APIRouter dependencies and endpoint decorators, not a copy."""
    tree = ast.parse((ROOT / path).read_text(encoding='utf-8-sig'))
    nodes = [node for node in tree.body if (
        isinstance(node, ast.Assign) and any(isinstance(t, ast.Name) and t.id == 'router' for t in node.targets)
    ) or (isinstance(node, ast.FunctionDef) and node.name in functions)]
    exec(compile(ast.Module(body=nodes, type_ignores=[]), str(path), 'exec'), ns)


def environment():
    status = Status(id=7, codigo='3', descricao='Realizar', ordem=3, ativo=True)
    treatments = [Treatment(id=401, clinica_id=101, paciente_id=301, source_payload={'other': 'keep'}),
                  Treatment(id=402, clinica_id=202, paciente_id=302, source_payload={'other': 'foreign'})]
    interventions = [Intervention(id=601 + i, clinica_id=clinic, paciente_id=301 + i,
                                 tratamento_id=401 + i, prestador_id=701 + i, procedimento_id=801 + i,
                                 status=status, status_id=7, dentes=[], faces=[], data_planejada=None,
                                 data_execucao=None, observacao_resumida=None) for i, clinic in enumerate((101, 202))]
    db = MemoryDB({'Treatment': treatments, 'Intervention': interventions, 'Status': [status],
                   'Slot': [Slot(id=501 + i, clinica_id=clinic, paciente_id=301 + i,
                                 tratamento_id=401 + i, slot_ordem=1, numero_dente_fdi=11,
                                 tipo_slot='permanente', observacao=None) for i, clinic in enumerate((101, 202))],
                   'Provider': [Provider(id=701, clinica_id=101, inativo=False),
                                Provider(id=702, clinica_id=202, inativo=False),
                                Provider(id=703, clinica_id=101, inativo=True),
                                Provider(id=704, clinica_id=101, inativo=False)]})
    users = {key: SimpleNamespace(id=901, clinica_id=101, is_admin=admin,
                                 permissoes_json='{"modules":{"procedimentos":"' + level + '","financeiro":"habilitado"}}')
             for key, admin, level in [('normal', False, 'habilitado'), ('admin', True, 'desabilitado'),
                                       ('disabled', False, 'desabilitado'), ('protected', False, 'protegido')]}
    users['no-finance'] = SimpleNamespace(id=901, clinica_id=101, is_admin=False,
                                        permissoes_json='{"modules":{"procedimentos":"habilitado","financeiro":"desabilitado"}}')

    def current_user(request: Request):
        user = users.get(request.headers.get('Authorization'))
        if user is None:
            raise HTTPException(status_code=401, detail='Synthetic authentication required')
        return user

    def get_db():
        return db

    def lease_owner(session, user, patient_id, instance, token):
        if instance != 'fixture-session' or token != 'fixture-owner':
            raise HTTPException(status_code=423, detail='Synthetic OWNER required')

    grants = {'valid-grant': dict(type='protected_grant', user_id=901, clinica_id=101, module_code='procedimentos'),
              'foreign-grant': dict(type='protected_grant', user_id=901, clinica_id=202, module_code='procedimentos')}
    ns = dict(APIRouter=APIRouter, Depends=Depends, HTTPException=HTTPException, Query=Query,
              Header=Header, Request=Request, Session=object, Usuario=object, Callable=Callable,
              Any=Any, date=date, datetime=datetime, get_current_user=current_user, get_db=get_db,
              get_module_access_level=get_module_access_level, decode_token=grants.get,
              verify_admin_password=lambda session, clinic, password: clinic == 101 and password == 'fixture-password',
              selectinload=lambda *args: None, Tratamento=Treatment, OdontogramaIntervencao=Intervention,
              PrestadorOdonto=Provider, OdontogramaArcadaSlot=Slot, OdontogramaIntervencaoStatus=Status,
              require_clinical_patient_lease_owner=lease_owner)
    for schema in (odontograma_schema, orcamento_schema):
        ns.update({key: value for key, value in vars(schema).items() if key.startswith(('Odontograma', 'Orcamento'))})
    load('security/dependencies.py', ns, {'require_module_access'})
    load('repositories/odontograma_repository.py', ns,
         {'listar_status', 'listar_arcada_slots', 'listar_intervencoes_com_relacoes'})
    load('services/odontograma_service.py', ns,
         {'_to_status_schema', '_to_slot_schema', '_to_dente_schema', '_to_face_schema', '_to_intervencao_schema',
          'listar_status_leitura', 'listar_arcada_slots_leitura', 'listar_intervencoes_leitura', 'montar_resumo_leitura'})
    load_router('routes/odontograma_routes.py', ns,
                {'_resolver_clinica_id', 'status_odontograma', 'resumo_odontograma',
                 'arcada_slots_odontograma', 'intervencoes_odontograma'})
    app = FastAPI()
    app.include_router(ns['router'])
    load('services/orcamento_service.py', ns,
         {'_clean_text', '_clean_float', '_parse_date', '_norm', '_status_map', '_resolver_status_id',
          '_tratamento_or_404', '_intervencao_or_404', '_orcamento_blob', '_save_orcamento_blob',
          'atualizar_intervencao_orcamento'})
    # Budget view/financial calculations are outside this security patch.
    ns['carregar_orcamento'] = lambda *args: copy.deepcopy(treatments[0].source_payload)
    load_router('routes/orcamento_routes.py', ns, {'alterar_intervencao_do_orcamento'})
    app.include_router(ns['router'])
    return ns, db, users, app


class FC4SecurityTests(unittest.TestCase):
    def setUp(self):
        self.ns, self.db, self.users, self.app = environment()

    def get(self, path, role='normal', clinic=101, patient=301, treatment=401, headers=None):
        with TestClient(self.app) as client:
            return client.get('/odontograma/' + path,
                              params=dict(clinica_id=clinic, paciente_id=patient, tratamento_id=treatment),
                              headers={'Authorization': role, **(headers or {})})

    def patch(self, fields, role='normal', treatment=401, intervention=601, lease='fixture-owner'):
        with TestClient(self.app) as client:
            return client.patch(f'/orcamento/tratamentos/{treatment}/intervencoes/{intervention}', json=fields,
                                headers={'Authorization': role, 'X-Session-Instance-Id': 'fixture-session',
                                         'X-Clinical-Lease-Token': lease})

    def test_missing_user_tenant_fails_closed(self):
        for admin in (False, True):
            with self.subTest(admin=admin), self.assertRaises(HTTPException) as error:
                self.ns['_resolver_clinica_id'](SimpleNamespace(is_admin=admin), 101)
            self.assertEqual(error.exception.status_code, 403)

    def test_missing_optional_query_tenant_uses_authenticated_tenant(self):
        for role in ('normal', 'admin'):
            self.assertEqual(self.ns['_resolver_clinica_id'](self.users[role], None), 101)

    def test_all_scoped_routes_keep_query_constraints(self):
        for path in ('resumo', 'arcada-slots', 'intervencoes'):
            for clinic in (0, -1, 'invalid'):
                self.assertEqual(self.get(path, clinic=clinic).status_code, 422)
        self.assertEqual(self.db.reads, [])

    def test_global_admin_module_contract_does_not_authorize_cross_tenant(self):
        self.assertEqual(get_module_access_level(self.users['admin'], 'procedimentos'), 'habilitado')
        self.assertEqual(self.get('resumo', role='admin').status_code, 200)
        self.assertEqual(self.get('resumo', role='admin', clinic=202, patient=302, treatment=402).status_code, 403)

    def test_protected_password_preserves_official_path(self):
        response = self.get('resumo', role='protected', headers={'X-Protected-Password': 'fixture-password'})
        self.assertEqual(response.status_code, 200)

    def test_protected_grant_keeps_tenant_scope(self):
        self.assertEqual(self.get('resumo', role='protected', headers={'X-Protected-Grant': 'valid-grant'}).status_code, 200)
        self.db.reads.clear()
        self.assertEqual(self.get('resumo', role='protected', headers={'X-Protected-Grant': 'foreign-grant'}).status_code, 403)
        self.assertEqual(self.db.reads, [])

    def test_nonexistent_scoped_context_keeps_empty_read_contract(self):
        for path in ('resumo', 'arcada-slots', 'intervencoes'):
            response = self.get(path, patient=9999, treatment=9999)
            self.assertEqual(response.status_code, 200)
            data = response.json()
            if path == 'resumo':
                self.assertEqual(data['resumo']['contagem_intervencoes'], 0)
                self.assertEqual(data['resumo']['arcada_slots'], [])
            else:
                self.assertEqual(data['itens'], [])

    def test_foreign_patient_treatment_ids_never_return_foreign_rows(self):
        for path in ('resumo', 'arcada-slots', 'intervencoes'):
            response = self.get(path, patient=302, treatment=402)
            self.assertEqual(response.status_code, 200)
            data = response.json()
            if path == 'resumo':
                self.assertEqual(data['resumo']['contagem_intervencoes'], 0)
                self.assertEqual(data['resumo']['arcada_slots'], [])
            else:
                self.assertEqual(data['itens'], [])

    def test_budget_provider_valid_same_tenant(self):
        before = copy.deepcopy(self.db.rows)
        response = self.patch({'cirurgiao_id': 704})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(self.db.rows['Intervention'][0].prestador_id, 704)
        self.assertEqual(response.json()['orcamento']['intervencoes']['601']['cirurgiao_id'], 704)
        before['Intervention'][0].prestador_id = 704
        self.assertEqual(self.db.rows['Intervention'], before['Intervention'])
        self.assertEqual(self.db.rows['Provider'], before['Provider'])
        self.assertEqual(self.db.rows['Treatment'][1], before['Treatment'][1])
        self.assertEqual(response.json()['other'], 'keep')
        self.assertEqual(self.db.events, [('flush',), ('refresh',), ('commit',)])

    def test_budget_provider_inactive_not_newly_disallowed_without_contract(self):
        self.assertEqual(self.patch({'cirurgiao_id': 703}).status_code, 200)
        self.assertEqual(self.db.rows['Intervention'][0].prestador_id, 703)

    def test_budget_provider_omitted_keeps_link_and_other_patch_fields(self):
        response = self.patch({'observacoes': ' nota ', 'receber_paciente': 12.34})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(self.db.rows['Intervention'][0].prestador_id, 701)
        self.assertNotIn('Provider', self.db.reads)
        self.assertEqual(response.json()['orcamento']['intervencoes']['601'], {'observacoes': 'nota', 'receber_paciente': 12.34})

    def test_budget_provider_null_means_no_change_not_clear(self):
        response = self.patch({'cirurgiao_id': None})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(self.db.rows['Intervention'][0].prestador_id, 701)
        self.assertNotIn('Provider', self.db.reads)
        self.assertNotIn('cirurgiao_id', response.json()['orcamento']['intervencoes']['601'])

    def test_budget_cross_tenant_treatment_refused_before_provider_or_lease(self):
        before = copy.deepcopy(self.db.rows)
        self.assertEqual(self.patch({'cirurgiao_id': 701}, treatment=402, intervention=602).status_code, 404)
        self.assertEqual(self.db.rows, before)
        self.assertEqual(self.db.events, [])
        self.assertEqual(self.db.reads, ['Treatment'])

    def test_budget_cross_tenant_intervention_refused(self):
        before = copy.deepcopy(self.db.rows)
        self.assertEqual(self.patch({'cirurgiao_id': 701}, intervention=602).status_code, 404)
        self.assertEqual(self.db.rows, before)
        self.assertEqual(self.db.events, [])
        self.assertNotIn('Provider', self.db.reads)

    def test_budget_service_itself_validates_ownership_without_route(self):
        payload = orcamento_schema.OrcamentoIntervencaoUpdatePayload(cirurgiao_id=701)
        with self.assertRaises(HTTPException) as error:
            self.ns['atualizar_intervencao_orcamento'](self.db, self.users['admin'], 402, 602, payload)
        self.assertEqual(error.exception.status_code, 404)
        self.assertEqual(self.db.events, [])

    def test_budget_lease_still_required_before_mutation(self):
        before = copy.deepcopy(self.db.rows)
        self.assertEqual(self.patch({'cirurgiao_id': 703}, lease='restricted').status_code, 423)
        self.assertEqual(self.db.rows, before)
        self.assertEqual(self.db.events, [])

    def test_budget_without_financial_module_is_refused(self):
        self.assertEqual(self.patch({'cirurgiao_id': 701}, role='no-finance').status_code, 403)
        self.assertEqual(self.db.reads, [])
        self.assertEqual(self.db.events, [])

    def test_budget_auth_and_procedures_module_remain_required(self):
        for role, expected in (('anonymous', 401), ('disabled', 403)):
            self.assertEqual(self.patch({'cirurgiao_id': 704}, role=role).status_code, expected)
        self.assertEqual(self.db.reads, [])
        self.assertEqual(self.db.events, [])

    def test_budget_service_legacy_commit_true_preserved(self):
        payload = orcamento_schema.OrcamentoIntervencaoUpdatePayload(cirurgiao_id=703)
        self.ns['atualizar_intervencao_orcamento'](self.db, self.users['normal'], 401, 601, payload)
        self.assertEqual(self.db.events, [('commit',), ('refresh',)])
        self.assertEqual(self.db.rows['Intervention'][0].prestador_id, 703)


def read_case(path, role, expected):
    def case(self):
        before = copy.deepcopy(self.db.rows)
        response = self.get(path, role=role, **({'clinic': 202, 'patient': 302, 'treatment': 402} if expected == 403 and role in ('normal', 'admin') else {}))
        self.assertEqual(response.status_code, expected)
        self.assertEqual(self.db.rows, before)
        self.assertEqual(self.db.events, [])
        if expected in (401, 403):
            self.assertEqual(self.db.reads, [])
        elif path != 'status':
            rows = response.json()['resumo']['intervencoes'] if path == 'resumo' else response.json()['itens']
            self.assertEqual(len(rows), 1)
            self.assertEqual(rows[0]['clinica_id'], 101)
    return case


for path in ('status', 'resumo', 'arcada-slots', 'intervencoes'):
    for role, expected in [('normal', 200), ('admin', 200), ('disabled', 403), ('protected', 403), ('anonymous', 401)]:
        setattr(FC4SecurityTests, f'test_read_{path.replace("-", "_")}_{role}', read_case(path, role, expected))
    if path != 'status':
        for role in ('normal', 'admin'):
            setattr(FC4SecurityTests, f'test_cross_tenant_{path.replace("-", "_")}_{role}', read_case(path, role, 403))


def invalid_tenant_case(value, admin):
    def case(self):
        for requested in (None, 101):
            with self.assertRaises(HTTPException) as error:
                self.ns['_resolver_clinica_id'](SimpleNamespace(clinica_id=value, is_admin=admin), requested)
            self.assertEqual(error.exception.status_code, 403)
    return case


for index, value in enumerate((None, 0, -1, '101', 'invalid', True, 101.5)):
    for admin in (False, True):
        setattr(FC4SecurityTests, f'test_invalid_tenant_{index}_admin_{admin}', invalid_tenant_case(value, admin))


def invalid_provider_case(provider_id, role):
    def case(self):
        before = copy.deepcopy(self.db.rows)
        response = self.patch({'cirurgiao_id': provider_id, 'tabela_codigo': 9, 'observacoes': 'must not persist'}, role=role)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['detail'], 'Prestador inválido para a clínica.')
        self.assertEqual(self.db.rows, before)
        self.assertEqual(self.db.events, [])
        self.assertIn('Provider', self.db.reads)
    return case


for provider_id in (702, 9999, 0, -1):
    for role in ('normal', 'admin'):
        setattr(FC4SecurityTests, f'test_invalid_provider_{provider_id}_{role}', invalid_provider_case(provider_id, role))


if __name__ == '__main__':
    unittest.main()
