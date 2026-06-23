import { Tooltip, Typography } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';

export function BranaIconRail({ items = [], activeKey, onNavigate, onSignOut }) {
  return (
    <aside className="brana-icon-rail" aria-label="Navegação principal">
      <div className="brana-icon-rail-brand">
        <div className="brana-icon-rail-mark">B</div>
        <Typography.Text className="brana-icon-rail-title">Brana</Typography.Text>
      </div>

      <nav className="brana-icon-rail-nav">
        {items.map((item) => {
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
                <span className="brana-icon-rail-icon">{item.icon}</span>
              </button>
            </Tooltip>
          );
        })}
      </nav>

      <div className="brana-icon-rail-footer">
        <Tooltip title="Sair" placement="right">
          <button type="button" className="brana-icon-rail-button is-signout" onClick={onSignOut} aria-label="Sair">
            <span className="brana-icon-rail-icon">
              <LogoutOutlined />
            </span>
          </button>
        </Tooltip>
      </div>
    </aside>
  );
}
