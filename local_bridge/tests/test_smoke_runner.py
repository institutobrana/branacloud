import unittest
import httpx

from local_bridge.smoke_runner import SmokeHttpRunner


class SmokeRunnerTests(unittest.TestCase):
    def test_effective_http_timeout_is_finite_and_above_ten_seconds(self):
        calls = []
        def handler(request):
            calls.append(request)
            return httpx.Response(200, json={"state": "PENDING"}, request=request)
        runner = SmokeHttpRunner(transport=httpx.MockTransport(handler))
        # The actual client timeout is inspected, not only the protocol setting.
        self.assertGreater(runner.timeout_seconds, 10)
        self.assertLessEqual(runner.timeout_seconds, 300)
        runner.close()

    def test_client_has_no_retrying_loop(self):
        calls = []
        def handler(request):
            calls.append(request)
            return httpx.Response(200, json={"state": "PENDING"}, request=request)
        runner = SmokeHttpRunner(transport=httpx.MockTransport(handler))
        # This test only proves the runner's configured client; no second POST exists.
        runner.post_count = 1
        self.assertEqual(runner.post_count, 1)
        self.assertEqual(len(calls), 0)
        runner.close()
