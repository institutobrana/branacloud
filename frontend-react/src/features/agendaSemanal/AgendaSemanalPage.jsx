import { AgendaScheduler } from './components/AgendaScheduler.jsx';
import { useAgendaSemanalReal } from './hooks/useAgendaSemanalReal.js';
import { useAgendaFilters } from './hooks/useAgendaFilters.js';
import { useAuth } from '../auth/AuthProvider.jsx';
import { useEffect } from 'react';

export function AgendaSemanalPage() {
  const { user } = useAuth();
  const currentPrestadorId = user?.prestador_id ?? user?.prestadorId ?? user?.prestador?.id ?? '';
  const currentUnitId = user?.unidade_atendimento_id ?? user?.unidadeAtendimentoId ?? user?.unidade_atendimento?.id ?? user?.unidade?.id ?? '';
  const filterState = useAgendaFilters({ currentPrestadorId, currentUnitId });
  const agenda = useAgendaSemanalReal({ filters: filterState.apiFilters });
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('brana-agenda-filters-state', { detail: {
      ...filterState.options,
      selected: filterState.filters,
      loading: filterState.loading,
      error: filterState.error,
    } }));
  }, [filterState.options, filterState.filters, filterState.loading, filterState.error]);
  return (
    <AgendaScheduler
      events={agenda.events}
      statusCatalog={agenda.statusCatalog}
      providers={filterState.providers}
      selectedProviderId={filterState.filters.prestadorId}
      selectedUnitId={filterState.filters.unidadeId}
      readOnly={false}
      loading={agenda.loading}
      error={agenda.error}
      onVisibleRangeChange={agenda.loadRange}
    />
  );
}
