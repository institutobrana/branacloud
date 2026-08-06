import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import {
  normalizeIndiceFinanceiroQuotationFormValues,
  parseIndiceFinanceiroQuotationValue,
  validateIndiceFinanceiroQuotationFormValues,
} from '../src/features/indicesFinanceiros/indicesFinanceirosQuotationValidators.js';

const apiSource = fs.readFileSync(path.resolve('frontend-react/src/features/indicesFinanceiros/indicesFinanceirosApi.js'), 'utf8');
const pageSource = fs.readFileSync(path.resolve('frontend-react/src/features/indicesFinanceiros/IndicesFinanceirosPage.jsx'), 'utf8');
const toolbarSource = fs.readFileSync(path.resolve('frontend-react/src/features/indicesFinanceiros/components/IndicesFinanceirosToolbar.jsx'), 'utf8');
const dialogSource = fs.readFileSync(path.resolve('frontend-react/src/features/indicesFinanceiros/components/IndiceFinanceiroQuotationFormDialog.jsx'), 'utf8');
const modalCssSource = fs.readFileSync(path.resolve('frontend-react/src/features/indicesFinanceiros/indicesFinanceiros.css'), 'utf8');

test('validadores de cotacao normalizam e bloqueiam formatos invalidos', () => {
  assert.deepEqual(normalizeIndiceFinanceiroQuotationFormValues({ data: ' 2026-08-05 ', valor: ' 1,2500 ' }), { data: '2026-08-05', valorRaw: '1,2500' });
  assert.equal(parseIndiceFinanceiroQuotationValue('1,2500'), 1.25);
  assert.equal(parseIndiceFinanceiroQuotationValue('1.2500'), 1.25);
  assert.equal(parseIndiceFinanceiroQuotationValue('0'), 0);
  assert.equal(parseIndiceFinanceiroQuotationValue('abc'), null);
  assert.equal(validateIndiceFinanceiroQuotationFormValues({ data: '', valor: '1,25' }), 'Informe a data.');
  assert.equal(validateIndiceFinanceiroQuotationFormValues({ data: '2026-08-05', valor: '' }), 'Informe uma cotação válida.');
  assert.equal(validateIndiceFinanceiroQuotationFormValues({ data: '2026-08-05', valor: '0' }), 'Informe um valor válido.');
});

test('API de cotacao usa POST correto sem clinica_id nem numero no body', () => {
  const createSection = (apiSource.split('export async function createIndiceFinanceiroCotacao')[1] || '').split('export async function updateIndiceFinanceiroCotacao')[0];
  assert.match(apiSource, /export async function createIndiceFinanceiroCotacao/);
  assert.match(createSection, /\/indices-financeiros\/\$\{encodeURIComponent\(String\(resolvedNumero\)\)\}\/cotacoes/);
  assert.match(createSection, /method: 'POST'/);
  assert.match(createSection, /data: payload\?\.data/);
  assert.match(createSection, /valor: payload\?\.valor/);
  assert.doesNotMatch(createSection, /clinica_id/);
  assert.doesNotMatch(createSection, /numero_destino/);
});

test('toolbar liga Novo valor sem criar segunda toolbar', () => {
  assert.match(toolbarSource, /onNewQuotation/);
  assert.match(toolbarSource, /canCreateQuotation/);
  assert.match(toolbarSource, /Novo valor/);
  assert.match(toolbarSource, /indices-financeiros-toolbar-divider/);
  assert.equal((toolbarSource.match(/<button type="button"/g) || []).length, 6);
});

test('pagina conecta Novo valor ao novo modal sem regredir fluxos anteriores', () => {
  assert.match(pageSource, /new-quotation/);
  assert.match(pageSource, /IndiceFinanceiroQuotationFormDialog/);
  assert.match(pageSource, /quotationDialogState/);
  assert.match(pageSource, /quotingIndex/);
  assert.match(pageSource, /createIndiceFinanceiroCotacao/);
  assert.match(pageSource, /reloadCotacoes/);
  assert.match(pageSource, /reload\(\)/);
  assert.match(pageSource, /parseIndiceFinanceiroQuotationValue/);
  assert.doesNotMatch(pageSource, /PATCH\s*\/indices-financeiros\/\$\{encodeURIComponent\(String\(resolvedNumero\)\)\}\/cotacoes/);
});

test('dialogo de nova cotacao usa data e valor com rodape correto', () => {
  assert.match(dialogSource, /Nova cotação/);
  assert.match(dialogSource, /label="Data"/);
  assert.match(dialogSource, /label="Valor"/);
  assert.match(dialogSource, /indices-financeiros-modal-actions/);
  assert.match(dialogSource, /indices-financeiros-modal-primary/);
  assert.match(dialogSource, /indices-financeiros-modal-secondary/);
  assert.match(modalCssSource, /\.indices-financeiros-modal-actions \.indices-financeiros-modal-primary/);
  assert.match(modalCssSource, /\.indices-financeiros-modal-actions \.indices-financeiros-modal-secondary/);
  assert.match(dialogSource, /inputMode="decimal"/);
});
