import { Button, Typography } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

export function BranaContextPanel({ group, items, onClose, onSelectItem }) {
  if (!group) return null;

  return (
    <aside className="brana-context-panel" aria-label={`Menu ${group.label}`}>
      <div className="brana-context-panel-header">
        <div className="brana-context-panel-header-copy">
          <Typography.Text className="brana-context-panel-kicker">Menu contextual</Typography.Text>
          <Typography.Title level={4} className="brana-context-panel-title">
            {group.label}
          </Typography.Title>
        </div>
        <Button
          type="text"
          size="small"
          icon={<CloseOutlined />}
          onClick={onClose}
          className="brana-context-panel-close"
        />
      </div>

      <div className="brana-context-panel-list">
        {(items || []).map((item) => (
          <button
            key={item.key}
            type="button"
            className={`brana-context-panel-item${item.disabled ? ' is-disabled' : ''}`}
            onClick={() => onSelectItem?.(group.key, item)}
          >
            <span className="brana-context-panel-item-label">{item.label}</span>
            {item.disabled ? <span className="brana-context-panel-item-state">Em breve</span> : null}
          </button>
        ))}
      </div>
    </aside>
  );
}
