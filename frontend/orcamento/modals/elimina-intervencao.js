(function () {
  "use strict";

  const MODULE_NAME = "BranaOrcamentoEliminaIntervencaoModal";
  const STYLE_ID = "brana-orcamento-elimina-intervencao-style";
  const BACKDROP_ID = "brana-orcamento-elimina-intervencao-backdrop";

  let modalState = null;

  function esc(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      #${BACKDROP_ID}{position:fixed;inset:0;z-index:9101;background:rgba(0,0,0,.24);display:flex;align-items:flex-start;justify-content:center;padding:18px;box-sizing:border-box}
      #${BACKDROP_ID}.hidden{display:none}
      .orcamento-delete-modal{width:min(530px,calc(100vw - 24px));background:#efefef;border:1px solid #a9a9a9;box-shadow:0 8px 30px rgba(0,0,0,.24);font:12px Tahoma,Arial,sans-serif;color:#111}
      .orcamento-delete-head{padding:10px 12px 4px;font:bold 14px Tahoma,Arial,sans-serif}
      .orcamento-delete-body{display:grid;grid-template-columns:64px 1fr;gap:12px;padding:10px 12px 8px;align-items:center}
      .orcamento-delete-icon{width:44px;height:44px;border-radius:50%;background:radial-gradient(circle at 30% 30%, #fefefe 0 35%, #77b9ff 36% 100%);border:1px solid #79a4d0;display:grid;place-items:center;font:bold 28px Tahoma,Arial,sans-serif;color:#fff}
      .orcamento-delete-text{font:12px Tahoma,Arial,sans-serif;line-height:1.35;white-space:pre-wrap}
      .orcamento-delete-footer{display:flex;justify-content:flex-end;gap:10px;padding:8px 12px 12px}
      .orcamento-delete-btn{min-width:78px;height:28px;border:1px solid #8d8d8d;background:linear-gradient(#fff,#e8e8e8);font:12px Tahoma,Arial,sans-serif;cursor:pointer}
      .orcamento-delete-btn.primary{font-weight:700}
      .orcamento-delete-status{padding:0 12px 10px;color:#b00020;min-height:16px}
    `;
    document.head.appendChild(style);
  }

  function getBackdrop() {
    return document.getElementById(BACKDROP_ID);
  }

  function getRoot() {
    return getBackdrop()?.querySelector?.(".orcamento-delete-modal") || null;
  }

  function close() {
    const backdrop = getBackdrop();
    if (!backdrop) return false;
    backdrop.classList.add("hidden");
    modalState = null;
    return true;
  }

  function buildHtml(intervention = {}) {
    const name = String(intervention?.intervencao || intervention?.nome || "esta intervenção").trim();
    return `
      <div id="${BACKDROP_ID}" class="hidden">
        <div class="orcamento-delete-modal" role="dialog" aria-modal="true" aria-label="Elimina intervenção">
          <div class="orcamento-delete-head">Elimina intervenção</div>
          <div class="orcamento-delete-body">
            <div class="orcamento-delete-icon">?</div>
            <div class="orcamento-delete-text">Confirma a eliminação da intervenção ${esc(name)} ?</div>
          </div>
          <div class="orcamento-delete-status" data-orcamento-delete-status></div>
          <div class="orcamento-delete-footer">
            <button type="button" class="orcamento-delete-btn primary" data-orcamento-delete-action="yes">Sim</button>
            <button type="button" class="orcamento-delete-btn" data-orcamento-delete-action="no">Não</button>
          </div>
        </div>
      </div>
    `;
  }

  function ensureMounted(intervention = {}) {
    ensureStyle();
    let backdrop = getBackdrop();
    if (!backdrop) {
      document.body.insertAdjacentHTML("beforeend", buildHtml(intervention));
      backdrop = getBackdrop();
    }
    if (!backdrop) return null;
    const root = getRoot();
    if (backdrop.dataset.orcamentoBound === "1") return backdrop;
    backdrop.dataset.orcamentoBound = "1";
    backdrop.addEventListener("click", (ev) => {
      if (ev.target === backdrop) close();
    });
    root?.querySelectorAll?.("[data-orcamento-delete-action]")?.forEach((btn) => {
      btn.addEventListener("click", async () => {
        const action = String(btn.dataset.orcamentoDeleteAction || "");
        if (action === "no") {
          close();
          modalState?.context?.onCancel?.();
          return;
        }
        const footer = root.querySelector("[data-orcamento-delete-status]");
        if (footer) footer.textContent = "Exclusão ainda não possui endpoint dedicado no Brana Cloude.";
        await modalState?.context?.onConfirm?.();
        close();
      });
    });
    return backdrop;
  }

  async function open(context = {}) {
    modalState = {
      context: {
        intervention: context?.intervention || null,
        onConfirm: typeof context?.onConfirm === "function" ? context.onConfirm : null,
        onCancel: typeof context?.onCancel === "function" ? context.onCancel : null,
      },
    };
    ensureMounted(modalState.context.intervention || {});
    const backdrop = getBackdrop();
    if (backdrop) {
      backdrop.classList.remove("hidden");
      getRoot()?.querySelector?.('[data-orcamento-delete-action="yes"]')?.focus?.();
    }
    return { opened: !!backdrop };
  }

  window.BranaOrcamentoEliminaIntervencaoModal = Object.freeze({
    moduleName: MODULE_NAME,
    open,
    close,
    ensureStyle,
    buildHtml,
  });
})();
