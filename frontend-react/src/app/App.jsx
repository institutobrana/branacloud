import { ConfigProvider } from 'antd';
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
  { key: 'inicio', icon: <HomeOutlined />, label: 'Início' },
  { key: 'pacientes', icon: <UserOutlined />, label: 'Pacientes' },
  { key: 'odontograma', icon: <SmileOutlined />, label: 'Odontograma' },
  { key: 'tratamentos', icon: <DashboardOutlined />, label: 'Tratamentos' },
  { key: 'agenda', icon: <CalendarOutlined />, label: 'Agenda' },
  { key: 'financeiro', icon: <DollarOutlined />, label: 'Financeiro' },
  { key: 'usuarios', icon: <TeamOutlined />, label: 'Usuários' },
  { key: 'configuracoes', icon: <SettingOutlined />, label: 'Configurações' },
];

function isLoginRoute() {
  const path = window.location.pathname || '/';
  return path === '/login';
}

function AppContent() {
  const { isAuthenticated, loading } = useAuth();

  if (isLoginRoute()) {
    return <LoginPage />;
  }

  if (!loading && isAuthenticated === false && window.location.pathname === '/app') {
    window.location.replace('/login');
    return null;
  }

  return (
    <BranaShell
      sidebar={<BranaSidebar menuItems={menuItems} />}
      topbar={<BranaTopbar />}
    >
      <HomePlaceholder />
    </BranaShell>
  );
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
