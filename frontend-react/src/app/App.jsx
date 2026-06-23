import { ConfigProvider, Typography, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { branaTheme } from '../theme/branaTheme.js';
import { BranaIconRail, branaMainGroups } from '../layout/BranaIconRail.jsx';
import { BranaActionTopbar } from '../layout/BranaActionTopbar.jsx';
import { BranaContextPanel } from '../layout/BranaContextPanel.jsx';
import { BranaWorkspace } from '../layout/BranaWorkspace.jsx';
import { LoginPage } from '../features/auth/LoginPage.jsx';
import { AuthProvider, useAuth } from '../features/auth/AuthProvider.jsx';
import { InicioPage } from '../features/inicio/InicioPage.jsx';
import { PacientesPage } from '../features/pacientes/PacientesPage.jsx';

const contextualMenus = {
  atendimento: [
    { key: 'agenda', label: 'Agenda', hint: 'em breve', disabled: true },
    { key: 'novo-atendimento', label: 'Novo atendimento', hint: 'em breve', disabled: true },
    { key: 'timeline', label: 'Timeline do paciente', hint: 'em breve', disabled: true },
    { key: 'tratamentos-gerenciar', label: 'Gerenciar tratamentos', hint: 'em breve', disabled: true },
    { key: 'ficha-clinica', label: 'Ficha clínica', hint: 'em breve', disabled: true },
    { key: 'ficha-anamnese', label: 'Ficha de anamnese', hint: 'em breve', disabled: true },
    { key: 'documentos', label: 'Documentos', hint: 'em breve', disabled: true },
  ],
  cadastro: [
    { key: 'pacientes', label: 'Pacientes' },
    { key: 'convenios', label: 'Convênios atendidos', hint: 'em breve', disabled: true },
    { key: 'corpo-clinico', label: 'Corpo clínico', hint: 'em breve', disabled: true },
    { key: 'fornecedores', label: 'Fornecedores', hint: 'em breve', disabled: true },
    { key: 'unidades', label: 'Unidades de atendimento', hint: 'em breve', disabled: true },
  ],
  financeiro: [
    { key: 'recebimentos', label: 'Recebimentos', hint: 'em breve', disabled: true },
    { key: 'contas-pagar', label: 'Contas a pagar', hint: 'em breve', disabled: true },
    { key: 'caixa', label: 'Caixa', hint: 'em breve', disabled: true },
    { key: 'formas-pagamento', label: 'Formas de pagamento', hint: 'em breve', disabled: true },
    { key: 'relatorios-financeiros', label: 'Relatórios financeiros', hint: 'em breve', disabled: true },
  ],
  tabelas: [
    { key: 'procedimentos', label: 'Procedimentos', hint: 'em breve', disabled: true },
    { key: 'indices-financeiros', label: 'Índices financeiros', hint: 'em breve', disabled: true },
    { key: 'convenios', label: 'Convênios', hint: 'em breve', disabled: true },
    { key: 'materiais', label: 'Materiais', hint: 'em breve', disabled: true },
    { key: 'bancos', label: 'Bancos', hint: 'em breve', disabled: true },
  ],
  relatorios: [
    { key: 'relatorios-clinicos', label: 'Relatórios clínicos', hint: 'em breve', disabled: true },
    { key: 'relatorios-financeiros', label: 'Relatórios financeiros', hint: 'em breve', disabled: true },
    { key: 'relatorios-estatisticos', label: 'Relatórios estatísticos', hint: 'em breve', disabled: true },
    { key: 'documentos-relatorios', label: 'Documentos', hint: 'em breve', disabled: true },
  ],
  configuracao: [
    { key: 'usuarios', label: 'Usuários', hint: 'em breve', disabled: true },
    { key: 'permissoes', label: 'Permissões', hint: 'em breve', disabled: true },
    { key: 'preferencias', label: 'Preferências', hint: 'em breve', disabled: true },
    { key: 'parametros', label: 'Parâmetros do sistema', hint: 'em breve', disabled: true },
  ],
  ferramentas: [
    { key: 'importacoes', label: 'Importações', hint: 'em breve', disabled: true },
    { key: 'utilitarios', label: 'Utilitários', hint: 'em breve', disabled: true },
    { key: 'manutencao', label: 'Manutenção', hint: 'em breve', disabled: true },
  ],
  ajuda: [
    { key: 'suporte', label: 'Suporte', hint: 'em breve', disabled: true },
    { key: 'sobre', label: 'Sobre o Brana Cloud', hint: 'em breve', disabled: true },
  ],
  inicio: [],
};

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
  const [railExpanded, setRailExpanded] = useState(false);
  const [activeGroupKey, setActiveGroupKey] = useState(() => (resolveScreenFromPath() === 'pacientes' ? 'cadastro' : 'inicio'));
  const [panelGroupKey, setPanelGroupKey] = useState('');

  useEffect(() => {
    const onPopState = () => setScreen(resolveScreenFromPath());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const activeKey = screen;
  const panelGroup = panelGroupKey ? branaMainGroups.find((item) => item.key === panelGroupKey) : null;

  const handleNavigate = (nextScreen) => {
    if (!nextScreen) return;
    setScreen(nextScreen);
    syncAppPath(nextScreen);
    if (nextScreen === 'inicio') {
      setActiveGroupKey('inicio');
      setPanelGroupKey('inicio');
      return;
    }
    if (nextScreen === 'pacientes') {
      setActiveGroupKey('cadastro');
      setPanelGroupKey('cadastro');
    }
  };

  const handleOpenGroup = (groupKey) => {
    if (!groupKey) return;
    setActiveGroupKey(groupKey);
    setPanelGroupKey(groupKey);
    if (groupKey === 'inicio') {
      setScreen('inicio');
      syncAppPath('inicio');
    }
  };

  const handleSelectMenuItem = async (groupKey, item) => {
    if (groupKey === 'cadastro' && item?.key === 'pacientes' && !item?.disabled) {
      handleNavigate('pacientes');
      return;
    }
    message.info('Funcionalidade em breve.');
  };

  const handleToggleExpand = () => {
    setRailExpanded((current) => !current);
  };

  const activePage = useMemo(() => {
    if (screen === 'pacientes') {
      return <PacientesPage onBackHome={() => handleNavigate('inicio')} />;
    }
    return <InicioPage />;
  }, [screen]);

  const shellStyle = {
    '--brana-rail-width': railExpanded ? '184px' : '72px',
    '--brana-panel-width': panelGroup ? '272px' : '0px',
  };

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
      <div className="brana-shell" style={shellStyle}>
        <BranaIconRail
          activeKey={activeKey}
          expanded={railExpanded}
          groups={branaMainGroups}
          activeGroupKey={activeGroupKey}
          onNavigate={handleNavigate}
          onOpenGroup={handleOpenGroup}
          onToggleExpand={handleToggleExpand}
          onSignOut={signOut}
        />
        <BranaContextPanel
          group={panelGroup}
          items={contextualMenus[panelGroupKey] || []}
          onClose={() => setPanelGroupKey('')}
          onSelectItem={handleSelectMenuItem}
        />
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
