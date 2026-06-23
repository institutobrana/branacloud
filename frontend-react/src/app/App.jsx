import { ConfigProvider, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
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
import { PacientesPage } from '../features/pacientes/PacientesPage.jsx';

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
  return path === '/' || path === '/app' || path === '/app/inicio' || path === '/app/pacientes' || path === '';
}

function resolveScreenFromPath() {
  const path = window.location.pathname || '/';
  if (path === '/app/pacientes') return 'pacientes';
  return 'inicio';
}

function syncAppPath(screen) {
  const nextPath = screen === 'pacientes' ? '/app/pacientes' : '/app';
  if ((window.location.pathname || '/') === nextPath) return;
  window.history.pushState({ screen }, '', nextPath);
}

function AppContent() {
  const { user, isAuthenticated, loading, signOut } = useAuth();
  const [screen, setScreen] = useState(resolveScreenFromPath);

  useEffect(() => {
    const onPopState = () => setScreen(resolveScreenFromPath());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const activeKey = screen;

  const handleNavigate = (nextScreen) => {
    if (!nextScreen) return;
    setScreen(nextScreen);
    syncAppPath(nextScreen);
  };

  const activePage = useMemo(() => {
    if (screen === 'pacientes') {
      return <PacientesPage onBackHome={() => handleNavigate('inicio')} />;
    }
    return <InicioPage />;
  }, [screen]);

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
        <BranaIconRail items={menuItems} activeKey={activeKey} onNavigate={handleNavigate} onSignOut={signOut} />
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
          {activePage}
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
