import unittest
from local_bridge.security.instance import InstanceAlreadyRunning
from local_bridge.security.instance_runtime import InMemoryInstanceLockFactory

class InstanceRuntime(unittest.TestCase):
    def test_acquire_and_duplicate_rejection(self):
        f=InMemoryInstanceLockFactory(); first=f.create("runtime-test"); second=f.create("runtime-test"); first.acquire()
        with self.assertRaises(InstanceAlreadyRunning): second.acquire()
        first.release(); second.acquire(); second.release()

if __name__ == "__main__": unittest.main()
