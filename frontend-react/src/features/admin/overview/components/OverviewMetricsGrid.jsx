import { Col, Row } from 'antd';
import { OverviewMetricCard } from './OverviewMetricCard.jsx';

export function OverviewMetricsGrid({ metrics = [] }) {
  return (
    <Row gutter={[12, 12]} className="admin-overview-metrics-grid">
      {metrics.map((metric) => (
        <Col key={metric.key} xs={12} sm={12} md={8} lg={6} xl={4}>
          <OverviewMetricCard metric={metric} />
        </Col>
      ))}
    </Row>
  );
}
