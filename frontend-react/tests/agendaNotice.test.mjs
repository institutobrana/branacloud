import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const root = new URL('../src/features/agendaSemanal/', import.meta.url);
const modal = fs.readFileSync(new URL('components/AgendaNoticeModal.jsx', root), 'utf8');
const hook = fs.readFileSync(new URL('hooks/useAgendaNotices.js', root), 'utf8');
const api = fs.readFileSync(new URL('api/agendaNoticesApi.js', root), 'utf8');
const toolbar = fs.readFileSync(new URL('components/AgendaSemanalToolbar.jsx', root), 'utf8');

test('AVISO-2 integra comando compartilhado e endpoints somente com contratos definidos', () => {
  assert.match(toolbar, /Envio de aviso/);
  assert.match(toolbar, /onNotice/);
  assert.match(modal, /Enviar avisos de agendamento/);
  assert.match(modal, /Todos os cirurgiões/);
  assert.match(modal, /WhatsApp/);
  assert.match(modal, /E-mail/);
  assert.match(modal, /SharedDatePicker/);
  assert.match(hook, /fetchAgendaNoticeOptions/);
  assert.match(hook, /row\.ok === true/);
  assert.match(api, /GET/);
  assert.match(api, /POST/);
  assert.match(api, /avisos-agendamento/);
  assert.doesNotMatch(modal, /onDoubleClick/);
});
