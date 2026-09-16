import test from 'node:test';
import assert from 'node:assert/strict';
import { isGravaDisabled } from './fichaPessoalToolbarState.js';

test('Grava habilita quando somente a Anamnese esta dirty', () => {
  assert.equal(isGravaDisabled({ isNew: false, saving: false, dirty: true }), false);
});

test('Grava permanece desabilitado sem alteracoes no paciente existente', () => {
  assert.equal(isGravaDisabled({ isNew: false, saving: false, dirty: false }), true);
});

test('Grava desabilita enquanto a Anamnese esta salvando', () => {
  assert.equal(isGravaDisabled({ isNew: false, saving: true, dirty: true }), true);
});

test('Grava preserva a regra do paciente novo', () => {
  assert.equal(isGravaDisabled({ isNew: true, saving: false, dirty: false }), false);
});
