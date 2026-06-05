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
    if (state.paciente?.id) return num(state.paciente.id);
    return 0;
  }

  function getPacienteSnapshot() {
    return state.paciente || null;
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
    if (!paciente) return "Paciente não carregado";
    const codigo = String(paciente.codigo ?? "").trim();
    const nomeCompleto = String(paciente.nome_completo || "").trim();
    const nome = nomeCompleto || String(`${paciente.nome || ""} ${paciente.sobrenome || ""}`).trim();
    const base = [codigo ? `#${codigo}` : "", nome].filter(Boolean).join(" - ");
    return base || `Paciente #${num(paciente.id) || "-"}`;
  }

  function formatTratamentoLabel(item) {
    if (!item) return "";
    const numero = num(item.nrotra);
    const data = String(item.data_inicio_br || "").trim();
    const situacao = String(item.situacao || "").trim();
    const partes = [`Tratamento ${numero || item.id}`];
    if (data) partes.push(data);
    if (situacao) partes.push(situacao);
    return partes.join(" - ");
  }

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .odonto-v1-panel{width:min(1240px,100%);min-height:0;box-sizing:border-box;padding:10px 10px 12px;background:#fff;border:1px solid #cfd8e3;font:12px Tahoma,sans-serif;color:#111}
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
      .odonto-v1-main{display:grid;grid-template-columns:minmax(0,1.08fr) minmax(0,.92fr);gap:10px;min-height:0}
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
      const searchModule = window.BranaOdontoPacienteSearchV1;
      if (searchModule && typeof searchModule.mount === "function" && cfg.paciente) {
        searchModule.mount(cfg.paciente, {
          currentPatient: state.paciente,
          initialQuery: "",
          onSelect: async (item) => {
            const paciente = item || null;
            state.paciente = paciente;
            state.tratamentos = [];
            state.statusLookup = [];
            state.resumo = null;
            state.selectedTreatmentId = 0;
            state.error = "";
            state.notice = "";
            renderSummaryHeader();
            if (!paciente) {
              renderEmpty("Selecione um paciente para carregar o odontograma.");
              return null;
            }
            if (typeof fichaAplicarPaciente === "function") {
              const result = fichaAplicarPaciente(paciente);
              if (result && typeof result.then === "function") {
                await result;
              }
            } else if (typeof fichaCarregarPacientePorId === "function") {
              const result = fichaCarregarPacientePorId(num(paciente.id), true);
              if (result && typeof result.then === "function") {
                await result;
              }
            }
            return paciente;
          },
        });
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
    if (window.BranaOdontoPacienteSearchV1 && typeof window.BranaOdontoPacienteSearchV1.setCurrentPatient === "function") {
      window.BranaOdontoPacienteSearchV1.setCurrentPatient(state.paciente);
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
      cfg.resumoContagem.textContent = `${total} intervenção(ões).`;
    }
  }

  function renderLegend() {
    const cfg = getPanelElements();
    if (!cfg.legend) return;
    const itens = Array.isArray(state.statusLookup) ? state.statusLookup : [];
    if (!itens.length) {
      cfg.legend.innerHTML = '<div class="odonto-v1-empty">Nenhum status disponível.</div>';
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
            <div class="odonto-v1-slot-body">${escHtml(dente || "—")}</div>
            <div class="odonto-v1-slot-foot">${escHtml(observacao || "Sem observação")}</div>
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
    return flags.length ? flags.join(" ") : "—";
  }

  function renderIntervencoes() {
    const cfg = getPanelElements();
    if (!cfg.intervencoes) return;
    const itens = Array.isArray(state.resumo?.intervencoes) ? state.resumo.intervencoes : [];
    if (!itens.length) {
      cfg.intervencoes.innerHTML = '<div class="odonto-v1-empty">Nenhuma intervenção encontrada para o tratamento selecionado.</div>';
      return;
    }
    const cards = itens
      .map((item) => {
        const status = item.status?.descricao || item.status?.codigo || "-";
        const statusBase = String(item.status?.codigo || item.status?.descricao || "status").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
        const statusClass = `is-${statusBase || "status"}`;
        const denteTexto = Array.isArray(item.dentes) && item.dentes.length
          ? item.dentes.map((dente) => String(dente.numero_dente_fdi)).join(", ")
          : "—";
        const faceTexto = Array.isArray(item.faces) && item.faces.length
          ? item.faces.map((face) => `${String(face.numero_dente_fdi)}(${faceFlagsText(face)})`).join(", ")
          : "—";
        const dataPlanejada = String(item.data_planejada || "").trim() || "—";
        const dataExecucao = String(item.data_execucao || "").trim() || "—";
        const observacao = String(item.observacao_resumida || "").trim() || "—";
        return `
          <article class="odonto-v1-interv-card">
            <div class="odonto-v1-interv-head">
              <div class="odonto-v1-interv-core">
                <span class="odonto-v1-interv-id">#${escHtml(num(item.id))}</span>
                <span class="odonto-v1-interv-status ${escHtml(statusClass)}">${escHtml(status)}</span>
                <strong class="odonto-v1-interv-proc">${escHtml(item.procedimento_nome || num(item.procedimento_id) || "-")}</strong>
              </div>
              <span class="odonto-v1-interv-prestador">Prestador ${escHtml(num(item.prestador_id) || "—")}</span>
            </div>
            <div class="odonto-v1-interv-meta">
              <span><strong>Dentes:</strong> ${escHtml(denteTexto)}</span>
              <span><strong>Faces:</strong> ${escHtml(faceTexto)}</span>
              <span><strong>Planejada:</strong> ${escHtml(dataPlanejada)}</span>
              <span><strong>Execucao:</strong> ${escHtml(dataExecucao)}</span>
            </div>
            <div class="odonto-v1-interv-obs">${escHtml(observacao)}</div>
          </article>
        `;
      })
      .join("");
    cfg.intervencoes.innerHTML = `<div class="odonto-v1-interv-list">${cards}</div>`;
  }

  function renderEmpty(message) {
    const cfg = getPanelElements();
    if (cfg.arcada) cfg.arcada.innerHTML = `<div class="odonto-v1-empty">${escHtml(message)}</div>`;
    if (cfg.intervencoes) cfg.intervencoes.innerHTML = `<div class="odonto-v1-empty">${escHtml(message)}</div>`;
    renderSummaryHeader();
    renderLegend();
  }

  function render() {
    renderSummaryHeader();
    renderLegend();
    renderArcada();
    renderIntervencoes();
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
      state.error = "Selecione um paciente válido para abrir o odontograma.";
      render();
      return false;
    }
    if (!tratamentoId) {
      state.resumo = null;
      state.error = state.tratamentos.length ? "Selecione um tratamento para visualizar o odontograma." : "Nenhum tratamento encontrado para este paciente.";
      render();
      return false;
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
        state.selectedTreatmentId = 1;
        state.notice = "Nenhum tratamento cadastrado; exibindo leitura de referência vazia.";
      }

      syncTreatmentSelect();

      state.statusLookup = await loadStatusLookup();
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
    if (!cfg.tratamento) return;
    const options = [];
    if (!state.tratamentos.length) {
      const refId = num(state.selectedTreatmentId || 1) || 1;
      options.push(`<option value="${escHtml(refId)}">Referência vazia (tratamento ${escHtml(refId)})</option>`);
      cfg.tratamento.innerHTML = options.join("");
      cfg.tratamento.value = String(refId);
      return;
    }
    options.push('<option value="">Selecione um tratamento</option>');
    state.tratamentos.forEach((item) => {
      const value = num(item.id);
      const selected = value === num(state.selectedTreatmentId) ? " selected" : "";
      options.push(`<option value="${escHtml(value)}"${selected}>${escHtml(formatTratamentoLabel(item))}</option>`);
    });
    cfg.tratamento.innerHTML = options.join("");
    cfg.tratamento.value = String(state.selectedTreatmentId || "");
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
    state.paciente = null;
    state.tratamentos = [];
    state.statusLookup = [];
    state.resumo = null;
    state.selectedTreatmentId = 0;
    state.error = "";
    state.notice = "";
    if (window.BranaOdontoPacienteSearchV1 && typeof window.BranaOdontoPacienteSearchV1.setCurrentPatient === "function") {
      window.BranaOdontoPacienteSearchV1.setCurrentPatient(null);
    }
    renderEmpty("Selecione um paciente para carregar o odontograma.");
    if (typeof footerMsg !== "undefined" && footerMsg) {
      footerMsg.textContent = "Odontograma V1 aberto sem paciente selecionado.";
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

  const ENTRY_HOST_ID = "odonto-v1-entrada-isolada-host";

  const MODULOS_ENTRADA_ODONTOLOGICA = Object.freeze([
    "/frontend/js/modules/tela-principal-odontologica-contratos.js",
    "/frontend/js/modules/tela-principal-odontologica-assets.js",
    "/frontend/js/modules/tela-principal-odontologica-estado.js",
    "/frontend/js/modules/tela-principal-odontologica-odontograma.js",
    "/frontend/js/modules/tela-principal-odontologica-layout.js",
    "/frontend/js/modules/tela-principal-odontologica-entrada.js",
  ]);

  function carregarScriptEntradaOdontologica(src) {
    return new Promise((resolve, reject) => {
      if (typeof document === "undefined") {
        reject(new Error("Document indisponivel para carregamento dinamico."));
        return;
      }
      const script = document.createElement("script");
      script.src = src;
      script.async = false;
      script.dataset.odontoEntradaScript = "1";
      script.onload = () => {
        script.dataset.odontoEntradaScriptLoaded = "1";
        resolve({ ok: true, status: "carregado", src });
      };
      script.onerror = () => reject(new Error("Falha ao carregar " + src));
      const alvo = document.head || document.body || document.documentElement;
      if (!alvo || typeof alvo.appendChild !== "function") {
        reject(new Error("Sem alvo de insercao para carregamento dinamico."));
        return;
      }
      alvo.appendChild(script);
    });
  }

  async function carregarModulosEntradaOdontologica() {
    if (typeof window !== "undefined" && typeof window.abrirTelaPrincipalOdontologicaPorPaciente === "function") {
      return { ok: true, status: "entrada-isolada-ja-disponivel" };
    }
    if (typeof window !== "undefined" && window.__odontoEntradaIsoladaLoadPromise) {
      return window.__odontoEntradaIsoladaLoadPromise;
    }
    const promessa = (async () => {
      for (const src of MODULOS_ENTRADA_ODONTOLOGICA) {
        await carregarScriptEntradaOdontologica(src);
      }
      if (typeof window === "undefined" || typeof window.abrirTelaPrincipalOdontologicaPorPaciente !== "function") {
        throw new Error("Entrada isolada indisponivel apos carregamento dos modulos.");
      }
      return { ok: true, status: "entrada-isolada-carregada" };
    })();
    if (typeof window !== "undefined") {
      window.__odontoEntradaIsoladaLoadPromise = promessa.catch((erro) => {
        window.__odontoEntradaIsoladaLoadPromise = null;
        throw erro;
      });
      return window.__odontoEntradaIsoladaLoadPromise;
    }
    return promessa;
  }

  function obterContextoEntradaOdontologica() {
    const fichaAtual = typeof ficha !== "undefined" ? ficha : null;
    const paciente = state.paciente || null;
    const nome = [
      String(paciente?.nome || "").trim(),
      String(paciente?.sobrenome || "").trim(),
    ].filter(Boolean).join(" ").trim() || String(fichaAtual?.nome?.value || "").trim();
    return {
      origem: "ficha-pessoal-historico",
      modo: "visual-estatico",
      comPaciente: !!(paciente || nome || String(fichaAtual?.codigo?.value || "").trim()),
      pacienteId: paciente?.id ?? paciente?.paciente_id ?? "",
      pacienteCodigo: String(paciente?.codigo ?? paciente?.codigo_paciente ?? fichaAtual?.codigo?.value ?? "").trim(),
      pacienteNome: nome || String(fichaAtual?.nome?.value || "").trim(),
      container: null,
    };
  }

  function obterOuCriarHostEntradaOdontologica() {
    let host = document.getElementById(ENTRY_HOST_ID);
    if (host && host.isConnected) return host;
    host = document.createElement("section");
    host.id = ENTRY_HOST_ID;
    host.setAttribute("data-odonto-v1-entrada-isolada", "1");
    host.style.cssText = [
      "position:fixed",
      "inset:8px",
      "z-index:5300",
      "display:block",
      "background:#f6f7fb",
      "border:1px solid #9fb0c2",
      "box-shadow:0 16px 34px rgba(15,23,42,.18)",
      "overflow:auto",
      "box-sizing:border-box",
    ].join(";");
    document.body.appendChild(host);
    return host;
  }

  function removerHostEntradaOdontologica() {
    const host = document.getElementById(ENTRY_HOST_ID);
    if (host?.isConnected) host.remove();
  }

  async function tentarAbrirEntradaOdontologicaIsolada() {
    let carregamento = null;
    try {
      carregamento = await carregarModulosEntradaOdontologica();
    } catch (erro) {
      removerHostEntradaOdontologica();
      openPanel();
      return {
        ok: false,
        status: "entrada-isolada-carregamento-falhou",
        erro: String(erro?.message || erro || ""),
        fallback: "legacy",
      };
    }

    if (!carregamento || !carregamento.ok) {
      removerHostEntradaOdontologica();
      openPanel();
      return {
        ok: false,
        status: carregamento?.status || "entrada-isolada-indisponivel",
        fallback: "legacy",
      };
    }

    const abrirEntrada = typeof window !== "undefined" ? window.abrirTelaPrincipalOdontologicaPorPaciente : null;
    if (typeof abrirEntrada !== "function") {
      removerHostEntradaOdontologica();
      openPanel();
      return { ok: false, status: "entrada-isolada-indisponivel", fallback: "legacy" };
    }

    const host = obterOuCriarHostEntradaOdontologica();
    const contexto = { ...obterContextoEntradaOdontologica(), container: host };

    try {
      const resultado = await Promise.resolve(abrirEntrada(contexto));
      if (resultado && resultado.ok) {
        if (typeof footerMsg !== "undefined" && footerMsg) {
          footerMsg.textContent = "Odontograma isolado aberto.";
        }
        return {
          ok: true,
          status: resultado.status || "entrada-isolada-aberta",
          resultado,
          host,
        };
      }
      removerHostEntradaOdontologica();
      openPanel();
      return {
        ok: false,
        status: resultado?.status || "fallback-legacy-opened",
        resultado,
        fallback: "legacy",
      };
    } catch (erro) {
      removerHostEntradaOdontologica();
      openPanel();
      return {
        ok: false,
        status: "fallback-legacy-opened",
        erro: String(erro?.message || erro || ""),
        fallback: "legacy",
      };
    }
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
