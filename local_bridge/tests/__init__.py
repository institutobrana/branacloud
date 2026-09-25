"""Test-only synthetic policy provisioning; never used by production imports."""
import hashlib
import os
import tempfile
from pathlib import Path

_root = Path(tempfile.mkdtemp(prefix="brana-policy-test-"))
os.environ["BRANA_POLICY_DATA_DIR"] = str(_root)
_internal = bytes.fromhex("23e4be4b9b362172e4ebb0e72b86a133ece5aad843d8651c6e38a0ba3f08fc60")
_content = b"\x06\x01\x2a" + b"\x04\x82\x12\x3f" + (b"\0" * 4671) + b"\x04\x20" + _internal
_policy = b"\x30\x82\x12\x68" + _content
(_root / "BranaCloude" / "policy").mkdir(parents=True)
(_root / "BranaCloude" / "policy" / "official-policy-v1_3.der").write_bytes(_policy)
os.environ["BRANA_TEST_POLICY_SHA256"] = hashlib.sha256(_policy).hexdigest()
from local_bridge import pdf_signing as _pdf_signing
_pdf_signing.PREPARED_POLICY_DER_SHA256 = os.environ["BRANA_TEST_POLICY_SHA256"]
