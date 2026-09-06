import test from 'node:test';
import assert from 'node:assert/strict';
import { agendaSlotMinHeight } from '../src/features/agendaSemanal/utils/agendaSchedulerScale.js';

test('converte quantidade visível na altura canônica do slot', () => {
  assert.deepEqual([4, 6, 8, 12].map(agendaSlotMinHeight), [126, 84, 63, 42]);
});
