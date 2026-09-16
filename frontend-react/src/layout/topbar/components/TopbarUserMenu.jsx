import { Dropdown, Typography } from 'antd';
import { MoreOutlined, UserOutlined } from '@ant-design/icons';
import { topbarUserMenuItems } from '../config/topbarActions.jsx';

export function TopbarUserMenu({ user, loading, onSignOut, onNavigate, onPlaceholder }) {
  const displayName = user?.apelido || user?.nome || user?.email || '';
  const userLabel = loading ? 'Validando sessão...' : displayName || 'Sessão ativa';
  return <Dropdown trigger={['click']} placement="bottomRight" menu={{ items: topbarUserMenuItems, onClick: ({ key }) => key === 'sair' ? onSignOut?.() : key === 'alterar-senha' ? onNavigate?.('alterar-senha') : key === 'opcoes-sistema' ? onNavigate?.('opcoes-sistema') : onPlaceholder?.() }}><button type="button" className="brana-action-topbar-session" aria-label="Menu do usuário"><span className="brana-action-topbar-user-meta"><UserOutlined /><Typography.Text className="brana-action-topbar-user">{userLabel}</Typography.Text></span><MoreOutlined className="brana-action-topbar-user-more" /></button></Dropdown>;
}
