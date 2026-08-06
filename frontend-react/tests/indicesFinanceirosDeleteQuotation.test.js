import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const apiSource = fs.readFileSync(path.resolve('frontend-react/src/features/indicesFinanceiros/indicesFinanceirosApi.js'), 'utf8');
const pageSource = fs.readFileSync(path.resolve('frontend-react/src/features/indicesFinanceiros/IndicesFinanceirosPage.jsx'), 'utf8');
const toolbarSource = fs.readFileSync(path.resolve('frontend-react/src/features/indicesFinanceiros/components/IndicesFinanceirosToolbar.jsx'), 'utf8');
const dialogSource = fs.readFileSync(path.resolve('frontend-react/src/features/indicesFinanceiros/components/IndiceFinanceiroQuotationDeleteDialog.jsx'), 'utf8');
const tableSource = fs.readFileSync(path.resolve('frontend-react/src/features/indicesFinanceiros/components/IndicesCotacoesTable.jsx'), 'utf8');
const reservedSource = fs.readFileSync(path.resolve('frontend-react/src/features/indicesFinanceiros/indicesFinanceirosReserved.js'), 'utf8');
const modalCssSource = fs.readFileSync(path.resolve('frontend-react/src/features/indicesFinanceiros/indicesFinanceiros.css'), 'utf8');

test('API de exclusao de cotacao usa DELETE no path correto sem body', () => {
  const section = apiSource.split('export async function deleteIndiceFinanceiroCotacao')[1] || '';
  assert.match(apiSource, /export async function deleteIndiceFinanceiroCotacao/);
  assert.match(section, /\/indices-financeiros\/\$\{encodeURIComponent\(String\(resolvedNumero\)\)\}\/cotacoes\/\$\{encodeURIComponent\(String\(resolvedCotacaoId\)\)\}/);
  assert.match(section, /method: 'DELETE'/);
});

test('toolbar expõe o segundo Elimina como acao distinta da exclusao de indice', () => {
  assert.match(toolbarSource, /onDeleteQuotation/);
  assert.match(toolbarSource, /canDeleteQuotation/);
  assert.equal((toolbarSource.match(/indices-financeiros-toolbar-divider/g) || []).length, 1);
  assert.equal((toolbarSource.match(/<button type="button"/g) || []).length, 6);
  assert.equal((toolbarSource.match(/Elimina/g) || []).length, 2);
});

test('primeiro Elimina continua bloqueado nos quatro nativos e habilitavel para indice comum', () => {
  assert.match(reservedSource, /const RESERVED_NUMEROS = new Set\(\[1, 2, 3, 255\]\)/);
  assert.match(reservedSource, /export function canDeleteIndiceFinanceiro\(indice\)/);
  assert.match(reservedSource, /return Boolean\(indice\) && !isIndiceFinanceiroReservado\(indice\);/);
});

test('pagina liga delete-quotation a uma confirmacao compacta e isolada', () => {
  assert.match(pageSource, /delete-quotation/);
  assert.match(pageSource, /quotationDeleteDialogState/);
  assert.match(pageSource, /IndiceFinanceiroQuotationDeleteDialog/);
  assert.match(pageSource, /handleConfirmQuotationDelete/);
  assert.match(pageSource, /pickNextCotacaoId/);
  assert.match(pageSource, /deleteIndiceFinanceiroCotacao/);
  assert.match(pageSource, /selectCotacaoRow\(nextSelectedCotacaoId\)/);
  assert.match(pageSource, /selectCotacaoRow\(null\)/);
});

test('dialogo de exclusao de cotacao mostra data e valor sem ids internos', () => {
  assert.match(dialogSource, /Exclui cotação/);
  assert.match(dialogSource, /Deseja excluir a cotação/);
  assert.match(dialogSource, /O índice/);
  assert.match(dialogSource, /permanecerá selecionado/);
  assert.match(dialogSource, /Excluir/);
  assert.match(dialogSource, /Cancelar/);
  assert.match(dialogSource, /formatIndiceFinanceiroCotacaoData/);
  assert.match(dialogSource, /formatIndiceFinanceiroCotacaoValor/);
  assert.match(modalCssSource, /\.indices-financeiros-modal-actions \.indices-financeiros-modal-primary/);
  assert.match(modalCssSource, /\.indices-financeiros-modal-actions \.indices-financeiros-modal-secondary/);
  assert.doesNotMatch(dialogSource, /auxiliary-shell-button/);
  assert.doesNotMatch(dialogSource, /cotacao_id|numero/);
});

test('tabela de cotacoes continua selecionando por cotacaoId', () => {
  assert.match(tableSource, /rowKey="cotacaoId"/);
  assert.match(tableSource, /selectedRowKeys/);
  assert.match(tableSource, /record\?\.cotacaoId/);
});
