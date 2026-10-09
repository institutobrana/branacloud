"""Actual cadastro route/schema ASTs, ORM doubles and isolated HTTP only.

No database/application/bootstrap imports, credentials or production requests.
"""
import copy
import unittest
from types import SimpleNamespace

from fastapi import Depends, FastAPI, Header, HTTPException
from fastapi.testclient import TestClient
from backend.tests.test_procedimentos_edit_roundtrip import environment, Generic, Symbol

FIELDS = [('nome', 'Nome'), ('procedimento_generico_id', 'Procedimento genérico'),
          ('especialidade', 'Especialidade'), ('simbolo_grafico', 'Símbolo gráfico'),
          ('forma_cobranca', 'Forma de cobrança')]
VALID = dict(codigo=90, nome='Novo', tabela_id='4', procedimento_generico_id=20,
             especialidade='05', simbolo_grafico='sim_outras.bmp', simbolo_grafico_legacy_id=58,
             forma_cobranca='INTERVENCAO')


class RequiredTests(unittest.TestCase):
    def setUp(self):
        self.ns, self.db, self.proc = environment()
        self.user = SimpleNamespace(clinica_id=1)
        self.ns['_garantir_tabelas_clinica'] = lambda *a: self.db.events.append(('bootstrap',))

    def invoke(self, mode, fields):
        payload = self.ns['ProcedimentoPayload'](**fields)
        if mode == 'create':
            return self.ns['criar_procedimento'](payload, self.user, self.db)
        return self.ns['atualizar_procedimento'](701, payload, self.user, self.db)

    def reject(self, mode, fields, detail=None):
        before = copy.deepcopy(self.db.rows)
        with self.assertRaises(HTTPException) as error:
            self.invoke(mode, fields)
        if detail:
            self.assertEqual(error.exception.detail, detail)
        self.assertEqual(self.db.rows, before)
        self.assertEqual(self.db.events, [], 'Invalid cadastro cannot bootstrap or mutate')
        return error.exception

    def test_order_complete_with_multiple_missing_and_sequential_corrections(self):
        for mode in ('create', 'update'):
            fields = {**VALID, **{key: None for key, label in FIELDS}, 'simbolo_grafico_legacy_id': None}
            for key, label in FIELDS:
                self.reject(mode, fields, f'Campo {label} não pode ser nulo.')
                fields[key] = VALID[key]
                if key == 'simbolo_grafico':
                    fields['simbolo_grafico_legacy_id'] = 58

    def test_omitted_update_uses_existing_valid_record_preserving_raw_identity(self):
        before = copy.deepcopy(vars(self.proc))
        result = self.invoke('update', dict(codigo=1, nome='Editado'))
        for key in before:
            if key not in ('nome', 'data_alteracao'):
                self.assertEqual(getattr(self.proc, key), before[key], key)
        self.assertEqual(result['nome'], 'Editado')

    def test_same_valid_symbol_outside_combo_and_partial_remains_unchanged(self):
        self.db.rows['Symbol'].append(Symbol(id=999, clinica_id=1, codigo='custom.bmp', legacy_id=None, ativo=True))
        self.proc.simbolo_grafico, self.proc.simbolo_grafico_legacy_id = 'custom.bmp', None
        result = self.invoke('update', dict(codigo=1, nome='Editado'))
        self.assertEqual((result['simbolo_grafico'], result['simbolo_grafico_legacy_id']), ('custom.bmp', None))

    def test_missing_code_only_clear_cannot_bypass_required_symbol_with_omitted_legacy(self):
        self.reject('update', dict(codigo=1, nome='Editado', simbolo_grafico=None), 'Campo Símbolo gráfico não pode ser nulo.')

    def test_ambiguous_unchanged_partial_pair_rejected_without_guessing_or_repair(self):
        self.proc.simbolo_grafico_legacy_id = None
        self.reject('update', dict(codigo=1, nome='Editado'))

    def test_historical_false_does_not_control_symbol_or_editability(self):
        result = self.invoke('update', {**VALID, 'mostrar_simbolo': False})
        self.assertEqual(result['simbolo_grafico_legacy_id'], 58)
        self.assertNotIn('mostrar_simbolo', self.ns['ProcedimentoPayload'].model_fields)

    def test_optional_clear_zero_false_and_no_local_propagation(self):
        siblings, generics = copy.deepcopy(self.db.rows['Proc'][1:]), copy.deepcopy(self.db.rows['Generic'])
        phases, materials = copy.deepcopy(self.db.rows['Phase']), copy.deepcopy(self.db.rows['Link'])
        result = self.invoke('update', {**VALID, 'tempo': 0, 'custo_lab': 0, 'preco': 0, 'valor_repasse': 0,
                                        'observacoes': None, 'preferido': False, 'inativo': False})
        self.assertEqual((result['tempo'], result['custo_lab'], result['observacoes'], result['preferido'], result['inativo']), (0, 0, '', False, False))
        self.assertEqual(self.db.rows['Proc'][1:], siblings)
        self.assertEqual(self.db.rows['Generic'], generics)
        self.assertEqual(self.db.rows['Phase'], phases)
        self.assertEqual(self.db.rows['Link'], materials)

    def test_api_http_create_update_global_validation_and_auth_without_runtime(self):
        # HTTP parsing/status verification; auth/module declaration is also
        # checked against the actual router by the existing Actions suite.
        for mode in ('create', 'update'):
            ns, db, proc = environment()
            Payload = ns['ProcedimentoPayload']
            app = FastAPI()
            def user(authorization: str | None = Header(default=None)):
                if not authorization:
                    raise HTTPException(status_code=401, detail='Sem sessão')
                return SimpleNamespace(clinica_id=1 if authorization == 'fixture' else 99)
            def endpoint(payload: Payload, current_user=Depends(user)):
                return ns['criar_procedimento'](payload, current_user, db) if mode == 'create' else ns['atualizar_procedimento'](701, payload, current_user, db)
            app.add_api_route('/procedimentos', endpoint, methods=['POST' if mode == 'create' else 'PUT'])
            with TestClient(app) as client:
                method = client.post if mode == 'create' else client.put
                self.assertEqual(method('/procedimentos', json=VALID).status_code, 401)
                for key, label in FIELDS:
                    fields = {**VALID, key: None}
                    if key == 'simbolo_grafico':
                        fields['simbolo_grafico_legacy_id'] = None
                    response = method('/procedimentos', json=fields, headers={'Authorization': 'fixture'})
                    self.assertEqual(response.status_code, 400)
                    self.assertEqual(response.json()['detail'], f'Campo {label} não pode ser nulo.')
                self.assertEqual(db.events, [])
                self.assertEqual(method('/procedimentos', json=VALID, headers={'Authorization': 'foreign'}).status_code, 404)
                self.assertEqual(db.events, [])
                self.assertEqual(method('/procedimentos', json=VALID, headers={'Authorization': 'fixture'}).status_code, 200)


def missing_case(mode, key, label, empty):
    def case(self):
        fields = {**VALID, key: empty}
        if key == 'simbolo_grafico':
            fields['simbolo_grafico_legacy_id'] = None
        self.reject(mode, fields, f'Campo {label} não pode ser nulo.')
    return case


for mode in ('create', 'update'):
    for key, label in FIELDS:
        empties = [None, '', '   '] if key != 'procedimento_generico_id' else [None, 0]
        for index, empty in enumerate(empties):
            setattr(RequiredTests, f'test_{mode}_missing_{key}_{index}', missing_case(mode, key, label, empty))


def invalid_case(mode, key, value):
    def case(self):
        self.db.rows['Generic'].append(Generic(id=99, clinica_id=99))
        self.db.rows['Symbol'].append(Symbol(id=999, clinica_id=99, codigo='foreign.bmp', legacy_id=99, ativo=True))
        self.reject(mode, {**VALID, key: value})
    return case


for mode in ('create', 'update'):
    for index, (key, value) in enumerate([('procedimento_generico_id', -1), ('procedimento_generico_id', 99),
                                         ('especialidade', '99'), ('especialidade', '00'),
                                         ('simbolo_grafico_legacy_id', 99), ('simbolo_grafico', 'missing.bmp'),
                                         ('forma_cobranca', '0'), ('forma_cobranca', 'unknown')]):
        setattr(RequiredTests, f'test_{mode}_invalid_{key}_{index}', invalid_case(mode, key, value))


def merged_missing_case(key, label):
    def case(self):
        setattr(self.proc, key, None)
        if key == 'simbolo_grafico':
            self.proc.simbolo_grafico_legacy_id = None
        fields = dict(codigo=1, nome='Editado')
        if key == 'nome':
            fields['nome'] = None
        self.reject('update', fields, f'Campo {label} não pode ser nulo.')
    return case


for key, label in FIELDS:
    setattr(RequiredTests, f'test_update_omitted_missing_{key}', merged_missing_case(key, label))


def global_case(clinic_id, mode):
    def case(self):
        self.ns, self.db, self.proc = environment(clinic_id=clinic_id)
        self.user = SimpleNamespace(clinica_id=clinic_id)
        result = self.invoke(mode, VALID)
        self.assertEqual(result['procedimento_generico_id'], 20)
        self.assertEqual(result['forma_cobranca'], 'INTERVENCAO')
        self.assertEqual(self.proc.clinica_id, clinic_id)
    return case


for clinic in (42, 2026):
    for mode in ('create', 'update'):
        setattr(RequiredTests, f'test_global_tenant_{clinic}_{mode}', global_case(clinic, mode))


if __name__ == '__main__':
    unittest.main()
