import { useCallback, useMemo, useState } from 'react';
import { fetchAgendaFreeSlots } from '../api/agendaFreeSlotsApi.js';

const defaults = { weekdays: ['1', '2', '3', '4', '5', '6'], startTime: '07:00', endTime: '20:00', period: false, startDate: '', endDate: '' };

export function useAgendaFreeSlots({ open, providerId = '', unitId = '', onClose } = {}) {
  const [filters, setFilters] = useState(defaults);
  const [rows, setRows] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const reset = useCallback(() => { setFilters(defaults); setRows([]); setSelectedIndex(null); setLoading(false); setError(''); }, []);
  const canSearch = useMemo(() => filters.weekdays.length > 0 && filters.endTime > filters.startTime && (!filters.period || (filters.startDate && filters.endDate && filters.endDate >= filters.startDate)), [filters]);
  const search = useCallback(async () => {
    if (!canSearch || loading) return;
    setLoading(true); setError(''); setSelectedIndex(null);
    try {
      const result = await fetchAgendaFreeSlots({ ...filters, providerId: filters.providerId || providerId, unitId: filters.unitId || unitId });
      setRows(result);
      setSelectedIndex(result.length ? 0 : null);
    }
    catch (reason) { setRows([]); setError(reason?.message || 'Falha ao pesquisar horários livres.'); }
    finally { setLoading(false); }
  }, [canSearch, filters, loading, providerId, unitId]);
  return { filters, setFilters, rows, selectedIndex, setSelectedIndex, loading, error, canSearch, search, reset, close: onClose };
}
