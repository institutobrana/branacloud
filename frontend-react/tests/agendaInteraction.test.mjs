import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const scheduler = fs.readFileSync(path.join(here, '../src/features/agendaSemanal/components/AgendaScheduler.jsx'), 'utf8');
const modal = fs.readFileSync(path.join(here, '../src/features/agendaSemanal/components/AgendaEventModal.jsx'), 'utf8');
const interaction = fs.readFileSync(path.join(here, '../src/features/agendaSemanal/utils/agendaInteraction.js'), 'utf8');
const clinic = fs.readFileSync(path.join(here, '../src/features/agendaSemanal/components/AgendaClinicaView.jsx'), 'utf8');
const schedulerCss = fs.readFileSync(path.join(here, '../src/features/agendaSemanal/components/agendaScheduler.css'), 'utf8');

test('scheduler usa callbacks públicos e distingue clique simples de duplo clique', () => {
  assert.match(scheduler, /dateClick=\{handleDateClick\}/);
  assert.match(scheduler, /eventClick=\{handleEventClick\}/);
  assert.match(interaction, /detail/);
  assert.match(scheduler, /selectedEventId/);
  assert.match(scheduler, /mode: 'novo'/);
  assert.match(scheduler, /mode: 'edicao'/);
});

test('editor cancela sem disparar escrita e mantém escrita sob ação explícita', () => {
  assert.match(modal, /Edita agendamento/);
  assert.match(modal, /Editar agendamento/);
  assert.match(modal, /Cancela/);
  assert.match(modal, /onClick=\{onCancel\}/);
  assert.match(modal, /onClick=\{isNew \? submitNew : submitEdit\}/);
  assert.match(modal, /onClick=\{requestDelete\}/);
  assert.doesNotMatch(modal, /onClick=\{onCancel\}[^\n]*(createAgendaEvent|updateAgendaEvent|deleteAgendaEvent)/);
});

test('clínica reutiliza o detector de duplo clique para slots e eventos', () => {
  assert.match(scheduler, /onSlotClick=\{handleClinicSlotClick\}/);
  assert.match(scheduler, /onEventClick=\{handleClinicEventClick\}/);
  assert.match(scheduler, /isAgendaDoubleClick\(jsEvent\)/);
  assert.match(clinic, /onClick=\{\(jsEvent\) => onSlotClick/);
  assert.match(clinic, /onClick=\{\(jsEvent\) => onEventClick/);
  assert.match(scheduler, /mode: 'novo'/);
  assert.match(scheduler, /mode: 'edicao'/);
});

test('scheduler usa uma única casca visual para as três views sem duplicar agendas', () => {
  assert.match(scheduler, /agenda-unified-shell/);
  assert.match(scheduler, /<AgendaTemporalStrip/);
  assert.match(scheduler, /mode === 'clinica' \? <AgendaClinicaView/);
  assert.match(schedulerCss, /\.agenda-unified-shell\s*\{/);
  assert.match(schedulerCss, /background:\s*#f5f0e6/);
  assert.match(schedulerCss, /border-radius:\s*14px/);
});
