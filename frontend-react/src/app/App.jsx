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
    { key: 'agenda-semanal', label: 'Agenda semanal', hint: 'em breve', disabled: true },
    { key: 'agenda-diaria', label: 'Agenda diária', hint: 'em breve', disabled: true },
    { key: 'timeline-paciente', label: 'Timeline do paciente', hint: 'em breve', disabled: true },
    { key: 'retornos', label: 'Controle de retornos', hint: 'em breve', disabled: true },
    { key: 'gerenciar-tratamentos', label: 'Gerenciar tratamentos', hint: 'em breve', disabled: true },
    { key: 'ficha-clinica', label: 'Ficha clínica', hint: 'em breve', disabled: true },
    { key: 'ficha-anamnese', label: 'Ficha de anamnese', hint: 'em breve', disabled: true },
    { key: 'documentos', label: 'Documentos', hint: 'em breve', disabled: true },
  ],
  cadastro: [
    { key: 'pacientes', label: 'Pacientes' },
    { key: 'convenios', label: 'Convênios atendidos', hint: 'em breve', disabled: true },
    { key: 'corpo-clinico', label: 'Corpo clínico', hint: 'em breve', disabled: true },
    { key: 'fornecedores', label: 'Fornecedores', hint: 'em breve', disabled: true },
  ],
  financeiro: [
    { key: 'contas-receber', label: 'Contas a receber', hint: 'em breve', disabled: true },
    { key: 'contas-pagar', label: 'Contas a pagar', hint: 'em breve', disabled: true },
    { key: 'gerenciar-recibos', label: 'Gerenciar recibos', hint: 'em breve', disabled: true },
    { key: 'controle-estoque', label: 'Controle de estoque', hint: 'em breve', disabled: true },
    { key: 'fluxo-caixa', label: 'Fluxo de caixa', hint: 'em breve', disabled: true },
    { key: 'recebiveis-digitais', label: 'Recebíveis digitais', hint: 'em breve', disabled: true },
    { key: 'faturamento-convenio', label: 'Faturamento de convênio', hint: 'em breve', disabled: true },
    { key: 'servicos-proteticos', label: 'Serviços protéticos', hint: 'em breve', disabled: true },
  ],
  tabelas: [
    { key: 'procedimentos', label: 'Procedimentos', hint: 'em breve', disabled: true },
    { key: 'procedimentos-genericos', label: 'Procedimentos genéricos', hint: 'em breve', disabled: true },
    { key: 'materiais-estoque', label: 'Materiais de estoque', hint: 'em breve', disabled: true },
    { key: 'medicamentos', label: 'Medicamentos', hint: 'em breve', disabled: true },
    { key: 'servicos-protese', label: 'Serviços de prótese', hint: 'em breve', disabled: true },
    { key: 'doencas-cid', label: 'Doenças (CID)', hint: 'em breve', disabled: true },
  ],
  relatorios: [
    { key: 'favoritos', label: 'Favoritos', hint: 'em breve', disabled: true },
    { key: 'relatorios-pacientes', label: 'Pacientes', hint: 'em breve', disabled: true },
    { key: 'relatorios-atendimentos', label: 'Atendimentos', hint: 'em breve', disabled: true },
    { key: 'relatorios-tabelas', label: 'Tabelas', hint: 'em breve', disabled: true },
    { key: 'relatorios-financeiros', label: 'Financeiros', hint: 'em breve', disabled: true },
    { key: 'relatorios-estoque', label: 'Estoque', hint: 'em breve', disabled: true },
    { key: 'relatorios-gerenciais', label: 'Gerenciais', hint: 'em breve', disabled: true },
  ],
  configuracao: [
    { key: 'usuarios', label: 'Usuários do sistema', hint: 'em breve', disabled: true },
    { key: 'perfis-usuario', label: 'Perfis de usuário', hint: 'em breve', disabled: true },
    { key: 'tabelas-auxiliares', label: 'Tabelas auxiliares', hint: 'em breve', disabled: true },
    { key: 'plano-contas', label: 'Plano de contas', hint: 'em breve', disabled: true },
    { key: 'agendas', label: 'Agendas', hint: 'em breve', disabled: true },
    { key: 'questionarios-anamnese', label: 'Questionários de anamnese', hint: 'em breve', disabled: true },
    { key: 'unidades-atendimento', label: 'Unidades de atendimento', hint: 'em breve', disabled: true },
    { key: 'campos-livres', label: 'Campos livres', hint: 'em breve', disabled: true },
    { key: 'taxas-cobranca', label: 'Taxas de cobrança', hint: 'em breve', disabled: true },
    { key: 'contas-bancarias', label: 'Contas bancárias', hint: 'em breve', disabled: true },
  ],
  ferramentas: [
    { key: 'dashboard', label: 'Dashboard', hint: 'em breve', disabled: true },
    { key: 'editor-textos', label: 'Editor de textos', hint: 'em breve', disabled: true },
    { key: 'mala-direta', label: 'Mala direta', hint: 'em breve', disabled: true },
    { key: 'mensagens-enviadas', label: 'Mensagens enviadas', hint: 'em breve', disabled: true },
    { key: 'assinatura-eletronica', label: 'Assinatura eletrônica', hint: 'em breve', disabled: true },
    { key: 'gerenciar-avisos', label: 'Gerenciar avisos', hint: 'em breve', disabled: true },
    { key: 'orientacao-paciente', label: 'Orientação ao paciente', hint: 'em breve', disabled: true },
    { key: 'exportacao-dados', label: 'Exportação de dados', hint: 'em breve', disabled: true },
    { key: 'trilha-auditoria', label: 'Trilha de auditoria', hint: 'em breve', disabled: true },
    { key: 'crm-vendas', label: 'CRM de vendas', hint: 'em breve', disabled: true },
  ],
  ajuda: [
    { key: 'videos-tutoriais', label: 'Vídeos tutoriais', hint: 'em breve', disabled: true },
    { key: 'treinamentos-online', label: 'Treinamentos on-line', hint: 'em breve', disabled: true },
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
      setPanelGroupKey('');
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

  const handleToolbarAction = async (actionKey) => {
    if (actionKey === 'dashboard') {
      handleNavigate('inicio');
      return;
    }
    if (actionKey === 'cadastro-pacientes') {
      handleNavigate('pacientes');
      return;
    }
    message.info('Funcionalidade em breve.');
  };

  const handleUserMenuAction = async () => {
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
        <div className="brana-shell-topbar">
          <BranaActionTopbar
            user={user}
            onSignOut={signOut}
            loading={loading}
            onPlaceholderAction={handleToolbarAction}
            onUserMenuAction={handleUserMenuAction}
          />
        </div>

        <div
          className={`brana-shell-body${panelGroup ? ' has-panel' : ''}`}
          onMouseLeave={() => setPanelGroupKey('')}
        >
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
          <BranaWorkspace>{activePage}</BranaWorkspace>
        </div>
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
