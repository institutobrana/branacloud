import { Alert, Modal, Typography } from 'antd';
import { useEffect, useState } from 'react';

import { ServicoProteticoModal } from './components/ServicoProteticoModal.jsx';
import { ServicosProteticoTable } from './components/ServicosProteticoTable.jsx';
import { useServicoProteticoCreate } from './hooks/useServicoProteticoCreate.js';
import { useServicoProteticoDelete } from './hooks/useServicoProteticoDelete.js';
import { useServicoProteticoUpdate } from './hooks/useServicoProteticoUpdate.js';
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
    selectedItem,
    sortState,
    setSortState,
    filters,
    setFilters,
    refreshServicos,
    visibleColumns,
    handleToggleVisibleColumn,
    hasSelection,
  } = useServicosProtetico();
  const { saving: creating, error: createError, createServico, reset: resetCreateState } = useServicoProteticoCreate();
  const { deleting, error: deleteError, deleteServico, reset: resetDeleteState } = useServicoProteticoDelete();
  const { saving: updating, error: updateError, updateServico, reset: resetUpdateState } = useServicoProteticoUpdate();
  const [modalState, setModalState] = useState({ open: false, mode: 'create', service: null });

  const modalSaving = creating || updating || deleting;
  const modalError = createError || updateError || deleteError;
  const modalTitleService = modalState.service;
  const modalMode = modalState.mode;

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
          modalOpen: modalState.open,
          modalMode,
        },
      }),
    );
  }, [modalMode, modalState.open]);

  const openCreateModal = () => {
    if (!selectedProteticoId || !selectedProtetico) return;
    setModalState({
      open: true,
      mode: 'create',
      service: {
        id: null,
        protetico_id: selectedProteticoId,
        nome: selectedProtetico.nome,
        values: null,
      },
    });
    resetCreateState();
    resetUpdateState();
    resetDeleteState();
  };

  const openEditModal = () => {
    if (!selectedItem || !selectedProtetico) return;
    setModalState({
      open: true,
      mode: 'edit',
      service: {
        id: selectedItem.id,
        protetico_id: selectedItem.protetico_id,
        nome: selectedProtetico.nome,
        values: {
          codigo: selectedItem.codigo || '',
          nome: selectedItem.nome || '',
          indice: selectedItem.indice || 'R$',
          preco: Number(selectedItem.preco ?? 0) ? String(selectedItem.preco) : '0',
          prazo: String(selectedItem.prazo ?? ''),
          descricao: selectedItem.descricao || '',
        },
      },
    });
    resetCreateState();
    resetUpdateState();
    resetDeleteState();
  };

  useEffect(() => {
    const onToolbarFilter = (event) => {
      const field = String(event?.detail?.field || '').trim();
      if (field !== 'proteticoId') return;
      setSelectedProteticoId(event?.detail?.value);
    };

    const onToolbarAction = (event) => {
      const action = String(event?.detail?.action || '').trim();
      if (action === 'novo-servico') {
        openCreateModal();
        return;
      }
      if (action === 'altera-servico') {
        openEditModal();
        return;
      }
      if (action === 'elimina-servico') {
        const item = selectedItem;
        if (!item) return;
        Modal.confirm({
          title: 'Eliminar serviço de protético',
          content: `Confirma a exclusão do serviço "${item.nome}"?`,
          okText: 'Eliminar',
          okButtonProps: { danger: true },
          cancelText: 'Cancelar',
          centered: true,
          async onOk() {
            const deleted = await deleteServico(item.id);
            if (!deleted) return;
            setSelectedId(null);
            setFilters(EMPTY_FILTERS);
            refreshServicos();
          },
        });
      }
    };

    window.addEventListener('brana-servicos-protetico-toolbar-filter', onToolbarFilter);
    window.addEventListener('brana-servicos-protetico-toolbar-action', onToolbarAction);
    return () => {
      window.removeEventListener('brana-servicos-protetico-toolbar-filter', onToolbarFilter);
      window.removeEventListener('brana-servicos-protetico-toolbar-action', onToolbarAction);
    };
  }, [deleteServico, selectedItem, selectedProtetico, selectedProteticoId, setSelectedProteticoId, setSelectedId, refreshServicos, setFilters]);

  const handleCloseModal = () => {
    if (modalSaving) return;
    setModalState({ open: false, mode: 'create', service: null });
    resetCreateState();
    resetUpdateState();
  };

  const handleSubmitModal = async (payload) => {
    const service = modalState.service;
    if (!service?.id) {
      const proteticoSnapshotId = Number(service?.protetico_id || 0) || 0;
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
    } else {
      const updated = await updateServico(service.id, payload);
      if (updated?.id) {
        setSelectedId(updated.id);
      }
    }

    setFilters(EMPTY_FILTERS);
    refreshServicos();
    setModalState({ open: false, mode: 'create', service: null });
    resetDeleteState();
  };

  const serviceCountLabel = `${totalItems} ${totalItems === 1 ? 'serviço' : 'serviços'}`;

  const modalInitialValues = modalState.service?.values || null;

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
        onRowDoubleClick={openEditModal}
        filters={filters}
        onFilterChange={(key, value) => setFilters((current) => ({ ...current, [key]: value }))}
        visibleColumns={visibleColumns}
        onToggleVisibleColumn={handleToggleVisibleColumn}
        footerLabel={serviceCountLabel}
      />

      <ServicoProteticoModal
        open={modalState.open}
        saving={modalSaving}
        mode={modalMode}
        protetico={modalTitleService}
        initialValues={modalInitialValues}
        error={modalError}
        onCancel={handleCloseModal}
        onSubmit={handleSubmitModal}
      />

      {!loading && !error && servicos.length === 0 ? (
        <Typography.Text type="secondary">Nenhum serviço disponível para o protético selecionado.</Typography.Text>
      ) : null}
    </div>
  );
}
