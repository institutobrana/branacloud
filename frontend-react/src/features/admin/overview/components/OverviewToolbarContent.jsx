import { Button, Space } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

export function OverviewToolbarContent({ refreshing, onRefresh }) {
  return (
    <div className="admin-overview-toolbar">
      <Space size={10} wrap>
        <Button
          type="primary"
          size="small"
          icon={<ReloadOutlined />}
          loading={refreshing}
          onClick={onRefresh}
        >
          Atualizar
        </Button>
      </Space>
    </div>
  );
}
