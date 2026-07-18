import { useEffect, useMemo, useRef, useState } from 'react';
import {
  obterProcedimentosDashboard,
  obterProcedimentosDashboardPreview,
} from '../procedimentosApi.js';
import {
  resolveProcedimentoFinanceiroItem,
} from '../procedimentosFinanceiroMappers.js';

const emptyState = Object.freeze({
  loading: false,
  error: '',
  item: null,
  items: [],
  grafico: [],
});

export function useProcedimentoFinanceiro({ procedimentoId, open, refreshKey = 0, previewPayload = null } = {}) {
  const [state, setState] = useState(emptyState);
  const requestSeqRef = useRef(0);
  const previewSignature = useMemo(() => JSON.stringify(previewPayload || null), [previewPayload]);

  useEffect(() => {
    if (!open) {
      requestSeqRef.current += 1;
      setState(emptyState);
      return undefined;
    }

    const abortController = new AbortController();
    const seq = ++requestSeqRef.current;
    const timer = window.setTimeout(() => {
      void (async () => {
        try {
          const hasPreview = !!previewPayload && Object.keys(previewPayload || {}).length > 0;
          if (hasPreview) {
            const response = await obterProcedimentosDashboardPreview(previewPayload, { signal: abortController.signal });
            if (abortController.signal.aborted || seq !== requestSeqRef.current) return;
            const item = resolveProcedimentoFinanceiroItem(response.items, procedimentoId) || response.items[0] || null;
            setState({
              loading: false,
              error: '',
              item,
              items: response.items,
              grafico: response.grafico,
            });
            return;
          }
          const response = await obterProcedimentosDashboard({ signal: abortController.signal });
          if (abortController.signal.aborted || seq !== requestSeqRef.current) return;
          const item = resolveProcedimentoFinanceiroItem(response.items, procedimentoId) || response.items[0] || null;
          setState({
            loading: false,
            error: '',
            item,
            items: response.items,
            grafico: response.grafico,
          });
        } catch (error) {
          if (abortController.signal.aborted || seq !== requestSeqRef.current) return;
          setState({
            loading: false,
            error: String(error?.message || 'Falha ao carregar o painel financeiro.'),
            item: null,
            items: [],
            grafico: [],
          });
        }
      })();
    }, 350);

    setState((current) => ({
      ...current,
      loading: true,
      error: '',
      item: null,
    }));

    return () => {
      window.clearTimeout(timer);
      abortController.abort();
    };
  }, [open, procedimentoId, refreshKey, previewSignature]);

  const api = useMemo(
    () => ({
      clear() {
        requestSeqRef.current += 1;
        setState(emptyState);
      },
      retry() {
        setState((current) => ({ ...current, error: '' }));
      },
    }),
    [],
  );

  return [state, api];
}
