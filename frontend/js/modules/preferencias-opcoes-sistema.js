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

  function prefValoresPadraoModelos() {
    return {
      modelo_impresso_atestados_id: null,
      modelo_impresso_receitas_id: null,
      modelo_impresso_recibos_id: null,
      modelo_padrao_etiquetas_id: null,
      modelo_texto_email_agenda_id: null,
      modelo_padrao_orcamentos_id: null,
      modelo_texto_whatsapp_agenda_id: null
    };
  }

  function prefAmbEstiloPadrao() {
    return {
      fonte_nome: "Tahoma",
      fonte_tamanho: 12,
      fonte_estilo: "normal",
      cor_texto: "#000000",
      riscado: false,
      sublinhado: false,
      script: "Ocidental"
    };
  }

  function prefOdontoFindByLabel(text) {
    const key = prefOdontoNorm(text);
    for (let i = 0; i < PREF_ODONTO_PALETTE.length; i += 1) {
      if (prefOdontoNorm(PREF_ODONTO_PALETTE[i].label) === key) return PREF_ODONTO_PALETTE[i];
    }
    return null;
  }

  const moduleApi = Object.freeze({
    getMetadata,
    prefOdontoNorm,
    prefValoresPadraoModelos,
    prefAmbEstiloPadrao,
    prefOdontoFindByLabel
  });

  window.BranaPreferenciasOpcoesSistemaModule = moduleApi;
})();
