import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { listarIndicesCotacoes } from '../indicesFinanceirosApi.js';
import { normalizeIndiceCotacao } from '../indicesFinanceirosCotacoesMappers.js';

export function useIndicesCotacoes(indiceNumero) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedKey, setSelectedKey] = useState(null);
  const requestSeqRef = useRef(0);
  const mountedRef = useRef(true);

  const clearState = useCallback(() => {
    setRows([]);
    setSelectedKey(null);
    setError('');
    setLoading(false);
  }, []);

  const reload = useCallback(async () => {
    const resolvedNumero = Number(indiceNumero);
    if (!Number.isFinite(resolvedNumero) || resolvedNumero <= 0) {
      clearState();
      return;
    }

    const controller = new AbortController();
    const requestId = ++requestSeqRef.current;

    setLoading(true);
    setError('');

    try {
      const payload = await listarIndicesCotacoes(resolvedNumero, { signal: controller.signal });
      if (controller.signal.aborted || requestId !== requestSeqRef.current) {
        return;
      }

      const mappedRows = payload.map((item) => normalizeIndiceCotacao(item, resolvedNumero));
      setRows(mappedRows);
      setSelectedKey((current) => {
        if (current == null) {
          return null;
        }
        return mappedRows.some((row) => Number(row.cotacaoId) === Number(current)) ? current : null;
      });
    } catch (err) {
      if (controller.signal.aborted || requestId !== requestSeqRef.current) {
        return;
      }

      setRows([]);
      setSelectedKey(null);
      setError(err?.message || 'Falha ao carregar cotações.');
    } finally {
      if (mountedRef.current && !controller.signal.aborted && requestId === requestSeqRef.current) {
        setLoading(false);
      }
    }
  }, [clearState, indiceNumero]);

  useEffect(() => {
    mountedRef.current = true;
    void reload();
    return () => {
      mountedRef.current = false;
    };
  }, [reload]);

  const selectedRow = useMemo(
    () => rows.find((row) => Number(row.cotacaoId) === Number(selectedKey)) || null,
    [rows, selectedKey],
  );

  const selectRow = useCallback((cotacaoId) => {
    setSelectedKey(cotacaoId == null ? null : Number(cotacaoId));
  }, []);

  return {
    rows,
    loading,
    error,
    selectedKey,
    selectedRow,
    selectRow,
    reload,
    clearState,
    hasSelectedIndex: Number(indiceNumero) > 0,
  };
}
