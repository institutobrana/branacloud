(function () {
  "use strict";

  const MODULE_NAME = "BranaToolbarPrincipalPrimeiraOndaV1";
  const ROOT_SELECTOR = ".toolbar-bar";
  const LEFT_SELECTOR = ".toolbar-left";
  const FOOTER_SELECTOR = "#footer-msg";
  const EASY_BMP_BASE = "/desktop-assets/easy";

  let legacyLeftHtml = null;
  let mounted = false;

  function easyBmp(name) {
    return `${EASY_BMP_BASE}/${name}`;
  }

  const FINAL_BUTTONS = [
    {
      id: "toolbar-novo-paciente",
      action: "cadastro-novo-paciente",
      title: "Novo paciente",
      icon: easyBmp("cmd_novopac.bmp"),
      label: "Novo paciente",
      kind: "action",
    },
    {
      id: "toolbar-menu-pacientes",
      action: "cadastro-abre-paciente",
      title: "Menu de pacientes",
      icon: easyBmp("cmd_menupac.bmp"),
      label: "Menu de pacientes",
      kind: "action",
    },
    {
      id: "toolbar-novo-tratamento",
      action: "tratamento-novo",
      title: "Novo tratamento",
      icon: easyBmp("cmd_novotra.bmp"),
      label: "Novo tratamento",
      kind: "action",
    },
    {
      id: "toolbar-agenda",
      action: "agenda-dia",
      title: "Agenda",
      icon: easyBmp("cmd_agepes.bmp"),
      label: "Agenda",
      kind: "action",
    },
    {
      id: "toolbar-conta-corrente",
      action: "conta-corrente",
      title: "Conta corrente",
      icon: easyBmp("cmd_ccpac.bmp"),
      label: "Conta corrente",
      kind: "action",
    },
    {
      id: "toolbar-odontograma",
      title: "Odontograma",
      icon: easyBmp("cmd_odontograma.bmp"),
      label: "Odontograma",
      kind: "custom",
      onClick: async () => {
        const fn = typeof window !== "undefined" ? window.BranaOdontogramaV1Module?.abrir : null;
        if (typeof fn === "function") {
          await fn();
          return true;
        }
        return false;
      },
    },
    {
      id: "toolbar-editor-textos",
      action: "ferr-editor-textos",
      title: "Editor de textos",
      icon: easyBmp("cmd_editor.bmp"),
      label: "Editor de textos",
      kind: "action",
    },
    {
      id: "toolbar-receita",
      title: "Receita",
      icon: easyBmp("cmd_receita.bmp"),
      label: "Receita",
      kind: "custom",
      onClick: async () => {
        const direct = typeof window !== "undefined" ? window.editorTextosNovoPorTipo : null;
        if (typeof direct === "function") {
          await direct("receita");
          return true;
        }
        const fallback = typeof window !== "undefined" ? window.executarAcaoMenu : null;
        if (typeof fallback === "function") {
          await fallback("ferr-editor-textos");
          return true;
        }
        return false;
      },
    },
    {
      id: "toolbar-preferencias",
      action: "config-preferencias",
      title: "Preferencias",
      icon: easyBmp("cmd_preferencias.bmp"),
      label: "Preferencias",
      kind: "action",
    },
    {
      id: "toolbar-indices-financeiros",
      action: "config-indices-financeiros",
      title: "Indices financeiros",
      icon: easyBmp("cmd_cnfindice.bmp"),
      label: "Indices financeiros",
      kind: "action",
    },
    {
      id: "toolbar-configuracoes",
      action: "config-opcoes-sistema",
      title: "Configuracoes",
      icon: easyBmp("cmd_config.bmp"),
      label: "Configuracoes",
      kind: "action",
    },
    {
      id: "toolbar-sobre-ajuda",
      action: "sobre",
      title: "Sobre / Ajuda",
      icon: easyBmp("cmd_help.bmp"),
      label: "Sobre / Ajuda",
      kind: "action",
    },
    {
      id: "toolbar-tela",
      title: "Tela",
      icon: easyBmp("cmd_tela.bmp"),
      label: "Tela",
      kind: "placeholder",
    },
    {
      id: "toolbar-insere",
      title: "Inserir",
      icon: easyBmp("cmd_insere.bmp"),
      label: "Inserir",
      kind: "placeholder",
    },
    {
      id: "toolbar-remove",
      title: "Remover",
      icon: easyBmp("cmd_remove.bmp"),
      label: "Remover",
      kind: "placeholder",
    },
    {
      id: "toolbar-copia",
      title: "Copiar",
      icon: easyBmp("cmd_copia.bmp"),
      label: "Copiar",
      kind: "placeholder",
    },
    {
      id: "toolbar-filtra",
      title: "Filtrar",
      icon: easyBmp("cmd_filtra.bmp"),
      label: "Filtrar",
      kind: "placeholder",
    },
    {
      id: "toolbar-procura",
      title: "Procurar",
      icon: easyBmp("cmd_procura.bmp"),
      label: "Procurar",
      kind: "placeholder",
    },
    {
      id: "toolbar-detalhes",
      title: "Detalhes",
      icon: easyBmp("cmd_detalhes.bmp"),
      label: "Detalhes",
      kind: "placeholder",
    },
    {
      id: "toolbar-rapido",
      title: "Rapido",
      icon: easyBmp("cmd_rapido.bmp"),
      label: "Rapido",
      kind: "placeholder",
    },
  ];

  function esc(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function getToolbarRoot() {
    if (typeof document === "undefined") return null;
    return document.querySelector(ROOT_SELECTOR);
  }

  function getToolbarLeft() {
    const root = getToolbarRoot();
    if (!root) return null;
    return root.querySelector(LEFT_SELECTOR);
  }

  function setFooterMessage(message) {
    if (typeof document === "undefined") return;
    const footer = document.querySelector(FOOTER_SELECTOR);
    if (footer) footer.textContent = String(message ?? "");
  }

  async function executeAction(action) {
    const fn = typeof window !== "undefined" ? window.executarAcaoMenu : null;
    if (typeof fn !== "function") {
      console.warn(`[${MODULE_NAME}] executarAcaoMenu indisponivel.`);
      return false;
    }
    try {
      await fn(action);
      return true;
    } catch (err) {
      console.warn(`[${MODULE_NAME}] Falha ao executar acao "${action}".`, err);
      return false;
    }
  }

  async function handleButton(spec) {
    if (!spec) return;
    if (spec.kind === "placeholder") {
      setFooterMessage(`${spec.label}: em planejamento.`);
      return;
    }
    if (typeof spec.onClick === "function") {
      const ok = await spec.onClick();
      if (!ok && spec.action) {
        await executeAction(spec.action);
      }
      return;
    }
    if (spec.action) {
      const ok = await executeAction(spec.action);
      if (!ok && spec.label) {
        setFooterMessage(`${spec.label}: indisponivel no momento.`);
      }
    }
  }

  function createButton(spec) {
    const button = document.createElement("button");
    button.type = "button";
    button.id = spec.id;
    button.className = "toolbar-btn toolbar-btn-final";
    button.title = spec.title;
    button.setAttribute("aria-label", spec.title);
    if (spec.kind === "placeholder") {
      button.setAttribute("data-toolbar-placeholder", "1");
    }
    button.innerHTML = `<img src="${esc(spec.icon)}" alt="">`;
    button.addEventListener("click", () => {
      void handleButton(spec);
    });
    return button;
  }

  function render() {
    const left = getToolbarLeft();
    if (!left) return null;
    if (left.dataset.toolbarPrimeiraOndaMounted === "1") return left;

    legacyLeftHtml = left.innerHTML;
    left.replaceChildren(...FINAL_BUTTONS.map(createButton));
    left.dataset.toolbarPrimeiraOndaMounted = "1";
    left.dataset.toolbarLegacyHtml = legacyLeftHtml ? "1" : "0";
    return left;
  }

  function restoreLegacy() {
    const left = getToolbarLeft();
    if (!left || legacyLeftHtml == null) return false;
    left.innerHTML = legacyLeftHtml;
    left.dataset.toolbarPrimeiraOndaMounted = "0";
    return true;
  }

  function isMounted() {
    return mounted;
  }

  function mount() {
    if (mounted) return true;
    const result = render();
    mounted = !!result;
    return mounted;
  }

  function getStatus() {
    return {
      module: MODULE_NAME,
      mounted,
      hasLegacyBackup: legacyLeftHtml != null,
      buttonCount: FINAL_BUTTONS.length,
      placeholderCount: FINAL_BUTTONS.filter((item) => item.kind === "placeholder").length,
    };
  }

  const api = Object.freeze({
    moduleName: MODULE_NAME,
    mount,
    render,
    restoreLegacy,
    isMounted,
    getStatus,
    buttons: FINAL_BUTTONS.slice(),
  });

  if (typeof window !== "undefined") {
    window.BranaToolbarPrincipalPrimeiraOndaV1 = api;
  }

  if (typeof globalThis !== "undefined") {
    globalThis.BranaToolbarPrincipalPrimeiraOndaV1 = api;
  }

  mount();
})();
