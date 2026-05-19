(function () {
  "use strict";

  const MODULE_NAME = "preferencias-opcoes-sistema";
  const MODULE_VERSION = "1.0.0-passivo";

  function getMetadata() {
    return {
      name: MODULE_NAME,
      version: MODULE_VERSION,
      passive: true,
      movedBehavior: false
    };
  }

  function prefOdontoNorm(text) {
    return String(text || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  }

  const moduleApi = Object.freeze({
    getMetadata,
    prefOdontoNorm
  });

  window.BranaPreferenciasOpcoesSistemaModule = moduleApi;
})();
