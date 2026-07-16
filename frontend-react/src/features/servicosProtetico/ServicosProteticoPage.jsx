import { Alert, Typography } from 'antd';
import { useEffect, useState } from 'react';

import { ServicoProteticoModal } from './components/ServicoProteticoModal.jsx';
import { ServicosProteticoTable } from './components/ServicosProteticoTable.jsx';
import { useServicoProteticoCreate } from './hooks/useServicoProteticoCreate.js';
import { useServicosProtetico } from './hooks/useServicosProtetico.js';
import './servicosProtetico.css';

const EMPTY_FILTERS = {
  codigo: '',
  nome: '',
  indice: '',
  preco: '',
  prazo: '',
};

export function ServicosProteticoPage() {
  const {
    proteticos,
    selectedProtetico,
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
    refreshServicos,
    visibleColumns,
    handleToggleVisibleColumn,
    hasSelection,
  } = useServicosProtetico();
  const { saving, error: createError, createServico, reset: resetCreateState } = useServicoProteticoCreate();
  const [novoServicoOpen, setNovoServicoOpen] = useState(false);
  const [novoServicoContext, setNovoServicoContext] = useState(null);

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
    window.dispatchEvent(
      new CustomEvent('brana-servicos-protetico-ui-state', {
        detail: {
          modalOpen: novoServicoOpen,
        },
      }),
    );
  }, [novoServicoOpen]);

  useEffect(() => {
    const onToolbarFilter = (event) => {
      const field = String(event?.detail?.field || '').trim();
      if (field !== 'proteticoId') return;
      setSelectedProteticoId(event?.detail?.value);
    };

    const onToolbarAction = (event) => {
      const action = String(event?.detail?.action || '').trim();
      if (action !== 'novo-servico') return;
      if (!selectedProteticoId || !selectedProtetico) return;
      setNovoServicoContext({ id: selectedProteticoId, nome: selectedProtetico.nome });
      setNovoServicoOpen(true);
    };

    window.addEventListener('brana-servicos-protetico-toolbar-filter', onToolbarFilter);
    window.addEventListener('brana-servicos-protetico-toolbar-action', onToolbarAction);
    return () => {
      window.removeEventListener('brana-servicos-protetico-toolbar-filter', onToolbarFilter);
      window.removeEventListener('brana-servicos-protetico-toolbar-action', onToolbarAction);
    };
  }, [selectedProtetico, selectedProteticoId, setSelectedProteticoId]);

  const handleCloseNovoServico = () => {
    if (saving) return;
    setNovoServicoOpen(false);
    setNovoServicoContext(null);
    resetCreateState();
  };

  const handleSaveNovoServico = async (payload) => {
    const proteticoSnapshotId = Number(novoServicoContext?.id || 0) || 0;
    if (!proteticoSnapshotId) {
      throw new Error('Selecione um protetico valido.');
    }
    if (Number(selectedProteticoId || 0) !== proteticoSnapshotId) {
      throw new Error('O protetico selecionado mudou durante o cadastro. Reabra o modal.');
    }

    const created = await createServico(proteticoSnapshotId, payload);
    if (created?.id) {
      setSelectedId(created.id);
    }
    setFilters(EMPTY_FILTERS);
    refreshServicos();
    setNovoServicoOpen(false);
    setNovoServicoContext(null);
  };

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

      <ServicoProteticoModal
        open={novoServicoOpen}
        saving={saving}
        protetico={novoServicoContext}
        error={createError}
        onCancel={handleCloseNovoServico}
        onSubmit={handleSaveNovoServico}
      />

      {!loading && !error && servicos.length === 0 ? (
        <Typography.Text type="secondary">Nenhum serviço disponível para o protético selecionado.</Typography.Text>
      ) : null}
    </div>
  );
}
