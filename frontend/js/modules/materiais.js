(function () {
  "use strict";

  const moduleInfo = Object.freeze({
    nome: "Materiais",
    modulo: "materiais",
    versaoSubetapa: "1_namespace_passivo",
    status: "passivo",
    ativo: false,
    controlaFluxo: false,
    descricao: "Namespace passivo do modulo Materiais. Mantem o app.js como fonte funcional da verdade.",
    riscosPreservados: Object.freeze([
      "DOM e modal continuam no monolito",
      "requestJson/fetch continuam no monolito",
      "selecao de linha, renderizacao e binds continuam no monolito",
      "payloads e endpoints continuam no monolito",
      "calculos numericos continuam no monolito",
      "integracao com Procedimentos e Procedimentos Genericos continua no monolito"
    ]),
    dependenciasDocumentais: Object.freeze([
      "frontend/app.js",
      "frontend/index.html",
      "Materiais",
      "Procedimentos",
      "Procedimentos Genericos",
      "Auxiliares / Tabelas auxiliares",
      "Unidades"
    ]),
    helpersCandidatosFuturos: Object.freeze([
      "formatDec2(v)",
      "formatDec2Dot(v)",
      "parseMaterialNumber(v)"
    ])
  });

  function cloneInfo() {
    return JSON.parse(JSON.stringify({
      ...moduleInfo,
      riscosPreservados: [...moduleInfo.riscosPreservados],
      dependenciasDocumentais: [...moduleInfo.dependenciasDocumentais],
      helpersCandidatosFuturos: [...moduleInfo.helpersCandidatosFuturos]
    }));
  }

  function materiaisUniqueAuxDescricoes(arr) {
    const out = [];
    const seen = new Set();
    const lista = Array.isArray(arr) ? arr : [];

    for (const item of lista) {
      const descricao = String(item?.descricao ?? "").trim();
      if (!descricao) continue;
      const chave = descricao.toLowerCase();
      if (seen.has(chave)) continue;
      seen.add(chave);
      out.push(descricao);
    }

    return out;
  }

  const api = Object.freeze({
    meta: moduleInfo,
    nome: moduleInfo.nome,
    modulo: moduleInfo.modulo,
    versaoSubetapa: moduleInfo.versaoSubetapa,
    status: moduleInfo.status,
    ativo: moduleInfo.ativo,
    controlaFluxo: moduleInfo.controlaFluxo,
    descricao: moduleInfo.descricao,
    riscosPreservados: [...moduleInfo.riscosPreservados],
    dependenciasDocumentais: [...moduleInfo.dependenciasDocumentais],
    helpersCandidatosFuturos: [...moduleInfo.helpersCandidatosFuturos],
    materiaisUniqueAuxDescricoes,
    helpers: Object.freeze({
      materiaisUniqueAuxDescricoes
    }),
    getInfo() {
      return cloneInfo();
    },
    info() {
      return cloneInfo();
    }
  });

  window.BranaMateriaisModule = api;
})();
