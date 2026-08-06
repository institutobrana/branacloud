import { useCallback, useRef, useState } from 'react';

import { createSimboloGrafico } from '../simbolosGraficosApi.js';

export function useCreateSimboloGrafico() {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const controllerRef = useRef(null);

  const reset = useCallback(() => {
    if (controllerRef.current) {
      controllerRef.current.abort();
      controllerRef.current = null;
    }
    setSubmitting(false);
    setSubmitError('');
  }, []);

  const cancel = useCallback(() => {
    if (controllerRef.current) {
      controllerRef.current.abort();
      controllerRef.current = null;
    }
    setSubmitting(false);
  }, []);

  const submit = useCallback(async (payload) => {
    if (submitting) {
      return { ok: false, aborted: true };
    }

    const controller = new AbortController();
    controllerRef.current = controller;
    setSubmitting(true);
    setSubmitError('');

    try {
      const response = await createSimboloGrafico(payload, { signal: controller.signal });
      return { ok: true, data: response };
    } catch (error) {
      if (error?.name === 'AbortError') {
        return { ok: false, aborted: true };
      }
      const message = error?.message || 'Falha ao criar simbolo.';
      setSubmitError(message);
      return { ok: false, error: message };
    } finally {
      if (controllerRef.current === controller) {
        controllerRef.current = null;
      }
      setSubmitting(false);
    }
  }, [submitting]);

  return {
    submitting,
    submitError,
    submit,
    reset,
    cancel,
  };
}
