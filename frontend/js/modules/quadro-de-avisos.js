(function () {
  "use strict";

  const MODULE_NAME = "quadro-de-avisos";
  const ENDPOINT = "/agenda-legado/quadro-avisos";
  const USUARIOS_ENDPOINT = `${ENDPOINT}/usuarios`;
  const AVISOS_ENDPOINT = `${ENDPOINT}/avisos`;

  const state = {
    backdrop: null,
    body: null,
    footer: null,
    status: null,
    autoOpenEmAndamento: false,
    dragStop: null,
    filtro: "",
    carregando: false,
    aberto: false,
    dados: null,
    menuBackdrop: null,
    menuBody: null,
    menuFooter: null,
    menuStatus: null,
    menuSelectedId: null,
    menuRows: [],
    formBackdrop: null,
    formMode: "novo",
    formAviso: null
  };

  function escHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function formatMoney(value) {
    const n = Number(value || 0);
    if (!Number.isFinite(n)) return "0,00";
    return n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function formatDateBr(iso) {
    const txt = String(iso || "").trim();
    if (!txt) return "";
    const date = new Date(`${txt.length === 10 ? txt : txt.slice(0, 10)}T00:00:00`);
    if (Number.isNaN(date.getTime())) return txt;
    return date.toLocaleDateString("pt-BR");
  }

  function formatDateInput(iso) {
    const txt = String(iso || "").trim();
    if (!txt) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(txt)) return txt;
    const date = new Date(txt);
    if (Number.isNaN(date.getTime())) return "";
    return date.toISOString().slice(0, 10);
  }

  function parseDateInput(value) {
    const txt = String(value || "").trim();
    if (!txt) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(txt)) return txt;
    const date = new Date(txt);
    if (Number.isNaN(date.getTime())) return "";
    return date.toISOString().slice(0, 10);
  }

  function ensureStyle(doc) {
    if (!doc || doc.getElementById("quadro-avisos-style")) return;
    const style = doc.createElement("style");
    style.id = "quadro-avisos-style";
    style.textContent = [
      "#quadro-avisos-backdrop,.qa-dialog-backdrop{position:fixed;inset:0;z-index:9000;background:rgba(0,0,0,.24);display:flex;align-items:flex-start;justify-content:center;padding:18px;box-sizing:border-box}",
      "#quadro-avisos-backdrop.hidden,.qa-dialog-backdrop.hidden{display:none}",
      ".qa-window{width:min(792px,calc(100vw - 24px));height:min(556px,calc(100vh - 36px));background:#efefef;border:1px solid #a8a8a8;box-shadow:0 8px 30px rgba(0,0,0,.28);display:flex;flex-direction:column;font:12px Tahoma,Arial,sans-serif;color:#111}",
      ".qa-head{display:flex;align-items:center;gap:18px;padding:8px 10px 6px;flex-wrap:wrap;cursor:move;user-select:none}",
      ".qa-head .qa-btn,.qa-head .qa-status{user-select:text}",
      ".qa-btn{display:inline-flex;align-items:center;gap:7px;border:none;background:transparent;color:#111;font:12px Tahoma,Arial,sans-serif;padding:0;cursor:pointer;white-space:nowrap}",
      ".qa-ico{width:18px;height:18px;display:inline-block;position:relative;flex:0 0 18px}",
      ".qa-ico.pin{background:#f4d400;border:1px solid #252525;box-sizing:border-box}",
      ".qa-ico.search{border:2px solid #4c6fa8;border-radius:50%}",
      ".qa-ico.search:after{content:'';position:absolute;right:-2px;bottom:-2px;width:7px;height:2px;background:#4c6fa8;transform:rotate(45deg);transform-origin:right center}",
      ".qa-ico.print{border:1px solid #222;border-radius:2px;background:linear-gradient(#f7f7f7,#d8d8d8)}",
      ".qa-ico.print:before{content:'';position:absolute;left:2px;right:2px;top:-4px;height:5px;border:1px solid #222;background:#fff;border-bottom:none}",
      ".qa-ico.close{border:1px solid #222;background:#fff}",
      ".qa-ico.close:before,.qa-ico.close:after{content:'';position:absolute;left:7px;top:1px;width:2px;height:14px;background:#d72626;transform-origin:center}",
      ".qa-ico.close:before{transform:rotate(45deg)}",
      ".qa-ico.close:after{transform:rotate(-45deg)}",
      ".qa-content{margin:0 8px 8px 8px;border:1px solid #9aa39a;background:#0d8b06;flex:1;overflow:auto;position:relative}",
      ".qa-section{padding:12px 16px 10px}",
      ".qa-section + .qa-section{padding-top:4px}",
      ".qa-title{font:bold 22px Tahoma,Arial,sans-serif;color:#f6f651;text-shadow:1px 1px 0 #1a4d00;line-height:1.05;margin:0 0 8px 0;display:flex;align-items:center;gap:10px}",
      ".qa-title-marker{width:28px;height:28px;border-radius:50%;border:2px solid #111;background:#ffd600;color:#111;display:inline-flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;flex:0 0 28px}",
      ".qa-cols{display:grid;grid-template-columns:82px 1fr 112px;gap:10px;color:#3cf7ff;font:bold 14px Tahoma,Arial,sans-serif;padding:0 0 4px 44px;border-bottom:2px solid rgba(255,255,255,.8);margin-bottom:4px}",
      ".qa-row{display:grid;grid-template-columns:82px 1fr 112px;gap:10px;color:#fff;font:bold 14px Tahoma,Arial,sans-serif;padding:1px 0 1px 44px;align-items:baseline}",
      ".qa-row .value{text-align:right;padding-right:8px}",
      ".qa-total{display:flex;justify-content:space-between;align-items:baseline;color:#f8ef2f;font:bold 14px Tahoma,Arial,sans-serif;padding:4px 4px 0 44px}",
      ".qa-note{color:#fff0a5;font:italic 12px Tahoma,Arial,sans-serif;padding:4px 4px 0 44px}",
      ".qa-empty{color:#d7ffd7;font:italic 12px Tahoma,Arial,sans-serif;padding:4px 4px 0 44px}",
      ".qa-notice-item{padding:2px 44px 8px 44px}",
      ".qa-notice-label{color:#44f0ff;font:bold 14px Tahoma,Arial,sans-serif;line-height:1.2;margin-bottom:2px}",
      ".qa-notice-text{color:#fff;font:bold 18px Tahoma,Arial,sans-serif;white-space:pre-wrap;line-height:1.2}",
      ".qa-actions{display:flex;align-items:center;gap:14px;padding:8px 10px 7px}",
      ".qa-toolbar-spacer{flex:1}",
      ".qa-status{margin-left:auto;color:#444;font:11px Tahoma,Arial,sans-serif}",
      ".qa-actions .qa-btn{font-weight:700}",
      ".qa-dialog-window{width:min(560px,calc(100vw - 24px));background:#efefef;border:1px solid #a8a8a8;box-shadow:0 8px 30px rgba(0,0,0,.28);display:flex;flex-direction:column;font:12px Tahoma,Arial,sans-serif;color:#111}",
      ".qa-dialog-title{padding:8px 10px 6px;font:bold 14px Tahoma,Arial,sans-serif;color:#111;display:flex;justify-content:space-between;align-items:center}",
      ".qa-dialog-body{padding:10px 10px 8px}",
      ".qa-dialog-footer{padding:8px 10px 10px;display:flex;justify-content:flex-end;gap:10px}",
      ".qa-field-grid{display:grid;grid-template-columns:1fr 118px 118px;gap:8px;align-items:start}",
      ".qa-field{display:flex;flex-direction:column;gap:4px}",
      ".qa-field label{font:12px Tahoma,Arial,sans-serif;color:#333}",
      ".qa-input,.qa-select,.qa-textarea{font:12px Tahoma,Arial,sans-serif;border:1px solid #a8a8a8;background:#fff;box-sizing:border-box}",
      ".qa-select,.qa-input{height:26px;padding:4px 6px}",
      ".qa-textarea{width:100%;min-height:120px;resize:vertical;padding:6px;white-space:pre-wrap}",
      ".qa-dialog-actions{display:flex;justify-content:flex-end;gap:10px;margin-top:10px}",
      ".qa-dialog-btn{min-width:78px;height:28px;border:1px solid #8b8b8b;background:linear-gradient(#fff,#e7e7e7);font:12px Tahoma,Arial,sans-serif;cursor:pointer}",
      ".qa-dialog-btn.primary{font-weight:700}",
      ".qa-dialog-btn.danger{border-color:#b05d5d}",
      ".qa-list-head{display:flex;align-items:center;gap:10px;margin-bottom:8px}",
      ".qa-list-toolbar{display:flex;align-items:center;gap:12px;flex-wrap:wrap}",
      ".qa-list-toolbar .qa-btn{font-weight:700}",
      ".qa-list-body{border:1px solid #a8a8a8;background:#fff;min-height:260px;max-height:360px;overflow:auto}",
      ".qa-table{width:100%;border-collapse:collapse;font:12px Tahoma,Arial,sans-serif}",
      ".qa-table thead th{position:sticky;top:0;background:#f2f2f2;border-bottom:1px solid #cfcfcf;text-align:left;padding:6px 8px;font-weight:700}",
      ".qa-table tbody td{padding:4px 8px;border-bottom:1px solid #ececec;vertical-align:top}",
      ".qa-table tbody tr.selected{background:#1d83d5;color:#fff}",
      ".qa-table tbody tr.selected td{border-bottom-color:#1d83d5}",
      ".qa-table tbody tr{cursor:pointer}",
      ".qa-muted{color:#666}",
      ".qa-error{color:#b00020;font-weight:700}",
      "@media print{body *{visibility:hidden !important}#quadro-avisos-backdrop,#quadro-avisos-backdrop *{visibility:visible !important}#quadro-avisos-backdrop{position:static !important;inset:auto !important;background:#fff !important;padding:0 !important}.qa-window{width:100% !important;height:auto !important;box-shadow:none !important;border:none !important}.qa-head{display:none !important}.qa-actions{display:none !important}.qa-content{margin:0 !important;border:none !important;overflow:visible !important;background:#0d8b06 !important;min-height:auto !important}}"
    ].join("");
    doc.head.appendChild(style);
  }

  function ensureUi() {
    if (state.backdrop) return state;
    const doc = document;
    ensureStyle(doc);
    const backdrop = doc.createElement("div");
    backdrop.id = "quadro-avisos-backdrop";
    backdrop.className = "hidden";
    backdrop.innerHTML = [
      '<div class="qa-window" role="dialog" aria-modal="true" aria-label="Quadro de avisos" tabindex="-1">',
      '  <div class="qa-head">',
      '    <button class="qa-btn" type="button" data-action="afixa"><span class="qa-ico pin" aria-hidden="true"></span><span>Afixa</span></button>',
      '    <button class="qa-btn" type="button" data-action="procura"><span class="qa-ico search" aria-hidden="true"></span><span>Procura</span></button>',
      '    <button class="qa-btn" type="button" data-action="imprime"><span class="qa-ico print" aria-hidden="true"></span><span>Imprime</span></button>',
      '    <button class="qa-btn" type="button" data-action="fecha"><span class="qa-ico close" aria-hidden="true"></span><span>Fecha</span></button>',
      '    <span class="qa-status"></span>',
      "  </div>",
      '  <div class="qa-content" tabindex="0"></div>',
      '  <div class="qa-actions">',
      '    <span class="qa-status qa-footer"></span>',
      '    <span class="qa-toolbar-spacer"></span>',
      "  </div>",
      "</div>"
    ].join("");
    doc.body.appendChild(backdrop);

    backdrop.addEventListener("click", (ev) => {
      if (ev.target === backdrop) fechar({ origem: "backdrop" });
    });
    const windowEl = backdrop.querySelector(".qa-window");
    const headEl = backdrop.querySelector(".qa-head");
    let dragState = null;
    const onDragMove = (ev) => {
      if (!dragState || !windowEl) return;
      const dx = ev.clientX - dragState.startX;
      const dy = ev.clientY - dragState.startY;
      const nextLeft = Math.max(8, Math.min(window.innerWidth - dragState.width - 8, dragState.baseLeft + dx));
      const nextTop = Math.max(8, Math.min(window.innerHeight - dragState.height - 8, dragState.baseTop + dy));
      windowEl.style.position = "fixed";
      windowEl.style.left = `${nextLeft}px`;
      windowEl.style.top = `${nextTop}px`;
      windowEl.style.transform = "none";
      windowEl.style.margin = "0";
    };
    const stopDrag = () => {
      if (!dragState) return;
      dragState = null;
      doc.removeEventListener("mousemove", onDragMove, true);
      doc.removeEventListener("mouseup", stopDrag, true);
      doc.body.style.userSelect = "";
    };
    state.dragStop = stopDrag;
    if (headEl && windowEl) {
      headEl.addEventListener("mousedown", (ev) => {
        if (ev.button !== 0) return;
        const target = ev.target;
        if (target instanceof Element && target.closest("button, input, select, textarea, a, [role='button']")) {
          return;
        }
        const rect = windowEl.getBoundingClientRect();
        dragState = {
          startX: ev.clientX,
          startY: ev.clientY,
          baseLeft: rect.left,
          baseTop: rect.top,
          width: rect.width,
          height: rect.height,
        };
        doc.body.style.userSelect = "none";
        doc.addEventListener("mousemove", onDragMove, true);
        doc.addEventListener("mouseup", stopDrag, true);
        ev.preventDefault();
      });
    }
    backdrop.querySelectorAll("[data-action]").forEach((btn) => {
      btn.addEventListener("click", async (ev) => {
        const action = String(ev.currentTarget?.dataset?.action || "");
        if (action === "fecha") {
          fechar({ origem: "botao" });
          return;
        }
        if (action === "imprime") {
          if (typeof window.print === "function") window.print();
          return;
        }
        if (action === "procura") {
          await abrirMenuAvisos();
          return;
        }
        if (action === "afixa") {
          await abrirFormAviso();
        }
      });
    });
    doc.addEventListener("keydown", (ev) => {
      if (!state.aberto) return;
      if (ev.key === "Escape") fechar({ origem: "tecla" });
    });

    state.backdrop = backdrop;
    state.body = backdrop.querySelector(".qa-content");
    state.footer = backdrop.querySelector(".qa-footer");
    state.status = backdrop.querySelector(".qa-status");
    return state;
  }

  function setStatus(text) {
    if (state.status) state.status.textContent = String(text || "");
    if (state.footer) state.footer.textContent = String(text || "");
  }

  function ensureMainData() {
    state.dados = state.dados || {};
    state.dados.sections = state.dados.sections || {};
    state.dados.usuarios_ativos = Array.isArray(state.dados.usuarios_ativos) ? state.dados.usuarios_ativos : [];
    state.dados.avisos_visiveis = Array.isArray(state.dados.avisos_visiveis) ? state.dados.avisos_visiveis : [];
    return state.dados;
  }

  function lerPreferenciaExibirQuadroDaSessao() {
    const sessao = window.sessaoAtual || {};
    const preferenciaDireta = sessao?.preferencias_gerais?.exibir_quadro_avisos;
    if (typeof preferenciaDireta === "boolean") return preferenciaDireta;
    const preferenciasJson = sessao?.preferencias_usuario_json;
    if (preferenciasJson && typeof preferenciasJson === "object") {
      const geral = preferenciasJson.geral;
      if (geral && typeof geral.exibir_quadro_avisos === "boolean") {
        return geral.exibir_quadro_avisos;
      }
    }
    return null;
  }

  function aguardarEstabilizacaoDaTela() {
    return new Promise((resolve) => {
      if (typeof window.requestAnimationFrame !== "function") {
        window.setTimeout(resolve, 120);
        return;
      }
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => resolve());
      });
    });
  }

  function coletarTextoBusca(item) {
    return [
      item?.historico,
      item?.nome,
      item?.data,
      item?.data_nascimento,
      item?.valor,
      item?.situacao,
      item?.texto
    ]
      .map((v) => String(v ?? "").toLowerCase())
      .join(" ");
  }

  function aplicarFiltroItens(itens) {
    const termo = String(state.filtro || "").trim().toLowerCase();
    if (!termo) return Array.isArray(itens) ? itens : [];
    return (Array.isArray(itens) ? itens : []).filter((item) => coletarTextoBusca(item).includes(termo));
  }

  function renderRows(rows, kind) {
    const list = Array.isArray(rows) ? rows : [];
    if (!list.length) {
      return '<div class="qa-empty">Sem registros nesta secao.</div>';
    }
    if (kind === "notice") {
      return list
        .map((item) => [
          '<div class="qa-notice-item">',
          '  <div class="qa-notice-label">Aviso</div>',
          `  <div class="qa-notice-text">${escHtml(item.texto || "")}</div>`,
          "</div>"
        ].join(""))
        .join("");
    }
    if (kind === "birthday") {
      return list
        .map((item) => [
          '<div class="qa-row">',
          `  <div>${escHtml(item.data || "")}</div>`,
          `  <div>${escHtml(item.nome || "")}</div>`,
          '  <div class="value"></div>',
          "</div>"
        ].join(""))
        .join("");
    }
    return list
      .map((item) => [
        '<div class="qa-row">',
        `  <div>${escHtml(item.data || "")}</div>`,
        `  <div>${escHtml(item.historico || item.nome || "")}</div>`,
        `  <div class="value">${escHtml(formatMoney(item.valor || 0))}</div>`,
        "</div>"
      ].join(""))
      .join("");
  }

  function renderSection(section, kind) {
    const dados = section || {};
    const itens = aplicarFiltroItens(dados.itens || []);
    const columns = Array.isArray(dados.colunas) ? dados.colunas : [];
    const parts = [];
    parts.push('<section class="qa-section">');
    parts.push(`<h2 class="qa-title"><span class="qa-title-marker">${kind === "notice" ? "!" : "$"}</span><span>${escHtml(dados.titulo || "")}</span></h2>`);
    if (kind !== "notice") {
      parts.push(`<div class="qa-cols">${columns.map((c) => `<div>${escHtml(c)}</div>`).join("")}</div>`);
    }
    parts.push(renderRows(itens, kind));
    if (typeof dados.total === "number" && Number.isFinite(dados.total) && columns.length > 2) {
      const totalLabel = kind === "receber" ? "Total de recebimentos na semana:" : "Total de despesas na semana:";
      parts.push(`<div class="qa-total"><span>${escHtml(totalLabel)}</span><span>${escHtml(formatMoney(dados.total))}</span></div>`);
    }
    if (dados.nota) {
      parts.push(`<div class="qa-note">${escHtml(dados.nota)}</div>`);
    }
    parts.push("</section>");
    return parts.join("");
  }

  function renderAll() {
    ensureUi();
    const data = ensureMainData();
    const sections = data.sections || {};
    state.body.innerHTML = [
      renderSection(sections.avisos_recados, "notice"),
      renderSection(sections.contas_pagar_semana, "pagar"),
      renderSection(sections.contas_receber_semana, "receber"),
      renderSection(sections.aniversariantes_semana, "birthday"),
      renderSection(sections.retornos_mes, "returns")
    ].join("");
  }

  async function carregarDados() {
    ensureUi();
    state.carregando = true;
    setStatus("Carregando quadro de avisos...");
    try {
      const { res, data } = await window.requestJson("GET", ENDPOINT, undefined, true);
      if (!res.ok) {
        state.dados = null;
        renderAll();
        setStatus(data?.detail || "Falha ao carregar quadro de avisos.");
        return { ok: false, message: data?.detail || "Falha ao carregar quadro de avisos." };
      }
      state.dados = data || {};
      renderAll();
      setStatus("Quadro de avisos pronto.");
      return { ok: true, data: state.dados };
    } catch (err) {
      const message = err?.message || "Erro de conexao ao carregar quadro de avisos.";
      setStatus(message);
      return { ok: false, message };
    } finally {
      state.carregando = false;
    }
  }

  function abrir(opcoes = {}) {
    ensureUi();
    const windowEl = state.backdrop.querySelector(".qa-window");
    if (windowEl) {
      windowEl.style.position = "";
      windowEl.style.left = "";
      windowEl.style.top = "";
      windowEl.style.transform = "";
      windowEl.style.margin = "";
    }
    state.backdrop.classList.remove("hidden");
    state.aberto = true;
    state.filtro = "";
    state.body.innerHTML = '<div class="qa-empty">Carregando...</div>';
    state.backdrop.querySelector(".qa-window").focus();
    return carregarDados().then((resultado) => {
      if (opcoes?.origem === "login" && resultado?.ok) {
        setStatus("Aberto na entrada do usuario.");
      }
      return resultado;
    });
  }

  function fechar(opcoes = {}) {
    if (typeof state.dragStop === "function") {
      try {
        state.dragStop();
      } catch {}
    }
    if (state.menuBackdrop) {
      state.menuBackdrop.remove();
      state.menuBackdrop = null;
      state.menuBody = null;
      state.menuFooter = null;
      state.menuStatus = null;
      state.menuRows = [];
      state.menuSelectedId = null;
    }
    if (state.formBackdrop) {
      state.formBackdrop.remove();
      state.formBackdrop = null;
      state.formMode = "novo";
      state.formAviso = null;
    }
    if (!state.backdrop) return;
    state.backdrop.classList.add("hidden");
    state.aberto = false;
    if (opcoes?.origem !== "backdrop") {
      setStatus("");
    }
  }

  function abrirModalOverlay(titulo, largura = 560) {
    const doc = document;
    const backdrop = doc.createElement("div");
    backdrop.className = "qa-dialog-backdrop";
    backdrop.innerHTML = [
      `<div class="qa-dialog-window" role="dialog" aria-modal="true" tabindex="-1" style="width:min(${largura}px,calc(100vw - 24px));">`,
      `  <div class="qa-dialog-title"><span>${escHtml(titulo)}</span><button type="button" class="qa-btn" data-close><span class="qa-ico close" aria-hidden="true"></span></button></div>`,
      '  <div class="qa-dialog-body"></div>',
      "  <div class=\"qa-dialog-footer\"></div>",
      "</div>"
    ].join("");
    doc.body.appendChild(backdrop);
    backdrop.addEventListener("click", (ev) => {
      if (ev.target === backdrop) backdrop.remove();
    });
    backdrop.querySelector("[data-close]")?.addEventListener("click", () => backdrop.remove());
    backdrop.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape") backdrop.remove();
    });
    const dialog = backdrop.querySelector(".qa-dialog-window");
    dialog?.focus();
    return { backdrop, body: backdrop.querySelector(".qa-dialog-body"), footer: backdrop.querySelector(".qa-dialog-footer") };
  }

  async function obterUsuariosAtivos() {
    const cache = ensureMainData().usuarios_ativos;
    if (Array.isArray(cache) && cache.length) return cache;
    try {
      const { res, data } = await window.requestJson("GET", USUARIOS_ENDPOINT, undefined, true);
      if (!res.ok || !Array.isArray(data)) return [];
      state.dados = ensureMainData();
      state.dados.usuarios_ativos = data;
      return data;
    } catch {
      return [];
    }
  }

  function preencherComboUsuarios(select, usuarios, selectedId) {
    if (!select) return;
    const items = Array.isArray(usuarios) ? usuarios : [];
    select.innerHTML = items
      .map((usuario) => {
        const id = String(usuario?.id ?? "");
        const label = String(usuario?.label || usuario?.apelido || usuario?.nome || id);
        return `<option value="${escHtml(id)}">${escHtml(label)}</option>`;
      })
      .join("");
    if (selectedId != null && items.some((usuario) => String(usuario?.id ?? "") === String(selectedId))) {
      select.value = String(selectedId);
    } else if (items.length) {
      select.selectedIndex = 0;
    }
  }

  async function salvarAviso(payload, avisoId = null) {
    const method = avisoId ? "PATCH" : "POST";
    const path = avisoId ? `${AVISOS_ENDPOINT}/${encodeURIComponent(String(avisoId))}` : AVISOS_ENDPOINT;
    const { res, data } = await window.requestJson(method, path, payload, true);
    if (!res.ok) {
      throw new Error(data?.detail || "Falha ao salvar aviso.");
    }
    return data;
  }

  async function abrirFormAviso(aviso = null) {
    ensureUi();
    const usuarios = await obterUsuariosAtivos();
    const modal = abrirModalOverlay(aviso ? "Altera aviso" : "Novo aviso", 560);
    state.formBackdrop = modal.backdrop;
    state.formMode = aviso ? "altera" : "novo";
    state.formAviso = aviso || null;

    modal.body.innerHTML = [
      '<div class="qa-field-grid">',
      '  <div class="qa-field">',
      '    <label for="qa-destinatario">Destinatário:</label>',
      '    <select id="qa-destinatario" class="qa-select"></select>',
      "  </div>",
      '  <div class="qa-field">',
      '    <label for="qa-afixar">Afixar dia:</label>',
      '    <input id="qa-afixar" class="qa-input" type="date" />',
      "  </div>",
      '  <div class="qa-field">',
      '    <label for="qa-remover">Remover dia:</label>',
      '    <input id="qa-remover" class="qa-input" type="date" />',
      "  </div>",
      "</div>",
      '<div class="qa-field" style="margin-top:8px">',
      '  <label for="qa-texto">Texto do aviso:</label>',
      '  <textarea id="qa-texto" class="qa-textarea" rows="6"></textarea>',
      "</div>",
      '<div class="qa-dialog-actions">',
      '  <button type="button" class="qa-dialog-btn primary" data-save>Ok</button>',
      '  <button type="button" class="qa-dialog-btn" data-cancel>Cancela</button>',
      "</div>"
    ].join("");

    const destinatario = modal.body.querySelector("#qa-destinatario");
    const afixar = modal.body.querySelector("#qa-afixar");
    const remover = modal.body.querySelector("#qa-remover");
    const texto = modal.body.querySelector("#qa-texto");
    const btnSave = modal.body.querySelector("[data-save]");
    const btnCancel = modal.body.querySelector("[data-cancel]");

    preencherComboUsuarios(destinatario, usuarios, aviso?.destinatario_id ?? window.sessaoAtual?.id ?? null);
    afixar.value = formatDateInput(aviso?.afixado_em || new Date().toISOString().slice(0, 10));
    remover.value = formatDateInput(aviso?.remover_em || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));
    texto.value = String(aviso?.texto || "");

    const salvar = async () => {
      const destinatarioId = Number(destinatario?.value || 0) || 0;
      const afixadoEm = parseDateInput(afixar?.value || "");
      const removerEm = parseDateInput(remover?.value || "");
      const textoVal = String(texto?.value || "").trim();
      if (!destinatarioId) {
        window.alert("Selecione um destinatário.");
        return;
      }
      if (!afixadoEm || !removerEm) {
        window.alert("Informe as duas datas.");
        return;
      }
      if (removerEm <= afixadoEm) {
        window.alert("Remover dia deve ser posterior ao afixar dia.");
        return;
      }
      if (!textoVal) {
        window.alert("Informe o texto do aviso.");
        return;
      }
      btnSave.disabled = true;
      btnSave.textContent = "Salvando...";
      try {
        await salvarAviso(
          {
            destinatario_id: destinatarioId,
            afixado_em: afixadoEm,
            remover_em: removerEm,
            texto: textoVal
          },
          aviso?.id || null
        );
        modal.backdrop.remove();
        state.formBackdrop = null;
        state.formAviso = null;
        await carregarDados();
        if (state.menuBackdrop) {
          await atualizarListaAvisos();
        }
      } catch (err) {
        window.alert(err?.message || "Falha ao salvar aviso.");
      } finally {
        btnSave.disabled = false;
        btnSave.textContent = "Ok";
      }
    };

    btnSave.addEventListener("click", salvar);
    btnCancel.addEventListener("click", () => {
      modal.backdrop.remove();
      state.formBackdrop = null;
      state.formAviso = null;
    });
    modal.backdrop.addEventListener("click", (ev) => {
      if (ev.target === modal.backdrop) {
        modal.backdrop.remove();
        state.formBackdrop = null;
        state.formAviso = null;
      }
    });
    modal.backdrop.addEventListener("keydown", async (ev) => {
      if (ev.key === "Enter" && (ev.ctrlKey || ev.metaKey)) {
        await salvar();
      }
    });
    btnSave.focus();
  }

  function renderMenuAvisosTable(rows) {
    if (!state.menuBody) return;
    const list = Array.isArray(rows) ? rows : [];
    state.menuRows = list;
    const selectedId = state.menuSelectedId != null ? String(state.menuSelectedId) : "";
    if (!list.length) {
      state.menuBody.innerHTML = '<div class="qa-empty" style="padding-top:16px">Nenhum aviso encontrado.</div>';
      return;
    }
    state.menuBody.innerHTML = [
      '<table class="qa-table">',
      "  <thead>",
      "    <tr>",
      "      <th>Afixado em</th>",
      "      <th>Remetente</th>",
      "      <th>Destinatário</th>",
      "      <th>Texto</th>",
      "    </tr>",
      "  </thead>",
      "  <tbody>",
      list
        .map((item) => {
          const id = String(item?.id ?? "");
          const selected = id && id === selectedId ? " selected" : "";
          return [
            `<tr class="${selected}" data-id="${escHtml(id)}">`,
            `  <td>${escHtml(formatDateBr(item?.afixado_em || ""))}</td>`,
            `  <td>${escHtml(item?.remetente || "")}</td>`,
            `  <td>${escHtml(item?.destinatario || "")}</td>`,
            `  <td>${escHtml(item?.texto || "")}</td>`,
            "</tr>"
          ].join("");
        })
        .join(""),
      "  </tbody>",
      "</table>"
    ].join("");
    state.menuBody.querySelectorAll("tbody tr").forEach((tr) => {
      tr.addEventListener("click", () => {
        state.menuSelectedId = Number(tr.dataset.id || 0) || null;
        renderMenuAvisosTable(state.menuRows);
        updateMenuStatus();
      });
      tr.addEventListener("dblclick", () => {
        const aviso = state.menuRows.find((row) => String(row?.id ?? "") === String(tr.dataset.id || ""));
        if (aviso) abrirFormAviso(aviso);
      });
    });
  }

  function updateMenuStatus(message) {
    if (!state.menuStatus) return;
    const selected = state.menuRows.find((row) => String(row?.id ?? "") === String(state.menuSelectedId || ""));
    const base = message || `${state.menuRows.length} aviso(s) carregado(s).`;
    state.menuStatus.textContent = selected ? `${base} Selecionado: ${selected.texto || ""}` : base;
    if (state.menuFooter) {
      state.menuFooter.textContent = selected ? `Selecionado: ${selected.texto || ""}` : "";
    }
  }

  async function atualizarListaAvisos() {
    if (!state.menuBackdrop) return [];
    try {
      const { res, data } = await window.requestJson("GET", AVISOS_ENDPOINT, undefined, true);
      if (!res.ok) {
        renderMenuAvisosTable([]);
        updateMenuStatus(data?.detail || "Falha ao carregar avisos.");
        return [];
      }
      const rows = Array.isArray(data) ? data : [];
      state.menuRows = rows;
      renderMenuAvisosTable(rows);
      updateMenuStatus();
      return rows;
    } catch (err) {
      renderMenuAvisosTable([]);
      updateMenuStatus(err?.message || "Erro ao carregar avisos.");
      return [];
    }
  }

  async function abrirMenuAvisos() {
    ensureUi();
    if (state.menuBackdrop) {
      state.menuBackdrop.remove();
      state.menuBackdrop = null;
    }
    const modal = abrirModalOverlay("Menu de avisos", 760);
    state.menuBackdrop = modal.backdrop;
    state.menuBody = modal.body;
    state.menuFooter = modal.footer;
    state.menuStatus = modal.footer;
    modal.body.innerHTML = [
      '<div class="qa-list-head">',
      '  <div class="qa-list-toolbar">',
      '    <button type="button" class="qa-btn" data-menu-action="novo"><span class="qa-ico pin" aria-hidden="true"></span><span>Novo...</span></button>',
      '    <button type="button" class="qa-btn" data-menu-action="altera"><span class="qa-ico search" aria-hidden="true"></span><span>Altera...</span></button>',
      '    <button type="button" class="qa-btn" data-menu-action="elimina"><span class="qa-ico close" aria-hidden="true"></span><span>Elimina</span></button>',
      '    <button type="button" class="qa-btn" data-menu-action="fecha"><span class="qa-ico close" aria-hidden="true"></span><span>Fecha</span></button>',
      "  </div>",
      "</div>",
      '<div class="qa-list-body"></div>'
    ].join("");
    state.menuBody = modal.body.querySelector(".qa-list-body");
    modal.backdrop.querySelectorAll("[data-menu-action]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const action = String(btn.dataset.menuAction || "");
        if (action === "fecha") {
          modal.backdrop.remove();
          state.menuBackdrop = null;
          state.menuBody = null;
          state.menuFooter = null;
          state.menuStatus = null;
          state.menuRows = [];
          state.menuSelectedId = null;
          return;
        }
        if (action === "novo") {
          await abrirFormAviso();
          return;
        }
        if (action === "altera") {
          const aviso = state.menuRows.find((row) => String(row?.id ?? "") === String(state.menuSelectedId || ""));
          if (!aviso) {
            window.alert("Selecione um aviso para alterar.");
            return;
          }
          await abrirFormAviso(aviso);
          return;
        }
        if (action === "elimina") {
          const aviso = state.menuRows.find((row) => String(row?.id ?? "") === String(state.menuSelectedId || ""));
          if (!aviso) {
            window.alert("Selecione um aviso para eliminar.");
            return;
          }
          if (!window.confirm(`Deseja realmente eliminar o aviso "${aviso.texto || ""}"?`)) return;
          const { res, data } = await window.requestJson("DELETE", `${AVISOS_ENDPOINT}/${encodeURIComponent(String(aviso.id))}`, undefined, true);
          if (!res.ok) {
            window.alert(data?.detail || "Falha ao eliminar aviso.");
            return;
          }
          state.menuSelectedId = null;
          await carregarDados();
          await atualizarListaAvisos();
        }
      });
    });

    modal.backdrop.addEventListener("click", (ev) => {
      if (ev.target === modal.backdrop) {
        modal.backdrop.remove();
        state.menuBackdrop = null;
        state.menuBody = null;
        state.menuFooter = null;
        state.menuStatus = null;
        state.menuRows = [];
        state.menuSelectedId = null;
      }
    });

    await atualizarListaAvisos();
    modal.backdrop.querySelector(".qa-dialog-window")?.focus();
  }

  async function abrirAposLoginSeConfigurado() {
    ensureUi();
    if (state.aberto || state.autoOpenEmAndamento) {
      return { ok: true, visible: !!state.aberto, alreadyOpen: !!state.aberto };
    }
    state.autoOpenEmAndamento = true;
    try {
      const preferenciaSessao = lerPreferenciaExibirQuadroDaSessao();
      if (typeof preferenciaSessao === "boolean") {
        if (preferenciaSessao) {
          await aguardarEstabilizacaoDaTela();
          if (!state.aberto) {
            await abrir({ origem: "login" });
          }
        }
        return { ok: true, visible: preferenciaSessao, source: "session" };
      }
      const { res, data } = await window.requestJson("GET", "/preferences/general", undefined, true);
      if (!res.ok) return { ok: false, visible: false };
      const visible = !!data?.values?.exibir_quadro_avisos;
      if (visible) {
        if (state.aberto) return { ok: true, visible: true, alreadyOpen: true };
        await aguardarEstabilizacaoDaTela();
        if (state.aberto) return { ok: true, visible: true, alreadyOpen: true };
        await abrir({ origem: "login" });
      }
      return { ok: true, visible };
    } catch {
      return { ok: false, visible: false };
    } finally {
      state.autoOpenEmAndamento = false;
    }
  }

  const api = Object.freeze({
    meta: Object.freeze({
      nome: "Quadro de avisos",
      modulo: MODULE_NAME,
      status: "ativo-passivo",
      ativo: true,
      controlaFluxo: true
    }),
    abrir,
    fechar,
    carregarDados,
    procurar: abrirMenuAvisos,
    abrirAfixa: abrirFormAviso,
    abrirMenuAvisos,
    abrirAposLoginSeConfigurado,
    isOpen: () => !!state.aberto,
    helpers: Object.freeze({
      formatMoney,
      formatDateBr
    })
  });

  window.BranaQuadroAvisosModule = api;
})();
