(function () {
  "use strict";

  const MODULE_NAME = "BranaNovoTratamentoPacienteGate";

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

  async function tentarAbrirMenuPacientesExistente(prefill = "") {
    if (typeof fichaMenuPacAbrir !== "function") {
      console.warn(`[${MODULE_NAME}] Menu de pacientes indisponivel.`);
      return false;
    }
    try {
      await fichaMenuPacAbrir(prefill, { mode: "paciente" });
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

    const openedMenu = await tentarAbrirMenuPacientesExistente("");
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
    tentarAbrirMenuPacientesExistente,
    abrirNovoTratamentoComPacienteOuMenuPacientes,
  });
})();
