import os
import sys
import unittest
from pathlib import Path
from unittest import mock


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from services.env_loading_service import load_backend_env
from services.runtime_profile_service import should_load_local_env


class EnvLoadingPolicyTests(unittest.TestCase):
    def test_should_load_local_env_allows_local_profiles(self):
        with mock.patch.dict(
            os.environ,
            {"BRANA_RUNTIME_PROFILE": "local"},
            clear=False,
        ):
            self.assertTrue(should_load_local_env())

        with mock.patch.dict(
            os.environ,
            {"BRANA_RUNTIME_PROFILE": "development"},
            clear=False,
        ):
            self.assertTrue(should_load_local_env())

    def test_should_load_local_env_blocks_production(self):
        with mock.patch.dict(
            os.environ,
            {"BRANA_RUNTIME_PROFILE": "production"},
            clear=False,
        ):
            self.assertFalse(should_load_local_env())

    def test_load_backend_env_skips_dotenv_in_production(self):
        with mock.patch.dict(
            os.environ,
            {"BRANA_RUNTIME_PROFILE": "production"},
            clear=False,
        ), mock.patch("services.env_loading_service.load_dotenv") as loader:
            loaded = load_backend_env(Path("backend/.env"))

        self.assertFalse(loaded)
        loader.assert_not_called()

    def test_load_backend_env_uses_dotenv_in_local_profile(self):
        with mock.patch.dict(
            os.environ,
            {"BRANA_RUNTIME_PROFILE": "local"},
            clear=False,
        ), mock.patch("services.env_loading_service.load_dotenv") as loader:
            loaded = load_backend_env(Path("backend/.env"))

        self.assertTrue(loaded)
        loader.assert_called_once()
        _, kwargs = loader.call_args
        self.assertEqual(kwargs["dotenv_path"], Path("backend/.env"))
        self.assertFalse(kwargs["override"])


if __name__ == "__main__":
    unittest.main()
