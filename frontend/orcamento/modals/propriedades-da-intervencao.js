(function () {
  "use strict";

  const MODULE_NAME = "BranaOrcamentoPropriedadesIntervencaoModal";
  const VERSION = "20260617-onda3-1";
  const STYLE_ID = "brana-orcamento-propriedades-intervencao-style";
  const BACKDROP_ID = "brana-orcamento-propriedades-intervencao-backdrop";

  let depsPromise = null;
  let modalState = null;

  function esc(value) {
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

  function formatDate(value) {
    const raw = String(value ?? "").trim();
    if (!raw) return "";
    const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (iso) return `${iso[3]}/${iso[2]}/${iso[1]}`;
    return raw;
  }

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      #${BACKDROP_ID}{position:fixed;inset:0;z-index:9100;background:rgba(0,0,0,.25);display:flex;align-items:flex-start;justify-content:center;padding:18px;box-sizing:border-box}
      #${BACKDROP_ID}.hidden{display:none}
      .orcamento-prop-modal{width:min(820px,calc(100vw - 24px));background:#efefef;border:1px solid #a9a9a9;box-shadow:0 8px 30px rgba(0,0,0,.24);display:flex;flex-direction:column;font:12px Tahoma,Arial,sans-serif;color:#111}
      .orcamento-prop-head{padding:8px 10px 6px;font:bold 14px Tahoma,Arial,sans-serif}
      .orcamento-prop-tabs{display:flex;gap:4px;padding:0 10px}
      .orcamento-prop-tab{border:1px solid #bcbcbc;border-bottom:none;background:#efefef;padding:4px 10px 5px;font:12px Tahoma,Arial,sans-serif}
      .orcamento-prop-tab.active{background:#fff;font-weight:700;position:relative;top:1px}
      .orcamento-prop-body{border-top:1px solid #bcbcbc;margin:0 10px 10px;background:#fff;padding:12px;min-height:294px}
      .orcamento-prop-pane.hidden{display:none !important}
      .orcamento-prop-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(250px,.92fr);gap:12px;align-items:start}
      .orcamento-prop-fields{display:grid;gap:8px}
      .orcamento-prop-line{display:grid;grid-template-columns:180px minmax(0,1fr);gap:8px;align-items:center}
      .orcamento-prop-line label{white-space:nowrap;color:#444}
      .orcamento-prop-input,.orcamento-prop-select,.orcamento-prop-textarea{border:1px solid #b7c1cc;background:#fff;box-sizing:border-box;font:12px Tahoma,Arial,sans-serif;min-height:24px;padding:4px 6px}
      .orcamento-prop-input,.orcamento-prop-select{height:24px}
      .orcamento-prop-textarea{min-height:92px;resize:vertical}
      .orcamento-prop-mini-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
      .orcamento-prop-mini-line{display:grid;grid-template-columns:160px minmax(0,1fr);gap:8px;align-items:center}
      .orcamento-prop-mini-line label{white-space:nowrap;color:#444}
      .orcamento-prop-legend{padding:6px 0 0;color:#666;font:11px Tahoma,Arial,sans-serif}
      .orcamento-prop-footer{display:flex;justify-content:flex-end;gap:10px;padding:0 10px 10px}
      .orcamento-prop-btn{min-width:92px;height:28px;border:1px solid #8d8d8d;background:linear-gradient(#fff,#e8e8e8);font:12px Tahoma,Arial,sans-serif;cursor:pointer}
      .orcamento-prop-btn.primary{font-weight:700}
      .orcamento-prop-status{padding:0 10px 10px;color:#b00020;font:12px Tahoma,Arial,sans-serif;min-height:16px}
      .orcamento-prop-checkline{display:flex;gap:8px;align-items:center;margin:2px 0}
      .orcamento-prop-checkline input{width:16px;height:16px}
      .orcamento-prop-financeiro-grid{display:grid;gap:9px}
      .orcamento-prop-financeiro-line{display:grid;grid-template-columns:230px minmax(0,1fr);gap:8px;align-items:center}
      .orcamento-prop-financeiro-line label{white-space:nowrap;color:#444}
      .orcamento-prop-financeiro-divider{height:1px;background:#d5d5d5;margin:2px 0 4px}
      .orcamento-prop-financeiro-grid2{display:grid;gap:8px}
      @media (max-width: 860px){
        .orcamento-prop-modal{width:min(720px,calc(100vw - 18px))}
        .orcamento-prop-grid,.orcamento-prop-mini-grid,.orcamento-prop-financeiro-line,.orcamento-prop-line{grid-template-columns:1fr}
      }
    `;
    document.head.appendChild(style);
  }

  async function ensureFinanceModule() {
    if (window.BranaOrcamentoPropriedadesIntervencaoFinanceiroV1) {
      return window.BranaOrcamentoPropriedadesIntervencaoFinanceiroV1;
    }
    if (!depsPromise) {
      depsPromise = import(`/frontend/orcamento/modals/propriedades-da-intervencao-financeiro.js?v=${VERSION}`).catch((err) => {
        depsPromise = null;
        throw err;
      });
    }
    await depsPromise;
    return window.BranaOrcamentoPropriedadesIntervencaoFinanceiroV1 || null;
  }

  function buildStatusOptions(snapshot, currentValue) {
    const lookup = Array.isArray(snapshot?.treatmentData?.status_lookup) ? snapshot.treatmentData.status_lookup : [];
    const current = String(currentValue || "").trim();
    const values = [];
    const add = (value, label) => {
      const key = String(value || "").trim();
      if (!key) return;
      if (values.some((item) => item.value === key)) return;
      values.push({ value: key, label: String(label || key).trim() || key });
    };
    if (current) add(current, current);
    lookup.forEach((item) => add(item.descricao || item.codigo, item.descricao || item.codigo));
    if (!values.length) add("Realizada", "Realizada");
    return values;
  }

  function buildTabelaOptions(intervention = {}) {
    const code = num(intervention?.tabela_codigo || 1, 1);
    return [
      { value: String(code), label: code === 1 ? "PARTICULAR" : `Tabela ${code}` },
    ];
  }

  function getBackdrop() {
    return document.getElementById(BACKDROP_ID);
  }

  function getRoot() {
    return getBackdrop()?.querySelector?.(".orcamento-prop-modal") || null;
  }

  function close() {
    const backdrop = getBackdrop();
    if (!backdrop) return false;
    backdrop.classList.add("hidden");
    modalState = null;
    return true;
  }

  function fillModal(snapshot, intervention = {}) {
    const root = getRoot();
    if (!root) return;
    const finance = window.BranaOrcamentoPropriedadesIntervencaoFinanceiroV1;
    const statusOptions = buildStatusOptions(snapshot, intervention.status);
    const tabelaOptions = buildTabelaOptions(intervention);
    const treatment = snapshot?.treatmentData?.tratamento || {};
    const cirurgiaoNome = String(intervention.cirurgiao || treatment.cirurgiao_responsavel_nome || "").trim();
    const cirurgiaoId = num(intervention.cirurgiao_id || treatment.cirurgiao_responsavel_id || 0, 0);
    const intervencaoNome = String(intervention.intervencao || "").trim();
    const observacoes = String(intervention.observacoes || "").trim();
    const regiao = String(intervention.regiao || "").trim();
    const situacao = String(intervention.status || statusOptions[0]?.value || "").trim();
    const marcacao = formatDate(intervention.marcacao || "");
    const finalizacao = formatDate(intervention.finalizacao || "");
    const tabelaCodigo = String(num(intervention.tabela_codigo || treatment.tabela_codigo || 1, 1));
    const inclusoTexto = String(intervention.inclusao_texto || treatment.criado_em || "").trim();
    const alteracaoTexto = String(intervention.alteracao_texto || treatment.atualizado_em || "").trim();

    const financeiroPane = root.querySelector("[data-orcamento-financeiro-pane]");
    if (financeiroPane && finance) {
      financeiroPane.innerHTML = finance.renderFinancePane({ intervention, snapshot });
      finance.setCheckboxSync(financeiroPane);
    }

    const selectTabela = root.querySelector('[name="tabela_codigo"]');
    if (selectTabela) {
      selectTabela.innerHTML = tabelaOptions
        .map((item) => `<option value="${esc(item.value)}"${item.value === tabelaCodigo ? " selected" : ""}>${esc(item.label)}</option>`)
        .join("");
    }
    const selectSituacao = root.querySelector('[name="situacao"]');
    if (selectSituacao) {
      selectSituacao.innerHTML = statusOptions
        .map((item) => `<option value="${esc(item.value)}"${String(item.value) === situacao ? " selected" : ""}>${esc(item.label)}</option>`)
        .join("");
    }
    const cirurgiaoInput = root.querySelector('[name="cirurgiao_nome"]');
    if (cirurgiaoInput) cirurgiaoInput.value = cirurgiaoNome;
    const cirurgiaoIdInput = root.querySelector('[name="cirurgiao_id"]');
    if (cirurgiaoIdInput) cirurgiaoIdInput.value = cirurgiaoId ? String(cirurgiaoId) : "";
    const intervencaoInput = root.querySelector('[name="intervencao_nome"]');
    if (intervencaoInput) intervencaoInput.value = intervencaoNome;
    const regiaoInput = root.querySelector('[name="regiao"]');
    if (regiaoInput) regiaoInput.value = regiao;
    const statusInput = root.querySelector('[name="situacao"]');
    if (statusInput) statusInput.value = situacao;
    const marcacaoInput = root.querySelector('[name="marcacao"]');
    if (marcacaoInput) marcacaoInput.value = marcacao;
    const finalizacaoInput = root.querySelector('[name="finalizacao"]');
    if (finalizacaoInput) finalizacaoInput.value = finalizacao;
    const obsInput = root.querySelector('[name="observacoes"]');
    if (obsInput) obsInput.value = observacoes;
    const inclusaoInput = root.querySelector('[name="inclusao_texto"]');
    if (inclusaoInput) inclusaoInput.value = inclusoTexto;
    const alteracaoInput = root.querySelector('[name="alteracao_texto"]');
    if (alteracaoInput) alteracaoInput.value = alteracaoTexto;
  }

  function buildHtml(snapshot, intervention = {}) {
    const finance = window.BranaOrcamentoPropriedadesIntervencaoFinanceiroV1;
    const financeHtml = finance ? finance.renderFinancePane({ intervention, snapshot }) : "";
    return `
      <div id="${BACKDROP_ID}" class="hidden">
        <div class="orcamento-prop-modal" role="dialog" aria-modal="true" aria-label="Propriedades da intervenção">
          <div class="orcamento-prop-head">Propriedades da intervenção</div>
          <div class="orcamento-prop-tabs">
            <button type="button" class="orcamento-prop-tab active" data-orcamento-prop-tab="principal">Principal</button>
            <button type="button" class="orcamento-prop-tab" data-orcamento-prop-tab="financeiro">Financeiro</button>
          </div>
          <div class="orcamento-prop-body">
            <div class="orcamento-prop-pane" data-orcamento-prop-pane="principal">
              <div class="orcamento-prop-grid">
                <div class="orcamento-prop-fields">
                  <div class="orcamento-prop-line">
                    <label for="orcamento-prop-tabela">Tabela de preços:</label>
                    <select id="orcamento-prop-tabela" name="tabela_codigo" class="orcamento-prop-select"></select>
                  </div>
                  <div class="orcamento-prop-line">
                    <label for="orcamento-prop-cirurgiao">Cirurgião:</label>
                    <div style="display:grid;grid-template-columns:minmax(0,1fr) 0;gap:0">
                      <input id="orcamento-prop-cirurgiao" name="cirurgiao_nome" class="orcamento-prop-input" type="text" readonly>
                      <input type="hidden" name="cirurgiao_id">
                    </div>
                  </div>
                  <div class="orcamento-prop-line">
                    <label for="orcamento-prop-intervencao">Intervenção:</label>
                    <input id="orcamento-prop-intervencao" name="intervencao_nome" class="orcamento-prop-input" type="text" readonly>
                  </div>
                  <div class="orcamento-prop-mini-grid">
                    <div class="orcamento-prop-line" style="grid-template-columns:88px minmax(0,1fr)">
                      <label for="orcamento-prop-regiao">Região:</label>
                      <input id="orcamento-prop-regiao" name="regiao" class="orcamento-prop-input" type="text">
                    </div>
                    <div class="orcamento-prop-line" style="grid-template-columns:88px minmax(0,1fr)">
                      <label for="orcamento-prop-situacao">Situação:</label>
                      <select id="orcamento-prop-situacao" name="situacao" class="orcamento-prop-select"></select>
                    </div>
                    <div class="orcamento-prop-line" style="grid-template-columns:88px minmax(0,1fr)">
                      <label for="orcamento-prop-marcacao">Marcação:</label>
                      <input id="orcamento-prop-marcacao" name="marcacao" class="orcamento-prop-input" type="text" placeholder="dd/mm/aaaa">
                    </div>
                    <div class="orcamento-prop-line" style="grid-template-columns:88px minmax(0,1fr)">
                      <label for="orcamento-prop-finalizacao">Finalização:</label>
                      <input id="orcamento-prop-finalizacao" name="finalizacao" class="orcamento-prop-input" type="text" placeholder="dd/mm/aaaa">
                    </div>
                  </div>
                  <div class="orcamento-prop-line" style="grid-template-columns:88px minmax(0,1fr);align-items:start">
                    <label for="orcamento-prop-observacoes" style="padding-top:6px">Observações:</label>
                    <textarea id="orcamento-prop-observacoes" name="observacoes" class="orcamento-prop-textarea"></textarea>
                  </div>
                </div>
                <div class="orcamento-prop-fields">
                  <div class="orcamento-prop-line">
                    <label for="orcamento-prop-inclusao">Inclusão:</label>
                    <input id="orcamento-prop-inclusao" name="inclusao_texto" class="orcamento-prop-input" type="text" readonly>
                  </div>
                  <div class="orcamento-prop-line">
                    <label for="orcamento-prop-alteracao">Alteração:</label>
                    <input id="orcamento-prop-alteracao" name="alteracao_texto" class="orcamento-prop-input" type="text" readonly>
                  </div>
                  <div class="orcamento-prop-legend">Os campos de inclusão e alteração refletem o histórico do tratamento no estado atual disponível no Orçamento.</div>
                </div>
              </div>
            </div>
            <div class="orcamento-prop-pane hidden" data-orcamento-prop-pane="financeiro">
              <div data-orcamento-financeiro-pane>${financeHtml}</div>
            </div>
          </div>
          <div class="orcamento-prop-status" data-orcamento-prop-status></div>
          <div class="orcamento-prop-footer">
            <button type="button" class="orcamento-prop-btn primary" data-orcamento-prop-action="save-this">Grava esta</button>
            <button type="button" class="orcamento-prop-btn" data-orcamento-prop-action="save-all">Grava todas</button>
            <button type="button" class="orcamento-prop-btn" data-orcamento-prop-action="cancel">Cancela</button>
          </div>
        </div>
      </div>
    `;
  }

  function ensureMounted(snapshot, intervention = {}) {
    ensureStyle();
    let backdrop = getBackdrop();
    if (!backdrop) {
      document.body.insertAdjacentHTML("beforeend", buildHtml(snapshot, intervention));
      backdrop = getBackdrop();
    }
    if (!backdrop) return null;
    if (backdrop.dataset.orcamentoBound === "1") return backdrop;
    backdrop.dataset.orcamentoBound = "1";
    backdrop.addEventListener("click", (ev) => {
      if (ev.target === backdrop) close();
    });
    const root = getRoot();
    root?.querySelectorAll?.("[data-orcamento-prop-tab]")?.forEach((btn) => {
      btn.addEventListener("click", () => {
        const tab = String(btn.dataset.orcamentoPropTab || "principal");
        root.querySelectorAll("[data-orcamento-prop-pane]").forEach((pane) => {
          pane.classList.toggle("hidden", String(pane.dataset.orcamentoPropPane || "") !== tab);
        });
        root.querySelectorAll("[data-orcamento-prop-tab]").forEach((item) => {
          item.classList.toggle("active", item === btn);
        });
      });
    });
    root?.querySelector?.('[name="nao_incluir_no_orcamento"]')?.addEventListener("change", () => {
      const financePane = root.querySelector("[data-orcamento-financeiro-pane]");
      const finance = window.BranaOrcamentoPropriedadesIntervencaoFinanceiroV1;
      if (financePane && finance) finance.setCheckboxSync(financePane);
    });
    root?.querySelectorAll?.("[data-orcamento-prop-action]")?.forEach((btn) => {
      btn.addEventListener("click", async () => {
        const action = String(btn.dataset.orcamentoPropAction || "");
        if (action === "cancel") {
          close();
          modalState?.context?.onClose?.();
          return;
        }
        await save(action);
      });
    });
    backdrop.classList.remove("hidden");
    return backdrop;
  }

  function collectPayload(root) {
    const finance = window.BranaOrcamentoPropriedadesIntervencaoFinanceiroV1;
    const read = (name) => root?.querySelector?.(`[name="${name}"]`);
    const payload = {
      tabela_codigo: num(read("tabela_codigo")?.value || 0, 0) || null,
      cirurgiao_id: num(read("cirurgiao_id")?.value || 0, 0) || null,
      situacao: String(read("situacao")?.value || "").trim() || null,
      marcacao: String(read("marcacao")?.value || "").trim() || null,
      finalizacao: String(read("finalizacao")?.value || "").trim() || null,
      observacoes: String(read("observacoes")?.value || "").trim() || null,
    };
    const financePayload = finance?.readFinancePayload(root.querySelector("[data-orcamento-financeiro-pane]") || root) || {};
    return {
      ...payload,
      receber_paciente: Number.isFinite(Number(financePayload.receber_paciente)) ? Number(financePayload.receber_paciente) : 0,
      receber_convenio: Number.isFinite(Number(financePayload.receber_convenio)) ? Number(financePayload.receber_convenio) : 0,
      nao_incluir_no_orcamento: !!financePayload.nao_incluir_no_orcamento,
      codigo_glosa: String(financePayload.codigo_glosa || "").trim() || null,
      mensagem_autorizacao: String(financePayload.mensagem_autorizacao || "").trim() || null,
      previsao_recebimento: String(financePayload.previsao_recebimento || "").trim() || null,
    };
  }

  async function save(scope = "esta") {
    const root = getRoot();
    if (!root || modalState?.saving) return;
    const footer = root.querySelector("[data-orcamento-prop-status]");
    const api = modalState?.context?.api || window.BranaOrcamentoApiV1 || null;
    if (!api?.alterarIntervencao) {
      if (footer) footer.textContent = "API de orçamento indisponível.";
      return;
    }
    const treatmentId = num(modalState?.context?.treatmentId || modalState?.context?.snapshot?.selectedTreatmentId || 0, 0);
    const interventionId = num(modalState?.context?.intervention?.id || 0, 0);
    if (treatmentId <= 0 || interventionId <= 0) {
      if (footer) footer.textContent = "Selecione uma intervenção válida.";
      return;
    }
    modalState = { ...modalState, saving: true };
    if (footer) footer.textContent = scope === "all" ? "Gravando todas as alterações do tratamento..." : "Gravando intervenção...";
    try {
      const payload = collectPayload(root);
      const result = await api.alterarIntervencao(treatmentId, interventionId, payload);
      if (!result?.ok) {
        if (footer) footer.textContent = result?.message || "Falha ao gravar intervenção.";
        return;
      }
      await modalState?.context?.onSaved?.({ scope, result });
      close();
    } catch (err) {
      if (footer) footer.textContent = err?.message || "Falha ao gravar intervenção.";
    } finally {
      modalState = modalState ? { ...modalState, saving: false } : null;
    }
  }

  async function open(context = {}) {
    const finance = await ensureFinanceModule();
    const normalizedContext = {
      ...context,
      treatmentId: num(context?.treatmentId || context?.snapshot?.selectedTreatmentId || 0, 0),
      intervention: context?.intervention || null,
      snapshot: context?.snapshot || null,
      api: context?.api || window.BranaOrcamentoApiV1 || null,
      onSaved: typeof context?.onSaved === "function" ? context.onSaved : null,
      onClose: typeof context?.onClose === "function" ? context.onClose : null,
    };
    modalState = { context: normalizedContext, saving: false };
    ensureMounted(normalizedContext.snapshot || {}, normalizedContext.intervention || {});
    fillModal(normalizedContext.snapshot || {}, normalizedContext.intervention || {});
    const backdrop = getBackdrop();
    if (backdrop) {
      backdrop.classList.remove("hidden");
      const firstField = getRoot()?.querySelector?.('[name="regiao"]');
      firstField?.focus?.();
    }
    return { opened: !!backdrop, financeLoaded: !!finance };
  }

  window.BranaOrcamentoPropriedadesIntervencaoModal = Object.freeze({
    moduleName: MODULE_NAME,
    open,
    close,
    ensureStyle,
    buildHtml,
    fillModal,
    collectPayload,
  });
})();
