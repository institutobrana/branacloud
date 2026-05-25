(function () {
  "use strict";

  function telefonesTexto(item) {
    if (!item) return "";
    const telefones = [
      [item.tel1_tipo, item.tel1],
      [item.tel2_tipo, item.tel2],
      [item.tel3_tipo, item.tel3],
      [item.tel4_tipo, item.tel4]
    ]
      .map(([tipo, fone]) => {
        const t = String(tipo || "").trim();
        const f = String(fone || "").trim();
        if (!f) return "";
        return t ? `${t} ${f}` : f;
      })
      .filter(Boolean);
    return telefones.join(" / ");
  }

  const api = Object.freeze({
    meta: Object.freeze({
      nome: "Agenda de contatos - Telefones",
      modulo: "agenda-contatos-telefones",
      versaoSubetapa: "subetapa-6_helper_visual_puro",
      status: "ativo-passivo",
      ativo: false,
      controlaFluxo: false
    }),
    telefonesTexto,
    agendaContatosTelefonesTexto: telefonesTexto,
    helpers: Object.freeze({
      telefonesTexto
    })
  });

  window.BranaAgendaContatosTelefonesModule = api;
})();
