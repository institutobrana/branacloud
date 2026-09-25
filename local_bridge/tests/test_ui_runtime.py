import unittest
from local_bridge.security.approval_adapter import ApprovalAdapter, PairingContext
from local_bridge.security.ui import ApprovalDecision
from local_bridge.security.ui_runtime import ApprovalState, ApprovalUIRuntime, InteractiveSessionProbe

class Presenter:
    def __init__(self, decision): self.decision=decision
    def show_pairing(self, context): return self.decision
    def show_signature(self, context, preview): return self.decision

class UIRuntime(unittest.TestCase):
    def test_approval_denial_expiration_and_unavailable(self):
        ctx=PairingContext("r","https://localhost:5173","CODE",1)
        for decision, expected in [(ApprovalDecision.APPROVED,ApprovalState.APPROVED),(ApprovalDecision.DENIED,ApprovalState.DENIED),(ApprovalDecision.EXPIRED,ApprovalState.EXPIRED)]:
            ui=ApprovalUIRuntime(InteractiveSessionProbe(True),ApprovalAdapter(Presenter(decision)))
            self.assertEqual(ui.show_pairing(ctx).state, expected)
        ui=ApprovalUIRuntime(InteractiveSessionProbe(False),ApprovalAdapter(Presenter(ApprovalDecision.APPROVED)))
        self.assertEqual(ui.show_pairing(ctx).state, ApprovalState.UNAVAILABLE)

if __name__ == "__main__": unittest.main()
