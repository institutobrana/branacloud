import test from 'node:test';
import assert from 'node:assert/strict';

import { classifyPlanoContasGroupError } from '../src/features/planoContas/planoContasGroupDeletion.js';

test('classifyPlanoContasGroupError reconhece grupo nativo protegido', () => {
  const classified = classifyPlanoContasGroupError({
    status: 409,
    data: {
      code: 'SYSTEM_GROUP_PROTECTED',
      detail: 'GRUPO BLINDADO DO SISTEMA, NAO PODE SER EXCLUIDO!',
    },
  });

  assert.equal(classified.kind, 'system-group-protected');
  assert.equal(classified.code, 'SYSTEM_GROUP_PROTECTED');
  assert.match(classified.message, /NAO PODE SER EXCLUIDO/);
});

test('classifyPlanoContasGroupError reconhece grupo com categorias vinculadas', () => {
  const classified = classifyPlanoContasGroupError({
    status: 400,
    data: {
      detail: 'Este grupo possui categorias vinculadas.',
    },
  });

  assert.equal(classified.kind, 'group-has-categories');
  assert.match(classified.message, /categorias vinculadas/);
});
