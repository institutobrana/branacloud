import asyncio
import hashlib
import unittest
import fitz
from backend.services.editor_signature_anchor_service import prepare_signature_anchor
from datetime import datetime, timedelta, timezone
from cryptography import x509
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.x509.oid import NameOID

from local_bridge.security.windows_prepared_signer import (
    create_real_operational_windows_prepared_signer,
)
from local_bridge.security.prepared_signer import PreparedPdfSigningRequest


class _Context:
    def __init__(self):
        self.context = 123
        self.closed = 0

    def close(self):
        if not self.closed:
            self.closed = 1


class _Contexts:
    def __init__(self, context):
        self.context = context
        self.identities = []

    def open(self, identity):
        self.identities.append(identity)
        return self.context


class _NativeApi:
    def __init__(self):
        self.acquire_calls = 0
        self.sign_calls = []
        self.release_calls = 0

    def acquire(self, context, key_spec):
        self.acquire_calls += 1
        return 1, 2, 1

    def sign_hash(self, key, digest):
        self.sign_calls.append(bytes(digest))
        return b"x" * 256

    def release(self, key):
        self.release_calls += 1


class RealOperationalFactoryTests(unittest.TestCase):
    def test_concrete_factory_keeps_native_seam_only_at_cryptoapi(self):
        pdf = fitz.open()
        pdf.new_page(width=595, height=842).insert_text((100, 300), "<<Cirurgião.AssinaturaDigital>>", fontsize=10)
        body = prepare_signature_anchor(pdf.tobytes()).pdf_bytes
        candidate = {
            "store": "CurrentUser\\My",
            "_stable_identity": "a" * 64,
            "chain_valid": True,
            "provider_name": "Microsoft Enhanced Cryptographic Provider v1.0",
            "provider_kind": "CSP",
            "key_algorithm": "RSA",
            "key_size": 2048,
            "has_private_key": True,
            "key_spec": 1,
        }
        key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
        cert = x509.CertificateBuilder().subject_name(x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, "synthetic")])).issuer_name(x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, "synthetic")])).public_key(key.public_key()).serial_number(x509.random_serial_number()).not_valid_before(datetime.now(timezone.utc) - timedelta(minutes=1)).not_valid_after(datetime.now(timezone.utc) + timedelta(days=1)).sign(key, hashes.SHA256())
        candidate["certificate_der"] = cert.public_bytes(serialization.Encoding.DER)
        context = _Context()
        contexts = _Contexts(context)
        native = _NativeApi()
        selector_calls = []

        def selector():
            selector_calls.append(True)
            return candidate

        factory = create_real_operational_windows_prepared_signer(
            context_factory=contexts, boundary_api=native
        )
        signer = factory(selector)
        request = PreparedPdfSigningRequest(
            body, hashlib.sha256(body).hexdigest(), "BranaSignature_1", True,
            "pades-ad-rb-1.3", "2.16.76.1.7.1.11.1.3", "op", "binding"
        )
        # The native seam is the only substituted component; the production
        # factory, context wrapper, boundary and pyHanko facade are concrete.
        signed = asyncio.run(signer.async_sign_prepared(request))
        self.assertIn(b"/ByteRange", signed)
        self.assertEqual(selector_calls, [True])
        self.assertEqual(contexts.identities, [candidate["_stable_identity"]])
        self.assertEqual(native.acquire_calls, 1)
        self.assertEqual(len(native.sign_calls), 1)
        self.assertEqual(len(native.sign_calls[0]), 32)
        self.assertEqual(context.closed, 1)


if __name__ == "__main__":
    unittest.main()
