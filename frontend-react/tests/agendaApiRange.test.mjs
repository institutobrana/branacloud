import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveAgendaApiRange } from '../src/features/agendaSemanal/utils/agendaApiRange.js';

test('Agenda Diária converte o fim exclusivo do calendário em fim inclusivo da API', () => {
  assert.deepEqual(resolveAgendaApiRange({
    startStr: '2026-08-28T00:00:00-03:00',
    endStr: '2026-08-29T00:00:00-03:00',
  }), { start: '2026-08-28', end: '2026-08-28' });
});

test('Agenda Semanal preserva os seis dias exibidos no intervalo inclusivo da API', () => {
  assert.deepEqual(resolveAgendaApiRange({
    startStr: '2026-08-24T00:00:00-03:00',
    endStr: '2026-08-30T00:00:00-03:00',
  }), { start: '2026-08-24', end: '2026-08-29' });
});
