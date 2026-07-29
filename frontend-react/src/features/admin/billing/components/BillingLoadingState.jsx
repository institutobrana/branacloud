import { Spin, Typography } from 'antd';

export function BillingLoadingState() {
  return (
    <div className="admin-billing-state" role="status" aria-live="polite">
      <Spin size="large" />
      <Typography.Text type="secondary">Carregando cobranças...</Typography.Text>
    </div>
  );
}
