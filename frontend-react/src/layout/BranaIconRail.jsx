import { Tooltip } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DollarOutlined,
  FileTextOutlined,
  CustomerServiceOutlined,
  SettingOutlined,
  TableOutlined,
  TeamOutlined,
  ToolOutlined,
  UserOutlined,
} from '@ant-design/icons';

export function BranaIconRail({
  activeKey,
  expanded,
  groups,
  activeGroupKey,
  panelOpen,
  onNavigate,
  onOpenGroup,
  onToggleExpand,
  onMouseEnter,
  onMouseLeave,
}) {
  return (
    <aside
      className={`brana-icon-rail${expanded ? ' is-expanded' : ' is-collapsed'}`}
      aria-label="Navegação principal"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <nav className="brana-icon-rail-nav">
        {(groups || []).map((group) => {
          const active = group.key === activeGroupKey;
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
            <Tooltip key={group.key} title={expanded || panelOpen ? null : group.label} placement="right">
              {button}
            </Tooltip>
          );
        })}
      </nav>

      <div className="brana-icon-rail-footer">
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
  { key: 'atendimento', label: 'Atendimento', icon: <TeamOutlined /> },
  { key: 'cadastro', label: 'Cadastro', icon: <UserOutlined /> },
  { key: 'financeiro', label: 'Financeiro', icon: <DollarOutlined /> },
  { key: 'tabelas', label: 'Tabelas', icon: <TableOutlined /> },
  { key: 'relatorios', label: 'Relatórios', icon: <FileTextOutlined /> },
  { key: 'configuracao', label: 'Configuração', icon: <SettingOutlined /> },
  { key: 'ferramentas', label: 'Ferramentas', icon: <ToolOutlined /> },
  { key: 'ajuda', label: 'Ajuda', icon: <CustomerServiceOutlined /> },
];
