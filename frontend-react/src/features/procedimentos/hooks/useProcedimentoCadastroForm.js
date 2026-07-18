import { useMemo, useState } from 'react';
import { createEmptyProcedimentoForm, hydrateProcedimentoForm } from '../procedimentosEditorMappers.js';
import { validateProcedimentoForm } from '../procedimentosEditorValidators.js';

export function useProcedimentoCadastroForm() {
  const [form, setForm] = useState(createEmptyProcedimentoForm());

  const api = useMemo(
    () => ({
      reset(base = {}) {
        setForm(createEmptyProcedimentoForm(base));
      },
      hydrate(item, base = {}) {
        setForm(hydrateProcedimentoForm(item, base));
      },
      setField(field, value) {
        setForm((current) => ({ ...current, [field]: value }));
      },
      setMany(values) {
        setForm((current) => ({ ...current, ...(values || {}) }));
      },
      validate() {
        return validateProcedimentoForm(form);
      },
      get() {
        return form;
      },
    }),
    [form],
  );

  return [form, api];
}
