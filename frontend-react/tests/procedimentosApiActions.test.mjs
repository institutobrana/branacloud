import test from 'node:test';
import assert from 'node:assert/strict';
import * as api from '../src/features/procedimentos/procedimentosApi.js';

async function mockedApi(run, data = { detail: 'Ok' }, response = {}) {
  const previous = { window: globalThis.window, fetch: globalThis.fetch };
  const calls = [];
  globalThis.window = { localStorage: { getItem: () => 'synthetic-token' } };
  globalThis.fetch = async (url, options) => {
    calls.push({ url, ...options, payload: options.body ? JSON.parse(options.body) : null });
    return { ok: true, status: 200, json: async () => data, ...response };
  };
  try { await run(calls); }
  finally { Object.assign(globalThis, previous); }
}

test('DELETE procedimento envia PK, autenticação e nenhum corpo', async () => mockedApi(async (calls) => {
  await api.excluirProcedimento(701);
  assert.equal(calls[0].url, '/api/procedimentos/701');
  assert.equal(calls[0].method, 'DELETE');
  assert.equal(calls[0].headers.Authorization, 'Bearer synthetic-token');
  assert.equal(calls[0].body, undefined);
}));

test('POST/PATCH tabela usam contrato público, não PK local', async () => mockedApi(async (calls) => {
  const payload = { nome: 'Teste', nro_indice: 255, fonte_pagadora: 'convenio', nro_credenciamento: 'ABC', tipo_tiss_id: 9, inativo: false, copiar_de_tabela_id: '4' };
  const created = await api.criarTabelaProcedimentos(payload);
  const updated = await api.atualizarTabelaProcedimentos(4, payload);
  assert.equal(created.codigo, 4);
  assert.equal(updated.id, 4);
  assert.equal(updated.nro_credenciamento, 'ABC');
  assert.equal(calls[0].url, '/api/procedimentos/tabelas');
  assert.equal(calls[0].method, 'POST');
  assert.deepEqual(calls[0].payload, payload);
  assert.equal(calls[1].url, '/api/procedimentos/tabelas/4');
  assert.equal(calls[1].method, 'PATCH');
}, { id: '4', nome: 'Teste', indice: 255, fonte_pagadora: 'convenio', nro_credenciamento: 'ABC', tipo_tiss_id: 9, inativo: false }));

test('DELETE tabela usa código público e preserva mensagem do backend', async () => mockedApi(async (calls) => {
  const result = await api.excluirTabelaProcedimentos(4);
  assert.equal(calls[0].url, '/api/procedimentos/tabelas/4');
  assert.equal(calls[0].method, 'DELETE');
  assert.equal(result.detail, 'Tabela excluida com sucesso.');
}, { detail: 'Tabela excluida com sucesso.' }));

test('preview é GET parametrizado e aplicar POST contém confirmação explícita', async () => mockedApi(async (calls) => {
  const form = { tabela_id: '4', percentual: '1,00', modo: 'aumentar' };
  await api.previewReajusteTabela(form);
  await api.aplicarReajusteTabela({ ...form, confirmar: true });
  const url = new URL(calls[0].url, 'http://synthetic.invalid');
  assert.equal(url.pathname, '/api/procedimentos/tabelas/reajuste-preview');
  assert.equal(url.searchParams.get('tabela_id'), '4');
  assert.equal(url.searchParams.get('percentual'), '1,00');
  assert.equal(url.searchParams.get('limit'), '20');
  assert.equal(calls[0].method, undefined);
  assert.equal(calls[1].url, '/api/procedimentos/tabelas/reajuste-aplicar');
  assert.equal(calls[1].method, 'POST');
  assert.deepEqual(calls[1].payload, { ...form, confirmar: true });
}));

test('filtros preservam metadados completos da tabela, índices canônicos e TISS', async () => mockedApi(async () => {
  const result = await api.listarProcedimentosFiltros();
  assert.equal(result.tabelas[0].codigo, 4);
  assert.equal(result.tabelas[0].nro_indice, 255);
  assert.equal(result.tabelas[0].fonte_pagadora, 'convenio');
  assert.equal(result.tabelas[0].nro_credenciamento, 'ABC');
  assert.equal(result.tabelas[0].tipo_tiss_id, 9);
  assert.equal(result.tabelas[0].inativo, true);
  assert.equal(result.indices[0].id, 255);
  assert.equal(result.tiposTiss[0].id, 9);
}, { tabelas: [{ id: '4', nome: 'Completa', indice: 255, fonte_pagadora: 'convenio', nro_credenciamento: 'ABC', tipo_tiss_id: 9, inativo: true }], indices: [{ id: 999, numero: 255, sigla: 'R$' }], tipos_tiss: [{ id: '9', codigo: '01' }] }));

test('todas as ações sem sessão falham antes de qualquer request', async () => mockedApi(async (calls) => {
  globalThis.window.localStorage.getItem = () => '';
  for (const action of [() => api.excluirProcedimento(701), () => api.criarTabelaProcedimentos({}), () => api.atualizarTabelaProcedimentos(4, {}), () => api.excluirTabelaProcedimentos(4), () => api.previewReajusteTabela({ tabela_id: '4', modo: 'aumentar', percentual: '1' }), () => api.aplicarReajusteTabela({})]) {
    await assert.rejects(action(), (error) => error.status === 401 && error.message === 'Sessao expirada.');
  }
  assert.equal(calls.length, 0);
}));

test('erro funcional e status backend são preservados', async () => mockedApi(async () => {
  await assert.rejects(api.excluirTabelaProcedimentos(4), (error) => error.message === 'Nao e possivel excluir a unica tabela existente.' && error.status === 400);
}, { detail: 'Nao e possivel excluir a unica tabela existente.' }, { ok: false, status: 400 }));
