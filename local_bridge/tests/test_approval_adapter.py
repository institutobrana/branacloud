import unittest
import fitz
from local_bridge.security.approval_adapter import ApprovalAdapter, PairingContext, SignatureContext
from local_bridge.security.preview import render_pdf_preview
from local_bridge.security.ui import ApprovalDecision

class Presenter:
    def show_pairing(self, context): self.pairing=context; return ApprovalDecision.APPROVED
    def show_signature(self, context, preview): self.signature=(context,preview); return ApprovalDecision.APPROVED

def pdf():
    d=fitz.open(); d.new_page(); b=d.tobytes(); d.close(); return b

class Adapter(unittest.TestCase):
    def test_contexts_and_hash_binding(self):
        p=Presenter(); a=ApprovalAdapter(p); self.assertEqual(a.show_pairing(PairingContext("r","https://localhost:5173","ABCD",1)), ApprovalDecision.APPROVED)
        b=pdf(); preview=render_pdf_preview(b, field_name="BranaSignature_1", page_index=0, rect=(1,1,221,73)); ctx=SignatureContext("o",preview.sha256,"BranaSignature_1",0,(1,1,221,73),"pades","oid","synthetic",1)
        self.assertEqual(a.show_signature(ctx,preview), ApprovalDecision.APPROVED)
        ctx2=SignatureContext("o","0"*64,"BranaSignature_1",0,(1,1,221,73),"pades","oid","synthetic",1)
        with self.assertRaisesRegex(ValueError,"PREVIEW_HASH_MISMATCH"): a.show_signature(ctx2,preview)

if __name__ == "__main__": unittest.main()
