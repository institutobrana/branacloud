import { ConfigProvider, Typography } from 'antd';
import {
  DashboardOutlined,
  HomeOutlined,
  CalendarOutlined,
  DollarOutlined,
  SettingOutlined,
  SmileOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { branaTheme } from '../theme/branaTheme.js';
import { BranaShell } from '../layout/BranaShell.jsx';
import { BranaSidebar } from '../layout/BranaSidebar.jsx';
import { BranaTopbar } from '../layout/BranaTopbar.jsx';
import { HomePlaceholder } from '../features/home/HomePlaceholder.jsx';
import { LoginPage } from '../features/auth/LoginPage.jsx';
import { AuthProvider, useAuth } from '../features/auth/AuthProvider.jsx';

const menuItems = [
  { key: 'inicio', icon: <HomeOutlined />, label: 'Inicio' },
  { key: 'pacientes', icon: <UserOutlined />, label: 'Pacientes' },
  { key: 'odontograma', icon: <SmileOutlined />, label: 'Odontograma' },
  { key: 'tratamentos', icon: <DashboardOutlined />, label: 'Tratamentos' },
  { key: 'agenda', icon: <CalendarOutlined />, label: 'Agenda' },
  { key: 'financeiro', icon: <DollarOutlined />, label: 'Financeiro' },
  { key: 'usuarios', icon: <TeamOutlined />, label: 'Usuarios' },
  { key: 'configuracoes', icon: <SettingOutlined />, label: 'Configuracoes' },
];

function isLoginRoute() {
  return (window.location.pathname || '/') === '/login';
}

function isAppRoute() {
  const path = window.location.pathname || '/';
  return path === '/' || path === '/app' || path === '';
}

function AppContent() {
  const { user, isAuthenticated, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <Typography.Text type="secondary">Validando sessao...</Typography.Text>
      </div>
    );
  }

  if (isLoginRoute()) {
    if (isAuthenticated) {
      window.location.replace('/app');
      return null;
    }
    return <LoginPage />;
  }

  if (!isAuthenticated) {
    window.location.replace('/login');
    return null;
  }

  if (isAppRoute()) {
    return (
      <BranaShell
        sidebar={<BranaSidebar menuItems={menuItems} />}
        topbar={<BranaTopbar user={user} onSignOut={signOut} loading={loading} />}
      >
        <HomePlaceholder />
      </BranaShell>
    );
  }

  window.location.replace('/app');
  return null;
}

export default function App() {
  return (
    <ConfigProvider theme={branaTheme}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ConfigProvider>
  );
}
