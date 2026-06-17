(function () {
  "use strict";

  const MODULE_NAME = "BranaOrcamentoModule";
  const VERSION = "20260617-onda3-1";

  let depsPromise = null;
  const modalPromises = new Map();
  let bound = false;

  function getStateModule() {
    return window.BranaOrcamentoStateV1 || null;
  }

  function getApiModule() {
    return window.BranaOrcamentoApiV1 || null;
  }

  function getRenderModule() {
    return window.BranaOrcamentoRenderV1 || null;
  }

  async function ensureDependencies() {
    if (getStateModule() && getApiModule() && getRenderModule()) {
      return {
        state: getStateModule(),
        api: getApiModule(),
        render: getRenderModule(),
      };
    }
    if (!depsPromise) {
      depsPromise = Promise.all([
        import(`/frontend/orcamento/orcamento-state.js?v=${VERSION}`),
        import(`/frontend/orcamento/orcamento-api.js?v=${VERSION}`),
        import(`/frontend/orcamento/orcamento-render.js?v=${VERSION}`),
      ]).catch((err) => {
        depsPromise = null;
        throw err;
      });
    }
    await depsPromise;
    return {
      state: getStateModule(),
      api: getApiModule(),
      render: getRenderModule(),
    };
  }

  async function ensureModalModule(cacheKey, path, globalName) {
    if (window[globalName]) {
      return window[globalName];
    }
    if (!modalPromises.has(cacheKey)) {
      modalPromises.set(
        cacheKey,
        import(`/frontend/orcamento/modals/${path}?v=${VERSION}`).catch((err) => {
          modalPromises.delete(cacheKey);
          throw err;
        })
      );
    }
    await modalPromises.get(cacheKey);
    return window[globalName] || null;
  }

  function closeOpenOrcamentoModals() {
    const names = [
      "BranaOrcamentoPropriedadesIntervencaoModal",
      "BranaOrcamentoEliminaIntervencaoModal",
      "BranaOrcamentoAprovacaoOrcamentoModal",
      "BranaOrcamentoAlteraParcelaModal",
      "BranaOrcamentoImpressaoTratamentoModal",
    ];
    names.forEach((name) => {
      try {
        window[name]?.close?.();
      } catch {}
    });
  }

  function num(value, fallback = 0) {
    const n = Number(value || 0);
    return Number.isFinite(n) ? n : fallback;
  }

  function getCurrentPatientFromGlobals() {
    try {
      const header = window.BranaPacienteEmUsoHeaderV1;
      if (header && typeof header.getSources === "function") {
        const source = header.getSources();
        if (source && (source.id || source.numero || source.nome)) {
          return {
            id: num(source.id || 0),
            numero: String(source.numero || "").trim(),
            nome: String(source.nome || "").trim(),
            source: String(source.source || "").trim(),
            raw: source,
          };
        }
      }
    } catch {}

    try {
      if (typeof BranaOdontoV1Module !== "undefined") {
        const paciente = BranaOdontoV1Module?.state?.paciente || null;
        const id = num(paciente?.id || 0);
        if (id > 0) {
          return {
            id,
            numero: String(paciente?.codigo ?? paciente?.numero ?? "").trim(),
            nome: String(paciente?.nome_completo || paciente?.nome || "").trim(),
            source: "odontograma",
            raw: paciente,
          };
        }
      }
    } catch {}

    try {
      const id = num(typeof fichaPacienteAtualId !== "undefined" ? fichaPacienteAtualId : 0);
      if (id > 0) {
        const fichaObj = typeof ficha !== "undefined" ? ficha : null;
        return {
          id,
          numero: String(typeof fichaCodigoUltimoResolvido !== "undefined" ? fichaCodigoUltimoResolvido : fichaObj?.codigo?.value || "").trim(),
          nome: String(fichaObj?.titulo?.textContent || fichaObj?.nome?.value || "").replace(/^Ficha pessoal\s*-\s*/i, "").trim(),
          source: "ficha",
          raw: fichaObj || null,
        };
      }
    } catch {}

    return null;
  }

  async function openPatientMenu(prefill = "", onSelect = null) {
    if (typeof fichaMenuPacAbrir !== "function") {
      return { openedMenu: false, reason: "menu-indisponivel" };
    }
    try {
      await fichaMenuPacAbrir(prefill, {
        mode: "paciente",
        onSelect: async (item) => {
          if (typeof onSelect === "function") {
            await onSelect(item || null);
          }
        },
      });
      return { openedMenu: true, reason: "menu-aberto" };
    } catch (err) {
      console.warn(`[${MODULE_NAME}] Falha ao abrir Menu de pacientes.`, err);
      return { openedMenu: false, reason: "menu-indisponivel" };
    }
  }

  function ensureMounted() {
    const render = getRenderModule();
    const state = getStateModule();
    if (!render || !state) return null;
    const panel = render.mountPanel();
    if (!panel) return null;
    state.setMounted(panel.panel || panel);
    return panel;
  }

  function buildPatientContext(patient) {
    if (!patient) return null;
    const id = num(patient.id || 0);
    if (id <= 0) return null;
    return {
      id,
      numero: String(patient.numero || patient.codigo || "").trim(),
      nome: String(patient.nome || patient.nome_completo || "").trim(),
      source: String(patient.source || "").trim(),
      raw: patient.raw || patient,
    };
  }

  function getSnapshotState() {
    const state = getStateModule();
    return typeof state?.snapshot === "function" ? state.snapshot() : null;
  }

  function getSelectedIntervention(snapshot = null) {
    const data = snapshot || getSnapshotState();
    const items = Array.isArray(data?.treatmentData?.intervencoes) ? data.treatmentData.intervencoes : [];
    const selectedId = Number(data?.selectedInterventionId || 0) || 0;
    if (selectedId > 0) {
      const found = items.find((item) => Number(item?.id || 0) === selectedId);
      if (found) return found;
    }
    return items[0] || null;
  }

  function getSelectedParcel(snapshot = null) {
    const data = snapshot || getSnapshotState();
    const items = Array.isArray(data?.treatmentData?.parcelas) ? data.treatmentData.parcelas : [];
    const selectedId = Number(data?.selectedParcelId || 0) || 0;
    if (selectedId > 0) {
      const found = items.find((item) => Number(item?.numero || 0) === selectedId);
      if (found) return found;
    }
    return items[0] || null;
  }

  async function openInterventionPropertiesModal(scope = "esta") {
    closeOpenOrcamentoModals();
    const snapshot = getSnapshotState();
    const intervention = getSelectedIntervention(snapshot);
    if (!intervention) {
      updateFooterMessage("Selecione uma intervenção para alterar.");
      return { opened: false, reason: "sem-intervencao" };
    }
    const modal = await ensureModalModule(
      "propriedades-intervencao",
      "propriedades-da-intervencao.js",
      "BranaOrcamentoPropriedadesIntervencaoModal"
    );
    if (!modal?.open) {
      updateFooterMessage("Modal de propriedades da intervenção indisponível.");
      return { opened: false, reason: "modal-indisponivel" };
    }
    await modal.open({
      snapshot,
      treatmentId: Number(snapshot?.selectedTreatmentId || 0) || 0,
      intervention,
      api: getApiModule(),
      onSaved: async ({ scope: savedScope } = {}) => {
        await refreshCurrentTreatment();
        updateFooterMessage(savedScope === "all" ? "Grava todas concluído para o tratamento atual." : "Intervenção gravada.");
      },
      onClose: () => updateFooterMessage(scope === "all" ? "Propriedades fechadas sem gravar todas." : "Propriedades fechadas."),
    });
    return { opened: true };
  }

  async function openDeleteInterventionModal() {
    closeOpenOrcamentoModals();
    const snapshot = getSnapshotState();
    const intervention = getSelectedIntervention(snapshot);
    if (!intervention) {
      updateFooterMessage("Selecione uma intervenção para eliminar.");
      return { opened: false, reason: "sem-intervencao" };
    }
    const modal = await ensureModalModule(
      "elimina-intervencao",
      "elimina-intervencao.js",
      "BranaOrcamentoEliminaIntervencaoModal"
    );
    if (!modal?.open) {
      updateFooterMessage("Modal de eliminação indisponível.");
      return { opened: false, reason: "modal-indisponivel" };
    }
    await modal.open({
      intervention,
      onConfirm: async () => {
        updateFooterMessage("Eliminação confirmada no modal. Persistência do delete ainda pendente.");
      },
      onCancel: () => updateFooterMessage("Eliminação cancelada."),
    });
    return { opened: true };
  }

  async function openApprovalModal() {
    closeOpenOrcamentoModals();
    const snapshot = getSnapshotState();
    const modal = await ensureModalModule(
      "aprovacao-orcamento",
      "aprovacao-orcamento.js",
      "BranaOrcamentoAprovacaoOrcamentoModal"
    );
    if (!modal?.open) {
      updateFooterMessage("Modal de aprovação indisponível.");
      return { opened: false, reason: "modal-indisponivel" };
    }
    await modal.open({
      phase: "confirm",
      snapshot,
      treatmentId: Number(snapshot?.selectedTreatmentId || 0) || 0,
      patient: snapshot?.patient || null,
      patientName: snapshot?.patientLabel || "",
      api: getApiModule(),
      onApproved: async () => {
        await refreshCurrentTreatment();
        updateFooterMessage("Orçamento aprovado.");
      },
      onCancel: () => updateFooterMessage("Aprovação cancelada."),
    });
    return { opened: true };
  }

  async function openParcelModal() {
    closeOpenOrcamentoModals();
    const snapshot = getSnapshotState();
    const parcel = getSelectedParcel(snapshot);
    if (!parcel) {
      updateFooterMessage("Selecione uma parcela para alterar.");
      return { opened: false, reason: "sem-parcela" };
    }
    const modal = await ensureModalModule(
      "altera-parcela",
      "altera-parcela.js",
      "BranaOrcamentoAlteraParcelaModal"
    );
    if (!modal?.open) {
      updateFooterMessage("Modal de parcela indisponível.");
      return { opened: false, reason: "modal-indisponivel" };
    }
    await modal.open({
      parcel,
      snapshot,
      treatmentId: Number(snapshot?.selectedTreatmentId || 0) || 0,
      api: getApiModule(),
      onSaved: async () => {
        await refreshCurrentTreatment();
        updateFooterMessage("Parcela gravada.");
      },
      onCancel: () => updateFooterMessage("Alteração de parcela cancelada."),
    });
    return { opened: true };
  }

  async function openPrintModal() {
    closeOpenOrcamentoModals();
    const snapshot = getSnapshotState();
    const modal = await ensureModalModule(
      "impressao-tratamento",
      "impressao-tratamento.js",
      "BranaOrcamentoImpressaoTratamentoModal"
    );
    if (!modal?.open) {
      updateFooterMessage("Modal de impressão indisponível.");
      return { opened: false, reason: "modal-indisponivel" };
    }
    await modal.open({
      snapshot,
      treatmentId: Number(snapshot?.selectedTreatmentId || 0) || 0,
      api: getApiModule(),
      onPrepared: async () => {
        updateFooterMessage("Impressão preparada.");
      },
      onCancel: () => updateFooterMessage("Impressão cancelada."),
    });
    return { opened: true };
  }

  async function loadTratamento(tratamentoId) {
    const { state, api, render } = await ensureDependencies();
    const id = num(tratamentoId || 0);
    if (id <= 0) return null;
    state.setLoading(true);
    state.setError("");
    render.render(state.snapshot());
    const result = await api.carregarTratamento(id);
    if (!result.ok) {
      state.setLoading(false);
      state.setError(result.message || "Falha ao carregar orçamento.");
      render.render(state.snapshot());
      return null;
    }
    state.applyTreatmentSnapshot(result.data || {});
    state.setSelectedIntervention(Number(state.snapshot().treatmentData?.intervencoes?.[0]?.id || 0) || 0);
    state.setSelectedParcel(Number(state.snapshot().treatmentData?.parcelas?.[0]?.numero || 0) || 0);
    state.setLoading(false);
    state.setError("");
    render.render(state.snapshot());
    return result.data || null;
  }

  async function loadPaciente(patientContext, preferredTreatmentId = 0) {
    const { state, api, render } = await ensureDependencies();
    const patient = buildPatientContext(patientContext);
    if (!patient) {
      state.reset();
      render.render(state.snapshot());
      return { ok: false, reason: "sem-paciente" };
    }
    state.setPatient(patient.raw || patient, patient.source);
    state.setTreatments([]);
    state.setTreatmentData(state.createEmptyTreatmentData());
    state.setSelectedIntervention(0);
    state.setSelectedParcel(0);
    state.setError("");
    state.setNotice("");
    state.setLoading(true);
    render.render(state.snapshot());

    const treatmentsResult = await api.listarTratamentosPaciente(patient.id);
    if (!treatmentsResult.ok) {
      state.setLoading(false);
      state.setError(treatmentsResult.message || "Falha ao carregar tratamentos.");
      render.render(state.snapshot());
      return { ok: false, reason: "falha-tratamentos" };
    }

    state.setTreatments(treatmentsResult.items, preferredTreatmentId || treatmentsResult.items[0]?.id || 0);
    render.render(state.snapshot());

    const selectedId = Number(state.state?.selectedTreatmentId || 0) || Number(treatmentsResult.items[0]?.id || 0) || 0;
    if (selectedId > 0) {
      await loadTratamento(selectedId);
    } else {
      state.setLoading(false);
      state.setNotice("Nenhum tratamento encontrado para este paciente.");
      render.render(state.snapshot());
    }
    return { ok: true, patient, treatments: treatmentsResult.items || [] };
  }

  function updateFooterMessage(message) {
    if (typeof footerMsg !== "undefined" && footerMsg) {
      footerMsg.textContent = String(message || "").trim();
    }
  }

  async function openOrcamento(context = {}) {
    const { state, render } = await ensureDependencies();
    await bind();
    const panel = ensureMounted();
    const panelEl = panel?.panel || panel || null;
    if (!panelEl) {
      updateFooterMessage("Orçamento indisponível no momento.");
      return { opened: false, reason: "panel-indisponivel" };
    }

    if (typeof hideAllPanels === "function") {
      try {
        hideAllPanels();
      } catch {}
    }
    if (panelEl?.classList) {
      panelEl.classList.remove("hidden");
    }

    const workspaceEmpty = typeof window !== "undefined" ? window.workspaceEmpty : null;
    if (workspaceEmpty instanceof HTMLElement) {
      workspaceEmpty.classList.add("hidden");
    } else {
      const ws = document.getElementById("workspace-empty");
      if (ws) ws.classList.add("hidden");
    }

    const explicit = buildPatientContext(context.patient || context);
    const current = explicit || getCurrentPatientFromGlobals();

    if (!current) {
      state.reset();
      render.render(state.snapshot());
      updateFooterMessage("Selecione um paciente para abrir o orçamento.");
      await openPatientMenu("", async (item) => {
        const selected = buildPatientContext(item);
        if (!selected) return;
        await loadPaciente(selected, 0);
        updateFooterMessage("Orçamento aberto.");
      });
      return { opened: true, openedMenu: true, reason: "sem-paciente" };
    }

    await loadPaciente(current, Number(context.tratamentoId || context.selectedTreatmentId || 0) || 0);
    updateFooterMessage("Orçamento aberto.");
    return { opened: true, patient: current };
  }

  async function refreshCurrentTreatment() {
    const state = getStateModule();
    const treatmentId = num(state?.state?.selectedTreatmentId || 0);
    if (treatmentId <= 0) return null;
    return loadTratamento(treatmentId);
  }

  async function handleAction(action) {
    if (action === "edit-intervencao") {
      await openInterventionPropertiesModal("esta");
      return;
    }
    if (action === "delete-intervencao") {
      await openDeleteInterventionModal();
      return;
    }
    if (action === "approve-intervencao") {
      await openApprovalModal();
      return;
    }
    if (action === "print") {
      await openPrintModal();
      return;
    }
    if (action === "indice" || action === "calcular-juros" || action === "recalcular-parcelas" || action === "insere-comissao" || action === "elimina-comissao" || action === "distribui-comissao") {
      updateFooterMessage("Ação de Orçamento ainda em planejamento.");
      return;
    }
  }

  async function handleTreatmentChange(treatmentId) {
    const { state, render } = await ensureDependencies();
    const selected = num(treatmentId || 0);
    if (selected <= 0) return;
    state.setSelectedIntervention(0);
    state.setSelectedParcel(0);
    state.setLoading(true);
    render.render(state.snapshot());
    await loadTratamento(selected);
  }

  async function handleTabChange(tab) {
    const { state, render } = await ensureDependencies();
    state.setActiveTab(tab);
    render.render(state.snapshot());
  }

  async function handleInterventionSelect(id) {
    const { state, render } = await ensureDependencies();
    state.setSelectedIntervention(id);
    render.render(state.snapshot());
  }

  async function handleParcelSelect(id) {
    const { state, render } = await ensureDependencies();
    state.setSelectedParcel(id);
    render.render(state.snapshot());
  }

  async function handlePatientMenu() {
    const current = getCurrentPatientFromGlobals();
    const prefill = current?.numero || "";
    const result = await openPatientMenu(prefill, async (item) => {
      const selected = buildPatientContext(item);
      if (!selected) return;
      await loadPaciente(selected, 0);
      updateFooterMessage("Orçamento atualizado para o novo paciente.");
    });
    if (!result.openedMenu) {
      updateFooterMessage("Menu de pacientes indisponível.");
    }
  }

  async function close() {
    const { state, render } = await ensureDependencies();
    closeOpenOrcamentoModals();
    state.reset();
    render.render(state.snapshot());
    if (typeof hideAllPanels === "function") {
      try {
        hideAllPanels();
      } catch {}
    }
    const ws = document.getElementById("workspace-empty");
    if (ws) ws.classList.remove("hidden");
    updateFooterMessage("Orçamento fechado.");
    return true;
  }

  async function bind() {
    if (bound) return;
    const { state, render } = await ensureDependencies();
    const cfg = render.mountPanel();
    if (!cfg) return;
    render.bindControls({
      onAction: handleAction,
      onClose: close,
      onPatientMenu: handlePatientMenu,
      onTreatmentChange: handleTreatmentChange,
      onTabChange: handleTabChange,
      onInterventionSelect: handleInterventionSelect,
      onParcelSelect: handleParcelSelect,
      onInterventionDblClick: (id) => {
        state.setSelectedIntervention(id);
        render.render(state.snapshot());
        openInterventionPropertiesModal("esta");
      },
      onParcelDblClick: (id) => {
        state.setSelectedParcel(id);
        render.render(state.snapshot());
        openParcelModal();
      },
    });
    bound = true;
  }

  async function boot() {
    await ensureDependencies();
    await bind();
    const panel = ensureMounted();
    const render = getRenderModule();
    const state = getStateModule();
    if (panel && render && state) {
      render.render(state.snapshot());
    }
  }

  window.BranaOrcamentoModule = Object.freeze({
    moduleName: MODULE_NAME,
    version: VERSION,
    ensureDependencies,
    ensureMounted,
    boot,
    open: openOrcamento,
    close,
    bind,
    refreshCurrentTreatment,
    loadPaciente,
    loadTratamento,
    handleAction,
    handleTreatmentChange,
    handleTabChange,
    handlePatientMenu,
  });
})();
