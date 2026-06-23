import { Button, Input, Space, Typography, Tooltip } from 'antd';
import {
  CalendarOutlined,
  DollarOutlined,
  FileTextOutlined,
  MedicineBoxOutlined,
  SearchOutlined,
  TeamOutlined,
} from '@ant-design/icons';

const quickActions = [
  { key: 'novo-paciente', label: 'Novo paciente', icon: <TeamOutlined /> },
  { key: 'buscar-paciente', label: 'Buscar paciente', icon: <SearchOutlined /> },
  { key: 'novo-tratamento', label: 'Novo tratamento', icon: <MedicineBoxOutlined /> },
  { key: 'agenda', label: 'Agenda', icon: <CalendarOutlined /> },
  { key: 'financeiro', label: 'Financeiro', icon: <DollarOutlined /> },
  { key: 'documentos', label: 'Relatórios/Documentos', icon: <FileTextOutlined /> },
];

export function BranaActionTopbar({ user, onSignOut, loading, onPlaceholderAction }) {
  const displayName = user?.apelido || user?.nome || user?.email || '';

  return (
    <header className="brana-action-topbar">
      <div className="brana-action-topbar-left">
        <div className="brana-action-topbar-brand">
          <Typography.Text className="brana-action-topbar-kicker">
            Brana Cloud
          </Typography.Text>
          <Typography.Title level={4} className="brana-action-topbar-title">
            Shell Operacional Odontológico
          </Typography.Title>
        </div>

        <div className="brana-action-topbar-search-wrap">
          <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder="Pesquisar paciente"
            className="brana-action-topbar-search"
            onChange={onPlaceholderAction}
            onPressEnter={onPlaceholderAction}
          />
          <Typography.Text className="brana-action-topbar-hint" type="secondary">
            Busca será ativada em etapa futura
          </Typography.Text>
        </div>
      </div>

      <Space size={6} wrap className="brana-action-topbar-actions">
        {quickActions.map((action) => (
          <Tooltip key={action.key} title={action.label} placement="bottom">
            <Button
              icon={action.icon}
              onClick={onPlaceholderAction}
              className="brana-action-button"
              size="small"
            >
              <span className="brana-action-button-label">{action.label}</span>
            </Button>
          </Tooltip>
        ))}
      </Space>

      <div className="brana-action-topbar-session">
        <Typography.Text className="brana-action-topbar-user">
          {loading ? 'Validando sessão...' : displayName ? `Logado como ${displayName}` : 'Sessão ativa'}
        </Typography.Text>
        <Button size="small" onClick={onSignOut} disabled={loading} className="brana-action-signout">
          Sair
        </Button>
      </div>
    </header>
  );
}
