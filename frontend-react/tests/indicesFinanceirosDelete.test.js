import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const apiSource = fs.readFileSync(path.resolve('frontend-react/src/features/indicesFinanceiros/indicesFinanceirosApi.js'), 'utf8');
const pageSource = fs.readFileSync(path.resolve('frontend-react/src/features/indicesFinanceiros/IndicesFinanceirosPage.jsx'), 'utf8');
const toolbarSource = fs.readFileSync(path.resolve('frontend-react/src/features/indicesFinanceiros/components/IndicesFinanceirosToolbar.jsx'), 'utf8');
const deleteDialogSource = fs.readFileSync(path.resolve('frontend-react/src/features/indicesFinanceiros/components/IndiceFinanceiroDeleteDialog.jsx'), 'utf8');
const migrationDialogSource = fs.readFileSync(path.resolve('frontend-react/src/features/indicesFinanceiros/components/IndiceFinanceiroMigrationDialog.jsx'), 'utf8');
const modalCssSource = fs.readFileSync(path.resolve('frontend-react/src/features/indicesFinanceiros/indicesFinanceiros.css'), 'utf8');

test('API de exclusao e migracao preserva contrato do backend', () => {
  assert.match(apiSource, /export async function checkIndiceFinanceiroEmUso/);
  assert.match(apiSource, /export async function deleteIndiceFinanceiro/);
  assert.match(apiSource, /export async function migrateAndDeleteIndiceFinanceiro/);
  assert.match(apiSource, /\/indices-financeiros\/\$\{encodeURIComponent\(String\(resolvedNumero\)\)\}\/migrar-e-excluir/);
});

test('pagina abre exclusao simples ou migracao conforme em uso', () => {
  assert.match(pageSource, /delete-index/);
  assert.match(pageSource, /checkIndiceFinanceiroEmUso/);
  assert.match(pageSource, /deleteIndiceFinanceiro/);
  assert.match(pageSource, /migrateAndDeleteIndiceFinanceiro/);
  assert.match(pageSource, /IndiceFinanceiroDeleteDialog/);
  assert.match(pageSource, /IndiceFinanceiroMigrationDialog/);
});

test('dialogo de exclusao simples permanece separado do modal de migracao', () => {
  assert.match(deleteDialogSource, /Exclui índice financeiro/);
  assert.match(deleteDialogSource, /Deseja excluir o índice financeiro/);
  assert.match(deleteDialogSource, /Excluir/);
  assert.match(deleteDialogSource, /Cancelar/);
  assert.match(deleteDialogSource, /indices-financeiros-modal-actions/);
  assert.match(deleteDialogSource, /indices-financeiros-modal-primary/);
  assert.match(deleteDialogSource, /indices-financeiros-modal-secondary/);
  assert.match(migrationDialogSource, /Migra índice financeiro/);
  assert.match(migrationDialogSource, /O índice financeiro/);
  assert.match(migrationDialogSource, /Índice de destino/);
  assert.match(migrationDialogSource, /Migrar e excluir/);
  assert.match(migrationDialogSource, /Cancelar/);
  assert.match(migrationDialogSource, /indices-financeiros-modal-actions/);
  assert.match(migrationDialogSource, /indices-financeiros-modal-primary/);
  assert.match(migrationDialogSource, /indices-financeiros-modal-secondary/);
  assert.match(modalCssSource, /\.indices-financeiros-modal-actions \.indices-financeiros-modal-primary/);
  assert.match(modalCssSource, /\.indices-financeiros-modal-actions \.indices-financeiros-modal-secondary/);
});

test('toolbar continua com um unico comando Elimina ativo', () => {
  assert.match(toolbarSource, /onDeleteIndex/);
  assert.match(toolbarSource, /canDeleteIndex/);
  assert.equal((toolbarSource.match(/<button type="button"/g) || []).length, 6);
});
