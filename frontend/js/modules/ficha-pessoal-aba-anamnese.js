(function () {
  "use strict";

  const MODULE_NAME = "BranaFichaPessoalAbaAnamnese";
  const ENVELOPE_VERSION = 2;
  const STYLE_ID = "ficha-anamnese-visual-style";

  const state = {
    loadToken: 0,
    perguntasToken: 0,
    questionarioId: null,
    questionarioSelId: null,
    questionarios: [],
    perguntas: [],
    statusPerguntas: "idle",
    saveStatus: "idle",
    dirty: false,
    salvando: false,
    draftPerguntas: {},
    savedPerguntas: {},
    confirmBackdrop: null,
    confirmPromise: null,
    confirmResolve: null,
  };

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .ficha-anamnese-wrap{display:flex;flex-direction:column;min-height:420px;box-sizing:border-box}
      .ficha-anamnese-shell{display:flex;flex-direction:column;gap:8px;min-height:0;flex:1;padding:8px;box-sizing:border-box}
      .ficha-anamnese-head{display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap}
      .ficha-anamnese-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
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
      .ficha-anamnese-confirm-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.32);display:grid;place-items:center;z-index:3100}
      .ficha-anamnese-confirm-backdrop.hidden{display:none}
      .ficha-anamnese-confirm-box{width:min(440px,92vw);background:#f5f7fb;border:1px solid #9fa9b7;box-shadow:0 10px 32px rgba(0,0,0,.18);font:12px Tahoma,sans-serif;color:#1f2a35;box-sizing:border-box}
      .ficha-anamnese-confirm-head{padding:10px 12px;border-bottom:1px solid #c5cfdb;background:#edf2f8;font-weight:700}
      .ficha-anamnese-confirm-msg{padding:14px 12px 10px;line-height:1.35}
      .ficha-anamnese-confirm-actions{display:flex;gap:8px;justify-content:flex-end;padding:10px 12px 12px}
      .ficha-anamnese-confirm-actions .materiais-btn{min-width:90px;justify-content:center}
    `;
    document.head.appendChild(style);
  }

  function anamneseWrapEl() {
    return ficha?.panel?.querySelector(".ficha-anamnese-wrap") || null;
  }

  function respostaDraft(perguntaId) {
    return state.draftPerguntas[String(perguntaId)] || { resposta: "", complemento: "" };
  }

  function normalizarResposta(valor) {
    const base = String(valor || "").trim().toLowerCase();
    if (base === "sim" || base === "s") return "sim";
    if (base === "nao" || base === "não" || base === "nÃ£o" || base === "n") return "nao";
    return "";
  }

  function complementoTexto(valor) {
    return String(valor ?? "");
  }

  function clonarMapaPerguntas(mapa) {
    const out = {};
    Object.entries(mapa || {}).forEach(([key, item]) => {
      out[String(key)] = {
        resposta: normalizarResposta(item?.resposta),
        complemento: complementoTexto(item?.complemento),
      };
    });
    return out;
  }

  function respostaIgual(a, b) {
    return normalizarResposta(a?.resposta) === normalizarResposta(b?.resposta) && complementoTexto(a?.complemento) === complementoTexto(b?.complemento);
  }

  function atualizarDirty() {
    const chaves = new Set([...Object.keys(state.savedPerguntas || {}), ...Object.keys(state.draftPerguntas || {})]);
    state.dirty = false;
    for (const chave of chaves) {
      if (!respostaIgual(state.draftPerguntas?.[chave], state.savedPerguntas?.[chave])) {
        state.dirty = true;
        break;
      }
    }
  }

  function limparAlteracoesLocais() {
    state.dirty = false;
    state.draftPerguntas = {};
    state.savedPerguntas = {};
  }

  function sincronizarRascunhoComSalvo() {
    state.draftPerguntas = clonarMapaPerguntas(state.savedPerguntas);
    atualizarDirty();
  }

  function descartarAlteracoesLocais() {
    sincronizarRascunhoComSalvo();
    state.saveStatus = "idle";
    renderPerguntas();
  }

  function atualizarRespostaLocal(perguntaId, patch) {
    const id = String(perguntaId || "").trim();
    if (!id) return;
    const atual = state.draftPerguntas[id] || { resposta: "", complemento: "" };
    state.draftPerguntas[id] = {
      resposta: normalizarResposta(patch?.resposta !== undefined ? patch.resposta : atual.resposta),
      complemento: complementoTexto(patch?.complemento !== undefined ? patch.complemento : atual.complemento || ""),
    };
    atualizarDirty();
  }

  function resumirStatusSalvamento() {
    if (state.salvando) return "Salvando respostas...";
    if (state.dirty) return "Alteracoes pendentes.";
    if (state.saveStatus === "error") return "Falha ao salvar.";
    if (state.saveStatus === "saved") return "Respostas salvas.";
    return "";
  }

  function questionarioSelecionado() {
    return state.questionarios.find((item) => item.id === state.questionarioSelId) || null;
  }

  function desserializarRespostaSalva(raw, item) {
    const texto = String(raw ?? "").trim();
    if (!texto) return { resposta: "", complemento: "" };
    if (texto.startsWith("{") || texto.startsWith("[")) {
      try {
        const obj = JSON.parse(texto);
        const resposta = normalizarResposta(obj.resposta ?? obj.valor ?? obj.opcao ?? "");
        const complemento = complementoTexto(obj.complemento ?? obj.complemento_texto ?? obj.obs ?? "");
        return { resposta, complemento };
      } catch {}
    }
    const resposta = normalizarResposta(texto);
    if (resposta) return { resposta, complemento: "" };
    return { resposta: "", complemento: texto };
  }

  function serializarEnvelopeResposta(item, draft) {
    const resposta = normalizarResposta(draft?.resposta || "");
    const complemento = complementoTexto(draft?.complemento || "");
    if (!resposta && !complemento.trim()) return "";
    const questionario = questionarioSelecionado();
    const envelope = {
      versao: ENVELOPE_VERSION,
      paciente_id: Number(fichaPacienteAtualId || 0) || null,
      questionario_id: Number(state.questionarioSelId || questionario?.id || 0) || null,
      questionario_nome: String(questionario?.nome || "").trim(),
      pergunta_id: Number(item?.pergunta_id || item?.id || 0) || null,
      pergunta_texto: String(item?.texto || "").trim(),
      resposta: resposta || null,
      complemento,
    };
    return JSON.stringify(envelope);
  }

  function aplicarRespostasCarregadas(itens) {
    const saved = {};
    const draft = {};
    (Array.isArray(itens) ? itens : []).forEach((item) => {
      const perguntaId = Number(item?.pergunta_id || item?.id || 0) || 0;
      if (!perguntaId) return;
      const parsed = desserializarRespostaSalva(item?.resposta, item);
      saved[String(perguntaId)] = parsed;
      draft[String(perguntaId)] = { ...parsed };
    });
    state.savedPerguntas = saved;
    state.draftPerguntas = draft;
    atualizarDirty();
  }

  function perguntaMudou(perguntaId) {
    const chave = String(perguntaId || "").trim();
    if (!chave) return false;
    return !respostaIgual(state.draftPerguntas?.[chave], state.savedPerguntas?.[chave]);
  }

  function ensureConfirmUI() {
    if (state.confirmBackdrop) return state.confirmBackdrop;
    const backdrop = document.createElement("div");
    backdrop.className = "ficha-anamnese-confirm-backdrop hidden";
    backdrop.innerHTML = `
      <div class="ficha-anamnese-confirm-box" role="dialog" aria-modal="true" aria-labelledby="ficha-anamnese-confirm-title">
        <div id="ficha-anamnese-confirm-title" class="ficha-anamnese-confirm-head">Ficha pessoal - Anamnese</div>
        <div class="ficha-anamnese-confirm-msg" data-ficha-anamnese-confirm-msg>Os dados foram alterados. Deseja grava-los?</div>
        <div class="ficha-anamnese-confirm-actions">
          <button type="button" class="materiais-btn" data-ficha-anamnese-confirm-action="sim">Sim</button>
          <button type="button" class="materiais-btn" data-ficha-anamnese-confirm-action="nao">Nao</button>
          <button type="button" class="materiais-btn" data-ficha-anamnese-confirm-action="cancelar">Cancelar</button>
        </div>
      </div>`;
    const resolveConfirm = (value) => {
      if (!state.confirmResolve) return;
      const resolver = state.confirmResolve;
      state.confirmResolve = null;
      state.confirmPromise = null;
      backdrop.classList.add("hidden");
      resolver(value);
    };
    backdrop.addEventListener("click", (ev) => {
      if (ev.target === backdrop) resolveConfirm("cancelar");
    });
    backdrop.querySelectorAll("[data-ficha-anamnese-confirm-action]").forEach((btn) => {
      btn.addEventListener("click", () => resolveConfirm(btn.getAttribute("data-ficha-anamnese-confirm-action") || "cancelar"));
    });
    document.body.appendChild(backdrop);
    state.confirmBackdrop = backdrop;
    return backdrop;
  }

  async function solicitarConfirmacaoAlteracoes(motivo = "") {
    void motivo;
    if (!state.dirty) return "limpo";
    const backdrop = ensureConfirmUI();
    const msg = backdrop.querySelector("[data-ficha-anamnese-confirm-msg]");
    if (msg) msg.textContent = "Os dados foram alterados. Deseja grava-los?";
    backdrop.classList.remove("hidden");
    if (!state.confirmPromise) {
      state.confirmPromise = new Promise((resolve) => {
        state.confirmResolve = resolve;
      });
    }
    return state.confirmPromise;
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
      const id = Number(item?.pergunta_id || item?.id || 0) || idx + 1;
      const numero = item?.numero ?? idx + 1;
      const texto = esc(String(item?.texto || "").trim() || "Pergunta sem texto");
      const nomeGrupo = `ficha-anamnese-q-${selecionadoId || "vazio"}-${id}`;
      const draft = respostaDraft(id);
      const resposta = normalizarResposta(draft.resposta);
      const complemento = String(draft.complemento || "");
      return `
        <article class="ficha-anamnese-card ${perguntaMudou(id) ? "selected" : ""}" data-pergunta-id="${id}" data-questionario-id="${selecionadoId || ""}">
          <div class="ficha-anamnese-num">${esc(String(numero))})</div>
          <div class="ficha-anamnese-texto">${texto}</div>
          <div class="ficha-anamnese-controles">
            <div class="ficha-anamnese-opcoes" role="group" aria-label="Resposta visual da pergunta ${esc(String(numero))}">
              <label class="ficha-anamnese-opcao"><input type="radio" data-pergunta-id="${id}" data-resposta="sim" name="${nomeGrupo}" value="sim"${resposta === "sim" ? " checked" : ""}> Sim</label>
              <label class="ficha-anamnese-opcao"><input type="radio" data-pergunta-id="${id}" data-resposta="nao" name="${nomeGrupo}" value="nao"${resposta === "nao" ? " checked" : ""}> Nao</label>
            </div>
            <label style="display:block;min-width:0;width:100%">
              <span class="ficha-anamnese-meta">Complemento / observacao</span>
              <textarea class="ficha-anamnese-complemento" data-pergunta-id="${id}" placeholder="Complemento / observacao...">${esc(complemento)}</textarea>
            </label>
          </div>
        </article>`;
    }).join("");
    wrap.innerHTML = `
      <div class="ficha-anamnese-shell">
        <div class="ficha-anamnese-head">
          <div class="ficha-anamnese-meta">Questionario: ${esc(nomeQuestionario || "Questionario")}</div>
          <div class="ficha-anamnese-actions">
            <div class="ficha-anamnese-meta">${esc(resumirStatusSalvamento())}</div>
          </div>
        </div>
        <div class="ficha-anamnese-scroll ${state.statusPerguntas === "loading" ? "ficha-anamnese-loading" : ""}">
          ${textoEstado ? `<div class="ficha-anamnese-state">${esc(textoEstado)}</div>` : `<div class="ficha-anamnese-list">${cards}</div>`}
        </div>
        <div class="ficha-anamnese-foot">${esc(resumirStatusSalvamento())}</div>
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
      state.saveStatus = "idle";
      limparAlteracoesLocais();
      renderPerguntas();
      return false;
    }
    state.statusPerguntas = "loading";
    renderPerguntas();
    const qs = new URLSearchParams();
    qs.set("questionario_id", String(state.questionarioSelId));
    const path = `/anamnese/pacientes/${Number(fichaPacienteAtualId || 0)}/respostas?${qs.toString()}`;
    const { res, data } = await requestJson("GET", path, undefined, true);
    if (seq !== state.perguntasToken || (seqPai && seqPai !== state.loadToken)) return false;
    if (!res.ok) {
      state.perguntas = [];
      state.statusPerguntas = "error";
      renderPerguntas();
      return false;
    }
    const questionarioIdResposta = Number(data?.questionario_id || state.questionarioSelId || 0) || state.questionarioSelId || null;
    state.questionarioId = questionarioIdResposta;
    state.questionarioSelId = questionarioIdResposta;
    state.perguntas = Array.isArray(data?.itens) ? data.itens : [];
    aplicarRespostasCarregadas(state.perguntas);
    state.statusPerguntas = "ready";
    state.saveStatus = "idle";
    renderQuestionarios();
    renderPerguntas();
    return true;
  }

  async function salvarAnamneseAtual(motivo = "") {
    void motivo;
    if (!temPacienteValido() || !state.questionarioSelId) return false;
    const perguntas = Array.isArray(state.perguntas) ? state.perguntas : [];
    const pendentes = perguntas.filter((item, idx) => {
      const perguntaId = Number(item?.pergunta_id || item?.id || idx + 1 || 0) || 0;
      return perguntaMudou(perguntaId);
    });
    if (!pendentes.length) {
      state.saveStatus = "saved";
      atualizarDirty();
      renderPerguntas();
      return true;
    }
    state.salvando = true;
    state.saveStatus = "idle";
    renderPerguntas();
    const pacienteId = Number(fichaPacienteAtualId || 0) || 0;
    try {
      for (const item of pendentes) {
        const perguntaId = Number(item?.pergunta_id || item?.id || 0) || 0;
        if (!perguntaId) continue;
        const draft = state.draftPerguntas[String(perguntaId)] || { resposta: "", complemento: "" };
        const respostaTxt = serializarEnvelopeResposta(item, draft);
        const { res, data } = await requestJson(
          "PUT",
          `/anamnese/pacientes/${pacienteId}/respostas`,
          { pergunta_id: perguntaId, resposta: respostaTxt },
          true,
        );
        if (!res.ok) {
          throw new Error(data?.detail || "Falha ao salvar respostas da anamnese.");
        }
      }
      state.savedPerguntas = clonarMapaPerguntas(state.draftPerguntas);
      atualizarDirty();
      state.saveStatus = "saved";
      state.salvando = false;
      renderPerguntas();
      return true;
    } catch (err) {
      state.salvando = false;
      state.saveStatus = "error";
      atualizarDirty();
      renderPerguntas();
      window.alert(err?.message || "Falha ao salvar respostas da anamnese.");
      return false;
    }
  }

  async function decidirConfirmacao(escolha, motivo = "") {
    void motivo;
    if (escolha === "limpo") return true;
    if (escolha === "nao") {
      descartarAlteracoesLocais();
      return true;
    }
    if (escolha === "sim") return salvarAnamneseAtual(motivo);
    return false;
  }

  async function selecionarQuestionario(id) {
    const novo = Number(id || 0) || null;
    if (novo === state.questionarioSelId) return;
    const escolha = await solicitarConfirmacaoAlteracoes("troca de questionario");
    if (!(await decidirConfirmacao(escolha, "troca de questionario"))) {
      renderQuestionarios();
      return;
    }
    state.questionarioId = novo;
    state.questionarioSelId = novo;
    state.saveStatus = "idle";
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
      state.saveStatus = "idle";
      limparAlteracoesLocais();
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
    const wrap = anamneseWrapEl();
    if (wrap && wrap.dataset.bound !== "1") {
      wrap.dataset.bound = "1";
      wrap.addEventListener("change", (ev) => {
        const alvo = ev.target;
        if (!(alvo instanceof HTMLElement)) return;
        const radio = alvo.closest?.('input[type="radio"][data-pergunta-id]');
        if (radio) {
          const perguntaId = Number(radio.getAttribute("data-pergunta-id") || 0) || 0;
          if (!perguntaId) return;
          atualizarRespostaLocal(perguntaId, { resposta: radio.getAttribute("data-resposta") || radio.value || "" });
          return;
        }
        if (alvo.matches?.("textarea.ficha-anamnese-complemento")) {
          const perguntaId = Number(alvo.getAttribute("data-pergunta-id") || 0) || 0;
          if (!perguntaId) return;
          atualizarRespostaLocal(perguntaId, { complemento: alvo.value });
        }
      });
      wrap.addEventListener("input", (ev) => {
        const alvo = ev.target;
        if (!(alvo instanceof HTMLElement)) return;
        if (!alvo.matches?.("textarea.ficha-anamnese-complemento")) return;
        const perguntaId = Number(alvo.getAttribute("data-pergunta-id") || 0) || 0;
        if (!perguntaId) return;
        atualizarRespostaLocal(perguntaId, { complemento: alvo.value });
      });
    }
    if (ficha.anamneseQuestionario && ficha.anamneseQuestionario.dataset.bound !== "1") {
      ficha.anamneseQuestionario.dataset.bound = "1";
      ficha.anamneseQuestionario.addEventListener("change", (ev) => {
        void selecionarQuestionario(ev.target.value);
      });
    }
  }

  function onPacienteAplicado() {
    atualizarCabecalho();
    limparAlteracoesLocais();
    state.statusPerguntas = "idle";
    state.saveStatus = "idle";
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
    state.saveStatus = "idle";
    limparAlteracoesLocais();
    atualizarCabecalho();
    renderQuestionarios();
    renderPerguntas();
  }

  function beforeSetTab(tab) {
    if ((tab === "anamnese" || tab === "historico") && !temPacienteValido()) {
      window.alert("Necessario gravar o paciente antes de abrir esta aba.");
      return false;
    }
    if (fichaTabAtual === "anamnese" && tab !== "anamnese") {
      return solicitarConfirmacaoAlteracoes(`troca de aba para ${String(tab || "")}`).then((escolha) => decidirConfirmacao(escolha, `troca de aba para ${String(tab || "")}`));
    }
    return true;
  }

  async function beforeAbandonar(motivo = "") {
    if (!fichaTabAtual || fichaTabAtual !== "anamnese") return true;
    const escolha = await solicitarConfirmacaoAlteracoes(motivo);
    return decidirConfirmacao(escolha, motivo);
  }

  const module = {
    meta: {
      name: MODULE_NAME,
      kind: "facade-module",
      status: "active",
      createdAt: "ficha-pessoal-anamnese-persistencia-b2-envelope-textual",
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
    salvarAnamneseAtual,
    temAlteracoesPendentes() {
      return !!state.dirty;
    },
    bind,
    onPacienteAplicado,
    onLimparNovo,
    solicitarConfirmacaoAlteracoes,
    beforeAbandonar,
    beforeSetTab,
  };

  Object.freeze(module.meta);
  Object.freeze(module);

  window.BranaFichaPessoalAbaAnamnese = module;
})();
