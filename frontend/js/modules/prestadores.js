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
  });

  window.BranaPrestadoresModule = module;
})();
