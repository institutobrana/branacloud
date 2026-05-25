(function () {
  "use strict";

  function escHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

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

  const OPCOES_FILTRO_TIPOS_PADRAO = '<option value="Cirurgião">Cirurgião</option><option value="Protético">Protético</option><option value="Fornecedor">Fornecedor</option><option value="Outros">Outros</option>';

  function montarOpcoesFiltroTipos(listaTipos) {
    const tipos = Array.isArray(listaTipos) ? listaTipos : [];
    if (!tipos.length) return OPCOES_FILTRO_TIPOS_PADRAO;
    return tipos.map(item => `<option value="${escHtml(item?.descricao || "")}">${escHtml(item?.descricao || "")}</option>`).join("");
  }

  function montarLinhaAgendaContatos(item, selectedId, telefonesTexto) {
    const id = String(item?.id ?? "");
    const selecionado = String(selectedId ?? "") === id ? "selected" : "";
    return `<tr data-id="${escHtml(id)}" class="${selecionado}"><td>${escHtml(item?.nome || "")}</td><td>${escHtml(item?.tipo || "")}</td><td>${escHtml(telefonesTexto || "")}</td></tr>`;
  }

  const api = Object.freeze({
    meta: Object.freeze({
      nome: "Agenda de contatos - Listagem",
      modulo: "agenda-contatos-listagem",
      versaoSubetapa: "subetapa-11_opcoes_filtro_tipos",
      status: "ativo-passivo",
      ativo: false,
      controlaFluxo: false
    }),
    filtrarAgendaContatos,
    montarOpcoesFiltroTipos,
    montarLinhaAgendaContatos,
    helpers: Object.freeze({
      filtrarAgendaContatos,
      montarOpcoesFiltroTipos,
      montarLinhaAgendaContatos
    })
  });

  window.BranaAgendaContatosListagemModule = api;
})();
