(function () {
  "use strict";

  function filtrarAgendaContatos(lista, filtroTipo, termoBusca) {
    const itens = Array.isArray(lista) ? lista : [];
    const filtro = String(filtroTipo ?? "").trim().toLowerCase();
    const termo = String(termoBusca ?? "").trim().toLowerCase();
    return itens.filter(item => {
      if (filtro && String(item?.tipo || "").toLowerCase() !== filtro) return false;
      if (termo && !String(item?.nome || "").toLowerCase().includes(termo)) return false;
      return true;
    });
  }

  const api = Object.freeze({
    meta: Object.freeze({
      nome: "Agenda de contatos - Listagem",
      modulo: "agenda-contatos-listagem",
      versaoSubetapa: "subetapa-9_logica_pura_filtragem",
      status: "ativo-passivo",
      ativo: false,
      controlaFluxo: false
    }),
    filtrarAgendaContatos,
    helpers: Object.freeze({
      filtrarAgendaContatos
    })
  });

  window.BranaAgendaContatosListagemModule = api;
})();
