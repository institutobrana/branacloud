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

  const moduleApi = Object.freeze({
    getMetadata
  });

  window.BranaPreferenciasOpcoesSistemaModule = moduleApi;
})();
