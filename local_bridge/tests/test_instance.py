import unittest
from local_bridge.security.instance import InstanceAlreadyRunning, InstanceGuard

class Instance(unittest.TestCase):
    def test_single_instance(self):
        with InstanceGuard("test-bridge"):
            with self.assertRaises(InstanceAlreadyRunning):
                with InstanceGuard("test-bridge"): pass
        with InstanceGuard("test-bridge"): pass

if __name__ == "__main__": unittest.main()
