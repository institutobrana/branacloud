(function () {
  "use strict";

  const MODULE_NAME = "BranaOdontogramaV1";
  const MODULE_VERSION = "subetapa-frontend-bootstrap-1";
  const STYLE_ID = "odonto-v1-style";
  const PANEL_ID = "odontograma-panel";

  const state = {
    panel: null,
    paciente: null,
    tratamentos: [],
    statusLookup: [],
    resumo: null,
    catalogoInferior: {
      tabelas: [],
      especialidades: [],
      procedimentos: [],
      simbolos: [],
      tabelaSelecionadaId: "",
      especialidadeSelecionada: "",
      carregado: false,
    },
    selectedTreatmentId: 0,
    loading: false,
    error: "",
    notice: "",
    uiBound: false,
  };

  function escHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function num(value, fallback = 0) {
    const n = Number(value || 0);
    return Number.isFinite(n) ? n : fallback;
  }

  function getClinicaId() {
    return num(typeof sessaoAtual !== "undefined" && sessaoAtual ? sessaoAtual.clinica_id : 0);
  }

  function getPacienteId() {
    const snapshot = getPacienteSnapshot();
    if (snapshot?.id) return num(snapshot.id);
    return 0;
  }

  function getPacienteSnapshot() {
    if (state.paciente && num(state.paciente.id)) {
      return state.paciente;
    }
    const header = typeof window !== "undefined" ? window.BranaPacienteEmUsoHeaderV1 : null;
    if (header && typeof header.getSources === "function") {
      const source = header.getSources();
      if (source && num(source.id)) {
        return source;
      }
    }
    try {
      const fichaAtualId = typeof window !== "undefined" && typeof window.fichaPacienteAtualId !== "undefined"
        ? window.fichaPacienteAtualId
        : (typeof fichaPacienteAtualId !== "undefined" ? fichaPacienteAtualId : 0);
      if (num(fichaAtualId)) {
        const fichaObj = typeof window !== "undefined" && window.ficha ? window.ficha : (typeof ficha !== "undefined" ? ficha : null);
        const codigoFicha = String(
          typeof window !== "undefined" && typeof window.fichaCodigoUltimoResolvido !== "undefined"
            ? window.fichaCodigoUltimoResolvido
            : (typeof fichaCodigoUltimoResolvido !== "undefined"
              ? fichaCodigoUltimoResolvido
              : fichaObj?.codigo?.value || "")
        ).trim();
        const nomeFicha = String(
          fichaObj?.titulo?.textContent ||
          fichaObj?.nome?.value ||
          ""
        ).replace(/^Ficha pessoal\s*-\s*/i, "").trim();
        if (codigoFicha || nomeFicha) {
          return {
            id: num(fichaAtualId),
            codigo: codigoFicha,
            nome: nomeFicha,
            source: "ficha",
          };
        }
      }
    } catch {}
    try {
      if (typeof document !== "undefined") {
        const headerEl = document.getElementById("brana-paciente-em-uso-header");
        const headerText = String(headerEl?.textContent || "").trim();
        const matchCodigo = headerText.match(/#\s*(\d{1,10})/);
        const matchNome = headerText.replace(/\s+/g, " ").replace(/^Paciente:\s*/i, "").replace(/^#\s*\d{1,10}\s*-\s*/i, "").trim();
        if (matchCodigo) {
          return {
            id: num(matchCodigo[1]),
            codigo: String(matchCodigo[1]),
            nome: matchNome,
            source: "header-dom",
          };
        }
      }
    } catch {}
    try {
      if (typeof document !== "undefined") {
        const bodyText = String(document.body?.innerText || "");
        const match = bodyText.match(/PACIENTE:\s*#?\s*(\d{1,10})\s*\n\s*([^\n]+)\s*\n\s*ProntuÃ¡rio/i);
        if (match) {
          return {
            id: num(match[1]),
            codigo: String(match[1]),
            nome: String(match[2] || "").trim(),
            source: "body-text",
          };
        }
      }
    } catch {}
    return null;
  }

  function getExtraValor(paciente, key) {
    const extra = paciente?.extra && typeof paciente.extra === "object" ? paciente.extra : {};
    return extra[key];
  }

  function getUltimoTratamentoId(paciente) {
    return num(getExtraValor(paciente, "ultimo_tratamento_id"));
  }

  function getUltimoTratamentoNrotra(paciente) {
    return num(getExtraValor(paciente, "ultimo_tratamento_nrotra"));
  }

  function formatPacienteLabel(paciente) {
    if (!paciente) return "Paciente nÃ£o carregado";
    const extra = paciente.extra && typeof paciente.extra === "object" ? paciente.extra : {};
    const codigo = String(paciente.codigo ?? "").trim();
    const nomeCompleto = String(extra.PRINOM || extra.NOMRES || paciente.nome_completo || "").trim();
    const nome = nomeCompleto || String(`${paciente.nome || ""} ${paciente.sobrenome || ""}`).trim();
    const base = [codigo ? `#${codigo}` : "", nome].filter(Boolean).join(" - ");
    return base || `Paciente #${num(paciente.id) || "-"}`;
  }
  function formatDateBr(value) {
    const raw = String(value ?? "").trim();
    if (!raw) return "â€”";
    const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) return `${match[3]}/${match[2]}/${match[1]}`;
    return raw;
  }

  function calcIdade(value) {
    const raw = String(value ?? "").trim();
    if (!raw) return "â€”";
    const parsed = new Date(raw);
    if (Number.isNaN(parsed.getTime())) return "â€”";
    const now = new Date();
    let idade = now.getFullYear() - parsed.getFullYear();
    const m = now.getMonth() - parsed.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < parsed.getDate())) idade -= 1;
    return idade >= 0 ? `${idade} ano${idade === 1 ? "" : "s"}` : "â€”";
  }

  function readPacienteField(paciente, key, fallback = "â€”") {
    const extra = paciente?.extra && typeof paciente.extra === "object" ? paciente.extra : {};
    const value =
      paciente?.[key] ??
      extra[key] ??
      extra[String(key).toUpperCase()] ??
      extra[String(key).toLowerCase()] ??
      "";
    const text = String(value ?? "").trim();
    return text || fallback;
  }

  function formatTratamentoLabel(item) {
    if (!item) return "";
    const data = String(item.data_inicio_br || "").trim();
    const numero = num(item.nrotra);
    if (data) return data;
    if (numero) return `Tratamento ${numero}`;
    return `Tratamento ${num(item.id) || ""}`;
  }

  function resolveCatalogoTabelaSelecionada(tabelas = [], paciente = null) {
    const tabelasValidas = Array.isArray(tabelas) ? tabelas : [];
    if (!tabelasValidas.length) return "";
    const pacienteTabela = String(
      paciente?.tabela_codigo ??
      paciente?.extra?.NROTAB ??
      paciente?.extra?.tabela_codigo ??
      ""
    ).trim();
    if (pacienteTabela && tabelasValidas.some((item) => String(item.id || "").trim() === pacienteTabela)) {
      return pacienteTabela;
    }
    const selecionada = String(state.catalogoInferior?.tabelaSelecionadaId || "").trim();
    if (selecionada && tabelasValidas.some((item) => String(item.id || "").trim() === selecionada)) {
      return selecionada;
    }
    const primeira = String(tabelasValidas[0]?.id || "").trim();
    return primeira;
  }

  function resolveCatalogoEspecialidadeSelecionada(especialidades = []) {
    const itens = Array.isArray(especialidades) ? especialidades : [];
    if (!itens.length) return "";
    const preferida = String(state.catalogoInferior?.especialidadeSelecionada || "").trim();
    if (preferida && itens.some((item) => String(item.codigo || "").trim() === preferida)) {
      return preferida;
    }
    const primeira = String(itens[0]?.codigo || "").trim();
    return primeira;
  }

  function normalizeCatalogoOptions(items = [], labelKey = "nome") {
    return Array.isArray(items) ? items.filter(Boolean) : [];
  }

  async function loadCatalogoInferior(force = false) {
    const paciente = state.paciente || null;
    const currentKey = [
      num(paciente?.id || 0),
      String(paciente?.tabela_codigo ?? paciente?.extra?.NROTAB ?? "").trim(),
      String(state.catalogoInferior?.tabelaSelecionadaId || "").trim(),
      String(state.catalogoInferior?.especialidadeSelecionada || "").trim(),
    ].join("|");
    if (!force && state.catalogoInferior?.carregado && state.catalogoInferior?.cacheKey === currentKey) {
      renderLowerCatalog();
      return true;
    }

    const [filtrosResp, simbolosResp, prefsResp] = await Promise.all([
      requestJson("GET", "/procedimentos/filtros", undefined, true),
      requestJson("GET", "/cadastros/simbolos-graficos?scope=procedimentos", undefined, true),
      requestJson("GET", "/preferences/odontogram", undefined, true).catch(() => ({ res: { ok: false }, data: null })),
    ]);

    const filtros = filtrosResp?.res?.ok && filtrosResp.data && typeof filtrosResp.data === "object" ? filtrosResp.data : {};
    const tabelas = normalizeCatalogoOptions(Array.isArray(filtros.tabelas) ? filtros.tabelas : []);
    const especialidades = normalizeCatalogoOptions(Array.isArray(filtros.especialidades) ? filtros.especialidades : []);
    const simbolos = simbolosResp?.res?.ok && Array.isArray(simbolosResp.data) ? simbolosResp.data : [];
    const tabelaSelecionadaId = resolveCatalogoTabelaSelecionada(tabelas, paciente);
    const preferenciaEspecialidade = String(prefsResp?.data?.values?.especialidade_mais_utilizada || "").trim();
    let especialidadeSelecionada = resolveCatalogoEspecialidadeSelecionada(especialidades);
    if (preferenciaEspecialidade && especialidades.some((item) => String(item.codigo || "").trim() === preferenciaEspecialidade)) {
      especialidadeSelecionada = preferenciaEspecialidade;
    }

    const qs = new URLSearchParams();
    if (tabelaSelecionadaId) qs.set("tabela_id", tabelaSelecionadaId);
    if (especialidadeSelecionada) qs.set("especialidade", especialidadeSelecionada);
    const procResp = await requestJson("GET", `/procedimentos?${qs.toString()}`, undefined, true);
    let procedimentos = procResp?.res?.ok && Array.isArray(procResp.data) ? procResp.data : [];
    if (!procedimentos.length && especialidadeSelecionada) {
      const fallbackQs = new URLSearchParams();
      if (tabelaSelecionadaId) fallbackQs.set("tabela_id", tabelaSelecionadaId);
      const fallbackResp = await requestJson("GET", `/procedimentos?${fallbackQs.toString()}`, undefined, true).catch(() => null);
      procedimentos = fallbackResp?.res?.ok && Array.isArray(fallbackResp.data) ? fallbackResp.data : procedimentos;
    }

    state.catalogoInferior = {
      tabelas,
      especialidades,
      procedimentos,
      simbolos,
      tabelaSelecionadaId,
      especialidadeSelecionada,
      carregado: true,
      cacheKey: currentKey,
    };
    renderLowerCatalog();
    return true;
  }

  function renderLowerOption(selectEl, items, getValue, getLabel, selectedValue, placeholder = "") {
    if (!selectEl) return;
    const options = [];
    if (placeholder) {
      options.push(`<option value="">${escHtml(placeholder)}</option>`);
    }
    (Array.isArray(items) ? items : []).forEach((item) => {
      const value = String(getValue(item) ?? "").trim();
      const label = String(getLabel(item) ?? "").trim();
      const selected = value && String(selectedValue || "").trim() === value ? " selected" : "";
      options.push(`<option value="${escHtml(value)}"${selected}>${escHtml(label)}</option>`);
    });
    selectEl.innerHTML = options.join("");
    if (selectedValue) selectEl.value = String(selectedValue);
  }

  function renderContextSummary() {
    const cfg = getPanelElements();
    const paciente = state.paciente || null;
    const tratamento = Array.isArray(state.tratamentos)
      ? state.tratamentos.find((item) => num(item.id) === num(state.selectedTreatmentId)) || null
      : null;
    const pacienteLabel = paciente ? formatPacienteLabel(paciente) : "Sem paciente selecionado.";
    const tratamentoLabel = tratamento ? formatTratamentoLabel(tratamento) : "Sem tratamento selecionado.";
    const observacoes = String(tratamento?.observacoes || state.resumo?.observacoes || "").trim();
    const ultimaVisita = formatDateBr(
      state.resumo?.ultima_visita ||
      state.resumo?.ultima_visita_br ||
      paciente?.ultima_visita ||
      paciente?.data_ultima_visita ||
      ""
    );
    const proximaVisita = formatDateBr(
      state.resumo?.proxima_visita ||
      state.resumo?.proxima_visita_br ||
      paciente?.proxima_visita ||
      paciente?.data_proxima_visita ||
      ""
    );
    const tabela = String(
      paciente?.tabela_nome ||
      paciente?.tabela_descricao ||
      paciente?.extra?.NROTAB ||
      paciente?.tabela_codigo ||
      ""
    ).trim() || "â€”";

    if (cfg.contextPaciente) cfg.contextPaciente.textContent = pacienteLabel;
    if (cfg.contextIdade) cfg.contextIdade.textContent = calcIdade(paciente?.data_nascimento);
    if (cfg.contextUltimaVisita) cfg.contextUltimaVisita.textContent = ultimaVisita;
    if (cfg.contextProximaVisita) cfg.contextProximaVisita.textContent = proximaVisita;
    if (cfg.contextFone1) cfg.contextFone1.textContent = readPacienteField(paciente, "fone1");
    if (cfg.contextFone2) cfg.contextFone2.textContent = readPacienteField(paciente, "fone2");
    if (cfg.contextFone3) cfg.contextFone3.textContent = readPacienteField(paciente, "fone3");
    if (cfg.contextEmail) cfg.contextEmail.textContent = readPacienteField(paciente, "email");
    if (cfg.contextMatricula) cfg.contextMatricula.textContent = readPacienteField(paciente, "matricula");
    if (cfg.contextProntuario) cfg.contextProntuario.textContent = readPacienteField(paciente, "cod_prontuario");
    if (cfg.contextTabela) cfg.contextTabela.textContent = tabela;
    if (cfg.contextTratamento) cfg.contextTratamento.textContent = tratamentoLabel;
    if (cfg.contextObservacoes) cfg.contextObservacoes.textContent = observacoes || "Sem observaÃ§Ãµes";
    if (cfg.contextImagens) cfg.contextImagens.textContent = "Imagens";
    if (cfg.contextDocumentos) cfg.contextDocumentos.textContent = "Documentos";
    if (cfg.contextAgenda) cfg.contextAgenda.textContent = "Agenda";
  }

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .odonto-v1-panel{width:100%;min-height:0;box-sizing:border-box;padding:10px 10px 12px;background:#fff;border:1px solid #cfd8e3;font:12px Tahoma,sans-serif;color:#111}
      .odonto-v1-toolbar{display:grid;grid-template-columns:1fr auto;gap:10px;align-items:end;margin-bottom:8px}
      .odonto-v1-toolbar-left{display:grid;grid-template-columns:1.4fr 1fr;gap:10px;align-items:end}
      .odonto-v1-field{display:grid;gap:4px}
      .odonto-v1-field label{display:block;font:700 12px Tahoma,sans-serif;color:#314052}
      .odonto-v1-field .box,.odonto-v1-field select{height:26px;border:1px solid #bfc9d6;background:#fff;padding:0 6px;box-sizing:border-box;font:12px Tahoma,sans-serif;min-width:0}
      .odonto-v1-actions{display:flex;gap:8px;align-items:center;justify-content:flex-end;flex-wrap:wrap}
      .odonto-v1-actions .materiais-btn{height:30px;min-width:90px;justify-content:center;padding:0 10px}
      .odonto-v1-actions .materiais-btn img{width:16px;height:16px}
      .odonto-v1-subhead{display:flex;gap:12px;flex-wrap:wrap;align-items:center;justify-content:space-between;margin:4px 0 8px}
      .odonto-v1-summary{display:flex;gap:12px;flex-wrap:wrap;align-items:center;color:#36465a}
      .odonto-v1-feedback{min-height:18px;padding:4px 8px;margin-bottom:8px;border:1px solid #d7dfe8;background:#f7f9fc;color:#334155}
      .odonto-v1-feedback.is-error{border-color:#f1c2c2;background:#fff5f5;color:#9b1c1c}
      .odonto-v1-legend{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px}
      .odonto-v1-chip{display:inline-flex;gap:6px;align-items:center;padding:3px 8px;border:1px solid #d7dfe8;border-radius:999px;background:#fff;color:#314052;white-space:nowrap}
      .odonto-v1-chip strong{font-weight:700}
      .odonto-v1-main{display:grid;grid-template-columns:minmax(0,1.02fr) minmax(0,.98fr);gap:10px;min-height:0}
      .odonto-v1-card{display:grid;grid-template-rows:auto 1fr;border:1px solid #cfd8e3;background:#fff;min-height:0}
      .odonto-v1-card-title{padding:7px 10px;border-bottom:1px solid #dbe3ec;background:#f5f7fb;font:700 12px Tahoma,sans-serif;color:#243244}
      .odonto-v1-card-body{padding:8px;min-height:0;overflow:auto}
      .odonto-v1-arcada-grid{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:6px}
      .odonto-v1-slot{min-height:58px;padding:6px 6px 5px;border:1px solid #dbe3ec;background:linear-gradient(180deg,#fff 0%,#fafcff 100%);box-sizing:border-box;display:grid;gap:3px;align-content:start}
      .odonto-v1-slot-head{display:flex;justify-content:space-between;gap:6px;font:700 11px Tahoma,sans-serif;color:#233244}
      .odonto-v1-slot-body{font:12px Tahoma,sans-serif;color:#111;min-height:18px;word-break:break-word}
      .odonto-v1-slot-foot{font:11px Tahoma,sans-serif;color:#5d6b79}
      .odonto-v1-slot-empty{border-style:dashed;color:#7f8b96;background:#fcfdff}
      .odonto-v1-list{width:100%;border-collapse:collapse;table-layout:fixed;font:12px Tahoma,sans-serif}
      .odonto-v1-list th,.odonto-v1-list td{padding:4px 6px;border-bottom:1px solid #e7edf4;vertical-align:top;overflow:hidden;text-overflow:ellipsis}
      .odonto-v1-list th{position:sticky;top:0;background:#f5f7fb;text-align:left;z-index:1}
      .odonto-v1-list td{word-break:break-word}
      .odonto-v1-list tr:nth-child(even) td{background:#fcfdff}
      .odonto-v1-list .mono{font-family:Consolas,Monaco,monospace}
      .odonto-v1-empty{padding:18px 12px;color:#5d6b79;background:#fbfcfe;border:1px dashed #d7dfe8}
      .odonto-v1-muted{color:#667788}
      .odonto-v1-small{font-size:11px}
      .odonto-v1-interv-list{display:grid;gap:8px}
      .odonto-v1-interv-card{border:1px solid #d7e0ea;background:#fff;padding:9px 10px;display:grid;gap:6px}
      .odonto-v1-interv-head{display:flex;gap:8px;flex-wrap:wrap;align-items:center;justify-content:space-between}
      .odonto-v1-interv-core{display:flex;gap:8px;flex-wrap:wrap;align-items:center;min-width:0}
      .odonto-v1-interv-id{font:700 11px Consolas,Monaco,monospace;color:#34475d}
      .odonto-v1-interv-status{display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:999px;border:1px solid #ccd7e4;background:#f7f9fc;font:700 10px Tahoma,sans-serif;text-transform:uppercase;letter-spacing:.02em;color:#334155}
      .odonto-v1-interv-status.is-realizada{border-color:#bde1c5;background:#f2fbf3;color:#1f7a3f}
      .odonto-v1-interv-status.is-realizar{border-color:#f4d2a4;background:#fff8ef;color:#9b6a1a}
      .odonto-v1-interv-status.is-observada{border-color:#d7dfe8;background:#f7f9fc;color:#475569}
      .odonto-v1-interv-proc{font:700 12px Tahoma,sans-serif;color:#1f2937;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      .odonto-v1-interv-prestador{font:11px Tahoma,sans-serif;color:#667788}
      .odonto-v1-interv-meta{display:flex;gap:12px;flex-wrap:wrap;font:11px Tahoma,sans-serif;color:#4b5563}
      .odonto-v1-interv-meta strong{color:#243244}
      .odonto-v1-interv-obs{font:12px Tahoma,sans-serif;color:#1f2937;line-height:1.35;background:#fbfcfe;border:1px solid #edf2f7;padding:6px 8px}
      .odonto-v1-interv-table{width:100%;border-collapse:collapse;table-layout:fixed;font:12px Tahoma,sans-serif;background:#fff}
      .odonto-v1-interv-table th,.odonto-v1-interv-table td{padding:2px 4px;border-bottom:1px solid #d7dfe7;border-right:1px solid #e7edf4;vertical-align:top;background:#fff;box-sizing:border-box;line-height:1.1}
      .odonto-v1-interv-table th:last-child,.odonto-v1-interv-table td:last-child{border-right:none}
      .odonto-v1-interv-table thead th{background:#f2f6fb;font:700 10px Tahoma,sans-serif;color:#243444;white-space:nowrap;letter-spacing:.01em}
      .odonto-v1-interv-table tbody tr:nth-child(even) td{background:#fbfdff}
      .odonto-v1-interv-table tbody tr:hover td{background:#eef5ff}
      .odonto-v1-interv-table th:nth-child(1),.odonto-v1-interv-table td:nth-child(1){width:90px;white-space:nowrap}
      .odonto-v1-interv-table th:nth-child(2),.odonto-v1-interv-table td:nth-child(2){width:130px;white-space:nowrap}
      .odonto-v1-interv-table th:nth-child(3),.odonto-v1-interv-table td:nth-child(3){width:130px;white-space:nowrap}
      .odonto-v1-interv-table th:nth-child(4),.odonto-v1-interv-table td:nth-child(4){width:auto;word-break:break-word;overflow-wrap:anywhere}
      @media (max-width: 1180px){
        .odonto-v1-main{grid-template-columns:1fr}
        .odonto-v1-arcada-grid{grid-template-columns:repeat(4,minmax(0,1fr))}
      }
      @media (max-width: 760px){
        .odonto-v1-toolbar{grid-template-columns:1fr}
        .odonto-v1-toolbar-left{grid-template-columns:1fr}
        .odonto-v1-arcada-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
      }
    `;
    document.head.appendChild(style);
  }

  function panelHtml() {
    const shell = window.BranaOdontoShellV1;
    if (shell && typeof shell.panelHtml === "function") return shell.panelHtml();
    return "";
  }

  function getPanelElements() {
    const shell = window.BranaOdontoShellV1;
    if (shell && typeof shell.getPanelElements === "function") return shell.getPanelElements();
    return {};
  }

  function ensureUI() {
    ensureStyle();
    const shell = window.BranaOdontoShellV1;
    if (!shell || typeof shell.mountPanel !== "function") return null;
    const cfg = shell.mountPanel();
    if (!cfg) return null;
    state.panel = cfg.panel || document.getElementById(PANEL_ID);
    try {
      const headerModule = window.BranaPacienteEmUsoHeaderV1;
      if (headerModule && typeof headerModule.sync === "function") {
        headerModule.sync(state.paciente);
      } else {
        void import("/frontend/js/modules/paciente-em-uso-header.js")
          .then(() => {
            try {
              window.BranaPacienteEmUsoHeaderV1?.sync?.(state.paciente);
            } catch {}
          })
          .catch((err) => console.warn("Falha ao carregar cabeÃ§alho de paciente em uso.", err));
      }
    } catch {}
    if (!state.uiBound && typeof shell.bindControls === "function") {
      shell.bindControls({
        onRefresh: () => {
          void refresh(true);
        },
        onClose: () => {
          closePanel();
        },
        onTreatmentChange: (value) => {
          const selected = num(value);
          if (!selected) return;
          state.selectedTreatmentId = selected;
          void loadResumo(true);
        },
      });
      const cfg = getPanelElements();
      cfg.lowerTabela?.addEventListener("change", async () => {
        state.catalogoInferior.tabelaSelecionadaId = String(cfg.lowerTabela?.value || "").trim();
        await loadCatalogoInferior(true);
      });
      cfg.lowerEspecialidade?.addEventListener("change", async () => {
        state.catalogoInferior.especialidadeSelecionada = String(cfg.lowerEspecialidade?.value || "").trim();
        await loadCatalogoInferior(true);
      });
      state.uiBound = true;
    }
    return cfg;
  }

  function setFeedback(message, isError = false) {
    const cfg = getPanelElements();
    if (cfg.loading) {
      cfg.loading.textContent = state.loading ? "Carregando..." : "Pronto.";
    }
    if (cfg.feedback) {
      cfg.feedback.textContent = String(message || "").trim() || "Pronto para carregar o odontograma em modo de leitura.";
      cfg.feedback.classList.toggle("is-error", !!isError);
    }
  }

  function renderSummaryHeader() {
    const cfg = getPanelElements();
    if (cfg.paciente) {
      const pacienteLabel = state.paciente ? formatPacienteLabel(state.paciente) : "Sem paciente selecionado.";
      cfg.paciente.textContent = pacienteLabel;
      cfg.paciente.title = pacienteLabel;
    }
    if (window.BranaOdontoPacienteSearchV1 && typeof window.BranaOdontoPacienteSearchV1.setCurrentPatient === "function") {
      window.BranaOdontoPacienteSearchV1.setCurrentPatient(state.paciente);
    }
    if (window.BranaPacienteEmUsoHeaderV1 && typeof window.BranaPacienteEmUsoHeaderV1.sync === "function") {
      window.BranaPacienteEmUsoHeaderV1.sync(state.paciente);
    }
    if (cfg.resumoPaciente) {
      cfg.resumoPaciente.textContent = state.paciente ? formatPacienteLabel(state.paciente) : "Sem paciente selecionado.";
    }
    if (cfg.resumoTratamento) {
      const item = state.tratamentos.find((x) => num(x.id) === num(state.selectedTreatmentId));
      cfg.resumoTratamento.textContent = item ? formatTratamentoLabel(item) : "Sem tratamento selecionado.";
    }
    if (cfg.resumoContagem) {
      const total = num(state.resumo?.contagem_intervencoes);
      cfg.resumoContagem.textContent = `${total} intervenções.`;
    }
    renderContextSummary();
  }

  function renderLegend() {
    const cfg = getPanelElements();
    if (!cfg.legend) return;
    const itens = Array.isArray(state.statusLookup) ? state.statusLookup : [];
    if (!itens.length) {
      cfg.legend.innerHTML = '<span class="odonto-v1-muted odonto-v1-small">Sem status disponível.</span>';
      return;
    }
    cfg.legend.innerHTML = itens
      .map((item) => {
        const codigo = String(item.codigo || "").trim();
        const descricao = String(item.descricao || "").trim();
        return `<span class="odonto-v1-chip"><strong>${escHtml(codigo)}</strong><span>${escHtml(descricao)}</span></span>`;
      })
      .join("");
  }

  function renderArcada() {
    const cfg = getPanelElements();
    if (!cfg.arcada) return;
    const itens = Array.isArray(state.resumo?.arcada_slots) ? state.resumo.arcada_slots : [];
    const renderer = window.BranaOdontoArcadaV1;
    if (renderer && typeof renderer.render === "function") {
      renderer.render(cfg.arcada, itens, {
        emptyMessage: "Nenhum slot de arcada encontrado para o tratamento selecionado.",
        superiorLabel: "Arcada superior",
        inferiorLabel: "Arcada inferior",
        intervencoes: Array.isArray(state.resumo?.intervencoes) ? state.resumo.intervencoes : [],
      });
      return;
    }
    const lista = [...itens].sort((a, b) => num(a.slot_ordem) - num(b.slot_ordem));
    if (!lista.length) {
      cfg.arcada.innerHTML = '<div class="odonto-v1-empty">Nenhum slot de arcada encontrado para o tratamento selecionado.</div>';
      return;
    }
    cfg.arcada.innerHTML = `<div class="odonto-v1-arcada-grid">${lista
      .map((item) => {
        const slot = num(item.slot_ordem);
        const dente = item.numero_dente_fdi == null ? "" : String(item.numero_dente_fdi);
        const tipo = String(item.tipo_slot || "dente").trim();
        const observacao = String(item.observacao || "").trim();
        const vazio = item.numero_dente_fdi == null || item.numero_dente_fdi === 0;
        return `
          <div class="odonto-v1-slot${vazio ? " odonto-v1-slot-empty" : ""}" title="${escHtml(observacao || tipo)}">
            <div class="odonto-v1-slot-head">
              <span>#${escHtml(slot)}</span>
              <span class="odonto-v1-muted">${escHtml(tipo)}</span>
            </div>
            <div class="odonto-v1-slot-body">${escHtml(dente || "â€”")}</div>
            <div class="odonto-v1-slot-foot">${escHtml(observacao || "Sem observaÃ§Ã£o")}</div>
          </div>`;
      })
      .join("")}</div>`;
  }

  function faceFlagsText(face) {
    const flags = [];
    if (face.face_mesial) flags.push("M");
    if (face.face_distal) flags.push("D");
    if (face.face_oclusal) flags.push("O");
    if (face.face_vestibular) flags.push("V");
    if (face.face_lingual) flags.push("L");
    return flags.length ? flags.join(" ") : "â€”";
  }

  function renderIntervencoes() {
    const cfg = getPanelElements();
    if (!cfg.intervencoes) return;
    const itens = Array.isArray(state.resumo?.intervencoes) ? state.resumo.intervencoes : [];
    if (!itens.length) {
      cfg.intervencoes.innerHTML = '<div class="odonto-v1-empty">Nenhuma intervenção encontrada para o tratamento selecionado.</div>';
      return;
    }
    const rows = itens
      .map((item) => {
        const status = String(item.status?.descricao || item.status?.codigo || "-").trim();
        const dentes = Array.isArray(item.dentes) && item.dentes.length
          ? item.dentes.map((dente) => String(dente.numero_dente_fdi)).join(", ")
          : "â€”";
        const faces = Array.isArray(item.faces) && item.faces.length
          ? item.faces.map((face) => `${String(face.numero_dente_fdi)}(${faceFlagsText(face)})`).join(", ")
          : "";
        const regiao = [dentes, faces ? `Faces ${faces}` : ""].filter(Boolean).join(" / ") || "â€”";
        const data = formatDateBr(item.data_execucao || item.data_planejada || "");
        const cirurgiao = item.prestador_id ? `Prestador ${num(item.prestador_id)}` : "â€”";
        const descricaoBase = String(item.procedimento_nome || item.procedimento_id || "-").trim();
        const observacao = String(item.observacao_resumida || "").trim();
        const descricao = observacao ? `${descricaoBase} - ${observacao}` : descricaoBase;
        return `
          <tr>
            <td>${escHtml(data)}</td>
            <td>${escHtml(cirurgiao)}</td>
            <td>${escHtml(regiao)}</td>
            <td><strong>${escHtml(descricao)}</strong>${status && status !== "-" ? `<div class="odonto-v1-muted">${escHtml(status)}</div>` : ""}</td>
          </tr>
        `;
      })
      .join("");
    cfg.intervencoes.innerHTML = `
      <table class="odonto-v1-interv-table">
        <thead>
          <tr>
            <th>Data</th>
            <th>CirurgiÃ£o</th>
            <th>RegiÃ£o</th>
            <th>DescriÃ§Ã£o do procedimento</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;
  }

  function renderLowerCatalog() {
    const cfg = getPanelElements();
    if (!cfg.procedureList || !cfg.specialtyStrip || !cfg.symbolStrip) return;

    const catalogo = state.catalogoInferior || {};
    const tabelas = Array.isArray(catalogo.tabelas) ? catalogo.tabelas : [];
    const especialidades = Array.isArray(catalogo.especialidades) ? catalogo.especialidades : [];
    const procedimentos = Array.isArray(catalogo.procedimentos) ? catalogo.procedimentos : [];
    const simbolos = Array.isArray(catalogo.simbolos) ? catalogo.simbolos : [];
    const tabelaSelecionadaId = String(catalogo.tabelaSelecionadaId || "").trim();
    const especialidadeSelecionada = String(catalogo.especialidadeSelecionada || "").trim();

    renderLowerOption(
      cfg.lowerTabela,
      tabelas,
      (item) => item?.id ?? "",
      (item) => {
        const nome = String(item?.nome || "").trim();
        const sigla = String(item?.indice_sigla || "").trim();
        return nome && sigla ? `${nome} (${sigla})` : (nome || String(item?.id || ""));
      },
      tabelaSelecionadaId,
      "Tabela padrÃ£o"
    );

    renderLowerOption(
      cfg.lowerEspecialidade,
      especialidades,
      (item) => item?.codigo ?? "",
      (item) => `${String(item?.codigo || "").trim()}${String(item?.nome || "").trim() ? ` - ${String(item.nome).trim()}` : ""}`,
      especialidadeSelecionada,
      "Todas as especialidades"
    );

    cfg.specialtyStrip.innerHTML = especialidades.length
      ? especialidades.map((item) => {
          const codigo = String(item.codigo || "").trim();
          const nome = String(item.nome || "").trim();
          const active = codigo && codigo === especialidadeSelecionada ? " active" : "";
          return `<button type="button" class="odonto-v1-specialty-chip${active}" data-especialidade="${escHtml(codigo)}">${escHtml(nome || codigo)}</button>`;
        }).join("")
      : '<div class="odonto-v1-procedure-empty">Nenhuma especialidade disponÃ­vel.</div>';
    cfg.specialtyStrip.querySelectorAll(".odonto-v1-specialty-chip").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const especialidade = String(btn.getAttribute("data-especialidade") || "").trim();
        state.catalogoInferior.especialidadeSelecionada = especialidade;
        await loadCatalogoInferior(true);
      });
    });

    cfg.procedureList.innerHTML = procedimentos.length
      ? procedimentos.map((item) => {
          const codigo = String(item.codigo || "").trim();
          const nome = String(item.nome || "").trim();
          const especialidade = String(item.especialidade || "").trim();
          const tabela = String(item.tabela_id || "").trim();
          const simbolo = String(item.simbolo_grafico || "").trim();
          return `
            <div class="odonto-v1-procedure-row" title="${escHtml(nome)}">
              <span class="odonto-v1-procedure-code">${escHtml(codigo || "â€”")}</span>
              <span class="odonto-v1-procedure-name">${escHtml(nome || "â€”")}</span>
              <span class="odonto-v1-procedure-meta">${escHtml(especialidade || "â€”")}</span>
              <span class="odonto-v1-procedure-meta">${escHtml(tabela || simbolo || "â€”")}</span>
            </div>
          `;
        }).join("")
      : '<div class="odonto-v1-procedure-empty">Nenhum procedimento encontrado para a tabela selecionada.</div>';

    const simbolosFiltrados = especialidadeSelecionada
      ? simbolos.filter((item) => {
          const esp = String(item.especialidade || "").trim();
          return !esp || esp === especialidadeSelecionada;
        })
      : simbolos;
    cfg.symbolStrip.innerHTML = simbolosFiltrados.length
      ? simbolosFiltrados.map((item) => {
          const nome = String(item.descricao || item.codigo || "").trim();
          const imagem = String(item.imagem_url || "").trim();
          const legenda = String(item.tipo_marca_label || item.tipo_marca || "").trim();
          return `
            <div class="odonto-v1-symbol-card" title="${escHtml(nome)}">
              ${imagem ? `<img src="${escHtml(imagem)}" alt="${escHtml(nome)}">` : `<div class="odonto-v1-symbol-empty" style="display:flex;align-items:center;justify-content:center;min-height:42px;font-weight:700">${escHtml((nome.slice(0, 2) || "â€¢").toUpperCase())}</div>`}
              <span>${escHtml(nome || "â€”")}</span>
              ${legenda ? `<span class="odonto-v1-muted">${escHtml(legenda)}</span>` : ""}
            </div>
          `;
        }).join("")
      : '<div class="odonto-v1-symbol-empty">Nenhum sÃ­mbolo disponÃ­vel para a especialidade selecionada.</div>';
  }

  function renderEmpty(message) {
    const cfg = getPanelElements();
    const renderer = window.BranaOdontoArcadaV1;
    if (cfg.arcada && renderer && typeof renderer.render === "function") {
      renderer.render(cfg.arcada, [], {
        emptyMessage: String(message || "Selecione um paciente para carregar o odontograma.").trim(),
        superiorLabel: "Arcada superior",
        inferiorLabel: "Arcada inferior",
        intervencoes: [],
      });
    } else if (cfg.arcada) {
      cfg.arcada.innerHTML = `<div class="odonto-v1-empty">${escHtml(message)}</div>`;
    }
    renderSummaryHeader();
    renderLegend();
    renderLowerCatalog();
  }

  function render() {
    renderSummaryHeader();
    renderLegend();
    renderArcada();
    renderLowerCatalog();
    setFeedback(state.error || state.notice || "Odontograma carregado em modo de leitura.", !!state.error);
  }

  async function loadStatusLookup() {
    const { res, data } = await requestJson("GET", "/odontograma/status", undefined, true);
    if (!res.ok) return [];
    return Array.isArray(data?.itens) ? data.itens : [];
  }

  async function loadTratamentos(pacienteId) {
    const { res, data } = await requestJson("GET", `/tratamentos/paciente/${encodeURIComponent(String(pacienteId))}`, undefined, true);
    if (!res.ok) return { tratamentos: [], selectedId: 0 };
    const tratamentos = Array.isArray(data?.tratamentos) ? data.tratamentos : [];
    const selectedId = num(data?.selecionado_id);
    return { tratamentos, selectedId };
  }

  async function loadResumo(force = false) {
    const pacienteId = getPacienteId();
    const clinicaId = getClinicaId();
    const tratamentoId = num(state.selectedTreatmentId);
    if (!pacienteId || !clinicaId) {
      state.resumo = null;
      state.error = "Selecione um paciente vÃ¡lido para abrir o odontograma.";
      render();
      return false;
    }
    if (!tratamentoId) {
      state.resumo = null;
      state.error = "";
      state.notice = state.tratamentos.length ? "Selecione um tratamento para visualizar o odontograma." : "Nenhum tratamento encontrado para este paciente.";
      render();
      return true;
    }

    state.loading = true;
    state.error = "";
    setFeedback("Carregando odontograma...", false);
    try {
      if (force || !state.statusLookup.length) {
        state.statusLookup = await loadStatusLookup();
      }
      const query = new URLSearchParams({
        clinica_id: String(clinicaId),
        paciente_id: String(pacienteId),
        tratamento_id: String(tratamentoId),
      });
      const { res, data } = await requestJson("GET", `/odontograma/resumo?${query.toString()}`, undefined, true);
      if (!res.ok) {
        state.resumo = null;
        state.error = data?.detail || "Falha ao carregar o odontograma.";
        render();
        return false;
      }
      state.resumo = data?.resumo || null;
      if (Array.isArray(state.resumo?.status_lookup) && state.resumo.status_lookup.length) {
        state.statusLookup = state.resumo.status_lookup;
      }
      render();
      return true;
    } catch (err) {
      state.resumo = null;
      state.error = err?.message || "Falha ao carregar o odontograma.";
      render();
      return false;
    } finally {
      state.loading = false;
      const cfg = getPanelElements();
      if (cfg.loading) cfg.loading.textContent = "Pronto.";
    }
  }

  async function refresh(force = false) {
    const paciente = await resolvePacienteSnapshot(force);
    if (!paciente) {
      state.paciente = null;
      state.tratamentos = [];
      state.selectedTreatmentId = 0;
      state.statusLookup = [];
      state.resumo = null;
      state.error = "";
      state.notice = "";
      renderEmpty("Selecione um paciente para carregar o odontograma.");
      return false;
    }
    state.paciente = paciente;
    const pacienteId = num(paciente.id);
    const ultimoTratamentoId = getUltimoTratamentoId(paciente);
    const ultimoTratamentoNrotra = getUltimoTratamentoNrotra(paciente);

    state.loading = true;
    state.error = "";
    state.notice = "";
    setFeedback("Carregando tratamentos do paciente...", false);
    try {
      const { tratamentos, selectedId } = await loadTratamentos(pacienteId);
      state.tratamentos = tratamentos;
      const idsDisponiveis = new Set(tratamentos.map((item) => num(item.id)));
      state.selectedTreatmentId =
        (ultimoTratamentoId && idsDisponiveis.has(ultimoTratamentoId) && ultimoTratamentoId) ||
        (selectedId && idsDisponiveis.has(selectedId) && selectedId) ||
        num(tratamentos[0]?.id) ||
        0;

      if (!state.selectedTreatmentId && ultimoTratamentoNrotra && tratamentos.length) {
        state.selectedTreatmentId = num(tratamentos[0]?.id);
      }

      if (!state.selectedTreatmentId) {
        state.notice = "Nenhum tratamento cadastrado; exibindo odontograma vazio.";
      }

      syncTreatmentSelect();

      state.statusLookup = await loadStatusLookup();
      await loadCatalogoInferior(true);
      await loadResumo(false);
      return true;
    } catch (err) {
      state.resumo = null;
      state.error = err?.message || "Falha ao carregar o odontograma.";
      render();
      return false;
    } finally {
      state.loading = false;
    }
  }

  function syncTreatmentSelect() {
    const cfg = getPanelElements();
    if (!cfg.tratamento && !cfg.treatmentTabs) return;
    const options = [];
    const tabs = [];
    if (!state.tratamentos.length) {
      const refId = num(state.selectedTreatmentId || 1) || 1;
      options.push(`<option value="${escHtml(refId)}">ReferÃªncia vazia (tratamento ${escHtml(refId)})</option>`);
      tabs.push(`<button type="button" class="odonto-v1-treatment-tab active empty" data-treatment-id="${escHtml(refId)}">Sem tratamentos</button>`);
      if (cfg.tratamento) cfg.tratamento.innerHTML = options.join("");
      if (cfg.tratamento) cfg.tratamento.value = String(refId);
      if (cfg.treatmentTabs) cfg.treatmentTabs.innerHTML = tabs.join("");
      return;
    }
    options.push('<option value="">Selecione um tratamento</option>');
    state.tratamentos.forEach((item) => {
      const value = num(item.id);
      const selected = value === num(state.selectedTreatmentId) ? " selected" : "";
      options.push(`<option value="${escHtml(value)}"${selected}>${escHtml(formatTratamentoLabel(item))}</option>`);
      const active = value === num(state.selectedTreatmentId) ? " active" : "";
      const title = escHtml(String(item?.rotulo || item?.situacao || "").trim() || formatTratamentoLabel(item));
      tabs.push(`<button type="button" class="odonto-v1-treatment-tab${active}" data-treatment-id="${escHtml(value)}" title="${title}">${escHtml(formatTratamentoLabel(item))}</button>`);
    });
    if (cfg.tratamento) {
      cfg.tratamento.innerHTML = options.join("");
      cfg.tratamento.value = String(state.selectedTreatmentId || "");
    }
    if (cfg.treatmentTabs) {
      cfg.treatmentTabs.innerHTML = tabs.join("");
      cfg.treatmentTabs.querySelectorAll(".odonto-v1-treatment-tab").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const treatmentId = num(btn.getAttribute("data-treatment-id"));
          if (!treatmentId || treatmentId === num(state.selectedTreatmentId)) return;
          state.selectedTreatmentId = treatmentId;
          syncTreatmentSelect();
          await loadResumo(true);
        });
      });
    }
  }

  async function resolvePacienteSnapshot(force = false) {
    if (!force && state.paciente && num(state.paciente.id) === getPacienteId()) {
      return state.paciente;
    }
    const current = getPacienteSnapshot();
    if (current && num(current.id)) {
      state.paciente = current;
      return current;
    }
    const pacienteId = getPacienteId();
    if (!pacienteId) return null;
    const { res, data } = await requestJson("GET", `/cadastros/pacientes/${encodeURIComponent(String(pacienteId))}`, undefined, true);
    if (!res.ok) return null;
    state.paciente = data || null;
    return state.paciente;
  }

  function openPanel() {
    ensureUI();
    if (!state.panel) return;
    try {
      if (typeof hideAllPanels === "function") hideAllPanels();
    } catch {}
    state.panel.classList.remove("hidden");
    const workspace = typeof workspaceEmpty !== "undefined" ? workspaceEmpty : document.getElementById("workspace-empty");
    if (workspace?.classList) workspace.classList.add("hidden");
    try {
      if (typeof ensurePanelChrome === "function") ensurePanelChrome(state.panel);
    } catch {}
    state.paciente = getPacienteSnapshot();
    state.tratamentos = [];
    state.statusLookup = [];
    state.resumo = null;
    state.selectedTreatmentId = 0;
    state.error = "";
    state.notice = "";
    if (window.BranaOdontoPacienteSearchV1 && typeof window.BranaOdontoPacienteSearchV1.setCurrentPatient === "function") {
      window.BranaOdontoPacienteSearchV1.setCurrentPatient(state.paciente || null);
    }
    if (state.paciente) {
      void refresh(true);
    } else {
      renderEmpty("Selecione um paciente para carregar o odontograma.");
      void loadCatalogoInferior(true);
    }
    if (typeof footerMsg !== "undefined" && footerMsg) {
      footerMsg.textContent = state.paciente ? "Odontograma V1 carregando paciente ativo." : "Odontograma V1 aberto sem paciente selecionado.";
    }
  }

  function closePanel() {
    if (state.panel) state.panel.classList.add("hidden");
    const workspace = typeof workspaceEmpty !== "undefined" ? workspaceEmpty : document.getElementById("workspace-empty");
    const fichaPanel = typeof ficha !== "undefined" && ficha?.panel ? ficha.panel : null;
    if (fichaPanel?.classList) {
      fichaPanel.classList.remove("hidden");
      if (workspace?.classList) workspace.classList.add("hidden");
    } else if (workspace?.classList) {
      workspace.classList.remove("hidden");
    }
    if (typeof footerMsg !== "undefined" && footerMsg) {
      footerMsg.textContent = "Odontograma V1 fechado.";
    }
  }

  async function tentarAbrirEntradaOdontologicaIsolada() {
    const pacienteAtivo =
      state.paciente && num(state.paciente.id)
        ? { ...state.paciente }
        : (() => {
            const fonteHeader = typeof window !== "undefined" ? window.BranaPacienteEmUsoHeaderV1?.getSources?.() : null;
            const pacienteId = num(fonteHeader?.id || 0);
            if (!pacienteId) return null;
            return {
              id: pacienteId,
              codigo: String(fonteHeader?.numero || "").trim(),
              nome_completo: String(fonteHeader?.nome || "").trim(),
            };
          })();
    openPanel();
    if (pacienteAtivo && num(pacienteAtivo.id)) {
      state.paciente = pacienteAtivo;
      try {
        window.BranaOdontoPacienteSearchV1?.setCurrentPatient?.(pacienteAtivo);
      } catch {}
      try {
        window.BranaPacienteEmUsoHeaderV1?.sync?.(pacienteAtivo);
      } catch {}
    }
    try {
      await refresh(true);
    } catch {}
    return {
      ok: true,
      status: "odontograma-v1-aberto",
      fallback: "odontograma-v1",
    };
  }

  function interceptButtonClick(ev) {
    const alvo = ev?.target?.closest ? ev.target.closest("#ficha-btn-odontograma") : null;
    if (!alvo) return;
    ev.preventDefault();
    ev.stopPropagation();
    if (typeof ev.stopImmediatePropagation === "function") ev.stopImmediatePropagation();
    void tentarAbrirEntradaOdontologicaIsolada();
  }

  function patchHooks() {
    if (typeof document !== "undefined" && !document.__odontoV1ClickBound) {
      document.__odontoV1ClickBound = true;
      document.addEventListener("click", interceptButtonClick, true);
    }

    if (typeof closeWorkspacePanel === "function" && !closeWorkspacePanel.__odontoV1Wrapped) {
      const origCloseWorkspacePanel = closeWorkspacePanel;
      const wrapped = function (panelId) {
        if (String(panelId || "") === PANEL_ID) {
          closePanel();
          return;
        }
        return origCloseWorkspacePanel.apply(this, arguments);
      };
      wrapped.__odontoV1Wrapped = true;
      closeWorkspacePanel = wrapped;
    }

    if (typeof hideAllPanels === "function" && !hideAllPanels.__odontoV1Wrapped) {
      const origHideAllPanels = hideAllPanels;
      const wrappedHide = function () {
        const result = origHideAllPanels.apply(this, arguments);
        if (state.panel?.classList) state.panel.classList.add("hidden");
        return result;
      };
      wrappedHide.__odontoV1Wrapped = true;
      hideAllPanels = wrappedHide;
    }

    if (typeof fichaAplicarPaciente === "function" && !fichaAplicarPaciente.__odontoV1Wrapped) {
      const origFichaAplicarPaciente = fichaAplicarPaciente;
      const wrappedFichaAplicarPaciente = function (item) {
        const result = origFichaAplicarPaciente.apply(this, arguments);
        state.paciente = item || null;
        if (state.panel && !state.panel.classList.contains("hidden")) {
          void refresh(true);
        }
        return result;
      };
      wrappedFichaAplicarPaciente.__odontoV1Wrapped = true;
      fichaAplicarPaciente = wrappedFichaAplicarPaciente;
    }

    if (typeof fichaLimparNovo === "function" && !fichaLimparNovo.__odontoV1Wrapped) {
      const origFichaLimparNovo = fichaLimparNovo;
      const wrappedFichaLimparNovo = async function () {
        const result = await origFichaLimparNovo.apply(this, arguments);
        state.paciente = null;
        state.tratamentos = [];
        state.statusLookup = [];
        state.resumo = null;
        state.selectedTreatmentId = 0;
        state.error = "";
        if (state.panel && !state.panel.classList.contains("hidden")) {
          renderEmpty("Abra um paciente para carregar o odontograma.");
        }
        return result;
      };
      wrappedFichaLimparNovo.__odontoV1Wrapped = true;
      fichaLimparNovo = wrappedFichaLimparNovo;
    }
  }

  function getInfo() {
    return {
      name: MODULE_NAME,
      version: MODULE_VERSION,
      status: "bootstrap-leitura",
      controlaFluxo: false,
      estado: state,
      abrir: openPanel,
      fechar: closePanel,
      atualizar: refresh,
    };
  }

  function getStatus() {
    return {
      name: MODULE_NAME,
      version: MODULE_VERSION,
      status: "bootstrap-leitura",
      controlaFluxo: false,
      pronto: !!state.panel,
    };
  }

  ensureUI();
  patchHooks();

  window.BranaOdontogramaV1Module = Object.freeze({
    getInfo,
    getStatus,
    abrir: openPanel,
    fechar: closePanel,
    atualizar: refresh,
    state,
  });
})();
