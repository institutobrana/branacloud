import unittest
from local_bridge.security.origin import cors_headers, validate_host, validate_origin


class OriginPolicyTests(unittest.TestCase):
    def test_exact_host_and_origins(self):
        self.assertEqual(validate_host("localhost:8765"), "localhost:8765")
        for origin in ("https://localhost:5173", "https://192.168.3.41:5173"):
            self.assertEqual(validate_origin(origin), origin)

    def test_rejects_invalid_host_and_origin(self):
        for host in (None, "127.0.0.1:8765", "localhost:8766"):
            with self.assertRaises(ValueError): validate_host(host)
        for origin in (None, "null", "http://localhost:5173", "https://localhost:5174", "*"):
            with self.assertRaises(ValueError): validate_origin(origin)

    def test_cors_is_explicit(self):
        headers = cors_headers("https://localhost:5173")
        self.assertNotIn("*", headers.values()); self.assertEqual(headers["Access-Control-Allow-Credentials"], "false")


if __name__ == "__main__": unittest.main()
