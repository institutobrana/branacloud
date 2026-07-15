import test from 'node:test';
import assert from 'node:assert/strict';

import { atualizarPlanoContasGrupo, criarPlanoContasGrupo, listarPlanoContasGrupos } from '../src/features/planoContas/planoContasApi.js';

test('criarPlanoContasGrupo envia POST com payload enxuto', async () => {
  const originalFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return {
      ok: true,
      json: async () => ({ id: 91, nome: 'Ativo', tipo: 'Pessoal', categorias: [] }),
    };
  };

  try {
    const result = await criarPlanoContasGrupo({ nome: 'Ativo', tipo: 'Pessoal', extra: 'ignorado' });
    assert.equal(result.id, 91);
    assert.equal(calls[0].url, '/api/cadastros/grupos');
    assert.equal(calls[0].options.method, 'POST');
    assert.equal(calls[0].options.headers.get('Content-Type'), 'application/json');
    assert.deepEqual(JSON.parse(calls[0].options.body), { nome: 'Ativo', tipo: 'Pessoal' });
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('atualizarPlanoContasGrupo envia PUT com id explicito', async () => {
  const originalFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return {
      ok: true,
      json: async () => ({ detail: 'Grupo atualizado.' }),
    };
  };

  try {
    const result = await atualizarPlanoContasGrupo(33, { nome: 'Passivo', tipo: 'Profissional' });
    assert.equal(result.detail, 'Grupo atualizado.');
    assert.equal(calls[0].url, '/api/cadastros/grupos/33');
    assert.equal(calls[0].options.method, 'PUT');
    assert.deepEqual(JSON.parse(calls[0].options.body), { nome: 'Passivo', tipo: 'Profissional' });
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('listarPlanoContasGrupos normaliza lista vazia quando resposta inesperada', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => ({
    ok: true,
    json: async () => null,
  });

  try {
    const result = await listarPlanoContasGrupos();
    assert.deepEqual(result, []);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
