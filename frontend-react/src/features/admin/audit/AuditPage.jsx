import { Typography } from 'antd';
import { AdminModuleShell } from '../shared/AdminModuleShell.jsx';

export function AuditPage() {
  return (
    <AdminModuleShell title="Auditoria">
      <Typography.Paragraph type="secondary" className="admin-module-empty-copy">
        Estrutura pronta para a tabela de auditoria.
      </Typography.Paragraph>
    </AdminModuleShell>
  );
}
