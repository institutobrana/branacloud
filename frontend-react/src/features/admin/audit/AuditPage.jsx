import { Alert, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { AdminModuleShell } from '../shared/AdminModuleShell.jsx';
import { AuditDetailsModal } from './components/AuditDetailsModal.jsx';
import { AuditTable } from './components/AuditTable.jsx';
import { AuditToolbarContent } from './components/AuditToolbarContent.jsx';
import { buildAdminAuditCsv } from './utils/adminAuditCsv.js';
import { useAdminAudit } from './hooks/useAdminAudit.js';
import { useAdminAuditTableState } from './hooks/useAdminAuditTableState.js';
import '../admin.css';

export function AuditPage({ onToolbarChange }) {
  const audit = useAdminAudit();
  const tableState = useAdminAuditTableState(audit.rows, audit.totalFromBackend, audit.selectedId);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const emptyText = audit.rows.length ? 'Nenhum evento corresponde aos filtros aplicados.' : 'Nenhum evento encontrado.';
  const selectedAudit = useMemo(
    () => audit.rows.find((row) => Number(row.id) === Number(audit.selectedId)) || null,
    [audit.rows, audit.selectedId],
  );

  const handleExportCsv = useMemo(
    () => () => {
      if (!tableState.rows.length) return;
      const csv = buildAdminAuditCsv(tableState.rows);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'auditoria-adm.csv';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
    [tableState.rows],
  );

  const handleOpenDetails = useMemo(
    () => () => {
      if (selectedAudit && !audit.loading && !audit.refreshing) setDetailsOpen(true);
    },
    [audit.loading, audit.refreshing, selectedAudit],
  );

  const handleCloseDetails = useMemo(
    () => () => {
      setDetailsOpen(false);
    },
    [],
  );

  const toolbar = useMemo(
    () => (
      <AuditToolbarContent
        searchDraft={tableState.globalSearch}
        onSearchChange={tableState.setGlobalSearch}
        refreshing={audit.refreshing}
        onRefresh={audit.refresh}
        exportDisabled={!tableState.rows.length || audit.refreshing}
        onExportCsv={handleExportCsv}
        detailsDisabled={!selectedAudit || audit.loading || audit.refreshing}
        onViewDetails={handleOpenDetails}
      />
    ),
    [
      audit.loading,
      audit.refresh,
      audit.refreshing,
      handleExportCsv,
      handleOpenDetails,
      selectedAudit,
      tableState.globalSearch,
      tableState.rows.length,
      tableState.setGlobalSearch,
    ],
  );

  useEffect(() => {
    onToolbarChange?.(toolbar);
    return () => onToolbarChange?.(null);
  }, [onToolbarChange, toolbar]);

  if (audit.loading && !audit.rows.length && !audit.error) {
    return (
      <AdminModuleShell title="Auditoria" className="admin-audit-page">
        <div className="admin-audit-state" role="status" aria-live="polite">
          <Typography.Text type="secondary">Carregando auditoria...</Typography.Text>
        </div>
      </AdminModuleShell>
    );
  }

  return (
    <AdminModuleShell title="Auditoria" className="admin-audit-page">
      <div className="admin-audit-page-content">
        {audit.error && !audit.rows.length ? (
          <Alert
            type="error"
            showIcon
            message="Falha ao carregar auditoria"
            description={audit.error}
            action={
              <button type="button" className="admin-users-inline-retry" onClick={audit.refresh}>
                Tentar novamente
              </button>
            }
          />
        ) : null}

        {audit.error && audit.rows.length ? (
          <Alert type="warning" showIcon message="A última atualização falhou" description={audit.error} />
        ) : null}

        {audit.error && !audit.rows.length ? null : (
          <AuditTable
            rows={tableState.rows}
            loading={audit.refreshing}
            selectedId={audit.selectedId}
            onSelect={audit.setSelectedId}
            filters={tableState.filters}
            sortState={tableState.sortState}
            onSort={(key, order) => tableState.setSortState({ key, order })}
            visibleColumns={tableState.visibleColumns}
            onToggleVisibleColumn={tableState.toggleVisibleColumn}
            onFilterApply={tableState.applyFilter}
            onFilterClear={tableState.clearFilter}
            footerLabel={tableState.footerLabel}
            emptyText={emptyText}
          />
        )}

        <AuditDetailsModal open={detailsOpen && Boolean(selectedAudit)} audit={selectedAudit} onClose={handleCloseDetails} />
      </div>
    </AdminModuleShell>
  );
}
