import { useMemo, useState } from 'react';

import { createSimboloGraficoCreateDraft } from '../model/simboloGraficoCreateMapper.js';
import { validateSimboloGraficoCreateForm } from '../model/simboloGraficoCreateValidation.js';
import { createSimboloGraficoCreateInitialState } from '../model/simboloGraficoCreateInitialState.js';

export function useSimboloGraficoCreateForm(catalogs) {
  const [values, setValues] = useState(() => createSimboloGraficoCreateInitialState());
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validation = useMemo(() => validateSimboloGraficoCreateForm(values, catalogs), [values, catalogs]);
  const draft = useMemo(() => (validation.valid ? createSimboloGraficoCreateDraft(validation.normalized, catalogs) : null), [validation, catalogs]);

  const showError = (field) => Boolean(touched[field] || submitted);

  const setField = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }));
    setTouched((current) => ({ ...current, [field]: true }));
  };

  const setFieldTouched = (field) => {
    setTouched((current) => ({ ...current, [field]: true }));
  };

  const markAllTouched = () => {
    setSubmitted(true);
    setTouched({
      descricao: true,
      especialidade: true,
      formaMarcacao: true,
      tipoSimbolo: true,
      bibliotecaSelecionadaId: true,
      desenho: true,
    });
  };

  const reset = () => {
    setValues(createSimboloGraficoCreateInitialState());
    setTouched({});
    setSubmitted(false);
  };

  return {
    values,
    setValues,
    setField,
    setFieldTouched,
    touched,
    submitted,
    markAllTouched,
    reset,
    validation,
    draft,
    showError,
  };
}
