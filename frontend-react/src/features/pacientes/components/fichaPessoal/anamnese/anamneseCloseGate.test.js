import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const modalSource = fs.readFileSync(fileURLToPath(new URL('../FichaPessoalModal.jsx', import.meta.url)), 'utf8');
const hookSource = fs.readFileSync(fileURLToPath(new URL('./useAnamnese.js', import.meta.url)), 'utf8');

test('X e Fecha usam o mesmo gate de fechamento da Ficha', () => {
  assert.match(modalSource, /const requestCloseFicha = \(\) =>/);
  assert.match(modalSource, /anamneseRef\.current\?\.hasPendingChanges\?\.\(\)/);
  assert.match(modalSource, /onCancel=\{requestCloseFicha\}/);
  assert.match(modalSource, /<FichaPessoalToolbar onClose=\{requestCloseFicha\}/);
  assert.match(modalSource, /maskClosable=\{false\}/);
  assert.match(modalSource, /keyboard/);
});

test('troca e fechamento leem o pending atual exposto pela Anamnese', () => {
  const tabSource = fs.readFileSync(fileURLToPath(new URL('./AnamneseTab.jsx', import.meta.url)), 'utf8');
  assert.match(tabSource, /forwardRef\(function AnamneseTab/);
  assert.match(tabSource, /useImperativeHandle\(ref, \(\) => \(\{ hasPendingChanges: \(\) => state\.hasPendingChanges \}\)/);
  assert.match(modalSource, /<AnamneseTab ref=\{anamneseRef\}/);
  assert.match(modalSource, /if \(activeTab === 'anamnese' && anamneseRef\.current\?\.hasPendingChanges\?\.\(\)\)/);
});

test('OK com questionario sem respostas preserva o novo como pending', () => {
  assert.match(hookSource, /setHasPersistedQuestionnaire\(Boolean\(data\?\.has_persisted_questionnaire\)\)/);
  assert.match(hookSource, /setIsNewUnsavedQuestionnaire\(!data\?\.has_persisted_questionnaire\)/);
  assert.match(hookSource, /const hasPendingChanges = useMemo\(\(\) => isNewUnsavedQuestionnaire \|\| !itemsEqual\(savedItems, draftItems\)/);
});

test('Cancelar do modal inicial retorna para Dados pessoais sem selecionar questionario', () => {
  const tabSource = fs.readFileSync(fileURLToPath(new URL('./AnamneseTab.jsx', import.meta.url)), 'utf8');
  assert.match(tabSource, /onInitialCancel/);
  assert.match(tabSource, /setInitialSelection\(''\)/);
  assert.match(modalSource, /onInitialCancel=\{\(\) => setActiveTab\('dados'\)\}/);
});
