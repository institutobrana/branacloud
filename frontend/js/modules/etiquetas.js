(function () {
  "use strict";

  const root = window;
  const ns = root.BranaEtiquetasModule = root.BranaEtiquetasModule || {};

  const MODULE_NAME = "Etiquetas / Configuração de modelos de etiqueta";
  const MODULE_VERSION = "subetapa-3c-helper-etqlayoutfromitem";
  const MODULE_DESCRIPTION = "Namespace passivo/controlado para inspeção documental do módulo de Etiquetas.";
  const FUNCTION_MAIN = "etqAbrir";
  const FUNCOES_MAPEADAS = [
    "etqAbrir",
    "etqEnsureUI",
    "etqCarregarDados",
    "etqRender",
    "etqSelecionarLinha(tr)",
    "etqSelecionado()",
    "etqAbrirModal(modo)",
    "etqAplicarPadraoSelecionado()",
    "etqFixarPadraoUser()",
    "etqSyncPreview()",
    "etqRenderCombos()",
    "etqSalvarModal()",
    "etqExcluirSelecionado()",
    "etqFecharModal()",
    "etqTesteImprimir()",
    "etqNumero(valor, padrao)",
    "etqFormatNumero(valor)",
    "formatNumber(valor)",
    "etqArquivosOrdenados()",
    "etqResolverArquivoPadrao(padraoId)",
    "layoutFromItem(item)",
    "etqLayoutFromItem(item)"
  ];
  const HELPERS_CANDIDATOS = [
    "etqNumero",
    "etqFormatNumero",
    "formatNumber",
    "layoutFromItem",
    "etqLayoutFromItem"
  ];
  const NUMBER_HELPER_NAME = "normalizeNumber";
  const CONTRACTS = {
    etapa: "Subetapa 2 - fronteiras e contratos",
    helpers: {
      etqNumero: {
        classificacao: "PURO",
        risco: "baixo",
        observacao: "Converte valor em numero com fallback de padrao usando apenas argumentos."
      },
      etqFormatNumero: {
        classificacao: "PURO",
        risco: "baixo",
        observacao: "Formata numero em string com duas casas usando apenas o argumento."
      },
      formatNumber: {
        classificacao: "PURO",
        risco: "baixo",
        observacao: "Extracao conservadora do helper etqFormatNumero com fallback no app.js."
      },
      layoutFromItem: {
        classificacao: "PURO",
        risco: "baixo",
        observacao: "Extracao conservadora do helper etqLayoutFromItem com fallback no app.js."
      },
      etqLayoutFromItem: {
        classificacao: "PURO",
        risco: "baixo",
        observacao: "Calcula layout de impressao a partir do item recebido, sem DOM ou estado global."
      }
    },
    fronteiras: {
      appJsMantemFluxo: true,
      preferenciaModeloEtiqueta: true,
      impressaoPreviewMantida: true,
      semDelegacaoFuncional: true
    }
  };

  const meta = ns.meta = ns.meta || {};
  Object.assign(meta, {
    nome: MODULE_NAME,
    versao: MODULE_VERSION,
    status: "namespace-passivo-controlado",
    stage: "Subetapa 1",
    passive: true,
    controlaFluxo: false
  });

  if (typeof ns.nome !== "string") ns.nome = MODULE_NAME;
  if (typeof ns.versao !== "string") ns.versao = MODULE_VERSION;
  if (typeof ns.subetapa !== "string") ns.subetapa = "subetapa-1";
  if (typeof ns.status !== "string") ns.status = "namespace-passivo-controlado";
  ns.ativo = false;
  ns.controlaFluxo = false;

  ns.funcoesMapeadas = Array.isArray(ns.funcoesMapeadas) ? ns.funcoesMapeadas : FUNCOES_MAPEADAS.slice();
  ns.helpersCandidatosDocumentais = Array.isArray(ns.helpersCandidatosDocumentais) ? ns.helpersCandidatosDocumentais : HELPERS_CANDIDATOS.slice();

  function cloneList(list) {
    return Array.isArray(list) ? list.slice() : [];
  }

  function getInfo() {
    return {
      nome: MODULE_NAME,
      versao: MODULE_VERSION,
      descricao: MODULE_DESCRIPTION,
      funcaoPrincipalMapeada: FUNCTION_MAIN,
      funcoesMapeadas: cloneList(ns.funcoesMapeadas),
      helpersCandidatosDocumentais: cloneList(ns.helpersCandidatosDocumentais),
      passivo: true,
      nenhumaFuncaoFuncionalMovida: true,
      observacao: "Namespace passivo/controlado. Nenhuma função funcional foi movida."
    };
  }

  function getStatus() {
    return {
      loaded: true,
      passive: true,
      functionalDelegation: true,
      appJsModified: true,
      canMoveHelpers: false,
      stage: "Subetapa 3-C"
    };
  }

  function getContracts() {
    return {
      etapa: CONTRACTS.etapa,
      helpers: {
        normalizeNumber: {
          classificacao: "PURO",
          risco: "baixo",
          observacao: "Extracao conservadora do helper etqNumero com fallback no app.js."
        },
        formatNumber: {
          classificacao: "PURO",
          risco: "baixo",
          observacao: "Extracao conservadora do helper etqFormatNumero com fallback no app.js."
        },
        layoutFromItem: {
          classificacao: "PURO",
          risco: "baixo",
          observacao: "Extracao conservadora do helper etqLayoutFromItem com fallback no app.js."
        },
        etqNumero: { ...CONTRACTS.helpers.etqNumero },
        etqFormatNumero: { ...CONTRACTS.helpers.etqFormatNumero },
        formatNumber: { ...CONTRACTS.helpers.formatNumber },
        layoutFromItem: { ...CONTRACTS.helpers.layoutFromItem },
        etqLayoutFromItem: { ...CONTRACTS.helpers.etqLayoutFromItem }
      },
      fronteiras: { ...CONTRACTS.fronteiras }
    };
  }

  function normalizeNumber(valor, padrao) {
    if (valor === "" || valor === null || valor === undefined) return padrao;
    const num = Number(String(valor).replace(",", "."));
    return Number.isFinite(num) ? num : padrao;
  }

  function formatNumber(valor) {
    if (valor === undefined) return "";
    const num = typeof valor === "string"
      ? Number(valor.replace(",", "."))
      : Number(valor);
    if (!Number.isFinite(num)) return "";
    return num.toFixed(2).replace(".", ",");
  }

  function etqArquivosOrdenados(lista) {
    const itens = Array.isArray(lista) ? lista : [];
    const mapa = new Map();
    itens.forEach(item => {
      const key = String(item?.nome_arquivo || item?.nome || "").trim().toLowerCase();
      if (!key) return;
      const atual = mapa.get(key);
      if (!atual) {
        mapa.set(key, item);
        return;
      }
      const atualClinica = atual?.clinica_id != null;
      const novoClinica = item?.clinica_id != null;
      if (!atualClinica && novoClinica) mapa.set(key, item);
    });
    return Array.from(mapa.values()).sort((a, b) =>
      String(a.nome_arquivo || a.nome || "").localeCompare(String(b.nome_arquivo || b.nome || ""), "pt-BR"));
  }

  function layoutFromItem(item) {
    if (!item) return null;
    const cols = Math.max(1, Math.min(20, parseInt(item.nro_colunas || "1", 10) || 1));
    const rows = Math.max(1, Math.min(40, parseInt(item.nro_linhas || "1", 10) || 1));
    const margemEsq = normalizeNumber(item.margem_esq, 0);
    const margemSup = normalizeNumber(item.margem_sup, 0);
    const gapH = normalizeNumber(item.esp_horizontal, 0);
    const gapV = normalizeNumber(item.esp_vertical, 0);
    const padraoLabel = String(item.padrao_nome || item.nome || "");
    const isEnvelope = cols === 1 && rows === 1 && /envelope/i.test(padraoLabel);
    const pageW = 210;
    const pageH = 297;
    let labelWmm, labelHmm;
    if (isEnvelope) {
      labelWmm = 90;
      labelHmm = 50;
    } else {
      const margemDir = margemEsq;
      const margemInf = margemSup;
      const usableW = Math.max(10, pageW - margemEsq - margemDir - gapH * (cols - 1));
      const usableH = Math.max(10, pageH - margemSup - margemInf - gapV * (rows - 1));
      labelWmm = usableW / cols;
      labelHmm = usableH / rows;
    }
    const labels = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = margemEsq + (labelWmm + gapH) * c;
        const y = margemSup + (labelHmm + gapV) * r;
        labels.push({ x, y, w: labelWmm, h: labelHmm });
      }
    }
    return { pageW, pageH, labels };
  }

  if (typeof ns.normalizeNumber !== "function") ns.normalizeNumber = normalizeNumber;
  if (typeof ns.formatNumber !== "function") ns.formatNumber = formatNumber;
  if (typeof ns.etqArquivosOrdenados !== "function") ns.etqArquivosOrdenados = etqArquivosOrdenados;
  if (typeof ns.layoutFromItem !== "function") ns.layoutFromItem = layoutFromItem;

  if (typeof ns.getInfo !== "function") ns.getInfo = getInfo;
  if (typeof ns.getStatus !== "function") ns.getStatus = getStatus;
  if (typeof ns.getContracts !== "function") ns.getContracts = getContracts;
})();
