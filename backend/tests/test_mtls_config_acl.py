import subprocess
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from isolated_mtls_service import _read_config_acl


class MtlsConfigAclTests(unittest.TestCase):
    def _run(self, findsid_outputs, *, verify_error=False):
        with tempfile.TemporaryDirectory(prefix="mtls-acl-") as tmp:
            path = Path(tmp) / "mtls-service.json"
            path.write_text("{}", encoding="utf-8")

            def fake_run(args, **kwargs):
                if "/verify" in args:
                    if verify_error:
                        raise subprocess.SubprocessError("verify")
                    return subprocess.CompletedProcess(args, 0, "", "")
                sid = args[-1]
                output = findsid_outputs.get(sid, "Successfully processed 0 files")
                return subprocess.CompletedProcess(args, 0, output, "")

            with patch("isolated_mtls_service.subprocess.run", side_effect=fake_run) as run:
                _read_config_acl(path)
                return [call.args[0][-1] for call in run.call_args_list if "/findsid" in call.args[0]]

    def test_restricted_acl_checks_all_known_sids(self):
        self.assertEqual(self._run({}), ["*S-1-5-32-545", "*S-1-1-0", "*S-1-5-11"])

    def test_users_read_write_and_inherited_are_rejected(self):
        for line in ("file BUILTIN\\Users:(R)", "file BUILTIN\\Users:(F)", "file BUILTIN\\Users:(I)(R)"):
            with self.assertRaisesRegex(RuntimeError, "MTLS_CONFIG_ACL_TOO_BROAD"):
                self._run({"*S-1-5-32-545": line})

    def test_acl_inspection_failure_is_rejected(self):
        with self.assertRaisesRegex(RuntimeError, "MTLS_CONFIG_ACL_UNAVAILABLE"):
            self._run({}, verify_error=True)


if __name__ == "__main__":
    unittest.main()
