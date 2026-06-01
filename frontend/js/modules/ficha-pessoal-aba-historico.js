(function () {
  "use strict";

  const MODULE_NAME = "BranaFichaPessoalAbaHistorico";
  const MODULE_VERSION = "subetapa-1-passive-bridge";
  const STYLE_ID = "ficha-historico-visual-style";
  const SELECTED_CLASS = "is-selected";
  const BUTTON_LABELS = {
    novo: "Inserir linha",
    alterar: "Edita linha",
    eliminar: "Elimina linha",
    confirmar: "Propriedades da linha",
  };
  const TABLE_HEADERS = ["Data", "Cirurgiao", "Regiao", "Descricao do procedimento"];
  const state = {
    selectedRow: null,
  };

  function historicoListEl() {
    return ficha?.historicoList || null;
  }

  function historicoTextoEl() {
    return ficha?.historicoTexto || null;
  }

  function criarLinhaPadrao() {
    const data = new Date().toLocaleDateString("pt-BR");
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${data}</td><td>Sistema</td><td>-</td><td>Historico criado manualmente</td>`;
    return tr;
  }

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .ficha-pane[data-ficha-tab="historico"]{display:flex;flex-direction:column;gap:8px;min-height:0}
      .ficha-pane[data-ficha-tab="historico"] .ficha-hist-toolbar{display:flex;justify-content:flex-start;gap:6px;flex-wrap:wrap;margin-bottom:0;padding:4px 0 2px}
      .ficha-pane[data-ficha-tab="historico"] .ficha-hist-toolbar .materiais-btn{min-width:138px;justify-content:flex-start;padding:0 10px}
      .ficha-pane[data-ficha-tab="historico"] .ficha-hist-toolbar .materiais-btn img{width:16px;height:16px}
      .ficha-pane[data-ficha-tab="historico"] .ficha-hist-wrap{flex:1;min-height:0;max-height:260px;overflow:auto;border:1px solid #cfd8e3;background:#fff}
      .ficha-pane[data-ficha-tab="historico"] .ficha-list{width:100%;border-collapse:collapse;table-layout:fixed;font:11px Tahoma,sans-serif}
      .ficha-pane[data-ficha-tab="historico"] .ficha-list thead th{background:#f2f6fb;font:700 11px Tahoma,sans-serif;color:#243444}
      .ficha-pane[data-ficha-tab="historico"] .ficha-list th,.ficha-pane[data-ficha-tab="historico"] .ficha-list td{border-bottom:1px solid #e4ebf2;padding:5px 6px;vertical-align:top;word-break:break-word}
      .ficha-pane[data-ficha-tab="historico"] .ficha-list tbody tr{cursor:pointer}
      .ficha-pane[data-ficha-tab="historico"] .ficha-list tbody tr.${SELECTED_CLASS}{background:#dcecff;box-shadow:inset 0 0 0 1px #94bbec}
      .ficha-pane[data-ficha-tab="historico"] .ficha-list tbody tr.${SELECTED_CLASS} td{background:#dcecff}
      .ficha-pane[data-ficha-tab="historico"] .ficha-hist-texto{display:grid;gap:4px;margin-top:6px}
      .ficha-pane[data-ficha-tab="historico"] .ficha-hist-texto label{font:11px Tahoma,sans-serif;color:#4f5f72}
      .ficha-pane[data-ficha-tab="historico"] .ficha-hist-texto textarea{width:100%;height:140px;border:1px solid #bfc9d6;box-sizing:border-box;padding:5px;font:11px Tahoma,sans-serif;resize:vertical;background:#fff}
    `;
    document.head.appendChild(style);
  }

  function setButtonLabel(btn, label) {
    if (!(btn instanceof HTMLElement)) return;
    const nodes = Array.from(btn.childNodes || []);
    const textNode = nodes.find((node) => node.nodeType === Node.TEXT_NODE) || document.createTextNode("");
    if (!textNode.parentNode) {
      btn.appendChild(textNode);
    }
    textNode.nodeValue = ` ${label}`;
  }

  function updateButtonLabels() {
    setButtonLabel(ficha?.historicoNovo, BUTTON_LABELS.novo);
    setButtonLabel(ficha?.historicoAlterar, BUTTON_LABELS.alterar);
    setButtonLabel(ficha?.historicoEliminar, BUTTON_LABELS.eliminar);
    setButtonLabel(ficha?.historicoConfirmar, BUTTON_LABELS.confirmar);
  }

  function updateTableHeaders() {
    const headCells = document.querySelectorAll('.ficha-pane[data-ficha-tab="historico"] .ficha-list thead th');
    headCells.forEach((cell, idx) => {
      if (TABLE_HEADERS[idx]) cell.textContent = TABLE_HEADERS[idx];
    });
    const label = document.querySelector('.ficha-pane[data-ficha-tab="historico"] .ficha-hist-texto label');
    if (label) label.textContent = "Descricao do procedimento";
  }

  function historicoTbodyEl() {
    return historicoListEl();
  }

  function clearSelectedRow() {
    if (state.selectedRow?.classList) {
      state.selectedRow.classList.remove(SELECTED_CLASS);
    }
    state.selectedRow = null;
  }

  function selecionarLinhaHistorico(tr) {
    if (!(tr instanceof HTMLElement)) return null;
    const tbody = historicoTbodyEl();
    if (!tbody || !tbody.contains(tr)) return null;
    clearSelectedRow();
    state.selectedRow = tr;
    tr.classList.add(SELECTED_CLASS);
    return tr;
  }

  function linhaHistoricoSelecionada() {
    const row = state.selectedRow;
    if (row?.isConnected) return row;
    state.selectedRow = null;
    return null;
  }

  function bindSelection() {
    const tbody = historicoTbodyEl();
    if (!tbody || tbody.dataset.historicoSelectionBound === "1") return;
    tbody.dataset.historicoSelectionBound = "1";
    tbody.addEventListener("click", (ev) => {
      const row = ev.target.closest("tr");
      if (!row || !tbody.contains(row)) return;
      selecionarLinhaHistorico(row);
    });
  }

  function applyVisualRefresh() {
    ensureStyles();
    updateButtonLabels();
    updateTableHeaders();
  }

  function adicionarLinhaPadrao() {
    const list = historicoListEl();
    if (!list) return false;
    const tr = criarLinhaPadrao();
    if (typeof list.prepend === "function") {
      list.prepend(tr);
    } else {
      list.insertBefore(tr, list.firstChild);
    }
    const texto = historicoTextoEl();
    if (texto) texto.value = "";
    if (typeof fichaSetTab === "function") fichaSetTab("historico");
    selecionarLinhaHistorico(tr);
    return true;
  }

  function removerPrimeiraLinha() {
    const list = historicoListEl();
    if (!list) return false;
    const tr = list.querySelector("tr");
    if (!tr) return false;
    if (state.selectedRow === tr) clearSelectedRow();
    tr.remove();
    return true;
  }

  function limparTela() {
    const list = historicoListEl();
    if (list) list.innerHTML = "";
    const texto = historicoTextoEl();
    if (texto) texto.value = "";
    clearSelectedRow();
    return true;
  }

  function bind() {
    if (!ficha) return;
    applyVisualRefresh();
    bindSelection();

    const novo = ficha.historicoNovo;
    const alterar = ficha.historicoAlterar;
    const eliminar = ficha.historicoEliminar;
    const confirmar = ficha.historicoConfirmar;

    if (novo && novo.dataset.historicoBound !== "1") {
      novo.dataset.historicoBound = "1";
      novo.addEventListener("click", () => {
        adicionarLinhaPadrao();
      });
    }
    if (alterar && alterar.dataset.historicoBound !== "1") {
      alterar.dataset.historicoBound = "1";
      alterar.addEventListener("click", () => {
        footerMsg.textContent = "Edicao de linha em planejamento.";
      });
    }
    if (eliminar && eliminar.dataset.historicoBound !== "1") {
      eliminar.dataset.historicoBound = "1";
      eliminar.addEventListener("click", () => {
        removerPrimeiraLinha();
        footerMsg.textContent = "Historico removido em tela.";
      });
    }
    if (confirmar && confirmar.dataset.historicoBound !== "1") {
      confirmar.dataset.historicoBound = "1";
      confirmar.addEventListener("click", () => {
        footerMsg.textContent = "Propriedades da linha em planejamento.";
      });
    }
  }

  async function onLimparNovo() {
    limparTela();
  }

  function onPacienteAplicado() {}

  function beforeAbandonar() {
    return true;
  }

  function beforeSetTab() {
    return true;
  }

  const module = {
    meta: {
      name: MODULE_NAME,
      version: MODULE_VERSION,
      status: "passive-bridge",
      controlsFlow: false,
    },
    bind,
    criarLinhaPadrao,
    adicionarLinhaPadrao,
    removerPrimeiraLinha,
    limparTela,
    onLimparNovo,
    onPacienteAplicado,
    beforeAbandonar,
    beforeSetTab,
    selecionarLinhaHistorico,
    linhaHistoricoSelecionada,
  };

  Object.freeze(module.meta);
  Object.freeze(module);

  window.BranaFichaPessoalAbaHistorico = module;
})();
