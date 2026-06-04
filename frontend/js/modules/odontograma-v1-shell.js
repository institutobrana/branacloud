(function () {
  "use strict";

  const MODULE_NAME = "BranaOdontoShellV1";
  const STYLE_ID = "odonto-v1-shell-style";
  const PANEL_ID = "odontograma-panel";

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .odonto-v1-panel{width:min(1240px,100%);min-height:0;box-sizing:border-box;padding:10px 10px 12px;background:#fff;border:1px solid #cfd8e3;font:12px Tahoma,sans-serif;color:#111}
      .odonto-v1-shell{display:grid;gap:10px;min-height:0}
      .odonto-v1-hero{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;padding:10px 12px;border:1px solid #d7e1ea;background:linear-gradient(180deg,#ffffff 0%,#f8fbfd 100%);box-shadow:0 1px 2px rgba(16,24,40,.03)}
      .odonto-v1-hero-copy{display:grid;gap:5px;min-width:0}
      .odonto-v1-hero-title{font:700 19px Tahoma,sans-serif;color:#213246;letter-spacing:.01em}
      .odonto-v1-hero-subtitle{display:flex;gap:10px;flex-wrap:wrap;align-items:center;font:12px Tahoma,sans-serif;color:#4b5b6b}
      .odonto-v1-hero-subtitle .odonto-v1-muted{font-weight:700;color:#334155}
      .odonto-v1-hero-actions{display:flex;gap:8px;align-items:center;justify-content:flex-end;flex-wrap:wrap}
      .odonto-v1-hero-actions .materiais-btn{height:30px;min-width:94px;padding:0 10px;justify-content:center}
      .odonto-v1-contextbar{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,.95fr) minmax(220px,.75fr);gap:10px;align-items:end;padding:8px 10px;border:1px solid #d7e0ea;background:#fff;box-shadow:0 1px 2px rgba(16,24,40,.02)}
      .odonto-v1-contextbar .odonto-v1-field label{font-size:11px;text-transform:uppercase;letter-spacing:.03em;color:#425266}
      .odonto-v1-contextbar .odonto-v1-field .box,
      .odonto-v1-contextbar .odonto-v1-field select{height:30px;border:1px solid #bfc9d6;background:#fff;padding:0 8px;font:12px Tahoma,sans-serif}
      .odonto-v1-contextbar .odonto-v1-summary{display:flex;gap:12px;flex-wrap:wrap;align-items:center;justify-content:flex-end;color:#425266}
      .odonto-v1-contextbar .odonto-v1-summary .odonto-v1-muted{white-space:nowrap}
      .odonto-v1-stage{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(320px,.5fr);gap:10px;align-items:start;min-height:0}
      .odonto-v1-stage-main{min-height:0;display:grid;grid-template-rows:auto 1fr}
      .odonto-v1-arcada-panel{border:1px solid #b9c8d6;background:#fff;box-shadow:0 1px 4px rgba(15,23,42,.04)}
      .odonto-v1-arcada-panel .odonto-v1-card-title{padding:8px 12px;border-bottom:1px solid #d9e2ea;background:linear-gradient(180deg,#fefefe 0%,#f3f7fb 100%);font:700 11px Tahoma,sans-serif;text-transform:uppercase;letter-spacing:.04em;color:#223244}
      .odonto-v1-arcada-panel .odonto-v1-card-body{padding:10px 12px 12px;min-height:0;overflow:auto}
      .odonto-v1-stage-rail{display:grid;gap:10px;align-content:start;min-height:0}
      .odonto-v1-support-card{border:1px solid #d7e0ea;background:#fff;display:grid;grid-template-rows:auto 1fr;min-height:0;box-shadow:0 1px 2px rgba(16,24,40,.02)}
      .odonto-v1-support-title{padding:8px 10px;border-bottom:1px solid #e5ecf3;background:#f5f8fc;font:700 11px Tahoma,sans-serif;text-transform:uppercase;letter-spacing:.03em;color:#243244}
      .odonto-v1-support-card .odonto-v1-card-body{padding:8px 10px;min-height:0;overflow:auto}
      .odonto-v1-support-card-legend .odonto-v1-legend{margin-bottom:0;align-content:flex-start}
      .odonto-v1-support-card-legend .odonto-v1-chip{padding:4px 8px;font-size:11px}
      .odonto-v1-support-card-interventions .odonto-v1-interv-list{gap:6px}
      .odonto-v1-support-card-interventions .odonto-v1-interv-card{padding:8px 9px}
      .odonto-v1-support-card-interventions .odonto-v1-interv-proc{font-size:11px;white-space:normal;line-height:1.2}
      .odonto-v1-support-card-interventions .odonto-v1-interv-meta{gap:8px}
      .odonto-v1-support-card-interventions .odonto-v1-interv-obs{padding:5px 7px;font-size:11px}
      .odonto-v1-footline{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;align-items:center;padding:7px 10px;border:1px solid #d7e0ea;background:#f8fafc;font:11px Tahoma,sans-serif;color:#546274}
      .odonto-v1-footline .odonto-v1-muted{font-size:11px}
      @media (max-width: 1180px){
        .odonto-v1-contextbar{grid-template-columns:1fr 1fr}
        .odonto-v1-stage{grid-template-columns:1fr}
      }
      @media (max-width: 760px){
        .odonto-v1-hero{flex-direction:column;align-items:stretch}
        .odonto-v1-hero-actions{justify-content:flex-start}
        .odonto-v1-contextbar{grid-template-columns:1fr}
        .odonto-v1-contextbar .odonto-v1-summary{justify-content:flex-start}
        .odonto-v1-stage{grid-template-columns:1fr}
      }
    `;
    document.head.appendChild(style);
  }

  function panelHtml() {
    return `
      <section id="${PANEL_ID}" class="odonto-v1-panel hidden">
        <div class="odonto-v1-shell">
          <div class="odonto-v1-hero">
            <div class="odonto-v1-hero-copy">
              <div class="odonto-v1-hero-title">Odontograma V1</div>
              <div class="odonto-v1-hero-subtitle">
                <span id="odonto-v1-resumo-paciente" class="odonto-v1-muted">Sem paciente selecionado.</span>
                <span id="odonto-v1-resumo-tratamento" class="odonto-v1-muted">Sem tratamento selecionado.</span>
              </div>
            </div>
            <div class="odonto-v1-hero-actions">
              <button id="odonto-v1-btn-atualizar" class="materiais-btn" type="button"><img src="/desktop-assets/restaurar.png" alt="">Atualiza</button>
              <button id="odonto-v1-btn-fechar" class="materiais-btn" type="button"><img src="/desktop-assets/cancela.png" alt="">Fecha</button>
            </div>
          </div>
          <div class="odonto-v1-contextbar">
            <div class="odonto-v1-field">
              <label for="odonto-v1-paciente">Paciente</label>
              <div id="odonto-v1-paciente" class="box"></div>
            </div>
            <div class="odonto-v1-field">
              <label for="odonto-v1-tratamento">Tratamento</label>
              <select id="odonto-v1-tratamento"></select>
            </div>
            <div class="odonto-v1-summary">
              <span id="odonto-v1-resumo-contagem" class="odonto-v1-muted">0 intervenÃ§Ãµes.</span>
              <span id="odonto-v1-loading" class="odonto-v1-muted odonto-v1-small">Pronto.</span>
            </div>
          </div>
          <div class="odonto-v1-stage">
            <section class="odonto-v1-stage-main odonto-v1-arcada-panel">
              <div class="odonto-v1-card-title">Arcada clÃ­nica</div>
              <div id="odonto-v1-arcada" class="odonto-v1-card-body"></div>
            </section>
            <aside class="odonto-v1-stage-rail">
              <section class="odonto-v1-support-card odonto-v1-support-card-legend">
                <div class="odonto-v1-support-title">Legenda clÃ­nica</div>
                <div id="odonto-v1-legend" class="odonto-v1-card-body"></div>
              </section>
              <section class="odonto-v1-support-card odonto-v1-support-card-interventions">
                <div class="odonto-v1-support-title">IntervenÃ§Ãµes registradas</div>
                <div id="odonto-v1-intervencoes" class="odonto-v1-card-body"></div>
              </section>
            </aside>
          </div>
          <div id="odonto-v1-feedback" class="odonto-v1-feedback">Pronto para carregar o odontograma em modo de leitura.</div>
        </div>
      </section>
    `;
  }

  function getPanelElements() {
    return {
      panel: document.getElementById(PANEL_ID),
      paciente: document.getElementById("odonto-v1-paciente"),
      tratamento: document.getElementById("odonto-v1-tratamento"),
      btnAtualizar: document.getElementById("odonto-v1-btn-atualizar"),
      btnFechar: document.getElementById("odonto-v1-btn-fechar"),
      resumoPaciente: document.getElementById("odonto-v1-resumo-paciente"),
      resumoTratamento: document.getElementById("odonto-v1-resumo-tratamento"),
      resumoContagem: document.getElementById("odonto-v1-resumo-contagem"),
      loading: document.getElementById("odonto-v1-loading"),
      feedback: document.getElementById("odonto-v1-feedback"),
      legend: document.getElementById("odonto-v1-legend"),
      arcada: document.getElementById("odonto-v1-arcada"),
      intervencoes: document.getElementById("odonto-v1-intervencoes"),
    };
  }

  function mountPanel() {
    try {
      if (window.BranaOdontoLayoutV1 && typeof window.BranaOdontoLayoutV1.ensureStyle === "function") {
        window.BranaOdontoLayoutV1.ensureStyle();
      }
    } catch {}
    if (document.getElementById(PANEL_ID)) {
      return getPanelElements();
    }
    ensureStyle();
    const anchor =
      (typeof workspaceEmpty !== "undefined" && workspaceEmpty && typeof workspaceEmpty.insertAdjacentHTML === "function")
        ? workspaceEmpty
        : document.getElementById("workspace-empty");
    if (!anchor || typeof anchor.insertAdjacentHTML !== "function") return null;

    anchor.insertAdjacentHTML("afterend", panelHtml());
    const cfg = getPanelElements();
    if (!cfg.panel) return null;

    try {
      if (typeof ensurePanelChrome === "function") ensurePanelChrome(cfg.panel);
    } catch {}

    return cfg;
  }

  function bindControls(handlers = {}) {
    const cfg = getPanelElements();
    if (!cfg.panel || cfg.panel.dataset.odontoShellBound === "1") return cfg;
    cfg.panel.dataset.odontoShellBound = "1";
    cfg.btnAtualizar?.addEventListener("click", () => {
      if (typeof handlers.onRefresh === "function") handlers.onRefresh();
    });
    cfg.btnFechar?.addEventListener("click", () => {
      if (typeof handlers.onClose === "function") handlers.onClose();
    });
    cfg.tratamento?.addEventListener("change", () => {
      if (typeof handlers.onTreatmentChange === "function") handlers.onTreatmentChange(cfg.tratamento?.value || "");
    });
    return cfg;
  }

  window.BranaOdontoShellV1 = Object.freeze({
    moduleName: MODULE_NAME,
    panelId: PANEL_ID,
    ensureStyle,
    panelHtml,
    getPanelElements,
    mountPanel,
    bindControls,
  });
})();
