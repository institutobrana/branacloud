(function () {
  "use strict";

  const MODULE_NAME = "BranaPacienteEmUsoHeaderV1";
  const STYLE_ID = "brana-paciente-em-uso-header-style";
  const ROOT_ID = "brana-paciente-em-uso-header";

  let mounted = false;
  let rootEl = null;
  let lastPaciente = null;

  function num(value, fallback = 0) {
    const n = Number(value || 0);
    return Number.isFinite(n) ? n : fallback;
  }

  function esc(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function normalizePaciente(paciente = null) {
    if (!paciente || typeof paciente !== "object") return null;
    const extra = paciente.extra && typeof paciente.extra === "object" ? paciente.extra : {};
    const numero = String(
      paciente.numero ??
      paciente.codigo ??
      paciente.cod_paciente ??
      paciente.codPaciente ??
      ""
    ).trim();
    const nomeBase = String(
      extra.PRINOM ||
      extra.NOMRES ||
      paciente.nome_completo ||
      paciente.nome ||
      ""
    ).trim();
    const nomeCompleto = nomeBase || String(`${paciente.nome || ""} ${paciente.sobrenome || ""}`).trim();
    const nome = nomeCompleto;
    const id = num(paciente.id ?? paciente.paciente_id ?? paciente.NROPAC ?? 0);
    if (!numero && !nome && !id) return null;
    return {
      ...paciente,
      extra,
      id: id || paciente.id || paciente.paciente_id || null,
      numero,
      nome,
      source: String(paciente.source || paciente.origem || "").trim(),
      nome_completo: nomeCompleto,
    };
  }

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .brana-paciente-em-uso-header{
        display:none;
        grid-template-columns:auto minmax(110px,150px) minmax(0,1fr);
        gap:8px;
        align-items:center;
        padding:6px 8px;
        margin-bottom:6px;
        border:1px solid #c8d2dc;
        background:linear-gradient(180deg,#fcfdff 0%,#f3f6fa 100%);
        font:12px Tahoma,Arial,sans-serif;
        color:#1f2f3e;
        box-sizing:border-box;
      }
      .brana-paciente-em-uso-header .brana-paciente-em-uso-label{
        font:700 11px Tahoma,Arial,sans-serif;
        text-transform:uppercase;
        letter-spacing:.03em;
        color:#425266;
        white-space:nowrap;
      }
      .brana-paciente-em-uso-field{
        min-height:24px;
        display:flex;
        align-items:center;
        padding:0 8px;
        border:1px solid #c6ced8;
        background:#fff;
        box-sizing:border-box;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
      }
      .brana-paciente-em-uso-field.is-empty{
        color:#7a8794;
        background:#fefefe;
      }
      .brana-paciente-em-uso-number{
        font-weight:700;
      }
      .brana-paciente-em-uso-name{
        min-width:0;
      }
      @media (max-width: 760px){
        .brana-paciente-em-uso-header{
          grid-template-columns:1fr;
          gap:4px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function getSources() {
    const odonto = typeof BranaOdontoV1Module !== "undefined" ? BranaOdontoV1Module : null;
    const pacienteOdonto = normalizePaciente(odonto?.state?.paciente || null);
    const pacienteId = num(typeof fichaPacienteAtualId !== "undefined" ? fichaPacienteAtualId : 0);
    const fichaObj = typeof ficha !== "undefined" ? ficha : null;
    const codigoFicha = String(
      typeof fichaCodigoUltimoResolvido !== "undefined"
        ? fichaCodigoUltimoResolvido
        : fichaObj?.codigo?.value || ""
    ).trim();
    const nomeFicha = String(
      fichaObj?.titulo?.textContent ||
      fichaObj?.nome?.value ||
      ""
    ).replace(/^Ficha pessoal\s*-\s*/i, "").trim();

    if (pacienteOdonto) {
      const numero = String(pacienteOdonto.numero || "").trim();
      const nome = String(pacienteOdonto.nome || "").trim();
      if (numero || nome) {
        return { ...pacienteOdonto, numero, nome, source: "odontograma", id: num(pacienteOdonto.id) };
      }
    }

    if (pacienteId > 0) {
      if (codigoFicha || nomeFicha) {
        return {
          numero: codigoFicha,
          nome: nomeFicha,
          source: "ficha",
          id: pacienteId,
        };
      }
    }

    return null;
  }

  function ensureMounted() {
    ensureStyle();
    if (mounted && rootEl) return rootEl;
    const anchor = document.getElementById("brana-paciente-em-uso-anchor");
    const shell = document.querySelector(".shell");
    let root = document.getElementById(ROOT_ID);
    if (!root) {
      root = document.createElement("div");
      root.id = ROOT_ID;
      root.className = "brana-paciente-em-uso-header";
      if (anchor && anchor.parentNode) {
        anchor.parentNode.insertBefore(root, anchor);
        anchor.remove();
      } else if (shell) {
        const main = shell.querySelector("main.workspace");
        if (main && main.parentNode === shell) {
          shell.insertBefore(root, main);
        } else {
          shell.insertBefore(root, shell.firstChild);
        }
      } else {
        return null;
      }
    }
    rootEl = root;
    mounted = true;
    render();
    return rootEl;
  }

  function render(paciente = null) {
    if (!rootEl) return null;
    const ativo = normalizePaciente(paciente || lastPaciente || getSources());
    lastPaciente = ativo || null;
    const numero = String(ativo?.numero || "").trim();
    const nome = String(ativo?.nome || "").trim();
    const isEmpty = !numero && !nome;
    rootEl.innerHTML = `
      <div class="brana-paciente-em-uso-label">Paciente:</div>
      <div class="brana-paciente-em-uso-field brana-paciente-em-uso-number${isEmpty ? " is-empty" : ""}">${esc(numero ? `#${numero}` : "—")}</div>
      <div class="brana-paciente-em-uso-field brana-paciente-em-uso-name${isEmpty ? " is-empty" : ""}">${esc(nome || "—")}</div>
    `;
    rootEl.title = isEmpty ? "Nenhum paciente ativo." : `Paciente ${numero ? `#${numero}` : ""} ${nome}`.trim();
    return rootEl;
  }

  function sync(paciente = null) {
    const current = normalizePaciente(paciente || getSources());
    const target = ensureMounted();
    if (!target) return null;
    return render(current);
  }

  function getStatus() {
    return {
      module: MODULE_NAME,
      mounted,
      active: !!lastPaciente,
      paciente: lastPaciente,
    };
  }

  window.BranaPacienteEmUsoHeaderV1 = Object.freeze({
    moduleName: MODULE_NAME,
    ensureMounted,
    render,
    sync,
    getSources,
    getStatus,
    normalizePaciente,
  });

  void (function autoMountPacienteHeader() {
    const run = () => {
      try {
        sync();
      } catch (err) {
        console.warn(`[${MODULE_NAME}] Falha ao montar cabeçalho.`, err);
      }
    };
    if (typeof document === "undefined") return;
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", run, { once: true });
      return;
    }
    run();
  })();
})();
