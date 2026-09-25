import unittest
from pathlib import Path

class NamedPipeContract(unittest.TestCase):
    def test_isolated_named_pipe_channel_is_present(self):
        text=(Path(__file__).parents[1]/"windows_approval/NamedPipeAdapter.cs").read_text()
        self.assertIn('InMemoryApprovalChannel', text); self.assertIn('IApprovalChannel', text)
        self.assertIn('NamedPipeServerStreamAcl.Create', text); self.assertIn('CreateRestrictedSecurity', text); self.assertNotIn('File.Write', text)

    def test_approval_requires_current_button_proof(self):
        app = (Path(__file__).parents[1]/"windows_approval/App.xaml.cs").read_text()
        dto = (Path(__file__).parents[1]/"windows_approval/UiProtocolDto.cs").read_text()
        presenter = (Path(__file__).parents[1]/"security/approval_adapter.py").read_text()
        self.assertIn('ApprovalSource = decision == ApprovalState.APPROVED ? "ApproveClick"', app)
        self.assertIn('ApprovalSource', dto)
        self.assertIn('approval_source") != "ApproveClick"', presenter)

if __name__ == "__main__": unittest.main()
