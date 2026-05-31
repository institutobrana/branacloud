(function () {
  "use strict";

  const MODULE_NAME = "prestadores";
  const MODULE_VERSION = "0.2.1";

  function prestFmtCodigo(valor) {
    if (valor === null || valor === undefined) return "-";
    const texto = String(valor).trim();
    if (!texto) return "-";
    return texto;
  }

  function prestSelecionado(cache, selId) {
    if (!Array.isArray(cache) || cache.length === 0) return null;
    const alvo = Number(selId || 0);
    return cache.find((item) => Number(item?.id || 0) === alvo) || null;
  }

  function prestFiltrarLista(lista, filtros) {
    if (!Array.isArray(lista) || lista.length === 0) return [];
    const esp = String(filtros?.especialidade || "").trim();
    const nome = String(filtros?.nome || "").trim().toLowerCase();
    return lista.filter((item) => {
      const okEsp =
        !esp ||
        esp === "__todas__" ||
        String(item?.especialidade || "").trim() === esp;
      const alvo = `${String(item?.nome || "")} ${String(item?.fone1 || "")} ${String(item?.fone2 || "")}`.toLowerCase();
      const okNome = !nome || alvo.includes(nome);
      return okEsp && okNome;
    });
  }

  function prestStatusHtml(ativo) {
    return ativo
      ? '<span style="color:#2fbf2f;font-size:14px;line-height:1;">â—</span>'
      : '<span style="color:#d32f2f;font-size:14px;line-height:1;">â—</span>';
  }

  function escHtml(valor) {
    return String(valor ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function prestRenderLista(lista, selId) {
    const itens = Array.isArray(lista) ? lista : [];
    const html =
      itens
        .map((item, idx) => {
          const selecionado = Number(item?.id || 0) === Number(selId || 0) ? "selected" : "";
          return `<tr data-id="${escHtml(item?.id ?? "")}" class="${selecionado}"><td>${escHtml(prestFmtCodigo(item?.codigo, idx))}</td><td>${escHtml(item?.nome || "")}</td><td>${escHtml(item?.fone1 || "")}</td><td>${escHtml(item?.fone2 || "")}</td><td>${prestStatusHtml(item?.ativo !== false)}</td></tr>`;
        })
        .join("") || '<tr><td colspan="5">Nenhum prestador encontrado.</td></tr>';

    return {
      html,
      totalText: `${itens.length} prestadores`,
    };
  }

  function prestSelecionarLinhaVisual(tbody, selId) {
    const root = tbody && typeof tbody.querySelectorAll === "function" ? tbody : null;
    if (!root) return false;
    const alvo = Number(selId || 0);
    let encontrou = false;
    root.querySelectorAll("tr[data-id]").forEach((tr) => {
      const selecionado = Number(tr?.dataset?.id || 0) === alvo;
      tr.classList.toggle("selected", selecionado);
      if (selecionado) encontrou = true;
    });
    return encontrou;
  }

  function prestPainelStyleText() {
    return ".prest-panel{width:min(790px,100%);min-height:0;height:fit-content;align-self:start;padding:10px 10px 8px;background:#fff;border:1px solid #cfd8e3;box-sizing:border-box;font:12px Tahoma,sans-serif}.prest-toolbar{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:6px 0 8px}.prest-toolbar .sep{width:1px;height:24px;background:#cfd8e3;margin:0 2px}.prest-filtros{display:grid;grid-template-columns:240px 1fr;gap:12px;align-items:end;margin-bottom:8px}.prest-filtros label{display:block;margin-bottom:2px}.prest-filtros input,.prest-filtros select{width:100%;height:24px;border:1px solid #bfc9d6;padding:0 6px;box-sizing:border-box;background:#fff}.prest-grid{border:1px solid #cfd8e3;min-height:410px;background:#fff}.prest-grid table{width:100%;border-collapse:collapse;table-layout:fixed}.prest-grid th,.prest-grid td{border-bottom:1px solid #edf1f6;padding:3px 6px;height:22px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.prest-grid th{background:#f2f6fb;font:700 12px Tahoma,sans-serif;text-align:left}.prest-grid th:nth-child(1),.prest-grid td:nth-child(1),.prest-grid th:nth-child(5),.prest-grid td:nth-child(5){text-align:center}.prest-grid tr.selected{background:#d9e8fb}.prest-total{margin-top:5px;color:#5b6b7e}";
  }

  function prestPainelHtml() {
    return '<section id="prestadores-panel" class="prest-panel hidden"><div class="panel-title">Cadastro de prestadores</div><div class="prest-toolbar"><button id="prest-btn-novo" class="materiais-btn" type="button"><img src="/desktop-assets/novo.png" alt="">Novo prestador...</button><button id="prest-btn-editar" class="materiais-btn" type="button"><img src="/desktop-assets/editar.png" alt="">Altera...</button><button id="prest-btn-excluir" class="materiais-btn" type="button"><img src="/desktop-assets/eliminar.png" alt="">Elimina</button><span class="sep"></span><button id="prest-btn-agenda" class="materiais-btn" type="button"><img src="/desktop-assets/editar.png" alt="">Agenda...</button><button id="prest-btn-convenios" class="materiais-btn" type="button"><img src="/desktop-assets/imprimir.png" alt="">Convênios...</button><button id="prest-btn-comissoes" class="materiais-btn" type="button"><img src="/desktop-assets/imprimir.png" alt="">Comissões...</button><span class="sep"></span><button id="prest-btn-fechar" class="materiais-btn" type="button"><img src="/desktop-assets/cancela.png" alt="">Fecha</button></div><div class="prest-filtros"><div><label for="prest-cbo-especialidade">Especialidade:</label><select id="prest-cbo-especialidade"></select></div><div><label for="prest-txt-nome">Nome do prestador:</label><input id="prest-txt-nome" type="text"></div></div><div class="prest-grid"><table><colgroup><col style="width:80px"><col><col style="width:150px"><col style="width:150px"><col style="width:60px"></colgroup><thead><tr><th>Código</th><th>Nome</th><th>Fone 1</th><th>Fone 2</th><th>Status</th></tr></thead><tbody id="prest-tbody"></tbody></table></div><div id="prest-total" class="prest-total">0 prestadores</div></section>';
  }

  function prestBuildCfgFromDom() {
    return {
      panel: document.getElementById("prestadores-panel"),
      cboEspecialidade: document.getElementById("prest-cbo-especialidade"),
      txtNome: document.getElementById("prest-txt-nome"),
      tbody: document.getElementById("prest-tbody"),
      total: document.getElementById("prest-total"),
      btnNovo: document.getElementById("prest-btn-novo"),
      btnEditar: document.getElementById("prest-btn-editar"),
      btnExcluir: document.getElementById("prest-btn-excluir"),
      btnAgenda: document.getElementById("prest-btn-agenda"),
      btnConvenios: document.getElementById("prest-btn-convenios"),
      btnComissoes: document.getElementById("prest-btn-comissoes"),
      btnFechar: document.getElementById("prest-btn-fechar"),
    };
  }

  function prestEnsureUI(ctx = {}) {
    if (document.getElementById("prestadores-panel")) return prestBuildCfgFromDom();
    const workspaceEmpty = ctx.workspaceEmpty;
    if (!workspaceEmpty || typeof workspaceEmpty.insertAdjacentHTML !== "function") return null;

    const styleId = "prestadores-style";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = prestPainelStyleText();
      document.head.appendChild(style);
    }

    workspaceEmpty.insertAdjacentHTML("afterend", prestPainelHtml());
    const cfg = prestBuildCfgFromDom();
    if (!cfg.panel) return null;

    if (typeof ctx.ensurePanelChrome === "function") {
      try {
        ctx.ensurePanelChrome(cfg.panel);
      } catch {}
    }

    if (typeof ctx.bindStandardGridActivation === "function") {
      try {
        ctx.bindStandardGridActivation(
          cfg.tbody,
          (tr) => {
            if (typeof ctx.onSelect === "function") ctx.onSelect(tr);
          },
          () => {
            if (typeof ctx.onAction === "function") ctx.onAction("Altera");
          }
        );
      } catch {}
    }

    const render = typeof ctx.onRender === "function" ? ctx.onRender : null;
    const acoes = typeof ctx.onAction === "function" ? ctx.onAction : null;
    const fechar = typeof ctx.onClose === "function" ? ctx.onClose : null;
    const workspace = ctx.workspaceEmpty || null;
    const footerMsg = ctx.footerMsg || null;
    if (cfg.cboEspecialidade && render) cfg.cboEspecialidade.addEventListener("change", render);
    if (cfg.txtNome && render) cfg.txtNome.addEventListener("input", render);
    if (cfg.btnNovo && acoes) cfg.btnNovo.addEventListener("click", () => acoes("Novo prestador"));
    if (cfg.btnEditar && acoes) cfg.btnEditar.addEventListener("click", () => acoes("Altera"));
    if (cfg.btnExcluir && acoes) cfg.btnExcluir.addEventListener("click", () => acoes("Elimina"));
    if (cfg.btnAgenda && acoes) cfg.btnAgenda.addEventListener("click", () => acoes("Agenda"));
    if (cfg.btnConvenios && acoes) cfg.btnConvenios.addEventListener("click", () => acoes("Convênios"));
    if (cfg.btnComissoes && acoes) cfg.btnComissoes.addEventListener("click", () => acoes("Comissões"));
    if (cfg.btnFechar) {
      cfg.btnFechar.addEventListener("click", () => {
        cfg.panel.classList.add("hidden");
        if (workspace && workspace.classList) workspace.classList.remove("hidden");
        if (footerMsg) footerMsg.textContent = "Cadastro > Prestadores fechado.";
        if (typeof fechar === "function") fechar();
      });
    }

    return cfg;
  }

  const meta = Object.freeze({
    name: MODULE_NAME,
    version: MODULE_VERSION,
    description: "Namespace passivo do módulo Prestadores. Não controla fluxo funcional nesta etapa.",
    status: "passivo",
    ativo: false,
    controlaFluxo: false,
    subetapa: "1_namespace_passivo",
  });

  function getInfo() {
    return {
      meta,
      name: MODULE_NAME,
      version: MODULE_VERSION,
      status: meta.status,
      ativo: meta.ativo,
      controlaFluxo: meta.controlaFluxo,
      subetapa: meta.subetapa,
      prestFmtCodigo,
      prestSelecionado,
      prestFiltrarLista,
      prestStatusHtml,
      prestRenderLista,
      prestSelecionarLinhaVisual,
      prestPainelStyleText,
      prestPainelHtml,
      prestBuildCfgFromDom,
      prestEnsureUI,
    };
  }

  function getStatus() {
    return {
      name: MODULE_NAME,
      version: MODULE_VERSION,
      status: meta.status,
      ativo: meta.ativo,
      controlaFluxo: meta.controlaFluxo,
      subetapa: meta.subetapa,
    };
  }

  const module = Object.freeze({
    meta,
    getInfo,
    getStatus,
    prestFmtCodigo,
    prestSelecionado,
    prestFiltrarLista,
    prestStatusHtml,
    prestRenderLista,
    prestSelecionarLinhaVisual,
    prestPainelStyleText,
    prestPainelHtml,
    prestBuildCfgFromDom,
    prestEnsureUI,
  });

  window.BranaPrestadoresModule = module;
})();
