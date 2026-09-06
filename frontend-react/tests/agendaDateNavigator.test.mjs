import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const root = new URL('../src/features/agendaSemanal/components/', import.meta.url);
const navigatorSource = fs.readFileSync(new URL('AgendaDateNavigator.jsx', root), 'utf8');
const toolbarSource = fs.readFileSync(new URL('AgendaSemanalToolbar.jsx', root), 'utf8');
const schedulerSource = fs.readFileSync(new URL('AgendaScheduler.jsx', root), 'utf8');

test('calendar navigator uses the existing Ant Design calendar and closes after selection', () => {
  assert.match(navigatorSource, /Popover/);
  assert.match(navigatorSource, /Calendar locale=\{ptBR\.Calendar\} fullscreen=\{false\}/);
  assert.match(navigatorSource, /antd\/locale\/pt_BR/);
  assert.match(navigatorSource, /Calendário/);
  assert.match(navigatorSource, /setOpen\(false\)/);
  assert.match(navigatorSource, /YYYY-MM-DD/);
});

test('calendar navigator is mounted only for the existing toolbar button', () => {
  assert.match(toolbarSource, /AgendaDateNavigator/);
  assert.match(toolbarSource, /label === 'Calendário'/);
  assert.match(toolbarSource, /label === 'Paciente'/);
  assert.match(toolbarSource, /onPatient/);
  assert.match(toolbarSource, /label === 'Calendário' \? \(/);
});

test('date selection delegates to the existing FullCalendar ref without writes', () => {
  assert.match(schedulerSource, /brana-agenda-calendar-date-select/);
  assert.match(schedulerSource, /calendarRef\.current\?\.getApi\(\)/);
  assert.match(schedulerSource, /api\.gotoDate\(date\)/);
  assert.match(schedulerSource, /focusDate/);
  assert.doesNotMatch(navigatorSource, /fetch|POST|PUT|PATCH|DELETE/);
});
