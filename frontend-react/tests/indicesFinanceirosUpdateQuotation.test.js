import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const apiSource = fs.readFileSync(path.resolve('frontend-react/src/features/indicesFinanceiros/indicesFinanceirosApi.js'), 'utf8');
const pageSource = fs.readFileSync(path.resolve('frontend-react/src/features/indicesFinanceiros/IndicesFinanceirosPage.jsx'), 'utf8');
const toolbarSource = fs.readFileSync(path.resolve('frontend-react/src/features/indicesFinanceiros/components/IndicesFinanceirosToolbar.jsx'), 'utf8');
const dialogSource = fs.readFileSync(path.resolve('frontend-react/src/features/indicesFinanceiros/components/IndiceFinanceiroQuotationFormDialog.jsx'), 'utf8');
const modalCssSource = fs.readFileSync(path.resolve('frontend-react/src/features/indicesFinanceiros/indicesFinanceiros.css'), 'utf8');

test('API de atualizar cotacao usa PATCH no recurso da cotacao selecionada', () => {
  const section = (apiSource.split('export async function updateIndiceFinanceiroCotacao')[1] || '').split('export async function deleteIndiceFinanceiroCotacao')[0];
  assert.match(apiSource, /export async function updateIndiceFinanceiroCotacao/);
  assert.match(section, /\/indices-financeiros\/\$\{encodeURIComponent\(String\(resolvedNumero\)\)\}\/cotacoes\/\$\{encodeURIComponent\(String\(resolvedCotacaoId\)\)\}/);
  assert.match(section, /method: 'PATCH'/);
  assert.match(section, /data: payload\?\.data/);
  assert.match(section, /valor: payload\?\.valor/);
});

test('pagina habilita edicao de cotacao selecionada sem misturar com nova cotacao', () => {
  assert.match(pageSource, /edit-quotation/);
  assert.match(pageSource, /selectedCotacaoRow/);
  assert.match(pageSource, /canEditQuotation/);
  assert.match(pageSource, /canDeleteQuotation/);
  assert.match(pageSource, /updateIndiceFinanceiroCotacao/);
  assert.match(pageSource, /selectCotacaoRow\(null\)/);
  assert.match(pageSource, /selectCotacaoRow\(resolvedCotacaoId\)/);
  assert.match(pageSource, /mode: 'edit'/);
  assert.match(pageSource, /initialValues:\s*\{[\s\S]*?data:\s*selectedCotacaoRow\.data\s*\?\?\s*''[\s\S]*?valor:\s*selectedCotacaoRow\.valor\s*\?\?\s*''/);
});

test('toolbar de indices financeiros expõe o segundo Altera para cotacao', () => {
  assert.match(toolbarSource, /onEditQuotation/);
  assert.match(toolbarSource, /onDeleteQuotation/);
  assert.match(toolbarSource, /canEditQuotation/);
  assert.match(toolbarSource, /canDeleteQuotation/);
  assert.equal((toolbarSource.match(/Altera/g) || []).length, 2);
  assert.equal((toolbarSource.match(/indices-financeiros-toolbar-divider/g) || []).length, 1);
  assert.equal((toolbarSource.match(/<button type="button"/g) || []).length, 6);
});

test('dialogo de cotacao suporta modo de edicao com o mesmo layout compacto', () => {
  assert.match(dialogSource, /mode = 'create'/);
  assert.match(dialogSource, /const isEditMode = mode === 'edit'/);
  assert.match(dialogSource, /title=\{isEditMode \? 'Altera cotação' : 'Nova cotação'\}/);
  assert.match(dialogSource, /indices-financeiros-modal-actions/);
  assert.match(dialogSource, /indices-financeiros-modal-primary/);
  assert.match(dialogSource, /indices-financeiros-modal-secondary/);
  assert.match(modalCssSource, /\.indices-financeiros-modal-actions \.indices-financeiros-modal-primary/);
});

test('tabela de cotacoes continua selecionando por cotacaoId', () => {
  assert.match(pageSource, /cotacaoId/);
});
