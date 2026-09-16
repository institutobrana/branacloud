import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchAgendaSemanalEvents, fetchAgendaStatusCatalog } from '../api/agendaSemanalApi.js';
import { normalizeAgendaEvents } from '../utils/agendaRealNormalizer.js';
import { resolveAgendaApiRange } from '../utils/agendaApiRange.js';

export function useAgendaSemanalReal({ filters = {} } = {}) {
  const [state, setState] = useState({ events: [], statusCatalog: [], loading: false, error: '', apiCount: 0, normalizedCount: 0 });
  const requestRef = useRef(null);
  const requestRangeRef = useRef('');
  const loadedRangeRef = useRef('');
  const lastVisibleRangeRef = useRef(null);

  const loadRange = useCallback(async ({ startStr, endStr }) => {
    const { start, end } = resolveAgendaApiRange({ startStr, endStr });
    lastVisibleRangeRef.current = { startStr, endStr };
    const rangeKey = `${start}:${end}:${filters.prestadorId || ''}:${filters.unidadeId || ''}`;
    if (loadedRangeRef.current === rangeKey || requestRangeRef.current === rangeKey) return;
    requestRangeRef.current = rangeKey;
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    setState((current) => ({ ...current, loading: true, error: '' }));
    try {
      const payload = await fetchAgendaSemanalEvents({ start, end, ...filters, signal: controller.signal });
      const events = normalizeAgendaEvents(payload);
      loadedRangeRef.current = rangeKey;
      requestRangeRef.current = '';
      setState((current) => ({ ...current, events, loading: false, error: '', apiCount: payload.length, normalizedCount: events.length }));
    } catch (error) {
      if (error.name === 'AbortError') {
        requestRangeRef.current = '';
        return;
      }
      loadedRangeRef.current = rangeKey;
      requestRangeRef.current = '';
      setState((current) => ({ ...current, loading: false, error: error.message || 'Falha ao carregar a Agenda.' }));
    }
  }, [filters.prestadorId, filters.unidadeId]);

  useEffect(() => {
    if (!lastVisibleRangeRef.current) return;
    loadedRangeRef.current = '';
    loadRange(lastVisibleRangeRef.current);
  }, [filters.prestadorId, filters.unidadeId, loadRange]);

  useEffect(() => {
    const controller = new AbortController();
    void fetchAgendaStatusCatalog({ signal: controller.signal })
      .then((statusCatalog) => setState((current) => ({ ...current, statusCatalog })))
      .catch((error) => {
        if (error.name !== 'AbortError') setState((current) => ({ ...current, statusCatalog: [] }));
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const onBloqueiosChanged = (event) => {
      const changedPrestadorId = event.detail?.prestadorId;
      if (changedPrestadorId && String(changedPrestadorId) !== String(filters.prestadorId || '')) return;
      if (!lastVisibleRangeRef.current) return;
      loadedRangeRef.current = '';
      void loadRange(lastVisibleRangeRef.current);
    };
    window.addEventListener('brana-agenda-bloqueios-changed', onBloqueiosChanged);
    return () => window.removeEventListener('brana-agenda-bloqueios-changed', onBloqueiosChanged);
  }, [filters.prestadorId, loadRange]);

  useEffect(() => () => requestRef.current?.abort(), []);

  return { ...state, loadRange };
}
