(function () {
  "use strict";

  const root = window;
  const ns = root.BranaMedicamentosModule = root.BranaMedicamentosModule || {};
  const meta = ns.meta = ns.meta || {
    nome: "Medicamentos",
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

  if (typeof ns.helpers.normalizarTextoMedicamento !== "function") {
    ns.helpers.normalizarTextoMedicamento = function (texto) {
      return toTexto(texto);
    };
  }

  if (typeof ns.helpers.validarNomeMedicamento !== "function") {
    ns.helpers.validarNomeMedicamento = function (nome) {
      const valor = ns.helpers.normalizarTextoMedicamento(nome);
      if (!valor) {
        return { ok: false, nome: "", mensagem: "Informe o nome do medicamento." };
      }
      return { ok: true, nome: valor };
    };
  }

  if (typeof ns.helpers.validarGrupoMedicamento !== "function") {
    ns.helpers.validarGrupoMedicamento = function (grupo) {
      return {
        ok: true,
        grupo: ns.helpers.normalizarTextoMedicamento(grupo)
      };
    };
  }

  if (typeof ns.helpers.compararTextoMedicamento !== "function") {
    ns.helpers.compararTextoMedicamento = function (texto, termo) {
      return toBusca(texto).includes(toBusca(termo));
    };
  }

  if (typeof ns.getStatus !== "function") {
    ns.getStatus = function () {
      return {
        modulo: "medicamentos",
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
