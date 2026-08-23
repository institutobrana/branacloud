import test from 'node:test';
import assert from 'node:assert/strict';

import {
  AGENDA_BLOQUEIO_DIA_OPTIONS,
  agendaBloqueioDiaLabel,
  agendaBloqueioFormatDateForDisplay,
  agendaBloqueioFormatTimeForDisplay,
  buildAgendaBloqueioDraft,
  buildAgendaBloqueioPayload,
} from '../src/features/agendaConfiguracao/agendaConfiguracaoBloqueios.js';

test('formata apenas a apresentacao de datas e horarios operacionais', () => {
  assert.equal(agendaBloqueioFormatDateForDisplay('2026-08-22'), '22/08/2026');
  assert.equal(agendaBloqueioFormatDateForDisplay('2026-01-05'), '05/01/2026');
  assert.equal(agendaBloqueioFormatTimeForDisplay(800), '08:00');
  assert.equal(agendaBloqueioFormatTimeForDisplay(900), '09:00');
  assert.equal(agendaBloqueioFormatTimeForDisplay(930), '09:30');
  assert.equal(agendaBloqueioFormatTimeForDisplay(1330), '13:30');
  assert.equal(agendaBloqueioFormatTimeForDisplay(null), '');
});

test('contrato de Bloqueios expõe os 7 dias e o rascunho local compatível', () => {
  assert.deepEqual(
    AGENDA_BLOQUEIO_DIA_OPTIONS.map((item) => item.label),
    ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
  );

  const draft = buildAgendaBloqueioDraft({
    id: 11,
    unidade: 'Instituto Brana - Odontologia',
    unidade_row_id: 22,
    unidade_id: 33,
    dia_sem: 4,
    vigencia_inicio: '05/08/2026',
    vigencia_fim: '12/08/2026',
    hora_ini: '07:00',
    hora_fin: '10:30',
    msg_agenda: 'Reunião interna',
  });

  assert.equal(draft.id, 11);
  assert.equal(draft.unidade, 'Instituto Brana - Odontologia');
  assert.equal(draft.unidade_row_id, 22);
  assert.equal(draft.unidade_id, 33);
  assert.equal(draft.dia_sem, 4);
  assert.equal(draft.vigencia_inicio, '05/08/2026');
  assert.equal(draft.vigencia_fim, '12/08/2026');
  assert.equal(draft.hora_ini, '07:00');
  assert.equal(draft.hora_fin, '10:30');
  assert.equal(draft.msg_agenda, 'Reunião interna');
  assert.equal(agendaBloqueioDiaLabel(4), 'Quinta');

  const payload = buildAgendaBloqueioPayload(draft, {
    nome: 'Clínica Principal',
    source_id: 44,
    row_id: 55,
  });

  assert.equal(payload.unidade, 'Clínica Principal');
  assert.equal(payload.unidade_id, 44);
  assert.equal(payload.unidade_row_id, 55);
  assert.equal(payload.dia_sem, 4);
  assert.equal(payload.dia, 'Quinta');
  assert.equal(payload.vigencia_inicio, '05/08/2026');
  assert.equal(payload.vigencia_fim, '12/08/2026');
  assert.equal(payload.hora_ini, '07:00');
  assert.equal(payload.hora_fin, '10:30');
  assert.equal(payload.msg_agenda, 'Reunião interna');
});
