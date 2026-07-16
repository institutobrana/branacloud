import { toNumber } from './cenarioAnualNormalizers.js';

function isEmptyValue(value) {
  return value === null || value === undefined || value === '';
}

function isNumericText(value) {
  return typeof value === 'string' && /^[-+]?\d+(?:[.,]\d+)?$/.test(value.trim());
}

function resolveNumber(value) {
  if (typeof value === 'number') return value;
  if (isNumericText(value)) return toNumber(value);
  return toNumber(value);
}

function readNumericValue(value) {
  if (isEmptyValue(value)) {
    return { status: 'empty', value: NaN };
  }
  if (typeof value === 'string' && !isNumericText(value)) {
    return { status: 'invalid', value: NaN };
  }

  const numeric = resolveNumber(value);
  if (!Number.isFinite(numeric)) {
    return { status: 'invalid', value: NaN };
  }
  return { status: 'valid', value: numeric };
}

function makeError(message, field, errors) {
  if (!errors[field]) {
    errors[field] = message;
  }
}

export function validateFixedSection(values) {
  const errors = {};
  const mesesRaw = values.meses_trabalhados;
  const diasMesRaw = values.dias_uteis_mes;
  const horasDiaRaw = values.horas_atendimento_dia;
  const meses = readNumericValue(mesesRaw);
  const diasMes = readNumericValue(diasMesRaw);
  const horasDia = readNumericValue(horasDiaRaw);

  if (meses.status !== 'valid' || meses.value <= 0) {
    errors.meses_trabalhados = 'Informe um valor maior que zero.';
  }
  if (diasMes.status !== 'valid' || diasMes.value <= 0) {
    errors.dias_uteis_mes = 'Informe um valor maior que zero.';
  }
  if (horasDia.status !== 'valid' || horasDia.value <= 0) {
    errors.horas_atendimento_dia = 'Informe um valor maior que zero.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function validateTurnosFlex(turnosFlex) {
  if (!turnosFlex || typeof turnosFlex !== 'object' || Array.isArray(turnosFlex)) {
    return false;
  }

  for (const key of ['1', '2', '3', '4', '5', '6']) {
    const row = turnosFlex[key];
    if (!row || typeof row !== 'object' || Array.isArray(row)) {
      return false;
    }

    if (!isFiniteNumber(row.manha) || !isFiniteNumber(row.tarde) || !isFiniteNumber(row.noite) || !isFiniteNumber(row.dias)) {
      return false;
    }
  }

  return true;
}

export function validateCenarioAnualPayload(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return { valid: false, errors: { payload: 'Payload inválido.' } };
  }

  const errors = {};
  const numericFields = [
    'meses_trabalhados',
    'dias_uteis_mes',
    'dias_uteis_ano',
    'horas_atendimento_dia',
    'num_consultorios',
    'num_consultorios_flex',
    'horas_ano',
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
  ];

  for (const field of numericFields) {
    if (!isFiniteNumber(payload[field])) {
      errors[field] = 'Valor numérico inválido.';
    }
  }

  if (typeof payload.modo_horas !== 'string' || !payload.modo_horas.trim()) {
    errors.modo_horas = 'Modo de horas inválido.';
  }

  if (!validateTurnosFlex(payload.turnos_flex)) {
    errors.turnos_flex = 'turnos_flex inválido.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateCenarioAnualState(values) {
  const errors = {};

  const mesesRaw = values?.meses_trabalhados;
  const diasMesRaw = values?.dias_uteis_mes;
  const horasDiaRaw = values?.horas_atendimento_dia;
  const gastosRaw = [
    ['gasto_anual_particular', values?.gasto_anual_particular],
    ['gasto_anual_empresa', values?.gasto_anual_empresa],
  ];
  const percentuaisRaw = [
    ['ir', values?.ir],
    ['cd', values?.cd],
    ['cartao', values?.cartao],
  ];
  const anoBaseRaw = values?.ano_base;

  const meses = resolveNumber(mesesRaw);
  const diasMes = resolveNumber(diasMesRaw);
  const horasDia = resolveNumber(horasDiaRaw);

  if (isEmptyValue(mesesRaw) || !Number.isFinite(meses) || meses <= 0) {
    errors.meses_trabalhados = 'Informe um valor maior que zero.';
  }
  if (isEmptyValue(diasMesRaw) || !Number.isFinite(diasMes) || diasMes <= 0) {
    errors.dias_uteis_mes = 'Informe um valor maior que zero.';
  }
  if (isEmptyValue(horasDiaRaw) || !Number.isFinite(horasDia) || horasDia <= 0) {
    errors.horas_atendimento_dia = 'Informe um valor maior que zero.';
  }

  for (const [field, raw] of gastosRaw) {
    if (isEmptyValue(raw)) {
      errors[field] = 'Informe um valor.';
      continue;
    }
    const numeric = readNumericValue(raw);
    if (numeric.status === 'empty') {
      errors[field] = 'Informe um valor.';
      continue;
    }
    if (numeric.status === 'invalid') {
      errors[field] = 'Valor numérico inválido.';
      continue;
    }
    if (numeric.value < 0) {
      errors[field] = 'Informe um valor igual ou maior que zero.';
    }
  }

  for (const [field, raw] of percentuaisRaw) {
    const numeric = readNumericValue(raw);
    if (numeric.status === 'empty') {
      errors[field] = 'Informe um percentual.';
      continue;
    }
    if (numeric.status === 'invalid') {
      errors[field] = 'Valor numérico inválido.';
      continue;
    }
    if (numeric.value < 0 || numeric.value > 100) {
      errors[field] = 'Informe um percentual entre 0 e 100.';
    }
  }

  if (!isEmptyValue(anoBaseRaw)) {
    const ano = readNumericValue(anoBaseRaw);
    if (ano.status !== 'valid' || !Number.isInteger(ano.value) || ano.value < 1900 || ano.value > 3000) {
      errors.ano_base = 'Informe um ano válido entre 1900 e 3000.';
    }
  }

  const turnosFlex = values?.turnos_flex;
  if (turnosFlex && typeof turnosFlex === 'object' && !Array.isArray(turnosFlex)) {
    for (const key of ['1', '2', '3', '4', '5', '6']) {
      const row = turnosFlex[key];
      if (!row || typeof row !== 'object' || Array.isArray(row)) {
        errors.turnos_flex = 'turnos_flex inválido.';
        break;
      }
      for (const field of ['manha', 'tarde', 'noite', 'dias']) {
        const numeric = readNumericValue(row[field]);
        if (numeric.status !== 'valid' || numeric.value < 0) {
          errors.turnos_flex = 'turnos_flex inválido.';
          break;
        }
      }
      if (errors.turnos_flex) break;
    }
  } else {
    errors.turnos_flex = 'turnos_flex inválido.';
  }

  const fixedFields = ['num_consultorios', 'num_consultorios_flex', 'horas_ano', 'custo_ano', 'cfph', 'cfpm', 'total_horas_fixo', 'total_minutos_fixo', 'total_turnos_fixo', 'total_horas_flex', 'total_minutos_flex', 'total_turnos_flex'];
  for (const field of fixedFields) {
    const raw = values?.[field];
    if (isEmptyValue(raw)) {
      continue;
    }
    const numeric = readNumericValue(raw);
    if (numeric.status === 'invalid') {
      errors[field] = 'Valor numérico inválido.';
    } else if (numeric.value < 0) {
      errors[field] = 'Informe um valor igual ou maior que zero.';
    }
  }

  const valid = Object.keys(errors).length === 0;
  const firstInvalidField = valid ? '' : Object.keys(errors)[0];
  return {
    valid,
    errors,
    firstInvalidField,
    message: valid ? '' : errors[firstInvalidField],
  };
}
