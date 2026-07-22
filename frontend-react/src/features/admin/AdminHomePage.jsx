import { Typography } from 'antd';
import { AdminModuleShell } from './shared/AdminModuleShell.jsx';

export function AdminHomePage({ activeSection = 'overview' }) {
  const title = activeSection === 'overview' ? 'Visão geral' : 'Visão geral';

  return (
    <AdminModuleShell title={title} subtitle="Dashboard administrativo em preparação">
      <Typography.Paragraph type="secondary" className="admin-module-empty-copy">
        Área estrutural preparada para receber conteúdo funcional na próxima etapa.
      </Typography.Paragraph>
    </AdminModuleShell>
  );
}
