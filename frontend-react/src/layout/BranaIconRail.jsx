import { Tooltip } from 'antd';
import {
  CalendarOutlined,
  DashboardOutlined,
  DollarOutlined,
  FileTextOutlined,
  HomeOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  SmileOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';

export function BranaIconRail({
  activeKey,
  expanded,
  groups,
  activeGroupKey,
  onNavigate,
  onOpenGroup,
  onToggleExpand,
  onSignOut,
}) {
  return (
    <aside className={`brana-icon-rail${expanded ? ' is-expanded' : ' is-collapsed'}`} aria-label="Navegação principal">
      <Tooltip title="Brana Cloud Operacional" placement="right">
        <button type="button" className="brana-icon-rail-brand" onClick={() => onNavigate?.('inicio')} aria-label="Ir para Início">
          <div className="brana-icon-rail-mark">B</div>
          {expanded ? (
            <div className="brana-icon-rail-brand-copy">
              <span>Brana Cloud</span>
              <span>Operacional</span>
            </div>
          ) : null}
        </button>
      </Tooltip>

      <nav className="brana-icon-rail-nav">
        {(groups || []).map((group) => {
          const active = group.key === activeGroupKey || (group.key === 'inicio' && activeKey === 'inicio');
          const button = (
            <button
              type="button"
              className={`brana-icon-rail-button${active ? ' is-active' : ''}`}
              onClick={() => onOpenGroup?.(group.key)}
              onMouseEnter={() => onOpenGroup?.(group.key)}
              aria-label={group.label}
              aria-current={active ? 'page' : undefined}
            >
              <span className="brana-icon-rail-icon" aria-hidden="true">
                {group.icon}
              </span>
              {expanded ? <span className="brana-icon-rail-label">{group.label}</span> : <span className="sr-only">{group.label}</span>}
            </button>
          );

          return (
            <Tooltip key={group.key} title={expanded ? null : group.label} placement="right">
              {button}
            </Tooltip>
          );
        })}
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
            {expanded ? <span className="brana-icon-rail-label">Sair</span> : <span className="sr-only">Sair</span>}
          </button>
        </Tooltip>
        <Tooltip title={expanded ? 'Recolher barra' : 'Expandir barra'} placement="right">
          <button type="button" className="brana-icon-rail-toggle" onClick={onToggleExpand} aria-label="Recolher ou expandir a barra">
            {expanded ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
          </button>
        </Tooltip>
      </div>
    </aside>
  );
}

export const branaMainGroups = [
  { key: 'inicio', label: 'Início', icon: <HomeOutlined /> },
  { key: 'atendimento', label: 'Atendimento', icon: <CalendarOutlined /> },
  { key: 'cadastro', label: 'Cadastro', icon: <UserOutlined /> },
  { key: 'financeiro', label: 'Financeiro', icon: <DollarOutlined /> },
  { key: 'tabelas', label: 'Tabelas', icon: <DashboardOutlined /> },
  { key: 'relatorios', label: 'Relatórios', icon: <FileTextOutlined /> },
  { key: 'configuracao', label: 'Configuração', icon: <SettingOutlined /> },
  { key: 'ferramentas', label: 'Ferramentas', icon: <TeamOutlined /> },
  { key: 'ajuda', label: 'Ajuda', icon: <SmileOutlined /> },
];
