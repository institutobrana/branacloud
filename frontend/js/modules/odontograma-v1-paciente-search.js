(function () {
  "use strict";

  const MODULE_NAME = "BranaOdontoPacienteSearchV1";
  const STYLE_ID = "odonto-v1-paciente-search-style";
  const ROOT_ATTR = "data-odonto-paciente-search";

  const state = {
    root: null,
    input: null,
    btn: null,
    current: null,
    results: null,
    status: null,
    query: "",
    resultsData: [],
    currentPatient: null,
    loading: false,
    error: "",
    requestSeq: 0,
    debounceTimer: null,
    handlers: {},
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

  function formatPacienteLabel(paciente) {
    if (!paciente) return "Sem paciente selecionado.";
    const codigo = String(paciente.codigo ?? "").trim();
    const nomeCompleto = String(paciente.nome_completo || "").trim();
    const nome = nomeCompleto || String(`${paciente.nome || ""} ${paciente.sobrenome || ""}`).trim();
    const base = [codigo ? `#${codigo}` : "", nome].filter(Boolean).join(" - ");
    return base || `Paciente #${num(paciente.id) || "-"}`;
  }

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .odonto-v1-paciente-search{display:grid;gap:6px}
      .odonto-v1-paciente-search-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:6px;align-items:center}
      .odonto-v1-paciente-search-input{height:30px;border:1px solid #bfc9d6;background:#fff;padding:0 8px;box-sizing:border-box;font:12px Tahoma,sans-serif;min-width:0}
      .odonto-v1-paciente-search-btn{height:30px;min-width:84px;padding:0 10px;border:1px solid #bfc9d6;background:linear-gradient(180deg,#fff 0%,#eef4f9 100%);font:700 12px Tahoma,sans-serif;color:#223244;cursor:pointer}
      .odonto-v1-paciente-search-current{min-height:18px;font:700 11px Tahoma,sans-serif;color:#314052;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .odonto-v1-paciente-search-results{display:grid;gap:4px;max-height:160px;overflow:auto;border:1px dashed #d7e0ea;background:#fbfcfe;padding:6px}
      .odonto-v1-paciente-search-empty{padding:8px 8px;color:#64748b;background:#fff;border:1px dashed #d7dfe8}
      .odonto-v1-paciente-search-item{display:grid;gap:2px;padding:6px 8px;border:1px solid #d7e0ea;background:#fff;cursor:pointer}
      .odonto-v1-paciente-search-item:hover{border-color:#8eb0d8;background:#f5faff}
      .odonto-v1-paciente-search-item.is-selected{border-color:#3e8ed0;background:#eef7ff}
      .odonto-v1-paciente-search-item-head{display:flex;justify-content:space-between;gap:8px;align-items:center;font:700 11px Tahoma,sans-serif;color:#1f3550}
      .odonto-v1-paciente-search-item-name{font:12px Tahoma,sans-serif;color:#111;line-height:1.25}
      .odonto-v1-paciente-search-item-meta{font:11px Tahoma,sans-serif;color:#5d6b79}
      .odonto-v1-paciente-search-status{font:11px Tahoma,sans-serif;color:#5d6b79;min-height:16px}
      .odonto-v1-paciente-search-status.is-error{color:#9b1c1c}
    `;
    document.head.appendChild(style);
  }

  function markup() {
    return `
      <div class="odonto-v1-paciente-search" ${ROOT_ATTR}="1">
        <div class="odonto-v1-paciente-search-row">
          <input id="odonto-v1-paciente-search-input" class="odonto-v1-paciente-search-input" type="text" placeholder="Código, primeiro nome ou nome completo">
          <button id="odonto-v1-paciente-search-btn" class="odonto-v1-paciente-search-btn" type="button">Buscar</button>
        </div>
        <div id="odonto-v1-paciente-search-current" class="odonto-v1-paciente-search-current">Sem paciente selecionado.</div>
        <div id="odonto-v1-paciente-search-status" class="odonto-v1-paciente-search-status">Digite um código ou nome para localizar o paciente.</div>
        <div id="odonto-v1-paciente-search-results" class="odonto-v1-paciente-search-results">
          <div class="odonto-v1-paciente-search-empty">Nenhuma busca realizada.</div>
        </div>
      </div>
    `;
  }

  function getElements() {
    return {
      root: state.root,
      input: document.getElementById("odonto-v1-paciente-search-input"),
      btn: document.getElementById("odonto-v1-paciente-search-btn"),
      current: document.getElementById("odonto-v1-paciente-search-current"),
      results: document.getElementById("odonto-v1-paciente-search-results"),
      status: document.getElementById("odonto-v1-paciente-search-status"),
    };
  }

  function renderCurrentPatient() {
    const cfg = getElements();
    if (cfg.current) {
      cfg.current.textContent = formatPacienteLabel(state.currentPatient);
      cfg.current.title = formatPacienteLabel(state.currentPatient);
    }
  }

  function renderResults() {
    const cfg = getElements();
    if (!cfg.results) return;
    if (state.loading) {
      cfg.results.innerHTML = '<div class="odonto-v1-paciente-search-empty">Buscando pacientes...</div>';
      return;
    }
    const rows = Array.isArray(state.resultsData) ? state.resultsData : [];
    if (!rows.length) {
      const msg = state.query ? "Nenhum paciente encontrado para a busca informada." : "Nenhuma busca realizada.";
      cfg.results.innerHTML = `<div class="odonto-v1-paciente-search-empty">${escHtml(msg)}</div>`;
      return;
    }
    cfg.results.innerHTML = rows
      .map((item) => {
        const id = num(item.id);
        const codigo = String(item.codigo ?? "").trim();
        const nome = String(item.nome_completo || `${item.nome || ""} ${item.sobrenome || ""}`).trim();
        const cpf = String(item.cpf || "").trim();
        const cidade = String(item.cidade || "").trim();
        const selected = id && num(state.currentPatient?.id) === id ? " is-selected" : "";
        return `
          <button type="button" class="odonto-v1-paciente-search-item${selected}" data-paciente-id="${escHtml(id)}">
            <div class="odonto-v1-paciente-search-item-head">
              <span>#${escHtml(codigo || id)}</span>
              <span>${escHtml(item.status || "")}${item.inativo ? " - Inativo" : ""}</span>
            </div>
            <div class="odonto-v1-paciente-search-item-name">${escHtml(nome || "Paciente sem nome")}</div>
            <div class="odonto-v1-paciente-search-item-meta">${escHtml([cpf, cidade].filter(Boolean).join(" - ") || "Sem detalhes adicionais")}</div>
          </button>
        `;
      })
      .join("");
  }

  function setStatus(message, isError = false) {
    const cfg = getElements();
    if (!cfg.status) return;
    cfg.status.textContent = String(message || "").trim() || "Pronto.";
    cfg.status.classList.toggle("is-error", !!isError);
  }

  function setCurrentPatient(patient) {
    state.currentPatient = patient || null;
    renderCurrentPatient();
  }

  async function search(term) {
    const q = String(term ?? state.query ?? "").trim();
    state.query = q;
    if (!q) {
      state.resultsData = [];
      state.error = "";
      state.loading = false;
      setStatus("Digite um código ou nome para localizar o paciente.", false);
      renderResults();
      return false;
    }
    const seq = ++state.requestSeq;
    state.loading = true;
    state.error = "";
    setStatus("Buscando pacientes...", false);
    renderResults();
    try {
      const { res, data } = await requestJson("GET", `/cadastros/pacientes?q=${encodeURIComponent(q)}&limit=12`, undefined, true);
      if (seq !== state.requestSeq) return false;
      if (!res.ok) {
        state.resultsData = [];
        state.error = data?.detail || "Falha ao localizar pacientes.";
        setStatus(state.error, true);
        renderResults();
        return false;
      }
      state.resultsData = Array.isArray(data) ? data : [];
      setStatus(state.resultsData.length ? `${state.resultsData.length} paciente(s) encontrado(s).` : "Nenhum paciente encontrado.", false);
      renderResults();
      if (state.resultsData.length === 1 && state.handlers.autoOpenSingle !== false) {
        setStatus("1 paciente encontrado. Abrindo paciente...", false);
        await openPatient(state.resultsData[0]);
      }
      return true;
    } catch (err) {
      if (seq !== state.requestSeq) return false;
      state.resultsData = [];
      state.error = err?.message || "Falha ao localizar pacientes.";
      setStatus(state.error, true);
      renderResults();
      return false;
    } finally {
      if (seq === state.requestSeq) {
        state.loading = false;
      }
    }
  }

  async function openPatient(item) {
    const id = num(item?.id);
    if (!id) return false;
    setCurrentPatient(item);
    setStatus(`Abrindo paciente #${num(item?.codigo) || id}...`, false);
    try {
      if (typeof state.handlers.onSelect === "function") {
        const selected = await state.handlers.onSelect(item);
        setCurrentPatient(selected || item);
        setStatus(`Paciente ${formatPacienteLabel(selected || item)} selecionado.`, false);
        renderResults();
        return true;
      }
      if (typeof fichaCarregarPacientePorId === "function") {
        const loaded = await fichaCarregarPacientePorId(id, true);
        if (loaded) {
          setCurrentPatient(loaded);
          return true;
        }
      }
      if (typeof fichaAplicarPaciente === "function") {
        fichaAplicarPaciente(item);
        return true;
      }
      if (typeof fichaPacienteAtualId !== "undefined") {
        fichaPacienteAtualId = id;
      }
      return true;
    } catch (err) {
      setStatus(err?.message || "Falha ao abrir paciente.", true);
      return false;
    }
  }

  function bind() {
    const cfg = getElements();
    if (!cfg.root || cfg.root.dataset.bound === "1") return cfg;
    cfg.root.dataset.bound = "1";
    const runLiveSearch = () => {
      const value = String(cfg.input?.value || "").trim();
      if (state.debounceTimer) {
        clearTimeout(state.debounceTimer);
      }
      state.debounceTimer = setTimeout(() => {
        void search(value);
      }, 250);
    };
    cfg.input?.addEventListener("input", runLiveSearch);
    cfg.input?.addEventListener("keydown", (ev) => {
      if (ev.key !== "Enter") return;
      ev.preventDefault();
      if (state.debounceTimer) {
        clearTimeout(state.debounceTimer);
        state.debounceTimer = null;
      }
      void search(cfg.input?.value || "");
    });
    cfg.btn?.addEventListener("click", () => {
      if (state.debounceTimer) {
        clearTimeout(state.debounceTimer);
        state.debounceTimer = null;
      }
      void search(cfg.input?.value || "");
    });
    cfg.results?.addEventListener("click", (ev) => {
      const button = ev?.target?.closest ? ev.target.closest("[data-paciente-id]") : null;
      if (!button) return;
      const id = num(button.getAttribute("data-paciente-id"));
      const item = (state.resultsData || []).find((row) => num(row.id) === id);
      if (!item) return;
      void openPatient(item);
    });
    return cfg;
  }

  function mount(root, handlers = {}) {
    ensureStyle();
    if (!root) return null;
    state.root = root;
    state.handlers = handlers || {};
    if (!String(root.dataset.odontoPacienteSearchMounted || "")) {
      root.innerHTML = markup();
      root.dataset.odontoPacienteSearchMounted = "1";
    }
    bind();
    const cfg = getElements();
    if (handlers.currentPatient) setCurrentPatient(handlers.currentPatient);
    if (typeof handlers.initialQuery === "string" && handlers.initialQuery.trim()) {
      if (cfg.input) cfg.input.value = handlers.initialQuery.trim();
      state.query = handlers.initialQuery.trim();
    }
    renderCurrentPatient();
    renderResults();
    if (cfg.input && !cfg.input.value.trim()) {
      setStatus("Digite um código ou nome para localizar o paciente.", false);
    }
    return cfg;
  }

  window.BranaOdontoPacienteSearchV1 = Object.freeze({
    moduleName: MODULE_NAME,
    ensureStyle,
    mount,
    search,
    openPatient,
    setCurrentPatient,
    renderResults,
  });
})();
