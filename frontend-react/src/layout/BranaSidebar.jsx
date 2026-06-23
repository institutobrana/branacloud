import { Typography, Menu, Space } from 'antd';

export function BranaSidebar({ menuItems }) {
  return (
    <div className="brana-sidebar-inner">
      <Space direction="vertical" size={6} className="brana-brand">
        <Typography.Title level={4}>Brana Cloud</Typography.Title>
        <Typography.Text type="secondary">Brana Clinical Software UI</Typography.Text>
      </Space>
      <Menu mode="inline" selectable={false} items={menuItems} className="brana-menu" />
    </div>
  );
}
