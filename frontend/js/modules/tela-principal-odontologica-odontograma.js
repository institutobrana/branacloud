(function () {
  "use strict";

  const MODULE_NAME = "BranaTelaPrincipalOdontologicaOdontograma";
  const STYLE_ID = "brana-odonto-visual-style";

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

  function num(valor, fallback = 0) {
    const n = Number(valor || 0);
    return Number.isFinite(n) ? n : fallback;
  }

  function isElementoDom(valor) {
    return typeof HTMLElement !== "undefined" && valor instanceof HTMLElement;
  }

  function ensureStyle() {
    if (typeof document === "undefined" || document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .brana-odonto-visual{display:grid;gap:12px;min-width:0}
      .brana-odonto-visual-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap;padding:0 2px}
      .brana-odonto-visual-title{display:grid;gap:4px}
      .brana-odonto-visual-title strong{font:700 16px Tahoma,sans-serif;color:#1e2f41;letter-spacing:.01em}
      .brana-odonto-visual-title span{font:12px Tahoma,sans-serif;color:#5d6b79}
      .brana-odonto-visual-badges{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
      .brana-odonto-visual-chip{display:inline-flex;gap:6px;align-items:center;padding:4px 9px;border:1px solid #d7e0ea;border-radius:999px;background:#fff;font:11px Tahoma,sans-serif;color:#304053;white-space:nowrap}
      .brana-odonto-visual-chip strong{font-weight:700}
      .brana-odonto-visual-legend{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
      .brana-odonto-visual-legend .brana-odonto-visual-chip{padding:3px 8px}
      .brana-odonto-visual-stage{display:grid;gap:12px}
      .brana-odonto-arch{display:grid;gap:8px;border:1px solid #d9e2ec;border-radius:18px;overflow:hidden;background:linear-gradient(180deg,#fff 0%,#fafcff 100%);box-shadow:0 1px 2px rgba(16,24,40,.03)}
      .brana-odonto-arch-head{display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap;padding:10px 12px;border-bottom:1px solid #e6edf4;background:#f5f8fc}
      .brana-odonto-arch-head strong{font:700 12px Tahoma,sans-serif;color:#233244;text-transform:uppercase;letter-spacing:.02em}
      .brana-odonto-arch-head span{font:11px Tahoma,sans-serif;color:#657381}
      .brana-odonto-arch-stage{position:relative;min-height:clamp(218px,21vw,284px);padding:16px 10px 18px;overflow:hidden;background:linear-gradient(180deg,rgba(245,248,252,.85) 0%,rgba(255,255,255,.92) 52%,rgba(240,245,250,.96) 100%)}
      .brana-odonto-arch-stage::before{content:"";position:absolute;inset:16px 12px 18px;border-radius:999px;border:1px solid rgba(141,177,214,.28);pointer-events:none}
      .brana-odonto-arch-stage::after{content:"";position:absolute;left:8%;right:8%;height:1px;background:linear-gradient(90deg,transparent 0%,rgba(142,180,221,.28) 18%,rgba(142,180,221,.16) 50%,rgba(142,180,221,.28) 82%,transparent 100%);pointer-events:none}
      .brana-odonto-arch-stage.is-upper::after{bottom:24px}
      .brana-odonto-arch-stage.is-lower::after{top:24px}
      .brana-odonto-arch-divider{position:absolute;left:50%;top:12px;bottom:12px;width:1px;background:linear-gradient(180deg,transparent 0%,rgba(141,177,214,.44) 18%,rgba(141,177,214,.5) 50%,rgba(141,177,214,.44) 82%,transparent 100%);transform:translateX(-.5px);pointer-events:none}
      .brana-odonto-tooth{position:absolute;box-sizing:border-box;transform:translateX(-50%);width:clamp(32px,4.15vw,56px);height:clamp(92px,10vw,126px);padding:7px 6px 6px;border:1px solid #d7e0ea;border-radius:18px 18px 12px 12px;background:linear-gradient(180deg,#fff 0%,#f8fbfe 48%,#edf3f8 100%);box-shadow:0 1px 2px rgba(16,24,40,.05);display:grid;grid-template-rows:auto 1fr auto;gap:4px;align-content:start;justify-items:stretch}
      .brana-odonto-tooth::before{content:"";position:absolute;left:50%;top:24px;transform:translateX(-50%);width:18px;height:34px;border-radius:9px 9px 12px 12px;background:linear-gradient(180deg,rgba(255,255,255,.92) 0%,rgba(248,251,255,.9) 38%,rgba(226,233,241,.96) 100%);opacity:.55;pointer-events:none}
      .brana-odonto-tooth.is-upper{align-self:start;border-top:3px solid #8eb4dd}
      .brana-odonto-tooth.is-lower{align-self:end;border-bottom:3px solid #8eb4dd}
      .brana-odonto-tooth[data-status="neutro"]{border-color:#d7e0ea;background:linear-gradient(180deg,#fff 0%,#fbfdff 100%)}
      .brana-odonto-tooth[data-status="observado"]{border-color:#9ec5fe;background:linear-gradient(180deg,#f5faff 0%,#edf5ff 100%)}
      .brana-odonto-tooth[data-status="restaurado"]{border-color:#97d8b1;background:linear-gradient(180deg,#f4fbf6 0%,#edf9f1 100%)}
      .brana-odonto-tooth[data-status="programado"]{border-color:#f6c768;background:linear-gradient(180deg,#fffaf0 0%,#fff3d9 100%)}
      .brana-odonto-tooth[data-status="ausente"]{border-color:#b7c0ca;background:linear-gradient(180deg,#fbfcfd 0%,#f4f6f8 100%);opacity:.88}
      .brana-odonto-tooth-head{display:flex;justify-content:space-between;gap:6px;align-items:flex-start;position:relative;z-index:1}
      .brana-odonto-tooth-num{font:700 10px Tahoma,sans-serif;color:#213042;text-transform:uppercase;letter-spacing:.03em;white-space:nowrap}
      .brana-odonto-tooth-status{font:700 9px Tahoma,sans-serif;color:#4d6277;text-transform:uppercase;letter-spacing:.02em;white-space:nowrap}
      .brana-odonto-tooth-body{display:grid;place-items:center;min-height:38px;font:700 15px Tahoma,sans-serif;color:#10202f;line-height:1.05;position:relative;z-index:1}
      .brana-odonto-tooth[data-status="ausente"] .brana-odonto-tooth-body{color:#7f8b96;font-weight:500}
      .brana-odonto-tooth-foot{font:11px Tahoma,sans-serif;color:#607080;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;position:relative;z-index:1}
      .brana-odonto-empty{padding:16px 12px;border:1px dashed #d7e0ea;border-radius:14px;background:#fcfdff;color:#607080;font:12px Tahoma,sans-serif}
      @media (max-width: 1180px){
        .brana-odonto-arch-stage{min-height:clamp(206px,29vw,248px)}
      }
      @media (max-width: 760px){
        .brana-odonto-visual-title strong{font-size:14px}
        .brana-odonto-arch-stage{min-height:clamp(184px,42vw,228px)}
        .brana-odonto-tooth{width:clamp(30px,10.2vw,48px);height:clamp(84px,24vw,112px)}
      }
    `;
    document.head.appendChild(style);
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

  function buildGeometry(index, total, arco) {
    const safeTotal = Math.max(1, total);
    const t = safeTotal === 1 ? 0.5 : index / (safeTotal - 1);
    const curve = Math.sin(Math.PI * t);
    const left = 3 + t * 94;
    const width = Math.max(4.05, Math.min(4.75, 4.65 - Math.abs(t - 0.5) * 0.45));
    const shift = Math.round(curve * 18);

    if (arco === "superior") {
      return { left, width, top: 16 + shift };
    }
    return { left, width, bottom: 16 + shift };
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

  function createHeader(estado, opcoes = {}) {
    const head = document.createElement("div");
    head.className = "brana-odonto-visual-head";

    const title = document.createElement("div");
    title.className = "brana-odonto-visual-title";

    const strong = document.createElement("strong");
    strong.textContent = "Odontograma clinico";

    const subtitle = document.createElement("span");
    subtitle.textContent = "Arcadas superior e inferior em leitura visual isolada.";

    title.appendChild(strong);
    title.appendChild(subtitle);

    const badges = document.createElement("div");
    badges.className = "brana-odonto-visual-badges";
    badges.appendChild(createChip(texto(estado?.statusVisual, "neutro"), "#8eb4dd"));
    badges.appendChild(createChip(texto(opcoes?.modo, estado?.modo || "visual-estatico"), "#9ec5fe"));
    badges.appendChild(createChip(texto(opcoes?.origem, estado?.origem || "ficha-pessoal-historico"), "#b7c0ca"));

    head.appendChild(title);
    head.appendChild(badges);
    return head;
  }

  function createLegend(estado) {
    const legend = document.createElement("div");
    legend.className = "brana-odonto-visual-legend";
    const items = obterLegendas(estado);
    items.forEach((item) => {
      legend.appendChild(createChip(item.descricao, item.cor));
    });
    return legend;
  }

  function createTooth(tooth, arco, index, total) {
    const node = document.createElement("article");
    node.className = `brana-odonto-tooth ${arco === "superior" ? "is-upper" : "is-lower"}`;
    node.dataset.status = texto(tooth?.status, "neutro").toLowerCase();

    const geometry = buildGeometry(index, total, arco);
    node.style.left = `${geometry.left.toFixed(2)}%`;
    node.style.width = `${geometry.width.toFixed(2)}%`;
    node.style[geometry.top != null ? "top" : "bottom"] = `${geometry.top != null ? geometry.top : geometry.bottom}px`;

    node.title = texto(tooth?.observacao, "Sem observacao.");

    const head = document.createElement("div");
    head.className = "brana-odonto-tooth-head";

    const numero = document.createElement("span");
    numero.className = "brana-odonto-tooth-num";
    numero.textContent = texto(tooth?.numero, "—");

    const status = document.createElement("span");
    status.className = "brana-odonto-tooth-status";
    status.textContent = toLabel(tooth?.status);

    const body = document.createElement("div");
    body.className = "brana-odonto-tooth-body";
    body.textContent = texto(tooth?.numero, "—");

    const foot = document.createElement("div");
    foot.className = "brana-odonto-tooth-foot";
    foot.textContent = texto(tooth?.observacao, "Sem observacao.");

    head.appendChild(numero);
    head.appendChild(status);
    node.appendChild(head);
    node.appendChild(body);
    node.appendChild(foot);
    return node;
  }

  function createArchBlock(label, note, arco, teeth) {
    const block = document.createElement("section");
    block.className = "brana-odonto-arch";

    const head = document.createElement("div");
    head.className = "brana-odonto-arch-head";

    const left = document.createElement("div");
    const strong = document.createElement("strong");
    strong.textContent = label;
    const span = document.createElement("span");
    span.textContent = note;
    left.appendChild(strong);
    left.appendChild(document.createTextNode(" "));
    left.appendChild(span);

    const right = document.createElement("span");
    right.textContent = `${teeth.length} dente(s)`;

    head.appendChild(left);
    head.appendChild(right);

    const stage = document.createElement("div");
    stage.className = `brana-odonto-arch-stage ${arco === "superior" ? "is-upper" : "is-lower"}`;

    const divider = document.createElement("div");
    divider.className = "brana-odonto-arch-divider";
    stage.appendChild(divider);

    const lista = Array.isArray(teeth) ? teeth : [];
    lista.forEach((tooth, index) => {
      stage.appendChild(createTooth(tooth, arco, index, Math.max(1, lista.length)));
    });

    block.appendChild(head);
    block.appendChild(stage);
    return block;
  }

  function renderFallback(container, estado) {
    const arcadas = getArcadasFromEstado(estado);
    const root = document.createElement("div");
    root.className = "brana-odonto-visual";

    const msg = document.createElement("div");
    msg.className = "brana-odonto-empty";
    msg.textContent = "Renderer visual indisponivel. Exibindo leitura simplificada.";
    root.appendChild(msg);

    const stage = document.createElement("div");
    stage.className = "brana-odonto-visual-stage";
    stage.appendChild(createArchBlock("Arcada superior", "Leitura visual simplificada.", "superior", arcadas.superior));
    stage.appendChild(createArchBlock("Arcada inferior", "Leitura visual simplificada.", "inferior", arcadas.inferior));
    root.appendChild(stage);

    container.replaceChildren(root);
    return true;
  }

  function render(container, estado, options = {}) {
    if (!isElementoDom(container)) return false;
    ensureStyle();

    const arcadas = getArcadasFromEstado(estado);
    const root = document.createElement("div");
    root.className = "brana-odonto-visual";

    root.appendChild(createHeader(estado, options));
    root.appendChild(createLegend(estado));

    const stage = document.createElement("div");
    stage.className = "brana-odonto-visual-stage";

    if (!arcadas.superior.length && !arcadas.inferior.length) {
      const empty = document.createElement("div");
      empty.className = "brana-odonto-empty";
      empty.textContent = "Sem arcadas disponiveis para renderizacao.";
      stage.appendChild(empty);
    } else {
      const superiorNote = texto(options.superiorNote, "Arcada superior em leitura odontologica.");
      const inferiorNote = texto(options.inferiorNote, "Arcada inferior em leitura odontologica.");
      stage.appendChild(createArchBlock("Arcada superior", superiorNote, "superior", arcadas.superior));
      stage.appendChild(createArchBlock("Arcada inferior", inferiorNote, "inferior", arcadas.inferior));
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
