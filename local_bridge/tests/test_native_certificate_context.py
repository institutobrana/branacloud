import asyncio
import unittest

from local_bridge.cert_store import NativeCertificateContext, PublicCertificateContextFactory, WindowsCertificateStoreError


class FakeCrypt32:
    def __init__(self, contexts=("ctx",)):
        self.contexts = list(contexts); self.free = []; self.closed = []; self.duplicates = []
    def CertOpenSystemStoreW(self, parent, name): return "store"
    def CertEnumCertificatesInStore(self, store, previous):
        if previous is None and self.contexts: return self.contexts.pop(0)
        return None
    def CertDuplicateCertificateContext(self, context): self.duplicates.append(context); return context + "-dup"
    def CertFreeCertificateContext(self, context): self.free.append(context); return 1
    def CertCloseStore(self, store, flags): self.closed.append(store); return 1


class NativeCertificateContextTests(unittest.TestCase):
    def test_factory_duplicates_context_and_closes_store_once(self):
        api = FakeCrypt32()
        factory = PublicCertificateContextFactory(crypt32=api, identity_resolver=lambda ctx: "stable")
        owned = factory.open("stable")
        self.assertEqual(api.closed, ["store"])
        owned.close(); owned.close()
        self.assertEqual(api.free, ["ctx-dup"])
        self.assertEqual(api.closed, ["store"])

    def test_async_context_survives_await_and_closes_on_error(self):
        api = FakeCrypt32()
        async def run():
            factory = PublicCertificateContextFactory(crypt32=api, identity_resolver=lambda ctx: "stable")
            async with factory.open("stable") as owned:
                self.assertIsNotNone(owned.context)
                await asyncio.sleep(0)
                self.assertIsNotNone(owned.context)
                raise RuntimeError("synthetic")
        with self.assertRaisesRegex(RuntimeError, "synthetic"):
            asyncio.run(run())
        self.assertEqual(api.free, ["ctx-dup"])

    def test_missing_identity_and_wrong_store_fail_closed(self):
        with self.assertRaisesRegex(WindowsCertificateStoreError, "CERTIFICATE_SELECTION_REQUIRED"):
            PublicCertificateContextFactory(crypt32=FakeCrypt32(), identity_resolver=lambda ctx: "other").open("stable")
        with self.assertRaisesRegex(WindowsCertificateStoreError, "CERTIFICATE_STORE_INVALID"):
            PublicCertificateContextFactory(store_name="LocalMachine\\My", crypt32=FakeCrypt32()).open("stable")


if __name__ == "__main__":
    unittest.main()
