import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = (path) => fs.readFileSync(new URL(path, import.meta.url), 'utf8');
const app = read('../src/app/App.jsx');
const page = read('../src/features/fichaClinica/FichaClinicaPage.jsx');
const modal = read('../src/features/fichaClinica/NovoTratamentoModal.jsx');
const css = read('../src/features/fichaClinica/fichaClinica.css');

test('menu + separa Novo paciente de Novo tratamento', () => {
  assert.match(page, /onRequestNewPatient\?\./);
  assert.match(page, /onRequestNewTreatment\?\./);
  assert.doesNotMatch(page, /new-treatment'\) message\.info/);
  assert.match(app, /openNewPatientFromFicha/);
  assert.match(app, /setPendingFichaNewTreatment\(true\)/);
});

test('cadastro contextual permanece na Ficha e oferece decisão pós-sucesso', () => {
  assert.match(app, /fichaNewPatientContext/);
  assert.match(app, /setPendingFichaNewTreatment\(false\);\s*setFichaNewTreatmentOpen\(false\);\s*setPatientMenuOpen\(false\);/);
  assert.match(app, /open=\{fichaPessoalOpen && \(screen === 'pacientes' \|\| screen === 'ficha-clinica' \|\| fichaNewPatientContext\)\}/);
  assert.match(app, /onCreated=\{\(created\) =>/);
  assert.match(app, /Abrir novo paciente/);
  assert.match(app, /Continuar sem paciente/);
  assert.match(app, /Manter paciente atual/);
  assert.doesNotMatch(app, /setNewPatientDecision\(created\)[\s\S]{0,180}setPatientMenuOpen\(true\)/);
});

test('Novo tratamento arma somente seu próprio gate', () => {
  assert.match(app, /if \(patientInUse\) \{\s*setPendingFichaNewTreatment\(false\);\s*setFichaNewTreatmentOpen\(true\);/);
  assert.match(app, /else \{\s*setPendingFichaNewTreatment\(true\);\s*setPatientMenuOpen\(true\);/);
});

test('Novo tratamento mantém modal de 468px e superfície do Novo contato', () => {
  assert.match(modal, /width=\{468\}/);
  assert.match(css, /\.novo-tratamento-modal \.ant-modal-content[\s\S]*background: #f5f0e6 !important/);
  assert.match(css, /\.novo-tratamento-modal \.ant-tabs-tab/);
});
