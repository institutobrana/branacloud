import test from 'node:test';
import assert from 'node:assert/strict';

import {
  SYSTEM_PROTECTED_GROUP_ALIASES,
  SYSTEM_PROTECTED_GROUP_NAMES,
  isPlanoContasSystemProtectedGroup,
  normalizePlanoContasSystemGroupName,
} from '../src/features/planoContas/planoContasSystemGroups.js';

test('normalizePlanoContasSystemGroupName converte o nome para a forma canonica', () => {
  assert.equal(normalizePlanoContasSystemGroupName('  custo   fixo - pessoal  '), 'CUSTO FIXO - PESSOAL');
  assert.equal(normalizePlanoContasSystemGroupName('investimento-empresa'), 'INVESTIMENTO - EMPRESA');
  assert.equal(normalizePlanoContasSystemGroupName('custo variavel pessoal'), 'CUSTO VARIAVEL PESSOAL');
});

test('SYSTEM_PROTECTED_GROUP_NAMES cobre os seis grupos nativos', () => {
  assert.deepEqual(SYSTEM_PROTECTED_GROUP_NAMES, [
    'CUSTO FIXO PESSOAL',
    'CUSTO FIXO PROFISSIONAL',
    'CUSTO VARIAVEL PESSOAL',
    'CUSTO VARIAVEL PROFISSIONAL',
    'INVESTIMENTO - EMPRESA',
    'INVESTIMENTO - PESSOAL',
  ]);
  assert.deepEqual(SYSTEM_PROTECTED_GROUP_ALIASES, [
    'CUSTO VARIVAVEL PROFISSIONAL',
    'INVESTIMENTOS - EMPRESA',
    'INVESTIMENTOS - PESSOAL',
  ]);
});

test('isPlanoContasSystemProtectedGroup reconhece os seis grupos protegidos', () => {
  assert.equal(isPlanoContasSystemProtectedGroup('CUSTO FIXO PESSOAL'), true);
  assert.equal(isPlanoContasSystemProtectedGroup('Custo Variavel Profissional'), true);
  assert.equal(isPlanoContasSystemProtectedGroup('Custo varivável profissional'), true);
  assert.equal(isPlanoContasSystemProtectedGroup('INVESTIMENTO-EMPRESA'), true);
  assert.equal(isPlanoContasSystemProtectedGroup('Investimentos - Empresa'), true);
  assert.equal(isPlanoContasSystemProtectedGroup('investimento - pessoal'), true);
  assert.equal(isPlanoContasSystemProtectedGroup('Investimentos - Pessoal'), true);
  assert.equal(isPlanoContasSystemProtectedGroup('Grupo livre'), false);
  assert.equal(isPlanoContasSystemProtectedGroup(null), false);
});
