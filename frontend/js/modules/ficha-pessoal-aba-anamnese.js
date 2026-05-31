(function () {
  "use strict";

  const MODULE_NAME = "BranaFichaPessoalAbaAnamnese";

  const state = {
    loadToken: 0,
    perguntasToken: 0,
    questionarioId: null,
    questionarioSelId: null,
    questionarios: [],
    perguntas: [],
    statusPerguntas: "idle",
  };

  const STYLE_ID = "ficha-anamnese-visual-style";

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .ficha-anamnese-wrap{display:flex;flex-direction:column;min-height:420px;box-sizing:border-box}
      .ficha-anamnese-shell{display:flex;flex-direction:column;gap:8px;min-height:0;flex:1;padding:8px;box-sizing:border-box}
      .ficha-anamnese-head{display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap}
      .ficha-anamnese-meta{font:11px Tahoma,sans-serif;color:#4f5f72}
      .ficha-anamnese-scroll{flex:1;min-height:0;overflow-y:auto;overflow-x:hidden;border:1px solid #d6deea;background:#fff}
      .ficha-anamnese-state{padding:14px 12px;font:11px Tahoma,sans-serif;color:#5a697c;background:#fafcff}
      .ficha-anamnese-list{display:flex;flex-direction:column;gap:8px;padding:8px;box-sizing:border-box}
      .ficha-anamnese-card{border:1px solid #d5ddea;border-radius:4px;background:#fbfdff;padding:8px 10px;display:grid;grid-template-columns:auto 1fr;gap:8px 10px;align-items:start}
      .ficha-anamnese-num{font:700 11px Tahoma,sans-serif;color:#35506b;min-width:28px}
      .ficha-anamnese-texto{font:11px Tahoma,sans-serif;color:#22303f;line-height:1.35;word-break:break-word}
      .ficha-anamnese-controles{grid-column:1 / -1;display:grid;grid-template-columns:120px minmax(240px,1fr);gap:8px 10px;align-items:start}
      .ficha-anamnese-opcoes{display:flex;flex-direction:column;gap:4px;align-items:flex-start;padding-top:2px}
      .ficha-anamnese-opcao{display:flex;align-items:center;gap:5px;font:11px Tahoma,sans-serif;color:#243444;cursor:pointer;user-select:none;line-height:1.2}
      .ficha-anamnese-opcao input{margin:0}
      .ficha-anamnese-complemento{width:100%;min-height:50px;resize:vertical;border:1px solid #c2ccda;border-radius:3px;box-sizing:border-box;padding:4px 5px;font:11px Tahoma,sans-serif;background:#fff}
      .ficha-anamnese-foot{padding:6px 8px;border-top:1px solid #d6deea;background:#f8fafc;font:11px Tahoma,sans-serif;color:#627285}
      .ficha-anamnese-loading{opacity:.86}
      .ficha-anamnese-empty{padding:12px}
      .ficha-anamnese-card.selected{box-shadow:0 0 0 1px #8cc3ff inset;background:#f2f8ff}
    `;
    document.head.appendChild(style);
  }

  function anamneseWrapEl() {
    return ficha?.panel?.querySelector(".ficha-anamnese-wrap") || null;
  }

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

  function statePerguntasTexto() {
    if (state.statusPerguntas === "loading") return "Carregando perguntas...";
    if (state.statusPerguntas === "error") return "Falha ao carregar perguntas.";
    if (!state.questionarioSelId) return "Selecione um questionario para listar as perguntas.";
    if (!Array.isArray(state.perguntas) || !state.perguntas.length) return "Nenhuma pergunta encontrada para o questionario selecionado.";
    return "";
  }

  function renderPerguntas() {
    const wrap = anamneseWrapEl();
    if (!wrap) return false;
    ensureStyles();
    const textoEstado = statePerguntasTexto();
    const perguntas = Array.isArray(state.perguntas) ? state.perguntas : [];
    const questionario = questionarioSelecionado();
    const nomeQuestionario = questionario?.nome || "";
    const selecionadoId = Number(state.questionarioSelId || 0) || null;
    const cards = perguntas.map((item, idx) => {
      const id = Number(item?.id || 0) || idx + 1;
      const numero = item?.numero ?? idx + 1;
      const texto = esc(String(item?.texto || "").trim() || "Pergunta sem texto");
      const nomeGrupo = `ficha-anamnese-q-${selecionadoId || "vazio"}-${id}`;
      return `
        <article class="ficha-anamnese-card" data-pergunta-id="${id}">
          <div class="ficha-anamnese-num">${esc(String(numero))})</div>
          <div class="ficha-anamnese-texto">${texto}</div>
          <div class="ficha-anamnese-controles">
            <div class="ficha-anamnese-opcoes" role="group" aria-label="Resposta visual da pergunta ${esc(String(numero))}">
              <label class="ficha-anamnese-opcao"><input type="radio" name="${nomeGrupo}" value="sim"> Sim</label>
              <label class="ficha-anamnese-opcao"><input type="radio" name="${nomeGrupo}" value="nao"> Nao</label>
            </div>
            <label style="display:block;min-width:0;width:100%">
              <span class="ficha-anamnese-meta">Complemento / observacao</span>
              <textarea class="ficha-anamnese-complemento" placeholder="Complemento visual sem salvamento..."></textarea>
            </label>
          </div>
        </article>`;
    }).join("");
    wrap.innerHTML = `
      <div class="ficha-anamnese-shell">
        <div class="ficha-anamnese-head">
          <div class="ficha-anamnese-meta">${esc(nomeQuestionario || "Questionario")}</div>
          <div class="ficha-anamnese-meta">Visual apenas, sem salvamento</div>
        </div>
        <div class="ficha-anamnese-scroll ${state.statusPerguntas === "loading" ? "ficha-anamnese-loading" : ""}">
          ${textoEstado ? `<div class="ficha-anamnese-state">${esc(textoEstado)}</div>` : `<div class="ficha-anamnese-list">${cards}</div>`}
        </div>
        <div class="ficha-anamnese-foot">Questionario visual carregado em memoria apenas para leitura local.</div>
      </div>`;
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

  async function carregarPerguntas(seqPai = 0) {
    const seq = ++state.perguntasToken;
    if (!temPacienteValido() || !state.questionarioSelId) {
      state.perguntas = [];
      state.statusPerguntas = "idle";
      renderPerguntas();
      return false;
    }
    state.statusPerguntas = "loading";
    renderPerguntas();
    const { res, data } = await requestJson("GET", `/anamnese/questionarios/${state.questionarioSelId}/perguntas`, undefined, true);
    if (seq !== state.perguntasToken || (seqPai && seqPai !== state.loadToken)) return false;
    if (!res.ok) {
      state.perguntas = [];
      state.statusPerguntas = "error";
      renderPerguntas();
      return false;
    }
    state.perguntas = Array.isArray(data) ? data : [];
    state.statusPerguntas = "ready";
    renderPerguntas();
    return true;
  }

  async function selecionarQuestionario(id) {
    const novo = Number(id || 0) || null;
    if (novo === state.questionarioSelId) return;
    state.questionarioId = novo;
    state.questionarioSelId = novo;
    renderQuestionarios();
    await carregarPerguntas(state.loadToken);
  }

  async function carregar() {
    const seq = ++state.loadToken;
    atualizarCabecalho();
    if (!temPacienteValido() || !ficha?.anamneseQuestionario) {
      state.questionarioId = null;
      state.questionarioSelId = null;
      state.questionarios = [];
      state.perguntas = [];
      state.statusPerguntas = "idle";
      renderQuestionarios();
      renderPerguntas();
      return;
    }
    const carregou = await carregarQuestionarios(seq);
    if (seq !== state.loadToken) return;
    if (!carregou) {
      state.perguntas = [];
      state.statusPerguntas = "error";
      renderPerguntas();
      return;
    }
    state.questionarioSelId = Number(state.questionarioId || 0) || state.questionarioSelId || state.questionarios[0]?.id || null;
    renderQuestionarios();
    await carregarPerguntas(seq);
  }

  function bind() {
    if (!ficha) return;
    if (ficha.anamneseQuestionario && ficha.anamneseQuestionario.dataset.bound !== "1") {
      ficha.anamneseQuestionario.dataset.bound = "1";
      ficha.anamneseQuestionario.addEventListener("change", (ev) => {
        void selecionarQuestionario(ev.target.value);
      });
    }
  }

  function onPacienteAplicado() {
    atualizarCabecalho();
    if (fichaTabAtual === "anamnese") carregar();
  }

  async function onLimparNovo() {
    state.loadToken++;
    state.perguntasToken++;
    state.questionarioId = null;
    state.questionarioSelId = null;
    state.questionarios = [];
    state.perguntas = [];
    state.statusPerguntas = "idle";
    atualizarCabecalho();
    renderQuestionarios();
    renderPerguntas();
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
    renderPerguntas,
    carregarQuestionarios,
    carregarPerguntas,
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
