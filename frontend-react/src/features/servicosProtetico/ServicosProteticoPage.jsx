import { Alert, Button, Modal, Typography } from 'antd';
import { useEffect, useState } from 'react';

import { ServicoProteticoModal } from './components/ServicoProteticoModal.jsx';
import { ServicosProteticoTable } from './components/ServicosProteticoTable.jsx';
import { useServicoProteticoCreate } from './hooks/useServicoProteticoCreate.js';
import { useServicoProteticoDelete } from './hooks/useServicoProteticoDelete.js';
import { useServicoProteticoUpdate } from './hooks/useServicoProteticoUpdate.js';
import { useServicosProtetico } from './hooks/useServicosProtetico.js';
import { formatMoney } from './utils/servicosProteticoFormatters.js';
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
  const [deleteConfirmState, setDeleteConfirmState] = useState({
    open: false,
    service: null,
    loading: false,
  });

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

  const openPrintView = () => {
    if (!selectedProteticoId || !selectedProtetico) return;

    const printableItems = servicos.filter((item) =>
      Object.entries(filters).every(([key, value]) => {
        const expected = String(value || '').trim();
        if (!expected) return true;
        const current = String(item?.[key] ?? '').toLowerCase();
        return current.includes(expected.toLowerCase());
      }),
    );

    const activeColumns = [
      { key: 'codigo', label: 'Código' },
      { key: 'nome', label: 'Serviço' },
      { key: 'indice', label: 'Índice' },
      { key: 'preco', label: 'Preço' },
      { key: 'prazo', label: 'Prazo' },
    ].filter((column) => visibleColumns?.[column.key] !== false);

    const columnHeaders = activeColumns.map((column) => `<th>${column.label}</th>`).join('');
    const tableRows = printableItems
      .map((item) => {
        const cells = activeColumns
          .map((column) => {
            if (column.key === 'preco') return `<td>${formatMoney(item.preco)}</td>`;
            if (column.key === 'prazo') return `<td>${item.prazo ?? '-'}</td>`;
            return `<td>${item?.[column.key] || '-'}</td>`;
          })
          .join('');
        return `<tr>${cells}</tr>`;
      })
      .join('');
    const filterSummary = Object.entries(filters)
      .filter(([, value]) => String(value || '').trim())
      .map(([key, value]) => `<li><strong>${key}</strong>: ${String(value)}</li>`)
      .join('');

    const printWindow = window.open('', '_blank', 'noopener,noreferrer,width=980,height=720');
    if (!printWindow) {
      Modal.warning({
        title: 'Impressão indisponível',
        content: 'O navegador bloqueou a abertura da janela de impressão.',
        centered: true,
      });
      return;
    }

    const html = `<!doctype html>
      <html lang="pt-BR">
        <head>
          <meta charset="utf-8" />
          <title>Serviços de protético - ${selectedProtetico.nome || 'Protético'}</title>
          <style>
            :root { color-scheme: light; }
            body {
              margin: 24px;
              font-family: Arial, Helvetica, sans-serif;
              color: #1f2937;
              background: #fff;
            }
            h1 {
              margin: 0 0 6px;
              font-size: 20px;
            }
            .meta {
              margin: 0 0 16px;
              font-size: 12px;
              color: #4b5563;
            }
            .filters {
              margin: 0 0 16px;
              padding: 10px 12px;
              border: 1px solid #d1d5db;
              border-radius: 8px;
              background: #f9fafb;
            }
            .filters strong {
              display: inline-block;
              margin-bottom: 6px;
            }
            .filters ul {
              margin: 0;
              padding-left: 18px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 12px;
            }
            th, td {
              border: 1px solid #d1d5db;
              padding: 8px 10px;
              text-align: left;
            }
            th {
              background: #f3f4f6;
            }
            td:nth-child(1),
            td:nth-child(3),
            td:nth-child(5) {
              text-align: center;
            }
            td:nth-child(4) {
              text-align: right;
            }
            .footer {
              margin-top: 14px;
              font-size: 12px;
              color: #4b5563;
            }
            @media print {
              body { margin: 14mm; }
            }
          </style>
        </head>
        <body>
          <h1>Serviços de protético</h1>
          <p class="meta">Protético: ${selectedProtetico.nome || '-'} · ${printableItems.length} serviço${printableItems.length === 1 ? '' : 's'}</p>
          <div class="filters">
            <strong>Filtros aplicados</strong>
            <ul>${filterSummary || '<li>Nenhum filtro aplicado</li>'}</ul>
          </div>
          <table>
            <thead><tr>${columnHeaders}</tr></thead>
            <tbody>${tableRows || `<tr><td colspan="${activeColumns.length || 1}">Nenhum serviço encontrado.</td></tr>`}</tbody>
          </table>
          <div class="footer">Gerado em ${new Date().toLocaleString('pt-BR')}</div>
        </body>
      </html>`;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.onload = () => {
      printWindow.print();
    };
  };

  const openDeleteConfirm = (item) => {
    if (!item?.id) return;
    setDeleteConfirmState({
      open: true,
      service: {
        id: item.id,
        nome: item.nome || '',
        codigo: item.codigo || '',
      },
      loading: false,
    });
  };

  const closeDeleteConfirm = () => {
    if (deleteConfirmState.loading) return;
    setDeleteConfirmState({
      open: false,
      service: null,
      loading: false,
    });
  };

  const confirmDeleteService = async () => {
    const target = deleteConfirmState.service;
    if (!target?.id || deleteConfirmState.loading) return;
    setDeleteConfirmState((current) => ({ ...current, loading: true }));
    try {
      const deleted = await deleteServico(target.id);
      if (!deleted) return;
      setSelectedId(null);
      setFilters(EMPTY_FILTERS);
      refreshServicos();
      setDeleteConfirmState({
        open: false,
        service: null,
        loading: false,
      });
    } catch (err) {
      setDeleteConfirmState((current) => ({ ...current, loading: false }));
      throw err;
    }
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
        openDeleteConfirm(item);
        return;
      }
      if (action === 'imprime-servico') {
        openPrintView();
        return;
      }
    };

    window.addEventListener('brana-servicos-protetico-toolbar-filter', onToolbarFilter);
    window.addEventListener('brana-servicos-protetico-toolbar-action', onToolbarAction);
    return () => {
      window.removeEventListener('brana-servicos-protetico-toolbar-filter', onToolbarFilter);
      window.removeEventListener('brana-servicos-protetico-toolbar-action', onToolbarAction);
    };
  }, [deleteServico, openPrintView, selectedItem, selectedProtetico, selectedProteticoId, setSelectedProteticoId, setSelectedId, refreshServicos, setFilters]);

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

      <Modal
        open={deleteConfirmState.open}
        title="Excluir serviço"
        centered
        destroyOnClose
        maskClosable={!deleteConfirmState.loading}
        keyboard={!deleteConfirmState.loading}
        onCancel={closeDeleteConfirm}
        footer={[
          <Button
            key="cancel"
            type="default"
            onClick={closeDeleteConfirm}
            disabled={deleteConfirmState.loading}
          >
            Não
          </Button>,
          <Button
            key="delete"
            type="primary"
            danger
            onClick={() => void confirmDeleteService()}
            disabled={deleteConfirmState.loading}
            loading={deleteConfirmState.loading}
          >
            Sim
          </Button>,
        ]}
      >
        <Typography.Paragraph>
          Tem certeza que deseja excluir este serviço &ldquo;{deleteConfirmState.service?.nome || 'selecionado'}&rdquo;?
        </Typography.Paragraph>
      </Modal>

      {!loading && !error && servicos.length === 0 ? (
        <Typography.Text type="secondary">Nenhum serviço disponível para o protético selecionado.</Typography.Text>
      ) : null}
    </div>
  );
}
