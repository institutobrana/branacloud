(function () {
  "use strict";

  const MODULE_NAME = "BranaFichaPessoalAbaHistorico";
  const MODULE_VERSION = "subetapa-13-refatoracao-propriedades-linha-modulo-proprio";
  const STYLE_ID = "ficha-historico-visual-style";
  const SELECTED_CLASS = "is-selected";
  const HISTORICO_PRESTADORES_URL = "/cadastros/prestadores";
  const BUTTON_LABELS = {
    novo: "Inserir linha",
    alterar: "Editar linha",
    eliminar: "Excluir linha",
    confirmar: "Propriedades da linha",
  };
  const TABLE_HEADERS = ["Data", "Cirurgiao", "Regiao", "Descricao"];
  const HISTORICO_CAMPOS_LOCAIS = Object.freeze({
    cirurgiao: Object.freeze({
      chave: "cirurgiao",
      indice: 1,
      rotulo: "Cirurgiao",
      tipoAtual: "texto local",
      origemAtual: "local/manual",
    }),
    regiao: Object.freeze({
      chave: "regiao",
      indice: 2,
      rotulo: "Regiao",
      tipoAtual: "texto local",
      origemAtual: "local/manual",
    }),
  });
  const state = {
    selectedRow: null,
    activeCellIndex: 0,
    editingRow: null,
    propertiesRow: null,
  };
  let historicoPrestadoresCache = [];
  let historicoPrestadoresCarregando = null;

  function historicoListEl() {
    return ficha?.historicoList || null;
  }

  function historicoTextoEl() {
    return ficha?.historicoTexto || null;
  }

  function criarLinhaPadrao() {
    const agora = new Date();
    const data = agora.toLocaleDateString("pt-BR");
    const hora = agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    const tr = document.createElement("tr");
    tr.dataset.historicoNovo = "1";
    tr.dataset.historicoEstado = "rascunho";
    tr.dataset.historicoCorFundo = "Branco";
    tr.dataset.historicoDataInsercao = `${data} ${hora} - ${String(sessaoAtual?.apelido || sessaoAtual?.nome || "").trim()}`;
    tr.dataset.historicoDataAtualizacao = "";
    tr.innerHTML = `<td>${data}</td><td></td><td>-</td><td>Historico criado manualmente</td>`;
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

  function historicoTextoNormalizado(value) {
    return String(value ?? "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function historicoPrestadorRotulo(item) {
    const nome = String(item?.nome || item?.apelido || "").trim();
    const codigo = String(item?.codigo || "").trim();
    if (codigo && nome) return `${codigo} - ${nome}`;
    return nome || codigo || "";
  }

  function historicoPrestadorNomeVisivel(item) {
    return String(item?.nome || item?.apelido || item?.codigo || "").trim();
  }

  function historicoNormalizarPrestador(item, idx = 0) {
    const nome = historicoPrestadorNomeVisivel(item) || `Prestador ${idx + 1}`;
    return {
      id: Number(item?.id || item?.row_id || idx + 1) || 0,
      row_id: Number(item?.row_id || item?.id || idx + 1) || 0,
      codigo: String(item?.codigo || "").trim(),
      nome,
      apelido: String(item?.apelido || "").trim(),
      ativo: item?.ativo !== false,
    };
  }

  function historicoCatalogoPrestadoresBase() {
    if (typeof prestadoresCache !== "undefined" && Array.isArray(prestadoresCache) && prestadoresCache.length) {
      return prestadoresCache;
    }
    if (Array.isArray(window.prestadoresCache) && window.prestadoresCache.length) {
      return window.prestadoresCache;
    }
    return historicoPrestadoresCache;
  }

  function historicoPrestadoresCatalogoAtual() {
    const base = historicoCatalogoPrestadoresBase();
    return Array.isArray(base) ? base.map((item, idx) => historicoNormalizarPrestador(item, idx)) : [];
  }

  function historicoEncontrarPrestadorPorTexto(valor, catalogo = historicoPrestadoresCatalogoAtual()) {
    const texto = String(valor ?? "").trim();
    if (!texto) return null;
    const normalizado = historicoTextoNormalizado(texto);
    const idNumerico = Number(texto);
    const base = Array.isArray(catalogo) ? catalogo : [];
    return base.find((item) => {
      const itemId = Number(item?.id || item?.row_id || 0);
      if (Number.isFinite(idNumerico) && idNumerico > 0 && itemId === idNumerico) return true;
      const codigo = historicoTextoNormalizado(item?.codigo);
      const nome = historicoTextoNormalizado(item?.nome);
      const apelido = historicoTextoNormalizado(item?.apelido);
      const rotulo = historicoTextoNormalizado(historicoPrestadorRotulo(item));
      return normalizado === codigo || normalizado === nome || normalizado === apelido || normalizado === rotulo;
    }) || null;
  }

  function historicoDefinirCirurgiaoLinha(tr, itemOuTexto, prestadorId = null) {
    if (!(tr instanceof HTMLElement)) return "";
    const cell = historicoCelulas(tr)[1];
    if (!cell) return "";
    const item = typeof itemOuTexto === "object" && itemOuTexto ? itemOuTexto : historicoEncontrarPrestadorPorTexto(itemOuTexto);
    const textoVisivel = item ? historicoPrestadorNomeVisivel(item) : String(itemOuTexto ?? "").trim();
    cell.textContent = textoVisivel;
    tr.dataset.historicoCirurgiaoId = item ? String(Number(item.id || item.row_id || 0) || "") : String(prestadorId || "").trim();
    tr.dataset.historicoCirurgiaoNome = textoVisivel;
    return textoVisivel;
  }

  function historicoSincronizarCirurgiaoLinha(tr, catalogo = historicoPrestadoresCatalogoAtual()) {
    if (!(tr instanceof HTMLElement)) {
      return { prestadorId: null, prestadorNome: "" };
    }
    const cell = historicoCelulas(tr)[1];
    if (!cell) return { prestadorId: null, prestadorNome: "" };
    const textoAtual = String(cell.textContent || "").trim();
    const idAnterior = String(tr.dataset.historicoCirurgiaoId || "").trim();
    const nomeAnterior = String(tr.dataset.historicoCirurgiaoNome || "").trim();
    const item = historicoEncontrarPrestadorPorTexto(textoAtual, catalogo);
    if (item) {
      const nome = historicoPrestadorNomeVisivel(item);
      tr.dataset.historicoCirurgiaoId = String(Number(item.id || item.row_id || 0) || "");
      tr.dataset.historicoCirurgiaoNome = nome;
      if (textoAtual !== nome) {
        cell.textContent = nome;
      }
      return { prestadorId: Number(item.id || item.row_id || 0) || null, prestadorNome: nome };
    }
    if (idAnterior && textoAtual && textoAtual === nomeAnterior) {
      const nome = nomeAnterior || textoAtual;
      if (nome) {
        cell.textContent = nome;
      }
      tr.dataset.historicoCirurgiaoId = idAnterior;
      tr.dataset.historicoCirurgiaoNome = nome;
      return { prestadorId: Number(idAnterior) || null, prestadorNome: nome };
    }
    tr.dataset.historicoCirurgiaoId = "";
    tr.dataset.historicoCirurgiaoNome = textoAtual;
    return { prestadorId: null, prestadorNome: textoAtual };
  }

  async function historicoGarantirPrestadoresCatalogo(forceReload = false) {
    if (!forceReload) {
      const atual = historicoPrestadoresCatalogoAtual();
      if (atual.length) {
        historicoPrestadoresCache = atual;
        return atual;
      }
      if (historicoPrestadoresCarregando) return historicoPrestadoresCarregando;
    }

    historicoPrestadoresCarregando = (async () => {
      try {
        const { res, data } = await requestJson("GET", HISTORICO_PRESTADORES_URL, undefined, true);
        const itens = res.ok && data && Array.isArray(data.itens)
          ? data.itens.map((item, idx) => historicoNormalizarPrestador(item, idx))
          : [];
        historicoPrestadoresCache = itens.length ? itens : historicoPrestadoresCache;
        if (historicoPrestadoresCache.length) {
          historicoReconciliarCirurgioesVisiveis();
        }
        return historicoPrestadoresCache;
      } catch {
        const base = historicoCatalogoPrestadoresBase();
        historicoPrestadoresCache = Array.isArray(base) ? base.map((item, idx) => historicoNormalizarPrestador(item, idx)) : [];
        return historicoPrestadoresCache;
      }
    })();

    try {
      return await historicoPrestadoresCarregando;
    } finally {
      historicoPrestadoresCarregando = null;
    }
  }

  function historicoReconciliarCirurgioesVisiveis() {
    const list = historicoListEl();
    if (!list) return;
    const catalogo = historicoPrestadoresCatalogoAtual();
    if (!catalogo.length) return;
    list.querySelectorAll("tr").forEach((tr) => {
      if (!(tr instanceof HTMLElement)) return;
      const cell = historicoCelulas(tr)[1];
      if (!cell) return;
      const id = String(tr.dataset.historicoCirurgiaoId || "").trim();
      const itemPorId = id ? catalogo.find((item) => String(Number(item.id || item.row_id || 0) || "") === id) : null;
      if (itemPorId) {
        historicoDefinirCirurgiaoLinha(tr, itemPorId);
        return;
      }
      historicoSincronizarCirurgiaoLinha(tr, catalogo);
    });
  }

  function historicoCirurgiaoPadraoSessao() {
    const prestadorId = Number(sessaoAtual?.prestador_id || 0) || 0;
    if (!prestadorId) return null;
    const catalogo = historicoPrestadoresCatalogoAtual();
    const resolvido = historicoEncontrarPrestadorPorTexto(String(prestadorId), catalogo);
    if (resolvido) {
      return {
        prestadorId: Number(resolvido.id || resolvido.row_id || 0) || prestadorId,
        prestadorNome: historicoPrestadorNomeVisivel(resolvido),
      };
    }
    const fallbackNome = String(sessaoAtual?.apelido || sessaoAtual?.nome || prestadorId || "").trim();
    return {
      prestadorId,
      prestadorNome: fallbackNome,
    };
  }

  function historicoRegistroAtual(tr) {
    historicoSincronizarCirurgiaoLinha(tr);
    const cells = historicoCelulas(tr).map((td) => String(td?.textContent || "").trim());
    if (!cells.length) return null;
    return {
      cells,
      estado: linhaHistoricoEstado(tr),
      selected_cell_index: state.selectedRow === tr ? Math.max(0, Math.min(Number(state.activeCellIndex || 0) || 0, cells.length - 1)) : 0,
      selecionada: state.selectedRow === tr,
      cirurgiao_prestador_id: String(tr?.dataset?.historicoCirurgiaoId || "").trim() || null,
      cirurgiao_prestador_nome: String(tr?.dataset?.historicoCirurgiaoNome || "").trim() || null,
      cor_fundo: String(tr?.dataset?.historicoCorFundo || "").trim() || null,
      data_insercao: String(tr?.dataset?.historicoDataInsercao || "").trim() || null,
      data_atualizacao: String(tr?.dataset?.historicoDataAtualizacao || "").trim() || null,
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
    historicoSincronizarCirurgiaoLinha(tr);
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

  function historicoTextoCelula(tr, index) {
    return String(historicoCelulas(tr)[index]?.textContent || "").trim();
  }

  function historicoDefinirTextoCelula(tr, index, value) {
    const cells = historicoCelulas(tr);
    if (!cells[index]) return false;
    cells[index].textContent = String(value ?? "").trim();
    return true;
  }

  function historicoCampoDefinirCirurgiao(tr, value, prestadorId = null) {
    return historicoDefinirCirurgiaoLinha(tr, value, prestadorId);
  }

  function historicoCampoLocal(chave) {
    return HISTORICO_CAMPOS_LOCAIS[chave] || null;
  }

  function historicoCampoCelula(tr, chave) {
    const campo = historicoCampoLocal(chave);
    if (!campo) return null;
    return historicoCelulas(tr)[campo.indice] || null;
  }

  function historicoCampoTexto(tr, chave) {
    return String(historicoCampoCelula(tr, chave)?.textContent || "").trim();
  }

  function historicoCampoDefinirTexto(tr, chave, value) {
    const cell = historicoCampoCelula(tr, chave);
    if (!cell) return false;
    cell.textContent = String(value ?? "").trim();
    return true;
  }

  const historicoPropsModule =
    typeof window.BranaFichaPessoalAbaHistoricoPropriedadesDaLinhaFactory === "function"
      ? window.BranaFichaPessoalAbaHistoricoPropriedadesDaLinhaFactory({
          getSelectedRow: () => linhaHistoricoSelecionada(),
          getActiveCellIndex: () => state.activeCellIndex,
          getPrestadoresCatalogo: () => historicoPrestadoresCatalogoAtual(),
          ensurePrestadoresCatalogo: () => historicoGarantirPrestadoresCatalogo(),
          historicoCelulas,
          historicoTextoCelula,
          historicoCampoTexto,
          historicoCampoDefinirTexto,
          historicoDefinirTextoCelula,
          historicoCampoDefinirCirurgiao,
          historicoEncontrarPrestadorPorTexto,
          historicoSincronizarCirurgiaoLinha,
          definirLinhaHistoricoEditavel,
          selecionarLinhaHistorico,
          definirCelulaAtiva,
          guardarSnapshotLinhaHistorico,
          linhaHistoricoEstado,
          marcarLinhaHistoricoEstado,
          setPropertiesRow: (row) => {
            state.propertiesRow = row;
          },
          setEditingRow: (row) => {
            state.editingRow = row;
          },
          setStatusMessage: (msg) => {
            if (typeof footerMsg !== "undefined" && footerMsg) footerMsg.textContent = msg;
          },
        })
      : null;

  function historicoAbrirPropriedadesLinhaSelecionada() {
    if (!historicoPropsModule) {
      if (typeof footerMsg !== "undefined" && footerMsg) footerMsg.textContent = "Tela de propriedades indisponivel.";
      return false;
    }
    return historicoPropsModule.abrir();
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
    const padraoCirurgiao = historicoCirurgiaoPadraoSessao();
    if (padraoCirurgiao) {
      historicoCampoDefinirCirurgiao(tr, padraoCirurgiao.prestadorNome || "", padraoCirurgiao.prestadorId);
    } else {
      historicoCampoDefinirCirurgiao(tr, "", null);
    }
    historicoSincronizarCirurgiaoLinha(tr);
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

  function eliminarLinhaHistoricoSelecionada() {
    const tr = linhaHistoricoSelecionada();
    if (!(tr instanceof HTMLElement)) {
      if (typeof footerMsg !== "undefined" && footerMsg) footerMsg.textContent = "Selecione uma linha para eliminar.";
      return false;
    }
    const indice = Math.max(0, Math.min(state.activeCellIndex || 0, historicoCelulas(tr).length - 1));
    const eliminada = removerLinhaHistorico(tr, indice);
    if (eliminada && typeof footerMsg !== "undefined" && footerMsg) {
      footerMsg.textContent = "Linha eliminada.";
    }
    return eliminada;
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
    historicoPropsModule?.ensureStyles?.();
    bindSelection();
    void historicoGarantirPrestadoresCatalogo().catch(() => {});

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
        eliminarLinhaHistoricoSelecionada();
      });
    }
    if (confirmar && confirmar.dataset.historicoBound !== "1") {
      confirmar.dataset.historicoBound = "1";
      confirmar.addEventListener("click", () => {
        void historicoAbrirPropriedadesLinhaSelecionada();
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
      const cirurgiaoId = linha?.cirurgiao_prestador_id ?? linha?.cirurgiao_id ?? null;
      const cirurgiaoNome = String(linha?.cirurgiao_prestador_nome || linha?.cirurgiao_nome || cells[1] || "").trim();
      if (cirurgiaoId || cirurgiaoNome) {
        historicoCampoDefinirCirurgiao(tr, cirurgiaoNome, cirurgiaoId);
      } else {
        historicoCampoDefinirCirurgiao(tr, "", null);
      }
      tr.dataset.historicoCorFundo = String(linha?.cor_fundo || linha?.cor || "Branco").trim() || "Branco";
      tr.dataset.historicoDataInsercao = String(linha?.data_insercao || linha?.dataInsercao || "").trim();
      tr.dataset.historicoDataAtualizacao = String(linha?.data_atualizacao || linha?.dataAtualizacao || "").trim();
      historicoSincronizarCirurgiaoLinha(tr);
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
    void historicoGarantirPrestadoresCatalogo().catch(() => {});
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
      status: "refatoracao-propriedades-linha-modulo-proprio",
      controlsFlow: false,
    },
    bind,
    criarLinhaPadrao,
    aplicarHistoricoAba,
    serializarHistoricoAba,
    adicionarLinhaPadrao,
    removerPrimeiraLinha,
    eliminarLinhaHistoricoSelecionada,
    historicoAbrirPropriedadesLinhaSelecionada,
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
