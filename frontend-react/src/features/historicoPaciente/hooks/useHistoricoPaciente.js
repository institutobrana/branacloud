import { useEffect, useState } from 'react';
import { listarHistoricoPaciente } from '../historicoPacienteApi.js';

export function useHistoricoPaciente({ pacienteId, enabled = true }) {
  const [items, setItems] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const id = Number(pacienteId);
    if (!enabled || !Number.isInteger(id) || id <= 0) {
      setItems([]);
      setLoading(false);
      setError('');
      return undefined;
    }

    const controller = new AbortController();
    setLoading(true);
    setError('');
    listarHistoricoPaciente(id, { order: sortOrder, signal: controller.signal })
      .then(setItems)
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') {
          setItems([]);
          setError(requestError.message || 'Falha ao carregar o histórico.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [enabled, pacienteId, refreshKey, sortOrder]);

  return {
    items,
    loading,
    error,
    sortOrder,
    setSortOrder,
    refresh: () => setRefreshKey((value) => value + 1),
  };
}
