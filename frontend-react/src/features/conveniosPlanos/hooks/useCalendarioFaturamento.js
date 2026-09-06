import { useCallback, useEffect, useState } from 'react';
import { listarCalendarioFaturamento } from '../conveniosPlanosApi.js';

export function useCalendarioFaturamento(convenioRowId, open) {
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const reload = useCallback(async () => {
    if (!convenioRowId) return [];
    setLoading(true); setError('');
    try {
      const next = await listarCalendarioFaturamento(convenioRowId);
      setItems(next);
      setSelectedId((current) => next.some((item) => Number(item.row_id) === Number(current)) ? current : null);
      return next;
    } catch (err) { setItems([]); setSelectedId(null); setError(err?.message || 'Falha ao carregar calendário de faturamento.'); return []; }
    finally { setLoading(false); }
  }, [convenioRowId]);
  useEffect(() => { if (open) void reload(); }, [open, reload]);
  const select = (id) => setSelectedId(id);
  return { items, selectedId, loading, error, reload, select };
}
