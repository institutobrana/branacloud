import unittest
from pathlib import Path

ROOT = Path(__file__).parents[1] / "windows_approval"

class WindowsApprovalSource(unittest.TestCase):
    def test_project_and_sanitized_contract(self):
        project = (ROOT / "BranaWindowsApproval.csproj").read_text()
        models = (ROOT / "ApprovalModels.cs").read_text()
        self.assertIn("net8.0-windows", project); self.assertIn("UseWPF", project)
        for state in ("PENDING", "APPROVED", "DENIED", "EXPIRED", "UNAVAILABLE"): self.assertIn(state, models)
        for forbidden in ("PFX", "PIN", "HMAC", "thumbprint", "private"): self.assertIn(forbidden.lower(), models.lower())

    def test_operational_handler_requires_manual_dialog_result(self):
        source = (ROOT / "App.xaml.cs").read_text(encoding="utf-8")
        self.assertIn("dialogResult == true", source)
        self.assertNotIn("ApprovalState.APPROVED;", source)

if __name__ == "__main__": unittest.main()
