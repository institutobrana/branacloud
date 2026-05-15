(function () {
  "use strict";

  const MODULE_NAME = "BranaAnamneseModule";
  const MODULE_VERSION = "subetapa-3b-helper-validar-texto-pergunta";

  function anamneseValidarNomeQuestionario(nome) {
    const valor = String(nome ?? "").trim();

    if (!valor) {
      return {
        valido: false,
        mensagem: "Informe o nome do questionário.",
        valor: "",
      };
    }

    return {
      valido: true,
      mensagem: "",
      valor,
    };
  }

  function anamneseValidarTextoPergunta(texto) {
    const valor = String(texto ?? "").trim();

    if (!valor) {
      return {
        valido: false,
        mensagem: "Informe o texto da pergunta.",
        valor: "",
      };
    }

    return {
      valido: true,
      mensagem: "",
      valor,
    };
  }

  const module = {
    meta: {
      name: MODULE_NAME,
      version: MODULE_VERSION,
      description: "Namespace passivo do módulo Anamnese. Não controla fluxo funcional nesta etapa.",
      createdAt: "subetapa-3b",
    },

    nome: "Anamnese",
    subetapa: 3,
    status: "passivo",
    ativo: false,
    controlaFluxo: false,

    diagnostico: {
      origem: "Subetapa 0 revisada pós-recuperação EDS70",
      fluxoAtivo: "frontend/app.js permanece como fonte funcional da verdade",
      observacao:
        "Este módulo não usa DOM, fetch, requestJson, binds, modais, renderização ou estado global funcional nesta etapa.",
    },

    funcoesMonoliticasMapeadas: [
      "anamneseAbrir",
      "anamneseEnsureUI",
      "anamneseCarregarQuestionarios",
      "anamneseRenderQuestionarios",
      "anamneseSalvarQuestionario",
      "anamneseExcluirQuestionario",
      "anamneseCarregarPerguntas",
      "anamneseSalvarPergunta",
      "anamneseExcluirPergunta",
      "anamneseRenumeraPerguntas",
      "anamneseAbrirModalQuestionario",
      "anamneseAbrirModalPergunta",
      "anamneseVincularEventos",
      "fichaAnamneseCarregar",
      "fichaAnamneseSalvarSelecionada",
      "fichaAnamneseImprimir",
    ],

    helpersCandidatosFuturos: [
      "anamneseNormalizarNomeQuestionario",
      "anamneseValidarNomeQuestionario",
      "anamneseNormalizarTextoPergunta",
      "anamneseValidarTextoPergunta",
      "anamneseNormalizarTipoPergunta",
      "anamneseNormalizarTipoResposta",
      "anamneseOrdenarPerguntasLocal",
      "anamneseOrdenarQuestionariosLocal",
      "anamneseFormatarRotuloStatus",
    ],

    riscosConhecidos: [
      "bloco legado que forçava Principal",
      "fluxo ativo API-driven de questionários/perguntas",
      "ficha do paciente e respostas clínicas",
      "renumeração de perguntas",
      "modais de questionário e pergunta",
      "exclusão de questionários/perguntas",
      "cache de questionários/perguntas",
      "risco de repetir regressão da lista de questionários",
    ],

    endpointsMapeados: [
      "/anamnese/questionarios",
      "/anamnese/questionarios/{id}/perguntas",
      "/anamnese/respostas",
    ],

    seedObrigatorio: [
      "Principal",
      "Implante",
      "Ficha complementar",
    ],

    questionariosRecuperadosClinica1: [
      "Principal",
      "Implante",
      "Ficha complementar",
      "Anamnese de Saúde",
      "Anamnese pessoal",
    ],

    helpers: {
      anamneseValidarNomeQuestionario,
      anamneseValidarTextoPergunta,
    },

    getInfo() {
      return {
        meta: this.meta,
        nome: this.nome,
        subetapa: this.subetapa,
        status: this.status,
        ativo: this.ativo,
        controlaFluxo: this.controlaFluxo,
        diagnostico: this.diagnostico,
        funcoesMonoliticasMapeadas: this.funcoesMonoliticasMapeadas.slice(),
        helpersCandidatosFuturos: this.helpersCandidatosFuturos.slice(),
        riscosConhecidos: this.riscosConhecidos.slice(),
        endpointsMapeados: this.endpointsMapeados.slice(),
        seedObrigatorio: this.seedObrigatorio.slice(),
        questionariosRecuperadosClinica1: this.questionariosRecuperadosClinica1.slice(),
        helpers: Object.keys(this.helpers || {}),
      };
    },

    getStatus() {
      return {
        nome: this.nome,
        subetapa: this.subetapa,
        status: this.status,
        ativo: this.ativo,
        controlaFluxo: this.controlaFluxo,
      };
    },

    info() {
      return this.getInfo();
    },
  };

  Object.freeze(module.meta);
  Object.freeze(module.diagnostico);
  Object.freeze(module.funcoesMonoliticasMapeadas);
  Object.freeze(module.helpersCandidatosFuturos);
  Object.freeze(module.riscosConhecidos);
  Object.freeze(module.endpointsMapeados);
  Object.freeze(module.seedObrigatorio);
  Object.freeze(module.questionariosRecuperadosClinica1);
  Object.freeze(module.helpers);

  window.BranaAnamneseModule = Object.freeze(module);
})();
