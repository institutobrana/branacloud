import ctypes
import struct
import unittest
from unittest.mock import patch

from local_bridge import cert_store


def _provider_info_buffer(provider, container, *, provider_type=24, flags=3, key_spec=1):
    provider_buf = ctypes.create_unicode_buffer(provider)
    container_buf = ctypes.create_unicode_buffer(container) if container is not None else None
    pointer_size = ctypes.sizeof(ctypes.c_void_p)
    raw = bytearray(pointer_size * 2 + 12)
    pointers = [ctypes.addressof(container_buf) if container_buf is not None else 0, ctypes.addressof(provider_buf)]
    for index, pointer in enumerate(pointers):
        raw[index * pointer_size:(index + 1) * pointer_size] = int(pointer).to_bytes(pointer_size, "little")
    struct.pack_into("=III", raw, pointer_size * 2, provider_type, flags, key_spec)
    return bytes(raw), provider_buf, container_buf


class CertKeyProvInfoTests(unittest.TestCase):
    def test_property_present_is_decoded_without_key_access(self):
        payload, provider_buf, container_buf = _provider_info_buffer(
            "Microsoft Enhanced RSA and AES Cryptographic Provider", "synthetic-container"
        )
        calls = []

        def getter(context, prop_id, buffer, size):
            calls.append((context, prop_id, buffer is None))
            if buffer is None:
                size._obj.value = len(payload)
                return 1
            ctypes.memmove(buffer, payload, len(payload))
            size._obj.value = len(payload)
            return 1

        result = cert_store.read_cert_key_prov_info(getter, "ctx")
        self.assertTrue(result["provider_metadata_read"])
        self.assertEqual(result["provider_kind"], "CSP")
        self.assertIn("Cryptographic Provider", result["provider_name_sanitized"])
        self.assertTrue(result["container_present"])
        self.assertEqual(result["provider_type"], 24)
        self.assertEqual(result["key_spec"], 1)
        self.assertEqual(calls[0][1], cert_store.CERT_KEY_PROV_INFO_PROP_ID)
        del provider_buf, container_buf

    def test_property_absent_returns_sanitized_win32_code(self):
        with patch.object(ctypes, "get_last_error", return_value=1168):
            result = cert_store.read_cert_key_prov_info(lambda *args: 0, "ctx")
        self.assertFalse(result["provider_metadata_read"])
        self.assertEqual(result["win32_error_code"], 1168)

    def test_second_property_read_error_returns_win32_code(self):
        payload, provider_buf, container_buf = _provider_info_buffer("Unknown Provider", None)

        def getter(context, prop_id, buffer, size):
            if buffer is None:
                size._obj.value = len(payload)
                return 1
            return 0

        with patch.object(ctypes, "get_last_error", return_value=5):
            result = cert_store.read_cert_key_prov_info(getter, "ctx")
        self.assertFalse(result["provider_metadata_read"])
        self.assertEqual(result["win32_error_code"], 5)
        del provider_buf, container_buf

    def test_invalid_buffer_is_rejected(self):
        with self.assertRaisesRegex(ValueError, "CERT_KEY_PROV_INFO_BUFFER_INVALID"):
            cert_store._decode_cert_key_prov_info_buffer(b"short")

    def test_unknown_provider_does_not_infer_token_or_middleware(self):
        payload, provider_buf, container_buf = _provider_info_buffer("Vendor Provider", None)

        def getter(context, prop_id, buffer, size):
            if buffer is None:
                size._obj.value = len(payload)
                return 1
            ctypes.memmove(buffer, payload, len(payload))
            return 1

        result = cert_store.read_cert_key_prov_info(getter, "ctx")
        self.assertEqual(result["provider_kind"], "PROVIDER_UNKNOWN")
        self.assertIsNone(result["smartcard_or_token"])
        self.assertIsNone(result["middleware_required"])
        del provider_buf, container_buf

    def test_provider_name_is_sanitized_and_container_is_boolean_only(self):
        payload, provider_buf, container_buf = _provider_info_buffer("Bad\r\nProvider\x00" + "x" * 200, "secret-container")

        def getter(context, prop_id, buffer, size):
            if buffer is None:
                size._obj.value = len(payload)
                return 1
            ctypes.memmove(buffer, payload, len(payload))
            return 1

        result = cert_store.read_cert_key_prov_info(getter, "ctx")
        self.assertNotIn("\r", result["provider_name_sanitized"])
        self.assertNotIn("\n", result["provider_name_sanitized"])
        self.assertNotIn("secret-container", str(result))
        self.assertLessEqual(len(result["provider_name_sanitized"]), 96)
        del provider_buf, container_buf


if __name__ == "__main__":
    unittest.main()
