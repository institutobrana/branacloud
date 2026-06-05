(function () {
  "use strict";

  const MODULE_NAME = "BranaTelaPrincipalOdontologicaEstado";
  const MOCK_ORIGEM = "ficha-pessoal-historico";

  const PACIENTE_VAZIO = Object.freeze({
    id: null,
    codigo: "",
    nome: "",
    nomeCompleto: "",
    status: "sem-paciente",
    simulado: false,
  });

  function texto(valor, fallback = "") {
    const result = String(valor ?? "").trim();
    return result || String(fallback ?? "").trim();
  }

  function criarPacienteSimulado(contexto = {}) {
    return {
      id: 900001,
      codigo: texto(contexto.pacienteCodigo, "TMP-OD-01"),
      nome: texto(contexto.pacienteNome, "Paciente Simulado 01"),
      nomeCompleto: texto(contexto.pacienteNome, "Paciente Simulado 01"),
      status: "simulado",
      simulado: true,
      origem: texto(contexto.origem, MOCK_ORIGEM),
    };
  }

  function criarOdontogramaMock(comPaciente = false) {
    const base = [
      { dente: "18", status: "observar", descricao: "Elemento com acompanhamento visual." },
      { dente: "16", status: "ok", descricao: "Sem ocorrência simulada." },
      { dente: "11", status: "restaurado", descricao: "Restauracao simulada em leitura." },
      { dente: "26", status: "programado", descricao: "Aguardando procedimento simulado." },
      { dente: "31", status: "ok", descricao: "Ponto de referencia neutro." },
      { dente: "46", status: "ausente", descricao: "Espaco vazio simulado." },
    ];

    return base.map((item, idx) => ({
      slot: idx + 1,
      dente: item.dente,
      status: comPaciente ? item.status : "neutro",
      descricao: comPaciente ? item.descricao : "Estado visual neutro.",
    }));
  }

  function criarProcedimentosMock(comPaciente = false) {
    const procedimentos = [
      {
        codigo: "PRO-101",
        nome: "Procedimento simulado A",
        observacao: "Item apenas ilustrativo.",
      },
      {
        codigo: "PRO-202",
        nome: "Procedimento simulado B",
        observacao: "Sem vínculo com banco real.",
      },
      {
        codigo: "PRO-303",
        nome: "Procedimento simulado C",
        observacao: "Usado somente em leitura visual.",
      },
    ];

    return comPaciente ? procedimentos : procedimentos.slice(0, 1).map((item) => ({
      ...item,
      nome: "Procedimento neutro",
      observacao: "Sem paciente selecionado.",
    }));
  }

  function criarHistoricoMock(comPaciente = false) {
    const linhas = [
      {
        data: "01/06/2026",
        cirurgiao: "Cirurgiao Simulado",
        regiao: "18",
        descricao: "Registro visual sem dados reais.",
      },
      {
        data: "03/06/2026",
        cirurgiao: "Prestador Ficticio",
        regiao: "16",
        descricao: "Linha de historico apenas ilustrativa.",
      },
      {
        data: "05/06/2026",
        cirurgiao: "Equipe Simulada",
        regiao: "11",
        descricao: "Fluxo de leitura isolado.",
      },
    ];

    return comPaciente ? linhas : linhas.slice(0, 1).map((item) => ({
      ...item,
      cirurgiao: "Sem paciente",
      descricao: "Historico neutro.",
    }));
  }

  function criarAgendaMock(comPaciente = false) {
    const agenda = [
      { hora: "07:30", descricao: "Acolhimento simulado" },
      { hora: "08:00", descricao: "Consulta simulada" },
      { hora: "09:15", descricao: "Retorno ilustrativo" },
    ];

    return comPaciente ? agenda : agenda.slice(0, 1).map((item) => ({
      ...item,
      descricao: "Agenda neutra",
    }));
  }

  function obterEstadoTelaPrincipalOdontologicaMock(opcoes = {}) {
    const contexto = opcoes && typeof opcoes === "object" ? opcoes : {};
    const modo = texto(contexto.modo, "visual-estatico");
    const comPaciente = !!contexto.comPaciente;
    const paciente = comPaciente ? criarPacienteSimulado(contexto) : PACIENTE_VAZIO;

    return Object.freeze({
      module: MODULE_NAME,
      modo,
      origem: texto(contexto.origem, MOCK_ORIGEM),
      comPaciente,
      paciente,
      odontograma: criarOdontogramaMock(comPaciente),
      procedimentos: criarProcedimentosMock(comPaciente),
      historico: criarHistoricoMock(comPaciente),
      agenda: criarAgendaMock(comPaciente),
      observacoesVisuais: comPaciente
        ? "Paciente simulado em leitura visual."
        : "Sem paciente selecionado. Estado neutro para teste.",
      statusVisual: comPaciente ? "simulado" : "neutro",
      resumoVisual: comPaciente
        ? "Esqueleto visual isolado com contexto fictício."
        : "Esqueleto visual isolado aguardando paciente.",
    });
  }

  const api = Object.freeze({
    MODULE_NAME,
    obterEstadoTelaPrincipalOdontologicaMock,
    criarPacienteSimulado,
    criarOdontogramaMock,
    criarProcedimentosMock,
    criarHistoricoMock,
    criarAgendaMock,
  });

  if (typeof window !== "undefined") {
    window.BranaTelaPrincipalOdontologicaEstado = api;
  }

  if (typeof globalThis !== "undefined") {
    globalThis.BranaTelaPrincipalOdontologicaEstado = api;
  }
})();
