import { Tooltip } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import {
  RailDocumentsIcon,
  RailGearIcon,
  RailMoneyIcon,
  RailPatientIcon,
  RailSupportIcon,
  RailToolsIcon,
  RailUsersIcon,
  RailFileIcon,
} from './BranaRailIcons.jsx';

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
  { key: 'atendimento', label: 'Atendimento', icon: <RailUsersIcon /> },
  { key: 'cadastro', label: 'Cadastro', icon: <RailPatientIcon /> },
  { key: 'financeiro', label: 'Financeiro', icon: <RailMoneyIcon /> },
  { key: 'tabelas', label: 'Tabelas', icon: <RailDocumentsIcon /> },
  { key: 'relatorios', label: 'Relatórios', icon: <RailFileIcon /> },
  { key: 'configuracao', label: 'Configuração', icon: <RailGearIcon /> },
  { key: 'ferramentas', label: 'Ferramentas', icon: <RailToolsIcon /> },
  { key: 'ajuda', label: 'Ajuda', icon: <RailSupportIcon /> },
];
