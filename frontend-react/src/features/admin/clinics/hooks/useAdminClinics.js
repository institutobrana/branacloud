import { useCallback, useEffect, useRef, useState } from 'react';
import { getAdminClinics } from '../services/adminClinicsApi.js';
import { normalizeAdminClinics } from '../utils/adminClinicsNormalizer.js';

const DEFAULT_SEARCH_QUERY = '';

export function useAdminClinics({ debounceMs = 350 } = {}) {
  const [query, setQuery] = useState(DEFAULT_SEARCH_QUERY);
  const [searchDraft, setSearchDraft] = useState(DEFAULT_SEARCH_QUERY);
  const [rows, setRows] = useState([]);
  const [totalFromBackend, setTotalFromBackend] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const requestIdRef = useRef(0);

  const refresh = useCallback(async (nextQuery = query) => {
    const normalizedQuery = String(nextQuery || '').trim();
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    setError('');
    setRefreshing(true);
    try {
      const raw = await getAdminClinics({ q: normalizedQuery });
      if (requestIdRef.current !== requestId) return null;
      const normalized = normalizeAdminClinics(raw);
      setRows(normalized.rows);
      setTotalFromBackend(normalized.totalFromBackend);
      setSelectedId((current) => {
        if (current === null || current === undefined) return null;
        return normalized.rows.some((row) => Number(row.id) === Number(current)) ? Number(current) : null;
      });
      return normalized;
    } catch (err) {
      if (requestIdRef.current !== requestId) return null;
      setError(err?.message || 'Falha ao carregar clinicas.');
      return null;
    } finally {
      if (requestIdRef.current === requestId) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, [query]);

  const updateSearch = useCallback((value) => {
    setSearchDraft(String(value || ''));
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const nextQuery = String(searchDraft || '').trim();
      setQuery((current) => (current === nextQuery ? current : nextQuery));
    }, debounceMs);

    return () => window.clearTimeout(timer);
  }, [debounceMs, searchDraft]);

  useEffect(() => {
    void refresh(query);
  }, [query, refresh]);

  return {
    rows,
    totalFromBackend,
    loading,
    refreshing,
    error,
    query,
    searchDraft,
    selectedId,
    setSelectedId,
    updateSearch,
    refresh: () => refresh(query),
  };
}
