import { Alert, Card, Col, Row, Space, Typography } from 'antd';
import { BranaCard } from '../../components/BranaCard.jsx';
import { BranaPageHeader } from '../../components/BranaPageHeader.jsx';

const modules = ['Pacientes', 'Odontograma', 'Tratamentos', 'Agenda', 'Financeiro'];

export function HomePlaceholder() {
  return (
    <Space direction="vertical" size={24} style={{ width: '100%' }}>
      <BranaPageHeader
        title="Brana Cloud"
        subtitle="Novo frontend React + Vite em construção"
      />

      <Alert
        type="info"
        showIcon
        message="Frontend experimental isolado. O frontend legado continua preservado."
      />

      <Row gutter={[16, 16]}>
        {modules.map((name) => (
          <Col xs={24} sm={12} lg={8} key={name}>
            <BranaCard title={name} bordered>
              <Typography.Text type="secondary">
                Espaço reservado para a primeira migração controlada.
              </Typography.Text>
            </BranaCard>
          </Col>
        ))}
      </Row>
    </Space>
  );
}
