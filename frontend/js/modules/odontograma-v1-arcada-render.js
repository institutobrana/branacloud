(function () {
  "use strict";

  const MODULE_NAME = "BranaOdontoArcadaV1Renderer";
  const STYLE_ID = "odonto-v1-arcada-style";

  function num(value, fallback = 0) {
    const n = Number(value || 0);
    return Number.isFinite(n) ? n : fallback;
  }

  function escHtml(value) {
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
      .odonto-v1-arcada{display:grid;gap:12px}
      .odonto-v1-arch{border:1px solid #d7e0ea;background:#fff}
      .odonto-v1-arch-head{display:flex;justify-content:space-between;gap:10px;align-items:center;padding:8px 10px;border-bottom:1px solid #e5ecf3;background:#f5f8fc}
      .odonto-v1-arch-title{font:700 12px Tahoma,sans-serif;color:#223244;text-transform:uppercase;letter-spacing:.02em}
      .odonto-v1-arch-note{font:11px Tahoma,sans-serif;color:#657381}
      .odonto-v1-arch-body{padding:10px}
      .odonto-v1-arch-line{display:grid;grid-template-columns:repeat(16,minmax(0,1fr));gap:6px}
      .odonto-v1-tooth{display:grid;grid-template-rows:auto minmax(46px,1fr) auto;gap:4px;min-height:84px;padding:6px 6px 5px;border:1px solid #d8e2ec;border-radius:10px;background:linear-gradient(180deg,#fff 0%,#f9fbfe 100%);box-sizing:border-box;box-shadow:0 1px 0 rgba(16,24,40,.02)}
      .odonto-v1-tooth.is-empty{border-style:dashed;background:#fcfdff}
      .odonto-v1-tooth.is-upper{border-top:3px solid #8eb4dd}
      .odonto-v1-tooth.is-lower{border-bottom:3px solid #8eb4dd}
      .odonto-v1-tooth-head{display:flex;justify-content:space-between;gap:6px;align-items:flex-start}
      .odonto-v1-tooth-num{font:700 11px Tahoma,sans-serif;color:#213246}
      .odonto-v1-tooth-state{font:700 10px Tahoma,sans-serif;color:#4d6277;text-transform:uppercase;letter-spacing:.02em;white-space:nowrap}
      .odonto-v1-tooth-body{display:grid;place-items:center;min-height:34px;font:700 14px Tahoma,sans-serif;color:#10202f;line-height:1.1}
      .odonto-v1-tooth.is-empty .odonto-v1-tooth-body{color:#8997a5;font-weight:400}
      .odonto-v1-tooth-foot{font:11px Tahoma,sans-serif;color:#607080;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .odonto-v1-arcada-empty{padding:16px 12px;border:1px dashed #d7e0ea;background:#fcfdff;color:#607080;font:12px Tahoma,sans-serif}
      @media (max-width: 1180px){
        .odonto-v1-arch-line{grid-template-columns:repeat(8,minmax(0,1fr))}
      }
      @media (max-width: 760px){
        .odonto-v1-arch-line{grid-template-columns:repeat(4,minmax(0,1fr))}
        .odonto-v1-tooth{min-height:78px}
      }
    `;
    document.head.appendChild(style);
  }

  function splitArchSlots(slots) {
    const lista = Array.isArray(slots)
      ? [...slots].sort((a, b) => num(a.slot_ordem) - num(b.slot_ordem))
      : [];
    if (!lista.length) return { superior: [], inferior: [] };
    const metade = Math.max(1, Math.ceil(lista.length / 2));
    return {
      superior: lista.slice(0, metade),
      inferior: lista.slice(metade),
    };
  }

  function renderSlot(slot, archName) {
    const slotOrdem = num(slot?.slot_ordem);
    const numeroDente = num(slot?.numero_dente_fdi);
    const tipo = String(slot?.tipo_slot || archName || "arcada").trim();
    const observacao = String(slot?.observacao || "").trim();
    const vazio = !numeroDente;
    const estado = vazio ? "vazio" : tipo || "dente";
    return `
      <article class="odonto-v1-tooth${vazio ? " is-empty" : ""}${archName === "superior" ? " is-upper" : " is-lower"}" title="${escHtml(observacao || tipo)}">
        <div class="odonto-v1-tooth-head">
          <span class="odonto-v1-tooth-num">#${escHtml(slotOrdem || "")}</span>
          <span class="odonto-v1-tooth-state">${escHtml(estado)}</span>
        </div>
        <div class="odonto-v1-tooth-body">${escHtml(vazio ? "-" : numeroDente)}</div>
        <div class="odonto-v1-tooth-foot">${escHtml(observacao || "Sem observacao")}</div>
      </article>
    `;
  }

  function renderArch(container, title, note, slots, archName) {
    const count = Array.isArray(slots) ? slots.length : 0;
    return `
      <section class="odonto-v1-arch">
        <div class="odonto-v1-arch-head">
          <div>
            <div class="odonto-v1-arch-title">${escHtml(title)}</div>
            <div class="odonto-v1-arch-note">${escHtml(note)}</div>
          </div>
          <div class="odonto-v1-arch-note">${escHtml(count)} slot(s)</div>
        </div>
        <div class="odonto-v1-arch-body">
          <div class="odonto-v1-arch-line">
            ${slots.map((slot) => renderSlot(slot, archName)).join("")}
          </div>
        </div>
      </section>
    `;
  }

  function renderEmpty(message) {
    return `<div class="odonto-v1-arcada-empty">${escHtml(message)}</div>`;
  }

  function render(container, slots, options = {}) {
    if (!container) return false;
    ensureStyle();

    const lista = Array.isArray(slots) ? slots : [];
    const emptyMessage = String(options.emptyMessage || "Nenhum slot de arcada encontrado para o tratamento selecionado.").trim();
    if (!lista.length) {
      container.innerHTML = renderEmpty(emptyMessage);
      return true;
    }

    const { superior, inferior } = splitArchSlots(lista);
    const superiorLabel = String(options.superiorLabel || "Arcada superior").trim();
    const inferiorLabel = String(options.inferiorLabel || "Arcada inferior").trim();
    const superiorNote = String(options.superiorNote || "Slots posicionados na leitura superior.").trim();
    const inferiorNote = String(options.inferiorNote || "Slots posicionados na leitura inferior.").trim();

    container.innerHTML = `
      <div class="odonto-v1-arcada">
        ${renderArch(container, superiorLabel, superiorNote, superior, "superior")}
        ${renderArch(container, inferiorLabel, inferiorNote, inferior, "inferior")}
      </div>
    `;
    return true;
  }

  window.BranaOdontoArcadaV1 = {
    moduleName: MODULE_NAME,
    render,
    renderEmpty,
    splitArchSlots,
  };
})();
