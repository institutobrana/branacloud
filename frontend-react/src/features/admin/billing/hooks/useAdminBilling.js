import { useCallback, useEffect, useRef, useState } from 'react';
import { normalizeAdminBilling } from '../normalizers/adminBillingNormalizer.js';
import { getAdminBilling } from '../services/adminBillingApi.js';

export function useAdminBilling() {
  const [rows, setRows] = useState([]);
  const [totalFromBackend, setTotalFromBackend] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const requestIdRef = useRef(0);

  const refresh = useCallback(async () => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    setError('');
    setRefreshing(true);

    try {
      const raw = await getAdminBilling();
      if (requestIdRef.current !== requestId) return null;
      const normalized = normalizeAdminBilling(raw);
      setRows(normalized.rows);
      setTotalFromBackend(normalized.totalFromBackend);
      setSelectedId((current) => {
        if (current === null || current === undefined) return null;
        return normalized.rows.some((row) => Number(row.id) === Number(current)) ? Number(current) : null;
      });
      return normalized;
    } catch (err) {
      if (requestIdRef.current !== requestId) return null;
      setError(err?.message || 'Falha ao carregar cobranças.');
      return null;
    } finally {
      if (requestIdRef.current === requestId) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    rows,
    totalFromBackend,
    selectedId,
    setSelectedId,
    loading,
    refreshing,
    error,
    refresh,
  };
}
