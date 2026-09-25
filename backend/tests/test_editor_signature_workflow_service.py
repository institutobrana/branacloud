from __future__ import annotations

import hashlib
import io
import sys
from dataclasses import replace
from pathlib import Path

import fitz
import pytest

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "backend"))
import services.editor_signature_workflow_service as workflow  # noqa: E402
from services.editor_signature_anchor_service import CANONICAL_TOKEN, SignatureAnchorError
from services.editor_signature_workflow_service import SignatureWorkflowError, prepare_and_invoke_signer


def pdf(text=CANONICAL_TOKEN, *, x=100, y=300):
    d=fitz.open(); p=d.new_page(width=595.3,height=841.9); p.insert_text((x,y),text,fontsize=10); p.insert_text((48,760),'Synthetic neighboring content.'); b=io.BytesIO(); d.save(b); return b.getvalue()


class Spy:
    def __init__(self): self.calls=[]
    def __call__(self, data, *, field_name, use_existing_field):
        self.calls.append((data,field_name,use_existing_field)); return b'signed-synthetic'


def test_workflow_passes_exact_bytes_existing_field_and_no_new_spec():
    spy=Spy(); result=prepare_and_invoke_signer(pdf(),spy)
    assert len(spy.calls)==1
    data,name,existing=spy.calls[0]
    assert data is result.prepared_pdf_bytes
    assert hashlib.sha256(data).hexdigest()==result.prepared_pdf_sha256
    assert name=='BranaSignature_1' and existing is True
    assert 'new_field_spec' not in result.diagnostic


@pytest.mark.parametrize('text', ['', CANONICAL_TOKEN+' '+CANONICAL_TOKEN, '<<Cirurgião.Assinatura>>'], ids=['resolver-missing','resolver-duplicate','resolver-similar'])
def test_resolver_failure_blocks_signer(text):
    spy=Spy()
    with pytest.raises(SignatureWorkflowError): prepare_and_invoke_signer(pdf(text),spy)
    assert spy.calls==[]


def test_hash_mismatch_blocks_signer(monkeypatch):
    spy=Spy()
    class Prepared:
        pdf_bytes=b'prepared'; sha256='wrong'; page_index=0; signature_rect=(1,2,3,4)
    monkeypatch.setattr(workflow,'prepare_signature_anchor',lambda *_args,**_kwargs: Prepared())
    with pytest.raises(SignatureWorkflowError,match='PREPARED_PDF_HASH_MISMATCH'): prepare_and_invoke_signer(b'x',spy)
    assert spy.calls==[]


def test_bytes_mutation_before_signer_is_detected(monkeypatch):
    spy=Spy()
    original=workflow.prepare_signature_anchor
    def altered(*args,**kwargs):
        value=original(*args,**kwargs); return replace(value,pdf_bytes=b'changed')
    monkeypatch.setattr(workflow,'prepare_signature_anchor',altered)
    with pytest.raises(SignatureWorkflowError): prepare_and_invoke_signer(pdf(),spy)
    assert spy.calls==[]


def test_empty_or_changed_field_name_is_rejected():
    spy=Spy()
    for name in ('','Signature1','OtherField'):
        with pytest.raises(SignatureWorkflowError): prepare_and_invoke_signer(pdf(),spy,name)
    assert spy.calls==[]


def test_signer_exception_is_sanitized():
    def failing(*_args,**_kwargs): raise RuntimeError('document text must not leak')
    with pytest.raises(SignatureWorkflowError,match='SIGNER_FAILED:RuntimeError') as exc: prepare_and_invoke_signer(pdf(),failing)
    assert 'document text' not in str(exc.value)


def test_diagnostic_is_technical_only():
    result=prepare_and_invoke_signer(pdf(),Spy())
    assert result.diagnostic=={'prepared_page':0,'prepared_rect':result.diagnostic['prepared_rect'],'field_name':'BranaSignature_1','use_existing_field':True}
    assert 'Synthetic' not in str(result.diagnostic)


def test_no_files_are_created_and_signed_hash_is_distinct_when_result_differs(tmp_path):
    before=set(tmp_path.iterdir()); result=prepare_and_invoke_signer(pdf(),Spy()); after=set(tmp_path.iterdir())
    assert before==after and hashlib.sha256(result.signer_result).hexdigest()!=result.prepared_pdf_sha256


def test_signer_called_once_and_result_is_bytes():
    spy=Spy(); result=prepare_and_invoke_signer(pdf(),spy)
    assert len(spy.calls)==1 and result.signer_result==b'signed-synthetic'
