import { Typography } from 'antd';

export function BranaTopbar() {
  return (
    <div className="brana-topbar-inner">
      <div>
        <Typography.Text strong>Brana Cloud</Typography.Text>
        <Typography.Text className="brana-topbar-subtitle" type="secondary">
          Novo frontend React em construção
        </Typography.Text>
      </div>
      <Typography.Text type="secondary">Ambiente experimental isolado</Typography.Text>
    </div>
  );
}
