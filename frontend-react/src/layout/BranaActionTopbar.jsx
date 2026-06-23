import { Button, Input, Space, Typography } from 'antd';
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
        <div>
          <Typography.Text className="brana-action-topbar-kicker" type="secondary">
            Brana Cloud
          </Typography.Text>
          <Typography.Title level={4} className="brana-action-topbar-title">
            Shell Operacional Odontológico
          </Typography.Title>
        </div>

        <Input
          allowClear
          prefix={<SearchOutlined />}
          placeholder="Pesquisar paciente"
          className="brana-action-topbar-search"
          onChange={onPlaceholderAction}
          onPressEnter={onPlaceholderAction}
        />
      </div>

      <Space size={8} wrap className="brana-action-topbar-actions">
        {quickActions.map((action) => (
          <Button
            key={action.key}
            icon={action.icon}
            onClick={onPlaceholderAction}
            className="brana-action-button"
          >
            {action.label}
          </Button>
        ))}
      </Space>

      <div className="brana-action-topbar-session">
        <Typography.Text type="secondary" className="brana-action-topbar-user">
          {loading ? 'Validando sessão...' : displayName ? `Logado como ${displayName}` : 'Sessão ativa'}
        </Typography.Text>
        <Button size="small" onClick={onSignOut} disabled={loading}>
          Sair
        </Button>
      </div>
    </header>
  );
}
