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
    ns.helpers.telefonePadrao = function (idx, tipos) {
      const fallback = [
        ["Comercial 1", "Comercial"],
        ["Comercial 2", "Comercial"],
        ["Comercial 3", "Comercial"],
        ["Fax", "Fax"]
      ][idx - 1] || ["", ""];
      const lista = Array.isArray(tipos) ? tipos : [];
      for (const item of fallback) {
        if (lista.some(t => String(t).toLowerCase() === String(item).toLowerCase())) return item;
      }
      return lista[0] || "";
    };
  }

  Object.freeze(ns.helpers);
  Object.freeze(ns.meta);
})();
