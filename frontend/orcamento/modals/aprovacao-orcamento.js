(function () {
  "use strict";

  const MODULE_NAME = "BranaOrcamentoAprovacaoOrcamentoModal";
  const VERSION = "20260617-onda3-1";
  const STYLE_ID = "brana-orcamento-aprovacao-style";
  const BACKDROP_ID = "brana-orcamento-aprovacao-backdrop";

  let modalState = null;

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      #${BACKDROP_ID}{position:fixed;inset:0;z-index:9103;background:rgba(0,0,0,.24);display:flex;align-items:flex-start;justify-content:center;padding:18px;box-sizing:border-box}
      #${BACKDROP_ID}.hidden{display:none}
      .orcamento-approve-modal{width:min(520px,calc(100vw - 24px));background:#efefef;border:1px solid #a9a9a9;box-shadow:0 8px 30px rgba(0,0,0,.24);font:12px Tahoma,Arial,sans-serif;color:#111}
      .orcamento-approve-head{padding:10px 12px 6px;font:bold 14px Tahoma,Arial,sans-serif}
      .orcamento-approve-body{display:grid;grid-template-columns:60px 1fr;gap:12px;padding:10px 12px 8px;align-items:start}
      .orcamento-approve-icon{width:44px;height:44px;border-radius:50%;background:radial-gradient(circle at 30% 30%, #fefefe 0 35%, #77b9ff 36% 100%);border:1px solid #79a4d0;display:grid;place-items:center;font:bold 28px Tahoma,Arial,sans-serif;color:#fff}
      .orcamento-approve-text{font:12px Tahoma,Arial,sans-serif;line-height:1.4;white-space:pre-wrap}
      .orcamento-approve-status{padding:0 12px 8px;color:#b00020;min-height:16px}
      .orcamento-approve-footer{display:flex;justify-content:flex-end;gap:10px;padding:0 12px 12px}
      .orcamento-approve-btn{min-width:78px;height:28px;border:1px solid #8d8d8d;background:linear-gradient(#fff,#e8e8e8);font:12px Tahoma,Arial,sans-serif;cursor:pointer}
      .orcamento-approve-btn.primary{font-weight:700}
      .orcamento-approve-btn.help{min-width:62px}
      .hidden{display:none !important}
    `;
    document.head.appendChild(style);
  }

  function getBackdrop() {
    return document.getElementById(BACKDROP_ID);
  }

  function getRoot() {
    return getBackdrop()?.querySelector?.(".orcamento-approve-modal") || null;
  }

  function close() {
    const backdrop = getBackdrop();
    if (!backdrop) return false;
    backdrop.classList.add("hidden");
    modalState = null;
    return true;
  }

  function buildHtml() {
    return `
      <div id="${BACKDROP_ID}" class="hidden">
        <div class="orcamento-approve-modal" role="dialog" aria-modal="true" aria-label="Orçamento">
          <div class="orcamento-approve-head">Orçamento</div>
          <div class="orcamento-approve-body">
            <div class="orcamento-approve-icon">?</div>
            <div class="orcamento-approve-text" data-orcamento-approve-text></div>
          </div>
          <div class="orcamento-approve-status" data-orcamento-approve-status></div>
          <div class="orcamento-approve-footer">
            <button type="button" class="orcamento-approve-btn help" data-orcamento-approve-action="help">Ajuda...</button>
            <button type="button" class="orcamento-approve-btn primary" data-orcamento-approve-action="yes">Sim</button>
            <button type="button" class="orcamento-approve-btn" data-orcamento-approve-action="no">Não</button>
          </div>
        </div>
      </div>
    `;
  }

  function messageForPhase(phase, context) {
    const name = String(context?.patientName || context?.patient?.nome || "o paciente").trim();
    if (phase === "result") {
      return "Orçamento aprovado.\nDeseja verificar a conta-corrente do paciente ?";
    }
    return `Confirma a aprovação do orçamento de ${name} ?`;
  }

  function render() {
    const root = getRoot();
    if (!root) return;
    const text = root.querySelector("[data-orcamento-approve-text]");
    const footer = root.querySelector("[data-orcamento-approve-status]");
    const phase = modalState?.phase || "confirm";
    if (text) text.textContent = messageForPhase(phase, modalState?.context || {});
    if (footer) footer.textContent = modalState?.statusMessage || "";
    const helpBtn = root.querySelector('[data-orcamento-approve-action="help"]');
    if (helpBtn) helpBtn.classList.toggle("hidden", phase !== "result");
  }

  async function ensureApi() {
    if (window.BranaOrcamentoApiV1) return window.BranaOrcamentoApiV1;
    await import(`/frontend/orcamento/orcamento-api.js?v=${VERSION}`);
    return window.BranaOrcamentoApiV1 || null;
  }

  function ensureMounted() {
    ensureStyle();
    let backdrop = getBackdrop();
    if (!backdrop) {
      document.body.insertAdjacentHTML("beforeend", buildHtml());
      backdrop = getBackdrop();
    }
    if (!backdrop) return null;
    const root = getRoot();
    if (backdrop.dataset.orcamentoBound === "1") return backdrop;
    backdrop.dataset.orcamentoBound = "1";
    backdrop.addEventListener("click", (ev) => {
      if (ev.target === backdrop) close();
    });
    root?.querySelectorAll?.("[data-orcamento-approve-action]")?.forEach((btn) => {
      btn.addEventListener("click", async () => {
        const action = String(btn.dataset.orcamentoApproveAction || "");
        if (action === "no") {
          close();
          modalState?.context?.onCancel?.();
          return;
        }
        if (action === "help") {
          modalState = modalState ? { ...modalState, statusMessage: "Use Sim para abrir a conta-corrente do paciente após a aprovação." } : modalState;
          render();
          return;
        }
        if (modalState?.phase === "confirm") {
          await approve();
          return;
        }
        if (modalState?.phase === "result") {
          const openCC = typeof window.ccAbrir === "function" ? window.ccAbrir : null;
          if (openCC) {
            await openCC();
          } else {
            modalState = modalState ? { ...modalState, statusMessage: "Conta corrente indisponível no momento." } : modalState;
            render();
          }
          close();
        }
      });
    });
    return backdrop;
  }

  async function approve() {
    const root = getRoot();
    const footer = root?.querySelector?.("[data-orcamento-approve-status]");
    const api = modalState?.context?.api || (await ensureApi());
    if (!api?.aprovarTratamento) {
      if (footer) footer.textContent = "API de orçamento indisponível.";
      return;
    }
    const treatmentId = Number(modalState?.context?.treatmentId || modalState?.context?.snapshot?.selectedTreatmentId || 0) || 0;
    if (treatmentId <= 0) {
      if (footer) footer.textContent = "Tratamento inválido.";
      return;
    }
    if (footer) footer.textContent = "Aprovando orçamento...";
    try {
      const result = await api.aprovarTratamento(treatmentId, { gerar_conta_corrente: true });
      if (!result?.ok) {
        if (footer) footer.textContent = result?.message || "Falha ao aprovar orçamento.";
        return;
      }
      await modalState?.context?.onApproved?.(result);
      modalState = modalState ? { ...modalState, phase: "result", statusMessage: "" } : modalState;
      render();
    } catch (err) {
      if (footer) footer.textContent = err?.message || "Falha ao aprovar orçamento.";
    }
  }

  async function open(context = {}) {
    modalState = {
      phase: String(context?.phase || "confirm"),
      context: {
        treatmentId: Number(context?.treatmentId || context?.snapshot?.selectedTreatmentId || 0) || 0,
        snapshot: context?.snapshot || null,
        patient: context?.patient || null,
        patientName: context?.patientName || context?.patient?.nome || "",
        api: context?.api || window.BranaOrcamentoApiV1 || null,
        onApproved: typeof context?.onApproved === "function" ? context.onApproved : null,
        onCancel: typeof context?.onCancel === "function" ? context.onCancel : null,
      },
      statusMessage: "",
    };
    ensureMounted();
    render();
    const backdrop = getBackdrop();
    if (backdrop) {
      backdrop.classList.remove("hidden");
      getRoot()?.querySelector?.('[data-orcamento-approve-action="yes"]')?.focus?.();
    }
    return { opened: !!backdrop };
  }

  window.BranaOrcamentoAprovacaoOrcamentoModal = Object.freeze({
    moduleName: MODULE_NAME,
    open,
    close,
    ensureStyle,
    buildHtml,
  });
})();
