import { ConfigProvider, Typography } from 'antd';
import {
  DashboardOutlined,
  HomeOutlined,
  CalendarOutlined,
  DollarOutlined,
  FileTextOutlined,
  SettingOutlined,
  SmileOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { branaTheme } from '../theme/branaTheme.js';
import { BranaIconRail } from '../layout/BranaIconRail.jsx';
import { BranaActionTopbar } from '../layout/BranaActionTopbar.jsx';
import { BranaWorkspace } from '../layout/BranaWorkspace.jsx';
import { LoginPage } from '../features/auth/LoginPage.jsx';
import { AuthProvider, useAuth } from '../features/auth/AuthProvider.jsx';
import { InicioPage } from '../features/inicio/InicioPage.jsx';

const menuItems = [
  { key: 'inicio', icon: <HomeOutlined />, label: 'Inicio' },
  { key: 'pacientes', icon: <UserOutlined />, label: 'Pacientes' },
  { key: 'odontograma', icon: <SmileOutlined />, label: 'Odontograma' },
  { key: 'tratamentos', icon: <DashboardOutlined />, label: 'Tratamentos' },
  { key: 'agenda', icon: <CalendarOutlined />, label: 'Agenda' },
  { key: 'financeiro', icon: <DollarOutlined />, label: 'Financeiro' },
  { key: 'usuarios', icon: <TeamOutlined />, label: 'Usuarios' },
  { key: 'configuracoes', icon: <SettingOutlined />, label: 'Configuracoes' },
  { key: 'documentos', icon: <FileTextOutlined />, label: 'Documentos' },
];

function isLoginRoute() {
  return (window.location.pathname || '/') === '/login';
}

function isAppRoute() {
  const path = window.location.pathname || '/';
  return path === '/' || path === '/app' || path === '/app/inicio' || path === '';
}

function AppContent() {
  const { user, isAuthenticated, loading, signOut } = useAuth();
  const activeKey = 'inicio';

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <Typography.Text type="secondary">Validando sessão...</Typography.Text>
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
      <div className="brana-shell">
        <BranaIconRail items={menuItems} activeKey={activeKey} onNavigate={() => {}} onSignOut={signOut} />
        <BranaWorkspace
          topbar={
            <BranaActionTopbar
              user={user}
              onSignOut={signOut}
              loading={loading}
              onPlaceholderAction={() => {}}
            />
          }
        >
          <InicioPage />
        </BranaWorkspace>
      </div>
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
