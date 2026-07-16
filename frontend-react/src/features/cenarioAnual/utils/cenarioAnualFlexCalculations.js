import { CENARIO_ANUAL_DAY_INDEXES } from '../constants/cenarioAnualDefaults.js';
import { toNumber } from './cenarioAnualNormalizers.js';

export function calculateFlexibleDayTotals(turnosFlex, diasKey) {
  const dia = String(diasKey);
  const row = turnosFlex?.[dia] || {};
  const totalDia = toNumber(row.manha) + toNumber(row.tarde) + toNumber(row.noite);
  const diasAno = toNumber(row.dias);

  return {
    total_dia: totalDia,
    horas_ano_dia: totalDia * diasAno,
  };
}

export function calculateFlexibleSummary(values) {
  const turnosFlex = values?.turnos_flex && typeof values.turnos_flex === 'object' ? values.turnos_flex : {};
  const consultorios = Math.max(1, Math.trunc(toNumber(values?.num_consultorios_flex) || 1));
  let totalHoras = 0;

  for (const index of CENARIO_ANUAL_DAY_INDEXES) {
    const { horas_ano_dia } = calculateFlexibleDayTotals(turnosFlex, index);
    totalHoras += horas_ano_dia;
  }

  totalHoras *= consultorios;

  return {
    total_horas_flex: totalHoras,
    total_minutos_flex: totalHoras * 60,
    total_turnos_flex: totalHoras / 4,
  };
}
