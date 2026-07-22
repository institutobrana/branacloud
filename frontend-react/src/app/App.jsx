import { ConfigProvider, Input, Select, Typography, message } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import { BranaThemeModeProvider, useBranaThemeMode } from '../theme/branaThemeMode.jsx';
import { getBranaTheme } from '../theme/branaTheme.js';
import { BranaIconRail, branaMainGroups } from '../layout/BranaIconRail.jsx';
import { BranaActionTopbar } from '../layout/BranaActionTopbar.jsx';
import { BranaContextPanel } from '../layout/BranaContextPanel.jsx';
import { BranaWorkspace } from '../layout/BranaWorkspace.jsx';
import { LoginPage } from '../features/auth/LoginPage.jsx';
import { AuthProvider, useAuth } from '../features/auth/AuthProvider.jsx';
import { FirstAccessPage } from '../features/firstAccess/FirstAccessPage.jsx';
import { canAccessPlatformAdmin } from '../features/admin/adminAccess.js';
import { AdminRoutes } from '../features/admin/AdminRoutes.jsx';
import { adminPath } from '../features/admin/adminRoutes.js';
import { appPath, getAppBasePath, isUnderAppBase, loginPath } from './basePath.js';
import { DashboardOperationalStrip, DashboardPage } from '../features/dashboard/DashboardPage.jsx';
import { FichaClinicaPage } from '../features/fichaClinica/FichaClinicaPage.jsx';
import { ProcedimentosGenericosPage } from '../features/procedimentosGenericos/ProcedimentosGenericosPage.jsx';
import { listarProcedimentosGenericosEspecialidades } from '../features/procedimentosGenericos/procedimentosGenericosApi.js';
import { ProcedimentosPage } from '../features/procedimentos/ProcedimentosPage.jsx';
import { DoencasCidPage } from '../features/doencasCid/DoencasCidPage.jsx';
import { DoencaCidToolbar } from '../features/doencasCid/components/DoencaCidToolbar.jsx';
import { PacientesPage } from '../features/pacientes/PacientesPage.jsx';
import { TiposIndicacaoPage } from '../features/tabelasAuxiliares/TiposIndicacaoPage.jsx';
import { MateriaisEstoquePage } from '../features/materiaisEstoque/MateriaisEstoquePage.jsx';
import { ServicosProteticoPage } from '../features/servicosProtetico/ServicosProteticoPage.jsx';
import { ServicosProteticoToolbar } from '../features/servicosProtetico/components/ServicosProteticoToolbar.jsx';
import { PreferenciasUsuarioModal } from '../features/preferencias/PreferenciasUsuarioModal.jsx';
import { CenarioAnualPage } from '../features/cenarioAnual/CenarioAnualPage.jsx';
import { PlanoContasPage } from '../features/planoContas/PlanoContasPage.jsx';
import { PlanoContasToolbar } from '../features/planoContas/components/PlanoContasToolbar.jsx';
import { MedicamentosPage } from '../features/medicamentos/MedicamentosPage.jsx';
import { MedicamentosToolbar } from '../features/medicamentos/MedicamentosToolbar.jsx';
import { UnidadesAtendimentoPage } from '../features/unidadesAtendimento/UnidadesAtendimentoPage.jsx';
import { PrestadoresPage } from '../features/prestadores/PrestadoresPage.jsx';

const contextualMenus = {
  atendimento: [
    { key: 'agenda-diaria', label: 'Agenda diária', disabled: true },
    { key: 'agenda-semanal', label: 'Agenda semanal', disabled: true },
    { key: 'retornos', label: 'Controle de retornos', disabled: true },
    { key: 'documentos', label: 'Documentos', disabled: true },
    { key: 'ficha-clinica', label: 'Ficha clínica', disabled: true },
    { key: 'ficha-anamnese', label: 'Ficha de anamnese', disabled: true },
    { key: 'gerenciar-tratamentos', label: 'Gerenciar tratamentos', disabled: true },
    { key: 'timeline-paciente', label: 'Timeline do paciente', disabled: true },
  ],
  cadastro: [
    { key: 'convenios', label: 'Convênios atendidos', disabled: true },
    { key: 'corpo-clinico', label: 'Corpo clínico' },
    { key: 'fornecedores', label: 'Fornecedores', disabled: true },
    { key: 'pacientes', label: 'Pacientes' },
  ],
  financeiro: [
    { key: 'contas-pagar', label: 'Contas a pagar', disabled: true },
    { key: 'contas-receber', label: 'Contas a receber', disabled: true },
    { key: 'controle-estoque', label: 'Controle de estoque', disabled: true },
    { key: 'faturamento-convenio', label: 'Faturamento de convênio', disabled: true },
    { key: 'fluxo-caixa', label: 'Fluxo de caixa', disabled: true },
    { key: 'gerenciar-recibos', label: 'Gerenciar recibos', disabled: true },
    { key: 'recebiveis-digitais', label: 'Recebíveis digitais', disabled: true },
    { key: 'servicos-protetico', label: 'Serviços de protético' },
  ],
  tabelas: [
    { key: 'doencas-cid', label: 'Doenças (CID)' },
    { key: 'materiais-estoque', label: 'Materiais' },
    { key: 'medicamentos', label: 'Medicamentos' },
    { key: 'procedimentos', label: 'Procedimentos' },
    { key: 'procedimentos-genericos', label: 'Procedimentos genéricos' },
    { key: 'servicos-protetico', label: 'Serviços de protético' },
  ],
  relatorios: [
    { key: 'relatorios-atendimentos', label: 'Atendimentos', disabled: true },
    { key: 'relatorios-estoque', label: 'Estoque', disabled: true },
    { key: 'favoritos', label: 'Favoritos', disabled: true },
    { key: 'relatorios-financeiros', label: 'Financeiros', disabled: true },
    { key: 'relatorios-gerenciais', label: 'Gerenciais', disabled: true },
    { key: 'relatorios-pacientes', label: 'Pacientes', disabled: true },
    { key: 'relatorios-tabelas', label: 'Tabelas', disabled: true },
  ],
  configuracao: [
    { key: 'agendas', label: 'Agendas', disabled: true },
    { key: 'campos-livres', label: 'Campos livres', disabled: true },
    { key: 'cenario-anual', label: 'Cenário anual' },
    { key: 'contas-bancarias', label: 'Contas bancárias', disabled: true },
    { key: 'perfis-usuario', label: 'Perfis de usuário', disabled: true },
    { key: 'plano-contas', label: 'Plano de contas' },
    { key: 'questionarios-anamnese', label: 'Questionários de anamnese', disabled: true },
    { key: 'tabelas-auxiliares', label: 'Tabelas auxiliares' },
    { key: 'taxas-cobranca', label: 'Taxas de cobrança', disabled: true },
    { key: 'unidades-atendimento', label: 'Unidades de atendimento' },
    { key: 'usuarios', label: 'Usuários do sistema', disabled: true },
  ],
  ferramentas: [
    { key: 'assinatura-eletronica', label: 'Assinatura eletrônica', disabled: true },
    { key: 'crm-vendas', label: 'CRM de vendas', disabled: true },
    { key: 'dashboard', label: 'Dashboard', disabled: true },
    { key: 'editor-textos', label: 'Editor de textos', disabled: true },
    { key: 'exportacao-dados', label: 'Exportação de dados', disabled: true },
    { key: 'gerenciar-avisos', label: 'Gerenciar avisos', disabled: true },
    { key: 'mala-direta', label: 'Mala direta', disabled: true },
    { key: 'mensagens-enviadas', label: 'Mensagens enviadas', disabled: true },
    { key: 'orientacao-paciente', label: 'Orientação ao paciente', disabled: true },
    { key: 'trilha-auditoria', label: 'Trilha de auditoria', disabled: true },
  ],
  ajuda: [
    { key: 'treinamentos-online', label: 'Treinamentos on-line', disabled: true },
    { key: 'videos-tutoriais', label: 'Vídeos tutoriais', disabled: true },
  ],
  inicio: [],
};

function isLoginRoute() {
  const path = window.location.pathname || '/';
  return path === `${getAppBasePath()}/login`;
}

function isFirstAccessRoute() {
  const path = window.location.pathname || '/';
  return path === `${getAppBasePath()}/primeiro-acesso`;
}

function isAppRoute() {
  const path = window.location.pathname || '/';
  return isUnderAppBase(path) || path === '/' || path === '';
}

function resolveScreenFromPath() {
  const path = window.location.pathname || '/';
  const base = getAppBasePath();
  if (path === `${base}/adm`) return 'adm';
  if (path === `${base}/adm/clinicas`) return 'adm-clinicas';
  if (path === `${base}/adm/usuarios`) return 'adm-usuarios';
  if (path === `${base}/adm/cobrancas`) return 'adm-cobrancas';
  if (path === `${base}/adm/auditoria`) return 'adm-auditoria';
  if (path === `${base}/pacientes`) return 'pacientes';
  if (path === `${base}/ficha-clinica`) return 'ficha-clinica';
  if (path === `${base}/cenario-anual`) return 'cenario-anual';
  if (path === `${base}/configuracoes/plano-de-contas`) return 'plano-contas';
  if (path === `${base}/configuracoes/unidades-atendimento`) return 'unidades-atendimento';
  if (path === `${base}/cadastro/corpo-clinico`) return 'prestadores';
  if (path === `${base}/tabelas-auxiliares`) return 'tabelas-auxiliares';
  if (path === `${base}/tabelas/procedimentos`) return 'procedimentos';
  if (path === `${base}/tabelas/procedimentos-genericos`) return 'procedimentos-genericos';
  if (path === `${base}/tabelas/materiais-estoque`) return 'materiais-estoque';
  if (path === `${base}/tabelas/doencas-cid`) return 'doencas-cid';
  if (path === `${base}/tabelas/medicamentos`) return 'medicamentos';
  if (path === `${base}/tabelas/servicos-protetico`) return 'servicos-protetico';
  return 'dashboard';
}

function syncAppPath(screen) {
  const nextPath =
      screen === 'adm'
      ? adminPath()
      : screen === 'adm-clinicas'
        ? `${adminPath()}/clinicas`
      : screen === 'adm-usuarios'
        ? `${adminPath()}/usuarios`
      : screen === 'adm-cobrancas'
        ? `${adminPath()}/cobrancas`
      : screen === 'adm-auditoria'
        ? `${adminPath()}/auditoria`
      : screen === 'pacientes'
        ? appPath('pacientes')
      : screen === 'ficha-clinica'
        ? appPath('ficha-clinica')
      : screen === 'cenario-anual'
          ? appPath('cenario-anual')
          : screen === 'plano-contas'
            ? appPath('configuracoes/plano-de-contas')
          : screen === 'unidades-atendimento'
            ? appPath('configuracoes/unidades-atendimento')
          : screen === 'prestadores'
            ? appPath('cadastro/corpo-clinico')
        : screen === 'tabelas-auxiliares'
          ? appPath('tabelas-auxiliares')
          : screen === 'procedimentos'
            ? appPath('tabelas/procedimentos')
          : screen === 'procedimentos-genericos'
            ? appPath('tabelas/procedimentos-genericos')
            : screen === 'materiais-estoque'
              ? appPath('tabelas/materiais-estoque')
            : screen === 'doencas-cid'
              ? appPath('tabelas/doencas-cid')
            : screen === 'medicamentos'
              ? appPath('tabelas/medicamentos')
            : screen === 'servicos-protetico'
              ? appPath('tabelas/servicos-protetico')
            : appPath();
  if ((window.location.pathname || '/') === nextPath) return;
  window.history.pushState({ screen }, '', nextPath);
}

function AppContent() {
  const { user, isAuthenticated, loading, signOut } = useAuth();
  const initialScreen = resolveScreenFromPath();
  const [screen, setScreen] = useState(initialScreen);
  const [adminNavigationState, setAdminNavigationState] = useState(null);
  const [dashboardVersion, setDashboardVersion] = useState(0);
  const [railExpanded, setRailExpanded] = useState(false);
  const [procedimentosGenericosSearch, setProcedimentosGenericosSearch] = useState('');
  const [procedimentosGenericosEspecialidade, setProcedimentosGenericosEspecialidade] = useState('');
  const [procedimentosGenericosEspecialidades, setProcedimentosGenericosEspecialidades] = useState([]);
  const [procedimentosGenericosEspecialidadesLoading, setProcedimentosGenericosEspecialidadesLoading] = useState(false);
  const [procedimentosGenericosNovoToken, setProcedimentosGenericosNovoToken] = useState(0);
  const [cenarioAnualOpenRequestId, setCenarioAnualOpenRequestId] = useState(0);
  const [procedimentosToolbarState, setProcedimentosToolbarState] = useState({
    tabelas: [],
    especialidades: [],
    selectedTabelaId: null,
    selectedEspecialidade: '',
    search: '',
    loadingListas: false,
    selectedItemId: null,
  });
  const [materiaisEstoqueToolbarState, setMateriaisEstoqueToolbarState] = useState({
    listas: [],
    classificacoes: [],
    selectedListaId: null,
    q: '',
    classificacao: '__todos__',
    loadingListas: false,
  });
  const [servicosProteticoToolbarState, setServicosProteticoToolbarState] = useState({
    proteticos: [],
    selectedProteticoId: null,
    loading: false,
  });
  const [doencasCidToolbarState, setDoencasCidToolbarState] = useState({
    selectedId: null,
    loading: false,
    deleting: false,
    globalSearch: '',
  });
  const [medicamentosToolbarState, setMedicamentosToolbarState] = useState({
    groups: [],
    group: '',
    name: '',
    loadingGroups: false,
  });
  const [planoContasToolbarState, setPlanoContasToolbarState] = useState({
    selectedGroupId: null,
    selectedCategoryId: null,
    context: 'none',
    canEditGroup: false,
    canCreateCategory: false,
    canEditCategory: false,
    canDelete: false,
    canDeleteGroup: false,
    selectedGroupIsSystemProtected: false,
    loading: false,
    saving: false,
    deleting: false,
    migrating: false,
    migrationModalOpen: false,
  });
  const [adminToolbar, setAdminToolbar] = useState(null);
  const [unidadesAtendimentoToolbarState, setUnidadesAtendimentoToolbarState] = useState({
    selectedItemId: null,
    loading: false,
    deleting: false,
    deleteDisabledReason: '',
    hasSelection: false,
  });
  const [activeGroupKey, setActiveGroupKey] = useState(() => {
    if (initialScreen === 'adm' || initialScreen === 'adm-clinicas' || initialScreen === 'adm-usuarios' || initialScreen === 'adm-cobrancas' || initialScreen === 'adm-auditoria') return 'adm';
    if (initialScreen === 'pacientes') return 'cadastro';
    if (initialScreen === 'procedimentos') return 'tabelas';
    if (initialScreen === 'procedimentos-genericos') return 'tabelas';
    if (initialScreen === 'materiais-estoque') return 'tabelas';
    if (initialScreen === 'doencas-cid') return 'tabelas';
    if (initialScreen === 'medicamentos') return 'tabelas';
    if (initialScreen === 'servicos-protetico') return 'tabelas';
    if (initialScreen === 'prestadores') return 'cadastro';
    if (initialScreen === 'cenario-anual') return 'configuracao';
    if (initialScreen === 'plano-contas') return 'configuracao';
    if (initialScreen === 'unidades-atendimento') return 'configuracao';
    return 'atendimento';
  });
  const [panelGroupKey, setPanelGroupKey] = useState(() => '');
  const [preferenciasOpen, setPreferenciasOpen] = useState(false);
  const panelCloseTimerRef = useRef(null);
  const mainGroups = useMemo(() => {
    const baseGroups = branaMainGroups.filter((group) => group.key !== 'adm');
    if (!canAccessPlatformAdmin(user)) {
      return baseGroups;
    }
    return branaMainGroups;
  }, [user]);
  const adminContextItems = useMemo(() => ([
    { key: 'adm', label: 'Visão geral' },
    { key: 'adm-clinicas', label: 'Clínicas' },
    { key: 'adm-usuarios', label: 'Usuários' },
    { key: 'adm-cobrancas', label: 'Cobranças' },
    { key: 'adm-auditoria', label: 'Auditoria' },
  ]), []);
  const adminTopBar = useMemo(() => {
    if (screen !== 'adm' && screen !== 'adm-clinicas' && screen !== 'adm-usuarios' && screen !== 'adm-cobrancas' && screen !== 'adm-auditoria') return null;

    return (
      <div className="brana-shell-band auxiliary-shell-band admin-shell-band" aria-label="Barra operacional do Painel ADM">
        {adminToolbar}
      </div>
    );
  }, [adminToolbar, screen]);

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
    const onProcedimentosState = (event) => {
      const detail = event?.detail || {};
      setProcedimentosToolbarState((current) => ({
        ...current,
        ...detail,
      }));
    };

    window.addEventListener('brana-procedimentos-state', onProcedimentosState);
    return () => window.removeEventListener('brana-procedimentos-state', onProcedimentosState);
  }, []);

  useEffect(() => {
    const onMateriaisState = (event) => {
      const detail = event?.detail || {};
      setMateriaisEstoqueToolbarState((current) => ({
        ...current,
        ...detail,
      }));
    };

    window.addEventListener('brana-materiais-estoque-state', onMateriaisState);
    return () => window.removeEventListener('brana-materiais-estoque-state', onMateriaisState);
  }, []);

  useEffect(() => {
    const onServicosProteticoState = (event) => {
      const detail = event?.detail || {};
      setServicosProteticoToolbarState((current) => ({
        ...current,
        ...detail,
      }));
    };

    window.addEventListener('brana-servicos-protetico-state', onServicosProteticoState);
    return () => window.removeEventListener('brana-servicos-protetico-state', onServicosProteticoState);
  }, []);

  useEffect(() => {
    const onDoencasCidState = (event) => {
      const detail = event?.detail || {};
      setDoencasCidToolbarState((current) => ({
        ...current,
        ...detail,
      }));
    };

    window.addEventListener('brana-doencas-cid-state', onDoencasCidState);
    return () => window.removeEventListener('brana-doencas-cid-state', onDoencasCidState);
  }, []);

  useEffect(() => {
    const onPlanoContasState = (event) => {
      const detail = event?.detail || {};
      setPlanoContasToolbarState((current) => ({
        ...current,
        ...detail,
      }));
    };

    window.addEventListener('brana-plano-contas-toolbar-state', onPlanoContasState);
    return () => window.removeEventListener('brana-plano-contas-toolbar-state', onPlanoContasState);
  }, []);

  useEffect(() => {
    const onUnidadesAtendimentoState = (event) => {
      const detail = event?.detail || {};
      setUnidadesAtendimentoToolbarState((current) => ({
        ...current,
        ...detail,
      }));
    };

    window.addEventListener('brana-unidades-atendimento-state', onUnidadesAtendimentoState);
    return () => window.removeEventListener('brana-unidades-atendimento-state', onUnidadesAtendimentoState);
  }, []);

  useEffect(() => {
    const onMedicamentosState = (event) => {
      const detail = event?.detail || {};
      setMedicamentosToolbarState((current) => ({
        ...current,
        ...detail,
      }));
    };

    window.addEventListener('brana-medicamentos-state', onMedicamentosState);
    return () => window.removeEventListener('brana-medicamentos-state', onMedicamentosState);
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
    if (screen !== 'adm' && screen !== 'adm-clinicas' && screen !== 'adm-usuarios' && screen !== 'adm-cobrancas' && screen !== 'adm-auditoria' && screen !== 'pacientes' && screen !== 'dashboard' && screen !== 'ficha-clinica' && screen !== 'tabelas-auxiliares' && screen !== 'procedimentos' && screen !== 'procedimentos-genericos' && screen !== 'materiais-estoque' && screen !== 'doencas-cid' && screen !== 'medicamentos' && screen !== 'servicos-protetico' && screen !== 'cenario-anual' && screen !== 'plano-contas' && screen !== 'unidades-atendimento' && screen !== 'prestadores') {
      setScreen('dashboard');
    }
  }, [screen]);

  const activeKey = screen;
  const panelGroup = panelGroupKey === 'adm'
    ? { key: 'adm', label: 'ADM' }
    : panelGroupKey
      ? branaMainGroups.find((item) => item.key === panelGroupKey)
      : null;

  const handleNavigate = (nextScreen) => {
    if (!nextScreen) return;
    setScreen(nextScreen);
    syncAppPath(nextScreen);
    if (nextScreen === 'adm' || nextScreen === 'adm-clinicas' || nextScreen === 'adm-usuarios' || nextScreen === 'adm-cobrancas' || nextScreen === 'adm-auditoria') {
      setActiveGroupKey('adm');
      setPanelGroupKey('adm');
      return;
    }
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
    if (nextScreen === 'procedimentos') {
      setActiveGroupKey('tabelas');
      setPanelGroupKey('');
      return;
    }
    if (nextScreen === 'servicos-protetico') {
      setActiveGroupKey('tabelas');
      setPanelGroupKey('');
      return;
    }
    if (nextScreen === 'prestadores') {
      setActiveGroupKey('cadastro');
      setPanelGroupKey('cadastro');
      return;
    }
    if (nextScreen === 'cenario-anual') {
      setCenarioAnualOpenRequestId((current) => current + 1);
      setActiveGroupKey('configuracao');
      setPanelGroupKey('configuracao');
      return;
    }
    if (nextScreen === 'plano-contas') {
      setActiveGroupKey('configuracao');
      setPanelGroupKey('configuracao');
      return;
    }
    if (nextScreen === 'unidades-atendimento') {
      setActiveGroupKey('configuracao');
      setPanelGroupKey('configuracao');
      return;
    }
    if (nextScreen === 'ficha-clinica') {
      setActiveGroupKey('atendimento');
    }
  };

  const handleAdminNavigate = (nextScreen, navigationState = null) => {
    setAdminNavigationState(navigationState);
    handleNavigate(nextScreen);
  };

  const handleConsumeAdminNavigationState = () => {
    setAdminNavigationState(null);
  };

  const handleOpenGroup = (groupKey) => {
    if (!groupKey) return;
    if (panelCloseTimerRef.current) {
      window.clearTimeout(panelCloseTimerRef.current);
      panelCloseTimerRef.current = null;
    }
    if (groupKey === 'adm') {
      setActiveGroupKey('adm');
      setPanelGroupKey('adm');
      if (screen !== 'adm' && screen !== 'adm-clinicas' && screen !== 'adm-usuarios' && screen !== 'adm-cobrancas' && screen !== 'adm-auditoria') {
        handleNavigate('adm');
      }
      return;
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
    if (groupKey === 'adm') {
      handleNavigate(item?.key || 'adm');
      return;
    }
    if (groupKey === 'cadastro' && item?.key === 'pacientes' && !item?.disabled) {
      handleNavigate('pacientes');
      return;
    }
    if (groupKey === 'cadastro' && item?.key === 'corpo-clinico' && !item?.disabled) {
      handleNavigate('prestadores');
      return;
    }
    if (groupKey === 'configuracao' && item?.key === 'tabelas-auxiliares' && !item?.disabled) {
      handleNavigate('tabelas-auxiliares');
      return;
    }
    if (groupKey === 'configuracao' && item?.key === 'cenario-anual' && !item?.disabled) {
      handleNavigate('cenario-anual');
      return;
    }
    if (groupKey === 'configuracao' && item?.key === 'plano-contas' && !item?.disabled) {
      handleNavigate('plano-contas');
      return;
    }
    if (groupKey === 'configuracao' && item?.key === 'unidades-atendimento' && !item?.disabled) {
      handleNavigate('unidades-atendimento');
      return;
    }
    if (groupKey === 'tabelas' && item?.key === 'procedimentos-genericos' && !item?.disabled) {
      handleNavigate('procedimentos-genericos');
      return;
    }
    if (groupKey === 'tabelas' && item?.key === 'procedimentos' && !item?.disabled) {
      handleNavigate('procedimentos');
      return;
    }
    if (groupKey === 'tabelas' && item?.key === 'materiais-estoque' && !item?.disabled) {
      handleNavigate('materiais-estoque');
      return;
    }
    if (groupKey === 'tabelas' && item?.key === 'doencas-cid' && !item?.disabled) {
      handleNavigate('doencas-cid');
      return;
    }
    if (groupKey === 'tabelas' && item?.key === 'medicamentos' && !item?.disabled) {
      handleNavigate('medicamentos');
      return;
    }
    if (groupKey === 'tabelas' && item?.key === 'servicos-protetico' && !item?.disabled) {
      handleNavigate('servicos-protetico');
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
    if (actionKey === 'cenario-anual') {
      setCenarioAnualOpenRequestId((current) => current + 1);
      handleNavigate('cenario-anual');
      return;
    }
    if (actionKey === 'plano-contas') {
      handleNavigate('plano-contas');
      return;
    }
    if (actionKey === 'unidades-atendimento') {
      handleNavigate('unidades-atendimento');
      return;
    }
    if (actionKey === 'prestadores') {
      handleNavigate('prestadores');
      return;
    }
    if (actionKey === 'procedimentos-genericos') {
      setProcedimentosGenericosNovoToken((current) => current + 1);
      handleNavigate('procedimentos-genericos');
      return;
    }
    if (actionKey === 'procedimentos') {
      handleNavigate('procedimentos');
      return;
    }
    if (actionKey === 'materiais-estoque') {
      handleNavigate('materiais-estoque');
      return;
    }
    if (actionKey === 'doencas-cid') {
      handleNavigate('doencas-cid');
      return;
    }
    if (actionKey === 'medicamentos') {
      handleNavigate('medicamentos');
      return;
    }
    if (actionKey === 'servicos-protetico') {
      handleNavigate('servicos-protetico');
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
    const renderAdminRoutes = (activeSection) => (
      <AdminRoutes
        user={user}
        loading={loading}
        onReturnHome={() => handleNavigate('dashboard')}
        activeSection={activeSection}
        onToolbarChange={setAdminToolbar}
        navigationState={adminNavigationState}
        onConsumeNavigationState={handleConsumeAdminNavigationState}
        onAdminNavigate={handleAdminNavigate}
      />
    );

    if (screen === 'adm') {
      return renderAdminRoutes('overview');
    }
    if (screen === 'adm-clinicas') {
      return renderAdminRoutes('clinics');
    }
    if (screen === 'adm-usuarios') {
      return renderAdminRoutes('users');
    }
    if (screen === 'adm-cobrancas') {
      return renderAdminRoutes('billing');
    }
    if (screen === 'adm-auditoria') {
      return renderAdminRoutes('audit');
    }
    if (screen === 'pacientes') {
      return <PacientesPage onBackHome={() => handleNavigate('dashboard')} />;
    }
    if (screen === 'ficha-clinica') {
      return <FichaClinicaPage onBackHome={() => handleNavigate('dashboard')} />;
    }
    if (screen === 'tabelas-auxiliares') {
      return <TiposIndicacaoPage />;
    }
    if (screen === 'cenario-anual') {
      return <CenarioAnualPage openRequestId={cenarioAnualOpenRequestId} />;
    }
    if (screen === 'plano-contas') {
      return <PlanoContasPage />;
    }
    if (screen === 'unidades-atendimento') {
      return <UnidadesAtendimentoPage />;
    }
    if (screen === 'prestadores') {
      return <PrestadoresPage />;
    }
    if (screen === 'procedimentos-genericos') {
      return <ProcedimentosGenericosPage q={procedimentosGenericosSearch} especialidade={procedimentosGenericosEspecialidade} novoProcedimentoToken={procedimentosGenericosNovoToken} onResetFilters={() => { setProcedimentosGenericosSearch(''); setProcedimentosGenericosEspecialidade(''); }} />;
    }
    if (screen === 'procedimentos') {
      return <ProcedimentosPage />;
    }
    if (screen === 'materiais-estoque') {
      return (
        <MateriaisEstoquePage
          onClose={() => handleNavigate('dashboard')}
          toolbarState={materiaisEstoqueToolbarState}
        />
      );
    }
    if (screen === 'doencas-cid') {
      return <DoencasCidPage onClose={() => handleNavigate('dashboard')} />;
    }
    if (screen === 'medicamentos') {
      return <MedicamentosPage />;
    }
    if (screen === 'servicos-protetico') {
      return <ServicosProteticoPage />;
    }
    return <DashboardPage key={dashboardVersion} />;
  }, [cenarioAnualOpenRequestId, dashboardVersion, loading, materiaisEstoqueToolbarState, procedimentosGenericosEspecialidade, procedimentosGenericosNovoToken, procedimentosGenericosSearch, screen, user]);

  const auxiliaryTopBar = useMemo(() => {
    if (screen === 'unidades-atendimento') {
      return (
        <div className="brana-shell-band auxiliary-shell-band unidades-atendimento-shell-band" aria-label="Barra operacional de unidades de atendimento">
          <div className="unidades-atendimento-toolbar-row" role="toolbar" aria-label="Acoes do modulo unidades de atendimento">
            <div className="unidades-atendimento-toolbar-actions">
              <button type="button" className="auxiliary-shell-button primary" onClick={() => window.dispatchEvent(new CustomEvent('brana-unidades-atendimento-toolbar-action', { detail: { action: 'novo' } }))}>
                Nova unidade...
              </button>
              <button type="button" className="auxiliary-shell-button" disabled={!unidadesAtendimentoToolbarState.selectedItemId || unidadesAtendimentoToolbarState.loading || unidadesAtendimentoToolbarState.deleting} onClick={() => window.dispatchEvent(new CustomEvent('brana-unidades-atendimento-toolbar-action', { detail: { action: 'alterar' } }))}>
                Altera...
              </button>
              <button type="button" className="auxiliary-shell-button danger" disabled={!unidadesAtendimentoToolbarState.selectedItemId || unidadesAtendimentoToolbarState.loading || unidadesAtendimentoToolbarState.deleting} title={unidadesAtendimentoToolbarState.deleteDisabledReason || 'Selecione uma unidade para excluir.'} onClick={() => window.dispatchEvent(new CustomEvent('brana-unidades-atendimento-toolbar-action', { detail: { action: 'eliminar' } }))}>
                Elimina
              </button>
            </div>
          </div>
        </div>
      );
    }
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
            <button type="button" className="auxiliary-shell-button" onClick={() => window.dispatchEvent(new CustomEvent('brana-procedimentos-genericos-toolbar-action', { detail: { action: 'alterar' } }))}>
              Altera...
            </button>
            <button type="button" className="auxiliary-shell-button danger" onClick={() => message.info('Exclusão pendente nesta etapa.')}>
              Elimina...
            </button>
            <button type="button" className="auxiliary-shell-button" onClick={() => window.dispatchEvent(new CustomEvent('brana-procedimentos-genericos-toolbar-action', { detail: { action: 'fases' } }))}>
              Fases
            </button>
            <button type="button" className="auxiliary-shell-button" onClick={() => window.dispatchEvent(new CustomEvent('brana-procedimentos-genericos-toolbar-action', { detail: { action: 'materiais' } }))}>
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

  const procedimentosTopBar = useMemo(() => {
    if (screen !== 'procedimentos') return null;
    const selectedTabela = procedimentosToolbarState.tabelas.find((item) => item.id === procedimentosToolbarState.selectedTabelaId) || null;
    const tabelaOptions = procedimentosToolbarState.tabelas.map((item) => ({
      value: item.id,
      label: `${String(item.codigo || '').padStart(3, '0')} - ${item.nome}`,
    }));
    const especialidadeOptions = [
      { value: '', label: '<<Todas>>' },
      ...procedimentosToolbarState.especialidades.map((item) => ({ value: item.codigo, label: item.nome || item.codigo })),
    ];

    return (
      <div className="brana-shell-band auxiliary-shell-band procedimentos-shell-band" aria-label="Barra operacional de procedimentos">
        <div className="materiais-estoque-toolbar-row" role="toolbar" aria-label="Acoes e filtros do modulo procedimentos">
          <div className="materiais-estoque-toolbar-actions procedimentos-toolbar-actions">
            <button type="button" className="auxiliary-shell-button primary" onClick={() => window.dispatchEvent(new CustomEvent('brana-procedimentos-toolbar-action', { detail: { action: 'novo' } }))}>
              Nova intervenção
            </button>
            <button
              type="button"
              className="auxiliary-shell-button"
              onClick={() => window.dispatchEvent(new CustomEvent('brana-procedimentos-toolbar-action', { detail: { action: 'alterar' } }))}
              disabled={!procedimentosToolbarState.selectedItemId}
            >
              Altera
            </button>
            <button
              type="button"
              className="auxiliary-shell-button danger"
              onClick={() => window.dispatchEvent(new CustomEvent('brana-procedimentos-toolbar-action', { detail: { action: 'eliminar' } }))}
              disabled={!procedimentosToolbarState.selectedItemId}
            >
              Elimina
            </button>
            <span className="materiais-estoque-toolbar-divider" aria-hidden="true" />
            <button type="button" className="auxiliary-shell-button" disabled>
              Nova tabela
            </button>
            <button type="button" className="auxiliary-shell-button" disabled>
              Altera
            </button>
            <button type="button" className="auxiliary-shell-button danger" disabled>
              Elimina
            </button>
            <button type="button" className="auxiliary-shell-button" disabled>
              % Reajusta tabela
            </button>
            <button type="button" className="auxiliary-shell-button" disabled>
              Imprime
            </button>
          </div>

          <div className="materiais-estoque-toolbar-filters procedimentos-toolbar-filters">
            <label className="materiais-estoque-field procedimentos-field-lista">
              <Select
                value={procedimentosToolbarState.selectedTabelaId || undefined}
                loading={procedimentosToolbarState.loadingListas}
                options={tabelaOptions}
                onChange={(value) => window.dispatchEvent(new CustomEvent('brana-procedimentos-toolbar-filter', { detail: { field: 'tabela', value } }))}
                placeholder="Tabela"
                size="small"
              />
            </label>
            <label className="materiais-estoque-field procedimentos-field-especialidade">
              <Select
                value={procedimentosToolbarState.selectedEspecialidade || undefined}
                options={especialidadeOptions}
                onChange={(value) => window.dispatchEvent(new CustomEvent('brana-procedimentos-toolbar-filter', { detail: { field: 'especialidade', value } }))}
                allowClear
                placeholder="Especialidade"
                size="small"
              />
            </label>
            <label className="materiais-estoque-field grow procedimentos-field-search">
              <Input.Search
                allowClear
                value={procedimentosToolbarState.search}
                onChange={(event) => window.dispatchEvent(new CustomEvent('brana-procedimentos-toolbar-filter', { detail: { field: 'search', value: event.target.value } }))}
                onSearch={(value) => window.dispatchEvent(new CustomEvent('brana-procedimentos-toolbar-filter', { detail: { field: 'search', value } }))}
                placeholder={selectedTabela ? `Buscar em ${selectedTabela.nome}` : 'Buscar procedimento'}
                size="small"
              />
            </label>
          </div>
        </div>
      </div>
    );
  }, [procedimentosToolbarState, screen]);

  const materiaisEstoqueTopBar = useMemo(() => {
    if (screen !== 'materiais-estoque') return null;
    const selectedLista = materiaisEstoqueToolbarState.listas.find((item) => item.id === materiaisEstoqueToolbarState.selectedListaId) || null;
    const classOptions = [
      { value: '__mais_usados__', label: 'Mais usados' },
      { value: '__todos__', label: 'Todos' },
      ...materiaisEstoqueToolbarState.classificacoes.map((item) => ({ value: item, label: item })),
    ];

    return (
      <div className="brana-shell-band auxiliary-shell-band materiais-estoque-shell-band" aria-label="Barra operacional de materiais de estoque">
        <div className="materiais-estoque-toolbar-row" role="toolbar" aria-label="A??es e filtros do m?dulo materiais de estoque">
          <div className="materiais-estoque-toolbar-actions">
            <button type="button" className="auxiliary-shell-button primary" onClick={() => window.dispatchEvent(new CustomEvent('brana-materiais-estoque-toolbar-action', { detail: { action: 'material-novo' } }))}>
              Novo material
            </button>
            <button type="button" className="auxiliary-shell-button" onClick={() => window.dispatchEvent(new CustomEvent('brana-materiais-estoque-toolbar-action', { detail: { action: 'material-alterar' } }))}>
              Altera material
            </button>
            <button type="button" className="auxiliary-shell-button danger" onClick={() => window.dispatchEvent(new CustomEvent('brana-materiais-estoque-toolbar-action', { detail: { action: 'material-eliminar' } }))}>
              Elimina material
            </button>
            <span className="materiais-estoque-toolbar-divider" aria-hidden="true" />
            <button type="button" className="auxiliary-shell-button" onClick={() => window.dispatchEvent(new CustomEvent('brana-materiais-estoque-toolbar-action', { detail: { action: 'tabela-nova' } }))}>
              Nova tabela
            </button>
            <button type="button" className="auxiliary-shell-button" onClick={() => window.dispatchEvent(new CustomEvent('brana-materiais-estoque-toolbar-action', { detail: { action: 'tabela-alterar' } }))}>
              Altera tabela
            </button>
            <button type="button" className="auxiliary-shell-button danger" onClick={() => window.dispatchEvent(new CustomEvent('brana-materiais-estoque-toolbar-action', { detail: { action: 'tabela-eliminar' } }))}>
              Elimina tabela
            </button>
          </div>
          <div className="materiais-estoque-toolbar-filters">
            <label className="materiais-estoque-field">
                            <Select
                value={materiaisEstoqueToolbarState.selectedListaId ?? undefined}
                loading={materiaisEstoqueToolbarState.loadingListas}
                options={materiaisEstoqueToolbarState.listas.map((item) => ({ value: item.id, label: item.nome }))}
                onChange={(value) => window.dispatchEvent(new CustomEvent('brana-materiais-estoque-toolbar-filter', { detail: { field: 'lista', value } }))}
                placeholder="Selecione"
                size="small"
              />
            </label>
            <label className="materiais-estoque-field">
                            <Select
                value={materiaisEstoqueToolbarState.classificacao}
                options={classOptions}
                onChange={(value) => window.dispatchEvent(new CustomEvent('brana-materiais-estoque-toolbar-filter', { detail: { field: 'classificacao', value } }))}
                size="small"
              />
            </label>
            <label className="materiais-estoque-field grow">
                            <Input.Search
                allowClear
                value={materiaisEstoqueToolbarState.q}
                onChange={(event) => window.dispatchEvent(new CustomEvent('brana-materiais-estoque-toolbar-filter', { detail: { field: 'q', value: event.target.value } }))}
                onSearch={(value) => window.dispatchEvent(new CustomEvent('brana-materiais-estoque-toolbar-filter', { detail: { field: 'q', value } }))}
                placeholder={selectedLista ? `Buscar em ${selectedLista.nome}` : 'Buscar por c?digo ou nome'}
                size="small"
              />
            </label>
          </div>
        </div>
      </div>
    );
  }, [materiaisEstoqueToolbarState, screen]);

  const servicosProteticoTopBar = useMemo(() => {
    if (screen !== 'servicos-protetico') return null;

    return (
      <div className="brana-shell-band auxiliary-shell-band materiais-estoque-shell-band" aria-label="Barra operacional de serviços de protético">
        <ServicosProteticoToolbar
          proteticoId={servicosProteticoToolbarState.selectedProteticoId}
          proteticos={servicosProteticoToolbarState.proteticos}
          loading={servicosProteticoToolbarState.loading}
          selectionDisabled={Boolean(servicosProteticoToolbarState.modalOpen)}
          onProteticoChange={(value) => window.dispatchEvent(new CustomEvent('brana-servicos-protetico-toolbar-filter', { detail: { field: 'proteticoId', value } }))}
        />
      </div>
    );
  }, [screen, servicosProteticoToolbarState]);

  const doencasCidTopBar = useMemo(() => {
    if (screen !== 'doencas-cid') return null;

    return (
      <DoencaCidToolbar
        hasSelection={Boolean(doencasCidToolbarState.selectedId)}
        loading={doencasCidToolbarState.loading}
        deleting={doencasCidToolbarState.deleting}
        globalSearch={doencasCidToolbarState.globalSearch}
        onGlobalSearchChange={(value) => window.dispatchEvent(new CustomEvent('brana-doencas-cid-toolbar-filter', { detail: { field: 'search', value } }))}
        onCreate={() => window.dispatchEvent(new CustomEvent('brana-doencas-cid-toolbar-action', { detail: { action: 'novo' } }))}
        onEdit={() => window.dispatchEvent(new CustomEvent('brana-doencas-cid-toolbar-action', { detail: { action: 'alterar' } }))}
        onDelete={() => window.dispatchEvent(new CustomEvent('brana-doencas-cid-toolbar-action', { detail: { action: 'eliminar' } }))}
        onClose={() => handleNavigate('dashboard')}
      />
    );
  }, [adminNavigationState, doencasCidToolbarState, loading, screen, user]);

  const medicamentosTopBar = useMemo(() => {
    if (screen !== 'medicamentos') return null;

    return (
      <div className="brana-shell-band auxiliary-shell-band medicamentos-shell-band" aria-label="Barra operacional de medicamentos">
        <MedicamentosToolbar
          group={medicamentosToolbarState.group}
          groups={medicamentosToolbarState.groups}
          name={medicamentosToolbarState.name}
          loadingGroups={medicamentosToolbarState.loadingGroups}
          onGroupChange={(value) => window.dispatchEvent(new CustomEvent('brana-medicamentos-toolbar-filter', { detail: { field: 'group', value } }))}
          onNameChange={(value) => window.dispatchEvent(new CustomEvent('brana-medicamentos-toolbar-filter', { detail: { field: 'name', value } }))}
        />
      </div>
    );
  }, [medicamentosToolbarState.group, medicamentosToolbarState.groups, medicamentosToolbarState.loadingGroups, medicamentosToolbarState.name, screen]);

  const planoContasTopBar = useMemo(() => {
    if (screen !== 'plano-contas') return null;

    return (
      <div className="brana-shell-band auxiliary-shell-band plano-contas-shell-band" aria-label="Barra operacional do plano de contas">
          <PlanoContasToolbar
          onClose={() => handleNavigate('dashboard')}
          canEditGroup={planoContasToolbarState.canEditGroup}
          canCreateCategory={planoContasToolbarState.canCreateCategory}
          canEditCategory={planoContasToolbarState.canEditCategory}
          canDelete={planoContasToolbarState.canDeleteSelection}
          deleteDisabledReason={planoContasToolbarState.deleteDisabledReason}
          deleting={planoContasToolbarState.deleting || planoContasToolbarState.migrating || planoContasToolbarState.migrationModalOpen}
          saving={planoContasToolbarState.loading || planoContasToolbarState.saving || planoContasToolbarState.migrating || planoContasToolbarState.migrationModalOpen}
          onNewGroup={() => window.dispatchEvent(new CustomEvent('brana-plano-contas-toolbar-action', { detail: { action: 'novo-grupo' } }))}
          onEditGroup={() => window.dispatchEvent(new CustomEvent('brana-plano-contas-toolbar-action', { detail: { action: 'alterar-grupo' } }))}
          onNewCategory={() => window.dispatchEvent(new CustomEvent('brana-plano-contas-toolbar-action', { detail: { action: 'nova-categoria' } }))}
          onEditCategory={() => window.dispatchEvent(new CustomEvent('brana-plano-contas-toolbar-action', { detail: { action: 'alterar-categoria' } }))}
          onDelete={() => window.dispatchEvent(new CustomEvent('brana-plano-contas-toolbar-action', { detail: { action: 'eliminar' } }))}
        />
      </div>
    );
  }, [handleNavigate, planoContasToolbarState.canCreateCategory, planoContasToolbarState.canDeleteSelection, planoContasToolbarState.canEditCategory, planoContasToolbarState.canEditGroup, planoContasToolbarState.deleteDisabledReason, planoContasToolbarState.deleting, planoContasToolbarState.loading, planoContasToolbarState.migrating, planoContasToolbarState.migrationModalOpen, planoContasToolbarState.saving, screen]);

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
      window.location.replace(appPath());
      return null;
    }
    return <LoginPage />;
  }

  if (!isAuthenticated) {
    window.location.replace(loginPath());
    return null;
  }

  if (user?.setup_completed === false) {
    if (!isFirstAccessRoute()) {
      window.location.replace(appPath('primeiro-acesso'));
      return null;
    }
    return <FirstAccessPage />;
  }

  if (isFirstAccessRoute()) {
    window.location.replace(appPath());
    return null;
  }

  if (isAppRoute()) {
    return (
      <div className="brana-app brana-shell" style={shellStyle}>
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
          ) : screen === 'adm' || screen === 'adm-clinicas' || screen === 'adm-usuarios' || screen === 'adm-cobrancas' || screen === 'adm-auditoria' ? (
            adminTopBar
          ) : screen === 'tabelas-auxiliares' || screen === 'unidades-atendimento' ? (
            auxiliaryTopBar
          ) : screen === 'procedimentos-genericos' ? (
            procedimentosGenericosTopBar
          ) : screen === 'procedimentos' ? (
            procedimentosTopBar
          ) : screen === 'materiais-estoque' ? (
            materiaisEstoqueTopBar
          ) : screen === 'servicos-protetico' ? (
            servicosProteticoTopBar
          ) : screen === 'doencas-cid' ? (
            doencasCidTopBar
          ) : screen === 'medicamentos' ? (
            medicamentosTopBar
          ) : screen === 'plano-contas' ? (
            planoContasTopBar
          ) : null}
          <BranaIconRail
            activeKey={activeKey}
            expanded={railExpanded}
            groups={mainGroups}
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
            items={panelGroupKey === 'adm' ? adminContextItems : (contextualMenus[panelGroupKey] || [])}
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

  window.location.replace(appPath());
  return null;
}

function BranaAppThemeProvider() {
  const { themeMode } = useBranaThemeMode();

  return (
    <ConfigProvider theme={getBranaTheme(themeMode)}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ConfigProvider>
  );
}

export default function App() {
  return (
    <BranaThemeModeProvider>
      <BranaAppThemeProvider />
    </BranaThemeModeProvider>
  );
}
