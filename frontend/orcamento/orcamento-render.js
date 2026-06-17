(function () {
  "use strict";

  const MODULE_NAME = "BranaOrcamentoRenderV1";
  const STYLE_ID = "brana-orcamento-v1-style";
  const PANEL_ID = "orcamento-panel";

  const INDEX_OPTIONS = [
    { value: "R$", label: "R$" },
    { value: "UHO", label: "UHO" },
    { value: "UPO", label: "UPO" },
    { value: "USO", label: "USO" },
  ];

  function esc(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function money(value) {
    const n = Number(value || 0);
    return Number.isFinite(n)
      ? n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
      : "R$ 0,00";
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
      .orcamento-panel{width:min(1380px,100%);min-height:0;box-sizing:border-box;padding:8px;background:#f2f2f2;border:1px solid #bdbdbd;font:12px Tahoma,sans-serif;color:#111}
      .orcamento-shell{display:grid;gap:6px;min-height:0}
      .orcamento-toolbar{display:flex;flex-wrap:wrap;gap:2px;align-items:center;padding:1px 0}
      .orcamento-btn{display:inline-flex;align-items:center;gap:5px;min-height:28px;padding:0 10px;border:1px solid #c2c2c2;background:linear-gradient(180deg,#fafafa 0%,#ececec 100%);border-radius:2px;font:12px Tahoma,sans-serif;color:#111;box-shadow:inset 0 1px 0 rgba(255,255,255,.7)}
      .orcamento-btn img{width:18px;height:18px}
      .orcamento-context{display:grid;grid-template-columns:minmax(0,1fr) minmax(220px,.72fr);gap:10px;align-items:end;padding:0 2px}
      .orcamento-field{display:grid;gap:3px}
      .orcamento-field label{font:12px Tahoma,sans-serif;color:#4b5563}
      .orcamento-paciente-row{display:grid;grid-template-columns:minmax(0,1fr) 30px;gap:6px;align-items:center}
      .orcamento-box,.orcamento-select,.orcamento-input{height:24px;min-width:0;border:1px solid #b8c2ce;background:#fff;padding:0 6px;box-sizing:border-box;font:12px Tahoma,sans-serif}
      .orcamento-box{display:flex;align-items:center;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;background:#1ee8f0}
      .orcamento-paciente-btn{width:30px;height:24px;border:1px solid #b8c2ce;background:#fff;padding:0;display:grid;place-items:center}
      .orcamento-paciente-btn img{width:18px;height:18px}
      .orcamento-grid{display:grid;grid-template-columns:1fr;gap:0;border:1px solid #bdbdbd;background:#fff;min-height:0}
      .orcamento-table{width:100%;border-collapse:collapse;table-layout:fixed;font:12px Tahoma,sans-serif}
      .orcamento-table th,.orcamento-table td{border-right:1px solid #d6d6d6;border-bottom:1px solid #d9d9d9;padding:3px 6px;height:22px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;vertical-align:middle}
      .orcamento-table th:last-child,.orcamento-table td:last-child{border-right:none}
      .orcamento-table thead th{background:#f5f5f5;font-weight:400;color:#202020;text-align:left}
      .orcamento-table tbody tr:nth-child(odd) td{background:#fcfcfc}
      .orcamento-table tbody tr.is-selected td{background:#0a78d4;color:#fff}
      .orcamento-empty{padding:10px;color:#6a7280}
      .orcamento-bottom{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(340px,.95fr);gap:8px;align-items:start;min-height:0}
      .orcamento-card{border:1px solid #bdbdbd;background:#f8f8f8;min-height:0}
      .orcamento-tabs{display:flex;gap:3px;align-items:flex-end;flex-wrap:wrap;padding:0 0 0 0;margin-bottom:4px}
      .orcamento-tab-btn{border:1px solid #bcbcbc;border-bottom:none;background:#efefef;padding:4px 10px 5px;font:12px Tahoma,sans-serif;color:#111}
      .orcamento-tab-btn.active{background:#fff;font-weight:700;position:relative;top:1px}
      .orcamento-pane{border:1px solid #bcbcbc;background:#fff;padding:10px;min-height:176px}
      .orcamento-pane.hidden{display:none !important}
      .orcamento-form-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(220px,.72fr);gap:12px;align-items:start}
      .orcamento-form-list{display:grid;gap:8px}
      .orcamento-form-line{display:grid;grid-template-columns:auto minmax(90px,132px);gap:10px;align-items:center}
      .orcamento-form-line label{white-space:nowrap}
      .orcamento-form-line .orcamento-box,.orcamento-form-line .orcamento-input,.orcamento-form-line .orcamento-select{width:100%}
      .orcamento-form-side{display:grid;gap:8px}
      .orcamento-form-small{display:grid;grid-template-columns:90px minmax(0,1fr);gap:8px;align-items:center}
      .orcamento-form-small label{white-space:nowrap}
      .orcamento-flagline{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
      .orcamento-flagline button{min-height:24px;padding:0 8px;border:1px solid #c6c6c6;background:#f5f5f5}
      .orcamento-side-table{border:1px solid #bdbdbd;background:#fff;min-height:0}
      .orcamento-side-table-head{display:grid;grid-template-columns:54px 54px 90px minmax(0,1fr) 86px;gap:0;border-bottom:1px solid #d9d9d9;background:#f5f5f5}
      .orcamento-side-table-head div{padding:4px 6px;font-weight:400;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .orcamento-side-table-body{max-height:296px;overflow:auto}
      .orcamento-side-row{display:grid;grid-template-columns:54px 54px 90px minmax(0,1fr) 86px;gap:0;border-bottom:1px solid #e5e5e5;min-height:24px;align-items:center}
      .orcamento-side-row div{padding:4px 6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .orcamento-side-row:nth-child(odd){background:#fbfbfb}
      .orcamento-side-row.is-selected{background:#0a78d4;color:#fff}
      .orcamento-status{padding:3px 0 0;color:#555;font:12px Tahoma,sans-serif}
      .orcamento-split{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:8px}
      .orcamento-mini-grid{display:grid;gap:6px}
      .orcamento-mini-field{display:grid;grid-template-columns:minmax(165px,1fr) 110px;gap:8px;align-items:center}
      .orcamento-mini-field .orcamento-input,.orcamento-mini-field .orcamento-box{width:100%}
      .orcamento-mini-inline{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
      .orcamento-mini-inline > *{min-height:24px}
      .orcamento-mini-inline .orcamento-select,.orcamento-mini-inline .orcamento-input{width:auto;min-width:86px}
      .orcamento-check{display:flex;gap:6px;align-items:center}
      .orcamento-comissoes-toolbar{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px}
      .orcamento-comissoes-toolbar button{min-height:24px;padding:0 8px;border:1px solid #c6c6c6;background:#f5f5f5}
      .orcamento-comissoes-table{width:100%;border-collapse:collapse;table-layout:fixed;font:12px Tahoma,sans-serif}
      .orcamento-comissoes-table th,.orcamento-comissoes-table td{border-right:1px solid #d9d9d9;border-bottom:1px solid #d9d9d9;padding:4px 6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .orcamento-comissoes-table th:last-child,.orcamento-comissoes-table td:last-child{border-right:none}
      .orcamento-comissoes-table thead th{background:#f5f5f5;font-weight:400}
      .orcamento-comissoes-table tbody tr:nth-child(odd) td{background:#fcfcfc}
      @media (max-width: 1180px){
        .orcamento-bottom{grid-template-columns:1fr}
      }
      @media (max-width: 860px){
        .orcamento-context,.orcamento-form-grid,.orcamento-split{grid-template-columns:1fr}
        .orcamento-side-table-head,.orcamento-side-row{grid-template-columns:42px 42px 70px minmax(0,1fr) 72px}
      }
    `;
    document.head.appendChild(style);
  }

  function treatmentLabel(item) {
    if (!item) return "";
    const numero = item.nrotra || item.numero || item.id || "";
    const data = formatDate(item.data_inicio || item.data || "");
    const situacao = String(item.situacao || "").trim();
    return [numero ? `Tratamento ${numero}` : "", data, situacao].filter(Boolean).join(" - ");
  }

  function buildTabButtons(activeTab) {
    const tabs = ["principal", "detalhes", "convenio", "ortodontia", "comissoes"];
    const labels = {
      principal: "Principal",
      detalhes: "Detalhes",
      convenio: "Convênio",
      ortodontia: "Ortodontia",
      comissoes: "Comissões",
    };
    return tabs.map((tab) => `<button type="button" class="orcamento-tab-btn${tab === activeTab ? " active" : ""}" data-orcamento-tab="${tab}">${labels[tab]}</button>`).join("");
  }

  function renderPrincipalPane(snapshot) {
    const p = snapshot?.treatmentData?.principal || {};
    const principal = [
      { label: "Valor total........... R$", value: money(p.valor_total) },
      { label: "% de desconto...........", value: String(num(p.desconto_percentual, 0)).replace(".", ",") },
      { label: "Valor corrigido......", value: money(p.valor_corrigido) },
      { label: "Total já pago....... R$", value: money(p.total_ja_pago) },
      { label: "Total a pagar....... R$", value: money(p.total_a_pagar) },
    ];
    return `
      <div class="orcamento-form-grid">
        <div class="orcamento-form-list">
          ${principal
            .map(
              (item) => `
                <div class="orcamento-form-line">
                  <label>${esc(item.label)}</label>
                  <input class="orcamento-input" type="text" value="${esc(item.value)}" readonly>
                </div>`
            )
            .join("")}
        </div>
        <div class="orcamento-form-side">
          <div class="orcamento-form-small">
            <label>Índice:</label>
            <select class="orcamento-select" data-orcamento-action="indice">
              ${INDEX_OPTIONS.map((opt) => `<option value="${esc(opt.value)}"${String(p.indice || "R$") === opt.value ? " selected" : ""}>${esc(opt.label)}</option>`).join("")}
            </select>
          </div>
          <div class="orcamento-form-small">
            <label>Parcelas:</label>
            <input class="orcamento-input" type="number" min="1" step="1" value="${esc(String(num(p.parcelas, 1)))}">
          </div>
          <div class="orcamento-flagline">
            <button type="button" data-orcamento-action="calcular-juros">Calcular juros...</button>
          </div>
          <div class="orcamento-form-small">
            <label>Valor da diferença:</label>
            <input class="orcamento-input" type="text" value="${esc(money(p.valor_diferenca))}" readonly>
          </div>
          <div class="orcamento-flagline">
            <button type="button" data-orcamento-action="recalcular-parcelas">Recalcular parcelas...</button>
          </div>
        </div>
      </div>
    `;
  }

  function renderDetalhesPane(snapshot) {
    const d = snapshot?.treatmentData?.detalhes || {};
    return `
      <div class="orcamento-mini-grid">
        <div class="orcamento-mini-field"><label>Nº tratamento:</label><input class="orcamento-input" type="text" value="${esc(String(d.nro_tratamento || ""))}" readonly></div>
        <div class="orcamento-mini-field"><label>Validade:</label><input class="orcamento-input" type="text" value="${esc(String(d.validade || ""))}" readonly></div>
        <div class="orcamento-mini-field"><label>Criação do tratamento:</label><input class="orcamento-input" type="text" value="${esc(String(d.criacao_tratamento || ""))}" readonly></div>
        <div class="orcamento-mini-field"><label>Última alteração:</label><input class="orcamento-input" type="text" value="${esc(String(d.ultima_alteracao || ""))}" readonly></div>
        <div class="orcamento-mini-field"><label>Última aprovação:</label><input class="orcamento-input" type="text" value="${esc(String(d.ultima_aprovacao || ""))}" readonly></div>
      </div>
    `;
  }

  function renderConvenioPane(snapshot) {
    const c = snapshot?.treatmentData?.convenio || {};
    return `
      <div class="orcamento-mini-grid">
        <div class="orcamento-mini-field"><label>Nº da guia de tratamento:</label><input class="orcamento-input" type="text" value="${esc(String(c.numero_guia_tratamento || ""))}" readonly></div>
        <div class="orcamento-mini-field"><label>Senha de autorização:</label><input class="orcamento-input" type="text" value="${esc(String(c.senha_autorizacao || ""))}" readonly></div>
        <div class="orcamento-mini-field"><label>Total de repasse previsto:</label><input class="orcamento-input" type="text" value="${esc(money(c.total_repasse_previsto))}" readonly></div>
        <div class="orcamento-mini-field"><label>Data prevista de pagamento:</label><input class="orcamento-input" type="text" value="${esc(String(c.data_prevista_pagamento || ""))}" readonly></div>
      </div>
    `;
  }

  function renderOrtodontiaPane(snapshot) {
    const o = snapshot?.treatmentData?.ortodontia || {};
    return `
      <div class="orcamento-mini-grid">
        <div class="orcamento-mini-field"><label>Valor da manutenção:</label><div class="orcamento-mini-inline"><select class="orcamento-select"><option value="${esc(String(o.valor_manutencao_moeda || "R$"))}">${esc(String(o.valor_manutencao_moeda || "R$"))}</option></select><input class="orcamento-input" type="text" value="${esc(money(o.valor_manutencao))}" readonly></div></div>
        <div class="orcamento-mini-field"><label>Vencimento:</label><div class="orcamento-mini-inline"><span>Dia:</span><input class="orcamento-input" type="number" value="${esc(String(num(o.vencimento_dia, 0)))}" readonly></div></div>
        <div class="orcamento-mini-field"><label>Término previsto:</label><input class="orcamento-input" type="text" value="${esc(String(o.termino_previsto || ""))}" readonly></div>
        <div class="orcamento-check"><input type="checkbox"${o.ativar_manutencao ? " checked" : ""} disabled><span>Ativar manutenção de Ortodontia</span></div>
      </div>
    `;
  }

  function renderComissoesPane(snapshot) {
    const comissoes = Array.isArray(snapshot?.treatmentData?.comissoes) ? snapshot.treatmentData.comissoes : [];
    const rows = comissoes.length
      ? comissoes.map((item, idx) => `
          <tr data-orcamento-comissao-id="${esc(String(item.id ?? idx + 1))}">
            <td>${esc(String(item.numero ?? idx + 1))}</td>
            <td style="text-align:right">${esc(money(item.valor))}</td>
            <td>${esc(String(item.cirurgiao || ""))}</td>
            <td style="text-align:right">${esc(String(item.percentual ?? ""))}</td>
            <td style="text-align:right">${esc(money(item.comissao))}</td>
          </tr>`).join("")
      : `<tr><td colspan="5"><div class="orcamento-empty">Sem comissões para este tratamento.</div></td></tr>`;
    return `
      <div class="orcamento-comissoes-toolbar">
        <button type="button" data-orcamento-action="insere-comissao">Insere comissão...</button>
        <button type="button" data-orcamento-action="elimina-comissao">Elimina comissão</button>
        <button type="button" data-orcamento-action="distribui-comissao">Distribui</button>
      </div>
      <table class="orcamento-comissoes-table">
        <thead>
          <tr><th style="width:50px">Nº</th><th style="width:92px">Valor</th><th>Cirurgião</th><th style="width:64px">%</th><th style="width:96px">Comissão</th></tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;
  }

  function renderTabPane(snapshot, tab) {
    if (tab === "detalhes") return renderDetalhesPane(snapshot);
    if (tab === "convenio") return renderConvenioPane(snapshot);
    if (tab === "ortodontia") return renderOrtodontiaPane(snapshot);
    if (tab === "comissoes") return renderComissoesPane(snapshot);
    return renderPrincipalPane(snapshot);
  }

  function renderIntervencoes(snapshot) {
    const items = Array.isArray(snapshot?.treatmentData?.intervencoes) ? snapshot.treatmentData.intervencoes : [];
    if (!items.length) {
      return `<tr><td colspan="6"><div class="orcamento-empty">Nenhuma intervenção carregada para este tratamento.</div></td></tr>`;
    }
    return items
      .map((item, index) => {
        const selected = Number(snapshot.selectedInterventionId || 0) === Number(item?.id || 0);
        const region = String(item.regiao || item.região || item.regiao_codigo || "");
        const codigo = String(item.codigo || item.procedimento_codigo || "");
        const cirurgiao = String(item.cirurgiao || item.cirurgiao_responsavel_nome || "");
        const intervencao = String(item.intervencao || item.procedimento || item.nome || "");
        return `
          <tr data-orcamento-intervencao-id="${esc(String(item.id ?? index + 1))}" class="${selected ? "is-selected" : ""}">
            <td>${esc(region)}</td>
            <td>${esc(codigo)}</td>
            <td>${esc(cirurgiao)}</td>
            <td>${esc(intervencao)}</td>
            <td style="text-align:right">${esc(money((item.paciente_valor ?? item.valor_paciente ?? item.valor) || 0))}</td>
            <td style="text-align:right">${esc(money((item.convenio_valor ?? item.valor_convenio) || 0))}</td>
          </tr>`;
      })
      .join("");
  }

  function renderParcelas(snapshot) {
    const items = Array.isArray(snapshot?.treatmentData?.parcelas) ? snapshot.treatmentData.parcelas : [];
    if (!items.length) {
      return `<div class="orcamento-empty" style="padding:10px">Sem parcelas.</div>`;
    }
    return items
      .map((item, index) => {
        const selected = Number(snapshot.selectedParcelId || 0) === Number(item?.numero || index + 1);
        return `
          <div class="orcamento-side-row${selected ? " is-selected" : ""}" data-orcamento-parcela-id="${esc(String(item.numero ?? index + 1))}">
            <div>${esc(String(item.numero ?? index + 1))}</div>
            <div>${esc(String(item.dia || ""))}</div>
            <div>${esc(formatDate(item.data || ""))}</div>
            <div style="text-align:right">${esc(money(item.valor))}</div>
            <div style="text-align:right">${esc(money(item.credito))}</div>
          </div>`;
      })
      .join("");
  }

  function getPanelElements() {
    return {
      panel: document.getElementById(PANEL_ID),
      btnEdit: document.getElementById("orcamento-btn-edit"),
      btnDelete: document.getElementById("orcamento-btn-delete"),
      btnApprove: document.getElementById("orcamento-btn-approve"),
      btnPrint: document.getElementById("orcamento-btn-print"),
      btnClose: document.getElementById("orcamento-btn-close"),
      patientLabel: document.getElementById("orcamento-paciente-text"),
      patientBtn: document.getElementById("orcamento-paciente-btn"),
      treatmentSelect: document.getElementById("orcamento-tratamento-select"),
      interventionsBody: document.getElementById("orcamento-intervencoes-tbody"),
      tabs: Array.from(document.querySelectorAll("[data-orcamento-tab]")),
      tabPanels: {
        principal: document.getElementById("orcamento-pane-principal"),
        detalhes: document.getElementById("orcamento-pane-detalhes"),
        convenio: document.getElementById("orcamento-pane-convenio"),
        ortodontia: document.getElementById("orcamento-pane-ortodontia"),
        comissoes: document.getElementById("orcamento-pane-comissoes"),
      },
      parcelRows: document.getElementById("orcamento-parcelas-rows"),
      status: document.getElementById("orcamento-status"),
      footerHint: document.getElementById("orcamento-footer-hint"),
    };
  }

  function panelHtml() {
    return `
      <section id="${PANEL_ID}" class="orcamento-panel hidden">
        <div class="orcamento-shell">
          <div class="orcamento-toolbar">
            <button id="orcamento-btn-edit" type="button" class="orcamento-btn"><img src="/desktop-assets/editar.png" alt="">Altera intervenção</button>
            <button id="orcamento-btn-delete" type="button" class="orcamento-btn"><img src="/desktop-assets/eliminar.png" alt="">Elimina intervenção</button>
            <button id="orcamento-btn-approve" type="button" class="orcamento-btn"><img src="/desktop-assets/gravar.png" alt="">Aprova intervenção</button>
            <button id="orcamento-btn-print" type="button" class="orcamento-btn"><img src="/desktop-assets/impressora.png" alt="">Imprime</button>
            <button id="orcamento-btn-close" type="button" class="orcamento-btn"><img src="/desktop-assets/cancela.png" alt="">Fecha</button>
          </div>

          <div class="orcamento-context">
            <div class="orcamento-field">
              <label>Paciente:</label>
              <div class="orcamento-paciente-row">
                <div id="orcamento-paciente-text" class="orcamento-box">Selecione um paciente.</div>
                <button id="orcamento-paciente-btn" type="button" class="orcamento-paciente-btn" title="Abrir Menu de pacientes"><img src="/desktop-assets/pasta.png" alt=""></button>
              </div>
            </div>
            <div class="orcamento-field">
              <label for="orcamento-tratamento-select">Tratamento:</label>
              <select id="orcamento-tratamento-select" class="orcamento-select"></select>
            </div>
          </div>

          <div class="orcamento-grid">
            <table class="orcamento-table">
              <thead>
                <tr>
                  <th style="width:90px">Região</th>
                  <th style="width:88px">Código</th>
                  <th style="width:120px">Cirurgião</th>
                  <th>Intervenção</th>
                  <th style="width:92px">Paciente R$</th>
                  <th style="width:92px">Convênio R$</th>
                </tr>
              </thead>
              <tbody id="orcamento-intervencoes-tbody"></tbody>
            </table>
          </div>

          <div class="orcamento-bottom">
            <div>
              <div class="orcamento-tabs" id="orcamento-tabs">
                ${buildTabButtons("principal")}
              </div>
              <div class="orcamento-pane">
                <div id="orcamento-pane-principal" class="orcamento-pane-content"></div>
                <div id="orcamento-pane-detalhes" class="orcamento-pane-content hidden"></div>
                <div id="orcamento-pane-convenio" class="orcamento-pane-content hidden"></div>
                <div id="orcamento-pane-ortodontia" class="orcamento-pane-content hidden"></div>
                <div id="orcamento-pane-comissoes" class="orcamento-pane-content hidden"></div>
              </div>
            </div>

            <div class="orcamento-side-table">
              <div class="orcamento-side-table-head">
                <div>Nº</div>
                <div>Dia</div>
                <div>Data</div>
                <div>Valor</div>
                <div>Crédito</div>
              </div>
              <div id="orcamento-parcelas-rows" class="orcamento-side-table-body"></div>
            </div>
          </div>

          <div id="orcamento-status" class="orcamento-status">Orçamento não aprovado</div>
          <div id="orcamento-footer-hint" class="orcamento-status"></div>
        </div>
      </section>
    `;
  }

  function ensurePanelRoot() {
    ensureStyle();
    let panel = document.getElementById(PANEL_ID);
    if (panel) return panel;
    const workspaceEmpty = typeof window !== "undefined" ? window.workspaceEmpty : null;
    const anchor = workspaceEmpty instanceof HTMLElement ? workspaceEmpty : document.getElementById("workspace-empty");
    if (!anchor || typeof anchor.insertAdjacentHTML !== "function") return null;
    anchor.insertAdjacentHTML("afterend", panelHtml());
    panel = document.getElementById(PANEL_ID);
    try {
      if (typeof ensurePanelChrome === "function") ensurePanelChrome(panel);
    } catch {}
    return panel;
  }

  function mountPanel() {
    const panel = ensurePanelRoot();
    if (!panel) return null;
    const cfg = getPanelElements();
    return cfg;
  }

  function renderTreatmentSelect(snapshot) {
    const options = Array.isArray(snapshot?.treatments) ? snapshot.treatments : [];
    const currentId = Number(snapshot?.selectedTreatmentId || 0) || 0;
    if (!options.length) {
      return `<option value="">Nenhum tratamento encontrado</option>`;
    }
    return options
      .map((item) => {
        const id = Number(item?.id || 0) || 0;
        const selected = id === currentId ? " selected" : "";
        return `<option value="${esc(String(id))}"${selected}>${esc(treatmentLabel(item) || `Tratamento ${id}`)}</option>`;
      })
      .join("");
  }

  function render(snapshot = {}) {
    const cfg = getPanelElements();
    if (!cfg.panel) return null;
    if (cfg.patientLabel) {
      cfg.patientLabel.textContent = snapshot.patientLabel || "Selecione um paciente.";
      cfg.patientLabel.title = snapshot.patientLabel || "Selecione um paciente.";
      cfg.patientLabel.classList.toggle("is-empty", !snapshot.patientLabel);
    }
    if (cfg.treatmentSelect) {
      cfg.treatmentSelect.innerHTML = renderTreatmentSelect(snapshot);
      const target = String(snapshot.selectedTreatmentId || "");
      if (target) cfg.treatmentSelect.value = target;
    }
    if (cfg.interventionsBody) {
      cfg.interventionsBody.innerHTML = renderIntervencoes(snapshot);
    }
    if (cfg.parcelRows) {
      cfg.parcelRows.innerHTML = renderParcelas(snapshot);
    }
    const tabs = ["principal", "detalhes", "convenio", "ortodontia", "comissoes"];
    tabs.forEach((tab) => {
      const pane = cfg.tabPanels[tab];
      if (!pane) return;
      pane.innerHTML = renderTabPane(snapshot, tab);
      pane.classList.toggle("hidden", tab !== snapshot.activeTab);
    });
    if (cfg.tabs?.length) {
      cfg.tabs.forEach((btn) => btn.classList.toggle("active", String(btn.dataset.orcamentoTab || "") === String(snapshot.activeTab || "principal")));
    }
    if (cfg.status) {
      const tratamento = snapshot.treatmentData?.tratamento || null;
      const aprovado = !!tratamento?.aprovado;
      cfg.status.textContent = aprovado ? "Orçamento aprovado" : "Orçamento não aprovado";
    }
    if (cfg.footerHint) {
      cfg.footerHint.textContent = snapshot.notice || snapshot.error || (snapshot.loading ? "Carregando orçamento..." : "");
    }
    return cfg;
  }

  function bindControls(handlers = {}) {
    const cfg = getPanelElements();
    if (!cfg.panel || cfg.panel.dataset.orcamentoBound === "1") return cfg;
    cfg.panel.dataset.orcamentoBound = "1";

    cfg.panel.addEventListener("click", (ev) => {
      const tabBtn = ev.target?.closest ? ev.target.closest("[data-orcamento-tab]") : null;
      if (tabBtn) {
        handlers.onTabChange?.(String(tabBtn.dataset.orcamentoTab || ""));
        return;
      }
      const actionBtn = ev.target?.closest ? ev.target.closest("[data-orcamento-action]") : null;
      if (actionBtn) {
        handlers.onAction?.(String(actionBtn.dataset.orcamentoAction || ""));
        return;
      }
      const row = ev.target?.closest ? ev.target.closest("[data-orcamento-intervencao-id]") : null;
      if (row) {
        handlers.onInterventionSelect?.(Number(row.dataset.orcamentoIntervencaoId || 0) || 0);
        return;
      }
      const parcel = ev.target?.closest ? ev.target.closest("[data-orcamento-parcela-id]") : null;
      if (parcel) {
        handlers.onParcelSelect?.(Number(parcel.dataset.orcamentoParcelaId || 0) || 0);
      }
    });

    cfg.panel.addEventListener("dblclick", (ev) => {
      const row = ev.target?.closest ? ev.target.closest("[data-orcamento-intervencao-id]") : null;
      if (row) {
        handlers.onInterventionDblClick?.(Number(row.dataset.orcamentoIntervencaoId || 0) || 0);
        return;
      }
      const parcel = ev.target?.closest ? ev.target.closest("[data-orcamento-parcela-id]") : null;
      if (parcel) {
        handlers.onParcelDblClick?.(Number(parcel.dataset.orcamentoParcelaId || 0) || 0);
      }
    });

    cfg.treatmentSelect?.addEventListener("change", () => {
      handlers.onTreatmentChange?.(Number(cfg.treatmentSelect?.value || 0) || 0);
    });
    cfg.btnEdit?.addEventListener("click", () => handlers.onAction?.("edit-intervencao"));
    cfg.btnDelete?.addEventListener("click", () => handlers.onAction?.("delete-intervencao"));
    cfg.btnApprove?.addEventListener("click", () => handlers.onAction?.("approve-intervencao"));
    cfg.btnPrint?.addEventListener("click", () => handlers.onAction?.("print"));
    cfg.btnClose?.addEventListener("click", () => handlers.onClose?.());
    cfg.patientBtn?.addEventListener("click", () => handlers.onPatientMenu?.());

    return cfg;
  }

  window.BranaOrcamentoRenderV1 = Object.freeze({
    moduleName: MODULE_NAME,
    ensureStyle,
    panelHtml,
    ensurePanelRoot,
    mountPanel,
    render,
    bindControls,
    getPanelElements,
  });
})();
