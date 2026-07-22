import { Button, Result, Spin, Typography } from 'antd';
import { useMemo } from 'react';
import { useAdminAccess } from './useAdminAccess.js';
import { getAdminSectionByKey } from './adminNavigation.js';
import { OverviewPage } from './overview/OverviewPage.jsx';
import { ClinicsPage } from './clinics/ClinicsPage.jsx';
import { UsersPage } from './users/UsersPage.jsx';
import { BillingPage } from './billing/BillingPage.jsx';
import { AuditPage } from './audit/AuditPage.jsx';

const PAGE_BY_SECTION = {
  overview: OverviewPage,
  clinics: ClinicsPage,
  users: UsersPage,
  billing: BillingPage,
  audit: AuditPage,
};

export function AdminRoutes({
  user,
  loading,
  onReturnHome,
  activeSection = 'overview',
  onToolbarChange = null,
  navigationState = null,
  onConsumeNavigationState = null,
  onAdminNavigate = null,
}) {
  const access = useAdminAccess(user, loading);
  const currentSection = useMemo(() => getAdminSectionByKey(activeSection), [activeSection]);
  const Page = PAGE_BY_SECTION[currentSection.key] || OverviewPage;

  if (access.loading) {
    return (
      <div className="brana-admin-status" role="status" aria-live="polite">
        <Spin size="large" />
        <Typography.Text type="secondary">Validando permissão administrativa...</Typography.Text>
      </div>
    );
  }

  if (access.denied) {
    return (
      <Result
        status="403"
        title="Acesso negado"
        subTitle={access.reason}
        extra={<Button onClick={onReturnHome}>Retornar ao sistema principal</Button>}
      />
    );
  }

  return (
    <Page
      user={user}
      onToolbarChange={onToolbarChange}
      navigationState={navigationState}
      onConsumeNavigationState={onConsumeNavigationState}
      onAdminNavigate={onAdminNavigate}
    />
  );
}
