(function () {
  "use strict";

  const MODULE_NAME = "BranaOrcamentoStateV1";

  const TABS = ["principal", "detalhes", "convenio", "ortodontia", "comissoes"];

  function createEmptyTreatmentData() {
    return {
      tratamento: null,
      principal: {
        valor_total: 0,
        desconto_percentual: 0,
        valor_corrigido: 0,
        total_ja_pago: 0,
        total_a_pagar: 0,
        indice: "R$",
        parcelas: 1,
        valor_diferenca: 0,
      },
      detalhes: {
        nro_tratamento: "",
        validade: "",
        criacao_tratamento: "",
        ultima_alteracao: "",
        ultima_aprovacao: "",
      },
      convenio: {
        numero_guia_tratamento: "",
        senha_autorizacao: "",
        total_repasse_previsto: 0,
        data_prevista_pagamento: "",
      },
      ortodontia: {
        valor_manutencao_moeda: "R$",
        valor_manutencao: 0,
        vencimento_dia: 0,
        termino_previsto: "",
        ativar_manutencao: false,
      },
      intervencoes: [],
      parcelas: [],
      comissoes: [],
      status_lookup: [],
    };
  }

  function createDefaultState() {
    return {
      mounted: false,
      panel: null,
      patient: null,
      patientLabel: "",
      patientSource: "",
      treatments: [],
      selectedTreatmentId: 0,
      treatmentData: createEmptyTreatmentData(),
      activeTab: "principal",
      selectedInterventionId: 0,
      selectedParcelId: 0,
      loading: false,
      error: "",
      notice: "",
      lastLoadedAt: "",
    };
  }

  const state = createDefaultState();

  function clone(value) {
    if (typeof structuredClone === "function") {
      try {
        return structuredClone(value);
      } catch {}
    }
    try {
      return JSON.parse(JSON.stringify(value));
    } catch {
      return value == null ? value : { ...value };
    }
  }

  function setMounted(panel) {
    state.mounted = !!panel;
    state.panel = panel || null;
    return state.panel;
  }

  function setPatient(patient, source = "") {
    state.patient = patient ? clone(patient) : null;
    state.patientSource = String(source || patient?.source || "").trim();
    const numero = String(
      patient?.numero ??
      patient?.codigo ??
      patient?.id ??
      ""
    ).trim();
    const nomeCompleto = String(
      patient?.nome_completo ||
      patient?.nome ||
      ""
    ).trim();
    state.patientLabel = [numero ? `#${numero}` : "", nomeCompleto].filter(Boolean).join(" - ");
    if (!state.patientLabel && patient?.id) {
      state.patientLabel = `Paciente #${patient.id}`;
    }
    return state.patient;
  }

  function setTreatments(items, selectedId = 0) {
    state.treatments = Array.isArray(items) ? items.map((item) => clone(item)) : [];
    const validId = Number(selectedId || 0) || 0;
    if (validId && state.treatments.some((item) => Number(item?.id || 0) === validId)) {
      state.selectedTreatmentId = validId;
      return state.treatments;
    }
    state.selectedTreatmentId = Number(state.treatments[0]?.id || 0) || 0;
    return state.treatments;
  }

  function setTreatmentData(data) {
    state.treatmentData = data ? clone(data) : createEmptyTreatmentData();
    const tratamentoId = Number(state.treatmentData?.tratamento?.id || 0) || 0;
    if (tratamentoId) state.selectedTreatmentId = tratamentoId;
    return state.treatmentData;
  }

  function setActiveTab(tab) {
    const value = String(tab || "").trim();
    if (TABS.includes(value)) {
      state.activeTab = value;
    }
    return state.activeTab;
  }

  function setLoading(value) {
    state.loading = !!value;
    return state.loading;
  }

  function setError(message) {
    state.error = String(message || "").trim();
    return state.error;
  }

  function setNotice(message) {
    state.notice = String(message || "").trim();
    return state.notice;
  }

  function setSelectedIntervention(id) {
    state.selectedInterventionId = Number(id || 0) || 0;
    return state.selectedInterventionId;
  }

  function setSelectedParcel(id) {
    state.selectedParcelId = Number(id || 0) || 0;
    return state.selectedParcelId;
  }

  function applyTreatmentSnapshot(payload) {
    if (!payload || typeof payload !== "object") {
      setTreatmentData(createEmptyTreatmentData());
      return state.treatmentData;
    }
    setTreatmentData({
      tratamento: payload.tratamento || null,
      principal: payload.principal || createEmptyTreatmentData().principal,
      detalhes: payload.detalhes || createEmptyTreatmentData().detalhes,
      convenio: payload.convenio || createEmptyTreatmentData().convenio,
      ortodontia: payload.ortodontia || createEmptyTreatmentData().ortodontia,
      intervencoes: Array.isArray(payload.intervencoes) ? payload.intervencoes : [],
      parcelas: Array.isArray(payload.parcelas) ? payload.parcelas : [],
      comissoes: Array.isArray(payload.comissoes) ? payload.comissoes : [],
      status_lookup: Array.isArray(payload.status_lookup) ? payload.status_lookup : [],
    });
    return state.treatmentData;
  }

  function reset() {
    const fresh = createDefaultState();
    Object.keys(fresh).forEach((key) => {
      state[key] = fresh[key];
    });
    return state;
  }

  function snapshot() {
    return clone(state);
  }

  window.BranaOrcamentoStateV1 = Object.freeze({
    moduleName: MODULE_NAME,
    tabs: TABS.slice(),
    state,
    createEmptyTreatmentData,
    createDefaultState,
    setMounted,
    setPatient,
    setTreatments,
    setTreatmentData,
    applyTreatmentSnapshot,
    setActiveTab,
    setLoading,
    setError,
    setNotice,
    setSelectedIntervention,
    setSelectedParcel,
    reset,
    snapshot,
  });
})();
