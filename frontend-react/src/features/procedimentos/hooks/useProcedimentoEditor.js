import { useMemo, useState } from 'react';
import { PROCEDIMENTO_EDITOR_MODE } from '../procedimentosEditorConstants.js';

const emptyState = Object.freeze({
  open: false,
  mode: PROCEDIMENTO_EDITOR_MODE.NEW,
  loading: false,
  error: '',
  procedimento: null,
});

export function useProcedimentoEditor() {
  const [state, setState] = useState(emptyState);

  const api = useMemo(
    () => ({
      openNew() {
        setState({ open: true, mode: PROCEDIMENTO_EDITOR_MODE.NEW, loading: false, error: '', procedimento: null });
      },
      openEdit() {
        setState({ open: true, mode: PROCEDIMENTO_EDITOR_MODE.EDIT, loading: false, error: '', procedimento: null });
      },
      setLoading(loading) {
        setState((current) => ({ ...current, loading: !!loading }));
      },
      setError(error) {
        setState((current) => ({ ...current, error: String(error || '') }));
      },
      setProcedimento(procedimento) {
        setState((current) => ({ ...current, procedimento }));
      },
      close() {
        setState((current) => ({ ...current, open: false, loading: false, error: '' }));
      },
      reset() {
        setState(emptyState);
      },
    }),
    [],
  );

  return [state, api];
}
