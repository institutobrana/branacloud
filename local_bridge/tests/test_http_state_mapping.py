import unittest
from local_bridge.security.http_protocol import HttpProtocolService
from local_bridge.security.ui import PendingApprovalUI


class HttpStateMappingTests(unittest.TestCase):
    def test_default_ui_does_not_approve(self):
        service = HttpProtocolService(ui=PendingApprovalUI())
        self.assertEqual(service.ui.approve_pairing(None).value, "PENDING")
        self.assertEqual(service.ui.approve_signature(None).value, "PENDING")

    def test_service_has_no_signer_or_certificate_dependency(self):
        service = HttpProtocolService()
        self.assertFalse(hasattr(service, "signer")); self.assertFalse(hasattr(service, "certificate_store"))


if __name__ == "__main__": unittest.main()
