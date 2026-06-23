import { Button, Space, Typography } from 'antd';

export function BranaTopbar({ user, onSignOut, loading }) {
  const displayName = user?.apelido || user?.nome || user?.email || '';

  return (
    <div className="brana-topbar-inner">
      <div>
        <Typography.Text strong>Brana Cloud</Typography.Text>
        <Typography.Text className="brana-topbar-subtitle" type="secondary">
          Novo frontend React em construcao
        </Typography.Text>
      </div>
      <Space size={12} align="center">
        <Typography.Text type="secondary">
          {loading ? 'Validando sessão...' : displayName ? `Logado como ${displayName}` : 'Ambiente experimental isolado'}
        </Typography.Text>
        {onSignOut ? (
          <Button size="small" onClick={onSignOut} disabled={loading}>
            Sair
          </Button>
        ) : null}
      </Space>
    </div>
  );
}
