(function () {
  "use strict";

  const MODULE_NAME = "BranaOdontoHistoryGridV1";
  const STYLE_ID = "odonto-v1-history-grid-style";

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .odonto-v1-history-grid-wrap{min-height:0}
      .odonto-v1-history-grid{width:100%;border-collapse:collapse;table-layout:fixed;font:12px Tahoma,sans-serif;background:#fff}
      .odonto-v1-history-grid th,.odonto-v1-history-grid td{padding:4px 6px;border-bottom:1px solid #d7dfe7;border-right:1px solid #e7edf4;vertical-align:top;background:#fff;box-sizing:border-box}
      .odonto-v1-history-grid th:last-child,.odonto-v1-history-grid td:last-child{border-right:none}
      .odonto-v1-history-grid thead th{background:#f2f6fb;font:700 11px Tahoma,sans-serif;color:#243444;white-space:nowrap}
      .odonto-v1-history-grid tbody tr:nth-child(even) td{background:#fbfdff}
      .odonto-v1-history-grid tbody tr:hover td{background:#eef5ff}
      .odonto-v1-history-grid .mono{font-family:Consolas,Monaco,monospace}
      .odonto-v1-history-grid th:nth-child(1),.odonto-v1-history-grid td:nth-child(1){width:96px;white-space:nowrap}
      .odonto-v1-history-grid th:nth-child(2),.odonto-v1-history-grid td:nth-child(2){width:132px;white-space:nowrap}
      .odonto-v1-history-grid th:nth-child(3),.odonto-v1-history-grid td:nth-child(3){width:120px;white-space:nowrap}
      .odonto-v1-history-grid th:nth-child(4),.odonto-v1-history-grid td:nth-child(4){width:auto;word-break:break-word;overflow-wrap:anywhere}
      .odonto-v1-history-grid-empty{padding:14px 12px;color:#5d6b79;background:#fbfcfe;border:1px dashed #d7dfe8}
      .odonto-v1-history-grid-badge{display:inline-flex;align-items:center;padding:2px 7px;border-radius:999px;border:1px solid #d7e0ea;background:#fff;font:700 10px Tahoma,sans-serif;color:#334155}
    `;
    document.head.appendChild(style);
  }

  function escHtml(value) {
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
    const text = String(value || "").trim();
    return text || "—";
  }

  function formatCirurgiao(item) {
    const prestador = item?.prestador_nome || item?.prestador_nome_completo || item?.cirurgiao_nome || "";
    if (String(prestador).trim()) return String(prestador).trim();
    const id = num(item?.prestador_id);
    return id ? `Prestador ${id}` : "—";
  }

  function formatRegiao(item) {
    const dentes = Array.isArray(item?.dentes) ? item.dentes : [];
    const faces = Array.isArray(item?.faces) ? item.faces : [];
    if (dentes.length) {
      return dentes.map((dente) => String(dente.numero_dente_fdi)).join(", ");
    }
    if (faces.length) {
      return faces
        .map((face) => {
          const tags = [];
          if (face.face_mesial) tags.push("M");
          if (face.face_distal) tags.push("D");
          if (face.face_oclusal) tags.push("O");
          if (face.face_vestibular) tags.push("V");
          if (face.face_lingual) tags.push("L");
          return `${String(face.numero_dente_fdi)}(${tags.length ? tags.join(" ") : "—"})`;
        })
        .join(", ");
    }
    return "—";
  }

  function formatDescricao(item) {
    const proc = String(item?.procedimento_nome || item?.procedimento_descricao || item?.procedimento_id || "—").trim();
    const status = String(item?.status?.descricao || item?.status?.codigo || "").trim();
    const obs = String(item?.observacao_resumida || "").trim();
    const parts = [];
    if (status) parts.push(status);
    if (proc) parts.push(proc);
    if (obs) parts.push(obs);
    return parts.join(" - ") || "—";
  }

  function rowFrom(item) {
    return {
      data: formatDate(item?.data_execucao || item?.data_planejada || item?.data || ""),
      cirurgiao: formatCirurgiao(item),
      regiao: formatRegiao(item),
      descricao: formatDescricao(item),
    };
  }

  function render(root, items, options = {}) {
    ensureStyle();
    if (!root) return false;
    const rows = Array.isArray(items) ? items.map(rowFrom) : [];
    const emptyMessage = String(options.emptyMessage || "Nenhum historico clinico disponivel.").trim();
    if (!rows.length) {
      root.innerHTML = `<div class="odonto-v1-history-grid-empty">${escHtml(emptyMessage)}</div>`;
      return true;
    }
    root.innerHTML = `
      <div class="odonto-v1-history-grid-wrap">
        <table class="odonto-v1-history-grid">
          <thead>
            <tr>
              <th>Data</th>
              <th>Cirurgiao</th>
              <th>Regiao</th>
              <th>Descricao do procedimento</th>
            </tr>
          </thead>
          <tbody>
            ${rows
              .map(
                (row) => `
                  <tr>
                    <td class="mono">${escHtml(row.data)}</td>
                    <td>${escHtml(row.cirurgiao)}</td>
                    <td>${escHtml(row.regiao)}</td>
                    <td>${escHtml(row.descricao)}</td>
                  </tr>
                `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;
    return true;
  }

  window.BranaOdontoHistoryGridV1 = Object.freeze({
    moduleName: MODULE_NAME,
    ensureStyle,
    render,
  });
})();
