import test from 'node:test';
import assert from 'node:assert/strict';

import { buildCenarioAnualPayload, calculateFixedSummary, calculateFinancialSummary } from '../src/features/cenarioAnual/utils/cenarioAnualCalculations.js';
import { calculateFlexibleSummary } from '../src/features/cenarioAnual/utils/cenarioAnualFlexCalculations.js';
import { normalizeCenarioAnualResponse, parseBrazilianNumber } from '../src/features/cenarioAnual/utils/cenarioAnualNormalizers.js';
import { validateCenarioAnualPayload, validateCenarioAnualState } from '../src/features/cenarioAnual/utils/cenarioAnualValidation.js';
import { salvarCenarioAnual } from '../src/features/cenarioAnual/cenarioAnualApi.js';
import {
  applyScenarioSaveResponse,
  hasScenarioFields,
  reloadCenarioAnualState,
  saveCenarioAnualState,
} from '../src/features/cenarioAnual/hooks/useCenarioAnual.js';

const referenceState = {
  meses_trabalhados: 10.5,
  dias_uteis_mes: 20,
  horas_atendimento_dia: 8,
  num_consultorios: 1,
  num_consultorios_flex: 1,
  modo_horas: 'Perfil Flexível',
  horas_ano: 1449,
  gasto_anual_particular: 71250,
  gasto_anual_empresa: 130000,
  cartao: 4,
  ir: 10,
  cd: 20,
  turnos_flex: {
    1: { manha: 4, tarde: 5, noite: 0, dias: 30 },
    2: { manha: 4, tarde: 5, noite: 0, dias: 36 },
    3: { manha: 4, tarde: 5, noite: 0, dias: 35 },
    4: { manha: 4, tarde: 5, noite: 0, dias: 30 },
    5: { manha: 4, tarde: 5, noite: 0, dias: 30 },
    6: { manha: 4, tarde: 0, noite: 0, dias: 0 },
  },
};

const baselineScenario = structuredClone(referenceState);

test('parseBrazilianNumber preserva decimal, milhar e zero', () => {
  assert.equal(parseBrazilianNumber('10,5'), 10.5);
  assert.equal(parseBrazilianNumber('1.234,5'), 1234.5);
  assert.equal(parseBrazilianNumber(0), 0);
});

test('calculateFixedSummary aplica a regra do consultorio minimo efetivo', () => {
  const summary = calculateFixedSummary({
    meses_trabalhados: 10.5,
    dias_uteis_mes: 20,
    horas_atendimento_dia: 8,
    num_consultorios: 1,
  });
  assert.deepEqual(summary, {
    dias_uteis_ano: 210,
    total_horas_fixo: 1680,
    total_minutos_fixo: 100800,
    total_turnos_fixo: 420,
  });
});

test('calculateFlexibleSummary fecha o print de referencia', () => {
  const summary = calculateFlexibleSummary(referenceState);
  assert.equal(summary.total_horas_flex, 1449);
  assert.equal(summary.total_minutos_flex, 86940);
  assert.equal(summary.total_turnos_flex, 362.25);
});

test('calculateFinancialSummary preserva precision interna', () => {
  const summary = calculateFinancialSummary(referenceState);
  assert.equal(summary.custo_ano, 201250);
  assert.equal(summary.cfph, 138.88888888888889);
  assert.equal(summary.cfpm, 2.314814814814815);
});

test('buildCenarioAnualPayload devolve numeros puros e preserva o estado', () => {
  const source = structuredClone(referenceState);
  const payload = buildCenarioAnualPayload(source);

  assert.equal(payload.meses_trabalhados, 10.5);
  assert.equal(payload.dias_uteis_mes, 20);
  assert.equal(payload.dias_uteis_ano, 210);
  assert.equal(payload.horas_atendimento_dia, 8);
  assert.equal(payload.num_consultorios, 1);
  assert.equal(payload.num_consultorios_flex, 1);
  assert.equal(payload.horas_ano, 1449);
  assert.equal(payload.modo_horas, 'Perfil Flexível');
  assert.equal(payload.gasto_anual_particular, 71250);
  assert.equal(payload.gasto_anual_empresa, 130000);
  assert.equal(payload.cartao, 4);
  assert.equal(payload.ir, 10);
  assert.equal(payload.cd, 20);
  assert.equal(payload.custo_ano, 201250);
  assert.equal(payload.cfph, 138.88888888888889);
  assert.equal(payload.cfpm, 2.314814814814815);
  assert.equal(payload.total_horas_fixo, 1680);
  assert.equal(payload.total_minutos_fixo, 100800);
  assert.equal(payload.total_turnos_fixo, 420);
  assert.equal(payload.total_horas_flex, 1449);
  assert.equal(payload.total_minutos_flex, 86940);
  assert.equal(payload.total_turnos_flex, 362.25);
  assert.deepEqual(payload.turnos_flex, {
    1: { manha: 4, tarde: 5, noite: 0, dias: 30 },
    2: { manha: 4, tarde: 5, noite: 0, dias: 36 },
    3: { manha: 4, tarde: 5, noite: 0, dias: 35 },
    4: { manha: 4, tarde: 5, noite: 0, dias: 30 },
    5: { manha: 4, tarde: 5, noite: 0, dias: 30 },
    6: { manha: 4, tarde: 0, noite: 0, dias: 0 },
  });
  assert.deepEqual(source, referenceState);
});

test('normalizeCenarioAnualResponse completa campos ausentes e trata strings', () => {
  const normalized = normalizeCenarioAnualResponse({
    meses_trabalhados: '10,5',
    dias_uteis_mes: '20',
    horas_atendimento_dia: '8,5',
    num_consultorios: 0,
    num_consultorios_flex: '2',
    turnos_flex: {
      1: { manha: '4', tarde: '5', noite: '0', dias: '30' },
    },
  });

  assert.equal(normalized.meses_trabalhados, 10.5);
  assert.equal(normalized.dias_uteis_mes, 20);
  assert.equal(normalized.horas_atendimento_dia, 8.5);
  assert.equal(normalized.num_consultorios, 0);
  assert.equal(normalized.num_consultorios_flex, 2);
  assert.deepEqual(normalized.turnos_flex[1], { manha: 4, tarde: 5, noite: 0, dias: 30 });
  assert.deepEqual(normalized.turnos_flex[2], { manha: 0, tarde: 0, noite: 0, dias: 0 });
});

test('validateCenarioAnualPayload aceita numeros puros e turnos completos', () => {
  const payload = buildCenarioAnualPayload(structuredClone(referenceState));
  const result = validateCenarioAnualPayload(payload);
  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, {});
});

test('validateCenarioAnualState bloqueia vazio, zero proibido, negativo e percentual fora da faixa', () => {
  const emptyField = validateCenarioAnualState({ ...structuredClone(referenceState), horas_atendimento_dia: '' });
  assert.equal(emptyField.valid, false);
  assert.equal(emptyField.errors.horas_atendimento_dia, 'Informe um valor maior que zero.');

  const zeroField = validateCenarioAnualState({ ...structuredClone(referenceState), horas_atendimento_dia: 0 });
  assert.equal(zeroField.valid, false);
  assert.equal(zeroField.errors.horas_atendimento_dia, 'Informe um valor maior que zero.');

  const negativeField = validateCenarioAnualState({ ...structuredClone(referenceState), horas_atendimento_dia: -1 });
  assert.equal(negativeField.valid, false);
  assert.equal(negativeField.errors.horas_atendimento_dia, 'Informe um valor maior que zero.');

  const invalidPercent = validateCenarioAnualState({ ...structuredClone(referenceState), ir: 101 });
  assert.equal(invalidPercent.valid, false);
  assert.equal(invalidPercent.errors.ir, 'Informe um percentual entre 0 e 100.');

  const validDecimal = validateCenarioAnualState({ ...structuredClone(referenceState), meses_trabalhados: 10.5 });
  assert.equal(validDecimal.valid, true);
});

test('salvarCenarioAnual envia POST completo e preserva o payload', async () => {
  const originalFetch = global.fetch;
  let called = 0;
  let observed = null;

  global.fetch = async (url, options) => {
    called += 1;
    observed = { url, options };
    return new Response(JSON.stringify({ detail: 'ok' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  };

  try {
    const payload = buildCenarioAnualPayload(structuredClone(referenceState));
    const result = await salvarCenarioAnual(payload);
    assert.equal(called, 1);
    assert.match(String(observed.url), /\/cenario$/);
    assert.equal(observed.options.method, 'POST');
    assert.equal(observed.options.headers.get('Content-Type'), 'application/json');
    assert.deepEqual(JSON.parse(observed.options.body), payload);
    assert.deepEqual(result, { detail: 'ok' });
  } finally {
    global.fetch = originalFetch;
  }
});

test('carregarCenarioAnual classifica falha controlada de rede e de HTTP', async () => {
  const originalFetch = global.fetch;

  global.fetch = async () => {
    throw new Error('Falha controlada ao carregar cenário');
  };

  try {
    await assert.rejects(
      () => import('../src/features/cenarioAnual/cenarioAnualApi.js').then(({ carregarCenarioAnual }) => carregarCenarioAnual()),
      (error) => /conexão/i.test(error.message),
    );
  } finally {
    global.fetch = originalFetch;
  }

  global.fetch = async () => ({
    ok: false,
    status: 500,
    json: async () => ({ detail: 'Falha controlada no GET' }),
  });

  try {
    await assert.rejects(
      () => import('../src/features/cenarioAnual/cenarioAnualApi.js').then(({ carregarCenarioAnual }) => carregarCenarioAnual()),
      (error) => error.status === 500 && /Falha controlada no GET/.test(error.message),
    );
  } finally {
    global.fetch = originalFetch;
  }
});

test('reloadCenarioAnualState preserva o estado atual quando o GET falha e permite nova tentativa', async () => {
  const events = [];
  const current = structuredClone(baselineScenario);
  const setState = (value) => {
    events.push(['setState', value]);
  };
  const setLoaded = (value) => {
    events.push(['setLoaded', value]);
  };
  const setError = (value) => {
    events.push(['setError', value]);
  };
  const setLoading = (value) => {
    events.push(['setLoading', value]);
  };

  let attempts = 0;
  const firstResult = await reloadCenarioAnualState({
    load: async () => {
      attempts += 1;
      throw new Error('Falha controlada ao carregar cenário');
    },
    build: (data) => ({ ...data, built: true }),
    setState,
    setLoaded,
    setError,
    setLoading,
  });

  assert.equal(attempts, 1);
  assert.equal(firstResult.ok, false);
  assert.equal(events.some(([kind]) => kind === 'setState'), false);
  assert.deepEqual(events[0], ['setLoading', true]);
  assert.deepEqual(events[1], ['setError', '']);
  assert.deepEqual(events.at(-2), ['setLoaded', true]);
  assert.deepEqual(events.at(-1), ['setLoading', false]);
  assert.deepEqual(current, baselineScenario);

  events.length = 0;
  const secondResult = await reloadCenarioAnualState({
    load: async () => {
      attempts += 1;
      return baselineScenario;
    },
    build: (data) => ({ ...data, built: true }),
    setState,
    setLoaded,
    setError,
    setLoading,
  });

  assert.equal(attempts, 2);
  assert.equal(secondResult.ok, true);
  assert.equal(events.some(([kind]) => kind === 'setState'), true);
  assert.deepEqual(events.at(-2), ['setLoaded', true]);
  assert.deepEqual(events.at(-1), ['setLoading', false]);
});

test('saveCenarioAnualState captura falha de POST, preserva o estado e permite nova tentativa', async () => {
  const state = { ...structuredClone(baselineScenario), ir: 11 };
  const events = [];
  const setState = (value) => {
    events.push(['setState', value]);
  };
  const setSaving = (value) => {
    events.push(['setSaving', value]);
  };
  const setSaveError = (value) => {
    events.push(['setSaveError', value]);
  };
  const setSaveSuccess = (value) => {
    events.push(['setSaveSuccess', value]);
  };

  let attempts = 0;
  const failingSave = async () => {
    attempts += 1;
    throw new Error('Falha controlada ao salvar cenário');
  };

  const failure = await saveCenarioAnualState({
    state,
    validation: { valid: true, errors: {} },
    save: failingSave,
    setState,
    setSaving,
    setSaveError,
    setSaveSuccess,
  });

  assert.equal(attempts, 1);
  assert.equal(failure.ok, false);
  assert.equal(events.filter(([kind]) => kind === 'setState').length, 0);
  assert.deepEqual(events[0], ['setSaving', true]);
  assert.deepEqual(events[1], ['setSaveError', '']);
  assert.deepEqual(events[2], ['setSaveSuccess', '']);
  assert.deepEqual(events.at(-2), ['setSaveError', 'Falha controlada ao salvar cenário']);
  assert.deepEqual(events.at(-1), ['setSaving', false]);

  events.length = 0;
  let observedPayload = null;
  const success = await saveCenarioAnualState({
    state,
    validation: { valid: true, errors: {} },
    save: async (payload) => {
      attempts += 1;
      observedPayload = payload;
      return { detail: 'Cenario salvo com sucesso.' };
    },
    setState,
    setSaving,
    setSaveError,
    setSaveSuccess,
  });

  assert.equal(attempts, 2);
  assert.equal(success.ok, true);
  assert.equal(observedPayload.ir, 11);
  assert.equal(events.filter(([kind]) => kind === 'setState').length, 1);
  assert.equal(events.some(([kind]) => kind === 'setSaveSuccess'), true);

  const updater = events.find(([kind]) => kind === 'setState')[1];
  const preserved = updater(structuredClone(state));
  assert.deepEqual(preserved, state);

  events.length = 0;
  const restored = await saveCenarioAnualState({
    state: { ...structuredClone(baselineScenario), ir: 10 },
    validation: { valid: true, errors: {} },
    save: async (payload) => {
      attempts += 1;
      observedPayload = payload;
      return { detail: 'Cenario salvo com sucesso.' };
    },
    setState,
    setSaving,
    setSaveError,
    setSaveSuccess,
  });

  assert.equal(restored.ok, true);
  assert.equal(observedPayload.ir, 10);
  assert.equal(attempts, 3);
});

test('saveCenarioAnualState bloqueia submissao concorrente enquanto o POST esta pendente', async () => {
  const events = [];
  const state = { ...structuredClone(baselineScenario), ir: 11 };
  const submitLock = { current: false };
  let resolveSave;
  let firstSaveCalls = 0;
  let retryCalls = 0;
  const pendingSave = new Promise((resolve) => {
    resolveSave = resolve;
  });

  const first = saveCenarioAnualState({
    state,
    validation: { valid: true, errors: {} },
    save: async (payload) => {
      firstSaveCalls += 1;
      events.push(['save', payload.ir]);
      return pendingSave;
    },
    submitLock,
    setState: (value) => events.push(['setState', typeof value]),
    setSaving: (value) => events.push(['setSaving', value]),
    setSaveError: (value) => events.push(['setSaveError', value]),
    setSaveSuccess: (value) => events.push(['setSaveSuccess', value]),
  });

  const second = await saveCenarioAnualState({
    state,
    validation: { valid: true, errors: {} },
    save: async () => {
      firstSaveCalls += 1;
      return { detail: 'unexpected' };
    },
    submitLock,
    setState: () => events.push(['setState', 'blocked']),
    setSaving: (value) => events.push(['setSaving-blocked', value]),
    setSaveError: (value) => events.push(['setSaveError-blocked', value]),
    setSaveSuccess: (value) => events.push(['setSaveSuccess-blocked', value]),
  });

  assert.equal(firstSaveCalls, 1);
  assert.equal(second.ok, false);
  assert.equal(second.reason, 'already_saving');
  assert.equal(events.some(([kind]) => kind === 'save'), true);
  assert.equal(events.some(([kind]) => kind === 'setSaveSuccess-blocked'), false);

  resolveSave({ detail: 'Cenario salvo com sucesso.' });
  const result = await first;
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(result.ok, true);
  assert.equal(firstSaveCalls, 1);
  assert.equal(submitLock.current, false);

  const retry = await saveCenarioAnualState({
    state: { ...state, ir: 12 },
    validation: { valid: true, errors: {} },
    save: async (payload) => {
      retryCalls += 1;
      events.push(['save-retry', payload.ir]);
      return { detail: 'Cenario salvo com sucesso.' };
    },
    submitLock,
    lastSuccessfulSignature: { current: '' },
    setState: () => events.push(['setState-retry', true]),
    setSaving: (value) => events.push(['setSaving-retry', value]),
    setSaveError: (value) => events.push(['setSaveError-retry', value]),
    setSaveSuccess: (value) => events.push(['setSaveSuccess-retry', value]),
  });

  assert.equal(retry.ok, true);
  assert.equal(firstSaveCalls, 1);
  assert.equal(retryCalls, 1);
});

test('saveCenarioAnualState bloqueia formulario invalido antes do POST', async () => {
  let saveCalls = 0;
  const result = await saveCenarioAnualState({
    state: { ...structuredClone(referenceState), horas_atendimento_dia: 0 },
    validation: validateCenarioAnualState({ ...structuredClone(referenceState), horas_atendimento_dia: 0 }),
    save: async () => {
      saveCalls += 1;
      return { detail: 'unexpected' };
    },
    setSaveError: () => {},
    setSaveSuccess: () => {},
    setSaving: () => {},
  });

  assert.equal(result.ok, false);
  assert.equal(result.reason, 'invalid_form');
  assert.equal(saveCalls, 0);
  assert.equal(result.errors.horas_atendimento_dia, 'Informe um valor maior que zero.');
});

test('carregarCenarioAnual e salvarCenarioAnual extraem erro HTTP estruturado com detail', async () => {
  const originalFetch = global.fetch;
  global.fetch = async () => ({
    ok: false,
    status: 500,
    json: async () => ({ detail: 'Falha controlada no cenÃ¡rio' }),
  });

  try {
    await assert.rejects(
      () => import('../src/features/cenarioAnual/cenarioAnualApi.js').then(({ carregarCenarioAnual }) => carregarCenarioAnual()),
      (error) => error.status === 500 && /Falha controlada no cenÃ¡rio/.test(error.message),
    );

    await assert.rejects(
      () => import('../src/features/cenarioAnual/cenarioAnualApi.js').then(({ salvarCenarioAnual }) => salvarCenarioAnual(buildCenarioAnualPayload(structuredClone(baselineScenario)))),
      (error) => error.status === 500 && /Falha controlada no cenÃ¡rio/.test(error.message),
    );
  } finally {
    global.fetch = originalFetch;
  }
});

test('applyScenarioSaveResponse preserva o estado quando o POST retorna apenas detail', () => {
  const current = {
    meses_trabalhados: 10.5,
    dias_uteis_mes: 20,
    dias_uteis_ano: 210,
    horas_atendimento_dia: 8,
    num_consultorios: 1,
    horas_ano: 1680,
    total_horas_fixo: 1680,
    total_minutos_fixo: 100800,
    total_turnos_fixo: 420,
  };

  const next = applyScenarioSaveResponse(current, { detail: 'Cenario salvo com sucesso.' });
  assert.deepEqual(next, current);
});

test('hasScenarioFields ignora respostas sem campos do cenário', () => {
  assert.equal(hasScenarioFields({ detail: 'ok' }), false);
  assert.equal(hasScenarioFields({ meses_trabalhados: 10.5 }), true);
});
