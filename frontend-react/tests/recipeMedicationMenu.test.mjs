import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  filterRecipeMedications,
  getRecipeMedicationAlphabetOptions,
  getRecipeMedicationName,
  getRecipeMedicationPresentation,
  reconcileRecipeMedicationSelection,
  RECIPE_MEDICATION_ALPHABET,
} from '../src/features/editorTextos/models/recipeMedicationMenu.js';

const menuSource = fs.readFileSync(path.resolve(import.meta.dirname, '../src/features/editorTextos/components/EditorTextosRecipeAssistantModal.jsx'), 'utf8');
const alphabetSource = fs.readFileSync(path.resolve(import.meta.dirname, '../src/features/pacientes/components/PacientesAlphabet.jsx'), 'utf8');
const patientStyles = fs.readFileSync(path.resolve(import.meta.dirname, '../src/features/pacientes/pacientes.css'), 'utf8');
const menuStyles = fs.readFileSync(path.resolve(import.meta.dirname, '../src/features/editorTextos/components/EditorTextosRecipeAssistantModal.css'), 'utf8');
const fixture = [
  { id: 7, nome: 'Amoxicilina', apresentacao: '500 mg cápsula', grupo: 'Antibiótico' },
  { id: 8, nome: 'Ácido fólico', apresentacao: '5 mg comprimido', grupo: 'Vitamina' },
  { id: 9, nome: 'Dipirona', apresentacao: '500 mg/mL gotas', grupo: 'Analgésico' },
  { id: 10, nome: 'Amoxicilina', apresentacao: '250 mg suspensão', grupo: 'Antibiótico' },
];

test('medication rows bind textual name and presentation fields, never id or code as the name', () => {
  assert.equal(getRecipeMedicationName(fixture[0]), 'Amoxicilina');
  assert.equal(getRecipeMedicationPresentation(fixture[0]), '500 mg cápsula');
  assert.equal(getRecipeMedicationName({ id: 42, codigo: '007', nome: 'Ibuprofeno' }), 'Ibuprofeno');
  assert.match(menuSource, /title: 'Nome', dataIndex: 'nome'/);
  assert.match(menuSource, /title: 'Apresentação', dataIndex: 'apresentacao'/);
  assert.doesNotMatch(menuSource, /title: 'Nome', dataIndex: 'codigo'/);
});

test('filter, accent-insensitive search, and alphabet filters combine by intersection', () => {
  assert.deepEqual(filterRecipeMedications(fixture, { group: 'Antibiótico', letter: 'A', query: 'amoxicilina 500' }).map((item) => item.id), [7]);
  assert.deepEqual(filterRecipeMedications(fixture, { group: 'Vitamina', letter: 'A', query: 'ACIDO' }).map((item) => item.id), [8]);
  assert.deepEqual(filterRecipeMedications(fixture, { group: 'Analgésico', letter: 'A', query: 'amoxi' }), []);
});

test('alphabet uses all A-Z plus all-items and reuses the patient alphabet control with medication labels', () => {
  assert.deepEqual(RECIPE_MEDICATION_ALPHABET, ['*', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ']);
  assert.equal(getRecipeMedicationAlphabetOptions().length, 27);
  assert.match(menuSource, /<PacientesAlphabet/);
  assert.match(menuSource, /ariaLabel="Régua alfabética de medicamentos"/);
  assert.match(alphabetSource, /ariaLabel = 'Filtro alfabético de pacientes'/);
  assert.match(alphabetSource, /entityLabel = 'pacientes'/);
});

test('medication alphabet fits all 27 items in one scoped row without changing patient-menu scrolling', () => {
  assert.match(menuStyles, /\.editor-textos-medication-menu \.pacientes-alphabet \{[^}]*display: grid; grid-template-columns: repeat\(27, minmax\(0, 1fr\)\)[^}]*overflow-x: hidden;/);
  assert.doesNotMatch(menuStyles, /\.editor-textos-medication-menu \.pacientes-alphabet \{ overflow-x: auto/);
  assert.match(menuStyles, /\.editor-textos-medication-menu \.pacientes-alphabet-button \{ width: 100%; min-width: 0;/);
  assert.match(patientStyles, /\.pacientes-alphabet \{[^}]*overflow-x: auto;/);
  assert.deepEqual(RECIPE_MEDICATION_ALPHABET, ['*', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ']);
});

test('selection reconciliation chooses only a visible row and clears selection for zero results', () => {
  assert.equal(reconcileRecipeMedicationSelection(fixture.slice(0, 1), 7), 7);
  assert.equal(reconcileRecipeMedicationSelection(fixture.slice(0, 1), 8), 7);
  assert.equal(reconcileRecipeMedicationSelection([], 7), null);
  assert.match(menuSource, /onDoubleClick: \(\) => confirmMedication/);
  assert.match(menuSource, /disabled=\{!menuSelectedMedicationId/);
});

test('menu has loading/error retry, explicit Ok/Cancel, and cancel only closes without selecting', () => {
  assert.match(menuSource, /medicationMenuLoading/);
  assert.match(menuSource, /medicationMenuError/);
  assert.match(menuSource, /Tentar novamente/);
  assert.match(menuSource, /<Button onClick=\{\(\) => setMedicationListOpen\(false\)\}>Cancelar<\/Button>/);
  assert.match(menuSource, /onCancel=\{\(\) => setMedicationListOpen\(false\)\}/);
  assert.match(menuSource, /const confirmMedication =/);
  assert.match(menuSource, /selectMedication\(idOf\(item\)\)/);
});

test('recipe assistant keeps medication suggestion behavior and enables the newly implemented include/finalize actions', () => {
  assert.match(menuSource, /getRecipeAssistantMedications\(\{ limit: 1000 \}\)/);
  assert.match(menuSource, /onClick=\{\(\) => void openMedicationMenu\(\)\}/);
  assert.match(menuSource, /\[\.\.\.menuMedications, \.\.\.medications\]\.find/);
  assert.match(menuSource, /setPrescription\(String\(ageGroup === 'crianca'/);
  assert.match(menuSource, /setQuantity\(suggestedQuantity\)/);
  assert.match(menuSource, /onClick=\{\(\) => void includeMedication\(\)\}/);
  assert.match(menuSource, /onClick=\{\(\) => void finalizeRecipe\(\)\}/);
  assert.match(menuSource, /<Button disabled>Assinar PDF/);
});

test('medication menu uses compact density while retaining table-owned vertical scrolling and responsive width', () => {
  assert.match(menuSource, /width=\{720\}/);
  assert.match(menuSource, /scroll=\{\{ y: 420 \}\}/);
  assert.match(menuStyles, /max-width: calc\(100vw - 32px\)/);
  assert.match(menuStyles, /ant-table-tbody > tr:not\(\.ant-table-measure-row\) > td \{ height: 22px; min-height: 0; padding: 1px 10px; font-size: 13px; line-height: 18px; vertical-align: middle; \}/);
  assert.match(menuStyles, /ant-table-tbody > tr\.ant-table-measure-row/);
  assert.match(menuStyles, /th\.ant-table-cell \{ height: 26px; padding: 3px 10px; font-size: 13px; line-height: 18px/);
  assert.match(menuStyles, /@media \(max-width: 640px\).*grid-template-columns: 1fr/);
});
