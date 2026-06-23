import { Alert, Col, List, Row, Space, Tag, Typography } from 'antd';
import { BranaCard } from '../../components/BranaCard.jsx';
import { BranaPageHeader } from '../../components/BranaPageHeader.jsx';

const modules = ['Pacientes', 'Odontograma', 'Tratamentos', 'Agenda', 'Financeiro', 'Usuários'];
const nextSteps = [
  'Login experimental',
  'Integração com API atual',
  'Migração piloto por tela',
  'Validação com EasyDental',
];

export function HomePlaceholder() {
  return (
    <Space direction="vertical" size={24} style={{ width: '100%' }}>
      <BranaPageHeader
        title="Brana Cloud"
        subtitle="Novo frontend React em construção"
        extra={<Tag color="green">Frontend experimental isolado</Tag>}
      />

      <Alert
        type="success"
        showIcon
        message="Ambiente experimental isolado. O frontend legado continua preservado."
      />

      <Row gutter={[16, 16]}>
        {modules.map((name) => (
          <Col xs={24} sm={12} lg={8} xl={6} key={name}>
            <BranaCard title={name} bordered>
              <Typography.Text type="secondary">
                Espaço reservado para a primeira migração controlada.
              </Typography.Text>
            </BranaCard>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={10}>
          <BranaCard title="Próximas etapas" bordered>
            <List
              size="small"
              dataSource={nextSteps}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />
          </BranaCard>
        </Col>
      </Row>
    </Space>
  );
}
