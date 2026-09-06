import test from 'node:test';
import assert from 'node:assert/strict';
import { shiftAgendaDate } from '../src/features/agendaSemanal/components/agendaTemporalNavigation.js';

const iso = (date) => date.toISOString().slice(0, 10);

test('navegação mensal cruza mês e ano', () => {
  assert.equal(iso(shiftAgendaDate(new Date('2026-08-31T12:00:00Z'), 'month', -1)), '2026-07-31');
  assert.equal(iso(shiftAgendaDate(new Date('2026-12-15T12:00:00Z'), 'month', 1)), '2027-01-15');
});

test('navegação semanal desloca exatamente sete dias', () => {
  assert.equal(iso(shiftAgendaDate(new Date('2026-08-31T12:00:00Z'), 'week', -1)), '2026-08-24');
  assert.equal(iso(shiftAgendaDate(new Date('2026-12-28T12:00:00Z'), 'week', 1)), '2027-01-04');
});

test('navegação diária desloca exatamente um dia', () => {
  assert.equal(iso(shiftAgendaDate(new Date('2026-08-31T12:00:00Z'), 'day', -1)), '2026-08-30');
  assert.equal(iso(shiftAgendaDate(new Date('2026-12-31T12:00:00Z'), 'day', 1)), '2027-01-01');
});
