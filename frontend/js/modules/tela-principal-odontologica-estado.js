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

  const LEGENDA_ODONTOGRAMA = Object.freeze([
    { codigo: "neutro", descricao: "Sem destaque", cor: "#d7e0ea" },
    { codigo: "observado", descricao: "Observado", cor: "#9ec5fe" },
    { codigo: "restaurado", descricao: "Restaurado", cor: "#97d8b1" },
    { codigo: "programado", descricao: "Programado", cor: "#f6c768" },
    { codigo: "ausente", descricao: "Ausente", cor: "#b7c0ca" },
  ]);

  const ARCADA_SUPERIOR_BASE = Object.freeze([
    { numero: "18", status: "observado", observacao: "Acompanhamento visual." },
    { numero: "17", status: "neutro", observacao: "Sem destaque simulado." },
    { numero: "16", status: "restaurado", observacao: "Leitura com restauracao." },
    { numero: "15", status: "neutro", observacao: "Estado visual neutro." },
    { numero: "14", status: "programado", observacao: "Procedimento futuro." },
    { numero: "13", status: "observado", observacao: "Monitoramento clinico." },
    { numero: "12", status: "neutro", observacao: "Sem marcador especial." },
    { numero: "11", status: "restaurado", observacao: "Elemento em condicao restaurada." },
    { numero: "21", status: "neutro", observacao: "Lado contralateral neutro." },
    { numero: "22", status: "observado", observacao: "Ponto visual de acompanhamento." },
    { numero: "23", status: "programado", observacao: "Intervencao planejada." },
    { numero: "24", status: "neutro", observacao: "Sem anotacao adicional." },
    { numero: "25", status: "restaurado", observacao: "Leitura restaurada." },
    { numero: "26", status: "programado", observacao: "Agenda clinica futura." },
    { numero: "27", status: "neutro", observacao: "Referencia neutra." },
    { numero: "28", status: "ausente", observacao: "Espaco ausente na leitura." },
  ]);

  const ARCADA_INFERIOR_BASE = Object.freeze([
    { numero: "48", status: "neutro", observacao: "Sem destaque visual." },
    { numero: "47", status: "observado", observacao: "Observacao inferior." },
    { numero: "46", status: "ausente", observacao: "Ausencia simulada." },
    { numero: "45", status: "neutro", observacao: "Leitura neutra." },
    { numero: "44", status: "restaurado", observacao: "Restauracao em leitura." },
    { numero: "43", status: "programado", observacao: "Procedimento em fila." },
    { numero: "42", status: "neutro", observacao: "Referencia neutra." },
    { numero: "41", status: "observado", observacao: "Acompanhamento clinico." },
    { numero: "31", status: "neutro", observacao: "Sem marcador especial." },
    { numero: "32", status: "restaurado", observacao: "Elemento restaurado." },
    { numero: "33", status: "observado", observacao: "Ponto de controle." },
    { numero: "34", status: "neutro", observacao: "Leitura neutra." },
    { numero: "35", status: "programado", observacao: "Planejamento em curso." },
    { numero: "36", status: "observado", observacao: "Monitoramento visual." },
    { numero: "37", status: "neutro", observacao: "Sem destaque." },
    { numero: "38", status: "ausente", observacao: "Espaco ausente na leitura." },
  ]);

  function texto(valor, fallback = "") {
    const result = String(valor ?? "").trim();
    return result || String(fallback ?? "").trim();
  }

  function normalizarStatus(status) {
    const valor = texto(status, "neutro").toLowerCase();
    if (["observado", "restaurado", "programado", "ausente", "neutro"].includes(valor)) {
      return valor;
    }
    return "neutro";
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

  function montarTooth(base, arco, indice, comPaciente) {
    return {
      numero: texto(base.numero),
      status: comPaciente ? normalizarStatus(base.status) : "neutro",
      observacao: comPaciente ? texto(base.observacao, "Leitura visual odontologica.") : "Sem paciente selecionado.",
      arco,
      indice: indice + 1,
      lado: indice < 8 ? "direita" : "esquerda",
    };
  }

  function criarArcadaDentariaMock(comPaciente = false) {
    const superior = ARCADA_SUPERIOR_BASE.map((item, indice) => montarTooth(item, "superior", indice, comPaciente));
    const inferior = ARCADA_INFERIOR_BASE.map((item, indice) => montarTooth(item, "inferior", indice, comPaciente));
    return { superior, inferior };
  }

  function criarOdontogramaMock(comPaciente = false) {
    const arcadas = criarArcadaDentariaMock(comPaciente);
    return [...arcadas.superior, ...arcadas.inferior].map((item, index) => ({
      slot: index + 1,
      dente: item.numero,
      arco: item.arco,
      status: item.status,
      descricao: item.observacao,
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
        observacao: "Sem vinculo com banco real.",
      },
      {
        codigo: "PRO-303",
        nome: "Procedimento simulado C",
        observacao: "Usado somente em leitura visual.",
      },
    ];

    return comPaciente
      ? procedimentos
      : procedimentos.slice(0, 1).map((item) => ({
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

    return comPaciente
      ? linhas
      : linhas.slice(0, 1).map((item) => ({
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

    return comPaciente
      ? agenda
      : agenda.slice(0, 1).map((item) => ({
          ...item,
          descricao: "Agenda neutra",
        }));
  }

  function obterEstadoTelaPrincipalOdontologicaMock(opcoes = {}) {
    const contexto = opcoes && typeof opcoes === "object" ? opcoes : {};
    const modo = texto(contexto.modo, "visual-estatico");
    const comPaciente = !!contexto.comPaciente;
    const paciente = comPaciente ? criarPacienteSimulado(contexto) : PACIENTE_VAZIO;
    const arcadas = criarArcadaDentariaMock(comPaciente);

    return Object.freeze({
      module: MODULE_NAME,
      modo,
      origem: texto(contexto.origem, MOCK_ORIGEM),
      comPaciente,
      paciente,
      arcadas,
      odontograma: criarOdontogramaMock(comPaciente),
      procedimentos: criarProcedimentosMock(comPaciente),
      historico: criarHistoricoMock(comPaciente),
      agenda: criarAgendaMock(comPaciente),
      legendaOdontograma: LEGENDA_ODONTOGRAMA,
      observacoesVisuais: comPaciente
        ? "Paciente simulado em leitura visual odontologica."
        : "Sem paciente selecionado. Arcadas neutras para teste.",
      statusVisual: comPaciente ? "simulado" : "neutro",
      resumoVisual: comPaciente
        ? "Esqueleto visual isolado com arcadas odontologicas mockadas."
        : "Esqueleto visual isolado aguardando paciente.",
    });
  }

  const api = Object.freeze({
    MODULE_NAME,
    LEGENDA_ODONTOGRAMA,
    obterEstadoTelaPrincipalOdontologicaMock,
    criarPacienteSimulado,
    criarArcadaDentariaMock,
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
