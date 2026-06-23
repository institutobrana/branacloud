import { Typography } from 'antd';

export function BranaPageHeader({ title, subtitle, extra }) {
  return (
    <div className="brana-page-header">
      <div>
        <Typography.Title level={2}>{title}</Typography.Title>
        <Typography.Text type="secondary">{subtitle}</Typography.Text>
      </div>
      {extra}
    </div>
  );
}
