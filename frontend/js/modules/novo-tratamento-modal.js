(function () {
  "use strict";

  const MODULE_NAME = "BranaNovoTratamentoModal";
  const STYLE_ID = "novo-tratamento-modal-style";
  const BACKDROP_ID = "novo-tratamento-modal-backdrop";
  const TAB_PRINCIPAL = "principal";
  const TAB_CONVENIO = "convenio";

  let mounted = false;
  let visible = false;
  let elements = null;
  let loadSeq = 0;

  function todayBR() {
    return new Date().toLocaleDateString("pt-BR");
  }

  function resolveSessionText(keys, fallback) {
    try {
      const sess = typeof sessaoAtual !== "undefined" ? sessaoAtual : null;
      if (sess) {
        for (const key of keys) {
          const value = String(sess?.[key] ?? "").trim();
          if (value) return value;
        }
      }
    } catch {}
    return String(fallback || "").trim();
  }

  function toText(value, fallback = "") {
    return String(value ?? fallback ?? "").trim();
  }

  function readAuthToken() {
    try {
      return String(localStorage.getItem("brana_token") || "").trim();
    } catch {
      return "";
    }
  }

  function resolvePacienteId(context = {}) {
    const directId = Number(context?.pacienteId || context?.patientId || context?.id || 0) || 0;
    if (directId > 0) return directId;
    try {
      const paciente = typeof BranaOdontogramaV1Module !== "undefined" ? BranaOdontogramaV1Module?.state?.paciente : null;
      const odontoId = Number(paciente?.id || 0) || 0;
      if (odontoId > 0) return odontoId;
    } catch {}
    try {
      const fichaId = Number(typeof fichaPacienteAtualId !== "undefined" ? fichaPacienteAtualId : 0) || 0;
      if (fichaId > 0) return fichaId;
    } catch {}
    return 0;
  }

  function resolveDefaults() {
    return {
      inicio: todayBR(),
      finalizacao: "",
      situacao: "Aberto",
      tabelaPrincipal: "PARTICULAR",
      indice: "R$",
      cirurgiaoResponsavel: resolveSessionText(["prestador_nome", "apelido", "nome"], "Tel"),
      unidadeAtendimento: resolveSessionText(["unidade_atendimento_nome", "clinica_nome", "nome_clinica"], "Instituto Brana - Odontologia"),
      observacoes: "",
      inclusao: "",
      alteracao: "",
      idade: "",
      arcadaPredominante: "Copiar do tratamento anterior",
      copiarIntervencoes: false,
      convenio: "particular",
      tipoAtendimento: "Tratamento Odontológico",
      cirurgiaoContratado: resolveSessionText(["prestador_nome", "apelido", "nome"], "Tel"),
      cirurgiaoSolicitante: resolveSessionText(["prestador_nome", "apelido", "nome"], "Tel"),
      cirurgiaoExecutante: resolveSessionText(["prestador_nome", "apelido", "nome"], "Tel"),
      sinaisClinicos: 3,
      alteracaoTecidos: 3,
      numeroGuia: "",
      dataAutorizacao: "",
      senhaAutorizacao: "",
      validadeSenha: "",
    };
  }

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .nt-backdrop{position:fixed;inset:0;z-index:5900;display:flex;align-items:center;justify-content:center;padding:10px;background:rgba(0,0,0,.12);box-sizing:border-box}
      .nt-backdrop.hidden{display:none}
      .nt-modal{width:min(468px,96vw);background:#efefef;border:1px solid #aeb3bb;box-shadow:0 4px 18px rgba(0,0,0,.18);box-sizing:border-box;font:12px Tahoma,Arial,sans-serif;color:#111}
      .nt-header{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;padding:8px 8px 0}
      .nt-title{font:13px Tahoma,Arial,sans-serif;color:#111;line-height:1.2}
      .nt-close{width:24px;height:22px;border:1px solid #b7bcc3;background:#efefef;color:#111;font:700 12px Tahoma,Arial,sans-serif;cursor:pointer;padding:0;line-height:1}
      .nt-tabs{display:flex;gap:4px;padding:6px 8px 0 8px;margin-bottom:6px;border-bottom:1px solid #b8bcc2}
      .nt-tab{height:23px;padding:0 10px;border:1px solid #aeb3bb;border-bottom:none;background:#e9e9e9;font:12px Tahoma,Arial,sans-serif;cursor:pointer;color:#111}
      .nt-tab.active{background:#fff;position:relative;top:1px}
      .nt-body{padding:10px 12px 12px}
      .nt-pane{display:none}
      .nt-pane.active{display:block}
      .nt-grid-top{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr) minmax(0,1.25fr);gap:8px}
      .nt-grid-mid{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,.85fr) minmax(0,1.35fr);gap:8px;margin-top:6px}
      .nt-grid-one{display:grid;grid-template-columns:1fr;gap:8px;margin-top:6px}
      .nt-field label{display:block;margin:0 0 2px;font:12px Tahoma,Arial,sans-serif;color:#222}
      .nt-field input,.nt-field select,.nt-field textarea{width:100%;box-sizing:border-box;border:1px solid #bac2cc;background:#fff;font:12px Tahoma,Arial,sans-serif;color:#111}
      .nt-field input,.nt-field select{height:24px;padding:0 6px}
      .nt-field textarea{height:58px;padding:5px 6px;resize:none;overflow-y:auto}
      .nt-audit-row{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:8px}
      .nt-audit-row input,.nt-age input{background:#23e5ef;border-color:#19bac3}
      .nt-divider{border-top:1px solid #cfcfcf;margin:10px 0 8px}
      .nt-section-title{font:12px Tahoma,Arial,sans-serif;color:#111;margin:0 0 6px}
      .nt-section-title span{background:#efefef;padding-right:8px}
      .nt-section-title::before{content:"";display:block;border-top:1px solid #cfcfcf;position:relative;top:10px}
      .nt-section-title span{position:relative;z-index:1;padding-left:0}
      .nt-section-title-wrap{position:relative}
      .nt-section-title-wrap .nt-section-title{margin:0}
      .nt-section-title-wrap .nt-section-title span{display:inline-block;position:relative;top:-10px;padding:0 8px 0 0}
      .nt-mini-grid{display:grid;grid-template-columns:minmax(120px,.42fr) minmax(0,1fr);gap:8px;align-items:start}
      .nt-age input{width:100%;height:24px;padding:0 6px}
      .nt-checkbox{display:flex;align-items:center;gap:6px;margin-top:6px;font:12px Tahoma,Arial,sans-serif;color:#111}
      .nt-checkbox input{width:auto;height:auto}
      .nt-foot{display:flex;justify-content:flex-end;gap:8px;padding:8px 12px 12px;border-top:1px solid #cfcfcf}
      .nt-foot .materiais-btn{min-width:78px;height:28px;justify-content:center}
      .nt-conv-grid{display:grid;grid-template-columns:1fr;gap:8px}
      .nt-conv-two{display:grid;grid-template-columns:1fr 1fr;gap:8px}
      .nt-conv-three{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}
      .nt-conv label{display:block;margin:0 0 2px;font:12px Tahoma,Arial,sans-serif;color:#222}
      .nt-conv input,.nt-conv select{width:100%;height:24px;box-sizing:border-box;border:1px solid #bac2cc;background:#fff;padding:0 6px;font:12px Tahoma,Arial,sans-serif;color:#111}
      .nt-conv .nt-soft{background:#fefefe}
      .nt-pane .nt-conv .nt-slim{height:24px}
      .nt-focus-ring:focus{outline:1px dotted #333;outline-offset:-2px}
    `;
    document.head.appendChild(style);
  }

  function normalizeOptionItem(value) {
    if (value && typeof value === "object") {
      const itemValue = value.value ?? value.id ?? value.numero ?? value.codigo ?? value.sigla ?? value.nome ?? value.label ?? "";
      const itemLabel = value.label ?? value.nome ?? value.sigla ?? value.descricao ?? String(itemValue ?? "");
      return {
        value: toText(itemValue),
        label: toText(itemLabel),
      };
    }
    const text = toText(value);
    return { value: text, label: text };
  }

  function setFieldValue(el, value) {
    if (!el) return;
    el.value = toText(value);
  }

  function applySelectSelection(select, selected) {
    if (!select || selected == null) return;
    const wanted = toText(selected);
    if (!wanted) return;
    const wantedLower = wanted.toLowerCase();
    const exact = Array.from(select.options || []).find((opt) => toText(opt.value) === wanted);
    if (exact) {
      select.value = exact.value;
      return;
    }
    const byLabel = Array.from(select.options || []).find((opt) => {
      const label = toText(opt.textContent);
      return label && (label.toLowerCase() === wantedLower || label.toLowerCase().includes(wantedLower));
    });
    if (byLabel) select.value = byLabel.value;
  }

  function setSelectOptions(select, values, selected, labelMapper) {
    if (!select) return;
    const seen = new Set();
    const opts = [];
    (Array.isArray(values) ? values : []).forEach((value) => {
      const item = normalizeOptionItem(value);
      if (!item.value && !item.label) return;
      const key = String(item.value || item.label).toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      opts.push({
        value: item.value,
        label: typeof labelMapper === "function" ? toText(labelMapper(value, item)) : item.label || item.value,
      });
    });
    select.innerHTML = opts.map((item) => `<option value="${esc(item.value)}">${esc(item.label || item.value)}</option>`).join("");
    applySelectSelection(select, selected);
  }

  function esc(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  async function loadPayloadForPaciente(pacienteId) {
    const id = Number(pacienteId || 0) || 0;
    if (id <= 0) return null;
    const token = readAuthToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await fetch(`/tratamentos/novo/combos?paciente_id=${encodeURIComponent(String(id))}`, {
      method: "GET",
      headers,
    });
    let data = null;
    try {
      data = await res.json();
    } catch {}
    if (!res.ok) {
      throw new Error(toText(data?.detail, "Falha ao carregar dados do novo tratamento."));
    }
    return data || null;
  }

  function applyPayload(rawPayload) {
    const cfg = getElements();
    if (!cfg) return;
    const payload = rawPayload && typeof rawPayload === "object" ? rawPayload : {};
    const defaults = payload.defaults && typeof payload.defaults === "object" ? payload.defaults : {};
    const fallback = resolveDefaults();
    const tabelas = Array.isArray(payload.tabelas) && payload.tabelas.length
      ? payload.tabelas
      : [
          { id: "PARTICULAR", nome: "PARTICULAR" },
          { id: "CONVENIO", nome: "CONVENIO" },
        ];
    const indices = Array.isArray(payload.indices) && payload.indices.length
      ? payload.indices
      : [
          { id: "R$", sigla: "R$", nome: "Reais" },
          { id: "US$", sigla: "US$", nome: "Dolar" },
        ];
    const cirurgioes = Array.isArray(payload.cirurgioes) && payload.cirurgioes.length
      ? payload.cirurgioes
      : [
          { id: fallback.cirurgiaoResponsavel, nome: fallback.cirurgiaoResponsavel },
        ];
    const unidades = Array.isArray(payload.unidades) && payload.unidades.length
      ? payload.unidades
      : [
          { id: fallback.unidadeAtendimento, nome: fallback.unidadeAtendimento },
        ];
    const convenios = Array.isArray(payload.convenios) && payload.convenios.length
      ? payload.convenios
      : [
          { id: "particular", nome: "Particular" },
        ];
    const tiposTiss = Array.isArray(payload.tipos_tiss) && payload.tipos_tiss.length
      ? payload.tipos_tiss
      : [
          { id: fallback.tipoAtendimento, nome: fallback.tipoAtendimento },
        ];
    const sinais = Array.isArray(payload.sinais) && payload.sinais.length
      ? payload.sinais
      : [
          { id: 3, nome: "<<Nao avaliado>>" },
          { id: 1, nome: "Sim" },
          { id: 2, nome: "Nao" },
        ];
    const tecidos = Array.isArray(payload.tecidos) && payload.tecidos.length
      ? payload.tecidos
      : sinais;
    const arcadasBase = Array.isArray(payload.arcadas) && payload.arcadas.length
      ? payload.arcadas
      : [
          { id: "Decidua", nome: "Decidua" },
          { id: "Mista", nome: "Mista" },
          { id: "Permanente", nome: "Permanente" },
        ];
    const arcadas = [
      { id: "Copiar do tratamento anterior", nome: "Copiar do tratamento anterior" },
      ...arcadasBase.filter((item) => toText(item?.id || item?.nome).toLowerCase() !== "copiar do tratamento anterior"),
    ];

    setFieldValue(cfg.inicio, defaults.data_inicio ?? fallback.inicio);
    setFieldValue(cfg.finalizacao, defaults.data_finalizacao ?? fallback.finalizacao);
    setFieldValue(cfg.observacoes, defaults.observacoes ?? fallback.observacoes);
    setFieldValue(cfg.inclusao, defaults.inclusao ?? fallback.inclusao);
    setFieldValue(cfg.alteracao, defaults.alteracao ?? fallback.alteracao);
    setFieldValue(cfg.idade, defaults.idade_texto ?? defaults.idade ?? fallback.idade);
    cfg.copiar.checked = !!(defaults.copiar_intervencoes ?? fallback.copiarIntervencoes);
    setFieldValue(cfg.convGuia, defaults.numero_guia ?? fallback.numeroGuia);
    setFieldValue(cfg.convAutorizacao, defaults.data_autorizacao ?? fallback.dataAutorizacao);
    setFieldValue(cfg.convSenha, defaults.senha_autorizacao ?? fallback.senhaAutorizacao);
    setFieldValue(cfg.convValidade, defaults.validade_senha ?? fallback.validadeSenha);

    setSelectOptions(cfg.situacao, payload.situacoes || ["Aberto", "Finalizado", "Cancelado"], defaults.situacao ?? fallback.situacao);
    setSelectOptions(cfg.tabela, tabelas, defaults.tabela_codigo ?? fallback.tabelaPrincipal, (value, item) => item.label || item.value);
    setSelectOptions(cfg.indice, indices, defaults.indice ?? fallback.indice, (value, item) => item.label || item.value);
    setSelectOptions(cfg.cirurgiao, cirurgioes, defaults.cirurgiao_responsavel_id ?? fallback.cirurgiaoResponsavel, (value, item) => item.label || item.value);
    setSelectOptions(cfg.unidade, unidades, defaults.unidade_atendimento ?? fallback.unidadeAtendimento, (value, item) => item.label || item.value);
    setSelectOptions(cfg.arcada, arcadas, defaults.arcada_predominante ?? fallback.arcadaPredominante, (value, item) => item.label || item.value);

    setSelectOptions(cfg.convConvenio, convenios, defaults.convenio ?? fallback.convenio, (value, item) => item.label || item.value);
    setSelectOptions(cfg.convTipo, tiposTiss, defaults.tipo_atendimento_tiss_id ?? fallback.tipoAtendimento, (value, item) => item.label || item.value);
    setSelectOptions(cfg.convContratado, cirurgioes, defaults.cirurgiao_contratado_id ?? fallback.cirurgiaoContratado, (value, item) => item.label || item.value);
    setSelectOptions(cfg.convSolicitante, cirurgioes, defaults.cirurgiao_solicitante_id ?? fallback.cirurgiaoSolicitante, (value, item) => item.label || item.value);
    setSelectOptions(cfg.convExecutante, cirurgioes, defaults.cirurgiao_executante_id ?? fallback.cirurgiaoExecutante, (value, item) => item.label || item.value);
    setSelectOptions(cfg.convSinais, sinais, defaults.sinais_doenca_periodontal ?? fallback.sinaisClinicos, (value, item) => item.label || item.value);
    setSelectOptions(cfg.convTecidos, tecidos, defaults.alteracao_tecidos ?? fallback.alteracaoTecidos, (value, item) => item.label || item.value);
  }

  function buildHtml() {
    return `
      <div id="${BACKDROP_ID}" class="nt-backdrop hidden" aria-hidden="true">
        <div class="nt-modal" role="dialog" aria-modal="true" aria-labelledby="nt-title">
          <div class="nt-header">
            <div id="nt-title" class="nt-title">Novo tratamento</div>
            <button type="button" class="nt-close" data-nt-action="close" aria-label="Fechar">X</button>
          </div>
          <div class="nt-tabs" role="tablist">
            <button type="button" class="nt-tab active" data-nt-tab="principal" role="tab" aria-selected="true">Principal</button>
            <button type="button" class="nt-tab" data-nt-tab="convenio" role="tab" aria-selected="false">Convênio</button>
          </div>
          <div class="nt-body">
            <section class="nt-pane active" data-nt-pane="principal">
              <div class="nt-grid-top">
                <div class="nt-field">
                  <label for="nt-inicio">Início:</label>
                  <input id="nt-inicio" class="nt-focus-ring" type="text" inputmode="numeric" maxlength="10">
                </div>
                <div class="nt-field">
                  <label for="nt-finalizacao">Finalização:</label>
                  <input id="nt-finalizacao" class="nt-focus-ring" type="text" inputmode="numeric" maxlength="10">
                </div>
                <div class="nt-field">
                  <label for="nt-situacao">Situação:</label>
                  <select id="nt-situacao" class="nt-focus-ring"></select>
                </div>
              </div>
              <div class="nt-grid-mid">
                <div class="nt-field">
                  <label for="nt-tabela">Tabela principal:</label>
                  <select id="nt-tabela" class="nt-focus-ring"></select>
                </div>
                <div class="nt-field">
                  <label for="nt-indice">Índice:</label>
                  <select id="nt-indice" class="nt-focus-ring"></select>
                </div>
                <div class="nt-field">
                  <label for="nt-cirurgiao">Cirurgião responsável:</label>
                  <select id="nt-cirurgiao" class="nt-focus-ring"></select>
                </div>
              </div>
              <div class="nt-grid-one">
                <div class="nt-field">
                  <label for="nt-unidade">Unidade de atendimento:</label>
                  <select id="nt-unidade" class="nt-focus-ring"></select>
                </div>
              </div>
              <div class="nt-divider"></div>
              <div class="nt-field">
                <label for="nt-observacoes">Observações:</label>
                <textarea id="nt-observacoes" class="nt-focus-ring"></textarea>
              </div>
              <div class="nt-audit-row">
                <div class="nt-field">
                  <label for="nt-inclusao">Inclusão:</label>
                  <input id="nt-inclusao" class="nt-focus-ring" type="text" readonly>
                </div>
                <div class="nt-field">
                  <label for="nt-alteracao">Alteração:</label>
                  <input id="nt-alteracao" class="nt-focus-ring" type="text" readonly>
                </div>
              </div>
              <div class="nt-divider"></div>
              <div class="nt-section-title-wrap"><div class="nt-section-title"><span>Novo tratamento</span></div></div>
              <div class="nt-mini-grid">
                <div class="nt-field nt-age">
                  <label for="nt-idade">Idade:</label>
                  <input id="nt-idade" class="nt-focus-ring" type="text" readonly>
                </div>
                <div class="nt-field">
                  <label for="nt-arcada">Arcada predominante:</label>
                  <select id="nt-arcada" class="nt-focus-ring"></select>
                </div>
              </div>
              <label class="nt-checkbox" for="nt-copiar">
                <input id="nt-copiar" class="nt-focus-ring" type="checkbox">
                Copiar intervenções a realizar do tratamento anterior
              </label>
            </section>
            <section class="nt-pane" data-nt-pane="convenio">
              <div class="nt-conv nt-conv-grid">
                <div class="nt-field">
                  <label for="nt-conv-convenio">Convênio:</label>
                  <select id="nt-conv-convenio" class="nt-focus-ring"></select>
                </div>
                <div class="nt-conv-two">
                  <div class="nt-field">
                    <label for="nt-conv-tipo">Tipo de atendimento (TISS):</label>
                    <select id="nt-conv-tipo" class="nt-focus-ring"></select>
                  </div>
                  <div class="nt-field">
                    <label for="nt-conv-contratado">Cirurgião contratado:</label>
                    <select id="nt-conv-contratado" class="nt-focus-ring"></select>
                  </div>
                </div>
                <div class="nt-conv-two">
                  <div class="nt-field">
                    <label for="nt-conv-solicitante">Cirurgião solicitante:</label>
                    <select id="nt-conv-solicitante" class="nt-focus-ring"></select>
                  </div>
                  <div class="nt-field">
                    <label for="nt-conv-executante">Cirurgião executante:</label>
                    <select id="nt-conv-executante" class="nt-focus-ring"></select>
                  </div>
                </div>
                <div class="nt-conv-two">
                  <div class="nt-field">
                    <label for="nt-conv-sinais">Sinais clínicos doença periodontal:</label>
                    <select id="nt-conv-sinais" class="nt-focus-ring"></select>
                  </div>
                  <div class="nt-field">
                    <label for="nt-conv-tecidos">Alteração dos tecidos moles:</label>
                    <select id="nt-conv-tecidos" class="nt-focus-ring"></select>
                  </div>
                </div>
                <div class="nt-conv-two">
                  <div class="nt-field">
                    <label for="nt-conv-guia">Nº da guia de tratamento:</label>
                    <input id="nt-conv-guia" class="nt-focus-ring" type="text">
                  </div>
                  <div class="nt-field">
                    <label for="nt-conv-autorizacao">Data da autorização:</label>
                    <input id="nt-conv-autorizacao" class="nt-focus-ring" type="text" inputmode="numeric" maxlength="10">
                  </div>
                </div>
                <div class="nt-conv-two">
                  <div class="nt-field">
                    <label for="nt-conv-senha">Senha de autorização:</label>
                    <input id="nt-conv-senha" class="nt-focus-ring" type="text">
                  </div>
                  <div class="nt-field">
                    <label for="nt-conv-validade">Validade da senha:</label>
                    <input id="nt-conv-validade" class="nt-focus-ring" type="text" inputmode="numeric" maxlength="10">
                  </div>
                </div>
              </div>
            </section>
          </div>
          <div class="nt-foot">
            <button type="button" class="materiais-btn" data-nt-action="ok">Ok</button>
            <button type="button" class="materiais-btn" data-nt-action="cancel">Cancela</button>
          </div>
        </div>
      </div>
    `;
  }

  function getElements() {
    if (!elements) return null;
    return elements;
  }

  function cacheElements() {
    elements = {
      backdrop: document.getElementById(BACKDROP_ID),
      tabs: [],
      panes: [],
      inicio: document.getElementById("nt-inicio"),
      finalizacao: document.getElementById("nt-finalizacao"),
      situacao: document.getElementById("nt-situacao"),
      tabela: document.getElementById("nt-tabela"),
      indice: document.getElementById("nt-indice"),
      cirurgiao: document.getElementById("nt-cirurgiao"),
      unidade: document.getElementById("nt-unidade"),
      observacoes: document.getElementById("nt-observacoes"),
      inclusao: document.getElementById("nt-inclusao"),
      alteracao: document.getElementById("nt-alteracao"),
      idade: document.getElementById("nt-idade"),
      arcada: document.getElementById("nt-arcada"),
      copiar: document.getElementById("nt-copiar"),
      convConvenio: document.getElementById("nt-conv-convenio"),
      convTipo: document.getElementById("nt-conv-tipo"),
      convContratado: document.getElementById("nt-conv-contratado"),
      convSolicitante: document.getElementById("nt-conv-solicitante"),
      convExecutante: document.getElementById("nt-conv-executante"),
      convSinais: document.getElementById("nt-conv-sinais"),
      convTecidos: document.getElementById("nt-conv-tecidos"),
      convGuia: document.getElementById("nt-conv-guia"),
      convAutorizacao: document.getElementById("nt-conv-autorizacao"),
      convSenha: document.getElementById("nt-conv-senha"),
      convValidade: document.getElementById("nt-conv-validade"),
    };
    if (elements.backdrop) {
      elements.tabs = Array.from(elements.backdrop.querySelectorAll("[data-nt-tab]"));
      elements.panes = Array.from(elements.backdrop.querySelectorAll("[data-nt-pane]"));
    }
    return elements;
  }

  function setTab(tab) {
    const cfg = getElements();
    if (!cfg) return;
    const value = tab === TAB_CONVENIO ? TAB_CONVENIO : TAB_PRINCIPAL;
    cfg.tabs.forEach((btn) => {
      const active = btn.dataset.ntTab === value;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-selected", active ? "true" : "false");
    });
    cfg.panes.forEach((pane) => {
      pane.classList.toggle("active", pane.dataset.ntPane === value);
    });
  }

  function populateDefaults() {
    const cfg = getElements();
    if (!cfg) return;
    const d = resolveDefaults();

    cfg.inicio.value = d.inicio;
    cfg.finalizacao.value = d.finalizacao;
    cfg.observacoes.value = d.observacoes;
    cfg.inclusao.value = d.inclusao;
    cfg.alteracao.value = d.alteracao;
    cfg.idade.value = d.idade;
    cfg.copiar.checked = !!d.copiarIntervencoes;
    cfg.convGuia.value = d.numeroGuia;
    cfg.convAutorizacao.value = d.dataAutorizacao;
    cfg.convSenha.value = d.senhaAutorizacao;
    cfg.convValidade.value = d.validadeSenha;

    setSelectOptions(cfg.situacao, ["Aberto", "Finalizado", "Cancelado"], d.situacao);
    setSelectOptions(cfg.tabela, ["PARTICULAR", "CONVÊNIO"], d.tabelaPrincipal);
    setSelectOptions(cfg.indice, ["R$", "US$"], d.indice);
    setSelectOptions(cfg.cirurgiao, [d.cirurgiaoResponsavel, "Outro"], d.cirurgiaoResponsavel);
    setSelectOptions(cfg.unidade, [d.unidadeAtendimento, "Unidade principal"], d.unidadeAtendimento);
    setSelectOptions(cfg.arcada, ["Copiar do tratamento anterior", "Decídua", "Mista", "Permanente"], d.arcadaPredominante);

    setSelectOptions(cfg.convConvenio, ["Particular", "Convênio"], d.convenio);
    setSelectOptions(cfg.convTipo, [d.tipoAtendimento, "Outro"], d.tipoAtendimento);
    setSelectOptions(cfg.convContratado, [d.cirurgiaoContratado, "Outro"], d.cirurgiaoContratado);
    setSelectOptions(cfg.convSolicitante, [d.cirurgiaoSolicitante, "Outro"], d.cirurgiaoSolicitante);
    setSelectOptions(cfg.convExecutante, [d.cirurgiaoExecutante, "Outro"], d.cirurgiaoExecutante);
    setSelectOptions(cfg.convSinais, [d.sinaisClinicos, "Sim", "Nao"], d.sinaisClinicos);
    setSelectOptions(cfg.convTecidos, [d.alteracaoTecidos, "Sim", "Nao"], d.alteracaoTecidos);
  }

  function ensureMounted() {
    if (mounted) return getElements();
    ensureStyle();
    if (!document.body) return null;
    const wrapper = document.createElement("div");
    wrapper.innerHTML = buildHtml();
    const backdrop = wrapper.firstElementChild;
    if (!backdrop) return null;
    document.body.appendChild(backdrop);
    mounted = true;
    cacheElements();
    bindEvents();
    return getElements();
  }

  function close() {
    const cfg = getElements();
    if (!cfg?.backdrop) return;
    cfg.backdrop.classList.add("hidden");
    cfg.backdrop.setAttribute("aria-hidden", "true");
    visible = false;
    loadSeq += 1;
  }

  async function loadAndApplyContext(context = {}) {
    const cfg = getElements();
    if (!cfg) return;
    const seq = ++loadSeq;
    const pacienteId = resolvePacienteId(context);
    if (pacienteId <= 0) {
      applyPayload(null);
      return;
    }
    try {
      const payload = await loadPayloadForPaciente(pacienteId);
      if (seq !== loadSeq) return;
      applyPayload(payload);
    } catch (err) {
      console.warn(`[${MODULE_NAME}]`, err);
      if (seq !== loadSeq) return;
      applyPayload(null);
    }
  }

  function open(context = {}) {
    const cfg = ensureMounted();
    if (!cfg?.backdrop) return;
    setTab(TAB_PRINCIPAL);
    cfg.backdrop.classList.remove("hidden");
    cfg.backdrop.setAttribute("aria-hidden", "false");
    visible = true;
    applyPayload(null);
    void loadAndApplyContext(context);
    setTimeout(() => {
      try {
        cfg.inicio?.focus();
        cfg.inicio?.select?.();
      } catch {}
    }, 10);
  }

  function bindEvents() {
    const cfg = getElements();
    if (!cfg?.backdrop || cfg.backdrop.dataset.ntBound === "1") return;
    cfg.backdrop.dataset.ntBound = "1";

    cfg.backdrop.addEventListener("click", (ev) => {
      const target = ev.target;
      if (target === cfg.backdrop) {
        close();
        return;
      }
      const tabBtn = target.closest?.("[data-nt-tab]");
      if (tabBtn && cfg.backdrop.contains(tabBtn)) {
        setTab(tabBtn.dataset.ntTab);
        return;
      }
      const actionBtn = target.closest?.("[data-nt-action]");
      if (!actionBtn || !cfg.backdrop.contains(actionBtn)) return;
      const action = String(actionBtn.dataset.ntAction || "").trim();
      if (action === "close" || action === "cancel" || action === "ok") {
        close();
      }
    });

    document.addEventListener("keydown", (ev) => {
      if (!visible) return;
      if (ev.key === "Escape") {
        ev.preventDefault();
        close();
      }
    });
  }

  function getStatus() {
    return {
      module: MODULE_NAME,
      mounted,
      visible,
      tab: getElements()?.panes?.find((pane) => pane.classList.contains("active"))?.dataset?.ntPane || TAB_PRINCIPAL,
    };
  }

  window.BranaNovoTratamentoModal = Object.freeze({
    open,
    close,
    ensureMounted,
    getStatus,
    moduleName: MODULE_NAME,
  });
})();
