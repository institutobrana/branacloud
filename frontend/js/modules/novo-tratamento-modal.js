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
  let datePickerState = null;
  let currentPacienteId = 0;
  let currentTratamentoId = 0;
  let saveInProgress = false;

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

  function onlyDigits(value) {
    return String(value ?? "").replace(/\D+/g, "").slice(0, 8);
  }

  function coercePositiveInt(value) {
    const n = Number(String(value ?? "").trim());
    return Number.isInteger(n) && n > 0 ? n : null;
  }

  function pad2(value) {
    return String(value ?? "").padStart(2, "0");
  }

  function formatDateBrFromDate(date) {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "";
    return `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}/${date.getFullYear()}`;
  }

  function formatDateBr(value) {
    const raw = String(value ?? "").trim();
    if (!raw) return "";
    const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (iso) {
      return `${iso[3]}/${iso[2]}/${iso[1]}`;
    }
    const br = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (br) {
      return `${br[1]}/${br[2]}/${br[3]}`;
    }
    const digits = onlyDigits(raw);
    if (digits.length === 8) {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
    }
    return raw;
  }

  function parseBrDate(value) {
    const raw = String(value ?? "").trim();
    if (!raw) return null;
    const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (iso) {
      const year = Number(iso[1]);
      const month = Number(iso[2]);
      const day = Number(iso[3]);
      const date = new Date(year, month - 1, day);
      if (date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day) return date;
      return null;
    }
    const br = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (br) {
      const day = Number(br[1]);
      const month = Number(br[2]);
      const year = Number(br[3]);
      const date = new Date(year, month - 1, day);
      if (date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day) return date;
      return null;
    }
    const digits = onlyDigits(raw);
    if (digits.length !== 8) return null;
    const day = Number(digits.slice(0, 2));
    const month = Number(digits.slice(2, 4));
    const year = Number(digits.slice(4, 8));
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day) return date;
    return null;
  }

  function normalizeDateInput(value) {
    const digits = onlyDigits(value);
    const dd = digits.slice(0, 2);
    const mm = digits.slice(2, 4);
    const yyyy = digits.slice(4, 8);
    if (digits.length <= 2) return dd;
    if (digits.length <= 4) return `${dd}/${mm}`;
    return `${dd}/${mm}/${yyyy}`;
  }

  function syncDateFieldValue(input, date) {
    if (!input) return "";
    const formatted = date ? formatDateBrFromDate(date) : "";
    input.value = formatted;
    input.dataset.ntLastValidDate = formatted;
    return formatted;
  }

  function commitDateFieldValue(input) {
    if (!input) return "";
    const value = toText(input.value);
    if (!value) {
      input.dataset.ntLastValidDate = "";
      return "";
    }
    const parsed = parseBrDate(value);
    if (parsed) {
      return syncDateFieldValue(input, parsed);
    }
    const fallback = toText(input.dataset.ntLastValidDate);
    if (fallback) {
      input.value = fallback;
      return fallback;
    }
    input.value = "";
    input.dataset.ntLastValidDate = "";
    return "";
  }

  function getDatePicker() {
    if (datePickerState?.root) return datePickerState;
    const root = document.createElement("div");
    root.id = "nt-date-picker";
    root.className = "nt-date-picker hidden";
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-label", "Selecionar data");
    root.innerHTML = `
      <div class="nt-date-picker-head">
        <button type="button" class="nt-date-nav" data-nt-date-nav="-1" aria-label="Mês anterior">v</button>
        <div class="nt-date-label"></div>
        <button type="button" class="nt-date-nav" data-nt-date-nav="1" aria-label="Próximo mês">v</button>
      </div>
      <div class="nt-date-weekdays"></div>
      <div class="nt-date-grid"></div>
      <div class="nt-date-actions">
        <button type="button" class="nt-date-action" data-nt-date-today>Hoje</button>
        <button type="button" class="nt-date-action" data-nt-date-clear>Limpar</button>
      </div>
    `;
    document.body.appendChild(root);
    datePickerState = {
      root,
      label: root.querySelector(".nt-date-label"),
      weekdays: root.querySelector(".nt-date-weekdays"),
      grid: root.querySelector(".nt-date-grid"),
      monthDate: new Date(),
      selectedDate: null,
      input: null,
      visible: false,
    };
    return datePickerState;
  }

  function closeDatePicker() {
    const picker = datePickerState;
    if (!picker?.root) return;
    picker.root.classList.add("hidden");
    picker.root.style.visibility = "";
    picker.root.style.left = "";
    picker.root.style.top = "";
    picker.visible = false;
    picker.input = null;
  }

  function renderDatePickerGrid() {
    const picker = getDatePicker();
    if (!picker?.root) return;
    const monthDate = picker.monthDate instanceof Date ? picker.monthDate : new Date();
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startIndex = (firstDay.getDay() + 6) % 7;
    const labels = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"];
    picker.label.textContent = monthDate.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
    picker.weekdays.innerHTML = labels.map((label) => `<span>${label}</span>`).join("");
    const today = new Date();
    const todayKey = `${today.getFullYear()}-${pad2(today.getMonth() + 1)}-${pad2(today.getDate())}`;
    const selected = picker.selectedDate instanceof Date ? picker.selectedDate : null;
    const selectedKey = selected ? `${selected.getFullYear()}-${pad2(selected.getMonth() + 1)}-${pad2(selected.getDate())}` : "";
    const cells = [];
    for (let i = 0; i < startIndex; i += 1) cells.push(`<span class="nt-date-empty" aria-hidden="true"></span>`);
    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(year, month, day);
      const key = `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
      const classes = ["nt-date-cell"];
      if (key === todayKey) classes.push("today");
      if (key === selectedKey) classes.push("selected");
      cells.push(`<button type="button" class="${classes.join(" ")}" data-nt-date-value="${key}">${day}</button>`);
    }
    picker.grid.innerHTML = cells.join("");
  }

  function positionDatePicker(input) {
    const picker = getDatePicker();
    if (!picker?.root || !input) return;
    const rect = input.getBoundingClientRect();
    const margin = 8;
    const width = Math.min(272, window.innerWidth - margin * 2);
    picker.root.style.width = `${width}px`;
    picker.root.style.left = `${Math.max(margin, Math.min(rect.left, window.innerWidth - width - margin))}px`;
    picker.root.style.top = `${Math.min(rect.bottom + 4, Math.max(margin, window.innerHeight - 268))}px`;
  }

  function openDatePicker(input) {
    if (!input) return;
    const picker = getDatePicker();
    picker.input = input;
    picker.selectedDate = parseBrDate(input.value) || parseBrDate(input.dataset.ntLastValidDate) || new Date();
    picker.monthDate = new Date(picker.selectedDate.getFullYear(), picker.selectedDate.getMonth(), 1);
    renderDatePickerGrid();
    picker.root.classList.remove("hidden");
    picker.root.style.visibility = "hidden";
    picker.visible = true;
    positionDatePicker(input);
    picker.root.style.visibility = "visible";
  }

  function handleDatePickerNavigation(step) {
    const picker = datePickerState;
    if (!picker?.input) return;
    picker.monthDate = new Date(picker.monthDate.getFullYear(), picker.monthDate.getMonth() + step, 1);
    renderDatePickerGrid();
    positionDatePicker(picker.input);
  }

  function setDateFromPicker(value) {
    const picker = datePickerState;
    if (!picker?.input || !value) return;
    const isoParts = String(value).split("-");
    if (isoParts.length !== 3) return;
    const year = Number(isoParts[0]);
    const month = Number(isoParts[1]);
    const day = Number(isoParts[2]);
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return;
    syncDateFieldValue(picker.input, date);
    picker.input.dispatchEvent(new Event("input", { bubbles: true }));
    picker.input.dispatchEvent(new Event("change", { bubbles: true }));
    closeDatePicker();
    try {
      picker.input.focus();
    } catch {}
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
      cirurgiaoResponsavel: "",
      unidadeAtendimento: resolveSessionText(["unidade_atendimento_nome", "clinica_nome", "nome_clinica"], "Instituto Brana - Odontologia"),
      observacoes: "",
      inclusao: "",
      alteracao: "",
      idade: "",
      arcadaPredominante: "Copiar do tratamento anterior",
      copiarIntervencoes: false,
      convenio: "particular",
      tipoAtendimento: "Tratamento Odontológico",
      cirurgiaoContratado: "",
      cirurgiaoSolicitante: "",
      cirurgiaoExecutante: "",
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
      .nt-date-field{position:relative}
      .nt-date-field input{padding-right:28px}
      .nt-date-toggle{position:absolute;right:1px;top:1px;width:22px;height:22px;border:0;border-left:1px solid #bac2cc;background:#f4f4f4;color:#111;font:700 11px Tahoma,Arial,sans-serif;cursor:pointer;padding:0;line-height:1}
      .nt-date-toggle:hover{background:#ececec}
      .nt-date-field.with-toggle input{padding-right:28px}
      .nt-date-picker{position:fixed;z-index:6000;width:272px;background:#efefef;border:1px solid #9ea5ae;box-shadow:0 4px 18px rgba(0,0,0,.2);padding:8px;box-sizing:border-box;font:12px Tahoma,Arial,sans-serif;color:#111}
      .nt-date-picker.hidden{display:none}
      .nt-date-picker-head{display:grid;grid-template-columns:24px 1fr 24px;gap:6px;align-items:center;margin-bottom:6px}
      .nt-date-label{font:700 12px Tahoma,Arial,sans-serif;text-align:center;text-transform:capitalize}
      .nt-date-nav{height:24px;border:1px solid #aeb3bb;background:#fafafa;cursor:pointer;font:700 12px Tahoma,Arial,sans-serif;line-height:1;color:#111}
      .nt-date-weekdays,.nt-date-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:2px}
      .nt-date-weekdays span{height:20px;display:flex;align-items:center;justify-content:center;font:12px Tahoma,Arial,sans-serif;color:#444}
      .nt-date-grid{margin-top:2px}
      .nt-date-empty,.nt-date-cell{height:24px}
      .nt-date-cell{border:1px solid #d0d4db;background:#fff;cursor:pointer;font:12px Tahoma,Arial,sans-serif;color:#111;padding:0}
      .nt-date-cell:hover{background:#dfefff}
      .nt-date-cell.today{border-color:#3c7dc9}
      .nt-date-cell.selected{background:#2c7be5;color:#fff;border-color:#1d5fb0}
      .nt-date-actions{display:flex;justify-content:space-between;gap:6px;margin-top:8px}
      .nt-date-action{flex:1;height:24px;border:1px solid #aeb3bb;background:#fafafa;cursor:pointer;font:12px Tahoma,Arial,sans-serif;color:#111}
      .nt-date-action:hover{background:#ececec}
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

  function setDateFieldValue(el, value) {
    if (!el) return;
    const parsed = parseBrDate(value);
    if (parsed) {
      syncDateFieldValue(el, parsed);
      return;
    }
    const formatted = formatDateBr(value);
    el.value = formatted;
    el.dataset.ntLastValidDate = parsed ? formatted : "";
  }

  function bindDateField(input, toggle) {
    if (!input || input.dataset.ntDateFieldBound === "1") return;
    input.dataset.ntDateFieldBound = "1";
    input.addEventListener("input", () => {
      const normalized = normalizeDateInput(input.value);
      if (input.value !== normalized) input.value = normalized;
      const parsed = parseBrDate(input.value);
      if (parsed) input.dataset.ntLastValidDate = formatDateBrFromDate(parsed);
    });
    input.addEventListener("blur", () => {
      commitDateFieldValue(input);
    });
    input.addEventListener("paste", () => {
      setTimeout(() => {
        input.value = normalizeDateInput(input.value);
        const parsed = parseBrDate(input.value);
        if (parsed) input.dataset.ntLastValidDate = formatDateBrFromDate(parsed);
      }, 0);
    });
    input.addEventListener("keydown", (ev) => {
      if (ev.key === "ArrowDown" && ev.altKey) {
        ev.preventDefault();
        openDatePicker(input);
      }
      if (ev.key === "F4") {
        ev.preventDefault();
        openDatePicker(input);
      }
    });
    if (toggle) {
      toggle.addEventListener("click", (ev) => {
        ev.preventDefault();
        openDatePicker(input);
      });
    }
  }

  function bindSituacaoField(select, finalizacaoInput) {
    if (!select || select.dataset.ntSituacaoBound === "1") return;
    select.dataset.ntSituacaoBound = "1";
    select.addEventListener("change", () => {
      const value = toText(select.value).toLowerCase();
      if (value === "finalizado" && finalizacaoInput) {
        setDateFieldValue(finalizacaoInput, todayBR());
      }
    });
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

  function getSelectedOptionLabel(select) {
    if (!select) return "";
    const opt = select.options?.[select.selectedIndex];
    return toText(opt?.textContent || opt?.label || opt?.value || "");
  }

  function getSelectedOptionValue(select) {
    if (!select) return "";
    return toText(select.value);
  }

  function applyAuditFieldsFromTratamento(tratamento) {
    const cfg = getElements();
    if (!cfg || !tratamento || typeof tratamento !== "object") return;
    setFieldValue(cfg.inclusao, tratamento.inclusao ?? "");
    setFieldValue(cfg.alteracao, tratamento.alteracao ?? "");
  }

  function setSavingState(isSaving) {
    saveInProgress = !!isSaving;
    const cfg = getElements();
    if (!cfg?.backdrop) return;
    const okBtn = cfg.backdrop.querySelector('[data-nt-action="ok"]');
    if (okBtn) {
      okBtn.disabled = saveInProgress;
      okBtn.textContent = saveInProgress ? "Gravando..." : "Ok";
    }
  }

  function buildSavePayload() {
    const cfg = getElements();
    if (!cfg) return null;
    const pacienteId = Number(currentPacienteId || 0) || 0;
    if (pacienteId <= 0) return null;

    const dataInicio = commitDateFieldValue(cfg.inicio);
    const dataFinalizacao = commitDateFieldValue(cfg.finalizacao);
    const dataAutorizacao = commitDateFieldValue(cfg.convAutorizacao);
    const validadeSenha = commitDateFieldValue(cfg.convValidade);
    const situacao = toText(getSelectedOptionValue(cfg.situacao) || cfg.situacao?.value || "");
    const tabelaCodigo = getSelectedOptionValue(cfg.tabela);
    const indice = getSelectedOptionValue(cfg.indice);
    const cirurgiaoResponsavelId = getSelectedOptionValue(cfg.cirurgiao);
    const unidadeAtendimento = getSelectedOptionLabel(cfg.unidade);
    const arcadaPredominante = getSelectedOptionValue(cfg.arcada) || getSelectedOptionLabel(cfg.arcada);
    const convenioValue = getSelectedOptionValue(cfg.convConvenio);
    const convenioNome = getSelectedOptionLabel(cfg.convConvenio);
    const tipoAtendimento = getSelectedOptionValue(cfg.convTipo);
    const cirurgiaoContratadoId = getSelectedOptionValue(cfg.convContratado);
    const cirurgiaoSolicitanteId = getSelectedOptionValue(cfg.convSolicitante);
    const cirurgiaoExecutanteId = getSelectedOptionValue(cfg.convExecutante);
    const sinais = getSelectedOptionValue(cfg.convSinais);
    const tecidos = getSelectedOptionValue(cfg.convTecidos);

    return {
      paciente_id: pacienteId,
      data_inicio: dataInicio,
      data_finalizacao: dataFinalizacao,
      situacao: situacao || "Aberto",
      tabela_codigo: tabelaCodigo || null,
      indice: indice || null,
      cirurgiao_responsavel_id: cirurgiaoResponsavelId || null,
      unidade_atendimento: unidadeAtendimento,
      observacoes: toText(cfg.observacoes.value),
      arcada_predominante: arcadaPredominante,
      copiar_de: "",
      copiar_intervencoes: !!cfg.copiar.checked,
      convenio_nome: convenioNome,
      id_convenio: convenioValue && /^\d+$/.test(convenioValue) ? Number(convenioValue) : null,
      tipo_atendimento_tiss_id: tipoAtendimento || null,
      cirurgiao_contratado_id: cirurgiaoContratadoId || null,
      cirurgiao_solicitante_id: cirurgiaoSolicitanteId || null,
      cirurgiao_executante_id: cirurgiaoExecutanteId || null,
      sinais_doenca_periodontal: sinais || null,
      alteracao_tecidos: tecidos || null,
      numero_guia: toText(cfg.convGuia.value),
      data_autorizacao: dataAutorizacao,
      senha_autorizacao: toText(cfg.convSenha.value),
      validade_senha: validadeSenha,
      extra: {},
    };
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

  async function loadGeneralPreferences() {
    const token = readAuthToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await fetch("/preferences/general", {
      method: "GET",
      headers,
    });
    let data = null;
    try {
      data = await res.json();
    } catch {}
    if (!res.ok) {
      throw new Error(toText(data?.detail, "Falha ao carregar preferencias gerais."));
    }
    return data || null;
  }

  function applyPayload(rawPayload) {
    const cfg = getElements();
    if (!cfg) return;
    const payload = rawPayload && typeof rawPayload === "object" ? rawPayload : {};
    const defaults = payload.defaults && typeof payload.defaults === "object" ? payload.defaults : {};
    const fallback = resolveDefaults();
    const generalPrefs = payload.general_preferences && typeof payload.general_preferences === "object" ? payload.general_preferences : {};
    const generalValues = generalPrefs.values && typeof generalPrefs.values === "object" ? generalPrefs.values : {};
    const generalTabelas = Array.isArray(generalPrefs.options?.tabelas_intervencoes) ? generalPrefs.options.tabelas_intervencoes : [];
    const tabelaPreferidaId = coercePositiveInt(generalValues.tabela_padrao_id);
    const tabelaPreferidaCodigo = (() => {
      if (!tabelaPreferidaId) return null;
      const match = generalTabelas.find((item) => Number(item?.id || 0) === tabelaPreferidaId);
      return coercePositiveInt(match?.codigo);
    })();
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
          { id: "UHO", sigla: "UHO", nome: "Unid. Honorario" },
          { id: "UPO", sigla: "UPO", nome: "Unid. Procedimento Odontologico" },
          { id: "USO", sigla: "USO", nome: "Unid. Servico" },
        ];
    const cirurgioes = Array.isArray(payload.cirurgioes) && payload.cirurgioes.length
      ? payload.cirurgioes
      : fallback.cirurgiaoResponsavel
        ? [
            { id: fallback.cirurgiaoResponsavel, nome: fallback.cirurgiaoResponsavel },
          ]
        : [];
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

    setDateFieldValue(cfg.inicio, defaults.data_inicio ?? fallback.inicio);
    setDateFieldValue(cfg.finalizacao, defaults.data_finalizacao ?? fallback.finalizacao);
    setFieldValue(cfg.observacoes, defaults.observacoes ?? fallback.observacoes);
    setFieldValue(cfg.inclusao, defaults.inclusao ?? fallback.inclusao);
    setFieldValue(cfg.alteracao, defaults.alteracao ?? fallback.alteracao);
    setFieldValue(cfg.idade, defaults.idade_texto ?? defaults.idade ?? fallback.idade);
    cfg.copiar.checked = !!(defaults.copiar_intervencoes ?? fallback.copiarIntervencoes);
    setFieldValue(cfg.convGuia, defaults.numero_guia ?? fallback.numeroGuia);
    setDateFieldValue(cfg.convAutorizacao, defaults.data_autorizacao ?? fallback.dataAutorizacao);
    setFieldValue(cfg.convSenha, defaults.senha_autorizacao ?? fallback.senhaAutorizacao);
    setDateFieldValue(cfg.convValidade, defaults.validade_senha ?? fallback.validadeSenha);

    setSelectOptions(cfg.situacao, payload.situacoes || ["Aberto", "Finalizado", "Interrompido"], defaults.situacao ?? fallback.situacao);
    setSelectOptions(
      cfg.tabela,
      tabelas,
      tabelaPreferidaCodigo ?? defaults.tabela_codigo ?? fallback.tabelaPrincipal,
      (value, item) => item.label || item.value,
    );
    setSelectOptions(cfg.indice, indices, defaults.indice ?? fallback.indice, (value, item) => {
      const rawSigla = toText(value?.sigla ?? value?.label ?? value?.nome ?? "");
      return rawSigla || item.label || item.value;
    });
    setSelectOptions(
      cfg.cirurgiao,
      cirurgioes,
      defaults.cirurgiao_responsavel_id ?? fallback.cirurgiaoResponsavel,
      (value, item) => toText(value?.apelido ?? value?.nome ?? value?.label ?? item.label ?? item.value),
    );
    setSelectOptions(cfg.unidade, unidades, defaults.unidade_atendimento ?? fallback.unidadeAtendimento, (value, item) => item.label || item.value);
    setSelectOptions(cfg.arcada, arcadas, defaults.arcada_predominante ?? fallback.arcadaPredominante, (value, item) => item.label || item.value);

    setSelectOptions(cfg.convConvenio, convenios, defaults.convenio ?? fallback.convenio, (value, item) => item.label || item.value);
    setSelectOptions(cfg.convTipo, tiposTiss, defaults.tipo_atendimento_tiss_id ?? fallback.tipoAtendimento, (value, item) => item.label || item.value);
    setSelectOptions(
      cfg.convContratado,
      cirurgioes,
      defaults.cirurgiao_contratado_id ?? fallback.cirurgiaoContratado,
      (value, item) => toText(value?.apelido ?? value?.nome ?? value?.label ?? item.label ?? item.value),
    );
    setSelectOptions(
      cfg.convSolicitante,
      cirurgioes,
      defaults.cirurgiao_solicitante_id ?? fallback.cirurgiaoSolicitante,
      (value, item) => toText(value?.apelido ?? value?.nome ?? value?.label ?? item.label ?? item.value),
    );
    setSelectOptions(
      cfg.convExecutante,
      cirurgioes,
      defaults.cirurgiao_executante_id ?? fallback.cirurgiaoExecutante,
      (value, item) => toText(value?.apelido ?? value?.nome ?? value?.label ?? item.label ?? item.value),
    );
    setSelectOptions(cfg.convSinais, sinais, defaults.sinais_doenca_periodontal ?? fallback.sinaisClinicos, (value, item) => item.label || item.value);
    setSelectOptions(cfg.convTecidos, tecidos, defaults.alteracao_tecidos ?? fallback.alteracaoTecidos, (value, item) => item.label || item.value);
    if (payload.tratamento && typeof payload.tratamento === "object") {
      applyAuditFieldsFromTratamento(payload.tratamento);
    }
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
                    <div class="nt-date-field with-toggle">
                      <input id="nt-inicio" class="nt-focus-ring" type="text" inputmode="numeric" maxlength="10" placeholder="DD/MM/AAAA" autocomplete="off">
                      <button id="nt-inicio-toggle" class="nt-date-toggle nt-focus-ring" type="button" aria-label="Abrir calendário">v</button>
                    </div>
                  </div>
                <div class="nt-field">
                  <label for="nt-finalizacao">Finalização:</label>
                  <div class="nt-date-field with-toggle">
                    <input id="nt-finalizacao" class="nt-focus-ring" type="text" inputmode="numeric" maxlength="10" placeholder="DD/MM/AAAA" autocomplete="off">
                    <button id="nt-finalizacao-toggle" class="nt-date-toggle nt-focus-ring" type="button" aria-label="Abrir calendário">v</button>
                  </div>
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
                    <div class="nt-date-field with-toggle">
                      <input id="nt-conv-autorizacao" class="nt-focus-ring" type="text" inputmode="numeric" maxlength="10" placeholder="DD/MM/AAAA" autocomplete="off">
                      <button id="nt-conv-autorizacao-toggle" class="nt-date-toggle nt-focus-ring" type="button" aria-label="Abrir calendário">v</button>
                    </div>
                  </div>
                </div>
                <div class="nt-conv-two">
                  <div class="nt-field">
                    <label for="nt-conv-senha">Senha de autorização:</label>
                    <input id="nt-conv-senha" class="nt-focus-ring" type="text">
                  </div>
                  <div class="nt-field">
                    <label for="nt-conv-validade">Validade da senha:</label>
                    <div class="nt-date-field with-toggle">
                      <input id="nt-conv-validade" class="nt-focus-ring" type="text" inputmode="numeric" maxlength="10" placeholder="DD/MM/AAAA" autocomplete="off">
                      <button id="nt-conv-validade-toggle" class="nt-date-toggle nt-focus-ring" type="button" aria-label="Abrir calendário">v</button>
                    </div>
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
      inicioToggle: document.getElementById("nt-inicio-toggle"),
      finalizacao: document.getElementById("nt-finalizacao"),
      finalizacaoToggle: document.getElementById("nt-finalizacao-toggle"),
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
      convAutorizacaoToggle: document.getElementById("nt-conv-autorizacao-toggle"),
      convSenha: document.getElementById("nt-conv-senha"),
      convValidade: document.getElementById("nt-conv-validade"),
      convValidadeToggle: document.getElementById("nt-conv-validade-toggle"),
    };
    if (elements.backdrop) {
      elements.tabs = Array.from(elements.backdrop.querySelectorAll("[data-nt-tab]"));
      elements.panes = Array.from(elements.backdrop.querySelectorAll("[data-nt-pane]"));
    }
    bindDateField(elements?.inicio, elements?.inicioToggle);
    bindDateField(elements?.finalizacao, elements?.finalizacaoToggle);
    bindDateField(elements?.convAutorizacao, elements?.convAutorizacaoToggle);
    bindDateField(elements?.convValidade, elements?.convValidadeToggle);
    bindSituacaoField(elements?.situacao, elements?.finalizacao);
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
    closeDatePicker();
    cfg.backdrop.classList.add("hidden");
    cfg.backdrop.setAttribute("aria-hidden", "true");
    visible = false;
    loadSeq += 1;
    currentPacienteId = 0;
  }

  async function handleSave() {
    const cfg = getElements();
    if (!cfg) return;
    if (saveInProgress) return;
    const payload = buildSavePayload();
    if (!payload) {
      alert("Selecione um paciente para gravar o tratamento.");
      return;
    }
    setSavingState(true);
    let saved = false;
    try {
      const token = readAuthToken();
      const isUpdate = currentTratamentoId > 0;
      const url = isUpdate ? `/tratamentos/${encodeURIComponent(String(currentTratamentoId))}` : "/tratamentos/novo";
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      const res = await fetch(url, {
        method: isUpdate ? "PUT" : "POST",
        headers,
        body: JSON.stringify(payload),
      });
      let data = null;
      try {
        data = await res.json();
      } catch {}
      if (!res.ok) {
        throw new Error(toText(data?.detail, "Falha ao gravar o tratamento."));
      }
      const tratamento = data?.tratamento && typeof data.tratamento === "object" ? data.tratamento : null;
      currentTratamentoId = Number(tratamento?.id || 0) || 0;
      applyAuditFieldsFromTratamento(tratamento);
      setSavingState(false);
      saved = true;
      return;
    } catch (err) {
      console.warn(`[${MODULE_NAME}]`, err);
      alert(toText(err?.message, "Falha ao gravar o tratamento."));
    } finally {
      if (!saved) {
        setSavingState(false);
      }
    }
  }

  async function loadAndApplyContext(context = {}) {
    const cfg = getElements();
    if (!cfg) return;
    const seq = ++loadSeq;
    const pacienteId = resolvePacienteId(context);
    currentPacienteId = pacienteId;
    if (pacienteId <= 0) {
      applyPayload(null);
      return;
    }
    try {
      const [payload, generalPreferences] = await Promise.allSettled([
        loadPayloadForPaciente(pacienteId),
        loadGeneralPreferences(),
      ]);
      if (seq !== loadSeq) return;
      const merged = payload.status === "fulfilled" ? (payload.value || {}) : {};
      if (generalPreferences.status === "fulfilled" && generalPreferences.value) {
        merged.general_preferences = generalPreferences.value;
      }
      applyPayload(merged);
    } catch (err) {
      console.warn(`[${MODULE_NAME}]`, err);
      if (seq !== loadSeq) return;
      applyPayload(null);
    }
  }

  function open(context = {}) {
    const cfg = ensureMounted();
    if (!cfg?.backdrop) return;
    currentTratamentoId = 0;
    setSavingState(false);
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
        closeDatePicker();
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
        if (action === "ok") {
          ev.preventDefault();
          void handleSave();
          return;
        }
        closeDatePicker();
        close();
      }
    });

    document.addEventListener("keydown", (ev) => {
      if (!visible) return;
      if (ev.key === "Escape") {
        ev.preventDefault();
        closeDatePicker();
        close();
        return;
      }
      if (datePickerState?.visible && ev.key === "PageUp") {
        ev.preventDefault();
        handleDatePickerNavigation(-1);
      }
      if (datePickerState?.visible && ev.key === "PageDown") {
        ev.preventDefault();
        handleDatePickerNavigation(1);
      }
      if (datePickerState?.visible && (ev.key === "ArrowLeft" || ev.key === "ArrowRight")) {
        ev.preventDefault();
        const step = ev.key === "ArrowLeft" ? -1 : 1;
        const next = new Date(datePickerState.selectedDate || new Date());
        next.setDate(next.getDate() + step);
        datePickerState.selectedDate = next;
        datePickerState.monthDate = new Date(next.getFullYear(), next.getMonth(), 1);
        renderDatePickerGrid();
        positionDatePicker(datePickerState.input);
      }
    });

    document.addEventListener("pointerdown", (ev) => {
      const picker = datePickerState;
      if (!picker?.visible) return;
      const target = ev.target;
      if (picker.root.contains(target) || picker.input?.contains(target) || target === cfg.inicioToggle) return;
      closeDatePicker();
    });

    document.addEventListener("click", (ev) => {
      const picker = datePickerState;
      if (!picker?.visible) return;
      const target = ev.target;
      const dayBtn = target.closest?.("[data-nt-date-value]");
      if (dayBtn && picker.root.contains(dayBtn)) {
        ev.preventDefault();
        setDateFromPicker(dayBtn.dataset.ntDateValue);
        return;
      }
      const navBtn = target.closest?.("[data-nt-date-nav]");
      if (navBtn && picker.root.contains(navBtn)) {
        ev.preventDefault();
        const step = Number(navBtn.dataset.ntDateNav || 0);
        handleDatePickerNavigation(step);
        return;
      }
      if (target.closest?.("[data-nt-date-today]")) {
        ev.preventDefault();
        const now = new Date();
        setDateFromPicker(`${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`);
        return;
      }
      if (target.closest?.("[data-nt-date-clear]")) {
        ev.preventDefault();
        if (picker.input) {
          picker.input.value = "";
          picker.input.dataset.ntLastValidDate = "";
          picker.input.dispatchEvent(new Event("input", { bubbles: true }));
          picker.input.dispatchEvent(new Event("change", { bubbles: true }));
          try {
            picker.input.focus();
          } catch {}
        }
        closeDatePicker();
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
