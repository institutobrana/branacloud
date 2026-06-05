(function () {
  "use strict";

  const MODULE_NAME = "BranaTelaPrincipalOdontologicaOdontograma";
  const STYLE_ID = "brana-odonto-visual-style";
  const SLOT_COUNT = 16;
  const CENTRAL_NUMERACAO = Object.freeze(["8", "7", "6", "5", "4", "3", "2", "1", "1", "2", "3", "4", "5", "6", "7", "8"]);

  const DEFAULT_LEGEND = Object.freeze([
    { codigo: "neutro", descricao: "Neutro", cor: "#d7e0ea" },
    { codigo: "observado", descricao: "Observado", cor: "#9ec5fe" },
    { codigo: "restaurado", descricao: "Restaurado", cor: "#97d8b1" },
    { codigo: "programado", descricao: "Programado", cor: "#f6c768" },
    { codigo: "ausente", descricao: "Ausente", cor: "#b7c0ca" },
  ]);

  function texto(valor, fallback = "") {
    const result = String(valor ?? "").trim();
    return result || String(fallback ?? "").trim();
  }

  function obterModuloAssets() {
    if (typeof globalThis !== "undefined" && globalThis.BranaTelaPrincipalOdontologicaAssets) {
      return globalThis.BranaTelaPrincipalOdontologicaAssets;
    }
    if (typeof window !== "undefined" && window.BranaTelaPrincipalOdontologicaAssets) {
      return window.BranaTelaPrincipalOdontologicaAssets;
    }
    return null;
  }

  function isElementoDom(valor) {
    return typeof HTMLElement !== "undefined" && valor instanceof HTMLElement;
  }

  function normalizarStatus(status) {
    const valor = texto(status, "neutro").toLowerCase();
    if (["observado", "restaurado", "programado", "ausente", "neutro"].includes(valor)) {
      return valor;
    }
    return "neutro";
  }

  function obterLegendas(estado) {
    const legendas = Array.isArray(estado?.legendaOdontograma) && estado.legendaOdontograma.length
      ? estado.legendaOdontograma
      : DEFAULT_LEGEND;
    return legendas.map((item) => ({
      codigo: texto(item.codigo, "neutro"),
      descricao: texto(item.descricao, "Neutro"),
      cor: texto(item.cor, "#d7e0ea"),
    }));
  }

  function toLabel(status) {
    const valor = texto(status, "neutro").toLowerCase();
    if (valor === "observado") return "Obs.";
    if (valor === "restaurado") return "Rest.";
    if (valor === "programado") return "Prog.";
    if (valor === "ausente") return "Aus.";
    return "Neutro";
  }

  function obterCaminhoArcada(arco) {
    const assets = obterModuloAssets();
    if (!assets) return "";
    if (arco === "superior") {
      if (typeof assets.obterCaminhoArcadaSuperior === "function") return texto(assets.obterCaminhoArcadaSuperior(), "");
      if (typeof assets.obterAssetArcadaSuperior === "function") return texto(assets.obterAssetArcadaSuperior(), "");
    }
    if (arco === "inferior") {
      if (typeof assets.obterCaminhoArcadaInferior === "function") return texto(assets.obterCaminhoArcadaInferior(), "");
      if (typeof assets.obterAssetArcadaInferior === "function") return texto(assets.obterAssetArcadaInferior(), "");
    }
    return "";
  }

  function obterCaminhoDente(numero) {
    const assets = obterModuloAssets();
    if (!assets) return "";
    if (typeof assets.obterAssetDente === "function") {
      return texto(assets.obterAssetDente(numero), "");
    }
    if (typeof assets.obterCaminhoImagemDentePermanente === "function") {
      return texto(assets.obterCaminhoImagemDentePermanente(numero), "");
    }
    return "";
  }

  function obterCaminhoFaces() {
    const assets = obterModuloAssets();
    if (!assets) return "";
    if (typeof assets.obterAssetFace === "function") {
      return texto(assets.obterAssetFace(), "");
    }
    if (typeof assets.obterCaminhoArcFaces === "function") {
      return texto(assets.obterCaminhoArcFaces(), "");
    }
    return "";
  }

  function obterOrdemDentes(arco, fallback) {
    const assets = obterModuloAssets();
    if (assets) {
      if (arco === "superior") {
        if (typeof assets.obterOrdemSuperiorOdontograma === "function") return assets.obterOrdemSuperiorOdontograma();
        if (typeof assets.obterOrdemDentesSuperiores === "function") return assets.obterOrdemDentesSuperiores();
      }
      if (arco === "inferior") {
        if (typeof assets.obterOrdemInferiorOdontograma === "function") return assets.obterOrdemInferiorOdontograma();
        if (typeof assets.obterOrdemDentesInferiores === "function") return assets.obterOrdemDentesInferiores();
      }
    }
    return Array.isArray(fallback) ? fallback.slice() : [];
  }

  function ensureStyle() {
    if (typeof document === "undefined" || document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .brana-odonto-visual{display:grid;gap:10px;min-width:0;padding:2px}
      .brana-odonto-visual-head{display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap;padding:0 2px}
      .brana-odonto-visual-brand{display:flex;align-items:center;gap:10px;min-width:0}
      .brana-odonto-visual-face{width:32px;height:25px;object-fit:contain;flex:0 0 auto}
      .brana-odonto-visual-title{display:grid;gap:3px;min-width:0}
      .brana-odonto-visual-title strong{font:700 16px Tahoma,sans-serif;color:#1e2f41;letter-spacing:.01em}
      .brana-odonto-visual-title span{font:12px Tahoma,sans-serif;color:#5d6b79}
      .brana-odonto-visual-badges{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
      .brana-odonto-visual-chip{display:inline-flex;gap:6px;align-items:center;padding:4px 9px;border:1px solid #d7e0ea;border-radius:999px;background:#fff;font:11px Tahoma,sans-serif;color:#304053;white-space:nowrap}
      .brana-odonto-visual-chip strong{font-weight:700}
      .brana-odonto-visual-legend{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
      .brana-odonto-visual-legend .brana-odonto-visual-chip{padding:3px 8px}
      .brana-odonto-visual-stage{display:grid;gap:12px}
      .brana-odonto-empty{padding:16px 12px;border:1px dashed #d7e0ea;border-radius:14px;background:#fcfdff;color:#607080;font:12px Tahoma,sans-serif}
      .brana-odonto-arcada{position:relative;display:grid;gap:6px;padding:10px 8px 8px;border:1px solid #d9e2ec;border-radius:18px;background:linear-gradient(180deg,#fff 0%,#f8fbff 100%);overflow:hidden}
      .brana-odonto-arcada::before{content:"";position:absolute;left:50%;top:10px;bottom:10px;width:1px;transform:translateX(-.5px);background:linear-gradient(180deg,transparent 0%,rgba(141,177,214,.34) 16%,rgba(141,177,214,.44) 50%,rgba(141,177,214,.34) 84%,transparent 100%);pointer-events:none}
      .brana-odonto-band{position:relative;display:grid;grid-template-columns:repeat(16,minmax(0,1fr));gap:2px;align-items:center}
      .brana-odonto-band.is-teeth{min-height:70px;padding:0 2px 1px;border-radius:14px;background:rgba(247,250,253,.82)}
      .brana-odonto-band.is-faces{min-height:26px;align-items:center}
      .brana-odonto-band.is-numbers{min-height:22px;align-items:center}
      .brana-odonto-band.is-upper.is-teeth{background-image:linear-gradient(180deg,rgba(248,252,255,.74) 0%,rgba(241,246,251,.9) 100%)}
      .brana-odonto-band.is-lower.is-teeth{background-image:linear-gradient(180deg,rgba(248,252,255,.86) 0%,rgba(244,248,252,.95) 100%)}
      .brana-odonto-band .brana-odonto-band-backdrop{position:absolute;inset:0;opacity:.055;object-fit:contain;object-position:center center;pointer-events:none;transform:scale(.985);filter:saturate(.9) contrast(1.03)}
      .brana-odonto-band-label{position:absolute;left:8px;top:4px;font:700 9px Tahoma,sans-serif;color:#8aa1b7;text-transform:uppercase;letter-spacing:.04em;pointer-events:none}
      .brana-odonto-slot{position:relative;display:grid;place-items:center;min-width:0}
      .brana-odonto-slot.is-tooth{min-height:58px}
      .brana-odonto-slot.is-face{min-height:22px}
      .brana-odonto-slot.is-number{min-height:18px}
      .brana-odonto-tooth-img{width:min(100%,52px);height:auto;display:block;object-fit:contain;pointer-events:none;filter:drop-shadow(0 1px 1px rgba(16,24,40,.07))}
      .brana-odonto-slot[data-status="observado"] .brana-odonto-tooth-img{filter:drop-shadow(0 1px 1px rgba(37,99,235,.12))}
      .brana-odonto-slot[data-status="restaurado"] .brana-odonto-tooth-img{filter:drop-shadow(0 1px 1px rgba(19,115,51,.12))}
      .brana-odonto-slot[data-status="programado"] .brana-odonto-tooth-img{filter:drop-shadow(0 1px 1px rgba(155,106,26,.12))}
      .brana-odonto-slot[data-status="ausente"] .brana-odonto-tooth-img{opacity:.84;filter:grayscale(.08) drop-shadow(0 1px 1px rgba(107,114,128,.08))}
      .brana-odonto-face-img{width:min(100%,28px);height:auto;display:block;object-fit:contain;pointer-events:none;opacity:.94}
      .brana-odonto-face-dot{position:absolute;top:1px;left:50%;width:7px;height:7px;border-radius:999px;transform:translateX(-50%);box-shadow:0 0 0 1px rgba(255,255,255,.88)}
      .brana-odonto-face-dot.is-observado{background:#ef4444}
      .brana-odonto-face-dot.is-restaurado{background:#16a34a}
      .brana-odonto-face-dot.is-programado{background:#f59e0b}
      .brana-odonto-face-dot.is-ausente{background:#6b7280}
      .brana-odonto-face-dot.is-neutro{display:none}
      .brana-odonto-number{display:inline-flex;align-items:center;justify-content:center;min-width:18px;padding:0 2px;border-radius:6px;font:700 12px Tahoma,sans-serif;color:#233244;line-height:1}
      .brana-odonto-number.is-divider{position:relative;padding-inline:12px}
      .brana-odonto-number.is-divider::before{content:"";position:absolute;left:-5px;top:50%;width:1px;height:16px;background:rgba(141,177,214,.64);transform:translateY(-50%)}
      .brana-odonto-meta{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
      .brana-odonto-support{display:grid;gap:10px}
      .brana-odonto-support-note{font:11px Tahoma,sans-serif;color:#526273}
      @media (max-width: 1180px){
        .brana-odonto-band.is-teeth{min-height:70px}
      }
      @media (max-width: 760px){
        .brana-odonto-visual-title strong{font-size:14px}
        .brana-odonto-band.is-teeth{min-height:64px}
        .brana-odonto-slot.is-tooth{min-height:56px}
        .brana-odonto-tooth-img{width:min(100%,48px)}
      }
    `;
    document.head.appendChild(style);
  }

  function createChip(textoValor, cor) {
    const chip = document.createElement("span");
    chip.className = "brana-odonto-visual-chip";

    const dot = document.createElement("span");
    dot.style.display = "inline-block";
    dot.style.width = "8px";
    dot.style.height = "8px";
    dot.style.borderRadius = "999px";
    dot.style.background = cor;
    dot.style.flex = "0 0 auto";

    const label = document.createElement("span");
    label.textContent = textoValor;

    chip.appendChild(dot);
    chip.appendChild(label);
    return chip;
  }

  function createHeader(estado) {
    const head = document.createElement("div");
    head.className = "brana-odonto-visual-head";

    const brand = document.createElement("div");
    brand.className = "brana-odonto-visual-brand";

    const face = document.createElement("img");
    face.className = "brana-odonto-visual-face";
    face.alt = "Faces";
    face.decoding = "async";
    face.loading = "lazy";
    const caminhoFaces = obterCaminhoFaces();
    if (caminhoFaces) {
      face.src = caminhoFaces;
    } else {
      face.style.display = "none";
    }

    const title = document.createElement("div");
    title.className = "brana-odonto-visual-title";

    const strong = document.createElement("strong");
    strong.textContent = "Odontograma clinico";

    const subtitle = document.createElement("span");
    subtitle.textContent = "Composicao em cinco faixas com assets locais.";

    title.appendChild(strong);
    title.appendChild(subtitle);

    const badges = document.createElement("div");
    badges.className = "brana-odonto-visual-badges";
    badges.appendChild(createChip(estado?.comPaciente ? "Paciente ativo" : "Sem paciente", "#8eb4dd"));
    badges.appendChild(createChip("Imagens locais", "#9ec5fe"));

    brand.appendChild(face);
    brand.appendChild(title);

    head.appendChild(brand);
    head.appendChild(badges);
    return head;
  }

  function createLegend(estado) {
    const legend = document.createElement("div");
    legend.className = "brana-odonto-visual-legend";
    obterLegendas(estado).forEach((item) => {
      legend.appendChild(createChip(item.descricao, item.cor));
    });
    return legend;
  }

  function getArcadasFromEstado(estado) {
    const arcadas = estado && typeof estado === "object" ? estado.arcadas : null;
    const superior = Array.isArray(arcadas?.superior) ? arcadas.superior.slice() : [];
    const inferior = Array.isArray(arcadas?.inferior) ? arcadas.inferior.slice() : [];
    if (superior.length || inferior.length) {
      return { superior, inferior };
    }

    const flat = Array.isArray(estado?.odontograma) ? estado.odontograma.slice() : [];
    if (!flat.length) {
      return { superior: [], inferior: [] };
    }

    const meio = Math.ceil(flat.length / 2);
    const mapItem = (item, arco) => ({
      numero: texto(item?.dente),
      status: texto(item?.status, "neutro"),
      observacao: texto(item?.descricao, "Sem observacao."),
      arco,
    });

    return {
      superior: flat.slice(0, meio).map((item) => mapItem(item, "superior")),
      inferior: flat.slice(meio).map((item) => mapItem(item, "inferior")),
    };
  }

  function renderFallback(container, estado) {
    const root = document.createElement("div");
    root.className = "brana-odonto-visual";

    const msg = document.createElement("div");
    msg.className = "brana-odonto-empty";
    msg.textContent = "Renderer visual indisponivel. Exibindo leitura simplificada.";
    root.appendChild(msg);

    const stage = document.createElement("div");
    stage.className = "brana-odonto-visual-stage";
    const arcadas = getArcadasFromEstado(estado);
    stage.appendChild(createFiveBandArcada(arcadas, { fallback: true }));
    root.appendChild(stage);

    container.replaceChildren(root);
    return true;
  }

  function createToothSlot(tooth, arco, index) {
    const slot = document.createElement("div");
    slot.className = "brana-odonto-slot is-tooth";
    slot.dataset.status = normalizarStatus(tooth?.status);
    slot.title = texto(tooth?.observacao, `Dente ${texto(tooth?.numero, "")}`);

    const imagem = document.createElement("img");
    imagem.className = "brana-odonto-tooth-img";
    imagem.alt = texto(tooth?.numero, "Dente");
    imagem.decoding = "async";
    imagem.loading = "lazy";

    const caminho = obterCaminhoDente(tooth?.numero);
    if (caminho) {
      imagem.src = caminho;
    } else {
      imagem.alt = "Imagem indisponivel";
      imagem.style.display = "none";
    }

    slot.appendChild(imagem);
    return slot;
  }

  function createFaceSlot(tooth) {
    const slot = document.createElement("div");
    slot.className = "brana-odonto-slot is-face";
    slot.dataset.status = normalizarStatus(tooth?.status);
    slot.title = texto(tooth?.observacao, `Face do dente ${texto(tooth?.numero, "")}`);

    const imagem = document.createElement("img");
    imagem.className = "brana-odonto-face-img";
    imagem.alt = "";
    imagem.decoding = "async";
    imagem.loading = "lazy";
    const caminho = obterCaminhoFaces();
    if (caminho) {
      imagem.src = caminho;
    } else {
      imagem.style.display = "none";
    }

    const dot = document.createElement("span");
    dot.className = `brana-odonto-face-dot is-${normalizarStatus(tooth?.status)}`;

    slot.appendChild(imagem);
    slot.appendChild(dot);
    return slot;
  }

  function createNumberSlot(numero, index) {
    const slot = document.createElement("div");
    slot.className = "brana-odonto-slot is-number";
    const numeroEl = document.createElement("span");
    numeroEl.className = "brana-odonto-number";
    numeroEl.textContent = texto(numero, "");
    if (index === 7) {
      numeroEl.classList.add("is-divider");
    }
    slot.appendChild(numeroEl);
    return slot;
  }

  function createBand(title, kind, arco, teeth, contentBuilder, backdropPath) {
    const band = document.createElement("div");
    band.className = `brana-odonto-band is-${kind}${arco ? ` is-${arco}` : ""}`;

    const label = document.createElement("span");
    label.className = "brana-odonto-band-label";
    label.textContent = title;
    label.style.zIndex = "1";
    band.appendChild(label);

    if (backdropPath) {
      const backdrop = document.createElement("img");
      backdrop.className = "brana-odonto-band-backdrop";
      backdrop.alt = "";
      backdrop.setAttribute("aria-hidden", "true");
      backdrop.decoding = "async";
      backdrop.loading = "lazy";
      backdrop.src = backdropPath;
      backdrop.style.zIndex = "0";
      band.appendChild(backdrop);
    }

    const total = SLOT_COUNT;
    for (let index = 0; index < total; index += 1) {
      const item = teeth[index] || {};
      const slot = contentBuilder(item, index, total);
      slot.style.position = "relative";
      slot.style.zIndex = "1";
      band.appendChild(slot);
    }

    return band;
  }

  function createFiveBandArcada(arcadas, options = {}) {
    const root = document.createElement("div");
    root.className = "brana-odonto-arcada";

    const superior = Array.isArray(arcadas?.superior) ? arcadas.superior.slice(0, SLOT_COUNT) : [];
    const inferior = Array.isArray(arcadas?.inferior) ? arcadas.inferior.slice(0, SLOT_COUNT) : [];

    const upperTeethOrder = obterOrdemDentes("superior", superior.map((item) => texto(item.numero)));
    const lowerTeethOrder = obterOrdemDentes("inferior", inferior.map((item) => texto(item.numero)));

    const superiorSlots = upperTeethOrder.map((numero, index) => ({
      numero,
      status: superior[index]?.status,
      observacao: superior[index]?.observacao,
    }));
    const inferiorSlots = lowerTeethOrder.map((numero, index) => ({
      numero,
      status: inferior[index]?.status,
      observacao: inferior[index]?.observacao,
    }));

    const superiorBackdrop = obterCaminhoArcada("superior");
    const inferiorBackdrop = obterCaminhoArcada("inferior");

    root.appendChild(createBand("Dentes superiores", "teeth", "upper", superiorSlots, (item, index) => createToothSlot(item, "superior", index), superiorBackdrop));
    root.appendChild(createBand("Faces superiores", "faces", "upper", superiorSlots, (item) => createFaceSlot(item)));
    root.appendChild(createBand("Numeracao central", "numbers", "", CENTRAL_NUMERACAO.map((numero, index) => ({ numero, index })), (item, index) => createNumberSlot(item.numero, index)));
    root.appendChild(createBand("Faces inferiores", "faces", "lower", inferiorSlots, (item) => createFaceSlot(item)));
    root.appendChild(createBand("Dentes inferiores", "teeth", "lower", inferiorSlots, (item, index) => createToothSlot(item, "inferior", index), inferiorBackdrop));

    if (options.fallback) {
      root.style.gap = "10px";
      root.style.padding = "12px 10px";
    }

    return root;
  }

  function render(container, estado, options = {}) {
    if (!isElementoDom(container)) return false;
    ensureStyle();

    const arcadas = getArcadasFromEstado(estado);
    const root = document.createElement("div");
    root.className = "brana-odonto-visual";
    root.dataset.origem = texto(options?.origem, texto(estado?.origem, ""));
    root.dataset.modo = texto(options?.modo, texto(estado?.modo, ""));
    root.dataset.estadoVisual = texto(estado?.statusVisual, "");

    root.appendChild(createHeader(estado));
    root.appendChild(createLegend(estado));

    const stage = document.createElement("div");
    stage.className = "brana-odonto-visual-stage";

    if (!arcadas.superior.length && !arcadas.inferior.length) {
      const empty = document.createElement("div");
      empty.className = "brana-odonto-empty";
      empty.textContent = "Sem arcadas disponiveis para renderizacao.";
      stage.appendChild(empty);
    } else {
      stage.appendChild(createFiveBandArcada(arcadas));
    }

    root.appendChild(stage);
    container.replaceChildren(root);
    return true;
  }

  const api = Object.freeze({
    moduleName: MODULE_NAME,
    render,
    renderFallback,
    getArcadasFromEstado,
    obterLegendas,
  });

  if (typeof window !== "undefined") {
    window.BranaTelaPrincipalOdontologicaOdontograma = api;
  }

  if (typeof globalThis !== "undefined") {
    globalThis.BranaTelaPrincipalOdontologicaOdontograma = api;
  }
})();
