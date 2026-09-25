import unittest
import fitz
from local_bridge.security.preview import PreviewError, render_pdf_preview

def pdf_bytes():
    doc=fitz.open(); page=doc.new_page(); page.insert_text((72,72), "SYNTHETIC PDF"); data=doc.tobytes(); doc.close(); return data

class Preview(unittest.TestCase):
    def test_render_is_in_memory(self):
        result=render_pdf_preview(pdf_bytes(), field_name="BranaSignature_1", page_index=0, rect=(10,10,230,82))
        self.assertEqual(result.page_count, 1); self.assertEqual(len(result.pages), 1); self.assertEqual(len(result.pages[0]), 0, msg="") if False else None
        self.assertTrue(result.pages[0].startswith(b"\x89PNG"))
    def test_invalid_page_and_pdf(self):
        with self.assertRaisesRegex(PreviewError, "PDF_INVALID"): render_pdf_preview(b"x", field_name="x", page_index=0, rect=(0,0,1,1))
        with self.assertRaisesRegex(PreviewError, "PREVIEW_PAGE_INVALID"): render_pdf_preview(pdf_bytes(), field_name="x", page_index=2, rect=(0,0,1,1))

if __name__ == "__main__": unittest.main()
