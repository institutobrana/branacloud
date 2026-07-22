import { Typography } from 'antd';
import { AdminModuleShell } from '../shared/AdminModuleShell.jsx';

export function BillingPage() {
  return (
    <AdminModuleShell title="Cobranças">
      <Typography.Paragraph type="secondary" className="admin-module-empty-copy">
        Estrutura pronta para a tabela de cobranças.
      </Typography.Paragraph>
    </AdminModuleShell>
  );
}
