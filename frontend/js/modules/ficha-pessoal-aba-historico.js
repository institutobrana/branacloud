(function () {
  "use strict";

  const MODULE_NAME = "BranaFichaPessoalAbaHistorico";
  const MODULE_VERSION = "subetapa-8-edita-linha";
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
    activeCellIndex: 0,
    editingRow: null,
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
    tr.dataset.historicoNovo = "1";
    tr.dataset.historicoEstado = "rascunho";
    tr.innerHTML = `<td>${data}</td><td>Sistema</td><td>-</td><td>Historico criado manualmente</td>`;
    tr.dataset.historicoSnapshot = tr.innerHTML;
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
    if (state.editingRow?.isConnected) {
      definirLinhaHistoricoEditavel(state.editingRow, false);
    }
    state.selectedRow = null;
    state.activeCellIndex = 0;
    state.editingRow = null;
  }

  function historicoCelulas(tr) {
    return Array.from(tr?.querySelectorAll("td") || []);
  }

  function historicoRegistroAtual(tr) {
    const cells = historicoCelulas(tr).map((td) => String(td?.textContent || "").trim());
    if (!cells.length) return null;
    return {
      cells,
      estado: linhaHistoricoEstado(tr),
      selected_cell_index: state.selectedRow === tr ? Math.max(0, Math.min(Number(state.activeCellIndex || 0) || 0, cells.length - 1)) : 0,
      selecionada: state.selectedRow === tr,
    };
  }

  function eventoHistoricoAlvo(ev) {
    return ev?.target instanceof Element ? ev.target : null;
  }

  function definirCelulaAtiva(tr, index = 0) {
    const cells = historicoCelulas(tr);
    if (!cells.length) return null;
    const alvo = Math.max(0, Math.min(Number(index) || 0, cells.length - 1));
    cells.forEach((cell, idx) => {
      cell.tabIndex = idx === alvo ? 0 : -1;
    });
    state.selectedRow = tr;
    state.activeCellIndex = alvo;
    tr.classList.add(SELECTED_CLASS);
    return cells[alvo] || null;
  }

  function linhaHistoricoEstado(tr) {
    return String(tr?.dataset?.historicoEstado || (tr?.dataset?.historicoNovo === "1" ? "rascunho" : "confirmada")).trim() || "confirmada";
  }

  function marcarLinhaHistoricoEstado(tr, estado) {
    if (!(tr instanceof HTMLElement)) return;
    tr.dataset.historicoEstado = String(estado || "").trim() || "confirmada";
  }

  function guardarSnapshotLinhaHistorico(tr) {
    if (!(tr instanceof HTMLElement)) return;
    tr.dataset.historicoSnapshot = tr.innerHTML;
  }

  function restaurarSnapshotLinhaHistorico(tr) {
    const html = String(tr?.dataset?.historicoSnapshot || "");
    if (!html) return false;
    tr.innerHTML = html;
    return true;
  }

  function definirLinhaHistoricoEditavel(tr, editable) {
    const cells = historicoCelulas(tr);
    cells.forEach((cell, idx) => {
      cell.contentEditable = editable ? "true" : "false";
      cell.spellcheck = false;
      cell.tabIndex = idx === state.activeCellIndex ? 0 : -1;
    });
    return cells;
  }

  function ativarEdicaoLinhaHistorico(tr, index = 0) {
    if (!(tr instanceof HTMLElement)) return null;
    const cells = historicoCelulas(tr);
    if (!cells.length) return null;
    const alvo = Math.max(0, Math.min(Number(index) || 0, cells.length - 1));

    if (state.editingRow && state.editingRow !== tr && state.editingRow.isConnected) {
      definirLinhaHistoricoEditavel(state.editingRow, false);
    }

    if (state.editingRow !== tr) {
      if (linhaHistoricoEstado(tr) !== "rascunho") {
        guardarSnapshotLinhaHistorico(tr);
        marcarLinhaHistoricoEstado(tr, "edicao");
        delete tr.dataset.historicoNovo;
      }
      state.editingRow = tr;
    }

    definirCelulaAtiva(tr, alvo);
    definirLinhaHistoricoEditavel(tr, true);
    return cells[alvo] || null;
  }

  function focarCelulaHistorico(tr, index = 0) {
    const cell = ativarEdicaoLinhaHistorico(tr, index);
    if (!(cell instanceof HTMLElement)) return;
    try {
      cell.focus({ preventScroll: true });
    } catch {
      cell.focus();
    }
  }

  function selecionarLinhaHistorico(tr) {
    if (!(tr instanceof HTMLElement)) return null;
    const tbody = historicoTbodyEl();
    if (!tbody || !tbody.contains(tr)) return null;
    if (state.selectedRow && state.selectedRow !== tr) {
      state.selectedRow.classList.remove(SELECTED_CLASS);
      if (state.editingRow && state.editingRow !== tr && state.editingRow.isConnected) {
        definirLinhaHistoricoEditavel(state.editingRow, false);
      }
      if (state.editingRow && state.editingRow !== tr) {
        state.editingRow = null;
      }
    }
    definirCelulaAtiva(tr, state.activeCellIndex);
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
      const alvo = eventoHistoricoAlvo(ev);
      const cell = alvo?.closest("td") || null;
      const row = alvo?.closest("tr") || null;
      if (!row || !tbody.contains(row)) return;
      if (cell && row.contains(cell)) {
        const idx = historicoCelulas(row).indexOf(cell);
        selecionarLinhaHistorico(row);
        if (idx >= 0) focarCelulaHistorico(row, idx);
        return;
      }
      selecionarLinhaHistorico(row);
    });
    tbody.addEventListener("focusin", (ev) => {
      const alvo = eventoHistoricoAlvo(ev);
      const cell = alvo?.closest("td") || null;
      const row = alvo?.closest("tr") || null;
      if (!cell || !row || !tbody.contains(row)) return;
      const idx = historicoCelulas(row).indexOf(cell);
      if (idx < 0) return;
      ativarEdicaoLinhaHistorico(row, idx);
    });
    tbody.addEventListener("keydown", (ev) => {
      const alvo = eventoHistoricoAlvo(ev);
      const cell = alvo?.closest("td") || null;
      const row = alvo?.closest("tr") || null;
      if (!cell || !row || !tbody.contains(row)) return;
      if (ev.key === "Enter") {
        ev.preventDefault();
        confirmarLinhaHistoricoLocal(row);
        return;
      }
      if (ev.key === "Escape") {
        ev.preventDefault();
        cancelarLinhaHistoricoLocal(row);
        return;
      }
      if (ev.key !== "Tab") return;
      const cells = historicoCelulas(row);
      const currentIndex = cells.indexOf(cell);
      if (currentIndex < 0) return;
      ev.preventDefault();
      const delta = ev.shiftKey ? -1 : 1;
      const nextIndex = Math.max(0, Math.min(currentIndex + delta, cells.length - 1));
      selecionarLinhaHistorico(row);
      focarCelulaHistorico(row, nextIndex);
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
    const ativa = linhaHistoricoSelecionada();
    if (ativa?.parentNode === list && typeof ativa.after === "function") {
      ativa.after(tr);
    } else if (list.lastElementChild && typeof list.appendChild === "function") {
      list.appendChild(tr);
    } else if (typeof list.prepend === "function") {
      list.prepend(tr);
    } else {
      list.insertBefore(tr, list.firstChild);
    }
    const texto = historicoTextoEl();
    if (texto) texto.value = "";
    if (typeof fichaSetTab === "function") fichaSetTab("historico");
    focarCelulaHistorico(tr, 0);
    return true;
  }

  function confirmarLinhaHistoricoLocal(tr) {
    if (!(tr instanceof HTMLElement)) return false;
    const tbody = historicoTbodyEl();
    if (!tbody || !tbody.contains(tr)) return false;
    const indiceAtual = Math.max(0, Math.min(state.activeCellIndex || 0, historicoCelulas(tr).length - 1));
    selecionarLinhaHistorico(tr);
    definirCelulaAtiva(tr, indiceAtual);
    definirLinhaHistoricoEditavel(tr, false);
    marcarLinhaHistoricoEstado(tr, "confirmada");
    delete tr.dataset.historicoNovo;
    guardarSnapshotLinhaHistorico(tr);
    if (state.editingRow === tr) state.editingRow = null;
    const abriuNova = adicionarLinhaPadrao();
    if (!abriuNova) {
      focarCelulaHistorico(tr, indiceAtual);
    }
    return true;
  }

  function removerLinhaHistorico(tr, fallbackIndex = 0) {
    const list = historicoListEl();
    if (!list || !(tr instanceof HTMLElement) || !list.contains(tr)) return false;
    const anterior = tr.previousElementSibling instanceof HTMLElement ? tr.previousElementSibling : null;
    const posterior = tr.nextElementSibling instanceof HTMLElement ? tr.nextElementSibling : null;
    if (state.editingRow === tr) state.editingRow = null;
    if (state.selectedRow === tr) {
      tr.classList.remove(SELECTED_CLASS);
    }
    tr.remove();
    const destino = anterior || posterior;
    if (destino) {
      const indice = Math.max(0, Math.min(Number(fallbackIndex) || 0, historicoCelulas(destino).length - 1));
      selecionarLinhaHistorico(destino);
      focarCelulaHistorico(destino, indice);
    } else {
      clearSelectedRow();
    }
    return true;
  }

  function cancelarLinhaHistoricoLocal(tr) {
    if (!(tr instanceof HTMLElement)) return false;
    const tbody = historicoTbodyEl();
    if (!tbody || !tbody.contains(tr)) return false;
    const estado = linhaHistoricoEstado(tr);
    const indiceAtual = Math.max(0, Math.min(state.activeCellIndex || 0, historicoCelulas(tr).length - 1));
    if (estado === "rascunho") {
      return removerLinhaHistorico(tr, indiceAtual);
    }
    restaurarSnapshotLinhaHistorico(tr);
    marcarLinhaHistoricoEstado(tr, "confirmada");
    delete tr.dataset.historicoNovo;
    definirLinhaHistoricoEditavel(tr, false);
    if (state.editingRow === tr) state.editingRow = null;
    selecionarLinhaHistorico(tr);
    const cell = definirCelulaAtiva(tr, indiceAtual);
    if (cell instanceof HTMLElement) {
      try {
        cell.focus({ preventScroll: true });
      } catch {
        cell.focus();
      }
    }
    return true;
  }

  function editarLinhaHistoricoSelecionada() {
    const tr = linhaHistoricoSelecionada();
    if (!(tr instanceof HTMLElement)) {
      if (typeof footerMsg !== "undefined" && footerMsg) footerMsg.textContent = "Selecione uma linha para edicao.";
      return false;
    }
    const indice = Math.max(0, Math.min(state.activeCellIndex || 0, historicoCelulas(tr).length - 1));
    focarCelulaHistorico(tr, indice);
    if (typeof footerMsg !== "undefined" && footerMsg) footerMsg.textContent = "Linha em edicao.";
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
        editarLinhaHistoricoSelecionada();
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

  function aplicarHistoricoAba(payload) {
    const list = historicoListEl();
    if (!list) return false;
    const dados = payload && typeof payload === "object" ? payload : null;
    const linhas = Array.isArray(dados?.rows) ? dados.rows : [];
    list.innerHTML = "";
    clearSelectedRow();
    if (!linhas.length) return true;

    let selecionada = null;
    let selecionadaIdx = 0;
    linhas.forEach((linha, idx) => {
      const tr = document.createElement("tr");
      const cells = Array.isArray(linha?.cells) ? linha.cells.slice(0, 4) : [];
      while (cells.length < 4) cells.push("");
      cells.forEach((valor) => {
        const td = document.createElement("td");
        td.textContent = String(valor ?? "").trim();
        td.tabIndex = -1;
        tr.appendChild(td);
      });
      const estado = String(linha?.estado || "confirmada").trim() || "confirmada";
      marcarLinhaHistoricoEstado(tr, estado);
      if (estado === "rascunho") tr.dataset.historicoNovo = "1";
      tr.dataset.historicoSnapshot = tr.innerHTML;
      list.appendChild(tr);
      if (!selecionada && (linha?.selecionada || Number(dados?.selected_index) === idx)) {
        selecionada = tr;
        selecionadaIdx = Math.max(0, Math.min(Number(linha?.selected_cell_index) || 0, cells.length - 1));
      }
    });

    const alvo = selecionada || list.querySelector("tr");
    if (alvo instanceof HTMLElement) {
      clearSelectedRow();
      definirCelulaAtiva(alvo, selecionada ? selecionadaIdx : 0);
    }
    return true;
  }

  function serializarHistoricoAba() {
    const list = historicoListEl();
    if (!list) return null;
    const rows = Array.from(list.querySelectorAll("tr"))
      .map((tr, idx) => {
        const registro = historicoRegistroAtual(tr);
        if (!registro) return null;
        return {
          ...registro,
          row_index: idx,
        };
      })
      .filter(Boolean);
    if (!rows.length) return null;
    const selectedIndex = rows.findIndex((row) => row?.selecionada);
    return {
      versao: 1,
      rows,
      selected_index: selectedIndex >= 0 ? selectedIndex : null,
    };
  }

  function onPacienteAplicado(extraHistorico = null) {
    aplicarHistoricoAba(extraHistorico?.historico_aba ?? null);
  }

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
      status: "local-edicao-linha",
      controlsFlow: false,
    },
    bind,
    criarLinhaPadrao,
    aplicarHistoricoAba,
    serializarHistoricoAba,
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
