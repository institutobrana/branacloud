import { Alert, Typography } from 'antd';
import { useEffect } from 'react';

import { UnidadesAtendimentoTable } from './components/UnidadesAtendimentoTable.jsx';
import { UnidadeAtendimentoModal } from './components/UnidadeAtendimentoModal.jsx';
import { useUnidadesAtendimento } from './hooks/useUnidadesAtendimento.js';
import './unidadesAtendimento.css';

export function UnidadesAtendimentoPage() {
  const {
    items,
    loading,
    error,
    selectedId,
    selectedItem,
    setSelectedId,
    filters,
    sortState,
    setSortState,
    applyFilter,
    clearFilter,
    modalOpen,
    modalMode,
    modalSaving,
    modalError,
    modalValues,
    nextCodeLoading,
    comboOptions,
    ufOptions,
    openCreateModal,
    openEditModal,
    closeModal,
    submitModal,
  } = useUnidadesAtendimento();

  useEffect(() => {
    const onToolbarAction = (event) => {
      const action = String(event?.detail?.action || '').trim();
      if (action === 'novo') {
        void openCreateModal();
      }
      if (action === 'alterar') {
        if (!selectedItem) return;
        openEditModal(selectedItem);
      }
    };

    window.addEventListener('brana-unidades-atendimento-toolbar-action', onToolbarAction);
    return () => window.removeEventListener('brana-unidades-atendimento-toolbar-action', onToolbarAction);
  }, [openCreateModal, openEditModal, selectedItem]);

  const footerLabel = `${items.length} ${items.length === 1 ? 'unidade' : 'unidades'}`;

  return (
    <div className="unidades-atendimento-page">
      {error ? <Alert type="error" showIcon message="Falha ao carregar unidades de atendimento." description={error} /> : null}
      <UnidadesAtendimentoTable
        items={items}
        loading={loading}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onRowDoubleClick={(record) => openEditModal(record)}
        filters={filters}
        onFilterApply={applyFilter}
        onFilterClear={clearFilter}
        sortState={sortState}
        onSort={(key, order) => setSortState({ key, order })}
        footerLabel={footerLabel}
      />
      {!loading && !error && items.length === 0 ? (
        <Typography.Text type="secondary">Nenhuma unidade de atendimento cadastrada.</Typography.Text>
      ) : null}

      <UnidadeAtendimentoModal
        open={modalOpen}
        mode={modalMode}
        loading={modalSaving || nextCodeLoading}
        error={modalError}
        values={modalValues}
        nextCodeLoading={nextCodeLoading}
        logradouroOptions={comboOptions.logradouroOptions}
        bairroOptions={comboOptions.bairroOptions}
        cidadeOptions={comboOptions.cidadeOptions}
        ufOptions={ufOptions}
        onCancel={closeModal}
        onSubmit={submitModal}
      />
    </div>
  );
}
