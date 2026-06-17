(function () {
  "use strict";

  const MODULE_NAME = "BranaOrcamentoAlteraParcelaModal";
  const VERSION = "20260617-onda3-1";
  const STYLE_ID = "brana-orcamento-altera-parcela-style";
  const BACKDROP_ID = "brana-orcamento-altera-parcela-backdrop";

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

  function money(value) {
    const n = Number(value || 0);
    return Number.isFinite(n)
      ? n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : "0,00";
  }

  function formatDate(value) {
    const raw = String(value ?? "").trim();
    if (!raw) return "";
    const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (iso) return `${iso[3]}/${iso[2]}/${iso[1]}`;
    return raw;
  }

  async function ensureApi() {
    if (window.BranaOrcamentoApiV1) return window.BranaOrcamentoApiV1;
    await import(`/frontend/orcamento/orcamento-api.js?v=${VERSION}`);
    return window.BranaOrcamentoApiV1 || null;
  }

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      #${BACKDROP_ID}{position:fixed;inset:0;z-index:9102;background:rgba(0,0,0,.24);display:flex;align-items:flex-start;justify-content:center;padding:18px;box-sizing:border-box}
      #${BACKDROP_ID}.hidden{display:none}
      .orcamento-parcela-modal{width:min(380px,calc(100vw - 24px));background:#efefef;border:1px solid #a9a9a9;box-shadow:0 8px 30px rgba(0,0,0,.24);font:12px Tahoma,Arial,sans-serif;color:#111}
      .orcamento-parcela-head{padding:10px 12px 6px;font:bold 14px Tahoma,Arial,sans-serif}
      .orcamento-parcela-grid{display:grid;gap:10px;padding:10px 12px 8px}
      .orcamento-parcela-line{display:grid;grid-template-columns:120px minmax(0,1fr);gap:8px;align-items:center}
      .orcamento-parcela-line label{white-space:nowrap;color:#444}
      .orcamento-parcela-input{border:1px solid #b7c1cc;background:#fff;box-sizing:border-box;font:12px Tahoma,Arial,sans-serif;height:24px;padding:4px 6px}
      .orcamento-parcela-status{padding:0 12px 10px;color:#b00020;min-height:16px}
      .orcamento-parcela-footer{display:flex;justify-content:flex-end;gap:10px;padding:0 12px 12px}
      .orcamento-parcela-btn{min-width:72px;height:28px;border:1px solid #8d8d8d;background:linear-gradient(#fff,#e8e8e8);font:12px Tahoma,Arial,sans-serif;cursor:pointer}
      .orcamento-parcela-btn.primary{font-weight:700}
    `;
    document.head.appendChild(style);
  }

  function getBackdrop() {
    return document.getElementById(BACKDROP_ID);
  }

  function getRoot() {
    return getBackdrop()?.querySelector?.(".orcamento-parcela-modal") || null;
  }

  function close() {
    const backdrop = getBackdrop();
    if (!backdrop) return false;
    backdrop.classList.add("hidden");
    modalState = null;
    return true;
  }

  function buildHtml(parcel = {}) {
    return `
      <div id="${BACKDROP_ID}" class="hidden">
        <div class="orcamento-parcela-modal" role="dialog" aria-modal="true" aria-label="Altera parcela">
          <div class="orcamento-parcela-head">Altera parcela</div>
          <div class="orcamento-parcela-grid">
            <div class="orcamento-parcela-line">
              <label for="orcamento-parcela-numero">Parcela:</label>
              <input id="orcamento-parcela-numero" name="numero" class="orcamento-parcela-input" type="text" value="${esc(String(num(parcel.numero || 0, 0) || 0))}" readonly>
            </div>
            <div class="orcamento-parcela-line">
              <label for="orcamento-parcela-data">Data:</label>
              <input id="orcamento-parcela-data" name="data" class="orcamento-parcela-input" type="text" value="${esc(formatDate(parcel.data || ""))}">
            </div>
            <div class="orcamento-parcela-line">
              <label for="orcamento-parcela-valor">Valor da parcela: R$</label>
              <input id="orcamento-parcela-valor" name="valor_parcela" class="orcamento-parcela-input" type="text" inputmode="decimal" value="${esc(money(parcel.valor || 0))}">
            </div>
            <div class="orcamento-parcela-line">
              <label for="orcamento-parcela-pago">Valor já pago: R$</label>
              <input id="orcamento-parcela-pago" name="valor_ja_pago" class="orcamento-parcela-input" type="text" inputmode="decimal" value="${esc(money(parcel.valor_ja_pago || 0))}">
            </div>
          </div>
          <div class="orcamento-parcela-status" data-orcamento-parcela-status></div>
          <div class="orcamento-parcela-footer">
            <button type="button" class="orcamento-parcela-btn primary" data-orcamento-parcela-action="ok">Ok</button>
            <button type="button" class="orcamento-parcela-btn" data-orcamento-parcela-action="cancel">Cancela</button>
          </div>
        </div>
      </div>
    `;
  }

  function ensureMounted(parcel = {}) {
    ensureStyle();
    let backdrop = getBackdrop();
    if (!backdrop) {
      document.body.insertAdjacentHTML("beforeend", buildHtml(parcel));
      backdrop = getBackdrop();
    }
    if (!backdrop) return null;
    const root = getRoot();
    if (backdrop.dataset.orcamentoBound === "1") return backdrop;
    backdrop.dataset.orcamentoBound = "1";
    backdrop.addEventListener("click", (ev) => {
      if (ev.target === backdrop) close();
    });
    root?.querySelectorAll?.("[data-orcamento-parcela-action]")?.forEach((btn) => {
      btn.addEventListener("click", async () => {
        const action = String(btn.dataset.orcamentoParcelaAction || "");
        if (action === "cancel") {
          close();
          modalState?.context?.onCancel?.();
          return;
        }
        await save();
      });
    });
    return backdrop;
  }

  function readPayload(root) {
    const read = (name) => root?.querySelector?.(`[name="${name}"]`);
    return {
      data: String(read("data")?.value || "").trim(),
      valor_parcela: String(read("valor_parcela")?.value || "").trim(),
      valor_ja_pago: String(read("valor_ja_pago")?.value || "").trim(),
    };
  }

  async function save() {
    const root = getRoot();
    const footer = root?.querySelector?.("[data-orcamento-parcela-status]");
    if (!root || modalState?.saving) return;
    const api = modalState?.context?.api || (await ensureApi());
    if (!api?.alterarParcela) {
      if (footer) footer.textContent = "API de orçamento indisponível.";
      return;
    }
    const treatmentId = num(modalState?.context?.treatmentId || modalState?.context?.snapshot?.selectedTreatmentId || 0, 0);
    const number = num(modalState?.context?.parcel?.numero || 0, 0);
    if (treatmentId <= 0 || number <= 0) {
      if (footer) footer.textContent = "Parcela inválida.";
      return;
    }
    modalState = { ...modalState, saving: true };
    if (footer) footer.textContent = "Gravando parcela...";
    try {
      const payload = readPayload(root);
      const result = await api.alterarParcela(treatmentId, number, payload);
      if (!result?.ok) {
        if (footer) footer.textContent = result?.message || "Falha ao gravar parcela.";
        return;
      }
      await modalState?.context?.onSaved?.({ result });
      close();
    } catch (err) {
      if (footer) footer.textContent = err?.message || "Falha ao gravar parcela.";
    } finally {
      modalState = modalState ? { ...modalState, saving: false } : null;
    }
  }

  async function open(context = {}) {
    modalState = {
      context: {
        parcel: context?.parcel || null,
        snapshot: context?.snapshot || null,
        treatmentId: num(context?.treatmentId || context?.snapshot?.selectedTreatmentId || 0, 0),
        api: context?.api || window.BranaOrcamentoApiV1 || null,
        onSaved: typeof context?.onSaved === "function" ? context.onSaved : null,
        onCancel: typeof context?.onCancel === "function" ? context.onCancel : null,
      },
      saving: false,
    };
    ensureMounted(modalState.context.parcel || {});
    const backdrop = getBackdrop();
    if (backdrop) {
      backdrop.classList.remove("hidden");
      getRoot()?.querySelector?.('[name="data"]')?.focus?.();
    }
    return { opened: !!backdrop };
  }

  window.BranaOrcamentoAlteraParcelaModal = Object.freeze({
    moduleName: MODULE_NAME,
    open,
    close,
    ensureStyle,
    buildHtml,
    readPayload,
  });
})();
