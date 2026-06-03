(function () {
  "use strict";

  const MODULE_NAME = "BranaFichaPessoalAbaHistorico";
  const MODULE_VERSION = "subetapa-18-historico-bloqueio-saida-linha-vazia";
  const STYLE_ID = "ficha-historico-visual-style";
  const AVISO_ID = "ficha-hist-aviso-backdrop";
  const SELECTED_CLASS = "is-selected";
  const HISTORICO_PRESTADORES_URL = "/cadastros/prestadores";
  const BUTTON_LABELS = {
    novo: "Inserir linha",
    alterar: "Editar linha",
    eliminar: "Excluir linha",
    confirmar: "Propriedades da linha",
  };
  const TABLE_HEADERS = ["Data", "Cirurgiao", "Regiao", "Descrição do procedimento"];
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
    sortColumnIndex: 0,
    sortDirection: 1,
    sortSequence: 0,
  };
  let historicoPrestadoresCache = [];
  let historicoPrestadoresCarregando = null;
  let historicoEnterGravando = false;

  function historicoListEl() {
    return ficha?.historicoList || null;
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
    tr.innerHTML = `<td>${data}</td><td></td><td>-</td><td></td>`;
    historicoDefinirOrdemLinha(tr, historicoProximaOrdemLinha());
    tr.dataset.historicoSnapshot = tr.innerHTML;
    return tr;
  }

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .ficha-pane[data-ficha-tab="historico"]{display:flex;flex-direction:column;gap:6px;min-height:0}
      .ficha-pane[data-ficha-tab="historico"] .ficha-hist-toolbar{display:flex;justify-content:flex-start;gap:6px;flex-wrap:wrap;margin-bottom:0;padding:4px 0 2px}
      .ficha-pane[data-ficha-tab="historico"] .ficha-hist-toolbar .materiais-btn{min-width:138px;justify-content:flex-start;padding:0 10px}
      .ficha-pane[data-ficha-tab="historico"] .ficha-hist-toolbar .materiais-btn img{width:16px;height:16px}
      .ficha-pane[data-ficha-tab="historico"] .ficha-hist-wrap{flex:1;min-height:0;overflow:auto;border:1px solid #cfd8e3;background:#fff}
      .ficha-pane[data-ficha-tab="historico"] .ficha-list{width:100%;border-collapse:collapse;table-layout:fixed;font:11px Tahoma,sans-serif;background:#fff}
      .ficha-pane[data-ficha-tab="historico"] .ficha-list thead th{background:#f2f6fb;font:700 11px Tahoma,sans-serif;color:#243444;white-space:nowrap}
      .ficha-pane[data-ficha-tab="historico"] .ficha-list th,.ficha-pane[data-ficha-tab="historico"] .ficha-list td{border-bottom:1px solid #d7dfe7;border-right:1px solid #edf1f5;padding:3px 6px;vertical-align:middle;background:#fff;box-sizing:border-box}
      .ficha-pane[data-ficha-tab="historico"] .ficha-list th:last-child,.ficha-pane[data-ficha-tab="historico"] .ficha-list td:last-child{border-right:none}
      .ficha-pane[data-ficha-tab="historico"] .ficha-list th:nth-child(1),.ficha-pane[data-ficha-tab="historico"] .ficha-list td:nth-child(1){width:88px;white-space:nowrap}
      .ficha-pane[data-ficha-tab="historico"] .ficha-list th:nth-child(2),.ficha-pane[data-ficha-tab="historico"] .ficha-list td:nth-child(2){width:108px;white-space:nowrap}
      .ficha-pane[data-ficha-tab="historico"] .ficha-list th:nth-child(3),.ficha-pane[data-ficha-tab="historico"] .ficha-list td:nth-child(3){width:72px;white-space:nowrap}
      .ficha-pane[data-ficha-tab="historico"] .ficha-list th:nth-child(4),.ficha-pane[data-ficha-tab="historico"] .ficha-list td:nth-child(4){width:auto;word-break:break-word;overflow-wrap:anywhere}
      .ficha-pane[data-ficha-tab="historico"] .ficha-list tbody tr{cursor:pointer;height:22px}
      .ficha-pane[data-ficha-tab="historico"] .ficha-list tbody tr:nth-child(even) td{background:#fbfdff}
      .ficha-pane[data-ficha-tab="historico"] .ficha-list tbody tr:hover td{background:#eef5ff}
      .ficha-pane[data-ficha-tab="historico"] .ficha-list tbody tr.${SELECTED_CLASS} td{background:#2f8fe6;color:#fff}
      .ficha-pane[data-ficha-tab="historico"] .ficha-list tbody tr.${SELECTED_CLASS}:hover td{background:#2f8fe6}
      .ficha-pane[data-ficha-tab="historico"] .ficha-list tbody tr.${SELECTED_CLASS} td::selection{background:#fff;color:#2f8fe6}
      .ficha-hist-aviso-backdrop{position:fixed;inset:0;z-index:5200;display:flex;align-items:flex-start;justify-content:center;padding-top:30px;background:rgba(255,255,255,.18)}
      .ficha-hist-aviso-backdrop.hidden{display:none}
      .ficha-hist-aviso-modal{width:min(820px,96vw);min-height:172px;background:#efefef;border:1px solid #d2d2d2;box-shadow:0 10px 26px rgba(0,0,0,.24);box-sizing:border-box;font:12px Tahoma,sans-serif;color:#1f1f1f;display:flex;flex-direction:column}
      .ficha-hist-aviso-head{position:relative;display:flex;align-items:center;justify-content:center;height:38px;padding:0 52px;background:#fff;border-bottom:1px solid #d4d4d4;box-sizing:border-box}
      .ficha-hist-aviso-title{font:400 19px Tahoma,sans-serif;color:#363636;line-height:1;text-align:center}
      .ficha-hist-aviso-close{position:absolute;top:0;right:0;width:50px;height:38px;border:none;border-radius:0;background:#d85a5a;color:#fff;font:700 24px/1 Tahoma,sans-serif;cursor:pointer}
      .ficha-hist-aviso-close:hover{background:#c44747}
      .ficha-hist-aviso-body{display:grid;grid-template-columns:92px 1fr;gap:16px;align-items:center;flex:1;padding:18px 16px 14px}
      .ficha-hist-aviso-icone{width:68px;height:68px;justify-self:center;object-fit:contain}
      .ficha-hist-aviso-texto{font:12px Tahoma,sans-serif;color:#222;line-height:1.4;align-self:start;padding-top:10px}
      .ficha-hist-aviso-actions{display:flex;justify-content:flex-end;padding:0 16px 14px}
      .ficha-hist-aviso-ok{min-width:86px;height:30px;padding:0 18px;border:1px solid #8d8d8d;background:linear-gradient(180deg,#fff 0%,#ececec 100%);font:400 12px Tahoma,sans-serif;color:#111;cursor:pointer;box-shadow:inset 0 1px 0 rgba(255,255,255,.8)}
      .ficha-hist-aviso-ok:hover{background:linear-gradient(180deg,#fff 0%,#e4e4e4 100%)}
    `;
    document.head.appendChild(style);
  }

  function historicoAvisoTitulo() {
    return String(ficha?.titulo?.textContent || "Ficha pessoal -").trim() || "Ficha pessoal -";
  }

  function historicoAvisoEl() {
    let el = document.getElementById(AVISO_ID);
    if (el) return el;
    el = document.createElement("div");
    el.id = AVISO_ID;
    el.className = "ficha-hist-aviso-backdrop hidden";
    el.innerHTML = `
      <div class="ficha-hist-aviso-modal" role="alertdialog" aria-modal="true" aria-labelledby="ficha-hist-aviso-title">
        <div class="ficha-hist-aviso-head">
          <div id="ficha-hist-aviso-title" class="ficha-hist-aviso-title"></div>
          <button type="button" class="ficha-hist-aviso-close" aria-label="Fechar aviso">X</button>
        </div>
        <div class="ficha-hist-aviso-body">
          <img class="ficha-hist-aviso-icone" src="/assets/easy/ico_alerta.bmp" alt="" aria-hidden="true">
          <div class="ficha-hist-aviso-texto"></div>
        </div>
        <div class="ficha-hist-aviso-actions">
          <button type="button" class="ficha-hist-aviso-ok">Ok</button>
        </div>
      </div>
    `;
    const close = el.querySelector(".ficha-hist-aviso-close");
    const ok = el.querySelector(".ficha-hist-aviso-ok");
    const fechar = () => el.classList.add("hidden");
    close?.addEventListener("click", fechar);
    ok?.addEventListener("click", fechar);
    el.addEventListener("click", (ev) => {
      if (ev.target === el) fechar();
    });
    el.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape") {
        ev.preventDefault();
        fechar();
      }
    });
    document.body.appendChild(el);
    return el;
  }

  function historicoMostrarAviso(mensagem) {
    const el = historicoAvisoEl();
    const titulo = el.querySelector(".ficha-hist-aviso-title");
    const texto = el.querySelector(".ficha-hist-aviso-texto");
    const ok = el.querySelector(".ficha-hist-aviso-ok");
    if (titulo) titulo.textContent = historicoAvisoTitulo();
    if (texto) texto.textContent = String(mensagem || "").trim();
    el.classList.remove("hidden");
    if (ok instanceof HTMLElement) {
      try {
        ok.focus({ preventScroll: true });
      } catch {
        ok.focus();
      }
    }
    return true;
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

  function historicoSequenciaOrdenacaoAtual() {
    const list = historicoListEl();
    const maiores = Array.from(list?.querySelectorAll("tr") || []).reduce((max, tr) => {
      const ordem = Number(tr?.dataset?.historicoOrdem || 0) || 0;
      return ordem > max ? ordem : max;
    }, Number(state.sortSequence || 0) || 0);
    state.sortSequence = maiores;
    return maiores;
  }

  function historicoProximaOrdemLinha() {
    const proxima = historicoSequenciaOrdenacaoAtual() + 1;
    state.sortSequence = proxima;
    return proxima;
  }

  function historicoDefinirOrdemLinha(tr, ordem = null) {
    if (!(tr instanceof HTMLElement)) return 0;
    const valor = Number(ordem ?? 0) || 0;
    tr.dataset.historicoOrdem = String(valor);
    state.sortSequence = Math.max(Number(state.sortSequence || 0) || 0, valor);
    return valor;
  }

  function historicoOrdemLinha(tr) {
    return Number(tr?.dataset?.historicoOrdem || 0) || 0;
  }

  function historicoValorOrdenacaoTexto(tr, index) {
    const texto = historicoTextoCelula(tr, index);
    if (index === 0) {
      const data = historicoDataParaComparacao(texto);
      if (data !== null) {
        return { tipo: "data", valor: data };
      }
    }
    return { tipo: "texto", valor: historicoTextoNormalizado(texto) };
  }

  function historicoDataParaComparacao(valor) {
    const texto = String(valor ?? "").trim();
    if (!texto) return null;
    const dataPt = texto.match(/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?/);
    if (dataPt) {
      const dia = Number(dataPt[1]);
      const mes = Number(dataPt[2]);
      const ano = Number(dataPt[3]);
      const hora = Number(dataPt[4] || 0);
      const minuto = Number(dataPt[5] || 0);
      const ts = Date.UTC(ano, mes - 1, dia, hora, minuto, 0, 0);
      return Number.isFinite(ts) ? ts : null;
    }
    const parsed = Date.parse(texto);
    return Number.isFinite(parsed) ? parsed : null;
  }

  function historicoCompararRegistros(trA, trB) {
    const estadoA = linhaHistoricoEstado(trA);
    const estadoB = linhaHistoricoEstado(trB);
    const rascunhoA = estadoA === "rascunho";
    const rascunhoB = estadoB === "rascunho";
    if (rascunhoA !== rascunhoB) {
      return rascunhoA ? 1 : -1;
    }
    const coluna = Math.max(0, Math.min(Number(state.sortColumnIndex || 0) || 0, 3));
    const direcao = Number(state.sortDirection || 1) === -1 ? -1 : 1;
    const valorA = historicoValorOrdenacaoTexto(trA, coluna);
    const valorB = historicoValorOrdenacaoTexto(trB, coluna);
    let comparacao = 0;
    if (valorA.tipo === "data" && valorB.tipo === "data") {
      comparacao = Number(valorA.valor) - Number(valorB.valor);
    } else {
      comparacao = String(valorA.valor).localeCompare(String(valorB.valor), "pt-BR", {
        sensitivity: "base",
        numeric: true,
      });
    }
    if (!comparacao) {
      comparacao = historicoOrdemLinha(trA) - historicoOrdemLinha(trB);
    }
    return comparacao * direcao;
  }

  function historicoOrdenarLinhasDOM() {
    const list = historicoListEl();
    if (!list) return false;
    const rows = Array.from(list.querySelectorAll("tr"));
    if (rows.length < 2) return true;
    const selecionada = state.selectedRow && state.selectedRow.isConnected ? state.selectedRow : null;
    const indiceSelecionado = Math.max(0, Math.min(Number(state.activeCellIndex || 0) || 0, 3));
    const ordenadas = rows.slice().sort(historicoCompararRegistros);
    const mudouOrdem = ordenadas.some((tr, idx) => tr !== rows[idx]);
    if (mudouOrdem) {
      const fragment = document.createDocumentFragment();
      ordenadas.forEach((tr) => fragment.appendChild(tr));
      list.appendChild(fragment);
    }
    if (selecionada) {
      definirCelulaAtiva(selecionada, indiceSelecionado);
    }
    return true;
  }

  function historicoOrdenarRegistrosParaSerializacao(registros) {
    return Array.isArray(registros) ? registros.slice().sort(historicoCompararRegistros) : [];
  }

  function historicoPrestadorRotulo(item) {
    const nome = String(item?.nome || "").trim();
    const apelido = String(item?.apelido || "").trim();
    const codigo = String(item?.codigo || "").trim();
    if (codigo && nome) return `${codigo} - ${nome}`;
    return nome || apelido || codigo || "";
  }

  function historicoPrestadorNomeVisivel(item) {
    return String(item?.apelido || item?.nome || item?.codigo || "").trim();
  }

  function historicoPrestadorNomeBusca(item) {
    return String(item?.nome || item?.apelido || item?.codigo || "").trim();
  }

  function historicoNormalizarPrestador(item, idx = 0) {
    const nome = String(item?.nome || "").trim();
    const apelido = String(item?.apelido || "").trim();
    const nomeVisivel = historicoPrestadorNomeVisivel(item) || `Prestador ${idx + 1}`;
    return {
      id: Number(item?.id || item?.row_id || idx + 1) || 0,
      row_id: Number(item?.row_id || item?.id || idx + 1) || 0,
      codigo: String(item?.codigo || "").trim(),
      nome: nome || nomeVisivel,
      apelido,
      nome_visivel: nomeVisivel,
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

  function historicoBuscarPrestadorPorNome(valor, catalogo = historicoPrestadoresCatalogoAtual()) {
    const texto = historicoTextoNormalizado(valor);
    if (!texto) return null;
    return Array.isArray(catalogo)
      ? catalogo.find((item) => {
          const nome = historicoTextoNormalizado(item?.nome);
          const apelido = historicoTextoNormalizado(item?.apelido);
          return nome.includes(texto) || apelido.includes(texto);
        }) || null
      : null;
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
      const bloqueada = Number(idx) === 1;
      cell.contentEditable = editable && !bloqueada ? "true" : "false";
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
    if (Number(alvo) === 1) {
      definirLinhaHistoricoEditavel(tr, false);
      return cells[alvo] || null;
    }
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

  function historicoLinhaRascunhoAtiva() {
    const list = historicoListEl();
    if (!list) return null;
    return list.querySelector('tr[data-historico-estado="rascunho"], tr[data-historico-novo="1"]') || null;
  }

  function historicoValidarDescricaoObrigatoria(tr, exibirMensagem = true) {
    if (!(tr instanceof HTMLElement)) return false;
    const descricao = String(historicoTextoCelula(tr, 3)).trim();
    if (descricao) return true;
    if (exibirMensagem) {
      historicoMostrarAviso("Campo descrição do procedimento não pode ser nulo.");
    }
    selecionarLinhaHistorico(tr);
    definirCelulaAtiva(tr, 3);
    return false;
  }

  function historicoPodeProsseguirSemDescricaoObrigatoria(exibirMensagem = true) {
    const rascunho = historicoLinhaRascunhoAtiva();
    if (!rascunho) return true;
    return historicoValidarDescricaoObrigatoria(rascunho, exibirMensagem);
  }

  function historicoBloqueioAcaoComRascunhoAtivo(alvo = null, exibirMensagem = true) {
    const rascunho = historicoLinhaRascunhoAtiva();
    if (!rascunho) return true;
    if (alvo && rascunho === alvo) return true;
    if (exibirMensagem) {
      historicoMostrarAviso("Campo descrição do procedimento não pode ser nulo.");
    }
    const indice = Math.max(0, Math.min(state.activeCellIndex || 0, historicoCelulas(rascunho).length - 1));
    selecionarLinhaHistorico(rascunho);
    const cell = definirCelulaAtiva(rascunho, indice);
    if (cell instanceof HTMLElement) {
      try {
        cell.focus({ preventScroll: true });
      } catch {
        cell.focus();
      }
    }
    return false;
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
    if (!historicoBloqueioAcaoComRascunhoAtivo(null, true)) return false;
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
      if (!historicoBloqueioAcaoComRascunhoAtivo(row, true)) return;
      if (cell && row.contains(cell)) {
        const idx = historicoCelulas(row).indexOf(cell);
        selecionarLinhaHistorico(row);
        if (idx >= 0) {
          state.activeCellIndex = idx;
          definirCelulaAtiva(row, idx);
        }
        return;
      }
      selecionarLinhaHistorico(row);
    });
    tbody.addEventListener("dblclick", (ev) => {
      const alvo = eventoHistoricoAlvo(ev);
      const cell = alvo?.closest("td") || null;
      const row = alvo?.closest("tr") || null;
      if (!cell || !row || !tbody.contains(row)) return;
      if (!historicoBloqueioAcaoComRascunhoAtivo(row, true)) return;
      const idx = historicoCelulas(row).indexOf(cell);
      if (idx < 0) return;
      ev.preventDefault();
      selecionarLinhaHistorico(row);
      if (Number(idx) === 1) {
        definirCelulaAtiva(row, idx);
        return;
      }
      focarCelulaHistorico(row, idx);
    });
    tbody.addEventListener("focusin", (ev) => {
      const alvo = eventoHistoricoAlvo(ev);
      const cell = alvo?.closest("td") || null;
      const row = alvo?.closest("tr") || null;
      if (!cell || !row || !tbody.contains(row)) return;
      const idx = historicoCelulas(row).indexOf(cell);
      if (idx < 0) return;
      if (!historicoBloqueioAcaoComRascunhoAtivo(row, true)) return;
      if (Number(idx) === 1) {
        selecionarLinhaHistorico(row);
        definirCelulaAtiva(row, idx);
        return;
      }
      ativarEdicaoLinhaHistorico(row, idx);
    });
    tbody.addEventListener("keydown", (ev) => {
      const alvo = eventoHistoricoAlvo(ev);
      const cell = alvo?.closest("td") || null;
      const row = alvo?.closest("tr") || null;
      if (!cell || !row || !tbody.contains(row)) return;
      if (ev.key === "Enter") {
        ev.preventDefault();
        void confirmarLinhaHistoricoLocal(row, { salvarAposConfirmar: true });
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
    const rascunhoAtivo = historicoLinhaRascunhoAtiva();
    if (rascunhoAtivo) {
      const indice = Math.max(0, Math.min(state.activeCellIndex || 0, historicoCelulas(rascunhoAtivo).length - 1));
      selecionarLinhaHistorico(rascunhoAtivo);
      focarCelulaHistorico(rascunhoAtivo, indice);
      historicoBloqueioAcaoComRascunhoAtivo(null, true);
      return false;
    }
    const tr = criarLinhaPadrao();
    const padraoCirurgiao = historicoCirurgiaoPadraoSessao();
    if (padraoCirurgiao) {
      historicoCampoDefinirCirurgiao(tr, padraoCirurgiao.prestadorNome || "", padraoCirurgiao.prestadorId);
    } else {
      historicoCampoDefinirCirurgiao(tr, "", null);
    }
    historicoSincronizarCirurgiaoLinha(tr);
    if (typeof list.appendChild === "function") {
      list.appendChild(tr);
    } else {
      list.insertBefore(tr, null);
    }
    if (typeof fichaSetTab === "function") fichaSetTab("historico");
    focarCelulaHistorico(tr, 0);
    return true;
  }

  async function confirmarLinhaHistoricoLocal(tr, opcoes = {}) {
    if (!(tr instanceof HTMLElement)) return false;
    const tbody = historicoTbodyEl();
    if (!tbody || !tbody.contains(tr)) return false;
    const salvarAposConfirmar = !!opcoes?.salvarAposConfirmar;
    if (salvarAposConfirmar && historicoEnterGravando) return false;
    if (!historicoValidarDescricaoObrigatoria(tr, true)) return false;
    const indiceAtual = Math.max(0, Math.min(state.activeCellIndex || 0, historicoCelulas(tr).length - 1));
    selecionarLinhaHistorico(tr);
    definirCelulaAtiva(tr, indiceAtual);
    definirLinhaHistoricoEditavel(tr, false);
    marcarLinhaHistoricoEstado(tr, "confirmada");
    delete tr.dataset.historicoNovo;
    guardarSnapshotLinhaHistorico(tr);
    if (state.editingRow === tr) state.editingRow = null;
    historicoOrdenarLinhasDOM();
    if (salvarAposConfirmar) {
      historicoEnterGravando = true;
      try {
        const salvou = typeof fichaSalvarPaciente === "function" ? await fichaSalvarPaciente() : false;
        if (!salvou) {
          selecionarLinhaHistorico(tr);
          const cell = definirCelulaAtiva(tr, indiceAtual);
          if (cell instanceof HTMLElement) {
            try {
              cell.focus({ preventScroll: true });
            } catch {
              cell.focus();
            }
          }
          return false;
        }
        const abriuNova = adicionarLinhaPadrao();
        if (!abriuNova) {
          focarCelulaHistorico(tr, indiceAtual);
        }
        return true;
      } finally {
        historicoEnterGravando = false;
      }
    }
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
    if (!historicoBloqueioAcaoComRascunhoAtivo(null, true)) return false;
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
    if (!historicoBloqueioAcaoComRascunhoAtivo(null, true)) return false;
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

  function validarHistoricoAntesDeGravar() {
    return historicoPodeProsseguirSemDescricaoObrigatoria(true);
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
    clearSelectedRow();
    state.sortSequence = 0;
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
    state.sortSequence = 0;
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
      historicoDefinirOrdemLinha(tr, Number(linha?.row_index ?? idx) + 1);
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

    historicoOrdenarLinhasDOM();
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
    const rows = historicoOrdenarRegistrosParaSerializacao(Array.from(list.querySelectorAll("tr")))
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
    return historicoBloqueioAcaoComRascunhoAtivo(null, true);
  }

  function beforeSetTab(tab) {
    if (String(tab || "") === "historico") return true;
    return historicoBloqueioAcaoComRascunhoAtivo(null, true);
  }

  const module = {
    meta: {
      name: MODULE_NAME,
      version: MODULE_VERSION,
      status: "subetapa-18-bloqueio-saida-linha-vazia",
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
    validarHistoricoAntesDeGravar,
    beforeAbandonar,
    beforeSetTab,
    selecionarLinhaHistorico,
    linhaHistoricoSelecionada,
  };

  Object.freeze(module.meta);
  Object.freeze(module);

  window.BranaFichaPessoalAbaHistorico = module;
})();
