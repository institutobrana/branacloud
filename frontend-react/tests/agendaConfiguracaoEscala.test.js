import test from 'node:test';
import assert from 'node:assert/strict';

import {
  AGENDA_FONTE_DEFAULTS,
  AGENDA_APRESENTACAO_DEFAULTS,
  AGENDA_ESCALA_DEFAULTS,
  createAgendaConfiguracaoDraft,
} from '../src/features/agendaConfiguracao/agendaConfiguracaoState.js';
import {
  agendaHoraBlurValue,
  agendaHoraInputValue,
  isValidAgendaHoraInput,
  normalizeAgendaHoraInput,
} from '../src/features/agendaConfiguracao/utils/agendaHorarioUtils.js';

test('Escala nasce com defaults auditados e isolados em um draft novo', () => {
  const first = createAgendaConfiguracaoDraft();
  const second = createAgendaConfiguracaoDraft();

  assert.deepEqual(first, {
    manhaInicio: '07:00',
    manhaFim: '13:00',
    tardeInicio: '13:00',
    tardeFim: '20:00',
    duracao: 5,
    semanaHorarios: 12,
    diaHorarios: 12,
    corParticular: '#ffff00',
    corConvenio: '#0000ff',
    corCompromisso: '#00e5ef',
    apresentacaoFonte: {
      family: 'MS Sans Serif',
      bold: false,
      italic: false,
      size: 8,
      strike: false,
      underline: false,
      color: '#000000',
      script: 'Ocidental',
    },
    visualizacaoCampos: [
      'numeroPaciente',
      'nomePaciente',
      'fone1',
      'fone2',
      'sala',
    ],
  });
  assert.notStrictEqual(first, second);
  assert.deepEqual(
    AGENDA_ESCALA_DEFAULTS,
    {
      manhaInicio: '07:00',
      manhaFim: '13:00',
      tardeInicio: '13:00',
      tardeFim: '20:00',
      duracao: 5,
      semanaHorarios: 12,
      diaHorarios: 12,
    },
  );
  assert.deepEqual(AGENDA_APRESENTACAO_DEFAULTS, {
    corParticular: '#ffff00',
    corConvenio: '#0000ff',
    corCompromisso: '#00e5ef',
    apresentacaoFonte: AGENDA_FONTE_DEFAULTS,
  });
});

test('helper de hora reproduz o contrato legado de digitação e blur', () => {
  assert.equal(agendaHoraInputValue('7'), '7');
  assert.equal(agendaHoraInputValue('07'), '07:');
  assert.equal(agendaHoraInputValue('700'), '7:00');
  assert.equal(agendaHoraInputValue('0700'), '07:00');
  assert.equal(agendaHoraInputValue('7:3'), '07:03');
  assert.equal(agendaHoraInputValue('0730'), '07:30');
  assert.equal(agendaHoraInputValue('07:30'), '07:30');
  assert.equal(agendaHoraInputValue('7:'), '');
  assert.equal(agendaHoraBlurValue('7'), '07:00');
  assert.equal(agendaHoraBlurValue('07'), '07:00');
  assert.equal(agendaHoraBlurValue('700'), '07:00');
  assert.equal(agendaHoraBlurValue('0700'), '07:00');
  assert.equal(agendaHoraBlurValue('7:3'), '07:03');
  assert.equal(agendaHoraBlurValue('0730'), '07:30');
  assert.equal(agendaHoraBlurValue('07:30'), '07:30');
  assert.equal(agendaHoraBlurValue('25:00'), '');
  assert.equal(agendaHoraBlurValue('12:99'), '');
  assert.equal(agendaHoraBlurValue('abc'), '');
  assert.equal(normalizeAgendaHoraInput('07:00'), '07:00');
  assert.equal(normalizeAgendaHoraInput('24:00'), null);
  assert.equal(normalizeAgendaHoraInput('12:60'), null);
  assert.equal(isValidAgendaHoraInput('20:15'), true);
  assert.equal(isValidAgendaHoraInput('20:75'), false);
});
