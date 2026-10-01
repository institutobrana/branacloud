import unittest

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from database import Base
from models.model_registry import import_all_models
from models.bridge_installation import BridgeInstallation, BridgeInstallationEvent
from services.installation_identity_registry import PersistentInstallationIdentityRegistry, InstallationIdentityError


class PersistentInstallationRegistryTests(unittest.TestCase):
    def setUp(self):
        import_all_models()
        self.engine = create_engine("sqlite://")
        Base.metadata.create_all(self.engine, tables=[BridgeInstallation.__table__, BridgeInstallationEvent.__table__])
        self.registry = PersistentInstallationIdentityRegistry(sessionmaker(bind=self.engine))

    def tearDown(self):
        self.engine.dispose()

    def test_register_rotate_revoke_and_fresh_lookup(self):
        self.registry.register("bridge-1", "a" * 64)
        self.assertEqual(self.registry.lookup_active("a" * 64), "bridge-1")
        self.registry.rotate("bridge-1", "b" * 64)
        self.assertIsNone(self.registry.lookup_active("a" * 64))
        self.assertEqual(self.registry.lookup_active("b" * 64), "bridge-1")
        self.registry.revoke("bridge-1")
        self.assertIsNone(self.registry.lookup_active("b" * 64))

    def test_active_duplicate_installation_is_rejected(self):
        self.registry.register("bridge-1", "a" * 64)
        with self.assertRaisesRegex(InstallationIdentityError, "INSTALLATION_ALREADY_REGISTERED"):
            self.registry.register("bridge-1", "b" * 64)


if __name__ == "__main__":
    unittest.main()
