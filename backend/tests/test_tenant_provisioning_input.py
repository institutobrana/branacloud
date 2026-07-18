from __future__ import annotations

import os
import sys
import unittest
from unittest.mock import patch
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from services.tenant_provisioning.input import load_common_tenant_provisioning_input, load_apply_tenant_password


class TenantProvisioningInputTests(unittest.TestCase):
    def test_common_input_does_not_call_getpass(self):
        env = {
            "BRANA_INITIAL_CLINIC_NAME": "Clinica Teste",
            "BRANA_INITIAL_CLINIC_EMAIL": "clinic@example.com",
            "BRANA_INITIAL_UNIT_NAME": "Unidade Principal",
            "BRANA_INITIAL_PROVIDER_NAME": "Dra. Teste",
            "BRANA_INITIAL_PROVIDER_CODE": "1001",
            "BRANA_INITIAL_ADMIN_NAME": "Admin Teste",
            "BRANA_INITIAL_ADMIN_EMAIL": "admin@example.com",
        }
        with patch.dict(os.environ, env, clear=False), patch("backend.services.tenant_provisioning.input.getpass.getpass") as mock_getpass:
            spec = load_common_tenant_provisioning_input()
        self.assertEqual(spec.clinic_name, "Clinica Teste")
        self.assertEqual(spec.provider_code, "1001")
        mock_getpass.assert_not_called()

    def test_apply_password_can_be_loaded_from_env(self):
        with patch.dict(os.environ, {"BRANA_INITIAL_ADMIN_PASSWORD": "senha123"}, clear=False):
            password = load_apply_tenant_password()
        self.assertEqual(password, "senha123")
