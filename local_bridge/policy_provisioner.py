"""Explicit, pre-operation provisioning for the official AD-RB policy DER."""
from __future__ import annotations
import argparse, hashlib, os, tempfile
from pathlib import Path
from urllib.request import urlopen

POLICY_DER_SIZE = 4716
POLICY_DER_SHA256 = "23da544aef71f7a75dc85fa6e17a83875741e4baef41ec178258a5c86ace54dd"
OFFICIAL_POLICY_URL = "http://politicas.icpbrasil.gov.br/PA_PAdES_AD_RB_v1_3.der"

def default_policy_path() -> Path:
    root = os.getenv("BRANA_POLICY_DATA_DIR") or os.getenv("LOCALAPPDATA") or os.getenv("XDG_DATA_HOME")
    if not root:
        raise RuntimeError("POLICY_DATA_DIR_REQUIRED")
    return Path(root) / "BranaCloude" / "policy" / "official-policy-v1_3.der"

def _read_source(source: str) -> bytes:
    path = Path(source)
    if path.is_file():
        return path.read_bytes()
    with urlopen(source, timeout=20) as response:
        return response.read(POLICY_DER_SIZE + 1)

def provision_policy_der(source: str, destination: str | None = None) -> Path:
    data = _read_source(source)
    if len(data) != POLICY_DER_SIZE:
        raise RuntimeError("POLICY_DER_SIZE_MISMATCH")
    if hashlib.sha256(data).hexdigest() != POLICY_DER_SHA256:
        raise RuntimeError("POLICY_DER_HASH_MISMATCH")
    target = Path(destination) if destination else default_policy_path()
    target.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(dir=target.parent, prefix=target.name + ".", delete=False) as tmp:
        tmp.write(data); temporary = Path(tmp.name)
    temporary.replace(target)
    return target

def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Provision the official AD-RB v1.3 DER before signing.")
    parser.add_argument("--source", required=True)
    parser.add_argument("--destination")
    args = parser.parse_args(argv)
    print(provision_policy_der(args.source, args.destination))
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
