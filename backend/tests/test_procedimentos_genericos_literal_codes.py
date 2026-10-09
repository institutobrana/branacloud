"""Literal business keys; real HTTP/ORM proof only in the explicit disposable DB."""
import os
import sys
import unittest
from pathlib import Path
from types import SimpleNamespace
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[2]


class LiteralCodeTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        sys.path.insert(0, str(ROOT / 'backend'))
        from routes import cadastros_routes
        cls.routes = cadastros_routes

    def test_seven_leading_zero_pairs_remain_distinct(self):
        for number in range(200, 207):
            a, b = f'{number:05d}', f'{number:04d}'
            with self.subTest(a=a, b=b):
                self.assertEqual(self.routes._norm_codigo_procedimento_generico(a), a)
                self.assertEqual(self.routes._norm_codigo_procedimento_generico(b), b)
                self.assertNotEqual(a, b)

    def test_short_code_is_not_padded(self):
        self.assertEqual(self.routes._norm_codigo_procedimento_generico('1'), '1')
        self.assertEqual(self.routes._norm_codigo_procedimento_generico('0001'), '0001')

    def test_only_outer_whitespace_is_removed(self):
        self.assertEqual(self.routes._norm_codigo_procedimento_generico(' \t00200\n'), '00200')
        self.assertEqual(self.routes._norm_codigo_procedimento_generico('HIST 01'), 'HIST 01')

    def test_empty_remains_invalid_without_treating_zero_as_empty(self):
        self.assertEqual(self.routes._norm_codigo_procedimento_generico(' \t'), '')
        for code in ('0', '0000'):
            self.assertEqual(self.routes._norm_codigo_procedimento_generico(code), code)

    def test_schema_does_not_coerce_numeric_codes(self):
        from pydantic import ValidationError
        self.assertEqual(self.routes.ProcedimentoGenericoPayload(codigo='00200', descricao='Teste').codigo, '00200')
        with self.assertRaises(ValidationError):
            self.routes.ProcedimentoGenericoPayload(codigo=200, descricao='Teste')

    def test_storage_and_unique_key_are_textual_and_tenant_scoped(self):
        from sqlalchemy import String, UniqueConstraint
        from models.procedimento_generico import ProcedimentoGenerico
        table = ProcedimentoGenerico.__table__
        self.assertIsInstance(table.c.codigo.type, String)
        self.assertTrue(any(isinstance(c, UniqueConstraint) and
                            {col.name for col in c.columns} == {'clinica_id', 'codigo'}
                            for c in table.constraints))

    def test_nested_payload_types_are_resolved_before_fastapi_adaptation(self):
        from fastapi._compat import get_cached_model_fields
        fields = {f.name: f for f in get_cached_model_fields(self.routes.ProcedimentoGenericoPayload)}
        self.assertEqual(fields['fases'].field_info.annotation,
                         list[self.routes.ProcedimentoGenericoFasePayload])
        self.assertEqual(fields['materiais'].field_info.annotation,
                         list[self.routes.ProcedimentoGenericoMaterialPayload])


@unittest.skipUnless(os.getenv('BRANA_R3A_ISOLATED_URL'), 'Explicit disposable PostgreSQL required')
class LiteralCodePostgreSQLTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        target = os.environ['BRANA_R3A_ISOLATED_URL']
        parsed = urlparse(target)
        if (parsed.hostname != '127.0.0.1' or parsed.port != 55432 or
                parsed.path != '/brana_r3a_proof' or os.getenv('DATABASE_URL') != target or
                os.getenv('BRANA_RUNTIME_PROFILE') != 'homologation'):
            raise RuntimeError('Non-disposable target refused before application imports')
        sys.path.insert(0, str(ROOT / 'backend'))
        from fastapi import FastAPI, Header, HTTPException
        from fastapi.testclient import TestClient
        from database import SessionLocal, engine, get_db
        from models.model_registry import import_all_models
        import_all_models()
        from routes import cadastros_routes as r
        cls.Session, cls.engine, cls.routes = SessionLocal, engine, r
        cls.app = FastAPI()
        cls.app.include_router(r.router)

        def user(x_fixture_clinic: int | None = Header(default=None)):
            if x_fixture_clinic is None:
                raise HTTPException(401, 'Missing fixture authentication')
            return SimpleNamespace(id=1, clinica_id=x_fixture_clinic)

        def permission(x_fixture_module: str | None = Header(default=None)):
            if x_fixture_module != 'procedimentos':
                raise HTTPException(403, 'Missing fixture module permission')

        cls.app.dependency_overrides[r.get_current_user] = user
        cls.app.dependency_overrides[r.DEP_PROCEDIMENTOS.dependency] = permission
        cls.client = TestClient(cls.app)
        cls.addClassCleanup(cls.client.close)
        # get_db is the real dependency and real ORM Session; no startup/bootstrap.
        assert get_db is r.get_db

    def setUp(self):
        from datetime import datetime
        from uuid import uuid4
        from models.clinica import Clinica
        with self.Session() as db:
            # IDs generated by the disposable DB, not hardcoded PK assumptions.
            tenants = [Clinica(nome=name, email=f'literal-{uuid4().hex}@example.invalid',
                              trial_ate=datetime(2030, 1, 1))
                       for name in ('Literal code fixture', 'Other literal tenant')]
            db.add_all(tenants)
            db.flush()
            self.cid, self.other = (tenant.id for tenant in tenants)
            db.commit()
        self.headers = {'X-Fixture-Clinic': str(self.cid), 'X-Fixture-Module': 'procedimentos'}

    def create(self, code):
        result = self.client.post('/cadastros/procedimentos-genericos',
                                  headers=self.headers, json={'codigo': code, 'descricao': 'Literal ' + code})
        self.assertEqual(result.status_code, 200, result.text)
        self.assertEqual(result.json()['codigo'], code)
        return result.json()

    def test_create_edit_reload_all_seven_pairs(self):
        for n in range(200, 207):
            codes = (f'{n:05d}', f'{n:04d}')
            records = [self.create(code) for code in codes]
            self.assertNotEqual(records[0]['id'], records[1]['id'])
            for item, code in zip(records, codes):
                path = '/cadastros/procedimentos-genericos'
                loaded = self.client.get(f"{path}/detalhe/{item['id']}", headers=self.headers).json()
                self.assertEqual(loaded['codigo'], code)
                saved = self.client.put(f"{path}/{item['id']}", headers=self.headers,
                                        json={'codigo': loaded['codigo'], 'descricao': 'Edited literal ' + code})
                self.assertEqual(saved.status_code, 200, saved.text)
                self.assertEqual(self.client.get(f"{path}/detalhe/{item['id']}", headers=self.headers).json()['codigo'], code)

    def test_short_and_padded_codes_coexist(self):
        self.assertNotEqual(self.create('0001')['id'], self.create('1')['id'])

    def test_duplicate_check_is_literal(self):
        first = self.create('00200')
        second = self.create('0200')
        duplicate = self.client.post('/cadastros/procedimentos-genericos', headers=self.headers,
                                     json={'codigo': '00200', 'descricao': 'Duplicate'})
        self.assertEqual(duplicate.status_code, 400)
        conflict = self.client.put(f"/cadastros/procedimentos-genericos/{second['id']}", headers=self.headers,
                                  json={'codigo': '00200', 'descricao': 'Conflict'})
        self.assertEqual(conflict.status_code, 400)
        self.assertNotEqual(first['id'], second['id'])

    def test_text_search_returns_distinct_rows_without_numeric_lookup(self):
        a, b = self.create('00200'), self.create('0200')
        result = self.client.get('/cadastros/procedimentos-genericos?q=00200', headers=self.headers).json()
        self.assertEqual([(r['id'], r['codigo']) for r in result], [(a['id'], '00200')])
        # Existing substring semantics deliberately return both for "0200".
        result = self.client.get('/cadastros/procedimentos-genericos?q=0200', headers=self.headers).json()
        self.assertEqual({r['id']: r['codigo'] for r in result}, {a['id']: '00200', b['id']: '0200'})

    def test_wrong_tenant_cannot_read_or_edit(self):
        item = self.create('00200')
        headers = {**self.headers, 'X-Fixture-Clinic': str(self.other)}
        path = '/cadastros/procedimentos-genericos'
        self.assertEqual(self.client.get(f"{path}/detalhe/{item['id']}", headers=headers).status_code, 404)
        self.assertEqual(self.client.put(f"{path}/{item['id']}", headers=headers,
                                        json={'codigo': '0200', 'descricao': 'Forbidden'}).status_code, 404)
        self.assertEqual(self.client.get(f"{path}/detalhe/{item['id']}", headers=self.headers).json()['codigo'], '00200')

    def test_missing_auth_or_module_refused(self):
        path = '/cadastros/procedimentos-genericos'
        self.assertEqual(self.client.post(path, headers={'X-Fixture-Module': 'procedimentos'},
                                         json={'codigo': '00200', 'descricao': 'Forbidden'}).status_code, 401)
        self.assertEqual(self.client.post(path, headers={'X-Fixture-Clinic': str(self.cid)},
                                         json={'codigo': '00200', 'descricao': 'Forbidden'}).status_code, 403)

    def test_blank_code_refused_and_outer_whitespace_trimmed(self):
        path = '/cadastros/procedimentos-genericos'
        self.assertEqual(self.client.post(path, headers=self.headers,
                                         json={'codigo': '  ', 'descricao': 'Blank'}).status_code, 400)
        result = self.client.post(path, headers=self.headers,
                                  json={'codigo': ' 00200 ', 'descricao': 'Trim'})
        self.assertEqual(result.status_code, 200, result.text)
        self.assertEqual(result.json()['codigo'], '00200')
