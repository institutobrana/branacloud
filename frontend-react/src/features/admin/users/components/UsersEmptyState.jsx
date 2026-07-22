import { Empty } from 'antd';

export function UsersEmptyState() {
  return (
    <div className="admin-users-state">
      <Empty description="Nenhum usuário encontrado." />
    </div>
  );
}
