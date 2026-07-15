import test from 'node:test';
import assert from 'node:assert/strict';

import { updatePlanoContasSelectionAfterCategoryDelete } from '../src/features/planoContas/hooks/usePlanoContasSelection.js';

test('updatePlanoContasSelectionAfterCategoryDelete preserva grupo e limpa categoria', () => {
  const groups = [
    { id: 10, nome: 'Financeiro', categorias: [{ id: 1, nome: 'Caixa' }] },
    { id: 11, nome: 'Ativo', categorias: [{ id: 2, nome: 'Banco' }] },
  ];

  const result = updatePlanoContasSelectionAfterCategoryDelete(groups, {
    selectedGroupId: 11,
    selectedCategoryId: 2,
    context: 'category',
  });

  assert.equal(result.selectedGroupId, 11);
  assert.equal(result.selectedCategoryId, null);
  assert.equal(result.context, 'group');
  assert.equal(result.selectedGroup?.id, 11);
  assert.equal(result.selectedGroupKey, '11');
});

test('updatePlanoContasSelectionAfterCategoryDelete aplica fallback seguro quando o grupo some', () => {
  const result = updatePlanoContasSelectionAfterCategoryDelete([], {
    selectedGroupId: 99,
    selectedCategoryId: 123,
    context: 'category',
  });

  assert.equal(result.selectedGroupId, null);
  assert.equal(result.selectedCategoryId, null);
  assert.equal(result.context, 'none');
  assert.equal(result.selectedGroup, null);
});
