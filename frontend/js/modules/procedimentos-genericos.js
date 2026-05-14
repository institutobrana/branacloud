(function () {
  "use strict";

  const root = window;
  const ns = root.BranaProcedimentosGenericosModule = root.BranaProcedimentosGenericosModule || {};
  const meta = ns.meta = ns.meta || {};

  Object.assign(meta, {
    nome: "Procedimentos genericos",
    modulo: "procedimentos-genericos",
    versao: "subetapa-3a-helper-pgenstatusdot",
    status: "namespace-passivo-controlado",
    stage: "Subetapa 3-A",
    ativo: false,
    controlaFluxo: false,
    moveuLogicaFuncional: true
  });

  ns.nome = meta.nome;
  ns.modulo = meta.modulo;
  ns.subetapa = meta.versao;
  ns.status = meta.status;
  ns.ativo = false;
  ns.controlaFluxo = false;
  ns.moveuLogicaFuncional = true;
  ns.helpers = ns.helpers || {};
  ns.helpersExtraidos = ["pgenStatusDot(inativo)"];
  ns.helpersCandidatosFuturos = ["pgenPayloadFromState(state)"];

  function statusDot(inativo) {
    return `<span class="pgen-status-dot ${inativo ? "off" : "on"}"></span>`;
  }

  ns.statusDot = statusDot;
  ns.helpers.statusDot = statusDot;

  ns.funcoesMonoliticas = ns.funcoesMonoliticas || [
    "pgenAbrir_LEGACY()",
    "pgenCarregar_LEGACY()",
    "pgenAbrirEditor_LEGACY(id=null)",
    "pgenSalvarEditor_LEGACY()",
    "pgenExcluirSelecionado_LEGACY()",
    "pgenMigrar_LEGACY()",
    "pgenAbrir()",
    "pgenCarregar()",
    "pgenSelecionado()",
    "pgenSelecionar(id)",
    "pgenAbrirEditor(id=null)",
    "pgenSalvarEditor()",
    "pgenExcluirSelecionado()",
    "pgenAbrirFases()",
    "pgenFaseEditAbrir(idx=null)",
    "pgenFaseEditSalvar()",
    "pgenFaseExcluirSelecionada()",
    "pgenAbrirMateriais()",
    "pgenMaterialEditAbrir(idx=null)",
    "pgenMaterialEditSalvar()",
    "pgenMaterialExcluirSelecionado()",
    "pgenCarregarEspecialidades()",
    "pgenCarregarSimbolos()",
    "pgenCarregarAuxFases()",
    "pgenCarregarListasMateriais()",
    "pgenBuscarMateriais()",
    "pgenAtualizarCustoMaterialEditor()",
    "pgenCorrigirRotulos()",
    "pgenPayloadFromState(state)",
    "pgenDetalheParaEstado(data)",
    "pgenStatusDot(inativo)"
  ];

  ns.helpersCandidatosFuturos = ns.helpersCandidatosFuturos || [
    "pgenStatusDot(inativo)",
    "pgenPayloadFromState(state)"
  ];

  ns.dependenciasCompartilhadas = ns.dependenciasCompartilhadas || [
    "requestJson",
    "hideAllPanels",
    "ensurePanelChrome",
    "workspaceEmpty",
    "footerMsg",
    "esc",
    "procFiltros",
    "procSimbolosCache",
    "procCenario",
    "procPreencherSelect",
    "procGarantirOpcaoSelect",
    "procSetSelectValue",
    "procFmtBr",
    "procFmtMoeda",
    "procParse",
    "window.alert",
    "window.confirm"
  ];

  ns.riscosConhecidos = ns.riscosConhecidos || [
    "coexistem bloco legado e bloco atual no app.js",
    "dependencia de tabelas auxiliares para fases e listas",
    "dependencia de materiais para o editor de materiais vinculados",
    "dependencia de custos e valores monetarios no editor",
    "fluxo principal ainda precisa permanecer no app.js"
  ];

  function getInfo() {
    return {
      modulo: meta.modulo,
      nome: meta.nome,
      versao: meta.versao,
      subetapa: meta.stage,
      status: meta.status,
      ativo: false,
      controlaFluxo: false,
      moveuLogicaFuncional: true,
      functionalDelegation: true,
      controlsMainFlow: false,
      controlsDom: false,
      controlsApi: false,
      controlsPayload: false,
      controlsCosts: false,
      controlsMaterials: false,
      controlsFinance: false,
      helpersExtraidos: [...ns.helpersExtraidos],
      funcoesMonoliticas: [...ns.funcoesMonoliticas],
      helpersCandidatosFuturos: [...ns.helpersCandidatosFuturos],
      dependenciasCompartilhadas: [...ns.dependenciasCompartilhadas],
      riscosConhecidos: [...ns.riscosConhecidos],
      observacao: "Namespace passivo/controlado. app.js permanece como fonte funcional da verdade."
    };
  }

  function getStatus() {
    return {
      loaded: true,
      passive: true,
      functionalDelegation: true,
      appJsModified: true,
      canMoveHelpers: false,
      moveuLogicaFuncional: true,
      helpersExtraidos: [...ns.helpersExtraidos],
      controlsMainFlow: false,
      controlsDom: false,
      controlsApi: false,
      controlsPayload: false,
      controlsCosts: false,
      controlsMaterials: false,
      controlsFinance: false,
      stage: meta.stage,
      module: meta.modulo,
      nome: meta.nome,
      namespace: "window.BranaProcedimentosGenericosModule"
    };
  }

  if (typeof ns.getInfo !== "function") ns.getInfo = getInfo;
  if (typeof ns.getStatus !== "function") ns.getStatus = getStatus;
  if (typeof ns.info !== "function") ns.info = function () {
    return ns.getInfo();
  };
})();
