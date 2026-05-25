(function () {
  "use strict";

  function agendaLegadoNumOrNull(value) {
    const n = Number(value);
    return Number.isFinite(n) ? Math.trunc(n) : null;
  }

  const api = Object.freeze({
    meta: Object.freeze({
      nome: "Agenda principal - Legado utils",
      modulo: "agenda-principal-legado-utils",
      versaoSubetapa: "subetapa-4_helper_numerico",
      status: "ativo-passivo",
      ativo: false,
      controlaFluxo: false
    }),
    agendaLegadoNumOrNull,
    helpers: Object.freeze({
      agendaLegadoNumOrNull
    })
  });

  window.BranaAgendaPrincipalLegadoUtils = api;
  window.agendaLegadoNumOrNull = agendaLegadoNumOrNull;
})();
