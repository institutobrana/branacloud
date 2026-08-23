import { AGENDA_FONTE_DEFAULTS, normalizeAgendaFonteValue } from './agendaConfiguracaoFonte.js';

export { AGENDA_FONTE_DEFAULTS } from './agendaConfiguracaoFonte.js';

export const AGENDA_VISUALIZACAO_FIELDS = [
  { key: 'numeroPaciente', label: 'Número do paciente' },
  { key: 'numeroProntuario', label: 'Número do prontuário' },
  { key: 'nomePaciente', label: 'Nome do paciente' },
  { key: 'matricula', label: 'Matrícula' },
  { key: 'convenio', label: 'Convênio' },
  { key: 'tabela', label: 'Tabela' },
  { key: 'fone1', label: 'Fone 1' },
  { key: 'fone2', label: 'Fone 2' },
  { key: 'fone3', label: 'Fone 3' },
  { key: 'sala', label: 'Sala' },
];

export const AGENDA_VISUALIZACAO_DEFAULTS = [
  'numeroPaciente',
  'nomePaciente',
  'fone1',
  'fone2',
  'sala',
];

export const AGENDA_ESCALA_DEFAULTS = {
  manhaInicio: '07:00',
  manhaFim: '13:00',
  tardeInicio: '13:00',
  tardeFim: '20:00',
  duracao: 5,
  semanaHorarios: 12,
  diaHorarios: 12,
};

export const AGENDA_APRESENTACAO_DEFAULTS = {
  corParticular: '#ffff00',
  corConvenio: '#0000ff',
  corCompromisso: '#00e5ef',
  apresentacaoFonte: { ...AGENDA_FONTE_DEFAULTS },
};

export function createAgendaConfiguracaoDraft() {
  return {
    ...AGENDA_ESCALA_DEFAULTS,
    ...AGENDA_APRESENTACAO_DEFAULTS,
    visualizacaoCampos: [...AGENDA_VISUALIZACAO_DEFAULTS],
    apresentacaoFonte: normalizeAgendaFonteValue(AGENDA_FONTE_DEFAULTS),
  };
}
