import { Spin, Typography } from 'antd';

export function ClinicsLoadingState() {
  return (
    <div className="admin-clinics-state" role="status" aria-live="polite">
      <Spin size="large" />
      <Typography.Text type="secondary">Carregando clínicas...</Typography.Text>
    </div>
  );
}
