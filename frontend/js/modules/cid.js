(function () {
  "use strict";

  const root = window;
  const ns = root.BranaCidModule = root.BranaCidModule || {};
  const meta = ns.meta = ns.meta || {
    nome: "CID",
    versao: "subetapa-1",
    status: "estrutura-controlada-passiva",
    controlaFluxo: false
  };

  ns.nome = ns.nome || meta.nome;
  ns.subetapa = ns.subetapa || meta.versao;
  ns.status = ns.status || meta.status;
  ns.ativo = ns.ativo || false;
  ns.controlaFluxo = ns.controlaFluxo || false;
  ns.helpers = ns.helpers || {};

  const toTexto = (valor) => String(valor ?? "").trim();
  const toBusca = (valor) => toTexto(valor).toLowerCase();

  if (typeof ns.helpers.normalizarCodigoCid !== "function") {
    ns.helpers.normalizarCodigoCid = function (codigo) {
      return toTexto(codigo);
    };
  }

  if (typeof ns.helpers.validarCodigoCid !== "function") {
    ns.helpers.validarCodigoCid = function (codigo) {
      const valor = ns.helpers.normalizarCodigoCid(codigo);
      if (!valor) {
        return { ok: false, codigo: "", mensagem: "Informe código e doença." };
      }
      return { ok: true, codigo: valor };
    };
  }

  if (typeof ns.helpers.validarDescricaoCid !== "function") {
    ns.helpers.validarDescricaoCid = function (descricao) {
      const valor = toTexto(descricao);
      if (!valor) {
        return { ok: false, descricao: "", mensagem: "Informe código e doença." };
      }
      return { ok: true, descricao: valor };
    };
  }

  if (typeof ns.helpers.montarPayloadCid !== "function") {
    ns.helpers.montarPayloadCid = function (codigo, descricao, observacoes, preferido) {
      return {
        codigo: ns.helpers.normalizarCodigoCid(codigo),
        descricao: toTexto(descricao),
        observacoes: toTexto(observacoes),
        preferido: !!preferido
      };
    };
  }

  if (typeof ns.helpers.compararTextoCid !== "function") {
    ns.helpers.compararTextoCid = function (texto, termo) {
      return toBusca(texto).includes(toBusca(termo));
    };
  }

  if (typeof ns.getStatus !== "function") {
    ns.getStatus = function () {
      return {
        modulo: "cid",
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

  meta.versao = "subetapa-3";
  ns.subetapa = meta.versao;
})();
