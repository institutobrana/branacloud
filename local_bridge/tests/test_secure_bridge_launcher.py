import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from local_bridge.launch_secure_bridge import ensure_port_free, resolve_dotnet_helper, resolve_paths, resolve_mtls_channel, _helper_event_log_sink


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

    def test_store_helper_requires_explicit_operational_path(self):
        with tempfile.TemporaryDirectory() as tmp:
            helper = Path(tmp) / "BranaNativeSha256Helper.exe"
            helper.write_bytes(b"synthetic helper marker")
            self.assertIsNone(resolve_dotnet_helper(enabled=False))
            self.assertEqual(resolve_dotnet_helper(enabled=True, helper_path=helper), helper)

    def test_store_helper_rejects_testhost_and_implicit_path(self):
        with tempfile.TemporaryDirectory() as tmp:
            testhost = Path(tmp) / "BranaNativeSha256HelperTestHost.exe"
            testhost.write_bytes(b"testhost")
            with self.assertRaisesRegex(RuntimeError, "DOTNET_STORE_HELPER_PATH_INVALID"):
                resolve_dotnet_helper(enabled=True, helper_path=testhost)
            with self.assertRaisesRegex(RuntimeError, "DOTNET_HELPER_REQUIRES_EXPLICIT_GATE"):
                resolve_dotnet_helper(enabled=False, helper_path=testhost)

    def test_mtls_channel_is_complete_and_absolute(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            files = [root / name for name in ("ca.pem", "client.pem", "client.key")]
            for path in files:
                path.write_bytes(b"test")
            config = resolve_mtls_channel(endpoint="https://localhost:8765", ca_cert=files[0], client_cert=files[1], client_key=files[2])
            self.assertEqual(config["endpoint"], "https://localhost:8765")
            self.assertTrue(all(path.is_absolute() for name, path in config.items() if name != "endpoint"))
            with self.assertRaisesRegex(RuntimeError, "MTLS_CLIENT_KEY_INVALID"):
                resolve_mtls_channel(endpoint="https://localhost:8765", ca_cert=files[0], client_cert=files[1], client_key=root / "missing.key")

    def test_build_runtime_default_is_non_signing_and_explicit_graph_is_store_only(self):
        from local_bridge import launch_secure_bridge
        with tempfile.TemporaryDirectory() as tmp, patch.object(launch_secure_bridge, "create_secure_bridge_runtime", return_value="runtime") as factory:
            root = Path(tmp)
            cert, key, wpf = root / "cert.pem", root / "key.pem", root / "Approval.exe"
            cert.write_bytes(b"cert"); key.write_bytes(b"key"); wpf.write_bytes(b"wpf")
            self.assertEqual(launch_secure_bridge.build_runtime(cert, key, wpf), "runtime")
            default_kwargs = factory.call_args.kwargs
            self.assertTrue(default_kwargs["production_mode"])
            self.assertFalse(default_kwargs["enable_real_signing"])
            self.assertNotIn("enable_dotnet_store_helper", default_kwargs)

            factory.reset_mock()
            helper = root / "BranaNativeSha256Helper.exe"
            helper.write_bytes(b"helper")
            ca, client, client_key = root / "ca.pem", root / "client.pem", root / "client.key"
            for path in (ca, client, client_key):
                path.write_bytes(b"test")
            self.assertEqual(launch_secure_bridge.build_runtime(cert, key, wpf, enable_dotnet_store_helper=True, dotnet_helper_path=helper, mtls_endpoint="https://localhost:8765", mtls_ca_cert=ca, mtls_client_cert=client, mtls_client_key=client_key), "runtime")
            explicit_kwargs = factory.call_args.kwargs
            self.assertTrue(explicit_kwargs["production_mode"])
            self.assertTrue(explicit_kwargs["enable_real_signing"])
            self.assertTrue(explicit_kwargs["require_online_authorization"])
            self.assertTrue(explicit_kwargs["enable_dotnet_store_helper"])
            self.assertEqual(explicit_kwargs["dotnet_helper_executable"], str(helper))
            self.assertIsNotNone(explicit_kwargs["online_authorization_consumer"])
            self.assertIsNotNone(explicit_kwargs["reservation_challenge_forwarder"])

    def test_store_helper_fails_closed_without_mtls_channel(self):
        from local_bridge import launch_secure_bridge
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            cert, key, wpf = root / "cert.pem", root / "key.pem", root / "Approval.exe"
            helper = root / "BranaNativeSha256Helper.exe"
            for path in (cert, key, wpf, helper):
                path.write_bytes(b"test")
            with self.assertRaisesRegex(RuntimeError, "MTLS_ENDPOINT_REQUIRED"):
                launch_secure_bridge.build_runtime(cert, key, wpf, enable_dotnet_store_helper=True, dotnet_helper_path=helper)

    def test_launcher_test_injection_keeps_online_gate_and_clients(self):
        from local_bridge import launch_secure_bridge
        with tempfile.TemporaryDirectory() as tmp, patch.object(launch_secure_bridge, "create_secure_bridge_runtime", return_value="runtime") as factory:
            root = Path(tmp)
            cert, key, wpf = root / "cert.pem", root / "key.pem", root / "Approval.exe"
            ca, client, client_key = root / "ca.pem", root / "client.pem", root / "client.key"
            for path in (cert, key, wpf, ca, client, client_key):
                path.write_bytes(b"test")
            launch_secure_bridge.build_runtime(
                cert, key, wpf, mtls_endpoint="https://localhost:8765", mtls_ca_cert=ca,
                mtls_client_cert=client, mtls_client_key=client_key,
                test_only_ui=object(), test_only_signer=object(), test_only_lock=object(),
            )
            kwargs = factory.call_args.kwargs
            self.assertTrue(kwargs["require_online_authorization"])
            self.assertIsNotNone(kwargs["online_authorization_consumer"])
            self.assertIsNotNone(kwargs["reservation_challenge_forwarder"])
            self.assertTrue(kwargs["enable_real_signing"])

    def test_launcher_test_injection_requires_all_doubles(self):
        from local_bridge import launch_secure_bridge
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            cert, key, wpf = root / "cert.pem", root / "key.pem", root / "Approval.exe"
            for path in (cert, key, wpf):
                path.write_bytes(b"test")
            with self.assertRaisesRegex(RuntimeError, "TEST_RUNTIME_INJECTION_INCOMPLETE"):
                launch_secure_bridge.build_runtime(cert, key, wpf, test_only_ui=object())

    def test_test_only_injection_is_not_a_cli_or_environment_contract(self):
        from local_bridge import launch_secure_bridge
        source = Path(launch_secure_bridge.__file__).read_text(encoding="utf-8")
        self.assertNotIn('add_argument("--test-only-ui"', source)
        self.assertNotIn('add_argument("--test-only-signer"', source)
        self.assertNotIn('BRANA_TEST_ONLY_UI', source)
        self.assertNotIn('BRANA_TEST_ONLY_SIGNER', source)

    def test_operational_helper_events_use_persistent_correlated_log(self):
        import json
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "logs" / "helper.jsonl"
            sink = _helper_event_log_sink(path, "corr-123")
            sink("HELPER_PROCESS_STARTED")
            sink("HELPER_STORE_OPEN_FAILED")
            sink("not-technical")
            records = [json.loads(line) for line in path.read_text(encoding="utf-8").splitlines()]
            self.assertEqual([item["event"] for item in records], ["HELPER_PROCESS_STARTED", "HELPER_STORE_OPEN_FAILED"])
            self.assertEqual([item["sequence"] for item in records], [1, 2])
            self.assertTrue(all(item["correlation_id"] == "corr-123" for item in records))


if __name__ == "__main__":
    unittest.main()
