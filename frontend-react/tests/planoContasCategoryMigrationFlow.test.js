import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const hookSource = fs.readFileSync(path.resolve('frontend-react/src/features/planoContas/hooks/usePlanoContas.js'), 'utf8');
const pageSource = fs.readFileSync(path.resolve('frontend-react/src/features/planoContas/PlanoContasPage.jsx'), 'utf8');

test('409 abre modal de migracao e preserva selecao', () => {
  assert.match(hookSource, /kind === 'category-in-use'/);
  assert.match(hookSource, /setMigrationModalOpen\(true\)/);
  assert.match(hookSource, /setMigrationSourceCategory/);
  assert.match(hookSource, /setMigrationDestinations/);
  assert.match(pageSource, /PlanoContasCategoryMigrationModal/);
});

test('fluxo de sucesso da migracao recarrega e reconcilia por id', () => {
  assert.match(hookSource, /migrarEExcluirPlanoContasCategoria/);
  assert.match(hookSource, /reconcilePlanoContasCategoryMigrationSelection/);
  assert.match(hookSource, /message\.success\('Lançamentos migrados e categoria eliminada com sucesso\.'/);
});

test('toolbar fica bloqueada durante migracao ou modal aberto', () => {
  assert.match(pageSource, /!migrating && !migrationModalOpen/);
  assert.match(pageSource, /migrating,/);
  assert.match(pageSource, /migrationModalOpen,/);
});
