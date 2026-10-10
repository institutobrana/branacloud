"""PostgreSQL-only FC4 foundation proof; no production/env/app imports.

Run with FC4_TEST_DATABASE_URL and FC4_DISPOSABLE_ACK=FC4_P2_R1.
The database must carry the disposable marker installed out-of-band.
The V1 DDL is extracted structurally, not imported (its import loads real env).
"""
import ast
import hashlib
import json
import os
import sys
import subprocess
import threading
import unittest
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from decimal import Decimal
from pathlib import Path
from types import SimpleNamespace

from sqlalchemy import create_engine, event, inspect, text
from sqlalchemy.exc import DBAPIError

BACKEND = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND))
from services.schema_deployment import fc4_p2_r1_persistence as migration
from services.schema_deployment.versioning import ensure_version_table
from services.fc4_occurrence_foundation import CommandConflict, persist_normalized_command

USER = SimpleNamespace(id=901, clinica_id=101, prestador_id=701, is_admin=False)
ADMIN = SimpleNamespace(id=902, clinica_id=101, prestador_id=701, is_admin=True)


def legacy_ddl():
    tree = ast.parse((BACKEND / "scripts/aplicar_migracao_odontograma_v1.py").read_text(encoding="utf-8-sig"))
    function = next(n for n in tree.body if isinstance(n, ast.FunctionDef)
                    and n.name == "aplicar_migracao_odontograma_v1")
    return ast.literal_eval(next(n.value for n in function.body if isinstance(n, ast.Assign)
                                 and any(isinstance(t, ast.Name) and t.id == "ddl_statements" for t in n.targets)))


def baseline(conn):
    # Faithful referenced PK/scoped columns only; no production dump/PHI.
    conn.execute(text("""
      CREATE TABLE clinicas(id INTEGER PRIMARY KEY);
      CREATE TABLE pacientes(id INTEGER PRIMARY KEY,clinica_id INTEGER NOT NULL REFERENCES clinicas(id));
      CREATE TABLE usuarios(id INTEGER PRIMARY KEY,clinica_id INTEGER NOT NULL REFERENCES clinicas(id));
      CREATE TABLE prestador_odonto(id INTEGER PRIMARY KEY,clinica_id INTEGER NOT NULL REFERENCES clinicas(id));
      CREATE TABLE tratamento(id INTEGER PRIMARY KEY,clinica_id INTEGER NOT NULL REFERENCES clinicas(id),
        paciente_id INTEGER NOT NULL REFERENCES pacientes(id));
      CREATE TABLE procedimento(id INTEGER PRIMARY KEY,clinica_id INTEGER NOT NULL REFERENCES clinicas(id),
        inativo BOOLEAN NOT NULL DEFAULT false,simbolo_grafico VARCHAR(30),simbolo_grafico_legacy_id INTEGER,
        forma_cobranca VARCHAR(50));
      CREATE TABLE simbolo_grafico_catalogo(id INTEGER PRIMARY KEY,clinica_id INTEGER,
        codigo VARCHAR(30),legacy_id INTEGER,tipo_marca INTEGER,ativo BOOLEAN NOT NULL DEFAULT true);
      INSERT INTO clinicas VALUES (101),(202);
      INSERT INTO pacientes VALUES (301,101),(302,202),(303,101);
      INSERT INTO usuarios VALUES (901,101),(902,101),(903,202);
      INSERT INTO prestador_odonto VALUES (701,101),(702,202);
      INSERT INTO tratamento VALUES (401,101,301),(402,202,302),(403,101,303);
    """))
    for ddl in legacy_ddl():
        conn.execute(text(ddl))
    ensure_version_table(conn)
    for kind in range(1, 7):
        conn.execute(text("INSERT INTO simbolo_grafico_catalogo VALUES (:i,101,:code,:legacy,:kind,true)"),
                     {"i": kind, "code": f"symbol-{kind}", "legacy": 100 + kind, "kind": kind})
    conn.execute(text("INSERT INTO simbolo_grafico_catalogo VALUES (7,202,'foreign',201,1,true)"))
    for proc, kind, clinic in [(801,1,101),(802,1,202),(803,2,101),(804,3,101),
                               (805,4,101),(806,5,101),(807,6,101)]:
        conn.execute(text("INSERT INTO procedimento VALUES (:id,:c,false,:code,:legacy,'INTERVENCAO')"),
                     {"id": proc, "c": clinic, "code": f"symbol-{kind}" if clinic==101 else "foreign",
                      "legacy": 100+kind if clinic==101 else 201})
    for start, clinic, patient, treatment in [(500,101,301,401),(600,202,302,402),(700,101,303,403)]:
        for ordinal in range(1,33):
            conn.execute(text("""INSERT INTO odontograma_arcada_slots
                (id,clinica_id,paciente_id,tratamento_id,slot_ordem,numero_dente_fdi)
                VALUES (:id,:c,:p,:t,:n,NULL)"""),
                         {"id": start+ordinal, "c": clinic, "p": patient, "t": treatment, "n": ordinal})


def structure(conn):
    names = sorted(inspect(conn).get_table_names())
    return {n: {"columns": [(x["name"],str(x["type"]),x["nullable"],x["default"])
                           for x in inspect(conn).get_columns(n)],
                "fks": sorted((x["name"],tuple(x["constrained_columns"]),x["referred_table"],
                               str(x["options"])) for x in inspect(conn).get_foreign_keys(n)),
                "unique": sorted((x["name"],tuple(x["column_names"]))
                                 for x in inspect(conn).get_unique_constraints(n)),
                "checks": sorted((x["name"],x["sqltext"])
                                 for x in inspect(conn).get_check_constraints(n)),
                "indexes": sorted((x["name"],tuple(x["column_names"]),x["unique"])
                                  for x in inspect(conn).get_indexes(n))}
            for n in names}


@unittest.skipUnless(os.environ.get("FC4_TEST_DATABASE_URL"), "Explicit disposable PostgreSQL URL required")
class FoundationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        if os.environ.get("FC4_DISPOSABLE_ACK") != "FC4_P2_R1":
            raise RuntimeError("Disposable acknowledgement required")
        cls.engine = create_engine(os.environ["FC4_TEST_DATABASE_URL"],
                                   connect_args={"connect_timeout":5})
        url = cls.engine.url
        if url.host != "127.0.0.1" or url.database != "fc4_p2_r1":
            raise RuntimeError("Not the designated disposable database")
        with cls.engine.connect() as c:
            marker = c.execute(text("SELECT shobj_description(oid,'pg_database') FROM pg_database WHERE datname=current_database()")).scalar_one()
            if marker != "FC4_P2_R1_DISPOSABLE_20261010":
                raise RuntimeError("Missing out-of-band disposable marker")

    @classmethod
    def tearDownClass(cls):
        cls.engine.dispose()

    def setUp(self):
        with self.engine.begin() as c:
            c.execute(text("DROP SCHEMA IF EXISTS fc4_test CASCADE; CREATE SCHEMA fc4_test"))
        # Every pool connection uses the dedicated schema; no public data modified.
        self.engine.dispose()
        self.engine = create_engine(os.environ["FC4_TEST_DATABASE_URL"],
                                    connect_args={"options":"-c search_path=fc4_test","connect_timeout":5})
        with self.engine.begin() as c:
            baseline(c)
            self.baseline_structure = structure(c)
            migration.apply(c)

    def tearDown(self):
        self.engine.dispose()

    def command(self, conn=None, command_id="cmd-A", user=USER, **changes):
        args = dict(paciente_id=301,tratamento_id=401,procedimento_id=801,
                    targets=[{"type":"FACE","slots":[501],"faces_mask":5}])
        args.update(changes)
        if conn is not None:
            return persist_normalized_command(conn,user,command_id,**args)
        with self.engine.begin() as c:
            return persist_normalized_command(c,user,command_id,**args)

    def count(self, table="odontograma_intervencoes"):
        with self.engine.connect() as c:
            return c.execute(text("SELECT count(*) FROM "+table)).scalar_one()

    def rejected(self, **changes):
        with self.assertRaises((ValueError, DBAPIError)):
            self.command(**changes)
        self.assertEqual(self.count(),0)
        self.assertEqual(self.count("odontograma_comandos"),0)

    def test_upgrade_downgrade_reupgrade(self):
        with self.engine.begin() as c:
            migration.rollback(c)
            self.assertEqual(structure(c),self.baseline_structure)
            migration.apply(c)
            self.assertIn("alvo_slots",{x["name"] for x in inspect(c).get_columns("odontograma_intervencoes")})

    def test_upgrade_transaction_rollback(self):
        with self.engine.begin() as c:
            migration.rollback(c)
        with self.assertRaises(RuntimeError):
            with self.engine.begin() as c:
                migration.apply(c)
                raise RuntimeError("controlled migration failure")
        with self.engine.connect() as c:
            self.assertEqual(structure(c),self.baseline_structure)

    def test_downgrade_refuses_data(self):
        self.command()
        with self.assertRaises(ValueError):
            with self.engine.begin() as c:
                migration.rollback(c)
        self.assertEqual(self.count(),1)

    def test_downgrade_refuses_retained_receipt(self):
        ids=self.command()
        with self.engine.begin() as c:
            c.execute(text("DELETE FROM odontograma_intervencoes WHERE id=:i"),{"i":ids[0]})
        with self.assertRaises(ValueError):
            with self.engine.begin() as c: migration.rollback(c)

    def test_legacy_rows_preserved(self):
        with self.engine.begin() as c:
            migration.rollback(c)
            c.execute(text("""INSERT INTO odontograma_intervencoes
                (clinica_id,paciente_id,tratamento_id,procedimento_id,status_id,observacao_resumida)
                VALUES (101,301,401,801,1,'synthetic legacy')"""))
            before=dict(c.execute(text("SELECT * FROM odontograma_intervencoes")).mappings().one())
            migration.apply(c)
            after=dict(c.execute(text("SELECT * FROM odontograma_intervencoes")).mappings().one())
            self.assertEqual(before,{k:after[k] for k in before})
            self.assertIsNone(after["alvo_tipo"])
            migration.rollback(c)
            self.assertEqual(dict(c.execute(text("SELECT * FROM odontograma_intervencoes")).mappings().one()),before)

    def test_deployed_naive_timestamps_not_converted(self):
        with self.engine.begin() as c:
            migration.rollback(c)
            c.execute(text("ALTER TABLE odontograma_intervencoes ALTER COLUMN criado_em TYPE TIMESTAMP"))
            migration.apply(c)
            columns={x["name"]:x for x in inspect(c).get_columns("odontograma_intervencoes")}
            self.assertFalse(columns["criado_em"]["type"].timezone)
            self.assertTrue(columns["data_clinica"]["type"].timezone)

    def test_same_tenant_normal(self):
        self.assertEqual(len(self.command()),1)

    def test_same_tenant_admin(self):
        self.assertEqual(len(self.command(user=ADMIN)),1)

    def test_cross_tenant_patient(self): self.rejected(paciente_id=302)
    def test_cross_tenant_treatment(self): self.rejected(tratamento_id=402)
    def test_cross_tenant_procedure(self): self.rejected(procedimento_id=802)
    def test_cross_tenant_provider(self): self.rejected(prestador_id=702)
    def test_patient_treatment_mismatch(self): self.rejected(tratamento_id=403)
    def test_missing_patient(self): self.rejected(paciente_id=999999)
    def test_missing_treatment(self): self.rejected(tratamento_id=999999)
    def test_missing_procedure(self): self.rejected(procedimento_id=999999)
    def test_missing_provider(self): self.rejected(prestador_id=999999)
    def test_cross_tenant_slot(self): self.rejected(targets=[{"type":"FACE","slots":[601],"faces_mask":1}])
    def test_other_treatment_slot(self): self.rejected(targets=[{"type":"FACE","slots":[701],"faces_mask":1}])

    def test_admin_has_no_tenant_bypass(self):
        for kwargs in [{"paciente_id":302},{"tratamento_id":402},{"procedimento_id":802},
                       {"prestador_id":702},{"targets":[{"type":"FACE","slots":[601],"faces_mask":1}]}]:
            with self.subTest(kwargs=kwargs): self.rejected(user=ADMIN,**kwargs)

    def test_missing_invalid_tenant_fails_closed(self):
        for tenant in [None,0,-1,True,"101"]:
            with self.subTest(tenant=tenant):
                self.rejected(user=SimpleNamespace(id=901,clinica_id=tenant,prestador_id=701,is_admin=True))

    def test_cross_tenant_actor(self):
        self.rejected(user=SimpleNamespace(id=903,clinica_id=101,prestador_id=701,is_admin=True))

    def test_face_requires_effective_faces(self):
        self.rejected(targets=[{"type":"FACE","slots":[501],"faces_mask":0}])

    def test_face_no_sixth_area(self):
        self.rejected(targets=[{"type":"FACE","slots":[501],"faces_mask":32}])

    def test_face_accepts_empty_visual_slot(self):
        ids=self.command()
        with self.engine.connect() as c:
            self.assertIsNone(c.execute(text("SELECT numero_dente_fdi FROM odontograma_arcada_slots WHERE id=501")).scalar_one())
            self.assertEqual(c.execute(text("SELECT faces_mask FROM odontograma_intervencoes WHERE id=:i"),{"i":ids[0]}).scalar_one(),5)

    def test_general_without_slot(self):
        self.command(procedimento_id=806,targets=[{"type":"GERAL","slots":[],"faces_mask":0}])

    def test_general_refuses_slot(self):
        self.rejected(procedimento_id=806,targets=[{"type":"GERAL","slots":[501]}])

    def test_unknown_target_fails_closed(self):
        self.rejected(targets=[{"type":"UNKNOWN","slots":[]}])

    def test_target_comes_from_symbol_not_billing(self):
        self.rejected(procedimento_id=804,targets=[{"type":"GERAL","slots":[]}])
        self.command(procedimento_id=804,targets=[{"type":"GRUPO","slots":[501,502]}])

    def test_group_contiguous_and_single_arch(self):
        for slots in [[501,503],[516,517]]:
            with self.subTest(slots=slots):
                self.rejected(procedimento_id=804,targets=[{"type":"GRUPO","slots":slots}])

    def test_arch_full_sixteen(self):
        self.rejected(procedimento_id=805,targets=[{"type":"ARCADA","slots":[501]}])
        self.command(procedimento_id=805,targets=[{"type":"ARCADA","slots":list(range(501,517))}])

    def test_segment_preserves_gaps(self):
        ids=self.command(procedimento_id=807,targets=[{"type":"SEGMENTO","slots":[501,503]}])
        with self.engine.connect() as c:
            self.assertEqual(c.execute(text("SELECT alvo_slots FROM odontograma_intervencoes WHERE id=:i"),{"i":ids[0]}).scalar_one(),[501,503])

    def test_legitimate_duplicate_new_command(self):
        a=self.command()
        b=self.command(command_id="cmd-B")
        self.assertNotEqual(a,b)
        self.assertEqual(self.count(),2)

    def test_same_command_retry(self):
        ids=self.command()
        with self.engine.connect() as c:
            before=c.execute(text("SELECT md5(string_agg(row_to_json(t)::text,',' ORDER BY id)) FROM odontograma_intervencoes t")).scalar_one()
        writes = []
        def observe(conn,cursor,statement,parameters,context,many):
            if statement.lstrip().split()[0].upper() in ("INSERT","UPDATE","DELETE"):
                writes.append(statement)
        event.listen(self.engine,"before_cursor_execute",observe)
        try:
            self.assertEqual(self.command(),ids)
        finally:
            event.remove(self.engine,"before_cursor_execute",observe)
        self.assertEqual(writes,[])
        with self.engine.connect() as c:
            after=c.execute(text("SELECT md5(string_agg(row_to_json(t)::text,',' ORDER BY id)) FROM odontograma_intervencoes t")).scalar_one()
        self.assertEqual(before,after)
        self.assertEqual(self.count(),1)

    def test_retry_does_not_reprice_or_revalidate_changed_catalog(self):
        ids=self.command()
        with self.engine.begin() as c:
            c.execute(text("UPDATE procedimento SET inativo=true,forma_cobranca='changed' WHERE id=801"))
        self.assertEqual(self.command(),ids)

    def test_same_command_changed_payload_conflicts(self):
        self.command()
        with self.assertRaises(CommandConflict): self.command(valor_proprio="5.00")
        self.assertEqual(self.count(),1)

    def test_same_command_changed_actor_conflicts(self):
        self.command()
        with self.assertRaises(CommandConflict): self.command(user=ADMIN)

    def test_command_scoped_per_tenant(self):
        a=self.command()
        foreign=SimpleNamespace(id=903,clinica_id=202,prestador_id=702,is_admin=True)
        b=self.command(user=foreign,paciente_id=302,tratamento_id=402,procedimento_id=802,
                       targets=[{"type":"FACE","slots":[601],"faces_mask":5}])
        self.assertNotEqual(a,b)
        self.assertEqual(self.count("odontograma_comandos"),2)

    def test_concurrent_same_command(self):
        with ThreadPoolExecutor(max_workers=2) as pool:
            results=list(pool.map(lambda _: self.command(),range(2)))
        self.assertEqual(results[0],results[1])
        self.assertEqual(self.count(),1)

    def test_grava_todas_own_occurrence_per_target(self):
        ids=self.command(procedimento_id=803,targets=[{"type":"DENTE","slots":[s]} for s in [501,502,503]])
        self.assertEqual(len(set(ids)),3)
        self.assertEqual(self.count("odontograma_comandos"),1)

    def test_grava_todas_failure_all_or_nothing(self):
        self.rejected(procedimento_id=803,targets=[{"type":"DENTE","slots":[s]} for s in [501,999999,503]])

    def test_grava_esta_previous_confirmation_survives_collective_failure(self):
        ids=self.command(command_id="individual")
        with self.engine.begin() as c:
            with self.assertRaises(DBAPIError):
                self.command(conn=c,procedimento_id=803,
                             targets=[{"type":"DENTE","slots":[s]} for s in [501,999999,503]])
            self.assertEqual(c.execute(text("SELECT count(*) FROM odontograma_intervencoes")).scalar_one(),1)
        self.assertEqual(self.count(),1)
        self.assertEqual(self.command(command_id="individual"),ids)

    def test_version_author_provider_distinct(self):
        ids=self.command(user=ADMIN)
        with self.engine.connect() as c:
            row=c.execute(text("SELECT versao,criado_por_id,prestador_id FROM odontograma_intervencoes WHERE id=:i"),{"i":ids[0]}).one()
            self.assertEqual(tuple(row),(1,902,701))

    def test_invalid_version_database_check(self):
        ids=self.command()
        with self.assertRaises(DBAPIError):
            with self.engine.begin() as c:
                c.execute(text("UPDATE odontograma_intervencoes SET versao=0 WHERE id=:i"),{"i":ids[0]})

    def test_exact_own_values_and_zero(self):
        ids=self.command(valor_proprio="0.00",repasse_proprio=Decimal("66.67"))
        with self.engine.connect() as c:
            row=c.execute(text("SELECT valor_proprio,repasse_proprio FROM odontograma_intervencoes WHERE id=:i"),{"i":ids[0]}).one()
            self.assertEqual(tuple(row),(Decimal("0.00"),Decimal("66.67")))

    def test_money_rejects_float_extra_precision(self):
        for value in [1.1,"1.001","NaN","Infinity"]:
            with self.subTest(value=value): self.rejected(valor_proprio=value)

    def test_stable_slot_fdi_can_change(self):
        ids=self.command()
        with self.engine.begin() as c:
            c.execute(text("UPDATE odontograma_arcada_slots SET numero_dente_fdi=51 WHERE id=501"))
            self.assertEqual(c.execute(text("SELECT alvo_slots FROM odontograma_intervencoes WHERE id=:i"),{"i":ids[0]}).scalar_one(),[501])

    def test_referenced_slot_cannot_delete_or_reidentify(self):
        self.command()
        for sql in ["DELETE FROM odontograma_arcada_slots WHERE id=501",
                    "UPDATE odontograma_arcada_slots SET slot_ordem=33 WHERE id=501"]:
            with self.subTest(sql=sql):
                with self.assertRaises(DBAPIError):
                    with self.engine.begin() as c: c.execute(text(sql))

    def test_receipt_survives_physical_delete_no_resurrection(self):
        ids=self.command()
        with self.engine.begin() as c:
            c.execute(text("DELETE FROM odontograma_intervencoes WHERE id=:i"),{"i":ids[0]})
        self.assertEqual(self.command(),ids)
        self.assertEqual(self.count(),0)
        self.assertEqual(self.count("odontograma_comandos"),1)

    def test_receipt_cannot_delete_or_change(self):
        self.command()
        for sql in ["DELETE FROM odontograma_comandos",
                    "UPDATE odontograma_comandos SET resultado='[999]'::jsonb"]:
            with self.subTest(sql=sql):
                with self.assertRaises(DBAPIError):
                    with self.engine.begin() as c: c.execute(text(sql))

    def test_unfinished_receipt_cannot_commit(self):
        with self.assertRaises(DBAPIError):
            with self.engine.begin() as c:
                c.execute(text("""INSERT INTO odontograma_comandos
                    (clinica_id,command_id,usuario_id,procedimento_id,payload_hash)
                    VALUES (101,'unfinished',901,801,:hash)"""),{"hash":"a"*64})

    def test_d07_no_treatment_cascade(self):
        self.command()
        with self.assertRaises(DBAPIError):
            with self.engine.begin() as c: c.execute(text("DELETE FROM tratamento WHERE id=401"))
        self.assertEqual(self.count(),1)

    def test_database_guard_blocks_direct_cross_tenant_mutation(self):
        ids=self.command()
        for field,value in [("paciente_id",302),("tratamento_id",402),("prestador_id",702),
                            ("procedimento_id",802),("criado_por_id",903)]:
            with self.subTest(field=field):
                with self.assertRaises(DBAPIError):
                    with self.engine.begin() as c:
                        c.execute(text(f"UPDATE odontograma_intervencoes SET {field}=:v WHERE id=:i"),
                                  {"v":value,"i":ids[0]})

    def test_model_and_migration_columns_match(self):
        tree=ast.parse((BACKEND/"models/odontograma_model.py").read_text(encoding="utf-8-sig"))
        occurrence=next(n for n in tree.body if isinstance(n,ast.ClassDef) and n.name=="OdontogramaIntervencao")
        fields={t.id for n in occurrence.body if isinstance(n,ast.Assign) for t in n.targets if isinstance(t,ast.Name)}
        self.assertTrue(set(migration.COLUMNS)<=fields)

    def test_migration_import_has_no_engine_env_or_model_side_effect(self):
        script = """import os,sys
for key in list(os.environ):
 if key=='DATABASE_URL' or key.startswith('DB_'): os.environ.pop(key,None)
sys.path.insert(0,sys.argv[1])
import services.schema_deployment.fc4_p2_r1_persistence
assert 'database' not in sys.modules
assert 'main' not in sys.modules
assert not any(n.startswith('models.') for n in sys.modules)
from services.schema_deployment import ensure_version_table
assert callable(ensure_version_table)
"""
        subprocess.run([sys.executable,"-B","-c",script,str(BACKEND)],check=True,
                       capture_output=True,text=True)

    def test_concurrent_slot_delete_cannot_leave_dangling_target(self):
        created = threading.Event()
        def create():
            with self.engine.begin() as c:
                ids=self.command(conn=c)
                created.set()
                return ids
        def remove():
            self.assertTrue(created.wait(5))
            try:
                with self.engine.begin() as c:
                    c.execute(text("DELETE FROM odontograma_arcada_slots WHERE id=501"))
            except DBAPIError:
                return "REFUSED"
            return "DELETED"
        with ThreadPoolExecutor(max_workers=2) as pool:
            a=pool.submit(create)
            b=pool.submit(remove)
            self.assertEqual(len(a.result(timeout=10)),1)
            self.assertEqual(b.result(timeout=10),"REFUSED")

    def test_full_official_head_orm_baseline_upgrade_downgrade_reupgrade(self):
        script = """import os,sys,subprocess,types
from pathlib import Path
from sqlalchemy import create_engine,text,inspect
from sqlalchemy.orm import declarative_base
root=Path(sys.argv[1]);sys.path.insert(0,str(root/'backend'))
base=declarative_base()
sys.modules['database']=types.SimpleNamespace(Base=base)
old=subprocess.check_output(['git','-C',str(root),'show',
 '833de2662157c6a19beb2903400a9bb9c91fe480:backend/models/odontograma_model.py'],text=True)
module=types.ModuleType('models.odontograma_model')
sys.modules['models.odontograma_model']=module
exec(compile(old,'baseline_odontograma_model.py','exec'),module.__dict__)
from models.model_registry import import_all_models
import_all_models()
from services.schema_deployment import fc4_p2_r1_persistence as migration
from services.schema_deployment.versioning import ensure_version_table
engine=create_engine(os.environ['FC4_TEST_DATABASE_URL'])
with engine.begin() as c:
 c.execute(text('DROP SCHEMA IF EXISTS fc4_full CASCADE; CREATE SCHEMA fc4_full; SET LOCAL search_path=fc4_full'))
 base.metadata.create_all(c)
 ensure_version_table(c)
 before={t:tuple(x['name'] for x in inspect(c).get_columns(t)) for t in inspect(c).get_table_names()}
 migration.apply(c)
 migration.rollback(c)
 after={t:tuple(x['name'] for x in inspect(c).get_columns(t)) for t in inspect(c).get_table_names()}
 assert before==after
 migration.apply(c)
 assert inspect(c).has_table('odontograma_comandos')
engine.dispose()
"""
        result=subprocess.run([sys.executable,"-B","-c",script,str(BACKEND.parent)],
                              capture_output=True,text=True)
        self.assertEqual(result.returncode,0,result.stderr[-4000:])

    def test_current_orm_mappers_and_explicit_deployment_exports(self):
        script = """import sys,types,os
from sqlalchemy.orm import declarative_base,configure_mappers
sys.path.insert(0,sys.argv[1])
sys.modules['database']=types.SimpleNamespace(Base=declarative_base())
from models.model_registry import import_all_models
import_all_models()
configure_mappers()
from models.odontograma_model import OdontogramaIntervencao,OdontogramaComando
assert OdontogramaIntervencao.__table__.c.versao.server_default is not None
assert not any(f.column.table.name=='odontograma_intervencoes'
 for f in OdontogramaComando.__table__.foreign_keys)
import services.schema_deployment as package
original={'BASELINE_VERSION','BASELINE_CHECKSUM','EXECUTOR_VERSION','baseline_steps','apply_baseline',
 'apply_compatibilities','inspect_schema_state','build_plan','format_plan','apply_required_seeds',
 'validate_schema_state','ensure_version_table','get_version_record','lock_schema_deployment',
 'mark_failed','mark_running','mark_applied'}
assert set(package.__all__)==original
for name in original:
 assert getattr(package,name) is not None
assert 'main' not in sys.modules
"""
        result=subprocess.run([sys.executable,"-B","-c",script,str(BACKEND)],
                              capture_output=True,text=True)
        self.assertEqual(result.returncode,0,result.stderr[-4000:])


if __name__ == "__main__":
    unittest.main(verbosity=2)
