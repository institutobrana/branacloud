import { Alert, message } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AdminModuleShell } from '../shared/AdminModuleShell.jsx';
import { UserDetailsModal } from './components/UserDetailsModal.jsx';
import { UsersEmptyState } from './components/UsersEmptyState.jsx';
import { UsersErrorState } from './components/UsersErrorState.jsx';
import { UsersLoadingState } from './components/UsersLoadingState.jsx';
import { UsersTable } from './components/UsersTable.jsx';
import { UsersToolbarContent } from './components/UsersToolbarContent.jsx';
import { useAdminUsers } from './hooks/useAdminUsers.js';
import { useAdminUsersTableState } from './hooks/useAdminUsersTableState.js';
import { useExportAdminUsersCsv } from './hooks/useExportAdminUsersCsv.js';
import '../admin.css';

export function UsersPage({ onToolbarChange, onAdminNavigate }) {
  const users = useAdminUsers();
  const { exporting, exportCsv } = useExportAdminUsersCsv();
  const tableState = useAdminUsersTableState(users.rows, users.totalFromBackend, users.selectedId);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const selectedUser = useMemo(
    () => users.rows.find((row) => Number(row.id) === Number(users.selectedId)) || null,
    [users.rows, users.selectedId],
  );

  const handleExportCsv = useCallback(async () => {
    try {
      await exportCsv({ q: users.query });
      message.success('CSV de usuários exportado.');
    } catch (err) {
      message.error(err?.message || 'Falha ao exportar CSV de usuários.');
    }
  }, [exportCsv, users.query]);

  const handleOpenDetails = useCallback(() => {
    if (selectedUser) setDetailsOpen(true);
  }, [selectedUser]);

  const handleViewAccount = useCallback(() => {
    const selectedClinicId = Number(selectedUser?.clinicaId || 0) || 0;
    if (!selectedUser || selectedClinicId <= 0) return;
    setDetailsOpen(false);
    onAdminNavigate?.('adm-clinicas', { selectedClinicId });
  }, [onAdminNavigate, selectedUser]);

  const handleCloseDetails = useCallback(() => {
    setDetailsOpen(false);
  }, []);

  const toolbar = useMemo(
    () => (
      <UsersToolbarContent
        searchDraft={users.searchDraft}
        onSearchChange={users.updateSearch}
        refreshing={users.refreshing}
        onRefresh={users.refresh}
        exporting={exporting}
        onExportCsv={handleExportCsv}
        detailsDisabled={!selectedUser}
        onViewDetails={handleOpenDetails}
        accountDisabled={!selectedUser || !(Number(selectedUser?.clinicaId || 0) > 0) || users.refreshing}
        onViewAccount={handleViewAccount}
      />
    ),
    [
      exporting,
      handleExportCsv,
      handleOpenDetails,
      handleViewAccount,
      selectedUser,
      users.refresh,
      users.refreshing,
      users.searchDraft,
      users.updateSearch,
    ],
  );

  useEffect(() => {
    onToolbarChange?.(toolbar);
    return () => onToolbarChange?.(null);
  }, [onToolbarChange, toolbar]);

  useEffect(() => {
    users.setSelectedId((current) => {
      if (current === null || current === undefined) return null;
      const exists = tableState.rows.some((row) => Number(row.id) === Number(current));
      if (!exists) {
        setDetailsOpen(false);
        return null;
      }
      return Number(current);
    });
  }, [tableState.rows, users.setSelectedId]);

  if (users.loading && !users.rows.length && !users.error) {
    return (
      <AdminModuleShell title="Usuários" className="admin-users-page">
        <UsersLoadingState />
      </AdminModuleShell>
    );
  }

  return (
    <AdminModuleShell title="Usuários" className="admin-users-page">
      <div className="admin-users-page-content">
        {users.error && !users.rows.length ? <UsersErrorState error={users.error} onRetry={users.refresh} /> : null}

        {users.error && users.rows.length ? (
          <Alert type="warning" showIcon message="A última atualização falhou" description={users.error} />
        ) : null}

        {!users.error && !users.rows.length ? <UsersEmptyState /> : null}

        {users.rows.length ? (
          <UsersTable
            rows={tableState.rows}
            loading={users.refreshing}
            selectedId={users.selectedId}
            onSelect={users.setSelectedId}
            filters={tableState.filters}
            sortState={tableState.sortState}
            onSort={(key, order) => tableState.setSortState({ key, order })}
            visibleColumns={tableState.visibleColumns}
            onToggleVisibleColumn={tableState.toggleVisibleColumn}
            onFilterApply={tableState.applyFilter}
            onFilterClear={tableState.clearFilter}
            footerLabel={tableState.footerLabel}
          />
        ) : null}

        <UserDetailsModal open={detailsOpen && Boolean(selectedUser)} user={selectedUser} onClose={handleCloseDetails} />
      </div>
    </AdminModuleShell>
  );
}
