import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  listSimbolosGraficos,
  listSimbolosGraficosEspecialidades,
  listSimbolosGraficosEspecialidadesProcedimentos,
} from '../simbolosGraficosApi.js';
import { applySimbolosGraficosEspecialidadeNames, mapSimbolosGraficosResponse } from '../simbolosGraficosMapper.js';
import { countSimbolosGraficosRows, resolveSimbolosGraficosSelection } from '../simbolosGraficosTableState.js';

export function useSimbolosGraficosTableState() {
  const [rows, setRows] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const requestSeqRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const requestId = ++requestSeqRef.current;

    (async () => {
      try {
        setLoading(true);
        setError('');
        const [payload, especialidadesPayload, especialidadesProcedimentosPayload] = await Promise.all([
          listSimbolosGraficos({ scope: 'catalogo', signal: controller.signal }),
          listSimbolosGraficosEspecialidades(),
          listSimbolosGraficosEspecialidadesProcedimentos(),
        ]);
        if (cancelled || controller.signal.aborted || requestId !== requestSeqRef.current) return;
        setRows(mapSimbolosGraficosResponse(payload));
        setEspecialidades([
          ...(Array.isArray(especialidadesPayload) ? especialidadesPayload : []),
          ...(Array.isArray(especialidadesProcedimentosPayload) ? especialidadesProcedimentosPayload : []),
        ]);
      } catch (err) {
        if (cancelled || controller.signal.aborted || requestId !== requestSeqRef.current) return;
        setRows([]);
        setEspecialidades([]);
        setSelectedId(null);
        setError(err?.message || 'Falha ao carregar símbolos gráficos.');
      } finally {
        if (!cancelled && !controller.signal.aborted && requestId === requestSeqRef.current) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  const resolvedRows = useMemo(
    () => applySimbolosGraficosEspecialidadeNames(rows, especialidades),
    [especialidades, rows],
  );
  const selectedRow = useMemo(
    () => resolvedRows.find((row) => Number(row?.id) === Number(selectedId)) || null,
    [resolvedRows, selectedId],
  );
  const { totalCount } = useMemo(() => countSimbolosGraficosRows(resolvedRows), [resolvedRows]);

  useEffect(() => {
    setSelectedId((current) => resolveSimbolosGraficosSelection(current, resolvedRows));
  }, [resolvedRows]);

  const selectRow = useCallback((id) => {
    setSelectedId(id == null ? null : Number(id));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedId(null);
  }, []);

  const reload = useCallback(async () => {
    const requestId = ++requestSeqRef.current;
    const controller = new AbortController();
    setLoading(true);
    setError('');

    try {
      const [payload, especialidadesPayload, especialidadesProcedimentosPayload] = await Promise.all([
        listSimbolosGraficos({ scope: 'catalogo', signal: controller.signal }),
        listSimbolosGraficosEspecialidades(),
        listSimbolosGraficosEspecialidadesProcedimentos(),
      ]);
      if (controller.signal.aborted || requestId !== requestSeqRef.current) return;
      const mappedRows = mapSimbolosGraficosResponse(payload);
      setRows(mappedRows);
      setEspecialidades([
        ...(Array.isArray(especialidadesPayload) ? especialidadesPayload : []),
        ...(Array.isArray(especialidadesProcedimentosPayload) ? especialidadesProcedimentosPayload : []),
      ]);
      setSelectedId((current) => resolveSimbolosGraficosSelection(current, mappedRows));
    } catch (err) {
      if (controller.signal.aborted || requestId !== requestSeqRef.current) return;
      setRows([]);
      setEspecialidades([]);
      setSelectedId(null);
      setError(err?.message || 'Falha ao carregar símbolos gráficos.');
    } finally {
      if (!controller.signal.aborted && requestId === requestSeqRef.current) {
        setLoading(false);
      }
    }
  }, []);

  return {
    rows: resolvedRows,
    resolvedRows,
    loading,
    error,
    selectedId,
    selectedRow,
    totalCount,
    selectRow,
    clearSelection,
    reload,
  };
}
