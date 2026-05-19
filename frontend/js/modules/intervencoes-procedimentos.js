(function () {
  "use strict";

  const MODULE_NAME = "BranaIntervencoesProcedimentosModule";
  const MODULE_VERSION = "0.1.0-passive";

  const contracts = Object.freeze({
    modulo: "intervencoes-procedimentos",
    comportamento: "passivo-sem-delegacao",
    alteraFluxoProc: false,
    alteraMateriais: false,
    alteraProcedimentosGenericos: false,
    alteraBackend: false
  });

  const manifest = Object.freeze({
    name: MODULE_NAME,
    version: MODULE_VERSION,
    description: "Namespace passivo para futura modularizacao conservadora de Intervencoes / Procedimentos.",
    contracts
  });

  // Helpers puros (sem rede/DOM). Mantidos aqui para extracoes minimas e seguras do app.js.
  function procParse(v) {
    const s = String(v ?? "")
      .replace("R$", "")
      .trim()
      .replace(",", ".");
    if (!s) return 0;
    const n = Number(s);
    if (!Number.isFinite(n)) throw new Error("invalid");
    return n;
  }

  function procFmtBr(v) {
    const n = Number(v || 0);
    return Number.isFinite(n) ? n.toFixed(2).replace(".", ",") : "0,00";
  }

  function procFmtAuxLabel(item) {
    const codigo = String(item?.codigo ?? "").trim();
    const descricao = String(item?.descricao ?? item?.nome ?? "").trim();
    if (codigo && descricao) return `${codigo} - ${descricao}`;
    return descricao || codigo || "";
  }

  const helpers = Object.freeze({
    procParse,
    procFmtBr,
    procFmtAuxLabel
  });

  window.BranaIntervencoesProcedimentosModule = Object.freeze({
    manifest,
    helpers
  });
})();
