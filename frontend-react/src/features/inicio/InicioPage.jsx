import { useMemo, useState } from 'react';
import { Badge, Button, Card, Col, Row, Space, Tag, Typography } from 'antd';
import {
  ArrowDownOutlined,
  ArrowRightOutlined,
  FilterOutlined,
  ReloadOutlined,
  CalendarOutlined,
  DollarOutlined,
  BellOutlined,
  UserOutlined,
  ClockCircleOutlined,
  MedicineBoxOutlined,
  TeamOutlined,
  CaretRightOutlined,
} from '@ant-design/icons';
import { useAuth } from '../auth/useAuth.js';
import '../../styles/globals.css';
import './inicio.css';

const tabs = [
  { key: 'avisos', label: 'Avisos' },
  { key: 'painel', label: 'Painel' },
  { key: 'agenda', label: 'Análise de agenda' },
  { key: 'vendas', label: 'Análise de vendas' },
  { key: 'financeira', label: 'Análise financeira' },
];

const dashboardLines = [
  { key: 'mensagens', label: 'Mensagens e avisos para {user} (0)', icon: <BellOutlined />, action: '+' },
  { key: 'agendamentos', label: 'Agendamentos de hoje (0)', icon: <CalendarOutlined />, action: 'Abrir' },
  { key: 'aniversariantes', label: 'Aniversariantes de hoje (0)', icon: <TeamOutlined />, action: '+' },
  { key: 'ontem', label: 'Pacientes agendados ontem (0)', icon: <UserOutlined />, action: 'Ver' },
  { key: 'despesas', label: 'Despesas com vencimento na semana (0)', icon: <DollarOutlined />, action: '+' },
  { key: 'recebimentos', label: 'Recebimentos com vencimento na semana (0)', icon: <DollarOutlined />, action: '+' },
  { key: 'retornos', label: 'Retornos do mês (0)', icon: <ClockCircleOutlined />, action: 'Ver' },
];

const accessCards = [
  { title: 'Pacientes', icon: <TeamOutlined />, note: 'Migração planejada' },
  { title: 'Odontograma', icon: <MedicineBoxOutlined />, note: 'Em breve' },
  { title: 'Tratamentos', icon: <MedicineBoxOutlined />, note: 'Migração planejada' },
  { title: 'Agenda', icon: <CalendarOutlined />, note: 'Em breve' },
  { title: 'Financeiro', icon: <DollarOutlined />, note: 'Migração planejada' },
  { title: 'Usuários', icon: <TeamOutlined />, note: 'Painel administrativo' },
];

function resolveUserLabel(user) {
  return user?.apelido || user?.nome || user?.email || 'Usuário';
}

function resolveLastAccessLabel() {
  return 'Seu último acesso foi em 24/06/2026 às 08:30';
}

function resolveLicenseLabel() {
  return 'Validade da licença: 30/06/2026';
}

export function InicioPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('avisos');
  const displayName = useMemo(() => resolveUserLabel(user), [user]);
  const lineLabel = (label) => label.replace('{user}', displayName);

  return (
    <Space direction="vertical" size={18} style={{ width: '100%' }}>
      <div className="inicio-hero">
        <div>
          <Typography.Title level={2} className="inicio-title">
            Início
          </Typography.Title>
          <Typography.Paragraph type="secondary" className="inicio-subtitle">
            Painel inicial operacional do Brana Cloud
          </Typography.Paragraph>
        </div>
        <Tag color="cyan" className="inicio-tag">
          Dashboard
        </Tag>
      </div>

      <div className="inicio-operational-strip">
        <div className="inicio-operational-strip-action">
          <FilterOutlined />
          <ReloadOutlined />
        </div>
        <div className="inicio-operational-strip-divider" />
        <div className="inicio-operational-strip-text">Todos os profissionais</div>
        <div className="inicio-operational-strip-divider" />
        <div className="inicio-operational-strip-text">Todas as unidades</div>
        <div className="inicio-operational-strip-divider" />
        <div className="inicio-operational-strip-text">Todas as contas bancárias</div>
      </div>

      <div className="inicio-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`inicio-tab${activeTab === tab.key ? ' is-active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'avisos' ? (
        <div className="inicio-avisos-layout">
          <div className="inicio-avisos-main">
            <Card className="inicio-greeting-card inicio-avisos-card" bordered={false}>
              <Space direction="vertical" size={6} style={{ width: '100%' }}>
                <Typography.Text className="inicio-greeting-label" type="secondary">
                  Olá
                </Typography.Text>
                <Typography.Title level={3} className="inicio-greeting-value">
                  {displayName}
                </Typography.Title>
                <Typography.Text type="secondary">{resolveLastAccessLabel()}</Typography.Text>
                <Typography.Text type="secondary">{resolveLicenseLabel()}</Typography.Text>
              </Space>
            </Card>

            <div className="inicio-summary-grid">
              {accessCards.map((item) => (
                <Card className="inicio-summary-card" bordered={false} key={item.title}>
                  <div className="inicio-summary-card-head">
                    <div className="inicio-access-icon">{item.icon}</div>
                    <Badge status="processing" text={item.note} />
                  </div>
                  <Typography.Title level={4} className="inicio-access-title">
                    {item.title}
                  </Typography.Title>
                </Card>
              ))}
            </div>

            <Card className="inicio-alerts-card" bordered={false}>
              <Space direction="vertical" size={0} style={{ width: '100%' }}>
                {dashboardLines.map((item, index) => (
                  <button key={item.key} type="button" className="inicio-alert-row">
                    <span className="inicio-alert-row-left">
                      <CaretRightOutlined className="inicio-alert-chevron" />
                      <span className="inicio-alert-icon">{item.icon}</span>
                      <span className="inicio-alert-label">{lineLabel(item.label)}</span>
                    </span>
                    <span className="inicio-alert-actions">
                      <span className="inicio-alert-action">{item.action}</span>
                      {index % 2 === 0 ? <ArrowDownOutlined className="inicio-alert-expand" /> : <ArrowRightOutlined className="inicio-alert-expand" />}
                    </span>
                  </button>
                ))}
              </Space>
            </Card>
          </div>

          <div className="inicio-avisos-side">
            <Card className="inicio-side-card" bordered={false} title="Status da sessão">
              <Space direction="vertical" size={10} style={{ width: '100%' }}>
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
                  <Typography.Text>{user?.clinica_id ? `Clínica/Tenant #${user.clinica_id}` : 'Clínica/Tenant indisponível'}</Typography.Text>
                </div>
              </Space>
            </Card>

            <Card className="inicio-side-card" bordered={false} title="Próximas telas da migração">
              <Space direction="vertical" size={8} style={{ width: '100%' }}>
                {['Pacientes', 'Odontograma', 'Novo tratamento', 'Ficha pessoal'].map((screen) => (
                  <div key={screen} className="inicio-next-item">
                    <Typography.Text>{screen}</Typography.Text>
                    <Tag color="green">Planejada</Tag>
                  </div>
                ))}
              </Space>
            </Card>
          </div>
        </div>
      ) : (
        <Card className="inicio-panel-card inicio-placeholder-panel" bordered={false}>
          <Typography.Title level={4}>Painel</Typography.Title>
          <Typography.Paragraph type="secondary">
            Conteúdo operacional reservado para próximas etapas.
          </Typography.Paragraph>
        </Card>
      )}
    </Space>
  );
}
