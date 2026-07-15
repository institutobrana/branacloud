import test from 'node:test';
import assert from 'node:assert/strict';

import { sanitizePlanoContasCategoryPayload, validatePlanoContasCategoryPayload } from '../src/features/planoContas/planoContasCategoryValidators.js';

test('sanitizePlanoContasCategoryPayload remove espacos e preserva booleano', () => {
  const payload = sanitizePlanoContasCategoryPayload({
    nome: '  Caixa  ',
    tipo: '  Analitica  ',
    grupo_id: '12',
    tributavel: 1,
  });

  assert.deepEqual(payload, {
    nome: 'Caixa',
    tipo: 'Analitica',
    grupo_id: 12,
    tributavel: true,
  });
});

test('validatePlanoContasCategoryPayload rejeita categoria sem grupo', () => {
  const result = validatePlanoContasCategoryPayload({ nome: 'Caixa', tipo: 'Analitica', grupo_id: 0 });
  assert.equal(result.valid, false);
  assert.equal(result.errors.grupo_id, 'Selecione um grupo.');
});

test('validatePlanoContasCategoryPayload aceita dados completos', () => {
  const result = validatePlanoContasCategoryPayload({ nome: 'Caixa', tipo: 'Analitica', grupo_id: 11, tributavel: false });
  assert.equal(result.valid, true);
  assert.deepEqual(result.sanitized, { nome: 'Caixa', tipo: 'Analitica', grupo_id: 11, tributavel: false });
});
