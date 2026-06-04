(function () {
  "use strict";

  const MODULE_NAME = "BranaOdontoLayoutV1";
  const STYLE_ID = "odonto-v1-layout-style";

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .odonto-v1-panel{width:min(1380px,100%);min-height:0;box-sizing:border-box;padding:10px;background:linear-gradient(180deg,#f5f8fb 0%,#eef3f8 100%);border:1px solid #c8d4df;font:12px Tahoma,sans-serif;color:#111}
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

  function ensureLayout() {
    ensureStyle();
    return true;
  }

  window.BranaOdontoLayoutV1 = Object.freeze({
    moduleName: MODULE_NAME,
    ensureStyle,
    ensureLayout,
  });
})();
