"""Real httpx -> Anycorn mTLS -> FastAPI router -> SQL one-shot proof."""
import asyncio, hashlib, http.client, os, socket, ssl, sys, tempfile, unittest
from datetime import datetime, timedelta
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
from cryptography import x509
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.x509.oid import NameOID
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi import FastAPI

from database import Base
from models.clinica import Clinica
from models.usuario import Usuario
from models.usuario_certificado import UsuarioCertificado
from models.signature_authorization import SignatureAuthorization
from models.prestador_odonto import PrestadorOdonto
from models.unidade_atendimento import UnidadeAtendimento
from models.financeiro import Lancamento
from models.convenio_odonto import ConvenioOdonto
from models.procedimento_generico import ProcedimentoGenerico
from models.material import Material
from security.hash import hash_password
from routes.signature_authorization_isolated_routes import create_signature_authorization_router
from services.signature_authorization_service import TrustedInstallationIdentity, issue_authorization
from services.installation_identity_registry import InstallationIdentityRegistry
from local_bridge.security.online_authorization_client import OnlineAuthorizationConfig, OnlineAuthorizationConsumer, OnlineAuthorizationError


def _cert(name, key, issuer, issuer_key, ca=False, san=None):
    b = x509.CertificateBuilder().subject_name(x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, name)])).issuer_name(issuer).public_key(key.public_key()).serial_number(x509.random_serial_number()).not_valid_before(datetime.utcnow()-timedelta(minutes=1)).not_valid_after(datetime.utcnow()+timedelta(days=1)).add_extension(x509.BasicConstraints(ca=ca, path_length=None), critical=True)
    if san: b = b.add_extension(x509.SubjectAlternativeName([x509.DNSName(san)]), critical=False)
    return b.sign(issuer_key, hashes.SHA256())


def _write(root, name, cert, key):
    (root/(name+'.crt')).write_bytes(cert.public_bytes(serialization.Encoding.PEM)); (root/(name+'.key')).write_bytes(key.private_bytes(serialization.Encoding.PEM, serialization.PrivateFormat.TraditionalOpenSSL, serialization.NoEncryption()))


class RealSqlMtlsConsume(unittest.IsolatedAsyncioTestCase):
    async def test_two_real_https_consumes(self):
        anycorn = os.environ.get("ANYCORN_PYTHON")
        if not anycorn: self.skipTest("ANYCORN_PYTHON not set")
        site = Path(anycorn).parent.parent/'Lib'/'site-packages'; sys.path.insert(0, str(site))
        from anycorn import serve
        from anycorn.config import Config
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp); ca_key=rsa.generate_private_key(public_exponent=65537,key_size=2048); ca_name=x509.Name([x509.NameAttribute(NameOID.COMMON_NAME,'ca')]); ca=_cert('ca',ca_key,ca_name,ca_key,ca=True)
            sk=rsa.generate_private_key(public_exponent=65537,key_size=2048); server=_cert('localhost',sk,ca.subject,ca_key,san='localhost'); ck=rsa.generate_private_key(public_exponent=65537,key_size=2048); client=_cert('bridge',ck,ca.subject,ca_key)
            _write(root,'ca',ca,ca_key); _write(root,'server',server,sk); _write(root,'client',client,ck)
            peer_der=client.public_bytes(serialization.Encoding.DER); peer_hash=hashlib.sha256(peer_der).hexdigest(); registry=InstallationIdentityRegistry(); registry.register('install-test',peer_hash)
            engine=create_engine('sqlite:///:memory:',connect_args={'check_same_thread':False},poolclass=__import__('sqlalchemy').pool.StaticPool); tables=[Clinica.__table__,PrestadorOdonto.__table__,UnidadeAtendimento.__table__,Lancamento.__table__,ConvenioOdonto.__table__,ProcedimentoGenerico.__table__,Material.__table__,Usuario.__table__,UsuarioCertificado.__table__,SignatureAuthorization.__table__]; Base.metadata.create_all(engine,tables=tables); db=sessionmaker(bind=engine)(); clinic=Clinica(nome='mtls',email='mtls@test',trial_ate=datetime.utcnow()); db.add(clinic); db.flush(); user=Usuario(nome='holder',email='holder@mtls',senha_hash=hash_password('secret'),clinica_id=clinic.id,ativo=True,setup_completed=True,is_admin=False); db.add(user); db.flush(); db.add(UsuarioCertificado(clinica_id=clinic.id,titular_user_id=user.id,criado_por_user_id=user.id,certificado_der_sha256='a'*64,status='ACTIVE')); db.commit(); identity=TrustedInstallationIdentity('install-test',True); row=issue_authorization(db,actor=user,senha='secret',installation=identity,operation_id='op-http',prepared_pdf_sha256='b'*64,certificado_der_sha256='a'*64,field_name='BranaSignature_1',policy_oid='policy'); db.commit()
            app=FastAPI(); app.include_router(create_signature_authorization_router(get_db=lambda:db,get_actor=lambda:user,installation_registry=registry)); stop=asyncio.Event(); probe=socket.socket(); probe.bind(('127.0.0.1',0)); port=probe.getsockname()[1]; probe.close()
            async def run():
                cfg=Config(); cfg.bind=[f'127.0.0.1:{port}']; cfg.certfile=str(root/'server.crt'); cfg.keyfile=str(root/'server.key'); cfg.ca_certs=str(root/'ca.crt'); cfg.cert_reqs=2; await serve(app,cfg,shutdown_trigger=stop.wait)
            task=asyncio.create_task(run());
            try:
                for _ in range(50):
                    try:
                        with socket.create_connection(('127.0.0.1',port),timeout=.1): break
                    except OSError: await asyncio.sleep(.1)
                consumer=OnlineAuthorizationConsumer(OnlineAuthorizationConfig(f'https://localhost:{port}/v1/signature-authorizations/consume',str(root/'ca.crt'),str(root/'client.crt'),str(root/'client.key')))
                first=await asyncio.to_thread(consumer.consume,authorization_id=row.authorization_id,operation_id='op-http',prepared_pdf_sha256='b'*64,certificate_der_sha256='a'*64,field_name='BranaSignature_1',policy_oid='policy'); self.assertEqual(first,'CONSUMED'); db.refresh(row); self.assertEqual(row.status,'CONSUMED')
                with self.assertRaises(OnlineAuthorizationError): await asyncio.to_thread(consumer.consume,authorization_id=row.authorization_id,operation_id='op-http',prepared_pdf_sha256='b'*64,certificate_der_sha256='a'*64,field_name='BranaSignature_1',policy_oid='policy')
            finally:
                stop.set(); await asyncio.wait_for(task,timeout=5); db.close()


if __name__=='__main__': unittest.main()
