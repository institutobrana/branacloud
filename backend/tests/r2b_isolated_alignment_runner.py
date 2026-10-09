"""Owned PostgreSQL proof; refuses occupied ports and unrelated containers."""
import argparse
import hashlib
import json
import os
import re
import secrets
import socket
import subprocess
import sys
import time
import uuid
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = Path('C:/Temp/Brana/EXISTING_CLINICS_ALIGNMENT_R2B')
PORT = 55432
NAME = 'brana-r2b-proof-' + uuid.uuid4().hex[:12]
PASSWORD = secrets.token_hex(20)
JWT = secrets.token_hex(32)
TEST_PASSWORD = secrets.token_hex(16)
USER = 'brana_r2b_test'
SOURCES = ['backend/routes/procedimentos_routes.py','backend/services/runtime_bootstrap_service.py',
    'backend/services/indices_service.py','backend/services/procedimentos_alignment_service.py',
    'backend/scripts/alinhar_clinicas_procedimentos.py','backend/seeds/procedimentos_bootstrap_canonico.json',
    'backend/tests/test_procedimentos_existing_alignment.py','backend/tests/r2b_isolated_alignment_runner.py']


def hashes():
    return {p:hashlib.sha256((ROOT / p).read_bytes()).hexdigest() for p in SOURCES}


def scrub(value):
    for secret in (PASSWORD,JWT,TEST_PASSWORD):
        value=value.replace(secret,'[REDACTED]')
    return value


def save(name,value):
    OUT.mkdir(parents=True,exist_ok=True)
    (OUT/name).write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')


def command(args,env=None):
    return subprocess.run(args,cwd=str(ROOT),env=env,text=True,encoding='utf-8',errors='replace',
        capture_output=True,stdin=subprocess.DEVNULL)


def owned():
    result=command(['docker','inspect',NAME])
    if result.returncode:
        raise RuntimeError('Owned disposable inspection failed')
    d=json.loads(result.stdout)[0]
    if (d['Name']!='/'+NAME or d['Config']['Labels'].get('brana.phase')!='R2B-isolated-proof'
            or d['Config']['Image']!='postgres:16-alpine'
            or d['HostConfig']['PortBindings'].get('5432/tcp')!=[{'HostIp':'127.0.0.1','HostPort':str(PORT)}]):
        raise RuntimeError('Refusing unrelated container or unexpected binding')
    return d['Id']


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--verify-backup',action='store_true')
    parser.add_argument('--clinic-id',type=int,help='Required for individual backup verification')
    parser.add_argument('--out',type=Path,help='External proof directory; never inside the repository')
    args=parser.parse_args()
    global OUT
    if args.out:
        OUT=args.out.resolve()
        if OUT==ROOT or ROOT in OUT.parents:
            raise RuntimeError('Proof artifacts must remain outside repository')
    with socket.socket() as sock:
        if sock.connect_ex(('127.0.0.1',PORT))==0:
            raise RuntimeError('Port 55432 occupied; no existing database used')
    if args.verify_backup:
        if args.clinic_id not in (13,15,16,17,18,19):
            raise RuntimeError('An authorized individual clinic-id is required')
        OUT=OUT/f'clinic_{args.clinic_id}'
        backup=OUT/'backup_data.json'
        manifest=json.loads((OUT/'backup_manifest.json').read_text(encoding='utf-8'))
        digest=hashlib.sha256(backup.read_bytes()).hexdigest()
        if manifest['file_sha256']!=digest or manifest.get('clinics')!=[args.clinic_id] or manifest.get('operator_contract')!='PER_CLINIC_V1':
            raise RuntimeError('Individual backup checksum/scope mismatch')
    elif args.clinic_id is not None:
        raise RuntimeError('clinic-id is only used with --verify-backup')
    if not args.verify_backup:
        unit_suites=json.loads((OUT/'regression_unit_suites.json').read_text(encoding='utf-8'))
        if len(unit_suites)!=2 or sum(s['pass'] for s in unit_suites)!=375 or any(s['fail'] for s in unit_suites):
            raise RuntimeError('Fresh 375-test frontend/backend regression evidence required')
    initial_hashes=hashes()
    started=False
    try:
        run=command(['docker','run','-d','--rm','--name',NAME,'--label','brana.phase=R2B-isolated-proof',
            '-p',f'127.0.0.1:{PORT}:5432','-e',f'POSTGRES_PASSWORD={PASSWORD}',
            '-e',f'POSTGRES_USER={USER}','-e','POSTGRES_DB=brana_r2b_proof','postgres:16-alpine'])
        if run.returncode:
            raise RuntimeError(scrub(run.stderr))
        started=True
        container=owned()
        import psycopg2
        deadline=time.monotonic()+60
        while True:
            try:
                conn=psycopg2.connect(host='127.0.0.1',port=PORT,user=USER,password=PASSWORD,dbname='brana_r2b_proof',connect_timeout=2)
                conn.close()
                break
            except psycopg2.OperationalError:
                if time.monotonic()>=deadline:
                    raise RuntimeError('Disposable PostgreSQL unavailable')
                time.sleep(.5)
        env=os.environ.copy()
        env.update(BRANA_RUNTIME_PROFILE='homologation',JWT_SECRET_KEY=JWT,
            BRANA_ENABLE_SCHEMA_BOOTSTRAP='0',BRANA_ENABLE_RUNTIME_BOOTSTRAP='0',
            BRANA_ALLOW_HTTP_RUNTIME_BOOTSTRAP='0',BRANA_ENABLE_SCHEMA_COMPATIBILITY='0',
            BRANA_SCHEMA_DEPLOYMENT_ALLOW_LOCALHOST='1',BRANA_SCHEMA_DEPLOYMENT_ACK='BRANA_SCHEMA_DEPLOYMENT_ACKNOWLEDGED',
            PYTHONDONTWRITEBYTECODE='1',PYTHONIOENCODING='utf-8',BRANA_R2B_ARTIFACT_DIR=str(OUT),
            BRANA_R1B_TEST_PASSWORD=TEST_PASSWORD)
        env.pop('BRANA_R1B_ARTIFACT_DIR',None)
        env.pop('BRANA_R2B_BACKUP_FILE',None)
        env.pop('BRANA_R4_CLI_PROOF',None)
        suites=[]
        targets=[('brana_r2b_proof','backend.tests.test_procedimentos_existing_alignment')]
        if not args.verify_backup:
            connection=psycopg2.connect(host='127.0.0.1',port=PORT,user=USER,password=PASSWORD,dbname='brana_r2b_proof')
            connection.autocommit=True
            with connection.cursor() as cursor:
                cursor.execute('CREATE DATABASE brana_r1b_proof')
            connection.close()
            targets.append(('brana_r1b_proof','backend.tests.test_procedimentos_bootstrap_canonical'))
        for database,module in targets:
            url=f'postgresql://{USER}:{PASSWORD}@127.0.0.1:{PORT}/{database}'
            env['DATABASE_URL']=url
            env.pop('BRANA_R1B_ISOLATED_URL',None)
            env.pop('BRANA_R2B_ISOLATED_URL',None)
            env['BRANA_R2B_ISOLATED_URL' if database=='brana_r2b_proof' else 'BRANA_R1B_ISOLATED_URL']=url
            if args.verify_backup:
                env['BRANA_R2B_BACKUP_FILE']=str(backup)
                env['BRANA_R2B_BACKUP_CLINIC_ID']=str(args.clinic_id)
            schema=command([sys.executable,'-B','-m','backend.scripts.apply_schema_baseline','--apply'],env)
            save(database+('_backup' if args.verify_backup else '')+'_schema.json',{'returncode':schema.returncode,'stdout':scrub(schema.stdout),'stderr':scrub(schema.stderr)})
            if schema.returncode:
                raise RuntimeError('Isolated schema failed: '+scrub(schema.stderr[-4000:]))
            print('Running guarded proof: '+module,flush=True)
            test_command=[sys.executable,'-B','-m','unittest',module,'-v']
            if database=='brana_r2b_proof':
                if args.verify_backup:
                    test_command=[sys.executable,'-B','-m','unittest',module+'.AlignmentPostgreSQLTests.test_19_verify_individual_backup_in_owned_clone','-v']
                else:
                    test_command=[sys.executable,'-B','-c',
                        'import sys,unittest; import '+module+' as tests; '
                        'loader=unittest.defaultTestLoader; suite=unittest.TestSuite(); '
                        'suite.addTests(loader.loadTestsFromTestCase(tests.AlignmentUnitTests)); '
                        'suite.addTests(t for t in loader.loadTestsFromTestCase(tests.AlignmentPostgreSQLTests) if not t._testMethodName.startswith("test_19")); '
                        'result=unittest.TextTestRunner(verbosity=2).run(suite); sys.exit(0 if result.wasSuccessful() else 1)']
            if database=='brana_r1b_proof':
                # Run the unchanged canonical suite and report its existing
                # DML counter without overwriting the original R1B artifacts.
                test_command=[sys.executable,'-B','-c',
                    'import json,sys,unittest; import '+module+' as tests; '
                    'result=unittest.TextTestRunner(verbosity=2).run(unittest.defaultTestLoader.loadTestsFromModule(tests)); '
                    'print("ISOLATED_DML_ACCOUNTING="+json.dumps(tests.IsolatedBootstrapTests.writes)); '
                    'sys.exit(0 if result.wasSuccessful() else 1)']
            run=command(test_command,env)
            match=re.search(r'Ran (\d+) tests?',run.stderr)
            count=int(match.group(1)) if match else 0
            suites.append({'module':module,'run':count,'pass':count if run.returncode==0 else 0,'fail':0 if run.returncode==0 else 1,'returncode':run.returncode})
            save(database+('_backup' if args.verify_backup else '')+'_tests.json',{'returncode':run.returncode,'stdout':scrub(run.stdout),'stderr':scrub(run.stderr)})
            print(scrub(run.stderr),flush=True)
            if run.returncode:
                raise RuntimeError('Disposable proof failed; production remains blocked')
            if database=='brana_r1b_proof':
                accounting=re.search(r'ISOLATED_DML_ACCOUNTING=(\{[^\n]+\})',run.stdout)
                if not accounting:
                    raise RuntimeError('Canonical suite write accounting missing')
                save(database+'_write_accounting.json',json.loads(accounting.group(1)))
        if args.verify_backup:
            verified=json.loads((OUT/'backup_manifest.json').read_text(encoding='utf-8'))
            rollback=json.loads((OUT/'rollback_plan.json').read_text(encoding='utf-8'))
            if not verified['verified'] or rollback['clinics']!=[args.clinic_id] or rollback['proof'][0]['restored_hash']!=manifest['state_hashes'][str(args.clinic_id)]:
                raise RuntimeError('Fresh individual backup restoration mismatch')
        else:
            details=json.loads((OUT/'scoped_guard_isolated_results.json').read_text(encoding='utf-8'))
            save('isolated_proof.json',{'status':'PASS','suites':suites,'details':details,'source_hashes':hashes(),
                'container':container,'target':{'host':'127.0.0.1','port':PORT,'database':'brana_r2b_proof'},'production_writes':0})
            def regression_certificate():
                combined=unit_suites+[{'suite':s['module'],'run':s['run'],'pass':s['pass'],'fail':s['fail'],'skipped':0} for s in suites]
                save('test_results.json',{'suites':combined,'total_run':sum(s['run'] for s in combined),
                    'total_pass':sum(s['pass'] for s in combined),'total_fail':sum(s['fail'] for s in combined),
                    'source_hashes':hashes(),'unique_tests_only':True,'production_connections':0})
            regression_certificate()
            # The actual CLI apply must pass real, fresh backup/restore gates,
            # not mock certificates. First-stage 439 tests provide that gate.
            env['DATABASE_URL']=f'postgresql://{USER}:{PASSWORD}@127.0.0.1:{PORT}/brana_r2b_proof'
            env['BRANA_R2B_ISOLATED_URL']=env['DATABASE_URL']
            env.pop('BRANA_R1B_ISOLATED_URL',None)
            env['BRANA_R4_CLI_PROOF']='1'
            module='backend.tests.test_procedimentos_existing_alignment.PerClinicOperatorCLIProofTests'
            print('Running staged real single-clinic CLI proof',flush=True)
            run=command([sys.executable,'-B','-m','unittest',module,'-v'],env)
            save('per_clinic_cli_tests.json',{'returncode':run.returncode,'stdout':scrub(run.stdout),'stderr':scrub(run.stderr)})
            print(scrub(run.stderr),flush=True)
            match=re.search(r'Ran (\d+) tests?',run.stderr)
            count=int(match.group(1)) if match else 0
            if run.returncode or count!=2:
                raise RuntimeError('Real per-clinic CLI proof failed; production blocked')
            suites.append({'module':module,'run':count,'pass':count,'fail':0,'returncode':0})
            regression_certificate()
            save('isolated_proof.json',{'status':'PASS','suites':suites,'details':details,'source_hashes':hashes(),
                'per_clinic_cli':json.loads((OUT/'per_clinic_cli_results.json').read_text(encoding='utf-8')),
                'container':container,'target':{'host':'127.0.0.1','port':PORT,'database':'brana_r2b_proof'},'production_writes':0})
        if hashes()!=initial_hashes:
            raise RuntimeError('Source changed during proof; certificate invalid')
    finally:
        if started:
            owned()
            cleanup=command(['docker','rm','-f',NAME])
            save('backup_clone_cleanup.json' if args.verify_backup else 'isolated_cleanup.json',{'name':NAME,'removed':cleanup.returncode==0,'official_runtime_stopped':False})
            if cleanup.returncode:
                raise RuntimeError('Owned disposable cleanup failed')


if __name__=='__main__':
    main()
