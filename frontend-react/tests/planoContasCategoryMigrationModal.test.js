import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const modalSource = fs.readFileSync(path.resolve('src/features/planoContas/components/PlanoContasCategoryMigrationModal.jsx'), 'utf8');

test('PlanoContasCategoryMigrationModal exibe origem, destino e acoes', () => {
  assert.match(modalSource, /Migrar e eliminar categoria/);
  assert.match(modalSource, /Categoria em uso:/);
  assert.match(modalSource, /Migrar lançamentos para:/);
  assert.match(modalSource, /Não existe outra categoria disponível/);
  assert.match(modalSource, /Migrar e eliminar/);
  assert.match(modalSource, /Cancelar/);
});

test('PlanoContasCategoryMigrationModal usa apenas nome nas opcoes', () => {
  assert.match(modalSource, /label: String\(item\?\.nome/);
  assert.match(modalSource, /value: item\?\.id/);
});
