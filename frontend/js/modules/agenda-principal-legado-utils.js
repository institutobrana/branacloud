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

  function agendaLegadoFmtDataInput(valor) {
    if (!valor) return "";
    const txt = String(valor).trim();
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(txt)) return txt;
    if (/^\d{4}-\d{2}-\d{2}$/.test(txt)) {
      const [a, m, d] = txt.split("-");
      return `${d}/${m}/${a}`;
    }
    const d = new Date(txt);
    if (Number.isNaN(d.getTime())) return txt;
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const aa = String(d.getFullYear());
    return `${dd}/${mm}/${aa}`;
  }

  const api = Object.freeze({
    meta: Object.freeze({
      nome: "Agenda principal - Legado utils",
      modulo: "agenda-principal-legado-utils",
      versaoSubetapa: "subetapa-10_helper_data_input",
      status: "ativo-passivo",
      ativo: false,
      controlaFluxo: false
    }),
    agendaLegadoNumOrNull,
    agendaLegadoFmtHora,
    agendaLegadoFmtDataInput,
    helpers: Object.freeze({
      agendaLegadoNumOrNull,
      agendaLegadoFmtHora,
      agendaLegadoFmtDataInput
    })
  });

  window.BranaAgendaPrincipalLegadoUtils = api;
  window.agendaLegadoNumOrNull = agendaLegadoNumOrNull;
  window.agendaLegadoFmtHora = agendaLegadoFmtHora;
  window.agendaLegadoFmtDataInput = agendaLegadoFmtDataInput;
})();
