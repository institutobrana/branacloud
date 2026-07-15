import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getPlanoContasCategoriesForGroup,
  getPlanoContasSelectedGroup,
  normalizePlanoContasResponse,
} from '../src/features/planoContas/planoContasMappers.js';
import {
  createPlanoContasSelectionState,
  selectPlanoContasCategory,
  selectPlanoContasGroup,
  PLANO_CONTAS_CONTEXT,
} from '../src/features/planoContas/hooks/usePlanoContasSelection.js';

const sampleResponse = [
  {
    id: 11,
    nome: 'Ativo',
    tipo: 'Sintético',
    categorias: [
      { id: 'a1', nome: 'Caixa', tipo: 'Analítica', tributavel: true, grupo_id: 11 },
      { id: 'a2', nome: 'Bancos', tipo: 'Analítica', tributavel: false, grupo_id: 11 },
    ],
  },
  {
    id: 12,
    nome: 'Passivo',
    tipo: 'Sintético',
    categorias: [],
  },
];

test('normalizePlanoContasResponse preserva ids originais e normaliza categorias', () => {
  const result = normalizePlanoContasResponse(sampleResponse);
  assert.equal(result[0].id, 11);
  assert.equal(result[0].categorias[0].id, 'a1');
  assert.equal(result[0].categorias[0].grupoId, 11);
  assert.equal(result[0].categorias[0].tributavel, true);
});

test('getPlanoContasSelectedGroup encontra o grupo atual e retorna lista vazia quando inexistente', () => {
  assert.equal(getPlanoContasSelectedGroup(sampleResponse, 11).nome, 'Ativo');
  assert.equal(getPlanoContasSelectedGroup(sampleResponse, 999), null);
});

test('getPlanoContasCategoriesForGroup extrai categorias do grupo selecionado', () => {
  assert.equal(getPlanoContasCategoriesForGroup(sampleResponse, 11).length, 2);
  assert.deepEqual(getPlanoContasCategoriesForGroup(sampleResponse, 999), []);
});

test('createPlanoContasSelectionState seleciona o primeiro grupo quando nao ha selecao anterior', () => {
  const state = createPlanoContasSelectionState(sampleResponse, {});
  assert.equal(state.selectedGroupId, 11);
  assert.equal(state.selectedCategoryId, null);
  assert.equal(state.context, PLANO_CONTAS_CONTEXT.GROUP);
});

test('selectPlanoContasGroup limpa a categoria ao trocar de grupo', () => {
  const state = selectPlanoContasGroup(sampleResponse, 12);
  assert.equal(state.selectedGroupId, 12);
  assert.equal(state.selectedCategoryId, null);
  assert.deepEqual(state.categories, []);
});

test('selectPlanoContasCategory define contexto ativo como categoria', () => {
  const state = selectPlanoContasCategory(sampleResponse, 11, 'a2');
  assert.equal(state.selectedGroupId, 11);
  assert.equal(state.selectedCategoryId, 'a2');
  assert.equal(state.context, PLANO_CONTAS_CONTEXT.CATEGORY);
});

test('selection helpers tratam resposta inesperada sem quebrar a pagina', () => {
  const state = createPlanoContasSelectionState(null, { selectedGroupId: 1, selectedCategoryId: 2 });
  assert.deepEqual(state.groups, []);
  assert.equal(state.selectedGroupId, null);
  assert.equal(state.selectedCategoryId, null);
  assert.equal(state.context, PLANO_CONTAS_CONTEXT.NONE);
});

test('estado inicial vazio permanece vazio', () => {
  const state = createPlanoContasSelectionState([], {});
  assert.deepEqual(state.groups, []);
  assert.equal(state.selectedGroupId, null);
  assert.equal(state.selectedCategoryId, null);
  assert.equal(state.context, PLANO_CONTAS_CONTEXT.NONE);
});

test('categoria nunca escapa do grupo atual', () => {
  const state = selectPlanoContasCategory(sampleResponse, 12, 'a1');
  assert.equal(state.selectedGroupId, 12);
  assert.equal(state.selectedCategoryId, null);
  assert.equal(state.context, PLANO_CONTAS_CONTEXT.GROUP);
});

test('normalizePlanoContasResponse trata entrada inesperada como lista vazia', () => {
  assert.deepEqual(normalizePlanoContasResponse(undefined), []);
  assert.deepEqual(normalizePlanoContasResponse({}), []);
});
