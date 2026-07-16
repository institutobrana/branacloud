export const CENARIO_ANUAL_DEFAULTS = {
  meses_trabalhados: 12,
  dias_uteis_mes: 22,
  dias_uteis_ano: 264,
  horas_atendimento_dia: 8,
  num_consultorios: 1,
  num_consultorios_flex: 1,
  horas_ano: 0,
  modo_horas: 'Perfil Fixo',
  gasto_anual_particular: 0,
  gasto_anual_empresa: 0,
  cartao: 0,
  ir: 0,
  cd: 0,
  custo_ano: 0,
  cfph: 0,
  cfpm: 0,
  total_horas_fixo: 0,
  total_minutos_fixo: 0,
  total_turnos_fixo: 0,
  total_horas_flex: 0,
  total_minutos_flex: 0,
  total_turnos_flex: 0,
  turnos_flex: {
    1: { manha: 0, tarde: 0, noite: 0, dias: 0 },
    2: { manha: 0, tarde: 0, noite: 0, dias: 0 },
    3: { manha: 0, tarde: 0, noite: 0, dias: 0 },
    4: { manha: 0, tarde: 0, noite: 0, dias: 0 },
    5: { manha: 0, tarde: 0, noite: 0, dias: 0 },
    6: { manha: 0, tarde: 0, noite: 0, dias: 0 },
  },
};

export const CENARIO_ANUAL_PROFILE_FIXED = 'Perfil Fixo';
export const CENARIO_ANUAL_PROFILE_FLEX = 'Perfil Flexível';
export const CENARIO_ANUAL_DAY_INDEXES = [1, 2, 3, 4, 5, 6];
