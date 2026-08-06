import { useCallback, useRef, useState } from 'react';

import { deleteSimboloGrafico } from '../simbolosGraficosApi.js';

export function useDeleteSimboloGrafico() {
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const controllerRef = useRef(null);

  const reset = useCallback(() => {
    if (controllerRef.current) {
      controllerRef.current.abort();
      controllerRef.current = null;
    }
    setDeleting(false);
    setDeleteError('');
  }, []);

  const cancel = useCallback(() => {
    if (controllerRef.current) {
      controllerRef.current.abort();
      controllerRef.current = null;
    }
    setDeleting(false);
  }, []);

  const submit = useCallback(async (id) => {
    if (deleting) {
      return { ok: false, aborted: true };
    }

    const controller = new AbortController();
    controllerRef.current = controller;
    setDeleting(true);
    setDeleteError('');

    try {
      const response = await deleteSimboloGrafico(id, { signal: controller.signal });
      return { ok: true, data: response };
    } catch (error) {
      if (error?.name === 'AbortError') {
        return { ok: false, aborted: true };
      }
      const message = error?.message || 'Falha ao excluir simbolo.';
      setDeleteError(message);
      return { ok: false, error: message, status: error?.status ?? null };
    } finally {
      if (controllerRef.current === controller) {
        controllerRef.current = null;
      }
      setDeleting(false);
    }
  }, [deleting]);

  return {
    deleting,
    deleteError,
    submit,
    reset,
    cancel,
  };
}
