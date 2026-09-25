import hashlib
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from local_bridge.pdf_signing import PREPARED_POLICY_OID, _extract_policy_internal_hash, WindowsPdfSigningError, build_offline_pades_policy

def policy_fixture() -> bytes:
    internal = bytes.fromhex("23e4be4b9b362172e4ebb0e72b86a133ece5aad843d8651c6e38a0ba3f08fc60")
    content = b"\x06\x01\x2a" + b"\x04\x82\x12\x3f" + (b"\0" * 4671) + b"\x04\x20" + internal
    return b"\x30\x82\x12\x68" + content

class OfflinePolicyTests(unittest.TestCase):
    def test_policy_object_contains_expected_oid_and_digest_without_runtime_tmp(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "policy.der"; path.write_bytes(policy_fixture())
            with patch("local_bridge.pdf_signing.PREPARED_POLICY_DER_SHA256", hashlib.sha256(path.read_bytes()).hexdigest()):
                spec = build_offline_pades_policy(der_path=str(path))
        self.assertEqual(spec.signature_policy_identifier.native["sig_policy_id"], PREPARED_POLICY_OID)
        self.assertEqual(spec.signature_policy_identifier.native["sig_policy_hash"]["digest"], bytes.fromhex("23e4be4b9b362172e4ebb0e72b86a133ece5aad843d8651c6e38a0ba3f08fc60"))

    def test_old_full_file_digest_is_not_policy_hash(self):
        data = policy_fixture()
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "policy.der"; path.write_bytes(data)
            with patch("local_bridge.pdf_signing.PREPARED_POLICY_DER_SHA256", hashlib.sha256(data).hexdigest()):
                digest = build_offline_pades_policy(der_path=str(path)).signature_policy_identifier.native["sig_policy_hash"]["digest"]
        self.assertNotEqual(digest, hashlib.sha256(data).digest())

    def test_missing_der_is_rejected(self):
        with self.assertRaisesRegex(WindowsPdfSigningError, "POLICY_DER_UNAVAILABLE"):
            build_offline_pades_policy(der_path="missing-policy.der")

    def test_empty_der_is_rejected(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "empty.der"; path.write_bytes(b"")
            with self.assertRaisesRegex(WindowsPdfSigningError, "POLICY_DER_INVALID"):
                build_offline_pades_policy(der_path=str(path))

    def test_altered_der_is_rejected(self):
        data = policy_fixture()
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "altered.der"; path.write_bytes(data[:-1] + b"x")
            with patch("local_bridge.pdf_signing.PREPARED_POLICY_DER_SHA256", hashlib.sha256(data).hexdigest()):
                with self.assertRaisesRegex(WindowsPdfSigningError, "POLICY_DER_HASH_MISMATCH"):
                    build_offline_pades_policy(der_path=str(path))

    def test_internal_hash_extraction_is_structural(self):
        self.assertEqual(_extract_policy_internal_hash(policy_fixture()).hex(), "23e4be4b9b362172e4ebb0e72b86a133ece5aad843d8651c6e38a0ba3f08fc60")

    def test_contract_oid_is_fixed(self):
        self.assertEqual(PREPARED_POLICY_OID, "2.16.76.1.7.1.11.1.3")

if __name__ == "__main__":
    unittest.main()
