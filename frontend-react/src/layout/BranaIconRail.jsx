import { Tooltip, Typography } from 'antd';
import {
  CalendarOutlined,
  DashboardOutlined,
  DollarOutlined,
  FileTextOutlined,
  HomeOutlined,
  LogoutOutlined,
  SettingOutlined,
  SmileOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';

const railSections = [
  {
    title: 'Navegação',
    items: [
      { key: 'inicio', label: 'Início', icon: <HomeOutlined /> },
      { key: 'pacientes', label: 'Pacientes', icon: <UserOutlined /> },
      { key: 'odontograma', label: 'Odontograma', icon: <SmileOutlined /> },
    ],
  },
  {
    title: 'Operação',
    items: [
      { key: 'tratamentos', label: 'Tratamentos', icon: <DashboardOutlined /> },
      { key: 'agenda', label: 'Agenda', icon: <CalendarOutlined /> },
      { key: 'financeiro', label: 'Financeiro', icon: <DollarOutlined /> },
    ],
  },
  {
    title: 'Sistema',
    items: [
      { key: 'usuarios', label: 'Usuários', icon: <TeamOutlined /> },
      { key: 'configuracoes', label: 'Configurações', icon: <SettingOutlined /> },
      { key: 'documentos', label: 'Documentos', icon: <FileTextOutlined /> },
    ],
  },
];

export function BranaIconRail({ activeKey, onNavigate, onSignOut }) {
  return (
    <aside className="brana-icon-rail" aria-label="Navegação principal">
      <div className="brana-icon-rail-brand">
        <div className="brana-icon-rail-mark">B</div>
        <div className="brana-icon-rail-brand-text">
          <Typography.Text className="brana-icon-rail-title">Brana Cloud</Typography.Text>
          <Typography.Text className="brana-icon-rail-subtitle">Operacional</Typography.Text>
        </div>
      </div>

      <nav className="brana-icon-rail-nav">
        {railSections.map((section) => (
          <div key={section.title} className="brana-icon-rail-section">
            <Typography.Text className="brana-icon-rail-section-title">{section.title}</Typography.Text>
            <div className="brana-icon-rail-group">
              {section.items.map((item) => {
                const active = item.key === activeKey;
                return (
                  <Tooltip key={item.key} title={item.label} placement="right">
                    <button
                      type="button"
                      className={`brana-icon-rail-button${active ? ' is-active' : ''}`}
                      onClick={() => onNavigate?.(item.key)}
                      aria-label={item.label}
                      aria-current={active ? 'page' : undefined}
                    >
                      <span className="brana-icon-rail-active-bar" aria-hidden="true" />
                      <span className="brana-icon-rail-icon">{item.icon}</span>
                      <span className="brana-icon-rail-label">{item.label}</span>
                    </button>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="brana-icon-rail-footer">
        <Tooltip title="Sair" placement="right">
          <button type="button" className="brana-icon-rail-button is-signout" onClick={onSignOut} aria-label="Sair">
            <span className="brana-icon-rail-active-bar" aria-hidden="true" />
            <span className="brana-icon-rail-icon">
              <LogoutOutlined />
            </span>
            <span className="brana-icon-rail-label">Sair</span>
          </button>
        </Tooltip>
      </div>
    </aside>
  );
}
