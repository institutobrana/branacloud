"""Real Anycorn TLS-scope proof; no router, backend, bridge, or signer."""
import hashlib
import asyncio
import http.client
import os
import subprocess
import sys
import socket
import json
import tempfile
import time
import unittest
from datetime import datetime, timedelta
from pathlib import Path

from cryptography import x509
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.x509.oid import NameOID


def cert(name, key, issuer, issuer_key, ca=False, san=None):
    b = x509.CertificateBuilder().subject_name(x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, name)])).issuer_name(issuer).public_key(key.public_key()).serial_number(x509.random_serial_number()).not_valid_before(datetime.utcnow() - timedelta(minutes=1)).not_valid_after(datetime.utcnow() + timedelta(days=1)).add_extension(x509.BasicConstraints(ca=ca, path_length=None), critical=True)
    if san:
        b = b.add_extension(x509.SubjectAlternativeName([x509.DNSName(san)]), critical=False)
    return b.sign(issuer_key, hashes.SHA256())


def write_pair(root, name, certificate, key):
    (root / (name + ".crt")).write_bytes(certificate.public_bytes(serialization.Encoding.PEM))
    (root / (name + ".key")).write_bytes(key.private_bytes(serialization.Encoding.PEM, serialization.PrivateFormat.TraditionalOpenSSL, serialization.NoEncryption()))


class AnycornTlsScope(unittest.TestCase):
    def test_real_handshake_and_scope_chain(self):
        anycorn = os.environ.get("ANYCORN_PYTHON")
        if not anycorn:
            self.skipTest("ANYCORN_PYTHON must point to disposable Anycorn environment")
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            ca_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
            ca_name = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, "ephemeral-ca")])
            ca = cert("ephemeral-ca", ca_key, ca_name, ca_key, ca=True)
            server_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
            server = cert("localhost", server_key, ca.subject, ca_key, san="localhost")
            client_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
            client = cert("registered", client_key, ca.subject, ca_key)
            unknown_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
            unknown = cert("unknown", unknown_key, ca.subject, ca_key)
            other_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
            other_ca_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
            other_ca = cert("other-ca", other_ca_key, x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, "other-ca")]), other_ca_key, ca=True)
            other = cert("untrusted", other_key, other_ca.subject, other_ca_key)
            write_pair(root, "ca", ca, ca_key); write_pair(root, "server", server, server_key); write_pair(root, "client", client, client_key); write_pair(root, "unknown", unknown, unknown_key); write_pair(root, "other", other, other_key)
            (root / "app.py").write_text("""import hashlib, os, ssl\nasync def app(scope, receive, send):\n    marker = os.environ['HANDLER_MARKER']\n    with open(marker, 'a', encoding='ascii') as f: f.write('1\\n')\n    chain = scope.get('extensions', {}).get('tls', {}).get('client_cert_chain') or ()\n    if not chain:\n        await send({'type':'http.response.start','status':403,'headers':[]}); await send({'type':'http.response.body','body':b''}); return\n    der = ssl.PEM_cert_to_DER_cert(chain[0])\n    digest = hashlib.sha256(der).hexdigest().encode()\n    await send({'type':'http.response.start','status':200 if digest == os.environ['REGISTERED_SHA256'].encode() else 403,'headers':[(b'content-length', str(len(digest)).encode())]}); await send({'type':'http.response.body','body':digest})\n""", encoding="utf-8")
            probe = socket.socket(); probe.bind(("127.0.0.1", 0)); port = probe.getsockname()[1]; probe.close()
            marker = root / "handler-calls.txt"
            (root / "handler_calls.py").write_text("", encoding="ascii")
            site = Path(anycorn).parent.parent / "Lib" / "site-packages"
            sys.path.insert(0, str(site))
            from anycorn.config import Config
            from anycorn import serve

            async def run_server(stop):
                config = Config(); config.bind = [f"127.0.0.1:{port}"]; config.certfile = str(root / "server.crt"); config.keyfile = str(root / "server.key"); config.ca_certs = str(root / "ca.crt"); config.cert_reqs = 2
                async def app(scope, receive, send):
                    chain = scope.get("extensions", {}).get("tls", {}).get("client_cert_chain") or ()
                    if chain:
                        with open(marker, "a", encoding="ascii") as f: f.write("1\n")
                    if not chain:
                        await send({"type":"http.response.start","status":403,"headers":[]}); await send({"type":"http.response.body","body":b""}); return
                    der = __import__('ssl').PEM_cert_to_DER_cert(chain[0]); digest = hashlib.sha256(der).hexdigest().encode(); status = 200 if digest.decode() == hashlib.sha256(client.public_bytes(serialization.Encoding.DER)).hexdigest() else 403
                    await send({"type":"http.response.start","status":status,"headers":[(b"content-length", str(len(digest)).encode())]}); await send({"type":"http.response.body","body":digest})
                await serve(app, config, shutdown_trigger=stop.wait)

            async def exercise():
                stop = asyncio.Event(); server_task = asyncio.create_task(run_server(stop))
                try:
                    for _ in range(50):
                        try:
                            with socket.create_connection(("127.0.0.1", port), timeout=0.1): break
                        except OSError: await asyncio.sleep(0.1)
                    def call(cert_name=None, key_name=None, forged=None):
                        context = __import__('ssl').create_default_context(cafile=str(root / "ca.crt")); context.check_hostname = False
                        if cert_name: context.load_cert_chain(root / (cert_name + ".crt"), root / (key_name + ".key"))
                        conn = http.client.HTTPSConnection("127.0.0.1", port, context=context, timeout=3)
                        headers = {"X-Client-Cert": forged} if forged else {}
                        try:
                            conn.request("GET", "/", headers=headers); response = conn.getresponse(); body = response.read(); conn.close(); return response.status, body
                        except (OSError, __import__('ssl').SSLError):
                            conn.close(); return 495, b""
                    status, body = await asyncio.to_thread(call, "client", "client")
                    self.assertEqual(status, 200); self.assertEqual(body.decode(), hashlib.sha256(client.public_bytes(serialization.Encoding.DER)).hexdigest())
                    before = marker.read_text(encoding="ascii").count("1") if marker.exists() else 0
                    self.assertNotEqual((await asyncio.to_thread(call))[0], 200)
                    self.assertEqual(marker.read_text(encoding="ascii").count("1") if marker.exists() else 0, before)
                    self.assertNotEqual((await asyncio.to_thread(call, "unknown", "unknown"))[0], 200)
                    self.assertNotEqual((await asyncio.to_thread(call, "other", "other"))[0], 200)
                    self.assertNotEqual((await asyncio.to_thread(call, forged="forged-cert"))[0], 200)
                    self.assertEqual(marker.read_text(encoding="ascii").count("1"), before + 1)
                finally:
                    stop.set(); await asyncio.wait_for(server_task, timeout=5)
            asyncio.run(exercise())


if __name__ == "__main__":
    unittest.main()
