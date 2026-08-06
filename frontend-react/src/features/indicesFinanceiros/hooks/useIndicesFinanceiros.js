import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { listarIndicesFinanceiros } from '../indicesFinanceirosApi.js';
import { normalizeIndiceFinanceiro } from '../indicesFinanceirosMappers.js';

export function useIndicesFinanceiros() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedNumero, setSelectedNumero] = useState(null);
  const requestSeqRef = useRef(0);
  const mountedRef = useRef(true);

  const reload = useCallback(async () => {
    const controller = new AbortController();
    const requestId = ++requestSeqRef.current;

    setLoading(true);
    setError('');

    try {
      const payload = await listarIndicesFinanceiros({ signal: controller.signal });
      if (controller.signal.aborted || requestId !== requestSeqRef.current) {
        return;
      }

      const mappedRows = payload.map(normalizeIndiceFinanceiro);
      setRows(mappedRows);
      setSelectedNumero((current) => {
        if (current == null) {
          return null;
        }
        return mappedRows.some((row) => Number(row.numero) === Number(current)) ? current : null;
      });
    } catch (err) {
      if (controller.signal.aborted || requestId !== requestSeqRef.current) {
        return;
      }

      setRows([]);
      setSelectedNumero(null);
      setError(err?.message || 'Falha ao carregar indices financeiros.');
    } finally {
      if (mountedRef.current && !controller.signal.aborted && requestId === requestSeqRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    void reload();
    return () => {
      mountedRef.current = false;
    };
  }, [reload]);

  const selectedRow = useMemo(
    () => rows.find((row) => Number(row.numero) === Number(selectedNumero)) || null,
    [rows, selectedNumero],
  );

  const selectRow = useCallback((numero) => {
    setSelectedNumero(numero == null ? null : Number(numero));
  }, []);

  return {
    rows,
    loading,
    error,
    selectedNumero,
    selectedRow,
    selectRow,
    reload,
  };
}
