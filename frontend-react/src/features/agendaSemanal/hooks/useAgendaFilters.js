import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchAgendaSemanalCatalogs } from '../api/agendaSemanalApi.js';

const text = (value) => String(value ?? '').trim();
const sameText = (a, b) => text(a).localeCompare(text(b), 'pt-BR', { sensitivity: 'base' }) === 0;

export function normalizeAgendaCatalogs(payload = {}) {
  const especialidades = (Array.isArray(payload.especialidades) ? payload.especialidades : [])
    .map((item) => ({ value: text(item.codigo || item.nome), label: text(item.nome || item.codigo) }))
    .filter((item) => item.value && item.label);
  const prestadores = (Array.isArray(payload.prestadores) ? payload.prestadores : [])
    .map((item) => ({
      id: item.id ?? item.row_id,
      nome: text(item.nome),
      value: text(item.id || item.row_id),
      label: text(item.nome),
      especialidade: text(item.especialidade),
      especialidadesExec: Array.isArray(item.especialidades_exec) ? item.especialidades_exec.map(text).filter(Boolean) : [],
      agenda_config: item.agenda_config && typeof item.agenda_config === 'object' ? item.agenda_config : {},
    }))
    .filter((item) => item.value && item.label);
  const unidades = (Array.isArray(payload.unidades) ? payload.unidades : [])
    .map((item) => ({ value: text(item.id || item.row_id), label: text(item.nome || item.descricao) }))
    .filter((item) => item.value && item.label);
  return { especialidades, prestadores, unidades };
}

export function filterAgendaProviders(providers, specialty) {
  if (!text(specialty)) return providers;
  return providers.filter((provider) => sameText(provider.especialidade, specialty)
    || provider.especialidadesExec.some((item) => sameText(item, specialty)));
}

export function useAgendaFilters({ currentPrestadorId = '', currentUnitId = '' } = {}) {
  const [catalogs, setCatalogs] = useState({ especialidades: [], prestadores: [], unidades: [] });
  const normalizedCurrentPrestadorId = text(currentPrestadorId);
  const normalizedCurrentUnitId = text(currentUnitId);
  const [filters, setFilters] = useState(() => ({ especialidade: '', prestadorId: normalizedCurrentPrestadorId, unidadeId: normalizedCurrentUnitId }));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reloadCatalogs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const payload = await fetchAgendaSemanalCatalogs();
      setCatalogs(normalizeAgendaCatalogs(payload));
    } catch (reason) {
      setError(reason.message || 'Falha ao carregar filtros.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchAgendaSemanalCatalogs({ signal: controller.signal })
      .then((payload) => setCatalogs(normalizeAgendaCatalogs(payload)))
      .catch((reason) => { if (reason.name !== 'AbortError') setError(reason.message || 'Falha ao carregar filtros.'); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const onAgendaConfigSaved = () => { void reloadCatalogs(); };
    window.addEventListener('brana-agenda-config-saved', onAgendaConfigSaved);
    return () => window.removeEventListener('brana-agenda-config-saved', onAgendaConfigSaved);
  }, [reloadCatalogs]);

  const setFilter = useCallback((field, value) => {
    setFilters((current) => {
      const next = { ...current, [field]: text(value) };
      if (field === 'especialidade') {
        const eligible = filterAgendaProviders(catalogs.prestadores, next.especialidade);
        if (!eligible.some((provider) => provider.value === next.prestadorId)) {
          // A Agenda não possui opção neutra de cirurgião. Quando a especialidade
          // torna o prestador atual incompatível, aguardamos uma escolha explícita.
          next.prestadorId = '';
        }
      }
      return next;
    });
  }, [catalogs.prestadores]);

  useEffect(() => {
    const onChange = (event) => {
      const { field, value } = event.detail || {};
      if (['especialidade', 'prestadorId', 'unidadeId'].includes(field)) setFilter(field, value);
    };
    window.addEventListener('brana-agenda-filter-change', onChange);
    return () => window.removeEventListener('brana-agenda-filter-change', onChange);
  }, [setFilter]);

  useEffect(() => {
    if (!normalizedCurrentPrestadorId || filters.prestadorId) return;
    const eligible = filterAgendaProviders(catalogs.prestadores, filters.especialidade);
    if (eligible.some((provider) => provider.value === normalizedCurrentPrestadorId)) {
      setFilters((current) => ({ ...current, prestadorId: normalizedCurrentPrestadorId }));
    }
  }, [catalogs.prestadores, normalizedCurrentPrestadorId, filters.especialidade, filters.prestadorId]);

  useEffect(() => {
    if (filters.unidadeId) return;
    const preferredUnit = normalizedCurrentUnitId && catalogs.unidades.find((unit) => unit.value === normalizedCurrentUnitId);
    const onlyAvailableUnit = catalogs.unidades.length === 1 ? catalogs.unidades[0] : null;
    const effectiveUnit = preferredUnit || onlyAvailableUnit;
    if (effectiveUnit) setFilters((current) => ({ ...current, unidadeId: effectiveUnit.value }));
  }, [catalogs.unidades, normalizedCurrentUnitId, filters.unidadeId]);

  const providers = useMemo(() => filterAgendaProviders(catalogs.prestadores, filters.especialidade), [catalogs.prestadores, filters.especialidade]);
  return {
    filters,
    apiFilters: { prestadorId: filters.prestadorId, unidadeId: filters.unidadeId },
    options: {
      especialidades: [{ value: '', label: 'Todas' }, ...catalogs.especialidades],
      prestadores: providers.map(({ value, label }) => ({ value, label })),
      unidades: [{ value: '', label: 'Todas' }, ...catalogs.unidades],
    },
    providers,
    loading,
    error,
    reloadCatalogs,
  };
}
