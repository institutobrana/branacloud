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

  const helpers = Object.freeze({
    normalizarNomeConvenio,
    validarNomeConvenio,
    normalizarNomePlano,
    validarNomePlano,
    normalizarCodigoRegistro,
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
