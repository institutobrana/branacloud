import { Alert } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AdminModuleShell } from '../shared/AdminModuleShell.jsx';
import { BillingDetailsModal } from './components/BillingDetailsModal.jsx';
import { BillingErrorState } from './components/BillingErrorState.jsx';
import { BillingLoadingState } from './components/BillingLoadingState.jsx';
import { BillingTable } from './components/BillingTable.jsx';
import { BillingToolbarContent } from './components/BillingToolbarContent.jsx';
import { useAdminBilling } from './hooks/useAdminBilling.js';
import { useAdminBillingTableState } from './hooks/useAdminBillingTableState.js';
import { downloadAdminBillingCsv } from './utils/adminBillingCsv.js';
import '../admin.css';

export function BillingPage({ onToolbarChange, onAdminNavigate }) {
  const billing = useAdminBilling();
  const tableState = useAdminBillingTableState(billing.rows, billing.totalFromBackend, billing.selectedId);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const emptyText = billing.rows.length
    ? 'Nenhuma cobrança corresponde aos filtros aplicados.'
    : 'Nenhuma cobrança encontrada.';

  const selectedBilling = useMemo(
    () => billing.rows.find((row) => Number(row.id) === Number(billing.selectedId)) || null,
    [billing.rows, billing.selectedId],
  );

  const handleViewAccount = useCallback(() => {
    const selectedClinicId = Number(selectedBilling?.clinicaId || 0) || 0;
    if (!selectedBilling || selectedClinicId <= 0) return;
    onAdminNavigate?.('adm-clinicas', { selectedClinicId });
  }, [onAdminNavigate, selectedBilling]);

  const handleExportCsv = useCallback(() => {
    downloadAdminBillingCsv(tableState.rows);
  }, [tableState.rows]);

  const handleOpenDetails = useCallback(() => {
    if (selectedBilling && !billing.loading && !billing.refreshing) setDetailsOpen(true);
  }, [billing.loading, billing.refreshing, selectedBilling]);

  const handleCloseDetails = useCallback(() => {
    setDetailsOpen(false);
  }, []);

  const toolbar = useMemo(
    () => (
      <BillingToolbarContent
        searchDraft={tableState.globalSearch}
        onSearchChange={tableState.setGlobalSearch}
        refreshing={billing.refreshing}
        onRefresh={billing.refresh}
        exportDisabled={!tableState.rows.length || billing.refreshing}
        onExportCsv={handleExportCsv}
        detailsDisabled={!selectedBilling || billing.loading || billing.refreshing}
        onViewDetails={handleOpenDetails}
        accountDisabled={!selectedBilling || !(Number(selectedBilling?.clinicaId || 0) > 0) || billing.refreshing}
        onViewAccount={handleViewAccount}
      />
    ),
    [
      billing.refresh,
      billing.refreshing,
      handleExportCsv,
      handleOpenDetails,
      handleViewAccount,
      selectedBilling,
      tableState.globalSearch,
      tableState.rows,
      tableState.setGlobalSearch,
    ],
  );

  useEffect(() => {
    onToolbarChange?.(toolbar);
    return () => onToolbarChange?.(null);
  }, [onToolbarChange, toolbar]);

  useEffect(() => {
    billing.setSelectedId((current) => {
      if (current === null || current === undefined) return null;
      const exists = tableState.rows.some((row) => Number(row.id) === Number(current));
      if (!exists) setDetailsOpen(false);
      return exists ? Number(current) : null;
    });
  }, [billing.setSelectedId, tableState.rows]);

  useEffect(() => {
    if (billing.refreshing) setDetailsOpen(false);
  }, [billing.refreshing]);

  if (billing.loading && !billing.rows.length && !billing.error) {
    return (
      <AdminModuleShell title="Cobranças" className="admin-billing-page">
        <BillingLoadingState />
      </AdminModuleShell>
    );
  }

  return (
    <AdminModuleShell title="Cobranças" className="admin-billing-page">
      <div className="admin-billing-page-content">
        {billing.error && !billing.rows.length ? <BillingErrorState error={billing.error} onRetry={billing.refresh} /> : null}

        {billing.error && billing.rows.length ? (
          <Alert type="warning" showIcon message="A última atualização falhou" description={billing.error} />
        ) : null}

        {billing.error && !billing.rows.length ? null : (
          <BillingTable
            rows={tableState.rows}
            loading={billing.refreshing}
            selectedId={billing.selectedId}
            onSelect={billing.setSelectedId}
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

        <BillingDetailsModal open={detailsOpen && Boolean(selectedBilling)} billing={selectedBilling} onClose={handleCloseDetails} />
      </div>
    </AdminModuleShell>
  );
}
