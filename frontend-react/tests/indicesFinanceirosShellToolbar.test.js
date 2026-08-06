import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const appSource = fs.readFileSync(path.resolve('frontend-react/src/app/App.jsx'), 'utf8');
const toolbarSource = fs.readFileSync(path.resolve('frontend-react/src/features/indicesFinanceiros/components/IndicesFinanceirosToolbar.jsx'), 'utf8');
const reservedSource = fs.readFileSync(path.resolve('frontend-react/src/features/indicesFinanceiros/indicesFinanceirosReserved.js'), 'utf8');

test('toolbar global existe uma unica vez no App e usa contrato interno inequívoco', () => {
  assert.match(appSource, /indicesFinanceirosTopBar/);
  assert.match(appSource, /brana-indices-financeiros-toolbar-state/);
  assert.match(appSource, /brana-indices-financeiros-toolbar-action/);
  assert.match(appSource, /edit-index/);
  assert.match(appSource, /new-index/);
  assert.match(appSource, /delete-index/);
  assert.match(appSource, /new-quotation/);
  assert.match(appSource, /delete-quotation/);
  assert.match(appSource, /<IndicesFinanceirosToolbar/);
  assert.equal((appSource.match(/<IndicesFinanceirosToolbar/g) || []).length, 1);
  assert.match(appSource, /canEditIndex=\{Boolean\(indicesFinanceirosToolbarState.selectedNumero && !indicesFinanceirosToolbarState.loading\)\}/);
  assert.match(appSource, /canEditQuotation=\{Boolean\(indicesFinanceirosToolbarState.canEditQuotation && !indicesFinanceirosToolbarState.checkingUsage && !indicesFinanceirosToolbarState.deletingIndex && !indicesFinanceirosToolbarState.migratingIndex && !indicesFinanceirosToolbarState.quotingIndex\)\}/);
  assert.match(appSource, /canDeleteQuotation=\{Boolean\(indicesFinanceirosToolbarState.canDeleteQuotation && !indicesFinanceirosToolbarState.checkingUsage && !indicesFinanceirosToolbarState.deletingIndex && !indicesFinanceirosToolbarState.migratingIndex && !indicesFinanceirosToolbarState.quotingIndex\)\}/);
  assert.doesNotMatch(appSource, /selectedNumero && !indicesFinanceirosToolbarState.selectedIsReserved && !indicesFinanceirosToolbarState.loading/);

  assert.match(toolbarSource, /onNewIndex/);
  assert.match(toolbarSource, /onEditIndex/);
  assert.match(toolbarSource, /onDeleteIndex/);
  assert.match(toolbarSource, /onNewQuotation/);
  assert.match(toolbarSource, /onEditQuotation/);
  assert.match(toolbarSource, /onDeleteQuotation/);
  assert.match(toolbarSource, /canEditIndex/);
  assert.match(toolbarSource, /canDeleteIndex/);
  assert.match(toolbarSource, /canCreateQuotation/);
  assert.match(toolbarSource, /canEditQuotation/);
  assert.match(toolbarSource, /canDeleteQuotation/);
  assert.match(toolbarSource, /Novo índice/);
  assert.match(toolbarSource, /Novo valor/);
  assert.match(toolbarSource, /Altera/);
  assert.match(toolbarSource, /indices-financeiros-toolbar-divider/);
  assert.equal((toolbarSource.match(/<button type="button"/g) || []).length, 6);
  assert.equal((toolbarSource.match(/Elimina/g) || []).length, 2);
  assert.doesNotMatch(toolbarSource, /Fecha/);
  assert.doesNotMatch(toolbarSource, /edit-index/);

  assert.match(reservedSource, /const RESERVED_NUMEROS = new Set\(\[1, 2, 3, 255\]\)/);
  assert.match(reservedSource, /export function canDeleteIndiceFinanceiro\(indice\)/);
  assert.match(reservedSource, /return Boolean\(indice\) && !isIndiceFinanceiroReservado\(indice\);/);
});
