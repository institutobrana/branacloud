import { useMemo, useState } from 'react';
import { Card, Space, Typography } from 'antd';
import {
  ArrowDownOutlined,
  ArrowRightOutlined,
  CalendarOutlined,
  CaretRightOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  FilterOutlined,
  ReloadOutlined,
  TeamOutlined,
  UserOutlined,
  BellOutlined,
  InfoCircleOutlined,
  PhoneOutlined,
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
  const helperCards = [
    {
      key: 'setup',
      title: 'Configure seu Brana Cloud',
      description: 'Acompanhe a estrutura inicial da clínica e valide os blocos operacionais desta área.',
      icon: <InfoCircleOutlined />,
      meta: 'Fluxo inicial',
    },
    {
      key: 'pacientes',
      title: 'Cadastre seus pacientes',
      description: 'Prepare a base de pacientes para iniciar os próximos módulos com dados organizados.',
      icon: <UserOutlined />,
      meta: 'Próxima etapa',
    },
    {
      key: 'suporte',
      title: 'Suporte e implantação',
      description: 'Use este espaço para acompanhamento da implantação e ajustes assistidos da clínica.',
      icon: <PhoneOutlined />,
      meta: 'Apoio operacional',
    },
  ];

  return (
    <Space direction="vertical" size={12} className="dashboard-page">
      <Typography.Title level={2} className="dashboard-sr-title">
        Quadro de avisos
      </Typography.Title>
      <div className="dashboard-shell">
        <div className="dashboard-strip">
          <div className="dashboard-strip-badge">Brana Cloud</div>
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
            <div className="dashboard-body-layout">
              <div className="dashboard-main">
                <Card className="dashboard-greeting-card" bordered={false}>
                  <Space direction="vertical" size={4} style={{ width: '100%' }}>
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
                          <span className="dashboard-alert-action" aria-hidden="true">
                            {item.action}
                          </span>
                          {index % 2 === 0 ? (
                            <ArrowDownOutlined className="dashboard-alert-expand" />
                          ) : (
                            <ArrowRightOutlined className="dashboard-alert-expand" />
                          )}
                        </span>
                      </button>
                    ))}
                  </Space>
                </Card>
              </div>

              <aside className="dashboard-side">
                {helperCards.map((card) => (
                  <Card key={card.key} className="dashboard-side-card" bordered={false}>
                    <div className="dashboard-side-card-head">
                      <span className="dashboard-side-card-icon">{card.icon}</span>
                      <Typography.Text className="dashboard-side-card-meta">{card.meta}</Typography.Text>
                    </div>
                    <Typography.Title level={4} className="dashboard-side-card-title">
                      {card.title}
                    </Typography.Title>
                    <Typography.Paragraph className="dashboard-side-card-description">
                      {card.description}
                    </Typography.Paragraph>
                  </Card>
                ))}
                <Card className="dashboard-side-card dashboard-side-card-highlight" bordered={false}>
                  <Typography.Text className="dashboard-side-card-meta">Observação operacional</Typography.Text>
                  <Typography.Title level={4} className="dashboard-side-card-title">
                    Espaço reservado para a implantação assistida
                  </Typography.Title>
                  <Typography.Paragraph className="dashboard-side-card-description">
                    Esta área mantém o dashboard compacto, com leitura rápida e sem depender de novas integrações.
                  </Typography.Paragraph>
                </Card>
              </aside>
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
      </div>
    </Space>
  );
}
