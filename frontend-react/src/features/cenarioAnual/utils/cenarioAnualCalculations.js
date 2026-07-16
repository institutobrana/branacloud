import { CENARIO_ANUAL_DAY_INDEXES, CENARIO_ANUAL_PROFILE_FLEX, CENARIO_ANUAL_PROFILE_FIXED } from '../constants/cenarioAnualDefaults.js';
import { formatBrazilianNumber, toNumber } from './cenarioAnualNormalizers.js';
import { calculateFlexibleSummary as calculateFlexibleSummaryFromRows } from './cenarioAnualFlexCalculations.js';

export function calculateFixedSummary(values) {
  const meses = toNumber(values.meses_trabalhados);
  const diasMes = toNumber(values.dias_uteis_mes);
  const diasAno = meses * diasMes;
  const horasDia = toNumber(values.horas_atendimento_dia);
  const consultorios = Math.max(1, Math.trunc(toNumber(values.num_consultorios) || 1));
  const totalHoras = horasDia * diasAno * consultorios;

  return {
    dias_uteis_ano: diasAno,
    total_horas_fixo: totalHoras,
    total_minutos_fixo: totalHoras * 60,
    total_turnos_fixo: totalHoras / 4,
  };
}

export function formatFixedSummaryValue(field, value) {
  if (field === 'dias_uteis_ano') {
    return formatBrazilianNumber(value, { maximumFractionDigits: 20 });
  }
  if (field === 'total_turnos_fixo') {
    return formatBrazilianNumber(value, { maximumFractionDigits: 20 });
  }
  return formatBrazilianNumber(value, { minimumFractionDigits: 0, maximumFractionDigits: 20 });
}

export function calculateFlexibleSummary(values) {
  const consultorios = Math.max(1, Math.trunc(toNumber(values.num_consultorios_flex) || 1));
  let totalHorasFlex = 0;

  for (const index of CENARIO_ANUAL_DAY_INDEXES) {
    const turno = toNumber(values[`manha_${index}`]) + toNumber(values[`tarde_${index}`]) + toNumber(values[`noite_${index}`]);
    totalHorasFlex += turno * toNumber(values[`dias_${index}`]);
  }

  totalHorasFlex *= consultorios;

  return {
    total_horas_flex: totalHorasFlex,
    total_minutos_flex: totalHorasFlex * 60,
    total_turnos_flex: totalHorasFlex / 4,
  };
}

export function calculateFinancialSummary(values) {
  const gasto = toNumber(values.gasto_anual_particular) + toNumber(values.gasto_anual_empresa);
  const horasAno = toNumber(values.horas_ano);
  const cfph = horasAno ? gasto / horasAno : 0;
  const cfpm = cfph ? cfph / 60 : 0;

  return {
    custo_ano: gasto,
    cfph,
    cfpm,
  };
}

export function buildCenarioAnualPayload(values) {
  const fixed = calculateFixedSummary(values);
  const flexible = calculateFlexibleSummaryFromRows(values);
  const financial = calculateFinancialSummary(values);
  const turnosFlexState = values?.turnos_flex && typeof values.turnos_flex === 'object' ? values.turnos_flex : {};
  const turnos_flex = {};

  for (const index of CENARIO_ANUAL_DAY_INDEXES) {
    const row = turnosFlexState[String(index)] || {};
    turnos_flex[String(index)] = {
      manha: toNumber(row.manha),
      tarde: toNumber(row.tarde),
      noite: toNumber(row.noite),
      dias: toNumber(row.dias),
    };
  }

  return {
    meses_trabalhados: toNumber(values.meses_trabalhados),
    dias_uteis_mes: toNumber(values.dias_uteis_mes),
    dias_uteis_ano: fixed.dias_uteis_ano,
    horas_atendimento_dia: toNumber(values.horas_atendimento_dia),
    num_consultorios: toNumber(values.num_consultorios),
    num_consultorios_flex: toNumber(values.num_consultorios_flex),
    horas_ano: toNumber(values.horas_ano),
    modo_horas: String(values.modo_horas || CENARIO_ANUAL_PROFILE_FIXED),
    gasto_anual_particular: toNumber(values.gasto_anual_particular),
    gasto_anual_empresa: toNumber(values.gasto_anual_empresa),
    cartao: toNumber(values.cartao),
    ir: toNumber(values.ir),
    cd: toNumber(values.cd),
    custo_ano: financial.custo_ano,
    cfph: financial.cfph,
    cfpm: financial.cfpm,
    total_horas_fixo: fixed.total_horas_fixo,
    total_minutos_fixo: fixed.total_minutos_fixo,
    total_turnos_fixo: fixed.total_turnos_fixo,
    total_horas_flex: flexible.total_horas_flex,
    total_minutos_flex: flexible.total_minutos_flex,
    total_turnos_flex: flexible.total_turnos_flex,
    turnos_flex,
  };
}
