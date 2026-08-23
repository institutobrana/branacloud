import { useCallback, useEffect, useMemo, useState } from 'react';

import { listarPrestadores } from '../../prestadores/prestadoresApi.js';
import { ALL_FILTER, listarCredenciamentoCombos, listarCredenciamentos } from '../prestadorCredenciamentosApi.js';

function publicPrestadorId(item) {
  return item?.is_system_prestador ? 0 : Number(item?.row_id || item?.id || 0) || null;
}

export function usePrestadorCredenciamentos({ open = false, initialPrestador = null } = {}) {
  const initialFilter = initialPrestador ? (initialPrestador.is_system_prestador ? 0 : publicPrestadorId(initialPrestador)) : ALL_FILTER;
  const [items, setItems] = useState([]);
  const [convenios, setConvenios] = useState([]);
  const [prestadores, setPrestadores] = useState([]);
  const [filters, setFilters] = useState({ convenioRowId: ALL_FILTER, prestadorRowId: initialFilter });
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setFilters((current) => ({ ...current, prestadorRowId: initialFilter }));
  }, [initialFilter, open]);

  useEffect(() => {
    if (!open || convenios.length || prestadores.length) return undefined;
    let alive = true;
    Promise.all([listarCredenciamentoCombos(), listarPrestadores()])
      .then(([convenioRows, prestadorRows]) => {
        if (!alive) return;
        setConvenios(convenioRows);
        setPrestadores(prestadorRows);
      })
      .catch(() => {
        // The table request reports the actionable loading error.
      });
    return () => { alive = false; };
  }, [convenios.length, open, prestadores.length]);

  const reload = useCallback(async (cancelledRef = { current: false }) => {
    setLoading(true);
    setError('');
    try {
      const rows = await listarCredenciamentos(filters);
      if (cancelledRef.current) return;
      setItems(rows);
      setSelectedId((current) => (rows.some((item) => item.id === current) ? current : null));
    } catch (nextError) {
      if (cancelledRef.current) return;
      setItems([]);
      setSelectedId(null);
      setError(nextError?.message || 'Falha ao carregar credenciamentos.');
    } finally {
      if (!cancelledRef.current) setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    if (!open) return undefined;
    const cancelledRef = { current: false };
    void reload(cancelledRef);
    return () => { cancelledRef.current = true; };
  }, [open, reload]);

  const selectedItem = useMemo(() => items.find((item) => item.id === selectedId) || null, [items, selectedId]);
  const footerLabel = items.length === 1 ? '1 credenciamento' : `${items.length} credenciamentos`;

  return {
    items, convenios, prestadores, filters, setFilters, loading, error, selectedId, setSelectedId,
    selectedItem, footerLabel, reload,
  };
}
