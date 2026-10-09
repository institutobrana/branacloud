"""Owned PostgreSQL recovery/individual-backup proof. No production connection."""
import argparse
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
from scripts.recuperar_historico_procedimentos_clinica4 import source_hashes
from scripts.alinhar_clinicas_procedimentos import read,write,sha


def main():
    p=argparse.ArgumentParser();p.add_argument('--out',type=Path,required=True);p.add_argument('--verify-backup',action='store_true');args=p.parse_args()
    out=args.out.resolve()
    if out==ROOT or ROOT in out.parents:raise RuntimeError('Artifacts outside repository required')
    source=out/('backup_id4.json' if args.verify_backup else 'id4_snapshot.json')
    if set(read(source))!={'4'}:raise RuntimeError('Only own ID4 data can enter recovery proof')
    if args.verify_backup:
        manifest=read(out/'backup_manifest.json')
        if manifest['clinic_id']!=4 or manifest['id4_sha256']!=sha(source) or manifest['file_sha256']!=sha(out/'backup_scoped.json'):
            raise RuntimeError('New individual scoped backup checksum mismatch')
    with socket.socket() as sock:
        if sock.connect_ex(('127.0.0.1',55432))==0:raise RuntimeError('Disposable port occupied; never reuse database')
    name='brana-r3b-proof-'+uuid.uuid4().hex[:12];password=secrets.token_hex(20);jwt=secrets.token_hex(32);userpw=secrets.token_hex(16)
    initial=source_hashes();started=False;dest=out/('backup_verification' if args.verify_backup else 'isolated')
    def scrub(value):
        for secret in (password,jwt,userpw):value=value.replace(secret,'[REDACTED]')
        return value
    def run(command,env=None):return subprocess.run(command,cwd=ROOT,env=env,capture_output=True,text=True,encoding='utf-8',errors='replace')
    def owned():
        r=run(['docker','inspect',name])
        if r.returncode:raise RuntimeError('Owned container inspection failed')
        d=json.loads(r.stdout)[0]
        if d['Name']!='/'+name or d['Config']['Labels'].get('brana.phase')!='R3B-ID4-proof' or d['Config']['Image']!='postgres:16-alpine' or d['HostConfig']['PortBindings'].get('5432/tcp')!=[{'HostIp':'127.0.0.1','HostPort':'55432'}]:raise RuntimeError('Unrelated container refused')
    try:
        r=run(['docker','run','-d','--rm','--name',name,'--label','brana.phase=R3B-ID4-proof','-p','127.0.0.1:55432:5432','-e',f'POSTGRES_PASSWORD={password}','-e','POSTGRES_USER=brana_r3b_test','-e','POSTGRES_DB=brana_r3b_proof','postgres:16-alpine'])
        if r.returncode:raise RuntimeError(scrub(r.stderr))
        started=True;owned()
        import psycopg2
        deadline=time.monotonic()+60
        while True:
            try:
                c=psycopg2.connect(host='127.0.0.1',port=55432,user='brana_r3b_test',password=password,dbname='brana_r3b_proof',connect_timeout=2);c.close();break
            except psycopg2.OperationalError:
                if time.monotonic()>deadline:raise RuntimeError('Owned disposable unavailable')
                time.sleep(.5)
        url=f'postgresql://brana_r3b_test:{password}@127.0.0.1:55432/brana_r3b_proof';env=os.environ.copy()
        env.update(DATABASE_URL=url,BRANA_R3B_ISOLATED_URL=url,JWT_SECRET_KEY=jwt,BRANA_RUNTIME_PROFILE='homologation',BRANA_ENABLE_SCHEMA_BOOTSTRAP='0',BRANA_ENABLE_RUNTIME_BOOTSTRAP='0',BRANA_ALLOW_HTTP_RUNTIME_BOOTSTRAP='0',BRANA_ENABLE_SCHEMA_COMPATIBILITY='0',BRANA_SCHEMA_DEPLOYMENT_ALLOW_LOCALHOST='1',BRANA_SCHEMA_DEPLOYMENT_ACK='BRANA_SCHEMA_DEPLOYMENT_ACKNOWLEDGED',PYTHONDONTWRITEBYTECODE='1',PYTHONIOENCODING='utf-8',BRANA_R2C_TEST_PASSWORD=userpw,BRANA_R3B_SNAPSHOT=str(source),BRANA_R3B_ARTIFACT_DIR=str(dest))
        r=run([sys.executable,'-B','-m','backend.scripts.apply_schema_baseline','--apply'],env);write(dest/'schema.json',{'exit_code':r.returncode,'stdout':scrub(r.stdout),'stderr':scrub(r.stderr)})
        if r.returncode:raise RuntimeError('Disposable schema failed: '+scrub(r.stderr[-2000:]))
        print('Running own-ID4 recovery and guarded-neutral PostgreSQL proofs',flush=True)
        r=run([sys.executable,'-B','-m','unittest','backend.tests.test_procedimentos_id4_recovery','-v'],env)
        write(dest/'test_results.json',{'exit_code':r.returncode,'stdout':scrub(r.stdout),'stderr':scrub(r.stderr)})
        print(scrub(r.stderr),flush=True)
        if r.returncode:raise RuntimeError('Isolated recovery failed; production blocked')
        count=int(re.search(r'Ran (\d+) tests',r.stderr)[1])
        rollback=read(dest/'rollback_proof.json');restore=read(dest/'restore_proof.json');parity=read(dest/'clone_parity.json')
        if rollback['status']!='PASS' or restore['status']!='PASS' or parity['status']!='PASS' or source_hashes()!=initial:raise RuntimeError('Rollback/parity/source gate failed')
        proof={'status':'PASS','source_hashes':initial,'tests_run':count,'tests_pass':count,'tests_fail':0,'snapshot_sha256':sha(source),'rollback_pass':True,'reverse_restore_pass':True,'clone_parity':parity,'production_connections':0,'production_writes':0}
        write(out/('backup_isolated_proof.json' if args.verify_backup else 'isolated_proof.json'),proof)
        if args.verify_backup:
            write(out/'rollback_plan.json',{'verified':True,'clinic_id':4,'backup_sha256':sha(source),'source_hashes':initial,'proof':restore,'atomic_rollback':rollback,'method':'Restore only approved procedure table/Generic associations; drop exact reviewed neutral triggers/functions; remove only two newly created rows; refuse intervening data changes'})
            manifest['verified']=True;manifest['rollback_sha256']=sha(out/'rollback_plan.json');manifest['backup_proof_sha256']=sha(out/'backup_isolated_proof.json');write(out/'backup_manifest.json',manifest)
        print(json.dumps({'status':'PASS','backup_verified':args.verify_backup,'tests':count,'rollback':'PASS'}),flush=True)
    finally:
        if started:
            owned();r=run(['docker','rm','-f',name]);write(dest/'cleanup.json',{'name':name,'removed':r.returncode==0,'official_runtime_stopped':False})
            if r.returncode:raise RuntimeError('Owned disposable cleanup failed')


if __name__=='__main__':main()
