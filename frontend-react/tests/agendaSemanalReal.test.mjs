import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeAgendaEvent } from '../src/features/agendaSemanal/utils/agendaRealNormalizer.js';

test('normaliza duração real e preserva snapshot de paciente órfão', () => {
  const event = normalizeAgendaEvent({
    id: 42,
    data: '2026-08-31',
    hora_inicio: 8 * 60 * 60 * 1000,
    hora_fim: 9 * 60 * 60 * 1000,
    nro_pac: 9001,
    nome: 'Snapshot legado',
    fone1: '(00) 0000-0000',
  });

  assert.equal(event.id, '42');
  assert.equal(event.patientName, 'Snapshot legado');
  assert.equal(event.phone, '(00) 0000-0000');
  assert.equal(event.end.getTime() - event.start.getTime(), 60 * 60 * 1000);
});

test('normaliza evento sem nome sem quebrar a renderização', () => {
  const event = normalizeAgendaEvent({
    id: 43,
    data: '2026-08-31',
    hora_inicio: 10 * 60 * 60 * 1000,
    hora_fim: 0,
    nro_pac: 9002,
  });

  assert.equal(event.patientName, 'Paciente #9002');
  assert.equal(event.end.getTime() - event.start.getTime(), 5 * 60 * 1000);
});
