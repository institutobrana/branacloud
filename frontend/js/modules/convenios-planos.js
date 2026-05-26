(function () {
  "use strict";

  const MODULE_NAME = "convenios-planos";
  const MODULE_VERSION = "1.0.0";

  function normalizeText(value) {
    return String(value ?? "").trim().replace(/\s+/g, " ");
  }

  function normalizarNomeConvenio(valor) {
    return normalizeText(valor);
  }

  function validarNomeConvenio(valor) {
    const nome = normalizarNomeConvenio(valor);
    if (!nome) {
      return { ok: false, valor: "", motivo: "Informe o nome do convênio." };
    }
    return { ok: true, valor: nome, motivo: "" };
  }

  function normalizarNomePlano(valor) {
    return normalizeText(valor);
  }

  function validarNomePlano(valor) {
    const nome = normalizarNomePlano(valor);
    if (!nome) {
      return { ok: false, valor: "", motivo: "Informe o nome do plano." };
    }
    return { ok: true, valor: nome, motivo: "" };
  }

  function normalizarCodigoRegistro(valor) {
    return normalizeText(valor);
  }

  function escHtml(valor) {
    return String(valor ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function montarLinhasConvenios(lista, selectedId, statusFormatter) {
    const itens = Array.isArray(lista) ? lista : [];
    const statusFn = typeof statusFormatter === "function"
      ? statusFormatter
      : (inativo) => (inativo ? "Inativo" : "Ativo");
    return {
      html: itens.map((item) => `<tr data-id="${item.id}" class="${Number(item.id) === Number(selectedId) ? "selected" : ""}"><td>${escHtml(item.nome || "")}</td><td>${escHtml(item.codigo || "")}</td><td>${escHtml(item.telefone || "")}</td><td>${escHtml(item.telefone2 || "")}</td><td style="text-align:center">${escHtml(statusFn(item.inativo))}</td></tr>`).join(""),
      total: `${itens.length} convênios`,
    };
  }

  function montarLinhasPlanos(lista, convenioSelecionadoId, selectedPlanoId, statusFormatter) {
    const itensFonte = Array.isArray(lista) ? lista : [];
    const itens = itensFonte.filter((item) => !convenioSelecionadoId || Number(item.convenio_id || 0) === Number(convenioSelecionadoId));
    const statusFn = typeof statusFormatter === "function"
      ? statusFormatter
      : (inativo) => (inativo ? "Inativo" : "Ativo");
    return {
      html: itens.map((item) => `<tr data-id="${item.id}" class="${Number(item.id) === Number(selectedPlanoId) ? "selected" : ""}"><td>${escHtml(item.nome || "")}</td><td>${escHtml(item.cobertura || "")}</td><td style="text-align:center">${escHtml(statusFn(item.inativo))}</td></tr>`).join(""),
      total: `${itens.length} planos`,
    };
  }

  const helpers = Object.freeze({
    normalizarNomeConvenio,
    validarNomeConvenio,
    normalizarNomePlano,
    validarNomePlano,
    normalizarCodigoRegistro,
    escHtml,
    montarLinhasConvenios,
    montarLinhasPlanos,
  });

  const meta = Object.freeze({
    name: MODULE_NAME,
    version: MODULE_VERSION,
    description: "Namespace passivo do modulo Convenios e Planos. Nao controla fluxo funcional nesta etapa.",
    status: "passivo",
    ativo: false,
    controlaFluxo: false,
    subetapa: "1_namespace_passivo",
  });

  function getInfo() {
    return {
      meta,
      name: MODULE_NAME,
      version: MODULE_VERSION,
      status: meta.status,
      ativo: meta.ativo,
      controlaFluxo: meta.controlaFluxo,
      subetapa: meta.subetapa,
      helpers: Object.keys(helpers),
    };
  }

  function getStatus() {
    return {
      name: MODULE_NAME,
      version: MODULE_VERSION,
      status: meta.status,
      ativo: meta.ativo,
      controlaFluxo: meta.controlaFluxo,
      subetapa: meta.subetapa,
    };
  }

  const module = Object.freeze({
    meta,
    helpers,
    getInfo,
    getStatus,
  });

  window.BranaConveniosPlanosModule = module;
})();
