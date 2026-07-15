import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildPlanoContasCategoryMigrationPayload,
  classifyPlanoContasCategoryError,
  normalizePlanoContasCategoryDeletionResult,
  normalizePlanoContasCategoryDestinationList,
  selectFirstPlanoContasCategoryDestination,
  toPlanoContasPositiveInteger,
} from '../src/features/planoContas/planoContasCategoryDeletion.js';

const sampleDestinations = [
  { id: 261, nome: 'ABO', tipo: 'Saída', grupo_id: 48 },
  { id: 262, nome: 'APCD', tipo: 'Saída', grupo_id: 48 },
  { id: 333, nome: 'CPFL - PESSOAL', tipo: 'Saída', grupo_id: 48 },
  { id: 344, nome: 'DB Outros (Profissionais)', tipo: 'Entrada', grupo_id: 50 },
  { id: null, nome: 'Sem ID', tipo: 'Saída', grupo_id: 48 },
  { id: 329, nome: 'Certificado digital - PESSOAL', tipo: 'Saída', grupo_id: 48 },
];

test('toPlanoContasPositiveInteger valida ids', () => {
  assert.equal(toPlanoContasPositiveInteger('12'), 12);
  assert.equal(toPlanoContasPositiveInteger(0), null);
  assert.equal(toPlanoContasPositiveInteger(-1), null);
  assert.equal(toPlanoContasPositiveInteger('x'), null);
});

test('normalizePlanoContasCategoryDestinationList remove origem e ids invalidos', () => {
  const list = normalizePlanoContasCategoryDestinationList(sampleDestinations, 329);
  assert.equal(list.some((item) => item.id === 329), false);
  assert.equal(list.some((item) => item.id == null), false);
  assert.equal(list.some((item) => item.id === 344), true);
  assert.equal(list.some((item) => item.id === 261), true);
});

test('selectFirstPlanoContasCategoryDestination preserva a ordem recebida', () => {
  const list = normalizePlanoContasCategoryDestinationList(sampleDestinations, 329);
  const first = selectFirstPlanoContasCategoryDestination(list, 329);
  assert.equal(first.id, 261);
  assert.equal(first.nome, 'ABO');
});

test('buildPlanoContasCategoryMigrationPayload envia somente categoria_destino_id', () => {
  assert.deepEqual(buildPlanoContasCategoryMigrationPayload('261'), { categoria_destino_id: 261 });
});

test('buildPlanoContasCategoryMigrationPayload rejeita destino invalido', () => {
  assert.throws(() => buildPlanoContasCategoryMigrationPayload(0), /categoria destino válida/);
});

test('normalizePlanoContasCategoryDeletionResult aceita resposta valida e rejeita invalida', () => {
  assert.deepEqual(normalizePlanoContasCategoryDeletionResult({ detail: 'ok' }), {
    ok: true,
    data: { detail: 'ok' },
    error: '',
  });
  assert.equal(normalizePlanoContasCategoryDeletionResult(null).ok, false);
});

test('classifyPlanoContasCategoryError reconhece categoria em uso', () => {
  const error = classifyPlanoContasCategoryError({
    status: 409,
    data: { detail: 'Categoria em uso por lançamentos.' },
    message: 'Categoria em uso por lançamentos.',
  });
  assert.equal(error.kind, 'category-in-use');
  assert.equal(error.status, 409);
});

test('classifyPlanoContasCategoryError nao confunde erro comum com categoria em uso', () => {
  const error = classifyPlanoContasCategoryError({
    status: 500,
    data: { detail: 'Falha inesperada.' },
    message: 'Falha inesperada.',
  });
  assert.equal(error.kind, 'request-error');
});
