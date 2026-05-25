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

  function agendaSemanaBuildStandaloneUrl(modo = "semana") {
    const url = new URL(window.location.href);
    url.searchParams.set("agenda_semana", "1");
    url.searchParams.set(
      "agenda_modo",
      String(modo || "semana").trim().toLowerCase() === "dia"
        ? "dia"
        : (String(modo || "semana").trim().toLowerCase() === "clinica" ? "clinica" : "semana")
    );
    return url.toString();
  }

  const api = Object.freeze({
    meta: Object.freeze({
      nome: "Agenda principal - Semana utils",
      modulo: "agenda-principal-semana-utils",
      versaoSubetapa: "subetapa-28_helper_standalone_url",
      status: "ativo-passivo",
      ativo: false,
      controlaFluxo: false
    }),
    agendaSemanaIsStandaloneRequest,
    agendaSemanaStandaloneModeFromQuery,
    agendaSemanaBuildStandaloneUrl,
    helpers: Object.freeze({
      agendaSemanaIsStandaloneRequest,
      agendaSemanaStandaloneModeFromQuery,
      agendaSemanaBuildStandaloneUrl
    })
  });

  window.BranaAgendaPrincipalSemanaUtils = api;
  window.agendaSemanaIsStandaloneRequest = agendaSemanaIsStandaloneRequest;
  window.agendaSemanaStandaloneModeFromQuery = agendaSemanaStandaloneModeFromQuery;
  window.agendaSemanaBuildStandaloneUrl = agendaSemanaBuildStandaloneUrl;
})();
