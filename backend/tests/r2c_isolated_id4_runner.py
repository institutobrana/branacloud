"""Owned PostgreSQL ID4 snapshot proof; never connects to production."""
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

ROOT=Path(__file__).resolve().parents[2]
sys.path.insert(0,str(ROOT/'backend'))
from scripts.sanar_procedimentos_clinica4 import source_hashes
from scripts.alinhar_clinicas_procedimentos import read,write,sha


def main():
    parser=argparse.ArgumentParser();parser.add_argument('--out',type=Path,required=True);parser.add_argument('--verify-backup',action='store_true');args=parser.parse_args()
    out=args.out.resolve()
    if out==ROOT or ROOT in out.parents:raise RuntimeError('Artifacts outside repository only')
    source=out/('backup_scoped.json' if args.verify_backup else 'before_scoped.json')
    if args.verify_backup:
        manifest=read(out/'backup_manifest.json')
        if manifest['clinic_id']!=4 or manifest['file_sha256']!=sha(source):raise RuntimeError('Individual ID4 backup checksum mismatch')
    with socket.socket() as sock:
        if sock.connect_ex(('127.0.0.1',55432))==0:raise RuntimeError('Disposable port occupied; never reuse other database')
    name='brana-r2c-proof-'+uuid.uuid4().hex[:12];password=secrets.token_hex(20);jwt=secrets.token_hex(32);userpw=secrets.token_hex(16)
    initial_hashes=source_hashes();started=False;destination=out/('backup_verification' if args.verify_backup else 'isolated')
    def scrub(value):
        for secret in (password,jwt,userpw):value=value.replace(secret,'[REDACTED]')
        return value
    def run(command,env=None):return subprocess.run(command,cwd=ROOT,env=env,capture_output=True,text=True,encoding='utf-8',errors='replace')
    def owned():
        result=run(['docker','inspect',name])
        if result.returncode:raise RuntimeError('Owned container inspection failed')
        d=json.loads(result.stdout)[0]
        if d['Name']!='/'+name or d['Config']['Labels'].get('brana.phase')!='R2C-ID4-proof' or d['Config']['Image']!='postgres:16-alpine' or d['HostConfig']['PortBindings'].get('5432/tcp')!=[{'HostIp':'127.0.0.1','HostPort':'55432'}]:raise RuntimeError('Unrelated container refused')
    try:
        result=run(['docker','run','-d','--rm','--name',name,'--label','brana.phase=R2C-ID4-proof','-p','127.0.0.1:55432:5432','-e',f'POSTGRES_PASSWORD={password}','-e','POSTGRES_USER=brana_r2c_test','-e','POSTGRES_DB=brana_r2c_proof','postgres:16-alpine'])
        if result.returncode:raise RuntimeError(scrub(result.stderr))
        started=True;owned()
        import psycopg2
        deadline=time.monotonic()+60
        while True:
            try:
                conn=psycopg2.connect(host='127.0.0.1',port=55432,user='brana_r2c_test',password=password,dbname='brana_r2c_proof',connect_timeout=2);conn.close();break
            except psycopg2.OperationalError:
                if time.monotonic()>deadline:raise RuntimeError('Owned disposable unavailable')
                time.sleep(.5)
        url=f'postgresql://brana_r2c_test:{password}@127.0.0.1:55432/brana_r2c_proof';env=os.environ.copy()
        env.update(DATABASE_URL=url,BRANA_R2C_ISOLATED_URL=url,JWT_SECRET_KEY=jwt,BRANA_RUNTIME_PROFILE='homologation',BRANA_ENABLE_SCHEMA_BOOTSTRAP='0',BRANA_ENABLE_RUNTIME_BOOTSTRAP='0',BRANA_ALLOW_HTTP_RUNTIME_BOOTSTRAP='0',BRANA_ENABLE_SCHEMA_COMPATIBILITY='0',BRANA_SCHEMA_DEPLOYMENT_ALLOW_LOCALHOST='1',BRANA_SCHEMA_DEPLOYMENT_ACK='BRANA_SCHEMA_DEPLOYMENT_ACKNOWLEDGED',PYTHONDONTWRITEBYTECODE='1',PYTHONIOENCODING='utf-8',BRANA_R2C_TEST_PASSWORD=userpw,BRANA_R2C_SNAPSHOT=str(source),BRANA_R2C_ARTIFACT_DIR=str(destination))
        result=run([sys.executable,'-B','-m','backend.scripts.apply_schema_baseline','--apply'],env);write(destination/'schema.json',{'exit_code':result.returncode,'stdout':scrub(result.stdout),'stderr':scrub(result.stderr)})
        if result.returncode:raise RuntimeError('Disposable schema failed: '+scrub(result.stderr[-2000:]))
        print('Running historical ID4 unit/real PostgreSQL snapshot proofs',flush=True)
        result=run([sys.executable,'-B','-m','unittest','backend.tests.test_procedimentos_id4_exception','-v'],env)
        write(destination/'test_results.json',{'exit_code':result.returncode,'stdout':scrub(result.stdout),'stderr':scrub(result.stderr)})
        print(scrub(result.stderr),flush=True)
        if result.returncode:raise RuntimeError('ID4 isolated proof failed; production blocked')
        count=int(re.search(r'Ran (\d+) tests',result.stderr)[1])
        rollback=read(destination/'rollback_proof.json');parity=read(destination/'clone_parity.json')
        if rollback['status']!='PASS' or not rollback['restored_exactly'] or parity['status']!='PASS' or source_hashes()!=initial_hashes:raise RuntimeError('Rollback/parity/source proof gate failed')
        proof={'status':'PASS','source_hashes':initial_hashes,'tests_run':count,'tests_pass':count,'tests_fail':0,'snapshot_sha256':sha(source),'clone_parity':parity,'rollback':rollback,'production_connections':0,'production_writes':0}
        write(out/('backup_isolated_proof.json' if args.verify_backup else 'isolated_proof.json'),proof)
        if args.verify_backup:
            rollback_plan={'verified':True,'clinic_id':4,'backup_sha256':sha(source),'source_hashes':initial_hashes,'proof':rollback,'method':'Exact original procedure-domain rows reproduced in owned clone; backfill then guarded restoration of only changed required fields; no other entity/field restored or overwritten'}
            write(out/'rollback_plan.json',rollback_plan);manifest['verified']=True;manifest['rollback_sha256']=sha(out/'rollback_plan.json');manifest['backup_proof_sha256']=sha(out/'backup_isolated_proof.json');write(out/'backup_manifest.json',manifest)
        print(json.dumps({'status':'PASS','verify_backup':args.verify_backup,'tests':count,'rollback':'PASS','snapshot_domain_parity':'PASS'}),flush=True)
    finally:
        if started:
            owned();cleanup=run(['docker','rm','-f',name]);write(destination/'cleanup.json',{'name':name,'removed':cleanup.returncode==0,'official_runtime_stopped':False})
            if cleanup.returncode:raise RuntimeError('Owned disposable cleanup failed')


if __name__=='__main__':main()
