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

  window.BranaIntervencoesProcedimentosModule = Object.freeze({
    manifest
  });
})();
