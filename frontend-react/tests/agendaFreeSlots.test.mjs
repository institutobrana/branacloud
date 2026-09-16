import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const root = new URL('../src/features/agendaSemanal/', import.meta.url);
const modal = fs.readFileSync(new URL('components/AgendaFreeSlotsModal.jsx', root), 'utf8');
const toolbar = fs.readFileSync(new URL('components/AgendaSemanalToolbar.jsx', root), 'utf8');
const hook = fs.readFileSync(new URL('hooks/useAgendaFreeSlots.js', root), 'utf8');
const api = fs.readFileSync(new URL('api/agendaFreeSlotsApi.js', root), 'utf8');
const scheduler = fs.readFileSync(new URL('components/AgendaScheduler.jsx', root), 'utf8');
const app = fs.readFileSync(new URL('../../app/App.jsx', root), 'utf8');
const css = fs.readFileSync(new URL('components/agendaFreeSlotsModal.css', root), 'utf8');

test('HOR-2 mantém feature única, endpoint legado e contrato da tabela', () => {
  assert.match(toolbar, /onHour/);
  assert.match(toolbar, /includes\(label\)/);
  assert.match(modal, /Pesquisa horarios livres/);
  assert.match(modal, /Segunda-feira/);
  assert.doesNotMatch(modal, /Domingo/);
  assert.match(modal, /scroll=\{\{ y: 214 \}\}/);
  assert.match(modal, /pagination=\{false\}/);
  assert.match(modal, /onDoubleClick: \(\) => onEdit/);
  assert.match(api, /\/agenda-legado\/horarios-livres/);
  assert.match(api, /method: 'GET'/);
  assert.doesNotMatch(modal, /event_id|eventId/);
});

test('HOR-2 auto-seleciona a primeira linha sem truncar datasource', () => {
  assert.match(hook, /setRows\(result\)/);
  assert.match(hook, /setSelectedIndex\(result\.length \? 0 : null\)/);
  assert.doesNotMatch(hook, /slice\(0,\s*10\)/);
  assert.match(scheduler, /brana-agenda-free-slot-edit/);
});

test('HOR-3 preserva free slots durante Cancelar e restaura somente esse contexto', () => {
  assert.match(scheduler, /fromFreeSlots: true/);
  assert.match(scheduler, /brana-agenda-free-slot-cancelled/);
  assert.match(app, /brana-agenda-free-slot-cancelled/);
  assert.match(app, /setAgendaFreeSlotsOpen\(false\)/);
  assert.match(app, /brana-agenda-free-slot-edit/);
});

test('HOR-3 aproxima a arquitetura espacial legada sem alterar a tabela', () => {
  assert.doesNotMatch(modal, />Datas</);
  assert.match(modal, /agenda-free-slots-modal__period/);
  assert.match(modal, /agenda-free-slots-modal__search/);
  assert.match(css, /grid-template-columns: 140px 1fr/);
  assert.match(css, /flex-direction: column/);
  assert.match(css, /justify-content: flex-end/);
  assert.match(modal, /scroll=\{\{ y: 214 \}\}/);
});

test('HOR-4B usa o contrato compartilhado de datas nos dois campos do período', () => {
  assert.match(modal, /normalizeContaCorrenteDateInput/);
  assert.match(modal, /function SharedDatePicker/);
  assert.match(modal, /format="DD\/MM\/YYYY"/);
  assert.match(modal, /onBlur=\{commit\}/);
  assert.match(modal, /event\.key === 'Tab'/);
  assert.match(modal, /normalized \? normalized\.format\('YYYY-MM-DD'\) : ''/);
  assert.equal((modal.match(/<SharedDatePicker /g) || []).length, 2);
  assert.doesNotMatch(modal, /toISOString/);
  assert.doesNotMatch(modal, /normalizeAgendaDateInput|parseFreeSlotDate/);
});
