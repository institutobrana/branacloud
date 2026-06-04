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

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .odonto-v1-arcada{display:grid;gap:14px}
      .odonto-v1-arch{border:1px solid #d7e0ea;background:linear-gradient(180deg,#fff 0%,#fbfdff 100%);box-shadow:0 1px 2px rgba(16,24,40,.03)}
      .odonto-v1-arch-head{display:flex;justify-content:space-between;gap:10px;align-items:center;padding:8px 10px;border-bottom:1px solid #e5ecf3;background:#f5f8fc}
      .odonto-v1-arch-title{font:700 12px Tahoma,sans-serif;color:#223244;text-transform:uppercase;letter-spacing:.02em}
      .odonto-v1-arch-note{font:11px Tahoma,sans-serif;color:#657381}
      .odonto-v1-arch-body{padding:12px 10px 14px}
      .odonto-v1-arch-canvas{position:relative;height:clamp(184px,18vw,226px);min-height:184px;overflow:hidden;border-radius:14px;background:linear-gradient(180deg,rgba(245,248,252,.8) 0%,rgba(255,255,255,.9) 56%,rgba(241,246,251,.95) 100%)}
      .odonto-v1-arch-canvas::before{content:"";position:absolute;inset:14px 12px 16px;border-radius:999px;border:1px solid rgba(141,177,214,.28);opacity:.72;pointer-events:none}
      .odonto-v1-arch-canvas.is-upper::before{transform:translateY(12px) scaleY(.78)}
      .odonto-v1-arch-canvas.is-lower::before{transform:translateY(-12px) scaleY(.78)}
      .odonto-v1-arch-canvas::after{content:"";position:absolute;left:8%;right:8%;height:1px;bottom:18px;background:linear-gradient(90deg,transparent 0%,rgba(142,180,221,.34) 16%,rgba(142,180,221,.22) 50%,rgba(142,180,221,.34) 84%,transparent 100%);pointer-events:none}
      .odonto-v1-arch-canvas.is-upper::after{bottom:26px}
      .odonto-v1-arch-canvas.is-lower::after{bottom:10px}
      .odonto-v1-tooth{position:absolute;box-sizing:border-box;width:clamp(34px,4.7vw,56px);height:clamp(94px,10.8vw,124px);padding:7px 6px 6px;border:1px solid #d7e0ea;border-radius:18px 18px 12px 12px;background:linear-gradient(180deg,#fff 0%,#f8fbfe 48%,#eef3f8 100%);box-shadow:0 1px 2px rgba(16,24,40,.04);transform:translateX(-50%);display:grid;grid-template-rows:auto 1fr auto;gap:4px;align-content:start;justify-items:stretch}
      .odonto-v1-tooth::before{content:"";position:absolute;left:50%;top:24px;transform:translateX(-50%);width:18px;height:34px;border-radius:9px 9px 12px 12px;background:linear-gradient(180deg,rgba(255,255,255,.85) 0%,rgba(248,251,255,.9) 42%,rgba(226,233,241,.95) 100%);opacity:.5;pointer-events:none}
      .odonto-v1-tooth.is-empty{border-style:dashed;background:linear-gradient(180deg,#fff 0%,#fcfdff 100%)}
      .odonto-v1-tooth.is-upper{border-top:3px solid #8eb4dd}
      .odonto-v1-tooth.is-lower{border-bottom:3px solid #8eb4dd}
      .odonto-v1-tooth.is-upper{align-self:start}
      .odonto-v1-tooth.is-lower{align-self:end}
      .odonto-v1-tooth-head{display:flex;justify-content:space-between;gap:6px;align-items:flex-start;position:relative;z-index:1}
      .odonto-v1-tooth-fdi{font:700 10px Tahoma,sans-serif;color:#223244;text-transform:uppercase;letter-spacing:.03em;white-space:nowrap}
      .odonto-v1-tooth-state{font:700 10px Tahoma,sans-serif;color:#4d6277;text-transform:uppercase;letter-spacing:.02em;white-space:nowrap}
      .odonto-v1-tooth-body{display:grid;place-items:center;min-height:38px;font:700 15px Tahoma,sans-serif;color:#10202f;line-height:1.05;position:relative;z-index:1}
      .odonto-v1-tooth.is-empty .odonto-v1-tooth-body{color:#8997a5;font-weight:400}
      .odonto-v1-tooth-foot{font:11px Tahoma,sans-serif;color:#607080;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;position:relative;z-index:1}
      .odonto-v1-arcada-empty{padding:16px 12px;border:1px dashed #d7e0ea;background:#fcfdff;color:#607080;font:12px Tahoma,sans-serif}
      @media (max-width: 1180px){
        .odonto-v1-arch-canvas{height:clamp(180px,28vw,214px)}
      }
      @media (max-width: 760px){
        .odonto-v1-arch-canvas{height:clamp(168px,40vw,208px)}
        .odonto-v1-tooth{width:clamp(32px,10vw,48px);height:clamp(88px,26vw,112px)}
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

  function getSlotGeometry(index, total, archName) {
    const safeTotal = Math.max(1, num(total, 1));
    const t = safeTotal === 1 ? 0.5 : index / (safeTotal - 1);
    const curve = Math.sin(Math.PI * t);
    const left = 4 + t * 92;
    const width = clamp(4.55 - Math.abs(t - 0.5) * 0.3, 4.1, 4.8);
    const lift = Math.round(curve * 18);

    if (archName === "superior") {
      return {
        left,
        width,
        top: 10 + lift,
        edge: "top",
      };
    }

    return {
      left,
      width,
      bottom: 10 + (18 - lift),
      edge: "bottom",
    };
  }

  function renderSlot(slot, archName, index, total) {
    const slotOrdem = num(slot?.slot_ordem);
    const numeroDente = num(slot?.numero_dente_fdi);
    const tipo = String(slot?.tipo_slot || archName || "arcada").trim();
    const observacao = String(slot?.observacao || "").trim();
    const vazio = !numeroDente;
    const estado = vazio ? "vazio" : tipo || "dente";
    const geometry = getSlotGeometry(index, total, archName);
    const style = [
      `left:${geometry.left.toFixed(2)}%`,
      `width:${geometry.width.toFixed(2)}%`,
      `${geometry.edge}:${geometry[geometry.edge]}px`,
    ].join(";");

    return `
      <article
        class="odonto-v1-tooth${vazio ? " is-empty" : ""}${archName === "superior" ? " is-upper" : " is-lower"}"
        style="${style}"
        title="${escHtml(observacao || tipo)}"
      >
        <div class="odonto-v1-tooth-head">
          <span class="odonto-v1-tooth-fdi">FDI ${escHtml(vazio ? "—" : numeroDente)}</span>
          <span class="odonto-v1-tooth-state">${escHtml(estado)}</span>
        </div>
        <div class="odonto-v1-tooth-body">${escHtml(vazio ? "-" : numeroDente)}</div>
        <div class="odonto-v1-tooth-foot">Pos. ${escHtml(slotOrdem || "—")} • ${escHtml(observacao || "Sem observacao")}</div>
      </article>
    `;
  }

  function renderArch(title, note, slots, archName) {
    const lista = Array.isArray(slots) ? slots : [];
    const count = lista.length;
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
          <div class="odonto-v1-arch-canvas ${archName === "superior" ? "is-upper" : "is-lower"}">
            ${lista.map((slot, index) => renderSlot(slot, archName, index, count)).join("")}
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
    const superiorNote = String(options.superiorNote || "Leitura visual superior, com composição baseada em referência odontológica.").trim();
    const inferiorNote = String(options.inferiorNote || "Leitura visual inferior, com composição baseada em referência odontológica.").trim();

    container.innerHTML = `
      <div class="odonto-v1-arcada">
        ${renderArch(superiorLabel, superiorNote, superior, "superior")}
        ${renderArch(inferiorLabel, inferiorNote, inferior, "inferior")}
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
