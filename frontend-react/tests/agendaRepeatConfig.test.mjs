import assert from 'node:assert/strict';
import test from 'node:test';
import { buildRepeatConfig, createRepeatState, saveBaseThenRepeat } from '../src/features/agendaSemanal/utils/agendaRepeatConfig.js';

test('disabled repetition returns null', () => {
  assert.equal(buildRepeatConfig(createRepeatState('2026-08-31'), 9), null);
});

test('daily config includes only daily fields and clamps values', () => {
  assert.deepEqual(buildRepeatConfig({ enabled: true, mode: 'dias', days: 99, weeks: 4, weekday: 2, monthDay: 31, months: 3, overwrite: true }, 999), {
    item_id: 999, modo: 'dias', sobrepor: true, qtd_dias: 60,
  });
});

test('weekly config maps weekday 1 through 6', () => {
  assert.deepEqual(buildRepeatConfig({ enabled: true, mode: 'semanas', days: 1, weeks: 3, weekday: 6, monthDay: 1, months: 1, overwrite: false }, 10), {
    item_id: 10, modo: 'semanas', sobrepor: false, qtd_semanas: 3, dia_semana: 6,
  });
});

test('monthly config uses base date day and clamps month count', () => {
  assert.equal(createRepeatState('2026-08-31').monthDay, 31);
  assert.deepEqual(buildRepeatConfig({ enabled: true, mode: 'meses', monthDay: 31, months: 90, overwrite: false }, 11), {
    item_id: 11, modo: 'meses', sobrepor: false, dia_mes: 31, qtd_meses: 60,
  });
});

test('new flow saves base before repeating with returned id', async () => {
  const calls = [];
  await saveBaseThenRepeat({
    saveBase: async () => { calls.push('base'); return { id: 999999 }; },
    repeat: async (id, config) => { calls.push(['repeat', id, config]); },
    repeatState: { enabled: true, mode: 'dias', days: 2, overwrite: false },
  });
  assert.deepEqual(calls, ['base', ['repeat', 999999, { item_id: 999999, modo: 'dias', sobrepor: false, qtd_dias: 2 }]]);
});

test('edit flow repeats with existing id', async () => {
  const calls = [];
  await saveBaseThenRepeat({
    saveBase: async () => { calls.push('base'); return { id: 44 }; },
    repeat: async (id, config) => { calls.push(['repeat', id, config]); },
    itemId: 56191,
    repeatState: { enabled: true, mode: 'semanas', weeks: 3, weekday: 1, overwrite: true },
  });
  assert.deepEqual(calls, ['base', ['repeat', 56191, { item_id: 56191, modo: 'semanas', sobrepor: true, qtd_semanas: 3, dia_semana: 1 }]]);
});

test('base failure prevents repeat', async () => {
  let repeatCalls = 0;
  await assert.rejects(() => saveBaseThenRepeat({
    saveBase: async () => { throw new Error('base failed'); },
    repeat: async () => { repeatCalls += 1; },
    repeatState: { enabled: true, mode: 'dias', days: 1 },
  }), /base failed/);
  assert.equal(repeatCalls, 0);
});

test('repeat failure propagates without retry', async () => {
  let repeatCalls = 0;
  await assert.rejects(() => saveBaseThenRepeat({
    saveBase: async () => ({ id: 7 }),
    repeat: async () => { repeatCalls += 1; throw new Error('repeat failed'); },
    repeatState: { enabled: true, mode: 'meses', monthDay: 31, months: 1 },
  }), /repeat failed/);
  assert.equal(repeatCalls, 1);
});
