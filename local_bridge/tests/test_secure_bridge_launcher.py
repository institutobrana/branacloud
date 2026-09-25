import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from local_bridge.launch_secure_bridge import ensure_port_free, resolve_paths


class SecureBridgeLauncherTests(unittest.TestCase):
    def test_resolves_dedicated_tls_and_wpf_paths(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            for name in ("bridge-tls-cert.pem", "bridge-tls-key.pem", "Approval.exe"):
                (root / name).write_bytes(b"test")
            cert, key, exe = resolve_paths(tls_dir=root, wpf_executable=root / "Approval.exe")
            self.assertEqual(cert.name, "bridge-tls-cert.pem")
            self.assertEqual(key.name, "bridge-tls-key.pem")
            self.assertEqual(exe.name, "Approval.exe")

    def test_missing_material_fails_closed(self):
        with tempfile.TemporaryDirectory() as tmp, self.assertRaisesRegex(RuntimeError, "TLS_CERTIFICATE_NOT_FOUND"):
            resolve_paths(tls_dir=Path(tmp), wpf_executable=Path(tmp) / "Approval.exe")

    def test_occupied_port_fails_closed(self):
        with patch("local_bridge.launch_secure_bridge.socket.socket") as factory:
            probe = factory.return_value.__enter__.return_value
            probe.bind.side_effect = OSError("occupied")
            with self.assertRaisesRegex(RuntimeError, "BRIDGE_PORT_OCCUPIED"):
                ensure_port_free()

    def test_wpf_process_captures_identity_report(self):
        source = (Path(__file__).parents[1] / "security" / "approval_adapter.py").read_text(encoding="utf-8")
        self.assertIn('stdout=subprocess.PIPE', source)
        self.assertIn('BRANA_WPF_IDENTITY=', (Path(__file__).parents[1] / "windows_approval" / "App.xaml.cs").read_text(encoding="utf-8"))


if __name__ == "__main__":
    unittest.main()
