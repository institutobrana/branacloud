import { useEffect, useState } from 'react';

const INITIAL_FORM = { codigo: '', nome: '', cobertura: '', inativo: false };

export function usePlanoForm(open, convenioRowId, mode = 'new', record = null) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  useEffect(() => {
    if (open) {
      setForm(mode === 'edit' && record ? { codigo: record.codigo || '', nome: record.nome || '', cobertura: record.cobertura || '', inativo: Boolean(record.inativo) } : INITIAL_FORM);
      setSubmitError('');
    }
  }, [open, convenioRowId]);
  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const reset = () => { setForm(INITIAL_FORM); setSubmitError(''); };
  return { form, updateField, reset, submitting, setSubmitting, submitError, setSubmitError };
}
