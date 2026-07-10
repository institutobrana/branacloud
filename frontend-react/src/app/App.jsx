import { ConfigProvider, Input, Select, Typography, message } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import { branaTheme } from '../theme/branaTheme.js';
import { BranaIconRail, branaMainGroups } from '../layout/BranaIconRail.jsx';
import { BranaActionTopbar } from '../layout/BranaActionTopbar.jsx';
import { BranaContextPanel } from '../layout/BranaContextPanel.jsx';
import { BranaWorkspace } from '../layout/BranaWorkspace.jsx';
import { LoginPage } from '../features/auth/LoginPage.jsx';
import { AuthProvider, useAuth } from '../features/auth/AuthProvider.jsx';
import { DashboardOperationalStrip, DashboardPage } from '../features/dashboard/DashboardPage.jsx';
import { FichaClinicaPage } from '../features/fichaClinica/FichaClinicaPage.jsx';
import { ProcedimentosGenericosPage } from '../features/procedimentosGenericos/ProcedimentosGenericosPage.jsx';
import { listarProcedimentosGenericosEspecialidades } from '../features/procedimentosGenericos/procedimentosGenericosApi.js';
import { PacientesPage } from '../features/pacientes/PacientesPage.jsx';
import { TiposIndicacaoPage } from '../features/tabelasAuxiliares/TiposIndicacaoPage.jsx';
import { PreferenciasUsuarioModal } from '../features/preferencias/PreferenciasUsuarioModal.jsx';

const contextualMenus = {
  atendimento: [
    { key: 'agenda-semanal', label: 'Agenda semanal', disabled: true },
    { key: 'agenda-diaria', label: 'Agenda diária', disabled: true },
    { key: 'timeline-paciente', label: 'Timeline do paciente', disabled: true },
    { key: 'retornos', label: 'Controle de retornos', disabled: true },
    { key: 'gerenciar-tratamentos', label: 'Gerenciar tratamentos', disabled: true },
    { key: 'ficha-clinica', label: 'Ficha clínica', disabled: true },
    { key: 'ficha-anamnese', label: 'Ficha de anamnese', disabled: true },
    { key: 'documentos', label: 'Documentos', disabled: true },
  ],
  cadastro: [
    { key: 'pacientes', label: 'Pacientes' },
    { key: 'convenios', label: 'Convênios atendidos', disabled: true },
    { key: 'corpo-clinico', label: 'Corpo clínico', disabled: true },
    { key: 'fornecedores', label: 'Fornecedores', disabled: true },
  ],
  financeiro: [
    { key: 'contas-receber', label: 'Contas a receber', disabled: true },
    { key: 'contas-pagar', label: 'Contas a pagar', disabled: true },
    { key: 'gerenciar-recibos', label: 'Gerenciar recibos', disabled: true },
    { key: 'controle-estoque', label: 'Controle de estoque', disabled: true },
    { key: 'fluxo-caixa', label: 'Fluxo de caixa', disabled: true },
    { key: 'recebiveis-digitais', label: 'Recebíveis digitais', disabled: true },
    { key: 'faturamento-convenio', label: 'Faturamento de convênio', disabled: true },
    { key: 'servicos-proteticos', label: 'Serviços protéticos', disabled: true },
  ],
  tabelas: [
    { key: 'procedimentos', label: 'Procedimentos', disabled: true },
    { key: 'procedimentos-genericos', label: 'Procedimentos genéricos' },
    { key: 'materiais-estoque', label: 'Materiais de estoque', disabled: true },
    { key: 'medicamentos', label: 'Medicamentos', disabled: true },
    { key: 'servicos-protese', label: 'Serviços de prótese', disabled: true },
    { key: 'doencas-cid', label: 'Doenças (CID)', disabled: true },
  ],
  relatorios: [
    { key: 'favoritos', label: 'Favoritos', disabled: true },
    { key: 'relatorios-pacientes', label: 'Pacientes', disabled: true },
    { key: 'relatorios-atendimentos', label: 'Atendimentos', disabled: true },
    { key: 'relatorios-tabelas', label: 'Tabelas', disabled: true },
    { key: 'relatorios-financeiros', label: 'Financeiros', disabled: true },
    { key: 'relatorios-estoque', label: 'Estoque', disabled: true },
    { key: 'relatorios-gerenciais', label: 'Gerenciais', disabled: true },
  ],
  configuracao: [
    { key: 'usuarios', label: 'Usuários do sistema', disabled: true },
    { key: 'perfis-usuario', label: 'Perfis de usuário', disabled: true },
    { key: 'tabelas-auxiliares', label: 'Tabelas auxiliares' },
    { key: 'plano-contas', label: 'Plano de contas', disabled: true },
    { key: 'agendas', label: 'Agendas', disabled: true },
    { key: 'questionarios-anamnese', label: 'Questionários de anamnese', disabled: true },
    { key: 'unidades-atendimento', label: 'Unidades de atendimento', disabled: true },
    { key: 'campos-livres', label: 'Campos livres', disabled: true },
    { key: 'taxas-cobranca', label: 'Taxas de cobrança', disabled: true },
    { key: 'contas-bancarias', label: 'Contas bancárias', disabled: true },
  ],
  ferramentas: [
    { key: 'dashboard', label: 'Dashboard', disabled: true },
    { key: 'editor-textos', label: 'Editor de textos', disabled: true },
    { key: 'mala-direta', label: 'Mala direta', disabled: true },
    { key: 'mensagens-enviadas', label: 'Mensagens enviadas', disabled: true },
    { key: 'assinatura-eletronica', label: 'Assinatura eletrônica', disabled: true },
    { key: 'gerenciar-avisos', label: 'Gerenciar avisos', disabled: true },
    { key: 'orientacao-paciente', label: 'Orientação ao paciente', disabled: true },
    { key: 'exportacao-dados', label: 'Exportação de dados', disabled: true },
    { key: 'trilha-auditoria', label: 'Trilha de auditoria', disabled: true },
    { key: 'crm-vendas', label: 'CRM de vendas', disabled: true },
  ],
  ajuda: [
    { key: 'videos-tutoriais', label: 'Vídeos tutoriais', disabled: true },
    { key: 'treinamentos-online', label: 'Treinamentos on-line', disabled: true },
  ],
  inicio: [],
};

function isLoginRoute() {
  return (window.location.pathname || '/') === '/login';
}

function isAppRoute() {
  const path = window.location.pathname || '/';
  return path === '/' || path === '/app' || path === '/app/inicio' || path === '/app/pacientes' || path === '/app/ficha-clinica' || path === '/app/tabelas-auxiliares' || path === '/app/tabelas/procedimentos-genericos' || path === '';
}

function resolveScreenFromPath() {
  const path = window.location.pathname || '/';
  if (path === '/app/pacientes') return 'pacientes';
  if (path === '/app/ficha-clinica') return 'ficha-clinica';
  if (path === '/app/tabelas-auxiliares') return 'tabelas-auxiliares';
  if (path === '/app/tabelas/procedimentos-genericos') return 'procedimentos-genericos';
  return 'dashboard';
}

function syncAppPath(screen) {
  const nextPath =
    screen === 'pacientes'
      ? '/app/pacientes'
      : screen === 'ficha-clinica'
        ? '/app/ficha-clinica'
        : screen === 'tabelas-auxiliares'
          ? '/app/tabelas-auxiliares'
          : screen === 'procedimentos-genericos'
            ? '/app/tabelas/procedimentos-genericos'
            : '/app';
  if ((window.location.pathname || '/') === nextPath) return;
  window.history.pushState({ screen }, '', nextPath);
}

function AppContent() {
  const { user, isAuthenticated, loading, signOut } = useAuth();
  const initialScreen = resolveScreenFromPath();
  const [screen, setScreen] = useState(initialScreen);
  const [dashboardVersion, setDashboardVersion] = useState(0);
  const [railExpanded, setRailExpanded] = useState(false);
  const [procedimentosGenericosSearch, setProcedimentosGenericosSearch] = useState('');
  const [procedimentosGenericosEspecialidade, setProcedimentosGenericosEspecialidade] = useState('');
  const [procedimentosGenericosEspecialidades, setProcedimentosGenericosEspecialidades] = useState([]);
  const [procedimentosGenericosEspecialidadesLoading, setProcedimentosGenericosEspecialidadesLoading] = useState(false);
  const [procedimentosGenericosNovoToken, setProcedimentosGenericosNovoToken] = useState(0);
  const [activeGroupKey, setActiveGroupKey] = useState(() => {
    if (initialScreen === 'pacientes') return 'cadastro';
    if (initialScreen === 'procedimentos-genericos') return 'tabelas';
    return 'atendimento';
  });
  const [panelGroupKey, setPanelGroupKey] = useState('');
  const [preferenciasOpen, setPreferenciasOpen] = useState(false);
  const panelCloseTimerRef = useRef(null);

  useEffect(() => {
    const onPopState = () => setScreen(resolveScreenFromPath());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    const onEspecialidades = (event) => {
      const next = Array.isArray(event?.detail?.especialidades) ? event.detail.especialidades : [];
      if (next.length > 0) {
        setProcedimentosGenericosEspecialidades(next);
      }
    };
    window.addEventListener('brana-procedimentos-genericos-especialidades', onEspecialidades);
    return () => window.removeEventListener('brana-procedimentos-genericos-especialidades', onEspecialidades);
  }, []);

  useEffect(() => {
    if (screen !== 'procedimentos-genericos') return;
    let cancelled = false;

    const loadEspecialidades = async () => {
      setProcedimentosGenericosEspecialidadesLoading(true);
      try {
        const lista = await listarProcedimentosGenericosEspecialidades();
        if (cancelled) return;
        setProcedimentosGenericosEspecialidades(Array.isArray(lista) ? lista : []);
      } catch {
        if (cancelled) return;
        setProcedimentosGenericosEspecialidades([]);
      } finally {
        if (!cancelled) setProcedimentosGenericosEspecialidadesLoading(false);
      }
    };

    void loadEspecialidades();

    return () => {
      cancelled = true;
    };
  }, [screen]);

  useEffect(() => {
    if (screen !== 'pacientes' && screen !== 'dashboard' && screen !== 'ficha-clinica' && screen !== 'tabelas-auxiliares' && screen !== 'procedimentos-genericos') {
      setScreen('dashboard');
    }
  }, [screen]);

  const activeKey = screen;
  const panelGroup = panelGroupKey ? branaMainGroups.find((item) => item.key === panelGroupKey) : null;

  const handleNavigate = (nextScreen) => {
    if (!nextScreen) return;
    setScreen(nextScreen);
    syncAppPath(nextScreen);
    if (nextScreen === 'dashboard') {
      setActiveGroupKey('atendimento');
      setPanelGroupKey('');
      setDashboardVersion((current) => current + 1);
      window.scrollTo?.(0, 0);
      return;
    }
    if (nextScreen === 'pacientes') {
      setActiveGroupKey('cadastro');
      setPanelGroupKey('cadastro');
      return;
    }
    if (nextScreen === 'procedimentos-genericos') {
      setActiveGroupKey('tabelas');
      setPanelGroupKey('');
      return;
    }
    if (nextScreen === 'ficha-clinica') {
      setActiveGroupKey('atendimento');
    }
  };

  const handleOpenGroup = (groupKey) => {
    if (!groupKey) return;
    if (panelCloseTimerRef.current) {
      window.clearTimeout(panelCloseTimerRef.current);
      panelCloseTimerRef.current = null;
    }
    setActiveGroupKey(groupKey);
    setPanelGroupKey(groupKey);
  };

  const handleContextRegionEnter = () => {
    if (panelCloseTimerRef.current) {
      window.clearTimeout(panelCloseTimerRef.current);
      panelCloseTimerRef.current = null;
    }
  };

  const handleContextRegionLeave = () => {
    if (panelCloseTimerRef.current) {
      window.clearTimeout(panelCloseTimerRef.current);
    }
    panelCloseTimerRef.current = window.setTimeout(() => {
      setPanelGroupKey('');
      panelCloseTimerRef.current = null;
    }, 140);
  };

  const handleSelectMenuItem = async (groupKey, item) => {
    if (groupKey === 'cadastro' && item?.key === 'pacientes' && !item?.disabled) {
      handleNavigate('pacientes');
      return;
    }
    if (groupKey === 'configuracao' && item?.key === 'tabelas-auxiliares' && !item?.disabled) {
      handleNavigate('tabelas-auxiliares');
      return;
    }
    if (groupKey === 'tabelas' && item?.key === 'procedimentos-genericos' && !item?.disabled) {
      handleNavigate('procedimentos-genericos');
      return;
    }
    if (groupKey === 'atendimento' && item?.key === 'ficha-clinica' && !item?.disabled) {
      handleNavigate('ficha-clinica');
      return;
    }
    message.info('Funcionalidade em breve.');
  };

  const handleToolbarAction = async (actionKey) => {
    if (actionKey === 'dashboard') {
      handleNavigate('dashboard');
      return;
    }
    if (actionKey === 'cadastro-pacientes') {
      handleNavigate('pacientes');
      return;
    }
    if (actionKey === 'paciente') {
      handleNavigate('pacientes');
      return;
    }
    if (actionKey === 'ficha-clinica') {
      handleNavigate('ficha-clinica');
      return;
    }
    if (actionKey === 'tabelas-auxiliares') {
      handleNavigate('tabelas-auxiliares');
      return;
    }
    if (actionKey === 'procedimentos-genericos') {
      setProcedimentosGenericosNovoToken((current) => current + 1);
      handleNavigate('procedimentos-genericos');
      return;
    }
    message.info('Funcionalidade em breve.');
  };

  const handleUserMenuAction = async (key) => {
    if (key === 'preferencias') {
      setPreferenciasOpen(true);
      return;
    }
    message.info('Funcionalidade em breve.');
  };

  const handleToggleExpand = () => {
    setRailExpanded((current) => !current);
  };

  const activePage = useMemo(() => {
    if (screen === 'pacientes') {
      return <PacientesPage onBackHome={() => handleNavigate('dashboard')} />;
    }
    if (screen === 'ficha-clinica') {
      return <FichaClinicaPage onBackHome={() => handleNavigate('dashboard')} />;
    }
    if (screen === 'tabelas-auxiliares') {
      return <TiposIndicacaoPage />;
    }
    if (screen === 'procedimentos-genericos') {
      return (
        <ProcedimentosGenericosPage
          q={procedimentosGenericosSearch}
          especialidade={procedimentosGenericosEspecialidade}
          novoProcedimentoToken={procedimentosGenericosNovoToken}
          onResetFilters={() => {
            setProcedimentosGenericosSearch('');
            setProcedimentosGenericosEspecialidade('');
          }}
        />
      );
    }
    return <DashboardPage key={dashboardVersion} />;
  }, [dashboardVersion, procedimentosGenericosEspecialidade, procedimentosGenericosNovoToken, procedimentosGenericosSearch, screen]);

  const auxiliaryTopBar = useMemo(() => {
    if (screen !== 'tabelas-auxiliares') return null;

    return (
      <div className="brana-shell-band auxiliary-shell-band" aria-label="Barra operacional de tabelas auxiliares">
        <div className="auxiliary-action-toolbar" role="toolbar" aria-label="Ações do módulo tabelas auxiliares">
          <button type="button" className="auxiliary-shell-button primary" onClick={() => window.dispatchEvent(new CustomEvent('brana-auxiliar-toolbar-action', { detail: { action: 'novo' } }))}>
            Novo
          </button>
          <button type="button" className="auxiliary-shell-button" onClick={() => window.dispatchEvent(new CustomEvent('brana-auxiliar-toolbar-action', { detail: { action: 'alterar' } }))}>
            Alterar
          </button>
          <button type="button" className="auxiliary-shell-button danger" onClick={() => window.dispatchEvent(new CustomEvent('brana-auxiliar-toolbar-action', { detail: { action: 'excluir' } }))}>
            Excluir
          </button>
        </div>
      </div>
    );
  }, [screen]);

  const procedimentosGenericosTopBar = useMemo(() => {
    if (screen !== 'procedimentos-genericos') return null;
    const especialidadeOptions = procedimentosGenericosEspecialidades.map((item) => {
      if (typeof item === 'string') {
        return { label: item, value: item };
      }

      const codigo = String(item?.codigo || '').trim();
      const nome = String(item?.nome || '').trim();
      return {
        label: nome || codigo,
        value: codigo,
      };
    }).filter((item) => item.value);
    especialidadeOptions.unshift({ label: '<<Todas>>', value: '' });

    return (
      <div className="brana-shell-band auxiliary-shell-band" aria-label="Barra operacional de procedimentos genéricos">
        <div className="procedimentos-genericos-toolbar-row" role="toolbar" aria-label="Ações do módulo procedimentos genéricos">
          <div className="auxiliary-action-toolbar procedimentos-genericos-toolbar-actions">
            <button type="button" className="auxiliary-shell-button primary" onClick={() => setProcedimentosGenericosNovoToken((current) => current + 1)}>
              Novo procedimento
            </button>
            <button type="button" className="auxiliary-shell-button" onClick={() => message.info('Alteração pendente nesta etapa.')}>
              Altera...
            </button>
            <button type="button" className="auxiliary-shell-button danger" onClick={() => message.info('Exclusão pendente nesta etapa.')}>
              Elimina...
            </button>
            <button type="button" className="auxiliary-shell-button" onClick={() => message.info('Abertura de fases ficará na próxima etapa.')}>
              Fases
            </button>
            <button type="button" className="auxiliary-shell-button" onClick={() => message.info('Abertura de materiais ficará na próxima etapa.')}>
              Materiais
            </button>
          </div>

          <div className="procedimentos-genericos-toolbar-filters">
            <label className="procedimentos-genericos-field is-inline">
              <span>Especialidades</span>
              <Select
                value={procedimentosGenericosEspecialidade || undefined}
                placeholder="<<Todas>>"
                loading={procedimentosGenericosEspecialidadesLoading}
                options={especialidadeOptions}
                onChange={(value) => setProcedimentosGenericosEspecialidade(value || '')}
                allowClear
              />
            </label>
            <label className="procedimentos-genericos-field is-inline">
              <span>Procedimentos</span>
              <Input
                value={procedimentosGenericosSearch}
                onChange={(event) => setProcedimentosGenericosSearch(event.target.value)}
                placeholder="Buscar por código ou descrição"
              />
            </label>
          </div>
        </div>
      </div>
    );
  }, [procedimentosGenericosEspecialidade, procedimentosGenericosEspecialidades, procedimentosGenericosEspecialidadesLoading, procedimentosGenericosSearch, screen]);

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
        >
          {screen === 'dashboard' ? (
            <div className="brana-shell-corner" aria-hidden="true" />
          ) : screen === 'tabelas-auxiliares' ? (
            <div className="brana-shell-corner auxiliary-shell-corner" aria-hidden="true" />
          ) : null}
          {screen === 'dashboard' ? (
            <div className="brana-shell-band">
              <DashboardOperationalStrip />
            </div>
          ) : screen === 'tabelas-auxiliares' ? (
            auxiliaryTopBar
          ) : screen === 'procedimentos-genericos' ? (
            procedimentosGenericosTopBar
          ) : null}
          <BranaIconRail
            activeKey={activeKey}
            expanded={railExpanded}
            groups={branaMainGroups}
            activeGroupKey={activeGroupKey}
            panelOpen={Boolean(panelGroup)}
            onNavigate={handleNavigate}
            onOpenGroup={handleOpenGroup}
            onToggleExpand={handleToggleExpand}
            onMouseEnter={handleContextRegionEnter}
            onMouseLeave={handleContextRegionLeave}
          />
          <BranaContextPanel
            group={panelGroup}
            items={contextualMenus[panelGroupKey] || []}
            onClose={() => setPanelGroupKey('')}
            onSelectItem={handleSelectMenuItem}
            onMouseEnter={handleContextRegionEnter}
            onMouseLeave={handleContextRegionLeave}
          />
          <BranaWorkspace>{activePage}</BranaWorkspace>
        </div>
        <PreferenciasUsuarioModal
          open={preferenciasOpen}
          userName={user?.apelido || user?.nome || user?.email || 'Tel'}
          onClose={() => setPreferenciasOpen(false)}
        />
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
