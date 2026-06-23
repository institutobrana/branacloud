import { Badge, Card, Col, Row, Space, Tag, Typography, Button } from 'antd';
import {
  CalendarOutlined,
  DollarOutlined,
  ExperimentOutlined,
  MedicineBoxOutlined,
  ArrowRightOutlined,
  SmileOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useAuth } from '../auth/useAuth.js';
import '../../styles/globals.css';
import './inicio.css';

const accessCards = [
  { title: 'Pacientes', icon: <TeamOutlined />, note: 'Migração planejada' },
  { title: 'Odontograma', icon: <SmileOutlined />, note: 'Em breve' },
  { title: 'Tratamentos', icon: <MedicineBoxOutlined />, note: 'Migração planejada' },
  { title: 'Agenda', icon: <CalendarOutlined />, note: 'Em breve' },
  { title: 'Financeiro', icon: <DollarOutlined />, note: 'Migração planejada' },
  { title: 'Usuários', icon: <ExperimentOutlined />, note: 'Painel administrativo' },
];

const nextScreens = ['Pacientes', 'Odontograma', 'Novo tratamento', 'Ficha pessoal'];

function resolveUserLabel(user) {
  return user?.apelido || user?.nome || user?.email || 'usuário autenticado';
}

function resolveTenantLabel(user) {
  return user?.clinica_id ? `Clínica/Tenant #${user.clinica_id}` : 'Clínica/Tenant indisponível';
}

function resolvePermissionLabel(user) {
  const permissions = user?.permissoes;
  if (!permissions) return 'Perfil/permissões indisponíveis';
  if (Array.isArray(permissions)) return `Permissões: ${permissions.length}`;
  if (typeof permissions === 'object') return 'Perfil/permissões disponíveis';
  return 'Perfil/permissões disponíveis';
}

export function InicioPage() {
  const { user } = useAuth();
  const displayName = resolveUserLabel(user);

  return (
    <Space direction="vertical" size={24} style={{ width: '100%' }}>
      <div className="inicio-hero">
        <div>
          <Typography.Title level={2} className="inicio-title">
            Início
          </Typography.Title>
          <Typography.Paragraph type="secondary" className="inicio-subtitle">
            Painel inicial do novo frontend React do Brana Cloud
          </Typography.Paragraph>
        </div>
        <Tag color="cyan" className="inicio-tag">
          Frontend React
        </Tag>
      </div>

      <Card className="inicio-greeting-card" bordered={false}>
        <Space direction="vertical" size={8}>
          <Typography.Text className="inicio-greeting-label" type="secondary">
            Olá
          </Typography.Text>
          <Typography.Title level={3} className="inicio-greeting-value">
            {displayName}
          </Typography.Title>
          <Typography.Text type="secondary">
            Frontend React em migração controlada. O sistema legado continua preservado.
          </Typography.Text>
        </Space>
      </Card>

      <div className="inicio-workspace-strip">
        <div>
          <Typography.Text className="inicio-strip-label" type="secondary">
            Espaço operacional
          </Typography.Text>
          <Typography.Title level={4} className="inicio-strip-title">
            Acesso rápido aos módulos planejados
          </Typography.Title>
        </div>
        <Button type="primary" icon={<ArrowRightOutlined />} className="inicio-strip-action">
          Abrir painel
        </Button>
      </div>

      <Row gutter={[12, 12]}>
        {accessCards.map((item) => (
          <Col xs={24} sm={12} lg={8} xl={4} key={item.title}>
            <Card className="inicio-access-card inicio-access-card-compact" bordered={false}>
              <div className="inicio-access-icon">{item.icon}</div>
              <Typography.Title level={4} className="inicio-access-title">
                {item.title}
              </Typography.Title>
              <Badge status="processing" text={item.note} />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card title="Status da sessão" className="inicio-panel-card" bordered={false}>
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              <div className="inicio-status-row">
                <Typography.Text type="secondary">Sessão</Typography.Text>
                <Typography.Text strong>Autenticada</Typography.Text>
              </div>
              <div className="inicio-status-row">
                <Typography.Text type="secondary">Usuário</Typography.Text>
                <Typography.Text>{displayName}</Typography.Text>
              </div>
              <div className="inicio-status-row">
                <Typography.Text type="secondary">Clínica/Tenant</Typography.Text>
                <Typography.Text>{resolveTenantLabel(user)}</Typography.Text>
              </div>
              <div className="inicio-status-row">
                <Typography.Text type="secondary">Perfil/Permissões</Typography.Text>
                <Typography.Text>{resolvePermissionLabel(user)}</Typography.Text>
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card title="Próximas telas da migração" className="inicio-panel-card" bordered={false}>
            <Space direction="vertical" size={10} style={{ width: '100%' }}>
              {nextScreens.map((screen) => (
                <div key={screen} className="inicio-next-item">
                  <Typography.Text>{screen}</Typography.Text>
                  <Tag color="green">Planejada</Tag>
                </div>
              ))}
            </Space>
          </Card>
        </Col>
      </Row>
    </Space>
  );
}
