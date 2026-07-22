import { Spin, Typography } from 'antd';

export function OverviewLoadingState() {
  return (
    <div className="admin-overview-state" role="status" aria-live="polite">
      <Spin size="large" />
      <Typography.Text type="secondary">Carregando visão geral administrativa...</Typography.Text>
    </div>
  );
}
