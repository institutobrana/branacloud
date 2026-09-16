import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const schedulerSource = fs.readFileSync(new URL('../src/features/agendaSemanal/components/AgendaScheduler.jsx', import.meta.url), 'utf8');

test('Agenda usa a quantidade de horários configurada para o modo ativo', () => {
  assert.match(schedulerSource, /mode === 'dia' \? selectedConfig\.dia_horarios : selectedConfig\.semana_horarios/);
  assert.match(schedulerSource, /visibleScheduleCount/);
  assert.match(schedulerSource, /agenda-visible-slot-height/);
});

test('Agenda oculta domingo somente na Semana', () => {
  assert.match(schedulerSource, /hiddenDays=\{mode === 'semana' \? WEEK_HIDDEN_DAYS : DAY_HIDDEN_DAYS\}/);
  assert.match(schedulerSource, /const WEEK_HIDDEN_DAYS = \[0\]/);
  assert.match(schedulerSource, /const DAY_HIDDEN_DAYS = \[\]/);
  assert.match(schedulerSource, /firstDay=\{1\}/);
});
