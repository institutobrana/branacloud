import unittest

try:
    from backend.services.installation_identity_registry import InstallationIdentityError, InstallationIdentityRegistry
except ModuleNotFoundError:
    from services.installation_identity_registry import InstallationIdentityError, InstallationIdentityRegistry


def fp(char):
    return char * 64


class InstallationIdentityRegistryTests(unittest.TestCase):
    def test_register_validate_revoke_and_rotation(self):
        registry = InstallationIdentityRegistry()
        first = registry.register("bridge-1", fp("a"))
        self.assertTrue(registry.validate("bridge-1", fp("a")))
        self.assertFalse(registry.validate("bridge-1", fp("b")))
        rotated = registry.rotate("bridge-1", fp("b"))
        self.assertEqual(rotated.generation, 2)
        self.assertFalse(registry.validate("bridge-1", fp("a")))
        self.assertTrue(registry.validate("bridge-1", fp("b")))
        registry.revoke("bridge-1")
        self.assertFalse(registry.validate("bridge-1", fp("b")))
        renewed = registry.register("bridge-1", fp("c"))
        self.assertEqual(renewed.generation, 3)
        self.assertTrue(registry.validate("bridge-1", fp("c")))

    def test_unknown_invalid_and_revoked_are_closed(self):
        registry = InstallationIdentityRegistry()
        self.assertFalse(registry.validate("missing", fp("a")))
        with self.assertRaisesRegex(InstallationIdentityError, "INVALID_INSTALLATION_CERTIFICATE_HASH"):
            registry.register("bridge-1", "not-a-fingerprint")
        registry.register("bridge-1", fp("a"))
        registry.revoke("bridge-1")
        with self.assertRaisesRegex(InstallationIdentityError, "INSTALLATION_NOT_ACTIVE"):
            registry.rotate("bridge-1", fp("b"))


if __name__ == "__main__":
    unittest.main()
