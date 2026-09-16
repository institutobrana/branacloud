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
      .odonto-v1-panel{width:100%;min-height:0;box-sizing:border-box;padding:0;background:transparent;border:none;font:12px Tahoma,sans-serif;color:#111}
      .odonto-v1-panel .panel-standard-header{display:none !important}
      .odonto-v1-panel.panel-standardized{padding-top:0 !important}
      .odonto-v1-shell{display:grid;gap:4px;min-height:0;background:#efefef;border:1px solid #b9b9b9;padding:2px}
      .odonto-v1-hero-actions{display:flex;gap:8px;align-items:center;justify-content:flex-end;flex-wrap:wrap}
      .odonto-v1-hero-actions .materiais-btn{height:30px;min-width:94px;padding:0 10px;justify-content:center}
      .odonto-v1-contextbar{display:none;grid-template-columns:minmax(0,1.08fr) minmax(0,.98fr) minmax(220px,.56fr);gap:10px;align-items:end;padding:6px 8px;border:1px solid #c7c7c7;background:#fdfdfd;box-shadow:none}
      .odonto-v1-contextbar .odonto-v1-field label{font-size:11px;text-transform:uppercase;letter-spacing:.03em;color:#425266}
      .odonto-v1-visually-hidden{position:absolute !important;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
      .odonto-v1-contextbar .odonto-v1-field .box,.odonto-v1-contextbar .odonto-v1-field select{height:30px;border:1px solid #bfc9d6;background:#fff;padding:0 8px;font:12px Tahoma,sans-serif;box-sizing:border-box}
      .odonto-v1-contextbar .odonto-v1-field select{display:none}
      .odonto-v1-contextbar .odonto-v1-field-tratamento{display:none}
      .odonto-v1-contextbar .odonto-v1-field-filtro select{display:block;width:100%}
      .odonto-v1-contextbar .odonto-v1-field #odonto-v1-paciente{height:auto;min-height:30px;padding:0;border:none;background:transparent}
      .odonto-v1-contextbar .odonto-v1-summary{display:flex;gap:12px;flex-wrap:wrap;align-items:center;justify-content:flex-end;color:#425266}
      .odonto-v1-contextbar .odonto-v1-summary .odonto-v1-muted{white-space:nowrap}
      .odonto-v1-tabs-row{display:grid;grid-template-columns:minmax(0,1fr) minmax(230px,.62fr);gap:8px;align-items:start;margin-top:1px}
      .odonto-v1-tabs-spacer{min-height:1px}
      .odonto-v1-treatment-tabs{display:flex;align-items:flex-end;gap:3px;flex-wrap:wrap;padding:0 0 1px 0;border-bottom:1px solid #8f9fb0;min-height:20px;overflow:hidden}
      .odonto-v1-treatment-tab{height:19px;min-width:62px;padding:0 8px;border:1px solid #9dadbd;border-bottom:none;background:linear-gradient(180deg,#ffffff 0%,#eef3f7 100%);font:11px Tahoma,sans-serif;color:#223244;cursor:pointer;line-height:18px}
      .odonto-v1-treatment-tab:hover{background:linear-gradient(180deg,#fff 0%,#f4f8fb 100%)}
      .odonto-v1-treatment-tab.active{background:#fff;font-weight:700;position:relative;top:1px;z-index:1}
      .odonto-v1-treatment-tab.empty{color:#7a8794;cursor:default}
      .odonto-v1-stage{display:grid;grid-template-columns:minmax(0,600px) minmax(0,1fr) !important;gap:6px;align-items:start;min-height:0;margin-top:1px}
      .odonto-v1-stage-main{min-height:0;display:grid;grid-template-rows:1fr;max-width:600px !important}
      .odonto-v1-arcada-panel{border:1px solid #b9c8d6;background:#fff;box-shadow:0 1px 2px rgba(15,23,42,.02)}
      .odonto-v1-arcada-panel .odonto-v1-card-body{padding:4px 5px 3px;min-height:0;overflow:auto}
      .odonto-v1-stage-rail{display:grid;gap:3px;align-content:start;min-height:0}
      .odonto-v1-support-card{border:1px solid #c9c9c9;background:#fbfbfb;display:grid;grid-template-rows:auto 1fr;min-height:0;box-shadow:none}
      .odonto-v1-support-title{padding:5px 8px;border-bottom:1px solid #dcdcdc;background:#f4f4f4;font:700 10px Tahoma,sans-serif;text-transform:uppercase;letter-spacing:.02em;color:#243244}
      .odonto-v1-support-card .odonto-v1-card-body{padding:2px 4px 4px;min-height:0;overflow:auto}
      .odonto-v1-support-card-context .odonto-v1-context-summary{display:grid;gap:0;font:9px Tahoma,sans-serif;color:#304254}
      .odonto-v1-support-card-context .odonto-v1-context-summary strong{color:#223244}
      .odonto-v1-context-patient-grid{display:grid;gap:0}
      .odonto-v1-context-row{display:grid;grid-template-columns:70px minmax(0,1fr);gap:4px;align-items:center;min-height:14px;padding:0 2px;border-bottom:1px solid #e9e9e9}
      .odonto-v1-context-row:last-child{border-bottom:none}
      .odonto-v1-context-row span{font:700 9px Tahoma,sans-serif;color:#243244;text-align:right;line-height:1}
      .odonto-v1-context-row strong,.odonto-v1-context-row em{font:9px Tahoma,sans-serif;color:#2f3d4f;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-style:normal;line-height:1}
      .odonto-v1-context-sections{margin-top:0;border-top:1px solid #d2d2d2;background:#fff}
      .odonto-v1-context-section{display:flex;align-items:center;justify-content:center;min-height:14px;padding:0;border-bottom:1px solid #e4e4e4;font:700 8px Tahoma,sans-serif;text-transform:uppercase;letter-spacing:.03em;color:#243244;text-align:center;background:linear-gradient(180deg,#fff 0%,#fafafa 100%)}
      .odonto-v1-context-section:last-child{border-bottom:none}
      .odonto-v1-rightstack{display:grid;gap:1px}
      .odonto-v1-rightline{display:grid;grid-template-columns:90px minmax(0,1fr);gap:6px;align-items:center;padding:2px 0;border-bottom:1px solid #e6e6e6}
      .odonto-v1-rightline:last-child{border-bottom:none}
      .odonto-v1-rightline span{font:700 12px Tahoma,sans-serif;color:#243244;text-align:right}
      .odonto-v1-rightline strong,.odonto-v1-rightline em{font-style:normal;font:12px Tahoma,sans-serif;color:#2f3d4f;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      .odonto-v1-rightagenda{margin-top:4px;border-top:1px solid #d6d6d6;background:#fff}
      .odonto-v1-rightagenda-head{padding:6px 0 4px;font:700 11px Tahoma,sans-serif;text-transform:uppercase;letter-spacing:.03em;color:#243244;text-align:center;border-bottom:1px solid #dedede}
      .odonto-v1-rightagenda-body{min-height:64px;padding:8px 6px;font:12px Tahoma,sans-serif;color:#5d6b79}
      .odonto-v1-workarea{display:grid;gap:4px;min-height:0;margin-top:1px}
      .odonto-v1-lower-panel{border:1px solid #bfcddd;background:#fff;box-shadow:0 1px 3px rgba(15,23,42,.04);display:grid;grid-template-rows:auto 1fr;min-height:0}
      .odonto-v1-lower-panel .odonto-v1-card-title{padding:4px 8px;font-size:10px;line-height:1}
      .odonto-v1-lower-panel .odonto-v1-card-body{padding:5px 6px 6px;min-height:0;overflow:auto}
      .odonto-v1-lower-toolbar{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:6px;margin-bottom:6px}
      .odonto-v1-lower-field{display:grid;gap:4px}
      .odonto-v1-lower-field label{font:700 9px Tahoma,sans-serif;text-transform:uppercase;letter-spacing:.04em;color:#425266}
      .odonto-v1-lower-field select{height:23px;border:1px solid #bfc9d6;background:#fff;padding:0 5px;box-sizing:border-box;font:11px Tahoma,sans-serif}
      .odonto-v1-procedure-list{display:grid;gap:3px;max-height:138px;overflow:auto}
      .odonto-v1-procedure-row{display:grid;grid-template-columns:44px minmax(0,1fr) 86px 70px;gap:4px;align-items:center;padding:2px 5px;border:1px solid #dbe3ec;background:linear-gradient(180deg,#fff 0%,#fafcff 100%);font:10px Tahoma,sans-serif;min-height:20px}
      .odonto-v1-procedure-row:nth-child(even){background:#fbfdff}
      .odonto-v1-procedure-code{font:700 10px Consolas,Monaco,monospace;color:#34475d}
      .odonto-v1-procedure-name{font:700 10px Tahoma,sans-serif;color:#1f2937;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .odonto-v1-procedure-meta{font:10px Tahoma,sans-serif;color:#5d6b79;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-align:right}
      .odonto-v1-specialty-strip{display:flex;gap:4px;flex-wrap:wrap;padding:0 0 6px;margin:0 0 6px;border-bottom:1px solid #e2e8f0}
      .odonto-v1-specialty-chip{display:inline-flex;align-items:center;justify-content:center;min-height:18px;padding:1px 8px;border:1px solid #cfd8e3;border-radius:999px;background:#f7f9fc;font:700 9px Tahoma,sans-serif;color:#223244;cursor:pointer;white-space:nowrap}
      .odonto-v1-specialty-chip.active{background:#1b8a86;border-color:#1b8a86;color:#fff}
      .odonto-v1-symbol-strip{display:grid;grid-template-columns:repeat(auto-fill,minmax(68px,1fr));gap:4px}
      .odonto-v1-symbol-card{border:1px solid #dbe3ec;background:#fff;padding:3px;display:grid;gap:3px;align-content:start;min-height:72px}
      .odonto-v1-symbol-card img{width:100%;height:30px;object-fit:contain;background:#fbfdff;border:1px solid #eef2f7}
      .odonto-v1-symbol-card span{font:9px Tahoma,sans-serif;color:#243244;line-height:1.05;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
      .odonto-v1-symbol-empty,.odonto-v1-procedure-empty{padding:8px 7px;color:#5d6b79;background:#fbfcfe;border:1px dashed #d7dfe8;font:11px Tahoma,sans-serif}
      .odonto-v1-history-panel{display:none}
      .odonto-v1-procedures-panel .odonto-v1-card-title,.odonto-v1-history-panel .odonto-v1-card-title{padding:4px 8px;border-bottom:1px solid #d9e2ea;background:linear-gradient(180deg,#fefefe 0%,#f3f7fb 100%);font:700 9px Tahoma,sans-serif;text-transform:uppercase;letter-spacing:.05em;color:#223244;line-height:1}
      .odonto-v1-procedures-panel .odonto-v1-card-body,.odonto-v1-history-panel .odonto-v1-card-body{padding:5px 6px 6px;min-height:0;overflow:auto}
      .odonto-v1-legend-inline{display:flex;gap:4px;flex-wrap:wrap;padding:0 0 5px 0;margin:0 0 5px 0;border-bottom:1px solid #e2e8f0;min-height:14px}
      .odonto-v1-legend-inline .odonto-v1-chip{padding:2px 6px;font-size:10px;line-height:1}
      .odonto-v1-history-table{width:100%;border-collapse:collapse;table-layout:fixed;font:12px Tahoma,sans-serif;background:#fff}
      .odonto-v1-history-table th,.odonto-v1-history-table td{padding:3px 5px;border-bottom:1px solid #d7dfe7;border-right:1px solid #e7edf4;vertical-align:top;background:#fff;box-sizing:border-box;line-height:1.15}
      .odonto-v1-history-table th:last-child,.odonto-v1-history-table td:last-child{border-right:none}
      .odonto-v1-history-table thead th{background:#f2f6fb;font:700 10px Tahoma,sans-serif;color:#243444;white-space:nowrap;text-transform:none}
      .odonto-v1-history-table tbody tr:nth-child(even) td{background:#fbfdff}
      .odonto-v1-history-table tbody tr:hover td{background:#eef5ff}
      .odonto-v1-history-table .mono{font-family:Consolas,Monaco,monospace}
      .odonto-v1-history-table th:nth-child(1),.odonto-v1-history-table td:nth-child(1){width:90px;white-space:nowrap}
      .odonto-v1-history-table th:nth-child(2),.odonto-v1-history-table td:nth-child(2){width:130px;white-space:nowrap}
      .odonto-v1-history-table th:nth-child(3),.odonto-v1-history-table td:nth-child(3){width:120px;white-space:nowrap}
      .odonto-v1-history-table th:nth-child(4),.odonto-v1-history-table td:nth-child(4){width:auto;word-break:break-word;overflow-wrap:anywhere}
      .odonto-v1-history-empty{padding:14px 12px;color:#5d6b79;background:#fbfcfe;border:1px dashed #d7dfe8}
      .odonto-v1-footline{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;align-items:center;padding:7px 10px;border:1px solid #d7e0ea;background:#f8fafc;font:11px Tahoma,sans-serif;color:#546274}
      .odonto-v1-footline .odonto-v1-muted{font-size:11px}
      @media (max-width: 720px){
        .odonto-v1-contextbar{grid-template-columns:1fr 1fr}
      }
      @media (max-width: 760px){
        .odonto-v1-contextbar{grid-template-columns:1fr}
        .odonto-v1-contextbar .odonto-v1-summary{justify-content:flex-start}
        .odonto-v1-stage{grid-template-columns:1fr !important}
        .odonto-v1-stage-main{max-width:none !important}
      }
      @media (min-width: 761px) and (max-width: 1280px){
        .odonto-v1-stage{grid-template-columns:minmax(0,600px) minmax(0,1fr) !important}
        .odonto-v1-stage-main{max-width:600px !important}
      }
    `;
    document.head.appendChild(style);
  }

  function panelHtml() {
    return `
      <section id="${PANEL_ID}" class="odonto-v1-panel hidden">
        <div class="odonto-v1-shell">
          <div class="odonto-v1-contextbar">
            <div class="odonto-v1-field">
              <label for="odonto-v1-paciente">Paciente</label>
              <div id="odonto-v1-paciente" class="box"></div>
            </div>
            <div class="odonto-v1-field odonto-v1-field-tratamento">
              <label for="odonto-v1-tratamento">Tratamento</label>
              <select id="odonto-v1-tratamento"></select>
            </div>
            <div class="odonto-v1-field odonto-v1-field-filtro">
              <label for="odonto-v1-filtro-visual" class="odonto-v1-visually-hidden">Filtro clínico</label>
              <select id="odonto-v1-filtro-visual" aria-label="Filtro clínico">
                <option selected>Condição observada no paciente</option>
                <option>Já realizado no paciente</option>
                <option>A realizar no paciente</option>
                <option>Todas intervenções no paciente</option>
                <option>Condição observada no tratamento</option>
                <option>Já realizado no tratamento</option>
                <option>A realizar no tratamento</option>
                <option>Todas intervenções no tratamento</option>
                <option>Características e anomalias</option>
              </select>
            </div>
            <div class="odonto-v1-summary">
              <span id="odonto-v1-resumo-contagem" class="odonto-v1-muted">0 intervenções.</span>
              <span id="odonto-v1-loading" class="odonto-v1-muted odonto-v1-small">Pronto.</span>
            </div>
          </div>
          <div class="odonto-v1-stage">
            <section class="odonto-v1-stage-main odonto-v1-arcada-panel">
              <div id="odonto-v1-arcada" class="odonto-v1-card-body"></div>
            </section>
            <aside class="odonto-v1-stage-rail">
              <section class="odonto-v1-support-card odonto-v1-support-card-context">
                <div class="odonto-v1-support-title">Paciente</div>
                <div id="odonto-v1-context-summary" class="odonto-v1-card-body">
                  <div class="odonto-v1-context-patient-grid">
                    <div class="odonto-v1-context-row"><span>Idade</span><strong id="odonto-v1-context-idade">—</strong></div>
                    <div class="odonto-v1-context-row"><span>Última visita</span><strong id="odonto-v1-context-ultima-visita">—</strong></div>
                    <div class="odonto-v1-context-row"><span>Próxima visita</span><strong id="odonto-v1-context-proxima-visita">—</strong></div>
                    <div class="odonto-v1-context-row"><span>Fone 1</span><strong id="odonto-v1-context-fone-1">—</strong></div>
                    <div class="odonto-v1-context-row"><span>Fone 2</span><strong id="odonto-v1-context-fone-2">—</strong></div>
                    <div class="odonto-v1-context-row"><span>Fone 3</span><strong id="odonto-v1-context-fone-3">—</strong></div>
                    <div class="odonto-v1-context-row"><span>E-Mail</span><strong id="odonto-v1-context-email">—</strong></div>
                    <div class="odonto-v1-context-row"><span>Matrícula</span><strong id="odonto-v1-context-matricula">—</strong></div>
                    <div class="odonto-v1-context-row"><span>Prontuário</span><strong id="odonto-v1-context-prontuario">—</strong></div>
                    <div class="odonto-v1-context-row"><span>Tabela</span><strong id="odonto-v1-context-tabela">—</strong></div>
                  </div>
                  <div class="odonto-v1-context-sections">
                    <div class="odonto-v1-context-section" id="odonto-v1-context-tratamento">Tratamento</div>
                    <div class="odonto-v1-context-section" id="odonto-v1-context-observacoes">Observações</div>
                    <div class="odonto-v1-context-section" id="odonto-v1-context-imagens">Imagens</div>
                    <div class="odonto-v1-context-section" id="odonto-v1-context-documentos">Documentos</div>
                    <div class="odonto-v1-context-section" id="odonto-v1-context-agenda">Agenda</div>
                  </div>
                </div>
              </section>
            </aside>
          </div>
          <div class="odonto-v1-tabs-row">
            <div id="odonto-v1-treatment-tabs" class="odonto-v1-treatment-tabs" aria-label="Tratamentos por data"></div>
            <div class="odonto-v1-tabs-spacer" aria-hidden="true"></div>
          </div>
          <div class="odonto-v1-workarea">
            <section class="odonto-v1-lower-panel odonto-v1-procedures-panel">
              <div class="odonto-v1-card-title">Procedimentos registrados</div>
              <div class="odonto-v1-card-body">
                <div id="odonto-v1-legend" class="odonto-v1-legend odonto-v1-legend-inline"></div>
                <div class="odonto-v1-lower-toolbar">
                  <div class="odonto-v1-lower-field">
                    <label for="odonto-v1-lower-tabela">Tabela</label>
                    <select id="odonto-v1-lower-tabela"></select>
                  </div>
                  <div class="odonto-v1-lower-field">
                    <label for="odonto-v1-lower-especialidade">Especialidade</label>
                    <select id="odonto-v1-lower-especialidade"></select>
                  </div>
                </div>
                <div id="odonto-v1-procedure-list" class="odonto-v1-procedure-list"></div>
              </div>
            </section>
            <section class="odonto-v1-lower-panel odonto-v1-symbols-panel">
              <div class="odonto-v1-card-title">Simbolos / especialidades</div>
              <div class="odonto-v1-card-body">
                <div id="odonto-v1-specialty-strip" class="odonto-v1-specialty-strip"></div>
                <div id="odonto-v1-symbol-strip" class="odonto-v1-symbol-strip"></div>
              </div>
            </section>
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
      treatmentTabs: document.getElementById("odonto-v1-treatment-tabs"),
      filtroVisual: document.getElementById("odonto-v1-filtro-visual"),
      btnAtualizar: document.getElementById("odonto-v1-btn-atualizar"),
      btnFechar: document.getElementById("odonto-v1-btn-fechar"),
      resumoPaciente: document.getElementById("odonto-v1-resumo-paciente"),
      resumoTratamento: document.getElementById("odonto-v1-resumo-tratamento"),
      resumoContagem: document.getElementById("odonto-v1-resumo-contagem"),
      loading: document.getElementById("odonto-v1-loading"),
      feedback: document.getElementById("odonto-v1-feedback"),
      contextPaciente: document.getElementById("odonto-v1-context-paciente"),
      contextIdade: document.getElementById("odonto-v1-context-idade"),
      contextUltimaVisita: document.getElementById("odonto-v1-context-ultima-visita"),
      contextProximaVisita: document.getElementById("odonto-v1-context-proxima-visita"),
      contextFone1: document.getElementById("odonto-v1-context-fone-1"),
      contextFone2: document.getElementById("odonto-v1-context-fone-2"),
      contextFone3: document.getElementById("odonto-v1-context-fone-3"),
      contextEmail: document.getElementById("odonto-v1-context-email"),
      contextMatricula: document.getElementById("odonto-v1-context-matricula"),
      contextProntuario: document.getElementById("odonto-v1-context-prontuario"),
      contextTabela: document.getElementById("odonto-v1-context-tabela"),
      contextTratamento: document.getElementById("odonto-v1-context-tratamento"),
      contextObservacoes: document.getElementById("odonto-v1-context-observacoes"),
      contextImagens: document.getElementById("odonto-v1-context-imagens"),
      contextDocumentos: document.getElementById("odonto-v1-context-documentos"),
      contextAgenda: document.getElementById("odonto-v1-context-agenda"),
      legend: document.getElementById("odonto-v1-legend"),
      arcada: document.getElementById("odonto-v1-arcada"),
      lowerTabela: document.getElementById("odonto-v1-lower-tabela"),
      lowerEspecialidade: document.getElementById("odonto-v1-lower-especialidade"),
      procedureList: document.getElementById("odonto-v1-procedure-list"),
      specialtyStrip: document.getElementById("odonto-v1-specialty-strip"),
      symbolStrip: document.getElementById("odonto-v1-symbol-strip"),
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
