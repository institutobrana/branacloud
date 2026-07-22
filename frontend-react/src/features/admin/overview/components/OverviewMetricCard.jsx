import { Card, Typography } from 'antd';
import { formatCurrency, formatInteger } from '../utils/adminOverviewFormatters.js';

function formatMetricValue(metric) {
  if (metric.key === 'mrr_estimado' || metric.key === 'arr_estimado') {
    return formatCurrency(metric.value);
  }
  return formatInteger(metric.value);
}

export function OverviewMetricCard({ metric }) {
  return (
    <Card size="small" className="admin-overview-metric-card" bordered>
      <Typography.Text className="admin-overview-metric-label">{metric.label}</Typography.Text>
      <Typography.Title level={4} className="admin-overview-metric-value">
        {formatMetricValue(metric)}
      </Typography.Title>
    </Card>
  );
}
