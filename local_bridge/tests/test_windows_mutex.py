import unittest
from pathlib import Path

class WindowsMutexContract(unittest.TestCase):
    def test_named_mutex_is_controlled_and_no_network(self):
        text=(Path(__file__).parents[1]/"windows_approval/WindowsMutex.cs").read_text()
        self.assertIn('Global\\\\BranaCloudeBridgeApproval', text); self.assertIn('Mutex', text); self.assertNotIn('TcpListener', text)

if __name__ == "__main__": unittest.main()
