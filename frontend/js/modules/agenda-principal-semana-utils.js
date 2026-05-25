(function () {
  "use strict";

  function agendaSemanaIsStandaloneRequest() {
    try {
      const params = new URLSearchParams(window.location.search || "");
      const raw = String(params.get("agenda_semana") || "").trim().toLowerCase();
      return raw === "1" || raw === "true" || raw === "yes";
    } catch {
      return false;
    }
  }

  function agendaSemanaStandaloneModeFromQuery() {
    try {
      const params = new URLSearchParams(window.location.search || "");
      const raw = String(params.get("agenda_modo") || "").trim().toLowerCase();
      if (raw === "dia" || raw === "clinica") return raw;
    } catch {
    }
    return "semana";
  }

  const api = Object.freeze({
    meta: Object.freeze({
      nome: "Agenda principal - Semana utils",
      modulo: "agenda-principal-semana-utils",
      versaoSubetapa: "subetapa-25_helper_standalone_mode",
      status: "ativo-passivo",
      ativo: false,
      controlaFluxo: false
    }),
    agendaSemanaIsStandaloneRequest,
    agendaSemanaStandaloneModeFromQuery,
    helpers: Object.freeze({
      agendaSemanaIsStandaloneRequest,
      agendaSemanaStandaloneModeFromQuery
    })
  });

  window.BranaAgendaPrincipalSemanaUtils = api;
  window.agendaSemanaIsStandaloneRequest = agendaSemanaIsStandaloneRequest;
  window.agendaSemanaStandaloneModeFromQuery = agendaSemanaStandaloneModeFromQuery;
})();
