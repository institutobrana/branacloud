import { useCallback, useEffect, useRef, useState } from 'react';
import { getAdminOverview } from '../adminOverviewApi.js';
import { normalizeAdminOverview } from '../utils/adminOverviewNormalizer.js';

export function useAdminOverview() {
  const [data, setData] = useState(null);
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
      const raw = await getAdminOverview();
      if (requestIdRef.current !== requestId) return null;
      const normalized = normalizeAdminOverview(raw);
      setData(normalized);
      return normalized;
    } catch (err) {
      if (requestIdRef.current !== requestId) return null;
      setError(err?.message || 'Falha ao carregar a visao geral.');
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

  return { data, loading, refreshing, error, refresh };
}
