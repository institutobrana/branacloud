(function () {
  "use strict";

  const MODULE_NAME = "BranaNovoTratamentoPacienteGate";
  const ORIGEM_TRATAMENTO_NOVO = "tratamento_novo";

  let origemPendente = null;

  function num(value, fallback = 0) {
    const n = Number(value || 0);
    return Number.isFinite(n) ? n : fallback;
  }

  function getOdontoPaciente() {
    try {
      const module = typeof BranaOdontogramaV1Module !== "undefined" ? BranaOdontogramaV1Module : null;
      const paciente = module?.state?.paciente || null;
      const id = num(paciente?.id || 0);
      if (id > 0) return { id, paciente, source: "odontograma" };
    } catch {}
    return null;
  }

  function getFichaPaciente() {
    try {
      const id = num(typeof fichaPacienteAtualId !== "undefined" ? fichaPacienteAtualId : 0);
      if (id > 0) return { id, source: "fichaPacienteAtualId" };
    } catch {}
    return null;
  }

  function obterPacienteEmUsoSeguro() {
    return getOdontoPaciente() || getFichaPaciente() || null;
  }

  function temPacienteEmUsoSeguro() {
    return !!obterPacienteEmUsoSeguro();
  }

  function marcarOrigemPendente(origem) {
    origemPendente = String(origem || "").trim() || null;
  }

  function consumirOrigemPendente() {
    const atual = origemPendente;
    origemPendente = null;
    return atual;
  }

  async function renderizarPacienteNaTelaPrincipal(item) {
    const id = num(item?.id || 0);
    if (!id) return false;
    const codigo = String(item?.codigo ?? item?.numero ?? "").trim();
    const nomeCompleto = String(item?.nome_completo || "").trim();
    const nome = nomeCompleto || String(`${item?.nome || ""} ${item?.sobrenome || ""}`).trim();

    try {
      if (typeof fichaAplicarPaciente === "function") {
        fichaAplicarPaciente(item);
      }
    } catch (err) {
      console.warn(`[${MODULE_NAME}] Falha ao aplicar paciente no contexto legado.`, err);
    }

    const abrirTelaPrincipal = typeof window !== "undefined"
      ? (window.abrirTelaPrincipalOdontologicaNoWorkspace || window.abrirTelaPrincipalOdontologicaPorPaciente)
      : null;

    if (typeof abrirTelaPrincipal !== "function") {
      console.warn(`[${MODULE_NAME}] Tela principal odontologica indisponivel.`);
      return true;
    }

    try {
      await Promise.resolve(abrirTelaPrincipal({
        origem: "tratamento-novo",
        origemSecundaria: "menu-pacientes",
        modo: "visual-estatico",
        comPaciente: true,
        pacienteId: id,
        pacienteCodigo: codigo,
        pacienteNome: nome,
        container: null,
      }));
      return true;
    } catch (err) {
      console.warn(`[${MODULE_NAME}] Falha ao montar tela principal com paciente selecionado.`, err);
      return false;
    }
  }

  async function tentarAbrirMenuPacientesExistente(prefill = "", opts = {}) {
    if (typeof fichaMenuPacAbrir !== "function") {
      console.warn(`[${MODULE_NAME}] Menu de pacientes indisponivel.`);
      return false;
    }
    try {
      await fichaMenuPacAbrir(prefill, {
        mode: "paciente",
        ...opts,
      });
      return true;
    } catch (err) {
      console.warn(`[${MODULE_NAME}] Falha ao abrir Menu de pacientes.`, err);
      return false;
    }
  }

  async function abrirNovoTratamentoComPacienteOuMenuPacientes() {
    const paciente = obterPacienteEmUsoSeguro();
    if (paciente) {
      if (window.BranaNovoTratamentoModal?.open) {
        window.BranaNovoTratamentoModal.open();
        return {
          openedModal: true,
          openedMenu: false,
          patient: paciente,
          reason: "modal-aberto",
        };
      }
      console.warn(`[${MODULE_NAME}] Modal Novo tratamento indisponivel.`);
      return {
        openedModal: false,
        openedMenu: false,
        patient: paciente,
        reason: "modal-indisponivel",
      };
    }

    marcarOrigemPendente(ORIGEM_TRATAMENTO_NOVO);
    const openedMenu = await tentarAbrirMenuPacientesExistente("", {
      onSelect: async (item) => {
        const origem = consumirOrigemPendente();
        if (origem !== ORIGEM_TRATAMENTO_NOVO) return false;
        const carregouTela = await renderizarPacienteNaTelaPrincipal(item);
        if (!carregouTela) return false;
        if (window.BranaNovoTratamentoModal?.open) {
          window.BranaNovoTratamentoModal.open();
          return true;
        }
        console.warn(`[${MODULE_NAME}] Modal Novo tratamento indisponivel apos selecionar paciente.`);
        return false;
      },
      onClose: () => {
        if (origemPendente === ORIGEM_TRATAMENTO_NOVO) origemPendente = null;
      },
    });
    if (!openedMenu) {
      consumirOrigemPendente();
    }
    return {
      openedModal: false,
      openedMenu,
      patient: null,
      reason: openedMenu ? "menu-aberto" : "menu-indisponivel",
    };
  }

  window.BranaNovoTratamentoPacienteGate = Object.freeze({
    moduleName: MODULE_NAME,
    obterPacienteEmUsoSeguro,
    temPacienteEmUsoSeguro,
    marcarOrigemPendente,
    consumirOrigemPendente,
    tentarAbrirMenuPacientesExistente,
    renderizarPacienteNaTelaPrincipal,
    abrirNovoTratamentoComPacienteOuMenuPacientes,
  });
})();
