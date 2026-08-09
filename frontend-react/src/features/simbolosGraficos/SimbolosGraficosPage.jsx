import { Alert, Empty, Spin, Typography, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';

import { SimbolosGraficosTable } from './components/SimbolosGraficosTable.js';
import { SimboloGraficoCreateModal } from './components/SimboloGraficoCreateModal.jsx';
import { SimboloGraficoDeleteModal } from './components/SimboloGraficoDeleteModal.jsx';
import { useDeleteSimboloGrafico } from './hooks/useDeleteSimboloGrafico.js';
import { useSimbolosGraficosTableState } from './hooks/useSimbolosGraficosTableState.js';
import '../admin/admin.css';

export function SimbolosGraficosPage({ createOpen = false, onCreateClose } = {}) {
  const { resolvedRows, loading, error, selectedId, selectedRow, totalCount, selectRow, reload } = useSimbolosGraficosTableState();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const deleteFlow = useDeleteSimboloGrafico();
  const countLabel = totalCount === 1 ? '1 símbolo' : `${totalCount} símbolos`;

  const selectedRecord = useMemo(() => {
    if (!selectedRow) return null;
    return resolvedRows.find((row) => Number(row.id) === Number(selectedRow.id)) || selectedRow;
  }, [resolvedRows, selectedRow]);

  const handleCreateClose = () => {
    onCreateClose?.();
  };

  const handleCreateSuccess = async (createdSymbol) => {
    await reload();
    if (createdSymbol?.id != null) {
      selectRow(createdSymbol.id);
    }
  };

  const handleEditOpen = () => {
    if (!selectedRecord) {
      message.info('Selecione um símbolo gráfico para alterar.');
      return;
    }
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  const handleEditSuccess = async (updatedSymbol) => {
    await reload();
    if (updatedSymbol?.id != null) {
      selectRow(updatedSymbol.id);
    }
  };

  const handleDeleteOpen = () => {
    if (!selectedRecord) {
      message.info('Selecione um símbolo gráfico para excluir.');
      return;
    }
    setDeleteTarget(selectedRecord);
    deleteFlow.reset();
    setDeleteOpen(true);
  };

  const handleDeleteCancel = () => {
    if (deleteFlow.deleting) return;
    deleteFlow.cancel();
    setDeleteOpen(false);
    setDeleteTarget(null);
    deleteFlow.reset();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget?.id) {
      message.warning('Selecione um símbolo gráfico válido para excluir.');
      return;
    }

    const targetId = Number(deleteTarget.id);
    const result = await deleteFlow.submit(targetId);
    if (!result?.ok) {
      if (result?.status === 404) {
        message.warning(result.error || 'O símbolo gráfico não existe mais.');
        await reload();
        selectRow(null);
        setDeleteOpen(false);
        setDeleteTarget(null);
        deleteFlow.reset();
        return;
      }
      if (result?.status === 409) {
        message.error(result.error || 'Não foi possível excluir o símbolo gráfico.');
        return;
      }
      message.error(result?.error || 'Falha ao excluir símbolo gráfico.');
      return;
    }

    const previousId = Number(selectedId || 0) || null;
    await reload();
    selectRow(null);
    setDeleteOpen(false);
    setDeleteTarget(null);
    deleteFlow.reset();
    message.success(previousId === targetId ? 'Símbolo gráfico excluído com sucesso.' : 'Símbolo gráfico excluído.');
  };

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('brana-simbolos-graficos-selection', { detail: { selectedId } }));
  }, [selectedId]);

  useEffect(() => {
    const onToolbarAction = (event) => {
      const action = event?.detail?.action;
      if (action === 'altera') {
        if (!selectedRecord) {
          message.info('Selecione um símbolo gráfico para alterar.');
          return;
        }
        setEditOpen(true);
      }
      if (action === 'elimina') {
        handleDeleteOpen();
      }
    };

    window.addEventListener('brana-simbolos-graficos-toolbar-action', onToolbarAction);
    return () => window.removeEventListener('brana-simbolos-graficos-toolbar-action', onToolbarAction);
  }, [selectedRecord]);

  return (
    <div className="simbolos-graficos-page">
      <div className="admin-users-page-content">
        {error ? <Alert type="error" showIcon message="Não foi possível carregar os símbolos gráficos." description={error} /> : null}

        {loading ? (
          <div className="simbolos-graficos-loading" role="status" aria-live="polite">
            <Spin />
            <Typography.Text type="secondary">Carregando símbolos gráficos...</Typography.Text>
          </div>
        ) : null}

        {!loading && !error && resolvedRows.length === 0 ? (
          <Empty description="Nenhum símbolo gráfico encontrado." />
        ) : null}

        {!error ? <SimbolosGraficosTable rows={resolvedRows} selectedId={selectedId} onSelect={selectRow} footerLabel={countLabel} /> : null}

        <SimboloGraficoCreateModal open={createOpen} mode="create" onCancel={handleCreateClose} onCreated={handleCreateSuccess} />
        <SimboloGraficoCreateModal open={editOpen} mode="edit" record={selectedRecord} onCancel={handleEditClose} onUpdated={handleEditSuccess} />
        <SimboloGraficoDeleteModal
          open={deleteOpen}
          loading={deleteFlow.deleting}
          error={deleteFlow.deleteError}
          target={deleteTarget}
          onCancel={handleDeleteCancel}
          onConfirm={() => void handleDeleteConfirm()}
        />
      </div>
    </div>
  );
}
