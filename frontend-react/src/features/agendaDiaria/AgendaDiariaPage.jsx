import { useEffect } from 'react';
import { useAuth } from '../auth/AuthProvider.jsx';
import { AgendaScheduler } from '../agendaSemanal/components/AgendaScheduler.jsx';
import { useAgendaFilters } from '../agendaSemanal/hooks/useAgendaFilters.js';
import { useAgendaSemanalReal } from '../agendaSemanal/hooks/useAgendaSemanalReal.js';

export function AgendaDiariaPage() {
  const { user } = useAuth();
  const currentPrestadorId = user?.prestador_id ?? user?.prestadorId ?? user?.prestador?.id ?? '';
  const filterState = useAgendaFilters({ currentPrestadorId });
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
      readOnly
      initialMode="dia"
      loading={agenda.loading}
      error={agenda.error || filterState.error}
      onVisibleRangeChange={agenda.loadRange}
    />
  );
}
