import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const root = new URL('../src/features/agendaSemanal/', import.meta.url);
const modal = fs.readFileSync(new URL('components/AgendaSearchModal.jsx', root), 'utf8');
const toolbar = fs.readFileSync(new URL('components/AgendaSemanalToolbar.jsx', root), 'utf8');
const scheduler = fs.readFileSync(new URL('components/AgendaScheduler.jsx', root), 'utf8');
const api = fs.readFileSync(new URL('api/agendaSemanalApi.js', root), 'utf8');

test('PAC-3 usa uma única ação compartilhada e pesquisa somente por GET', () => {
  assert.match(toolbar, /onPatient/);
  assert.match(modal, /Pesquisa agendamentos/);
  assert.match(modal, /onPressEnter=\{runSearch\}/);
  assert.match(modal, /rowSelection=\{\{ type: 'radio'/);
  assert.match(modal, /onDoubleClick: \(\) => onEdit/);
  assert.match(modal, /scroll=\{\{ y: RESULTS_VISIBLE_HEIGHT \}\}/);
  assert.match(modal, /const RESULTS_VISIBLE_HEIGHT = 10 \* 39/);
  assert.match(modal, /title: 'Paciente \/ Compromisso'/);
  assert.match(modal, /width: 70/);
  assert.match(modal, /width: 300/);
  assert.match(modal, /agenda-search-modal__patient-header/);
  assert.equal((modal.match(/align: 'center'/g) || []).length, 4);
  assert.match(modal, /surgeon: item\.prestador_apelido \|\| ''/);
  assert.doesNotMatch(modal, /displayedRows\.slice\(0, 10\)|displayedRows\.splice\(0, 10\)/);
  assert.match(api, /fetchAgendaSearchEvents/);
  assert.match(api, /method: 'GET'/);
  assert.match(scheduler, /brana-agenda-search-edit/);
  assert.match(scheduler, /normalizeAgendaEvent/);
});

test('PAC-3 mantém a regra de filtros e o bridge único de edição', () => {
  assert.match(modal, /query\.trim\(\)/);
  assert.match(modal, /future \|\| past/);
  assert.match(modal, /Number\(item\.tipo\) === 1 \|\| item\.nro_pac != null/);
  assert.match(modal, /const editSelected/);
  assert.match(modal, /onEdit\?\.\(selected\)/);
});
