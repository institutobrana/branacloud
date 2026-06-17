(function () {
  "use strict";

  const MODULE_NAME = "BranaOrcamentoImpressaoTratamentoModal";
  const VERSION = "20260617-onda3-1";
  const STYLE_ID = "brana-orcamento-impressao-style";
  const BACKDROP_ID = "brana-orcamento-impressao-backdrop";

  let modalState = null;

  function esc(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
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
      #${BACKDROP_ID}{position:fixed;inset:0;z-index:9104;background:rgba(0,0,0,.24);display:flex;align-items:flex-start;justify-content:center;padding:18px;box-sizing:border-box}
      #${BACKDROP_ID}.hidden{display:none}
      .orcamento-print-modal{width:min(400px,calc(100vw - 24px));background:#efefef;border:1px solid #a9a9a9;box-shadow:0 8px 30px rgba(0,0,0,.24);font:12px Tahoma,Arial,sans-serif;color:#111}
      .orcamento-print-head{padding:10px 12px 6px;font:bold 14px Tahoma,Arial,sans-serif}
      .orcamento-print-grid{display:grid;gap:9px;padding:10px 12px 8px}
      .orcamento-print-line{display:grid;gap:4px}
      .orcamento-print-line label{color:#444}
      .orcamento-print-select,.orcamento-print-input,.orcamento-print-textarea{border:1px solid #b7c1cc;background:#fff;box-sizing:border-box;font:12px Tahoma,Arial,sans-serif;height:24px;padding:4px 6px}
      .orcamento-print-textarea{min-height:86px;height:auto;resize:vertical}
      .orcamento-print-box{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
      .orcamento-print-box input{width:16px;height:16px}
      .orcamento-print-status{padding:0 12px 8px;color:#b00020;min-height:16px}
      .orcamento-print-footer{display:flex;justify-content:flex-end;gap:10px;padding:0 12px 12px}
      .orcamento-print-btn{min-width:72px;height:28px;border:1px solid #8d8d8d;background:linear-gradient(#fff,#e8e8e8);font:12px Tahoma,Arial,sans-serif;cursor:pointer}
      .orcamento-print-btn.primary{font-weight:700}
      .orcamento-print-check.disabled{opacity:.52}
    `;
    document.head.appendChild(style);
  }

  function getBackdrop() {
    return document.getElementById(BACKDROP_ID);
  }

  function getRoot() {
    return getBackdrop()?.querySelector?.(".orcamento-print-modal") || null;
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
        <div class="orcamento-print-modal" role="dialog" aria-modal="true" aria-label="Impressão de tratamento">
          <div class="orcamento-print-head">Impressão de tratamento</div>
          <div class="orcamento-print-grid">
            <div class="orcamento-print-line">
              <label for="orcamento-print-modelo">Modelo de orçamento:</label>
              <select id="orcamento-print-modelo" name="modelo_orcamento" class="orcamento-print-select">
                <option value="Resumido">Resumido</option>
                <option value="Detalhado">Detalhado</option>
              </select>
            </div>
            <div class="orcamento-print-box">
              <div class="orcamento-print-line" style="flex:0 0 118px;min-width:118px">
                <label for="orcamento-print-saida">Saída:</label>
                <select id="orcamento-print-saida" name="saida" class="orcamento-print-select">
                  <option value="Impressora">Impressora</option>
                  <option value="Tela">Tela</option>
                </select>
              </div>
              <div class="orcamento-print-line" style="flex:1 1 0">
                <label for="orcamento-print-endereco">Endereço:</label>
                <input id="orcamento-print-endereco" name="endereco" class="orcamento-print-input" type="text">
              </div>
            </div>
            <div class="orcamento-print-line">
              <label>Opções de impressão</label>
              <label class="orcamento-print-box"><input type="checkbox" name="imprimir_odontograma" checked> <span>Imprimir odontograma</span></label>
              <label class="orcamento-print-box orcamento-print-check disabled"><input type="checkbox" name="imprimir_valores_intervencoes" checked disabled> <span>Imprimir valores das intervenções</span></label>
            </div>
            <div class="orcamento-print-line">
              <label for="orcamento-print-titulo">Título do relatório:</label>
              <input id="orcamento-print-titulo" name="titulo_relatorio" class="orcamento-print-input" type="text" value="Previsão de honorários">
            </div>
            <div class="orcamento-print-line">
              <label for="orcamento-print-msg">Mensagem para impressão:</label>
              <textarea id="orcamento-print-msg" name="mensagem_para_impressao" class="orcamento-print-textarea"></textarea>
            </div>
            <label class="orcamento-print-box"><input type="checkbox" name="imprimir_observacoes_do_tratamento"> <span>Imprimir observações do tratamento</span></label>
          </div>
          <div class="orcamento-print-status" data-orcamento-print-status></div>
          <div class="orcamento-print-footer">
            <button type="button" class="orcamento-print-btn primary" data-orcamento-print-action="ok">Ok</button>
            <button type="button" class="orcamento-print-btn" data-orcamento-print-action="cancel">Cancela</button>
          </div>
        </div>
      </div>
    `;
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
    root?.querySelectorAll?.("[data-orcamento-print-action]")?.forEach((btn) => {
      btn.addEventListener("click", async () => {
        const action = String(btn.dataset.orcamentoPrintAction || "");
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
      modelo_orcamento: String(read("modelo_orcamento")?.value || "Resumido").trim(),
      saida: String(read("saida")?.value || "Impressora").trim(),
      endereco: String(read("endereco")?.value || "").trim(),
      imprimir_odontograma: !!read("imprimir_odontograma")?.checked,
      imprimir_valores_intervencoes: !!read("imprimir_valores_intervencoes")?.checked,
      titulo_relatorio: String(read("titulo_relatorio")?.value || "Previsão de honorários").trim(),
      mensagem_para_impressao: String(read("mensagem_para_impressao")?.value || "").trim(),
      imprimir_observacoes_do_tratamento: !!read("imprimir_observacoes_do_tratamento")?.checked,
    };
  }

  async function save() {
    const root = getRoot();
    if (!root || modalState?.saving) return;
    const footer = root.querySelector("[data-orcamento-print-status]");
    const api = modalState?.context?.api || (await ensureApi());
    if (!api?.prepararImpressao) {
      if (footer) footer.textContent = "API de orçamento indisponível.";
      return;
    }
    const treatmentId = Number(modalState?.context?.treatmentId || modalState?.context?.snapshot?.selectedTreatmentId || 0) || 0;
    if (treatmentId <= 0) {
      if (footer) footer.textContent = "Tratamento inválido.";
      return;
    }
    modalState = { ...modalState, saving: true };
    if (footer) footer.textContent = "Preparando impressão...";
    try {
      const payload = readPayload(root);
      const result = await api.prepararImpressao(treatmentId, payload);
      if (!result?.ok) {
        if (footer) footer.textContent = result?.message || "Falha ao preparar impressão.";
        return;
      }
      await modalState?.context?.onPrepared?.(result);
      close();
    } catch (err) {
      if (footer) footer.textContent = err?.message || "Falha ao preparar impressão.";
    } finally {
      modalState = modalState ? { ...modalState, saving: false } : null;
    }
  }

  async function open(context = {}) {
    modalState = {
      context: {
        treatmentId: Number(context?.treatmentId || context?.snapshot?.selectedTreatmentId || 0) || 0,
        snapshot: context?.snapshot || null,
        api: context?.api || window.BranaOrcamentoApiV1 || null,
        onPrepared: typeof context?.onPrepared === "function" ? context.onPrepared : null,
        onCancel: typeof context?.onCancel === "function" ? context.onCancel : null,
      },
      saving: false,
    };
    ensureMounted();
    const backdrop = getBackdrop();
    if (backdrop) {
      backdrop.classList.remove("hidden");
      getRoot()?.querySelector?.('[name="modelo_orcamento"]')?.focus?.();
    }
    return { opened: !!backdrop };
  }

  window.BranaOrcamentoImpressaoTratamentoModal = Object.freeze({
    moduleName: MODULE_NAME,
    open,
    close,
    ensureStyle,
    buildHtml,
    readPayload,
  });
})();
