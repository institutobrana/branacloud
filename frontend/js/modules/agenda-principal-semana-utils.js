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

  const api = Object.freeze({
    meta: Object.freeze({
      nome: "Agenda principal - Semana utils",
      modulo: "agenda-principal-semana-utils",
      versaoSubetapa: "subetapa-22_helper_standalone",
      status: "ativo-passivo",
      ativo: false,
      controlaFluxo: false
    }),
    agendaSemanaIsStandaloneRequest,
    helpers: Object.freeze({
      agendaSemanaIsStandaloneRequest
    })
  });

  window.BranaAgendaPrincipalSemanaUtils = api;
  window.agendaSemanaIsStandaloneRequest = agendaSemanaIsStandaloneRequest;
})();
