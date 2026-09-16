(function () {
  "use strict";

  const MODULE_NAME = "BranaProntuarioV1";
  const HEADER_MODULE_NAME = "BranaPacienteEmUsoHeaderV1";
  const ROOT_ID = "brana-prontuario-v1";
  const STYLE_ID = "brana-prontuario-v1-style";

  let booted = false;
  let hooksInstalled = false;
  let lastStatus = "aguardando-bootstrap";
  let rootEl = null;
  let lastPaciente = null;

  function getHeaderModule() {
    if (typeof globalThis !== "undefined" && globalThis[HEADER_MODULE_NAME]) {
      return globalThis[HEADER_MODULE_NAME];
    }
    if (typeof window !== "undefined" && window[HEADER_MODULE_NAME]) {
      return window[HEADER_MODULE_NAME];
    }
    return null;
  }

  async function ensureHeaderModule() {
    const existing = getHeaderModule();
    if (existing) return existing;

    try {
      await import("/frontend/js/modules/paciente-em-uso-header.js?v=20260615-paciente-header1");
    } catch (err) {
      console.warn(`[${MODULE_NAME}] Falha ao carregar modulo de cabecalho.`, err);
    }
    return getHeaderModule();
  }

  function esc(value) {
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
      .brana-prontuario-v1{
        display:grid;
        gap:4px;
        padding:4px 8px 6px;
        margin:0 0 6px;
        border:1px solid #d2dbe5;
        background:linear-gradient(180deg,#fbfdff 0%,#f4f8fc 100%);
        box-sizing:border-box;
        font:12px Tahoma,Arial,sans-serif;
        color:#1f2f3e;
      }
      .brana-prontuario-v1__header{
        display:none;
      }
      .brana-prontuario-v1__title{
        font:700 13px Tahoma,Arial,sans-serif;
        color:#203040;
      }
      .brana-prontuario-v1__badge{
        display:inline-flex;
        align-items:center;
        padding:4px 9px;
        border:1px solid #c7d3df;
        border-radius:999px;
        background:#fff;
        font:700 11px Tahoma,Arial,sans-serif;
        color:#415165;
      }
      .brana-prontuario-v1__grid{
        display:grid;
        grid-template-columns:76px 68px minmax(150px,280px) minmax(150px,220px);
        gap:6px 8px;
        align-items:center;
        justify-content:start;
      }
      .brana-prontuario-v1__field{
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
      .brana-prontuario-v1__field.is-empty{
        color:#7a8794;
        background:#fefefe;
      }
      .brana-prontuario-v1__label{
        font:700 11px Tahoma,Arial,sans-serif;
        text-transform:uppercase;
        letter-spacing:.03em;
        color:#425266;
      }
      .brana-prontuario-v1__hint{
        display:none;
      }
      .brana-prontuario-v1__actions{
        display:none;
      }
      .brana-prontuario-v1__footer{
        display:none;
      }
      .brana-prontuario-v1__input{
        min-height:24px;
        border:1px solid #bfc9d4;
        background:#fff;
        padding:0 8px;
        font:12px Tahoma,Arial,sans-serif;
        color:#1f2f3e;
        box-sizing:border-box;
        min-width:0;
        width:100%;
      }
      .brana-prontuario-v1__input:focus{
        outline:2px solid rgba(0,128,128,.18);
        outline-offset:1px;
      }
      .brana-prontuario-v1__button{
        min-height:24px;
        border:1px solid #c7d3df;
        background:linear-gradient(180deg,#fff 0%,#eef4fa 100%);
        border-radius:3px;
        padding:0 10px;
        font:700 11px Tahoma,Arial,sans-serif;
        color:#304053;
      }
      .brana-prontuario-v1__button:hover{
        background:linear-gradient(180deg,#ffffff 0%,#e8f1f9 100%);
      }
      .brana-prontuario-v1__select{
        min-height:24px;
        border:1px solid #bfc9d4;
        background:#fff;
        padding:0 8px;
        font:12px Tahoma,Arial,sans-serif;
        color:#1f2f3e;
        box-sizing:border-box;
        min-width:0;
        width:100%;
      }
      .brana-prontuario-v1__select:focus{
        outline:2px solid rgba(0,128,128,.18);
        outline-offset:1px;
      }
    `;
    document.head.appendChild(style);
  }

  function getRequestJson() {
    if (typeof requestJson === "function") return requestJson;
    if (typeof globalThis !== "undefined" && typeof globalThis.requestJson === "function") return globalThis.requestJson;
    if (typeof window !== "undefined" && typeof window.requestJson === "function") return window.requestJson;
    return null;
  }

  function abrirMenuPacientes(prefill = "") {
    if (typeof fichaMenuPacAbrir !== "function") {
      return Promise.resolve(false);
    }
    return Promise.resolve()
      .then(() => fichaMenuPacAbrir(String(prefill || "").trim(), { mode: "paciente" }))
      .then(() => true)
      .catch((err) => {
        console.warn(`[${MODULE_NAME}] Falha ao abrir Menu de pacientes.`, err);
        return false;
      });
  }

  async function localizarPacientePorCodigo(codigo) {
    const valor = String(codigo || "").trim();
    if (!valor) {
      return { ok: false, reason: "vazio" };
    }
    if (!/^\d+$/.test(valor)) {
      return { ok: false, reason: "formato-invalido" };
    }
    const req = getRequestJson();
    if (typeof req !== "function") {
      return { ok: false, reason: "request-indisponivel" };
    }
    try {
      const { res, data } = await req("GET", `/cadastros/pacientes/por-codigo/${encodeURIComponent(valor)}`, undefined, true);
      if (!res?.ok) {
        return {
          ok: false,
          reason: res?.status === 404 ? "nao-encontrado" : "falha-backend",
          data,
          status: res?.status || 0,
        };
      }
      return { ok: true, paciente: data || null };
    } catch (err) {
      console.warn(`[${MODULE_NAME}] Falha ao consultar paciente por codigo.`, err);
      return { ok: false, reason: "erro-conexao" };
    }
  }

  async function carregarPacientePorId(pacienteId) {
    const id = Number(pacienteId || 0) || 0;
    if (id <= 0) return null;
    const req = getRequestJson();
    if (typeof req !== "function") return null;
    try {
      const { res, data } = await req("GET", `/cadastros/pacientes/${encodeURIComponent(String(id))}`, undefined, true);
      if (!res?.ok) return null;
      return data || null;
    } catch (err) {
      console.warn(`[${MODULE_NAME}] Falha ao carregar paciente por ID.`, err);
      return null;
    }
  }

  function normalizarNomeBusca(valor) {
    return String(valor || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ");
  }

  function nomeCompletoPaciente(item) {
    if (!item || typeof item !== "object") return "";
    const full = String(item.nome_completo || "").trim();
    if (full) return full;
    return String([item.nome || "", item.sobrenome || ""].filter(Boolean).join(" ")).trim();
  }

  function possuiNomeCompletoMinimo(valor) {
    const texto = normalizarNomeBusca(valor);
    if (!texto) return false;
    return texto.split(" ").filter(Boolean).length >= 2;
  }

  async function localizarPacientePorNome(nomeDigitado) {
    const valor = String(nomeDigitado || "").trim();
    if (!valor) {
      return { ok: false, reason: "vazio" };
    }

    const nomeNorm = normalizarNomeBusca(valor);
    if (!possuiNomeCompletoMinimo(valor)) {
      return { ok: false, reason: "nome-parcial" };
    }

    const req = getRequestJson();
    if (typeof req !== "function") {
      return { ok: false, reason: "request-indisponivel" };
    }

    try {
      const params = new URLSearchParams();
      params.set("q", valor);
      params.set("cir_menu_pac", "0");
      params.set("status_menu_pac", "0");
      params.set("visualizacao_menu_pac", "1");
      params.set("pesquisa_menu_pac", "1");
      params.set("active_ord_menu_pac", "0");
      params.set("offset", "0");
      params.set("limit", "50");
      const { res, data } = await req("GET", `/cadastros/pacientes/menu?${params.toString()}`, undefined, true);
      if (!res?.ok) {
        return {
          ok: false,
          reason: res?.status === 404 ? "nao-encontrado" : "falha-backend",
          status: res?.status || 0,
          data,
        };
      }

      const itens = Array.isArray(data?.items) ? data.items : [];
      const exatos = itens.filter((item) => normalizarNomeBusca(nomeCompletoPaciente(item)) === nomeNorm);
      if (exatos.length === 1) {
        const paciente = await carregarPacientePorId(exatos[0].id);
        if (paciente) {
          return { ok: true, paciente, reason: "encontrado-exato" };
        }
      }

      return {
        ok: false,
        reason: exatos.length > 1 ? "nome-ambiguo" : "nome-parcial",
        data,
        items: itens,
      };
    } catch (err) {
      console.warn(`[${MODULE_NAME}] Falha ao consultar paciente por nome.`, err);
      return { ok: false, reason: "erro-conexao" };
    }
  }

  function obterPacienteEmUso() {
    const header = getHeaderModule();
    if (header && typeof header.getSources === "function") {
      const source = header.getSources();
      if (source) return source;
    }

    try {
      const odonto = typeof BranaOdontoV1Module !== "undefined" ? BranaOdontoV1Module : null;
      const pacienteOdonto = odonto?.state?.paciente || null;
      const numeroOdonto = String(pacienteOdonto?.codigo ?? pacienteOdonto?.numero ?? "").trim();
      const nomeOdonto = String(pacienteOdonto?.nome_completo || pacienteOdonto?.nome || "").trim();
      if (numeroOdonto || nomeOdonto) {
        return {
          numero: numeroOdonto,
          nome: nomeOdonto,
          source: "odontograma",
          id: pacienteOdonto?.id || null,
        };
      }
    } catch {}

    try {
      const pacienteId = Number(typeof fichaPacienteAtualId !== "undefined" ? fichaPacienteAtualId : 0) || 0;
      if (pacienteId > 0) {
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
        if (codigoFicha || nomeFicha) {
          return {
            numero: codigoFicha,
            nome: nomeFicha,
            source: "ficha",
            id: pacienteId,
          };
        }
      }
    } catch {}

    return null;
  }

  function ensureRoot() {
    if (typeof document === "undefined") return null;
    ensureStyle();
    if (rootEl && rootEl.isConnected) return rootEl;

    let root = document.getElementById(ROOT_ID);
    if (!root) {
      root = document.createElement("section");
      root.id = ROOT_ID;
      root.className = "brana-prontuario-v1";
      const workspace = document.querySelector("main.workspace");
      if (!workspace) return null;
      const firstChild = workspace.firstElementChild;
      if (firstChild) {
        workspace.insertBefore(root, firstChild);
      } else {
        workspace.appendChild(root);
      }
    }
    rootEl = root;
    return rootEl;
  }

  function bindEntryInteractions(root) {
    if (!root || typeof root.querySelector !== "function") return;
    const input = root.querySelector("[data-brana-prontuario-codigo-paciente]");
    const nomeInput = root.querySelector("[data-brana-prontuario-nome-paciente]");
    const btn = root.querySelector("[data-brana-prontuario-menu-pacientes]");
    if (input instanceof HTMLInputElement && !input.dataset.branaBound) {
      input.dataset.branaBound = "1";
      input.addEventListener("keydown", async (ev) => {
        if (ev.key !== "Enter" && ev.key !== "Tab") return;
        ev.preventDefault();
        ev.stopPropagation();
        await executarLookupCodigoPaciente(input.value);
      });
      input.addEventListener("blur", () => {
        try {
          input.value = String(obterPacienteEmUso()?.numero || input.value || "").trim();
        } catch {}
      });
    }
    if (nomeInput instanceof HTMLInputElement && !nomeInput.dataset.branaBound) {
      nomeInput.dataset.branaBound = "1";
      nomeInput.addEventListener("keydown", async (ev) => {
        if (ev.key !== "Enter" && ev.key !== "Tab") return;
        ev.preventDefault();
        ev.stopPropagation();
        await executarLookupNomePaciente(nomeInput.value);
      });
      nomeInput.addEventListener("blur", () => {
        try {
          nomeInput.value = String(obterPacienteEmUso()?.nome || nomeInput.value || "").trim();
        } catch {}
      });
    }
    if (btn instanceof HTMLButtonElement && !btn.dataset.branaBound) {
      btn.dataset.branaBound = "1";
      btn.addEventListener("click", async () => {
        await abrirMenuPacientes(String(input instanceof HTMLInputElement ? input.value : "").trim() || String(nomeInput instanceof HTMLInputElement ? nomeInput.value : "").trim());
      });
    }
  }

  function renderEntry(paciente = null) {
    const root = ensureRoot();
    if (!root) return null;

    const ativo = paciente || lastPaciente || obterPacienteEmUso();
    lastPaciente = ativo || null;
    const numero = String(ativo?.numero || "").trim();
    const nome = String(ativo?.nome || "").trim();
    const isEmpty = !numero && !nome;

    root.innerHTML = `
      <div class="brana-prontuario-v1__grid">
        <div class="brana-prontuario-v1__label">Paciente:</div>
        <input class="brana-prontuario-v1__input" data-brana-prontuario-codigo-paciente type="text" inputmode="numeric" autocomplete="off" placeholder="Digite o código e pressione Enter ou Tab" value="${esc(numero)}">
        <input class="brana-prontuario-v1__input" data-brana-prontuario-nome-paciente type="text" autocomplete="off" placeholder="Digite o nome completo e pressione Enter ou Tab" value="${esc(nome)}">
        <select class="brana-prontuario-v1__select" data-brana-prontuario-filtro-paciente aria-label="Filtro clínico">
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
    `;
    root.title = isEmpty ? "Nenhum paciente ativo." : `Paciente ${numero ? `#${numero}` : ""} ${nome}`.trim();
    bindEntryInteractions(root);
    return root;
  }

  function updateRenderedEntry(paciente = null) {
    const root = ensureRoot();
    if (!root) return null;

    const ativo = paciente || obterPacienteEmUso();
    lastPaciente = ativo || null;
    const numero = String(ativo?.numero || "").trim();
    const nome = String(ativo?.nome || "").trim();
    const isEmpty = !numero && !nome;
    const input = root.querySelector("[data-brana-prontuario-codigo-paciente]");
    const nomeEl = root.querySelector("[data-brana-prontuario-nome-paciente]");
    const badge = root.querySelector(".brana-prontuario-v1__badge");

    if (input instanceof HTMLInputElement && document.activeElement !== input) {
      input.value = numero;
    }
    if (nomeEl instanceof HTMLInputElement && document.activeElement !== nomeEl) {
      nomeEl.value = nome;
    }
    if (badge) {
      badge.textContent = isEmpty ? "Sem paciente ativo" : "Paciente em uso";
    }
    root.title = isEmpty ? "Nenhum paciente ativo." : `Paciente ${numero ? `#${numero}` : ""} ${nome}`.trim();
    return root;
  }

  async function executarLookupNomePaciente(nomeDigitado) {
    const valor = String(nomeDigitado || "").trim();
    if (!valor) {
      const abriuVazio = await abrirMenuPacientes("");
      if (!abriuVazio) lastStatus = "menu-indisponivel";
      return { openedMenu: abriuVazio, openedPatient: false, reason: "vazio" };
    }

    const lookup = await localizarPacientePorNome(valor);
    if (lookup.ok && lookup.paciente) {
      try {
        if (typeof fichaAplicarPaciente === "function") {
          fichaAplicarPaciente(lookup.paciente);
        }
      } catch (err) {
        console.warn(`[${MODULE_NAME}] Falha ao aplicar paciente por nome.`, err);
      }
      updateRenderedEntry(lookup.paciente);
      safeSyncHeader(lookup.paciente);
      lastStatus = "paciente-localizado-por-nome";
      return { openedMenu: false, openedPatient: true, paciente: lookup.paciente, reason: "encontrado-exato" };
    }

    const abriuMenu = await abrirMenuPacientes(valor);
    if (abriuMenu) {
      updateRenderedEntry(obterPacienteEmUso());
      lastStatus = "menu-aberto-fallback-nome";
      return { openedMenu: true, openedPatient: false, reason: lookup.reason || "nome-parcial" };
    }
    lastStatus = lookup.reason === "request-indisponivel" ? "request-indisponivel" : "menu-indisponivel";
    return { openedMenu: false, openedPatient: false, reason: lookup.reason || "menu-indisponivel" };
  }

  async function executarLookupCodigoPaciente(codigoDigitado) {
    const valor = String(codigoDigitado || "").trim();
    if (!valor) {
      const abriuVazio = await abrirMenuPacientes("");
      if (!abriuVazio) lastStatus = "menu-indisponivel";
      return { openedMenu: abriuVazio, openedPatient: false, reason: "vazio" };
    }

    const lookup = await localizarPacientePorCodigo(valor);
    if (lookup.ok && lookup.paciente) {
      try {
        if (typeof fichaAplicarPaciente === "function") {
          fichaAplicarPaciente(lookup.paciente);
        }
      } catch (err) {
        console.warn(`[${MODULE_NAME}] Falha ao aplicar paciente localizado.`, err);
      }
      updateRenderedEntry(lookup.paciente);
      safeSyncHeader(lookup.paciente);
      lastStatus = "paciente-localizado";
      return { openedMenu: false, openedPatient: true, paciente: lookup.paciente, reason: "encontrado" };
    }

    const abriuMenu = await abrirMenuPacientes(valor);
    if (abriuMenu) {
      updateRenderedEntry(obterPacienteEmUso());
      lastStatus = "menu-aberto-fallback";
      return { openedMenu: true, openedPatient: false, reason: lookup.reason || "nao-encontrado" };
    }
    lastStatus = lookup.reason === "request-indisponivel" ? "request-indisponivel" : "menu-indisponivel";
    return { openedMenu: false, openedPatient: false, reason: lookup.reason || "menu-indisponivel" };
  }

  function safeSyncHeader(paciente = null) {
    const header = getHeaderModule();
    if (!header || typeof header.sync !== "function") {
      lastStatus = "cabecalho-indisponivel";
      return false;
    }
    try {
      header.ensureMounted?.();
      header.sync(paciente);
      lastStatus = "cabecalho-sincronizado";
      return true;
    } catch (err) {
      console.warn(`[${MODULE_NAME}] Falha ao sincronizar cabecalho de paciente em uso.`, err);
      lastStatus = "falha-sincronizacao";
      return false;
    }
  }

  function installPatientHooks() {
    if (hooksInstalled) return;
    hooksInstalled = true;

    try {
      if (typeof window.fichaAplicarPaciente === "function" && !window.fichaAplicarPaciente.__branaProntuarioWrapped) {
        const originalApply = window.fichaAplicarPaciente;
        const wrappedApply = function () {
          const result = originalApply.apply(this, arguments);
          try {
            updateRenderedEntry(arguments[0] || null);
          } catch {}
          return result;
        };
        wrappedApply.__branaProntuarioWrapped = true;
        wrappedApply.__branaProntuarioOriginal = originalApply;
        window.fichaAplicarPaciente = wrappedApply;
        try {
          fichaAplicarPaciente = wrappedApply;
        } catch {}
      }
    } catch (err) {
      console.warn(`[${MODULE_NAME}] Falha ao instalar hook de aplicacao de paciente.`, err);
    }

    try {
      if (typeof window.fichaLimparNovo === "function" && !window.fichaLimparNovo.__branaProntuarioWrapped) {
        const originalClear = window.fichaLimparNovo;
        const wrappedClear = async function () {
          const result = await originalClear.apply(this, arguments);
          try {
            updateRenderedEntry(null);
          } catch {}
          return result;
        };
        wrappedClear.__branaProntuarioWrapped = true;
        wrappedClear.__branaProntuarioOriginal = originalClear;
        window.fichaLimparNovo = wrappedClear;
        try {
          fichaLimparNovo = wrappedClear;
        } catch {}
      }
    } catch (err) {
      console.warn(`[${MODULE_NAME}] Falha ao instalar hook de limpeza de paciente.`, err);
    }
  }

  async function boot() {
    if (booted) {
      return getStatus();
    }
    booted = true;
    await ensureHeaderModule();
    installPatientHooks();
    renderEntry(obterPacienteEmUso());
    safeSyncHeader(lastPaciente);
    lastStatus = lastStatus === "cabecalho-indisponivel" ? lastStatus : "boot-concluido";
    return getStatus();
  }

  function refresh(paciente = null) {
    const resolved = paciente || obterPacienteEmUso();
    updateRenderedEntry(resolved) || renderEntry(resolved);
    const synced = safeSyncHeader(resolved);
    return {
      module: MODULE_NAME,
      synced,
      status: lastStatus,
    };
  }

  function getStatus() {
    return {
      module: MODULE_NAME,
      booted,
      status: lastStatus,
      headerLoaded: !!getHeaderModule(),
      patient: lastPaciente,
    };
  }

  function mountWhenReady() {
    if (typeof document === "undefined") return;
    const run = () => {
      void boot();
    };
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", run, { once: true });
      return;
    }
    run();
  }

  const api = Object.freeze({
    moduleName: MODULE_NAME,
    boot,
    refresh,
    getStatus,
    ensureHeaderModule,
    obterPacienteEmUso,
    renderEntry,
    executarLookupCodigoPaciente,
    executarLookupNomePaciente,
  });

  window.BranaProntuarioV1 = api;
  if (typeof globalThis !== "undefined") {
    globalThis.BranaProntuarioV1 = api;
  }

  mountWhenReady();
})();
