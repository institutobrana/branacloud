import { Alert, Typography } from 'antd';
import { useEffect } from 'react';

import { ServicosProteticoTable } from './components/ServicosProteticoTable.jsx';
import { useServicosProtetico } from './hooks/useServicosProtetico.js';
import './servicosProtetico.css';

export function ServicosProteticoPage() {
  const {
    proteticos,
    selectedProteticoId,
    setSelectedProteticoId,
    loading,
    error,
    servicos,
    totalItems,
    selectedId,
    setSelectedId,
    sortState,
    setSortState,
    filters,
    setFilters,
    visibleColumns,
    handleToggleVisibleColumn,
    hasSelection,
  } = useServicosProtetico();

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('brana-servicos-protetico-state', {
        detail: {
          proteticos,
          selectedProteticoId,
          loading,
          hasSelection,
        },
      }),
    );
  }, [hasSelection, loading, proteticos, selectedProteticoId]);

  useEffect(() => {
    const onToolbarFilter = (event) => {
      const field = String(event?.detail?.field || '').trim();
      if (field !== 'proteticoId') return;
      setSelectedProteticoId(event?.detail?.value);
    };

    window.addEventListener('brana-servicos-protetico-toolbar-filter', onToolbarFilter);
    return () => window.removeEventListener('brana-servicos-protetico-toolbar-filter', onToolbarFilter);
  }, [setSelectedProteticoId]);

  const serviceCountLabel = `${totalItems} ${totalItems === 1 ? 'serviço' : 'serviços'}`;

  return (
    <div className="servicos-protetico-page">
      {error ? <Alert type="error" showIcon message="Falha ao carregar serviços de protético." description={error} /> : null}

      <ServicosProteticoTable
        items={servicos}
        totalItems={totalItems}
        selectedId={selectedId}
        loading={loading}
        sortState={sortState}
        onSort={(key, order) => setSortState({ key, order })}
        onSelect={setSelectedId}
        filters={filters}
        onFilterChange={(key, value) => setFilters((current) => ({ ...current, [key]: value }))}
        visibleColumns={visibleColumns}
        onToggleVisibleColumn={handleToggleVisibleColumn}
        footerLabel={serviceCountLabel}
      />

      {!loading && !error && servicos.length === 0 ? (
        <Typography.Text type="secondary">Nenhum serviço disponível para o protético selecionado.</Typography.Text>
      ) : null}
    </div>
  );
}
