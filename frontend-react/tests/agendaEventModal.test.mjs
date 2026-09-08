import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const source = fs.readFileSync(path.join(here, '../src/features/agendaSemanal/components/AgendaEventModal.jsx'), 'utf8');
const styles = fs.readFileSync(path.join(here, '../src/features/agendaSemanal/components/agendaEventModal.css'), 'utf8');

test('modal novo mantém as duas abas e os campos do contrato legado', () => {
  for (const label of ['Dados do agendamento', 'Repete agendamento', 'Data', 'Horário', 'Duração', 'Sala', 'Situação', 'Assunto', 'Observações', 'Inclusão', 'Alteração']) {
    assert.match(source, new RegExp(label));
  }
  assert.match(source, /initialDuration/);
  assert.match(source, /agenda-event-end/);
});

test('repetição é estado controlado, com segunda-feira a sábado e sem writes no render', () => {
  for (const token of ['useState', 'Repete horário', 'Quantidade de dias', 'WEEKDAYS', 'Segunda-feira', 'Sábado', 'Sobrepor horários já preenchidos']) {
    assert.match(source, new RegExp(token));
  }
  assert.doesNotMatch(source, /fetch\s*\(/);
  assert.match(source, /value=\{repeatState\}/);
  assert.match(source, /repeatAgendaEvent/);
});

test('separa defaults de novo dos dados reais de edição', () => {
  assert.match(source, /createNewDraft/);
  assert.match(source, /createEditDraft/);
  assert.match(source, /editor\.mode === 'novo' \? createNewDraft/);
  assert.match(source, /event\?\.extendedProps\?\.metadata/);
  assert.match(source, /eventId: String\(event\.id\)/);
  assert.match(source, /hora_fim.*hora_inicio/);
  assert.match(source, /phoneTypes: \[phoneTypeLabel\(raw\.tip_fone1/);
  assert.match(source, /status: raw\.status == null \? \(props\.status == null \? '' : String\(props\.status\)\) : String\(raw\.status\)/);
});

test('dropdown de situação cresce naturalmente e limita overflow futuro', () => {
  assert.match(source, /aria-label="Situação"[\s\S]*popupClassName="agenda-event-modal__select-dropdown"/);
  assert.match(styles, /agenda-event-modal__select-dropdown\{max-height:432px!important;overflow-y:auto!important\}/);
  assert.match(styles, /agenda-event-modal__select-dropdown \.rc-virtual-list\{height:auto!important;max-height:432px!important\}/);
  assert.match(styles, /agenda-event-modal__select-dropdown \.rc-virtual-list-holder\{height:auto!important;max-height:432px!important;overflow-y:auto!important\}/);
  assert.doesNotMatch(styles, /agenda-event-modal__select-dropdown[^}]*;height:432px!important/);
});

test('situação usa o código canônico valor_int, não o id auxiliar', () => {
  assert.match(source, /const value = item\.valor_int/);
  assert.match(source, /Number\(value\) === 0/);
  assert.match(source, /value: String\(value\)/);
  assert.doesNotMatch(source, /item\.value \?\? item\.id/);
});

test('pesquisa de pacientes é lazy e separada do gesto de abertura do editor', () => {
  assert.match(source, /patientSearchRequested/);
  assert.match(source, /patientSearchRequested \? <Modal open title="Pesquisar paciente"/);
  assert.match(source, /onClick=\{\(\) => onPatientResolve\('ellipsis'\)\}/);
  assert.match(source, /<Button aria-label="Pesquisar paciente" disabled=\{compromisso\}/);
  assert.match(source, /onCancel=\{closePatientSearch\}/);
  assert.match(source, /listarPacientes/);
  assert.match(source, /obterPaciente/);
  assert.match(source, /mapPatientToAgendaDraft/);
  assert.doesNotMatch(source, /features\/menuPacientes/);
});
