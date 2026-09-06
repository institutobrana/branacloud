import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveWeeklyDisplayDate } from '../src/features/agendaSemanal/utils/agendaWeeklyDate.js';

const iso = (date) => date.toISOString().slice(0, 10);

test('domingo usa a segunda-feira seguinte como âncora semanal', () => {
  assert.equal(iso(resolveWeeklyDisplayDate(new Date('2026-08-30T12:00:00Z'))), '2026-08-31');
});

test('dias não-domingo preservam a data da semana', () => {
  for (const value of ['2026-08-31T12:00:00Z', '2026-09-01T12:00:00Z', '2026-09-05T12:00:00Z']) {
    assert.equal(iso(resolveWeeklyDisplayDate(new Date(value))), value.slice(0, 10));
  }
});
