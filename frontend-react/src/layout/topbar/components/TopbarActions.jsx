import { Space } from 'antd';
import { topbarActionGroups } from '../config/topbarActions.jsx';
import { TopbarActionButton } from './TopbarActionButton.jsx';

export function TopbarActions({ onNavigate, onPlaceholder }) {
  const dispatch = (action) => action.target ? onNavigate?.(action.target, { source: 'topbar' }) : onPlaceholder?.();
  return <div className="brana-action-topbar-toolbar" role="toolbar" aria-label="Ações operacionais">{topbarActionGroups.map((group, groupIndex) => <Space key={group.key} size={6} className="brana-action-topbar-group">{group.items.map((action) => <TopbarActionButton key={action.key} action={action} onAction={() => dispatch(action)} />)}{groupIndex < topbarActionGroups.length - 1 ? <span className="brana-action-topbar-divider" aria-hidden="true" /> : null}</Space>)}</div>;
}
