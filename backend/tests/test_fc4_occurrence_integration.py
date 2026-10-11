"""Real FC4 router/service + OWNER + PostgreSQL, synthetic auth/tenants only.

Uses the same explicit disposable guard as R1. Never imports main or real env.
Parents use R1 synthetic PK/scoped fixtures; extra patient columns are nullable
fixture projections solely to execute the unchanged official ORM lease guard.
"""
import json
import os
import unittest
from concurrent.futures import ThreadPoolExecutor
from types import SimpleNamespace

from fastapi import FastAPI, HTTPException, Request
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, event, inspect, text
from sqlalchemy.orm import Session

from backend.tests import test_fc4_persistence_foundation as foundation
from services.schema_deployment import fc4_p2_r1_persistence as migration


@unittest.skipUnless(os.environ.get("FC4_TEST_DATABASE_URL"), "Explicit disposable PostgreSQL required")
class OccurrenceIntegrationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Exact loopback/name/ACK/out-of-band marker before any DDL.
        foundation.FoundationTests.setUpClass()
        foundation.FoundationTests.engine.dispose()
        from models.model_registry import import_all_models
        import_all_models()
        from routes import odontograma_routes
        from security.dependencies import get_current_user
        from database import get_db
        cls.routes, cls.auth, cls.db_dependency = odontograma_routes, staticmethod(get_current_user), staticmethod(get_db)

    def setUp(self):
        self.engine = create_engine(os.environ["FC4_TEST_DATABASE_URL"],
                                    connect_args={"options": "-c search_path=fc4_r2"})
        with self.engine.begin() as conn:
            conn.execute(text("DROP SCHEMA IF EXISTS fc4_r2 CASCADE; CREATE SCHEMA fc4_r2"))
            foundation.baseline(conn)
            conn.execute(text("ALTER TABLE tratamento ADD COLUMN source_payload JSONB"))
            from models.paciente import Paciente
            existing = {c["name"] for c in inspect(conn).get_columns("pacientes")}
            for column in Paciente.__table__.columns:
                if column.name not in existing:
                    sql_type = column.type.compile(dialect=conn.dialect)
                    conn.execute(text(f'ALTER TABLE pacientes ADD COLUMN "{column.name}" {sql_type}'))
            from models.authenticated_session_instance import AuthenticatedSessionInstance
            from models.clinical_patient_lease import ClinicalPatientLease
            AuthenticatedSessionInstance.__table__.create(conn)
            ClinicalPatientLease.__table__.create(conn)
            conn.execute(text("""
              INSERT INTO authenticated_session_instance(id,clinica_id,usuario_id,status)
              VALUES ('fixture-owner',101,901,'ACTIVE'),('fixture-admin',101,902,'ACTIVE'),
                     ('fixture-foreign',202,903,'ACTIVE');
              INSERT INTO clinical_patient_lease
                (clinica_id,paciente_id,owner_usuario_id,owner_session_instance_id,expires_at,lease_token)
              VALUES (101,301,901,'fixture-owner',now()+interval '1 hour','fixture-token'),
                     (202,302,903,'fixture-foreign',now()+interval '1 hour','foreign-token');
            """))
            migration.apply(conn)
        self.users = {}
        for name, admin, module, function in [
            ("normal",False,"habilitado",None),("admin",True,"desabilitado",None),
            ("disabled",False,"desabilitado",None),("protected",False,"protegido",None),
            ("function-denied",False,"habilitado","desabilitado"),
            ("function-protected",False,"habilitado","protegido"),
            ("admin-denied",True,"habilitado","desabilitado"),
        ]:
            permissions = {"modules":{"procedimentos":module}}
            if function: permissions["functions"] = {"procedimentos":{"inserir_intervencoes":function}}
            self.users[name] = SimpleNamespace(id=902 if admin else 901,clinica_id=101,
                                              prestador_id=701,is_admin=admin,
                                              permissoes_json=json.dumps(permissions))
        self.app = FastAPI()
        self.app.include_router(self.routes.router)

        def authenticated(request: Request):
            user = self.users.get(request.headers.get("Authorization"))
            if user is None: raise HTTPException(401,"Synthetic authentication required")
            return user

        def session():
            with Session(self.engine) as db: yield db

        self.app.dependency_overrides[self.auth] = authenticated
        self.app.dependency_overrides[self.db_dependency] = session
        self.client = TestClient(self.app)
        self.writes = []
        def observe(conn,cursor,statement,parameters,context,many):
            if statement.lstrip().split()[0].upper() in ("INSERT","UPDATE","DELETE"):
                self.writes.append(statement)
        self.observer = observe
        event.listen(self.engine,"before_cursor_execute",observe)

    def tearDown(self):
        self.client.close()
        event.remove(self.engine,"before_cursor_execute",self.observer)
        self.engine.dispose()

    def payload(self, **overrides):
        return dict(command_id="fixture-command",mode="GRAVA_ESTA",paciente_id=301,
                    tratamento_id=401,procedimento_id=801,
                    targets=[dict(type="FACE",slots=[501],faces=["M","CENTRAL"])],**overrides)

    def send(self, payload=None, user="normal", **headers):
        return self.client.post("/odontograma/comandos", json=payload or self.payload(),
                                headers={"Authorization":user,"X-Session-Instance-Id":"fixture-owner",
                                         "X-Clinical-Lease-Token":"fixture-token",**headers})

    def counts(self):
        with self.engine.connect() as c:
            return tuple(c.execute(text(f"SELECT count(*) FROM {table}")).scalar_one()
                         for table in ["odontograma_intervencoes","odontograma_comandos"])

    def rejected(self, payload=None, user="normal", status=None, **headers):
        response = self.send(payload,user,**headers)
        self.assertGreaterEqual(response.status_code,400,response.text)
        if status: self.assertEqual(response.status_code,status,response.text)
        self.assertEqual(self.counts(),(0,0))
        return response

    def test_real_http_create_face(self):
        r=self.send()
        self.assertEqual(r.status_code,200,r.text)
        self.assertEqual(r.json()["ocorrencias"][0]["versao_inicial"],1)
        with self.engine.connect() as c:
            row=c.execute(text("SELECT faces_mask,alvo_slots,criado_por_id,prestador_id FROM odontograma_intervencoes")).one()
            self.assertEqual(tuple(row),(5,[501],901,701))

    def test_general_null_slot_with_treatment(self):
        p=self.payload();p.update(procedimento_id=806,targets=[dict(type="GERAL",slots=None)])
        self.assertEqual(self.send(p).status_code,200)
        with self.engine.connect() as c:
            self.assertEqual(c.execute(text("SELECT tratamento_id,alvo_slots FROM odontograma_intervencoes")).one(),(401,[]))

    def test_all_six_target_types(self):
        examples=[(801,"FACE",[501],["M"]),(803,"DENTE",[502],[]),
                  (804,"GRUPO",[503,504],[]),(805,"ARCADA",list(range(501,517)),[]),
                  (806,"GERAL",[],[]),(807,"SEGMENTO",[501,503],[])]
        for i,(proc,kind,slots,faces) in enumerate(examples):
            with self.subTest(kind=kind):
                p=self.payload();p.update(command_id=f"kind-{i}",procedimento_id=proc,
                                         targets=[dict(type=kind,slots=slots,faces=faces)])
                r=self.send(p);self.assertEqual(r.status_code,200,r.text)
        self.assertEqual(self.counts(),(6,6))

    def test_face_empty(self):
        p=self.payload();p["targets"][0]["faces"]=[]
        self.rejected(p,status=422)

    def test_face_duplicates(self):
        p=self.payload();p["targets"][0]["faces"]=["M","M"]
        self.rejected(p,status=422)

    def test_face_unknown_or_presentation_label(self):
        for face in ["X","O","I","P","L"]:
            p=self.payload();p["targets"][0]["faces"]=[face]
            self.rejected(p,status=422)

    def test_dente_without_slot(self):
        p=self.payload();p.update(procedimento_id=803,targets=[dict(type="DENTE")])
        self.rejected(p,status=422)

    def test_group_noncontiguous_or_cross_arch(self):
        for slots in [[501,503],[516,517]]:
            p=self.payload();p.update(procedimento_id=804,targets=[dict(type="GRUPO",slots=slots)])
            self.rejected(p,status=422)

    def test_arch_incomplete(self):
        p=self.payload();p.update(procedimento_id=805,targets=[dict(type="ARCADA",slots=[501])])
        self.rejected(p,status=422)

    def test_segment_cross_arch(self):
        p=self.payload();p.update(procedimento_id=807,targets=[dict(type="SEGMENTO",slots=[501,517])])
        self.rejected(p,status=422)

    def test_billing_does_not_decide_target(self):
        p=self.payload();p.update(procedimento_id=804,targets=[dict(type="GERAL")])
        self.rejected(p,status=422)
        p["targets"]=[dict(type="GRUPO",slots=[501])]
        self.assertEqual(self.send(p).status_code,200)

    def test_missing_procedure(self):
        p=self.payload();p["procedimento_id"]=999999
        self.rejected(p,status=422)

    def test_cross_tenant_procedure(self):
        p=self.payload();p["procedimento_id"]=802
        self.rejected(p,status=422)

    def test_cross_tenant_patient(self):
        p=self.payload();p["paciente_id"]=302
        self.rejected(p,status=404)

    def test_cross_tenant_treatment(self):
        p=self.payload();p["tratamento_id"]=402
        self.rejected(p,status=404)

    def test_patient_treatment_inconsistent(self):
        p=self.payload();p["tratamento_id"]=403
        self.rejected(p,status=404)

    def test_cross_tenant_provider(self):
        p=self.payload();p["prestador_id"]=702
        self.rejected(p,status=422)

    def test_missing_provider(self):
        p=self.payload();p["prestador_id"]=999999
        self.rejected(p,status=422)

    def test_no_provider_default(self):
        self.users["normal"].prestador_id=None
        self.rejected(status=422)

    def test_admin_cross_tenant(self):
        with self.engine.begin() as c:
            c.execute(text("UPDATE clinical_patient_lease SET owner_usuario_id=902,owner_session_instance_id='fixture-admin' WHERE clinica_id=101"))
        p=self.payload();p["procedimento_id"]=802
        self.rejected(p,user="admin",status=422,**{"X-Session-Instance-Id":"fixture-admin"})

    def test_invalid_tenant_fails_closed(self):
        self.users["normal"].clinica_id=None
        self.rejected(status=403)

    def test_no_auth(self):
        self.rejected(user="absent",status=401)

    def test_module_disabled(self):
        self.rejected(user="disabled",status=403)

    def test_function_disabled(self):
        self.rejected(user="function-denied",status=403)

    def test_admin_function_disabled(self):
        self.rejected(user="admin-denied",status=403)

    def test_protected_without_grant(self):
        self.rejected(user="function-protected",status=403)

    def test_protected_scoped_grant(self):
        from security.jwt_handler import create_access_token
        grant=create_access_token(dict(type="protected_grant",user_id=901,clinica_id=101,module_code="procedimentos"))
        for user in ["protected","function-protected"]:
            p=self.payload();p["command_id"]=user
            self.assertEqual(self.send(p,user=user,**{"X-Protected-Grant":grant}).status_code,200)

    def test_protected_foreign_grant(self):
        from security.jwt_handler import create_access_token
        for fields in [dict(user_id=903,clinica_id=101),dict(user_id=901,clinica_id=202),
                       dict(user_id=901,clinica_id=101,module_code="financeiro")]:
            data=dict(type="protected_grant",module_code="procedimentos",**{k:v for k,v in fields.items() if k!="module_code"})
            if "module_code" in fields:data["module_code"]=fields["module_code"]
            self.rejected(user="function-protected",status=403,**{"X-Protected-Grant":create_access_token(data)})

    def test_owner_required(self):
        self.rejected(status=409,**{"X-Clinical-Lease-Token":"wrong"})

    def test_owner_expired(self):
        with self.engine.begin() as c:c.execute(text("UPDATE clinical_patient_lease SET expires_at=now()-interval '1 second'"))
        self.rejected(status=409)

    def test_instance_required(self):
        self.rejected(status=409,**{"X-Session-Instance-Id":"missing"})

    def test_author_distinct_from_provider(self):
        self.assertEqual(self.send().status_code,200)
        with self.engine.connect() as c:
            self.assertEqual(c.execute(text("SELECT criado_por_id,prestador_id FROM odontograma_intervencoes")).one(),(901,701))

    def test_retry_zero_dml(self):
        first=self.send();self.assertEqual(first.status_code,200,first.text)
        self.writes.clear()
        second=self.send()
        self.assertEqual(first.json(),second.json())
        self.assertEqual(self.writes,[])
        self.assertEqual(self.counts(),(1,1))

    def test_payload_mismatch_conflict(self):
        self.assertEqual(self.send().status_code,200)
        p=self.payload();p["valor_proprio"]="3.00"
        r=self.send(p)
        self.assertEqual(r.status_code,409,r.text)
        self.assertEqual(self.counts(),(1,1))

    def test_mode_mismatch_conflict(self):
        self.assertEqual(self.send().status_code,200)
        p=self.payload();p["mode"]="GRAVA_TODAS"
        self.assertEqual(self.send(p).status_code,409)
        self.assertEqual(self.counts(),(1,1))

    def test_legitimate_repeat_new_command(self):
        a=self.send();p=self.payload();p["command_id"]="second"
        b=self.send(p)
        self.assertNotEqual(a.json()["ocorrencias"],b.json()["ocorrencias"])
        self.assertEqual(self.counts(),(2,2))

    def test_grava_esta_one_unit_only(self):
        p=self.payload();p.update(procedimento_id=803,targets=[dict(type="DENTE",slots=[s]) for s in [501,502]])
        self.rejected(p,status=422)

    def test_grava_todas_one_procedure_n_targets(self):
        p=self.payload();p.update(mode="GRAVA_TODAS",procedimento_id=803,
                                 targets=[dict(type="DENTE",slots=[s]) for s in [501,502,503]])
        r=self.send(p);self.assertEqual(r.status_code,200,r.text)
        self.assertEqual(len({x["id"] for x in r.json()["ocorrencias"]}),3)
        self.assertEqual(self.counts(),(3,1))

    def test_grava_todas_real_rollback(self):
        p=self.payload();p.update(mode="GRAVA_TODAS",procedimento_id=803,
                                 targets=[dict(type="DENTE",slots=[s]) for s in [501,999999,503]])
        self.rejected(p,status=422)
        # INSERT for first unit happened; PostgreSQL rollback, not compensating DELETE.
        self.assertTrue(any("INSERT INTO odontograma_intervencoes" in s for s in self.writes))
        self.assertFalse(any(s.lstrip().upper().startswith("DELETE") for s in self.writes))

    def test_grava_esta_survives_later_command_failure(self):
        r=self.send();self.assertEqual(r.status_code,200)
        p=self.payload();p.update(command_id="collective",mode="GRAVA_TODAS",procedimento_id=803,
                                 targets=[dict(type="DENTE",slots=[s]) for s in [501,999999,503]])
        self.assertEqual(self.send(p).status_code,422)
        self.assertEqual(self.counts(),(1,1))

    def test_concurrent_same_http_command(self):
        with ThreadPoolExecutor(max_workers=2) as pool:
            results=list(pool.map(lambda _:self.send(),range(2)))
        for r in results:self.assertEqual(r.status_code,200,r.text)
        self.assertEqual(results[0].json(),results[1].json())
        self.assertEqual(self.counts(),(1,1))

    def test_inactive_new_refused_but_retry_preserved(self):
        first=self.send();self.assertEqual(first.status_code,200)
        with self.engine.begin() as c:c.execute(text("UPDATE procedimento SET inativo=true WHERE id=801"))
        self.assertEqual(self.send().json(),first.json())
        p=self.payload();p["command_id"]="new"
        self.assertEqual(self.send(p).status_code,422)
        self.assertEqual(self.counts(),(1,1))

    def test_symbol_unknown_ambiguous_or_cross_tenant(self):
        for sql in ["UPDATE simbolo_grafico_catalogo SET tipo_marca=99 WHERE id=1",
                    "UPDATE simbolo_grafico_catalogo SET ativo=false WHERE id=1",
                    "UPDATE simbolo_grafico_catalogo SET clinica_id=202 WHERE id=1"]:
            with self.engine.begin() as c:
                c.execute(text("UPDATE simbolo_grafico_catalogo SET tipo_marca=1,ativo=true,clinica_id=101 WHERE id=1"))
                c.execute(text(sql))
            self.rejected(status=422)

    def test_duplicate_slot_refused(self):
        p=self.payload();p["targets"][0]["slots"]=[501,501]
        self.rejected(p,status=422)

    def test_face_empty_visual_slot_and_stable_id(self):
        self.assertEqual(self.send().status_code,200)
        with self.engine.connect() as c:
            self.assertIsNone(c.execute(text("SELECT numero_dente_fdi FROM odontograma_arcada_slots WHERE id=501")).scalar_one())
            self.assertEqual(c.execute(text("SELECT alvo_slots FROM odontograma_intervencoes")).scalar_one(),[501])

    def test_values_exact_and_catalog_not_copied(self):
        p=self.payload();p.update(valor_proprio="0.00",repasse_proprio="66.67")
        self.assertEqual(self.send(p).status_code,200)
        with self.engine.connect() as c:
            row=c.execute(text("SELECT valor_proprio::text,repasse_proprio::text FROM odontograma_intervencoes")).one()
            self.assertEqual(row,("0.00","66.67"))

    def test_float_and_excess_precision_rejected(self):
        for value in [1.1,"1.001"]:
            p=self.payload();p["valor_proprio"]=value
            self.rejected(p,status=422)

    def test_no_catalog_budget_financial_stock_material_phase_writes(self):
        self.assertEqual(self.send().status_code,200)
        for sql in self.writes:
            self.assertTrue("INTO odontograma_intervencoes" in sql or "INTO odontograma_comandos" in sql
                            or "UPDATE odontograma_comandos" in sql,sql)

    def test_malformed_and_out_of_range_money_rejected(self):
        for value in ["abc", "", "1e100000", "NaN", "Infinity"]:
            p=self.payload();p["valor_proprio"]=value
            self.rejected(p,status=422)

    def test_approved_budget_fail_closed_no_mutation(self):
        with self.engine.begin() as c:
            c.execute(text("UPDATE tratamento SET source_payload=CAST(:p AS JSONB) WHERE id=401"),
                      {"p": json.dumps({"orcamento":{"aprovado":True},"keep":1})})
        self.rejected(status=409)

    def test_realizada_waits_for_history_adapter(self):
        p=self.payload();p["status"]="realizada"
        self.rejected(p,status=422)

    def test_no_frontend_tenant_or_multiple_procedures_payload(self):
        for key,value in [("clinica_id",202),("procedimentos",[801,803])]:
            p=self.payload();p[key]=value
            self.rejected(p,status=422)
