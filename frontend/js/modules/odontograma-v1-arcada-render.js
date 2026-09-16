(function () {
  "use strict";

  const MODULE_NAME = "BranaOdontoArcadaV1Renderer";
  const STYLE_ID = "odonto-v1-arcada-style";
  const EASY_BASE = "/desktop-assets/easy";
  const BITMAP_BASE = "/desktop-assets/Bitmaps";
  const DENTE_BASE = BITMAP_BASE;

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

  function normalizeText(value) {
    return String(value ?? "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .odonto-v1-arcada{display:grid;gap:0}
      .odonto-v1-arch{border:1px solid #d7e0ea;background:linear-gradient(180deg,#fff 0%,#fbfdff 100%);box-shadow:0 1px 2px rgba(16,24,40,.03)}
      .odonto-v1-arch-head{display:none}
      .odonto-v1-arch-body{padding:0 2px 0}
      .odonto-v1-arch-canvas{position:relative;overflow:hidden;border-radius:8px;background:linear-gradient(180deg,rgba(245,248,252,.8) 0%,rgba(255,255,255,.9) 56%,rgba(241,246,251,.95) 100%)}
      .odonto-v1-arch-base{display:block;width:100%;height:auto;user-select:none;-webkit-user-drag:none;pointer-events:none}
      .odonto-v1-arch-overlay{position:absolute;inset:0}
      .odonto-v1-arch-badge{position:absolute;top:4px;left:4px;display:inline-flex;align-items:center;gap:4px;padding:2px 5px;border:1px solid #d8e1eb;border-radius:999px;background:rgba(255,255,255,.88);box-shadow:0 1px 2px rgba(16,24,40,.06)}
      .odonto-v1-arch-badge img{display:block;width:16px;height:16px;user-select:none;-webkit-user-drag:none;pointer-events:none}
      .odonto-v1-arch-badge span{font:700 9px Tahoma,sans-serif;color:#3d4f63;white-space:nowrap}
      .odonto-v1-tooth{position:absolute;box-sizing:border-box;transform:translateX(-50%);width:clamp(13px,3%,18px);aspect-ratio:32 / 70;pointer-events:none}
      .odonto-v1-tooth.is-upper{align-self:start}
      .odonto-v1-tooth.is-lower{align-self:end}
      .odonto-v1-tooth-layer{position:absolute;inset:0}
      .odonto-v1-tooth-layer img{display:block;width:100%;height:100%;user-select:none;-webkit-user-drag:none;pointer-events:none}
      .odonto-v1-tooth-base{z-index:1}
      .odonto-v1-tooth-variant{z-index:2}
      .odonto-v1-tooth-aux{z-index:3}
      .odonto-v1-tooth-overlay{z-index:4}
      .odonto-v1-tooth-face{position:absolute;top:-2px;left:50%;transform:translateX(-50%);width:10px;height:8px;z-index:6}
      .odonto-v1-tooth-face img{display:block;width:100%;height:100%;user-select:none;-webkit-user-drag:none;pointer-events:none}
      .odonto-v1-central-ruler{position:relative;display:grid;grid-template-columns:repeat(16,minmax(0,1fr));gap:0;align-items:stretch;padding:0;margin:-1px 0;background:transparent;z-index:1}
      .odonto-v1-central-ruler .ruler-num{display:flex;align-items:center;justify-content:center;min-width:0;height:16px;margin:0;border:1px solid #aeb8c4;border-left-width:0;background:linear-gradient(180deg,#fefefe 0%,#eef2f6 100%);font:700 9px Tahoma,sans-serif;color:#223244;line-height:1;letter-spacing:0;white-space:nowrap;position:relative;z-index:1;box-sizing:border-box}
      .odonto-v1-central-ruler .ruler-num:first-child{border-left-width:1px}
      .odonto-v1-central-ruler .ruler-num:last-child{border-right-width:1px}
      .odonto-v1-arcada-empty{display:none}
      @media (max-width: 1180px){
        .odonto-v1-tooth{width:clamp(11px,3.6%,16px)}
        .odonto-v1-central-ruler .ruler-num{height:15px;font-size:8px}
      }
      @media (max-width: 760px){
        .odonto-v1-arcada{gap:0}
        .odonto-v1-tooth{width:clamp(10px,4.4%,15px)}
        .odonto-v1-central-ruler .ruler-num{height:14px;font-size:7px}
      }
    `;
    document.head.appendChild(style);
  }

  function splitArchSlots(slots) {
    const lista = Array.isArray(slots)
      ? [...slots].sort((a, b) => num(a.slot_ordem) - num(b.slot_ordem))
      : [];
    if (!lista.length) return { superior: [], inferior: [] };
    if (lista.length <= 16) {
      const metade = Math.max(1, Math.ceil(lista.length / 2));
      return {
        superior: lista.slice(0, metade),
        inferior: lista.slice(metade),
      };
    }
    return {
      superior: lista.slice(0, 16),
      inferior: lista.slice(16, 32),
    };
  }

  function getSlotGeometry(index, total, archName) {
    const safeTotal = Math.max(1, num(total, 1));
    const t = safeTotal === 1 ? 0.5 : index / (safeTotal - 1);
    const curve = Math.sin(Math.PI * t);
    const left = 4 + t * 92;
    const width = clamp(6.2 - Math.abs(t - 0.5) * 0.45, 5.5, 6.4);
    const lift = Math.round(curve * 18);
    const topPct = 10.5 + (lift / 96) * 100;
    const bottomPct = 10.5 + ((18 - lift) / 96) * 100;

    if (archName === "superior") {
      return {
        left,
        width,
        topPct,
        edge: "top",
      };
    }

    return {
      left,
      width,
      bottomPct,
      edge: "bottom",
    };
  }

  function resolveArchBase(archName) {
    return archName === "superior"
      ? `${EASY_BASE}/arc_superior_perm.bmp`
      : `${EASY_BASE}/arc_inferior_perm.bmp`;
  }

  function resolveToothBase(fdi) {
    if (!fdi) return "";
    return `${DENTE_BASE}/arc_dente${fdi}.bmp`;
  }

  function resolveToothVariant(fdi, variant) {
    if (!fdi) return "";
    if (variant === "a") return `${DENTE_BASE}/arc_dente${fdi}a.bmp`;
    if (variant === "b") return `${DENTE_BASE}/arc_dente${fdi}b.bmp`;
    return "";
  }

  function resolveAuxLayers(slot, overlayState) {
    const layers = [];
    const fdi = num(slot?.numero_dente_fdi);
    const archName = String(slot?.archName || slot?.tipo_arcada || "").trim().toLowerCase();
    if (overlayState?.apicecto) {
      layers.push({
        src: archName === "inferior" ? `${BITMAP_BASE}/arc_apicecto_i.bmp` : `${BITMAP_BASE}/arc_apicecto_s.bmp`,
        cls: "aux apicecto",
      });
    }
    if (overlayState?.aumento) {
      layers.push({
        src: archName === "inferior" ? `${BITMAP_BASE}/arc_aumento_i.bmp` : `${BITMAP_BASE}/arc_aumento_s.bmp`,
        cls: "aux aumento",
      });
    }
    if (overlayState?.bandagem && fdi) {
      layers.push({ src: `${BITMAP_BASE}/arc_bandagem_${fdi}.bmp`, cls: "overlay bandagem" });
    }
    if (overlayState?.bloco && fdi) {
      layers.push({ src: `${BITMAP_BASE}/arc_bloco_${fdi}.bmp`, cls: "overlay bloco" });
    }
    return layers;
  }

  function resolveClinicalOverlays(slot, overlayState) {
    const layers = [];
    const fdi = num(slot?.numero_dente_fdi);
    const archSuffix = String(slot?.archName || "").trim().toLowerCase() === "inferior" ? "i" : "s";
    if (!fdi) return layers;

    const markers = overlayState?.byTooth?.get(fdi) || new Set();
    if (markers.has("coroa")) layers.push(`${BITMAP_BASE}/arc_coroa_${fdi}.bmp`);
    if (markers.has("canal")) layers.push(`${BITMAP_BASE}/arc_canal_${fdi}.bmp`);
    if (markers.has("capeamento")) layers.push(`${BITMAP_BASE}/arc_capeamento_${fdi}.bmp`);
    if (markers.has("ades")) layers.push(`${BITMAP_BASE}/arc_ades_${archSuffix}.bmp`);
    if (markers.has("bandagem")) layers.push(`${BITMAP_BASE}/arc_bandagem_${fdi}.bmp`);
    if (markers.has("bloco")) layers.push(`${BITMAP_BASE}/arc_bloco_${fdi}.bmp`);
    if (markers.has("implante")) layers.push(`${BITMAP_BASE}/arc_implante_${archSuffix}.bmp`);
    if (markers.has("extracao")) layers.push(`${BITMAP_BASE}/arc_extracao_${archSuffix}.bmp`);
    if (markers.has("enxerto")) layers.push(`${BITMAP_BASE}/arc_enxerto_${archSuffix}.bmp`);
    if (markers.has("remov")) layers.push(`${BITMAP_BASE}/arc_remov1_${archSuffix}.bmp`);
    if (markers.has("total")) layers.push(`${BITMAP_BASE}/arc_total1_${archSuffix}.bmp`);
    if (markers.has("retalho")) layers.push(`${BITMAP_BASE}/arc_retalho_${archSuffix}.bmp`);
    if (markers.has("raspagem")) layers.push(`${BITMAP_BASE}/arc_raspagem_${archSuffix}.bmp`);
    if (markers.has("gengivecto")) layers.push(`${BITMAP_BASE}/arc_gengivecto_${archSuffix}.bmp`);
    if (markers.has("rizectomia")) layers.push(`${BITMAP_BASE}/arc_rizectomia_${fdi}.bmp`);
    if (markers.has("bracket")) layers.push(`${BITMAP_BASE}/arc_bracket_${archSuffix}.bmp`);
    if (markers.has("faces")) layers.push(`${EASY_BASE}/arc_faces.bmp`);
    return layers;
  }

  function inferMarkersFromIntervention(intervencao) {
    const text = normalizeText(
      [
        intervencao?.procedimento_nome,
        intervencao?.observacao_resumida,
        intervencao?.status?.descricao,
      ]
        .filter(Boolean)
        .join(" ")
    );
    const markers = new Set();
    const rules = [
      ["coroa", "coroa"],
      ["canal", "canal"],
      ["capeamento", "capeamento"],
      ["ades", "ades"],
      ["bandagem", "bandagem"],
      ["bloco", "bloco"],
      ["implante", "implante"],
      ["extracao", "extracao"],
      ["enxerto", "enxerto"],
      ["remov", "remov"],
      ["total", "total"],
      ["retalho", "retalho"],
      ["raspagem", "raspagem"],
      ["gengivecto", "gengivecto"],
      ["rizectomia", "rizectomia"],
      ["bracket", "bracket"],
      ["face", "faces"],
      ["apicecto", "apicecto"],
      ["aumento", "aumento"],
      ["banda", "bandagem"],
      ["prova", "faces"],
      ["ajuste", "faces"],
    ];
    for (const [needle, marker] of rules) {
      if (text.includes(needle)) markers.add(marker);
    }
    return markers;
  }

  function buildOverlayState(intervencoes) {
    const byTooth = new Map();
    let hasFaces = false;
    let apicecto = false;
    let aumento = false;
    let bandagem = false;
    let bloco = false;

    for (const intervencao of Array.isArray(intervencoes) ? intervencoes : []) {
      const markers = inferMarkersFromIntervention(intervencao);
      const dentes = Array.isArray(intervencao?.dentes) ? intervencao.dentes : [];
      const faceRows = Array.isArray(intervencao?.faces) ? intervencao.faces : [];

      if (markers.has("apicecto")) apicecto = true;
      if (markers.has("aumento")) aumento = true;
      if (markers.has("bandagem")) bandagem = true;
      if (markers.has("bloco")) bloco = true;
      if (markers.has("faces")) hasFaces = true;

      for (const dente of dentes) {
        const fdi = num(dente?.numero_dente_fdi);
        if (!fdi) continue;
        if (!byTooth.has(fdi)) byTooth.set(fdi, new Set());
        const current = byTooth.get(fdi);
        for (const marker of markers) current.add(marker);
        if (faceRows.length) current.add("faces");
      }

      for (const face of faceRows) {
        const fdi = num(face?.numero_dente_fdi);
        if (!fdi) continue;
        if (!byTooth.has(fdi)) byTooth.set(fdi, new Set());
        const current = byTooth.get(fdi);
        current.add("faces");
        hasFaces = true;
        for (const marker of markers) current.add(marker);
      }
    }

    return {
      byTooth,
      faces: hasFaces,
      apicecto,
      aumento,
      bandagem,
      bloco,
    };
  }

  function renderTooth(slot, archName, index, total, overlayState) {
    const slotOrdem = num(slot?.slot_ordem);
    const numeroDente = num(slot?.numero_dente_fdi);
    const geometry = getSlotGeometry(index, total, archName);
    const vazio = !numeroDente;
    const title = String(slot?.observacao || slot?.tipo_slot || "").trim();
    const auxLayers = resolveAuxLayers({ ...slot, archName }, overlayState);
    const clinicalLayers = resolveClinicalOverlays({ ...slot, archName }, overlayState);

    const style = [
      `left:${geometry.left.toFixed(2)}%`,
      `width:${geometry.width.toFixed(2)}%`,
      `${geometry.edge}:${geometry[geometry.edge === "top" ? "topPct" : "bottomPct"].toFixed(2)}%`,
    ].join(";");

    return `
      <div
        class="odonto-v1-tooth${vazio ? " is-empty" : ""}${archName === "superior" ? " is-upper" : " is-lower"}"
        style="${style}"
        title="${escHtml(title || String(numeroDente || ""))}"
        data-slot-ordem="${escHtml(slotOrdem || "")}"
        data-fdi="${escHtml(numeroDente || "")}"
      >
        ${auxLayers
          .map(
            (layer) => `
              <div class="odonto-v1-tooth-layer tooth-aux odonto-v1-tooth-${escHtml(layer.cls)}">
                <img src="${escHtml(layer.src)}" alt="">
              </div>`
          )
          .join("")}
        ${clinicalLayers
          .map(
            (src) => `
              <div class="odonto-v1-tooth-layer tooth-overlay odonto-v1-tooth-overlay">
                <img src="${escHtml(src)}" alt="">
              </div>`
          )
          .join("")}
        ${overlayState?.byTooth?.get(numeroDente)?.has("faces")
          ? `<div class="odonto-v1-tooth-face"><img src="${EASY_BASE}/arc_faces.bmp" alt=""></div>`
          : ""}
      </div>
    `;
  }

  function renderCentralRuler() {
    const numeros = [8, 7, 6, 5, 4, 3, 2, 1, 1, 2, 3, 4, 5, 6, 7, 8];
    return `
      <div class="odonto-v1-central-ruler" aria-hidden="true">
        ${numeros.map((n) => `<div class="ruler-num">${escHtml(n)}</div>`).join("")}
      </div>
    `;
  }

  function renderArch(title, note, slots, archName, overlayState) {
    const lista = Array.isArray(slots) ? slots : [];
    const count = lista.length;
    const base = resolveArchBase(archName);
    const badges = [];
    if (overlayState?.apicecto) {
      badges.push({
        src: archName === "inferior" ? `${BITMAP_BASE}/arc_apicecto_i.bmp` : `${BITMAP_BASE}/arc_apicecto_s.bmp`,
        label: "Apicecto",
      });
    }
    if (overlayState?.aumento) {
      badges.push({
        src: archName === "inferior" ? `${BITMAP_BASE}/arc_aumento_i.bmp` : `${BITMAP_BASE}/arc_aumento_s.bmp`,
        label: "Aumento",
      });
    }

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
          <div class="odonto-v1-arch-canvas">
            <img class="odonto-v1-arch-base" src="${escHtml(base)}" alt="">
            <div class="odonto-v1-arch-overlay">
              ${badges
                .map(
                  (item, index) => `
                    <div class="odonto-v1-arch-badge" style="top:${8 + index * 24}px">
                      <img src="${item.src}" alt="">
                      <span>${escHtml(item.label)}</span>
                    </div>`
                )
                .join("")}
              ${lista.map((slot, index) => renderTooth(slot, archName, index, count, overlayState)).join("")}
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function renderEmpty(message) {
    const upper = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28].map((fdi, index) => ({
      slot_ordem: index + 1,
      numero_dente_fdi: fdi,
      tipo_slot: "dente",
      archName: "superior",
    }));
    const lower = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38].map((fdi, index) => ({
      slot_ordem: index + 17,
      numero_dente_fdi: fdi,
      tipo_slot: "dente",
      archName: "inferior",
    }));
    const overlayState = buildOverlayState([]);
    return `
      <div class="odonto-v1-arcada">
        ${renderArch("", "", upper, "superior", overlayState)}
        ${renderCentralRuler()}
        ${renderArch("", "", lower, "inferior", overlayState)}
      </div>
    `;
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

    const overlayState = buildOverlayState(options.intervencoes || []);
    const { superior, inferior } = splitArchSlots(lista);
    const superiorLabel = String(options.superiorLabel || "").trim();
    const inferiorLabel = String(options.inferiorLabel || "").trim();
    const superiorNote = String(options.superiorNote || "").trim();
    const inferiorNote = String(options.inferiorNote || "").trim();

    container.innerHTML = `
      <div class="odonto-v1-arcada">
        ${renderArch(superiorLabel, superiorNote, superior, "superior", overlayState)}
        ${renderCentralRuler()}
        ${renderArch(inferiorLabel, inferiorNote, inferior, "inferior", overlayState)}
      </div>
    `;
    return true;
  }

  window.BranaOdontoArcadaV1 = {
    moduleName: MODULE_NAME,
    render,
    renderEmpty,
    splitArchSlots,
    resolveArchBase,
    resolveToothBase,
    resolveToothVariant,
  };
})();
