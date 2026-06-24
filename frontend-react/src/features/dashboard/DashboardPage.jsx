import { useMemo, useState } from 'react';
import { Badge, Card, Space, Tag, Typography } from 'antd';
import {
  ArrowDownOutlined,
  ArrowRightOutlined,
  CalendarOutlined,
  CaretRightOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  FilterOutlined,
  MedicineBoxOutlined,
  ReloadOutlined,
  TeamOutlined,
  UserOutlined,
  BellOutlined,
} from '@ant-design/icons';
import { useAuth } from '../auth/useAuth.js';
import './dashboard.css';

const tabs = [
  { key: 'avisos', label: 'Avisos' },
  { key: 'painel', label: 'Painel' },
  { key: 'agenda', label: 'Análise de agenda' },
  { key: 'vendas', label: 'Análise de vendas' },
  { key: 'financeira', label: 'Análise financeira' },
];

const avisos = [
  { key: 'mensagens', label: 'Mensagens e avisos para {user} (0)', icon: <BellOutlined />, action: '+' },
  { key: 'agendamentos', label: 'Agendamentos de hoje (0)', icon: <CalendarOutlined />, action: 'Abrir' },
  { key: 'aniversariantes', label: 'Aniversariantes de hoje (0)', icon: <TeamOutlined />, action: '+' },
  { key: 'ontem', label: 'Pacientes agendados ontem (0)', icon: <UserOutlined />, action: 'Ver' },
  { key: 'despesas', label: 'Despesas com vencimento na semana (0)', icon: <DollarOutlined />, action: '+' },
  { key: 'recebimentos', label: 'Recebimentos com vencimento na semana (0)', icon: <DollarOutlined />, action: '+' },
  { key: 'retornos', label: 'Retornos do mês (0)', icon: <ClockCircleOutlined />, action: 'Ver' },
];

function resolveUserLabel(user) {
  return user?.apelido || user?.nome || user?.email || 'Usuário';
}

export function DashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('avisos');
  const displayName = useMemo(() => resolveUserLabel(user), [user]);
  const replaceUser = (label) => label.replace('{user}', displayName);

  return (
    <Space direction="vertical" size={16} className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <Typography.Title level={2} className="dashboard-title">
            Quadro de avisos
          </Typography.Title>
          <Typography.Paragraph type="secondary" className="dashboard-subtitle">
            Painel inicial operacional do Brana Cloud
          </Typography.Paragraph>
        </div>
        <Tag color="cyan" className="dashboard-tag">
          Dashboard
        </Tag>
      </div>

      <div className="dashboard-strip">
        <div className="dashboard-strip-action">
          <FilterOutlined />
          <ReloadOutlined />
        </div>
        <div className="dashboard-strip-divider" />
        <div className="dashboard-strip-text">Todos os profissionais</div>
        <div className="dashboard-strip-divider" />
        <div className="dashboard-strip-text">Todas as unidades</div>
        <div className="dashboard-strip-divider" />
        <div className="dashboard-strip-text">Todas as contas bancárias</div>
      </div>

      <div className="dashboard-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`dashboard-tab${activeTab === tab.key ? ' is-active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'avisos' ? (
        <div className="dashboard-body">
          <div className="dashboard-main">
            <Card className="dashboard-greeting-card" bordered={false}>
              <Space direction="vertical" size={6} style={{ width: '100%' }}>
                <Typography.Text className="dashboard-greeting-label" type="secondary">
                  Olá
                </Typography.Text>
                <Typography.Title level={3} className="dashboard-greeting-value">
                  {displayName}
                </Typography.Title>
                <Typography.Text type="secondary">Seu último acesso foi em 24/06/2026 às 08:30</Typography.Text>
                <Typography.Text type="secondary">Validade da licença: 30/06/2026</Typography.Text>
              </Space>
            </Card>

            <Card className="dashboard-alerts-card" bordered={false}>
              <Space direction="vertical" size={0} style={{ width: '100%' }}>
                {avisos.map((item, index) => (
                  <button key={item.key} type="button" className="dashboard-alert-row">
                    <span className="dashboard-alert-left">
                      <CaretRightOutlined className="dashboard-alert-chevron" />
                      <span className="dashboard-alert-icon">{item.icon}</span>
                      <span className="dashboard-alert-label">{replaceUser(item.label)}</span>
                    </span>
                    <span className="dashboard-alert-actions">
                      <span className="dashboard-alert-action">{item.action}</span>
                      {index % 2 === 0 ? <ArrowDownOutlined className="dashboard-alert-expand" /> : <ArrowRightOutlined className="dashboard-alert-expand" />}
                    </span>
                  </button>
                ))}
              </Space>
            </Card>
          </div>
        </div>
      ) : (
        <Card className="dashboard-placeholder-card" bordered={false}>
          <Typography.Title level={4}>Painel</Typography.Title>
          <Typography.Paragraph type="secondary">
            Conteúdo operacional reservado para próximas etapas.
          </Typography.Paragraph>
        </Card>
      )}
    </Space>
  );
}
