import { useEffect, useMemo } from 'react';
import { AdminModuleShell } from '../shared/AdminModuleShell.jsx';
import { useAdminOverview } from './hooks/useAdminOverview.js';
import { OverviewToolbarContent } from './components/OverviewToolbarContent.jsx';
import { OverviewMetricsGrid } from './components/OverviewMetricsGrid.jsx';
import { OverviewClinicAccessTable } from './components/OverviewClinicAccessTable.jsx';
import { OverviewLoadingState } from './components/OverviewLoadingState.jsx';
import { OverviewErrorState } from './components/OverviewErrorState.jsx';
import '../admin.css';

export function OverviewPage({ onToolbarChange }) {
  const { data, loading, refreshing, error, refresh } = useAdminOverview();
  const toolbar = useMemo(() => <OverviewToolbarContent refreshing={refreshing} onRefresh={refresh} />, [refresh, refreshing]);

  useEffect(() => {
    onToolbarChange?.(toolbar);
    return () => onToolbarChange?.(null);
  }, [onToolbarChange, toolbar]);

  if (loading && !data) {
    return (
      <AdminModuleShell title="Visão geral">
        <OverviewLoadingState />
      </AdminModuleShell>
    );
  }

  return (
    <AdminModuleShell title="Visão geral">
      {error ? <OverviewErrorState error={error} onRetry={refresh} /> : null}
      {data ? (
        <>
          <OverviewMetricsGrid metrics={data.metrics} />
          <div className="admin-overview-access-table-wrapper">
            <OverviewClinicAccessTable rows={data.acessosClinicas} />
          </div>
        </>
      ) : null}
    </AdminModuleShell>
  );
}
