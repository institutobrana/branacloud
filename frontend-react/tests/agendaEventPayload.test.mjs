import assert from 'node:assert/strict';
import test from 'node:test';
import { buildAgendaPayload, validateAgendaEditPayload } from '../src/features/agendaSemanal/utils/agendaEventPayload.js';

const draft = { date: '2026-08-31', startTime: '08:00', duration: 60, room: 3, type: '1', patientId: '646', name: 'Paciente Completo', status: '', subject: '', observations: '', phones: ['', '', ''], phoneTypes: ['Residencial', 'Celular', 'Comercial'] };

test('edit uses event unit instead of global filter unit', () => {
  const payload = buildAgendaPayload({ ...draft, unitId: '7' }, { mode: 'edit', providerId: '1', unitId: 1 });
  assert.equal(payload.id_unidade, 7);
  const editPayload = buildAgendaPayload({ ...draft, unitId: '7' }, { mode: 'edit', providerId: '1', unitId: 7 });
  assert.equal(editPayload.id_unidade, 7);
});

test('missing edit unit remains null and blocks validation', () => {
  const payload = buildAgendaPayload({ ...draft, unitId: null }, { mode: 'edit', providerId: '1', unitId: 1 });
  assert.equal(payload.id_unidade, null);
  assert.equal(validateAgendaEditPayload(payload, '99'), false);
});
