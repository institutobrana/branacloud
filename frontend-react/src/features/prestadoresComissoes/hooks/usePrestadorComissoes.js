import { useCallback, useEffect, useMemo, useState } from 'react';
import { listarComissaoCombos, listarComissoes, ALL_FILTER } from '../prestadorComissoesApi.js';

function publicPrestadorId(item) {
  return item?.is_system_prestador ? 0 : Number(item?.row_id || item?.id || 0) || null;
}

export function usePrestadorComissoes({ open = false, initialPrestador = null } = {}) {
  const initialFilter = initialPrestador ? publicPrestadorId(initialPrestador) : ALL_FILTER;
  const [filters, setFilters] = useState({ convenioRowId: ALL_FILTER, prestadorRowId: initialFilter });
  const [items, setItems] = useState([]);
  const [convenios, setConvenios] = useState([]);
  const [prestadores, setPrestadores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (open) setFilters((current) => ({ ...current, prestadorRowId: initialFilter }));
  }, [initialFilter, open]);

  useEffect(() => {
    if (!open || convenios.length || prestadores.length) return undefined;
    let alive = true;
    listarComissaoCombos().then((data) => {
      if (!alive) return;
      setConvenios(data.convenios);
      setPrestadores(data.prestadores);
    }).catch(() => {});
    return () => { alive = false; };
  }, [convenios.length, open, prestadores.length]);

  const reload = useCallback(async (cancelled = { current: false }) => {
    setLoading(true);
    setError('');
    try {
      const rows = await listarComissoes(filters);
      if (cancelled.current) return;
      setItems(rows);
      setSelectedId((current) => rows.some((row) => row.id === current) ? current : null);
    } catch (nextError) {
      if (cancelled.current) return;
      setItems([]);
      setSelectedId(null);
      setError(nextError?.message || 'Falha ao carregar fatores de comissão.');
    } finally {
      if (!cancelled.current) setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    if (!open) return undefined;
    const cancelled = { current: false };
    void reload(cancelled);
    return () => { cancelled.current = true; };
  }, [open, reload]);

  const footerLabel = useMemo(() => `${items.length} ${items.length === 1 ? 'fator' : 'fatores'}`, [items.length]);
  return { filters, setFilters, items, convenios, prestadores, loading, error, selectedId, setSelectedId, footerLabel, reload };
}
