import { Button, Tooltip } from 'antd';

export function TopbarActionButton({ action, onAction }) {
  return <Tooltip title={action.label} placement="bottom"><Button type="text" icon={action.icon} onClick={() => onAction?.(action.key)} className="brana-action-button" aria-label={action.label} /></Tooltip>;
}
