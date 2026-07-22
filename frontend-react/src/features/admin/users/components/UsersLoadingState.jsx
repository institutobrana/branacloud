import { Spin, Typography } from 'antd';

export function UsersLoadingState() {
  return (
    <div className="admin-users-state" role="status" aria-live="polite">
      <Spin />
      <Typography.Text type="secondary">Carregando usuários...</Typography.Text>
    </div>
  );
}
