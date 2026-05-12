(function () {
  const ns = window.BranaUnidadesModule = window.BranaUnidadesModule || {};
  const meta = ns.meta = ns.meta || {
    nome: "Unidades",
    versao: "subetapa-1",
    status: "estrutura-controlada",
    helpersPlanejados: ["fmtCodigo", "statusHtml", "telefonePadrao"]
  };

  ns.status = ns.status || meta.status;

  const TELEFONE_PADRAO_FALLBACK = Object.freeze([
    "Residencial",
    "Comercial",
    "Celular",
    "Recado"
  ]);

  ns.helpers = ns.helpers || {};

  if (typeof ns.helpers.fmtCodigo !== "function") {
    ns.helpers.fmtCodigo = function (valor, idx = 0) {
      const n = Number(valor || 0);
      if (Number.isFinite(n) && n > 0) return String(n).padStart(4, "0");
      const txt = String(valor || "").trim();
      if (txt) return txt;
      return String(idx + 1).padStart(4, "0");
    };
  }

  if (typeof ns.helpers.statusHtml !== "function") {
    ns.helpers.statusHtml = function (ativo) {
      return ativo
        ? '<span style="color:#2fbf2f;font-size:14px;line-height:1;">●</span>'
        : '<span style="color:#c0c8d2;font-size:14px;line-height:1;">●</span>';
    };
  }

  if (typeof ns.helpers.telefonePadrao !== "function") {
    ns.helpers.telefonePadrao = function (idx) {
      return TELEFONE_PADRAO_FALLBACK[idx - 1] || "";
    };
  }

  Object.freeze(ns.helpers);
  Object.freeze(ns.meta);
})();
