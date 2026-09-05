import { Button, Dropdown, Input, Space, Typography, Tooltip } from 'antd';
import {
  CalendarOutlined,
  DollarOutlined,
  DollarCircleFilled,
  FieldTimeOutlined,
  FileTextOutlined,
  HomeOutlined,
  MailOutlined,
  MoreOutlined,
  MoneyCollectOutlined,
  PartitionOutlined,
  SearchOutlined,
  SnippetsOutlined,
  TransactionOutlined,
  UsergroupAddOutlined,
  UserAddOutlined,
  UserOutlined,
  RocketOutlined,
} from '@ant-design/icons';
import branaLogo from '../assets/brana.png';
import { BranaEstoqueIcon, BranaFichaClinicaIcon, BranaPacienteIcon } from './branaTopbarIcons.jsx';

const toolbarGroups = [
  {
    key: 'agenda-clinica',
    items: [
      { key: 'dashboard', label: 'Dashboard', icon: <HomeOutlined /> },
      { key: 'agenda', label: 'Agenda', icon: <CalendarOutlined /> },
      { key: 'proximo-agendado', label: 'Próximo agendado', icon: <FieldTimeOutlined /> },
      { key: 'cadastro-pacientes', label: 'Cadastro de pacientes', icon: <UsergroupAddOutlined /> },
      { key: 'paciente', label: 'Paciente', icon: <BranaPacienteIcon /> },
      { key: 'novo-paciente', label: 'Novo paciente', icon: <UserAddOutlined /> },
      { key: 'anamnese', label: 'Anamnese', icon: <SnippetsOutlined /> },
      { key: 'ficha-clinica', label: 'Ficha clínica', icon: <BranaFichaClinicaIcon /> },
    ],
  },
  {
    key: 'financeiro-estoque',
    items: [
      { key: 'contas-pagar', label: 'Contas a pagar', icon: <DollarCircleFilled /> },
      { key: 'contas-receber', label: 'Contas a receber', icon: <MoneyCollectOutlined /> },
      { key: 'fluxo-caixa', label: 'Fluxo de caixa', icon: <TransactionOutlined /> },
      { key: 'controle-estoque', label: 'Controle de estoque', icon: <BranaEstoqueIcon /> },
    ],
  },
  {
    key: 'produtividade-crm',
    items: [
      { key: 'editor-textos', label: 'Editor de textos', icon: <FileTextOutlined /> },
      { key: 'mala-direta', label: 'Mala direta', icon: <MailOutlined /> },
      { key: 'crm-vendas', label: 'CRM de vendas', icon: <RocketOutlined /> },
    ],
  },
];

const userMenuItems = [
  { key: 'preferencias', label: 'Preferências' },
  { key: 'alterar-senha', label: 'Alterar senha interna' },
  { key: 'opcoes-conta', label: 'Opções da conta' },
  { type: 'divider' },
  { key: 'sair', label: 'Sair', icon: <UserOutlined /> },
];

function ActionButton({ action, onAction }) {
  return (
    <Tooltip title={action.label} placement="bottom">
      <Button
        type="text"
        icon={action.icon}
        onClick={() => onAction?.(action.key)}
        className="brana-action-button"
        aria-label={action.label}
      />
    </Tooltip>
  );
}

export function BranaActionTopbar({ user, onSignOut, loading, onPlaceholderAction, onUserMenuAction }) {
  const displayName = user?.apelido || user?.nome || user?.email || '';
  const userLabel = loading ? 'Validando sessão...' : displayName || 'Sessão ativa';
  return (
    <header className="brana-action-topbar">
      <div className="brana-action-topbar-brand">
        <img className="brana-action-topbar-logo" src={branaLogo} alt="Instituto Brana Odontologia" />
        <div className="brana-action-topbar-brand-copy">
          <Typography.Text className="brana-action-topbar-brand-name">BranaCloud</Typography.Text>
        </div>
      </div>

      <div className="brana-action-topbar-center">
        <div className="brana-action-topbar-toolbar" role="toolbar" aria-label="Ações operacionais">
          {toolbarGroups.map((group, groupIndex) => (
            <Space key={group.key} size={6} className="brana-action-topbar-group">
              {group.items.map((action) => (
                <ActionButton key={action.key} action={action} onAction={onPlaceholderAction} />
              ))}
              {groupIndex < toolbarGroups.length - 1 ? <span className="brana-action-topbar-divider" aria-hidden="true" /> : null}
            </Space>
          ))}
        </div>

        <div className="brana-action-topbar-search-wrap">
          <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder="Pesquisar paciente"
            className="brana-action-topbar-search"
            onChange={() => {}}
            onPressEnter={() => onPlaceholderAction?.('pesquisar-paciente')}
          />
        </div>
      </div>

      <Dropdown
        trigger={['click']}
        placement="bottomRight"
        menu={{
          items: userMenuItems,
          onClick: ({ key }) => {
            if (key === 'sair') {
              onSignOut?.();
              return;
            }
            onUserMenuAction?.(key);
          },
        }}
      >
        <button type="button" className="brana-action-topbar-session" aria-label="Menu do usuário">
          <span className="brana-action-topbar-user-meta">
            <UserOutlined />
            <Typography.Text className="brana-action-topbar-user">{userLabel}</Typography.Text>
          </span>
          <MoreOutlined className="brana-action-topbar-user-more" />
        </button>
      </Dropdown>
    </header>
  );
}
