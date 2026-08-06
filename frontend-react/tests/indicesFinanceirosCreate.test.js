import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import { normalizeIndiceFinanceiroFormValues, validateIndiceFinanceiroFormValues } from '../src/features/indicesFinanceiros/indicesFinanceirosValidators.js';
import {
  canCreateQuotationIndiceFinanceiro,
  canDeleteIndiceFinanceiro,
  canEditIndiceFinanceiro,
  canMigrateAndDeleteIndiceFinanceiro,
  isIndiceFinanceiroReservado,
  isIndiceFinanceiroReservadoNumero,
} from '../src/features/indicesFinanceiros/indicesFinanceirosReserved.js';

const apiSource = fs.readFileSync(path.resolve('frontend-react/src/features/indicesFinanceiros/indicesFinanceirosApi.js'), 'utf8');
const pageSource = fs.readFileSync(path.resolve('frontend-react/src/features/indicesFinanceiros/IndicesFinanceirosPage.jsx'), 'utf8');
const modalSource = fs.readFileSync(path.resolve('frontend-react/src/features/indicesFinanceiros/components/IndiceFinanceiroFormDialog.jsx'), 'utf8');
const modalCssSource = fs.readFileSync(path.resolve('frontend-react/src/features/indicesFinanceiros/indicesFinanceiros.css'), 'utf8');

test('validadores limpam trim e forcam sigla em maiusculas', () => {
  assert.deepEqual(normalizeIndiceFinanceiroFormValues({ nome: '  Reais  ', sigla: ' r$ ' }), { nome: 'Reais', sigla: 'R$' });
  assert.equal(validateIndiceFinanceiroFormValues({ nome: '', sigla: 'R$' }), 'Informe o nome do índice.');
  assert.equal(validateIndiceFinanceiroFormValues({ nome: 'Reais', sigla: '' }), 'Informe a sigla do índice.');
});

test('reservados sao identificados por numero', () => {
  assert.equal(isIndiceFinanceiroReservadoNumero(1), true);
  assert.equal(isIndiceFinanceiroReservadoNumero(2), true);
  assert.equal(isIndiceFinanceiroReservadoNumero(3), true);
  assert.equal(isIndiceFinanceiroReservadoNumero(255), true);
  assert.equal(isIndiceFinanceiroReservadoNumero(10), false);
  assert.equal(isIndiceFinanceiroReservado({ numero: 255 }), true);
  assert.equal(isIndiceFinanceiroReservado({ numero: 10 }), false);
  assert.equal(canEditIndiceFinanceiro({ numero: 255 }), true);
  assert.equal(canEditIndiceFinanceiro({ numero: 10 }), true);
  assert.equal(canDeleteIndiceFinanceiro({ numero: 255 }), false);
  assert.equal(canDeleteIndiceFinanceiro({ numero: 10 }), true);
  assert.equal(canMigrateAndDeleteIndiceFinanceiro({ numero: 255 }), false);
  assert.equal(canMigrateAndDeleteIndiceFinanceiro({ numero: 10 }), true);
  assert.equal(canCreateQuotationIndiceFinanceiro({ numero: 255 }), true);
  assert.equal(canCreateQuotationIndiceFinanceiro({ numero: 10 }), true);
});

test('API expõe POST e PATCH sem clinica_id nem CRUD adicional', () => {
  assert.match(apiSource, /export async function criarIndiceFinanceiro/);
  assert.match(apiSource, /export async function updateIndiceFinanceiro/);
  assert.match(apiSource, /method: 'POST'/);
  assert.match(apiSource, /method: 'PATCH'/);
  assert.match(apiSource, /\/indices-financeiros\/\$\{encodeURIComponent\(String\(resolvedNumero\)\)\}/);
  assert.match(apiSource, /body: JSON\.stringify\(\{/);
  assert.match(apiSource, /nome: payload\?\.nome/);
  assert.match(apiSource, /sigla: payload\?\.sigla/);
  assert.doesNotMatch(apiSource, /clinica_id/);
  assert.doesNotMatch(apiSource, /valorAtual/);
});

test('Dialogo suporta create e edit com rodape alinhado', () => {
  assert.match(modalSource, /title=\{isEditMode \? 'Altera índice financeiro' : 'Novo índice financeiro'\}/);
  assert.match(modalSource, /indices-financeiros-modal-actions/);
  assert.match(modalSource, /indices-financeiros-modal-primary/);
  assert.match(modalSource, /indices-financeiros-modal-secondary/);
  assert.match(modalCssSource, /\.indices-financeiros-modal-actions\s*\{/);
  assert.match(modalCssSource, /justify-content:\s*flex-end/);
  assert.match(modalCssSource, /\.indices-financeiros-modal-actions \.indices-financeiros-modal-primary/);
  assert.match(modalCssSource, /\.indices-financeiros-modal-actions \.indices-financeiros-modal-secondary/);
  assert.match(modalCssSource, /:root\[data-brana-theme='dark'\] \.indices-financeiros-modal-actions \.indices-financeiros-modal-primary/);
  assert.doesNotMatch(modalCssSource, /auxiliary-shell-button/);
  assert.doesNotMatch(modalSource, /transform:\s*scale/);
  assert.doesNotMatch(modalSource, /margin-\w+:\s*-\d/);
});

test('Pagina integra fluxo de create e edit sem toolbar local', () => {
  assert.match(pageSource, /brana-indices-financeiros-toolbar-state/);
  assert.match(pageSource, /brana-indices-financeiros-toolbar-action/);
  assert.match(pageSource, /new-index/);
  assert.match(pageSource, /edit-index/);
  assert.match(pageSource, /updateIndiceFinanceiro/);
  assert.match(pageSource, /criarIndiceFinanceiro/);
  assert.match(pageSource, /canEditIndiceFinanceiro/);
  assert.match(pageSource, /canDeleteIndiceFinanceiro/);
  assert.match(pageSource, /canMigrateAndDeleteIndiceFinanceiro/);
  assert.match(pageSource, /selectedIndiceRef/);
  assert.match(pageSource, /mode: 'edit'/);
  assert.match(pageSource, /mode: 'create'/);
  assert.match(pageSource, /setModalState\(EMPTY_MODAL\)/);
  assert.match(pageSource, /message\.success/);
  assert.doesNotMatch(pageSource, /IndicesFinanceirosToolbar\)\s*;/);
});
