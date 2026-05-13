(function () {
  "use strict";

  const root = window;
  const ns = root.BranaAuxiliaresModule = root.BranaAuxiliaresModule || {};
  const meta = ns.meta = ns.meta || {};

  Object.assign(meta, {
    nome: "Auxiliares / Tabelas auxiliares",
    versao: "subetapa-3",
    status: "helpers-puros-passivos",
    controlaFluxo: false
  });

  ns.nome = "auxiliares";
  ns.subetapa = meta.versao;
  ns.status = meta.status;
  ns.ativo = false;
  ns.controlaFluxo = false;
  ns.helpers = ns.helpers || {};

  ns.funcoesMonoliticas = ns.funcoesMonoliticas || [
    "auxAbrir()",
    "auxAplicarLayoutDesktop()",
    "auxCarregarTipos()",
    "auxCarregarItens()",
    "auxSelecionarTipoLinha(tr, carregar=true)",
    "auxSelecionarItemLinha(tr)",
    "auxDialogItem(ed=null)",
    "auxExcluirItem()",
    "auxPosSalvarDependencias(tipo)",
    "auxTipoEh(tipo, chave)",
    "auxNormalizarHexCor(value)",
    "auxCorrigirMojibake(texto)",
    "auxCorApresentacaoNormLabelKey(texto)",
    "auxCorApresentacaoHexPorLabel(label)",
    "auxCorApresentacaoCorLabel(hex)",
    "auxCorApresentacaoOpcoesHtml(corAtual)",
    "auxCorApresentacaoFonteSistema()",
    "auxCorApresentacaoGarantirEstiloCombo()",
    "auxCorApresentacaoFecharListas()",
    "auxCorApresentacaoMontarCombo(select)",
    "auxGerarCodigoAutomatico()",
    "auxAtualizarTotal()",
    "auxSel()"
  ];

  ns.helpersCandidatosFuturos = ns.helpersCandidatosFuturos || [
    "auxTipoEh(tipo, chave)",
    "auxNormalizarHexCor(value)",
    "auxCorrigirMojibake(texto)",
    "auxCorApresentacaoNormLabelKey(texto)",
    "auxCorApresentacaoHexPorLabel(label)",
    "auxCorApresentacaoCorLabel(hex)",
    "auxCorApresentacaoOpcoesHtml(corAtual)"
  ];

  ns.dependenciasCompartilhadas = ns.dependenciasCompartilhadas || [
    "requestJson",
    "esc",
    "ensurePanelChrome",
    "ensureModalChrome",
    "hideAllPanels",
    "closeWorkspacePanel",
    "workspaceEmpty",
    "footerMsg",
    "window.alert",
    "window.confirm",
    "cadModal",
    "planoEnsureUI",
    "bindStandardGridActivation",
    "agendaLegadoRecarregarStatus",
    "agendaSemanaRenderEventos"
  ];

  ns.endpoints = ns.endpoints || [
    "GET /cadastros/auxiliares/tipos",
    "GET /cadastros/auxiliares?tipo=...",
    "POST /cadastros/auxiliares",
    "PUT /cadastros/auxiliares/{id}",
    "DELETE /cadastros/auxiliares/{id}"
  ];

  const toText = value => String(value ?? "");
  const escapeHtml = value => toText(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

  function getCorSourceList() {
    const source = typeof root.prestAgendaApresCorOptions === "function"
      ? root.prestAgendaApresCorOptions()
      : [];
    return Array.isArray(source) ? source : [];
  }

  function auxTipoEh(tipo, chave) {
    const txt = String(tipo || "").toLowerCase();
    if (chave === "especialidade") return txt.includes("especialidade");
    if (chave === "situacao_agendamento") return txt.includes("agendamento");
    if (chave === "situacao_paciente") return txt.includes("paciente");
    if (chave === "grupo_medicamento") return txt.includes("grupo") && txt.includes("medicamento");
    return false;
  }

  function auxNormalizarHexCor(value) {
    const raw = String(value ?? "").trim();
    if (!raw) return "";
    const hex = raw.replace(/^0x/i, "").replace(/^#/, "");
    const withHash = `#${hex}`;
    return /^#[0-9a-fA-F]{6}$/.test(withHash) ? withHash.toLowerCase() : "";
  }

  function auxCorrigirMojibake(texto) {
    const bruto = String(texto ?? "").trim();
    if (!/[ÃƒÃ‚]/.test(bruto)) return bruto;
    try {
      return decodeURIComponent(escape(bruto));
    } catch {
      return bruto;
    }
  }

  function auxCorApresentacaoNormLabelKey(texto) {
    return String(texto || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z ]/g, "")
      .toLowerCase()
      .trim();
  }

  function auxCorApresentacaoFonteSistema() {
    const lista = getCorSourceList();
    const out = [];
    const seen = new Set();
    lista.forEach(item => {
      const hex = auxNormalizarHexCor(item?.value || item?.hex || "");
      if (!hex || seen.has(hex)) return;
      seen.add(hex);
      const label = auxCorrigirMojibake(item?.label || item?.nome || hex.toUpperCase());
      out.push({ hex, label: label || hex.toUpperCase() });
    });
    return out;
  }

  function auxCorApresentacaoHexPorLabel(label) {
    const chave = auxCorApresentacaoNormLabelKey(auxCorrigirMojibake(label));
    if (!chave) return "";
    const item = auxCorApresentacaoFonteSistema().find(x => auxCorApresentacaoNormLabelKey(x.label) === chave);
    return item?.hex || "";
  }

  function auxCorApresentacaoCorLabel(hex) {
    const cor = auxNormalizarHexCor(hex);
    if (!cor) return "(Sem cor)";
    const item = auxCorApresentacaoFonteSistema().find(x => x.hex === cor);
    return item?.label || cor.toUpperCase();
  }

  function auxCorApresentacaoOpcoesHtml(corAtual) {
    const selecionada = auxNormalizarHexCor(corAtual) || "#000000";
    const cores = [...auxCorApresentacaoFonteSistema()];
    if (!cores.some(item => item.hex === selecionada)) {
      cores.push({ label: selecionada.toUpperCase(), hex: selecionada });
    }
    return cores.map(item => {
      const hex = auxNormalizarHexCor(item.hex || "");
      const selected = hex === selecionada ? "selected" : "";
      const label = auxCorrigirMojibake(String(item.label || "").trim()) || hex.toUpperCase();
      return `<option value="${escapeHtml(hex)}" ${selected}>${escapeHtml(label)}</option>`;
    }).join("");
  }

  const helpers = ns.helpers;
  if (typeof helpers.auxTipoEh !== "function") helpers.auxTipoEh = auxTipoEh;
  if (typeof helpers.auxNormalizarHexCor !== "function") helpers.auxNormalizarHexCor = auxNormalizarHexCor;
  if (typeof helpers.auxCorrigirMojibake !== "function") helpers.auxCorrigirMojibake = auxCorrigirMojibake;
  if (typeof helpers.auxCorApresentacaoNormLabelKey !== "function") helpers.auxCorApresentacaoNormLabelKey = auxCorApresentacaoNormLabelKey;
  if (typeof helpers.auxCorApresentacaoHexPorLabel !== "function") helpers.auxCorApresentacaoHexPorLabel = auxCorApresentacaoHexPorLabel;
  if (typeof helpers.auxCorApresentacaoCorLabel !== "function") helpers.auxCorApresentacaoCorLabel = auxCorApresentacaoCorLabel;
  if (typeof helpers.auxCorApresentacaoOpcoesHtml !== "function") helpers.auxCorApresentacaoOpcoesHtml = auxCorApresentacaoOpcoesHtml;

  const getInfo = function () {
    return {
      modulo: "auxiliares",
      nome: meta.nome,
      versao: meta.versao,
      status: meta.status,
      ativo: false,
      controlaFluxo: false,
      helpers: Object.keys(ns.helpers).sort(),
      funcoesMonoliticas: [...ns.funcoesMonoliticas],
      helpersCandidatosFuturos: [...ns.helpersCandidatosFuturos],
      dependenciasCompartilhadas: [...ns.dependenciasCompartilhadas],
      endpoints: [...ns.endpoints],
      observacao: "Estrutura modular passiva. app.js permanece como fonte funcional da verdade."
    };
  };

  ns.getInfo = getInfo;
  ns.getStatus = function () {
    return getInfo();
  };
  ns.info = function () {
    return getInfo();
  };
})();
