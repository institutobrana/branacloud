(function () {
  "use strict";

  const MODULE_NAME = "BranaFichaPessoalAbaAnamnese";

  const state = {
    loadToken: 0,
    questionarioId: null,
    questionarioSelId: null,
    questionarios: [],
  };

  function temPacienteValido() {
    return Number(fichaPacienteAtualId || 0) > 0;
  }

  function nomePacienteAtual() {
    const bruto = String(ficha?.titulo?.textContent || "").trim();
    const nome = bruto.replace(/^Ficha pessoal\s*-\s*/i, "").trim();
    return nome || String(ficha?.nome?.value || "").trim() || "";
  }

  function atualizarCabecalho() {
    if (!ficha?.anamnesePaciente) return;
    const nome = temPacienteValido() ? nomePacienteAtual() : "";
    ficha.anamnesePaciente.value = nome;
    ficha.anamnesePaciente.title = nome;
  }

  function questionarioSelecionado() {
    return state.questionarios.find((item) => item.id === state.questionarioSelId) || null;
  }

  function renderQuestionarios() {
    if (!ficha?.anamneseQuestionario) return false;
    const itens = Array.isArray(state.questionarios) ? state.questionarios : [];
    if (!itens.length) {
      ficha.anamneseQuestionario.innerHTML = '<option value="">Sem questionarios</option>';
      ficha.anamneseQuestionario.disabled = true;
      state.questionarioSelId = null;
      return false;
    }
    ficha.anamneseQuestionario.disabled = false;
    const existe = itens.some((item) => item.id === state.questionarioSelId);
    if (!existe) {
      const fallbackId = itens.some((item) => item.id === state.questionarioId) ? state.questionarioId : itens[0]?.id || null;
      state.questionarioSelId = Number(fallbackId || 0) || null;
    }
    ficha.anamneseQuestionario.innerHTML = itens.map((item) => `<option value="${item.id}">${esc(item.nome || "")}</option>`).join("");
    ficha.anamneseQuestionario.value = String(state.questionarioSelId || "");
    return true;
  }

  async function carregarQuestionarios(seq = 0) {
    if (!ficha?.anamneseQuestionario) return false;
    const { res, data } = await requestJson("GET", "/anamnese/questionarios", undefined, true);
    if (seq && seq !== state.loadToken) return false;
    if (!res.ok) {
      state.questionarios = [];
      renderQuestionarios();
      return false;
    }
    state.questionarios = Array.isArray(data) ? data : [];
    renderQuestionarios();
    return true;
  }

  function selecionarQuestionario(id) {
    const novo = Number(id || 0) || null;
    if (novo === state.questionarioSelId) return;
    state.questionarioId = novo;
    state.questionarioSelId = novo;
    renderQuestionarios();
  }

  async function carregar() {
    const seq = ++state.loadToken;
    atualizarCabecalho();
    if (!temPacienteValido() || !ficha?.anamneseQuestionario) {
      state.questionarioId = null;
      state.questionarioSelId = null;
      state.questionarios = [];
      renderQuestionarios();
      return;
    }
    const carregou = await carregarQuestionarios(seq);
    if (seq !== state.loadToken) return;
    if (!carregou) return;
    state.questionarioSelId = Number(state.questionarioId || 0) || state.questionarioSelId || state.questionarios[0]?.id || null;
    renderQuestionarios();
  }

  function bind() {
    if (!ficha) return;
    if (ficha.anamneseQuestionario && ficha.anamneseQuestionario.dataset.bound !== "1") {
      ficha.anamneseQuestionario.dataset.bound = "1";
      ficha.anamneseQuestionario.addEventListener("change", (ev) => {
        selecionarQuestionario(ev.target.value);
      });
    }
  }

  function onPacienteAplicado() {
    atualizarCabecalho();
    if (fichaTabAtual === "anamnese") carregar();
  }

  async function onLimparNovo() {
    state.loadToken++;
    state.questionarioId = null;
    state.questionarioSelId = null;
    state.questionarios = [];
    atualizarCabecalho();
    renderQuestionarios();
  }

  function beforeSetTab(tab) {
    if ((tab === "anamnese" || tab === "historico") && !temPacienteValido()) {
      window.alert("Necessario gravar o paciente antes de abrir esta aba.");
      return false;
    }
    return true;
  }

  const module = {
    meta: {
      name: MODULE_NAME,
      kind: "facade-module",
      status: "active",
      createdAt: "ficha-pessoal-anamnese-modularizacao-sem-mudar-comportamento",
    },
    state: {
      get loadToken() {
        return state.loadToken;
      },
    },
    temPacienteValido,
    nomePacienteAtual,
    atualizarCabecalho,
    questionarioSelecionado,
    renderQuestionarios,
    carregarQuestionarios,
    selecionarQuestionario,
    carregar,
    bind,
    onPacienteAplicado,
    onLimparNovo,
    beforeSetTab,
  };

  Object.freeze(module.meta);
  Object.freeze(module);

  window.BranaFichaPessoalAbaAnamnese = module;
})();
