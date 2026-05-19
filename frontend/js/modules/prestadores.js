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

  function prestStatusHtml(ativo) {
    return ativo
      ? '<span style="color:#2fbf2f;font-size:14px;line-height:1;">â—</span>'
      : '<span style="color:#d32f2f;font-size:14px;line-height:1;">â—</span>';
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
      prestStatusHtml,
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
    prestStatusHtml,
  });

  window.BranaPrestadoresModule = module;
})();
