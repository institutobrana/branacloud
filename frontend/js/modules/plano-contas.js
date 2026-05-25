(function () {
  "use strict";

  const ns = window.BranaPlanoContasModule = window.BranaPlanoContasModule || {};
  const meta = ns.meta = ns.meta || {
    nome: "Plano de Contas",
    versao: "subetapa-1",
    status: "estrutura-controlada-passiva",
    controlaFluxo: false
  };

  ns.status = ns.status || meta.status;
  ns.ativo = ns.ativo || false;
  ns.controlaFluxo = ns.controlaFluxo || false;
  ns.helpers = ns.helpers || {};

  const paraTexto = (valor) => String(valor ?? "").trim();
  const paraBool = (valor) => valor === true || valor === 1 || valor === "1" || valor === "true";

  if (typeof ns.helpers.validarNomeGrupo !== "function") {
    ns.helpers.validarNomeGrupo = function (nome) {
      const valor = paraTexto(nome);
      if (!valor) {
        return { ok: false, nome: "", mensagem: "Informe o nome do grupo." };
      }
      return { ok: true, nome: valor };
    };
  }

  if (typeof ns.helpers.validarNomeCategoria !== "function") {
    ns.helpers.validarNomeCategoria = function (nome) {
      const valor = paraTexto(nome);
      if (!valor) {
        return { ok: false, nome: "", mensagem: "Informe o nome da categoria." };
      }
      return { ok: true, nome: valor };
    };
  }

  if (typeof ns.helpers.montarPayloadGrupo !== "function") {
    ns.helpers.montarPayloadGrupo = function (nome, tipo) {
      return {
        nome: paraTexto(nome),
        tipo: paraTexto(tipo)
      };
    };
  }

  if (typeof ns.montarPayloadGrupo !== "function") {
    ns.montarPayloadGrupo = ns.helpers.montarPayloadGrupo;
  }

  if (typeof ns.helpers.montarPayloadCategoria !== "function") {
    ns.helpers.montarPayloadCategoria = function (nome, grupo_id, tipo, tributavel) {
      return {
        nome: paraTexto(nome),
        grupo_id: Number(grupo_id || 0),
        tipo: paraTexto(tipo),
        tributavel: paraBool(tributavel)
      };
    };
  }

  if (typeof ns.getStatus !== "function") {
    ns.getStatus = function () {
      return {
        modulo: "plano-contas",
        nome: meta.nome,
        versao: meta.versao,
        status: meta.status,
        ativo: false,
        controlaFluxo: false,
        helpers: Object.keys(ns.helpers),
        observacao: "Estrutura modular passiva. app.js permanece como fonte funcional da verdade."
      };
    };
  }

  if (typeof ns.info !== "function") {
    ns.info = function () {
      return ns.getStatus();
    };
  }
})();
