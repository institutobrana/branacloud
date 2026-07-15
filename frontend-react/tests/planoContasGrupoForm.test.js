import test from 'node:test';
import assert from 'node:assert/strict';

import { sanitizePlanoContasGroupPayload, validatePlanoContasGroupPayload } from '../src/features/planoContas/planoContasValidators.js';
import { updatePlanoContasSelectionAfterGroupSave, PLANO_CONTAS_CONTEXT } from '../src/features/planoContas/hooks/usePlanoContasSelection.js';

const groups = [
  {
    id: 11,
    nome: 'Ativo',
    tipo: 'Pessoal',
    categorias: [{ id: 111, nome: 'Caixa', tipo: 'Analitica', tributavel: false }],
  },
  {
    id: 12,
    nome: 'Passivo',
    tipo: 'Profissional',
    categorias: [],
  },
];

test('sanitizePlanoContasGroupPayload remove espacos e campos extras', () => {
  const payload = sanitizePlanoContasGroupPayload({ nome: '  Novo grupo  ', tipo: '  Pessoal  ', extra: 'ignorado' });
  assert.deepEqual(payload, { nome: 'Novo grupo', tipo: 'Pessoal' });
});

test('validatePlanoContasGroupPayload rejeita nome vazio e exige tipo', () => {
  const result = validatePlanoContasGroupPayload({ nome: '   ', tipo: '  ' });
  assert.equal(result.valid, false);
  assert.equal(result.errors.nome, 'Informe o nome do grupo.');
  assert.equal(result.errors.tipo, 'Informe o tipo do grupo.');
});

test('validatePlanoContasGroupPayload aceita grupo completo', () => {
  const result = validatePlanoContasGroupPayload({ nome: 'Ativo Circulante', tipo: 'Pessoal' });
  assert.equal(result.valid, true);
  assert.deepEqual(result.sanitized, { nome: 'Ativo Circulante', tipo: 'Pessoal' });
});

test('updatePlanoContasSelectionAfterGroupSave preserva grupo editado', () => {
  const state = updatePlanoContasSelectionAfterGroupSave(groups, {
    selectedGroupId: 11,
    selectedCategoryId: 111,
    context: PLANO_CONTAS_CONTEXT.CATEGORY,
  }, 11);

  assert.equal(state.selectedGroupId, 11);
  assert.equal(state.selectedCategoryId, 111);
  assert.equal(state.context, PLANO_CONTAS_CONTEXT.CATEGORY);
});

test('updatePlanoContasSelectionAfterGroupSave seleciona o grupo criado quando recebe o id novo', () => {
  const nextGroups = [
    ...groups,
    { id: 13, nome: 'Realizavel', tipo: 'Pessoal', categorias: [] },
  ];

  const state = updatePlanoContasSelectionAfterGroupSave(nextGroups, {
    selectedGroupId: 11,
    selectedCategoryId: null,
    context: PLANO_CONTAS_CONTEXT.GROUP,
  }, 13);

  assert.equal(state.selectedGroupId, 13);
  assert.equal(state.selectedCategoryId, null);
  assert.equal(state.context, PLANO_CONTAS_CONTEXT.GROUP);
});
