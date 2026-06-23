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
  [
    { key: 'inicio', label: 'Início', icon: <HomeOutlined /> },
    { key: 'pacientes', label: 'Pacientes', icon: <UserOutlined /> },
    { key: 'odontograma', label: 'Odontograma', icon: <SmileOutlined /> },
  ],
  [
    { key: 'tratamentos', label: 'Tratamentos', icon: <DashboardOutlined /> },
    { key: 'agenda', label: 'Agenda', icon: <CalendarOutlined /> },
    { key: 'financeiro', label: 'Financeiro', icon: <DollarOutlined /> },
  ],
  [
    { key: 'usuarios', label: 'Usuários', icon: <TeamOutlined /> },
    { key: 'configuracoes', label: 'Configurações', icon: <SettingOutlined /> },
    { key: 'documentos', label: 'Documentos', icon: <FileTextOutlined /> },
  ],
];

export function BranaIconRail({ activeKey, onNavigate, onSignOut }) {
  return (
    <aside className="brana-icon-rail" aria-label="Navegação principal">
      <Tooltip title="Brana Cloud Operacional" placement="right">
        <div className="brana-icon-rail-brand" aria-hidden="true">
          <div className="brana-icon-rail-mark">B</div>
          <div className="brana-icon-rail-brand-glow" />
        </div>
      </Tooltip>

      <nav className="brana-icon-rail-nav">
        {railSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="brana-icon-rail-section">
            {sectionIndex > 0 ? <div className="brana-icon-rail-divider" aria-hidden="true" /> : null}
            <div className="brana-icon-rail-group">
              {section.map((item) => {
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
                      <span className="brana-icon-rail-icon" aria-hidden="true">
                        {item.icon}
                      </span>
                      <span className="sr-only">{item.label}</span>
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
          <button
            type="button"
            className="brana-icon-rail-button is-signout"
            onClick={onSignOut}
            aria-label="Sair"
          >
            <span className="brana-icon-rail-icon" aria-hidden="true">
              <LogoutOutlined />
            </span>
            <span className="sr-only">Sair</span>
          </button>
        </Tooltip>
      </div>
    </aside>
  );
}
