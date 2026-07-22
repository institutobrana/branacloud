import { Alert, Button, Space } from 'antd';

export function OverviewErrorState({ error, onRetry }) {
  return (
    <Alert
      type="error"
      message="Não foi possível carregar a visão geral"
      description={
        <Space direction="vertical" size={8}>
          <span>{error}</span>
          <Button size="small" onClick={onRetry}>
            Tentar novamente
          </Button>
        </Space>
      }
      showIcon
    />
  );
}
