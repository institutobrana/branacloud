import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const component = fs.readFileSync(path.join(here, '../src/features/agendaSemanal/components/AgendaContextMenu.jsx'), 'utf8');
const scheduler = fs.readFileSync(path.join(here, '../src/features/agendaSemanal/components/AgendaScheduler.jsx'), 'utf8');
const modal = fs.readFileSync(path.join(here, '../src/features/agendaSemanal/components/AgendaEventModal.jsx'), 'utf8');
const styles = fs.readFileSync(path.join(here, '../src/features/agendaSemanal/components/agendaContextMenu.css'), 'utf8');

test('context menu preserves the free/event item contracts', () => {
  assert.match(component, /Novo agendamento\.\.\./);
  for (const label of ['Editar agendamento\.\.\.', 'Excluir agendamento', 'Repetir agendamento\.\.\.', 'Abrir odontograma\.\.\.', 'Abrir ficha pessoal\.\.\.', 'Pesquisar iguais\.\.\.']) assert.match(component, new RegExp(label));
  assert.match(component, /role="separator"/);
  assert.match(component, /key: 'repetir', label: 'Repetir agendamento\.\.\.'/);
  assert.doesNotMatch(component, /key: 'repetir',[^\n]*placeholder/);
  assert.match(component, /key: 'odontograma',[^\n]*placeholder: true/);
});

test('scheduler captures eventDidMount and free-slot data-time without pointer-time math', () => {
  assert.match(scheduler, /eventDidMount=/);
  assert.match(scheduler, /eventWillUnmount=/);
  assert.match(scheduler, /fc-timegrid-slot/);
  assert.match(scheduler, /dataset\.time/);
  assert.match(scheduler, /dataset\.date/);
  assert.match(scheduler, /startTime: String\(slot\.dataset\.time/);
});

test('repeat opens the existing modal on the repeat tab and delete uses direct confirmation', () => {
  assert.match(scheduler, /initialTab: 'repete'/);
  assert.match(scheduler, /<AgendaDeleteConfirmModal/);
  assert.match(scheduler, /deleteAgendaEvent\(deleteConfirm\.event\.id\)/);
  assert.match(modal, /initialTab = 'dados'/);
  assert.match(modal, /initialTab === 'repete' \? 'repete' : 'dados'/);
});

test('legacy visual contract and global-listener cleanup are represented', () => {
  for (const token of ['min-width: 220px', 'var(--brana-surface-panel', 'z-index: 2500', 'position: fixed', 'Inter', 'border-radius: 12px', 'min-height: 32px']) assert.ok(styles.includes(token), `missing ${token}`);
  assert.doesNotMatch(styles, /Tahoma|#f4f4f4|#cfe6ff/);
  for (const token of ['mousedown', 'keydown', 'blur', 'resize', 'scroll', 'removeEventListener']) assert.match(component, new RegExp(token));
});
