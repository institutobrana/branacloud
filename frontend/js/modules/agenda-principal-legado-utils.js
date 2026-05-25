(function () {
  "use strict";

  function agendaLegadoNumOrNull(value) {
    const n = Number(value);
    return Number.isFinite(n) ? Math.trunc(n) : null;
  }

  function agendaLegadoFmtHora(ms) {
    const total = Math.max(0, parseInt(ms || 0, 10));
    const hh = Math.floor(total / 3600000);
    const mm = Math.floor((total % 3600000) / 60000);
    if (!hh && !mm) return "";
    return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
  }

  const api = Object.freeze({
    meta: Object.freeze({
      nome: "Agenda principal - Legado utils",
      modulo: "agenda-principal-legado-utils",
      versaoSubetapa: "subetapa-7_helper_hora",
      status: "ativo-passivo",
      ativo: false,
      controlaFluxo: false
    }),
    agendaLegadoNumOrNull,
    agendaLegadoFmtHora,
    helpers: Object.freeze({
      agendaLegadoNumOrNull,
      agendaLegadoFmtHora
    })
  });

  window.BranaAgendaPrincipalLegadoUtils = api;
  window.agendaLegadoNumOrNull = agendaLegadoNumOrNull;
  window.agendaLegadoFmtHora = agendaLegadoFmtHora;
})();
