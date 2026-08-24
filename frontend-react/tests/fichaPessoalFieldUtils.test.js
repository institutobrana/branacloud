import test from 'node:test';
import assert from 'node:assert/strict';
import { formatCpfIfValid, isValidCpf } from '../src/features/pacientes/components/fichaPessoal/fichaPessoalFieldUtils.js';

test('CPF valida digitos, rejeita sequencias e mascara somente valor valido', () => {
  assert.equal(isValidCpf('52998224725'), true);
  assert.equal(formatCpfIfValid('52998224725'), '529.982.247-25');
  assert.equal(isValidCpf('52998224726'), false);
  assert.equal(formatCpfIfValid('52998224726'), '52998224726');
  assert.equal(formatCpfIfValid('11111111111'), '11111111111');
});
