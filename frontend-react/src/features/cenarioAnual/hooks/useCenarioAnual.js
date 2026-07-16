import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { carregarCenarioAnual, salvarCenarioAnual } from '../cenarioAnualApi.js';
import { CENARIO_ANUAL_DEFAULTS, CENARIO_ANUAL_PROFILE_FIXED } from '../constants/cenarioAnualDefaults.js';
import { calculateFixedSummary } from '../utils/cenarioAnualCalculations.js';
import { calculateFlexibleSummary } from '../utils/cenarioAnualFlexCalculations.js';
import { normalizeCenarioAnualResponse } from '../utils/cenarioAnualNormalizers.js';
import { validateCenarioAnualPayload, validateCenarioAnualState } from '../utils/cenarioAnualValidation.js';
import { buildCenarioAnualPayload } from '../utils/cenarioAnualPayload.js';

const SCENARIO_RESPONSE_FIELDS = new Set([
  'meses_trabalhados',
  'dias_uteis_mes',
  'dias_uteis_ano',
  'horas_atendimento_dia',
  'num_consultorios',
  'num_consultorios_flex',
  'horas_ano',
  'modo_horas',
  'gasto_anual_particular',
  'gasto_anual_empresa',
  'cartao',
  'ir',
  'cd',
  'custo_ano',
  'cfph',
  'cfpm',
  'total_horas_fixo',
  'total_minutos_fixo',
  'total_turnos_fixo',
  'total_horas_flex',
  'total_minutos_flex',
  'total_turnos_flex',
  'turnos_flex',
]);

export function hasScenarioFields(response) {
  if (!response || typeof response !== 'object' || Array.isArray(response)) {
    return false;
  }

  return Object.keys(response).some((key) => SCENARIO_RESPONSE_FIELDS.has(key));
}

export function applyScenarioSaveResponse(current, response) {
  if (!hasScenarioFields(response)) {
    return current;
  }

  const normalized = normalizeCenarioAnualResponse(response);
  const merged = { ...current, ...normalized };
  const derived = calculateFixedSummary(merged);
  return { ...merged, ...derived };
}

function buildState(data) {
  const normalized = normalizeCenarioAnualResponse(data);
  const summary = calculateFixedSummary(normalized);
  return {
    ...normalized,
    ...summary,
    modo_horas: normalized.modo_horas || CENARIO_ANUAL_PROFILE_FIXED,
  };
}

function buildPayloadSignature(payload) {
  try {
    return JSON.stringify(payload);
  } catch {
    return '';
  }
}

export async function reloadCenarioAnualState({
  load = carregarCenarioAnual,
  build = buildState,
  setState = () => {},
  setLoaded = () => {},
  setError = () => {},
  setLoading = () => {},
} = {}) {
  setLoading(true);
  setError('');

  try {
    const data = await load();
    const next = build(data);
    setState(next);
    setLoaded(true);
    return { ok: true, state: next };
  } catch (err) {
    setError(err?.status === 403 ? 'Sem permissão para acessar o cenário anual.' : err?.message || 'Falha ao carregar cenário anual.');
    setLoaded(true);
    return { ok: false, error: err };
  } finally {
    setLoading(false);
  }
}

export async function saveCenarioAnualState({
  state,
  validation,
  validatePayload = validateCenarioAnualPayload,
  buildPayload = buildCenarioAnualPayload,
  save = salvarCenarioAnual,
  submitLock = { current: false },
  activeSubmissionSignature = { current: '' },
  lastSuccessfulSignature = { current: '' },
  setState = () => {},
  setSaving = () => {},
  setSaveError = () => {},
  setSaveSuccess = () => {},
} = {}) {
  if (!validation?.valid) {
    const message = validation?.message || 'Corrija os campos destacados antes de salvar.';
    setSaveError(message);
    return { ok: false, reason: 'invalid_form', message, errors: validation?.errors || {} };
  }

  if (submitLock.current) {
    return { ok: false, reason: 'already_saving' };
  }

  const payload = buildPayload(state);
  const payloadSignature = buildPayloadSignature(payload);
  if (activeSubmissionSignature.current === payloadSignature || lastSuccessfulSignature.current === payloadSignature) {
    return { ok: false, reason: 'duplicate_payload' };
  }

  const payloadValidation = validatePayload(payload);
  if (!payloadValidation.valid) {
    const message = 'O cenário anual contém valores inválidos e não pode ser salvo.';
    setSaveError(message);
    return { ok: false, reason: 'invalid_payload', message, errors: payloadValidation.errors };
  }

  submitLock.current = true;
  activeSubmissionSignature.current = payloadSignature;
  lastSuccessfulSignature.current = payloadSignature;
  setSaving(true);
  setSaveError('');
  setSaveSuccess('');

  let succeeded = false;
  try {
    const response = await save(payload);
    setState((current) => applyScenarioSaveResponse(current, response));
    succeeded = true;
    setSaveSuccess('Cenário anual salvo com sucesso.');
    return { ok: true, payload, response };
  } catch (err) {
    lastSuccessfulSignature.current = '';
    setSaveError(err?.message || 'Falha ao salvar cenário anual.');
    return { ok: false, error: err, payload };
  } finally {
    activeSubmissionSignature.current = '';
    if (!succeeded) {
      lastSuccessfulSignature.current = '';
    }
    setTimeout(() => {
      submitLock.current = false;
    }, 0);
    setSaving(false);
  }
}

export function useCenarioAnual() {
  const [state, setState] = useState(() => buildState(CENARIO_ANUAL_DEFAULTS));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');
  const [loaded, setLoaded] = useState(false);
  const saveLockRef = useRef(false);
  const activeSubmissionSignatureRef = useRef('');
  const lastSuccessfulSignatureRef = useRef('');
  const didLoadRef = useRef(false);

  const reload = useCallback(async () => {
    setSaveError('');
    setSaveSuccess('');
    const result = await reloadCenarioAnualState({
      load: carregarCenarioAnual,
      build: buildState,
      setState,
      setLoaded,
      setError,
      setLoading,
    });
    return result.state;
  }, [setError, setLoaded, setLoading, setSaveError, setSaveSuccess, setState]);

  useEffect(() => {
    if (didLoadRef.current) return;
    didLoadRef.current = true;
    void reload();
  }, []);

  const summary = useMemo(() => ({
    dias_uteis_ano: state.dias_uteis_ano,
    total_horas_fixo: state.total_horas_fixo,
    total_minutos_fixo: state.total_minutos_fixo,
    total_turnos_fixo: state.total_turnos_fixo,
  }), [state]);

  const flexSummary = useMemo(() => calculateFlexibleSummary(state), [state]);
  const validation = useMemo(() => validateCenarioAnualState(state), [state]);

  const updateField = (field, value) => {
    setSaveError('');
    setSaveSuccess('');
    setState((current) => {
      const next = { ...current, [field]: value };
      const derived = calculateFixedSummary(next);
      return { ...next, ...derived };
    });
  };

  const updateFields = (values) => {
    setSaveError('');
    setSaveSuccess('');
    setState((current) => {
      const next = { ...current, ...(values || {}) };
      const derived = calculateFixedSummary(next);
      return { ...next, ...derived };
    });
  };

  const save = async () => {
    if (!loaded || loading || saving) {
      return { ok: false, reason: 'not_ready' };
    }

    return saveCenarioAnualState({
      state,
      validation,
      validatePayload: validateCenarioAnualPayload,
      buildPayload: buildCenarioAnualPayload,
      save: salvarCenarioAnual,
      submitLock: saveLockRef,
      activeSubmissionSignature: activeSubmissionSignatureRef,
      lastSuccessfulSignature: lastSuccessfulSignatureRef,
      setState,
      setSaving,
      setSaveError,
      setSaveSuccess,
    });
  };

  return {
    state,
    setState: updateFields,
    updateField,
    summary,
    flexSummary,
    loading,
    saving,
    error,
    saveError,
    saveSuccess,
    loaded,
    reload,
    validationErrors: validation.errors,
    validationValid: validation.valid,
    validationMessage: validation.message,
    canSave: loaded && !loading && !saving,
    canCalculate: false,
    buildPayload: () => buildCenarioAnualPayload(state),
    save,
  };
}
